import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Check,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../types';
import { ThemeSettingsModal } from '../settings/ThemeSettingsModal';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (mode: ThemeMode) => {
    setTheme(mode);
    setIsOpen(false);
  };

  const getActiveIcon = () => {
    if (theme === 'system') {
      return <Monitor className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
    }
    if (resolvedTheme === 'dark') {
      return <Moon className="w-3.5 h-3.5 text-blue-400" />;
    }
    return <Sun className="w-3.5 h-3.5 text-amber-500" />;
  };

  const getLabel = () => {
    if (theme === 'system') {
      return `Auto (${systemTheme === 'dark' ? 'Oscuro' : 'Claro'})`;
    }
    return theme === 'dark' ? 'Oscuro' : 'Claro';
  };

  return (
    <>
      <div id="crm-theme-switcher-container" ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
        <button
          id="crm-theme-switcher-btn"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-sm ${
            isOpen
              ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-300'
              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 dark:bg-[#0f1117] dark:hover:bg-[#1a1d24] dark:text-slate-300 dark:border-[#2d3340]'
          }`}
          title={`Tema actual: ${getLabel()}`}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {getActiveIcon()}
          {showLabel && <span className="hidden sm:inline text-[11px]">{getLabel()}</span>}
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div
            id="crm-theme-switcher-dropdown"
            className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 dark:border-[#2d3340] bg-white dark:bg-[#0f1117] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-900 dark:text-slate-100"
            role="menu"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-[#2d3340] mb-1 flex items-center justify-between">
              <span>Modo de Pantalla</span>
              <span className="font-mono text-[9px] text-blue-600 dark:text-blue-400">Clientum</span>
            </div>

            {[
              { id: 'light', label: 'Modo Claro', icon: Sun, color: 'amber' },
              { id: 'dark', label: 'Modo Oscuro', icon: Moon, color: 'blue' },
              { id: 'system', label: 'Automático (Sistema)', icon: Monitor, color: 'indigo' },
            ].map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id as ThemeMode)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-slate-50 dark:hover:bg-[#1a1d24] text-slate-600 dark:text-slate-400'
                  }`}
                  role="menuitem"
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'bg-slate-100 dark:bg-[#1a1d24] text-slate-500 dark:text-slate-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold">{option.label}</div>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ml-auto" />}
                </button>
              );
            })}

            <div className="border-t border-slate-100 dark:border-[#2d3340] my-1 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                role="menuitem"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Vista Previa & Ajustes...</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ThemeSettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ThemeSwitcher;
