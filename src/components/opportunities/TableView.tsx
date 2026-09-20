import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  Sliders,
  Activity,
  X,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { STAGES } from '../../data/initialData';
import { Opportunity, StageId, TableColumnConfig } from '../../types';
import { exportOpportunitiesToCSV } from '../../utils/csvExporter';
import { TableRow } from './TableRow';
import { TableSettings, DEFAULT_OPPORTUNITY_COLUMNS } from '../common/TableSettings';
import { DealActivityLog } from './DealActivityLog';
import tableEmptyStateImg from '../../assets/images/table_empty_state_1789360585677.jpg';

type SortField = 'name' | 'amount' | 'stage' | 'probability' | 'companyName' | 'closeDate' | 'priority' | 'assignedTo' | 'contactName';

const STORAGE_COLUMNS_KEY = 'clientum_table_columns_config';

export const TableView: React.FC = () => {
  const {
    opportunities,
    activities,
    updateOpportunity,
    deleteOpportunity,
    moveOpportunityStage,
    setSelectedRecord,
    openAICopilot,
    filterState,
    t,
    language,
    showToast,
    currentUser,
    updateCurrentUser,
  } = useCRM();

  const [sortField, setSortField] = useState<SortField>('amount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [activeLogDeal, setActiveLogDeal] = useState<Opportunity | null>(null);

  // Load columns from currentUser preferences or localStorage or fallback default
  const [columns, setColumns] = useState<TableColumnConfig[]>(() => {
    try {
      const savedUserCols = currentUser?.preferences?.tableColumns?.opportunities;
      if (Array.isArray(savedUserCols) && savedUserCols.length > 0) {
        return savedUserCols;
      }
      const savedLocal = localStorage.getItem(STORAGE_COLUMNS_KEY);
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_OPPORTUNITY_COLUMNS;
  });

  // Save updated columns
  const handleSaveColumns = useCallback(
    (newColumns: TableColumnConfig[]) => {
      setColumns(newColumns);
      try {
        localStorage.setItem(STORAGE_COLUMNS_KEY, JSON.stringify(newColumns));
        if (currentUser) {
          const currentPrefs = currentUser.preferences || {};
          const currentTableCols = currentPrefs.tableColumns || {};
          updateCurrentUser({
            preferences: {
              ...currentPrefs,
              tableColumns: {
                ...currentTableCols,
                opportunities: newColumns,
              },
            },
          });
        }
      } catch (e) {
        console.error('Error saving column preferences:', e);
      }
      showToast('Configuración de columnas guardada con éxito.', 'success');
    },
    [currentUser, updateCurrentUser, showToast]
  );

  // Filter opportunities
  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
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
  }, [opportunities, filterState]);

  // Sort opportunities
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: any = (a as any)[sortField] || '';
      let bVal: any = (b as any)[sortField] || '';

      if (sortField === 'amount' || sortField === 'probability') {
        const numA = (a as any)[sortField] || 0;
        const numB = (b as any)[sortField] || 0;
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [filtered, sortField, sortDirection]);

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

  const handleSelectRecord = useCallback(
    (id: string) => {
      setSelectedRecord({ type: 'opportunity', id });
    },
    [setSelectedRecord]
  );

  const handleMoveStage = useCallback(
    (id: string, stage: StageId) => {
      moveOpportunityStage(id, stage);
    },
    [moveOpportunityStage]
  );

  const handleDeleteOpportunity = useCallback(
    (id: string, name: string) => {
      if (confirm(`¿Eliminar trato "${name}"?`)) {
        deleteOpportunity(id);
      }
    },
    [deleteOpportunity]
  );

  const handleOpenAICopilot = useCallback(
    (opp: Opportunity) => {
      openAICopilot({
        type: 'deal',
        id: opp.id,
        name: opp.name,
        initialPrompt:
          language === 'es'
            ? `Proporciona un informe ejecutivo y pronóstico de probabilidad para "${opp.name}".`
            : language === 'pt'
            ? `Forneça um relatório executivo e previsão de probabilidade para "${opp.name}".`
            : `Provide an executive brief and probability forecast for "${opp.name}".`,
      });
    },
    [language, openAICopilot]
  );

  const handleBulkDelete = () => {
    if (confirm(`¿Eliminar ${selectedIds.length} trato(s) seleccionado(s)?`)) {
      selectedIds.forEach((id) => deleteOpportunity(id));
      setSelectedIds([]);
      showToast(`Se eliminaron ${selectedIds.length} trato(s)`, 'info');
    }
  };

  const handleBulkStageChange = (stage: StageId) => {
    selectedIds.forEach((id) => moveOpportunityStage(id, stage));
    setSelectedIds([]);
    showToast(`Etapa actualizada para ${selectedIds.length} tratos`, 'success');
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

  // Sorted and visible columns
  const visibleColumns = useMemo(() => {
    return [...columns].filter((c) => c.visible).sort((a, b) => a.order - b.order);
  }, [columns]);

  const mapColumnSortField = (colId: string): SortField | null => {
    switch (colId) {
      case 'dealName':
        return 'name';
      case 'amount':
        return 'amount';
      case 'stage':
        return 'stage';
      case 'companyName':
        return 'companyName';
      case 'priority':
        return 'priority';
      case 'closeDate':
        return 'closeDate';
      case 'assignedTo':
        return 'assignedTo';
      case 'contactName':
        return 'contactName';
      case 'probability':
        return 'probability';
      default:
        return null;
    }
  };

  return (
    <div id="clientum-table-container" className="flex-1 flex flex-col bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] overflow-hidden">
      {/* Table Toolbar / Export & Settings Header */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c] border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] px-4 py-2 flex items-center justify-between text-xs">
        <div className="text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
          Mostrando <strong className="text-[var(--text-primary,#0f172a)] dark:text-slate-200">{sorted.length}</strong> de <strong className="text-[var(--text-primary,#0f172a)] dark:text-slate-200">{opportunities.length}</strong> negocios
        </div>

        <div className="flex items-center gap-2">
          {/* Customize Columns Button */}
          <button
            id="table-customize-columns-btn"
            onClick={() => setIsTableSettingsOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#181d2c] hover:bg-[var(--bg-muted,#f1f5f9)] dark:hover:bg-[#20273a] text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] transition-all cursor-pointer shadow-2xs"
            title="Personalizar orden y visibilidad de las columnas"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Columnas ({visibleColumns.length})</span>
          </button>

          {/* Export CSV Button */}
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

              {visibleColumns.map((col) => {
                const sortKey = mapColumnSortField(col.id);
                return (
                  <th
                    key={col.id}
                    className={`px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 transition-colors ${
                      sortKey ? 'cursor-pointer hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white' : ''
                    }`}
                    onClick={() => sortKey && handleSort(sortKey)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      {sortKey && (
                        <ArrowUpDown
                          className={`w-3 h-3 ${
                            sortField === sortKey
                              ? 'text-blue-400'
                              : 'text-[var(--text-muted,#64748b)] dark:text-slate-500'
                          }`}
                        />
                      )}
                    </div>
                  </th>
                );
              })}

              <th className="w-20 px-3 py-2.5 text-right font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">
                {t('actions')}
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#191d28]">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 2} className="py-16 px-4 text-center">
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
                  columns={visibleColumns}
                  isSelected={selectedIds.includes(opp.id)}
                  onToggleSelect={toggleSelectRow}
                  onSelectRecord={handleSelectRecord}
                  onMoveStage={handleMoveStage}
                  onDelete={handleDeleteOpportunity}
                  onOpenAICopilot={handleOpenAICopilot}
                  onOpenActivityLog={(deal) => setActiveLogDeal(deal)}
                  getPriorityBadge={getPriorityBadge}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Settings Modal */}
      <TableSettings
        isOpen={isTableSettingsOpen}
        columns={columns}
        onSave={handleSaveColumns}
        onClose={() => setIsTableSettingsOpen(false)}
      />

      {/* Deal Activity Log Modal */}
      {activeLogDeal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202738] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] flex items-center justify-between bg-[var(--bg-card,#ffffff)] dark:bg-[#151a28]">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                  Auditoría del Trato: {activeLogDeal.name}
                </h3>
                <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  Monto: ${activeLogDeal.amount.toLocaleString()} | Etapa: {activeLogDeal.stage}
                </p>
              </div>
              <button
                onClick={() => setActiveLogDeal(null)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-muted,#f1f5f9)] dark:hover:bg-[#1f2638] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              <DealActivityLog deal={activeLogDeal} activities={activities} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
