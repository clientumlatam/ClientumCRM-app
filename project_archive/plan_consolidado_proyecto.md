# Plan consolidado del proyecto

## Producto

ClientumCRM integra CRM, captación web, operaciones comerciales, ERP,
e-commerce, automatizaciones y herramientas de IA en un workspace autenticado.

## Prioridades

1. Mantener los datos y credenciales aislados por workspace.
2. Mantener la autenticación y la persistencia como requisitos explícitos para
   las funciones privadas.
3. Integrar proveedores externos mediante configuración verificable y errores
   visibles; no simular entregas, pagos o estados de producción.
4. Conservar rutas públicas ligeras y una interfaz usable en escritorio y
   móvil.

## Estado de publicación

Antes de publicar, ejecutar el typecheck, el build, los checks de navegación,
credenciales, inventario de artefactos y layout de raíz. Las variables de
producción y los webhooks deben verificarse en el entorno de despliegue.