import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  Download,
  RotateCcw,
  X,
  Globe,
  Menu,
  ExternalLink,
  Settings2,
  MoreHorizontal,
  Mic,
  Zap,
  Trophy,
  Command,
  Sun,
  Moon,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Language } from '../../types';
import { ClientumLogo } from '../common/ClientumLogo';
import { ConnectivityIndicator } from '../common/ConnectivityIndicator';
import { FollowupRemindersDropdown } from '../common/FollowupRemindersDropdown';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { ThemeSwitcher } from './ThemeSwitcher';

interface CrmTopHeaderProps {
  onOpenConfig: () => void;
  onOpenVoiceNote: () => void;
  onOpenAutomations: () => void;
  onOpenLeaderboard: () => void;
  hasModuleCredentials?: boolean;
}

export const CrmTopHeader: React.FC<CrmTopHeaderProps> = ({
  onOpenConfig,
  onOpenVoiceNote,
  onOpenAutomations,
  onOpenLeaderboard,
  hasModuleCredentials,
}) => {
  const {
    toggleMobileSidebar,
    activeTab,
    openNewRecordModal,
    openAICopilot,
    currentUser,
    theme,
    setTheme,
    toggleTheme,
    language,
    setLanguage,
    resetToDemoData,
    exitToPublicSite,
    setIsCommandPaletteOpen,
    opportunities,
    tasks,
  } = useCRM();

  // Helper to determine theme for the toggle icon
  // Note: Since CRMContext provides theme (light | dark | system),
  // we need to infer the current 'resolved' state.
  // We can use document.documentElement.classList for reliable state.
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, [theme]);

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);

  // Total alert notifications for reminders
  const totalAlertsCount = React.useMemo(() => {
    const now = Date.now();
    const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
    const rotting = opportunities.filter((o) => {
      if (o.stage === 'won' || o.stage === 'lost') return false;
      const last = new Date(o.updatedAt || o.createdAt).getTime();
      return now - last >= fiveDaysMs;
    }).length;

    const todayStr = new Date().toISOString().split('T')[0];
    const pendingTasks = tasks.filter(
      (t) => t.status !== 'Completed' && t.dueDate <= todayStr
    ).length;

    return rotting + pendingTasks;
  }, [opportunities, tasks]);

  return (
    <header
      id="crm-top-header"
      className="crm-top-header bg-[var(--bg-navbar)] border-b border-[var(--border-subtle)] text-[var(--text-primary)] h-14 px-4 flex items-center justify-between gap-4 shrink-0 z-20 select-none shadow-md"
    >
      {/* Left: Mobile Toggle, Mobile Branding & Active Tab Indicator */}
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <button
          onClick={toggleMobileSidebar}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-muted,#64748b)] dark:text-slate-500 lg:hidden transition-colors cursor-pointer"
          title="Abrir Menú Lateral"
        >
          <Menu className="w-4 h-4 text-slate-600 dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200" />
        </button>

        {/* App Branding: Only shown on mobile/tablets when sidebar is hidden */}
        <div
          id="crm-header-branding"
          onClick={exitToPublicSite}
          className="flex lg:hidden items-center gap-2 cursor-pointer select-none group shrink-0 pr-2 border-r border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800"
          title="Clientum CRM - Ir al sitio público"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-600 p-1 flex items-center justify-center shadow-sm">
            <ClientumLogo className="w-4 h-4 text-[var(--text-primary,#0f172a)] dark:text-white" />
          </div>
          <span className="text-sm font-extrabold text-blue-900 dark:text-white tracking-tight">Clientum</span>
        </div>

        {/* Connectivity Indicator Component */}
        <ConnectivityIndicator />

        {/* Active Tab Breadcrumb Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/60 text-xs font-semibold text-slate-600 dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="capitalize">
            {activeTab === 'dashboard' ? 'Resumen Ejecutivo' :
             activeTab === 'userDashboard' ? 'Mi Panel Personal' :
             activeTab === 'opportunities' ? 'Pipeline & Negocios' :
             activeTab === 'people' ? 'Contactos' :
             activeTab === 'companies' ? 'Empresas & Cuentas' :
             activeTab === 'tasks' ? 'Tareas & Agenda' :
             activeTab === 'whatsapp' ? 'WhatsApp Multiagente' :
             activeTab === 'erp' ? 'ERP & Facturación AFIP' :
             activeTab === 'analytics' ? 'Métricas & BI' :
             activeTab === 'workflows' ? 'Automatizaciones' :
             activeTab === 'customObjects' ? 'Campos & Objetos' :
             activeTab === 'settings' ? 'Roles & Permisos' :
             activeTab}
          </span>
        </div>
      </div>

      {/* Center: Command Palette / Search Trigger */}
      <div className="flex-1 max-w-sm hidden md:flex items-center justify-center">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs transition-all cursor-pointer shadow-inner group"
          title="Abrir Command Palette (Ctrl+K) para buscar contactos o crear negocios"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">Buscar contactos, empresas o comandos...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-semibold shadow-2xs">
            {typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </button>
      </div>

      {/* Right Controls: User Profile, Actions & Utilities */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Module Credentials Action */}
        {hasModuleCredentials && (
          <button
            type="button"
            onClick={onOpenConfig}
            className="hidden lg:flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-900/60 cursor-pointer"
            title="Configurar credenciales de este módulo"
          >
            <Settings2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Configurar API</span>
          </button>
        )}

        {/* AI Copilot Button - Pill Style */}
        <button
          id="crm-header-copilot-btn"
          onClick={openAICopilot}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer ring-1 ring-white/10"
          title="Copilot AI (Alt+K)"
        >
          <Sparkles className="h-3.5 w-3.5 fill-white/20" />
          <span>Copilot AI</span>
        </button>

        {/* AI Voice Note Recorder */}
        <button
          onClick={onOpenVoiceNote}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-muted,#64748b)] dark:text-slate-500 dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/50 text-xs transition-all cursor-pointer"
          title="Grabar nota de voz o llamada con IA"
        >
          <Mic className="w-3.5 h-3.5" />
        </button>

        {/* Active Automations Engine */}
        <button
          onClick={onOpenAutomations}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-muted,#64748b)] dark:text-slate-500 dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/50 text-xs transition-all cursor-pointer"
          title="Workflows y Automatizaciones en vivo"
        >
          <Zap className="w-3.5 h-3.5" />
        </button>

        {/* Followup Reminders Bell */}
        <div className="relative">
          <button
            onClick={() => setIsRemindersOpen((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/40 text-[var(--text-muted,#64748b)] dark:text-slate-500 dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/50 cursor-pointer"
            title="Notificaciones y seguimiento"
          >
            <Bell className="w-4 h-4" />
            {totalAlertsCount > 0 && (
              <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
            )}
          </button>

          <NotificationCenter
            isOpen={isRemindersOpen}
            onClose={() => setIsRemindersOpen(false)}
          />
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 border text-[var(--text-muted,#64748b)] dark:text-slate-500 dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          title="Alternar tema claro/oscuro"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-500" />}
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative ml-1">
          <button
            id="crm-user-profile-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pr-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/90 hover:bg-slate-200/50 dark:hover:bg-slate-700 border border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 transition-all cursor-pointer"
            title={`Usuario: ${currentUser?.name || 'Ejecutivo Comercial'}`}
          >
            <div className="relative w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden border border-blue-400/40 shrink-0">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(currentUser?.name || 'C').charAt(0)}</span>
              )}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-slate-900" />
            </div>

            <div className="hidden xl:flex flex-col text-left leading-none">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[100px]">
                {currentUser?.name || 'Juan Pérez'}
              </span>
              <span className="text-[9px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-500 dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 truncate">
                {currentUser?.role || 'Director Comercial'}
              </span>
            </div>

            <ChevronDown className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-500 dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hidden xl:block" />
          </button>

          {/* User Profile Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 z-40 w-64 rounded-2xl border border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-2xl text-slate-600 dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center border border-blue-400/30 shrink-0">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span>{(currentUser?.name || 'C').charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{currentUser?.name || 'Juan Pérez'}</div>
                    <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-500 dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 truncate">{currentUser?.email || 'juan.perez@empresa.com'}</div>
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-[9px] font-bold uppercase">
                      {currentUser?.role || 'Director Comercial'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-0.5 text-xs font-medium">
                <button
                  onClick={() => { exitToPublicSite(); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sitio Web Público</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-[var(--text-muted)]" />
                </button>

                <div className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                    <span>Idioma</span>
                  </span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="bg-slate-800 text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2 py-0.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="es">ES</option>
                    <option value="en">EN</option>
                    <option value="pt">PT</option>
                  </select>
                </div>

                <button
                  onClick={() => { resetToDemoData(); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors cursor-pointer text-left border-t border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 mt-1 pt-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restablecer Datos de Demo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary "+ Nuevo" Action Button */}
        <button
          id="crm-header-primary-add-btn"
          onClick={() => {
            if (activeTab === 'companies') openNewRecordModal('company');
            else if (activeTab === 'people') openNewRecordModal('person');
            else if (activeTab === 'tasks') openNewRecordModal('task');
            else openNewRecordModal('opportunity');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>
            {activeTab === 'companies'
              ? 'Nueva Empresa'
              : activeTab === 'people'
              ? 'Nuevo Contacto'
              : activeTab === 'tasks'
              ? 'Nueva Tarea'
              : 'Nuevo Negocio'}
          </span>
        </button>

      </div>
    </header>
  );
};
