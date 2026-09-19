-- Adds the MP preapproval_plan_id and billing_cycle columns to platform billing.
-- Run with: node scripts/migrate.mjs  (auto-picked up by ensureCredentialSchema)

ALTER TABLE clientum_platform_billing_checkouts
  ADD COLUMN IF NOT EXISTS preapproval_plan_id TEXT,
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT NOT NULL DEFAULT 'monthly'
    CHECK (billing_cycle IN ('monthly', 'annual'));

CREATE INDEX IF NOT EXISTS clientum_platform_billing_plan_idx
  ON clientum_platform_billing_checkouts (preapproval_plan_id);
