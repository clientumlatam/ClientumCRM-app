# 05 · Integraciones, Salud del Sistema y Facturación AFIP

## 1. Panel de Estado de Salud (`IntegrationHealthPanel`)
ClientumOS incluye un monitor operativo en tiempo real accesible desde la pestaña de Ajustes e Integraciones. Realiza sondeos de diagnóstico (*ping*) a las tres pasarelas críticas:
- **WhatsApp Cloud API (Meta)**: Verificación de latencia y estado de tokens de webhook.
- **AFIP Web Services (WSFE / WSAA)**: Comprobación de certificados digitales y disponibilidad de homologación/producción.
- **Mercado Pago API**: Validación de credenciales de cobro y pasarela transaccional.

## 2. Facturación Electrónica AFIP
ClientumOS se integra con los Web Services de AFIP utilizando una arquitectura de proxy en el servidor para manejar la autenticación y el intercambio de XML (SOAP).

### Flujo de Autenticación (WSAA)
1. **Generación de CSR**: El sistema genera una solicitud de firma de certificado (CSR).
2. **Carga de Certificado**: El usuario carga su certificado CRT obtenido en el portal de AFIP.
3. **Obtención de Token (TRA)**: El servidor firma un Ticket de Requerimiento de Acceso (TRA) usando la clave privada del usuario, lo envía a AFIP y recibe un Token (Access Token) y Sign (Firma) válidos por 12 horas.

### Emisión de Comprobantes (WSFE)
- El sistema utiliza el `Access Token` para autorizar solicitudes de CAE (Código de Autorización Electrónico).
- Soporta Facturas A, B, C y Notas de Crédito/Débito.
- Validación de montos, alícuotas de IVA y CUITs de receptores en tiempo real.

## 3. Formulario de Carga Segura AFIP (`AfipConfigurationForm`)
Permite a los usuarios configurar su CUIT, punto de venta y cargar los archivos de infraestructura fiscal:
- **Certificado Digital (`.crt` / X.509)** y **Clave Privada (`.key` / RSA)**.
- **Validación previa del cliente**: Verificación estricta de extensiones y firmas en formato PEM (`-----BEGIN CERTIFICATE-----` / `-----BEGIN PRIVATE KEY-----`) antes de la subida.
- **Cifrado de Credenciales**: Las claves privadas se cifran en el servidor antes de persistirse en PostgreSQL para garantizar que solo el proceso de firma WSAA pueda descifrarlas en memoria.
- **Test FEDummy**: Ejecución de diagnóstico para confirmar la conectividad exitosa con AFIP.

## 4. Gestión de Errores Comunes de AFIP
ClientumOS mapea los códigos de error de AFIP a mensajes accionables para el usuario:
- **Error 1001**: "CUIT no autorizado". Verificar que el certificado esté vinculado al servicio en el portal de AFIP.
- **Error 501**: "Fecha de comprobante inválida". El sistema ajusta automáticamente la zona horaria del servidor para coincidir con la de AFIP.
- **Token Expirado**: El middleware de autenticación renueva automáticamente el Ticket de Acceso (TRA) si ha expirado o está próximo a expirar.
