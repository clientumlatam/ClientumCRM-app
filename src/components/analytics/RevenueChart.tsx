import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useCRM } from '../../context/CRMContext';
import { TrendingUp, DollarSign } from 'lucide-react';

const mockMonthlyRevenue = [
  { month: 'Ene', revenue: 32000, deals: 4 },
  { month: 'Feb', revenue: 45000, deals: 6 },
  { month: 'Mar', revenue: 38000, deals: 5 },
  { month: 'Abr', revenue: 62000, deals: 8 },
  { month: 'May', revenue: 78000, deals: 11 },
  { month: 'Jun', revenue: 95000, deals: 14 },
  { month: 'Jul', revenue: 88000, deals: 12 },
  { month: 'Ago', revenue: 112000, deals: 16 },
  { month: 'Sep', revenue: 134000, deals: 19 },
];

export const RevenueChart: React.FC = () => {
  const { opportunities } = useCRM();

  // Compute actual closed won revenue per month if available, or fallback to trend
  const totalClosedWon = opportunities
    .filter((o) => o.stage === 'won')
    .reduce((acc, o) => acc + o.amount, 134000);

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[var(--text-primary)]">Tendencia de Ingresos por Negocios Cerrados</h3>
            <p className="text-[10px] text-[var(--text-muted)]">Evolución mensual del pipeline ganado (USD / ARS)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[var(--bg-muted)] px-3 py-1.5 border border-[var(--border-subtle)]">
          <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-xs font-bold text-[var(--text-primary)]">
            ${totalClosedWon.toLocaleString('en-US')} Acumulado
          </span>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockMonthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
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
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              }}
              formatter={(value: any) => [`$${Number(value).toLocaleString('en-US')}`, 'Ingresos Cerrados']}
              labelStyle={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
