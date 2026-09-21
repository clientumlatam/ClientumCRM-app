# ClientumOS

ClientumOS is a React/Express CRM workspace for sales operations, customer data,
activities, AI-assisted work, and optional ERP and communication modules. The
repository contains a working product shell plus integrations whose availability
depends on provider credentials and PostgreSQL. It does not by itself guarantee
AFIP, WhatsApp, email, payment, or AI delivery.

## Quick start

### Prerequisites

- Node.js 20+ (the Replit configuration uses Node 24).
- npm.
- PostgreSQL for authenticated persistence. A Neon connection is supported.
- A Firebase project when using real sign-in. The development demo fallback is
  available only when the Vite app is running in development without live
  Firebase configuration.

```bash
npm install
cp .env.example .env
npm run dev
```

The Replit workflow runs `PORT=5000 npm run dev`. The local server listens on
`PORT` (5000 by default in the server, 5000 in the workflow) and serves both
the Vite app and Express API. Use relative `/api/...` URLs; do not hard-code
localhost into the client.

## Environment and secrets

`.env.example` is the authoritative list of names. Never commit real values.
Public Firebase browser configuration uses `VITE_FIREBASE_*` variables (the
bundled `firebase-applet-config.json` can provide development defaults). Server
secrets such as `SESSION_SECRET`, `WORKFLOW_ENCRYPTION_KEY`, provider tokens,
SMTP credentials, and platform billing credentials must stay in Replit
Secrets or the deployment environment.

The server accepts `NEON_DATABASE_URL` or `DATABASE_URL`, and can use managed
`PGHOST`, `PGUSER`, `PGDATABASE`, and related `PG*` variables. The migration
script specifically uses `DATABASE_URL` or managed `PG*` variables. See
[environment and deployment](./docs/07-entorno-migraciones-despliegue.md).

## Database and production commands

```bash
npm run db:migrate   # requires DATABASE_URL or PGHOST/PGUSER/PGDATABASE
npm run lint         # TypeScript check
npm run build        # Vite client + dist/server.cjs
npm start             # serves the production build
```

The server runs the numbered migrations when a PostgreSQL connection is
available, but `npm run db:migrate` is the explicit repeatable migration path.
Without PostgreSQL, public pages and the local/demo workspace can render, but
authenticated CRM persistence, workspace credentials, audit data, and platform
billing are unavailable.

## Authentication and data boundaries

Firebase Auth is initialized only when the required public client configuration
is present. In development, the app exposes an explicit local demo session when
Firebase is not configured; that session is not a production identity. The
browser sends Firebase ID tokens as bearer tokens for authenticated API
requests, and the Express boundary verifies them with Firebase Admin in
production before deriving a deterministic tenant membership from the verified
Firebase UID. The `x-clientum-user-id` header remains available only for the
explicit local/demo development path. Configure
`FIREBASE_SERVICE_ACCOUNT_JSON`, or the equivalent
`FIREBASE_PROJECT_ID`/`FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` server
variables, before exposing private APIs in production.

CRM records, imports, duplicate decisions, agent tasks, audit entries, and
workspace credential metadata are scoped by the authenticated user/tenant in
PostgreSQL. Workspace provider credentials are encrypted server-side; they are
not the same as platform-managed secrets.

## Deployment and health checks

- **Replit:** use the configured `Start application` workflow and port 5000.
- **Vercel:** `vercel.json` rewrites `/api/*` to `api/[...path].ts` and serves
  the SPA fallback. Set the required environment variables in Vercel, keep
  server-only secrets out of `VITE_*`, and verify the production build before
  publishing.
- `GET /health`, `/api/health`, `/api/version`, and `/api/deploy-version` are
  lightweight service responses.
- `GET /ready` checks PostgreSQL and returns `503` with
  `DATABASE_UNAVAILABLE` when the database is not ready. A green health
  response does not prove that every external provider is configured.
- `GET /api/integrations/ping` reports the provider-shaped status exposed by
  the app; it is not a complete end-to-end credential or delivery test.

Troubleshooting starts with the workflow logs, then `/health` and `/ready`,
then the relevant provider configuration. Do not diagnose a provider outage
from the UI badge alone.

## Documentation map

### Canonical implementation documentation

- [Documentation index](./docs/index.md)
- [Architecture and runtime topology](./docs/01-arquitectura-runtime.md)
- [Project structure](./docs/02-estructura-proyecto.md)
- [Navigation and URL registry](./docs/03-navegacion-rutas-aliases.md)
- [Theme and visual system](./docs/04-temas-identidad-estilos.md)
- [Integrations and health](./docs/05-integraciones-persistencia-salud.md)
- [AI capabilities and limits](./docs/06-ia-asistentes.md)
- [Environment and deployment](./docs/07-entorno-migraciones-despliegue.md)
- [Maintenance and verified status](./docs/08-mantenimiento-estado-verificado.md)
- [Developer onboarding](./docs/09-onboarding-desarrolladores.md)
- [Contribution guide](./docs/10-guia-contribucion.md)
- [REST API reference](./docs/11-referencia-rest.md)

### Product and supplementary material

- [User guide (Spanish)](./docs/12-guia-uso.md)
- [Design-review archive index](./docs/design-review/index.md)

The design-review archive and its attached assets are advisory or historical
evidence. They are not a runtime specification; source code and configuration
remain authoritative.

## Contributing

Read the [contribution guide](./docs/10-guia-contribucion.md) before opening
an issue or pull request. Documentation changes should update the relevant
status notes and keep examples free of real credentials.
