import React from 'react';
import {
  Globe,
  Home,
  Briefcase,
  MessageSquare,
  GraduationCap,
  CreditCard,
  Mail,
  Building,
  Layers,
  Server,
  ShoppingBag,
  FolderGit2,
  BookOpen,
  Users,
  Zap,
  FileCheck
} from 'lucide-react';
import { ActiveTab } from '../types';

export interface PublicSiteDocItem {
  id: string;
  slug: string;
  filename: string;
  title: string;
  category: 'Sitio Público' | 'Landing Pages' | 'Recursos' | 'Institucional';
  badge: string;
  summary: string;
  purpose: string;
  components: string[];
  activeTabTarget: ActiveTab | string;
  isPublicRoute?: boolean;
  icon: React.ElementType;
}

export const PUBLIC_SITE_DOCS_CATALOG: PublicSiteDocItem[] = [
  {
    id: 'pub-inicio-heroe',
    slug: 'inicio-heroe',
    filename: 'inicio_heroe.md',
    title: 'Página de Inicio y Hero Principal',
    category: 'Sitio Público',
    badge: 'Portal Hero',
    summary: 'Propuesta de valor central, barra de prueba social, estadísticas y ticker de actividad en vivo para PyMEs.',
    purpose: 'La sección principal de bienvenida del sitio público de Clientum presenta la propuesta de valor como agencia líder de crecimiento comercial, Inteligencia Artificial y automatización para PyMEs en Latinoamérica.',
    components: [
      'Cabecera y Navegación (Navbar) con Acceso a App y Selector de Idioma',
      'Sección Hero Principal con Título de Crecimiento Comercial e IA',
      'Barra de Prueba Social (+450 PyMEs, 98.4% Satisfacción, $14M+ Transacciones)',
      'Ticker de Actividad en Vivo con Alertas de Conversión en Tiempo Real'
    ],
    activeTabTarget: 'dashboard',
    isPublicRoute: true,
    icon: Home
  },
  {
    id: 'pub-servicios-catalogo',
    slug: 'servicios-catalogo',
    filename: 'servicios_catalogo.md',
    title: 'Catálogo de Servicios y Soluciones B2B',
    category: 'Sitio Público',
    badge: 'Servicios B2B',
    summary: 'Desarrollo web, e-commerce, implementación de CRM/ERP, ciberseguridad e inteligencia artificial & BI.',
    purpose: 'Catálogo completo de servicios tecnológicos, desarrollo de software, consultoría digital y automatización de procesos para PyMEs y grandes empresas.',
    components: [
      'Categorías de Servicios: IA y Bots, E-Commerce, CRM & Ventas B2B, Marketing Digital & SEO, ERP & Facturación',
      'Implementación de Agente WhatsApp AI (Gemini 3.6)',
      'Desarrollo de E-Commerce a Medida (ClientumShop)',
      'Consultoría CRM y Auditoría SEO & Posicionamiento Orgánico'
    ],
    activeTabTarget: 'dashboard',
    isPublicRoute: true,
    icon: Briefcase
  },
  {
    id: 'pub-crm-whatsapp-ia',
    slug: 'crm-whatsapp-ia',
    filename: 'crm_whatsapp_ia.md',
    title: 'CRM, WhatsApp & Asistente IA',
    category: 'Sitio Público',
    badge: 'WhatsApp & Bot',
    summary: 'Flujo de atención 24/7 con chatbot, simulador interactivo de WhatsApp y pipeline comercial.',
    purpose: 'Presentación detallada de la solución omnicanal que combina CRM comercial, bandeja de entrada de WhatsApp e inteligencia artificial conversacional para automatizar la atención y ventas.',
    components: [
      'Simulador Interactivo de Chatbot de WhatsApp en la Web',
      'Flujo Automatizado de Calificación de Leads y Derivación',
      'Pipeline Comercial Integrado con Mensajería Instantánea'
    ],
    activeTabTarget: 'whatsapp',
    isPublicRoute: false,
    icon: MessageSquare
  },
  {
    id: 'pub-academia-lms',
    slug: 'academia-lms',
    filename: 'academia_lms.md',
    title: 'Academia LMS (Sitio Público)',
    category: 'Recursos',
    badge: 'Capacitación PyME',
    summary: 'Cursos de capacitación corporativa, módulos interactivos y sandboxes para operadores y PyMEs.',
    purpose: 'Portal de formación continua que ofrece cursos especializados en automatización de ventas, uso de CRM y estrategias de marketing digital para equipos comerciales.',
    components: [
      'Catálogo de Cursos Interactivos con Certificación ClientumOS',
      'Módulos de Práctica y Sandboxes Interactivos',
      'Seguimiento de Progreso para Operadores'
    ],
    activeTabTarget: 'campusLMS',
    isPublicRoute: false,
    icon: GraduationCap
  },
  {
    id: 'pub-precios-cotizador',
    slug: 'precios-cotizador',
    filename: 'precios_cotizador.md',
    title: 'Precios y Cotizador Interactivo',
    category: 'Sitio Público',
    badge: 'Cotizador B2B',
    summary: 'Planes Starter, Pro y Enterprise, cotizador paso a paso y desglose de inversión en ARS y USD.',
    purpose: 'Sección transparente de planes tarifarios y cotizador interactivo que permite calcular la inversión exacta según cantidad de usuarios, volumen de WhatsApp y módulos ERP requeridos.',
    components: [
      'Planes Tarifarios: Starter, Professional y Enterprise',
      'Cotizador Paso a Paso con Desglose de Módulos',
      'Pasarela de Pago Mercado Pago y Facturación AFIP Integrada'
    ],
    activeTabTarget: 'payments',
    isPublicRoute: false,
    icon: CreditCard
  },
  {
    id: 'pub-contacto-faq',
    slug: 'contacto-faq',
    filename: 'contacto_faq.md',
    title: 'Contacto, FAQ & SLA',
    category: 'Institucional',
    badge: 'SLA & Soporte',
    summary: 'Formulario de contacto directo, preguntas frecuentes institucionales y compromisos de SLA.',
    purpose: 'Canal de atención institucional con preguntas frecuentes resueltas, datos de contacto de oficinas en Argentina y compromisos de Acuerdo de Nivel de Servicio (SLA 99.9%).',
    components: [
      'Formulario de Consulta Comercial y Soporte Técnico',
      'Preguntas Frecuentes (FAQ) sobre Implementación y Seguridad',
      'Acuerdos de Nivel de Servicio (SLA) y Tiempos de Respuesta'
    ],
    activeTabTarget: 'dashboard',
    isPublicRoute: true,
    icon: Mail
  },
  {
    id: 'pub-clientum-crm-landing',
    slug: 'clientum-crm-landing',
    filename: 'clientum_crm_landing.md',
    title: 'Clientum CRM Landing Específica',
    category: 'Landing Pages',
    badge: 'Landing CRM',
    summary: 'Landing dedicada a la gestión comercial, etapas del pipeline, integraciones y FAQs comerciales.',
    purpose: 'Página de aterrizaje optimizada para conversión enfocada en las capacidades específicas del CRM comercial de ClientumOS.',
    components: [
      'Demostración del Tablero Kanban y Fichas 360°',
      'Metodología de Ventas MEDDIC y BANT',
      'Casos de Éxito de Conversión Comercial'
    ],
    activeTabTarget: 'opportunities',
    isPublicRoute: false,
    icon: Layers
  },
  {
    id: 'pub-industrias-verticales',
    slug: 'industrias-verticales',
    filename: 'industrias_verticales.md',
    title: 'Industrias Verticales y Soluciones por Rubro',
    category: 'Landing Pages',
    badge: 'Verticales B2B',
    summary: 'Soluciones y flujos de WhatsApp para Agro, Inmobiliaria, Estudios Contables, Distribuidoras, Salud y Gastronomía.',
    purpose: 'Muestra de aplicaciones especializadas por sector industrial adaptadas a los flujos operativos particulares de cada rubro en Argentina y Latinoamérica.',
    components: [
      'Verticales: Agro, Inmobiliaria, Estudios Contables, Distribuidoras, Salud, Gastronomía',
      'Adaptación de Flujos de WhatsApp y Facturación AFIP por Industria',
      'Casos de Uso Específicos por Sector'
    ],
    activeTabTarget: 'dashboard',
    isPublicRoute: true,
    icon: Building
  },
  {
    id: 'pub-sobre-nosotros',
    slug: 'sobre-nosotros',
    filename: 'sobre_nosotros.md',
    title: 'Sobre Nosotros (Historia y Misión)',
    category: 'Institucional',
    badge: 'Nuestra Empresa',
    summary: 'Historia de la compañía, misión de democratización tecnológica y valores institucionales.',
    purpose: 'Reseña de la fundación de Clientum, su equipo directivo y la visión de transformar la gestión digital de las PyMEs latinoamericanas mediante software abierto y accesible.',
    components: [
      'Manifiesto y Misión de Democratización Tecnológica',
      'Valores de Transparencia, Innovación y Soporte Cercano',
      'Trayectoria de la Compañía en Argentina y Brasil'
    ],
    activeTabTarget: 'dashboard',
    isPublicRoute: true,
    icon: Users
  },
  {
    id: 'pub-dominios-cloudflare',
    slug: 'dominios-cloudflare',
    filename: 'dominios_cloudflare.md',
    title: 'Dominios y Cloudflare Anycast Edge',
    category: 'Sitio Público',
    badge: 'Anycast DNS',
    summary: 'Portal público de gestión de zonas DNS, certificados SSL y métricas de red Anycast.',
    purpose: 'Documentación de la infraestructura de alta disponibilidad respaldada por Cloudflare Anycast Edge para garantizar velocidad global y seguridad SSL en dominios personalizados.',
    components: [
      'Gestión de Registros DNS (A, CNAME, TXT, MX)',
      'Certificados SSL Universales y Seguridad WAF',
      'Métricas de Rendimiento Edge y CDN'
    ],
    activeTabTarget: 'domainManager',
    isPublicRoute: false,
    icon: Server
  },
  {
    id: 'pub-tienda-storefront',
    slug: 'tienda-storefront',
    filename: 'tienda_storefront.md',
    title: 'Storefront y Catálogo E-Commerce',
    category: 'Sitio Público',
    badge: 'Storefront B2B',
    summary: 'Catálogo B2B público, carrito interactivo y derivación de pedidos a WhatsApp y CRM.',
    purpose: 'Módulo de tienda online optimizado para mayoristas y distribuidores, permitiendo seleccionar productos, armar carritos y derivar órdenes directamente a WhatsApp.',
    components: [
      'Catálogo de Productos B2B con Filtros por Categoría',
      'Carrito de Compras y Cotizador Instantáneo',
      'Derivación de Pedidos a WhatsApp y Creación de Trato en CRM'
    ],
    activeTabTarget: 'tiendaDigital',
    isPublicRoute: false,
    icon: ShoppingBag
  },
  {
    id: 'pub-proyectos-destacados',
    slug: 'proyectos-destacados',
    filename: 'proyectos_destacados.md',
    title: 'Proyectos Clave y Casos de Éxito',
    category: 'Institucional',
    badge: 'Casos de Éxito',
    summary: 'Casos reales implementados (Prospección IA, Bot WhatsApp AFIP, Consorcio de Riego ERP, Lubrano Hogar).',
    purpose: 'Exhibición de implementaciones tecnológicas exitosas realizadas para clientes corporativos de diversos rubros.',
    components: [
      'Caso 1: Bot WhatsApp AFIP para Distribuidora Mayorista',
      'Caso 2: ERP Multialmacén para Consorcio de Riego',
      'Caso 3: Automatización de Prospección IA para Agencia B2B'
    ],
    activeTabTarget: 'dashboard',
    isPublicRoute: true,
    icon: FolderGit2
  },
  {
    id: 'pub-blog-articulos',
    slug: 'blog-articulos',
    filename: 'blog_articulos.md',
    title: 'Blog y Artículos PyME',
    category: 'Recursos',
    badge: 'Artículos & Guías',
    summary: 'Guías de SEO 2026, tendencias de comercio omnicanal y estrategias de embudos de ventas.',
    purpose: 'Centro de recursos con artículos y whitepapers orientados a educar a los empresarios PyME en transformación digital, facturación electrónica y automatización.',
    components: [
      'Guías Prácticas de Facturación AFIP y Mercado Pago',
      'Tendencias de Comercio Omnicanal y WhatsApp Business',
      'Estrategias de Embudos de Conversión B2B'
    ],
    activeTabTarget: 'dashboard',
    isPublicRoute: true,
    icon: BookOpen
  },
  {
    id: 'pub-organigrama-equipo',
    slug: 'organigrama-equipo',
    filename: 'organigrama_equipo.md',
    title: 'Organigrama y Sedes Internacionales',
    category: 'Institucional',
    badge: 'Organigrama',
    summary: 'Sede Matriz en Argentina (General Roca), Sede Internacional en Brasil (Arraial do Cabo) y estructura operativa.',
    purpose: 'Estructura organizacional de Clientum, detallando equipos de desarrollo, soporte, ventas y las ubicaciones de sus oficinas principales en Argentina y Brasil.',
    components: [
      'Sede Matriz Argentina (General Roca, Río Negro)',
      'Sede Internacional Brasil (Arraial do Cabo, RJ)',
      'Estructura de Equipos de Ingeniería, Soporte y Ventas'
    ],
    activeTabTarget: 'dashboard',
    isPublicRoute: true,
    icon: Users
  },
  {
    id: 'pub-auditoria-express',
    slug: 'auditoria-express',
    filename: 'auditoria_express.md',
    title: 'Diagnóstico Digital y Auditoría Express',
    category: 'Landing Pages',
    badge: 'Auditoría 60s',
    summary: 'Módulo de diagnóstico en 60 segundos de madurez digital, WhatsApp y presencia en Google.',
    purpose: 'Herramienta interactiva de conversión que evalúa la madurez digital del usuario y genera un reporte instantáneo con recomendaciones de mejora.',
    components: [
      'Cuestionario de 4 Variables de Madurez Digital',
      'Análisis de Velocidad, WhatsApp y Google Maps',
      'Reporte Instantáneo y Recomendación de Solución Clientum'
    ],
    activeTabTarget: 'dashboard',
    isPublicRoute: true,
    icon: Zap
  },
  {
    id: 'pub-brochure-corporativo',
    slug: 'brochure-corporativo',
    filename: 'brochure_corporativo.md',
    title: 'Brochure y Ficha Técnica Corporativa',
    category: 'Recursos',
    badge: 'Brochure PDF',
    summary: 'Resumen ejecutivo institucional y exportador PDF para presentaciones comerciales.',
    purpose: 'Documento resumen con la propuesta de valor integral, especificaciones técnicas de la plataforma y módulos disponibles para compartir con comités directivos.',
    components: [
      'Resumen Ejecutivo de la Suite ClientumOS',
      'Especificaciones Técnicas y Seguridad Cloud',
      'Exportador e Impresor de Brochure Comercial en PDF'
    ],
    activeTabTarget: 'dashboard',
    isPublicRoute: true,
    icon: FileCheck
  }
];
