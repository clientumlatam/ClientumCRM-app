# Revisión visual y de jerarquía — ClientumCRM

## Alcance

Revisión de:

- `src/components/public/PublicHome.tsx`
- `src/components/public/PublicNavbar.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/app/PrivateEnvironment.tsx`
- `src/components/dashboard/ExecutiveDashboardView.tsx`
- `src/index.css`

No se modificaron archivos de `src/`. Las recomendaciones conservan las rutas, los `ActiveTab`, las acciones de `CRMContext` y los módulos que ya existen.

## Dirección recomendada

**Paradigma de layout:** jerarquía por capas y prioridad contextual. Primero la decisión importante de la pantalla; después el detalle y las herramientas secundarias.

**Aesthetic direction:** claridad comercial editorial. Clientum debe sentirse como una herramienta latinoamericana de trabajo serio: cercana, rápida y con criterio operativo. Mantener modo claro, azul Clientum como acción primaria y sumar una superficie cálida de apoyo para que el dashboard no parezca una consola oscura.

**Tipografía:** conservar la familia actualmente usada para evitar una migración innecesaria, pero separar mejor pesos y tamaños. Usar una escala corta: título de página, contexto, dato, etiqueta. Los valores monetarios y contadores pueden conservar tratamiento monoespaciado.

**Color:** hacer que el azul sea reservado para acciones, estados activos y enlaces. Usar superficies marfil o gris azulado muy suave para canvas, blanco cálido para paneles, verde únicamente para estados positivos y ámbar únicamente para atención. No agregar gradientes decorativos al dashboard.

**Diferenciador memorable:** una “línea de acción” constante: cada vista debe responder en pocos segundos qué está pasando, qué requiere atención y cuál es el siguiente paso. No sumar módulos; ordenar los existentes alrededor de esa pregunta.

## Diagnóstico ejecutivo

| Área | Situación actual | Efecto |
| --- | --- | --- |
| Sitio público | Header con utility bar, tres herramientas rápidas, selector de moneda, login, mega-menús y varios badges | La navegación compite con el mensaje de venta |
| Hero público | Tres botones con peso visual similar, párrafo largo y cuatro métricas antes de llegar al producto | No queda claro cuál es la acción principal |
| Sidebar | Seis grupos y muchos módulos visibles al mismo tiempo; hay solapamiento entre canales, IA y operaciones | Alto costo de exploración y baja memoria espacial |
| Navbar privado | Marca, contexto, búsqueda, configuración, portal, idioma, vistas, Copilot, exportación, reset y alta en una sola línea | La barra no distingue acción primaria de mantenimiento |
| Dashboard ejecutivo | El pipeline ocupa el primer plano y el resumen está debajo; el asistente lateral permanece abierto con conversación precargada | El usuario debe leer y cerrar elementos antes de interpretar el negocio |
| CSS del dashboard | `ExecutiveDashboardView` usa muchas superficies y colores oscuros hardcodeados pese al modo claro | El resultado puede sentirse como otro producto y dificulta mantener el tema |
| Consistencia de contenido | Se observan distintas versiones de Gemini y tratamientos de moneda/idioma en el producto | Riesgo de pérdida de confianza y de mensajes contradictorios |

## Recomendaciones de mayor impacto

### P0 — Hacer inequívoca la primera acción

1. En el sitio público, dejar **“Probar Demo Interactiva Gratis”** como único CTA primario del hero.
2. Convertir “Calcular Ahorro & ROI” y “Auditoría Digital 60s” en acciones secundarias de igual familia visual, no en tres botones principales.
3. Mantener `onOpenWizard`, `onOpenAudit`, `onOpenSimulator` y `enterApp`; sólo cambiar su prominencia y ubicación.
4. En el dashboard, reservar el botón azul de alta para la acción contextual que ya resuelve `Navbar.tsx` según `activeTab`. Todo lo demás debe ser secundario o estar dentro de un menú de opciones.

### P0 — Separar resumen de pipeline

En `ExecutiveDashboardView.tsx`, ordenar el contenido en dos niveles sin inventar una ruta nueva:

1. **Resumen ejecutivo:** encabezado, cuatro KPIs, evolución de ingresos, fuentes y una franja breve de pendientes o alertas.
2. **Pipeline:** tablero drag-and-drop debajo, con selector de pipeline y sus acciones propias.
3. El título de la vista debe ser estable y coherente: “Resumen ejecutivo”. El pipeline puede presentarse como “Pipeline comercial” dentro de la misma vista.
4. Mantener drag-and-drop, creación de negocios, filtros y navegación a analíticas. No reemplazar el tablero por una representación estática.
5. En pantallas estrechas, el resumen debe continuar siendo legible antes de pedir desplazamiento horizontal del Kanban.

### P0 — Sacar al asistente IA del centro de gravedad

1. Inicializar `isChatOpen` en `false` para que el dashboard no abra una columna de 345 px antes de que el usuario la pida.
2. Mantener el botón `crm-ai-toggle` en el encabezado, pero tratarlo como herramienta contextual: “Abrir asistente” cuando está cerrado y “Ocultar asistente” cuando está abierto.
3. Al estar cerrado, mostrar sólo el botón de reapertura; no un panel flotante que tape contenido en resoluciones medias.
4. Al abrirlo, usar un drawer lateral sobre el dashboard en lugar de reservar permanentemente espacio. Conservar mensajes, envío, adjuntos, llamada y videollamada.
5. Reducir el transcript de bienvenida precargado a una sola orientación breve o colapsarlo. La conversación de ejemplo no debe parecer una tarea pendiente del usuario.
6. El estado de typing debe tener texto accesible o `aria-label`; los tres puntos solos no comunican el estado a usuarios de tecnologías asistivas.

### P1 — Reducir la navegación pública a decisiones reconocibles

En `PublicNavbar.tsx`:

1. Mantener un solo nivel de navegación visible: `Producto`, `Industrias`, `Precios`, `Recursos`; dejar `Inicio` como marca o primer enlace sólo si la métrica de uso lo justifica.
2. Eliminar la utility bar como banda permanente. Si se conserva, debe contener un único dato operativo y login; trasladar Cotizador ROI, Simulador Bot y Auditoría 60s al hero o al menú Recursos.
3. Quitar los badges “10”, `ARS/USD` y similares de la navegación primaria salvo que respondan una decisión real. La moneda puede seguir disponible en Precios sin ocupar el header entero.
4. Mantener los mega-menús actuales y sus rutas, pero reducir el número de llamadas visuales internas: una acción “Ver todo” por menú y agrupación por intención, no por cantidad de módulos.
5. En móvil, mostrar primero la acción principal, navegación y sesión. Los accesos secundarios deben quedar bajo un grupo expandible, no todos expuestos en el primer viewport.
6. Sustituir banderas y caracteres decorativos por texto accesible (`ARS`, `USD`, `ES`, `EN`, `PT`). El usuario solicitó no usar emojis en la UI.

### P1 — Hacer que el hero venda una idea, no un catálogo

En `PublicHome.tsx`:

1. Acortar el titular a una sola promesa verificable: CRM comercial que convierte conversaciones en ventas.
2. Mantener el contexto latinoamericano en la bajada, pero dividirlo en dos frases: operación local y resultado comercial.
3. Llevar las cuatro métricas a una banda de prueba social posterior a la demo, o reducirlas visualmente a dos métricas principales y dos datos secundarios.
4. Mantener el preview interactivo de Pipeline, WhatsApp y AFIP, pero introducirlo con un encabezado que explique una sola tarea por vez. El preview es evidencia; no debe competir con la promesa.
5. Los tres flujos interactivos deben conservarse. Revisar que el lenguaje de producto sea consistente con el dashboard y que “Gemini 3.6”, “Gemini 3.7” y “Gemini 1.5” no aparezcan como versiones distintas sin una explicación.
6. El chat de demostración debe tener una respuesta de espera visible y un límite de longitud para que el viewport no crezca de forma impredecible cuando se envían mensajes.

### P1 — Convertir el sidebar en un mapa de trabajo

En `Sidebar.tsx`, conservar cada `id` y reducir la exposición inicial:

**Siempre visible**

- Resumen Ejecutivo
- Negocios
- Empresas
- Contactos
- Tareas y Actividades
- Calendario

**Canales**

- WhatsApp CRM
- Webmail Cloudflare
- Mensajes

**Más módulos**

- Agrupar visualmente, mediante secciones colapsables, los grupos existentes de funciones, IA, operaciones y sistema.
- No ocultar módulos sin una vía clara de acceso: el acordeón debe ser navegable por teclado y recordar el estado por sesión si ya existe una estrategia de persistencia.

**Acciones persistentes de baja frecuencia**

- Configuración General, perfil, cerrar sesión y Ver Portal Público deben permanecer en el pie o menú de cuenta, no mezclados con el trabajo diario.

Cambios de jerarquía específicos:

1. Mover “Centro de Funciones” fuera del primer grupo si no es la tarea diaria principal; su badge “Activo” compite con el estado del espacio.
2. Evitar que “WhatsApp CRM”, “Mensajes” y “Chatbot WhatsApp 24/7” parezcan equivalentes. El primero es canal operativo, el segundo es bandeja y el tercero es automatización.
3. Sacar la tarjeta grande de Copilot del flujo de navegación. Convertirla en un acceso compacto cerca del encabezado o dejarla sólo en la acción Copilot de `Navbar.tsx`.
4. Presentar “Cuentas Clave” como bloque opcional y compacto. Si no hay oportunidades, debe existir un estado vacío compuesto en lugar de un bloque sin contenido.
5. Unificar la apariencia del sidebar con las variables de `index.css`. Actualmente el componente contiene clases `text-slate-300`, `bg-slate-800` y similares que lo fuerzan visualmente hacia dark aunque el tema declare superficies claras.

### P1 — Simplificar el navbar privado por contexto

En `Navbar.tsx`:

1. Mantener a la izquierda: menú móvil, título y una descripción corta. El logo ya existe en el sidebar; en escritorio puede reducirse a marca compacta o desaparecer para liberar espacio.
2. Mantener en el centro la búsqueda y filtros sólo cuando el módulo los usa. No mostrar una búsqueda genérica si el tab actual no responde a ella.
3. Mantener a la derecha sólo: configuración del módulo cuando aplique, Copilot, acción primaria y menú “Más”.
4. Llevar “Restablecer Datos de Demostración”, exportación, idioma y Sitio Público a una zona de acciones secundarias. Exportación puede seguir visible sólo en Negocios.
5. No ocultar acciones funcionales sin una etiqueta accesible. Los iconos solos requieren `aria-label`, tooltip consistente y foco visible.
6. Revisar la duplicación de marca entre `Sidebar.tsx` y `Navbar.tsx`; conservarla sólo si tiene una función distinta en móvil.

### P1 — Normalizar la capa visual en `index.css`

1. Crear tokens semánticos únicos para `canvas`, `surface`, `surface-raised`, `border`, `text`, `brand`, `success`, `warning` y `danger`, y usar esos tokens en las reglas `.crm-*`.
2. Reemplazar colores oscuros hardcodeados en `.crm-dashboard`, `.crm-stage`, `.crm-deal-card`, `.crm-panel` y `.crm-assistant` por variables del modo claro.
3. Reservar el contraste fuerte para el estado activo y no para cada panel. La jerarquía puede venir de superficie, borde y espacio, no de fondos casi negros.
4. Mantener la diferenciación del pipeline con una línea, punto o borde de etapa; evitar que cada etapa se convierta en una tarjeta cromática independiente.
5. Revisar sombras y gradientes: usar una sombra de elevación baja para paneles y una sombra mayor sólo para drawers y menús.
6. En `PrivateEnvironment.tsx`, reemplazar la dependencia conceptual de `h-screen` por una estrategia basada en `min-height: 100dvh` y `height: 100dvh` donde corresponda, especialmente para navegador móvil.

## Propuesta de jerarquía por pantalla

### Sitio público

1. Marca y navegación esencial.
2. Promesa principal y CTA de demo.
3. Evidencia interactiva de las tres capacidades existentes.
4. Prueba social y contexto para PyMEs latinoamericanas.
5. Soluciones y sectores, sin presentar todos los módulos con el mismo peso.
6. Precio, recursos y acciones de conversión secundaria.

La propuesta no elimina contenido ni rutas; cambia el orden de atención y el peso visual.

### Dashboard

1. Título, periodo y estado de actualización.
2. Indicadores de negocio que respondan “cómo estamos”.
3. Gráfico y fuentes que expliquen “por qué”.
4. Próximas acciones o alertas existentes, si están disponibles en el estado actual.
5. Pipeline para responder “dónde intervenir”.
6. Asistente IA bajo demanda para responder una pregunta concreta.

## Consistencia de contenido que debe resolverse antes de diseñar

- Versiones de Gemini: en las piezas revisadas aparecen referencias a Gemini 3.6, Gemini 3.7 y Gemini 1.5. Definir una convención de producto o hablar de “Asistente IA” sin versión en las superficies comerciales.
- Moneda: el sitio utiliza ARS y USD, mientras que el dashboard muestra valores sin una indicación contextual uniforme. El encabezado de cada dato monetario debería indicar moneda o usar el selector existente.
- Estados de actualización: “actualizado ahora”, “En línea” y badges de disponibilidad deben referir a estados reales o ser claramente demostrativos.
- Terminología: elegir entre “Negocios”, “Oportunidades” y “Pipeline” según el contexto. No usar los tres como sinónimos en la misma capa.
- Navegación: conservar las rutas existentes de `PublicRoutePath` y los `ActiveTab`; la simplificación debe ser de presentación, no de arquitectura.

## Riesgos de implementación

| Riesgo | Probabilidad | Mitigación |
| --- | --- | --- |
| Ocultar módulos puede interpretarse como eliminación de funcionalidad | Alta | Mantener todos los `id` en secciones colapsables, incluir búsqueda o acceso “Más módulos” y validar con usuarios frecuentes |
| Cambiar el orden del dashboard puede romper expectativas o tests visuales | Media | Hacer primero un reordenamiento de CSS/markup sin eliminar handlers; conservar IDs y eventos actuales |
| El drawer del asistente puede tapar acciones del pipeline | Media | Backdrop sólo en móvil, cierre con Escape, foco inicial y ancho limitado; en escritorio permitir cierre persistente |
| Abrir el asistente cerrado cambia el comportamiento actual | Media | Guardar preferencia por sesión o mostrar un primer estado guiado una sola vez; no perder el historial local |
| La limpieza del header puede esconder ROI, simulador o auditoría | Media | Reubicar las acciones en Hero/Recursos y medir clics por acción antes y después |
| Las clases hardcodeadas dark en dashboard tienen alta especificidad o overrides posteriores | Alta | Auditar el orden de `index.css`, eliminar reglas duplicadas gradualmente y revisar cada breakpoint |
| Unificar moneda e idioma puede alterar valores o traducciones | Media | No tocar datos; modificar sólo etiquetas y presentación, y probar `currency`, `language` y `t()` en cada ruta existente |
| Avatares remotos del dashboard fallan o cargan lento | Media | Reemplazar por iniciales o assets locales aprobados; no depender de URLs externas de imágenes |
| El Kanban drag-and-drop sigue siendo inaccesible con teclado | Alta | Añadir una acción alternativa de cambio de etapa y estados anunciados; no depender sólo de `draggable` |
| El contenido precargado del asistente puede confundirse con datos reales | Media | Etiquetarlo como ejemplo, reducirlo o iniciar con una pregunta contextual vacía |
| `h-screen` y paneles con `overflow: hidden` pueden cortar contenido en móvil | Alta | Probar alturas dinámicas, teclado virtual, scroll interno y orientación horizontal antes de cerrar la implementación |
| Los cambios de nombre en labels pueden afectar snapshots o analítica | Media | Cambiar copy sin tocar IDs, `data-*`, handlers ni nombres de rutas; documentar aliases si son necesarios |

## Plan de implementación sugerido

### Fase 1 — Bajo riesgo

- Ajustar copy y pesos visuales del hero.
- Reducir utility bar y priorizar un CTA.
- Mover acciones secundarias del navbar a un menú.
- Alinear labels de Gemini, moneda y terminología.
- Añadir `aria-label`, estados de foco y textos de estado donde ya existen botones iconográficos.

### Fase 2 — Jerarquía del dashboard

- Reordenar resumen y pipeline dentro de `ExecutiveDashboardView`.
- Cerrar el asistente por defecto y convertirlo en drawer bajo demanda.
- Sustituir estilos oscuros por tokens claros en `index.css`.
- Mantener intactos los callbacks de creación, filtro, drag-and-drop, analíticas y chat.

### Fase 3 — Navegación del espacio de trabajo

- Añadir acordeones de sidebar sin alterar los `ActiveTab`.
- Mover Copilot y Cuentas Clave fuera del flujo principal.
- Revisar responsive en `PrivateEnvironment`, sidebar móvil y top navbar.
- Validar con usuarios que usan módulos menos frecuentes antes de ocultar cualquier sección por defecto.

## Criterios de aceptación visual y funcional

- Una persona nueva identifica la acción principal del sitio público en menos de cinco segundos.
- El header público no presenta más de una acción primaria y dos acciones secundarias visibles.
- El dashboard muestra el estado ejecutivo antes del tablero Kanban.
- El pipeline conserva filtros, drag-and-drop, creación y navegación a analíticas.
- El asistente no ocupa espacio permanente al entrar al dashboard y puede abrirse, cerrarse y usarse sin perder mensajes.
- Todos los módulos existentes siguen disponibles con sus mismos `ActiveTab` y rutas.
- El sidebar presenta una ruta diaria corta y una vía explícita a módulos secundarios.
- No hay emojis en la UI; moneda, idioma y estados se comunican con texto.
- El modo claro mantiene contraste AA, foco visible y lectura cómoda en móvil.
- No se depende de imágenes remotas para representar identidad, personas o estados.

## Resultado esperado

Clientum conserva toda su amplitud funcional, pero deja de mostrarla toda a la vez. El sitio público comunica una decisión comercial clara; el dashboard primero explica el negocio y después permite intervenir; el sidebar funciona como mapa y no como inventario; y la IA pasa de ser una columna permanente a una herramienta disponible cuando aporta contexto.