import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ActiveTab } from '../../types';

export interface SidebarNavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  configurable?: boolean;
  subItems?: SidebarNavItem[];
  defaultExpanded?: boolean;
}

export interface SidebarItemProps {
  item: SidebarNavItem;
  isActive: boolean;
  isExpanded: boolean;
  isCollapsed?: boolean;
  activeTab: ActiveTab;
  onNavClick: (id: ActiveTab) => void;
  onToggleSubmenu: (id: string, e: React.MouseEvent) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = React.memo(({
  item,
  isActive,
  isExpanded,
  isCollapsed = false,
  activeTab,
  onNavClick,
  onToggleSubmenu,
}) => {
  const hasSub = item.subItems && item.subItems.length > 0;
  const IconComponent = item.icon;

  return (
    <div className="space-y-0.5">
      <div className={`group relative flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          <button
            onClick={() => onNavClick(item.id)}
            aria-current={isActive ? 'page' : undefined}
            title={isCollapsed ? item.label : undefined}
            className={`relative flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-150 focus:outline-hidden ${
              isActive
                ? 'bg-[#002B5C] text-white shadow-xs font-bold before:absolute before:-left-1.5 before:top-2.5 before:bottom-2.5 before:w-1.5 before:bg-[#0056B3] before:rounded-full'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/90 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            } ${isCollapsed ? 'justify-center w-10 flex-none px-0' : ''}`}
          >
            <IconComponent
              className={`h-4 w-4 shrink-0 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white'
              }`}
            />
          {!isCollapsed && <span className="truncate">{item.label}</span>}

          {!isCollapsed && item.badge && (
            <span
              className={`ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                item.badgeColor ||
                (isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
              }`}
            >
              {item.badge}
            </span>
          )}
        </button>

        {hasSub && !isCollapsed && (
          <button
            onClick={(e) => onToggleSubmenu(item.id, e)}
            aria-label={`Expandir subopciones de ${item.label}`}
            className={`flex h-8 w-6 items-center justify-center rounded-r-lg transition-colors cursor-pointer ${
              isActive
                ? 'text-white/80 hover:text-white'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <ChevronRight
              className={`h-3.5 w-3.5 transition-transform ${ isExpanded ? 'rotate-90' : '' }`}
            />
          </button>
        )}
      </div>

      {/* Subitems anidados */}
      {hasSub && isExpanded && !isCollapsed && (
        <div className="ml-5 space-y-0.5 border-l-2 pl-2 border-slate-200 dark:border-[#1c2d47]">
          {item.subItems!.map((sub) => {
            const subActive = activeTab === sub.id;
            const SubIcon = sub.icon;
            return (
              <button
                key={sub.id}
                onClick={() => onNavClick(sub.id)}
                aria-current={subActive ? 'page' : undefined}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  subActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#002B5C] dark:text-blue-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <SubIcon className={`h-3.5 w-3.5 shrink-0 ${subActive ? 'text-[#002B5C] dark:text-blue-300' : 'text-slate-400'}`} />
                <span className="truncate">{sub.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

SidebarItem.displayName = 'SidebarItem';
