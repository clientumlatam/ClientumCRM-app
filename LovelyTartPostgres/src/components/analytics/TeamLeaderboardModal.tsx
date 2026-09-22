import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  X,
  ChevronUp,
  CheckCircle2,
  Sliders,
  Sparkles,
  Flame,
  Percent,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { User } from '../../types';

interface TeamLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamLeaderboardModal: React.FC<TeamLeaderboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { users, opportunities, showToast } = useCRM();

  // Quota config state (default $25,000 USD per sales rep)
  const [defaultQuota, setDefaultQuota] = useState<number>(25000);
  const [commissionRate, setCommissionRate] = useState<number>(5); // 5% commission
  const [isEditingQuota, setIsEditingQuota] = useState(false);

  // Rep Leaderboard stats
  const repStats = users.map((u) => {
    const userOpps = opportunities.filter((o) => o.assignedTo === u.name);
    const userWon = userOpps.filter((o) => o.stage === 'won');
    const userLost = userOpps.filter((o) => o.stage === 'lost');
    const userActive = userOpps.filter((o) => o.stage !== 'won' && o.stage !== 'lost');

    const wonTotal = userWon.reduce((s, o) => s + o.amount, 0);
    const activeTotal = userActive.reduce((s, o) => s + o.amount, 0);
    const closedCount = userWon.length + userLost.length;
    const winRate = closedCount > 0 ? Math.round((userWon.length / closedCount) * 100) : 0;
    const quotaPercent = defaultQuota > 0 ? Math.round((wonTotal / defaultQuota) * 100) : 0;
    const estimatedCommission = Math.round(wonTotal * (commissionRate / 100));

    return {
      user: u,
      dealsCount: userOpps.length,
      wonCount: userWon.length,
      wonTotal,
      activeTotal,
      winRate,
      quotaPercent,
      estimatedCommission,
    };
  }).sort((a, b) => b.wonTotal - a.wonTotal);

  const totalTeamWon = repStats.reduce((s, r) => s + r.wonTotal, 0);
  const totalTeamQuota = defaultQuota * users.length;
  const teamQuotaPercent = totalTeamQuota > 0 ? Math.round((totalTeamWon / totalTeamQuota) * 100) : 0;

  if (!isOpen) return null;

  return (
    <div
      id="team-leaderboard-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-card)]/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Trophy className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>Ranking de Vendedores & Metas Mensuales</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
                  Mes en Curso
                </span>
              </h3>
              <p className="text-xs text-amber-100/80">
                Seguimiento de cuotas comerciales, comisiones y posiciones del equipo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-primary,#0f172a)]/80 dark:text-white/80 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card)]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Team Quota Progress Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Objetivo Global del Equipo
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-mono font-extrabold text-[var(--text-primary,#0f172a)] dark:text-white">
                    ${totalTeamWon.toLocaleString()} USD
                  </span>
                  <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    de ${totalTeamQuota.toLocaleString()} USD ({teamQuotaPercent}%)
                  </span>
                </div>
              </div>

              {/* Edit Quota Button */}
              <button
                onClick={() => setIsEditingQuota(!isEditingQuota)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/80 hover:bg-slate-700 text-[var(--text-primary,#0f172a)] dark:text-slate-200 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-600 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Ajustar Metas & Comisiones</span>
              </button>
            </div>

            {/* Global Progress Bar */}
            <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-700"
                style={{ width: `${Math.min(100, teamQuotaPercent)}%` }}
              />
            </div>

            {/* Inline Quota Settings Drawer */}
            {isEditingQuota && (
              <div className="mt-4 pt-3 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in-50">
                <div>
                  <label className="block text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1">
                    Meta Individual por Vendedor (USD / Mes):
                  </label>
                  <input
                    type="number"
                    value={defaultQuota}
                    onChange={(e) => setDefaultQuota(Number(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-600 rounded-lg px-3 py-1.5 text-[var(--text-primary,#0f172a)] dark:text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1">
                    Porcentaje de Comisión por Cierre (%):
                  </label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-600 rounded-lg px-3 py-1.5 text-[var(--text-primary,#0f172a)] dark:text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Top 3 Podium Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {repStats.slice(0, 3).map((rep, idx) => {
              const medals = ['🥇 1er Puesto', '🥈 2do Puesto', '🥉 3er Puesto'];
              const borders = [
                'border-amber-300 bg-amber-50/50 shadow-xs',
                'border-[var(--border-default)] bg-[var(--bg-muted)]/50',
                'border-orange-200 bg-orange-50/30',
              ];

              return (
                <div
                  key={rep.user.id}
                  className={`p-3.5 rounded-xl border ${borders[idx]} flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold text-[var(--text-primary)]">
                      {medals[idx]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {rep.quotaPercent}% de meta
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 my-2">
                    <img
                      src={rep.user.avatar}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {rep.user.name}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {rep.wonCount} tratos ganados
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)]/80 flex items-baseline justify-between">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium">Facturado:</span>
                    <span className="font-mono font-extrabold text-emerald-600 text-sm">
                      ${rep.wonTotal.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Leaderboard Table */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-[var(--bg-muted)] border-b border-[var(--border-subtle)] flex items-center justify-between">
              <span className="font-bold text-xs text-[var(--text-primary)]">
                Tabla Completa de Posiciones
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">
                Actualizado en tiempo real desde el pipeline
              </span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-muted)]/50 border-b border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-secondary)]">
                  <th className="p-3">#</th>
                  <th className="p-3">Vendedor</th>
                  <th className="p-3 text-right">Ganado</th>
                  <th className="p-3 text-right">Pipeline Abierto</th>
                  <th className="p-3 text-center">Tasa Cierre</th>
                  <th className="p-3 text-center">% Meta</th>
                  <th className="p-3 text-right">Comisión Estimada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                {repStats.map((rep, idx) => (
                  <tr key={rep.user.id} className="hover:bg-[var(--bg-muted)]/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      #{idx + 1}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={rep.user.avatar}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-[var(--text-primary)]">{rep.user.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600">
                      ${rep.wonTotal.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-[var(--text-secondary)]">
                      ${rep.activeTotal.toLocaleString()}
                    </td>
                    <td className="p-3 text-center font-mono font-semibold text-blue-600">
                      {rep.winRate}%
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${ rep.quotaPercent >= 100 ? 'bg-emerald-100 text-emerald-800' : rep.quotaPercent >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)]' }`}
                      >
                        {rep.quotaPercent}%
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[var(--text-primary)]">
                      ${rep.estimatedCommission.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[var(--bg-muted)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span className="text-[11px]">
            Comisión calculada sobre el total de tratos cerrados (Won) en el CRM.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
