const baseUrl = (process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5000').replace(/\/+$/, '');
const mode = process.env.SMOKE_AUTH_MODE || 'development';

function fail(message) {
  throw new Error(`[auth-boundary-smoke] ${message}`);
}

async function request(headers = {}) {
  const response = await fetch(`${baseUrl}/api/account/bootstrap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({}),
  });
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

async function runDevelopmentChecks() {
  const anonymous = await request();
  if (anonymous.response.status !== 401) {
    fail(`anonymous development request returned HTTP ${anonymous.response.status}, expected 401`);
  }

  const invalidToken = await request({ Authorization: 'Bearer definitely-not-a-firebase-id-token' });
  if (invalidToken.response.status !== 401) {
    fail(`invalid Firebase token returned HTTP ${invalidToken.response.status}, expected 401`);
  }

  const demo = await request({ 'x-clientum-user-id': 'auth-boundary-demo-user' });
  if (demo.response.status === 401) {
    fail('the explicit development demo header was rejected as an authenticated session');
  }

  console.log('✓ development anonymous and invalid-token requests are rejected');
  console.log('✓ explicit local demo identity remains development-only');
}

async function runProductionChecks() {
  const anonymous = await request();
  if (![401, 503].includes(anonymous.response.status)) {
    fail(`anonymous production request returned unexpected HTTP ${anonymous.response.status}`);
  }
  if (anonymous.response.status === 503 && anonymous.body.code !== 'AUTH_PROVIDER_NOT_CONFIGURED') {
    fail(`production auth configuration failure used unexpected code ${anonymous.body.code || 'missing'}`);
  }

  const forgedHeader = await request({ 'x-clientum-user-id': 'forged-production-user' });
  if (![401, 503].includes(forgedHeader.response.status)) {
    fail(`production user header returned unexpected HTTP ${forgedHeader.response.status}`);
  }
  if (forgedHeader.response.status === 503 && forgedHeader.body.code !== 'AUTH_PROVIDER_NOT_CONFIGURED') {
    fail(`production forged-header failure used unexpected code ${forgedHeader.body.code || 'missing'}`);
  }

  console.log('✓ production requests fail closed without a verified Firebase session');
  if (anonymous.response.status === 503) {
    console.log('✓ production reports AUTH_PROVIDER_NOT_CONFIGURED without Firebase Admin credentials');
  }
}

try {
  if (!['development', 'production'].includes(mode)) {
    fail(`SMOKE_AUTH_MODE must be development or production, received ${mode}`);
  }
  if (mode === 'production') await runProductionChecks();
  else await runDevelopmentChecks();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}