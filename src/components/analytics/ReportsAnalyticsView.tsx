import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  TrendingUp,
  Target,
  Users,
  Calendar,
  Download,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Search,
  Plus,
  Bell,
  Sparkles,
  Layers,
  FileSpreadsheet,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  DollarSign,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { ClientumLogo } from '../common/ClientumLogo';

export interface SalesRepPerformance {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  avatarUrl?: string;
  role: string;
  leadsManaged: number;
  dealsClosed: number;
  winRate: number; // percentage
  totalValue: number;
  quotaAttainment: number;
}

export const ReportsAnalyticsView: React.FC<{
  onQuickCreate?: () => void;
  onNavigateTab?: (tabId: string) => void;
}> = ({ onQuickCreate, onNavigateTab }) => {
  const { opportunities, users, people, companies, showToast, openNewRecordModal } = useCRM();

  // Selected period state
  const [selectedPeriod, setSelectedPeriod] = useState<'Feb 2026' | 'Ene 2026' | 'Q1 2026' | 'Últimos 30 días'>('Feb 2026');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showAllRepsModal, setShowAllRepsModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeLegend, setActiveLegend] = useState<'all' | 'revenue' | 'target'>('all');

  // Multiplier or modifier based on selected period
  const periodMultiplier = useMemo(() => {
    switch (selectedPeriod) {
      case 'Ene 2026':
        return 0.94;
      case 'Q1 2026':
        return 1.45;
      case 'Últimos 30 días':
        return 1.02;
      case 'Feb 2026':
      default:
        return 1.0;
    }
  }, [selectedPeriod]);

  // Dynamic calculation for Top Metric Cards
  const metrics = useMemo(() => {
    const baseRevenue = Math.round(452000 * periodMultiplier);
    const wonTotal = opportunities
      .filter((o) => o.stage === 'won')
      .reduce((sum, o) => sum + o.amount, 0);

    const displayForecast = wonTotal > 100000 ? wonTotal : baseRevenue;

    return {
      revenueForecast: displayForecast,
      revenueGrowth: '+15%',
      salesVelocityDays: 18,
      salesVelocityChange: '2 days faster than last quarter',
      ltvCacRatio: '4.2x',
      ltvCacChange: '0.5x improvement from Q4',
    };
  }, [opportunities, periodMultiplier]);

  // Revenue vs Target Chart dataset (matching the bar chart in the mockup)
  const revenueChartData = useMemo(() => {
    return [
      {
        month: 'Sep',
        revenue: Math.round(82000 * periodMultiplier),
        target: Math.round(80000 * periodMultiplier),
        displayRevenue: `$${Math.round((82000 * periodMultiplier) / 1000)}k`,
        displayTarget: `$${Math.round((80000 * periodMultiplier) / 1000)}k`,
      },
      {
        month: 'Oct',
        revenue: Math.round(92000 * periodMultiplier),
        target: Math.round(88000 * periodMultiplier),
        displayRevenue: `$${Math.round((92000 * periodMultiplier) / 1000)}k`,
        displayTarget: `$${Math.round((88000 * periodMultiplier) / 1000)}k`,
      },
      {
        month: 'Nov',
        revenue: Math.round(102000 * periodMultiplier),
        target: Math.round(98000 * periodMultiplier),
        displayRevenue: `$${Math.round((102000 * periodMultiplier) / 1000)}k`,
        displayTarget: `$${Math.round((98000 * periodMultiplier) / 1000)}k`,
      },
      {
        month: 'Dec',
        revenue: Math.round(122000 * periodMultiplier),
        target: Math.round(112000 * periodMultiplier),
        displayRevenue: `$${Math.round((122000 * periodMultiplier) / 1000)}k`,
        displayTarget: `$${Math.round((112000 * periodMultiplier) / 1000)}k`,
      },
      {
        month: 'Jan',
        revenue: Math.round(135000 * periodMultiplier),
        target: Math.round(124000 * periodMultiplier),
        displayRevenue: `$${Math.round((135000 * periodMultiplier) / 1000)}k`,
        displayTarget: `$${Math.round((124000 * periodMultiplier) / 1000)}k`,
      },
      {
        month: 'Feb',
        revenue: Math.round(96000 * periodMultiplier),
        target: Math.round(130000 * periodMultiplier),
        displayRevenue: `$${Math.round((96000 * periodMultiplier) / 1000)}k`,
        displayTarget: `$${Math.round((130000 * periodMultiplier) / 1000)}k`,
      },
    ];
  }, [periodMultiplier]);

  // Sales Funnel Conversion Data (matching mockup percentages & progress bars)
  const funnelStages = useMemo(() => {
    return [
      {
        id: 'new_leads',
        name: 'New Leads',
        count: 145,
        percentage: 100,
        conversionRate: null,
      },
      {
        id: 'qualified',
        name: 'Qualified',
        count: 94,
        percentage: 65,
        conversionRate: '65% conversion',
      },
      {
        id: 'proposal',
        name: 'Proposal',
        count: 61,
        percentage: 42,
        conversionRate: '65% conversion',
      },
      {
        id: 'negotiation',
        name: 'Negotiation',
        count: 41,
        percentage: 28,
        conversionRate: '67% conversion',
      },
      {
        id: 'won',
        name: 'Won',
        count: 26,
        percentage: 18,
        conversionRate: '64% conversion',
      },
    ];
  }, []);

  // Team Performance Data (matching AJ - Alex Johnson and fellow Clientum team members)
  const salesTeam: SalesRepPerformance[] = useMemo(() => {
    return [
      {
        id: 'rep-1',
        name: 'Alex Johnson',
        initials: 'AJ',
        avatarColor: 'bg-blue-600',
        role: 'Senior Account Executive',
        leadsManaged: 45,
        dealsClosed: 12,
        winRate: 27,
        totalValue: 125000,
        quotaAttainment: 114,
      },
      {
        id: 'rep-2',
        name: 'Jonathan Ledantes',
        initials: 'JL',
        avatarColor: 'bg-indigo-600',
        role: 'Enterprise GTM Lead',
        leadsManaged: 52,
        dealsClosed: 16,
        winRate: 31,
        totalValue: 148500,
        quotaAttainment: 128,
      },
      {
        id: 'rep-3',
        name: 'María Corradi',
        initials: 'MC',
        avatarColor: 'bg-emerald-600',
        role: 'Mid-Market Sales Specialist',
        leadsManaged: 38,
        dealsClosed: 11,
        winRate: 29,
        totalValue: 98000,
        quotaAttainment: 102,
      },
      {
        id: 'rep-4',
        name: 'Santiago Gómez',
        initials: 'SG',
        avatarColor: 'bg-amber-600',
        role: 'SDR Outbound & Closer',
        leadsManaged: 41,
        dealsClosed: 9,
        winRate: 22,
        totalValue: 80500,
        quotaAttainment: 89,
      },
    ];
  }, []);

  // Download Report handler
  const handleDownloadReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Build CSV string
      const csvContent = [
        'Reporte Ejecutivo Clientum - Reports & Analytics',
        `Período: ${selectedPeriod}`,
        `Fecha de generación: ${new Date().toLocaleDateString('es-AR')}`,
        '',
        '--- METRICAS GENERALES ---',
        `Revenue Forecast: $${metrics.revenueForecast.toLocaleString()}`,
        `Sales Velocity: ${metrics.salesVelocityDays} Days`,
        `LTV / CAC Ratio: ${metrics.ltvCacRatio}`,
        '',
        '--- EVOLUCION REVENUE VS TARGET ---',
        'Mes,Revenue,Target',
        ...revenueChartData.map((d) => `${d.month},${d.revenue},${d.target}`),
        '',
        '--- EMBUDO DE CONVERSION (SALES FUNNEL) ---',
        'Etapa,Porcentaje,Tasa de Conversion',
        ...funnelStages.map((f) => `${f.name},${f.percentage}%,${f.conversionRate || 'Base 100%'}`),
        '',
        '--- RENDIMIENTO DEL EQUIPO (TEAM PERFORMANCE) ---',
        'Representante,Leads Gestionados,Negocios Cerrados,Win Rate,Total Facturado',
        ...salesTeam.map((r) => `${r.name},${r.leadsManaged},${r.dealsClosed},${r.winRate}%,$${r.totalValue.toLocaleString()}`),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Clientum_Reports_Analytics_${selectedPeriod.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      showToast('Reporte exportado exitosamente en formato CSV.', 'success');
    }, 600);
  };

  return (
    <div
      id="reports-and-analytics-dashboard"
      className="flex-1 w-full bg-[#F5F7FA] dark:bg-[#0B1120] text-[#212121] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 font-['Inter',sans-serif] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ========================================================
            1. TOP HEADER: Title, Subtitle, Date & Download CTA
           ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#022046] dark:text-white">
              Reports & Analytics
            </h1>
            <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 font-normal">
              Deep dive into your sales performance and team metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Period selector dropdown */}
            <div className="relative">
              <button
                type="button"
                id="analytics-period-selector-btn"
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-xs hover:border-[var(--border-default)] dark:border-[var(--border-subtle,#e2e8f0)] dark:hover:border-slate-700 text-xs font-semibold text-[var(--text-secondary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                <span>{selectedPeriod}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
              </button>

              {showPeriodDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {(['Feb 2026', 'Ene 2026', 'Q1 2026', 'Últimos 30 días'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(period);
                        setShowPeriodDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800 transition-colors cursor-pointer ${ selectedPeriod === period ? 'text-[#0056B3] dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30' : 'text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300' }`}
                    >
                      <span>{period}</span>
                      {selectedPeriod === period && <Check className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Download Report Button (Clientum Action Blue) */}
            <button
              type="button"
              id="download-analytics-report-btn"
              onClick={handleDownloadReport}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0056B3] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] active:bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#00387b] text-white text-xs font-semibold flex items-center gap-2 shadow-xs shadow-blue-900/10 hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'Generando...' : 'Download Report'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            2. TOP STATS CARDS: Revenue Forecast, Sales Velocity, LTV/CAC
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {/* Card 1: Revenue Forecast */}
          <div className="bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-[#0056B3] dark:text-blue-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                Revenue Forecast
              </span>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-extrabold tracking-tight text-[#022046] dark:text-white font-['Inter',sans-serif]">
                ${metrics.revenueForecast.toLocaleString()}
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#4CAF50] dark:text-emerald-400 font-medium">
                <ArrowUpRight className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span>{metrics.revenueGrowth} expected growth next month</span>
              </div>
            </div>
          </div>

          {/* Card 2: Sales Velocity */}
          <div className="bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-[#4CAF50] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                Sales Velocity
              </span>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-extrabold tracking-tight text-[#022046] dark:text-white font-['Inter',sans-serif]">
                {metrics.salesVelocityDays} Days
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#4CAF50] dark:text-emerald-400 font-medium">
                <ArrowDownRight className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span>{metrics.salesVelocityChange}</span>
              </div>
            </div>
          </div>

          {/* Card 3: LTV / CAC Ratio */}
          <div className="bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                LTV / CAC Ratio
              </span>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-extrabold tracking-tight text-[#022046] dark:text-white font-['Inter',sans-serif]">
                {metrics.ltvCacRatio}
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#4CAF50] dark:text-emerald-400 font-medium">
                <ArrowUpRight className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span>{metrics.ltvCacChange}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. MIDDLE SECTION: Revenue vs Target & Sales Funnel Conversion
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 3.A: Revenue vs Target (Recharts BarChart & Target Dashed Line) */}
          <div className="bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#022046] dark:text-white">
                Revenue vs Target
              </h3>

              {/* Legend with matching mockup styling */}
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium">
                <button
                  type="button"
                  onClick={() => setActiveLegend(activeLegend === 'revenue' ? 'all' : 'revenue')}
                  className="flex items-center gap-1.5 hover:text-[var(--text-primary)] dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0056B3] dark:bg-blue-500" />
                  <span>Revenue</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLegend(activeLegend === 'target' ? 'all' : 'target')}
                  className="flex items-center gap-1.5 hover:text-[var(--text-primary)] dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span>Target</span>
                </button>
              </div>
            </div>

            {/* Recharts Bar and Target Line Graph */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                  <XAxis
                    dataKey="month"
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                    dy={8}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    ticks={[0, 35000, 70000, 105000, 140000]}
                    tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0, 86, 179, 0.04)' }}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                      fontSize: '12px',
                      padding: '10px 14px',
                      color: '#022046',
                    }}
                    formatter={(value: any, name?: any) => {
                      const num = Number(value);
                      const label = name === 'revenue' ? 'Revenue Facturado' : 'Target Presupuestado';
                      return [`$${num.toLocaleString()}`, label];
                    }}
                    labelFormatter={(label) => `Mes: ${label} 2025/2026`}
                  />

                  {/* Blue Revenue Bar (Clientum Action Blue) */}
                  {(activeLegend === 'all' || activeLegend === 'revenue') && (
                    <Bar
                      dataKey="revenue"
                      name="revenue"
                      fill="#0056B3"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={38}
                    />
                  )}

                  {/* Target Dashed Line */}
                  {(activeLegend === 'all' || activeLegend === 'target') && (
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="target"
                      stroke="#94A3B8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: '#94A3B8', stroke: '#ffffff', strokeWidth: 1.5 }}
                      activeDot={{ r: 5, fill: '#0056B3', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3.B: Sales Funnel Conversion (Horizontal Proportional Bars with Conversion Badges) */}
          <div className="bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <h3 className="text-base font-bold text-[#022046] dark:text-white">
              Sales Funnel Conversion
            </h3>

            <div className="space-y-4 pt-1">
              {funnelStages.map((stage) => (
                <div key={stage.id} className="space-y-1.5">
                  {/* Label, Conversion Pill & Percentage */}
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">
                      {stage.name}
                    </span>

                    <div className="flex items-center gap-2">
                      {stage.conversionRate && (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          {stage.conversionRate}
                        </span>
                      )}
                      <span className="text-[var(--text-primary)] dark:text-white font-bold font-mono">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Funnel Progress Bar with Action Blue */}
                  <div className="w-full h-3 rounded-full bg-[var(--bg-muted)] dark:bg-slate-800 overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0056B3] dark:bg-blue-600 transition-all duration-700 ease-out"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footnote matching Clientum verbal identity */}
            <div className="pt-2 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 flex items-center justify-between">
              <span>Embudo sincronizado con el Pipeline de Negocios</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">18% Tasa Global de Cierre</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            4. BOTTOM CARD: Team Performance Table
           ======================================================== */}
        <div className="bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#022046] dark:text-white">
              Team Performance
            </h3>

            <button
              type="button"
              onClick={() => setShowAllRepsModal(true)}
              className="text-xs font-semibold text-[#0056B3] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Sales Reps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 text-[10px] font-bold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">REPRESENTATIVE</th>
                  <th className="pb-3 font-semibold text-center">LEADS MANAGED</th>
                  <th className="pb-3 font-semibold text-center">DEALS CLOSED</th>
                  <th className="pb-3 font-semibold">WIN RATE</th>
                  <th className="pb-3 font-semibold text-right">TOTAL VALUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] dark:divide-slate-800/60 font-medium">
                {salesTeam.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[var(--bg-muted)]/70 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Representative Column: Avatar initials + Full Name */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${rep.avatarColor} text-[var(--text-primary,#0f172a)] dark:text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}>
                          {rep.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--text-primary)] dark:text-white">
                            {rep.name}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-normal">
                            {rep.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Leads Managed */}
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">
                      {rep.leadsManaged}
                    </td>

                    {/* Deals Closed */}
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">
                      {rep.dealsClosed}
                    </td>

                    {/* Win Rate with mini progress bar */}
                    <td className="py-3.5 px-4 w-44">
                      <div className="space-y-1">
                        <div className="font-bold text-[var(--text-primary)] dark:text-white">
                          {rep.winRate}%
                        </div>
                        <div className="w-24 h-1.5 rounded-full bg-[var(--bg-muted)] dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0056B3] dark:bg-blue-600"
                            style={{ width: `${Math.min(rep.winRate * 2.5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Total Value */}
                    <td className="py-3.5 pl-4 text-right font-mono font-bold text-[var(--text-primary)] dark:text-white">
                      ${rep.totalValue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: View All Sales Reps Detail & Commission Breakdown */}
        {showAllRepsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-2xl rounded-2xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 p-6 shadow-2xl text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0056B3] dark:text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#022046] dark:text-white">
                      Detalle Completo del Equipo de Ventas
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      Rendimiento individual, cuota asignada y tasa de conversión
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllRepsModal(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-secondary)] dark:hover:text-white hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {salesTeam.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3.5 rounded-xl border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 bg-[var(--bg-muted)]/50 dark:bg-slate-800/40 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${rep.avatarColor} text-[var(--text-primary,#0f172a)] dark:text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0`}>
                        {rep.initials}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                          {rep.name}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                          {rep.role} · {rep.leadsManaged} leads atendidos
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold font-mono text-[#0056B3] dark:text-blue-400">
                        ${rep.totalValue.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {rep.quotaAttainment}% de cuota alcanzada
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowAllRepsModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800 hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-xs font-semibold text-[var(--text-secondary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
