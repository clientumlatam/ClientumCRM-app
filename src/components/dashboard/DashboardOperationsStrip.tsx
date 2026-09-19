import React from 'react';
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Globe,
  MessageSquare,
  Receipt,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface DashboardOperationsStripProps {
  onNavigate: (tab: ActiveTab) => void;
}

const operationalAreas: Array<{
  id: ActiveTab;
  label: string;
  title: string;
  metric: string;
  detail: string;
  status: string;
  statusTone: 'good' | 'info' | 'warning';
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  {
    id: 'opportunities',
    label: '01 · Comercial',
    title: 'Gestión Comercial & CRM',
    metric: '$ 582.000',
    detail: 'pipeline ponderado · 18 ganados este mes',
    status: '38,5% win rate',
    statusTone: 'good',
    icon: BriefcaseBusiness,
  },
  {
    id: 'whatsapp',
    label: '02 · Conversaciones',
    title: 'Comunicación Omnicanal',
    metric: '96%',
    detail: 'lectura promedio en campañas outbound',
    status: '18 chats activos',
    statusTone: 'info',
    icon: MessageSquare,
  },
  {
    id: 'aiAssistant',
    label: '03 · Inteligencia',
    title: 'Agentes IA & Automatización',
    metric: '14 agentes',
    detail: 'insights, SDR, GTM y copy disponibles',
    status: '3 insights nuevos',
    statusTone: 'good',
    icon: Sparkles,
  },
  {
    id: 'erp',
    label: '04 · Finanzas',
    title: 'ERP & Operaciones',
    metric: '$ 124.800',
    detail: 'cobrado este mes con Mercado Pago',
    status: 'AFIP CAE conectado',
    statusTone: 'good',
    icon: Receipt,
  },
  {
    id: 'workflows',
    label: '05 · Automatización',
    title: 'Automatización & Workflows',
    metric: '24 activos',
    detail: 'workflows, custom objects y webhooks',
    status: '98,7% ejecuciones OK',
    statusTone: 'good',
    icon: Workflow,
  },
  {
    id: 'seoSuite',
    label: '06 · Marketing',
    title: 'Prospección & Presencia Web',
    metric: '68 keywords',
    detail: 'rank tracking y activos embebibles',
    status: '4 widgets publicados',
    statusTone: 'info',
    icon: Globe,
  },
];

const suiteModules: Array<{ label: string; tab: ActiveTab }> = [
  { label: 'Pipeline de Ventas (Deals)', tab: 'opportunities' },
  { label: 'Lead Scoring MEDDIC', tab: 'meddic' },
  { label: 'Canal de WhatsApp WACE', tab: 'whatsapp' },
  { label: 'Bots & Respuestas IA', tab: 'chatbot' },
  { label: 'Facturación & ERP Avanzado', tab: 'erpAvanzado' },
  { label: 'Despliegues & Vercel Edge', tab: 'payments' },
  { label: 'Radar de Prospectos (Google Maps)', tab: 'googleMaps' },
  { label: 'Motor de Datos (Schemas)', tab: 'customObjects' },
  { label: 'Diseñador de Workflows', tab: 'workflows' },
  { label: 'Suite SEO Rank Tracker', tab: 'seoSuite' },
  { label: 'Portal de Clientes B2B', tab: 'clientPortal' },
  { label: 'Restaurante & Delivery', tab: 'restaurant' },
  { label: 'E-Commerce & Pagos', tab: 'ecommerce' },
  { label: 'Importador CSV Studio', tab: 'csvStudio' },
  { label: 'Copilot Gemini Comercial', tab: 'aiAssistant' },
  { label: 'Campañas Masivas (WhatsApp)', tab: 'campaigns' },
  { label: 'Clientum Dashboard & BI', tab: 'analytics' },
  { label: 'Inventario & Gastos', tab: 'erp' },
  { label: 'Arquitectura Cloud Run', tab: 'vscrmSuite' },
  { label: 'WordPress & API Gateway', tab: 'wordpressIntegracion' },
  { label: 'Sincronización Cloud & Drive', tab: 'workspaceIntegrations' },
  { label: 'Consola de Auditoría', tab: 'adminConsole' },
  { label: 'Documentación de Plataforma', tab: 'dashboardDocs' },
];

export const DashboardOperationsStrip: React.FC<DashboardOperationsStripProps> = ({ onNavigate }) => {
  return (
    <section className="bg-[var(--bg-card)] dark:bg-[#111827] border border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 rounded-2xl p-5 shadow-xs transition-all">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase">
            Centro Operativo · 6 Áreas Conectadas
          </span>
        </div>
        <h2 className="text-base font-bold text-[var(--text-primary)] dark:text-white tracking-tight">
          La operación completa en una sola vista
        </h2>
        <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
          Priorizá la próxima acción desde el estado comercial, conversacional, financiero y de automatización.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 self-start sm:self-center shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Workspace en línea</span>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
      {operationalAreas.map((area) => {
        const AreaIcon = area.icon;
        const toneStyles =
          area.statusTone === 'good'
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40'
            : area.statusTone === 'warning'
            ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40'
            : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40';

        return (
          <button
            key={area.id}
            type="button"
            className="flex flex-col text-left p-3.5 rounded-xl border border-[var(--border-subtle)]/70 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 bg-[var(--bg-muted)]/70 dark:bg-slate-900/50 hover:bg-[var(--bg-card)] dark:hover:bg-slate-800/80 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all group cursor-pointer"
            onClick={() => onNavigate(area.id)}
          >
            <div className="flex items-center justify-between gap-2 mb-2 w-full">
              <span className="text-[10px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted)] uppercase tracking-wider">
                {area.label}
              </span>
              <span className="w-6 h-6 rounded-md bg-[var(--bg-card)] dark:bg-slate-800 border border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 flex items-center justify-center text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <AreaIcon size={13} />
              </span>
            </div>
            <strong className="text-xs font-bold text-[var(--text-primary)] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-0.5">
              {area.title}
            </strong>
            <span className="text-base font-extrabold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-100 tabular-nums">
              {area.metric}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 line-clamp-1 mb-2">
              {area.detail}
            </span>
            <div className="mt-auto pt-2 border-t border-[var(--border-subtle)]/40 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/60 flex items-center justify-between w-full">
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${toneStyles}`}>
                <CheckCircle2 size={10} />
                {area.status}
              </span>
              <ArrowUpRight size={12} className="text-[var(--text-muted,#64748b)] dark:text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </button>
        );
      })}
    </div>

    <div className="p-3.5 rounded-xl bg-[var(--bg-muted)]/80 dark:bg-slate-900/60 border border-[var(--border-subtle)]/60 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/70">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center">
            <Bot size={12} />
          </div>
          <span className="text-xs font-bold text-[var(--text-primary)] dark:text-white">Power Suite Integral</span>
          <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted)] font-medium">· 16 módulos unificados</span>
        </div>
        <span className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 flex items-center gap-1">
          <Clock3 size={11} /> Acceso rápido directo
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suiteModules.map((module) => (
          <button
            key={module.label}
            type="button"
            onClick={() => onNavigate(module.tab)}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-[var(--bg-card)] dark:bg-slate-800 border border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600/50 hover:bg-blue-50/40 dark:hover:bg-slate-700/50 transition-all cursor-pointer shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {module.label}
          </button>
        ))}
      </div>
    </div>
  </section>
  );
};