# 04 — Guía de Integraciones y Requisitos de Producción

Este documento especifica cómo operan los módulos que interactúan con servicios de terceros y cuáles son los requisitos de credenciales para pasar de modo de simulación a producción real.

---

## 1. Matriz General de Integraciones

| Módulo | Modo Local / Simulación | Requisitos para Producción Real |
| :--- | :--- | :--- |
| **Google Maps Prospector** | Búsqueda sobre dataset local de prospectos B2B e importación al CRM. | `GOOGLE_MAPS_API_KEY` (Places API & Geocoding) configurada en Ajustes o `.env`. |
| **WhatsApp WACE Hub** | Bandeja de mensajes, simulador interactivo de conversaciones y respuestas rápidas. | Instancia activa de WebSocket Baileys / Meta Cloud API con escaneo de código QR. |
| **Facturación AFIP** | Generación de facturas A, B y C, cálculo automático de alícuotas y simulación de CAE. | Certificado `.crt` digital, clave privada `.key` y CUIT habilitado en Web Services de AFIP (WSFEv1). |
| **Mercado Pago & Suscripciones** | Modal de checkout con selección de planes y confirmación visual de pagos. | `MERCADO_PAGO_ACCESS_TOKEN` / Public Key para procesamiento de cobros bancarios reales. |
| **Webmail Corporativo** | Bandeja de entrada, carpetas y redacción de emails con guardado local. | Credenciales SMTP/IMAP corporativas o Worker de Cloudflare Email Routing. |
| **WordPress & WooCommerce** | Sincronización simulada de catálogo y formularios de contacto. | Application Password de WordPress y URL del endpoint REST `/wp-json/wp/v2/`. |

---

## 2. Configuración Detallada por Servicio

### 2.1. Google Maps Places API (Prospección)
1. Ir a la consola de [Google Cloud Platform](https://console.cloud.google.com/).
2. Habilitar la **Places API (New)** y **Geocoding API**.
3. Generar una API Key con restricción de dominio o IP.
4. Ingresar la clave en **Ajustes > Hub de Integraciones > Google Maps**.

### 2.2. WhatsApp WACE Hub (Mensajería)
1. **Opción Baileys (Multi-dispositivo):** Iniciar el servidor local de WebSocket y escanear el código QR mostrado en la interfaz con la app de WhatsApp en el móvil.
2. **Opción Meta Cloud API:** Configurar el *Phone Number ID*, *WhatsApp Business Account ID* y *System User Token* en el Hub de Integraciones.

### 2.3. Facturación Electrónica AFIP (Argentina)
1. Ingresar con Clave Fiscal a la web de AFIP y acceder al servicio *Administrador de Relaciones de Clave Fiscal*.
2. Delegar el servicio *Facturación Electrónica* al CUIT de la empresa.
3. Generar el Certificado Digital y Clave Privada mediante OpenSSL o la utilidad integrada en Clientum.
4. Cargar los archivos en **Ajustes > Integraciones > AFIP Facturación**.

### 2.4. Mercado Pago (Cobros & Suscripciones)
1. Acceder al [Panel de Desarrolladores de Mercado Pago](https://www.mercadopago.com/developers/).
2. Crear una aplicación de tipo *Pagos Online* o *Suscripciones*.
3. Copiar el `Access Token` de producción y la `Public Key`.
4. Pegar los valores en **Ajustes > Integraciones > Mercado Pago**.

### 2.5. Webmail & Servidores SMTP/IMAP
Para habilitar el envío y recepción real de correos electrónicos corporativos:
- **Host SMTP:** `smtp.tudominio.com` (Puerto 465 SSL o 587 TLS).
- **Host IMAP:** `imap.tudominio.com` (Puerto 993 SSL).
- **Autenticación:** Usuario de correo y contraseña de aplicación.
