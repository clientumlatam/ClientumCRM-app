# 10 · Guía de contribución

## Antes de abrir un cambio

- Explica si la modificación es de código, documentación, migración o
  integración.
- Comprueba que no incluye secretos, datos personales, capturas innecesarias o
  archivos generados.
- Si describe un proveedor, marca si está implementado, configurable,
  simulado o planificado.
- Si cambia una ruta o respuesta, actualiza `docs/03...` y `docs/11...`.

## Verificación

```bash
npm run lint
npm run build
npm run check:root-layout
npm run check:artifact-inventory
npm run smoke:navigation
npm run smoke:credentials
npm run smoke:auth
```

Documenta qué comandos necesitan PostgreSQL, Firebase o credenciales. No
afirmes que un check pasó si el entorno no permitió ejecutarlo.

## Convenciones

- Componentes funcionales y TypeScript consistente con el código existente.
- APIs externas solo en servidor cuando usan secretos.
- Consultas SQL parametrizadas y siempre acotadas al tenant/usuario.
- Cambios de esquema acompañados por migración y guía operativa.
- Links relativos en Markdown; usar nombres exactos de archivo.

## Pull requests

Describe el comportamiento verificable, las limitaciones y los pasos de
reproducción. Los documentos del archivo
[design-review](./design-review/index.md) no deben usarse
como fuente de contrato de runtime sin confirmar el código.