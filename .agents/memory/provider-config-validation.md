---
name: Provider configuration validation
description: Validate configured provider values instead of treating secret presence as proof of readiness.
---

Provider integrations must distinguish between a secret key existing and containing a usable provider value. Documentation placeholders can be saved as secrets and otherwise make the UI report a false “connected” state.

**Why:** The SMTP variables existed, but the sender address still contained a template placeholder. Presence-only checks would have exposed a misleading ready state and attempted delivery with invalid credentials.

**How to apply:** Normalize and validate provider configuration at the backend boundary, return a non-ready status until required values are real, and keep provider credentials out of client bundles and logs.