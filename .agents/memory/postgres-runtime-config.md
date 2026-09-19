---
name: PostgreSQL workflow environment
description: How the managed PostgreSQL connection is exposed to this project's running workflow.
---

The running workflow can expose PostgreSQL through `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, and `PGDATABASE` without exposing `DATABASE_URL`. The server must support both a complete connection URL and the standard `PG*` environment configuration, and must not silently use the encrypted file fallback when the managed database is available.

**Why:** During verification, the shell had `DATABASE_URL` but the workflow only had the `PG*` variables. URL-only detection incorrectly selected the file vault, whose old ciphertext could not be decrypted with the current environment key.

**How to apply:** Prefer `DATABASE_URL` when present; otherwise create the PostgreSQL pool from the process environment only when the required `PG*` variables are present. Never log the values themselves.