---
name: Vercel serverless imports
description: Keep local development dependencies out of the production API function import graph.
---

Vercel API handlers that reuse the Express server must avoid statically importing Vite or other development-only tooling, and local imports need explicit file extensions when a sibling directory shares the same basename. Load local tooling only inside the development startup branch.

**Why:** A function can fail during module initialization before any route runs when its shared server entry imports a package that is not present or usable in the serverless runtime, or when ESM resolves an extensionless path to a same-named directory.

**How to apply:** Keep the exported Express app free of local server startup dependencies; use a dynamic import inside the non-production `main()` path, use an explicit `../server.ts`-style path from API entries, and verify the handler with `VERCEL=1`.