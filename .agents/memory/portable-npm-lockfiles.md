---
name: Portable npm lockfiles
description: Keep npm dependency metadata usable outside Replit-hosted build environments.
---

Lockfiles intended for external builders must resolve packages through a public registry, never through Replit's internal package-firewall hostname. Commit a project npm registry policy and regenerate the lockfile from scratch when internal tarball URLs have already been recorded.

**Why:** Replit injects an `npm_config_registry` value for its package firewall, and npm can persist that internal host into `package-lock.json`. External builders such as Vercel cannot resolve the hostname and fail during dependency installation.

**How to apply:** Before publishing externally, search the lockfile for `package-firewall.replit.internal`, override the lowercase `npm_config_registry` during regeneration, and validate with a clean `npm ci`.