import React, { useState, useCallback } from 'react';
import {
  ArrowUpDown,
  Building2,
  Trash2,
  Edit2,
  MoreHorizontal,
  Sparkles,
  CheckSquare,
  Square,
  DollarSign,
  ChevronDown,
  Download,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { STAGES } from '../../data/initialData';
import { Opportunity, StageId } from '../../types';
import { exportOpportunitiesToCSV } from '../../utils/csvExporter';
import { TableRow } from './TableRow';
import tableEmptyStateImg from '../../assets/images/table_empty_state_1789360585677.jpg';

type SortField = 'name' | 'amount' | 'stage' | 'probability' | 'companyName' | 'closeDate' | 'priority' | 'assignedTo';

export const TableView: React.FC = () => {
  const {
    opportunities,
    updateOpportunity,
    deleteOpportunity,
    moveOpportunityStage,
    setSelectedRecord,
    openAICopilot,
    filterState,
    t,
    language,
    showToast,
  } = useCRM();

  const [sortField, setSortField] = useState<SortField>('amount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter opportunities
  const filtered = opportunities.filter((opp) => {
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchName = opp.name.toLowerCase().includes(q);
      const matchCompany = (opp.companyName || '').toLowerCase().includes(q);
      const matchContact = (opp.contactName || '').toLowerCase().includes(q);
      const matchOwner = opp.assignedTo.toLowerCase().includes(q);
      if (!matchName && !matchCompany && !matchContact && !matchOwner) {
        return false;
      }
    }
    if (filterState.stage && filterState.stage !== 'all' && opp.stage !== filterState.stage) {
      return false;
    }
    if (filterState.owner && filterState.owner !== 'all' && opp.assignedTo !== filterState.owner) {
      return false;
    }
    if (filterState.priority && filterState.priority !== 'all' && opp.priority !== filterState.priority) {
      return false;
    }
    return true;
  });

  // Sort opportunities
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';

    if (sortField === 'amount' || sortField === 'probability') {
      return sortDirection === 'asc' ? (a[sortField] || 0) - (b[sortField] || 0) : (b[sortField] || 0) - (a[sortField] || 0);
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === sorted.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sorted.map((o) => o.id));
    }
  };

  const toggleSelectRow = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const handleSelectRecord = useCallback((id: string) => {
    setSelectedRecord({ type: 'opportunity', id });
  }, [setSelectedRecord]);

  const handleMoveStage = useCallback((id: string, stage: StageId) => {
    moveOpportunityStage(id, stage);
  }, [moveOpportunityStage]);

  const handleDeleteOpportunity = useCallback((id: string, name: string) => {
    if (confirm(`Delete "${name}"?`)) {
      deleteOpportunity(id);
    }
  }, [deleteOpportunity]);

  const handleOpenAICopilot = useCallback((opp: Opportunity) => {
    openAICopilot({
      type: 'deal',
      id: opp.id,
      name: opp.name,
      initialPrompt: language === 'es'
        ? `Proporciona un informe ejecutivo y pronóstico de probabilidad para "${opp.name}".`
        : language === 'pt'
        ? `Forneça um relatório executivo e previsão de probabilidade para "${opp.name}".`
        : `Provide an executive brief and probability forecast for "${opp.name}".`,
    });
  }, [language, openAICopilot]);

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} selected deal(s)?`)) {
      selectedIds.forEach((id) => deleteOpportunity(id));
      setSelectedIds([]);
      showToast(`Deleted ${selectedIds.length} deal(s)`, 'info');
    }
  };

  const handleBulkStageChange = (stage: StageId) => {
    selectedIds.forEach((id) => moveOpportunityStage(id, stage));
    setSelectedIds([]);
    showToast(`Updated stage for ${selectedIds.length} deals`, 'success');
  };

  const getPriorityBadge = useCallback((priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'High':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Medium':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-[var(--text-muted,#64748b)] dark:text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  }, []);

  return (
    <div id="clientum-table-container" className="flex-1 flex flex-col bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] overflow-hidden">
      {/* Table Toolbar / Export Header */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c] border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] px-4 py-2 flex items-center justify-between text-xs">
        <div className="text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
          Mostrando <strong className="text-[var(--text-primary,#0f172a)] dark:text-slate-200">{sorted.length}</strong> de <strong className="text-[var(--text-primary,#0f172a)] dark:text-slate-200">{opportunities.length}</strong> negocios
        </div>
        <button
          id="table-export-csv-btn"
          onClick={() => exportOpportunitiesToCSV(sorted, 'ClientumCRM_Pipeline_Tabla')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer shadow-2xs"
          title="Exportar todos los tratos visibles en la tabla a un archivo CSV"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Bulk Action Bar when items selected */}
      {selectedIds.length > 0 && (
        <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] border-b border-blue-500/30 px-4 py-2 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--text-primary,#0f172a)] dark:text-slate-200">
            <span className="font-semibold text-blue-400">{selectedIds.length}</span> {t('selected')}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[11px]">{t('stage')}:</span>
              <select
                id="bulk-stage-select"
                onChange={(e) => handleBulkStageChange(e.target.value as StageId)}
                defaultValue=""
                className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs px-2 py-1 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#283044] focus:outline-none"
              >
                <option value="" disabled>
                  {t('stage')}...
                </option>
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {t(`stage_${s.id}` as any) || s.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              id="bulk-delete-btn"
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              {t('delete')}
            </button>
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead className="bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c] text-[var(--text-muted,#64748b)] dark:text-slate-400 sticky top-0 z-10 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
            <tr>
              <th className="w-10 px-3 py-2.5">
                <button
                  onClick={toggleSelectAll}
                  className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 p-0.5"
                  title="Select all"
                >
                  {selectedIds.length === sorted.length && sorted.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>

              <th
                className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>{t('dealName')}</span>
                  <ArrowUpDown className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                </div>
              </th>

              <th
                className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-1.5">
                  <span>{t('amount')}</span>
                  <ArrowUpDown className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                </div>
              </th>

              <th
                className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors"
                onClick={() => handleSort('stage')}
              >
                <div className="flex items-center gap-1.5">
                  <span>{t('stage')}</span>
                  <ArrowUpDown className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                </div>
              </th>

              <th
                className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors hidden sm:table-cell"
                onClick={() => handleSort('companyName')}
              >
                <div className="flex items-center gap-1.5">
                  <span>{t('company')}</span>
                  <ArrowUpDown className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                </div>
              </th>

              <th
                className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors hidden md:table-cell"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center gap-1.5">
                  <span>{t('priority')}</span>
                  <ArrowUpDown className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                </div>
              </th>

              <th
                className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors hidden lg:table-cell"
                onClick={() => handleSort('closeDate')}
              >
                <div className="flex items-center gap-1.5">
                  <span>{t('closeDate')}</span>
                  <ArrowUpDown className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                </div>
              </th>

              <th
                className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors hidden xl:table-cell"
                onClick={() => handleSort('assignedTo')}
              >
                <div className="flex items-center gap-1.5">
                  <span>{t('owner')}</span>
                  <ArrowUpDown className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                </div>
              </th>

              <th className="w-16 px-3 py-2.5 text-right">{t('actions')}</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#191d28]">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 px-4 text-center">
                  <div className="max-w-md mx-auto flex flex-col items-center justify-center">
                    <div className="w-24 h-24 mb-4 rounded-2xl overflow-hidden border border-[var(--border-subtle,#e2e8f0)] dark:border-[#283044] bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] shadow-lg flex items-center justify-center shrink-0">
                      <img
                        src={tableEmptyStateImg}
                        alt="Sin resultados"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-200 mb-1">
                      No se encontraron negocios
                    </h3>
                    <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 max-w-xs leading-relaxed">
                      Ningún negocio coincide con los criterios de búsqueda o filtros seleccionados en este momento.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((opp) => (
                <TableRow
                  key={opp.id}
                  opp={opp}
                  isSelected={selectedIds.includes(opp.id)}
                  onToggleSelect={toggleSelectRow}
                  onSelectRecord={handleSelectRecord}
                  onMoveStage={handleMoveStage}
                  onDelete={handleDeleteOpportunity}
                  onOpenAICopilot={handleOpenAICopilot}
                  getPriorityBadge={getPriorityBadge}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
