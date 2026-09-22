import React, { useState, useRef, useEffect } from 'react';
import { Columns, Check, RotateCcw, ChevronUp, ChevronDown, Eye, EyeOff, Search, X } from 'lucide-react';
import { TableColumnConfig } from '../../types';

interface ColumnCustomizerProps {
  columns: TableColumnConfig[];
  onToggleColumn: (id: string) => void;
  onMoveColumn: (id: string, direction: 'up' | 'down') => void;
  onReset: () => void;
  onSetAllVisibility?: (visible: boolean) => void;
  tableName?: string;
}

export const ColumnCustomizer: React.FC<ColumnCustomizerProps> = ({
  columns,
  onToggleColumn,
  onMoveColumn,
  onReset,
  onSetAllVisibility,
  tableName = 'Tabla',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  const visibleCount = columns.filter((c) => c.visible).length;
  const totalCount = columns.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredColumns = columns.filter((col) =>
    col.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <button
        type="button"
        id="btn-column-customizer"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
        title="Personalizar columnas visibles y su orden"
      >
        <Columns className="w-3.5 h-3.5 text-blue-500" />
        <span>Columnas</span>
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          {visibleCount}/{totalCount}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5">
              <Columns className="w-4 h-4 text-blue-500" />
              <h4 className="text-xs font-bold text-[var(--text-primary)]">
                Columnas ({tableName})
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search box if there are more than 5 columns */}
          {columns.length > 5 && (
            <div className="mt-2.5 relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar columna..."
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Quick toggle actions */}
          <div className="flex items-center justify-between mt-2 pt-1 pb-1 text-[11px] text-[var(--text-muted)]">
            <span className="text-[10px]">Arrastra u ordena con flechas</span>
            <div className="flex items-center gap-1.5">
              {onSetAllVisibility && (
                <>
                  <button
                    type="button"
                    onClick={() => onSetAllVisibility(true)}
                    className="hover:text-blue-500 font-medium transition-colors text-[10px]"
                  >
                    Ver todas
                  </button>
                  <span>•</span>
                </>
              )}
              <button
                type="button"
                onClick={onReset}
                className="hover:text-rose-500 font-medium transition-colors flex items-center gap-0.5 text-[10px]"
                title="Restablecer columnas por defecto"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Restablecer</span>
              </button>
            </div>
          </div>

          {/* Column List */}
          <div className="mt-2 max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredColumns.map((col, index) => (
              <div
                key={col.id}
                className={`flex items-center justify-between p-1.5 rounded-lg border transition-all ${
                  col.visible
                    ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                    : 'bg-[var(--bg-canvas)] border-dashed border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60'
                }`}
              >
                <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={col.visible}
                    onChange={() => onToggleColumn(col.id)}
                    className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                  />
                  <span className="text-xs truncate font-medium">{col.label}</span>
                </label>

                {/* Move Up / Down Buttons */}
                <div className="flex items-center gap-0.5 shrink-0 ml-1">
                  <button
                    type="button"
                    onClick={() => onMoveColumn(col.id, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Mover arriba / a la izquierda"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveColumn(col.id, 'down')}
                    disabled={index === filteredColumns.length - 1}
                    className="p-1 rounded hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Mover abajo / a la derecha"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-[10px] text-[var(--text-muted)]">
              Guardado automáticamente
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
