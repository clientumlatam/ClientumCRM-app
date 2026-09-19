# Inventario Seguro de Secretos de ClientumCRM

Matriz por módulo del menú con variables, estado actual, clasificación pública/privada y checklist de producción. No contiene valores reales de credenciales.

## 1. Clasificación y Matriz de Variables por Módulo

| Módulo | Variable | Alcance | Clasificación | Propósito / Servicio |
| :--- | :--- | :--- | :--- | :--- |
| **Plataforma / Core** | `PORT` | Servidor | Plataforma | Puerto de escucha (3000) |
| **Plataforma / Core** | `NODE_ENV` | Servidor | Plataforma | Entorno de ejecución (`development` / `production`) |
| **Plataforma / Core** | `WORKFLOW_ENCRYPTION_KEY` | Servidor | Secreto Plataforma | Clave simétrica AES-256 para credenciales de tenant |
| **Plataforma / Core** | `SESSION_SECRET` | Servidor | Secreto Plataforma | Firma de cookies de sesión |
| **Plataforma / Core** | `API_KEY_PEPPER` | Servidor | Secreto Plataforma | Salt/Pepper para hashes de API keys internas |
| **Base de Datos** | `NEON_DATABASE_URL` / `DATABASE_URL` | Servidor | Conexión DB | Cadena de conexión PostgreSQL (Neon o Postgres) |
| **Firebase Auth & DB** | `firebase-applet-config.json` | Cliente/Servidor | Configuración Pública | Configuración de proyecto Firebase y Firestore |
| **Cobranzas (Mercado Pago)**| `MERCADOPAGO_ACCESS_TOKEN` | Tenant (Cifrado) | Secreto Tenant | Token de producción/sandbox para suscripciones |
| **Cobranzas (Mercado Pago)**| `MERCADOPAGO_WEBHOOK_SECRET` | Tenant (Cifrado) | Secreto Tenant | Validación criptográfica de firmas de webhook |
| **Cobranzas (Mercado Pago)**| `MERCADOPAGO_PUBLIC_KEY` | Tenant (Público) | Público Tenant | Public Key para checkout frontend |
| **Prospección B2B** | `GOOGLE_MAPS_SERVER_API_KEY` | Tenant (Cifrado) | Secreto Tenant | Consultas server-to-server a Places & Geocoding |
| **WhatsApp Omnicanal** | `WHATSAPP_ACCESS_TOKEN` | Tenant (Cifrado) | Secreto Tenant | Cloud API Token de Meta |
| **WhatsApp Omnicanal** | `WHATSAPP_PHONE_NUMBER_ID` | Tenant (Cifrado) | Secreto Tenant | Identificador de número de teléfono en Meta |
| **IA Copilot (Gemini)** | `GEMINI_API_KEY` | Servidor | Secreto Plataforma | Acceso a Google Gemini 3.8 en server-side |
| **Webmail Cloudflare** | `CLOUDFLARE_API_TOKEN` | Servidor/Tenant | Secreto | Gestión de registros DNS y rutas de correo |
| **Correo Transaccional** | `SMTP_USER` / `SMTP_PASS` | Servidor | Secreto | Envío de notificaciones vía Nodemailer |

---

## 2. Checklist de Seguridad para Producción

1. **Aislamiento Multi-Tenant**: Ninguna credencial de un tenant debe ser accesible por otro usuario o workspace.
2. **Cifrado en Reposo**: Todos los secretos de usuario/tenant se almacenan cifrados con AES-256-GCM.
3. **No Exposición en el Navegador**: Claves de servidor (`GEMINI_API_KEY`, tokens de pago y webhook secrets) nunca se exponen al cliente.
4. **Validación de Identidad**: Toda petición a `/api/user-credentials` requiere autenticación verificada.
