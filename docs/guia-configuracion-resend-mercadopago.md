# Guía Oficial de Configuración: Resend & Webhooks de Mercado Pago en ClientumCRM

---

## Parte 1: Configuración de Resend para Correos Transaccionales

Resend es la plataforma líder para el envío de correos transaccionales (facturas AFIP, confirmaciones de pago, recuperación de carritos y alertas del CRM). Sigue estos pasos para configurarlo:

### Paso 1: Crear cuenta y verificar tu dominio en Resend
1. Ingresa a [Resend](https://resend.com) y crea una cuenta gratuita o empresarial.
2. Dirígete a la sección **Domains** en el menú lateral y haz clic en **Add Domain**.
3. Ingresa tu dominio (ej. `tudominio.com`).
4. Resend te proporcionará registros DNS (DKIM, SPF y DMARC). Copia estos registros y agrégalos en el panel de tu proveedor de dominio (Cloudflare, DonWeb, Nic.ar, etc.).
5. Haz clic en **Verify Domain**. Una vez verificado, podrás enviar correos desde tu propio dominio.

### Paso 2: Generar tu API Key en Resend
1. En el panel de Resend, ve a **API Keys**.
2. Haz clic en **Create API Key**.
3. Asigna un nombre descriptivo (ej. `ClientumCRM-Production`).
4. Selecciona el permiso **Full Access** o **Sending Access** (restringido al dominio verificado).
5. Copia la clave generada (empieza por `re_...`). **Guárdala de inmediato**, ya que no volverá a mostrarse.

### Paso 3: Configurar las variables en ClientumCRM
En tu archivo de entorno (`.env` o en las variables de tu servidor de producción), configura:
```env
RESEND_API_KEY=re_tu_api_key_generada_aqui
RESEND_FROM_EMAIL=facturacion@tudominio.com
```

---

## Parte 2: Configuración del Webhook de Mercado Pago

Para que ClientumCRM actualice automáticamente las suscripciones y active cuentas de clientes tras un pago exitoso, debes configurar las notificaciones Webhook en Mercado Pago.

### Paso 1: Obtener tus credenciales de Mercado Pago Developers
1. Ingresa a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/).
2. Inicia sesión con tu cuenta de Mercado Pago y ve a **Tus Integraciones**.
3. Crea una nueva aplicación (o selecciona una existente).
4. En las credenciales de producción (o credenciales de prueba para testear), copia tu **Access Token** (empieza por `APP_USR-...` o `TEST-...`).
5. Configura tu variable en el servidor:
   ```env
   PLATFORM_MERCADOPAGO_ACCESS_TOKEN=APP_USR_tu_token_aqui
   ```

### Paso 2: Configurar la URL de Notificaciones (Webhooks)
1. En el panel de tu aplicación de Mercado Pago Developers, busca la sección **Webhooks** (Notificaciones Web).
2. En el campo **URL de producción (Notification URL)**, ingresa la URL pública HTTPS de tu backend de ClientumCRM seguida de la ruta del webhook:
   ```text
   https://tu-dominio.com/api/webhooks/mercadopago
   ```
   *(Nota: Asegúrate de que `APP_URL=https://tu-dominio.com` esté configurado en tus variables de entorno).*
3. Selecciona los eventos que deseas recibir:
   * **Pagos (`payment`)**
   * **Suscripciones / Preaprobaciones (`subscription` / `preapproval`)**
4. Guarda los cambios. Mercado Pago te proporcionará un **Secret** o clave de firma de webhook, el cual debes configurar como:
   ```env
   PLATFORM_MERCADOPAGO_WEBHOOK_SECRET=tu_secreto_webhook_aqui
   ```

### Paso 3: Probar la Integración
1. Realiza una prueba de suscripción o pago desde el módulo de facturación o la pasarela de ClientumCRM.
2. Verifica en la pestaña de Webhooks en Mercado Pago que los eventos devuelvan código `200 OK`.
3. El sistema registrará el pago, actualizará el estado del cliente y emitirá la confirmación correspondiente en tiempo real.
