# INFORME DE DIAGNÓSTICO Y ARQUITECTURA DE UNIFICACIÓN: CLIENTUMOS
**Fecha de Diagnóstico:** Septiembre 2026  
**Ecosistema:** ClientumOS (Sistema Operativo PyME para Argentina y LATAM)  
**Objetivo:** Unificación de rutas activas, eliminación de duplicidades entre 'ClientumCRM' y 'Remix ClientumOS', consolidación del Route Registry centralizado y desacople modular de `server.ts`.

---

## 1. Inventario Exhaustivo de Rutas Activas Detectadas en el Código Base

### A. Capa 1: Portal Público Comercial y de Captación (`src/components/public/publicRoutes.ts`)
1. **Soluciones Core del Ecosistema**:
   - `/` : Landing page comercial principal (Hero, 4 pilares, estadísticas PyME y formulario de captura).
   - `/producto` : Visión global del sistema operativo ClientumOS.
   - `/producto/dashboard` : Demostración interactiva del panel ejecutivo de control y KPIs.
   - `/producto/crm` : CRM 360°, Pipeline Kanban de 5 etapas y calificación comercial MEDDIC.
   - `/producto/whatsapp-ia` : Automatización de WhatsApp y atención asistida con Gemini.
   - `/producto/automatizaciones` : Editor visual de flujos DAG sin código.
   - `/producto/marketing` : Campañas masivas de difusión, secuencias y generación de copys.
   - `/producto/seo` : Suite SEO On-Page, auditoría semántica y posicionamiento web.
   - `/producto/erp` : Facturación electrónica AFIP con CAE (Facturas A, B y C).
   - `/producto/bi` : Business Intelligence, análisis de cohortes y forecast.
   - `/producto/agentes-ia` : Organigrama de 14 Agentes Autónomos con AgenteOS.
   - `/producto/integraciones` : Conectores nativos (Mercado Pago, AFIP, WhatsApp Cloud API, Cloudflare, Gmail).

2. **Comercial, Suscripción y Adquisición**:
   - `/precios` | `/planes` : Tabla de precios en ARS con checkout de suscripción de Mercado Pago.
   - `/contacto` | `/demo` : Captura tolerante a fallos de leads previa a derivación a WhatsApp.
   - `/tienda` | `/tienda/central` : Catálogo de add-ons y módulos del ecosistema.
   - `/dominios` : Gestor de dominios corporativos personalizados y DNS.

3. **10 Páginas Verticales por Industria PyME**:
   - `/industrias/agro`, `/industrias/estudios-contables`, `/industrias/distribuidoras`, `/industrias/salud`, `/industrias/inmobiliaria`, `/industrias/gastronomia`, `/industrias/ecommerce`, `/industrias/b2b`, `/industrias/construccion`, `/industrias/automotor`.

4. **Recursos, Casos de Éxito, Desarrolladores y Legal**:
   - `/casos` | `/casos-de-exito` : Casos de estudio de PyMEs argentinas (GAMAN, Ferretería El Oeste, etc.).
   - `/servicios` | `/recursos` | `/blog` : Guías operativas y artículos comerciales.
   - `/academia` : Portal formativo interactivo para equipos de ventas.
   - `/desarrolladores` | `/api-docs` : Documentación técnica de APIs y webhooks.
   - `/legal` | `/privacidad` | `/terminos` : Términos de servicio y privacidad.

5. **Mapeo de Aliases Resueltos (Cero 404s)**:
   - `/about`, `/nosotros`, `/empresa` → `/producto`
   - `/clientes` → `/casos`
   - `/ecosistema` → `/producto/integraciones`
   - `/partners`, `/alianzas`, `/afiliados` → `/contacto`
   - `/empleo`, `/trabajo`, `/carreras` → `/contacto`

---

### B. Capa 2: Shell Privado Autenticado (`CRMContext.tsx`, `src/types.ts` & `src/routes/routeRegistry.ts`)
| Categoría | Identificador Tab | Ruta Semántica | Componente Canónico | Propósito Funcional |
| :--- | :--- | :--- | :--- | :--- |
| **Inicio & Control** | `dashboard` | `/dashboard` | `ExecutiveDashboardView.tsx` | 5 KPIs directivos ($582k pipeline, $54k cerrado, 32,4% conv, 27d ciclo, 5 alertas). |
| | `ecosystemHub` | `/hub/ecosistema` | `UnifiedControlHub.tsx` | Centro de control unificado de las 15 micro-aplicaciones del sistema. |
| | `analytics` | `/analytics/bi` | `AnalyticsView.tsx` | Reportes ejecutivos, forecast comercial y embudos de conversión. |
| **Ventas & Clientes** | `opportunities` | `/crm/pipeline` | `KanbanView.tsx` / `TableView.tsx` | Pipeline Kanban de 5 etapas con tarjetas de 4 líneas y RecordDrawer lateral. |
| | `companies` | `/crm/empresas` | `CompaniesView.tsx` | Directorio de empresas con CUIT, condición IVA y scoring comercial. |
| | `people` | `/crm/contactos` | `PeopleView.tsx` | Directorio de contactos y decisores comerciales con enlace a WhatsApp. |
| | `tasks` | `/crm/tareas` | `TasksView.tsx` | Agenda operativa y tareas comerciales pendientes de seguimiento. |
| | `calendar` | `/crm/calendario` | `CalendarView.tsx` | Vista de agenda mensual y semanal de reuniones y compromisos. |
| | `activityInbox` | `/crm/actividades` | `ActivityInboxView.tsx` | Bandeja unificada de llamadas, notas de reunión y correos. |
| | `propuestas` | `/crm/propuestas` | `Propuestas.tsx` | Generador y visualizador de presupuestos y propuestas PDF. |
| | `googleMaps` | `/crm/prospeccion` | `ModuleProspeccionMaps.tsx` | Extractor B2B sobre Google Maps con filtro por rubro y localidad. |
| **Comunicación** | `whatsapp` | `/communication/whatsapp` | `WhatsAppView.tsx` | Bandeja omnicanal en vivo (`LIVE`) con transcripción de notas de voz. |
| | `messages` | `/communication/mensajes` | `MessagesView.tsx` | Mensajería directa entre operadores internos. |
| | `webmail` | `/communication/webmail` | `WebmailInboxView.tsx` | Bandeja de correo corporativo para dominios propios vía Cloudflare. |
| | `chatbot` | `/communication/bots` | `ChatbotView.tsx` | Configuración y entrenamiento de bots de atención automática 24/7. |
| | `campaigns` | `/communication/campanas` | `PowerSuiteView.tsx` | Campañas masivas de difusión por WhatsApp con plantillas aprobadas. |
| **IA & Agentes** | `agenteOS` | `/ai/agentes` | `AgenteOSView.tsx` | Organigrama de 14 roles autónomos ejecutables con asignación de tareas. |
| | `aiAssistant` | `/ai/copilot` | `AICopilotModal.tsx` | Copilot directivo Gemini 3.8 para priorización de tratos y análisis comercial. |
| | `workflows` | `/ai/flujos` | `WorkflowsView.tsx` | Automatizaciones visuales mediante grafos acíclicos dirigidos (DAG). |
| | `gtmStrategy` | `/ai/estrategia` | `PowerSuiteView.tsx` | Asistente de estrategias de Go-To-Market y generación de copys. |
| **ERP & Operaciones** | `erp` | `/erp/facturacion` | `ErpView.tsx` | Facturación electrónica AFIP con CAE (Facturas A, B y C) y cuentas corrientes. |
| | `operations` | `/erp/operaciones` | `OperationsView.tsx` | Gestión de órdenes de entrega, logística y remitos comerciales. |
| | `payments` | `/erp/cobros` | `PlatformBillingView.tsx` | Suscripciones, planes y cobros recurrentes vía Mercado Pago en ARS. |
| | `tiendaDigital` | `/erp/tienda` | `TiendaDigitalView.tsx` | Catálogo de productos sincronizable directamente a WhatsApp Business. |
| | `campusLMS` | `/erp/academia` | `CampusLMSView.tsx` | Capacitación y onboarding continuo para la fuerza de ventas. |
| **Administración** | `customObjects` | `/admin/datos` | `CustomObjectsView.tsx` | Esquemas relacionales y entidades configurables (Twenty CRM). |
| | `csvStudio` | `/admin/csv` | `CSVStudioView.tsx` | Importador y exportador masivo de registros con mapeo de campos. |
| | `domainManager` | `/admin/dominios` | `PublicDomainManagerPage.tsx` | Configuración de dominios personalizados y registros DNS. |
| | `settings` | `/admin/ajustes` | `SettingsView.tsx` | Configuración de la PyME, CUIT, alícuotas AFIP y gestión de usuarios. |

---

## 2. Comparativa de Patrones de Enrutamiento e Informe de Duplicidades

| Criterio | ClientumCRM (SPA State-Driven) | Remix ClientumOS (File-System Routing) | Modelo Canónico Unificado |
| :--- | :--- | :--- | :--- |
| **Mecanismo de Despacho** | Basado en estado React (`activeTab: ActiveTab`) administrado por un contexto global (`CRMContext`). | Basado en el árbol de archivos (`app/routes/*`) con parámetros de ruta y layouts anidados. | **Arquitectura Híbrida State-Synced**: El portal público opera por URLs limpias (`pushState`) y el shell privado sincroniza el tab activo con la URL sin recargas de página. |
| **Persistencia de Estado Efímero** | **Excelente**: Los filtros de búsqueda, vistas Kanban, campos en formularios y modales se mantienen intactos al alternar entre pestañas. | **Deficiente**: Al cambiar de ruta HTTP o recargar un segmento anidado, el estado efímero del usuario se reseteaba. | **Máxima**: Preserva el estado en memoria RAM dentro de `CRMContext`, evitando pérdida de trabajo en curso. |
| **Deep-Linking & Bookmarking** | Históricamente dependía de estado local. | Nativo y robusto por URL. | **Soportado**: Se sincroniza el `activeTab` con la barra de direcciones (`window.history.pushState`), permitiendo compartir enlaces directos. |
| **Rendimiento de Transición** | Instantáneo (0ms de latencia de red; renderizado inmediato de componentes en memoria). | Dependiente de la carga de red y de los loaders del servidor en cada cambio de vista. | **Instantáneo**: Transiciones fluidas sin peticiones de red redundantes. |

### Informe Detallado de Duplicidades Resueltas:
1. **Prospección B2B**:
   - `mapsProspecting` (submódulo en PowerSuite) vs. `googleMaps` (módulo comercial independiente).
   - *Resolución*: Se eliminó la duplicidad en PowerSuite; la ruta canónica única es **`googleMaps`** (`src/components/commercial/ModuleProspeccionMaps.tsx`), conectada con 1 clic al Pipeline Kanban de 5 etapas.
2. **Catálogo y Tienda Digital**:
   - `ecommerce` (catálogo genérico) vs. `tiendaDigital` (catálogo integrado con WhatsApp).
   - *Resolución*: Se unificó en **`tiendaDigital`** (`src/components/commercial/TiendaDigitalView.tsx`).
3. **Plataforma de Facturación y Cobros**:
   - Vistas simuladas en moneda extranjera (`Stripe`) vs. pasarela local en ARS.
   - *Resolución*: Se consolidó en **`payments`** (`src/components/billing/PlatformBillingView.tsx`) operando nativamente con Mercado Pago en Pesos Argentinos (ARS) e integración AFIP con CAE en `erp`.
4. **Centro de Control del Ecosistema**:
   - `featureHub` versus `ecosystemHub`.
   - *Resolución*: Se consolidó en **`ecosystemHub`** (`src/components/workspace/UnifiedControlHub.tsx`), unificando las 15 micro-aplicaciones del sistema operativo.

---

## 3. Escaneo Exhaustivo de Directorios Satélite y Plan de Clasificación

| Directorio | Componentes y Servicios Identificados | Clasificación | Plan de Migración y Destino Canónico |
| :--- | :--- | :--- | :--- |
| **`src/components/crm-full`** | - `CrmFullGoogleMaps.tsx`<br>- Extractor de comercios locales B2B sobre Google Maps<br>- Normalizador telefónico a formato internacional WhatsApp (+54 9...) | **Migrado e Integrado** | Consolidado canónicamente en `src/components/commercial/ModuleProspeccionMaps.tsx` y `CrmFullGoogleMaps.tsx`. La acción "Crear Lead" impacta en el Pipeline Kanban de 5 etapas con 1 clic. |
| **`src/twenty-crm`** | - Motor de esquemas relacionales dinámicos<br>- Custom Objects (CUIT, Condición IVA, Límite Crédito)<br>- Importador/Exportador CSV masivo | **Canónico Consolidado** | Absorbido en `src/components/custom/CustomObjectsView.tsx` y `src/components/csv/CSVStudioView.tsx`, permitiendo extender las entidades de la base de datos sin romper los tipos de TypeScript. |
| **`src/remix-twenty-crm`** | - *Brochure Builder* (editor visual de folletos y presupuestos PDF)<br>- Transcripción de notas de voz de WhatsApp (Whisper/Gemini)<br>- *Cloudflare Webmail Inbox* | **Integrado y Centralizado** | - Folletos y presupuestos → `src/components/commercial/Propuestas.tsx`<br>- Mensajería y audios → `src/components/whatsapp/WhatsAppView.tsx`<br>- Correo corporativo → `src/components/webmail/WebmailInboxView.tsx`. |

---

## 4. Diagnóstico de Concentración en `server.ts` y Plan de Desacople Modular

### A. Diagnóstico de Concentración Actual
`server.ts` concentra actualmente más de 3,200 líneas de código acumulando responsabilidades dispares:
1. Parseo y middlewares de seguridad (CORS, Express, buffers crudos de webhook).
2. Criptografía AES-256-GCM para almacenamiento seguro de credenciales y API keys con scopes RBAC.
3. Repositorio de base de datos relacional híbrida (PostgreSQL pool con soporte SQLite/memoria como fallback).
4. Endpoints CRM (Contactos, Empresas, Negocios, Tareas, Desduplicación, Evidencia).
5. Pasarela de pagos (Mercado Pago preferencias, webhooks e idempotencia de cobros en ARS).
6. Integración de IA Generativa (Gemini 3.8 con reintentos y fallback inteligente para Copilot, CMO, GTM, Ads y Transcripción).
7. Envío de correos transaccionales (Nodemailer / SMTP).
8. Middleware de desarrollo Vite SPA y fallback de archivos estáticos en producción.

### B. Estructura de Separación de Dominios Propuesta (`server/`)
```
server/
├── index.ts               # Punto de entrada orquestador minimalista (express(), middlewares base y listen)
├── config/                # Variables de entorno validadas, constantes AFIP y Mercado Pago
│   └── env.ts
├── db/                    # Capa de datos y persistencia
│   ├── pool.ts            # Conexión Postgres / Neon Pool con reintentos
│   ├── schema.sql         # Definición DDL unificada
│   └── crmRepository.ts   # Operaciones de persistencia CRM, auditoría y evidencia
├── middleware/            # Interceptores de solicitud
│   ├── auth.ts            # Validación de Bearer Tokens, API keys y tenancy
│   ├── rateLimiter.ts     # Control de concurrencia y protección contra abusos
│   ├── errorHandler.ts    # Captura centralizada de errores y formateo JSON
│   └── viteMode.ts        # Inyección de Vite middlewares o static dist fallback
├── services/              # Lógica pura de negocio independiente de HTTP
│   ├── geminiService.ts   # Cadena de modelos Gemini (3.8-flash, 3.1-flash-lite), prompts y fallback
│   ├── mercadoPagoService.ts # Generación de preferencias de pago, webhooks e idempotencia
│   ├── afipService.ts     # Facturación electrónica (Facturas A/B/C) y obtención de CAE
│   ├── cryptoService.ts   # Cifrado AES-256-GCM de credenciales en reposo
│   └── mailService.ts     # Envío transaccional vía Nodemailer / SMTP
└── routes/                # Controladores HTTP agrupados por subdominio
    ├── crm.routes.ts      # /api/crm/records, /api/crm/duplicates, /api/contacts
    ├── ai.routes.ts       # /api/ai/copilot, /api/ai/voice-note, /api/ai/transcribe
    ├── billing.routes.ts  # /api/billing/mercadopago/*
    ├── auth.routes.ts     # /api/auth/keys, /api/system/credentials
    └── public.routes.ts   # /api/public/contacts, /api/public/newsletter
```

### C. Plan de Migración Incremental (Cero Tiempo de Inactividad)
- **Fase 1**: Extraer `geminiService.ts` y `cryptoService.ts` como módulos de lógica pura sin alterar las firmas ni los contratos de endpoints.
- **Fase 2**: Agrupar los endpoints en `express.Router()` por dominio (`ai.routes.ts`, `billing.routes.ts`, `crm.routes.ts`).
- **Fase 3**: Dejar `server.ts` como orquestador limpio de menos de 100 líneas, montando los routers correspondientes sin alterar ninguna llamada del frontend.

---

## 5. Estado de Verificación y Estabilidad
- **Compilador TypeScript (`tsc --noEmit`)**: 0 errores de tipos.
- **Build de Producción (`vite build`)**: Compilación limpia y empaquetada en `dist/`.
- **Registro Centralizado**: Activo en `src/routes/routeRegistry.ts`.
