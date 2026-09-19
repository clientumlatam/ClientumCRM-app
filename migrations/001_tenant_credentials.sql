-- ClientumCRM tenant credential storage
-- Run with: npm run db:migrate
--
-- Provider credentials are encrypted before they reach these columns.
-- The encryption key remains a platform secret and is never stored here.

CREATE TABLE IF NOT EXISTS clientum_user_credentials (
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  PRIMARY KEY (user_id, module_id)
);

CREATE TABLE IF NOT EXISTS clientum_user_api_keys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  token_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clientum_tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clientum_tenant_memberships (
  tenant_id TEXT NOT NULL REFERENCES clientum_tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tenant_id, user_id)
);

CREATE TABLE IF NOT EXISTS clientum_tenant_credentials (
  tenant_id TEXT NOT NULL REFERENCES clientum_tenants(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  updated_by_user_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  PRIMARY KEY (tenant_id, module_id)
);

CREATE INDEX IF NOT EXISTS clientum_tenant_memberships_user_idx
  ON clientum_tenant_memberships (user_id);

-- Backfill the previous user-scoped encrypted records into each user's
-- initial personal tenant. The encrypted payload is copied as-is.
INSERT INTO clientum_tenants (id, name)
SELECT DISTINCT
  'tenant_' || substr(md5(user_id), 1, 32),
  'Workspace ' || left(user_id, 32)
FROM clientum_user_credentials
ON CONFLICT (id) DO NOTHING;

INSERT INTO clientum_tenant_memberships (tenant_id, user_id, role)
SELECT DISTINCT
  'tenant_' || substr(md5(user_id), 1, 32),
  user_id,
  'owner'
FROM clientum_user_credentials
ON CONFLICT (tenant_id, user_id) DO NOTHING;

INSERT INTO clientum_tenant_credentials
  (tenant_id, module_id, updated_by_user_id, updated_at, iv, auth_tag, encrypted_data)
SELECT
  'tenant_' || substr(md5(user_id), 1, 32),
  module_id,
  user_id,
  updated_at,
  iv,
  auth_tag,
  encrypted_data
FROM clientum_user_credentials
ON CONFLICT (tenant_id, module_id) DO NOTHING;