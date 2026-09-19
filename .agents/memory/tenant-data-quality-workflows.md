---
name: Tenant-scoped data quality workflows
description: Duplicate review, merge decisions, and reversible imports must remain scoped to the authenticated CRM workspace.
---

Duplicate decisions and import batches are tenant-owned records. Duplicate merges update related CRM references only inside the authenticated tenant, while dismissals and undo operations are persisted so the same workspace does not repeatedly surface resolved work.

**Why:** A client-side-only deduplication flow could show or mutate another workspace's records, and a bulk snapshot without batch history cannot safely undo an import.

**How to apply:** Route quality operations through the authenticated tenant context, persist pair decisions and import batches, preserve the primary record during merges, update its local references, and keep provider credentials tenant-scoped while internal API keys remain user-scoped.