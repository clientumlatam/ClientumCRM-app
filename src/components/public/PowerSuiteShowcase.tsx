import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Bot,
  MessageSquare,
  FileSpreadsheet,
  CreditCard,
  Boxes,
  GitFork,
  MapPin,
  Target,
  Send,
  UserCheck,
  PenTool,
  Compass,
  LayoutDashboard,
  Utensils,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';

interface PowerSuiteShowcaseProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PowerSuiteShowcase: React.FC<PowerSuiteShowcaseProps> = ({ onNavigate }) => {
  const { enterApp } = useCRM();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const modules = [
    {
      id: 1,
      name: 'Pipeline Kanban',
      subtitle: 'Control de 5 etapas con cálculo dinámico',
      icon: <LayoutDashboard className="w-5 h-5 text-blue-400" />,
      desc: 'Visualización clara de negocios en curso, ponderación de ingresos y filtros por vendedor.',
      category: 'Comercial & Ventas'
    },
    {
      id: 2,
      name: 'WhatsApp CRM PRO',
      subtitle: 'Bandeja multicanal con respuestas rápidas',
      icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
      desc: 'Múltiples agentes en un solo número corporativo con historial unificado de chats.',
      category: 'Omnicanalidad'
    },
    {
      id: 3,
      name: 'Chatbot 24/7 Gemini IA',
      subtitle: 'Atención automática con IA de Gemini',
      icon: <Bot className="w-5 h-5 text-cyan-400" />,
      desc: 'Respuestas contextuales inmediatas, pre-calificación de leads y derivación inteligente.',
      category: 'Inteligencia Artificial'
    },
    {
      id: 4,
      name: 'Facturación AFIP',
      subtitle: 'Facturas electrónicas A, B, C con CAE',
      icon: <FileSpreadsheet className="w-5 h-5 text-amber-400" />,
      desc: 'Emisión homologada directa desde el CRM sin entrar a la web manual de AFIP.',
      category: 'Finanzas & Fiscal'
    },
    {
      id: 5,
      name: 'Cobros MercadoPago',
      subtitle: 'Links de pago y conciliación inmediata',
      icon: <CreditCard className="w-5 h-5 text-indigo-400" />,
      desc: 'Envío de links de cobro por WhatsApp con confirmación de acreditación automática.',
      category: 'Finanzas & Fiscal'
    },
    {
      id: 6,
      name: 'Custom Objects Studio',
      subtitle: 'Modelado de entidades y campos a medida',
      icon: <Boxes className="w-5 h-5 text-purple-400" />,
      desc: 'Crea tablas personalizadas para vehículos, propiedades, pacientes o maquinarias.',
      category: 'Motor & Configuración'
    },
    {
      id: 7,
      name: 'Workflows & Flowchart',
      subtitle: 'Automatización visual de acciones y alertas',
      icon: <GitFork className="w-5 h-5 text-rose-400" />,
      desc: 'Disparadores por eventos para mover etapas, enviar emails o notificar a operarios.',
      category: 'Automatización'
    },
    {
      id: 8,
      name: 'Prospección Maps B2B',
      subtitle: 'Extracción de comercios y leads locales',
      icon: <MapPin className="w-5 h-5 text-emerald-400" />,
      desc: 'Búsqueda por rubro y localidad en Google Maps con importación a contactos en 1 clic.',
      category: 'Outbound & Growth'
    },
    {
      id: 9,
      name: 'Lead Scoring MEDDIC',
      subtitle: 'Calificación estructurada para empresas B2B',
      icon: <Target className="w-5 h-5 text-red-400" />,
      desc: 'Matriz objetiva para evaluar probabilidad de cierre, tomador de decisión y presupuesto.',
      category: 'Comercial & Ventas'
    },
    {
      id: 10,
      name: 'Campañas & Broadcast',
      subtitle: 'Envíos masivos a audiencias segmentadas',
      icon: <Send className="w-5 h-5 text-blue-400" />,
      desc: 'Difusión de novedades y promociones por WhatsApp y email sin riesgo de spam.',
      category: 'Marketing'
    },
    {
      id: 11,
      name: 'Agente Outreach SDR',
      subtitle: 'Cadencias frías de prospección multicanal',
      icon: <UserCheck className="w-5 h-5 text-teal-400" />,
      desc: 'Secuencias automatizadas de contacto y seguimiento de prospectos comerciales.',
      category: 'Inteligencia Artificial'
    },
    {
      id: 12,
      name: 'AI Ad Copy Studio',
      subtitle: 'Generación de anuncios de alta conversión',
      icon: <PenTool className="w-5 h-5 text-pink-400" />,
      desc: 'Creación de textos publicitarios para Meta Ads, Google Ads y WhatsApp con IA.',
      category: 'Marketing'
    },
    {
      id: 13,
      name: 'Estrategias GTM',
      subtitle: 'Propuestas de valor y tracción B2B',
      icon: <Compass className="w-5 h-5 text-amber-400" />,
      desc: 'Diagnóstico de mercado y generación de planes de lanzamiento comercial.',
      category: 'Estrategia'
    },
    {
      id: 14,
      name: 'Portal del Cliente',
      subtitle: 'Autoservicio con facturas y presupuestos',
      icon: <ShieldCheck className="w-5 h-5 text-green-400" />,
      desc: 'Espacio web privado para que tus clientes descarguen facturas y vean su cuenta corriente.',
      category: 'Operaciones'
    },
    {
      id: 15,
      name: 'Restaurantes & KDS',
      subtitle: 'Comandera de cocina y control de mesas',
      icon: <Utensils className="w-5 h-5 text-orange-400" />,
      desc: 'Puesto digital para el sector gastronómico interconectado con stock y cobranzas.',
      category: 'Verticales'
    },
    {
      id: 16,
      name: 'Suite SEO Completa',
      subtitle: 'Rankings, auditoría y análisis de palabras clave',
      icon: <Search className="w-5 h-5 text-sky-400" />,
      desc: 'Monitoreo de posicionamiento en Google y recomendaciones técnicas automáticas.',
      category: 'Marketing'
    }
  ];

  return (
    <section className="bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-950 text-[#0f172a] dark:text-white rounded-3xl p-8 sm:p-12 space-y-10 border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 shadow-2xl relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Power Suite · 16/16 Módulos Activos</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a] dark:text-white leading-tight">
            El Ecosistema Integral que Sustituye más de 12 Suscripciones
          </h2>
          <p className="text-xs sm:text-sm text-[#0f172a] dark:text-white dark:text-slate-300 leading-relaxed">
            Elimina la dispersión de herramientas y gastos en dólares: todo lo que tu empresa necesita en una sola plataforma en moneda local.
          </p>
        </div>

        {/* ROI Savings Card */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shrink-0 max-w-sm w-full space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#0f172a] dark:text-white dark:text-slate-400 font-medium">Costo de contratar por separado:</span>
            <span className="text-rose-400 font-bold line-through">~$160 USD/mes</span>
          </div>
          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-cyan-300">Plan Clientum Todo Incluido:</span>
            <span className="text-emerald-400 text-lg">$79 USD/mes</span>
          </div>
          <div className="pt-2 border-t border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between text-[11px] text-[#0f172a] dark:text-white dark:text-slate-300">
            <span>Ahorro mensual directo:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
              Ahorrás $81 USD/m
            </span>
          </div>
        </div>
      </div>

      {/* 16 Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {modules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => setSelectedModule(selectedModule === mod.id ? null : mod.id)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
              selectedModule === mod.id
                ? 'bg-slate-800/95 border-cyan-400 ring-2 ring-cyan-400/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                {mod.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f172a] dark:text-white dark:text-slate-400">
                {mod.category}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#0f172a] dark:text-white leading-snug">{mod.name}</h3>
              <p className="text-[11px] text-[#0f172a] dark:text-white dark:text-slate-400 mt-0.5">{mod.subtitle}</p>
            </div>

            <p className="text-xs text-[#475569]/90 dark:text-slate-300/90 leading-relaxed pt-1">
              {mod.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar */}
      <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-[#0f172a] dark:text-white dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Incluye onboarding guiado, migración de datos y soporte por WhatsApp.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => enterApp()}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wide cursor-pointer transition-all shadow-md"
          >
            Explorar en la App
          </button>
          <button
            onClick={() => onNavigate('/planes')}
            className="px-5 py-2.5 rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-700 text-[#0f172a] dark:text-white font-semibold text-xs cursor-pointer transition-all"
          >
            Ver Planes & Precios
          </button>
        </div>
      </div>
    </section>
  );
};
