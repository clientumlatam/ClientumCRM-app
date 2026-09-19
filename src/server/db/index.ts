import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = (process.env.NEON_DATABASE_URL || process.env.DATABASE_URL)?.trim();
const hasPostgresEnvironment = Boolean(
  process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE,
);

export const pool: Pool | null = databaseUrl
  ? new Pool({ connectionString: databaseUrl, max: 5 })
  : hasPostgresEnvironment
    ? new Pool({ max: 5 })
    : null;

if (pool) {
  console.log('✅ [src/server/db] PostgreSQL database pool initialized.');
} else {
  console.log('ℹ️ [src/server/db] No PostgreSQL credentials detected. Using in-memory / file fallback.');
}

/**
 * Ensures that all foundational CRM tables exist in PostgreSQL
 */
export async function initCrmSchema(): Promise<void> {
  if (!pool) return;

  await pool.query(`
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
      slug TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS clientum_crm_records (
      id TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (tenant_id, entity_type, id)
    );
  `);
}

// Re-export repository operations
export * from '../../../server/crmRepository';
