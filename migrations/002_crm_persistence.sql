-- ClientumCRM persistent CRM records, durable Agent OS tasks and provenance.
-- All user-controlled values are written through parameterized queries.

CREATE TABLE IF NOT EXISTS clientum_crm_records (
  tenant_id TEXT NOT NULL REFERENCES clientum_tenants(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('opportunities', 'companies', 'people', 'tasks', 'activities')),
  entity_id TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tenant_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS clientum_crm_records_tenant_type_updated_idx
  ON clientum_crm_records (tenant_id, entity_type, updated_at DESC);

CREATE TABLE IF NOT EXISTS clientum_agent_tasks (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES clientum_tenants(id) ON DELETE CASCADE,
  requested_by_user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  priority INTEGER NOT NULL DEFAULT 50,
  due_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  leased_until TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output JSONB,
  error TEXT,
  source TEXT NOT NULL DEFAULT 'user',
  target_type TEXT,
  target_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS clientum_agent_tasks_due_idx
  ON clientum_agent_tasks (tenant_id, status, due_at, priority DESC);

CREATE TABLE IF NOT EXISTS clientum_crm_evidence (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES clientum_tenants(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  field_name TEXT,
  observed_value JSONB NOT NULL,
  source_type TEXT NOT NULL,
  source_ref TEXT,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'observed'
    CHECK (status IN ('observed', 'suggested', 'accepted', 'rejected')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clientum_crm_evidence_entity_idx
  ON clientum_crm_evidence (tenant_id, entity_type, entity_id, observed_at DESC);

CREATE TABLE IF NOT EXISTS clientum_ai_change_audit (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES clientum_tenants(id) ON DELETE CASCADE,
  actor_user_id TEXT,
  actor_type TEXT NOT NULL DEFAULT 'ai',
  model TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB,
  reason TEXT,
  evidence_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'applied'
    CHECK (status IN ('proposed', 'applied', 'rejected', 'rolled_back')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clientum_ai_change_audit_entity_idx
  ON clientum_ai_change_audit (tenant_id, entity_type, entity_id, created_at DESC);

CREATE TABLE IF NOT EXISTS clientum_server_audit_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES clientum_tenants(id) ON DELETE CASCADE,
  user_id TEXT,
  actor_type TEXT NOT NULL DEFAULT 'user',
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  before_data JSONB,
  after_data JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clientum_server_audit_logs_tenant_created_idx
  ON clientum_server_audit_logs (tenant_id, created_at DESC);