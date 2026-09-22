import React, { useMemo, useState } from 'react';
import {
  Activity as ActivityIcon,
  ArrowUpRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  Inbox,
  Mail,
  MessageSquareText,
  NotebookPen,
  Phone,
  Plus,
  Search,
  StickyNote,
  Users,
  X,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Activity, Company, Opportunity, Person, Task } from '../../types';
import { EmailStatusTrackerPanel } from './EmailStatusTrackerPanel';

type ActivityFilter = 'all' | 'pending' | 'notes' | 'calls' | 'meetings' | 'emails';
type LinkedRecord = { type: 'opportunity' | 'company' | 'person'; id: string; name: string } | null;

type TimelineItem =
  | { kind: 'task'; data: Task; timestamp: string; target: LinkedRecord }
  | { kind: 'activity'; data: Activity; timestamp: string; target: LinkedRecord };

const formatDate = (value: string) => {
  const date = new Date(value.includes('T') ? value : `${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: value.includes('T') ? '2-digit' : undefined,
    minute: value.includes('T') ? '2-digit' : undefined,
  }).format(date);
};

const isToday = (value: string) => {
  const date = new Date(value.includes('T') ? value : `${value}T12:00:00`);
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
};

const getActivityIcon = (type: Activity['type']) => {
  if (type === 'call') return Phone;
  if (type === 'email') return Mail;
  if (type === 'meeting') return CalendarCheck2;
  if (type === 'note') return StickyNote;
  return ActivityIcon;
};

const getActivityColor = (type: Activity['type']) => {
  if (type === 'call') return 'text-amber-300 bg-amber-400/10 border-amber-400/20';
  if (type === 'email') return 'text-sky-300 bg-sky-400/10 border-sky-400/20';
  if (type === 'meeting') return 'text-violet-300 bg-violet-400/10 border-violet-400/20';
  if (type === 'note') return 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20';
  return 'text-[var(--text-secondary,#475569)] dark:text-slate-300 bg-slate-400/10 border-slate-400/20';
};

export const ActivityInboxView: React.FC = () => {
  const {
    activities,
    tasks,
    opportunities,
    companies,
    people,
    currentUser,
    setSelectedRecord,
    toggleTaskStatus,
    openNewRecordModal,
    addActivity,
    showToast,
  } = useCRM();
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('all');
  const [search, setSearch] = useState('');
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [logType, setLogType] = useState<Activity['type']>('note');
  const [logTarget, setLogTarget] = useState('');
  const [logText, setLogText] = useState('');

  const getTarget = (type: string | undefined, id: string | undefined): LinkedRecord => {
    if (!type || !id) return null;
    if (type === 'opportunity') {
      const record = opportunities.find((item) => item.id === id);
      return record ? { type, id, name: record.name } : null;
    }
    if (type === 'company') {
      const record = companies.find((item) => item.id === id);
      return record ? { type, id, name: record.name } : null;
    }
    const record = people.find((item) => item.id === id);
    return record ? { type: 'person', id, name: `${record.firstName} ${record.lastName}` } : null;
  };

  const items = useMemo<TimelineItem[]>(() => [
    ...tasks.map((task) => ({
      kind: 'task' as const,
      data: task,
      timestamp: task.dueDate,
      target: getTarget(task.targetType, task.targetId),
    })),
    ...activities.map((activity) => ({
      kind: 'activity' as const,
      data: activity,
      timestamp: activity.createdAt,
      target: getTarget(activity.targetType, activity.targetId),
    })),
  ].sort((a, b) => new Date(b.timestamp.includes('T') ? b.timestamp : `${b.timestamp}T12:00:00`).getTime()
    - new Date(a.timestamp.includes('T') ? a.timestamp : `${a.timestamp}T12:00:00`).getTime()), [
    activities,
    companies,
    opportunities,
    people,
    tasks,
  ]);

  const filteredItems = items.filter((item) => {
    const isPending = item.kind === 'task' && item.data.status !== 'Completed';
    const activityType = item.kind === 'activity' ? item.data.type : null;
    const matchesFilter = activeFilter === 'all'
      || (activeFilter === 'pending' && isPending)
      || (activeFilter === 'notes' && activityType === 'note')
      || (activeFilter === 'calls' && activityType === 'call')
      || (activeFilter === 'meetings' && activityType === 'meeting')
      || (activeFilter === 'emails' && activityType === 'email');
    if (!matchesFilter) return false;
    if (!search.trim()) return true;
    const haystack = [
      item.kind === 'task' ? item.data.title : item.data.title,
      item.kind === 'task' ? item.data.description : item.data.content,
      item.target?.name,
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(search.trim().toLowerCase());
  });

  const pendingTasks = tasks.filter((task) => task.status !== 'Completed');
  const dueToday = pendingTasks.filter((task) => isToday(task.dueDate)).length;
  const overdue = pendingTasks.filter((task) => {
    const date = new Date(`${task.dueDate}T23:59:59`);
    return date.getTime() < Date.now();
  }).length;

  const submitActivity = (event: React.FormEvent) => {
    event.preventDefault();
    const [targetType, targetId] = logTarget.split(':');
    if (!targetType || !targetId || !logText.trim()) {
      showToast('Selecciona un registro y escribe el detalle de la actividad.', 'warning');
      return;
    }
    const target = getTarget(targetType, targetId);
    addActivity({
      type: logType,
      title: logType === 'note' ? 'Nota registrada' : `${logType === 'call' ? 'Llamada' : logType === 'email' ? 'Correo' : 'Reunión'} registrada`,
      content: logText.trim(),
      author: currentUser.name,
      targetType: targetType as Activity['targetType'],
      targetId,
      meta: logType === 'email' ? { emailSubject: logText.trim().slice(0, 80) } : undefined,
    });
    setLogText('');
    setLogTarget('');
    setIsLogOpen(false);
    showToast(`Actividad vinculada a ${target?.name || 'el registro'}.`, 'success');
  };

  const openTarget = (item: TimelineItem) => {
    if (item.kind === 'task') {
      setSelectedRecord({ type: 'task', id: item.data.id });
      return;
    }
    setSelectedRecord({ type: item.data.targetType, id: item.data.targetId });
  };

  const filters: Array<{ id: ActivityFilter; label: string; count?: number }> = [
    { id: 'all', label: 'Todo', count: items.length },
    { id: 'pending', label: 'Pendientes', count: pendingTasks.length },
    { id: 'notes', label: 'Notas' },
    { id: 'calls', label: 'Llamadas' },
    { id: 'meetings', label: 'Reuniones' },
    { id: 'emails', label: 'Correos' },
  ];

  return (
    <div id="clientum-activity-inbox" className="flex-1 overflow-y-auto bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] p-5 text-[var(--text-primary,#0f172a)] dark:text-slate-200">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Inbox className="h-5 w-5 text-blue-400" />
              <h1 className="text-base font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Bandeja de actividad</h1>
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-300">CRM unificado</span>
            </div>
            <p className="max-w-2xl text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Un solo lugar para notas, llamadas, correos, reuniones y seguimientos vinculados a tus registros.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openNewRecordModal('task')} className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] bg-[var(--bg-card,#ffffff)] dark:bg-[#141923] px-3 py-2 text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-slate-200 transition-colors hover:border-blue-400/50 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">
              <Plus className="h-3.5 w-3.5 text-blue-400" /> Nueva tarea
            </button>
            <button onClick={() => setIsLogOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500">
              <NotebookPen className="h-3.5 w-3.5" /> Registrar actividad
            </button>
          </div>
        </header>

        <section className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#263047] bg-[var(--bg-card,#ffffff)] dark:bg-[#121722] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Pendientes</p>
            <p className="mt-1 text-2xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{pendingTasks.length}</p>
            <p className="mt-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Seguimientos abiertos</p>
          </div>
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">Para hoy</p>
            <p className="mt-1 text-2xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{dueToday}</p>
            <p className="mt-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Actividades que no pueden esperar</p>
          </div>
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-300">Vencidas</p>
            <p className="mt-1 text-2xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{overdue}</p>
            <p className="mt-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Requieren una acción</p>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <section className="min-w-0 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] p-3">
              <div className="flex items-center gap-1 overflow-x-auto">
                {filters.map((filter) => (
                  <button key={filter.id} onClick={() => setActiveFilter(filter.id)} className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${activeFilter === filter.id ? 'bg-blue-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1b2130] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200'}`}>
                    {filter.label}{filter.count !== undefined && <span className="ml-1 opacity-70">{filter.count}</span>}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar actividad" className="w-40 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c1018] py-1.5 pl-8 pr-2 text-[11px] text-[var(--text-primary,#0f172a)] dark:text-white outline-none placeholder:text-[var(--text-secondary)] focus:border-blue-500/60" />
              </div>
            </div>

            <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1e2330]">
              {filteredItems.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <Filter className="mx-auto h-8 w-8 text-[var(--text-secondary)]" />
                  <p className="mt-3 text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">No hay actividad que coincida</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">Prueba otro filtro o registra una nueva actividad.</p>
                </div>
              ) : filteredItems.map((item) => {
                const isTask = item.kind === 'task';
                const activity = isTask ? null : (item.data as any);
                const Icon = isTask ? CheckCircle2 : getActivityIcon(activity?.type);
                const color = isTask ? 'text-blue-300 bg-blue-400/10 border-blue-400/20' : getActivityColor(activity?.type);
                const isCompleted = isTask && item.data.status === 'Completed';

                return (
                  <article key={`${item.kind}-${item.data.id}`} className={`group flex gap-3 p-4 transition-colors hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151a25] ${isCompleted ? 'opacity-60' : ''}`}>
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${color}`}><Icon className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm font-semibold ${isCompleted ? 'text-[var(--text-muted,#64748b)] dark:text-slate-400 line-through' : 'text-white'}`}>{item.data.title}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
                            <Clock3 className="h-3 w-3" /> {formatDate(item.timestamp)}
                            <span>•</span>
                            <span>{isTask ? item.data.assignedTo : item.data.author}</span>
                          </div>
                        </div>
                        {item.target && (
                          <button onClick={() => openTarget(item)} className="flex max-w-[220px] items-center gap-1 rounded-md border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1119] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:border-blue-400/40 hover:text-blue-300">
                            <Users className="h-3 w-3 shrink-0" /> <span className="truncate">{item.target.name}</span> <ArrowUpRight className="h-3 w-3 shrink-0" />
                          </button>
                        )}
                      </div>
                      <p className="mt-2 max-w-3xl text-xs leading-relaxed text-[var(--text-muted,#64748b)] dark:text-slate-400">{isTask ? (item.data.description || 'Seguimiento pendiente') : item.data.content}</p>
                      <div className="mt-3 flex items-center gap-2">
                        {isTask ? (
                          <button onClick={() => toggleTaskStatus(item.data.id)} className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${isCompleted ? 'bg-emerald-400/10 text-emerald-300' : 'bg-blue-400/10 text-blue-300 hover:bg-blue-400/20'}`}>
                            <Check className="h-3 w-3" /> {isCompleted ? 'Completada' : 'Marcar como hecha'}
                          </button>
                        ) : (
                          <span className="rounded-md bg-[var(--bg-card,#ffffff)] dark:bg-[#1a2030] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{activity?.type === 'stage_change' ? 'Cambio de etapa' : activity?.type}</span>
                        )}
                        {item.target && <button onClick={() => openTarget(item)} className="flex items-center gap-1 px-1 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200">Ver registro <ChevronRight className="h-3 w-3" /></button>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="h-fit space-y-4">
            <EmailStatusTrackerPanel />

            <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c] p-4">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-violet-300" />
                <h2 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Qué aporta esta vista</h2>
              </div>
              <ul className="space-y-3 text-xs leading-relaxed text-[var(--text-muted,#64748b)] dark:text-slate-400">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> Une comunicaciones y tareas en una cronología accionable.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> Mantiene cada interacción vinculada a empresa, contacto o negocio.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> Permite filtrar pendientes, llamadas, reuniones, notas y correos.</li>
              </ul>
              <div className="mt-4 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Acciones rápidas</p>
                <button onClick={() => openNewRecordModal('task')} className="mt-2 flex w-full items-center justify-between rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] px-3 py-2 text-left text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:border-blue-400/40 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">Crear seguimiento <Plus className="h-3.5 w-3.5 text-blue-400" /></button>
                <button onClick={() => setIsLogOpen(true)} className="mt-2 flex w-full items-center justify-between rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] px-3 py-2 text-left text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:border-blue-400/40 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">Añadir nota o llamada <NotebookPen className="h-3.5 w-3.5 text-emerald-400" /></button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form onSubmit={submitActivity} className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2a3348] bg-[var(--bg-card,#ffffff)] dark:bg-[#111722] p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Registrar actividad</h2>
                <p className="mt-1 text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">La actividad quedará disponible en la línea de tiempo del registro.</p>
              </div>
              <button type="button" onClick={() => setIsLogOpen(false)} className="rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#202838] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">Tipo
                <select value={logType} onChange={(event) => setLogType(event.target.value as Activity['type'])} className="mt-1 w-full rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b1018] px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white outline-none">
                  <option value="note">Nota</option>
                  <option value="call">Llamada</option>
                  <option value="meeting">Reunión</option>
                  <option value="email">Correo</option>
                </select>
              </label>
              <label className="text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">Vincular a
                <select value={logTarget} onChange={(event) => setLogTarget(event.target.value)} className="mt-1 w-full rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b1018] px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white outline-none">
                  <option value="">Seleccionar registro…</option>
                  <optgroup label="Negocios">{opportunities.map((item: Opportunity) => <option key={item.id} value={`opportunity:${item.id}`}>{item.name}</option>)}</optgroup>
                  <optgroup label="Empresas">{companies.map((item: Company) => <option key={item.id} value={`company:${item.id}`}>{item.name}</option>)}</optgroup>
                  <optgroup label="Contactos">{people.map((item: Person) => <option key={item.id} value={`person:${item.id}`}>{item.firstName} {item.lastName}</option>)}</optgroup>
                </select>
              </label>
            </div>
            <label className="mt-3 block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">Detalle
              <textarea required value={logText} onChange={(event) => setLogText(event.target.value)} rows={4} placeholder="¿Qué ocurrió y cuál es el próximo paso?" className="mt-1 w-full resize-none rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b1018] px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white outline-none placeholder:text-[var(--text-secondary)] focus:border-blue-500/60" />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsLogOpen(false)} className="rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] px-3 py-2 text-xs font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">Cancelar</button>
              <button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500">Guardar actividad</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};