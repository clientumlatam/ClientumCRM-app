---
name: Server workflow refresh
description: Workflow behavior to remember when changing backend routes or server-side logic.
---

Server-side changes should be verified after restarting the configured application workflow, not only after a client-side hot reload.

**Why:** During verification, the browser reflected frontend changes while the running backend still returned the old response for a newly added route until the workflow was restarted.

**How to apply:** After editing server.ts or other backend runtime code, restart the existing app workflow once, then re-run a direct HTTP check against the changed endpoint and inspect fresh workflow/browser logs.