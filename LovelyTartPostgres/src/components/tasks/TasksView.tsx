import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Clock,
  Calendar,
  AlertTriangle,
  Plus,
  Trash2,
  Briefcase,
  Building2,
  Users2,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Task } from '../../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    toggleTaskStatus,
    deleteTask,
    openNewRecordModal,
    setSelectedRecord,
    filterState,
    t,
  } = useCRM();

  const [tabFilter, setTabFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const filteredTasks = tasks.filter((task) => {
    if (tabFilter === 'pending' && task.status === 'Completed') return false;
    if (tabFilter === 'completed' && task.status !== 'Completed') return false;

    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchTarget = (task.targetName || '').toLowerCase().includes(q);
      const matchOwner = (task.assignedTo || '').toLowerCase().includes(q);
      if (!matchTitle && !matchTarget && !matchOwner) return false;
    }
    return true;
  });

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Urgent':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'High':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Medium':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-[var(--text-muted,#64748b)] dark:text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'Completed') return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div id="clientum-tasks-view" className="flex-1 flex flex-col h-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] overflow-y-auto p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{t('tasks')}</h2>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
            {tasks.filter((t) => t.status !== 'Completed').length} {t('task_todo').toLowerCase()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub Tab Filter */}
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141822] p-0.5 rounded-md border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232838] flex items-center text-xs">
            <button
              id="tasks-pending-filter-btn"
              onClick={() => setTabFilter('pending')}
              className={`px-2.5 py-1 rounded transition-all ${ tabFilter === 'pending' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#202636] text-[var(--text-primary,#0f172a)] dark:text-white font-medium' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              {t('task_todo')} ({tasks.filter((t) => t.status !== 'Completed').length})
            </button>
            <button
              id="tasks-all-filter-btn"
              onClick={() => setTabFilter('all')}
              className={`px-2.5 py-1 rounded transition-all ${ tabFilter === 'all' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#202636] text-[var(--text-primary,#0f172a)] dark:text-white font-medium' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              {t('allTasks')} ({tasks.length})
            </button>
            <button
              id="tasks-completed-filter-btn"
              onClick={() => setTabFilter('completed')}
              className={`px-2.5 py-1 rounded transition-all ${ tabFilter === 'completed' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#202636] text-[var(--text-primary,#0f172a)] dark:text-white font-medium' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              {t('task_completed')} ({tasks.filter((t) => t.status === 'Completed').length})
            </button>
          </div>

          <button
            id="add-task-btn"
            onClick={() => openNewRecordModal('task')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('newTask')}
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2 max-w-4xl">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c]">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">All caught up!</h3>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">No tasks in this view.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'Completed';
            const overdue = isOverdue(task.dueDate, task.status);

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${ isDone ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10131a] border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a1f2c] opacity-60' : overdue ? 'bg-[var(--bg-card,#ffffff)] dark:bg-[#181418] border-rose-900/40 hover:border-rose-700/50' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#161a24] border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] border-[var(--border-subtle,#e2e8f0)] dark:hover:border-[#2d3548]' }`}
              >
                {/* Toggle Checkbox */}
                <button
                  id={`toggle-task-${task.id}`}
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-0.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-blue-400 p-0.5 shrink-0 transition-colors"
                >
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h4
                      className={`text-xs font-semibold ${ isDone ? 'line-through text-[var(--text-muted,#64748b)] dark:text-slate-400' : 'text-[var(--text-primary,#0f172a)] dark:text-slate-100' }`}
                    >
                      {task.title}
                    </h4>

                    <span className={`text-[10px] px-2 py-0.2 rounded-full border font-medium shrink-0 ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    <div className={`flex items-center gap-1 font-mono text-[11px] ${overdue ? 'text-rose-400 font-semibold' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400'}`}>
                      <Calendar className="w-3 h-3" />
                      <span>{task.dueDate}</span>
                      {overdue && <span className="text-[10px] uppercase font-bold">(Overdue)</span>}
                    </div>

                    {task.targetName && (
                      <button
                        onClick={() => {
                          if (task.targetType && task.targetId) {
                            setSelectedRecord({ type: task.targetType, id: task.targetId });
                          }
                        }}
                        className="flex items-center gap-1 text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-blue-400 bg-[var(--bg-card,#ffffff)] dark:bg-[#191e2b] px-2 py-0.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#272f44] transition-colors"
                      >
                        {task.targetType === 'opportunity' ? (
                          <Briefcase className="w-3 h-3 text-blue-400" />
                        ) : task.targetType === 'company' ? (
                          <Building2 className="w-3 h-3 text-purple-400" />
                        ) : (
                          <Users2 className="w-3 h-3 text-emerald-400" />
                        )}
                        <span className="truncate max-w-[180px]">{task.targetName}</span>
                      </button>
                    )}

                    <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      Assigned to <strong className="text-[var(--text-secondary,#475569)] dark:text-slate-300 font-normal">{task.assignedTo}</strong>
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  id={`delete-task-${task.id}`}
                  onClick={() => deleteTask(task.id)}
                  className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
