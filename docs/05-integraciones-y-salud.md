# 05 · Integraciones, Salud del Sistema y Facturación AFIP

## 1. Panel de Estado de Salud (`IntegrationHealthPanel`)
ClientumOS incluye un monitor operativo en tiempo real accesible desde la pestaña de Ajustes e Integraciones. Realiza sondeos de diagnóstico (*ping*) a las tres pasarelas críticas:
- **WhatsApp Cloud API (Meta)**: Verificación de latencia y estado de tokens de webhook.
- **AFIP Web Services (WSFE / WSAA)**: Comprobación de certificados digitales y disponibilidad de homologación/producción.
- **Mercado Pago API**: Validación de credenciales de cobro y pasarela transaccional.

## 2. Formulario de Carga Segura AFIP (`AfipConfigurationForm`)
Permite a los usuarios configurar su CUIT, punto de venta y cargar los archivos de infraestructura fiscal:
- **Certificado Digital (`.crt` / X.509)** y **Clave Privada (`.key` / RSA)**.
- **Validación previa del cliente**: Verificación estricta de extensiones y firmas en formato PEM (`-----BEGIN CERTIFICATE-----` / `-----BEGIN PRIVATE KEY-----`) antes de la subida.
- **Test FEDummy**: Ejecución de diagnóstico para confirmar la conectividad exitosa con AFIP.
