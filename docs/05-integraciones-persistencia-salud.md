# 05 · Integraciones, persistencia y salud

## Estados que deben distinguirse

- **Implementado:** existe código de la ruta y una respuesta verificable.
- **Configurable:** el flujo requiere una cuenta, secreto, certificado,
  PostgreSQL o configuración introducida por el workspace.
- **Demo/simulado:** la UI o el servidor devuelve fallback/local data y no
  confirma una llamada o entrega externa.
- **Planificado:** aparece en una propuesta, roadmap o archivo de revisión,
  pero no está respaldado por un flujo activo.

## PostgreSQL

El servidor crea el esquema de credenciales y aplica las migraciones numeradas
cuando hay conexión. CRM durable, tenants, credenciales cifradas, auditoría,
import batches y billing de plataforma requieren PostgreSQL. El endpoint
`/ready` solo responde `200` cuando esa base está disponible. `/health` no
comprueba la base.

## Bóveda de credenciales

Los formularios de módulos guardan valores de workspace cifrados en el
servidor. Las variables de plataforma de `.env.example` son otra frontera y
no se exponen ni se convierten en credenciales de usuario. El servidor
requiere `WORKFLOW_ENCRYPTION_KEY`, `API_KEY_PEPPER` o `SESSION_SECRET` para
operar la bóveda en producción; el fallback de desarrollo no debe usarse como
secreto de despliegue.

## Proveedores

| Integración | Lo que existe | Dependencias y límites |
| --- | --- | --- |
| Firebase | Auth/Firestore client con configuración pública `VITE_FIREBASE_*`; el backend verifica ID tokens con Firebase Admin | Requiere credencial server-only en producción; el fallback demo no es identidad productiva y no reemplaza PostgreSQL |
| AFIP | UI y módulos de facturación/configuración en el producto | Certificado, clave, CUIT, punto de venta y Web Services deben configurarse; una pantalla no prueba CAE real |
| Mercado Pago | Billing de plataforma, checkout, estado, cancelación/pausa y webhooks | Requiere token de plataforma, `APP_URL`, PostgreSQL y confirmación del proveedor; estados locales pendientes no equivalen a pago |
| Resend/SMTP | Rutas de envío, prueba y estado | Requiere proveedor; sin Resend puede aparecer validación simulada |
| WhatsApp | Pantalla/webhook de Meta y verificación de firma | Requiere token, phone/business IDs, app secret y verify token; no prometer bandeja operativa sin configuración |
| Cloudflare | Verificación de token y consulta de zonas | Requiere token/account/zone; no implica correo o DNS completo |
| Vercel | Consulta de deployments | Requiere token y team opcional; es operación administrativa, no despliegue automático |
| Google Maps/Places | Prospección con Places cuando hay clave | Sin clave puede usar fallback/IA; los resultados de fallback no son datos reales |

## Salud

- `GET /health`, `/api/health`, `/api/version` y `/api/deploy-version` entregan
  un estado básico del proceso.
- `GET /ready` es el único chequeo explícito de disponibilidad de PostgreSQL.
- `GET /api/integrations/ping?service=whatsapp|afip|mercadopago` devuelve la
  forma de estado expuesta por el servidor. Sus etiquetas no sustituyen una
  prueba de envío, factura o cobro.