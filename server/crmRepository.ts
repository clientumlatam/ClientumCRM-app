import type { Pool } from "pg";
import { randomBytes } from "node:crypto";

export const CRM_ENTITY_TYPES = [
  "opportunities",
  "companies",
  "people",
  "tasks",
  "activities",
] as const;

export type CrmEntityType = (typeof CRM_ENTITY_TYPES)[number];

export type JsonRecord = Record<string, unknown>;

const createId = (prefix: string) => `${prefix}-${Date.now()}-${randomBytes(5).toString("hex")}`;

const isCrmEntityType = (value: string): value is CrmEntityType =>
  CRM_ENTITY_TYPES.includes(value as CrmEntityType);

export async function listCrmRecords(pool: Pool | null, tenantId: string): Promise<Record<CrmEntityType, JsonRecord[]>> {
  const empty: Record<CrmEntityType, JsonRecord[]> = {
    opportunities: [],
    companies: [],
    people: [],
    tasks: [],
    activities: [],
  };

  if (!pool) return empty;

  const result = await pool.query<{ entity_type: CrmEntityType; data: JsonRecord }>(
    `SELECT entity_type, data
     FROM clientum_crm_records
     WHERE tenant_id = $1
     ORDER BY updated_at DESC`,
    [tenantId],
  );

  for (const row of result.rows) {
    if (isCrmEntityType(row.entity_type)) empty[row.entity_type].push(row.data);
  }
  return empty;
}

export async function countCrmRecords(pool: Pool | null, tenantId: string): Promise<number> {
  if (!pool) return 0;
  const result = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM clientum_crm_records WHERE tenant_id = $1",
    [tenantId],
  );
  return Number(result.rows[0]?.count || 0);
}

export async function upsertCrmRecords(
  pool: Pool | null,
  tenantId: string,
  records: Partial<Record<CrmEntityType, JsonRecord[]>>,
): Promise<number> {
  if (!pool) return 0;
  let written = 0;
  await pool.query("BEGIN");
  try {
    for (const entityType of CRM_ENTITY_TYPES) {
      const values = records[entityType];
      if (!Array.isArray(values)) continue;
      for (const record of values) {
        const entityId = typeof record.id === "string" ? record.id : "";
        if (!entityId || !record || typeof record !== "object") continue;
        await pool.query(
          `INSERT INTO clientum_crm_records
            (tenant_id, entity_type, entity_id, data, created_at, updated_at)
           VALUES ($1, $2, $3, $4::jsonb, COALESCE(($4::jsonb->>'createdAt')::timestamptz, NOW()), NOW())
           ON CONFLICT (tenant_id, entity_type, entity_id)
           DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
          [tenantId, entityType, entityId, JSON.stringify(record)],
        );
        written += 1;
      }
    }
    await pool.query("COMMIT");
    return written;
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function deleteCrmRecord(
  pool: Pool | null,
  tenantId: string,
  entityType: string,
  entityId: string,
): Promise<boolean> {
  if (!pool || !isCrmEntityType(entityType)) return false;
  const result = await pool.query(
    `DELETE FROM clientum_crm_records
     WHERE tenant_id = $1 AND entity_type = $2 AND entity_id = $3`,
    [tenantId, entityType, entityId],
  );
  return (result.rowCount || 0) > 0;
}

export type DuplicateEntityType = "companies" | "people";

export interface CrmDuplicateCandidate {
  pairKey: string;
  entityType: DuplicateEntityType;
  matchField: "email" | "phone" | "domain" | "name";
  matchValue: string;
  primary: JsonRecord;
  duplicate: JsonRecord;
}

const normalizeDuplicateValue = (value: unknown, field: CrmDuplicateCandidate["matchField"]): string => {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";
  if (field === "email") return raw;
  if (field === "phone") return raw.replace(/[^\d+]/g, "");
  if (field === "domain") return raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  return raw.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
};

const duplicatePairKey = (entityType: DuplicateEntityType, leftId: string, rightId: string): string =>
  `${entityType}:${[leftId, rightId].sort().join("|")}`;

export async function listCrmDuplicates(
  pool: Pool | null,
  tenantId: string,
  entityType?: DuplicateEntityType,
): Promise<CrmDuplicateCandidate[]> {
  if (!pool) return [];
  const records = await listCrmRecords(pool, tenantId);
  const decisions = await pool.query<{ pair_key: string }>(
    `SELECT pair_key
     FROM clientum_crm_duplicate_decisions
     WHERE tenant_id = $1`,
    [tenantId],
  );
  const dismissed = new Set(decisions.rows.map((row) => row.pair_key));
  const candidates: CrmDuplicateCandidate[] = [];
  const types: DuplicateEntityType[] = entityType ? [entityType] : ["people", "companies"];

  for (const currentType of types) {
    const source = records[currentType];
    const fields: CrmDuplicateCandidate["matchField"][] = currentType === "people"
      ? ["email", "phone"]
      : ["domain", "name"];

    for (const field of fields) {
      const groups = new Map<string, JsonRecord[]>();
      for (const record of source) {
        const value = currentType === "people"
          ? record[field]
          : field === "name"
            ? record.name
            : record.domain;
        const normalized = normalizeDuplicateValue(value, field);
        if (!normalized) continue;
        const group = groups.get(normalized) || [];
        group.push(record);
        groups.set(normalized, group);
      }

      for (const [matchValue, group] of groups) {
        if (group.length < 2) continue;
        for (let index = 1; index < group.length; index += 1) {
          const primary = group[0];
          const duplicate = group[index];
          const primaryId = String(primary.id);
          const duplicateId = String(duplicate.id);
          const pairKey = duplicatePairKey(currentType, primaryId, duplicateId);
          if (dismissed.has(pairKey)) continue;
          if (candidates.some((candidate) => candidate.pairKey === pairKey)) continue;
          candidates.push({
            pairKey,
            entityType: currentType,
            matchField: field,
            matchValue,
            primary,
            duplicate,
          });
        }
      }
    }
  }

  return candidates;
}

const isBlankValue = (value: unknown): boolean =>
  value === null || value === undefined || (typeof value === "string" && value.trim().length === 0);

const mergeCrmRecords = (primary: JsonRecord, duplicate: JsonRecord): JsonRecord => {
  const merged: JsonRecord = { ...duplicate, ...primary };
  for (const [key, value] of Object.entries(duplicate)) {
    if (isBlankValue(merged[key]) && !isBlankValue(value)) merged[key] = value;
  }
  for (const key of ["tags"]) {
    const values = [...(Array.isArray(primary[key]) ? primary[key] : []), ...(Array.isArray(duplicate[key]) ? duplicate[key] : [])]
      .filter((value, index, list) => list.indexOf(value) === index);
    if (values.length > 0) merged[key] = values;
  }
  merged.updatedAt = new Date().toISOString();
  return merged;
};

export async function resolveCrmDuplicate(
  pool: Pool | null,
  tenantId: string,
  userId: string,
  input: {
    entityType: DuplicateEntityType;
    primaryId: string;
    duplicateId: string;
    action: "dismiss" | "merge";
  },
) {
  if (!pool) throw new Error("PostgreSQL is required for duplicate resolution.");
  if (input.primaryId === input.duplicateId) throw new Error("A record cannot be merged with itself.");

  const pairKey = duplicatePairKey(input.entityType, input.primaryId, input.duplicateId);
  await pool.query("BEGIN");
  try {
    const records = await pool.query<{ entity_type: CrmEntityType; entity_id: string; data: JsonRecord }>(
      `SELECT entity_type, entity_id, data
       FROM clientum_crm_records
       WHERE tenant_id = $1
         AND (
           (entity_type = $2 AND entity_id IN ($3, $4))
           OR (entity_type IN ('opportunities', 'companies', 'people', 'tasks', 'activities'))
         )`,
      [tenantId, input.entityType, input.primaryId, input.duplicateId],
    );
    const targetRows = records.rows.filter(
      (row) => row.entity_type === input.entityType
        && (row.entity_id === input.primaryId || row.entity_id === input.duplicateId),
    );
    const primaryRow = targetRows.find((row) => row.entity_id === input.primaryId);
    const duplicateRow = targetRows.find((row) => row.entity_id === input.duplicateId);
    if (!primaryRow || !duplicateRow) throw new Error("Duplicate records were not found in this workspace.");

    await pool.query(
      `INSERT INTO clientum_crm_duplicate_decisions
        (tenant_id, entity_type, pair_key, action, primary_id, duplicate_id, created_by_user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (tenant_id, entity_type, pair_key)
       DO UPDATE SET action = EXCLUDED.action, primary_id = EXCLUDED.primary_id,
         duplicate_id = EXCLUDED.duplicate_id, created_by_user_id = EXCLUDED.created_by_user_id,
         created_at = NOW()`,
      [
        tenantId,
        input.entityType,
        pairKey,
        input.action === "merge" ? "merged" : "dismissed",
        input.primaryId,
        input.duplicateId,
        userId,
      ],
    );

    if (input.action === "dismiss") {
      await pool.query("COMMIT");
      return { action: "dismissed", pairKey, updatedCount: 0, removedId: null };
    }

    const merged = mergeCrmRecords(primaryRow.data, duplicateRow.data);
    const updatedRows: Array<{ entityType: CrmEntityType; record: JsonRecord }> = [
      { entityType: input.entityType, record: { ...merged, id: input.primaryId } },
    ];

    for (const row of records.rows) {
      if (row.entity_id === input.duplicateId && row.entity_type === input.entityType) continue;
      let nextRecord = row.data;
      let changed = false;

      if (input.entityType === "people") {
        if (row.entity_type === "opportunities" && row.data.contactId === input.duplicateId) {
          nextRecord = { ...nextRecord, contactId: input.primaryId, contactName: mergedName(merged) };
          changed = true;
        }
        if (row.entity_type === "tasks" && row.data.targetType === "person" && row.data.targetId === input.duplicateId) {
          nextRecord = { ...nextRecord, targetId: input.primaryId, targetName: mergedName(merged) };
          changed = true;
        }
        if (row.entity_type === "activities" && row.data.targetType === "person" && row.data.targetId === input.duplicateId) {
          nextRecord = { ...nextRecord, targetId: input.primaryId };
          changed = true;
        }
      } else {
        if (row.entity_type === "people" && row.data.companyId === input.duplicateId) {
          nextRecord = { ...nextRecord, companyId: input.primaryId, companyName: String(merged.name || "") };
          changed = true;
        }
        if (row.entity_type === "opportunities" && row.data.companyId === input.duplicateId) {
          nextRecord = { ...nextRecord, companyId: input.primaryId, companyName: String(merged.name || "") };
          changed = true;
        }
        if (row.entity_type === "activities" && row.data.targetType === "company" && row.data.targetId === input.duplicateId) {
          nextRecord = { ...nextRecord, targetId: input.primaryId };
          changed = true;
        }
      }

      if (changed) updatedRows.push({ entityType: row.entity_type, record: nextRecord });
    }

    for (const { entityType, record } of updatedRows) {
      await pool.query(
        `INSERT INTO clientum_crm_records
          (tenant_id, entity_type, entity_id, data, created_at, updated_at)
         VALUES ($1, $2, $3, $4::jsonb, COALESCE(($4::jsonb->>'createdAt')::timestamptz, NOW()), NOW())
         ON CONFLICT (tenant_id, entity_type, entity_id)
         DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [tenantId, entityType, String(record.id), JSON.stringify(record)],
      );
    }
    await pool.query(
      `DELETE FROM clientum_crm_records
       WHERE tenant_id = $1 AND entity_type = $2 AND entity_id = $3`,
      [tenantId, input.entityType, input.duplicateId],
    );
    await pool.query("COMMIT");
    return {
      action: "merged",
      pairKey,
      updatedCount: updatedRows.length,
      removedId: input.duplicateId,
      mergedId: input.primaryId,
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

const mergedName = (record: JsonRecord): string =>
  [record.firstName, record.lastName].filter((value) => !isBlankValue(value)).join(" ").trim()
  || String(record.name || record.email || record.id || "");

export async function createCrmImportBatch(
  pool: Pool | null,
  tenantId: string,
  userId: string,
  input: { id: string; entityType: "opportunities" | "companies" | "people"; records: JsonRecord[] },
) {
  if (!pool) throw new Error("PostgreSQL is required for reversible imports.");
  if (!/^[a-zA-Z0-9:_-]{1,120}$/.test(input.id)) throw new Error("Invalid import batch id.");
  if (input.records.length === 0 || input.records.length > 5000) throw new Error("Import batch size is invalid.");

  await pool.query("BEGIN");
  try {
    const recordIds: string[] = [];
    for (const record of input.records) {
      const entityId = typeof record.id === "string" ? record.id : "";
      if (!entityId || entityId.length > 160) continue;
      recordIds.push(entityId);
      await pool.query(
        `INSERT INTO clientum_crm_records
          (tenant_id, entity_type, entity_id, data, created_at, updated_at)
         VALUES ($1, $2, $3, $4::jsonb, COALESCE(($4::jsonb->>'createdAt')::timestamptz, NOW()), NOW())
         ON CONFLICT (tenant_id, entity_type, entity_id)
         DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [tenantId, input.entityType, entityId, JSON.stringify(record)],
      );
    }
    await pool.query(
      `INSERT INTO clientum_crm_import_batches
        (id, tenant_id, entity_type, record_ids, created_by_user_id)
       VALUES ($1, $2, $3, $4::jsonb, $5)
       ON CONFLICT (id) DO UPDATE SET record_ids = EXCLUDED.record_ids, undone_at = NULL`,
      [input.id, tenantId, input.entityType, JSON.stringify(recordIds), userId],
    );
    await pool.query("COMMIT");
    return { id: input.id, entityType: input.entityType, count: recordIds.length };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function undoCrmImportBatch(pool: Pool | null, tenantId: string, batchId: string) {
  if (!pool) throw new Error("PostgreSQL is required to undo imports.");
  await pool.query("BEGIN");
  try {
    const batch = await pool.query<{ entity_type: "opportunities" | "companies" | "people"; record_ids: string[] }>(
      `SELECT entity_type, record_ids
       FROM clientum_crm_import_batches
       WHERE id = $1 AND tenant_id = $2 AND undone_at IS NULL
       FOR UPDATE`,
      [batchId, tenantId],
    );
    const row = batch.rows[0];
    if (!row) {
      await pool.query("ROLLBACK");
      return { undone: false, deleted: 0 };
    }
    const recordIds = Array.isArray(row.record_ids) ? row.record_ids : [];
    const deleted = await pool.query(
      `DELETE FROM clientum_crm_records
       WHERE tenant_id = $1 AND entity_type = $2 AND entity_id = ANY($3::text[])`,
      [tenantId, row.entity_type, recordIds],
    );
    await pool.query(
      `UPDATE clientum_crm_import_batches SET undone_at = NOW()
       WHERE id = $1 AND tenant_id = $2`,
      [batchId, tenantId],
    );
    await pool.query("COMMIT");
    return { undone: true, deleted: deleted.rowCount || 0 };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export interface AgentTaskInput {
  kind: string;
  dueAt?: string;
  priority?: number;
  maxAttempts?: number;
  input?: JsonRecord;
  source?: string;
  targetType?: string;
  targetId?: string;
}

export async function createAgentTask(
  pool: Pool | null,
  tenantId: string,
  userId: string,
  task: AgentTaskInput,
) {
  if (!pool) throw new Error("PostgreSQL is required for durable Agent OS tasks.");
  const id = createId("agent-task");
  const result = await pool.query(
    `INSERT INTO clientum_agent_tasks
      (id, tenant_id, requested_by_user_id, kind, due_at, priority, max_attempts,
       input, source, target_type, target_id)
     VALUES ($1, $2, $3, $4, COALESCE($5::timestamptz, NOW()), $6, $7, $8::jsonb, $9, $10, $11)
     RETURNING id, kind, status, priority, due_at, attempts, max_attempts,
       input, source, target_type, target_id, created_at, updated_at`,
    [
      id,
      tenantId,
      userId,
      task.kind,
      task.dueAt || null,
      Number.isFinite(task.priority) ? task.priority : 50,
      Number.isFinite(task.maxAttempts) ? task.maxAttempts : 3,
      JSON.stringify(task.input || {}),
      task.source || "user",
      task.targetType || null,
      task.targetId || null,
    ],
  );
  return result.rows[0];
}

export async function claimDueAgentTasks(pool: Pool | null, tenantId: string, limit = 10) {
  if (!pool) return [];
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 50);
  const result = await pool.query(
    `WITH claimable AS (
       SELECT id
       FROM clientum_agent_tasks
       WHERE tenant_id = $1
         AND (
           (status = 'pending' AND due_at <= NOW())
           OR (status = 'running' AND leased_until < NOW())
         )
         AND attempts < max_attempts
       ORDER BY priority DESC, due_at ASC
       FOR UPDATE SKIP LOCKED
       LIMIT $2
     )
     UPDATE clientum_agent_tasks AS task
     SET status = 'running',
         attempts = task.attempts + 1,
         leased_until = NOW() + INTERVAL '10 minutes',
         updated_at = NOW()
     FROM claimable
     WHERE task.id = claimable.id
     RETURNING task.*`,
    [tenantId, safeLimit],
  );
  return result.rows;
}

export async function finishAgentTask(
  pool: Pool | null,
  tenantId: string,
  taskId: string,
  result: { status: "completed" | "failed" | "cancelled"; output?: JsonRecord; error?: string },
) {
  if (!pool) return false;
  const query = result.status === "completed"
    ? `UPDATE clientum_agent_tasks
       SET status = $4, output = $5::jsonb, error = NULL, leased_until = NULL,
           completed_at = NOW(), updated_at = NOW()
       WHERE tenant_id = $1 AND id = $2 AND status = 'running'`
    : `UPDATE clientum_agent_tasks
       SET status = $4, output = $5::jsonb, error = $6, leased_until = NULL,
           completed_at = CASE WHEN $4 = 'cancelled' OR attempts >= max_attempts THEN NOW() ELSE completed_at END,
           updated_at = NOW()
       WHERE tenant_id = $1 AND id = $2 AND status = 'running'`;
  const params = result.status === "completed"
    ? [tenantId, taskId, null, result.status, JSON.stringify(result.output || {})]
    : [tenantId, taskId, null, result.status, JSON.stringify(result.output || {}), result.error || null];
  const updated = await pool.query(query, params);
  return (updated.rowCount || 0) > 0;
}

export async function recordEvidence(
  pool: Pool | null,
  tenantId: string,
  userId: string | null,
  input: {
    entityType: string;
    entityId: string;
    fieldName?: string;
    observedValue: unknown;
    sourceType: string;
    sourceRef?: string;
    status?: "observed" | "suggested" | "accepted" | "rejected";
    metadata?: JsonRecord;
  },
) {
  if (!pool) throw new Error("PostgreSQL is required for evidence tracking.");
  const id = createId("evidence");
  const result = await pool.query(
    `INSERT INTO clientum_crm_evidence
      (id, tenant_id, entity_type, entity_id, field_name, observed_value, source_type,
       source_ref, status, metadata, created_by_user_id)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10::jsonb, $11)
     RETURNING *`,
    [
      id,
      tenantId,
      input.entityType,
      input.entityId,
      input.fieldName || null,
      JSON.stringify(input.observedValue),
      input.sourceType,
      input.sourceRef || null,
      input.status || "observed",
      JSON.stringify(input.metadata || {}),
      userId,
    ],
  );
  return result.rows[0];
}

export async function recordAiChange(
  pool: Pool | null,
  tenantId: string,
  input: {
    actorUserId?: string | null;
    model?: string;
    action: string;
    entityType: string;
    entityId: string;
    beforeData?: unknown;
    afterData?: unknown;
    reason?: string;
    evidenceIds?: string[];
    status?: "proposed" | "applied" | "rejected" | "rolled_back";
  },
) {
  if (!pool) throw new Error("PostgreSQL is required for AI change auditing.");
  const id = createId("ai-change");
  const result = await pool.query(
    `INSERT INTO clientum_ai_change_audit
      (id, tenant_id, actor_user_id, model, action, entity_type, entity_id,
       before_data, after_data, reason, evidence_ids, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11::jsonb, $12)
     RETURNING *`,
    [
      id,
      tenantId,
      input.actorUserId || null,
      input.model || null,
      input.action,
      input.entityType,
      input.entityId,
      input.beforeData === undefined ? null : JSON.stringify(input.beforeData),
      input.afterData === undefined ? null : JSON.stringify(input.afterData),
      input.reason || null,
      JSON.stringify(input.evidenceIds || []),
      input.status || "applied",
    ],
  );
  return result.rows[0];
}

export async function recordServerAudit(
  pool: Pool | null,
  tenantId: string,
  input: {
    userId?: string | null;
    actorType?: string;
    action: string;
    entityType?: string;
    entityId?: string;
    beforeData?: unknown;
    afterData?: unknown;
    metadata?: JsonRecord;
  },
) {
  if (!pool) return null;
  const id = createId("audit");
  const result = await pool.query(
    `INSERT INTO clientum_server_audit_logs
      (id, tenant_id, user_id, actor_type, action, entity_type, entity_id,
       before_data, after_data, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb)
     RETURNING *`,
    [
      id,
      tenantId,
      input.userId || null,
      input.actorType || "user",
      input.action,
      input.entityType || null,
      input.entityId || null,
      input.beforeData === undefined ? null : JSON.stringify(input.beforeData),
      input.afterData === undefined ? null : JSON.stringify(input.afterData),
      JSON.stringify(input.metadata || {}),
    ],
  );
  return result.rows[0];
}

export async function listEvidence(pool: Pool | null, tenantId: string, entityType?: string, entityId?: string) {
  if (!pool) return [];
  const result = await pool.query(
    `SELECT *
     FROM clientum_crm_evidence
     WHERE tenant_id = $1
       AND ($2::text IS NULL OR entity_type = $2)
       AND ($3::text IS NULL OR entity_id = $3)
     ORDER BY observed_at DESC
     LIMIT 500`,
    [tenantId, entityType || null, entityId || null],
  );
  return result.rows;
}

export async function listAiChanges(pool: Pool | null, tenantId: string, entityType?: string, entityId?: string) {
  if (!pool) return [];
  const result = await pool.query(
    `SELECT *
     FROM clientum_ai_change_audit
     WHERE tenant_id = $1
       AND ($2::text IS NULL OR entity_type = $2)
       AND ($3::text IS NULL OR entity_id = $3)
     ORDER BY created_at DESC
     LIMIT 500`,
    [tenantId, entityType || null, entityId || null],
  );
  return result.rows;
}