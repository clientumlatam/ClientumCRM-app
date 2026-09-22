import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Award,
  BarChart,
  Target,
  ArrowUpRight,
  Flame,
  LayoutDashboard,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { STAGES } from '../../data/initialData';
import { DailyGoalsWidget } from './DailyGoalsWidget';
import { ERPAccountingOverviewWidget } from './ERPAccountingOverviewWidget';
import { WebmailActivityWidget } from './WebmailActivityWidget';
import { MailAnalyticsPanel } from '../mail/MailAnalyticsPanel';
import { ReportsAnalyticsView } from './ReportsAnalyticsView';

export const AnalyticsView: React.FC = () => {
  const { opportunities, companies, people, users, t } = useCRM();
  const [activeSubTab, setActiveSubTab] = useState<'reports' | 'operations'>('reports');

  // Metrics calculations
  const totalDeals = opportunities.length;
  const wonDeals = opportunities.filter((o) => o.stage === 'won');
  const lostDeals = opportunities.filter((o) => o.stage === 'lost');
  const activeDeals = opportunities.filter((o) => o.stage !== 'won' && o.stage !== 'lost');

  const totalWonRevenue = wonDeals.reduce((sum, o) => sum + o.amount, 0);
  const totalPipelineValue = activeDeals.reduce((sum, o) => sum + o.amount, 0);
  const weightedPipeline = activeDeals.reduce((sum, o) => sum + o.amount * (o.probability / 100), 0);
  
  const closedDealsCount = wonDeals.length + lostDeals.length;
  const winRate = closedDealsCount > 0 ? Math.round((wonDeals.length / closedDealsCount) * 100) : 0;
  const avgDealSize = totalDeals > 0 ? Math.round(opportunities.reduce((s, o) => s + o.amount, 0) / totalDeals) : 0;

  // Rep leaderboard
  const repStats = users.map((u) => {
    const userOpps = opportunities.filter((o) => o.assignedTo === u.name);
    const userWon = userOpps.filter((o) => o.stage === 'won');
    const userActive = userOpps.filter((o) => o.stage !== 'won' && o.stage !== 'lost');
    const wonTotal = userWon.reduce((s, o) => s + o.amount, 0);
    const activeTotal = userActive.reduce((s, o) => s + o.amount, 0);
    return {
      user: u,
      dealsCount: userOpps.length,
      wonTotal,
      activeTotal,
    };
  }).sort((a, b) => b.wonTotal + b.activeTotal - (a.wonTotal + a.activeTotal));

  return (
    <div id="clientum-analytics-container" className="flex-1 flex flex-col h-full bg-[#F5F7FA] dark:bg-[#0B1120] overflow-y-auto select-none transition-colors duration-200">
      {/* Top Switcher Bar */}
      <div className="bg-[var(--bg-card)] dark:bg-slate-900 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="subtab-reports-analytics-btn"
            onClick={() => setActiveSubTab('reports')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${ activeSubTab === 'reports' ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0056B3] text-white shadow-xs' : 'text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800' }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Reports & Analytics</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeSubTab === 'reports' ? 'bg-[var(--bg-card)]/20 text-white' : 'bg-blue-100 dark:bg-blue-950 text-[#0056B3] dark:text-blue-400'}`}>
              Ventas
            </span>
          </button>

          <button
            type="button"
            id="subtab-operations-analytics-btn"
            onClick={() => setActiveSubTab('operations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${ activeSubTab === 'operations' ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0056B3] text-white shadow-xs' : 'text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800' }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Métricas Operativas & Correo</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
          <span>Clientum BI v1.0</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Sincronizado</span>
        </div>
      </div>

      {/* Main View Mode Render */}
      {activeSubTab === 'reports' ? (
        <ReportsAnalyticsView />
      ) : (
        <div id="clientum-operations-analytics-view" className="p-4 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] dark:text-white">{t('analyticsDashboard')}</h2>
              <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                {t('analyticsSubtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
                <span>5 Day Streak 🔥</span>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Pipeline Value */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
                <span className="text-xs font-medium">{t('totalPipelineValue')}</span>
                <DollarSign className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-[var(--text-primary)] dark:text-white">
                  ${totalPipelineValue.toLocaleString()}
                </div>
                <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{activeDeals.length} {t('dealCount')}</span>
                </div>
              </div>
            </div>

            {/* Weighted Forecast */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
                <span className="text-xs font-medium">{t('weightedPipeline')}</span>
                <Target className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-[var(--text-primary)] dark:text-white">
                  ${Math.round(weightedPipeline).toLocaleString()}
                </div>
                <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">
                  Probability adjusted ARR
                </div>
              </div>
            </div>

            {/* Closed Won Revenue */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
                <span className="text-xs font-medium">{t('closedWonRevenue')}</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ${totalWonRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                  {t('winRate')}: <strong>{winRate}%</strong> ({wonDeals.length} {t('dealCount')})
                </div>
              </div>
            </div>

            {/* Avg Deal Size */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
                <span className="text-xs font-medium">{t('averageDealSize')}</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-[var(--text-primary)] dark:text-white">
                  ${avgDealSize.toLocaleString()}
                </div>
                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
                  {totalDeals} {t('records')}
                </div>
              </div>
            </div>
          </div>

          {/* ERP ACCOUNTING OVERVIEW WIDGET */}
          <ERPAccountingOverviewWidget />

          {/* DAILY GOAL TRACKER COMPONENT */}
          <DailyGoalsWidget opportunities={opportunities} />

          {/* CLOUDFLARE WEBMAIL D1 & EMAIL TRAFFIC ANALYTICS */}
          <WebmailActivityWidget />

          {/* TRANSACTIONAL EMAIL PERFORMANCE & RECHARTS 30-DAY ANALYTICS */}
          <div>
            <MailAnalyticsPanel defaultTimeRange="30d" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Stage Distribution & Funnel Bar */}
            <div className="lg:col-span-2 p-4 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-xs">
              <h3 className="text-xs font-semibold text-[var(--text-primary)] dark:text-white mb-3 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-500" />
                Stage Distribution & Deal Velocity
              </h3>

              <div className="space-y-3">
                {STAGES.map((stage) => {
                  const stageOpps = opportunities.filter((o) => o.stage === stage.id);
                  const stageSum = stageOpps.reduce((acc, curr) => acc + curr.amount, 0);
                  const percentage =
                    totalPipelineValue > 0
                      ? Math.min(100, Math.round((stageSum / (totalPipelineValue + totalWonRevenue)) * 100))
                      : 0;

                  return (
                    <div key={stage.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                          <span className="text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium">{t(`stage_${stage.id}` as any) || stage.name}</span>
                          <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[11px]">({stageOpps.length} {t('dealCount')})</span>
                        </div>
                        <span className="font-mono text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 font-semibold">
                          ${stageSum.toLocaleString()}
                        </span>
                      </div>

                      <div className="h-2 w-full bg-[var(--bg-muted)] dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(percentage, stageOpps.length > 0 ? 5 : 0)}%`,
                            backgroundColor: stage.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rep Leaderboard */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-xs">
              <h3 className="text-xs font-semibold text-[var(--text-primary)] dark:text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Sales Rep Leaderboard
              </h3>

              <div className="space-y-3">
                {repStats.map((stat, idx) => (
                  <div
                    key={stat.user.id}
                    className="p-2.5 rounded-lg bg-[var(--bg-muted)] dark:bg-slate-800/60 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-5 font-mono text-xs font-bold text-[var(--text-muted,#64748b)] dark:text-slate-400 text-center">
                        #{idx + 1}
                      </div>
                      <img
                        src={stat.user.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[var(--text-primary)] dark:text-white truncate">
                          {stat.user.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 truncate">
                          {stat.dealsCount} deals managed
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ${Math.round(stat.wonTotal / 1000)}k won
                      </div>
                      <div className="text-[10px] font-mono text-[var(--text-muted,#64748b)] dark:text-slate-400">
                        ${Math.round(stat.activeTotal / 1000)}k active
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

