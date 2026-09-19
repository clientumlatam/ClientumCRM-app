-- Data quality workflows: duplicate decisions and reversible CRM imports.

CREATE TABLE IF NOT EXISTS clientum_crm_duplicate_decisions (
  tenant_id TEXT NOT NULL REFERENCES clientum_tenants(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('companies', 'people')),
  pair_key TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('dismissed', 'merged')),
  primary_id TEXT NOT NULL,
  duplicate_id TEXT NOT NULL,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tenant_id, entity_type, pair_key)
);

CREATE INDEX IF NOT EXISTS clientum_crm_duplicate_decisions_tenant_idx
  ON clientum_crm_duplicate_decisions (tenant_id, entity_type, created_at DESC);

CREATE TABLE IF NOT EXISTS clientum_crm_import_batches (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES clientum_tenants(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('opportunities', 'companies', 'people')),
  record_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  undone_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS clientum_crm_import_batches_tenant_idx
  ON clientum_crm_import_batches (tenant_id, created_at DESC);