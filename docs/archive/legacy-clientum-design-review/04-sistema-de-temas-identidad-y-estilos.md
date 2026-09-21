# 04 · Sistema de Temas, Identidad Visual y Estilos Modulares

## 1. Fundamentos de Estilado y Tailwind CSS v4
ClientumOS implementa un sistema de diseño basado en **Tailwind CSS v4** y variables CSS personalizadas inyectadas en `:root` y clases de soporte dinámico. Esto permite una transición fluida entre modos (Claro, Oscuro y Sistema) sin recargas ni latencia.

## 2. Paleta Cromática y Cumplimiento del Manual de Marca (Versión 1.0)
La interfaz de usuario obedece estrictamente a los lineamientos visuales oficiales de Clientum:
- **`--clientum-navy` (`#022046`)**: Azul profundo institucional para fondos de portada, bloques premium y tarjetas de alta distinción.
- **`--clientum-blue` (`#002B5C`)**: Azul corporativo principal para barras de navegación, encabezados y superficies estructuradas.
- **`--clientum-action` (`#0056B3`)**: Azul dinámico reservado exclusivamente para botones principales (CTA), enlaces e interactividad primaria.
- **`--clientum-success` (`#4CAF50`)**: Verde institucional empleado únicamente para indicadores de éxito, confirmaciones y crecimiento.
- **`--clientum-surface` (`#F5F7FA`)**: Superficie de apoyo ultra-clara para canvas, fondos de módulos y separación de secciones.

## 3. Tipografía y Escala Tipográfica
- **Familia tipográfica principal**: `Inter`, con alternativas de sistema en sans-serif.
- **Jerarquía**: Pesos diferenciados (Bold 700 para titulares H1, SemiBold 600 para secciones H2, Medium 500 para tarjetas y Regular 400 para cuerpo de texto y notas auxiliares).

## 4. Componentes y Clases Modulares (`index.css`)
Las clases personalizadas agrupan patrones repetitivos para mantener la consistencia visual:
- `.crm-card`: Superficies limpias con bordes redondeados moderados (12–16px) y sombras suaves.
- `.crm-button`: Botones interactivos con escala de padding óptima y respuesta hover precisa.
- `.crm-badge`: Etiquetas de estado con contraste validado (WCAG AA).
