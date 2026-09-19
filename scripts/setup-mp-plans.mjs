/**
 * scripts/setup-mp-plans.mjs
 *
 * One-time setup: creates the six preapproval_plan records in MercadoPago
 * (3 plans × 2 billing cycles) and prints the env vars to add to .env.
 *
 * Usage:
 *   PLATFORM_MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxx node scripts/setup-mp-plans.mjs
 *
 * Safe to re-run — each plan creation uses a unique external_id so MP
 * won't deduplicate. Check the MP developer panel to avoid creating
 * duplicates on repeated runs.
 *
 * After running, copy the output block into your .env and Replit Secrets.
 */

import 'dotenv/config';

const ACCESS_TOKEN = process.env.PLATFORM_MERCADOPAGO_ACCESS_TOKEN?.trim();
const APP_URL      = (process.env.APP_URL || '').replace(/\/+$/, '');

if (!ACCESS_TOKEN || ACCESS_TOKEN.startsWith('APP_USR-xxxx')) {
  console.error('❌  Set PLATFORM_MERCADOPAGO_ACCESS_TOKEN to your real production token.');
  process.exit(1);
}

// ─── Plan definitions ─────────────────────────────────────────────────────────
// Adjust amounts here or via env vars (they must match PLATFORM_PLANS in server.ts).
const PLANS = [
  {
    key:          'STARTER',
    reason:       'ClientumCRM Starter',
    monthlyARS:   Number(process.env.PLATFORM_PLAN_STARTER_ARS)        || 14_900,
    annualARS:    Number(process.env.PLATFORM_PLAN_STARTER_ANNUAL_ARS)  || 11_900, // per-month price billed yearly
  },
  {
    key:          'GROWTH',
    reason:       'ClientumCRM Growth',
    monthlyARS:   Number(process.env.PLATFORM_PLAN_GROWTH_ARS)          || 29_900,
    annualARS:    Number(process.env.PLATFORM_PLAN_GROWTH_ANNUAL_ARS)   || 23_900,
  },
  {
    key:          'SCALE',
    reason:       'ClientumCRM Scale',
    monthlyARS:   Number(process.env.PLATFORM_PLAN_SCALE_ARS)           || 59_900,
    annualARS:    Number(process.env.PLATFORM_PLAN_SCALE_ANNUAL_ARS)    || 47_900,
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
async function createPlan(body) {
  const res = await fetch('https://api.mercadopago.com/preapproval_plan', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`MP ${res.status}: ${json.message || JSON.stringify(json)}`);
  }
  return json;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log('\n📦  Creating MercadoPago preapproval plans…\n');

const results = {};

for (const plan of PLANS) {
  // Monthly plan
  try {
    const monthly = await createPlan({
      reason: `${plan.reason} (Mensual)`,
      auto_recurring: {
        frequency:      1,
        frequency_type: 'months',
        transaction_amount: plan.monthlyARS,
        currency_id: 'ARS',
      },
      back_url: APP_URL ? `${APP_URL}/app?billing=subscription` : 'https://clientum.com/app',
    });
    results[`PLATFORM_MP_PLAN_ID_${plan.key}_MONTHLY`] = monthly.id;
    console.log(`  ✅  ${plan.reason} Mensual  → ${monthly.id}`);
  } catch (err) {
    console.error(`  ❌  ${plan.reason} Mensual  → ${err.message}`);
    results[`PLATFORM_MP_PLAN_ID_${plan.key}_MONTHLY`] = 'ERROR';
  }

  // Annual plan — billed as 1 charge/year at annualARS × 12
  // (MP charges the full annual amount once per year, which is cheaper for the subscriber)
  try {
    const annual = await createPlan({
      reason: `${plan.reason} (Anual)`,
      auto_recurring: {
        frequency:      1,
        frequency_type: 'years',
        transaction_amount: plan.annualARS * 12,
        currency_id: 'ARS',
      },
      back_url: APP_URL ? `${APP_URL}/app?billing=subscription` : 'https://clientum.com/app',
    });
    results[`PLATFORM_MP_PLAN_ID_${plan.key}_ANNUAL`] = annual.id;
    console.log(`  ✅  ${plan.reason} Anual    → ${annual.id}`);
  } catch (err) {
    console.error(`  ❌  ${plan.reason} Anual    → ${err.message}`);
    results[`PLATFORM_MP_PLAN_ID_${plan.key}_ANNUAL`] = 'ERROR';
  }
}

// ─── Output env block ─────────────────────────────────────────────────────────
console.log('\n─────────────────────────────────────────────────────────');
console.log('Copy the following into your .env and Replit Secrets:\n');
for (const [key, value] of Object.entries(results)) {
  console.log(`${key}=${value}`);
}
console.log('─────────────────────────────────────────────────────────\n');
