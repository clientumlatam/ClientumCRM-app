# ClientumOS — índice de documentación

La documentación detallada está en español. El código y la configuración son
la fuente de verdad; cada afirmación de producto debe leerse junto con su
estado: **implementado**, **configurable/dependiente de proveedor**,
**demo/simulado**, o **planificado**.

## Orden recomendado para desarrolladores y operadores

1. [01 · Arquitectura y topología de runtime](./01-arquitectura-runtime.md)
2. [02 · Estructura del proyecto](./02-estructura-proyecto.md)
3. [03 · Navegación, rutas y aliases](./03-navegacion-rutas-aliases.md)
4. [04 · Temas e identidad visual](./04-temas-identidad-estilos.md)
5. [05 · Integraciones, persistencia y salud](./05-integraciones-persistencia-salud.md)
6. [06 · IA y asistentes](./06-ia-asistentes.md)
7. [07 · Entorno, migraciones y despliegue](./07-entorno-migraciones-despliegue.md)
8. [08 · Mantenimiento y estado verificado](./08-mantenimiento-estado-verificado.md)
9. [09 · Onboarding de desarrolladores](./09-onboarding-desarrolladores.md)
10. [10 · Contribución](./10-guia-contribucion.md)
11. [11 · Referencia REST](./11-referencia-rest.md)
12. [Roadmap de implementación](./roadmap-implementacion.md)

## Guía para usuarios de producto

- [12 · Guía de uso de ClientumOS](./12-guia-uso.md): acceso, workspace,
  CRM, canales, IA, ERP, importaciones, ajustes y resolución de problemas.

## Material no normativo

- [Archivo de revisión de diseño](./design-review/index.md): decisiones
  visuales, comparativas y estrategia, separadas del contrato de runtime.
- [Inventario de evidencia de revisión](./design-review/archive/review-evidence/index.md):
  snapshots y evidencias que no se ejecutan ni definen la implementación.
- [Archivo histórico de actividad](./archive/index.md): registros de revisiones
  anteriores, separados de la documentación vigente.
- Los documentos dentro del archivo de diseño, además de cualquier dashboard o
  snapshot generado, son recomendaciones o evidencia histórica salvo que una
  página canónica los cite expresamente como decisión adoptada.

## Convenciones de estado

| Estado | Significado |
| --- | --- |
| Implementado | Hay código activo y una ruta o flujo verificable en este repositorio. |
| Configurable | El flujo existe, pero requiere PostgreSQL, secreto, cuenta o proveedor externo. |
| Demo/simulado | La UI o el servidor devuelve datos locales/fallback; no prueba entrega real. |
| Planificado | Es una idea o recomendación; no debe describirse como capacidad disponible. |
