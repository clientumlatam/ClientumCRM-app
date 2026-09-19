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
            className={`flex flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
              isActive
                ? 'bg-[var(--color-primary)] text-white shadow-xs font-bold'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]'
            } ${isCollapsed ? 'justify-center w-10 flex-none px-0' : ''}`}
          >
            <IconComponent
              className={`h-4 w-4 shrink-0 ${
                isActive
                  ? 'text-white'
                  : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
              }`}
            />
          {!isCollapsed && <span className="truncate">{item.label}</span>}

          {!isCollapsed && item.badge && (
            <span
              className={`ml-auto rounded px-1.5 py-0.5 text-[10px] font-bold ${
                item.badgeColor ||
                (isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--bg-muted)] text-[var(--text-secondary)]')
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
            className={`flex h-8 w-6 items-center justify-center rounded-r-lg transition-colors ${ isActive ? 'text-white/80 hover:text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]' }`}
          >
            <ChevronRight
              className={`h-3.5 w-3.5 transition-transform ${ isExpanded ? 'rotate-90' : '' }`}
            />
          </button>
        )}
      </div>

      {/* Subitems anidados */}
      {hasSub && isExpanded && !isCollapsed && (
        <div className="ml-5 space-y-0.5 border-l-2 pl-2 border-[var(--border-subtle)] dark:border-[#1c2d47]">
          {item.subItems!.map((sub) => {
            const subActive = activeTab === sub.id;
            const SubIcon = sub.icon;
            return (
              <button
                key={sub.id}
                onClick={() => onNavClick(sub.id)}
                aria-current={subActive ? 'page' : undefined}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${ subActive ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]' }`}
              >
                <SubIcon className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
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
