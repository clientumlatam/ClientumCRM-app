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
    { id: 'dashboard', label: 'Panel Directivo', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Pipeline Kanban', icon: Briefcase },
    { id: 'whatsapp', label: 'WhatsApp WACE', icon: MessageSquare, badge: 'IA' },
    { id: 'agenteOS', label: 'AgenteOS (IA)', icon: Bot, badge: 'Roles' },
    { id: 'propuestas', label: 'Propuestas PDF', icon: FileCheck },
    { id: 'industryLanding', label: 'Web Capture', icon: Globe },
    { id: 'operations', label: 'Operaciones', icon: Compass },
    { id: 'analytics', label: 'BI Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Ajustes de Sistema', icon: Settings },
  ];

  return (
    <div
      id="crm-sub-header-navigation"
      className="bg-[var(--bg-navbar)] border-b border-[var(--border-subtle)] text-[var(--text-primary)] h-10 px-4 flex items-center justify-between gap-2 overflow-x-auto shrink-0 select-none no-scrollbar z-20 shadow-sm transition-colors"
    >
      <div className="flex items-center gap-3 min-w-max">
        <div className="flex items-center space-x-2 text-[var(--text-secondary)] font-bold text-[10px] tracking-widest shrink-0 uppercase">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>ACCESOS RÁPIDOS:</span>
          <span className="text-[var(--border-subtle)] ml-1">|</span>
        </div>

        <div className="flex items-center gap-2">
          {subHeaderNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`quick-pill px-3 py-1 rounded-full text-[11px] font-semibold flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${ isActive ? 'bg-[var(--color-primary)] text-[var(--bg-navbar)] shadow-sm' : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]' }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-[var(--bg-navbar)]' : 'text-[var(--text-secondary)]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[8px] font-mono font-bold px-1 py-0.1 rounded-full ${ isActive ? 'bg-[var(--bg-navbar)]/20 text-[var(--bg-navbar)]' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20' }`}
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
