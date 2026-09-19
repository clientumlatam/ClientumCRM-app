---
name: Firebase environment propagation
description: Firebase client configuration must be injected from the server environment and Auth/Analytics must tolerate missing public config during local startup.
---

Platform secrets may exist in the workspace inventory without being present in the dev process or Vite client bundle immediately. Expose only the public `VITE_FIREBASE_*` configuration through the Vite server definition, keep server credentials backend-only, and guard Firebase Auth/Analytics initialization when the public config is unavailable.

**Why:** Initializing Firebase Auth with an empty API key crashes the entire React mount with `auth/invalid-api-key`, producing a blank preview.

**How to apply:** When changing Firebase or Replit secret wiring, restart the workflow, run `npm run smoke:navigation`, and verify the browser preview before delivery.

For authenticated routes, browser storage flags are only a local-development convenience. When Firebase is configured, restore access exclusively from the Firebase auth state listener; invalid live credentials must never fall through to the demo identity.

**Why:** Treating a persisted client flag as proof of identity allowed a stale or fabricated session to reopen the private CRM shell.

**How to apply:** Keep the local demo fallback behind development checks, gate private navigation on auth readiness, and sign out through Firebase before clearing the local view state.