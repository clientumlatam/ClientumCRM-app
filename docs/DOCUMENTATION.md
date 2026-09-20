# 📘 Documentación Integral & Mapa de Ruta — ClientumCRM (ClientumOS)

**ClientumOS** es la plataforma integral de gestión comercial, automatización de ventas e inteligencia de negocios diseñada específicamente para PyMEs y empresas de alto crecimiento en Latinoamérica y mercados globales. Integra un CRM omnicanal, prospección B2B geolocalizada con Google Maps, motor de inteligencia artificial comercial impulsado por Google Gemini y capacidades de trabajo offline PWA.

---

## 🏗️ 1. Arquitectura Técnica & Stack Tecnológico

ClientumCRM está construido con una arquitectura moderna de pila completa (Full-Stack), optimizada para velocidad, resiliencia offline y alta densidad de información:

- **Frontend Core**: React 18+ en TypeScript con Vite y Tailwind CSS v4.
- **Iconografía & Componentes**: Lucide React, Framer Motion (layout y animaciones de transición).
- **Capa de Persistencia & Backend**:
  - *Firebase Firestore*: Base de datos NoSQL de documentos con sincronización en tiempo real y soporte `experimentalAutoDetectLongPolling`.
  - *Serverless Node API (`/api/[...path]`) / Express*: Proxies seguros server-side para integración con Gemini AI API y Google Workspace OAuth.
- **Inteligencia Artificial**: Google Gemini AI (`@google/genai` SDK) en entorno server-side exclusivo para proteger llaves API.
- **Rendimiento & PWA**:
  - *Service Worker v5*: Caché atómica `Network-First` para documentos y `Cache-First` inmutable para assets hashed (`/assets/*`).
  - *Estrategia Vercel*: Revalidación instantánea (`must-revalidate`) para `index.html` y `sw.js`.
- **Internacionalización (i18n)**: Soporte nativo para Español (`es`), Inglés (`en`) y Portugués (`pt`).

---

## 🚀 2. Documentación Detallada de Módulos Actuales

### 📊 2.1. Resumen Ejecutivo Comercial & Dashboard (`Executive Dashboard`)
- **Consola de Control Unificada**: Panel directivo con visión 360° del rendimiento comercial.
- **Métricas Clave en Tiempo Real**:
  - **Pipeline Activo**: Monto acumulado de oportunidades en curso y valor ponderado basado en probabilidades por etapa.
  - **Ventas Confirmadas & Facturación**: Sumatoria de negocios cerrados (*Won*) e integración con facturación AFIP/ERP.
  - **Tasa de Conversión (%)**: Razón de efectividad entre tratos ganados y tratos totales evaluados.
  - **Ciclo de Venta Promedio**: Velocidad de negociación medida en días promedio desde creación hasta cierre.
- **Módulo de Atención Requerida**: Algoritmo de detección de riesgos que destaca automáticamente tratos estancados, tareas vencidas y oportunidades sin contacto reciente.

---

### 🗂️ 2.2. Pipeline de Negocios & Tablero Kanban (`Kanban & Table Views`)
- **Tablero Kanban Dinámico**: Visualización interactiva drag-and-drop estructurada en 7 etapas estándar:
  1. *Lead Cualificado*
  2. *Contacto Inicial*
  3. *Demo / Reunión Agendada*
  4. *Propuesta Enviada*
  5. *Negociación / Revisión Legal*
  6. *Cerrado Ganado (Won)*
  7. *Cerrado Perdido (Lost)*
- **Calificación MEDDIC & Lead Scoring**: Evaluación estandarizada de oportunidades según *Metrics*, *Economic Buyer*, *Decision Criteria*, *Decision Process*, *Identify Pain*, y *Champion*.
- **Filtros Avanzados**: Búsqueda por texto, filtrado por propietario de cuenta, rango de valor financiero, indicador de riesgo y rango de fechas estimadas.
- **Detalle del Registro (Record Drawer)**: Panel lateral flotante con historial cronológico de actividades, notas, correos y cambios de etapa.

---

### 🗺️ 2.3. Prospección B2B Geolocalizada con Google Maps Platform
- **Búsqueda Geográfica Directa**: Identificación de empresas e industrias en cualquier ubicación geográfica mediante la API de Google Maps Place Search.
- **Filtros de Calificación Comercial**: Selección instantánea basada en reputación pública (estrellas ★), volumen de reseñas y datos de contacto públicos (teléfono, sitio web, dirección).
- **Importación 1-Click**: Inserción inmediata de prospectos cualificados hacia el tablero Kanban o el directorio de empresas.

---

### 🤖 2.4. Clientum AI Copilot (Gemini AI Sales Advisor)
- **Interfaz Conversacional Nactiva (`crm-assistant`)**: Shell visual con identidad propia, avatares con estado en vivo, línea de tiempo diaria (`.crm-chat-day`), burbujas de mensaje (`.crm-message`) e indicador de escritura animado (`.crm-message__typing`).
- **Capacidades Analíticas Comercial**:
  - *Diagnóstico del Pipeline*: Evaluación instantánea de riesgos y prioridad en tratos de mayor impacto.
  - *Redacción de Seguimientos*: Generación de correos y mensajes de seguimiento ejecutivos contextualizados.
  - *Manejo de Objeciones*: Argumentarios inmediatos frente a objeciones de precio, tiempos e integración.
- **Acciones Ejecutables**: Creación de tareas en la agenda comercial con 1-click a partir de las recomendaciones del Copilot.

---

### 💬 2.5. Bandeja Omnicanal WhatsApp
- **Consola de Conversación Integrada**: Vinculación de hilos de WhatsApp directamente a las fichas de oportunidades y empresas.
- **Respuestas Rápidas & Plantillas**: Biblioteca de mensajes reutilizables para optimizar los tiempos de primera respuesta.
- **Registro de Interacciones**: Almacenamiento automático de registros de chat y notas en la línea de tiempo del cliente.

---

### 📑 2.6. Generador de Propuestas Comercial & ERP
- **Creador de Cotizaciones Executables**: Generación de documentos comerciales estructurados con desglose de ítems, precios unitarios, descuentos y condiciones de pago.
- **Seguimiento de Apertura**: Trazabilidad de interacción del cliente con el documento enviado.
- **Conversión a Facturación**: Paso directo de presupuestos aprobados a comprobantes de emisión e integración fiscal.

---

### 📋 2.7. Tareas, Actividades & Recordatorios
- **Centro de Control de Tareas**: Clasificación por estado (*Todo*, *In Progress*, *Completed*) y nivel de prioridad (*High*, *Medium*, *Low*).
- **Recordatorios de Seguimiento (Follow-up Reminders)**: Menú desplegable interactivo en la barra superior con alertas de tareas vencidas y acciones comerciales del día.

---

### 🏬 2.8. Directorio 360° de Empresas & Contactos
- **Fichas Unificadas de Cuenta**: Historial completo que consolida información corporativa, ejecutivos asociados, tratos abiertos y cerrado e historial transaccional.
- **Campos Personalizados**: Adaptabilidad total de esquemas según la industria de la empresa.

---

### 🔄 2.9. Centro de Migración 1-Click & TCO
- **Asistente de Importación**: Importación masiva asistida desde CSV/Excel, HubSpot, Salesforce y Zoho.
- **Calculadora TCO (Total Cost of Ownership)**: Demostración transparente de ahorro financiero de hasta un 82% frente a plataformas legacy.

---

## 🗺️ 3. Mapa de Ruta & Hitos de Desarrollo (Roadmap)

El mapa de ruta de ClientumCRM define los hitos de evolución técnica y de producto organizados en versiones release:

```
+-----------------------------------------------------------------------------------+
|  v1.0 (Actual)       -->  v1.5 (Q4 2026)      -->  v2.0 (Q1-Q2 2027) -->  v3.0   |
|  Core CRM & Copilot      Secuencias & Calendar     Workflows & SDR       Enterprise|
+-----------------------------------------------------------------------------------+
```

---

### 🎯 Hito v1.0 — Versión Actual Comercial (Q3 2026) — *[COMPLETADO]*
- [x] **Core CRM & Kanban**: Pipeline visual con 7 etapas, Lead Scoring MEDDIC y filtros avanzados.
- [x] **Clientum AI Copilot Gemini 3.8**: Interfaz `.crm-assistant` integrada con Gemini API server-side.
- [x] **Google Maps B2B Prospection**: Motor de búsqueda e importación 1-Click.
- [x] **Omnicanalidad WhatsApp & Propuestas ERP**: Módulo de mensajería y emisor de presupuestos.
- [x] **PWA Offline & SW v5**: Sincronización offline en segundo plano y revalidación Vercel.
- [x] **i18n Multi-idioma**: Soporte para Español, Inglés y Portugués.

---

### 🎯 Hito v1.5 — Automatización & Integración Calendario (Q4 2026)
- [ ] **Secuencias Automatizadas de Mensajería**:
  - Triggers automáticos por cambio de etapa en el Kanban (ej: envío de plantilla de bienvenida por WhatsApp al pasar a *Contacto Inicial*).
- [ ] **Sincronización Bidireccional con Google Calendar**:
  - Creación automática de eventos en Calendar al programar demos o llamadas en el CRM.
  - Enlaces automáticos a salas de Google Meet.
- [ ] **Analítica Avanzada de Pérdidas & Velocidad**:
  - Gráficos de embudo detallados con motivo de pérdida por etapa y tiempo de permanencia por tratos.

---

### 🎯 Hito v2.0 — Workflows No-Code & Agentes Autónomos (Q1 - Q2 2027)
- [ ] **Motor de Automatización & Workflows Visuales (No-Code)**:
  - Diseñador visual de automatizaciones "If/Then" para reasignación de tratos, creación de tareas y alertas a Slack/Teams.
- [ ] **AI SDR Agente Autónomo de Qualificación**:
  - Agente secundario que responde consultas iniciales de formularios web 24/7 y cualifica la reunión.
- [ ] **Firma Electrónica Embebida en Propuestas**:
  - Captura de firma digital directamente en el visor web de presupuestos.

---

### 🎯 Hito v3.0 — Inteligencia Predictiva & Ecosistema Enterprise (Q3 - Q4 2027)
- [ ] **Conversational Intelligence (Gemini Speech-to-Text)**:
  - Transcripción y análisis automático de grabaciones de llamadas comerciales para extraer objeciones, menciones de competidores y score de interés.
- [ ] **Forecasting Predictivo por Machine Learning**:
  - Modelo de predicción de cierre de ventas a fin de mes basado en velocidad histórica y nivel de interacción.
- [ ] **Portal de Clientes (Self-Service)**:
  - Portal dedicado para que los clientes del usuario consulten el estado de sus propuestas, proyectos y facturas.
- [ ] **Arquitectura Multi-Workspace Enterprise**:
  - Administración jerárquica para holdings con múltiples empresas o unidades de negocio independientes.

---

## 📊 Matriz Resumen de Hitos & Prioridades

| Versión | Hito Principal | Estado | Enfoque Principal |
| :--- | :--- | :--- | :--- |
| **v1.0** | Core CRM, Gemini Copilot, Google Maps, PWA | 🟢 *Completado* | Experiencia de usuario, velocidad y datos en tiempo real |
| **v1.5** | Secuencias WhatsApp/Email, Google Calendar | 🟡 *Próximo* | Reducción de fricción en agenda y comunicación |
| **v2.0** | Workflows No-Code, AI SDR, Firma Digital | 🔵 *En Planificación* | Autonomía comercial y cierre de acuerdos |
| **v3.0** | Conversational Intelligence, ML Forecast, Multi-tenant | 🟣 *Visión Futura* | Inteligencia predictiva y escala Enterprise |
