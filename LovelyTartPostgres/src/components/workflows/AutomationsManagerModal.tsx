import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  X,
  Play,
  ArrowRight,
  Plus,
  Sliders,
  Clock,
  Sparkles,
  Shield,
  FileCheck,
  UserCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export interface AutomationRuleItem {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  category: 'pipeline' | 'leads' | 'followup';
  runsCount: number;
}

interface AutomationsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutomationsManagerModal: React.FC<AutomationsManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast, addTask, currentUser, triggerConfetti } = useCRM();

  const [rules, setRules] = useState<AutomationRuleItem[]>([
    {
      id: 'auto-1',
      name: 'Seguimiento Automático de Cotizaciones',
      description: 'Crea una tarea para hacer seguimiento cuando un trato pasa a "Propuesta"',
      trigger: 'Etapa cambiada a "Propuesta"',
      action: 'Crear tarea: "Llamada de seguimiento de cotización" en 3 días',
      isActive: true,
      category: 'pipeline',
      runsCount: 28,
    },
    {
      id: 'auto-2',
      name: 'Protocolo de Trato Ganado (Onboarding)',
      description: 'Dispara tareas de bienvenida y facturación inmediata al ganar una venta',
      trigger: 'Etapa cambiada a "Ganado (Won)"',
      action: 'Crear tarea: "Kickoff de Onboarding y Emisión de Factura AFIP"',
      isActive: true,
      category: 'pipeline',
      runsCount: 15,
    },
    {
      id: 'auto-3',
      name: 'Respuesta Rápida a Leads Web',
      description: 'Alerta al vendedor para responder en menos de 15 minutos a nuevos prospectos',
      trigger: 'Nuevo Lead captado vía Web / Formulario',
      action: 'Crear tarea urgente: "Contactar lead caliente por WhatsApp"',
      isActive: true,
      category: 'leads',
      runsCount: 42,
    },
    {
      id: 'auto-4',
      name: 'Detector de Tratos Estancados (Rotting Deals)',
      description: 'Marca y notifica tratos sin actividad en más de 5 días corridos',
      trigger: 'Inactividad > 5 días en etapas activas',
      action: 'Pintar halo ámbar en Kanban y alertar en campana de notificaciones',
      isActive: true,
      category: 'followup',
      runsCount: 63,
    },
    {
      id: 'auto-5',
      name: 'Revisión Legal en Negociación',
      description: 'Genera recordatorio para auditar cláusulas de contrato y SLA',
      trigger: 'Etapa cambiada a "Negociación"',
      action: 'Registrar actividad y agendar revisión de contrato con directiva',
      isActive: false,
      category: 'pipeline',
      runsCount: 7,
    },
  ]);

  const [testingRuleId, setTestingRuleId] = useState<string | null>(null);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.isActive;
          showToast(
            `Automatización "${r.name}" ${nextState ? 'activada' : 'pausada'}`,
            nextState ? 'success' : 'info'
          );
          return { ...r, isActive: nextState };
        }
        return r;
      })
    );
  };

  const handleTestRule = (rule: AutomationRuleItem) => {
    setTestingRuleId(rule.id);
    setTimeout(() => {
      setTestingRuleId(null);
      // Execute test action
      addTask({
        title: `[Automatización Test] ${rule.name}`,
        description: `Disparada por regla de automatización: "${rule.trigger}" -> "${rule.action}"`,
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'High',
        status: 'Todo',
        assignedTo: currentUser.name,
      });

      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, runsCount: r.runsCount + 1 } : r))
      );

      triggerConfetti();
      showToast(`¡Regla ejecutada con éxito! Se creó la tarea de prueba en el CRM.`, 'success');
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div
      id="automations-manager-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>Motor de Automatizaciones & Workflows</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  En Vivo
                </span>
              </h3>
              <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300">
                Disparadores automáticos que ahorran horas de trabajo a tu equipo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card)]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-3 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-blue-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>{rules.filter((r) => r.isActive).length} reglas activas</strong> supervisando cambios de etapa, leads entrantes e inactividad en tu CRM.
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition-all ${ rule.isActive ? 'bg-[var(--bg-card)] border-[var(--border-subtle)]/90 shadow-2xs hover:border-blue-300' : 'bg-[var(--bg-muted)] border-[var(--border-subtle)] opacity-60' }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-[var(--text-primary)]">{rule.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--bg-muted)] text-[var(--text-secondary)]">
                        {rule.runsCount} ejecuciones
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{rule.description}</p>

                    {/* Trigger -> Action Formula */}
                    <div className="mt-2.5 p-2 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center gap-2 text-[11px]">
                      <div className="flex items-center gap-1 font-semibold text-[var(--text-secondary)]">
                        <Clock className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">Si: {rule.trigger}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 shrink-0" />
                      <div className="flex items-center gap-1 font-semibold text-blue-700">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                        <span className="truncate">Entonces: {rule.action}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Toggle & Test */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.isActive}
                        onChange={() => toggleRule(rule.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[var(--bg-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--bg-card)] after:border-[var(--border-default)] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>

                    <button
                      onClick={() => handleTestRule(rule)}
                      disabled={testingRuleId === rule.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] transition-colors cursor-pointer"
                      title="Probar ejecución de esta automatización ahora"
                    >
                      {testingRuleId === rule.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                      ) : (
                        <Play className="w-3 h-3 text-[var(--text-muted)]" />
                      )}
                      <span>Probar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[var(--bg-muted)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)] text-[11px]">
            Los triggers se disparan en tiempo real con cada movimiento del pipeline.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
