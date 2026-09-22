import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Target,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Award,
  Zap,
  CheckCircle2,
  PieChart as PieChartIcon,
} from 'lucide-react';

// Monthly Revenue & Target Data
const MONTHLY_REVENUE_DATA = [
  { month: 'Ene', actual: 42000, target: 40000, deals: 14 },
  { month: 'Feb', actual: 58000, target: 45000, deals: 19 },
  { month: 'Mar', actual: 65000, target: 50000, deals: 22 },
  { month: 'Abr', actual: 52000, target: 55000, deals: 17 },
  { month: 'May', actual: 78000, target: 60000, deals: 28 },
  { month: 'Jun', actual: 84000, target: 65000, deals: 31 },
  { month: 'Jul', actual: 91000, target: 70000, deals: 35 },
  { month: 'Ago', actual: 88000, target: 75000, deals: 33 },
  { month: 'Sep', actual: 105000, target: 80000, deals: 41 },
];

// Pipeline Conversion Rate Trend
const CONVERSION_RATE_DATA = [
  { stage: 'Prospectos / Leads', count: 1240, rate: '100%' },
  { stage: 'Calificados (SQL)', count: 680, rate: '54.8%' },
  { stage: 'Propuesta / Demo', count: 320, rate: '25.8%' },
  { stage: 'Negociación VIP', count: 180, rate: '14.5%' },
  { stage: 'Cierre Ganado', count: 125, rate: '10.1%' },
];

// Monthly Conversion % Trend
const CONVERSION_TREND_DATA = [
  { month: 'Ene', leadToOpp: 42, oppToWin: 24, overall: 10.1 },
  { month: 'Feb', leadToOpp: 45, oppToWin: 26, overall: 11.7 },
  { month: 'Mar', leadToOpp: 48, oppToWin: 28, overall: 13.4 },
  { month: 'Abr', leadToOpp: 44, oppToWin: 25, overall: 11.0 },
  { month: 'May', leadToOpp: 52, oppToWin: 31, overall: 16.1 },
  { month: 'Jun', leadToOpp: 55, oppToWin: 33, overall: 18.1.toFixed(1) },
  { month: 'Jul', leadToOpp: 58, oppToWin: 36, overall: 20.8 },
  { month: 'Ago', leadToOpp: 56, oppToWin: 34, overall: 19.0 },
  { month: 'Sep', leadToOpp: 61, oppToWin: 38, overall: 23.1 },
];

// Sales Performance by Executive
const REP_PERFORMANCE_DATA = [
  { name: 'Jonathan Le Dantec', won: 380000, pipeline: 520000, quota: 85 },
  { name: 'Sofia Martinez', won: 290000, pipeline: 410000, quota: 92 },
  { name: 'Mateo Rossi', won: 210000, pipeline: 340000, quota: 78 },
  { name: 'Valentina Gomez', won: 185000, pipeline: 280000, quota: 74 },
  { name: 'Camila Fernandez', won: 160000, pipeline: 220000, quota: 80 },
];

// Revenue by Industry Segment
const SEGMENT_DATA = [
  { name: 'Fintech & Banca', value: 38, color: '#3B82F6' },
  { name: 'SaaS & Tech', value: 27, color: '#6366F1' },
  { name: 'Retail & Ecommerce', value: 18, color: '#10B981' },
  { name: 'Salud & Pharma', value: 11, color: '#F59E0B' },
  { name: 'Otros', value: 6, color: '#8B5CF6' },
];

export const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('YTD');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'conversion' | 'reps'>('revenue');

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-canvas)] text-[var(--text-primary)] p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Reports & Analytics BI Studio
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Análisis ejecutivo de ventas, tasas de conversión y proyección de ingresos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-1 text-xs">
            {['1M', '1Q', 'YTD', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeRange === range
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-all">
            <Download className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>Exportar PDF/CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue KPI */}
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-semibold">Ingresos Totales (YTD)</span>
            <div className="p-1.5 rounded-lg bg-[var(--color-success-light)] text-[var(--color-success)]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)] font-mono">$663,000</span>
            <span className="inline-flex items-center text-xs font-semibold text-[var(--color-success)]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.4%
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Superando meta YTD en +$113K</p>
        </div>

        {/* Win Rate KPI */}
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-semibold">Tasa de Conversión Global</span>
            <div className="p-1.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)] font-mono">23.1%</span>
            <span className="inline-flex items-center text-xs font-semibold text-[var(--color-success)]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +4.2%
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">23.1% de leads calificados a cierre</p>
        </div>

        {/* Avg Deal Size KPI */}
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-semibold">Ticket Promedio (ACV)</span>
            <div className="p-1.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)] font-mono">$18,450</span>
            <span className="inline-flex items-center text-xs font-semibold text-[var(--color-success)]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +6.8%
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Enterprise ACV promedio Q3</p>
        </div>

        {/* Avg Cycle KPI */}
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-semibold">Ciclo Medio de Venta</span>
            <div className="p-1.5 rounded-lg bg-[var(--color-warning-light)] text-[var(--color-warning)]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)] font-mono">19 días</span>
            <span className="inline-flex items-center text-xs font-semibold text-[var(--color-success)]">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -3 días
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Aceleración por auto-respuestas IA</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue vs Target Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Proyección de Ingresos Mensuales vs Meta CRM ($ USD)
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Comparativo de ingresos ejecutados vs objetivo comercial por mes
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
                Ingresos Reales
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-secondary)]" />
                Meta Objetivo
              </span>
            </div>
          </div>

          <div className="h-[300px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()} USD`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="Ingreso Real"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  name="Meta Comercial"
                  stroke="#818CF8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorTarget)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Segment Breakdown */}
        <div className="rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 p-5 space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Distribución por Industria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Origen de facturación por segmento B2B
            </p>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SEGMENT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {SEGMENT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}% del total`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
            {SEGMENT_DATA.map((seg) => (
              <div key={seg.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{seg.name}</span>
                </div>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{seg.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: Conversion Trend & Rep Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Rate Trend Chart */}
        <div className="rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 p-5 space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Evolución de Tasa de Conversión (%)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Métricas de eficiencias por etapas del embudo comercial
            </p>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CONVERSION_TREND_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}%`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="leadToOpp"
                  name="Lead -> Oportunidad"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="oppToWin"
                  name="Oportunidad -> Cierre"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="overall"
                  name="Conversión Global"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rep Performance Bar Chart */}
        <div className="rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 p-5 space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Rendimiento Comercial por Ejecutivo ($ USD)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparativo de ventas cerradas vs pipeline activo por vendedor
            </p>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REP_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  tickFormatter={(val) => val.split(' ')[0]}
                />
                <YAxis
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()} USD`, '']}
                />
                <Bar dataKey="won" name="Ventas Ganadas" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pipeline" name="Pipeline Activo" fill="#6366F1" opacity={0.5} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
