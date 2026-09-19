import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Zap,
  CheckSquare,
  Trophy,
  UserPlus,
  HelpCircle,
  Receipt,
  Clock,
  Send,
  X,
  Plus,
  ArrowRight,
  Split,
  Laptop,
  Cpu
} from 'lucide-react';
import { WorkflowNode } from '../../types';

export interface PresetNodeTemplate {
  type: WorkflowNode['type'];
  title: string;
  description: string;
  icon: string;
  category: 'ai' | 'crm' | 'comm' | 'logic' | 'erp';
  branchLabel?: string;
  config: Record<string, any>;
}

const NODE_PRESETS: PresetNodeTemplate[] = [
  // AI Category
  {
    type: 'action',
    title: 'Calificación de Lead con Gemini IA',
    description: 'Analiza historial de mensajes y asigna un puntaje del 1 al 100.',
    icon: 'Sparkles',
    category: 'ai',
    config: { model: 'gemini-3.8-flash', threshold: 75 },
  },
  {
    type: 'action',
    title: 'Extracción de Intención Comercial IA',
    description: 'Detecta si el contacto tiene intención de compra inmediata o soporte.',
    icon: 'Cpu',
    category: 'ai',
    config: { extractEntities: true },
  },
  {
    type: 'action',
    title: 'Resumen Ejecutivo de Conversación',
    description: 'Sintetiza los últimos 15 mensajes del chat en notas del CRM.',
    icon: 'Sparkles',
    category: 'ai',
    config: { autoNote: true },
  },

  // CRM Category
  {
    type: 'action',
    title: 'Mover Etapa en Pipeline Kanban',
    description: 'Cambia la oportunidad a "Propuesta Enviada" o "Negociación".',
    icon: 'Trophy',
    category: 'crm',
    config: { targetStage: 'proposal' },
  },
  {
    type: 'action',
    title: 'Crear Tarea de Seguimiento SDR',
    description: 'Asigna una llamada comercial para las próximas 24 horas.',
    icon: 'CheckSquare',
    category: 'crm',
    config: { dueInHours: 24, priority: 'High' },
  },
  {
    type: 'action',
    title: 'Asignar Ejecutivo por Round-Robin',
    description: 'Distribuye equitativamente el nuevo lead entre los vendedores activos.',
    icon: 'UserPlus',
    category: 'crm',
    config: { distribution: 'round-robin' },
  },

  // Communication Category
  {
    type: 'action',
    title: 'Enviar Mensaje WhatsApp Oficial',
    description: 'Despacha plantilla homologada con botones de acción interactivos.',
    icon: 'MessageSquare',
    category: 'comm',
    config: { templateId: 'bienvenida_lead_v2' },
  },
  {
    type: 'action',
    title: 'Enviar Notificación por Email',
    description: 'Envía correo con catálogo comercial en PDF adjunto.',
    icon: 'Send',
    category: 'comm',
    config: { template: 'presentacion_corporativa' },
  },

  // Logic & Flow Control
  {
    type: 'condition',
    title: 'Bifurcación If / Else: Score > 70',
    description: 'Divide el flujo en ramas: "Si cumple" o "No cumple".',
    icon: 'Split',
    category: 'logic',
    branchLabel: 'Si cumple',
    config: { field: 'leadScore', operator: 'gt', value: 70 },
  },
  {
    type: 'delay',
    title: 'Pausa de Espera: 24 Horas',
    description: 'Detiene la ejecución durante 1 día antes de reanudar el siguiente paso.',
    icon: 'Clock',
    category: 'logic',
    config: { durationHours: 24 },
  },

  // ERP & Operations
  {
    type: 'action',
    title: 'Emitir Factura Electrónica AFIP',
    description: 'Genera CAE de Factura A o B y envía link de pago MercadoPago.',
    icon: 'Receipt',
    category: 'erp',
    config: { puntoVenta: 5, autoEnvio: true },
  },
];

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (template: PresetNodeTemplate, targetInfo?: { parentNodeId?: string; insertBetween?: { fromId: string; toId: string } }) => void;
  targetInfo?: {
    parentNodeId?: string;
    insertBetween?: { fromId: string; toId: string };
    parentTitle?: string;
  };
}

export const AddNodeModal: React.FC<AddNodeModalProps> = ({
  isOpen,
  onClose,
  onAddNode,
  targetInfo,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ai' | 'crm' | 'comm' | 'logic' | 'erp'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredPresets = NODE_PRESETS.filter((preset) => {
    if (selectedCategory !== 'all' && preset.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        preset.title.toLowerCase().includes(q) ||
        preset.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c1018] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2538] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b2234] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0f1420] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Agregar Nueva Etapa al Flujo</span>
            </h3>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
              {targetInfo?.insertBetween ? (
                <span>Insertar etapa intermedia entre nodos seleccionados.</span>
              ) : targetInfo?.parentNodeId ? (
                <span>Agregar como etapa siguiente de: <strong className="text-cyan-300">{targetInfo.parentTitle || targetInfo.parentNodeId}</strong></span>
              ) : (
                <span>El algoritmo de auto-layout organizará las etapas y líneas automáticamente al añadir.</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#151c2c] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1f283d] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#171e2e] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0e16] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${ selectedCategory === 'all' ? 'bg-emerald-500 text-black' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141b2b] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory('ai')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${ selectedCategory === 'ai' ? 'bg-purple-600 text-white' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141b2b] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
            >
              ✨ Inteligencia Artificial
            </button>
            <button
              onClick={() => setSelectedCategory('comm')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${ selectedCategory === 'comm' ? 'bg-teal-600 text-white' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141b2b] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
            >
              📲 WhatsApp / Email
            </button>
            <button
              onClick={() => setSelectedCategory('crm')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${ selectedCategory === 'crm' ? 'bg-blue-600 text-white' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141b2b] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
            >
              💼 Operaciones CRM
            </button>
            <button
              onClick={() => setSelectedCategory('logic')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${ selectedCategory === 'logic' ? 'bg-amber-600 text-white' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141b2b] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
            >
              🔀 Lógica / Espera
            </button>
          </div>

          <input
            type="text"
            placeholder="Buscar bloque de acción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 text-xs rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#121826] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20293d] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-emerald-500 w-44"
          />
        </div>

        {/* Preset Cards Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {filteredPresets.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => {
                onAddNode(preset, targetInfo);
                onClose();
              }}
              className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#111624] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#161d2f] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e263a] hover:border-emerald-500/40 text-left cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182136] text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold">
                    {preset.category}
                  </span>
                  <span className="text-emerald-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Agregar <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white group-hover:text-emerald-300 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed mt-1">
                  {preset.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#182033] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span>Tipo: {preset.type.toUpperCase()}</span>
                {preset.branchLabel && (
                  <span className="text-cyan-400 font-mono">Bifurcación: {preset.branchLabel}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
