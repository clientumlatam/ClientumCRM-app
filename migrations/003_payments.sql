-- Durable hosted checkout records. Provider credentials remain encrypted in
-- clientum_tenant_credentials and are never written to this table.
CREATE TABLE IF NOT EXISTS clientum_payment_checkouts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES clientum_tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('mercadopago')),
  preference_id TEXT,
  external_reference TEXT NOT NULL UNIQUE,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'ARS',
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  init_point TEXT,
  provider_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clientum_payment_checkouts_tenant_created_idx
  ON clientum_payment_checkouts (tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS clientum_payment_checkouts_provider_payment_idx
  ON clientum_payment_checkouts (provider, provider_payment_id);