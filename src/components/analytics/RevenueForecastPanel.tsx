import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useCRM } from '../../context/CRMContext';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';
import { Opportunity } from '../../types';

// Stage weight probabilities for sales pipeline deals
const STAGE_WEIGHTS: Record<string, { label: string; prob: number }> = {
  lead: { label: 'Contacto Inicial', prob: 0.15 },
  contacted: { label: 'Contactado / Calificado', prob: 0.35 },
  meeting: { label: 'Reunión Demostrativa', prob: 0.50 },
  proposal: { label: 'Propuesta Enviada', prob: 0.70 },
  negotiation: { label: 'Negociación / Cierre', prob: 0.85 },
  won: { label: 'Cerrada Ganada', prob: 1.0 },
  lost: { label: 'Perdida', prob: 0.0 },
};

export const RevenueForecastPanel: React.FC = () => {
  const { opportunities, setActiveTab } = useCRM();
  const [selectedScenario, setSelectedScenario] = useState<'all' | 'weighted' | 'committed'>('all');

  // Compute 3-Month Projection
  // Month 1: Octubre 2026, Month 2: Noviembre 2026, Month 3: Diciembre 2026
  const forecastData = useMemo(() => {
    const activeDeals = opportunities.filter((o) => o.stage !== 'lost');

    // Categorize deals by target month (simulated based on id hash or close date)
    const month1Deals: Opportunity[] = [];
    const month2Deals: Opportunity[] = [];
    const month3Deals: Opportunity[] = [];

    activeDeals.forEach((deal, idx) => {
      if (deal.stage === 'won' || deal.stage === 'negotiation' || idx % 3 === 0) {
        month1Deals.push(deal);
      } else if (deal.stage === 'proposal' || idx % 3 === 1) {
        month2Deals.push(deal);
      } else {
        month3Deals.push(deal);
      }
    });

    const calculateMetrics = (deals: Opportunity[]) => {
      let totalPipeline = 0;
      let weightedExpected = 0;
      let committedWorstCase = 0;

      deals.forEach((d) => {
        const weight = STAGE_WEIGHTS[d.stage]?.prob ?? 0.3;
        totalPipeline += d.amount;
        weightedExpected += d.amount * weight;
        if (d.stage === 'won' || d.stage === 'negotiation') {
          committedWorstCase += d.amount;
        }
      });

      return {
        totalPipeline: Math.round(totalPipeline),
        weightedExpected: Math.round(weightedExpected),
        committedWorstCase: Math.round(committedWorstCase),
        dealCount: deals.length,
      };
    };

    const m1 = calculateMetrics(month1Deals);
    const m2 = calculateMetrics(month2Deals);
    const m3 = calculateMetrics(month3Deals);

    const chartData = [
      {
        month: 'Mes 1: Oct 2026',
        shortMonth: 'Octubre',
        committed: m1.committedWorstCase,
        weighted: m1.weightedExpected,
        bestCase: m1.totalPipeline,
        dealCount: m1.dealCount,
      },
      {
        month: 'Mes 2: Nov 2026',
        shortMonth: 'Noviembre',
        committed: m2.committedWorstCase,
        weighted: m2.weightedExpected,
        bestCase: m2.totalPipeline,
        dealCount: m2.dealCount,
      },
      {
        month: 'Mes 3: Dic 2026',
        shortMonth: 'Diciembre',
        committed: m3.committedWorstCase,
        weighted: m3.weightedExpected,
        bestCase: m3.totalPipeline,
        dealCount: m3.dealCount,
      },
    ];

    const totalQuarterWeighted = m1.weightedExpected + m2.weightedExpected + m3.weightedExpected;
    const totalQuarterBestCase = m1.totalPipeline + m2.totalPipeline + m3.totalPipeline;
    const totalQuarterCommitted = m1.committedWorstCase + m2.committedWorstCase + m3.committedWorstCase;

    return {
      chartData,
      totalQuarterWeighted,
      totalQuarterBestCase,
      totalQuarterCommitted,
      month1Deals,
      month2Deals,
      month3Deals,
      activeDealsCount: activeDeals.length,
    };
  }, [opportunities]);

  return (
    <div
      className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-xs transition-colors space-y-5"
      id="revenue-forecast-panel"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] dark:text-white">
                Proyección de Ingresos Trimestral (Revenue Forecast)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 font-mono">
                Próximos 3 Meses
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
              Ventas estimadas ponderando el valor de cada oportunidad según su probabilidad de etapa.
            </p>
          </div>
        </div>

        {/* View Scenario Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-900/60 border border-[var(--border-subtle)] text-xs">
          <button
            type="button"
            onClick={() => setSelectedScenario('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${ selectedScenario === 'all' ? 'bg-teal-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)]' }`}
          >
            Todos los Escenarios
          </button>
          <button
            type="button"
            onClick={() => setSelectedScenario('weighted')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${ selectedScenario === 'weighted' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)]' }`}
          >
            Ponderado (Esperado)
          </button>
          <button
            type="button"
            onClick={() => setSelectedScenario('committed')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${ selectedScenario === 'committed' ? 'bg-emerald-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)]' }`}
          >
            Comprometido
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Ponderado */}
        <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20">
          <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
            <span>Pronóstico Ponderado Q4</span>
            <ArrowUpRight size={14} />
          </div>
          <div className="text-xl font-extrabold text-blue-700 dark:text-blue-300 font-mono">
            $ {forecastData.totalQuarterWeighted.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
            Monto esperado según % de avance de cada negocio
          </div>
        </div>

        {/* Comprometido */}
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
            <span>Cierre Seguro / Comprometido</span>
            <ShieldCheck size={14} />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
            $ {forecastData.totalQuarterCommitted.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
            Etapas avanzadas (Negociación y Ganado)
          </div>
        </div>

        {/* Mejor Caso */}
        <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/50 dark:bg-slate-900/40">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold mb-1">
            <span>Pipeline Total (Best Case)</span>
            <Layers size={14} />
          </div>
          <div className="text-xl font-extrabold text-[var(--text-primary)] dark:text-white font-mono">
            $ {forecastData.totalQuarterBestCase.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
            {forecastData.activeDealsCount} oportunidades abiertas evaluadas
          </div>
        </div>
      </div>

      {/* Recharts Forecast Graph */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={forecastData.chartData}
            margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="weightedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="committedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />

            <XAxis
              dataKey="month"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-subtle)' }}
            />

            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 shadow-lg text-xs space-y-1.5 min-w-[200px]">
                    <div className="font-bold text-[var(--text-primary)] dark:text-white pb-1 border-b border-[var(--border-subtle)]">
                      {label}
                    </div>
                    {payload.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.name}:
                        </span>
                        <span className="font-mono font-bold text-[var(--text-primary)]">
                          $ {Number(entry.value).toLocaleString('es-AR')}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />

            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              iconType="circle"
              formatter={(value) => <span className="text-[var(--text-secondary)]">{value}</span>}
            />

            {(selectedScenario === 'all' || selectedScenario === 'committed') && (
              <Area
                type="monotone"
                dataKey="committed"
                name="Comprometido"
                stroke="#059669"
                fill="url(#committedGradient)"
                strokeWidth={2}
              />
            )}

            {(selectedScenario === 'all' || selectedScenario === 'weighted') && (
              <Area
                type="monotone"
                dataKey="weighted"
                name="Pronóstico Ponderado"
                stroke="#2563eb"
                fill="url(#weightedGradient)"
                strokeWidth={2.5}
              />
            )}

            {selectedScenario === 'all' && (
              <Line
                type="monotone"
                dataKey="bestCase"
                name="Pipeline Total (Best Case)"
                stroke="#d97706"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Detail breakdown footer */}
      <div className="p-3 rounded-xl bg-[var(--bg-muted)]/60 border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
        <div className="flex items-center gap-2">
          <HelpCircle size={14} className="text-teal-500" />
          <span>
            Ponderación por etapas: Contacto Inicial 15% · Calificado 35% · Demostración 50% · Propuesta 70% · Negociación 85% · Ganada 100%
          </span>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('opportunities')}
          className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer text-left shrink-0"
        >
          Ver Pipeline Kanban →
        </button>
      </div>
    </div>
  );
};
