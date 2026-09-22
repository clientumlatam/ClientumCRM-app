import React, { useState } from 'react';
import {
  Sliders,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X,
  GripVertical,
  Columns,
  Save,
} from 'lucide-react';
import { TableColumnConfig } from '../../types';

export const DEFAULT_OPPORTUNITY_COLUMNS: TableColumnConfig[] = [
  { id: 'dealName', label: 'Nombre del Trato', visible: true, order: 0, isDefault: true, fixed: 'left' },
  { id: 'amount', label: 'Monto ($)', visible: true, order: 1, isDefault: true },
  { id: 'stage', label: 'Etapa del Pipeline', visible: true, order: 2, isDefault: true },
  { id: 'companyName', label: 'Empresa Asociada', visible: true, order: 3, isDefault: true },
  { id: 'priority', label: 'Prioridad', visible: true, order: 4, isDefault: true },
  { id: 'closeDate', label: 'Fecha Estimada Cierre', visible: true, order: 5, isDefault: true },
  { id: 'assignedTo', label: 'Responsable (Owner)', visible: true, order: 6, isDefault: true },
  { id: 'contactName', label: 'Contacto Principal', visible: false, order: 7 },
  { id: 'probability', label: 'Probabilidad (%)', visible: false, order: 8 },
  { id: 'tags', label: 'Etiquetas', visible: false, order: 9 },
];

interface TableSettingsProps {
  columns: TableColumnConfig[];
  onSave: (newColumns: TableColumnConfig[]) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const TableSettings: React.FC<TableSettingsProps> = ({
  columns,
  onSave,
  onClose,
  isOpen,
}) => {
  const [localColumns, setLocalColumns] = useState<TableColumnConfig[]>(() => {
    return [...columns].sort((a, b) => a.order - b.order);
  });
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const toggleVisibility = (id: string) => {
    setLocalColumns((prev) =>
      prev.map((col) => {
        if (col.id === id) {
          // Keep primary column always visible
          if (col.id === 'dealName') return col;
          return { ...col, visible: !col.visible };
        }
        return col;
      })
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setLocalColumns((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy.map((col, idx) => ({ ...col, order: idx }));
    });
  };

  const moveDown = (index: number) => {
    if (index === localColumns.length - 1) return;
    setLocalColumns((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy.map((col, idx) => ({ ...col, order: idx }));
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    setLocalColumns((prev) => {
      const copy = [...prev];
      const [draggedItem] = copy.splice(draggedIdx, 1);
      copy.splice(index, 0, draggedItem);
      return copy.map((col, idx) => ({ ...col, order: idx }));
    });
    setDraggedIdx(index);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const handleReset = () => {
    setLocalColumns([...DEFAULT_OPPORTUNITY_COLUMNS]);
  };

  const handleApply = () => {
    const updated = localColumns.map((col, idx) => ({ ...col, order: idx }));
    onSave(updated);
    onClose();
  };

  const visibleCount = localColumns.filter((c) => c.visible).length;

  return (
    <div
      id="table-settings-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="table-settings-modal-container"
        className="w-full max-w-md bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202738] shadow-2xl flex flex-col overflow-hidden text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] flex items-center justify-between bg-[var(--bg-card,#ffffff)] dark:bg-[#151a28]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Columns className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                Personalizar Columnas de la Tabla
              </h3>
              <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                {visibleCount} de {localColumns.length} columnas visibles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-muted,#f1f5f9)] dark:hover:bg-[#1f2638] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <div className="px-4 py-2.5 bg-blue-500/5 dark:bg-blue-500/10 border-b border-blue-500/15 text-[11px] text-blue-400 dark:text-blue-300 flex items-center justify-between">
          <span>Arrastra o usa las flechas para reordenar columnas.</span>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer</span>
          </button>
        </div>

        {/* Column List */}
        <div className="p-3 space-y-1.5 max-h-[380px] overflow-y-auto">
          {localColumns.map((col, index) => {
            const isDealName = col.id === 'dealName';
            return (
              <div
                key={col.id}
                draggable={!isDealName}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all select-none ${
                  draggedIdx === index
                    ? 'border-blue-500 bg-blue-500/10 opacity-60'
                    : col.visible
                    ? 'border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293b] bg-[var(--bg-card,#ffffff)] dark:bg-[#161b29]'
                    : 'border-transparent bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e1118] opacity-50'
                }`}
              >
                {/* Left Grip & Label */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`cursor-grab active:cursor-grabbing text-[var(--text-muted,#64748b)] dark:text-slate-400 ${
                      isDealName ? 'invisible' : ''
                    }`}
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  <button
                    onClick={() => toggleVisibility(col.id)}
                    disabled={isDealName}
                    className={`p-1 rounded-md transition-colors ${
                      col.visible
                        ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20'
                        : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:bg-[var(--bg-muted,#f1f5f9)] dark:hover:bg-[#1f2638]'
                    }`}
                    title={col.visible ? 'Ocultar columna' : 'Mostrar columna'}
                  >
                    {col.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <span
                    className={`text-xs truncate ${
                      col.visible
                        ? 'font-medium text-[var(--text-primary,#0f172a)] dark:text-slate-200'
                        : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 line-through'
                    }`}
                  >
                    {col.label}
                  </span>

                  {isDealName && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold uppercase tracking-wider">
                      Fija
                    </span>
                  )}
                </div>

                {/* Right Reorder Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-muted,#f1f5f9)] dark:hover:bg-[#1e2434] disabled:opacity-20 transition-colors"
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === localColumns.length - 1}
                    className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-muted,#f1f5f9)] dark:hover:bg-[#1e2434] disabled:opacity-20 transition-colors"
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] bg-[var(--bg-card,#ffffff)] dark:bg-[#141826] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary,#475569)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-muted,#f1f5f9)] dark:hover:bg-[#1d2334] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Preferencias</span>
          </button>
        </div>
      </div>
    </div>
  );
};
