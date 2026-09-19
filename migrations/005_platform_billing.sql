-- Platform subscriptions: these records belong to Clientum, not to a tenant's
-- customers. Mercado Pago credentials stay in Replit Secrets.
CREATE TABLE IF NOT EXISTS clientum_platform_billing_checkouts (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  external_reference TEXT NOT NULL UNIQUE,
  preference_id TEXT,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'ARS',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'paused')),
  payer_email TEXT,
  init_point TEXT,
  provider_subscription_id TEXT,
  provider_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clientum_platform_billing_user_created_idx
  ON clientum_platform_billing_checkouts (clerk_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS clientum_platform_billing_provider_payment_idx
  ON clientum_platform_billing_checkouts (provider_payment_id);

ALTER TABLE clientum_platform_billing_checkouts
  ADD COLUMN IF NOT EXISTS provider_subscription_id TEXT;

ALTER TABLE clientum_platform_billing_checkouts
  DROP CONSTRAINT IF EXISTS clientum_platform_billing_checkouts_status_check;

ALTER TABLE clientum_platform_billing_checkouts
  ADD CONSTRAINT clientum_platform_billing_checkouts_status_check
  CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'paused'));

CREATE INDEX IF NOT EXISTS clientum_platform_billing_subscription_idx
  ON clientum_platform_billing_checkouts (provider_subscription_id);