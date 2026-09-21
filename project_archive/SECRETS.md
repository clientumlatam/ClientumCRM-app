# Inventario seguro de secretos de ClientumCRM

Este archivo es un inventario de configuración, no un almacén de credenciales.
No contiene valores reales de secretos.

## Reglas

- Guardar secretos únicamente en el gestor de secretos del entorno o en la
  configuración privada del despliegue.
- Mantener las variables `VITE_*` limitadas a configuración pública del
  navegador.
- Mantener tokens de proveedores, claves de cifrado y credenciales de correo
  exclusivamente del lado del servidor.
- Revisar las variables requeridas antes de publicar y no copiar valores reales
  a documentación, tickets ni artefactos.

## Pagos

- `PLATFORM_MERCADOPAGO_ACCESS_TOKEN`: secreto del servidor para crear y
  consultar suscripciones de Clientum.
- `PLATFORM_MERCADOPAGO_WEBHOOK_SECRET`: secreto del servidor para validar las
  notificaciones firmadas de Mercado Pago.
- `APP_URL`: URL pública HTTPS usada para retornos y webhooks.

Las credenciales Mercado Pago de cada workspace son independientes de los
secretos de facturación de la plataforma y se guardan en el vault cifrado de
credenciales del workspace.