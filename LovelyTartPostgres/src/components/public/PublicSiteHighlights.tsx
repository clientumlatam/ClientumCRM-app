import React from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  Globe,
  GraduationCap,
  Kanban,
  MessageSquare,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';

interface PublicSiteHighlightsProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenWizard: () => void;
  onOpenSimulator: () => void;
}

const serviceCards = [
  {
    title: 'Dashboard & Control Ejecutivo',
    description: 'Semáforo de alertas operativas, detección de tratos en riesgo (Deal Rotting) y Copilot con IA.',
    detail: '5 KPIs en vivo · Alertas > 7d · Resumen IA',
    icon: BarChart3,
    accent: 'blue',
    path: '/producto/dashboard' as PublicRoutePath,
  },
  {
    title: 'Inteligencia Artificial & Bots',
    description: 'Agentes conversacionales que atienden, califican y agendan reuniones 24/7.',
    detail: 'Gemini 3.8 · WhatsApp · Webhooks',
    icon: Bot,
    accent: 'emerald',
    path: '/producto/whatsapp-ia' as PublicRoutePath,
  },
  {
    title: 'Desarrollo Web & E-Commerce',
    description: 'Tiendas Shopify, WooCommerce y landings de alta conversión conectadas al CRM.',
    detail: 'ClientumShop · Mercado Pago · AFIP',
    icon: Globe,
    accent: 'cyan',
    path: '/servicios' as PublicRoutePath,
  },
  {
    title: 'CRM & Ventas B2B',
    description: 'Pipeline, MEDDIC, propuestas y reportes para que el equipo venda con contexto.',
    detail: 'Kanban · Multiagente · Forecast',
    icon: Kanban,
    accent: 'blue',
    path: '/clientum-crm' as PublicRoutePath,
  },
  {
    title: 'Marketing Digital & SEO',
    description: 'Campañas de performance, auditorías On-Page y seguimiento de posiciones.',
    detail: 'Keywords · Rank Tracker · Ad Copy',
    icon: Search,
    accent: 'violet',
    path: '/producto/seo' as PublicRoutePath,
  },
  {
    title: 'ERP & Facturación',
    description: 'Comprobantes A, B y C, CAE oficial y cobros integrados desde el cierre.',
    detail: 'AFIP · Mercado Pago · Inventario',
    icon: Receipt,
    accent: 'amber',
    path: '/producto/erp' as PublicRoutePath,
  },
];

const courseCards = [
  {
    title: 'Maestría en Ventas B2B',
    detail: 'Embudos, MEDDIC y cierres automatizados.',
  },
  {
    title: 'Agentes IA en WhatsApp sin código',
    detail: 'Prompts, flujos conversacionales y webhooks.',
  },
  {
    title: 'Marketing Digital & SEO para PyMEs',
    detail: 'Google, pauta publicitaria y métricas.',
  },
];

const planCards = [
  {
    name: 'Starter',
    price: '$29',
    audience: 'PyMEs en crecimiento',
    features: ['CRM básico', 'WhatsApp para 2 usuarios', 'Soporte estándar'],
    accent: 'border-slate-200',
  },
  {
    name: 'Professional',
    price: '$79',
    audience: 'Empresas escalando',
    features: ['5 usuarios', 'Chatbot IA 24/7', 'AFIP + Workflows'],
    accent: 'border-blue-500 shadow-lg shadow-blue-500/10',
  },
  {
    name: 'Enterprise',
    price: '$199',
    audience: 'Grandes operaciones',
    features: ['Usuarios ilimitados', 'Custom Objects Studio', 'SLA dedicado 24/7'],
    accent: 'border-slate-200',
  },
];

const accentStyles: Record<string, { icon: string; badge: string }> = {
  emerald: { icon: 'bg-emerald-50 text-emerald-700', badge: 'bg-emerald-50 text-emerald-700' },
  cyan: { icon: 'bg-cyan-50 text-cyan-700', badge: 'bg-cyan-50 text-cyan-700' },
  blue: { icon: 'bg-blue-50 text-blue-700', badge: 'bg-blue-50 text-blue-700' },
  violet: { icon: 'bg-violet-50 text-violet-700', badge: 'bg-violet-50 text-violet-700' },
  amber: { icon: 'bg-amber-50 text-amber-700', badge: 'bg-amber-50 text-amber-700' },
};

export const PublicSiteHighlights: React.FC<PublicSiteHighlightsProps> = ({
  onNavigate,
  onOpenWizard,
  onOpenSimulator,
}) => {
  return (
    <div className="space-y-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] dark:bg-slate-950 text-[#0f172a] dark:text-white dark:text-white shadow-xl">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-10">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200">
                <Activity className="h-3.5 w-3.5" />
                Actividad Clientum en vivo
              </div>
              <h2 className="max-w-xl text-2xl font-extrabold tracking-tight sm:text-4xl">
                Crecimiento comercial, IA y automatización en un solo equipo.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#475569] dark:text-white dark:text-slate-300">
                Consultoría estratégica, implementación de CRM, agentes de WhatsApp, marketing, desarrollo web e integraciones para PyMEs de Latinoamérica.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onOpenWizard}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-blue-50"
                >
                  Cotizar proyecto online
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onOpenSimulator}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-[#0f172a] dark:text-white dark:text-white transition-colors hover:bg-white/10"
                >
                  Ver demo en vivo
                  <MessageSquare className="h-4 w-4 text-emerald-300" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '+450', label: 'PyMEs escaladas', icon: Users, color: 'text-blue-300' },
                { value: '98,4%', label: 'satisfacción activa', icon: Sparkles, color: 'text-amber-300' },
                { value: '$14M+', label: 'transacciones gestionadas', icon: Receipt, color: 'text-emerald-300' },
                { value: '24/7', label: 'soporte técnico', icon: Clock, color: 'text-violet-300' },
              ].map((metric) => {
                const MetricIcon = metric.icon;
                return (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <MetricIcon className={`h-4 w-4 ${metric.color}`} />
                    <div className={`mt-3 text-2xl font-black ${metric.color}`}>{metric.value}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase leading-4 tracking-wide text-[#64748b] dark:text-white dark:text-slate-400">{metric.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-white/10 bg-white/[0.04] px-6 py-3 text-[11px] text-[#475569] dark:text-white dark:text-slate-300 sm:px-10">
            <span className="font-bold text-emerald-300">Última actividad:</span>{' '}
            TechGlobal S.A. activó WhatsApp CRM · Clínica Odontológica Córdoba cerró contrato Enterprise · una distribuidora importó 340 prospectos desde Maps IA.
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Catálogo B2B</div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] dark:text-white sm:text-3xl">Soluciones que se conectan con tu operación</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)] dark:text-slate-300">Elegí un punto de entrada y combiná servicios, módulos y acompañamiento para resolver el proceso completo.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/servicios')}
            className="inline-flex items-center gap-2 self-start text-xs font-bold text-blue-700 dark:text-blue-400 underline decoration-blue-200 dark:decoration-blue-800 underline-offset-4 hover:text-blue-900 dark:hover:text-blue-300 sm:self-auto cursor-pointer"
          >
            Ver catálogo completo
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {serviceCards.map((service) => {
            const ServiceIcon = service.icon;
            const styles = accentStyles[service.accent];
            return (
              <button
                key={service.title}
                type="button"
                onClick={() => onNavigate(service.path)}
                className="group rounded-2xl border border-[var(--border-subtle)] dark:border-[#1e2e4a] bg-[var(--bg-card)] dark:bg-[#0d1527] p-5 text-left shadow-2xs transition-all hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg cursor-pointer"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}>
                  <ServiceIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-[var(--text-primary)] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{service.title}</h3>
                <p className="mt-2 min-h-[4rem] text-xs leading-5 text-[var(--text-secondary)] dark:text-slate-300">{service.description}</p>
                <div className={`mt-4 inline-flex rounded-full px-2 py-1 text-[9px] font-bold ${styles.badge}`}>{service.detail}</div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  Explorar solución
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-700">
                  <GraduationCap className="h-4 w-4" />
                  Academia LMS
                </div>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">Capacitá a tu equipo con práctica real</h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">Cursos, sandboxes y certificaciones para que la adopción no dependa de improvisar el día del lanzamiento.</p>
              </div>
              <div className="hidden rounded-2xl bg-amber-100 p-3 text-amber-700 sm:block">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {courseCards.map((course, index) => (
                <div key={course.title} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-white/80 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-[11px] font-black text-amber-800">0{index + 1}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{course.title}</div>
                    <div className="mt-0.5 text-[11px] text-slate-600">{course.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/academia')}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-amber-700"
            >
              Explorar Campus LMS
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
              <Receipt className="h-4 w-4" />
              Planes transparentes
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">Empezá con lo que necesitás hoy</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Sin permanencia obligatoria y con cotizador de proyecto para módulos e implementación.</p>
            <div className="mt-5 space-y-3">
              {planCards.map((plan) => (
                <button
                  key={plan.name}
                  type="button"
                  onClick={() => onNavigate('/precios')}
                  className={`w-full rounded-2xl border bg-white p-4 text-left transition-all hover:border-blue-400 hover:shadow-sm ${plan.accent}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{plan.name}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{plan.audience}</div>
                    </div>
                    <div className="text-lg font-black text-blue-700">{plan.price}<span className="text-[10px] font-semibold text-slate-500">/mes</span></div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    {plan.features.map((feature) => (
                      <span key={feature} className="inline-flex items-center gap-1 text-[10px] text-slate-600">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onOpenWizard}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700"
            >
              Calcular inversión y ROI
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-5 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl bg-white p-2 text-emerald-700 shadow-sm sm:block">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Soporte humano y seguridad para operar tranquilo</div>
              <div className="mt-1 text-xs text-slate-600">SSL, uptime garantizado del 99,9%, protección de datos y respuesta directa para tu equipo.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/contacto')}
            className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-sm ring-1 ring-emerald-200 transition-colors hover:bg-emerald-100"
          >
            Hablar con un consultor
          </button>
        </div>
      </section>
    </div>
  );
};