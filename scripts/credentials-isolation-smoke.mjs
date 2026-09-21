import { randomUUID } from 'node:crypto';

const baseUrl = (process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5000').replace(/\/+$/, '');
const moduleId = 'payments';
const runId = randomUUID().replace(/-/g, '');
const userA = `credential-isolation-a-${runId}`;
const userB = `credential-isolation-b-${runId}`;

function fail(message) {
  throw new Error(`[credentials-isolation-smoke] ${message}`);
}

function headers(userId) {
  return {
    'Content-Type': 'application/json',
    'x-clientum-user-id': userId,
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

function assertStatus(response, expected, description) {
  if (response.status !== expected) {
    fail(`${description}: expected HTTP ${expected}, received ${response.status}`);
  }
}

function configuredFields(body) {
  return new Set((Array.isArray(body?.fields) ? body.fields : []).map((field) => field.fieldId));
}

async function run() {
  if (process.env.NODE_ENV === 'production') {
    fail('This local smoke test requires the development identity header and must not run against production.');
  }

  const firstAccessToken = `test-mercadopago-${runId}-access-first`;
  const firstWebhookSecret = `test-mercadopago-${runId}-webhook-first`;
  const updatedAccessToken = `test-mercadopago-${runId}-access-updated`;

  try {
    const initialWrite = await request('/api/user-credentials', {
      method: 'PUT',
      headers: headers(userA),
      body: JSON.stringify({
        moduleId,
        values: {
          MERCADOPAGO_ACCESS_TOKEN: firstAccessToken,
          MERCADOPAGO_UNKNOWN_FIELD: firstWebhookSecret,
        },
      }),
    });
    assertStatus(initialWrite.response, 400, 'unknown credential fields are rejected');

    const validInitialWrite = await request('/api/user-credentials', {
      method: 'PUT',
      headers: headers(userA),
      body: JSON.stringify({
        moduleId,
        values: {
          MERCADOPAGO_ACCESS_TOKEN: firstAccessToken,
          MERCADOPAGO_WEBHOOK_SECRET: firstWebhookSecret,
        },
      }),
    });
    assertStatus(validInitialWrite.response, 200, 'user A can save multiple allowed credentials');

    const partialWrite = await request('/api/user-credentials', {
      method: 'PUT',
      headers: headers(userA),
      body: JSON.stringify({
        moduleId,
        values: { MERCADOPAGO_ACCESS_TOKEN: updatedAccessToken },
      }),
    });
    assertStatus(partialWrite.response, 200, 'user A can update one allowed credential');

    const userARead = await request(`/api/user-credentials?moduleId=${moduleId}`, {
      headers: headers(userA),
    });
    assertStatus(userARead.response, 200, 'user A can read their workspace metadata');
    const userAFields = configuredFields(userARead.body);
    if (
      !userAFields.has('MERCADOPAGO_ACCESS_TOKEN')
      || !userAFields.has('MERCADOPAGO_WEBHOOK_SECRET')
      || userAFields.size !== 2
    ) {
      fail('the partial credential update did not preserve the other configured field');
    }

    const userBRead = await request(`/api/user-credentials?moduleId=${moduleId}`, {
      headers: headers(userB),
    });
    assertStatus(userBRead.response, 200, 'user B can read their own workspace metadata');
    if (configuredFields(userBRead.body).size !== 0) {
      fail('user B could read credential metadata belonging to user A');
    }

    const invalidModuleWrite = await request('/api/user-credentials', {
      method: 'PUT',
      headers: headers(userA),
      body: JSON.stringify({
        moduleId: 'not-a-configurable-module',
        values: { MERCADOPAGO_ACCESS_TOKEN: updatedAccessToken },
      }),
    });
    assertStatus(invalidModuleWrite.response, 400, 'unknown modules are rejected');

    const invalidFieldWrite = await request('/api/user-credentials', {
      method: 'PUT',
      headers: headers(userA),
      body: JSON.stringify({
        moduleId,
        values: { MERCADOPAGO_ENVIRONMENT: 'production' },
      }),
    });
    assertStatus(invalidFieldWrite.response, 400, 'platform fields cannot be stored as workspace credentials');

    const afterInvalidWrite = await request(`/api/user-credentials?moduleId=${moduleId}`, {
      headers: headers(userA),
    });
    assertStatus(afterInvalidWrite.response, 200, 'user A metadata remains readable after rejected writes');
    if (configuredFields(afterInvalidWrite.body).size !== 2) {
      fail('a rejected credential write changed persisted workspace metadata');
    }

    const userBDelete = await request(`/api/user-credentials?moduleId=${moduleId}`, {
      method: 'DELETE',
      headers: headers(userB),
    });
    assertStatus(userBDelete.response, 200, 'user B can delete only their own empty workspace record');

    const afterOtherUserDelete = await request(`/api/user-credentials?moduleId=${moduleId}`, {
      headers: headers(userA),
    });
    assertStatus(afterOtherUserDelete.response, 200, 'user A remains readable after user B deletion');
    if (configuredFields(afterOtherUserDelete.body).size !== 2) {
      fail('user B deletion affected user A credentials');
    }

    console.log('✓ unknown fields and modules are rejected without persistence');
    console.log('✓ partial updates preserve the authenticated workspace credential');
    console.log('✓ workspace credential metadata is isolated between users');
  } finally {
    await request(`/api/user-credentials?moduleId=${moduleId}`, {
      method: 'DELETE',
      headers: headers(userA),
    }).catch(() => {});
    await request(`/api/user-credentials?moduleId=${moduleId}`, {
      method: 'DELETE',
      headers: headers(userB),
    }).catch(() => {});
  }
}

try {
  await run();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}