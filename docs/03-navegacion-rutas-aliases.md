# 03 · Navegación, rutas y aliases

## Dos superficies

Las rutas públicas renderizan `PublicSite`, herramientas de marketing, ayuda y
formularios. Las rutas privadas pasan por `ProtectedRoute` y requieren que el
estado de autenticación del cliente esté listo y autenticado. Una visita a una
ruta privada sin sesión vuelve a `/`.

La navegación es una SPA: `routeRegistry.ts` normaliza pathname y mantiene
aliases, mientras `PrivateEnvironment.tsx` resuelve el `ActiveTab` y carga las
vistas con `React.lazy`. Cambiar un label de sidebar no cambia automáticamente
el contrato URL.

## Rutas canónicas privadas

| Área | Rutas |
| --- | --- |
| Control | `/dashboard`, `/hub/ecosistema`, `/analytics/bi` |
| CRM | `/crm/pipeline`, `/crm/contactos`, `/crm/empresas`, `/crm/tareas`, `/crm/calendario`, `/crm/actividades`, `/crm/propuestas`, `/crm/prospeccion` |
| Comunicación | `/communication/whatsapp`, `/communication/mensajes`, `/communication/webmail`, `/communication/bots`, `/communication/campanas`, `/communication/workspace` |
| IA | `/ai/agentes`, `/ai/copilot`, `/ai/flujos`, `/ai/estrategia` |
| ERP | `/erp/facturacion`, `/erp/operaciones`, `/erp/cobros`, `/erp/tienda`, `/erp/academia`, `/erp/avanzado`, `/erp/vscrm`, `/erp/wordpress` |
| Administración | `/admin/datos`, `/admin/csv`, `/admin/dominios`, `/admin/ajustes`, `/admin/consola`, `/admin/docs` |

Cada entrada tiene aliases históricos bajo `/app/...` y, en algunos casos,
`/crm/...`, `/erp/...` o nombres cortos. La lista completa y vigente está en
`ROUTE_REGISTRY`; no copiar aliases desde una captura o documento de diseño.

## Módulos y disponibilidad

La presencia de una vista significa que el módulo está registrado en la UI.
Persistencia, envío o automatización puede exigir PostgreSQL, credenciales de
workspace o un proveedor. El panel de navegación no es una lista de
integraciones activas.

El sidebar incluye foco, búsqueda, command palette, modales de alta y Copilot.
El modo demo puede mostrar datos semilla y funciones locales para evaluación;
esas acciones no prueban la capacidad de producción.