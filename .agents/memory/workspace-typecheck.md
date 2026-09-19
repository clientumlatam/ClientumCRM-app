---
name: Workspace typecheck setup
description: A validation lesson about incomplete local JavaScript dependencies.
---

The production build may succeed even when the local TypeScript compiler is missing because the bundler and runtime dependencies are installed separately. Restore declared development dependencies before treating lint output as a source-code failure.

**Why:** The dashboard build was healthy, but the first typecheck failure was only an incomplete `node_modules`; the next check then exposed a real pre-existing server typing issue.

**How to apply:** When `npm run lint` reports a missing compiler or package binary, compare the installed dependency tree with `package.json` before changing application code.