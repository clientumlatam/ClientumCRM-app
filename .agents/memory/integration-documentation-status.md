---
name: Integration documentation status
description: Keep provider documentation aligned with runtime capability and avoid treating catalog fields as active integrations.
---

Integration documentation must distinguish three states: connected runtime behavior, partial/provider-specific behavior, and catalog-only configuration. Provider pricing and free-tier quotas should not be presented as permanent project guarantees.

**Why:** The application exposes many module credential fields and UI cards for planned providers, while only a subset has server clients and live endpoints. Treating the catalog as connected capability creates misleading setup instructions and false readiness expectations.

**How to apply:** Audit provider docs against actual imports, environment reads, outbound requests, and routes. Name the consumed credential fields, mark reserved fields as pending, and link to official vendor documentation for current limits.