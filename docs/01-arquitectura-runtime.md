# 01 · Arquitectura y topología de runtime

## Alcance real

ClientumOS es una SPA de React que se sirve junto con un servidor Express.
`server.ts` registra la API, sirve Vite en desarrollo y sirve `dist/` en
producción. `api/[...path].ts` exporta la misma aplicación para Vercel. El
cliente usa `CRMContext` para el estado de workspace y llama a la API con
URLs relativas.

| Capa | Implementación | Estado |
| --- | --- | --- |
| UI | React 19, TypeScript, Vite, Tailwind CSS v4 | Implementado |
| Estado de producto | `src/context/CRMContext.tsx`, estado local y `localStorage` | Implementado; algunos módulos son locales |
| Identidad de navegador | Firebase Auth cuando está configurado | Configurable |
| Fallback local | sesión demo explícita en desarrollo sin Firebase | Demo; no es identidad de producción |
| API | Express en `server.ts` | Implementado |
| Persistencia durable | PostgreSQL/Neon y migraciones numeradas | Configurable; requerida para CRM autenticado |
| Proveedores | Mercado Pago, Resend/SMTP, WhatsApp, Cloudflare, Vercel, Google/Gemini | Dependiente de credenciales y del flujo |

## Flujo de una sesión

1. `src/App.tsx` decide si la URL es pública o privada mediante
   `src/lib/router/routeRegistry.ts`.
2. Firebase restaura la sesión cuando existe una configuración válida. Si no
   existe en desarrollo, se ofrece el fallback demo visible.
3. El registro o login real prepara el usuario y llama a
   `/api/account/bootstrap` cuando la API y PostgreSQL están disponibles.
4. El cliente carga `/api/crm/bootstrap`. El servidor encuentra o crea la
   membresía del tenant determinista para el usuario.
5. Las mutaciones persistentes envían el identificador de usuario en el
   encabezado que construye `src/lib/api.ts`. Las consultas SQL reciben el
   tenant derivado en el servidor.

### Frontera de autenticación

El navegador usa Firebase y envía un Firebase ID token en las rutas privadas.
`getRequestUserId` valida el token con Firebase Admin y deriva el usuario desde
el `uid` verificado. `x-clientum-user-id` solo se acepta para la sesión demo
explícita en desarrollo; en producción no sustituye una identidad verificada.
El servidor no acepta un `X-Tenant-ID` como sustituto de identidad en las rutas
modernas.

## Aislamiento de datos

El tenant se deriva de la identidad de usuario y se registra en
`clientum_tenant_memberships`. Las rutas CRM, tareas de agentes, evidencia,
cambios de IA, auditoría, importaciones y credenciales usan ese contexto.
Las claves creadas por usuarios tienen además propietario y scopes.

Las credenciales de módulos se cifran con una clave del servidor y se guardan
en PostgreSQL cuando está disponible; en desarrollo sin base pueden usar el
archivo cifrado local indicado por `USER_CREDENTIAL_STORE_PATH`. El secreto del
servidor nunca debe enviarse al cliente.

## Persistencia y degradación

Firebase puede aportar identidad y operaciones Firestore del cliente, pero no
reemplaza la base relacional requerida por la API de CRM. `GET /ready` es el
chequeo explícito de PostgreSQL. Sin base, la UI local/demo puede mostrar
datos semilla y `localStorage`, mientras las operaciones durables responden
`503` con `POSTGRES_NOT_CONFIGURED` o `DATABASE_UNAVAILABLE`.

## Principios de documentación

- El código activo y la configuración mandan sobre el material de diseño.
- “Configurado” significa que hay una ruta o formulario, no que el proveedor
  haya aceptado una transacción.
- Fallback, simulación y datos semilla se etiquetan como tales.
- La API usa contexto autenticado; los ejemplos no inventan un tenant fijo.