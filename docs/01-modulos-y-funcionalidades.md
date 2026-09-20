# 01 — Catálogo de Módulos y Funcionalidades

Este documento detalla cada una de las secciones, módulos y submódulos disponibles en el dashboard de **Clientum OS**, su propósito, componentes asociados y estado operativo.

---

## 1. Dirección Comercial & CRM

Módulos diseñados para la gestión del ciclo completo de ventas y relaciones con clientes.

### 1.1. Pipeline Kanban (`opportunities`)
- **Componente:** `src/components/opportunities/KanbanView.tsx`
- **Funcionalidad:** Gestión visual drag-and-drop de tratos por etapas de venta (Prospección, Calificación, Propuesta, Negociación, Ganado/Perdido).
- **Características:** Cálculo de valor ponderado del pipeline, probabilidad de cierre estimada por IA, filtros por ejecutivo y acceso directo al asistente de trato.

### 1.2. Directorio de Leads & Prospectos (`leads`)
- **Componente:** `src/components/leads/LeadsView.tsx`
- **Funcionalidad:** Registro, puntuación (lead scoring) y enriquecimiento automático de contactos no calificados antes de convertirlos en oportunidades de venta.

### 1.3. Empresas & Cuentas Corporativas (`companies`)
- **Componente:** `src/components/companies/CompaniesView.tsx`
- **Funcionalidad:** Directorio maestro de organizaciones cliente, con métricas de facturación acumulada, industria, número de empleados y contactos asignados.

### 1.4. Contactos (`contacts`)
- **Componente:** `src/components/contacts/ContactsView.tsx`
- **Funcionalidad:** Libreta unificada de contactos comerciales, roles dentro de la empresa, canales preferidos (WhatsApp/Email) y registro cronológico de interacciones.

### 1.5. Calendario & Citas (`calendar`)
- **Componente:** `src/components/calendar/CalendarView.tsx`
- **Funcionalidad:** Agenda comercial, programación de llamadas de descubrimiento, demos, sincronización con Google Calendar y recordatorios automáticos.

### 1.6. Tareas & Seguimiento (`tasks`)
- **Componente:** `src/components/tasks/TasksView.tsx`
- **Funcionalidad:** Tablero de pendientes comerciales, prioridades, vencimientos y delegación de actividades entre miembros del equipo.

### 1.7. Generador de Propuestas Comerciales PDF (`proposals`)
- **Componente:** `src/components/proposals/ProposalsView.tsx`
- **Funcionalidad:** Creación dinámica de cotizaciones comerciales con cálculo de impuestos, plantillas profesionales, generación de PDF imprimible y link de aprobación para clientes.

### 1.8. Brochures Comerciales (`brochure`)
- **Componente:** `src/components/brochure/BrochureView.tsx`
- **Funcionalidad:** Catálogo digital interactivo de servicios, calculadora de planes de suscripción y visor de folletos corporativos para presentaciones con prospectos.

### 1.9. Portal VIP para Clientes (`portal`)
- **Componente:** `src/components/portal/PortalView.tsx`
- **Funcionalidad:** Vista autogestionada para clientes corporativos donde pueden consultar el estado de sus proyectos, descargar facturas, pagar suscripciones y enviar tickets.

### 1.10. Reportes & Analítica Comercial (`reports`)
- **Componente:** `src/components/reports/ReportsView.tsx`
- **Funcionalidad:** Métricas de conversión, velocidad del pipeline, rendimiento individual de vendedores y proyecciones de ingresos mensuales (MRR/ARR).

### 1.11. Gestión Documental (`documents`)
- **Componente:** `src/components/documents/DocumentsView.tsx`
- **Funcionalidad:** Repositorio centralizado de contratos, acuerdos NDA, manuales y archivos adjuntos vinculados a cuentas y oportunidades.

---

## 2. Prospección B2B & Inteligencia de Mercado

Herramientas para la adquisición proactiva y análisis de competencia.

### 2.1. Google Maps Prospector (`googleMaps`)
- **Componente:** `src/components/prospecting/GoogleMapsProspectorView.tsx`
- **Funcionalidad:** Búsqueda y extracción de negocios locales por rubro, zona geográfica y valoración, con opción de importación directa al CRM con un solo clic.

### 2.2. Radar de Competencia (`competitiveRadar`)
- **Componente:** `src/components/intelligence/CompetitiveRadarView.tsx`
- **Funcionalidad:** Monitoreo de competidores directos, análisis de precios, matriz FODA y detección de brechas de mercado.

### 2.3. Suite SEO & Auditoría Web (`seoSuite`)
- **Componente:** `src/components/marketing/SEOSuiteView.tsx`
- **Funcionalidad:** Diagnóstico de posicionamiento orgánico, análisis de palabras clave y auditoría técnica on-page de dominios de clientes.

### 2.4. Estrategia Go-to-Market (`gtmPlan`)
- **Componente:** `src/components/intelligence/GTMStrategyView.tsx`
- **Funcionalidad:** Planificador estratégico de lanzamiento de productos, definición de ICP (Perfil de Cliente Ideal) y diseño de propuesta de valor.

---

## 3. Comunicación Omnicanal

Centro unificado de atención y mensajería multicanal.

### 3.1. WhatsApp WACE Hub (`whatsapp`)
- **Componente:** `src/components/whatsapp/WhatsAppChatView.tsx`
- **Funcionalidad:** Bandeja de mensajería estilo WhatsApp Web, vinculación por código QR / WebSocket, respuestas rápidas y plantillas autorizadas.

### 3.2. Bandeja de Entrada Unificada (`unifiedInbox`)
- **Componente:** `src/components/communications/UnifiedInboxView.tsx`
- **Funcionalidad:** Consolidación de conversaciones provenientes de WhatsApp, correo electrónico y chat web en una sola línea de tiempo por cliente.

### 3.3. Campañas de Mensajería Masiva (`campaigns`)
- **Componente:** `src/components/marketing/CampaignsView.tsx`
- **Funcionalidad:** Envío segmentado de comunicados, newsletters y promociones con métricas de tasa de apertura y clics.

### 3.4. Auto-Respuesta Inteligente (`autoResponder`)
- **Componente:** `src/components/communications/AutoResponderView.tsx`
- **Funcionalidad:** Reglas de atención automática fuera de horario de oficina y enrutamiento inteligente de consultas frecuentes hacia agentes IA.

### 3.5. Webmail Corporativo (`webmail`)
- **Componente:** `src/components/webmail/WebmailView.tsx`
- **Funcionalidad:** Cliente de correo electrónico profesional integrado con redactor enriquecido, carpetas (Recibidos, Enviados, Borradores) y adjuntos.

### 3.6. Integración WordPress & CMS (`wordpress`)
- **Componente:** `src/components/integrations/WordPressSyncView.tsx`
- **Funcionalidad:** Sincronización bidireccional con sitios WordPress/WooCommerce para captura de pedidos y formularios de contacto.

---

## 4. IA & Automatización de Agentes

Automatización de tareas complejas mediante modelos generativos avanzados.

### 4.1. AgenteOS — Suite de 14 Agentes Especializados (`powerSuite`)
- **Componente:** `src/components/power/PowerSuiteView.tsx`
- **Roles Disponibles:**
  1. **SDR / Prospección 24/7:** Generación de secuencias de email frío y cadencias multicanal.
  2. **Copywriter Persuasivo:** Creación de titulares, anuncios y páginas de venta.
  3. **Analista Financiero:** Proyecciones de flujo de caja y análisis de costos.
  4. **Especialista Legal:** Redacción de cláusulas contractuales y acuerdos.
  5. **Consultor de Estrategia:** Planes de escalamiento y optimización de precios.
  6. **Soporte Nivel 1:** Resolución de dudas comunes y generación de FAQs.
  7. **Optimizador de Procesos:** Diagramación de flujos de trabajo eficientes.
  8. **Generador de Ofertas Irresistibles:** Estructuración de paquetes comerciales.
  9. **Especialista en Retención:** Tácticas anti-churn y programas de fidelización.
  10. **Auditor de Conversión Web:** Detección de fricciones en funnels.
  11. **Especialista en Pricing:** Estrategias de precios dinámicos y bundling.
  12. **Investigador de Mercado:** Benchmarking y tendencias de la industria.
  13. **Gestor de Crisis:** Protocolos de respuesta rápida y comunicación corporativa.
  14. **Asistente Ejecutivo:** Síntesis de reuniones y actas de acuerdos.

### 4.2. Agente SDR Prospección (`sdrOutreach`)
- **Componente:** Submódulo interno de `PowerSuiteView` mapeado a la pestaña `'outreach'`.
- **Funcionalidad:** Creación de cadencias comerciales automatizadas y redacción de correos con ganchos personalizados.

### 4.3. Generador de Ad Copy (`adCopy`)
- **Componente:** Submódulo de `PowerSuiteView` enfocado en copywriting publicitario para Meta Ads, Google Ads y LinkedIn.

### 4.4. AI Copilot Modal & Floating Assistant (`AICopilot.tsx`)
- **Componente:** `src/components/ai/AICopilot.tsx`
- **Funcionalidad:** Asistente conversacional omnisciente disponible en todo el dashboard. Analiza tratos en tiempo real, sugiere respuestas a clientes y ejecuta acciones contextuales.

---

## 5. Operaciones, ERP & Facturación

Gestión de la operativa diaria, inventario y finanzas.

### 5.1. ERP & Logística (`erp`)
- **Componente:** `src/components/erp/ERPLogisticsView.tsx`
- **Funcionalidad:** Control de inventario, órdenes de compra a proveedores, seguimiento de envíos y gestión de almacenes.

### 5.2. Facturación Electrónica AFIP (`invoicing`)
- **Componente:** `src/components/invoicing/InvoicingView.tsx`
- **Funcionalidad:** Emisión de comprobantes fiscales (Facturas A, B, C, Notas de Débito y Crédito), validación de CUIT, cálculo de IVA y obtención de CAE.

### 5.3. Tienda Digital & Catálogo (`store`)
- **Componente:** `src/components/store/StoreView.tsx`
- **Funcionalidad:** Vitrina de productos y servicios digitales con carrito de compras y checkout integrado.

### 5.4. Suscripciones & Mercado Pago (`subscriptions`)
- **Componente:** `src/components/subscriptions/SubscriptionsView.tsx`
- **Funcionalidad:** Administración de membresías recurrentes, cobros automatizados, reintentos de pago y métricas de cobro.

### 5.5. Campus Virtual LMS (`campus`)
- **Componente:** `src/components/campus/CampusView.tsx`
- **Funcionalidad:** Plataforma de capacitación para clientes y colaboradores con lecciones en video, cuestionarios y certificados de aprobación.

### 5.6. Diseñador de Workflows (`workflows`)
- **Componente:** `src/components/workflows/WorkflowsView.tsx`
- **Funcionalidad:** Constructor visual de automatizaciones lógicas tipo *Trigger -> Condition -> Action* (ej: "Al ganar un trato, crear factura y enviar WhatsApp").

---

## 6. Infraestructura, Seguridad & Gobernanza

Administración de la plataforma, roles y auditoría.

### 6.1. Gestión de Equipo & Usuarios (`team`)
- **Componente:** `src/components/team/TeamView.tsx`
- **Funcionalidad:** Alta de colaboradores, asignación de cuentas, cuotas comerciales y estados de actividad.

### 6.2. Configuración de Roles & Permisos (`roles`)
- **Componente:** `src/components/settings/SettingsView.tsx` (Subpestaña Roles)
- **Funcionalidad:** Matriz de control de acceso basado en roles (RBAC): Super Administrador, Gerente Comercial, Ejecutivo de Ventas y Soporte.

### 6.3. Hub de Integraciones (`integrations`)
- **Componente:** `src/components/settings/SettingsView.tsx` (Subpestaña Integraciones)
- **Funcionalidad:** Configuración de claves de API, webhooks, credenciales de OpenRouter, OpenAI, WhatsApp y pasarelas de pago.

### 6.4. Auditoría & Logs SOC2 (`auditLogs`)
- **Componente:** `src/components/settings/SettingsView.tsx` (Subpestaña Auditoría)
- **Funcionalidad:** Registro inmutable de eventos de seguridad (inicios de sesión, exportaciones de datos, modificaciones de roles y accesos a claves).

### 6.5. Consola de Base de Datos & Schema SQL (`schemaViewer`)
- **Componente:** `src/components/database/SchemaViewer.tsx`
- **Funcionalidad:** Visualizador interactivo de tablas relacionales, relaciones de claves foráneas y ejecución de diagnósticos de base de datos.

### 6.6. Gestión de Dominios & DNS (`domains`)
- **Componente:** `src/components/domains/DomainManagementView.tsx`
- **Funcionalidad:** Configuración de dominios personalizados, verificación de registros CNAME/TXT y emisión de certificados SSL automáticos.

### 6.7. Consola de Administración Global (`admin`)
- **Componente:** `src/components/admin/AdminConsoleView.tsx`
- **Funcionalidad:** Panel de control de tenencia múltiple para supervisar recursos del sistema, estado del backend y métricas operativas.
