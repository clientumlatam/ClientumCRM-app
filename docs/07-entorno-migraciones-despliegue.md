# 07 · Entorno, migraciones y despliegue

## Variables

`.env.example` es la lista de referencia. Los valores siguientes son nombres,
no valores para copiar como secretos:

```env
PORT=5000
NODE_ENV=development
NEON_DATABASE_URL=
DATABASE_URL=
PGHOST=
PGPORT=5432
PGUSER=
PGPASSWORD=
PGDATABASE=
WORKFLOW_ENCRYPTION_KEY=
API_KEY_PEPPER=
SESSION_SECRET=
FIREBASE_SERVICE_ACCOUNT_JSON=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

También hay variables opcionales para Vercel, Cloudflare, Resend/SMTP,
Mercado Pago de plataforma y `APP_URL`. Las credenciales que el usuario
introduce para un módulo están comentadas en `.env.example` como contrato de
la bóveda; no se deben convertir automáticamente en variables públicas.

`VITE_*` se incorpora al navegador y solo debe contener configuración pública.
Todo lo demás se considera server-only aunque una pantalla lo nombre. En
producción, Firebase Admin necesita `FIREBASE_SERVICE_ACCOUNT_JSON` o el
conjunto `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` y
`FIREBASE_PRIVATE_KEY`; estas variables nunca deben usar el prefijo `VITE_`.

## Desarrollo

```bash
npm install
cp .env.example .env
PORT=5000 npm run dev
```

Replit usa exactamente `PORT=5000 npm run dev` en el workflow `Start
application`. En local, `npm run dev` usa el puerto configurado por `PORT`.
Vite se monta dentro de Express en modo desarrollo.

## PostgreSQL y migraciones

El servidor reconoce `NEON_DATABASE_URL` o `DATABASE_URL` y el conjunto
gestionado `PG*`. El script explícito de migración reconoce `DATABASE_URL` o
`PGHOST`/`PGUSER`/`PGDATABASE`:

```bash
npm run db:migrate
```

La migración falla de forma explícita si no hay conexión. No apuntar una
migración de desarrollo a producción sin respaldo y aprobación operativa.

## Build y arranque

```bash
npm run lint
npm run build
npm start
```

`npm run build` genera los assets Vite y `dist/server.cjs` con esbuild.
`npm start` ejecuta ese bundle. `api/[...path].ts` importa la app Express para
Vercel; el handler serverless no debe cargar el runtime Vite de desarrollo.

## Vercel

`vercel.json` reescribe `/api/*` al catch-all y el resto de rutas al SPA,
además de fijar caché para HTML, API, service worker y assets. Configurar en
Vercel las variables server-only y las `VITE_*` necesarias para el build.
Usar una URL HTTPS pública en `APP_URL` para callbacks/webhooks de Mercado
Pago. Verificar `/health` y `/ready` tras publicar. Las rutas privadas requieren
una sesión Firebase verificada y devuelven `503 AUTH_PROVIDER_NOT_CONFIGURED`
si Firebase Admin no está configurado.

## Diagnóstico

1. Revisar logs del workflow o función.
2. Consultar `/health` y `/ready`.
3. Confirmar que el proceso ve `PORT` y la base ve `DATABASE_URL`/`PG*`.
4. Probar el proveedor específico solo con sus credenciales configuradas.
5. Separar errores de autenticación, base de datos y proveedor externo.