import { ActiveTab } from '../../types';

export interface RouteDefinition {
  id: ActiveTab | string;
  path: string;
  label: string;
  category: 'control' | 'ventas' | 'comunicacion' | 'ia' | 'erp' | 'admin' | 'public';
  description: string;
  isPrivate: boolean;
  aliases?: string[];
}

/**
 * Registro único centralizado de todas las rutas del sistema
 * Fusiona los patrones de 'ClientumCRM' (SPA state-driven) y 'Remix ClientumOS' (File-system routes).
 */
export const ROUTE_REGISTRY: Record<string, RouteDefinition> = {
  // Rutas Privadas / Autenticadas - Inicio & Control
  dashboard: {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Resumen Ejecutivo',
    category: 'control',
    description: 'KPIs en tiempo real, foco diario y semáforo comercial PyME',
    isPrivate: true,
    aliases: ['/app/dashboard', '/app'],
  },
  ecosystemHub: {
    id: 'ecosystemHub',
    path: '/hub/ecosistema',
    label: 'Unified Control Hub',
    category: 'control',
    description: 'Centro neurálgico de las 15 micro-aplicaciones ClientumOS',
    isPrivate: true,
    aliases: ['/app/hub', '/app/feature-hub', '/features'],
  },
  analytics: {
    id: 'analytics',
    path: '/analytics/bi',
    label: 'Reportes & BI',
    category: 'control',
    description: 'Forecast de ventas, embudos de conversión y análisis por vendedor',
    isPrivate: true,
    aliases: ['/app/analytics', '/crm/analytics'],
  },

  // Rutas Privadas - Ventas & Clientes
  opportunities: {
    id: 'opportunities',
    path: '/crm/pipeline',
    label: 'Pipeline de Negocios',
    category: 'ventas',
    description: 'Gestión visual de oportunidades en 5 etapas con calificación MEDDIC',
    isPrivate: true,
    aliases: ['/app/pipeline', '/crm/opportunities', '/opportunities'],
  },
  people: {
    id: 'people',
    path: '/crm/contactos',
    label: 'Contactos & Decisores',
    category: 'ventas',
    description: 'Directorio de personas y contactos clave vinculados a empresas',
    isPrivate: true,
    aliases: ['/app/contacts', '/crm/people', '/contacts'],
  },
  companies: {
    id: 'companies',
    path: '/crm/empresas',
    label: 'Empresas & Cuentas',
    category: 'ventas',
    description: 'Directorio B2B con validación CUIT, condición IVA y salud de cuenta',
    isPrivate: true,
    aliases: ['/app/companies', '/crm/companies', '/companies'],
  },
  tasks: {
    id: 'tasks',
    path: '/crm/tareas',
    label: 'Actividades & Agenda',
    category: 'ventas',
    description: 'Gestor de tareas pendientes, seguimientos y compromisos comerciales',
    isPrivate: true,
    aliases: ['/app/tasks', '/crm/tasks', '/tasks'],
  },
  calendar: {
    id: 'calendar',
    path: '/crm/calendario',
    label: 'Calendario',
    category: 'ventas',
    description: 'Agenda semanal y mensual sincronizada de reuniones',
    isPrivate: true,
    aliases: ['/app/calendar', '/calendar'],
  },
  activityInbox: {
    id: 'activityInbox',
    path: '/crm/actividades',
    label: 'Notas y Llamadas',
    category: 'ventas',
    description: 'Bandeja de bitácora comercial, llamadas y notas de voz',
    isPrivate: true,
    aliases: ['/app/activities', '/crm/activities'],
  },
  propuestas: {
    id: 'propuestas',
    path: '/crm/propuestas',
    label: 'Propuestas & Presupuestos',
    category: 'ventas',
    description: 'Generador de presupuestos comerciales en PDF y cotizaciones',
    isPrivate: true,
    aliases: ['/app/proposals', '/crm/quotes'],
  },
  googleMaps: {
    id: 'googleMaps',
    path: '/crm/prospeccion',
    label: 'Prospección Google Maps',
    category: 'ventas',
    description: 'Extractor B2B de comercios y empresas locales con WhatsApp',
    isPrivate: true,
    aliases: ['/app/maps', '/crm/maps', '/maps-prospecting'],
  },

  // Rutas Privadas - Comunicación
  whatsapp: {
    id: 'whatsapp',
    path: '/communication/whatsapp',
    label: 'Bandeja Omnicanal WhatsApp',
    category: 'comunicacion',
    description: 'Atención en vivo por WhatsApp Business y transcripción de audios',
    isPrivate: true,
    aliases: ['/app/whatsapp', '/inbox/whatsapp', '/whatsapp'],
  },
  messages: {
    id: 'messages',
    path: '/communication/mensajes',
    label: 'Mensajes Directos',
    category: 'comunicacion',
    description: 'Mensajería interna del equipo comercial',
    isPrivate: true,
    aliases: ['/app/messages', '/messages'],
  },
  webmail: {
    id: 'webmail',
    path: '/communication/webmail',
    label: 'Webmail Cloudflare',
    category: 'comunicacion',
    description: 'Bandeja corporativa para dominios propios con DNS Cloudflare',
    isPrivate: true,
    aliases: ['/app/webmail', '/webmail'],
  },
  chatbot: {
    id: 'chatbot',
    path: '/communication/bots',
    label: 'Bots & Atención Automática',
    category: 'comunicacion',
    description: 'Configuración y entrenamiento de respuestas automáticas 24/7',
    isPrivate: true,
    aliases: ['/app/bots', '/bots'],
  },
  campaigns: {
    id: 'campaigns',
    path: '/communication/campanas',
    label: 'Campañas Masivas WhatsApp',
    category: 'comunicacion',
    description: 'Difusión de mensajes con plantillas aprobadas y segmentación',
    isPrivate: true,
    aliases: ['/app/campaigns', '/campaigns'],
  },

  // Rutas Privadas - IA & Agentes Autónomos
  agenteOS: {
    id: 'agenteOS',
    path: '/ai/agentes',
    label: 'AgenteOS (14 Roles)',
    category: 'ia',
    description: 'Organigrama de 14 agentes de IA ejecutables para tareas PyME',
    isPrivate: true,
    aliases: ['/app/agentes', '/ai/agents'],
  },
  aiAssistant: {
    id: 'aiAssistant',
    path: '/ai/copilot',
    label: 'Copilot Gemini 3.8',
    category: 'ia',
    description: 'Asistente directivo para priorización de tratos y estrategia',
    isPrivate: true,
    aliases: ['/app/copilot', '/ai/chat'],
  },
  workflows: {
    id: 'workflows',
    path: '/ai/flujos',
    label: 'Automatizaciones & Flujos DAG',
    category: 'ia',
    description: 'Diseñador visual de automatizaciones y disparadores de eventos',
    isPrivate: true,
    aliases: ['/app/workflows', '/workflows'],
  },
  gtmStrategy: {
    id: 'gtmStrategy',
    path: '/ai/estrategia',
    label: 'Estrategias GTM & Copy',
    category: 'ia',
    description: 'Generación de propuestas de valor, discursos comerciales y copies',
    isPrivate: true,
    aliases: ['/app/gtm', '/gtm'],
  },

  // Rutas Privadas - ERP & Operaciones PyME
  erp: {
    id: 'erp',
    path: '/erp/facturacion',
    label: 'Facturación AFIP & CAE',
    category: 'erp',
    description: 'Emisión de Facturas electrónicas A, B y C con CAE oficial',
    isPrivate: true,
    aliases: ['/app/erp', '/app/invoicing', '/erp/invoices'],
  },
  operations: {
    id: 'operations',
    path: '/erp/operaciones',
    label: 'Operaciones Internas',
    category: 'erp',
    description: 'Gestión logística, remitos y seguimiento de entregas',
    isPrivate: true,
    aliases: ['/app/operations', '/operations'],
  },
  payments: {
    id: 'payments',
    path: '/erp/cobros',
    label: 'Cobros Mercado Pago & Planes',
    category: 'erp',
    description: 'Checkout transparente, suscripciones y liquidaciones en ARS',
    isPrivate: true,
    aliases: ['/app/billing', '/billing', '/erp/payments'],
  },
  tiendaDigital: {
    id: 'tiendaDigital',
    path: '/erp/tienda',
    label: 'Tienda Digital WhatsApp',
    category: 'erp',
    description: 'Catálogo de productos con pedidos directos al chat de WhatsApp',
    isPrivate: true,
    aliases: ['/app/store', '/catalog', '/ecommerce'],
  },
  campusLMS: {
    id: 'campusLMS',
    path: '/erp/academia',
    label: 'Campus Academia LMS',
    category: 'erp',
    description: 'Cursos, onboarding y capacitación para el equipo comercial',
    isPrivate: true,
    aliases: ['/app/academy', '/app/lms'],
  },

  // Rutas Privadas - Administración & Sistema
  customObjects: {
    id: 'customObjects',
    path: '/admin/datos',
    label: 'Estructura de Datos',
    category: 'admin',
    description: 'Custom Objects dinámicos, campos a medida y metadatos relacionales',
    isPrivate: true,
    aliases: ['/app/custom-objects', '/admin/schemas'],
  },
  csvStudio: {
    id: 'csvStudio',
    path: '/admin/csv',
    label: 'Importar / Exportar CSV',
    category: 'admin',
    description: 'Carga y descarga masiva de empresas y contactos con mapeo',
    isPrivate: true,
    aliases: ['/app/csv', '/admin/import'],
  },
  domainManager: {
    id: 'domainManager',
    path: '/admin/dominios',
    label: 'Gestor de Dominios & DNS',
    category: 'admin',
    description: 'Vinculación de dominios personalizados y registros DNS SSL',
    isPrivate: true,
    aliases: ['/app/domains', '/admin/dns'],
  },
  settings: {
    id: 'settings',
    path: '/admin/ajustes',
    label: 'Ajustes de Empresa & AFIP',
    category: 'admin',
    description: 'Datos fiscales, certificados digitales, usuarios y preferencias',
    isPrivate: true,
    aliases: ['/app/settings', '/settings'],
  },

  // Rutas Módulos Canónicos de Documentación (dashboard_docs)
  erpAvanzado: {
    id: 'erpAvanzado',
    path: '/erp/avanzado',
    label: 'ERP Inventario & Gastos',
    category: 'erp',
    description: 'Subsistema ERP avanzado: inventario multialmacén, control de gastos y facturas',
    isPrivate: true,
    aliases: ['/app/erp-avanzado', '/erp/stock-gastos'],
  },
  vscrmSuite: {
    id: 'vscrmSuite',
    path: '/erp/vscrm',
    label: 'VS CRM & ERP Suite',
    category: 'erp',
    description: 'Control unificado de proyectos, registro de horas trabajadas y gastos de equipo',
    isPrivate: true,
    aliases: ['/app/vscrm', '/erp/proyectos-horas'],
  },
  wordpressIntegracion: {
    id: 'wordpressIntegracion',
    path: '/erp/wordpress',
    label: 'WordPress & WooCommerce',
    category: 'erp',
    description: 'Sincronización de catálogo, pedidos y automatizaciones con WooCommerce',
    isPrivate: true,
    aliases: ['/app/wordpress', '/erp/woocommerce'],
  },
  workspaceIntegrations: {
    id: 'workspaceIntegrations',
    path: '/communication/workspace',
    label: 'Google Workspace & Drive',
    category: 'comunicacion',
    description: 'Drive, Gmail, plantillas HTML, SMTP verificado y reuniones de Calendar',
    isPrivate: true,
    aliases: ['/app/workspace', '/communication/drive'],
  },
  adminConsole: {
    id: 'adminConsole',
    path: '/admin/consola',
    label: 'Consola y Auditoría General',
    category: 'admin',
    description: 'Supervisión ejecutiva de plataforma, rendimiento de operadores y seguridad RBAC',
    isPrivate: true,
    aliases: ['/app/admin-console', '/admin/auditoria'],
  },
  dashboardDocs: {
    id: 'dashboardDocs',
    path: '/admin/docs',
    label: 'Documentación Dashboard (18 MDs)',
    category: 'admin',
    description: 'Índice de los 18 módulos canónicos de especificación técnica del Dashboard',
    isPrivate: true,
    aliases: ['/app/docs', '/dashboard/docs'],
  },
};

/**
 * Lista consolidada de prefijos o rutas exactas consideradas privadas / shell autenticado
 */
export const PRIVATE_ROUTE_PREFIXES = [
  '/app',
  '/dashboard',
  '/crm',
  '/erp',
  '/hub',
  '/analytics',
  '/communication',
  '/ai',
  '/admin',
] as const;

/**
 * Determina si una ruta pertenece al entorno privado autenticado de ClientumOS
 */
export function isPrivateAppPath(pathname: string): boolean {
  if (!pathname) return false;
  const normalized = pathname.trim().toLowerCase();

  // Comprobar coincidencia directa o con prefijo
  if (PRIVATE_ROUTE_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))) {
    return true;
  }

  // Comprobar contra rutas y aliases del registro
  for (const route of Object.values(ROUTE_REGISTRY)) {
    if (route.isPrivate) {
      if (normalized === route.path || normalized.startsWith(`${route.path}/`)) {
        return true;
      }
      if (route.aliases?.some((alias) => normalized === alias || normalized.startsWith(`${alias}/`))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Obtener la ruta canónica asociada a un ActiveTab
 */
export function getRouteByTab(tab: ActiveTab): RouteDefinition | undefined {
  return ROUTE_REGISTRY[tab];
}

/**
 * Obtener el ActiveTab asociado a una URL
 */
export function getTabByPath(pathname: string): ActiveTab | null {
  if (!pathname) return null;
  const normalized = pathname.trim().toLowerCase();

  for (const [key, route] of Object.entries(ROUTE_REGISTRY)) {
    if (route.path === normalized) {
      return route.id as ActiveTab;
    }
    if (route.aliases?.includes(normalized)) {
      return route.id as ActiveTab;
    }
  }

  return null;
}
