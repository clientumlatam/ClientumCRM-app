import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  Globe,
  Kanban,
  Layers,
  Map,
  MessageSquare,
  Package,
  Receipt,
  Rocket,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Utensils,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';

interface PublicPlatformMapProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenWizard: () => void;
  onOpenSimulator: () => void;
}

type PlatformGroup = {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  softAccent: string;
  modules: Array<{
    name: string;
    detail: string;
    icon: React.ComponentType<{ className?: string }>;
    path?: PublicRoutePath;
  }>;
};

const platformGroups: PlatformGroup[] = [
  {
    eyebrow: '01 / Comercial',
    title: 'CRM & Pipeline B2B',
    description: 'Del primer lead al cierre, con contexto, scoring y forecast en una única ficha comercial.',
    icon: Kanban,
    accent: 'text-blue-600',
    softAccent: 'bg-blue-50 border-blue-100',
    modules: [
      { name: 'Dashboard Ejecutivo', detail: 'Semáforo de alertas, deal rotting y 5 KPIs', icon: BarChart3, path: '/producto/dashboard' },
      { name: 'Oportunidades Kanban', detail: 'Etapas, tabla, MEDDIC y propuestas PDF', icon: Kanban, path: '/producto/crm' },
      { name: 'Personas & empresas', detail: 'Fichas B2B, relaciones y duplicados', icon: Users, path: '/producto/crm' },
      { name: 'Prospección Maps IA', detail: 'Comercios, teléfonos y sitios importados', icon: Map, path: '/producto/integraciones' },
    ],
  },
  {
    eyebrow: '02 / Operaciones',
    title: 'Engine & Automatizaciones',
    description: 'Modelá cualquier negocio, conectá datos y dejá que los procesos repetitivos se ejecuten solos.',
    icon: Workflow,
    accent: 'text-amber-600',
    softAccent: 'bg-amber-50 border-amber-100',
    modules: [
      { name: 'Custom Objects Studio', detail: 'Contratos, pólizas, propiedades o flotas', icon: Layers, path: '/producto/automatizaciones' },
      { name: 'Workflows visuales', detail: 'Triggers, condiciones, tareas y webhooks', icon: Workflow, path: '/producto/automatizaciones' },
      { name: 'CSV Import & Export', detail: 'Mapeo inteligente para migrar sin fricción', icon: FileSpreadsheet, path: '/servicios' },
    ],
  },
  {
    eyebrow: '03 / Conversaciones',
    title: 'WhatsApp & Omnicanal',
    description: 'Una bandeja para equipos, bots que responden 24/7 y campañas que vuelven medible cada conversación.',
    icon: MessageSquare,
    accent: 'text-emerald-600',
    softAccent: 'bg-emerald-50 border-emerald-100',
    modules: [
      { name: 'Inbox multiagente', detail: 'Asignación, estados, intención y respuestas rápidas', icon: MessageSquare, path: '/producto/whatsapp-ia' },
      { name: 'Chatbot IA 24/7', detail: 'Califica, agenda y deriva al vendedor correcto', icon: Bot, path: '/producto/whatsapp-ia' },
      { name: 'Campañas & Broadcast', detail: 'Variables, entregas y tasa de respuesta', icon: Rocket, path: '/producto/marketing' },
    ],
  },
  {
    eyebrow: '04 / Inteligencia',
    title: 'Agent OS & Copilot',
    description: '14 especialistas coordinados para investigar, redactar, vender, asistir y cuidar la operación.',
    icon: Bot,
    accent: 'text-violet-600',
    softAccent: 'bg-violet-50 border-violet-100',
    modules: [
      { name: 'Copilot Gemini', detail: 'Insights, objeciones y estrategias GTM', icon: Sparkles, path: '/producto/agentes-ia' },
      { name: 'SDR Outreach', detail: 'Prospección y primer contacto automatizado', icon: Search, path: '/producto/agentes-ia' },
      { name: 'SEO & Ad Copy Studio', detail: 'Keywords, auditorías y anuncios que convierten', icon: Globe, path: '/producto/seo' },
    ],
  },
  {
    eyebrow: '05 / Finanzas',
    title: 'ERP, AFIP & Cobros',
    description: 'Cuando ganás el negocio, Clientum sigue: factura, cobra, controla stock y ordena la caja.',
    icon: Receipt,
    accent: 'text-cyan-600',
    softAccent: 'bg-cyan-50 border-cyan-100',
    modules: [
      { name: 'Facturación AFIP', detail: 'Comprobantes A, B y C con CAE y QR', icon: Receipt, path: '/producto/erp' },
      { name: 'Mercado Pago', detail: 'Links de pago y estado de acreditación', icon: Zap, path: '/producto/erp' },
      { name: 'Inventario & gastos', detail: 'Stock mínimo, costos y centros de costo', icon: Package, path: '/producto/erp' },
    ],
  },
  {
    eyebrow: '06 / Experiencia',
    title: 'Portal, Web & E-commerce',
    description: 'Extendé la experiencia más allá del equipo interno con autoservicio, pedidos y canales digitales propios.',
    icon: Store,
    accent: 'text-orange-600',
    softAccent: 'bg-orange-50 border-orange-100',
    modules: [
      { name: 'Portal del cliente B2B', detail: 'Facturas, contratos, pagos y tickets', icon: Building2, path: '/producto/integraciones' },
      { name: 'Web, SEO & widgets', detail: 'Landings, chat y formularios conectados al CRM', icon: Globe, path: '/producto/seo' },
      { name: 'KDS & pedidos online', detail: 'Cocina, delivery, Shopify y WooCommerce', icon: Utensils, path: '/tienda/central' },
    ],
  },
];

const journey = [
  { label: 'Captar', title: 'Lead', detail: 'Maps IA, formularios, WhatsApp o CSV', icon: Search },
  { label: 'Entender', title: 'Calificar', detail: 'MEDDIC, intención y datos de empresa', icon: Users },
  { label: 'Convertir', title: 'Propuesta', detail: 'Cotizador, PDF, seguimiento y tareas', icon: FileSpreadsheet },
  { label: 'Cerrar', title: 'Cobrar', detail: 'Mercado Pago, transferencia y CAE', icon: Receipt },
  { label: 'Fidelizar', title: 'Portal', detail: 'Soporte, pedidos y nuevas oportunidades', icon: Store },
];

export const PublicPlatformMap: React.FC<PublicPlatformMapProps> = ({
  onNavigate,
  onOpenWizard,
  onOpenSimulator,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#eef1f6] dark:bg-[[#f8fafc]] dark:bg-[#07111f] py-20 sm:py-24 text-[#0f172a] dark:text-white dark:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">
              <Layers className="h-3.5 w-3.5" />
              ClientumOS / 16 módulos conectados
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-[1.05]">
              No sumes otra herramienta.
              <span className="block text-blue-300">Conectá todo el negocio.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#475569] dark:text-white dark:text-slate-300 sm:text-base">
              CRM, conversaciones, inteligencia artificial, finanzas y experiencia digital trabajando sobre la misma base de datos. Una arquitectura para crecer sin volver a unir piezas con planillas.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onNavigate('/producto')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-black/20 transition-colors hover:bg-blue-50"
              >
                Explorar la arquitectura
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onOpenWizard}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-bold text-[#0f172a] dark:text-white dark:text-white transition-colors hover:bg-white/10"
              >
                Calcular mi implementación
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: '$582k', label: 'pipeline ponderado', color: 'text-blue-300' },
              { value: '38,5%', label: 'tasa de cierre', color: 'text-emerald-300' },
              { value: '14 días', label: 'ciclo promedio', color: 'text-amber-300' },
              { value: '14', label: 'agentes especialistas', color: 'text-violet-300' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                <div className={`text-2xl font-black tracking-tight ${metric.color}`}>{metric.value}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase leading-4 tracking-wide text-[#64748b] dark:text-white dark:text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {platformGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <article
                key={group.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${group.softAccent}`}>
                    <GroupIcon className={`h-5 w-5 ${group.accent}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{group.eyebrow}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#0f172a] dark:text-white dark:text-white">{group.title}</h3>
                <p className="mt-2 min-h-[3.5rem] text-xs leading-5 text-[#64748b] dark:text-white dark:text-slate-400">{group.description}</p>
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  {group.modules.map((module) => {
                    const ModuleIcon = module.icon;
                    return (
                      <button
                        key={module.name}
                        type="button"
                        onClick={() => module.path && onNavigate(module.path)}
                        className="flex w-full items-start gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-white/10"
                      >
                        <ModuleIcon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${group.accent}`} />
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold text-[#1e293b] dark:text-white dark:text-slate-100">{module.name}</span>
                          <span className="mt-0.5 block text-[10px] leading-4 text-slate-500">{module.detail}</span>
                        </span>
                        <ArrowRight className="ml-auto mt-1 h-3 w-3 shrink-0 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-[#eef1f6] dark:bg-[[#ffffff]] dark:bg-[#0d1b2d] p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">Del lead al cobro</div>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#0f172a] dark:text-white dark:text-white">Un solo recorrido, sin perder contexto</h3>
            </div>
            <button
              type="button"
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-[11px] font-bold text-emerald-200 transition-colors hover:bg-emerald-300/20 sm:self-auto"
            >
              Probar el bot en vivo
              <MessageSquare className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {journey.map((stage, index) => {
              const StageIcon = stage.icon;
              return (
                <React.Fragment key={stage.title}>
                  <div className="relative rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stage.label}</span>
                      <StageIcon className="h-4 w-4 text-blue-300" />
                    </div>
                    <div className="mt-3 text-base font-bold text-[#0f172a] dark:text-white dark:text-white">{stage.title}</div>
                    <p className="mt-1 text-[10px] leading-4 text-[#64748b] dark:text-white dark:text-slate-400">{stage.detail}</p>
                    <CheckCircle2 className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-[#eef1f6] dark:bg-[[#ffffff]] dark:bg-[#0d1b2d] text-emerald-300" />
                  </div>
                  {index < journey.length - 1 && (
                    <div className="hidden items-center justify-center text-slate-600 md:flex">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-blue-300/20 bg-blue-400/10 px-5 py-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-blue-300/15 text-blue-200 sm:flex">
              <Zap className="h-4 w-4" />
            </div>
            <p className="text-xs leading-5 text-blue-100">
              También incluye widgets embebibles, permisos por rol, APIs y datos aislados por workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/contacto')}
            className="shrink-0 text-xs font-bold text-[#0f172a] dark:text-white dark:text-white underline decoration-blue-300 underline-offset-4 hover:text-blue-200"
          >
            Hablar con un especialista
          </button>
        </div>
      </div>
    </section>
  );
};