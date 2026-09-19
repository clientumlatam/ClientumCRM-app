import React, { useState, useCallback } from 'react';
import {
  Plus,
  Building2,
  Calendar,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Tag,
  Sparkles,
  Filter,
  X,
  Check,
  RotateCcw,
  SlidersHorizontal,
  DollarSign,
  User,
  ShieldAlert,
  Mail,
  Phone,
  MessageCircle,
  Settings2,
  Eye,
  EyeOff,
  Globe,
  Flame,
  PenTool,
  FileCheck,
  Mic,
  Download,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { STAGES } from '../../data/initialData';
import { Opportunity, StageId } from '../../types';
import { SavedViewsBar } from '../common/SavedViewsBar';
import { LeadCaptureModal } from '../leads/LeadCaptureModal';
import { WhatsAppQuickActionModal } from '../whatsapp/WhatsAppQuickActionModal';
import { QuoteSignPortalModal } from '../commercial/QuoteSignPortalModal';
import { VoiceNoteModal } from '../activities/VoiceNoteModal';
import { exportOpportunitiesToCSV } from '../../utils/csvExporter';
import { KanbanCard } from './KanbanCard';
import kanbanEmptyStageImg from '../../assets/images/kanban_empty_stage_1789360569191.jpg';

export const KanbanView: React.FC = () => {
  const {
    opportunities,
    people,
    moveOpportunityStage,
    setSelectedRecord,
    openNewRecordModal,
    openAICopilot,
    addActivity,
    currentUser,
    filterState,
    t,
    language,
    showToast,
  } = useCRM();

  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<StageId | null>(null);
  const [whatsAppOpp, setWhatsAppOpp] = useState<Opportunity | null>(null);
  const [quoteSignOpp, setQuoteSignOpp] = useState<Opportunity | null>(null);
  const [voiceNoteOpp, setVoiceNoteOpp] = useState<Opportunity | null>(null);
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false);
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'ARS'>('USD');

  // Multi-Select Filter Sidebar States
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState<number | ''>('');
  const [maxAmount, setMaxAmount] = useState<number | ''>('');
  const [isBoardSettingsOpen, setIsBoardSettingsOpen] = useState(false);
  const [showCardTags, setShowCardTags] = useState(true);
  const [showCardDates, setShowCardDates] = useState(true);
  const [compactCards, setCompactCards] = useState(false);

  // Extract unique owners from opportunities dataset
  const uniqueOwners: string[] = Array.from(new Set(opportunities.map((o) => o.assignedTo))).filter(Boolean) as string[];
  const priorityOptions = ['Critical', 'High', 'Medium', 'Low'];

  // Calculate active filter count
  const activeFiltersCount =
    selectedOwners.length +
    selectedPriorities.length +
    (minAmount !== '' ? 1 : 0) +
    (maxAmount !== '' ? 1 : 0);

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    // Search query from filterState
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchName = opp.name.toLowerCase().includes(q);
      const matchCompany = (opp.companyName || '').toLowerCase().includes(q);
      const matchContact = (opp.contactName || '').toLowerCase().includes(q);
      const matchOwner = opp.assignedTo.toLowerCase().includes(q);
      const matchTag = opp.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchCompany && !matchContact && !matchOwner && !matchTag) {
        return false;
      }
    }

    // Global stage/owner/priority filters
    if (filterState.stage && filterState.stage !== 'all' && opp.stage !== filterState.stage) {
      return false;
    }
    if (filterState.owner && filterState.owner !== 'all' && opp.assignedTo !== filterState.owner) {
      return false;
    }
    if (filterState.priority && filterState.priority !== 'all' && opp.priority !== filterState.priority) {
      return false;
    }

    // Multi-Select Owner Filter
    if (selectedOwners.length > 0 && !selectedOwners.includes(opp.assignedTo)) {
      return false;
    }

    // Multi-Select Priority Filter
    if (selectedPriorities.length > 0 && !selectedPriorities.includes(opp.priority)) {
      return false;
    }

    // Deal Value Range Filter
    if (minAmount !== '' && opp.amount < Number(minAmount)) {
      return false;
    }
    if (maxAmount !== '' && opp.amount > Number(maxAmount)) {
      return false;
    }

    return true;
  });

  const toggleOwner = (owner: string) => {
    setSelectedOwners((prev) =>
      prev.includes(owner) ? prev.filter((o) => o !== owner) : [...prev, owner]
    );
  };

  const togglePriority = (p: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedOwners([]);
    setSelectedPriorities([]);
    setMinAmount('');
    setMaxAmount('');
  };

  const handleSelectRecord = useCallback((id: string) => {
    setSelectedRecord({ type: 'opportunity', id });
  }, [setSelectedRecord]);

  const handleWhatsAppClick = useCallback((opp: Opportunity) => {
    setWhatsAppOpp(opp);
  }, []);

  const handleAICopilotClick = useCallback((opp: Opportunity) => {
    openAICopilot({
      type: 'deal',
      id: opp.id,
      name: opp.name,
      initialPrompt: language === 'es'
        ? `Analiza la salud del negocio y proporciona 3 pasos recomendados para "${opp.name}" ($${opp.amount.toLocaleString()}, Etapa: ${opp.stage}, Cuenta: ${opp.companyName || 'N/A'}).`
        : language === 'pt'
        ? `Analise a saúde do negócio e forneça 3 recomendações de próximos pasos para "${opp.name}" ($${opp.amount.toLocaleString()}, Etapa: ${opp.stage}, Conta: ${opp.companyName || 'N/A'}).`
        : `Analyze deal health and give 3 recommended next steps for "${opp.name}" ($${opp.amount.toLocaleString()}, Stage: ${opp.stage}, Account: ${opp.companyName || 'N/A'}).`,
    });
  }, [language, openAICopilot]);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedOppId(id);
  }, []);

  const handleDragOver = (e: React.DragEvent, stageId: StageId) => {
    e.preventDefault();
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: StageId) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedOppId;
    if (id) {
      moveOpportunityStage(id, stageId);
    }
    setDraggedOppId(null);
    setDragOverStage(null);
  };

  const getPriorityColor = useCallback((p: string) => {
    switch (p) {
      case 'Critical':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'High':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Medium':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-[var(--text-secondary)] bg-[var(--bg-muted)] border-[var(--border-subtle)]';
    }
  }, []);

  const getContact = useCallback((opp: Opportunity) =>
    people.find((person) => person.id === opp.contactId) ||
    people.find((person) => `${person.firstName} ${person.lastName}` === opp.contactName),
    [people]
  );

  const exchangeRate = 1250; // USD to ARS
  const formatAmount = (amt: number) => {
    if (currencyMode === 'ARS') {
      return `$${Math.round((amt * exchangeRate) / 1000000)}M ARS`;
    }
    return `$${Math.round(amt / 1000)}k USD`;
  };

  const totalActivePipeline = filteredOpportunities
    .filter((o) => o.stage !== 'won' && o.stage !== 'lost')
    .reduce((acc, o) => acc + o.amount, 0);

  const totalWonDeals = filteredOpportunities
    .filter((o) => o.stage === 'won')
    .reduce((acc, o) => acc + o.amount, 0);

  const wonCount = filteredOpportunities.filter((o) => o.stage === 'won').length;
  const closedCount = filteredOpportunities.filter((o) => o.stage === 'won' || o.stage === 'lost').length;
  const winRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 42;

  const urgentDealsCount = filteredOpportunities.filter(
    (o) => o.priority === 'Critical' || (o.healthScore && o.healthScore < 50)
  ).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-muted)]">
      {/* Top Bar with Saved Views and Multi-Select Filter Trigger */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-card)] min-h-[58px]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="hidden lg:flex items-center gap-1.5 pl-4 text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 shrink-0">
            <span>Negocios</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-[var(--text-secondary)]">Kanban</span>
          </div>
          <SavedViewsBar target="opportunities" />
        </div>

        <div className="px-3 py-2 border-l border-[var(--border-subtle)] flex items-center gap-2 shrink-0 relative">
          <button
            id="open-lead-capture-btn"
            onClick={() => setIsLeadCaptureOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs transition-all cursor-pointer"
            title="Formularios y enlaces públicos para captar prospectos directo al CRM"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Captar Leads Web</span>
          </button>

          <button
            id="kanban-export-csv-btn"
            onClick={() => exportOpportunitiesToCSV(filteredOpportunities, 'ClientumCRM_Pipeline_Kanban')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-700 border border-emerald-200 shadow-2xs transition-all cursor-pointer"
            title="Exportar tratos filtrados del tablero a archivo CSV para Excel/Informes"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Exportar CSV</span>
          </button>

          <button
            id="toggle-kanban-filter-sidebar"
            onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${ activeFiltersCount > 0 || isFilterSidebarOpen ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' : 'bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)] shadow-2xs' }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros ({activeFiltersCount})</span>
          </button>
          <div className="relative">
            <button
              id="kanban-settings-btn"
              onClick={() => setIsBoardSettingsOpen((open) => !open)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${ isBoardSettingsOpen ? 'bg-slate-900 text-white' : 'bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)] shadow-2xs' }`}
              aria-expanded={isBoardSettingsOpen}
              aria-haspopup="menu"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Configurar tablero</span>
            </button>
            {isBoardSettingsOpen && (
              <div
                className="absolute right-0 top-full mt-2 z-30 w-64 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 shadow-xl"
                role="menu"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[var(--text-primary)]">Configuración Kanban</span>
                  <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Vista actual</span>
                </div>
                {[
                  { label: 'Etiquetas y prioridad', value: showCardTags, setValue: setShowCardTags },
                  { label: 'Fecha de cierre', value: showCardDates, setValue: setShowCardDates },
                  { label: 'Tarjetas compactas', value: compactCards, setValue: setCompactCards },
                ].map((setting) => (
                  <button
                    key={setting.label}
                    onClick={() => setting.setValue((value) => !value)}
                    className="w-full flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] cursor-pointer"
                    role="menuitemcheckbox"
                    aria-checked={setting.value}
                  >
                    <span>{setting.label}</span>
                    {setting.value ? (
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            id="kanban-add-opp-top-btn"
            onClick={() => openNewRecordModal('opportunity')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('newOpportunity')}</span>
          </button>
        </div>
      </div>

      {/* Real-time Pipeline Intelligence Ribbon */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-subtle)]/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[var(--text-muted)]">Pipeline Activo:</span>
            <span className="font-mono font-bold text-[var(--text-primary)] text-sm">{formatAmount(totalActivePipeline)}</span>
          </div>
          <div className="h-4 w-px bg-[var(--bg-muted)] hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[var(--text-muted)]">Ganado (Won):</span>
            <span className="font-mono font-bold text-emerald-600 text-sm">{formatAmount(totalWonDeals)}</span>
          </div>
          <div className="h-4 w-px bg-[var(--bg-muted)] hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[var(--text-muted)]">Tasa de Cierre:</span>
            <span className="font-mono font-bold text-blue-600">{winRate}%</span>
          </div>
          {urgentDealsCount > 0 && (
            <>
              <div className="h-4 w-px bg-[var(--bg-muted)] hidden sm:block" />
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-[11px]">
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>{urgentDealsCount} tratos con atención requerida</span>
              </div>
            </>
          )}
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium">Moneda:</span>
          <div className="flex bg-[var(--bg-muted)] p-0.5 rounded-lg border border-[var(--border-subtle)] text-[11px]">
            <button
              type="button"
              onClick={() => setCurrencyMode('USD')}
              className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${ currencyMode === 'USD' ? 'bg-[var(--bg-card)] text-blue-600 shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]' }`}
            >
              USD
            </button>
            <button
              type="button"
              onClick={() => setCurrencyMode('ARS')}
              className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${ currencyMode === 'ARS' ? 'bg-[var(--bg-card)] text-blue-600 shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]' }`}
            >
              ARS
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Kanban Board Column Canvas */}
        <div id="clientum-kanban-board" className="flex-1 overflow-x-auto p-4 flex gap-3.5 select-none h-full items-start custom-scrollbar">
          {STAGES.map((stage) => {
            const stageOpps = filteredOpportunities.filter((o) => o.stage === stage.id);
            const stageTotal = stageOpps.reduce((acc, curr) => acc + curr.amount, 0);
            const isTarget = dragOverStage === stage.id;

            return (
              <div
                key={stage.id}
                id={`kanban-column-${stage.id}`}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
                className={`w-72 shrink-0 flex flex-col max-h-full rounded-xl bg-[var(--bg-muted)]/90 border transition-all duration-150 ${ isTarget ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10' : 'border-[var(--border-subtle)]' }`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-[var(--border-subtle)]/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-bold text-xs text-[var(--text-primary)] truncate">
                      {t(`stage_${stage.id}` as any) || stage.name}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {stageOpps.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-mono text-[var(--text-secondary)]">
                      ${Math.round(stageTotal / 1000)}k
                    </span>
                    <button
                      id={`column-add-deal-${stage.id}`}
                      onClick={() => openNewRecordModal('opportunity')}
                      className="w-5 h-5 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                      title={`${t('newOpportunity')} (${t(`stage_${stage.id}` as any) || stage.name})`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Column Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1 min-h-[140px] custom-scrollbar">
                  {stageOpps.length === 0 ? (
                    <div className="py-6 px-3 border border-dashed border-[var(--border-default)] rounded-xl bg-[var(--bg-card)]/60 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 mb-2.5 rounded-lg overflow-hidden border border-[var(--border-subtle)] shadow-2xs bg-[var(--bg-muted)] flex items-center justify-center shrink-0">
                        <img
                          src={kanbanEmptyStageImg}
                          alt="Etapa sin negocios"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[11px] font-bold text-[var(--text-secondary)] mb-0.5">
                        {t('noDealsInStage')}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 max-w-[180px]">
                        Arrastra un trato o crea uno nuevo en esta etapa.
                      </p>
                    </div>
                  ) : (
                    stageOpps.map((opp) => (
                      <KanbanCard
                        key={opp.id}
                        opp={opp}
                        compactCards={compactCards}
                        showCardTags={showCardTags}
                        showCardDates={showCardDates}
                        getPriorityColor={getPriorityColor}
                        getContact={getContact}
                        onDragStart={handleDragStart}
                        onSelectRecord={handleSelectRecord}
                        onWhatsAppClick={handleWhatsAppClick}
                        onAICopilotClick={handleAICopilotClick}
                      />
                    ))
                  )}
                </div>

                {/* Column Footer Quick Add */}
                <div className="p-2 border-t border-[var(--border-subtle)]/80">
                  <button
                    id={`column-quick-add-btn-${stage.id}`}
                    onClick={() => openNewRecordModal('opportunity')}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[var(--text-secondary)] hover:text-blue-600 hover:bg-[var(--bg-card)] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('createFirstDeal')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* MULTI-SELECT FILTER SIDEBAR */}
        {isFilterSidebarOpen && (
          <div className="w-80 bg-[var(--bg-card)] border-l border-[var(--border-subtle)] p-4 flex flex-col h-full z-20 text-xs shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 custom-scrollbar">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-[var(--text-primary)] text-sm">Filtros Avanzados Kanban</h3>
              </div>
              <button
                onClick={() => setIsFilterSidebarOpen(false)}
                className="p-1 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-secondary)] rounded hover:bg-[var(--bg-muted)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clear All Button */}
            {activeFiltersCount > 0 && (
              <div className="mb-4">
                <button
                  onClick={handleClearAllFilters}
                  className="w-full py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar filtros ({activeFiltersCount})</span>
                </button>
              </div>
            )}

            <div className="space-y-5 flex-1">
              {/* FILTER 1: OWNER / ASSIGNED TO (MULTI-SELECT) */}
              <div className="space-y-2">
                <label className="font-bold text-[var(--text-secondary)] text-[11px] flex items-center gap-1.5 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Propietario(s) del negocio
                </label>
                <div className="space-y-1 bg-[var(--bg-muted)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                  {uniqueOwners.map((owner) => {
                    const count = opportunities.filter((o) => o.assignedTo === owner).length;
                    const isChecked = selectedOwners.includes(owner);
                    return (
                      <label
                        key={owner}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-[var(--bg-card)] cursor-pointer text-[var(--text-secondary)] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleOwner(owner)}
                            className="rounded border-[var(--border-default)] text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span className="font-medium text-xs">{owner}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* FILTER 2: DEAL VALUE RANGE ($ USD) */}
              <div className="space-y-2">
                <label className="font-bold text-[var(--text-secondary)] text-[11px] flex items-center gap-1.5 uppercase tracking-wider">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Rango de Valor ($ USD)
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[var(--bg-muted)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block mb-1">Mínimo ($)</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-[var(--bg-card)] text-[var(--text-primary)] px-2.5 py-1.5 rounded border border-[var(--border-subtle)] font-mono text-xs focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block mb-1">Máximo ($)</span>
                    <input
                      type="number"
                      placeholder="100000"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-[var(--bg-card)] text-[var(--text-primary)] px-2.5 py-1.5 rounded border border-[var(--border-subtle)] font-mono text-xs focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Range Presets */}
                <div className="flex flex-wrap gap-1">
                  {([
                    { label: 'Hasta $10k', min: '' as const, max: 10000 as const },
                    { label: '$10k - $50k', min: 10000 as const, max: 50000 as const },
                    { label: 'Más de $50k', min: 50000 as const, max: '' as const },
                  ] as const).map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMinAmount(preset.min);
                        setMaxAmount(preset.max);
                      }}
                      className="px-2 py-1 rounded bg-[var(--bg-muted)] hover:bg-blue-50 text-[var(--text-secondary)] hover:text-blue-700 border border-[var(--border-subtle)] text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FILTER 3: PRIORITY LEVEL (MULTI-SELECT) */}
              <div className="space-y-2">
                <label className="font-bold text-[var(--text-secondary)] text-[11px] flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Nivel de Prioridad
                </label>
                <div className="space-y-1 bg-[var(--bg-muted)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                  {priorityOptions.map((priority) => {
                    const isChecked = selectedPriorities.includes(priority);
                    const count = opportunities.filter((o) => o.priority === priority).length;
                    return (
                      <label
                        key={priority}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-[var(--bg-card)] cursor-pointer text-[var(--text-secondary)] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePriority(priority)}
                            className="rounded border-[var(--border-default)] text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getPriorityColor(priority)}`}>
                            {priority}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Footer Stats */}
            <div className="pt-4 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-center justify-between font-mono">
              <span>Mostrando:</span>
              <strong className="text-[var(--text-primary)]">{filteredOpportunities.length} / {opportunities.length} Negocios</strong>
            </div>
          </div>
        )}
      </div>

      {/* Web Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadCaptureOpen}
        onClose={() => setIsLeadCaptureOpen(false)}
      />

      {/* Quick WhatsApp Action Modal */}
      <WhatsAppQuickActionModal
        isOpen={!!whatsAppOpp}
        onClose={() => setWhatsAppOpp(null)}
        recipientName={
          whatsAppOpp
            ? getContact(whatsAppOpp)?.firstName
              ? `${getContact(whatsAppOpp)!.firstName} ${getContact(whatsAppOpp)!.lastName}`
              : whatsAppOpp.contactName || ''
            : ''
        }
        recipientPhone={
          whatsAppOpp
            ? getContact(whatsAppOpp)?.phone || (whatsAppOpp as any).contactPhone || ''
            : ''
        }
        companyName={whatsAppOpp?.companyName || ''}
        dealName={whatsAppOpp?.name}
        dealAmount={whatsAppOpp?.amount}
        onLogActivity={(msg) => {
          if (whatsAppOpp) {
            addActivity({
              type: 'call',
              title: `WhatsApp enviado para negocio "${whatsAppOpp.name}"`,
              content: msg,
              author: currentUser.name,
              targetType: 'opportunity',
              targetId: whatsAppOpp.id,
            });
            showToast('Actividad de WhatsApp registrada en el negocio', 'success');
          }
        }}
      />
    </div>
  );
};
