# 08 · Mantenimiento y estado verificado

## Comandos de verificación

```bash
npm run lint
npm run build
npm run check:root-layout
npm run check:artifact-inventory
npm run smoke:navigation
npm run smoke:credentials
npm run smoke:auth
```

Los smoke tests que llaman a la API necesitan un servidor en ejecución y el
entorno que indiquen sus scripts. `npm run lint` es un chequeo de TypeScript;
no equivale a una prueba de integración.

## Cambios seguros

- Mantener los nombres de migración numerados y revisar SQL antes de aplicarlo.
- Probar con una base aislada antes de usar datos de producción.
- No poner secretos en `VITE_*`, snapshots, documentación ni commits.
- Al tocar `server.ts`, reiniciar el workflow: el hot reload del cliente no
  garantiza que el proceso Express haya cambiado.
- Verificar links y status de integraciones después de cambiar la UI.

## Estado documentado

| Área | Estado actual |
| --- | --- |
| CRM local y navegación | Implementado |
| CRM durable y calidad de datos | Implementado cuando PostgreSQL está listo |
| Firebase Auth | ID tokens verificados por Firebase Admin en producción; fallback demo solo en desarrollo |
| Bóveda de credenciales | Implementada con PostgreSQL o archivo cifrado local; requiere secreto en producción |
| IA | Rutas y fallbacks implementados; calidad/entrega depende del proveedor |
| AFIP | Configuración y superficie de módulo; operación fiscal depende de certificados y pruebas reales |
| WhatsApp, email y Maps | Rutas/componentes con dependencias externas; no asumir entrega por la mera presencia de la UI |
| Billing Mercado Pago | Flujo de plataforma y webhooks; requiere token, URL pública, PostgreSQL y confirmación |
| Verificación de identidad backend | Implementada; producción requiere credencial server-only de Firebase Admin |

## Roadmap

El backlog priorizado y sus criterios de terminado están en el
[roadmap de implementación](./roadmap-implementacion.md). No se publican fechas
ni promesas de módulos futuros desde esta página. Ideas de los documentos de
revisión deben permanecer etiquetadas como **planificadas** hasta que exista
código, configuración y una prueba reproducible. Al añadir una capacidad,
actualizar primero el estado verificable y después la guía de usuario y la
referencia API.