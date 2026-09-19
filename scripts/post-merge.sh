#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "Installing locked dependencies..."
npm ci --no-audit --no-fund

if [[ -n "${DATABASE_URL:-}" || ( -n "${PGHOST:-}" && -n "${PGUSER:-}" && -n "${PGDATABASE:-}" ) ]]; then
  echo "Applying PostgreSQL migrations..."
  npm run db:migrate
else
  echo "Skipping PostgreSQL migrations: no DATABASE_URL or managed PG* connection is available."
fi

echo "Building the application..."
npm run build