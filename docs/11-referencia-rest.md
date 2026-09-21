# 11 · Referencia REST

La API vive en `server.ts` y se expone con `/api/*`. En desarrollo comparte
proceso con Vite; en Vercel se exporta mediante `api/[...path].ts`. Los
ejemplos son representativos: consultar el handler antes de automatizar un
flujo.

## Convenciones de acceso y scoping

- Las rutas públicas no requieren sesión: contactos, newsletter,
  `/api/public-agent`, salud, webhooks y algunos diagnósticos.
- Las familias `/api/account`, `/api/crm`, `/api/agent`, `/api/ai`,
  `/api/audit`, `/api/email/send`, `/api/billing`, `/api/vercel` y
  `/api/cloudflare` pasan por el middleware de aplicación.
- El cliente envía `Authorization: Bearer <Firebase ID token>` cuando hay una
  sesión real. El backend verifica firma, proyecto, audiencia y expiración con
  Firebase Admin.
- `x-clientum-user-id` solo sirve para la sesión demo explícita en desarrollo.
  En producción se ignora.
- Una ruta privada devuelve `503 AUTH_PROVIDER_NOT_CONFIGURED` si falta la
  credencial server-only de Firebase Admin y `401 AUTHENTICATION_REQUIRED` si
  el token está ausente o no es válido.
- Las rutas CRM modernas derivan el tenant desde la identidad y la membresía.
  No es necesario, ni suficiente, enviar un `X-Tenant-ID` fijo. El middleware
  legado `tenantMiddleware` aún existe en el router modular y acepta
  `x-tenant-id`/`x-clientum-tenant`; no usarlo para asumir aislamiento en una
  ruta nueva.
- JSON usa `Content-Type: application/json`. Los errores suelen ser
  `{ "error": "...", "code": "..." }`; algunos handlers agregan `details`,
  `success`, `result` o `status`.

## Salud y versión

| Método y ruta | Acceso | Éxito | Fallo |
| --- | --- | --- | --- |
| `GET /health` | público | `200`, servicio/version/estado | — |
| `GET /api/health` | público | igual que `/health` | — |
| `GET /api/version` | público | versión/deploy info | — |
| `GET /api/deploy-version` | público | versión/deploy info | — |
| `GET /ready` | público | `200 {status:"ready",database:"ok"}` | `503 {status:"not_ready",code:"DATABASE_UNAVAILABLE"}` |
| `GET /api/integrations/ping?service=...` | público | estado del servicio | `500` ante error del handler |

El ping acepta servicios como `whatsapp`, `afip` y `mercadopago`, pero no es un
test de entrega ni prueba de CAE/cobro.

## Superficie pública

| Método y ruta | Cuerpo/query | Resultado y requisitos |
| --- | --- | --- |
| `POST /api/public/contacts` | `name,email,phone,company`; `industry,teamSize,message` opcionales | `201 {success,id}`; `400` datos inválidos; `503` si no hay PostgreSQL |
| `POST /api/public/newsletter` | `email` | `201 {success:true}`; `400` email inválido; `503` sin PostgreSQL |
| `POST /api/public-agent` | consulta según el asistente público | `200` respuesta del asistente o fallback; `500` error |
| `GET /api/whatsapp/webhook` | `hub.mode,hub.verify_token,hub.challenge` | `200` challenge si coincide; `403/503` si no está configurado |
| `POST /api/whatsapp/webhook` | payload Meta y firma | `200` acknowledgement; `400/401/503` si payload, firma o configuración fallan |

Los webhooks no llevan sesión de usuario; el handler valida la firma/token y
la configuración específica del proveedor.

## Cuenta, credenciales y claves

| Método y ruta | Uso |
| --- | --- |
| `POST /api/account/bootstrap` | crea/actualiza la membresía y nombre del workspace; requiere sesión y PostgreSQL |
| `GET /api/user-credentials?moduleId=...` | metadata de campos configurados; valores secretos no se devuelven |
| `PUT /api/user-credentials` | `{moduleId,values}`; valida módulo/campos y cifra valores |
| `DELETE /api/user-credentials?moduleId=...` | elimina la credencial del workspace permitido |
| `GET /api/user-api-keys` | lista metadata de claves del usuario/administrador |
| `POST /api/user-api-keys` | crea una clave; conservar el valor una sola vez |
| `DELETE /api/user-api-keys/:keyId` | revoca la clave si el actor tiene permiso |

Respuestas de credenciales no deben interpretarse como prueba de que el
proveedor acepta la clave. Los handlers devuelven `401`, `403`, `404`, `400` o
`503` según identidad, ownership, input o base.

## Workspace y CRM

| Método y ruta | Uso |
| --- | --- |
| `GET /api/crm/bootstrap` | carga registros persistentes y estado inicial |
| `PUT /api/crm/bootstrap` | sincroniza lotes de entidades permitidas |
| `GET /api/crm/duplicates` | candidatos de duplicado del tenant |
| `POST /api/crm/duplicates/resolve` | aplica una decisión de duplicado |
| `POST /api/crm/import-batches` | registra importación reversible |
| `DELETE /api/crm/import-batches/:batchId` | deshace un batch del tenant |
| `DELETE /api/crm/records/:entityType/:entityId` | elimina un registro persistente |
| `GET /api/crm/evidence` / `POST /api/crm/evidence` | evidencia/proveniencia |
| `GET /api/crm/ai-changes` / `POST /api/crm/ai-changes` | auditoría de cambios asistidos por IA |
| Rutas montadas por `src/server/routes/crm.routes` bajo `/api/crm` | router modular; revisar el archivo para operaciones adicionales |

Los handlers validan entidad, tamaño y formato; el import está limitado por el
servidor. Un `PUT` exitoso no significa que Firestore y PostgreSQL estén
sincronizados: describe la ruta que se invocó.

## Agentes y auditoría

| Método y ruta | Uso |
| --- | --- |
| `POST /api/agent/tasks` | crea tarea durable con `kind`, prioridad, input, origen y opcionales de vencimiento/target |
| `GET /api/agent/tasks` | lista tareas acotadas por tenant |
| `POST /api/agent/tasks/:taskId/complete` | completa una tarea permitida |
| `GET /api/audit/server` | consulta auditoría server-side acotada al contexto |

## IA

| Método y ruta | Campos destacados |
| --- | --- |
| `POST /api/ai/copilot` | prompt/contexto del copilot |
| `POST /api/ai/copilot/test-connection` | prueba del proveedor solicitado |
| `GET /api/ai/copilot/provider-status` | estado de configuración |
| `POST /api/ai/cmo` | `query` |
| `POST /api/ai/gtm` | `product`, `audience` |
| `POST /api/ai/adcopy` | `product`, `platform` |
| `POST /api/ai/voice-note` | audio/nota según el componente |
| `POST /api/ai/transcribe` | audio a transcribir |
| `POST /api/ai/prospect` | `niche`, `city`, radio opcional |
| `POST /api/contacts/enrich` | datos disponibles del contacto |
| `POST /api/ai/smart-goals` | contexto de objetivo |
| `POST /api/expense/categorize` | datos del gasto |

La mayoría devuelve `200` con texto/JSON o `400` por campos faltantes; fallos
de proveedor pueden convertirse en fallback `200` o `500`. Consulte
`docs/06-ia-asistentes.md` para no confundir fallback con inferencia real.

## Email

| Método y ruta | Uso |
| --- | --- |
| `GET /api/email/status` | configuración general |
| `GET /api/email/analytics` | métricas con paginación/filtros del handler |
| `POST /api/email/send` | envío desde configuración autorizada |
| `GET /api/email/config` | configuración no secreta |
| `POST /api/email/resend/send` | envío con Resend |
| `GET /api/email/resend/status/:id` | estado Resend o tracking local |
| `POST /api/email/test` | prueba Resend/SMTP; puede devolver `simulated:true` |

## Billing y pagos

La superficie activa de plataforma es `/api/billing`. El bloque
`/api/payments` antiguo responde que el cobro por workspace fue retirado y no
debe documentarse como checkout activo.

| Método y ruta | Uso |
| --- | --- |
| `GET /api/billing/plans` | planes publicados por el servidor |
| `POST /api/billing/trial/start` | inicia estado de trial según validación del handler |
| `GET /api/billing/status?checkoutId=...` | checkouts del usuario |
| `POST /api/billing/mercadopago/checkout` | crea suscripción/preference; devuelve estado `pending` y URL si proveedor responde |
| `PUT /api/billing/subscription/:checkoutId/cancel` | pausa/cancela con `{action:"pause"}` o acción por defecto |
| `POST /api/billing/mercadopago/webhook` | actualiza estado tras consultar/validar el recurso de Mercado Pago |
| `GET /api/payments/status` | ruta de compatibilidad; no asumir que el checkout legacy está activo |
| `POST /api/payments/checkout` / `POST /api/payments/mercadopago/webhook` | compatibilidad/proveedor; confirmar respuesta del handler |

Un checkout `pending` no es un pago confirmado. Nunca simular `approved` en
documentación o UI.

## Cloudflare y Vercel

| Método y ruta | Requisito |
| --- | --- |
| `GET /api/cloudflare/token/verify` | `CLOUDFLARE_API_TOKEN` y configuración de cuenta/zona |
| `GET /api/cloudflare/zones` | token y cuenta válidos |
| `GET /api/vercel/deployments` | `VERCEL_ACCESS_TOKEN`, team opcional |

Errores esperables: `401` sesión ausente, `403` ownership/scope, `400` input,
`404` recurso inexistente, `502` proveedor rechazó, `503` dependencia no
configurada y `500` error inesperado. Los mensajes pueden estar en español o
inglés porque reflejan handlers de distintas generaciones.