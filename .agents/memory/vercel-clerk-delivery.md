---
name: Vercel Clerk delivery
description: Clerk authentication behavior when this app is deployed outside Replit, especially on Vercel.
---

Use Clerk's direct browser delivery for the external Vercel domain unless that deployment also serves a working Clerk proxy. Replit-managed proxy URLs are not automatically available on a separately hosted Vercel deployment.

**Why:** A missing external proxy host left the Clerk modal empty, and the Service Worker turned the failed cross-origin request into a misleading `respondWith(undefined)` error.

**How to apply:** Keep Service Worker fetch handling same-origin only, version the worker when changing its behavior, and verify Clerk login after each external production redeploy.