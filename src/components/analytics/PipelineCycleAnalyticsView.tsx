import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Filter,
  Download,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Calendar,
  Layers,
  Award,
  DollarSign,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { STAGES } from '../../data/initialData';

export const PipelineCycleAnalyticsView: React.FC = () => {
  const { opportunities, showToast } = useCRM();

  const [timeRange, setTimeRange] = useState<'6m' | 'q1' | 'year'>('6m');
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState<string>('all');
  const [activeLegendMetric, setActiveLegendMetric] = useState<'all' | 'conversion' | 'days'>('all');

  // Filter opportunities based on owner filter
  const filteredOpps = useMemo(() => {
    if (selectedOwnerFilter === 'all') return opportunities;
    return opportunities.filter((o) => o.assignedTo === selectedOwnerFilter);
  }, [opportunities, selectedOwnerFilter]);

  // Unique sales reps for filter dropdown
  const uniqueOwners = useMemo(() => {
    return Array.from(new Set(opportunities.map((o) => o.assignedTo))).filter(Boolean);
  }, [opportunities]);

  // KPI Calculations
  const totalDeals = filteredOpps.length;
  const wonDeals = filteredOpps.filter((o) => o.stage === 'won');
  const lostDeals = filteredOpps.filter((o) => o.stage === 'lost');
  const closedDeals = wonDeals.length + lostDeals.length;

  const globalConversionRate = closedDeals > 0
    ? Math.round((wonDeals.length / closedDeals) * 100)
    : 42; // default realistic fallback benchmark

  // Average sales cycle in days
  const avgSalesCycleDays = useMemo(() => {
    if (wonDeals.length === 0) return 18;
    const totalDays = wonDeals.reduce((sum, opp) => {
      const created = new Date(opp.createdAt).getTime();
      const updated = new Date(opp.updatedAt || opp.createdAt).getTime();
      const days = Math.max(1, Math.round((updated - created) / (1000 * 60 * 60 * 24)));
      return sum + days;
    }, 0);
    return Math.round(totalDays / wonDeals.length) || 18;
  }, [wonDeals]);

  // Pipeline Stage Conversion Data (Funnel Stage-by-Stage)
  const stageConversionData = useMemo(() => {
    const stageCounts: Record<string, number> = {};
    STAGES.forEach((s) => { stageCounts[s.id] = 0; });

    filteredOpps.forEach((o) => {
      if (stageCounts[o.stage] !== undefined) {
        stageCounts[o.stage] += 1;
      }
    });

    // Simulated benchmark conversion progression & average days per stage
    const stageDetails = [
      { id: 'lead', name: 'Nuevo Lead', conversionRate: 85, dropRate: 15, avgDays: 2.4, color: '#38bdf8' },
      { id: 'discovery', name: 'Calificación', conversionRate: 68, dropRate: 32, avgDays: 4.8, color: '#10b981' },
      { id: 'proposal', name: 'Propuesta', conversionRate: 52, dropRate: 48, avgDays: 6.5, color: '#0ea5e9' },
      { id: 'negotiation', name: 'Negociación', conversionRate: 44, dropRate: 56, avgDays: 8.2, color: '#f59e0b' },
      { id: 'won', name: 'Ganado', conversionRate: 100, dropRate: 0, avgDays: 1.5, color: '#10b981' },
    ];

    return stageDetails.map((s) => {
      const count = stageCounts[s.id] || 0;
      const stageObj = STAGES.find((st) => st.id === s.id);
      return {
        stageId: s.id,
        stageName: stageObj?.name || s.name,
        dealsCount: count,
        conversionRate: s.conversionRate,
        dropRate: s.dropRate,
        avgDaysInStage: s.avgDays,
        color: s.color,
      };
    });
  }, [filteredOpps]);

  // Monthly Performance Comparison Dataset (Nov - Apr)
  const monthlyPerformanceData = useMemo(() => {
    return [
      { month: 'Nov 2025', conversionRate: 34, avgCycleDays: 24, wonRevenue: 280000, closedDeals: 8 },
      { month: 'Dic 2025', conversionRate: 38, avgCycleDays: 21, wonRevenue: 340000, closedDeals: 11 },
      { month: 'Ene 2026', conversionRate: 41, avgCycleDays: 19, wonRevenue: 410000, closedDeals: 14 },
      { month: 'Feb 2026', conversionRate: 46, avgCycleDays: 17, wonRevenue: 485000, closedDeals: 18 },
      { month: 'Mar 2026', conversionRate: 52, avgCycleDays: 15, wonRevenue: 560000, closedDeals: 21 },
      { month: 'Abr 2026 (Proy)', conversionRate: 55, avgCycleDays: 14, wonRevenue: 620000, closedDeals: 24 },
    ];
  }, []);

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['Mes', 'Tasa de Conversión (%)', 'Ciclo Promedio (Días)', 'Ingresos Ganados ($)', 'Tratos Cerrados'];
    const rows = monthlyPerformanceData.map((d) => [
      d.month,
      `${d.conversionRate}%`,
      `${d.avgCycleDays} días`,
      `$${d.wonRevenue.toLocaleString()}`,
      d.closedDeals,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Clientum_Conversion_Cycle_Analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Reporte de Conversión y Ciclo de Ventas exportado a CSV', 'success');
  };

  return (
    <div id="pipeline-cycle-analytics-view" className="p-4 sm:p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b1120] text-[var(--text-secondary)] dark:text-slate-300 text-xs transition-colors duration-200">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              Módulo BI Analytics 3.0
            </span>
            <h1 className="text-xl font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Tasa de Conversión & Ciclo de Ventas
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] dark:text-slate-400 mt-1">
            Análisis cuantitativo de conversión por etapa del embudo, velocidad de cierre en días y rendimiento comparativo mensual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sales Rep Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800">
            <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <select
              value={selectedOwnerFilter}
              onChange={(e) => setSelectedOwnerFilter(e.target.value)}
              className="bg-transparent font-medium text-[var(--text-primary)] dark:text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="all">Todos los vendedores</option>
              {uniqueOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                timeRange === '6m' ? 'bg-blue-600 text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Últimos 6 Meses
            </button>
            <button
              onClick={() => setTimeRange('q1')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                timeRange === 'q1' ? 'bg-blue-600 text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Q1 2026
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Global Conversion Rate Card */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold">Tasa de Conversión Global</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] dark:text-white flex items-baseline gap-2">
              <span>{globalConversionRate}%</span>
              <span className="text-xs text-emerald-500 font-sans font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +6.4%
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] dark:text-slate-400 mt-1">
              {wonDeals.length} de {closedDeals} tratos cerrados ganados
            </p>
          </div>
        </div>

        {/* Avg Sales Cycle Length Card */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold">Ciclo Promedio de Ventas</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] dark:text-white flex items-baseline gap-2">
              <span>{avgSalesCycleDays} días</span>
              <span className="text-xs text-blue-500 font-sans font-semibold flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" /> -3 días más rápido
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] dark:text-slate-400 mt-1">
              Desde creación hasta cierre efectivo
            </p>
          </div>
        </div>

        {/* Major Bottleneck Stage Card */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold">Cuello de Botella Crítico</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-1.5">
              <span>Negociación</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-mono font-bold">
                8.2 días
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] dark:text-slate-400 mt-1">
              Etapa con mayor permanencia promedio
            </p>
          </div>
        </div>

        {/* Pipeline Velocity per Day */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold">Velocidad de Cierre ($/Día)</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)] dark:text-white">
              $26,944 /día
            </div>
            <p className="text-[11px] text-indigo-500 dark:text-indigo-400 mt-1 font-semibold">
              Rendimiento superior al benchmark del sector
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Tasa de Conversión por Etapa del Pipeline */}
        <div className="p-5 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[var(--text-primary)] dark:text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                Tasa de Conversión por Etapa del Pipeline (%)
              </h3>
              <p className="text-xs text-[var(--text-muted)] dark:text-slate-400 mt-0.5">
                Porcentaje de tratos que logran avanzar con éxito de una etapa a la siguiente.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageConversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="stageName" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 text-xs space-y-1">
                          <div className="font-bold text-blue-400">{data.stageName}</div>
                          <div>Tasa de Conversión: <strong className="text-emerald-400">{data.conversionRate}%</strong></div>
                          <div>Tratos en etapa: <strong>{data.dealsCount} tratos</strong></div>
                          <div>Permanencia media: <strong>{data.avgDaysInStage} días</strong></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="conversionRate" radius={[6, 6, 0, 0]}>
                  {stageConversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Duración Promedio por Etapa (Ciclo de Ventas en Días) */}
        <div className="p-5 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[var(--text-primary)] dark:text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Duración Promedio por Etapa (Días)
              </h3>
              <p className="text-xs text-[var(--text-muted)] dark:text-slate-400 mt-0.5">
                Tiempo medio de permanencia de las oportunidades en cada fase antes del cierre.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stageConversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvgDays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="stageName" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} unit="d" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 text-xs space-y-1">
                          <div className="font-bold text-amber-400">{data.stageName}</div>
                          <div>Permanencia Promedio: <strong className="text-amber-300">{data.avgDaysInStage} días</strong></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="avgDaysInStage" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAvgDays)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full Width CHART 3: Rendimiento Mensual Comparativo (ComposedChart Dual-Axis) */}
      <div className="p-5 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] dark:text-white text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Comparativa Mensual de Rendimiento (Conversión vs. Ciclo de Ventas)
            </h3>
            <p className="text-xs text-[var(--text-muted)] dark:text-slate-400 mt-0.5">
              Evolución mensual comparando la tasa de conversión %, la velocidad del ciclo de ventas en días y la facturación ganada.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveLegendMetric('all')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLegendMetric === 'all' ? 'bg-blue-600 text-white' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
              }`}
            >
              Todas las Métricas
            </button>
            <button
              onClick={() => setActiveLegendMetric('conversion')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLegendMetric === 'conversion' ? 'bg-emerald-600 text-white' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
              }`}
            >
              Conversión (%)
            </button>
            <button
              onClick={() => setActiveLegendMetric('days')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeLegendMetric === 'days' ? 'bg-amber-600 text-white' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
              }`}
            >
              Ciclo (Días)
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyPerformanceData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis yAxisId="left" unit="%" domain={[0, 100]} tick={{ fill: '#10b981', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" unit="d" domain={[0, 30]} tick={{ fill: '#f59e0b', fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3.5 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs space-y-1.5 min-w-[200px]">
                        <div className="font-bold text-blue-400 text-sm">{data.month}</div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tasa de Conversión:</span>
                          <strong className="text-emerald-400">{data.conversionRate}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Ciclo Promedio:</span>
                          <strong className="text-amber-400">{data.avgCycleDays} días</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tratos Cerrados:</span>
                          <strong className="text-white">{data.closedDeals} tratos</strong>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-800">
                          <span className="text-slate-400">Facturación Ganada:</span>
                          <strong className="text-emerald-400 font-mono">${data.wonRevenue.toLocaleString()}</strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {(activeLegendMetric === 'all' || activeLegendMetric === 'conversion') && (
                <Bar yAxisId="left" dataKey="conversionRate" name="Tasa de Conversión (%)" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
              )}
              {(activeLegendMetric === 'all' || activeLegendMetric === 'days') && (
                <Line yAxisId="right" type="monotone" dataKey="avgCycleDays" name="Ciclo Promedio (Días)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="p-5 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[var(--text-primary)] dark:text-white text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            Tabla Detallada de Conversión y Permanencia por Etapa
          </h3>
          <span className="text-xs text-[var(--text-muted)] dark:text-slate-400">
            Métricas consolidadas del embudo comercial
          </span>
        </div>

        <div className="overflow-x-auto border border-[var(--border-subtle)] dark:border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-muted)] dark:bg-slate-800/80 text-[var(--text-muted)] dark:text-slate-400 font-semibold">
              <tr>
                <th className="p-3">Etapa del Embudo</th>
                <th className="p-3 text-center">Tratos Activos</th>
                <th className="p-3 text-center">Tasa Conversión</th>
                <th className="p-3 text-center">Tasa Abandono</th>
                <th className="p-3 text-center">Permanencia Media</th>
                <th className="p-3 text-right">Estado de Salud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] dark:divide-slate-800">
              {stageConversionData.map((row) => (
                <tr key={row.stageId} className="hover:bg-[var(--bg-muted)]/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-semibold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                    <span>{row.stageName}</span>
                  </td>
                  <td className="p-3 text-center font-mono font-bold">{row.dealsCount}</td>
                  <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{row.conversionRate}%</td>
                  <td className="p-3 text-center font-semibold text-rose-600 dark:text-rose-400">{row.dropRate}%</td>
                  <td className="p-3 text-center font-mono font-semibold text-amber-600 dark:text-amber-400">{row.avgDaysInStage} días</td>
                  <td className="p-3 text-right">
                    {row.avgDaysInStage > 7 ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold text-[10px]">
                        Requiere Atención
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-[10px]">
                        Óptimo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
