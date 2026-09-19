import React, { useState, useMemo, useCallback } from 'react';
import {
  Home,
  Calendar,
  Briefcase,
  Building2,
  Users2,
  CheckSquare,
  BarChart3,
  Settings,
  Sparkles,
  Search,
  Plus,
  Compass,
  ChevronDown,
  ChevronRight,
  Database,
  MessageSquare,
  Receipt,
  CreditCard,
  Target,
  Bot,
  Cpu,
  MapPin,
  Send,
  Workflow,
  FileSpreadsheet,
  FileCheck,
  GraduationCap,
  Store,
  LogOut,
  ExternalLink,
  Globe,
  Mail,
  Inbox,
  FolderKanban,
  Boxes,
  Sun,
  Moon,
  BookOpen,
  ShieldAlert,
  Layers,
  HardDrive,
  Code2,
  LayoutDashboard,
  ShieldCheck,
  Shield,
  Zap,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useTheme } from '../../context/ThemeContext';
import { ActiveTab } from '../../types';
import { ClientumLogo } from '../common/ClientumLogo';
import { ClientumNavyIcon } from '../common/ClientumNavyIcons';
import { ModuleCredentialsModal } from '../settings/ModuleCredentialsModal';
import { UserProfileModal } from '../auth/UserProfileModal';
import { SidebarItem } from './SidebarItem';
import { sidebarConfig, NavSection, SidebarNavItem } from '../../config/sidebar';

export const Sidebar: React.FC = React.memo(() => {
  const {
    activeTab,
    setActiveTab,
    setIsCommandPaletteOpen,
    openNewRecordModal,
    openAICopilot,
    opportunities,
    setSelectedRecord,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    exitToPublicSite,
    logout,
    currentUser,
  } = useCRM();

  const { resolvedTheme, toggleTheme } = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    opportunities: true,
    people: true,
    tasks: true,
    whatsapp: true,
    agenteOS: true,
    operations: true,
    customObjects: true,
  });

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    '5. Infraestructura & Sistema': false,
  });

  const [activeConfigModule, setActiveConfigModule] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const userDisplayName = useMemo(() => {
    if (currentUser?.name && currentUser.name.trim()) {
      return currentUser.name.trim();
    }
    if (currentUser?.email) {
      const handle = currentUser.email.split('@')[0];
      return handle
        .split(/[._-]/)
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(' ');
    }
    return 'Usuario Clientum';
  }, [currentUser?.name, currentUser?.email]);

  const userInitials = useMemo(() => {
    if (currentUser?.name && currentUser.name.trim()) {
      const parts = currentUser.name.trim().split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (currentUser?.email) {
      const handle = currentUser.email.split('@')[0];
      const parts = handle.split(/[._-]/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return handle.slice(0, 2).toUpperCase();
    }
    return 'CL';
  }, [currentUser?.name, currentUser?.email]);

  const toggleSubmenu = useCallback((itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  const navSections: NavSection[] = sidebarConfig;

  const filteredNavSections = useMemo(() => {
    if (!searchTerm.trim()) return navSections;
    const term = searchTerm.toLowerCase();
    return navSections.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.label.toLowerCase().includes(term) || 
        (item.subItems && item.subItems.some(sub => sub.label.toLowerCase().includes(term)))
      )
    })).filter(section => section.items.length > 0);
  }, [searchTerm, navSections]);

  const handleNavClick = useCallback((tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(false);
    }
  }, [setActiveTab, setIsMobileSidebarOpen]);

  return (
    <>
      {/* Backdrop para mobile con accesibilidad */}
      {isMobileSidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Cerrar barra lateral de navegación"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') setIsMobileSidebarOpen(false);
          }}
        />
      )}

      <aside
        id="clientum-unified-sidebar"
        role="navigation"
        aria-label="Menú principal de navegación"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r transition-all duration-200 ease-in-out lg:static lg:translate-x-0 ${ isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0' } ${isCollapsed ? 'w-20' : 'w-72'} bg-[var(--sidebar-bg)] border-[var(--sidebar-border)] text-[var(--sidebar-text-primary)]`}
      >
        {/* Collapse Toggle Button (Floating on Edge) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-20 hidden lg:flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] shadow-md hover:bg-[var(--color-primary)] hover:text-white transition-colors z-30 cursor-pointer"
          title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <ChevronRight className={`h-3 w-3 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>

        {/* Encabezado del Sistema */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4 border-[var(--border-subtle)]">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md p-1 overflow-hidden group cursor-pointer"
            aria-label="Ir al Resumen Ejecutivo"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-indigo-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30 shrink-0">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="block font-bold leading-tight tracking-tight text-[var(--text-primary)] whitespace-nowrap text-sm">
                  ClientumOS
                </span>
                <span className="block text-[10px] font-medium text-[var(--text-muted)] whitespace-nowrap">
                  Enterprise Suite v4.2
                </span>
              </div>
            )}
          </button>

          {!isCollapsed && (
            <button
              onClick={() => openNewRecordModal('opportunity')}
              aria-label="Creación Rápida"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] shrink-0 shadow-sm"
              title="Creación Rápida"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Acceso a Buscador y Portal Público */}
        <div className="space-y-1.5 border-b p-3 border-[var(--border-subtle)]/80 dark:border-[#1c2d47]">
          <div className="relative group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors ${searchTerm ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)] group-focus-within:text-[var(--color-primary)]'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isCollapsed ? "" : "Buscar en ClientumOS..."}
              className={`w-full bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-lg text-xs py-2 focus:outline-hidden focus:ring-1 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]/50 transition-all ${isCollapsed ? 'px-0 text-center w-10 mx-auto' : 'pl-9 pr-3'}`}
            />
          </div>

          {!isCollapsed && (
            <button
              onClick={exitToPublicSite}
              className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-light)] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            >
              <span className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                <span>Ver Portal Público</span>
              </span>
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Lista Jerárquica de Secciones */}
        <div className="flex-1 space-y-4 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-[#1c2d47]">
          {filteredNavSections.map((section) => {
            const isSectionCollapsed = collapsedSections[section.label];
            return (
              <div key={section.id} className="space-y-1">
                {!isCollapsed && (
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider uppercase text-[var(--text-muted)] hover:text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 dark:hover:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                    onClick={() =>
                      setCollapsedSections((prev) => ({
                        ...prev,
                        [section.label]: !isSectionCollapsed,
                      }))
                    }
                    aria-expanded={!isSectionCollapsed}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${ section.id === 'main' ? 'bg-blue-500' : section.id === 'communication' ? 'bg-emerald-500' : section.id === 'ai' ? 'bg-indigo-500' : section.id === 'operations' ? 'bg-amber-500' : 'bg-purple-500' }`} />
                      <span>{section.label}</span>
                    </span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${isSectionCollapsed ? '-rotate-90' : ''}`}
                    />
                  </button>
                )}

                {isCollapsed && section.categoryIcon && (
                  <div className="flex justify-center py-2 border-b border-slate-100 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/40 mb-2">
                    <ClientumNavyIcon
                      category={section.categoryIcon}
                      size={18}
                      className="shrink-0 rounded shadow-sm opacity-60"
                    />
                  </div>
                )}

                {(!isSectionCollapsed || isCollapsed) && (
                  <nav className="space-y-0.5" aria-label={`Submenú ${section.label}`}>
                    {section.items.map((item) => (
                      <SidebarItem
                        key={item.id}
                        item={item}
                        isActive={activeTab === item.id}
                        isExpanded={Boolean(expandedMenus[item.id])}
                        isCollapsed={isCollapsed}
                        activeTab={activeTab}
                        onNavClick={handleNavClick}
                        onToggleSubmenu={toggleSubmenu}
                      />
                    ))}
                  </nav>
                )}
              </div>
            );
          })}
        </div>

        {/* Perfil & Controles de Usuario */}
        <div className={`flex flex-col border-t border-[var(--border-subtle)]/80 dark:border-[#1c2d47] bg-slate-50 dark:bg-slate-900/10 ${isCollapsed ? 'items-center py-4 px-2' : 'p-3'}`}>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className={`flex items-center gap-2 truncate text-left group hover:opacity-90 transition-all cursor-pointer ${isCollapsed ? 'justify-center w-full' : 'w-full mb-3'}`}
            title={`Perfil: ${userDisplayName}`}
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={userDisplayName}
                className="h-8 w-8 shrink-0 rounded-full object-cover border border-[var(--border-default)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 shadow-xs"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const sibling = e.currentTarget.nextElementSibling;
                  if (sibling) (sibling as HTMLElement).style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] font-bold text-white text-xs shadow-xs ${ currentUser?.avatar ? 'hidden' : 'flex' }`}
            >
              {userInitials}
            </div>
            {!isCollapsed && (
              <div className="truncate min-w-0">
                <span className="block truncate text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                  {userDisplayName}
                </span>
                <span className="block truncate text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  {currentUser?.role || 'Admin'}
                </span>
              </div>
            )}
          </button>

          <div className={`flex items-center gap-1 shrink-0 ${isCollapsed ? 'flex-col mt-4 w-full' : 'justify-between w-full'}`}>
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4 text-[var(--color-warning)]" /> : <Moon className="h-4 w-4 text-[var(--color-primary)]" />}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={() => logout()}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Modal de Perfil de Usuario */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Modal de Credenciales si se solicita */}
      {activeConfigModule && (
        <ModuleCredentialsModal
          moduleId={activeConfigModule}
          onClose={() => setActiveConfigModule(null)}
        />
      )}
    </>
  );
});
