import React, { useState, useMemo } from 'react';
import {
  Activity as ActivityIcon,
  TrendingUp,
  Mail,
  Phone,
  Sparkles,
  MessageSquare,
  Calendar,
  Filter,
  Search,
  Download,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Activity, Opportunity, StageId } from '../../types';
import { STAGES } from '../../data/initialData';

interface DealActivityLogProps {
  deal: Opportunity;
  activities: Activity[];
  onAddNote?: (content: string) => void;
  className?: string;
}

export const DealActivityLog: React.FC<DealActivityLogProps> = ({
  deal,
  activities,
  onAddNote,
  className = '',
}) => {
  const [filterType, setFilterType] = useState<'all' | 'stage_change' | 'note' | 'call' | 'email' | 'meeting' | 'ai_insight'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter activities related to this deal
  const dealActivities = useMemo(() => {
    return activities
      .filter((a) => a.targetType === 'opportunity' && a.targetId === deal.id)
      .filter((a) => {
        if (filterType !== 'all' && a.type !== filterType) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (a.title || '').toLowerCase().includes(q);
          const matchContent = (a.content || '').toLowerCase().includes(q);
          const matchAuthor = (a.author || '').toLowerCase().includes(q);
          return matchTitle || matchContent || matchAuthor;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activities, deal.id, filterType, searchQuery]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'stage_change':
        return <TrendingUp className="w-3.5 h-3.5 text-blue-400" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-purple-400" />;
      case 'call':
        return <Phone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ai_insight':
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
      case 'meeting':
        return <Calendar className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getActivityBadgeColor = (type: Activity['type']) => {
    switch (type) {
      case 'stage_change':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'email':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'call':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ai_insight':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'meeting':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const exportLogCSV = () => {
    if (dealActivities.length === 0) return;
    const headers = ['ID', 'Fecha', 'Tipo', 'Título', 'Contenido', 'Autor', 'Trato ID', 'Trato Nombre'];
    const rows = dealActivities.map((a) => [
      `"${a.id}"`,
      `"${new Date(a.createdAt).toLocaleString()}"`,
      `"${a.type}"`,
      `"${(a.title || '').replace(/"/g, '""')}"`,
      `"${(a.content || '').replace(/"/g, '""')}"`,
      `"${a.author || ''}"`,
      `"${deal.id}"`,
      `"${(deal.name || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Audit_Log_Deal_${deal.id}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id={`deal-activity-log-${deal.id}`}
      className={`bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] p-4 space-y-3.5 text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <ActivityIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-1.5">
              <span>Log de Actividad y Auditoría</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                {dealActivities.length} eventos
              </span>
            </h4>
            <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
              Historial cronológico inmutable de cambios de estado, notas y ejecuciones de IA
            </p>
          </div>
        </div>

        <button
          onClick={exportLogCSV}
          disabled={dealActivities.length === 0}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1b2130] hover:bg-blue-600 hover:text-white text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] transition-all cursor-pointer disabled:opacity-40"
          title="Descargar registro de auditoría en formato CSV"
        >
          <Download className="w-3 h-3" />
          <span>Exportar Log</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
          <input
            type="text"
            placeholder="Buscar en el historial de eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0f121a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white pl-7 pr-3 py-1 rounded-md border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222838] focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'stage_change', label: 'Estados' },
              { id: 'note', label: 'Notas' },
              { id: 'call', label: 'Llamadas' },
              { id: 'email', label: 'Emails' },
              { id: 'ai_insight', label: 'IA' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors shrink-0 ${
                filterType === item.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#161a26] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event Stream */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {dealActivities.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-lg text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs">
            No se encontraron eventos en el historial de este trato para los filtros seleccionados.
          </div>
        ) : (
          dealActivities.map((act) => (
            <div
              key={act.id}
              className="p-3 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#151926] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202738] space-y-1.5 transition-all hover:border-blue-500/30"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`p-1 rounded-md border ${getActivityBadgeColor(act.type)}`}>
                    {getActivityIcon(act.type)}
                  </span>
                  <span className="font-semibold text-xs text-[var(--text-primary,#0f172a)] dark:text-white truncate">
                    {act.title}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(act.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-6">
                {act.content}
              </p>

              {act.meta && (
                <div className="pl-6 flex flex-wrap gap-2 text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 pt-0.5">
                  {act.meta.fromStage && act.meta.toStage && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                      {act.meta.fromStage} → {act.meta.toStage}
                    </span>
                  )}
                  {act.meta.durationMinutes && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                      Duración: {act.meta.durationMinutes} min
                    </span>
                  )}
                  {act.meta.emailSubject && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono truncate max-w-xs">
                      Asunto: {act.meta.emailSubject}
                    </span>
                  )}
                </div>
              )}

              <div className="pl-6 flex items-center justify-between text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 pt-1 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
                <span className="flex items-center gap-1">
                  <User className="w-2.5 h-2.5" />
                  <span>Registrado por <strong>{act.author || 'Sistema'}</strong></span>
                </span>
                <span className="flex items-center gap-1 text-emerald-500 font-medium">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>Auditado</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
