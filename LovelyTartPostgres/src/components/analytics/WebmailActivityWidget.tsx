import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Mail,
  Send,
  Inbox,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Database,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { INITIAL_WEBMAIL_D1_STATS } from '../../data/webmailInitialData';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#64748b'];

export const WebmailActivityWidget: React.FC = () => {
  const { webmailEmails } = useCRM();
  const [timeRange, setTimeRange] = useState<'30d' | '14d' | '7d'>('30d');

  // Compute live counts from current state
  const totalInboundLive = webmailEmails.filter((e) => e.direction === 'inbound').length;
  const totalOutboundLive = webmailEmails.filter((e) => e.direction === 'outbound').length;

  const stats = INITIAL_WEBMAIL_D1_STATS;

  // Filter daily volume based on selected time range (30, 14, or 7 days)
  const chartData = useMemo(() => {
    const allDays = stats.dailyVolume || [];
    let sliceCount = 30;
    if (timeRange === '14d') sliceCount = 14;
    if (timeRange === '7d') sliceCount = 7;
    return allDays.slice(-sliceCount);
  }, [stats.dailyVolume, timeRange]);

  const rangeInboundTotal = useMemo(() => chartData.reduce((acc, d) => acc + d.inbound, 0), [chartData]);
  const rangeOutboundTotal = useMemo(() => chartData.reduce((acc, d) => acc + d.outbound, 0), [chartData]);
  const rangeGrandTotal = rangeInboundTotal + rangeOutboundTotal;

  return (
    <div id="webmail-analytics-widget" className="rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] p-4 sm:p-5 mb-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
              Email Activity & Webmail D1 Analytics
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Cloudflare D1 Live
              </span>
            </h3>
            <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
              Tráfico de correos entrantes (Email Routing) vs salientes (Worker send_email) almacenados en D1 (30 días)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted,#64748b)] dark:text-slate-400 flex-wrap">
          {/* Time range selector */}
          <div className="flex items-center bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e14] p-0.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d2536]">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${ timeRange === '7d' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
            >
              7d
            </button>
            <button
              onClick={() => setTimeRange('14d')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${ timeRange === '14d' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
            >
              14d
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${ timeRange === '30d' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
            >
              30d (Tendencia)
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e14] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d2536]">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>DB: webmail-db</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e14] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d2536] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SPF / DKIM 100%</span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {/* Inbound */}
        <div className="p-3 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs mb-1">
            <span>Inbound (Recibidos)</span>
            <Inbox className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary,#0f172a)] dark:text-white">
            {stats.totalInbound + totalInboundLive}
          </div>
          <div className="text-[10px] text-blue-400 mt-0.5 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{rangeInboundTotal} en los últimos {timeRange === '30d' ? '30' : timeRange === '14d' ? '14' : '7'} días</span>
          </div>
        </div>

        {/* Outbound */}
        <div className="p-3 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs mb-1">
            <span>Outbound (send_email)</span>
            <Send className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary,#0f172a)] dark:text-white">
            {stats.totalOutbound + totalOutboundLive}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{rangeOutboundTotal} en los últimos {timeRange === '30d' ? '30' : timeRange === '14d' ? '14' : '7'} días</span>
          </div>
        </div>

        {/* Deliverability */}
        <div className="p-3 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs mb-1">
            <span>Tasa de Entrega</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary,#0f172a)] dark:text-white">
            {stats.deliverySuccessRate}%
          </div>
          <div className="text-[10px] text-purple-400 mt-0.5">Sin rebotes reportados (Worker)</div>
        </div>

        {/* Avg Response Time */}
        <div className="p-3 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs mb-1">
            <span>Tiempo de Respuesta</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary,#0f172a)] dark:text-white">
            {stats.averageResponseTimeMinutes} min
          </div>
          <div className="text-[10px] text-amber-400 mt-0.5">Promedio SLA Comercial HQ</div>
        </div>
      </div>

      {/* 2 Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Chart 1: Daily Volume (Inbound vs Outbound Trends over 30 days) */}
        <div className="p-4 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Tendencia de Tráfico: Inbound vs Outbound ({timeRange === '30d' ? '30 Días' : timeRange === '14d' ? '14 Días' : '7 Días'})</span>
            </h4>
            <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
              Total periodo: <strong>{rangeGrandTotal}</strong> msgs
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} interval={timeRange === '30d' ? 3 : 1} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161c28',
                    borderColor: '#26334d',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} correos`,
                    name === 'inbound' ? 'Inbound (Recibidos)' : 'Outbound (Enviados)',
                  ]}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Area
                  type="monotone"
                  dataKey="inbound"
                  name="Inbound (Entrantes D1)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#inboundGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="outbound"
                  name="Outbound (send_email)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#outboundGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hourly Distribution (Peak communication hours) */}
        <div className="p-4 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Distribución Horaria de Mensajes (08:00 a 18:00 ART)</span>
            </h4>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Picos de Actividad D1</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hourlyDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161c28',
                    borderColor: '#26334d',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="inbound" name="Inbound" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outbound" name="Outbound" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Domains & Spam Protection Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Top 5 Domains Breakdown */}
        <div className="md:col-span-2 p-3.5 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Dominios con Mayor Interacción Comercial (D1 Telemetry)</span>
            <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">Top Remitentes 30 Días</span>
          </div>

          <div className="space-y-2">
            {stats.topSenders.map((sender, idx) => (
              <div key={sender.domain} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    {sender.domain}
                  </span>
                  <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
                    {sender.count} msgs ({sender.pct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#182030] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${sender.pct}%`,
                      backgroundColor: COLORS[idx % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Spam Mitigation Summary */}
        <div className="p-3.5 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536] flex flex-col justify-between text-xs">
          <div>
            <div className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Protección y Filtro Cloudflare</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed">
              El Worker valida automáticamente firmas DKIM y registros SPF en el borde de Cloudflare antes de registrar en D1.
            </p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#182030] text-[11px] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">Spam / Phishing bloqueado:</span>
              <span className="text-rose-400 font-bold">{stats.spamBlocked} correos</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">Validación SPF/DKIM:</span>
              <span className="text-emerald-400 font-bold">100% PASS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">Binding de Salida:</span>
              <span className="text-blue-400 font-bold">send_email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
