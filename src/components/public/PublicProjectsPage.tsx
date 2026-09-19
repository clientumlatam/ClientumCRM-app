import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Code2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Filter,
  TrendingUp,
  Server,
  Globe,
  MessageSquare,
  Tractor,
  Tv,
  Store,
  Tag
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';

interface PublicProjectsPageProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenSimulator: () => void;
  onOpenWizard: () => void;
}

export interface FeaturedProject {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: 'IA & Geolocalización' | 'Automatización & CRM' | 'ERP & Agroindustria' | 'E-Commerce & Retail' | 'Medios & Streaming PWA';
  badge?: string;
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  actionType: 'simulator' | 'wizard' | 'demo' | 'contact';
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'prospecting-ia',
    slug: 'prospecting-ia',
    title: 'Prospección Maps & Inteligencia B2B',
    client: 'ClientumOS Core & Equipos de Venta Saliente',
    category: 'IA & Geolocalización',
    badge: 'Destacado IA',
    summary: 'Módulo interactivo de prospección comercial basado en Google Maps API y enriquecimiento predictivo con Gemini 2.5.',
    challenge: 'Los vendedores pasaban horas buscando comercios en directorios desactualizados y copiando datos a mano sin validar estado fiscal ni números de WhatsApp.',
    solution: 'Buscador geoespacial con radio dinámico que extrae empresas activas, califica el potencial del prospecto mediante IA y lo importa con 1 clic al pipeline Kanban.',
    impact: 'Multiplica por 4 la cantidad de prospectos calificados contactados por semana.',
    metrics: [
      { label: 'Tiempo de prospección', value: '-75%' },
      { label: 'Importación al CRM', value: '1 Clic' },
      { label: 'Precisión de contacto', value: '94%' }
    ],
    stack: ['React 18', 'Leaflet / Google Maps', 'Gemini 2.5', 'Node.js', 'Tailwind CSS'],
    actionType: 'demo'
  },
  {
    id: 'whatsapp-crm',
    slug: 'whatsapp-crm',
    title: 'Bot de WhatsApp Business & CRM Omnicanal',
    client: 'Empresas de Servicios & Distribuidoras del Alto Valle',
    category: 'Automatización & CRM',
    badge: 'Most Hired',
    summary: 'Agente conversacional multiagente sincronizado en tiempo real con pipeline de oportunidades y facturación electrónica AFIP.',
    challenge: 'Pérdida recurrente de ventas por mensajes sin responder fuera de horario comercial y falta de seguimiento unificado entre asesores.',
    solution: 'Conexión Cloud API oficial + Baileys con respuestas inteligentes contextuales, calificación de leads y pase transparente a vendedores humanos.',
    impact: 'Respuesta promedio en menos de 10 segundos las 24 horas y aumento sostenido del 35% en cierres comerciales.',
    metrics: [
      { label: 'Velocidad de respuesta', value: '< 10 seg' },
      { label: 'Aumento en cierres', value: '+35%' },
      { label: 'Disponibilidad', value: '24/7' }
    ],
    stack: ['WhatsApp Business API', 'Node.js', 'Express', 'CRM Sync', 'AFIP WSFE'],
    actionType: 'simulator'
  },
  {
    id: 'consorcio-riego',
    slug: 'consorcio-riego',
    title: 'Consorcio de Riego ERP & Trazabilidad',
    client: 'Consorcio de Regantes & Productores Frutícolas',
    category: 'ERP & Agroindustria',
    summary: 'Sistema a medida para gestión de turnos hídricos, padrón de regantes, cuenta corriente y facturación masiva de cánones.',
    challenge: 'Manejo de más de 1.200 regantes en ficheros físicos y planillas desconectadas, con cobranzas morosas y padrones desactualizados.',
    solution: 'Portal integral con catastro rural georreferenciado, cálculo automático de canon por hectárea y liquidaciones con comprobantes oficiales.',
    impact: 'Reducción de la mora al 8% y trazabilidad total del caudal hídrico distribuido por canal.',
    metrics: [
      { label: 'Regantes gestionados', value: '1.200+' },
      { label: 'Reducción de mora', value: '72%' },
      { label: 'Digitalización', value: '100%' }
    ],
    stack: ['Dolibarr ERP Custom', 'PostgreSQL', 'React', 'AgroTech', 'PDF Engine'],
    actionType: 'wizard'
  },
  {
    id: 'lubrano-ecommerce',
    slug: 'lubrano-ecommerce',
    title: 'Lubrano Hogar - Portal E-Commerce Omnicanal',
    client: 'Cadena de Retail de Electrodomésticos y Hogar',
    category: 'E-Commerce & Retail',
    summary: 'Tienda digital de alto rendimiento sincronizada con stock físico multirama y cotización de envíos regionales en tiempo real.',
    challenge: 'Plataforma anterior lenta, carritos abandonados por costo de envío incierto y stock desfasado con los locales a la calle.',
    solution: 'Arquitectura ultraveloz con checkout directo en pesos argentinos, integración con Mercado Pago y pasarela de atención directa por WhatsApp.',
    impact: 'Aumento del 60% en transacciones online durante los primeros 90 días de implementación.',
    metrics: [
      { label: 'Ventas online', value: '+60%' },
      { label: 'Carga de página', value: '0.8s' },
      { label: 'Carritos recuperados', value: '28%' }
    ],
    stack: ['WooCommerce Engine', 'REST API Clientum', 'MercadoPago SDK', 'Redis'],
    actionType: 'demo'
  },
  {
    id: 'canal10-pwa',
    slug: 'canal10-pwa',
    title: 'Canal 10 TV - Portal de Noticias & PWA Streaming',
    client: 'Canal 10 de Río Negro & Señal Patagónica',
    category: 'Medios & Streaming PWA',
    summary: 'Portal informativo regional y reproductor de streaming en vivo adaptado a conexiones móviles variables con tecnología PWA.',
    challenge: 'Altos picos de tráfico durante transmisiones en vivo que saturaban los servidores tradicionales y expulsaban a usuarios móviles.',
    solution: 'Despliegue distribuido en CDN Anycast con almacenamiento en caché perimetral, reproductor HLS optimizado y notificaciones push web.',
    impact: 'Más de 85.000 espectadores simultáneos sin interrupciones durante emisiones especiales y cobertura electoral.',
    metrics: [
      { label: 'Espectadores pico', value: '85.000+' },
      { label: 'Disponibilidad de stream', value: '99.98%' },
      { label: 'Tiempo de reproducción', value: '+45%' }
    ],
    stack: ['Progressive Web App (PWA)', 'WebSockets', 'HLS Streaming', 'Node.js', 'CDN'],
    actionType: 'demo'
  }
];

export const PublicProjectsPage: React.FC<PublicProjectsPageProps> = ({
  onNavigate,
  onOpenSimulator,
  onOpenWizard
}) => {
  const { enterApp } = useCRM();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'IA & Geolocalización',
    'Automatización & CRM',
    'ERP & Agroindustria',
    'E-Commerce & Retail',
    'Medios & Streaming PWA'
  ];

  const filteredProjects = selectedCategory === 'all'
    ? FEATURED_PROJECTS
    : FEATURED_PROJECTS.filter((p) => p.category === selectedCategory);

  const handleAction = (type: FeaturedProject['actionType']) => {
    if (type === 'simulator') {
      onOpenSimulator();
    } else if (type === 'wizard') {
      onOpenWizard();
    } else if (type === 'demo') {
      enterApp();
    } else {
      onNavigate('/contacto');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans bg-white text-slate-900">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Portafolio de Casos y Proyectos Clave</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Proyectos Destacados de Clientum
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Casos reales de desarrollo de software, automatización con WhatsApp y modelos de Inteligencia Artificial implementados en empresas e instituciones de la región.
        </p>
      </section>

      {/* Categories Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap border-b border-slate-200 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'Todos los Proyectos (5)' : cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="space-y-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            id={`project-${project.slug}`}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10 space-y-6 shadow-xs hover:border-blue-200 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    {project.category}
                  </span>
                  {project.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {project.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {project.title}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Cliente: <span className="font-semibold text-slate-700">{project.client}</span>
                </div>
              </div>

              <button
                onClick={() => handleAction(project.actionType)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-2xs self-start sm:self-center"
              >
                <span>
                  {project.actionType === 'simulator'
                    ? 'Probar Simulador'
                    : project.actionType === 'wizard'
                    ? 'Cotizar Proyecto'
                    : project.actionType === 'demo'
                    ? 'Ver Demo en Vivo'
                    : 'Consultar Caso'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Summary, Challenge, Solution */}
              <div className="lg:col-span-2 space-y-4 text-xs text-slate-700 leading-relaxed">
                <p className="text-sm font-medium text-slate-800">
                  {project.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                    <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Desafío Inicial:
                    </div>
                    <p className="text-slate-600">{project.challenge}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                    <div className="font-bold text-blue-700 text-xs uppercase tracking-wider">
                      Solución Desarrollada:
                    </div>
                    <p className="text-slate-600">{project.solution}</p>
                  </div>
                </div>

                {/* Tech stack badges */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Stack Tecnológico Empleado:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics Column */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-center space-y-4 shadow-2xs">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Métricas de Impacto Comprobadas
                </div>
                {project.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="border-t border-slate-100 pt-2.5">
                    <div className="text-2xl font-black text-slate-900">{m.value}</div>
                    <div className="text-xs text-slate-500">{m.label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="text-center p-8 rounded-3xl bg-blue-50/80 border border-blue-200 space-y-4 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          ¿Tenés un proyecto tecnológico o de automatización en mente?
        </h2>
        <p className="text-xs text-slate-600 max-w-lg mx-auto">
          Analizamos tus requerimientos técnicos, arquitectura y presupuesto para darte una propuesta formal con plazos y garantías por escrito.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenWizard}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-all shadow-xs"
          >
            Usar Cotizador Interactivo de Proyectos
          </button>
          <button
            onClick={() => onNavigate('/contacto')}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs cursor-pointer shadow-2xs"
          >
            Hablar con Nuestro Equipo de Ingeniería
          </button>
        </div>
      </section>

    </div>
  );
};
