---
name: Payment confirmation safety
description: Paid access must depend on provider confirmation rather than checkout creation or local demo state.
---

The billing UI keeps a new Mercado Pago subscription pending until the server receives and exposes a provider-confirmed status. Platform checkout creation requires the provider token, PostgreSQL, a public HTTPS app URL, and a signing secret; missing configuration must return an explicit error instead of simulating paid access. A pending checkout can also refresh its provider status when the user checks it.

**Why:** A local fallback previously marked subscriptions active when Mercado Pago had not created or confirmed a real checkout, which could grant paid access without payment.

**How to apply:** Treat checkout creation as pending; activate locally only after a verified provider status, require signed webhook verification, and keep free trial behavior separate from paid billing.