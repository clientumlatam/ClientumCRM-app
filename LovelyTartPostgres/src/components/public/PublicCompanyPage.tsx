import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Users,
  Award,
  ArrowRight,
  Globe,
  Sparkles,
  Server,
  CheckCircle2,
  Heart,
  Calendar,
  FileText,
  Download,
  TrendingUp,
  Cpu,
  Bot,
  Zap,
  Briefcase,
  Layers,
  ChevronRight,
  Mail,
  Phone,
  Compass,
  Eye,
  Target,
  ExternalLink,
  Check,
  MessageSquare
} from 'lucide-react';
import { CLIENTUM_BROCHURE_METRICS, CLIENTUM_SERVICES, CLIENTUM_PLANS } from '../../data/clientumCatalog';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';
import { RealTeamsSection } from './RealTeamsSection';
import { ClientPortfolioSection } from './ClientPortfolioSection';
import { PowerSuiteShowcase } from './PowerSuiteShowcase';
import { AppLivePreviewSection } from './AppLivePreviewSection';
import { CareersPartnersSection } from './CareersPartnersSection';
import { SolutionSelectorWidget } from './SolutionSelectorWidget';

interface PublicCompanyPageProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicCompanyPage: React.FC<PublicCompanyPageProps> = ({ onNavigate }) => {
  const { enterApp, showToast, triggerConfetti } = useCRM();
  const [activeRegionTab, setActiveRegionTab] = useState<'ar' | 'br'>('ar');
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);

  const stats = [
    { label: 'Años de Trayectoria', value: '10 Años', sub: 'Desde 2016 en Patagonia' },
    { label: 'Empresas Digitalizadas', value: '+400', sub: 'PyMEs en Argentina y LATAM' },
    { label: 'Clientes & Contactos', value: '+4.000', sub: 'Operando en ClientumOS' },
    { label: 'Clientes Activos Alto Valle', value: '+35', sub: 'Empresas e instituciones' },
    { label: 'Partners en la Red', value: '+120', sub: 'Alianzas y consultores' },
    { label: 'Uptime Garantizado', value: '99.9%', sub: 'SLA de alta disponibilidad' },
    { label: 'Tiempo de Respuesta', value: '< 4h', sub: 'Soporte humano por WhatsApp' },
    { label: 'Facturación Local AFIP', value: '100%', sub: 'Pesos argentinos & CAE' }
  ];

  const viawebPillars = [
    {
      title: 'Rápida respuesta',
      desc: 'Contamos con un equipo capacitado y dispuesto a concretar sus requisitos existentes de forma ágil y precisa.',
      icon: <Zap className="w-5 h-5 text-amber-600" />
    },
    {
      title: 'Innovación',
      desc: 'Pensamos propuestas para satisfacer las necesidades particulares de cada industria en específico.',
      icon: <Sparkles className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Satisfacción del cliente',
      desc: 'Ayudamos a nuestros clientes a imaginar lo imposible y acelerar su futura innovación en los negocios digitales.',
      icon: <Heart className="w-5 h-5 text-rose-600" />
    },
    {
      title: 'Transformación Digital',
      desc: 'Acompañamos como proveedor de soluciones tecnológicas, siendo consultor y socio estratégico de las empresas.',
      icon: <Layers className="w-5 h-5 text-emerald-600" />
    }
  ];

  const fullTimeline = [
    {
      year: '2016',
      badge: 'Fundación Viaweb',
      title: 'Primera oficina, Maipú 1438',
      desc: 'Abrimos como Viaweb en la calle Maipú al 1438, of. N.º 2, General Roca. Empezamos ofreciendo desarrollos web a medida, identidad corporativa y multimedia. Se suman los primeros dos colaboradores.',
      location: 'General Roca, Río Negro'
    },
    {
      year: '2017',
      badge: 'Infraestructura',
      title: 'Infraestructura propia y primeros sistemas',
      desc: 'Armamos una red interna para alojar los sitios de nuestros clientes y empezamos a incorporar el uso interno de ERP y CRM para optimizar procesos comerciales.',
      location: 'General Roca, Río Negro'
    },
    {
      year: '2018',
      badge: 'Cloud & Expansión',
      title: 'Cloud y primeros partners comerciales',
      desc: 'Sumamos infraestructura Cloud para alojar sitios de clientes e iniciamos el esquema de partnership, con dos partners comerciales. Mudamos la oficina a Chacabuco 1302, of. N.º 1, y se incorporan dos colaboradores más.',
      location: 'General Roca, Río Negro'
    },
    {
      year: '2020',
      badge: 'BI & Datos',
      title: 'Datos y crecimiento del equipo',
      desc: 'Se suman cinco colaboradores más e implementamos análisis de datos y Business Intelligence para nuestros clientes, con reportes de conversión y optimización de campañas. Nueva oficina en Av. Pte. J. A. Roca 1884, of. N.º 1.',
      location: 'General Roca, Río Negro'
    },
    {
      year: '2021',
      badge: 'Remoto & LATAM',
      title: 'Remoto y expansión regional',
      desc: 'Cerramos la oficina física para enfocarnos en el trabajo remoto de alto rendimiento, avanzamos en abstraer nuestros servicios de ERP/CRM y comenzamos a vender en México y Chile.',
      location: 'Cono Sur & LATAM'
    },
    {
      year: '2023',
      badge: 'Nace Clientum',
      title: 'Nacimiento formal de Clientum en la Patagonia',
      desc: 'Consolidación de la marca Clientum para resolver el caos de ventas, contactos y cobranzas en distribuidores mayoristas, agroindustrias y empresas de servicios del Alto Valle.',
      location: 'Patagonia Argentina'
    },
    {
      year: '2024',
      badge: 'AFIP & WhatsApp',
      title: 'Despliegue del Motor AFIP & WhatsApp Gateway',
      desc: 'Lanzamiento del módulo de facturación electrónica homologada con CAE y el gateway de conexión WhatsApp en 60 segundos con sincronización CRM.',
      location: 'Argentina'
    },
    {
      year: '2025',
      badge: 'IA Gemini & Rosario',
      title: 'Agentes IA Gemini & Expansión Rosario',
      desc: 'Alianza de infraestructura con Google Cloud para potenciar chatbots de venta con modelos Gemini 3.6 Flash y apertura del nodo técnico en Rosario.',
      location: 'Rosario & Patagonia'
    },
    {
      year: '2026',
      badge: 'Hoy · Red Binacional',
      title: 'Plataforma SaaS, Arquitectura Hermes Prime & Brasil',
      desc: 'Consolidamos todo lo aprendido en una plataforma propia: CRM, WhatsApp con IA, integraciones vía API Gateway, Business Intelligence y desarrollo web, con facturación integrada a AFIP y cobros por MercadoPago. Despliegue de la sede internacional en Brasil.',
      location: 'Argentina & Brasil'
    }
  ];

  const namedAgents = [
    {
      name: 'Piloto en Inteligencia AI',
      role: 'Core Architect & Orquestador',
      focus: 'Sincronización multi-agente, enrutamiento semántico y control de memoria conversacional.',
      badge: 'Core Engine'
    },
    {
      name: 'Agente IA Desarrollo & DevOps',
      role: 'Infraestructura & Uptime',
      focus: 'Monitoreo de APIs en tiempo real, latencias de WhatsApp y alta disponibilidad 99.9%.',
      badge: 'DevOps 24/7'
    },
    {
      name: 'Mateo IA Expansión Internacional',
      role: 'Prospección Mercosur',
      focus: 'Calificación de oportunidades B2B para Brasil y países del Cono Sur en portugués y español.',
      badge: 'Mercosur B2B'
    },
    {
      name: 'Santi Copilot IA',
      role: 'Soporte & Onboarding PyME',
      focus: 'Asistencia contextual 24/7 para usuarios de ClientumOS y resolución técnica inmediata.',
      badge: 'CSAT 98.5%'
    },
    {
      name: 'Agente IA Facturación AFIP',
      role: 'Finanzas & Conciliación',
      focus: 'Emisión de facturas electrónicas A, B, C con CAE y verificación automática ante AFIP.',
      badge: 'AFIP Homologado'
    },
    {
      name: 'Agente IA Ad Copy & Marketing',
      role: 'Copywriting & Ads Studio',
      focus: 'Generación de campañas de alto impacto en Meta Ads, Google Ads y difusión por WhatsApp.',
      badge: 'Growth Marketing'
    }
  ];

  const values = [
    {
      title: 'Soberanía de Datos & Respaldo Local',
      desc: 'Tus datos se alojan bajo los estándares más exigentes de seguridad, sin riesgo de bloqueos por políticas impositivas extranjeras.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'Soporte Humano Cercano',
      desc: 'Atención directa por WhatsApp con ejecutivos técnicos que entienden la realidad impositiva y comercial de tu país.',
      icon: <Users className="w-5 h-5 text-emerald-600" />
    },
    {
      title: 'Innovación Pragmática',
      desc: 'No implementamos tecnología por moda: cada función debe traducirse en más ventas cerradas o menos horas de trabajo manual.',
      icon: <Cpu className="w-5 h-5 text-purple-600" />
    },
    {
      title: 'Transparencia de Precios',
      desc: 'Precios fijos en moneda nacional, sin cobros por usuario inflados ni recargos sorpresa a fin de mes.',
      icon: <Award className="w-5 h-5 text-amber-600" />
    }
  ];

  const handleDownloadBrochure = () => {
    setIsBrochureModalOpen(true);
    triggerConfetti();
    showToast('Abriendo Brochure Oficial de 8 Páginas de Clientum...', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans bg-white text-slate-900">
      
      {/* 1. Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Nuestra Trayectoria · Desde 2016</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span>10 Años de Innovación</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Automatizamos las Ventas y la Gestión de tu PyME con IA en 5 Días
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Nacimos en 2016 en General Roca, Río Negro. Diez años construyendo tecnología a medida para las PyMEs de la Patagonia y toda la región. Hoy somos Clientum: CRM, WhatsApp con IA, facturación AFIP, cobros por MercadoPago y analítica en una sola plataforma unificada.
        </p>

        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
          Anteriormente conocidos como <strong className="text-slate-800 font-semibold">Viaweb</strong>, consolidamos una década de experiencia para democratizar la inteligencia comercial con soporte humano cercano y precios transparentes en moneda local.
        </p>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <button
            id="btn-download-brochure"
            onClick={handleDownloadBrochure}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide cursor-pointer transition-all shadow-md hover:shadow-lg"
          >
            <FileText className="w-4 h-4" />
            <span>Descargar Brochure Oficial (PDF 8 Páginas)</span>
          </button>

          <button
            id="btn-explore-demo"
            onClick={() => enterApp()}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 hover:bg-[#eef1f6] hover:dark:bg-[#eef1f6] hover:dark:bg-slate-800 text-[#0f172a] dark:text-white font-bold text-xs cursor-pointer transition-all shadow-xs"
          >
            <span>Explorar Demo en Vivo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-contact-team"
            onClick={() => onNavigate('/contacto')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-xs cursor-pointer transition-all shadow-xs"
          >
            <span>Equipo Clientum</span>
          </button>
        </div>
      </section>

      {/* 2. Goal & Unified Metrics Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white space-y-6 shadow-xl relative overflow-hidden border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-cyan-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Nuestro objetivo desde el primer día</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            "Alcanzar la Excelencia Empresarial"
          </h2>
          <p className="text-xs sm:text-sm text-[#0f172a] dark:text-white dark:text-slate-300 leading-relaxed">
            Sistemas · Desarrollos · Promoción Digital. Trabajamos codo a codo con cada cliente para transformar desafíos comerciales en ventajas competitivas duraderas.
          </p>
        </div>

        {/* 8 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs space-y-1">
              <div className="text-xl sm:text-2xl font-extrabold text-[#0f172a] dark:text-white">{s.value}</div>
              <div className="text-xs font-bold text-cyan-300">{s.label}</div>
              <div className="text-[10px] text-[#475569]/80 dark:text-slate-300/80">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Power Suite (16 Módulos que sustituyen más de 12 suscripciones) */}
      <PowerSuiteShowcase onNavigate={onNavigate} />

      {/* 4. App Live Real Preview (Kanban + Copilot Gemini) */}
      <AppLivePreviewSection onNavigate={onNavigate} />

      {/* 5. Legacy Viaweb -> Clientum */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Legado Viaweb (2016), hoy Clientum</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">¿Por qué Viaweb?</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Los 4 pilares fundacionales que siguen guiando cada línea de código y cada proceso de implementación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {viawebPillars.map((p, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs hover:border-blue-300 transition-all">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 w-fit shadow-2xs">
                {p.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Comprehensive Timeline (2016 – 2026) */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-10 shadow-xs">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            De un estudio de desarrollo web a una plataforma SaaS
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Nuestra Historia (2016 – 2026)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Una década de aprendizaje continuo, cercanía con el sector productivo y evolución tecnológica constante.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fullTimeline.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-blue-600">{item.year}</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{item.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-4 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Target className="w-3.5 h-3.5 text-blue-700" />
            <span>Misión</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Excelencia empresarial, un cliente a la vez
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            El éxito de nuestra misión se sustenta en un equipo de profesionales calificados y una apuesta permanente a generar alianzas de excelencia con nuestros clientes.
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Desde hace más de diez años propiciamos un buen clima de trabajo en Clientum, de la mano de un equipo que se destaca por el compañerismo, el trabajo en equipo y la colaboración.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold">
            <Eye className="w-3.5 h-3.5 text-slate-700" />
            <span>Visión</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Anticiparnos a lo que las PyMEs van a necesitar
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Nuestros valores: invertir en las personas y su desarrollo profesional, construir relaciones basadas en confianza responsabilizándonos por los compromisos asumidos, y lograr resultados sustentables.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Esa visión se cristaliza en una plataforma y un conjunto de herramientas tecnológicas pensadas para satisfacer la demanda de nuestros clientes y anticiparse a las necesidades del mercado.
          </p>
        </div>
      </section>

      {/* 8. Values & Principles */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Principios Rectores</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Nuestros Valores Fundacionales</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-xs hover:border-slate-300 transition-all">
              <div className="p-2 rounded-xl bg-slate-50 w-fit">
                {val.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{val.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Hermes Prime Architecture & Named AI Enswarm */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-950 text-[#0f172a] dark:text-white space-y-6 shadow-xl border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Arquitectura Hermes Prime · Enjambre de Agentes IA
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a] dark:text-white">
              Equipo Humano Directivo + 6 Agentes IA Especializados
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Operación Continua 24/7</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#0f172a] dark:text-white dark:text-slate-300 leading-relaxed max-w-3xl">
          Jonathan y Matías dirigen una compañía asistida por agentes autónomos especializados que ejecutan tareas críticas de prospección, desarrollo, marketing, facturación AFIP y soporte de forma ininterrumpida.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {namedAgents.map((ag, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 space-y-2 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  {ag.badge}
                </span>
                <Bot className="w-4 h-4 text-slate-500" />
              </div>
              <h4 className="text-sm font-bold text-[#0f172a] dark:text-white">{ag.name}</h4>
              <div className="text-[11px] font-semibold text-[#0f172a] dark:text-white dark:text-slate-400">{ag.role}</div>
              <p className="text-xs text-[#0f172a] dark:text-white dark:text-slate-300 leading-relaxed pt-1">{ag.focus}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Binational Structure & Headquarters */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Estructura Organizacional Binacional
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Organigrama & Sedes Clientum
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Liderazgo ejecutivo, sedes regionales y arquitectura de agentes IA conectando Argentina y Brasil.
          </p>
        </div>

        {/* Region Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setActiveRegionTab('ar')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeRegionTab === 'ar'
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇦🇷</span>
              <span>ES (AR) · Sede Principal</span>
            </button>
            <button
              onClick={() => setActiveRegionTab('br')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeRegionTab === 'br'
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇧🇷</span>
              <span>PT (BR) · Sede Internacional</span>
            </button>
          </div>
        </div>

        {/* Sedes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Argentina Sede */}
          <div className={`p-8 rounded-3xl border transition-all ${
            activeRegionTab === 'ar' ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-400/20' : 'bg-slate-50 border-slate-200 opacity-90'
          } space-y-6 shadow-xs`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-2xl">🇦🇷</span>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Casa Central</span>
                <h3 className="text-xl font-extrabold text-slate-900">Sede Principal: General Roca, Río Negro</h3>
                <p className="text-xs text-slate-600 font-semibold">Patagonia Argentina</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                Matriz & I+D
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700 border-t border-slate-200/80 pt-4">
              <div className="font-bold text-slate-900">Liderazgo & Dirección:</div>
              <div className="text-sm font-extrabold text-blue-700">Jonathan Ledantes <span className="text-xs font-medium text-slate-600">(CEO & Founder)</span></div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>General Roca, Río Negro — Argentina</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>+54 298 461-0000</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>info@clientum.com.ar</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/80 pt-4">
              Centro tecnológico de ingeniería de software, modelos de IA generativa y desarrollo de la infraestructura de datos central.
            </p>
          </div>

          {/* Brasil Sede */}
          <div className={`p-8 rounded-3xl border transition-all ${
            activeRegionTab === 'br' ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-400/20' : 'bg-slate-50 border-slate-200 opacity-90'
          } space-y-6 shadow-xs`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-2xl">🇧🇷</span>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Expansão LATAM</span>
                <h3 className="text-xl font-extrabold text-slate-900">Sede Internacional: Arraial do Cabo, RJ</h3>
                <p className="text-xs text-slate-600 font-semibold">Brasil · Rio de Janeiro</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Mercosur B2B
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700 border-t border-slate-200/80 pt-4">
              <div className="font-bold text-slate-900">Liderazgo & Dirección:</div>
              <div className="text-sm font-extrabold text-emerald-700">Matias Rotili <span className="text-xs font-medium text-slate-600">(Director Internacional & Co-Fundador)</span></div>
              <div className="text-[11px] text-slate-500">Matias Andres Rotili Poinsof</div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Arraial do Cabo, RJ, Brasil</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>brasil@clientum.com.ar</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/80 pt-4">
              Polo de internacionalización, prospección y alianzas corporativas con empresas e industrias en el mercado brasileño y regional.
            </p>
          </div>
        </div>
      </section>

      {/* 11. Executive Leadership & Co-Founders */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Cuadro Ejecutivo & Co-Fundadores</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Liderazgo Directivo</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Visión estratégica y liderazgo técnico al servicio de la modernización de los negocios en América Latina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Jonathan Ledantes */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-xs hover:border-blue-300 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                JL
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">Jonathan Ledantes</h3>
                  <span className="text-sm">🇦🇷</span>
                </div>
                <div className="text-xs font-bold text-blue-600">CEO & Founder — Dirección General</div>
                <div className="text-[11px] text-slate-500">Sede Principal: General Roca, Río Negro (Argentina)</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900">Áreas de Actuación & Liderazgo:</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
                  Visión Estratégica & IA
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
                  Liderazgo de Producto & Arquitectura CRM
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
                  Supervisión General de Operaciones
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Pionero en el desarrollo de soluciones a medida en la Patagonia desde 2016, impulsando la transformación de Viaweb hacia el ecosistema SaaS y de Inteligencia Artificial Clientum.
            </p>
          </div>

          {/* Matias Rotili */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                MR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">Matias Rotili</h3>
                  <span className="text-sm">🇧🇷</span>
                </div>
                <div className="text-xs font-bold text-emerald-600">Director Internacional & Co-Fundador</div>
                <div className="text-[11px] text-slate-500">Sede Brasil: Arraial do Cabo, Rio de Janeiro (Brasil)</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900">Áreas de Actuación & Liderazgo:</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
                  Expansión Comercial Brasil & Mercosur
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
                  Alianzas Estratégicas B2B
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
                  Operaciones & Relaciones Internacionales
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Liderando la expansión del ecosistema Clientum en Brasil y los mercados del Mercosur, consolidando alianzas clave para PyMEs e industrias en toda la región.
            </p>
          </div>
        </div>
      </section>

      {/* 12. Client Portfolio by Sector & Municipalities */}
      <ClientPortfolioSection onNavigate={onNavigate} />

      {/* 13. Real Teams in Action (Patagonia, CABA, Córdoba, Neuquén) */}
      <RealTeamsSection onNavigate={onNavigate} />

      {/* 14. Careers & Partner Program */}
      <CareersPartnersSection onNavigate={onNavigate} />

      {/* 15. Quick Solution Selector Widget */}
      <SolutionSelectorWidget onNavigate={onNavigate} />

      {/* 16. Bottom CTA & Direct Access */}
      <section className="p-8 sm:p-12 rounded-3xl bg-blue-50/80 border border-blue-200 text-center space-y-5 shadow-xs">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          ¿Quieres formar parte del ecosistema Clientum?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Accede a la plataforma por dentro en modo demostración o agenda una sesión de trabajo con nuestros directores de producto.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => enterApp()}
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            Explorar Demo en Vivo
          </button>
          <button
            onClick={handleDownloadBrochure}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs cursor-pointer shadow-xs transition-all flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Ver Brochure (8 Páginas)</span>
          </button>
          <button
            onClick={() => onNavigate('/contacto')}
            className="px-6 py-3.5 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 hover:bg-[#eef1f6] hover:dark:bg-[#eef1f6] hover:dark:bg-slate-800 text-[#0f172a] dark:text-white font-semibold text-xs cursor-pointer shadow-xs transition-all"
          >
            Contactar al Equipo
          </button>
        </div>
      </section>

      {/* Interactive Official Brochure Modal (8 Pages) */}
      {isBrochureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Brochure Institucional Oficial · Edición 2026</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Clientum Latam — Portafolio & Propuesta de Valor (8 Páginas)
                </h3>
                <p className="text-xs text-slate-500">
                  General Roca (Argentina) & Arraial do Cabo (Brasil) · Trayectoria desde 2016
                </p>
              </div>
              <button
                onClick={() => setIsBrochureModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Brochure 8-Page Content Index */}
            <div className="space-y-6 text-xs text-slate-700">
              
              {/* Page 1: Portada & Resumen Ejecutivo */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-extrabold text-blue-700 text-sm">Página 1: Portada & Resumen Ejecutivo</div>
                <p className="text-xs text-slate-600">
                  "Democratizando la Inteligencia Comercial para las PyMEs de América Latina". Diez años de historia desde la apertura de Viaweb en 2016 en General Roca, Río Negro, hasta la consolidación como plataforma integral CRM, IA, WhatsApp y AFIP.
                </p>
              </div>

              {/* Page 2: Misión, Visión & Valores */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-extrabold text-blue-700 text-sm">Página 2: Misión, Visión & Principios Rectores</div>
                <p className="text-xs text-slate-600">
                  Misión: Excelencia empresarial un cliente a la vez. Visión: Anticiparnos a las necesidades de las PyMEs. Soberanía de datos, soporte humano por WhatsApp, innovación pragmática y precios en moneda local.
                </p>
              </div>

              {/* Page 3: Arquitectura Hermes Prime & Agentes IA */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-extrabold text-blue-700 text-sm">Página 3: Arquitectura Hermes Prime (Julio 2026)</div>
                <p className="text-xs text-slate-600">
                  Modelo híbrido: Equipo humano directivo asistido por un enjambre de 14 agentes de IA autónomos (Gemini 3.6 Flash) operando ventas, prospección, soporte y conciliación 24/7.
                </p>
              </div>

              {/* Page 4: Suite de Productos & Módulos */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-extrabold text-blue-700 text-sm">Página 4: Módulos del Ecosistema Clientum</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>CRM 360° Omnicanal con Pipeline Drag & Drop y Metodología MEDDIC.</li>
                  <li>WhatsApp Business Gateway sin código con conexión en 60 segundos.</li>
                  <li>Motor de Facturación Electrónica AFIP homologada con CAE instantáneo.</li>
                  <li>Business Intelligence & Analítica de conversión por canal.</li>
                </ul>
              </div>

              {/* Page 5: Catálogo de Servicios & Consultoría */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-extrabold text-blue-700 text-sm">Página 5: Servicios Profesionales & Implementación</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  {CLIENTUM_SERVICES.slice(0, 4).map((s) => (
                    <div key={s.id} className="p-2 rounded-lg bg-white border border-slate-200">
                      <strong>{s.name}</strong>: {s.shortDescription}
                    </div>
                  ))}
                </div>
              </div>

              {/* Page 6: Planes de Suscripción & Precios */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-extrabold text-blue-700 text-sm">Página 6: Planes Comerciales</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {CLIENTUM_PLANS.slice(0, 4).map((p) => (
                    <div key={p.id} className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-blue-600 font-extrabold mt-1">${p.regularPrice} USD/m</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Page 7: Casos de Éxito & Métricas */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-extrabold text-blue-700 text-sm">Página 7: Casos de Éxito & Resultados Comprobados</div>
                <p className="text-xs text-slate-600">
                  +35% en tasa de cierre comercial, -40% en costo de adquisición por lead, -90% en tiempos de espera de consultas gracias a bots WhatsApp y +60% en retorno de inversión publicitaria.
                </p>
              </div>

              {/* Page 8: Sedes Binacionales, Contacto & Liderazgo */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-extrabold text-blue-700 text-sm">Página 8: Sedes Binacionales & Contacto Directo</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <strong>🇦🇷 Sede Central Argentina</strong>: General Roca, Río Negro. Liderazgo: Jonathan Ledantes (CEO & Co-Fundador). Email: info@clientum.com.ar.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <strong>🇧🇷 Sede Brasil</strong>: Arraial do Cabo, RJ. Liderazgo: Matias Rotili (Director Internacional & Co-Fundador). Email: brasil@clientum.com.ar.
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <div className="text-xs text-slate-500">
                Brochure oficial protegido por derechos de autor © 2026 Clientum Latam.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
                <button
                  onClick={() => {
                    setIsBrochureModalOpen(false);
                    onNavigate('/contacto');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Solicitar Asesoría
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
