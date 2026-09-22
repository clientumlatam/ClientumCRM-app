import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  CheckSquare,
  BarChart3,
  Bot,
  Sparkles,
  Send,
  Plus,
  MoreVertical,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';

interface AppLivePreviewSectionProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const AppLivePreviewSection: React.FC<AppLivePreviewSectionProps> = ({ onNavigate }) => {
  const { enterApp } = useCRM();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'copilot'>('pipeline');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'user',
      text: '¿Cuál es el resumen de mis negocios esta semana?',
      time: '11:42'
    },
    {
      sender: 'bot',
      text: 'Tienes 18 negocios activos en pipeline por un total ponderado de $124.800 USD. Esta semana se ganaron 4 negocios clave ($57.200 USD) con una tasa de cierre récord del 32.4%. Tienes 3 seguimientos prioritarios con AFIP y cotizaciones por WhatsApp hoy.',
      time: '11:42'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const stages = [
    {
      name: 'Nuevo',
      amount: '$24.500',
      count: 4,
      deals: [
        { title: 'TechGlobal S.A.', value: '$12.000', owner: 'JL', tag: 'IA WhatsApp' },
        { title: 'SoftBuild Labs', value: '$12.500', owner: 'MR', tag: 'CRM B2B' }
      ]
    },
    {
      name: 'Calificación',
      amount: '$35.300',
      count: 3,
      deals: [
        { title: 'EduSmart Group', value: '$18.300', owner: 'JL', tag: 'MEDDIC 85%' },
        { title: 'GlobalTech SRL', value: '$17.000', owner: 'MR', tag: 'Custom Objects' }
      ]
    },
    {
      name: 'Propuesta',
      amount: '$67.800',
      count: 5,
      deals: [
        { title: 'SalesPro Latam', value: '$32.800', owner: 'JL', tag: 'AFIP + ERP' },
        { title: 'HelpDesk 24', value: '$35.000', owner: 'MR', tag: 'Copilot IA' }
      ]
    },
    {
      name: 'Negociación',
      amount: '$38.000',
      count: 2,
      deals: [
        { title: 'FactorySoft Ind.', value: '$22.000', owner: 'JL', tag: 'Outbound SDR' },
        { title: 'DataLogic Corp', value: '$16.000', owner: 'MR', tag: 'White Label' }
      ]
    },
    {
      name: 'Cerrado / Ganado',
      amount: '$57.200',
      count: 4,
      deals: [
        { title: 'Logística Comahue', value: '$28.200', owner: 'JL', tag: 'Implementado' },
        { title: 'Farma Red Patagónica', value: '$29.000', owner: 'MR', tag: 'AFIP CAE' }
      ]
    }
  ];

  const handleSendCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg = inputQuery;
    setInputQuery('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Ahora' },
      {
        sender: 'bot',
        text: `Consultando base de datos ClientumOS... Analizando métricas comerciales y estado de contactos para "${userMsg}". Todo sincronizado en tiempo real.`,
        time: 'Ahora'
      }
    ]);
  };

  return (
    <section className="space-y-8 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Experiencia de Producto Real · ClientumOS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          La Interfaz en Tiempo Real que Potencia a tu Equipo
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Diseñada para que dueños y ejecutivos comerciales operen con velocidad: Pipeline Kanban de 5 etapas, automatización y Copilot IA en vivo.
        </p>
      </div>

      {/* Interactive App Window Container */}
      <div className="rounded-3xl border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-950 text-[#0f172a] dark:text-white shadow-2xl overflow-hidden">
        {/* App Topbar */}
        <div className="bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 px-4 py-3 border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            </div>
            <span className="text-xs font-bold text-[#0f172a] dark:text-white dark:text-slate-300 ml-2">ClientumOS — Tablero de Oportunidades & Pipeline</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gemini 3.6 IA En Línea</span>
            </span>
            <button
              onClick={() => enterApp()}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              Abrir App
            </button>
          </div>
        </div>

        {/* Main 3-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          {/* Panel 1: Mini Sidebar (2 cols) */}
          <div className="hidden lg:block lg:col-span-2 bg-slate-900/60 border-r border-slate-800/80 p-3 space-y-4 text-xs">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[#0f172a] dark:text-white dark:text-slate-300 uppercase tracking-wider px-2">Comercial & CRM</div>
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-300 font-bold flex items-center justify-between border border-blue-500/30">
                <span>Oportunidades</span>
                <span className="text-[10px] bg-blue-600 px-1.5 py-0.5 rounded text-white">$582k</span>
              </div>
              <div className="p-2 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white flex items-center gap-2">
                <span>Empresas</span>
              </div>
              <div className="p-2 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white flex items-center gap-2">
                <span>Personas</span>
              </div>
              <div className="p-2 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white flex items-center gap-2">
                <span>Tareas</span>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-bold text-[#0f172a] dark:text-white dark:text-slate-300 uppercase tracking-wider px-2">WhatsApp & IA</div>
              <div className="p-2 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white flex items-center justify-between">
                <span>WhatsApp CRM</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">PRO</span>
              </div>
              <div className="p-2 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white">Chatbot 24/7</div>
              <div className="p-2 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white">Agente Outreach</div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-bold text-[#0f172a] dark:text-white dark:text-slate-300 uppercase tracking-wider px-2">ERP & AFIP</div>
              <div className="p-2 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white">Facturación AFIP</div>
              <div className="p-2 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white">MercadoPago</div>
            </div>
          </div>

          {/* Panel 2: Central Pipeline (7 cols) */}
          <div className="col-span-1 lg:col-span-7 p-4 sm:p-5 space-y-4 overflow-x-auto">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-[#0f172a] dark:text-white">Pipeline de Ventas B2B</h4>
                <p className="text-[11px] text-[#0f172a] dark:text-white dark:text-slate-400">18 negocios activos · Conversión ponderada en tiempo real</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400">$124.800 USD Totales</span>
              </div>
            </div>

            {/* 5 Stages Kanban Horizontal Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {stages.map((stg, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-2.5 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#0f172a] dark:text-white dark:text-slate-200">{stg.name}</span>
                      <span className="text-[#0f172a] dark:text-white dark:text-slate-300 text-[10px] bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 px-1.5 rounded">{stg.count}</span>
                    </div>
                    <div className="text-[10px] text-cyan-400 font-extrabold">{stg.amount}</div>
                  </div>

                  <div className="space-y-1.5">
                    {stg.deals.map((deal, didx) => (
                      <div key={didx} className="p-2 rounded-xl bg-slate-800/90 border border-slate-700/70 space-y-1 text-left">
                        <div className="text-[11px] font-bold text-[#0f172a] dark:text-white leading-tight truncate">{deal.title}</div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-extrabold text-emerald-400">{deal.value}</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-700 text-[#0f172a] dark:text-white dark:text-slate-300 text-[9px]">{deal.tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom KPI Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800">
                <div className="text-[10px] text-[#0f172a] dark:text-white dark:text-slate-300">Ingresos Totales</div>
                <div className="text-sm font-extrabold text-[#0f172a] dark:text-white">$124.800 <span className="text-[10px] text-emerald-400">(+18.6%)</span></div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800">
                <div className="text-[10px] text-[#0f172a] dark:text-white dark:text-slate-300">Negocios Activos</div>
                <div className="text-sm font-extrabold text-[#0f172a] dark:text-white">22 <span className="text-[10px] text-emerald-400">(+15.8%)</span></div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800">
                <div className="text-[10px] text-[#0f172a] dark:text-white dark:text-slate-300">Tasa de Cierre</div>
                <div className="text-sm font-extrabold text-[#0f172a] dark:text-white">32.4% <span className="text-[10px] text-emerald-400">(+6.2%)</span></div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800">
                <div className="text-[10px] text-[#0f172a] dark:text-white dark:text-slate-300">Ticket Promedio</div>
                <div className="text-sm font-extrabold text-[#0f172a] dark:text-white">$6.218 <span className="text-[10px] text-emerald-400">(+9.3%)</span></div>
              </div>
            </div>
          </div>

          {/* Panel 3: Copilot IA Right Panel (3 cols) */}
          <div className="col-span-1 lg:col-span-3 bg-slate-900/80 border-t lg:border-t-0 lg:border-l border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0f172a] dark:text-white">Asistente IA Copilot</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">Gemini 3.6 Flash · En Línea</div>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="space-y-2.5 text-xs max-h-60 overflow-y-auto pr-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-600/30 border border-blue-500/40 text-blue-100 ml-3'
                        : 'bg-slate-800 border border-slate-700 text-[#334155] dark:text-slate-200 mr-2'
                    } space-y-1`}
                  >
                    <div className="text-[10px] font-bold text-[#0f172a] dark:text-white dark:text-slate-400">
                      {msg.sender === 'user' ? 'Tú' : 'Copilot Clientum'} · {msg.time}
                    </div>
                    <div className="text-xs leading-relaxed">{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Interactive Input */}
            <form onSubmit={handleSendCopilot} className="pt-2 border-t border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Preguntale a la IA sobre tus ventas..."
                className="w-full px-3 py-2 rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 border border-[#cbd5e1] dark:border-[#cbd5e1] dark:border-slate-700 text-xs text-[#0f172a] dark:text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
