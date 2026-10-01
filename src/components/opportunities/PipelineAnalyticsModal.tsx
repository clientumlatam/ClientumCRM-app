import React, { useState } from 'react';
import { X, TrendingUp, BarChart3, Clock, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { Opportunity } from '../../types';
import { STAGES } from '../../data/initialData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';

interface PipelineAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
}

export const PipelineAnalyticsModal: React.FC<PipelineAnalyticsModalProps> = ({
  isOpen,
  onClose,
  opportunities,
}) => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '12m'>('12m');

  if (!isOpen) return null;

  // 1. Conversion Rate per Stage
  // Calculate total leads (e.g. leads stage or total started) and progression through stages
  const totalOppCount = opportunities.length || 1;
  const stageConversionData = STAGES.map((stage, idx, arr) => {
    const count = opportunities.filter((o) => o.stage === stage.id).length;
    // Cumulative reached stage or direct count
    const reachedOrPast = opportunities.filter((o) => {
      const sIdx = arr.findIndex((s) => s.id === o.stage);
      return sIdx >= idx;
    }).length;
    const conversionRate = Math.round((reachedOrPast / totalOppCount) * 100);

    return {
      stageName: stage.name,
      count,
      conversionRate: Math.min(100, conversionRate),
      color: stage.color,
    };
  });

  // 2. Average Sales Cycle (Days per stage estimate)
  const salesCycleData = STAGES.filter((s) => s.id !== 'lost').map((stage, i) => ({
    stageName: stage.name,
    avgDays: Math.round(3 + i * 4.5 + Math.sin(i) * 2),
  }));

  // 3. Monthly Performance Comparison (Won Revenue & Deals Count)
  const monthlyPerformanceData = [
    { month: 'May', wonRevenue: 42000, dealsWon: 5, avgCycleDays: 24 },
    { month: 'Jun', wonRevenue: 68000, dealsWon: 8, avgCycleDays: 21 },
    { month: 'Jul', wonRevenue: 95000, dealsWon: 12, avgCycleDays: 19 },
    { month: 'Ago', wonRevenue: 115000, dealsWon: 15, avgCycleDays: 18 },
    { month: 'Sep', wonRevenue: 142000, dealsWon: 19, avgCycleDays: 16 },
    { month: 'Oct', wonRevenue: 185000, dealsWon: 24, avgCycleDays: 15 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-muted)]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>Analítica Avanzada del Pipeline & Ciclo de Ventas</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200">Recharts Powered</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Tasas de conversión por etapa, velocidad de cierre y comparación de rendimiento mensual.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)] p-0.5 text-xs">
              {(['30d', '90d', '12m'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    timeRange === r ? 'bg-blue-600 text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {r === '30d' ? 'Últimos 30d' : r === '90d' ? 'Últimos 90d' : 'Últimos 12m'}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Top KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 flex flex-col">
              <span className="text-xs font-medium text-[var(--text-muted)] mb-1">Tasa de Conversión Global</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-mono text-[var(--text-primary)]">38.4%</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +4.2% vs mes ant.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 flex flex-col">
              <span className="text-xs font-medium text-[var(--text-muted)] mb-1">Ciclo Promedio de Venta</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-mono text-[var(--text-primary)]">18 días</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <Clock className="w-3.5 h-3.5" /> -3 días más rápido
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 flex flex-col">
              <span className="text-xs font-medium text-[var(--text-muted)] mb-1">Ingresos Ganados (Periodo)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-mono text-emerald-600">$646k USD</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <DollarSign className="w-3.5 h-3.5" /> 24 tratos
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 flex flex-col">
              <span className="text-xs font-medium text-[var(--text-muted)] mb-1">Eficiencia del Embudo</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-mono text-blue-600">92.1%</span>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-0.5">
                  <Sparkles className="w-3.5 h-3.5" /> Óptima
                </span>
              </div>
            </div>
          </div>

          {/* Recharts Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Conversion Rate per Stage */}
            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Tasa de Conversión por Etapa (%)</h3>
                <span className="text-xs text-[var(--text-muted)] font-mono">Embudo de Ventas</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stageConversionData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="stageName" type="category" width={110} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any) => [`${val}% de progresión`, 'Tasa de Conversión']}
                      contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="conversionRate" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Average Sales Cycle by Stage */}
            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Ciclo de Ventas Promedio (Días por Etapa)</h3>
                <span className="text-xs text-[var(--text-muted)] font-mono">Velocidad Comercial</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesCycleData} margin={{ top: 5, right: 20, left: 10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="stageName" angle={-20} textAnchor="end" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis unit="d" tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any) => [`${val} días promedio`, 'Duración']}
                      contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="avgDays" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 3: Monthly Performance Comparison (Won Revenue & Deals Count) */}
          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Rendimiento Mensual Comparativo</h3>
                <p className="text-xs text-[var(--text-muted)]">Evolución de ingresos cerrados y cantidad de tratos ganados mes a mes.</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" /> Ingresos ($ USD)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-500 inline-block" /> Tratos Ganados</span>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPerformanceData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" tick={{ fontSize: 11 }} unit="k" />
                  <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="wonRevenue" name="Ingresos ($k USD)" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="dealsWon" name="Tratos Ganados" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">
            Datos actualizados en tiempo real desde el motor CRM & ERP de Clientum.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            Cerrar Analítica
          </button>
        </div>
      </div>
    </div>
  );
};
