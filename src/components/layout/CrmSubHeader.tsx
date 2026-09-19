import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Bot,
  FileCheck,
  Globe,
  Compass,
  Settings,
  Zap,
  BarChart3,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { ActiveTab } from '../../types';

interface SubHeaderItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const CrmSubHeader: React.FC = () => {
  const { activeTab, setActiveTab } = useCRM();

  const subHeaderNavItems: SubHeaderItem[] = [
    { id: 'dashboard', label: 'Dashboard Directivo', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Pipeline', icon: Briefcase },
    { id: 'whatsapp', label: 'WACE Hub', icon: MessageSquare, badge: 'IA' },
    { id: 'agenteOS', label: 'AgenteOS', icon: Bot, badge: 'Roles' },
    { id: 'propuestas', label: 'Brochures', icon: FileCheck },
    { id: 'industryLanding', label: 'Web Capture', icon: Globe },
    { id: 'operations', label: 'Operaciones', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div
      id="crm-sub-header-navigation"
      className="bg-slate-50 dark:bg-[#0f172a] border-b border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 text-slate-600 dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 h-10 px-4 flex items-center justify-between gap-2 overflow-x-auto shrink-0 select-none no-scrollbar z-20 shadow-sm transition-colors"
    >
      <div className="flex items-center gap-3 min-w-max">
        <div className="flex items-center space-x-2 text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted,#64748b)] dark:text-slate-500 font-bold text-[10px] tracking-widest shrink-0 uppercase">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>ACCESOS RÁPIDOS:</span>
          <span className="text-[var(--text-primary,#0f172a)] dark:text-slate-200 dark:text-slate-700 ml-1">|</span>
        </div>

        <div className="flex items-center gap-2">
          {subHeaderNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`quick-pill px-3 py-1 rounded-full text-[11px] font-semibold flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${ isActive ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-slate-200 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/60' }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-500 dark:text-[var(--text-muted,#64748b)] dark:text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[8px] font-mono font-bold px-1 py-0.1 rounded-full ${ isActive ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
