// Catalog data loaded directly from official Clientum 2026 Brochure & Product Catalog CSV

export interface CatalogItem {
  id: string;
  sku: string;
  type: 'service' | 'plan' | 'course' | 'solution';
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  regularPrice: number; // in USD or ARS base
  currency: 'ARS' | 'USD';
  tags: string[];
  features?: string[];
  implementationDays?: string;
  specs?: {
    web?: string;
    crmErp?: string;
    security?: string;
    aiBi?: string;
  };
}

export const CLIENTUM_BROCHURE_METRICS = {
  activePymes: '1.750+',
  yearsExp: '12+',
  satisfaction: '4.8/5',
  slaReal: '99.9%',
  location: 'General Roca, Río Negro, Argentina (Patagonia)',
  website: 'clientum.com.ar',
  email: 'info@clientum.com.ar',
  phone: '+54 298 451-0883',
  github: 'https://github.com/clientum'
};

export const CLIENTUM_PILLARS = [
  {
    title: '100% Argentino',
    desc: 'Precios fijos en pesos, soporte local dedicado e integración nativa con AFIP (comprobantes A, B, C con CAE en tiempo real).'
  },
  {
    title: 'Implementación Rápida',
    desc: 'Operativo en menos de una semana (< 5 días hábiles promedio), sin necesidad de departamento de IT interno.'
  },
  {
    title: 'Soporte Humano Real',
    desc: 'Respuestas ejecutivas en menos de 4 horas vía WhatsApp por asesores comerciales dedicados.'
  },
  {
    title: 'Soberanía & Código Abierto',
    desc: 'Repositorios públicos en GitHub y soberanía total sobre los datos en servidores nacionales.'
  }
];

export const CLIENTUM_SERVICES: CatalogItem[] = [
  {
    id: 'srv-1',
    sku: 'SRV-1',
    type: 'service',
    name: 'Consultoría & CRM Omnicanal',
    category: 'Servicios > General',
    shortDescription: 'Diseño e implementación de procesos comerciales y gestión integral de contactos y oportunidades.',
    description: 'Pipeline Drag & Drop a medida, historial unificado de chats y llamadas, capacitación intensiva a vendedores.',
    regularPrice: 150000,
    currency: 'ARS',
    tags: ['servicio', 'clientum', 'crm'],
    features: ['Pipeline Drag & Drop a medida', 'Historial unificado de chats', 'Capacitación a vendedores'],
    implementationDays: '5 días hábiles'
  },
  {
    id: 'srv-2',
    sku: 'SRV-2',
    type: 'service',
    name: 'Agentes & Chatbot WhatsApp IA',
    category: 'Servicios > General',
    shortDescription: 'Desarrollo de agente virtual conversacional alimentado por Gemini 3.6 Flash y catálogo propio.',
    description: 'Atención 24/7, entrenamiento de catálogo y FAQs, agendamiento de reuniones y calificación automática de leads.',
    regularPrice: 180000,
    currency: 'ARS',
    tags: ['servicio', 'clientum', 'whatsapp', 'ia'],
    features: ['Entrenamiento catálogo y FAQs', 'Agendamiento de reuniones', 'Calificación automática de leads'],
    implementationDays: '7 días hábiles'
  },
  {
    id: 'srv-3',
    sku: 'SRV-3',
    type: 'service',
    name: 'Integraciones AFIP & ERP',
    category: 'Servicios > General',
    shortDescription: 'Conexión directa con AFIP para emisión de facturas electrónicas A, B, C automáticas y sincronización contable.',
    description: 'CAE automático en tiempo real, envío por email/WhatsApp de facturas y vinculación con CBU directo.',
    regularPrice: 120000,
    currency: 'ARS',
    tags: ['servicio', 'clientum', 'afip', 'erp'],
    features: ['CAE automático en tiempo real', 'Envío por email/WhatsApp', 'Configuración de cuentas'],
    implementationDays: '3 días hábiles'
  },
  {
    id: 'srv-4',
    sku: 'SRV-4',
    type: 'service',
    name: 'Business Intelligence & Analítica',
    category: 'Servicios > General',
    shortDescription: 'Dashboards analíticos con KPIs en tiempo real, atribución de ventas y reportes ejecutivos.',
    description: 'Conversión por canal y vendedor, atribución de ingresos, reportes mensuales en PDF/XLS automáticos.',
    regularPrice: 140000,
    currency: 'ARS',
    tags: ['servicio', 'clientum', 'bi', 'analytics'],
    features: ['Conversión por canal y vendedor', 'Atribución de ingresos', 'Reportes automáticos mensualmente'],
    implementationDays: '4 días hábiles'
  },
  {
    id: 'srv-5',
    sku: 'SRV-5',
    type: 'service',
    name: 'Desarrollo Web & E-Commerce',
    category: 'Servicios > General',
    shortDescription: 'Diseño y desarrollo de sitios corporativos, landing pages de alta conversión y tiendas online.',
    description: 'Pasarelas de cobro integradas (MercadoPago, Stripe), diseño UI/UX premium y optimización SEO.',
    regularPrice: 220000,
    currency: 'ARS',
    tags: ['servicio', 'clientum', 'web', 'ecommerce'],
    features: ['Pasarelas de cobro integradas', 'Diseño UI/UX premium', 'Optimización SEO y velocidad'],
    implementationDays: '18 días hábiles'
  },
  {
    id: 'srv-6',
    sku: 'SRV-6',
    type: 'service',
    name: 'Growth Marketing & Outreach',
    category: 'Servicios > General',
    shortDescription: 'Estrategias de prospección automatizada, campañas masivas de WhatsApp y generación de prospectos B2B.',
    description: 'Campañas de nutrición de leads, prospección asistida por IA y optimización constante de ROI.',
    regularPrice: 160000,
    currency: 'ARS',
    tags: ['servicio', 'clientum', 'growth', 'marketing'],
    features: ['Campañas de nutrición de leads', 'Prospección asistida por IA', 'Optimización constante de ROI'],
    implementationDays: '5 días hábiles'
  }
];

export const CLIENTUM_PLANS: CatalogItem[] = [
  {
    id: 'pln-1',
    sku: 'PLN-inicial',
    type: 'plan',
    name: 'Plan Inicial',
    category: 'Planes > Suscripción mensual',
    shortDescription: 'Para emprendedores y pequeños negocios.',
    description: 'Landing page responsiva, embudo básico para 200 contactos, respaldos mensuales y bot de bienvenida fijo.',
    regularPrice: 20,
    currency: 'USD',
    tags: ['plan', 'suscripcion', 'clientum'],
    specs: {
      web: 'Landing page responsiva',
      crmErp: 'Embudo básico (200 cont.)',
      security: 'Respaldos mensuales',
      aiBi: 'Bot de bienvenida fijo'
    }
  },
  {
    id: 'pln-2',
    sku: 'PLN-pyme',
    type: 'plan',
    name: 'Plan PyME',
    category: 'Planes > Suscripción mensual',
    shortDescription: 'Para comercios con ventas activas.',
    description: 'Tienda online estándar, gestión de stock + facturación AFIP para 1.000 contactos, cifrado de base de datos y bot WhatsApp FAQs.',
    regularPrice: 45,
    currency: 'USD',
    tags: ['plan', 'suscripcion', 'clientum'],
    specs: {
      web: 'Tienda online estándar',
      crmErp: 'Stock + AFIP (1.000 cont.)',
      security: 'Cifrado de base de datos',
      aiBi: 'Bot WhatsApp con FAQs'
    }
  },
  {
    id: 'pln-3',
    sku: 'PLN-pro',
    type: 'plan',
    name: 'Plan Pro',
    category: 'Planes > Suscripción mensual',
    shortDescription: 'Para automatizar con IA, bots y facturación.',
    description: 'E-Commerce premium total, multi-embudo ilimitado, auditorías de software y Agente IA & BI avanzado.',
    regularPrice: 80,
    currency: 'USD',
    tags: ['plan', 'suscripcion', 'clientum'],
    specs: {
      web: 'E-Commerce premium total',
      crmErp: 'Multi-embudo ilimitado',
      security: 'Auditorías de software',
      aiBi: 'Agente IA & BI avanzado'
    }
  },
  {
    id: 'pln-4',
    sku: 'PLN-corporativo',
    type: 'plan',
    name: 'Plan Corporativo',
    category: 'Planes > Suscripción mensual',
    shortDescription: 'Para empresas con múltiples canales activos.',
    description: 'Portal B2B + Web integral, pipeline multi-sucursal, hardening, firewall y analítica predictiva con bots.',
    regularPrice: 150,
    currency: 'USD',
    tags: ['plan', 'suscripcion', 'clientum'],
    specs: {
      web: 'Portal B2B + Web integral',
      crmErp: 'Pipeline multi-sucursal',
      security: 'Hardening y firewall',
      aiBi: 'Analítica predictiva & bots'
    }
  },
  {
    id: 'pln-5',
    sku: 'PLN-especializado',
    type: 'plan',
    name: 'Plan Especializado',
    category: 'Planes > Suscripción mensual',
    shortDescription: 'Infraestructura y desarrollos a medida.',
    description: 'Apps web & mobile infinitas, integraciones ERP legacy, SOC activo 24/7 dedicado y modelos LLM corporativos.',
    regularPrice: 250,
    currency: 'USD',
    tags: ['plan', 'suscripcion', 'clientum'],
    specs: {
      web: 'Apps web & mobile infinitas',
      crmErp: 'Integraciones ERP legacy',
      security: 'SOC activo 24/7 dedicado',
      aiBi: 'Modelos LLM corporativos'
    }
  }
];

export const CLIENTUM_COURSES: CatalogItem[] = [
  {
    id: 'crs-1',
    sku: 'CRS-CRS-1321',
    type: 'course',
    name: 'Marketing Digital para Principiantes',
    category: 'Cursos > Campus Virtual',
    shortDescription: 'Curso introductorio y 100% práctico pensado para dueños de PyME, emprendedores y profesionales.',
    description: 'Aprende las bases del marketing digital, pauta publicitaria en redes, embudos simples y captación de clientes.',
    regularPrice: 0,
    currency: 'USD',
    tags: ['curso', 'capacitacion', 'clientum']
  },
  {
    id: 'crs-2',
    sku: 'CRS-CRS-1001',
    type: 'course',
    name: 'CRM Clientum: Ventas, Kanban y Pipeline Inteligente',
    category: 'Cursos > Campus Virtual',
    shortDescription: 'Dominá el ciclo de vida del cliente.',
    description: 'Aprendé a configurar tu embudo de ventas Kanban, orquestar contactos con Inteligencia Artificial y calificar oportunidades automáticamente.',
    regularPrice: 0,
    currency: 'USD',
    tags: ['curso', 'capacitacion', 'clientum']
  },
  {
    id: 'crs-3',
    sku: 'CRS-CRS-1002',
    type: 'course',
    name: 'Chatbots de WhatsApp y Captación Automática',
    category: 'Cursos > Campus Virtual',
    shortDescription: 'Configuración de agentes conversacionales para WhatsApp.',
    description: 'Aprende a desplegar chatbots inteligentes con Gemini 3.6, calificar leads 24/7 y derivar conversaciones clave a tus vendedores.',
    regularPrice: 0,
    currency: 'USD',
    tags: ['curso', 'capacitacion', 'clientum']
  }
];

export const CLIENTUM_SOLUTIONS: CatalogItem[] = [
  { id: 'sol-1', sku: 'SOL-chatbot', type: 'solution', name: 'Chatbot WhatsApp 24/7', category: 'Soluciones > Plataforma', shortDescription: 'Tu negocio atiende solo, las 24 horas.', description: 'Atiende, califica, agenda y responde a cualquier hora sin intervenciones humanas.', regularPrice: 0, currency: 'USD', tags: ['solucion', 'plataforma', 'clientum'] },
  { id: 'sol-2', sku: 'SOL-crm_inteligente', type: 'solution', name: 'CRM Inteligente', category: 'Soluciones > Plataforma', shortDescription: 'Nunca más perdas una venta.', description: 'Pipeline visual drag & drop, seguimiento automático de clientes y gestión comercial unificada.', regularPrice: 0, currency: 'USD', tags: ['solucion', 'plataforma', 'clientum'] },
  { id: 'sol-3', sku: 'SOL-asistente_ia', type: 'solution', name: 'Asistente IA Gemini 3.6', category: 'Soluciones > Plataforma', shortDescription: 'Tu analista de negocio, siempre disponible.', description: 'Haz preguntas en castellano rioplatense y obtén tendencias, análisis de ingresos y estrategias.', regularPrice: 0, currency: 'USD', tags: ['solucion', 'plataforma', 'clientum'] },
  { id: 'sol-4', sku: 'SOL-reportes', type: 'solution', name: 'Reportes Automáticos', category: 'Soluciones > Plataforma', shortDescription: 'Dashboards en tiempo real para decisiones basadas en datos.', description: '8+ plantillas de reportes de actividad, conversión comercial y facturación directo a tu email.', regularPrice: 0, currency: 'USD', tags: ['solucion', 'plataforma', 'clientum'] },
  { id: 'sol-5', sku: 'SOL-automatizacion', type: 'solution', name: 'Automatización Sin Código', category: 'Soluciones > Plataforma', shortDescription: 'Hacé más con menos esfuerzo.', description: 'Reglas y flujos de trabajo sin código. Tareas, re-asignaciones y alertas automáticas.', regularPrice: 0, currency: 'USD', tags: ['solucion', 'plataforma', 'clientum'] },
  { id: 'sol-6', sku: 'SOL-portal_cliente', type: 'solution', name: 'Portal del Cliente Marca Blanca', category: 'Soluciones > Plataforma', shortDescription: 'Tus clientes se autoatienden.', description: 'Tus clientes ven facturas AFIP, saldos corrientes e historial de pedidos en su propio portal.', regularPrice: 0, currency: 'USD', tags: ['solucion', 'plataforma', 'clientum'] },
  { id: 'sol-7', sku: 'SOL-desarrollo_web', type: 'solution', name: 'Desarrollo Web & E-Commerce', category: 'Soluciones > Plataforma', shortDescription: 'Tu presencia web, conectada al CRM.', description: 'Sitios y tiendas online de alta velocidad con pasarelas de pago y sincronización directa.', regularPrice: 0, currency: 'USD', tags: ['solucion', 'plataforma', 'clientum'] },
  { id: 'sol-8', sku: 'SOL-integraciones', type: 'solution', name: 'Integraciones AFIP & ERP', category: 'Soluciones > Plataforma', shortDescription: 'WhatsApp, AFIP, MercadoPago, Gmail y más.', description: 'Emisión de facturas A/B/C con CAE en tiempo real y conectividad con más de 50 herramientas.', regularPrice: 0, currency: 'USD', tags: ['solucion', 'plataforma', 'clientum'] }
];

export const CLIENTUM_CASE_STUDY = {
  quote: "Implementamos Clientum en 5 días. El bot de WhatsApp nos generó 40% más de consultas en el primer mes sin contratar personal adicional.",
  author: "Martín R.",
  company: "Distribuidora del Sur S.A.",
  quote2: "Trabajar con la agencia Clientum transformó por completo nuestro proceso de ventas. Nos implementaron el CRM y el chatbot de WhatsApp en menos de 10 días, calificando 150+ leads semanales y ahorrando 20 horas de tareas manuales al mes.",
  author2: "Ing. Roberto Albarracín",
  company2: "CEO, Grupo Agro-Industrial Patagonia",
  metrics: [
    { value: '+35%', label: 'Cierre Comercial' },
    { value: '-40%', label: 'Costo por Lead' },
    { value: '-90%', label: 'Tiempo de Espera Bot' },
    { value: '+60%', label: 'ROI en Publicidad' }
  ]
};
