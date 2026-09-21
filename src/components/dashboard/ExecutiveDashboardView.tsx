import React, { useState, useCallback } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  Flame,
  Layers,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  ShieldAlert,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
  X,
  ArrowLeftRight,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useCRM } from '../../context/CRMContext';
import { useTheme } from '../../context/ThemeContext';
import { Opportunity, StageId } from '../../types';
import { STAGES } from '../../data/initialData';
import { DashboardOperationsStrip } from './DashboardOperationsStrip';
import { RevenueChart } from '../analytics/RevenueChart';
import { RevenueForecastPanel } from '../analytics/RevenueForecastPanel';
import { MailAnalyticsPanel } from '../mail/MailAnalyticsPanel';
import { QuickCaptureModal } from '../common/QuickCaptureModal';
import { KanbanCard } from '../opportunities/KanbanCard';
import { WhatsAppQuickActionModal } from '../whatsapp/WhatsAppQuickActionModal';

const CHART_COLORS = ['#0d9488', '#2563eb', '#7c3aed', '#d97706', '#64748b'];

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const money = (amount: number) => `$ ${amount.toLocaleString('es-AR')}`;
const dateOnly = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00`);
const formatShortDate = (value: string) =>
  dateOnly(value).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });

export const ExecutiveDashboardView: React.FC = () => {
  const {
    opportunities,
    tasks,
    activities,
    people,
    currentUser,
    setActiveTab,
    setSelectedRecord,
    openNewRecordModal,
    showToast,
    moveOpportunityStage,
    toggleTaskStatus,
    openAICopilot,
    addActivity,
  } = useCRM();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [pipelineFilter, setPipelineFilter] = useState<'Todos los negocios' | Opportunity['type']>('Todos los negocios');
  const [cycleMetricMode, setCycleMetricMode] = useState<'Promedio' | 'Mediana' | 'Por etapa' | 'Por vendedor'>('Promedio');
  const [showCompetitorBanner, setShowCompetitorBanner] = useState(true);
  const [isPipelineDropdownOpen, setIsPipelineDropdownOpen] = useState(false);
  const [isCycleDropdownOpen, setIsCycleDropdownOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<StageId | null>(null);
  const [whatsAppOpp, setWhatsAppOpp] = useState<Opportunity | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: '¡Hola! Soy Clientum Copilot. Estoy listo para ayudarte a analizar métricas, pipeline comercial y prioridades de hoy.',
      time: 'Ahora',
    },
  ]);

  const getPriorityColor = useCallback((p: string) => {
    switch (p) {
      case 'Critical':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'High':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Medium':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-[var(--text-secondary)] bg-[var(--bg-muted)] border-[var(--border-subtle)]';
    }
  }, []);

  const getContact = useCallback(
    (opp: Opportunity) =>
      people.find((person) => person.id === opp.contactId) ||
      people.find((person) => `${person.firstName} ${person.lastName}` === opp.contactName),
    [people]
  );

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedOppId(id);
  }, []);

  const handleDragOver = (e: React.DragEvent, stageId: StageId) => {
    e.preventDefault();
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: StageId) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedOppId;
    if (id) {
      moveOpportunityStage(id, stageId);
      const stageName = STAGES.find((s) => s.id === stageId)?.name || stageId;
      showToast(`Oportunidad movida a "${stageName}"`, 'success');
    }
    setDraggedOppId(null);
    setDragOverStage(null);
  };

  const handleSelectRecord = useCallback(
    (id: string) => {
      setSelectedRecord({ type: 'opportunity', id });
      setActiveTab('opportunities');
    },
    [setSelectedRecord, setActiveTab]
  );

  const handleWhatsAppClick = useCallback((opp: Opportunity) => {
    setWhatsAppOpp(opp);
  }, []);

  const handleAICopilotClick = useCallback(
    (opp: Opportunity) => {
      openAICopilot({
        type: 'deal',
        id: opp.id,
        name: opp.name,
        initialPrompt: `Analiza la oportunidad "${opp.name}" ($${opp.amount.toLocaleString('es-AR')}) en etapa ${opp.stage} y sugiere los siguientes pasos comerciales.`,
      });
    },
    [openAICopilot]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredOpportunities = opportunities.filter(
    (opportunity) => pipelineFilter === 'Todos los negocios' || opportunity.type === pipelineFilter
  );

  const activeOpportunities = filteredOpportunities.filter(
    ({ stage }) => stage !== 'won' && stage !== 'lost'
  );

  const pipelineTotal = activeOpportunities.reduce((total, opportunity) => total + opportunity.amount, 0);
  const weightedPipeline = activeOpportunities.reduce(
    (total, opportunity) => total + opportunity.amount * (opportunity.probability / 100),
    0
  );

  const wonDeals = filteredOpportunities.filter(({ stage }) => stage === 'won');
  const wonTotal = wonDeals.reduce((total, deal) => total + deal.amount, 0);

  const decidedDeals = filteredOpportunities.filter(({ stage }) => stage === 'won' || stage === 'lost');
  const winRate = decidedDeals.length ? Math.round((wonDeals.length / decidedDeals.length) * 1000) / 10 : 32.4;

  const averageCycleDays = opportunities.length
    ? Math.round(
        opportunities.reduce((total, opportunity) => {
          const created = dateOnly(opportunity.createdAt).getTime();
          const close = dateOnly(opportunity.closeDate).getTime();
          return total + Math.max(0, (close - created) / 86400000);
        }, 0) / opportunities.length
      )
    : 27;

  const averageDealSize = filteredOpportunities.length > 0 
    ? Math.round(filteredOpportunities.reduce((acc, o) => acc + o.amount, 0) / filteredOpportunities.length) 
    : 0;

  const stageColors: Record<string, string> = {
    lead: 'bg-slate-400',
    contacted: 'bg-blue-500',
    meeting: 'bg-indigo-500',
    proposal: 'bg-amber-500',
    negotiation: 'bg-purple-500',
    won: 'bg-emerald-500',
    lost: 'bg-rose-500',
  };
  const stagesList = ['lead', 'contacted', 'meeting', 'proposal', 'negotiation', 'won', 'lost'] as const;
  const stageMetrics = stagesList.map((st) => ({
    stage: st,
    count: filteredOpportunities.filter((o) => o.stage === st).length,
    color: stageColors[st] || 'bg-blue-500',
  }));

  const pendingTasks = tasks.filter((task) => task.status !== 'Completed');
  const overdueTasks = pendingTasks.filter((task) => dateOnly(task.dueDate) <= today);
  const upcomingTasks = pendingTasks.filter((task) => dateOnly(task.dueDate) > today);

  const staleOpportunities = activeOpportunities
    .filter((opportunity) => (today.getTime() - dateOnly(opportunity.updatedAt || opportunity.createdAt).getTime()) / 86400000 >= 1)
    .sort((left, right) => right.amount - left.amount);

  const revenueData = wonDeals.length > 0
    ? Array.from(
        wonDeals.reduce((months, opportunity) => {
          const date = dateOnly(opportunity.closeDate);
          const month = date.toLocaleDateString('es-AR', { month: 'short' });
          months.set(month, (months.get(month) || 0) + opportunity.amount);
          return months;
        }, new Map<string, number>())
      ).map(([month, value]) => ({ month, value }))
    : [
        { month: 'Jun', value: 38000 },
        { month: 'Jul', value: 42000 },
        { month: 'Ago', value: 47000 },
        { month: 'Sep', value: 54000 },
      ];

  const sourceData = [
    { name: 'WhatsApp', count: 3, value: 42, color: '#10b981' },
    { name: 'Google B2B / Maps', count: 2, value: 28, color: '#3b82f6' },
    { name: 'Referidos', count: 1, value: 18, color: '#8b5cf6' },
    { name: 'Instagram', count: 1, value: 12, color: '#f59e0b' },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    if (!textToSend) setInputMessage('');
    setIsAiTyping(true);

    window.setTimeout(() => {
      const query = text.toLowerCase();
      let reply = '';

      if (query.includes('priorizar') || query.includes('hoy') || query.includes('hacer hoy') || query.includes('que debería')) {
        reply = `🎯 3 acciones prioritarias recomendadas para hoy:\n\n1. GAMAN ($180.000 · 65% prob.)\n   → No recibió seguimiento hace 2 días. Llamar a Matías Gómez para enviar y cerrar propuesta comercial.\n\n2. Ferretería El Oeste ($120.000 · 55% prob.)\n   → Roberto Benítez pidió propuesta ayer tras la demo. Enviar presupuesto formal por WhatsApp con detalle de 5 puestos y facturación AFIP.\n\n3. Distribuidora Patagónica ($178.000 · 40% prob.)\n   → Próximo contacto agendado para hoy. Demostrar conciliación de cobros con Mercado Pago.\n\n💼 Impacto potencial combinado: $478.000`;
      } else if (query.includes('resumen') || query.includes('métrica') || query.includes('ingreso') || query.includes('ventas')) {
        reply = `📊 Resumen ejecutivo comercial:\n• Pipeline total activo: ${money(pipelineTotal)} (${money(weightedPipeline)} ponderado)\n• Ingresos cerrados ganados: ${money(wonTotal)} (Vinoteca Valle Andino)\n• Tasa de conversión: 32,4% (↑ 5,8% vs. período anterior)\n• Ciclo de venta: 27 días (↓ 8% vs. período anterior)\n• Atención requerida: 5 acciones operativas urgentes`;
      } else if (query.includes('alerta') || query.includes('riesgo') || query.includes('estancado') || query.includes('atención')) {
        reply = `⚠️ Atención requerida (5 acciones urgentes):\n• 2 negocios sin seguimiento reciente (GAMAN $180k y Ferretería El Oeste $120k)\n• 2 tareas vencidas de envío de propuesta\n• 1 cliente para demostración de cuenta corriente`;
      } else {
        reply = `He analizado los datos de ClientumOS. Tenés ${activeOpportunities.length} negocios activos por ${money(pipelineTotal)}. El canal de mayor rendimiento es WhatsApp (42% de los tratos). ¿Querés que redactemos un mensaje para GAMAN o Ferretería El Oeste?`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsAiTyping(false);
    }, 500);
  };

  return (
    <div className="crm-dashboard flex-1 flex flex-col h-full bg-[var(--clientum-surface,#F5F7FA)] dark:bg-[var(--crm-bg,#040711)] text-[var(--clientum-ink,#212121)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-100 overflow-y-auto select-none font-['Inter',sans-serif]">
      <div className="crm-dashboard__content p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]/80 dark:border-[#1c2d47]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-md bg-[var(--clientum-navy,#022046)] text-white font-extrabold text-[10px] tracking-widest font-mono">
                CLIENTUMOS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clientum-success,#4CAF50)] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase">
                RESUMEN EJECUTIVO COMERCIAL & PYME
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--clientum-navy,#022046)] dark:text-white tracking-tight">
              Resumen ejecutivo
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
              Visión consolidada de salud comercial, forecast de ingresos y focos de atención prioritaria.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPipelineDropdownOpen(!isPipelineDropdownOpen)}
                className="crm-button-select"
              >
                <Filter size={13} className="text-slate-400" />
                <span>{pipelineFilter}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>
              {isPipelineDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 py-1 bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-[#1c2d47] rounded-xl shadow-xl z-20">
                  {['Todos los negocios', 'B2B Enterprise', 'PyME / SMB', 'Recurrente / SaaS'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setPipelineFilter(opt as any);
                        setIsPipelineDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                        pipelineFilter === opt
                          ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              onClick={() => openNewRecordModal('opportunity')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0056B3] hover:bg-[#004494] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Nuevo trato</span>
            </button>

            {/* AI Action Button: ¿Qué hacer hoy? */}
            <button
              type="button"
              onClick={() => handleSendMessage('¿Qué hacer hoy?')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f2851] dark:bg-slate-800 hover:bg-[#091b38] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer border border-blue-400/20"
            >
              <Sparkles size={13} className="text-emerald-400" />
              <span>¿Qué hacer hoy?</span>
            </button>
          </div>
        </div>

        {/* Competitor Hub Highlight Banner */}
        {showCompetitorBanner && (
          <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/50 dark:from-indigo-900/30 dark:via-slate-900/40 dark:to-blue-900/30 border border-blue-200/70 dark:border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100/60 dark:bg-indigo-600/20 border border-blue-200 dark:border-indigo-500/40 text-[var(--clientum-action,#0056B3)] dark:text-indigo-400 flex items-center justify-center shrink-0">
                <ArrowLeftRight size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--clientum-navy,#022046)] dark:text-indigo-300">
                    Migración 1-Click desde HubSpot o Salesforce
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--clientum-success,#4CAF50)]/15 text-[var(--clientum-success,#4CAF50)] border border-[var(--clientum-success,#4CAF50)]/30">
                    Ahorro hasta 92%
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                  Importa deals y contactos automáticamente, elimina costos punitivos por volumen y suma facturación AFIP nativa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('competitorHub')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Abrir Centro de Migración & TCO</span>
                <ArrowRight size={13} />
              </button>
              <button
                type="button"
                onClick={() => setShowCompetitorBanner(false)}
                className="crm-button-ghost"
                title="Cerrar aviso"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* 4 High-Impact Executive KPI Cards */}
        <div className="crm-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Pipeline Activo */}
          <div className="crm-kpi-stat-card">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="crm-label-eyebrow">
                Pipeline Activo
              </span>
              <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={14} />
              </span>
            </div>
            <div>
              <div className="crm-metric-number">
                {money(pipelineTotal > 0 ? pipelineTotal : 582000)}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ArrowUpRight size={12} /> {money(weightedPipeline > 0 ? Math.round(weightedPipeline) : 31000)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">ponderado</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1c2d47]/70 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              5 negocios en gestión
            </div>
          </div>

          {/* Card 2: Vendido */}
          <div className="crm-kpi-stat-card">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="crm-label-eyebrow">
                Vendido / Facturado
              </span>
              <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <BriefcaseBusiness size={14} />
              </span>
            </div>
            <div>
              <div className="crm-metric-number">
                {money(wonTotal > 0 ? wonTotal : 54000)}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                  <CheckCircle2 size={12} /> Vinoteca Valle Andino
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1c2d47]/70 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Facturación confirmada AFIP
            </div>
          </div>

          {/* Card 3: Conversión */}
          <div className="crm-kpi-stat-card">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="crm-label-eyebrow">
                Tasa de Conversión
              </span>
              <span className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200/60 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Target size={14} />
              </span>
            </div>
            <div>
              <div className="crm-metric-number">
                {winRate > 0 ? `${winRate}%` : '32,4%'}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <ArrowUpRight size={12} />
                <span>↑ 5,8% vs. anterior</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1c2d47]/70 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              6 negocios evaluados
            </div>
          </div>

          {/* Card 4: Ciclo de Venta con Selector */}
          <div className="crm-kpi-stat-card">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="crm-label-eyebrow">
                Ciclo de Venta
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCycleDropdownOpen(!isCycleDropdownOpen)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-[#1c2d47] bg-slate-100 dark:bg-[#111a2d] text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center gap-1 cursor-pointer"
                  title="Cambiar métrica de ciclo"
                >
                  <span>{cycleMetricMode}</span>
                  <ChevronDown size={10} />
                </button>
                {isCycleDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-32 py-1 bg-white dark:bg-[#111a2d] border border-slate-200 dark:border-[#1c2d47] rounded-lg shadow-lg z-20">
                    {(['Promedio', 'Mediana', 'Por etapa', 'Por vendedor'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setCycleMetricMode(mode);
                          setIsCycleDropdownOpen(false);
                        }}
                        className={`w-full px-2.5 py-1 text-left text-[11px] font-medium transition-colors ${ cycleMetricMode === mode ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700' }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              {cycleMetricMode === 'Promedio' && (
                <>
                  <div className="crm-metric-number">
                    27 días
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>↓ 7,8% vs. anterior</span>
                  </div>
                </>
              )}
              {cycleMetricMode === 'Mediana' && (
                <>
                  <div className="crm-metric-number">
                    24 días
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>↓ 11% vs. anterior</span>
                  </div>
                </>
              )}
              {cycleMetricMode === 'Por etapa' && (
                <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5 my-1">
                  <div>• Calificación: <strong>8d</strong></div>
                  <div>• Propuesta: <strong>11d</strong></div>
                  <div>• Negociación: <strong>8d</strong></div>
                </div>
              )}
              {cycleMetricMode === 'Por vendedor' && (
                <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5 my-1">
                  <div>• Fernando: <strong>22d</strong></div>
                  <div>• Sarah: <strong>29d</strong></div>
                  <div>• Marcus: <strong>31d</strong></div>
                </div>
              )}
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1c2d47]/70 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Velocidad de cierre PyME
            </div>
          </div>
        </div>

        {/* Actionable Urgent Card & Revenue Forecast Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Card: ATENCIÓN REQUERIDA */}
          <div className="lg:col-span-1 crm-kpi-stat-card">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="crm-label-eyebrow">
                ATENCIÓN REQUERIDA
              </span>
              <span className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200/60 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle size={14} />
              </span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 tabular-nums tracking-tight font-mono">
                5 acciones
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
                2 estancados · 2 tareas vencidas · 1 sin seguimiento
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1c2d47]/70 flex items-center">
              <span className="crm-badge-pill bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60">
                Requiere acción hoy
              </span>
            </div>
          </div>

          {/* Revenue Forecast Main Section */}
          <div className="lg:col-span-3">
            <RevenueForecastPanel />
          </div>
        </div>

        {/* Evolución de Ingresos y Distribución por Fuentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>

          {/* Distribución por Origen / Fuentes */}
          <div className="crm-panel-container p-5 flex flex-col justify-between">
            <div className="crm-section-header">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                  Distribución por Fuentes
                </h3>
                <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  Canales de adquisición de oportunidades
                </p>
              </div>
              <span className="text-xs font-semibold text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                {filteredOpportunities.length} tratos
              </span>
            </div>

            <div className="flex items-center justify-center relative my-2">
              <div className="w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={44}
                      outerRadius={62}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {sourceData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-[var(--text-primary)] dark:text-white tabular-nums font-mono">
                  {filteredOpportunities.length}
                </span>
                <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium">Tratos</span>
              </div>
            </div>

            <div className="space-y-2 mt-2 pt-3 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80">
              {sourceData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-100">
                    {item.value}% <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 font-normal">({item.count})</span>
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className="mt-3 w-full py-1.5 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 inline-flex items-center justify-center gap-1 cursor-pointer"
            >
              Ver reporte analítico detallado <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Actionable Priorities Panel (Atención Prioritaria) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Tareas Críticas y Próximas */}
          <div className="crm-panel-container p-5">
            <div className="crm-section-header">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <CalendarDays size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                    Tareas Pendientes & Prioritarias
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    {overdueTasks.length} vencidas · {pendingTasks.length} en cola
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
              >
                Ver todas <ArrowRight size={12} />
              </button>
            </div>

            <div className="space-y-2">
              {pendingTasks.slice(0, 4).map((task) => {
                const isOverdue = dateOnly(task.dueDate) < today;
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 bg-[var(--bg-muted)]/60 dark:bg-slate-900/40 hover:bg-[var(--bg-muted)]/60 dark:hover:bg-slate-800/60 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(task.id)}
                        className="w-5 h-5 rounded-md border border-[var(--border-default)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-600 hover:border-emerald-500 flex items-center justify-center text-transparent hover:text-emerald-500 transition-colors shrink-0 cursor-pointer"
                        title="Marcar como completada"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecord({ type: 'task', id: task.id });
                          setActiveTab('tasks');
                        }}
                        className="text-left min-w-0"
                      >
                        <div className="text-xs font-semibold text-[var(--text-primary)] dark:text-white truncate">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span
                            className={`font-semibold ${ isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400' }`}
                          >
                            {isOverdue ? '⚠️ Vencida · ' : 'Vence '}
                            {formatShortDate(task.dueDate)}
                          </span>
                          {task.priority && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${ task.priority === 'High' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] dark:bg-slate-800 dark:text-[var(--text-muted,#64748b)] dark:text-slate-400' }`}
                            >
                              {task.priority}
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecord({ type: 'task', id: task.id });
                        setActiveTab('tasks');
                      }}
                      className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-secondary)] dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 p-1 cursor-pointer"
                    >
                      <ArrowRight size={13} />
                    </button>
                  </div>
                );
              })}

              {pendingTasks.length === 0 && (
                <div className="py-6 text-center text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 flex flex-col items-center justify-center gap-1.5">
                  <CheckCircle2 size={24} className="text-emerald-500" />
                  <span>¡Todas tus tareas están al día!</span>
                </div>
              )}
            </div>
          </div>

          {/* Negocios en Riesgo (Deal Rotting) */}
          <div className="crm-panel-container p-5">
            <div className="crm-section-header">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200/60 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <ShieldAlert size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                    Negocios sin Seguimiento Reciente
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Tratos activos sin actividad registrada en más de 7 días
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('opportunities')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
              >
                Ver pipeline <ArrowRight size={12} />
              </button>
            </div>

            <div className="space-y-2">
              {staleOpportunities.slice(0, 4).map((opp) => {
                const daysInactive = Math.floor(
                  (today.getTime() - dateOnly(opp.updatedAt).getTime()) / 86400000
                );
                return (
                  <div
                    key={opp.id}
                    onClick={() => {
                      setSelectedRecord({ type: 'opportunity', id: opp.id });
                      setActiveTab('opportunities');
                    }}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 bg-[var(--bg-muted)]/60 dark:bg-slate-900/40 hover:bg-[var(--bg-muted)]/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--text-primary)] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {opp.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{opp.companyName || 'Sin empresa'}</span>
                        <span>·</span>
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">
                          hace {daysInactive} días sin contacto
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-100 tabular-nums font-mono">
                        {money(opp.amount)}
                      </div>
                      <span className="text-[10px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted)]">
                        {opp.probability}% prob.
                      </span>
                    </div>
                  </div>
                );
              })}

              {staleOpportunities.length === 0 && (
                <div className="py-6 text-center text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 flex flex-col items-center justify-center gap-1.5">
                  <CheckCircle2 size={24} className="text-emerald-500" />
                  <span>¡Excelente! Todos los negocios tienen seguimiento fresco.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Commercial Pipeline Board (Drag & Drop) */}
        <div id="crm-pipeline-board" className="crm-pipeline-board bg-[var(--bg-card)] dark:bg-[#0e1626] border border-[var(--border-subtle)]/80 dark:border-[#1c2d47] rounded-2xl p-5 shadow-xs">
          {/* Pipeline Header with Stage Selector & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-[var(--border-subtle)] dark:border-[#1c2d47]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[var(--clientum-action,#0056B3)]" />
                <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase font-mono">
                  GESTIÓN COMERCIAL ACTIVA
                </span>
              </div>
              <h2 className="text-base font-bold text-[var(--clientum-navy,#022046)] dark:text-white tracking-tight">
                Tablero de Pipeline Comercial
              </h2>
              <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                Arrastrá y soltá negocios entre etapas para actualizar su estado y probabilidad en tiempo real.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              {/* Pipeline Type Filter Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPipelineDropdownOpen(!isPipelineDropdownOpen)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-slate-700 text-[var(--text-secondary)] dark:text-slate-200 hover:bg-[var(--bg-muted)]/80 shadow-2xs transition-all cursor-pointer"
                >
                  <Filter size={12} className="text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                  <span>{pipelineFilter}</span>
                  <ChevronDown size={12} className="text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                </button>
                {isPipelineDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 py-1.5 bg-[var(--bg-card)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-slate-700 rounded-xl shadow-xl z-30">
                    {(['Todos los negocios', 'New Business', 'Expansion', 'Renewal'] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`w-full px-3.5 py-2 text-left text-xs font-medium transition-colors ${
                          pipelineFilter === item
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-[var(--clientum-action,#0056B3)] dark:text-blue-400 font-semibold'
                            : 'text-[var(--text-secondary)] dark:text-slate-300 hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700/50'
                        }`}
                        onClick={() => {
                          setPipelineFilter(item);
                          setIsPipelineDropdownOpen(false);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={() => openNewRecordModal('opportunity')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--clientum-action,#0056B3)] hover:bg-[#004494] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Plus size={13} />
                <span>Nuevo trato</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('opportunities')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800 hover:bg-[var(--bg-muted)]/80 text-[var(--text-secondary)] dark:text-slate-200 border border-[var(--border-subtle)] dark:border-slate-700 transition-colors cursor-pointer"
              >
                <span>Ver Kanban completo</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Kanban Columns Grid with Drag and Drop */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
            {STAGES.filter((stage) => stage.id !== 'lost').map((stage) => {
              const columnDeals = filteredOpportunities.filter((deal) => deal.stage === stage.id);
              const stageSum = columnDeals.reduce((sum, deal) => sum + deal.amount, 0);
              const isOver = dragOverStage === stage.id;

              return (
                <div
                  key={stage.id}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.id)}
                  className={`p-3 rounded-xl border transition-all flex flex-col min-h-[320px] ${
                    isOver
                      ? 'bg-blue-50/60 dark:bg-blue-950/30 border-[var(--clientum-action,#0056B3)] ring-2 ring-blue-400/20'
                      : 'bg-[var(--bg-muted)]/40 dark:bg-slate-900/40 border-[var(--border-subtle)]/70 dark:border-slate-800/80'
                  }`}
                >
                  {/* Stage Column Header */}
                  <div className="flex items-center justify-between gap-1 pb-2.5 mb-2 border-b border-[var(--border-subtle)]/60 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="text-xs font-bold text-[var(--text-primary)] dark:text-white truncate">
                        {stage.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--bg-card)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-slate-700 text-[var(--text-secondary)] dark:text-slate-300">
                      {columnDeals.length}
                    </span>
                  </div>

                  {/* Stage Amount Sum */}
                  <div className="text-xs font-extrabold text-[var(--clientum-navy,#022046)] dark:text-slate-100 tabular-nums font-mono mb-2 px-0.5">
                    {money(stageSum)}
                  </div>

                  {/* Deals Cards List */}
                  <div className="space-y-2 flex-1">
                    {columnDeals.map((deal) => (
                      <KanbanCard
                        key={deal.id}
                        opp={deal}
                        compactCards={true}
                        showCardTags={true}
                        showCardDates={false}
                        getPriorityColor={getPriorityColor}
                        getContact={getContact}
                        onDragStart={(e, id) => handleDragStart(e, id)}
                        onSelectRecord={handleSelectRecord}
                        onWhatsAppClick={handleWhatsAppClick}
                        onAICopilotClick={handleAICopilotClick}
                      />
                    ))}

                    {columnDeals.length === 0 && (
                      <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-subtle)] dark:border-slate-800 rounded-lg text-center p-3 text-[11px] text-[var(--text-muted)] dark:text-slate-500">
                        <span>Arrastrá un negocio aquí</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projected Sales & Weighted Pipeline 3-Month Forecast */}
        <RevenueForecastPanel />

        {/* Transactional Email Analytics Panel (Recharts 30 days) */}
        <div className="mt-8">
          <MailAnalyticsPanel defaultTimeRange="30d" />
        </div>

        {/* Dashboard Operations Strip */}
        <DashboardOperationsStrip onNavigate={(tab) => setActiveTab(tab)} />
      </div>

      {/* Slide-over AI Copilot Drawer */}
      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[var(--bg-card)] dark:bg-[#0f172a] border-l border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-2xl flex flex-col transition-all animate-in slide-in-from-right">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 bg-[var(--bg-muted)]/80 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-1.5">
                  Copilot Ejecutivo IA
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  Asistente comercial contextual en línea
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-lg text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-secondary)] dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 hover:bg-[var(--bg-muted)]/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-3 bg-[var(--bg-muted)] dark:bg-slate-900/40 border-b border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 flex flex-wrap gap-1.5">
            {[
              '🎯 ¿Qué negocios priorizar hoy?',
              '📊 Resumen de ventas',
              '⚠️ Atención requerida',
              '📋 Tareas prioritarias',
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[var(--bg-card)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${ msg.sender === 'user' ? 'items-end' : 'items-start' }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${ msg.sender === 'user' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white rounded-br-xs' : 'bg-[var(--bg-muted)] dark:bg-slate-800 text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 rounded-bl-xs border border-[var(--border-subtle)]/60 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/60' }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 bg-[var(--bg-muted)] dark:bg-slate-800/70 px-3 py-2 rounded-xl w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-300" />
                <span className="text-[11px] ml-1">Analizando datos del CRM...</span>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="p-3 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 bg-[var(--bg-card)] dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Preguntale a Copilot sobre el CRM..."
                className="flex-1 bg-[var(--bg-muted)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-[var(--text-primary)] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Quick Action Modal */}
      {whatsAppOpp && (
        <WhatsAppQuickActionModal
          isOpen={Boolean(whatsAppOpp)}
          onClose={() => setWhatsAppOpp(null)}
          recipientName={whatsAppOpp.contactName || whatsAppOpp.companyName || 'Cliente'}
          companyName={whatsAppOpp.companyName}
          dealName={whatsAppOpp.name}
          dealAmount={whatsAppOpp.amount}
          currency="ARS"
          onLogActivity={(messageText) => {
            addActivity({
              type: 'note',
              title: `Mensaje WhatsApp a ${whatsAppOpp.contactName || whatsAppOpp.name}`,
              content: messageText,
              author: currentUser?.name || 'Ventas',
              targetType: 'opportunity',
              targetId: whatsAppOpp.id,
              meta: {
                channel: 'WhatsApp',
              },
            });
            showToast('Mensaje de WhatsApp registrado en la actividad', 'success');
          }}
        />
      )}

      {/* Quick Capture Modal */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
      />
    </div>
  );
};
