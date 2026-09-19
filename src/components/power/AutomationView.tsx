import React, { useState } from 'react';
import { Cpu, Plus, CheckCircle2, Play } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const AutomationView: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();
  const [rules, setRules] = useState([
    { trigger: 'Mensaje entrante con palabra "PRECIO"', action: 'Enviar Plantilla de Precios & Planes y Asignar Tag "Lead Caliente"', active: true },
    { trigger: 'Oportunidad pasa a etapa "Propuesta"', action: 'Crear Tarea automática de seguimiento para el Agente', active: true },
    { trigger: 'Nuevo cliente registrado', action: 'Enviar factura electrónica de bienvenida vía WhatsApp', active: true }
  ]);
  const [newTrigger, setNewTrigger] = useState('');
  const [newAction, setNewAction] = useState('');

  const createRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrigger.trim() || !newAction.trim()) return;

    setRules([{ trigger: newTrigger, action: newAction, active: true }, ...rules]);
    setNewTrigger('');
    setNewAction('');
    showToast('Regla de automatización creada con éxito', 'success');
    triggerConfetti();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          Motor de Automatización (Reglas If / Then)
        </h3>
        <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Automatiza flujos de trabajo basados en palabras clave de WhatsApp o cambios en el pipeline comercial.</p>
      </div>

      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] space-y-4 max-w-xl">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">Crear Nueva Regla If / Then</h4>
        <form onSubmit={createRule} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Disparador (If)</label>
            <input
              type="text"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              placeholder="ej. Mensaje contiene palabra 'DEMO'"
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Acción (Then)</label>
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              placeholder="ej. Enviar link de Calendly y asignar a Agente"
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Activar Regla</span>
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">Reglas Activas en el Servidor</h4>
        <div className="space-y-3">
          {rules.map((r, idx) => (
            <div key={idx} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-[var(--text-primary,#0f172a)] dark:text-white font-semibold text-xs">⚡ Si: <span className="text-blue-400">{r.trigger}</span></div>
                <div className="text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">👉 Entonces: <span className="text-emerald-400">{r.action}</span></div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium text-[10px] border border-emerald-500/20">
                Activa
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
