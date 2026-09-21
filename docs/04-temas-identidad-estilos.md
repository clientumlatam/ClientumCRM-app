# 04 · Temas, identidad visual y estilos

Esta página describe las convenciones que existen en el código, no sustituye
una futura guía de marca comercial. Las propuestas detalladas del archivo de
revisión están en [`design-review/`](./design-review/index.md).

## Implementación

- `src/index.css` contiene los tokens y reglas globales.
- Tailwind CSS v4 se integra desde Vite.
- `ThemeContext` administra modo claro/oscuro; partes de la UI conservan
  clases oscuras específicas, por lo que los cambios visuales deben probar
  ambos modos.
- `lucide-react` es la biblioteca de iconos usada por la aplicación.
- `motion`, Recharts y otras dependencias aportan interacción y visualización
  donde el componente las usa.

## Estado de una recomendación visual

| Fuente | Uso |
| --- | --- |
| `src/index.css` y componentes activos | Contrato implementado |
| `config/sidebar.ts` y vistas | Jerarquía y labels actuales |
| `docs/design-review/` | Recomendación o evidencia; no normativa |
| Capturas/PDF del archivo | Referencia histórica; no se ejecutan |

Antes de adoptar un color, tipografía o layout del archivo de diseño, comprobar
su contraste, el tema oscuro y la implementación actual. No documentar un
“manual” como capacidad funcional.