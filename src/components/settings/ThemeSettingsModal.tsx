import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Check,
  X,
  Sparkles,
  LayoutGrid,
  BarChart3,
  Columns,
  Eye,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../types';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme();

  // Selected candidate theme in the modal before applying or committing
  const [selectedMode, setSelectedMode] = useState<ThemeMode>(theme);
  // Preview view switcher: 'kanban' | 'charts' | 'split'
  const [previewTab, setPreviewTab] = useState<'kanban' | 'charts' | 'split'>('kanban');
  // Temporary preview theme toggle for testing inside the modal preview container
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>(resolvedTheme);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMode(theme);
      setPreviewTheme(theme === 'system' ? systemTheme : theme);
    }
  }, [isOpen, theme, systemTheme]);

  // Update preview theme when selectedMode changes
  useEffect(() => {
    if (selectedMode === 'system') {
      setPreviewTheme(systemTheme);
    } else {
      setPreviewTheme(selectedMode);
    }
  }, [selectedMode, systemTheme]);

  if (!isOpen) return null;

  const handleApplyTheme = () => {
    setTheme(selectedMode);
    onClose();
  };

  const isDarkPreview = previewTheme === 'dark';

  return (
    <div
      id="theme-settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="theme-settings-modal-container"
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                Ajustes de Tema & Modo Visual
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Clientum Obsidian & Clarity
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Previsualiza cómo luce el Pipeline Kanban y los Gráficos de Ventas en tiempo real antes de aplicar.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Mode Selector Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Seleccionar Modo de Visualización
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Light Mode Button */}
              <button
                type="button"
                id="modal-theme-btn-light"
                onClick={() => setSelectedMode('light')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${ selectedMode === 'light' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-950 dark:text-white ring-1 ring-blue-600' : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]' }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  {selectedMode === 'light' && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs text-[var(--text-primary)]">Modo Claro</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Clientum Clarity (Alto Contraste)</div>
                </div>
              </button>

              {/* Dark Mode Button */}
              <button
                type="button"
                id="modal-theme-btn-dark"
                onClick={() => setSelectedMode('dark')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${ selectedMode === 'dark' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-950 dark:text-white ring-1 ring-blue-600' : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]' }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-405">
                    <Moon className="w-4 h-4" />
                  </div>
                  {selectedMode === 'dark' && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs text-[var(--text-primary)]">Modo Oscuro</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Midnight Obsidian & Navy</div>
                </div>
              </button>

              {/* System Auto Mode Button */}
              <button
                type="button"
                id="modal-theme-btn-system"
                onClick={() => setSelectedMode('system')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${ selectedMode === 'system' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-950 dark:text-white ring-1 ring-blue-600' : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]' }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Monitor className="w-4 h-4" />
                  </div>
                  {selectedMode === 'system' && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs text-[var(--text-primary)]">
                    Sincronizar con el Sistema (OS)
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Detectado: <strong className="capitalize text-blue-600 dark:text-blue-400">{systemTheme === 'dark' ? 'Oscuro' : 'Claro'}</strong>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Live Preview Section Header & Controls */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Previsualización en Vivo
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                  {previewTab === 'split' ? 'Comparación Dividida' : isDarkPreview ? 'Simulando Modo Oscuro' : 'Simulando Modo Claro'}
                </span>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPreviewTab('kanban')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${ previewTab === 'kanban' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]' }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Kanban</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewTab('charts')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${ previewTab === 'charts' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]' }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Gráficos & BI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewTab('split')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${ previewTab === 'split' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]' }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Comparativa</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Workspace Display */}
            {previewTab === 'split' ? (
              /* Split Comparison View: Light vs Dark side by side */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Light Side */}
                <div className="rounded-xl border border-[var(--border-default)] bg-[#f8fafc] text-slate-800 p-3.5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Claro (Clientum Clarity)
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">data-theme="light"</span>
                  </div>
                  {renderKanbanPreview(false)}
                  {renderChartsPreview(false)}
                </div>

                {/* Dark Side */}
                <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c1222] text-[var(--text-primary,#0f172a)] dark:text-slate-100 p-3.5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                      <Moon className="w-3.5 h-3.5 text-blue-400" />
                      Oscuro (Midnight Obsidian)
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted,#64748b)] dark:text-slate-400">data-theme="dark"</span>
                  </div>
                  {renderKanbanPreview(true)}
                  {renderChartsPreview(true)}
                </div>
              </div>
            ) : (
              /* Single Tab View (Kanban or Charts) */
              <div
                className={`rounded-xl p-4 transition-all duration-200 border ${ isDarkPreview ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c1222] border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] text-[var(--text-primary,#0f172a)] dark:text-white shadow-inner' : 'bg-[#f8fafc] border-[var(--border-default)] text-slate-800 shadow-inner' }`}
              >
                {previewTab === 'kanban' ? renderFullKanbanPreview(isDarkPreview) : renderFullChartsPreview(isDarkPreview)}
              </div>
            )}
          </div>

          {/* Technical Diagnostics info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--text-muted)] p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Persistencia en tiempo real: <code className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">localStorage.setItem('clientum_theme', '{selectedMode}')</code>
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-secondary)]">
              HTML Root: <code className="text-blue-600 dark:text-blue-400">data-theme="{selectedMode === 'system' ? systemTheme : selectedMode}"</code>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-muted)]/80 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="theme-modal-apply-btn"
              onClick={handleApplyTheme}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>Guardar y Aplicar Tema</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Mini Preview Helper Renderers ---

function renderKanbanPreview(isDark: boolean) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className={isDark ? 'text-[var(--text-secondary,#475569)] dark:text-slate-300' : 'text-[var(--text-secondary)]'}>Pipeline Visual</span>
        <span className="text-emerald-500 font-mono">$184,500</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div
          className={`p-2.5 rounded-lg border text-[10px] space-y-1.5 ${ isDark ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a1842]/40 border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a294d]' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-2xs' }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-bold ${isDark ? 'text-white' : 'text-[var(--text-primary)]'}`}>TechCorp SA</span>
            <span className="font-mono text-emerald-500 font-bold">$45,000</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] ${ isDark ? 'bg-blue-900/60 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-900 border border-blue-200' }`}>
              Descubrimiento
            </span>
          </div>
        </div>

        <div
          className={`p-2.5 rounded-lg border text-[10px] space-y-1.5 ${ isDark ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a1842]/40 border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a294d]' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-2xs' }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-bold ${isDark ? 'text-white' : 'text-[var(--text-primary)]'}`}>Banco Andino</span>
            <span className="font-mono text-emerald-500 font-bold">$120,000</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] ${ isDark ? 'bg-purple-900/60 text-purple-300 border border-purple-800' : 'bg-purple-100 text-purple-900 border border-purple-200' }`}>
              Negociación
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderChartsPreview(isDark: boolean) {
  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className={isDark ? 'text-[var(--text-secondary,#475569)] dark:text-slate-300' : 'text-[var(--text-secondary)]'}>Ingresos Mensuales</span>
        <span className="text-blue-500 font-mono">+28.4% vs mes anterior</span>
      </div>
      {/* Mini Bar Chart Mock */}
      <div className={`p-2.5 rounded-lg border flex items-end justify-between gap-1.5 h-16 ${ isDark ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#081226] border-[var(--border-subtle,#e2e8f0)] dark:border-[#131b2e]' : 'bg-[var(--bg-card)] border-[var(--border-subtle)]' }`}>
        {[40, 65, 55, 80, 95, 75, 100].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div
              className={`w-full rounded-t-sm transition-all ${ i === 6 ? 'bg-blue-600' : isDark ? 'bg-blue-500/40 hover:bg-blue-500' : 'bg-blue-200 hover:bg-blue-400' }`}
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function renderFullKanbanPreview(isDark: boolean) {
  const columns = [
    { title: '1. Lead / Contacto', count: 4, sum: '$38,000', color: 'bg-blue-500' },
    { title: '2. Calificado & Demo', count: 3, sum: '$82,000', color: 'bg-indigo-500' },
    { title: '3. Propuesta / Negociación', count: 2, sum: '$145,000', color: 'bg-amber-500' },
    { title: '4. Ganada / Facturada', count: 5, sum: '$290,000', color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Pipeline Stats Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[var(--text-primary)]'}`}>
            Pipeline Comercial Cono Sur (2026)
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${ isDark ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-900 border border-blue-200' }`}>
            14 tratos activos
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className={isDark ? 'text-[var(--text-muted,#64748b)] dark:text-slate-400' : 'text-[var(--text-muted)]'}>Total Embudo: </span>
            <strong className="text-emerald-500 font-bold">$555,000 USD</strong>
          </div>
          <div>
            <span className={isDark ? 'text-[var(--text-muted,#64748b)] dark:text-slate-400' : 'text-[var(--text-muted)]'}>Win Rate: </span>
            <strong className="text-blue-500 font-bold">64.2%</strong>
          </div>
        </div>
      </div>

      {/* 4 Kanban Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border flex flex-col gap-2.5 ${ isDark ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#060e1d] border-[var(--border-subtle,#e2e8f0)] dark:border-[#131b2e]' : 'bg-[var(--bg-muted)]/80 border-[var(--border-subtle)]' }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[var(--border-subtle)]/60 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${col.color}`} />
                <span className={`font-bold text-[11px] ${isDark ? 'text-[var(--text-primary,#0f172a)] dark:text-slate-200' : 'text-[var(--text-primary)]'}`}>
                  {col.title}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${ isDark ? 'bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]' }`}>
                {col.count}
              </span>
            </div>

            {/* Opportunity Card 1 */}
            <div
              className={`p-2.5 rounded-lg border text-xs space-y-2 transition-all ${ isDark ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#091530] border-[var(--border-subtle,#e2e8f0)] dark:border-[#19274a] text-[var(--text-primary,#0f172a)] dark:text-white hover:border-blue-500/50' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] shadow-2xs hover:border-blue-400' }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div>
                  <h5 className="font-bold text-[11px]">
                    {idx === 0 ? 'Logística San Martín' : idx === 1 ? 'Grupo Arcor B2B' : idx === 2 ? 'Fintech Andina' : 'Retail Patagonia'}
                  </h5>
                  <span className={`text-[10px] ${isDark ? 'text-[var(--text-muted,#64748b)] dark:text-slate-400' : 'text-[var(--text-muted)]'}`}>
                    Contacto: Carlos Pérez
                  </span>
                </div>
                <span className="font-mono text-emerald-500 font-bold text-[11px]">
                  {idx === 0 ? '$12,500' : idx === 1 ? '$34,000' : idx === 2 ? '$85,000' : '$120,000'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[9px] pt-1 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80">
                <span className={`px-1.5 py-0.5 rounded font-medium ${ isDark ? 'bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)]' }`}>
                  Alta Prioridad
                </span>
                <span className={isDark ? 'text-[var(--text-muted,#64748b)] dark:text-slate-400' : 'text-[var(--text-muted)]'}>Cierre: 20 Dic</span>
              </div>
            </div>

            {/* Opportunity Card 2 */}
            <div
              className={`p-2.5 rounded-lg border text-xs space-y-2 ${ isDark ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#091530] border-[var(--border-subtle,#e2e8f0)] dark:border-[#19274a] text-white' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] shadow-2xs' }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div>
                  <h5 className="font-bold text-[11px]">
                    {idx === 0 ? 'AgroGlobal Export' : idx === 1 ? 'BioSalud Pharma' : idx === 2 ? 'Minera Sur Corp' : 'E-Commerce Plus'}
                  </h5>
                  <span className={`text-[10px] ${isDark ? 'text-[var(--text-muted,#64748b)] dark:text-slate-400' : 'text-[var(--text-muted)]'}`}>
                    Contacto: Mariana Gomez
                  </span>
                </div>
                <span className="font-mono text-emerald-500 font-bold text-[11px]">
                  {idx === 0 ? '$25,500' : idx === 1 ? '$48,000' : idx === 2 ? '$60,000' : '$170,000'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderFullChartsPreview(isDark: boolean) {
  return (
    <div className="space-y-4">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-3.5 rounded-xl border ${ isDark ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#091530] border-[var(--border-subtle,#e2e8f0)] dark:border-[#19274a]' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-2xs' }`}>
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">
            <span>Facturación Mensual</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-[var(--text-primary)]'}`}>$128,450 USD</div>
          <div className="text-[10px] text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +18.2% vs mes anterior
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border ${ isDark ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#091530] border-[var(--border-subtle,#e2e8f0)] dark:border-[#19274a]' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-2xs' }`}>
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">
            <span>Tasa de Conversión (Win Rate)</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-[var(--text-primary)]'}`}>68.5%</div>
          <div className="text-[10px] text-blue-500 font-semibold mt-1">
            Meta: &gt; 50% (+18.5% superada)
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border ${ isDark ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#091530] border-[var(--border-subtle,#e2e8f0)] dark:border-[#19274a]' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-2xs' }`}>
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">
            <span>Ciclo Promedio de Venta</span>
            <Layers className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-[var(--text-primary)]'}`}>14.2 días</div>
          <div className="text-[10px] text-purple-500 font-semibold mt-1">
            -3.5 días más rápido que Q3
          </div>
        </div>
      </div>

      {/* Main Bar Chart Simulation */}
      <div className={`p-4 rounded-xl border space-y-3 ${ isDark ? 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#060e1d] border-[var(--border-subtle,#e2e8f0)] dark:border-[#131b2e]' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-2xs' }`}>
        <div className="flex items-center justify-between text-xs">
          <div>
            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-[var(--text-primary)]'}`}>
              Evolución de Ingresos y Pipeline (Últimos 7 Meses)
            </h4>
            <p className={`text-[11px] ${isDark ? 'text-[var(--text-muted,#64748b)] dark:text-slate-400' : 'text-[var(--text-muted)]'}`}>
              Comparativa de ventas ganadas vs metas mensuales
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Ingresos Reales
            </span>
            <span className="flex items-center gap-1 text-[var(--text-muted,#64748b)] dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              Meta Objetivo
            </span>
          </div>
        </div>

        <div className="h-40 flex items-end justify-between gap-3 pt-4 px-2 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
          {[
            { month: 'Jun', val: 55, target: 45 },
            { month: 'Jul', val: 70, target: 60 },
            { month: 'Ago', val: 65, target: 65 },
            { month: 'Sep', val: 85, target: 70 },
            { month: 'Oct', val: 95, target: 80 },
            { month: 'Nov', val: 110, target: 90 },
            { month: 'Dic', val: 130, target: 100 },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                {/* Real Value Bar */}
                <div
                  className="w-1/2 max-w-[24px] rounded-t-md bg-blue-600 transition-all duration-300 group-hover:brightness-110"
                  style={{ height: `${(item.val / 140) * 100}%` }}
                  title={`${item.month}: $${item.val * 1000}`}
                />
                {/* Target Bar */}
                <div
                  className={`w-1/2 max-w-[24px] rounded-t-md transition-all duration-300 ${ isDark ? 'bg-slate-800' : 'bg-[var(--bg-muted)]' }`}
                  style={{ height: `${(item.target / 140) * 100}%` }}
                  title={`Meta ${item.month}: $${item.target * 1000}`}
                />
              </div>
              <span className={`text-[10px] font-mono ${isDark ? 'text-[var(--text-muted,#64748b)] dark:text-slate-400' : 'text-[var(--text-muted)]'}`}>
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThemeSettingsModal;
