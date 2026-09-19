import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import WebSocket from 'ws';

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000/';
const chromiumPath = process.env.CHROMIUM_PATH || '/repl/tools/bin/chromium';
const debugPort = Number(process.env.SMOKE_DEBUG_PORT || 9223);
const userDataDir = `/tmp/clientum-navigation-smoke-${process.pid}`;

const browser = spawn(
  chromiumPath,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let socket;
let nextCommandId = 0;
const pendingCommands = new Map();

function fail(message) {
  throw new Error(`[navigation-smoke] ${message}`);
}

async function waitForDebugTarget() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?${Date.now()}`, {
        method: 'PUT',
      });
      if (response.ok) {
        return response.json();
      }
    } catch {
      // Chromium is still starting.
    }
    await delay(100);
  }
  fail(`Chromium did not expose a debugging target on port ${debugPort}`);
}

function sendCommand(method, params = {}) {
  const id = ++nextCommandId;
  return new Promise((resolve, reject) => {
    pendingCommands.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function connectToTarget(target) {
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const command = pendingCommands.get(message.id);
    if (!command) return;
    pendingCommands.delete(message.id);
    if (message.error) command.reject(new Error(message.error.message));
    else command.resolve(message.result);
  });

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');
}

async function evaluate(expression) {
  const result = await sendCommand('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    fail(result.exceptionDetails.text || 'Browser evaluation failed');
  }
  return result.result?.value;
}

async function waitFor(description, predicate, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await evaluate(`(${predicate.toString()})()`)) return;
    await delay(100);
  }
  const visibleText = await evaluate('document.body?.innerText?.slice(0, 5000) || ""');
  fail(`Timed out waiting for ${description}. Visible text: ${visibleText}`);
}

async function navigate(url) {
  await sendCommand('Page.navigate', { url });
  await waitFor('the app shell', () => document.readyState === 'complete' && !!document.body);
}

async function clickButton(label) {
  const clicked = await evaluate(`(() => {
    const buttons = [...document.querySelectorAll('button')];
    const button = buttons.find((candidate) => candidate.innerText.trim().includes(${JSON.stringify(label)}));
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) fail(`Could not find button "${label}"`);
}

async function clickAriaLabel(label) {
  const clicked = await evaluate(`(() => {
    const button = document.querySelector(${JSON.stringify(`button[aria-label="${label}"]`)});
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) fail(`Could not find aria-labeled button "${label}"`);
}

async function clickElementById(id, description) {
  const clicked = await evaluate(`(() => {
    const element = document.getElementById(${JSON.stringify(id)});
    if (!element) return false;
    element.click();
    return true;
  })()`);
  if (!clicked) fail(`Could not find ${description} (${id})`);
}

async function waitForElementById(id, description) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (await evaluate(`!!document.getElementById(${JSON.stringify(id)})`)) return;
    await delay(100);
  }
  fail(`Timed out waiting for ${description} (${id})`);
}

async function clickNavigationItem(id, { parentId, sectionId } = {}) {
  const itemId = `nav-item-${id}`;
  const isVisible = await evaluate(`!!document.getElementById(${JSON.stringify(itemId)})`);
  if (!isVisible && sectionId) {
    await clickElementById(`nav-section-${sectionId}`, 'the navigation section control');
  }
  if (!isVisible && parentId) {
    await clickElementById(`nav-expand-${parentId}`, 'the navigation submenu expansion control');
  }
  await waitForElementById(itemId, `the "${id}" navigation item`);
  const clicked = await evaluate(`(() => {
    const item = document.getElementById(${JSON.stringify(itemId)});
    if (!item) return false;
    item.click();
    return true;
  })()`);
  if (!clicked) fail(`Could not find navigation item "${id}"`);
}

async function assertAriaLabelMissing(label) {
  const exists = await evaluate(
    `!!document.querySelector(${JSON.stringify(`button[aria-label="${label}"]`)})`,
  );
  if (exists) {
    fail(`Could not hide aria-labeled button "${label}"`);
  }
}

async function assertConfigButton(shouldExist, description) {
  const exists = await evaluate(
    '!![...document.querySelectorAll("button")].find((button) => button.innerText.trim().includes("Configurar API"))',
  );
  if (exists !== shouldExist) {
    fail(`${description}: button ${shouldExist ? 'was not found' : 'should not be visible'}`);
  }
}

async function assertPublicSite(description) {
  await waitFor(description, () => {
    const text = document.body?.innerText || '';
    return text.includes('Pedir Demo') && !text.includes('Resumen Ejecutivo');
  });
}

async function assertCanonicalPublicUrl(description) {
  await waitFor(description, () => {
    const text = document.body?.innerText || '';
    return window.location.pathname === '/' && text.includes('Pedir Demo') && !text.includes('Resumen Ejecutivo');
  });
}

async function assertPrivateWorkspace(description) {
  await waitFor(description, () => {
    const text = document.body?.innerText || '';
    return text.includes('Resumen Ejecutivo') && text.includes('Ver Portal Público');
  });
}

async function signInWithLocalDemo() {
  const hasUnauthenticatedCta = await evaluate(
    '!![...document.querySelectorAll("button")].find((button) => button.innerText.includes("Ingresar al CRM"))',
  );
  if (hasUnauthenticatedCta) {
    await clickButton('Ingresar al CRM');
    await waitFor('the authentication modal', () =>
      document.body?.innerText?.includes('Ingresa a tu cuenta comercial'),
    );
    await clickButton('Entrar con Demo Rápida');
    return;
  }

  await clickButton('Ir al Dashboard');
}

async function assertUserApiKeysTab(description) {
  await waitFor(description, () => {
    const text = document.body?.innerText || '';
    return text.includes('API Keys por usuario') && text.includes('Módulos disponibles');
  });
}

async function run() {
  const target = await waitForDebugTarget();
  await connectToTarget(target);

  await navigate(baseUrl);
  await evaluate('localStorage.clear(); sessionStorage.clear(); location.reload()');
  await assertPublicSite('the unauthenticated public site');
  console.log('✓ unauthenticated visit renders the public site');

  for (const privatePath of ['/app', '/dashboard', '/crm', '/erp']) {
    await navigate(new URL(privatePath, baseUrl).toString());
    await assertCanonicalPublicUrl(`the protected redirect from ${privatePath}`);
    console.log(`✓ unauthenticated ${privatePath} redirects to the public URL`);
  }

  await signInWithLocalDemo();
  await assertPrivateWorkspace('the demo/login action to enter the dashboard');
  console.log('✓ unauthenticated access opens login and local demo authentication enters the dashboard');

  await clickNavigationItem('calendar', { parentId: 'tasks' });
  await waitFor('the calendar view', () => document.body?.innerText?.includes('Calendario comercial'));
  await assertConfigButton(false, 'calendar does not need user credentials');
  await assertAriaLabelMissing('Configurar credenciales de Calendario');

  await clickNavigationItem('messages', { parentId: 'whatsapp' });
  await waitFor('the messages view', () => document.body?.innerText?.includes('Mensajes'));
  await assertConfigButton(false, 'messages does not need user credentials');
  await assertAriaLabelMissing('Configurar credenciales de Mensajes');

  await clickNavigationItem('aiAssistant', { parentId: 'agenteOS' });
  await waitFor('the platform-powered Gemini module', () =>
    document.body?.innerText?.includes('Consulta Estratégica al Asistente IA CMO'),
  );
  await assertConfigButton(false, 'platform-powered Gemini does not need user credentials');
  await assertAriaLabelMissing('Configurar credenciales de Asistente Gemini');

  await clickNavigationItem('googleMaps');
  await waitFor('the Maps prospecting view', () => document.body?.innerText?.includes('Prospección Geolocalizada con Google Maps'));
  await assertConfigButton(true, 'Maps needs user credentials');
  await clickAriaLabel('Configurar credenciales de Prospección Mapa B2B');
  await waitFor('the mixed Maps credential modal', () => {
    const text = document.body?.innerText || '';
    return text.includes('Google Maps Server API Key') && text.includes('VITE_GOOGLE_MAPS_API_KEY') && text.includes('Configuración administrada por ClientumCRM');
  });
  await clickAriaLabel('Cerrar configuración');
  console.log('✓ all-module credential modal distinguishes workspace and platform configuration');

  await clickNavigationItem('settings', { sectionId: 'system' });
  await waitFor('the settings view', () => document.body?.innerText?.includes('Integraciones & API Hub'));
  await clickButton('Auditoría & Logs');
  await waitFor('the audit logs view', () => document.body?.innerText?.includes('Eventos Registrados'));
  console.log('✓ audit logs view renders security anomalies safely');
  await clickButton('Integraciones & API Hub');
  await waitFor('the user API keys-only integrations hub', () => {
    const text = document.body?.innerText || '';
    return text.includes('API Keys por usuario') && !text.includes('API Keys REST (Plataforma)');
  });
  console.log('✓ platform API keys are hidden from the dashboard');
  await clickButton('API Keys por usuario');
  await assertUserApiKeysTab('the per-user API keys configuration tab');
  console.log('✓ per-user API keys tab renders with module scopes');

  await clickButton('Ver Portal Público');
  await assertPublicSite('the dashboard action to return to the public site');
  console.log('✓ public-site action returns to the landing experience');

  await waitFor('the active-session dashboard action', () =>
    document.body?.innerText?.includes('Ir al Dashboard'),
  );
  await clickButton('Ir al Dashboard');
  await assertPrivateWorkspace('the dashboard before logout');
  await evaluate('document.querySelector("#sidebar-logout-btn")?.click()');
  await assertPublicSite('logout to return to the public site');
  console.log('✓ logout returns to the public site');

  await evaluate(`sessionStorage.setItem('clientum_view_mode', 'app'); location.reload()`);
  await assertPublicSite('the private-shell guard after an unauthenticated app-mode request');
  console.log('✓ unauthenticated app-mode request remains on the public site');

  await evaluate('localStorage.clear(); sessionStorage.clear(); location.reload()');
  console.log('Navigation smoke test passed.');
}

try {
  await run();
} finally {
  socket?.close();
  browser.kill('SIGTERM');
}