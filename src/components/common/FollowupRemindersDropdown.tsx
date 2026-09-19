import React, { useState, useMemo } from 'react';
import {
  Bell,
  Clock,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Opportunity, Task } from '../../types';

interface FollowupRemindersDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp?: (opp: Opportunity) => void;
}

export const FollowupRemindersDropdown: React.FC<FollowupRemindersDropdownProps> = ({
  isOpen,
  onClose,
  onOpenWhatsApp,
}) => {
  const {
    opportunities,
    tasks,
    setSelectedRecord,
    toggleTaskStatus,
    openAICopilot,
    showToast,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'rotting' | 'tasks' | 'proposals'>('rotting');

  // 1. Calculate Rotting Deals (> 5 days inactive in active stage)
  const rottingDeals = useMemo(() => {
    const now = Date.now();
    const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;

    return opportunities
      .filter((opp) => opp.stage !== 'won' && opp.stage !== 'lost')
      .map((opp) => {
        const lastDate = new Date(opp.updatedAt || opp.createdAt).getTime();
        const diffMs = now - lastDate;
        const daysStagnant = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        return {
          opp,
          daysStagnant,
          isRotting: daysStagnant >= 5,
        };
      })
      .filter((item) => item.isRotting)
      .sort((a, b) => b.daysStagnant - a.daysStagnant);
  }, [opportunities]);

  // 2. Calculate Pending / Overdue Tasks
  const { overdueTasks, todayTasks } = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const pending = tasks.filter((t) => t.status !== 'Completed');

    const overdue = pending.filter((t) => t.dueDate < todayStr);
    const today = pending.filter((t) => t.dueDate.startsWith(todayStr));

    return { overdueTasks: overdue, todayTasks: today };
  }, [tasks]);

  // 3. Stagnant Proposals (Stage === 'proposal' or 'negotiation')
  const pendingProposals = useMemo(() => {
    return opportunities.filter(
      (opp) => opp.stage === 'proposal' || opp.stage === 'negotiation'
    );
  }, [opportunities]);

  const totalUrgentCount = rottingDeals.length + overdueTasks.length + todayTasks.length;

  if (!isOpen) return null;

  return (
    <div
      id="followup-reminders-modal"
      className="absolute right-0 top-full mt-2 z-50 w-96 max-w-[95vw] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Header */}
      <div className="bg-slate-900 text-[var(--text-primary,#0f172a)] dark:text-white p-3.5 flex items-center justify-between border-b border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs">
            <Bell className="w-4 h-4 text-[var(--text-primary,#0f172a)] dark:text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold flex items-center gap-1.5">
              <span>Centro de Seguimientos</span>
              {totalUrgentCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold">
                  {totalUrgentCount}
                </span>
              )}
            </h3>
            <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Recordatorios de ventas y tratos estancados</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/70 p-1 gap-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('rotting')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold transition-all cursor-pointer ${ activeTab === 'rotting' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xs border border-[var(--border-subtle)]/80' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]' }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Estancados</span>
          {rottingDeals.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {rottingDeals.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold transition-all cursor-pointer ${ activeTab === 'tasks' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xs border border-[var(--border-subtle)]/80' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]' }`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Tareas</span>
          {overdueTasks.length + todayTasks.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
              {overdueTasks.length + todayTasks.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('proposals')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold transition-all cursor-pointer ${ activeTab === 'proposals' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xs border border-[var(--border-subtle)]/80' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]' }`}
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          <span>Cotizaciones</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[var(--bg-muted)] text-[var(--text-secondary)] text-[10px] font-bold">
            {pendingProposals.length}
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="max-h-[380px] overflow-y-auto p-2 space-y-2">
        {/* Tab 1: Rotting Deals */}
        {activeTab === 'rotting' && (
          <>
            {rottingDeals.length === 0 ? (
              <div className="text-center py-8 px-4 text-[var(--text-muted)]">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-[var(--text-secondary)]">¡Pipeline al día!</p>
                <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                  No hay tratos estancados con más de 5 días sin contacto.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-[11px] text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    <strong>{rottingDeals.length} tratos</strong> llevan más de 5 días sin interacción. ¡Contáctalos hoy para no perderlos!
                  </span>
                </div>

                {rottingDeals.map(({ opp, daysStagnant }) => (
                  <div
                    key={opp.id}
                    className="p-3 rounded-xl border border-[var(--border-subtle)]/90 bg-[var(--bg-card)] hover:border-amber-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                            {opp.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {daysStagnant}d sin actividad
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
                          {opp.companyName || 'Sin empresa'} •{' '}
                          <span className="font-semibold text-[var(--text-secondary)]">
                            ${opp.amount.toLocaleString()} USD
                          </span>
                        </div>
                        {opp.contactName && (
                          <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                            Contacto: {opp.contactName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 mt-2.5 pt-2 border-t border-[var(--border-subtle)]">
                      {onOpenWhatsApp && (
                        <button
                          onClick={() => {
                            onOpenWhatsApp(opp);
                            onClose();
                          }}
                          className="px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Enviar WhatsApp de seguimiento"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          openAICopilot({
                            type: 'opportunity',
                            name: opp.name,
                            company: opp.companyName,
                            amount: opp.amount,
                            daysStagnant,
                          });
                          onClose();
                        }}
                        className="px-2 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Pedir a Copilot un borrador para reactivar el trato"
                      >
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        <span>Copilot</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedRecord({ type: 'opportunity', id: opp.id });
                          onClose();
                        }}
                        className="px-2 py-1 rounded-md text-[11px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] flex items-center gap-1 cursor-pointer transition-colors ml-auto"
                      >
                        <span>Abrir</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab 2: Pending Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-2">
            {overdueTasks.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Vencidas ({overdueTasks.length})</span>
                </div>
                <div className="space-y-1.5">
                  {overdueTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 flex items-start gap-2.5"
                    >
                      <button
                        onClick={() => {
                          toggleTaskStatus(task.id);
                          showToast('Tarea completada', 'success');
                        }}
                        className="w-4 h-4 mt-0.5 rounded border border-rose-400 hover:bg-rose-200 flex items-center justify-center shrink-0 cursor-pointer text-[var(--text-primary,#0f172a)] dark:text-white"
                        title="Marcar completada"
                      >
                        <Check className="w-3 h-3 text-rose-600" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          {task.title}
                        </div>
                        <div className="text-[10px] text-rose-600 font-medium">
                          Venció el: {task.dueDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {todayTasks.length > 0 && (
              <div className="mt-2">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Para Hoy ({todayTasks.length})</span>
                </div>
                <div className="space-y-1.5">
                  {todayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/40 flex items-start gap-2.5"
                    >
                      <button
                        onClick={() => {
                          toggleTaskStatus(task.id);
                          showToast('Tarea completada', 'success');
                        }}
                        className="w-4 h-4 mt-0.5 rounded border border-blue-400 hover:bg-blue-200 flex items-center justify-center shrink-0 cursor-pointer text-[var(--text-primary,#0f172a)] dark:text-white"
                        title="Marcar completada"
                      >
                        <Check className="w-3 h-3 text-blue-600" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          {task.title}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">Hoy • {task.priority}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {overdueTasks.length === 0 && todayTasks.length === 0 && (
              <div className="text-center py-8 px-4 text-[var(--text-muted)]">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-[var(--text-secondary)]">Sin tareas urgentes</p>
                <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                  ¡No tienes tareas vencidas ni pendientes para el día de hoy!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Proposals */}
        {activeTab === 'proposals' && (
          <div className="space-y-1.5">
            {pendingProposals.length === 0 ? (
              <div className="text-center py-8 px-4 text-[var(--text-muted)]">
                <Calendar className="w-8 h-8 text-[var(--text-muted,#64748b)] dark:text-slate-400 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-[var(--text-secondary)]">Sin cotizaciones activas</p>
                <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                  No hay tratos en etapa de propuesta o negociación.
                </p>
              </div>
            ) : (
              pendingProposals.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => {
                    setSelectedRecord({ type: 'opportunity', id: opp.id });
                    onClose();
                  }}
                  className="p-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-blue-300 bg-[var(--bg-card)] hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {opp.name}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {opp.companyName} • Etapa: <span className="font-semibold text-blue-600">{opp.stage}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
                      ${opp.amount.toLocaleString()} USD
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      {opp.probability}% prob
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[var(--bg-muted)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span className="text-[11px]">Clientum Sales Assistant</span>
        <button
          onClick={onClose}
          className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
