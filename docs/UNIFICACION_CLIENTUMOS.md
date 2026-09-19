# Diagnóstico y Plan de Unificación: ClientumOS
**Sistema Operativo Comercial y de Gestión Integral para PyMEs Argentinas**
*Unificación Arquitectónica: ClientumCRM + Remix ClientumOS + Ecosistema Twenty CRM*

---

## 1. Contexto y Objetivos del 'Prompt Maestro'

Este documento establece el diagnóstico exhaustivo, inventario de componentes, análisis de patrones de enrutamiento y la hoja de ruta para consolidar las diferentes vertientes y repositorios satélite del ecosistema Clientum (`crm-full`, `twenty-crm` y `remix-twenty-crm`) en una única plataforma canónica: **ClientumOS**.

El objetivo es eliminar la fragmentación entre prototipos históricos creados en Replit y GitHub, resolver dependencias duplicadas, alinear los esquemas de datos con la realidad operativa de las PyMEs de Argentina (AFIP, CUIT, facturación A/B/C con CAE, cobranzas con Mercado Pago, prospección B2B y mensajería omnicanal de WhatsApp), y proveer una interfaz directiva unificada bajo un único shell de navegación.

---

## 2. Diagnóstico Estructural de Directorios y Repositorios Satélite

En iteraciones previas y repositorios satélite de Replit/GitHub (`twenty-crm-5-`, `remix-remix-editor-de-brochure-clientumzip22`, `crm-full-google-maps`), la arquitectura se encontraba dispersa en tres raíces conceptuales:

### A. `src/components/crm-full` (Prototipo de Prospección B2B & Google Maps)
- **Origen**: Repositorio satélite enfocado en enriquecimiento y extracción de leads desde Google Maps.
- **Componentes Detectados**:
  - Extractor de fichas comerciales, teléfonos y sitios web (`CrmFullGoogleMaps.tsx`).
  - Filtros por localidad geográfica y rubro (corralones, distribuidoras, bodegas, talleres, ferreterías).
  - Algoritmo de normalización de teléfonos a formato internacional WhatsApp (+54 9...).
- **Estado de Unificación**: **MIGRADO A CANÓNICO**.
  - Se unificó en `src/components/commercial/ModuleProspeccionMaps.tsx` y `src/components/commercial/CrmFullGoogleMaps.tsx`.
  - Integrado en el pipeline comercial con acción de "Convertir a Lead" o "Crear Oportunidad" con 1 clic.

### B. `src/twenty-crm` (Motor de Metadatos y Objetos Personalizados)
- **Origen**: Adaptación basada en el core open source de *Twenty CRM* para soportar esquemas dinámicos relacionales.
- **Componentes Detectados**:
  - Definición de esquemas de datos (*Custom Objects* / Entidades configurables).
  - Campos personalizados (CUIT, Condición IVA, Lista de Precios, Límite de Crédito).
  - Vistas configurables de tabla y tarjetas.
  - Importador y exportador CSV con mapeo de columnas dinámico.
- **Estado de Unificación**: **CANÓNICO CONSOLIDADO**.
  - Absorbido en `src/components/custom/CustomObjectsView.tsx` y `src/components/csv/CSVStudioView.tsx`.
  - Mantiene compatibilidad de sincronización bidireccional y exportación estructurada sin sobrecargar el runtime.

### C. `src/remix-twenty-crm` (Editor de Folletos, Webmail & Transcripción de Audio)
- **Origen**: Exportación de Replit que combinaba el backend Remix con tres utilidades específicas de productividad.
- **Componentes Detectados**:
  - *Brochure Builder*: Generador y editor visual de folletos comerciales/presupuestos PDF.
  - *Whisper/Gemini Audio Transcription*: Transcripción de notas de voz recibidas por WhatsApp para convertirlas en minutas o tareas.
  - *Cloudflare Webmail*: Bandeja de correo corporativo para dominios propios.
- **Estado de Unificación**: **INTEGRADO Y CENTRALIZADO**.
  - *Brochure Builder & Presupuestos*: Absorbido canónicamente en `src/components/commercial/Propuestas.tsx`.
  - *Audio & WhatsApp*: Centralizado en `src/components/whatsapp/WhatsAppView.tsx` con integración nativa a Gemini 3.8.
  - *Webmail*: Integrado en `src/components/webmail/WebmailInboxView.tsx` con soporte de credenciales seguras.

---

## 3. Comparación de Patrones de Enrutamiento: 'ClientumCRM' vs 'Remix ClientumOS'

### A. Patrón de 'ClientumCRM' (SPA Client-Side State-Driven)
- **Mecanismo**: Control de navegación basado en estado React (`activeTab: ActiveTab`) administrado centralmente por `CRMContext`.
- **Ventajas**: Transición instantánea entre vistas complejas (Kanban, Drawer lateral, Copilot flotante) sin recarga de página; preservación de estados en memoria (filtros, búsquedas, registros editándose).
- **Desventajas originales**: Falta de deep-linking directo por URL (si el usuario recargaba, volvía al dashboard predeterminado salvo que se guardara en `localStorage`).

### B. Patrón de 'Remix ClientumOS' (File-System & Nested Routes)
- **Mecanismo**: Enrutamiento basado en rutas HTTP URL anidadas (`/crm/pipeline`, `/communication/whatsapp`, `/erp/facturacion`).
- **Ventajas**: Deep-linking natural, soporte SEO nativo para el portal público, URLs compartibles por los agentes de venta.
- **Desventajas**: Pérdida de estado efímero al alternar rápidamente entre herramientas en modo SPA de alta densidad sin un state manager global.

### C. Estrategia Canónica Unificada (Arquitectura Híbrida en ClientumOS)
1. **Portal Público**: Enrutamiento por rutas semánticas (`src/components/public/publicRoutes.ts`), soportando URLs como `/producto/crm`, `/precios`, `/industrias/distribuidoras` con sincronización en `window.location.pathname` y navegación por `pushState`.
2. **Shell Privado**: Tab-registry canónico sincronizado con el navegador (`navigate(tab)` en `src/lib/navigation.ts` y `activeTab` en `CRMContext`), que mapea cada pestaña a una ruta canónica identificable.
3. **Route Registry Centralizado**: Mapeo estricto que elimina rutas redundantes y proporciona aliases tolerantes a fallos.

---

## 4. Matriz Comparativa: Componentes Duplicados vs. Canónicos

| Función / Dominio | Componente en `crm-full` | Componente en `twenty-crm` | Componente en `remix-twenty-crm` | Resolución Canónica en ClientumOS |
| :--- | :--- | :--- | :--- | :--- |
| **Prospección B2B** | `mapsProspecting` / Scraper | N/A | N/A | `src/components/commercial/ModuleProspeccionMaps.tsx` |
| **Modelado de Datos** | N/A | `CustomSchemaEngine` | N/A | `src/components/custom/CustomObjectsView.tsx` |
| **Importación CSV** | Importador simple | `CSVStudio` | N/A | `src/components/csv/CSVStudioView.tsx` |
| **Propuestas & PDF** | N/A | N/A | `BrochureBuilder` | `src/components/commercial/Propuestas.tsx` |
| **Correo / Webmail** | N/A | N/A | `CloudflareWebmail` | `src/components/webmail/WebmailInboxView.tsx` |
| **WhatsApp & Audio** | N/A | N/A | `WhisperTranscriber` | `src/components/whatsapp/WhatsAppView.tsx` |
| **Planes & Checkout** | N/A | `StripeBilling` (Legacy) | `MercadoPagoCheckout` | `src/components/billing/PlatformBillingView.tsx` (Mercado Pago ARS) |
| **Facturación** | N/A | `InvoicingMock` | N/A | `src/components/erp/ErpView.tsx` (AFIP Factura A/B/C con CAE) |
| **Centro de Módulos** | `featureHub` | N/A | `ecosystemHub` | `src/components/workspace/UnifiedControlHub.tsx` |

---

## 5. Inventario Completo de Rutas Activas en la Aplicación

La aplicación opera bajo un modelo híbrido: **Portal Público Institucional / Comercial** (para adquisición y conversión) y **Shell Privado ClientumOS** (para la gestión operativa autenticada de la PyME).

### A. Rutas del Portal Público (`src/components/public/publicRoutes.ts`)
| Ruta | Finalidad / Vista |
| :--- | :--- |
| `/` | Landing page principal con Hero de alto impacto, 4 pilares y captación de leads |
| `/producto` | Visión general del ecosistema ClientumOS |
| `/producto/dashboard` | Demostración interactiva del Resumen Ejecutivo y KPIs |
| `/producto/crm` | Presentación del CRM 360°, Pipeline Kanban y MEDDIC |
| `/producto/whatsapp-ia` | Automatización de WhatsApp y atención con Gemini |
| `/producto/automatizaciones` | Editor visual de flujos DAG sin código |
| `/producto/marketing` | Campañas masivas, secuencias y copywriter |
| `/producto/seo` | SEO Suite, auditoría On-Page y ranking |
| `/producto/erp` | Facturación AFIP con CAE (Facturas A, B, C) |
| `/producto/bi` | Business Intelligence, cohortes y forecast |
| `/producto/agentes-ia` | Organigrama de 14 Agentes Autónomos con AgenteOS |
| `/producto/integraciones` | Mercado Pago, AFIP, WhatsApp Cloud API, Cloudflare, Gmail |
| `/precios` \| `/planes` | Tabla de precios en ARS con suscripción Mercado Pago |
| `/industrias/*` | 10 Páginas verticales (Agro, Contable, Distribuidoras, Salud, Inmobiliaria, Gastronomía, E-Commerce, B2B, Construcción, Automotor) |
| `/casos` \| `/casos-de-exito` | Casos de éxito y testimonios de PyMEs argentinas |
| `/servicios` \| `/recursos` \| `/blog` | Centro de recursos, guías y artículos |
| `/academia` | Portal de formación y tutoriales |
| `/desarrolladores` \| `/api-docs` | Documentación de API y webhooks |
| `/contacto` \| `/demo` | Formulario de contacto directo con persistencia previa |
| `/tienda` \| `/tienda/central` | Catálogo digital y tienda de aplicaciones del ecosistema |
| `/dominios` | Gestor de dominios personalizados y DNS |
| `/legal` \| `/privacidad` \| `/terminos` | Documentos legales y términos de servicio |
| Aliases Unificados | `/empresa`, `/clientes`, `/ecosistema`, `/partners`, `/alianzas`, `/afiliados`, `/empleo`, `/trabajo`, `/carreras` |

### B. Rutas y Tabs del Shell Privado (`src/types.ts` & `CRMContext.tsx`)
| Identificador de Tab | Ruta Semántica | Vista / Componente Canónico |
| :--- | :--- | :--- |
| `dashboard` | `/dashboard` | `ExecutiveDashboardView.tsx` (KPIs, foco diario, semáforo) |
| `opportunities` | `/crm/pipeline` | `KanbanView.tsx` (Kanban) / `TableView.tsx` (Lista) |
| `companies` | `/crm/empresas` | `CompaniesView.tsx` (Empresas con CUIT y scoring) |
| `people` | `/crm/contactos` | `PeopleView.tsx` (Contactos, WhatsApp y decisores) |
| `tasks` | `/crm/tareas` | `TasksView.tsx` (Tareas operativas y agenda) |
| `calendar` | `/crm/calendario` | `CalendarView.tsx` (Vista mensual/semanal de citas) |
| `activityInbox` | `/crm/actividades` | `ActivityInboxView.tsx` (Llamadas, notas, reuniones) |
| `propuestas` | `/crm/propuestas` | `Propuestas.tsx` (Generador de presupuestos y propuestas PDF) |
| `googleMaps` | `/crm/prospeccion` | `ModuleProspeccionMaps.tsx` (Búsqueda B2B y extracción) |
| `whatsapp` | `/communication/whatsapp` | `WhatsAppView.tsx` (Bandeja omnicanal LIVE) |
| `messages` | `/communication/mensajes` | `MessagesView.tsx` (Mensajería directa) |
| `webmail` | `/communication/webmail` | `WebmailInboxView.tsx` (Bandeja Cloudflare Webmail) |
| `chatbot` | `/communication/bots` | `ChatbotView.tsx` (Configuración de bots de atención) |
| `campaigns` | `/communication/campanas` | `PowerSuiteView.tsx` (Campañas masivas WhatsApp) |
| `agenteOS` | `/ai/agentes` | `AgenteOSView.tsx` (14 roles autónomos ejecutables) |
| `aiAssistant` | `/ai/copilot` | `AICopilotModal.tsx` & Copilot Gemini flotante |
| `workflows` | `/ai/flujos` | `WorkflowsView.tsx` (Automatizaciones DAG) |
| `gtmStrategy` | `/ai/estrategia` | `PowerSuiteView.tsx` (Estrategias GTM & Copy) |
| `erp` | `/erp/facturacion` | `ErpView.tsx` (Facturación electrónica AFIP con CAE) |
| `operations` | `/erp/operaciones` | `OperationsView.tsx` (Gestión de órdenes y entregas) |
| `payments` | `/erp/cobros` | `PlatformBillingView.tsx` (Suscripciones Mercado Pago) |
| `tiendaDigital` | `/erp/tienda` | `TiendaDigitalView.tsx` (Catálogo sincronizado a WhatsApp) |
| `campusLMS` | `/erp/academia` | `CampusLMSView.tsx` (Capacitación del equipo comercial) |
| `analytics` | `/analytics/bi` | `AnalyticsView.tsx` (Reportes comerciales y embudos) |
| `ecosystemHub` | `/hub/ecosistema` | `UnifiedControlHub.tsx` (Control de 15 micro-aplicaciones) |
| `customObjects` | `/admin/datos` | `CustomObjectsView.tsx` (Esquemas Twenty CRM) |
| `csvStudio` | `/admin/csv` | `CSVStudioView.tsx` (Importación y exportación masiva) |
| `domainManager` | `/admin/dominios` | `PublicDomainManagerPage.tsx` (DNS y dominios públicos) |
| `settings` | `/admin/ajustes` | `SettingsView.tsx` (Parámetros PyME, CUIT y usuarios) |

### C. Endpoints de la API Backend Express (`server.ts`)
- `GET /api/health`: Chequeo de salud del servicio y persistencia.
- `POST /api/contacts` & `POST /api/public/contacts`: Captura tolerante a fallos de leads desde el sitio público antes de derivar a WhatsApp.
- `POST /api/newsletter` & `POST /api/public/newsletter`: Suscripción al boletín comercial.
- `POST /api/ai/copilot`: Análisis contextual impulsado por Gemini para priorización de tratos y redacción de propuestas.
- `POST /api/billing/mercadopago/create-preference`: Generación de checkout y suscripciones locales en pesos argentinos.
- `POST /api/billing/mercadopago/webhook`: Confirmación asíncrona de pagos de Mercado Pago.
- `GET/POST /api/system/credentials`: Almacenamiento seguro de credenciales de módulos de terceros.

---

## 6. Arquitectura Técnica del Componente Sidebar Único Global

### A. Jerarquía de Navegación Propuesta ('Prompt Maestro')
El componente `src/components/layout/Sidebar.tsx` canónico unifica todas las variantes anteriores y estructura la navegación en **6 secciones jerárquicas**:

```
┌─────────────────────────────────────────────────────────┐
│ [Logo Clientum] ClientumOS                              │
│ Sistema Operativo PyME               [+ Nuevo Registro] │
├─────────────────────────────────────────────────────────┤
│ [🔍 Buscar en todo el CRM...                     ⌘K]   │
│ [🌐 Ver Portal Público]                                 │
├─────────────────────────────────────────────────────────┤
│ ▼ INICIO & CONTROL                                      │
│   ├─ Resumen Ejecutivo (KPIs, foco diario, semáforo)    │
│   ├─ Unified Control Hub (15 micro-apps integradas)     │
│   └─ Reportes & BI (Forecast, embudos y métricas)       │
│                                                         │
│ ▼ VENTAS & CLIENTES                                     │
│   ├─ Pipeline de Negocios (Kanban con 4 datos clave)    │
│   │   └─ Lead Scoring MEDDIC                            │
│   ├─ Contactos & Empresas (Directorio PyME con CUIT)    │
│   │   └─ Empresas                                       │
│   ├─ Actividades & Agenda (Tareas pendientes)           │
│   │   ├─ Calendario                                     │
│   │   └─ Notas y llamadas                               │
│   ├─ Propuestas & Presupuestos (Generador PDF)          │
│   └─ Prospección Google Maps (Extracción B2B)           │
│                                                         │
│ ▼ CENTRO DE COMUNICACIÓN                                │
│   ├─ Bandeja Omnicanal WhatsApp (LIVE)                  │
│   │   ├─ Mensajes directos                              │
│   │   └─ Webmail Cloudflare                             │
│   ├─ Bots & Atención Automática (Chatbot 24/7)          │
│   └─ Campañas Masivas WhatsApp (Difusión con plantillas)│
│                                                         │
│ ▼ IA & AGENTES AUTÓNOMOS                                │
│   ├─ AgenteOS (14 Roles IA especializados)              │
│   │   ├─ Copilot Gemini 3.6                             │
│   │   └─ Agente SDR Prospección                         │
│   ├─ Automatizaciones & Flujos DAG                      │
│   └─ Estrategias GTM & Copy                             │
│                                                         │
│ ▼ ERP & OPERACIONES PYME                                │
│   ├─ Facturación AFIP & CAE (Facturas A, B y C)         │
│   │   └─ Operaciones internas                           │
│   ├─ Cobros Mercado Pago & Planes                       │
│   ├─ Tienda Digital WhatsApp (Catálogo de productos)    │
│   └─ Campus Academia LMS (Capacitación continua)        │
│                                                         │
│ ▼ ADMINISTRACIÓN & SISTEMA                              │
│   ├─ Estructura de Datos (Twenty CRM Custom Objects)    │
│   │   └─ Importar / Exportar CSV                        │
│   ├─ Gestor de Dominios & DNS                           │
│   └─ Ajustes de Empresa & AFIP                          │
├─────────────────────────────────────────────────────────┤
│ [✨ Clientum Copilot (Gemini 3.8)]                      │
│ "¿Qué negocios debería priorizar hoy?"                  │
├─────────────────────────────────────────────────────────┤
│ ▼ CUENTAS CLAVE: GAMAN ($180k) · Ferretería ($120k)...  │
├─────────────────────────────────────────────────────────┤
│ [Avatar] Fernando G. · Admin         [☀️/🌙] [⚙️] [🚪] │
└─────────────────────────────────────────────────────────┘
```

### B. Cambios Estructurales en Archivos de Layout

Para consolidar el Sidebar global y erradicar las implementaciones paralelas:

1. **`src/components/app/PrivateEnvironment.tsx`**:
   - Se estableció como el contenedor maestro del shell autenticado:
     ```tsx
     <div className="clientum-light-dashboard flex h-[100dvh] min-h-screen w-screen overflow-hidden bg-[var(--bg-canvas)]">
       <Sidebar />
       <MainContent />
     </div>
     ```
   - Elimina cualquier segundo Sidebar o drawer anidado duplicado dentro de las vistas hijas (`PowerSuiteView`, `WorkspaceView`), garantizando que solo exista una instancia activa en el DOM.

2. **`src/components/layout/Navbar.tsx`**:
   - Actúa en simbiosis con el Sidebar mediante `toggleMobileSidebar()` para pantallas reducidas o móviles.
   - Centraliza el selector de empresa activa (*Tenant switcher*), búsqueda global (*Command Palette*), alertas de vencimiento AFIP y botón de nuevo registro.

3. **`src/context/CRMContext.tsx`**:
   - Administra el estado unificado `activeTab`, persistiendo la última vista activa en `localStorage`.
   - Provee las funciones de acceso rápido `setActiveTab`, `openNewRecordModal` y `openAICopilot` invocables desde cualquier ítem del Sidebar.

---

## 7. Hoja de Ruta para la Unificación Definitiva

### Fase 1: Limpieza y Desacople de Legacy (Completada)
- [x] Consolidación del route registry en `src/components/public/publicRoutes.ts` con mapeo de rutas tolerante a fallos.
- [x] Deprecación de llamadas externas incompatibles o servicios no adaptados al mercado argentino.
- [x] Migración del pipeline de datos hacia modelos locales auténticos (CUITs válidos, montos en ARS, razones sociales representativas).

### Fase 2: Unificación del Sidebar y Navegación Canónica (Completada)
- [x] Implementación de la jerarquía de 6 secciones en `src/components/layout/Sidebar.tsx`.
- [x] Normalización de badges de estado en vivo (`LIVE` para WhatsApp, `CAE` para AFIP, contador de tareas pendientes).
- [x] Inclusión del widget directivo *"¿Qué negocios debería priorizar hoy?"* con activación inmediata del Copilot.

### Fase 3: Estandarización de Vistas Principales (Completada)
- [x] **Resumen Ejecutivo**: 5 KPIs directivos ($582k pipeline, $54k vendido, 32,4% conversión, 27d ciclo con selector y 5 alertas prioritarias).
- [x] **Pipeline Kanban**: Tarjetas de 4 líneas con información operativa completa y apertura rápida del `RecordDrawer`.
- [x] **Captura Pública Blindada**: Persistencia en base de datos local y Firebase antes de redireccionar a WhatsApp para garantizar tasa cero de pérdida de leads.

### Fase 4: Certificación de Compilación y Calidad Continua
- [x] Validación estricta con TypeScript (`npm run lint` / `tsc --noEmit`).
- [x] Verificación de empaquetado de producción (`npm run build`).
- [x] Sincronización transparente con Firestore y tolerancia a desconexión (*Offline-First*).

---

## 8. Diagnóstico de Concentración en `server.ts` y Plan de Desacople Modular

### A. Diagnóstico de Concentración Actual
`server.ts` concentra actualmente más de 3,200 líneas de código integrando:
1. Configuración de middlewares y parseo de peticiones (Express, json rawBody, CORS, helmet).
2. Seguridad, criptografía de credenciales (AES-256-GCM) y gestión de API Keys con scopes RBAC.
3. Gestión de base de datos relacional híbrida (PostgreSQL pool, inicialización DDL y fallback a repositorio local/memoria).
4. Endpoints de CRM (Contactos, Empresas, Oportunidades, Actividades, Tareas, Desduplicación).
5. Pasarela de Pagos (Mercado Pago SDK, webhooks, confirmación y suscripciones en ARS).
6. Integración de IA Generativa (Gemini 3.8 con reintentos exponenciales y fallbacks inteligentes para Copilot, CMO, GTM, Ads y Transcripción).
7. Automatización de correos (SMTP nodemailer y transaccionales).
8. Servidor estático y middleware de Vite (modo desarrollo SPA y fallback de producción).

### B. Arquitectura de Dominio Propuesta (`/server/*`)
Para permitir una migración incremental y segura sin interrumpir la operación actual del sistema:

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

### C. Estrategia de Migración Incremental (Sin Interrupción)
1. **Paso 1: Extracción de Servicios Aislados**:
   - Mover la lógica de Gemini (`callGeminiWithRetry`, fallbacks) a `server/services/geminiService.ts`.
   - Mover cifrado y tokens a `server/services/cryptoService.ts`.
2. **Paso 2: Enrutamiento Modular por Subdominios**:
   - Montar `app.use("/api/ai", aiRoutes)` y `app.use("/api/billing", billingRoutes)` usando `express.Router()`.
3. **Paso 3: Preservación de Compatibilidad**:
   - Cada ruta extraída mantiene exactamente los mismos contratos JSON de entrada y salida, asegurando cero breaking changes con el frontend.

