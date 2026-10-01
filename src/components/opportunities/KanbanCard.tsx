import React, { useState } from 'react';
import { Building2, Calendar, Flame, Mail, MessageCircle, Phone, Sparkles, User, ChevronRight, GripVertical } from 'lucide-react';
import { Opportunity, Person, StageId } from '../../types';
import { STAGES } from '../../data/initialData';

export interface KanbanCardProps {
  opp: Opportunity;
  compactCards: boolean;
  showCardTags: boolean;
  showCardDates: boolean;
  isDragging?: boolean;
  getPriorityColor: (p: string) => string;
  getContact: (opp: Opportunity) => Person | undefined;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onSelectRecord: (id: string) => void;
  onWhatsAppClick: (opp: Opportunity) => void;
  onAICopilotClick: (opp: Opportunity) => void;
  onMoveStage?: (id: string, stageId: StageId) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = React.memo(({
  opp,
  compactCards,
  showCardTags,
  showCardDates,
  isDragging = false,
  getPriorityColor,
  getContact,
  onDragStart,
  onDragEnd,
  onSelectRecord,
  onWhatsAppClick,
  onAICopilotClick,
  onMoveStage,
}) => {
  const [showStageMenu, setShowStageMenu] = useState(false);
  const nowMs = Date.now();
  const lastUpdateMs = new Date(opp.updatedAt || opp.createdAt).getTime();
  const daysStagnant = Math.max(1, Math.floor((nowMs - lastUpdateMs) / (1000 * 60 * 60 * 24)));
  const isRotting = opp.stage !== 'won' && opp.stage !== 'lost' && daysStagnant >= 5;
  const contact = getContact(opp);

  return (
    <div
      id={`deal-card-${opp.id}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', opp.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(e, opp.id);
      }}
      onDragEnd={(e) => {
        if (onDragEnd) onDragEnd(e);
      }}
      onClick={() => onSelectRecord(opp.id)}
      className={`${compactCards ? 'p-2.5' : 'p-3'} crm-kanban-card group relative transition-all duration-150 ${
        isDragging
          ? 'opacity-40 border-2 border-dashed border-blue-500 scale-95 shadow-inner cursor-grabbing bg-blue-50/20'
          : 'hover:shadow-md cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Drag Handle & Quick Stage Selector Header */}
      <div className="flex items-center justify-between gap-1.5 mb-1 text-[10px] text-[var(--text-muted)]">
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3 h-3 text-[var(--text-muted)] cursor-grab" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Trato</span>
        </div>

        {/* Quick Stage Move Dropdown Button */}
        {onMoveStage && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowStageMenu(!showStageMenu)}
              className="px-1.5 py-0.5 rounded bg-[var(--bg-muted)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium flex items-center gap-0.5 transition-colors cursor-pointer"
              title="Cambiar etapa rápidamente"
            >
              <span>Mover</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </button>

            {showStageMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1">
                  Mover a etapa:
                </div>
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setShowStageMenu(false);
                      onMoveStage(opp.id, s.id as StageId);
                    }}
                    disabled={opp.stage === s.id}
                    className={`w-full text-left px-2.5 py-1 text-[11px] font-medium flex items-center gap-1.5 hover:bg-[var(--bg-muted)] cursor-pointer transition-colors ${
                      opp.stage === s.id ? 'opacity-40 bg-[var(--bg-muted)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deal Name & Amount */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-blue-600 transition-colors line-clamp-2">
          {opp.name}
        </h4>
        <span className="text-xs font-bold font-mono text-[var(--text-primary)] shrink-0">
          ${opp.amount.toLocaleString()}
        </span>
      </div>

      {/* Rotting Deal Indicator */}
      {isRotting && (
        <div className="mb-2 flex items-center gap-1">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs"
            title={`Este trato lleva ${daysStagnant} días sin actividad comercial`}
          >
            <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
            <span>{daysStagnant}d estancado</span>
          </span>
        </div>
      )}

      {/* Company & Contact Link */}
      {opp.companyName && (
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] mb-2 truncate font-medium">
          <Building2 className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400 shrink-0" />
          <span className="truncate">{opp.companyName}</span>
          {opp.contactName && (
            <>
              <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300">•</span>
              <span className="truncate text-[var(--text-muted)]">{opp.contactName}</span>
            </>
          )}
        </div>
      )}

      {contact && (
        <div className="mb-2 space-y-1 text-[10px] text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400 shrink-0" />
            <span className="truncate">{opp.contactName || `${contact.firstName} ${contact.lastName}`}</span>
          </div>
          {!compactCards && (contact.email || contact.phone) && (
            <div className="flex items-center gap-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 hover:text-blue-600 truncate"
                  title={`Enviar email a ${contact.email}`}
                >
                  <Mail className="w-3 h-3" />
                  <span className="truncate max-w-[132px]">{contact.email}</span>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 hover:text-blue-600 shrink-0"
                  title={`Llamar a ${contact.phone}`}
                >
                  <Phone className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tags & Priority */}
      {showCardTags && (
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getPriorityColor( opp.priority )}`}
          >
            {opp.priority}
          </span>
          {opp.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)] truncate max-w-[90px]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Info & Owner */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
        {showCardDates ? (
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <Calendar className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
            <span>{opp.closeDate}</span>
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1.5">
          <button
            id={`deal-whatsapp-quick-${opp.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onWhatsAppClick(opp);
            }}
            className="crm-icon-action-btn hover:bg-emerald-50 hover:text-emerald-600"
            title="Enviar WhatsApp al contacto del negocio"
          >
            <MessageCircle className="w-3 h-3 text-emerald-500" />
          </button>
          <button
            id={`deal-ai-summary-${opp.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAICopilotClick(opp);
            }}
            className="crm-icon-action-btn hover:bg-blue-50 hover:text-blue-600"
            title="Generar análisis de IA"
          >
            <Sparkles className="w-3 h-3" />
          </button>
          <span className="text-[10px] font-semibold text-[var(--text-secondary)] truncate max-w-[80px]">
            {opp.assignedTo.split(' ')[0]}
          </span>
        </div>
      </div>
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';
