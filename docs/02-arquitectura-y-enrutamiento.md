# 02 — Arquitectura y Enrutamiento del Dashboard

Este documento describe la arquitectura interna del sistema frontend, el mecanismo de enrutamiento basado en estado, la estructura del menú de navegación y la gestión del contexto global.

---

## 1. Arquitectura General del Frontend

Clientum OS está construido como una Single Page Application (SPA) modular en **React 18** con **TypeScript**, empaquetada mediante **Vite** y estilizada con **Tailwind CSS**.

### Flujo de Renderizado
```
┌───────────────────────────────────────────────────────────────┐
│                           App.tsx                             │
│     (Inicialización de Tema, Autenticación y Contextos)       │
└──────────────────────────────┬────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       [Vista Pública / Auth]       [PrivateEnvironment.tsx]
      (Login, Registro, Portal)      (Dashboard Privado)
                                              │
                ┌─────────────────────────────┼─────────────────────────────┐
                ▼                             ▼                             ▼
         [Sidebar.tsx]              [Área de Contenido]             [AICopilot.tsx]
      (Navegación Lateral)         (Lazy Render según activeTab)   (Asistente Flotante)
```

---

## 2. Enrutador Central (`PrivateEnvironment.tsx`)

A diferencia de un enrutador clásico basado en URLs de navegador, Clientum utiliza un enrutador basado en estado reactivo (`activeTab` dentro de `CRMContext`), lo que permite:
- Transiciones instantáneas entre módulos sin recargas de página.
- Retención del estado de formularios en segundo plano.
- Carga bajo demanda (*code-splitting*) mediante `React.lazy` y `Suspense`.

### Tabla de Enrutamiento de Vistas

| `activeTab` | Componente Renderizado | Ruta del Archivo |
| :--- | :--- | :--- |
| `hub` | `UnifiedControlHub` | `src/components/workspace/UnifiedControlHub.tsx` |
| `opportunities` | `KanbanView` | `src/components/opportunities/KanbanView.tsx` |
| `leads` | `LeadsView` | `src/components/leads/LeadsView.tsx` |
| `companies` | `CompaniesView` | `src/components/companies/CompaniesView.tsx` |
| `contacts` | `ContactsView` | `src/components/contacts/ContactsView.tsx` |
| `calendar` | `CalendarView` | `src/components/calendar/CalendarView.tsx` |
| `tasks` | `TasksView` | `src/components/tasks/TasksView.tsx` |
| `proposals` | `ProposalsView` | `src/components/proposals/ProposalsView.tsx` |
| `brochure` | `BrochureView` | `src/components/brochure/BrochureView.tsx` |
| `portal` | `PortalView` | `src/components/portal/PortalView.tsx` |
| `reports` | `ReportsView` | `src/components/reports/ReportsView.tsx` |
| `documents` | `DocumentsView` | `src/components/documents/DocumentsView.tsx` |
| `googleMaps` | `GoogleMapsProspectorView` | `src/components/prospecting/GoogleMapsProspectorView.tsx` |
| `competitiveRadar` | `CompetitiveRadarView` | `src/components/intelligence/CompetitiveRadarView.tsx` |
| `seoSuite` | `SEOSuiteView` | `src/components/marketing/SEOSuiteView.tsx` |
| `gtmPlan` | `GTMStrategyView` | `src/components/intelligence/GTMStrategyView.tsx` |
| `whatsapp` | `WhatsAppChatView` | `src/components/whatsapp/WhatsAppChatView.tsx` |
| `unifiedInbox` | `UnifiedInboxView` | `src/components/communications/UnifiedInboxView.tsx` |
| `campaigns` | `CampaignsView` | `src/components/marketing/CampaignsView.tsx` |
| `autoResponder` | `AutoResponderView` | `src/components/communications/AutoResponderView.tsx` |
| `webmail` | `WebmailView` | `src/components/webmail/WebmailView.tsx` |
| `wordpress` | `WordPressSyncView` | `src/components/integrations/WordPressSyncView.tsx` |
| `powerSuite` | `PowerSuiteView` | `src/components/power/PowerSuiteView.tsx` |
| `sdrOutreach` | `PowerSuiteView` (`defaultModule="outreach"`) | `src/components/power/PowerSuiteView.tsx` |
| `adCopy` | `PowerSuiteView` (`defaultModule="adCopy"`) | `src/components/power/PowerSuiteView.tsx` |
| `erp` | `ERPLogisticsView` | `src/components/erp/ERPLogisticsView.tsx` |
| `invoicing` | `InvoicingView` | `src/components/invoicing/InvoicingView.tsx` |
| `store` | `StoreView` | `src/components/store/StoreView.tsx` |
| `subscriptions` | `SubscriptionsView` | `src/components/subscriptions/SubscriptionsView.tsx` |
| `campus` | `CampusView` | `src/components/campus/CampusView.tsx` |
| `workflows` | `WorkflowsView` | `src/components/workflows/WorkflowsView.tsx` |
| `team` | `TeamView` | `src/components/team/TeamView.tsx` |
| `roles` / `integrations` / `auditLogs` | `SettingsView` | `src/components/settings/SettingsView.tsx` |
| `schemaViewer` | `SchemaViewer` | `src/components/database/SchemaViewer.tsx` |
| `domains` | `DomainManagementView` | `src/components/domains/DomainManagementView.tsx` |
| `admin` | `AdminConsoleView` | `src/components/admin/AdminConsoleView.tsx` |

---

## 3. Estructura de Navegación (`src/config/sidebar.ts`)

La barra lateral se organiza en **6 macro-secciones** categorizadas por rol y función:

1. **Dashboard & CRM:** Acceso al Hub Central, Pipeline, Leads, Empresas, Contactos, Calendario, Tareas, Propuestas y Catálogo de Folletos.
2. **Prospección & Market Intelligence:** Google Maps Prospector, Radar Competitivo, Suite SEO y Planes GTM.
3. **Omnicanalidad & Mensajería:** WhatsApp Web WACE, Bandeja Unificada, Campañas, Auto-Respuesta y Webmail.
4. **Agentes IA & Power Suite:** AgenteOS (14 roles de agentes autónomos), SDR Prospección y Generador de Ad Copy.
5. **Operaciones & Finanzas:** ERP, Facturación AFIP, Tienda Digital, Suscripciones recurrentes, LMS Campus y Workflows.
6. **Administración & Gobierno:** Gestión de Equipo, Roles RBAC, Hub de Integraciones, Auditoría SOC2, Base de Datos SQL, Dominios y Consola Master.

---

## 4. Gestión del Estado Global (`CRMContext.tsx`)

El estado de la aplicación se centraliza en un Contexto React unificado que provee:
- **Colecciones de Datos:** Tratos, contactos, empresas, facturas, productos, eventos de calendario y logs de auditoría.
- **Acciones CRUD:** Creación, edición, eliminación y cambio de etapa de registros.
- **Control de Diálogos:** Apertura del Command Palette (`Ctrl+K` / `Cmd+K`), Drawer lateral de edición de registros, Modal de creación rápida y Modal de configuración del Copilot.
- **Sincronización en la Nube:** Integración con backend Express (`server.ts`) y Firestore mediante cabeceras de autorización multi-inquilino.
