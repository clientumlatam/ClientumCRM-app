---
name: User credential boundaries
description: Provider credentials and internal REST tokens use separate user-scoped storage, while platform secrets remain managed by the workspace.
---

Provider credentials are user-scoped and encrypted server-side; internal REST tokens are stored as hashes in a separate encrypted vault and are shown only at creation. Platform secrets such as encryption keys, session secrets, and Firebase client configuration stay outside the user credential UI. Administrative API Key actions for another user must be authorized server-side, never inferred from the selected frontend user.

**Why:** Mixing workspace secrets with customer-owned provider credentials would allow one user's configuration to affect another user and could expose platform-level access.

**How to apply:** New provider integrations should add fields to the module catalog, resolve them on the backend by verified user identity, and never persist raw values in the browser. Production requests require Firebase identity verification; the local user-id header is demo-only. For cross-user API Key administration, use a server-side admin allowlist in production and only the demo role fallback in development. For Google Places, use only a user-scoped server key from backend routes; a browser-restricted public key must not be repurposed for server-to-server calls.