import React, { useMemo } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Plus, AlertCircle } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const CalendarView: React.FC = () => {
  const { tasks, openNewRecordModal, setSelectedRecord } = useCRM();

  const upcomingTasks = useMemo(
    () => [...tasks]
      .filter((task) => task.status !== 'Completed')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks],
  );

  const formatDate = (value: string) => {
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const isOverdue = (value: string) => {
    const dueDate = new Date(`${value}T23:59:59`);
    return dueDate.getTime() < Date.now();
  };

  return (
    <div id="clientum-calendar-view" className="flex-1 overflow-y-auto bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] p-5 text-[var(--text-primary,#0f172a)] dark:text-slate-200">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-400" />
              <h2 className="text-base font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Calendario comercial</h2>
            </div>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Agenda tus próximas actividades, seguimientos y reuniones.</p>
          </div>
          <button
            id="calendar-new-task-btn"
            onClick={() => openNewRecordModal('task')}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva actividad
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#263047] bg-[var(--bg-card,#ffffff)] dark:bg-[#121722] p-4">
            <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">Pendientes</p>
            <p className="mt-1 text-2xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{upcomingTasks.length}</p>
            <p className="mt-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Actividades por completar</p>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-rose-300">Vencidas</p>
            <p className="mt-1 text-2xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{upcomingTasks.filter((task) => isOverdue(task.dueDate)).length}</p>
            <p className="mt-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Requieren seguimiento</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-emerald-300">Completadas</p>
            <p className="mt-1 text-2xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{tasks.filter((task) => task.status === 'Completed').length}</p>
            <p className="mt-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Actividades cerradas</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c]">
          <div className="border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] px-4 py-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Próximas actividades</h3>
          </div>
          <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1e2330]">
            {upcomingTasks.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Agenda al día</p>
                <p className="mt-1 text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">No hay actividades pendientes.</p>
              </div>
            ) : upcomingTasks.map((task) => {
              const overdue = isOverdue(task.dueDate);
              return (
                <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                  {overdue ? (
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  ) : (
                    <Clock3 className="h-4 w-4 shrink-0 text-blue-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-slate-100">{task.title}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      {formatDate(task.dueDate)} · {task.assignedTo}
                    </p>
                  </div>
                  {task.targetName && task.targetId && task.targetType && (
                    <button
                      onClick={() => setSelectedRecord({ type: task.targetType!, id: task.targetId! })}
                      className="hidden max-w-48 truncate rounded-md border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2a3348] bg-[var(--bg-card,#ffffff)] dark:bg-[#191e2b] px-2 py-1 text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:border-blue-500 hover:text-blue-300 sm:block"
                    >
                      {task.targetName}
                    </button>
                  )}
                  <span className={`shrink-0 text-[10px] font-semibold ${overdue ? 'text-rose-300' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400'}`}>
                    {overdue ? 'Vencida' : task.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};