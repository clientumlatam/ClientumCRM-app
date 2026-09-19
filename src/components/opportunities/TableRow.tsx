import React from 'react';
import { Building2, CheckSquare, Sparkles, Square, Trash2 } from 'lucide-react';
import { Opportunity, StageId } from '../../types';
import { STAGES } from '../../data/initialData';

export interface TableRowProps {
  opp: Opportunity;
  isSelected: boolean;
  onToggleSelect: (id: string, e: React.MouseEvent) => void;
  onSelectRecord: (id: string) => void;
  onMoveStage: (id: string, stage: StageId) => void;
  onDelete: (id: string, name: string) => void;
  onOpenAICopilot: (opp: Opportunity) => void;
  getPriorityBadge: (priority: string) => string;
}

export const TableRow: React.FC<TableRowProps> = React.memo(({
  opp,
  isSelected,
  onToggleSelect,
  onSelectRecord,
  onMoveStage,
  onDelete,
  onOpenAICopilot,
  getPriorityBadge,
}) => {
  const stageConf = STAGES.find((s) => s.id === opp.stage);

  return (
    <tr
      id={`table-row-${opp.id}`}
      onClick={() => onSelectRecord(opp.id)}
      className={`hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#141822] cursor-pointer transition-colors group ${ isSelected ? 'bg-blue-950/20' : '' }`}
    >
      {/* Checkbox */}
      <td className="px-3 py-2.5">
        <button
          onClick={(e) => onToggleSelect(opp.id, e)}
          className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 p-0.5"
        >
          {isSelected ? (
            <CheckSquare className="w-4 h-4 text-blue-400" />
          ) : (
            <Square className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 group-hover:text-[var(--text-muted,#64748b)] dark:group-hover:text-slate-400" />
          )}
        </button>
      </td>

      {/* Deal Name */}
      <td className="px-3 py-2.5 font-medium text-[var(--text-primary,#0f172a)] dark:text-slate-100 group-hover:text-blue-400 transition-colors">
        <div className="font-semibold text-xs text-[var(--text-primary,#0f172a)] dark:text-white truncate max-w-xs">{opp.name}</div>
        {opp.tags.length > 0 && (
          <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 truncate mt-0.5">
            {opp.tags.join(', ')}
          </div>
        )}
      </td>

      {/* Amount */}
      <td className="px-3 py-2.5 font-mono font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-100 whitespace-nowrap">
        ${opp.amount.toLocaleString()}
      </td>

      {/* Stage Dropdown */}
      <td className="px-3 py-2.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <select
          value={opp.stage}
          onChange={(e) => onMoveStage(opp.id, e.target.value as StageId)}
          className="bg-[var(--bg-card,#ffffff)] dark:bg-[#1a1f2b] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs px-2 py-1 rounded-md border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] hover:border-blue-500/50 cursor-pointer focus:outline-none"
          style={{ borderLeftColor: stageConf?.color, borderLeftWidth: '3px' }}
        >
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.probability}%)
            </option>
          ))}
        </select>
      </td>

      {/* Company */}
      <td className="px-3 py-2.5 text-[var(--text-secondary,#475569)] dark:text-slate-300 hidden sm:table-cell truncate max-w-[140px]">
        {opp.companyName ? (
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400 shrink-0" />
            <span className="truncate">{opp.companyName}</span>
          </span>
        ) : (
          <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">—</span>
        )}
      </td>

      {/* Priority */}
      <td className="px-3 py-2.5 hidden md:table-cell">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getPriorityBadge(opp.priority)}`}>
          {opp.priority}
        </span>
      </td>

      {/* Close Date */}
      <td className="px-3 py-2.5 font-mono text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 hidden lg:table-cell whitespace-nowrap">
        {opp.closeDate}
      </td>

      {/* Owner */}
      <td className="px-3 py-2.5 text-[var(--text-secondary,#475569)] dark:text-slate-300 hidden xl:table-cell whitespace-nowrap">
        <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{opp.assignedTo}</span>
      </td>

      {/* Actions */}
      <td className="px-3 py-2.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button
            id={`table-ai-btn-${opp.id}`}
            onClick={() => onOpenAICopilot(opp)}
            className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
            title="AI Deal Brief"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            id={`table-delete-btn-${opp.id}`}
            onClick={() => onDelete(opp.id, opp.name)}
            className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
});

TableRow.displayName = 'TableRow';
