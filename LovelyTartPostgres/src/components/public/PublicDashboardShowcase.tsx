import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  BarChart3,
  Bot,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Filter,
  Flame,
  Globe,
  Layers,
  MapPin,
  MessageSquare,
  Play,
  Plus,
  Receipt,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
  Zap,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';

interface PublicDashboardShowcaseProps {
  onNavigate?: (path: PublicRoutePath) => void;
  onOpenSimulator?: () => void;
  onOpenWizard?: () => void;
}

type ShowcaseTab = 'executive' | 'pipeline' | 'operations' | 'copilot';

export const PublicDashboardShowcase: React.FC<PublicDashboardShowcaseProps> = ({
  onNavigate,
  onOpenSimulator,
  onOpenWizard,
}) => {
  const { enterApp } = useCRM();

  const [activeTab, setActiveTab] = useState<ShowcaseTab>('executive');
  const [pipelineFilter, setPipelineFilter] = useState<'Todos' | 'New Business' | 'Expansion'>('Todos');

  // Interactive task completion state
  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>({});

  // Interactive Copilot simulator state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: '¡Hola! Soy tu Copilot Ejecutivo de Clientum. Analizo tu pipeline comercial en tiempo real, identifico negocios estancados y propongo la próxima mejor acción de venta.',
      time: '10:00',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const toggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleSendQuery = (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text, time }]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = text.toLowerCase();
      if (q.includes('resumen') || q.includes('ventas') || q.includes('métrica')) {
        reply =
          '📊 Resumen Ejecutivo del Negocio:\n• Pipeline Total Activo: $1.248.000 ARS ($890.000 ponderado)\n• Ingresos Ganados este mes: $4.520.000 ARS (18 acuerdos cerrados)\n• Tasa de Cierre (Win Rate): 38,5%\n• Ciclo promedio de venta: 14 días (↓ 3 días vs mes anterior)\n• Focos urgentes: 3 tareas vencidas y 2 oportunidades sin contacto > 7 días.';
      } else if (q.includes('riesgo') || q.includes('estancad') || q.includes('alerta')) {
        reply =
          '⚠️ Tratos con Alerta de Estancamiento ("Deal Rotting"):\n1. Distribuidora Andina SRL ($3.200.000 ARS) - 9 días sin contacto. Sugerencia: Enviar propuesta actualizada por WhatsApp.\n2. Frigorífico del Valle ($1.850.000 ARS) - 8 días sin feedback de presupuesto con CAE.\n\n¿Deseas que prepare una plantilla de reactivación personalizada?';
      } else if (q.includes('tarea') || q.includes('hoy') || q.includes('prioridad')) {
        reply =
          '📋 Focos de Atención para Hoy:\n• 10:30 Llamada de cierre con Agropecuaria Patagonia\n• 12:00 Emisión de Factura A con CAE para Logística Fueguina\n• 15:00 Demo guiada con Clínica Roca Salud por WhatsApp multiagente';
      } else {
        reply = `He procesado tu consulta sobre "${text}". En el CRM Clientum, esta métrica se actualiza automáticamente con cada interacción de WhatsApp, llamada o factura emitida en AFIP.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  // Mock deals for interactive pipeline
  const deals = [
    {
      id: 'd1',
      company: 'Frigorífico del Valle S.A.',
      deal: 'Plan ERP + 12 Terminales',
      amount: '$1.850.000 ARS',
      stage: 'Prospecto',
      type: 'New Business',
      prob: '40%',
      color: '#0d9488',
    },
    {
      id: 'd2',
      company: 'Agropecuaria Patagonia',
      deal: 'Módulo GPS + WhatsApp Bot',
      amount: '$1.600.000 ARS',
      stage: 'Contactado',
      type: 'New Business',
      prob: '60%',
      color: '#2563eb',
    },
    {
      id: 'd3',
      company: 'Distribuidora Andina SRL',
      deal: 'Suite Completa + AFIP Masivo',
      amount: '$3.200.000 ARS',
      stage: 'Calificado',
      type: 'Expansion',
      prob: '75%',
      color: '#7c3aed',
    },
    {
      id: 'd4',
      company: 'Clínica Roca Salud',
      deal: 'Turnos WhatsApp + Pacientes',
      amount: '$2.000.000 ARS',
      stage: 'Propuesta',
      type: 'New Business',
      prob: '85%',
      color: '#d97706',
    },
    {
      id: 'd5',
      company: 'Logística Fueguina S.A.',
      deal: 'Factura A-0001 • CAE Pagado MP',
      amount: '$4.500.000 ARS',
      stage: 'Ganado',
      type: 'Expansion',
      prob: '100%',
      color: '#10b981',
    },
  ];

  const filteredDeals = deals.filter((d) => pipelineFilter === 'Todos' || d.type === pipelineFilter);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>TOUR INTERACTIVO · EL DASHBOARD QUE TIENEN NUESTRAS PYMES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          La Operación Completa de tu Negocio en una Sola Pantalla
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Descubrí cómo el <strong>Resumen Ejecutivo</strong> de Clientum combina métricas comerciales, detección temprana de tratos en riesgo, tareas del día, facturación AFIP y Copilot con IA en tiempo real.
        </p>
      </div>

      {/* Showcase Mode Nav Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={() => setActiveTab('executive')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'executive'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>1. Resumen Ejecutivo & KPIs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'pipeline'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Embudo Comercial en Vivo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('operations')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'operations'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>3. Centro Operativo (6 Áreas)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('copilot')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'copilot'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>4. Copilot Ejecutivo con IA</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Browser / Shell Header Bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
              app.clientum.com.ar/dashboard/{activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sincronización en vivo
            </span>
            <button
              type="button"
              onClick={() => enterApp()}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir CRM completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5 Real-Time High Impact KPI Badges (Always Visible on Top of Showcase) */}
        <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* KPI 1 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              <span>Pipeline Activo</span>
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tabular-nums mt-1">
              $1.248.000 ARS
            </div>
            <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
              $890.000 ponderado
            </div>
          </div>

          {/* KPI 2 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              <span>Ingresos Ganados</span>
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tabular-nums mt-1">
              $4.520.000 ARS
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
              18 negocios cerrados
            </div>
          </div>

          {/* KPI 3 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              <span>Tasa de Cierre</span>
              <Target className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tabular-nums mt-1">
              38,5%
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-purple-600 h-full w-[38.5%]" />
            </div>
          </div>

          {/* KPI 4 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              <span>Ciclo de Venta</span>
              <Clock3 className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tabular-nums mt-1">
              14 días
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Lead a cobro con CAE
            </div>
          </div>

          {/* KPI 5 */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              <span>Focos Urgentes</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 tabular-nums mt-1">
              5 alertas
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              3 tareas + 2 tratos estancados
            </div>
          </div>
        </div>

        {/* Tab 1 Body: Executive Attention Panel & Semáforo */}
        {activeTab === 'executive' && (
          <div className="p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                  Semáforo Operativo
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Atención Prioritaria: Tareas del Día & Negocios sin Seguimiento
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                Hacé clic en el checklist para simular la resolución inmediata
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Card 1: Critical Tasks */}
              <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Tareas Críticas y de Cierre
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
                    3 Urgentes
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      id: 't1',
                      title: 'Llamada de cierre con Frigorífico del Valle',
                      due: 'Hoy 10:30',
                      overdue: true,
                      tag: 'Alta Prioridad',
                    },
                    {
                      id: 't2',
                      title: 'Enviar presupuesto formal con CAE a Distribuidora Andina',
                      due: 'Hoy 14:00',
                      overdue: false,
                      tag: 'Propuesta',
                    },
                    {
                      id: 't3',
                      title: 'Confirmación de pago de seña con Logística Fueguina',
                      due: 'Ayer',
                      overdue: true,
                      tag: 'Cobro',
                    },
                  ].map((task) => {
                    const isDone = completedTaskIds[task.id];
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 opacity-70'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleTask(task.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                              isDone
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-transparent'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <div className="min-w-0">
                            <div
                              className={`text-xs font-semibold truncate ${
                                isDone
                                  ? 'line-through text-[#64748b] dark:text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {task.title}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className={task.overdue && !isDone ? 'text-rose-600 font-bold' : ''}>
                                {task.due}
                              </span>
                              <span>•</span>
                              <span className="font-semibold text-slate-600 dark:text-slate-300">{task.tag}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#0f172a] dark:text-white dark:text-slate-400 dark:text-slate-500 shrink-0">
                          {isDone ? 'Listo' : 'Pendiente'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Deal Rotting Alarms */}
              <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Detección de Tratos en Riesgo (Deal Rotting)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400">
                    &gt; 7 días sin actividad
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/40 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Distribuidora Andina SRL
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        $3.200.000 ARS
                      </span>
                    </div>
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                      ⚠️ 9 días sin seguimiento comercial registrado. Alta probabilidad de enfriamiento.
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#0f172a] dark:text-white dark:text-slate-400">Contacto: Lic. Martín Gómez</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('copilot');
                          handleSendQuery('¿Cómo reactivo a Distribuidora Andina?');
                        }}
                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Reactivar con Copilot IA</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/40 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Agropecuaria Patagonia
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        $1.600.000 ARS
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      ⏳ 8 días en etapa de negociación. El decisor económico no respondió el último WhatsApp.
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#0f172a] dark:text-white dark:text-slate-400">Contacto: Ing. Federico Rossi</span>
                      <button
                        type="button"
                        onClick={() => onOpenSimulator?.()}
                        className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Disparar WhatsApp Bot</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 Body: Live Pipeline Kanban Breakdown */}
        {activeTab === 'pipeline' && (
          <div className="p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                  Embudo Comercial
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Pipeline por Etapas, Probabilidad y Ticket
                </h3>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['Todos', 'New Business', 'Expansion'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPipelineFilter(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      pipelineFilter === t
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual 5-Stage Kanban Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {[
                { stage: 'Prospecto', color: '#0d9488', count: 4, sum: '$3.450.000' },
                { stage: 'Contactado', color: '#2563eb', count: 3, sum: '$2.800.000' },
                { stage: 'Calificado', color: '#7c3aed', count: 5, sum: '$5.200.000' },
                { stage: 'Propuesta', color: '#d97706', count: 2, sum: '$3.850.000' },
                { stage: 'Ganado / CAE', color: '#10b981', count: 6, sum: '$8.900.000' },
              ].map((st) => {
                const stageDeals = filteredDeals.filter(
                  (d) =>
                    d.stage === st.stage ||
                    (st.stage === 'Ganado / CAE' && d.stage === 'Ganado')
                );

                return (
                  <div
                    key={st.stage}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: st.color }}
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {st.stage}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          {st.count}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-extrabold text-slate-800 dark:text-slate-200 my-1">
                        {st.sum} ARS
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                      {stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 shadow-2xs space-y-1 hover:border-blue-400 transition-colors"
                        >
                          <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                            {deal.company}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {deal.deal}
                          </div>
                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100 dark:border-slate-700/50">
                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                              {deal.amount}
                            </span>
                            <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded">
                              {deal.prob}
                            </span>
                          </div>
                        </div>
                      ))}

                      {stageDeals.length === 0 && (
                        <div className="text-[11px] text-[#0f172a] dark:text-white dark:text-slate-400 italic text-center py-3">
                          Etapa en flujo
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3 Body: Operations Strip / Centro Operativo */}
        {activeTab === 'operations' && (
          <div className="p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                  Ecosistema Conectado
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Las 6 Áreas Clave de tu Empresa en una Misma Base de Datos
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sin planillas sueltas ni sincronizaciones rotas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  area: 'Ventas & Pipeline',
                  kpi: '$1.248.000 ARS',
                  detail: '22 oportunidades en curso con scoring predictivo MEDDIC.',
                  icon: Layers,
                  color: 'text-blue-600 bg-blue-50 border-blue-200',
                  path: '/producto/crm',
                },
                {
                  area: 'WhatsApp Omnicanal',
                  kpi: '14 chats activos',
                  detail: 'Bandeja compartida, bots Gemini 24/7 y respuestas en < 2 segundos.',
                  icon: MessageSquare,
                  color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                  path: '/producto/whatsapp-ia',
                },
                {
                  area: 'Facturación AFIP / ERP',
                  kpi: '$4.520.000 cobrados',
                  detail: 'Emisión de Facturas A, B y C con CAE y código QR fiscal en 1 clic.',
                  icon: Receipt,
                  color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
                  path: '/producto/erp',
                },
                {
                  area: 'Prospección Google Maps',
                  kpi: '+450 leads importados',
                  detail: 'Buscador B2B geolocalizado para extraer teléfonos, CUIT y comercios.',
                  icon: MapPin,
                  color: 'text-amber-600 bg-amber-50 border-amber-200',
                  path: '/producto/integraciones',
                },
                {
                  area: 'Automatizaciones & Workflows',
                  kpi: '12 flujos activos',
                  detail: 'Disparadores visuales de tareas, avisos por WhatsApp y webhooks.',
                  icon: Workflow,
                  color: 'text-purple-600 bg-purple-50 border-purple-200',
                  path: '/producto/automatizaciones',
                },
                {
                  area: 'Copilot Ejecutivo & 14 Agentes',
                  kpi: '14 especialistas IA',
                  detail: 'Investigación de competidores, redacción de propuestas y auditorías.',
                  icon: Bot,
                  color: 'text-violet-600 bg-violet-50 border-violet-200',
                  path: '/producto/agentes-ia',
                },
              ].map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.area}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-[#0f172a] dark:text-white dark:text-slate-400 dark:text-slate-500 uppercase">
                          Área Operativa
                        </span>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${area.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {area.area}
                      </h4>
                      <div className="text-base font-extrabold text-slate-900 dark:text-slate-100 tabular-nums my-1">
                        {area.kpi}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                        {area.detail}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onNavigate?.(area.path as PublicRoutePath)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Conocer capacidades</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4 Body: Interactive Copilot Simulator */}
        {activeTab === 'copilot' && (
          <div className="p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Copilot Ejecutivo con Gemini 3.6
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Preguntale a tu CRM cualquier decisión de negocio
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Probá los accesos rápidos con un solo clic:
              </span>
            </div>

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSendQuery('Resumen de ventas')}
                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer"
              >
                📊 Resumen ejecutivo consolidado
              </button>
              <button
                type="button"
                onClick={() => handleSendQuery('Tratos en riesgo')}
                className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
              >
                ⚠️ ¿Cuáles tratos están en riesgo?
              </button>
              <button
                type="button"
                onClick={() => handleSendQuery('Tareas de hoy')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer"
              >
                📋 Tareas y prioridades de hoy
              </button>
            </div>

            {/* Chat Stream Window */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3 h-64 overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-blue-200' : 'text-[#64748b] dark:text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[11px]">Consultando métricas en el CRM...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Escribí una pregunta (ej: '¿Cómo estamos en ingresos este mes?' o '¿Qué negocio necesita llamada urgente?')..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Consultar</span>
              </button>
            </form>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="p-5 sm:p-6 bg-blue-50/60 dark:bg-blue-950/20 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Probá este mismo dashboard con tu propio equipo en 5 días</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Migración asistida de contactos desde planillas de Excel sin costo adicional.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => enterApp()}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Explorar CRM en Vivo</span>
            </button>
            <button
              type="button"
              onClick={onOpenWizard}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              Cotizar Plan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
