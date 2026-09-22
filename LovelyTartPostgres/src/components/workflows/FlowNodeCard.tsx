import React, { useState, useRef } from 'react';
import {
  Sparkles,
  MessageSquare,
  Zap,
  Trash2,
  Trophy,
  UserPlus,
  CheckSquare,
  HelpCircle,
  Clock,
  ArrowRight,
  Receipt,
  Cpu,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Copy,
  CheckCircle2,
  Loader2,
  Plus
} from 'lucide-react';
import { LaidOutNode } from './flowAutoLayout';

interface FlowNodeCardProps {
  node: LaidOutNode;
  direction: 'LR' | 'TB';
  isSelected: boolean;
  isSimulating: boolean;
  onSelect: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  onMoveStage: (nodeId: string, direction: 'prev' | 'next') => void;
  onAddChildNode: (parentNodeId: string, branchLabel?: string) => void;
  onDragStart: (nodeId: string, e: React.MouseEvent) => void;
}

export const FlowNodeCard: React.FC<FlowNodeCardProps> = ({
  node,
  direction,
  isSelected,
  isSimulating,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveStage,
  onAddChildNode,
  onDragStart,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getNodeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'MessageSquare': return MessageSquare;
      case 'UserPlus': return UserPlus;
      case 'Trophy': return Trophy;
      case 'CheckSquare': return CheckSquare;
      case 'Receipt': return Receipt;
      case 'Cpu': return Cpu;
      case 'Mail': return Mail;
      case 'Clock': return Clock;
      case 'HelpCircle': return HelpCircle;
      default: return Zap;
    }
  };

  const Icon = getNodeIcon(node.icon);
  const isTrigger = node.type === 'trigger';
  const isCondition = node.type === 'condition';

  // Badge and theme colors based on node type
  let badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  let iconContainerColor = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  let borderAccent = 'hover:border-blue-500/50';

  if (isTrigger) {
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    iconContainerColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    borderAccent = 'border-emerald-500/40 hover:border-emerald-500/60';
  } else if (isCondition) {
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    iconContainerColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    borderAccent = 'border-amber-500/40 hover:border-amber-500/60';
  } else if (node.icon === 'Sparkles') {
    badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    iconContainerColor = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    borderAccent = 'hover:border-purple-500/50';
  } else if (node.icon === 'MessageSquare') {
    badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/30';
    iconContainerColor = 'bg-teal-500/15 text-teal-400 border-teal-500/30';
    borderAccent = 'hover:border-teal-500/50';
  }

  return (
    <div
      id={`flow-node-${node.id}`}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        width: `${node.width}px`,
        height: `${node.height}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(node.id)}
      className={`absolute select-none cursor-grab active:cursor-grabbing group transition-all duration-200 rounded-xl p-3.5 flex flex-col justify-between border shadow-xl ${ isSelected ? 'bg-[var(--bg-card,#ffffff)] dark:bg-[#151b29] ring-2 ring-emerald-500 shadow-emerald-500/20 z-30' : 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0f131d]/95 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#141a27] z-10' } ${borderAccent} ${ node.status === 'running' ? 'ring-2 ring-blue-500 animate-pulse' : '' } ${node.status === 'success' ? 'ring-1 ring-emerald-500/60' : ''}`}
    >
      {/* Node Header & Drag Handle */}
      <div
        className="flex items-start justify-between gap-2 cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => onDragStart(node.id, e)}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${iconContainerColor}`}
          >
            {node.status === 'running' ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            ) : node.status === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white truncate group-hover:text-cyan-300 transition-colors">
              {node.title}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border font-semibold ${badgeColor}`}
              >
                {node.type}
              </span>
              <span className="text-[9px] font-mono text-[var(--text-muted)]">
                Etapa {node.stageIndex + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Node Actions Bar */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Shift Stage backward */}
          <button
            title="Mover a etapa anterior"
            onClick={(e) => {
              e.stopPropagation();
              onMoveStage(node.id, 'prev');
            }}
            disabled={node.stageIndex === 0}
            className="p-1 rounded bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2438] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#253048] disabled:opacity-30 text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white cursor-pointer"
          >
            {direction === 'LR' ? (
              <ChevronLeft className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3" />
            )}
          </button>

          {/* Shift Stage forward */}
          <button
            title="Mover a etapa siguiente"
            onClick={(e) => {
              e.stopPropagation();
              onMoveStage(node.id, 'next');
            }}
            className="p-1 rounded bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2438] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#253048] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white cursor-pointer"
          >
            {direction === 'LR' ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          {/* Duplicate node */}
          <button
            title="Duplicar etapa"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(node.id);
            }}
            className="p-1 rounded bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2438] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#253048] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white cursor-pointer"
          >
            <Copy className="w-3 h-3" />
          </button>

          {/* Delete node (not allowed on single root trigger) */}
          {!isTrigger && (
            <button
              title="Eliminar etapa"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              className="p-1 rounded bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2438] hover:bg-rose-500/20 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Description Snippet */}
      <p className="text-[10.5px] text-[var(--text-muted,#64748b)] dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
        {node.description}
      </p>

      {/* Footer Details / Action Triggers */}
      <div className="flex items-center justify-between pt-1.5 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c2333] text-[9.5px]">
        {node.branchLabel ? (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2230] text-cyan-300 font-mono">
            Rama: {node.branchLabel}
          </span>
        ) : (
          <span className="text-[var(--text-muted)] font-mono">ID: {node.id}</span>
        )}

        {/* Quick Add Child button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddChildNode(node.id);
          }}
          className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400 hover:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer transition-all"
        >
          <Plus className="w-2.5 h-2.5" />
          <span>Etapa Siguiente</span>
        </button>
      </div>

      {/* Visual Port Handles (Input & Output connection anchors) */}
      {/* Input Port (Left in LR, Top in TB) */}
      {!isTrigger && (
        <div
          title="Punto de entrada de datos"
          className={`absolute w-3 h-3 rounded-full bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e273b] border-2 border-emerald-400 shadow-sm z-20 ${ direction === 'LR' ? '-left-1.5 top-1/2 -translate-y-1/2' : '-top-1.5 left-1/2 -translate-x-1/2' }`}
        />
      )}

      {/* Output Port (Right in LR, Bottom in TB) */}
      <div
        title="Punto de salida hacia siguiente etapa"
        onClick={(e) => {
          e.stopPropagation();
          onAddChildNode(node.id);
        }}
        className={`absolute w-3 h-3 rounded-full bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e273b] border-2 border-cyan-400 hover:scale-125 transition-transform cursor-pointer shadow-sm z-20 ${ direction === 'LR' ? '-right-1.5 top-1/2 -translate-y-1/2' : '-bottom-1.5 left-1/2 -translate-x-1/2' }`}
      />
    </div>
  );
};
