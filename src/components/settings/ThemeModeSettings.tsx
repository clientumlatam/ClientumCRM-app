import React, { useEffect, useState, useCallback } from 'react';
import { Sun, Moon, Sparkles, Check, Eye, Monitor, ShieldCheck, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../types';
import { ThemeSettingsModal } from './ThemeSettingsModal';

export interface ThemeModeSettingsProps {
  storageKey?: string;
  className?: string;
  onThemeChange?: (theme: ThemeMode) => void;
  showPreviews?: boolean;
}

const DEFAULT_STORAGE_KEY = 'clientum_theme';

export const ThemeModeSettings: React.FC<ThemeModeSettingsProps> = ({
  storageKey = DEFAULT_STORAGE_KEY,
  className = '',
  onThemeChange,
  showPreviews = true,
}) => {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const applyTheme = useCallback(
    (newTheme: ThemeMode) => {
      setTheme(newTheme);
      if (onThemeChange) {
        onThemeChange(newTheme);
      }
    },
    [setTheme, onThemeChange]
  );

  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <div
        id="theme-mode-settings-card"
        className={`bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 sm:p-6 rounded-2xl shadow-sm space-y-6 ${className}`}
      >
        {/* Header with Title and Quick Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                {theme === 'system' ? (
                  <Monitor className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                ) : isDark ? (
                  <Moon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Tema Visual & Modo de Pantalla
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Alterna entre modo claro, oscuro y sincronización con el sistema. La preferencia se persiste en <code className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">localStorage</code> y aplica el atributo <code className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">data-theme="{resolvedTheme}"</code> en el elemento raíz del documento.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="theme-open-modal-preview-btn"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vista Previa en Vivo</span>
            </button>
          </div>
        </div>

        {/* Theme Selection Cards */}
        {showPreviews && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Executive Pro Theme Card (Nuevo basado en imagen) */}
            <div
              id="theme-option-executive"
              onClick={() => applyTheme('executive')}
              className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                theme === 'executive'
                  ? 'border-[#0B132B] bg-slate-900 text-white shadow-md ring-2 ring-blue-500/50'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0B132B] border border-blue-400/40 flex items-center justify-center text-white shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Executive Pro
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      Resumen Ejecutivo v4.2
                    </span>
                  </div>
                </div>

                {theme === 'executive' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    <Check className="w-3 h-3" />
                    Activo
                  </span>
                )}
              </div>

              <div className="rounded-lg bg-[#F4F6FB] p-2.5 border border-[#e2e8f0] space-y-1.5 mb-2">
                <div className="flex items-center justify-between text-[10px] text-[#0B132B] font-extrabold">
                  <span>Executive Dashboard</span>
                  <span className="text-emerald-600 font-mono font-bold">$582.000</span>
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  #F4F6FB Canvas / #0B132B Dark Navy
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                data-theme="executive"
              </div>
            </div>

            {/* Clientum Clarity Theme Card (Featured) */}
            <div
              id="theme-option-clarity"
              onClick={() => applyTheme('clarity')}
              className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                theme === 'clarity'
                  ? 'border-[#0056B3] bg-blue-50/50 dark:bg-blue-950/30 text-slate-900 dark:text-white shadow-md ring-1 ring-blue-500/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-400'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#022046] flex items-center justify-center text-white shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Clientum Clarity
                    </h4>
                    <span className="text-[10px] text-[#0056B3] font-mono font-bold">
                      Tema Oficial Brand v1.0
                    </span>
                  </div>
                </div>

                {theme === 'clarity' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#0056B3] bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    Activo
                  </span>
                )}
              </div>

              <div className="rounded-lg bg-[#F5F7FA] p-2.5 border border-[#e2e8f0] space-y-1.5 mb-2">
                <div className="flex items-center justify-between text-[10px] text-[#022046] font-bold">
                  <span>ClientumOS Clarity</span>
                  <span className="text-[#4CAF50] font-mono">$120,000</span>
                </div>
                <div className="text-[9px] text-[#0056B3] font-mono">
                  #022046 Navy / #0056B3 Action
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                data-theme="clarity"
              </div>
            </div>

            {/* Light Mode Card */}
            <div
              id="theme-option-light"
              onClick={() => applyTheme('light')}
              className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                theme === 'light'
                  ? 'border-blue-500 bg-[#f8fafc] text-slate-900 shadow-md ring-1 ring-blue-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-2xs">
                    <Sun className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Modo Claro Standard
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Claro Convencional
                    </span>
                  </div>
                </div>

                {theme === 'light' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    Activo
                  </span>
                )}
              </div>

              <div className="rounded-lg bg-white p-2.5 border border-slate-200 space-y-1.5 mb-2">
                <div className="flex items-center justify-between text-[10px] text-slate-800 font-bold">
                  <span>Modo Claro</span>
                  <span className="text-emerald-600 font-mono">$120,000</span>
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  Blanco / Neutro
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                data-theme="light"
              </div>
            </div>

            {/* Dark Mode Card */}
            <div
              id="theme-option-dark"
              onClick={() => applyTheme('dark')}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${ theme === 'dark' ? 'border-blue-500 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#09132b] text-[var(--text-primary,#0f172a)] dark:text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-500/30' : 'border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]' }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#040c1a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#131b2e] flex items-center justify-center text-blue-400 shadow-2xs">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                      Modo Oscuro
                    </h4>
                    <span className="text-[11px] text-blue-300 font-mono">
                      Clientum Midnight Obsidian
                    </span>
                  </div>
                </div>

                {theme === 'dark' && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-700">
                    <Check className="w-3 h-3" />
                    Activo
                  </span>
                )}
              </div>

              {/* Simulated Workspace Preview */}
              <div className="rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#040c1a] p-3 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#131b2e] space-y-2 mb-3 shadow-2xs">
                <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary,#475569)] dark:text-slate-300 pb-1.5 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#131b2e]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-bold">Acme Latam Corp</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">$120,000</span>
                </div>
                <div className="flex items-center gap-2 text-[9px]">
                  <span className="px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 font-mono font-semibold border border-blue-800">
                    Negociación
                  </span>
                  <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium">Cierre: 15 Dic</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Fondo #040c1a / Texto #f8fafc
                </span>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">data-theme="dark"</span>
              </div>
            </div>

            {/* System Auto Mode Card */}
            <div
              id="theme-option-system"
              onClick={() => applyTheme('system')}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${ theme === 'system' ? 'border-blue-500 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#09132b] text-[var(--text-primary,#0f172a)] dark:text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-500/30' : 'border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]' }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400 shadow-2xs">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                      Automático (Sistema OS)
                    </h4>
                    <span className="text-[11px] text-indigo-300 font-mono">
                      Detectado: {systemTheme === 'dark' ? 'Oscuro' : 'Claro'}
                    </span>
                  </div>
                </div>

                {theme === 'system' && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-700">
                    <Check className="w-3 h-3" />
                    Activo
                  </span>
                )}
              </div>

              {/* Simulated Workspace Preview */}
              <div className="rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a1120] p-3 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b2742] space-y-2 mb-3 shadow-2xs">
                <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary,#475569)] dark:text-slate-300 pb-1.5 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b2742]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-bold">Auto-Sync Activo</span>
                  </div>
                  <span className="text-indigo-400 font-mono font-bold">prefers-color-scheme</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  Sigue las preferencias de pantalla y horario de tu sistema operativo automáticamente.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Resuelto: {resolvedTheme}
                </span>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">data-theme="{resolvedTheme}"</span>
              </div>
            </div>
          </div>
        )}

        {/* Technical Persistence & Diagnostics Bar */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>
              Persistencia activa: <strong className="text-[var(--text-secondary)]">localStorage.getItem('{storageKey}') = "{theme}"</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)]">
            <span className="px-2 py-0.5 rounded bg-[var(--bg-input)] border border-[var(--border-strong)] text-blue-500 dark:text-blue-400">
              root.dataset.theme = "{resolvedTheme}"
            </span>
          </div>
        </div>
      </div>

      {/* Theme Settings Live Preview Modal */}
      <ThemeSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ThemeModeSettings;

