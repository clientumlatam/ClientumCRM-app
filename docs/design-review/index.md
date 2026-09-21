# Archivo de revisión de diseño de ClientumOS

Esta carpeta conserva material de revisión visual, comparativas y estrategia. Es
**suplementaria y parcialmente histórica**: no define rutas, datos, autenticación,
integraciones ni garantías del producto. Para comportamiento actual, consultar
el [índice técnico canónico](../index.md) y el código fuente.

## Documentos archivados

- [Revisión de diseño](./design-review.md): diagnóstico y recomendaciones de
  jerarquía, navegación y dashboard.
- [Brand Guidelines](./brand-guidelines.md) y [Logo Assets](./logo-assets.md):
  propuestas y reglas visuales; contrastarlas con `src/index.css` y los
  componentes antes de adoptarlas.
- [Guía de integración CSS](./css-integration-guide.md):
  orientación de tokens, no un pipeline ejecutable.
- [Comparativa con CollabWorkspace](./competitor-analysis.md):
  análisis externo/experimental.
- [Estrategia de integración](./integration-strategy.md):
  propuesta generada, no una decisión de arquitectura.
- [Manual de marca de la revisión](./theme-identity-style-reference.md):
  copia de trabajo del archivo de revisión; la página técnica canónica es
  [`docs/04-temas-identidad-estilos.md`](../04-temas-identidad-estilos.md).

## Cómo usarlo

Una recomendación solo pasa a ser comportamiento del producto cuando se refleja
en `src/`, `server.ts`, `api/`, `migrations/` o configuración vigente y se
documenta en las páginas canónicas. No copiar rutas, colores, modelos,
integraciones o fechas desde este archivo sin verificar el código.

Los binarios de `assets/` y los archivos de
`archive/review-evidence/` se conservan como evidencia de la revisión. No son
módulos, fixtures ni archivos de ejecución.