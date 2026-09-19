export type PublicRoutePath =
  | '/'
  | '/producto'
  | '/producto/dashboard'
  | '/producto/crm'
  | '/producto/whatsapp-ia'
  | '/producto/automatizaciones'
  | '/producto/marketing'
  | '/producto/seo'
  | '/producto/erp'
  | '/producto/bi'
  | '/producto/agentes-ia'
  | '/producto/integraciones'
  | '/clientum-crm'
  | '/precios'
  | '/planes'
  | '/cotizador'
  | '/industrias'
  | '/industrias/agro'
  | '/industrias/estudios-contables'
  | '/industrias/distribuidoras'
  | '/industrias/salud'
  | '/industrias/inmobiliaria'
  | '/industrias/gastronomia'
  | '/industrias/ecommerce'
  | '/industrias/b2b'
  | '/industrias/construccion'
  | '/industrias/automotor'
  | '/casos'
  | '/casos-de-exito'
  | '/casos-exito'
  | '/proyectos'
  | '/servicios'
  | '/recursos'
  | '/blog'
  | '/academia'
  | '/desarrolladores'
  | '/api-docs'
  | '/ayuda'
  | '/contacto'
  | '/demo'
  | '/about'
  | '/nosotros'
  | '/empresa'
  | '/clientes'
  | '/ecosistema'
  | '/partners'
  | '/alianzas'
  | '/afiliados'
  | '/empleo'
  | '/trabajo'
  | '/carreras'
  | '/trabaja-con-nosotros'
  | '/tienda'
  | '/tienda/central'
  | '/dominios'
  | '/cloudflare'
  | '/auditoria-express'
  | '/diagnostico'
  | '/brochure'
  | '/ficha-tecnica'
  | '/organigrama'
  | '/sedes'
  | '/equipo'
  | '/crm-whatsapp-ia'
  | '/legal'
  | '/privacidad'
  | '/terminos';

export interface PublicNavigationItem {
  label: string;
  path: PublicRoutePath;
  badge?: string;
  description?: string;
}

export const PRODUCT_SUBNAV: PublicNavigationItem[] = [
  { label: 'Dashboard & Control Ejecutivo', path: '/producto/dashboard', description: 'Semáforo de alertas, deal rotting, pipeline ponderado y Copilot IA', badge: 'En Vivo' },
  { label: 'CRM 360° Omnicanal', path: '/producto/crm', description: 'Pipeline Kanban, MEDDIC y gestión comercial de punta a punta' },
  { label: 'WhatsApp IA & Bots', path: '/producto/whatsapp-ia', description: 'Atención 24/7 con IA Gemini 3.6 y catálogo sincronizado', badge: 'Popular' },
  { label: 'Automatizaciones DAG', path: '/producto/automatizaciones', description: 'Editor visual de flujos sin código para tareas y alertas' },
  { label: 'Marketing & Outreach', path: '/producto/marketing', description: 'Campañas masivas, secuencias de prospección y copywriter' },
  { label: 'SEO Suite & Keywords', path: '/producto/seo', description: 'Auditoría On-Page, bóveda de palabras clave y ranking' },
  { label: 'ERP & Facturación AFIP', path: '/producto/erp', description: 'Facturas A, B, C con CAE en tiempo real, inventario y gastos', badge: 'AFIP CAE' },
  { label: 'Business Intelligence', path: '/producto/bi', description: 'Métricas de conversión, atribución de ventas y forecast' },
  { label: 'Agente OS (14 Agentes)', path: '/producto/agentes-ia', description: 'Organigrama corporativo autónomo con modelos Gemini', badge: 'Nuevo' },
  { label: 'Integraciones Nativas', path: '/producto/integraciones', description: 'Conexión con MercadoPago, Gmail, Google Drive, WordPress y más' }
];

export const INDUSTRIES_SUBNAV: PublicNavigationItem[] = [
  { label: 'Agroindustria & Maquinaria', path: '/industrias/agro', description: 'Acopios, insumos y maquinaria en la región pampeana y patagónica' },
  { label: 'Estudios Contables', path: '/industrias/estudios-contables', description: 'Gestión masiva de clientes, vencimientos y facturación AFIP' },
  { label: 'Distribuidoras Mayoristas', path: '/industrias/distribuidoras', description: 'Catálogo de pedidos rápidos B2B por WhatsApp y logística' },
  { label: 'Salud & Clínicas', path: '/industrias/salud', description: 'Agendamiento automático de turnos y recordatorios anti-ausentismo' },
  { label: 'Inmobiliarias & Desarrollos', path: '/industrias/inmobiliaria', description: 'Portales de propiedades, calificación y contratos' },
  { label: 'Gastronomía & Bares', path: '/industrias/gastronomia', description: 'Carta digital QR, reservas y comandas por WhatsApp' },
  { label: 'E-Commerce & Retail', path: '/industrias/ecommerce', description: 'Recuperación de carritos abandonados y soporte postventa' },
  { label: 'Servicios B2B & Corporativos', path: '/industrias/b2b', description: 'Ciclos de venta consultiva y calificación de decisores' },
  { label: 'Construcción & Corralones', path: '/industrias/construccion', description: 'Presupuestos de obra, acopio de materiales y entregas' },
  { label: 'Automotor & Concesionarias', path: '/industrias/automotor', description: 'Seguimiento de unidades, test-drives y service de taller' }
];
