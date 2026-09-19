---
name: Production demo access
description: Scope and security boundary for the production demo login.
---

The production demo entry point is intentionally a local UI/demo session. It must not be treated as a verified Clerk identity or as authorization for persistent server-side CRM operations.

**Why:** The demo is useful for evaluating the product even when Clerk delivery or DNS is unavailable, but the backend correctly relies on Clerk for authenticated workspaces.

**How to apply:** Keep demo access clearly labeled as demo, preserve real Clerk sign-in separately, and use a real Clerk demo user plus explicit backend authorization if persistent production demo data is ever required.