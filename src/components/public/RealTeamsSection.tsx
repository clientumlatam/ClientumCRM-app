import React, { useState } from 'react';
import {
  Users,
  MapPin,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  Clock,
  ShieldCheck,
  Bot,
  Truck,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';

interface RealTeamCase {
  id: string;
  role: string;
  category: 'Ventas & CRM' | 'Logística & Depósito' | 'Atención & IA' | 'Dirección & Gerencia';
  location: string;
  company: string;
  impactMetric: string;
  impactLabel: string;
  description: string;
  tags: string[];
  fullDetails?: string;
  toolsUsed: string[];
}

interface RealTeamsSectionProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenWizard?: () => void;
}

export const RealTeamsSection: React.FC<RealTeamsSectionProps> = ({ onNavigate, onOpenWizard }) => {
  const { enterApp, showToast, triggerConfetti } = useCRM();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCaseModal, setSelectedCaseModal] = useState<RealTeamCase | null>(null);

  const teamCases: RealTeamCase[] = [
    {
      id: 'team-direccion',
      role: 'Comité de Dirección y Crecimiento Comercial',
      category: 'Dirección & Gerencia',
      location: 'General Roca · Río Negro',
      company: 'Grupo Agro-Industrial del Comahue',
      impactMetric: '+34%',
      impactLabel: 'Incremento en velocidad de cotización',
      description:
        'Reunión semanal de planificación comercial y seguimiento de exportaciones con tableros Business Intelligence en tiempo real.',
      tags: ['CRM Pipeline B2B', 'Business Intelligence', '+2'],
      fullDetails:
        'El equipo directivo coordina la mesa de operaciones agropecuarias y ventas internacionales con tableros en vivo, visualizando el pipeline ponderado, el margen por cliente mayorista y el estado de cobranzas impositivas.',
      toolsUsed: ['Dashboard Ejecutivo', 'Pipeline MEDDIC', 'BI Forecast', 'Alertas de Desvío']
    },
    {
      id: 'team-ventas',
      role: 'Asesores Comerciales y Gestión de Presupuestos',
      category: 'Ventas & CRM',
      location: 'Buenos Aires · Microcentro / Remoto',
      company: 'Distribuidora Mayorista del Plata',
      impactMetric: '< 2 min',
      impactLabel: 'Tiempo de respuesta a consultas B2B',
      description:
        'Elaboración ágil de presupuestos B2B, seguimiento automatizado de cotizaciones y facturación electrónica AFIP en un clic.',
      tags: ['WhatsApp Multi-Agente', 'Cotizador Rápido', '+2'],
      fullDetails:
        'Los asesores comerciales reciben cotizaciones directamente desde WhatsApp, arman presupuestos con listas de precios segmentadas y emiten facturas electrónicas con CAE inmediato sin salir de la bandeja unificada.',
      toolsUsed: ['WhatsApp Gateway', 'Cotizador B2B', 'Facturación AFIP', 'Secuencias de Re-contacto']
    },
    {
      id: 'team-logistica',
      role: 'Supervisores de Logística, Empaque y Despacho',
      category: 'Logística & Depósito',
      location: 'Neuquén Capital · Parque Industrial',
      company: 'Logística Austral & Almacenamiento',
      impactMetric: '0%',
      impactLabel: 'Extravío o descalce de mercadería',
      description:
        'Coordinación en planta con tablets digitales, trazabilidad de pallets y sincronización de stock multicanal sin papeles.',
      tags: ['ERP de Depósito', 'Trazabilidad por QR/Lote', '+2'],
      fullDetails:
        'Digitalización total del piso de empaque y depósito: los operarios escanean pallets con código QR, actualizan stock en tiempo real y notifican automáticamente al cliente por WhatsApp cuando su pedido sale a ruta.',
      toolsUsed: ['Gestor de Depósito', 'Escaneo QR / Lotes', 'Notificaciones de Envío', 'Control de Bultos']
    },
    {
      id: 'team-atencion',
      role: 'Especialista en Atención, Onboarding y Soporte',
      category: 'Atención & IA',
      location: 'Córdoba Capital · Centro',
      company: 'TechSolutions & Consultoría PyME',
      impactMetric: '98.5%',
      impactLabel: 'Índice de satisfacción al cliente',
      description:
        'Atención personalizada asistida por Santi Copilot IA para resolución inmediata de dudas y seguimiento de satisfacción.',
      tags: ['Chatbot Gemini 3.6 IA', 'Bandeja Unificada', '+2'],
      fullDetails:
        'El equipo de atención resuelve el 80% de consultas frecuentes en segundos gracias al asistente autónomo entrenado con documentación técnica y manuales operativos, liberando tiempo para casos de alto valor.',
      toolsUsed: ['Copilot Gemini IA', 'Bandeja Multi-Operador', 'Encuestas CSAT', 'SLA de Respuesta']
    }
  ];

  const categories = [
    { id: 'all', label: 'Todos los Equipos' },
    { id: 'Ventas & CRM', label: 'Ventas & CRM' },
    { id: 'Logística & Depósito', label: 'Logística & Depósito' },
    { id: 'Atención & IA', label: 'Atención & IA' },
    { id: 'Dirección & Gerencia', label: 'Dirección & Gerencia' }
  ];

  const filteredTeams =
    activeCategory === 'all'
      ? teamCases
      : teamCases.filter((c) => c.category === activeCategory);

  const handleOpenCase = (teamCase: RealTeamCase) => {
    setSelectedCaseModal(teamCase);
  };

  const handleConsultPyME = () => {
    if (onOpenWizard) {
      onOpenWizard();
    } else {
      onNavigate('/contacto');
    }
  };

  return (
    <section className="space-y-10 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 shadow-xs">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>Equipos Reales en Acción</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Nuestra Presencia y Trabajo Junto a PyMEs Argentinas
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Acompañamos a dueños, gerentes de operaciones, comerciales y equipos de depósito en la Patagonia, Buenos Aires, Córdoba y todo el país.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="group p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Header Badges & Location */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{team.location}</span>
                  </div>
                  <span className="inline-block text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                    {team.category}
                  </span>
                </div>

                {/* Impact Metric Highlight */}
                <div className="text-right p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 group-hover:bg-blue-50/60 transition-colors">
                  <div className="text-lg sm:text-xl font-extrabold text-blue-600 leading-none">
                    {team.impactMetric}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">Impacto</div>
                </div>
              </div>

              {/* Title & Organization */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {team.role}
                </h3>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">
                  {team.company}
                </div>
              </div>

              {/* Summary Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {team.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {team.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Impact Metric Description & Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-600">
                <strong className="text-slate-900 font-bold">Impacto: </strong>
                <span>{team.impactLabel}</span>
              </div>
              <button
                onClick={() => handleOpenCase(team)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-blue-50"
              >
                <span>Ver caso</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Callout & Action Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white space-y-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 text-center max-w-2xl mx-auto">
          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            ¿Querés que tu equipo también ahorre horas y multiplique sus ventas?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Implementamos CRM, WhatsApp con IA y automatizaciones en 5 días hábiles con acompañamiento humano cercano.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleConsultPyME}
              className="px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs tracking-wide cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>Consultar para mi PyME</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/contacto')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#0f172a] dark:text-white dark:text-white font-semibold text-xs cursor-pointer transition-all flex items-center gap-1.5"
            >
              <span>¿Querés trabajar con nosotros?</span>
            </button>
          </div>
        </div>

        {/* Footer Trajectory Tag */}
        <div className="pt-4 border-t border-white/10 text-center text-[11px] text-blue-200/80">
          General Roca · Río Negro · Argentina — antes Viaweb (2016–2026)
        </div>
      </div>

      {/* Case Details Modal */}
      {selectedCaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                  {selectedCaseModal.category}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedCaseModal.role}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedCaseModal.company} · {selectedCaseModal.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedCaseModal(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-blue-800 uppercase">Impacto Operativo</div>
                  <div className="text-xs text-slate-700 font-medium">{selectedCaseModal.impactLabel}</div>
                </div>
                <div className="text-2xl font-black text-blue-700">{selectedCaseModal.impactMetric}</div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Detalle del Caso & Flujo Operativo:</h4>
                <p className="text-slate-600 leading-relaxed">{selectedCaseModal.fullDetails}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2">Herramientas & Módulos en Uso:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCaseModal.toolsUsed.map((tool, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-medium text-slate-800">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setSelectedCaseModal(null);
                  enterApp();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Ver Demo en Vivo
              </button>
              <button
                onClick={() => {
                  setSelectedCaseModal(null);
                  handleConsultPyME();
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Quiero este flujo en mi PyME
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
