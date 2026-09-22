import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, Filter } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const CustomerSegmentsView: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();
  const [segments, setSegments] = useState([
    { name: 'Leads Calientes Q3', count: 85, filter: 'Etapa: Propuesta o Negociación • Actividad < 7 días' },
    { name: 'Cuentas Enterprise Inactivas', count: 120, filter: 'Empresa Tier A • Sin contacto > 30 días' },
    { name: 'Clientes con Soporte Abierto', count: 14, filter: 'Tickets activos > 0' }
  ]);
  const [newSegName, setNewSegName] = useState('');

  const createSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegName.trim()) return;

    setSegments([
      { name: newSegName, count: 42, filter: 'Filtro personalizado avanzado' },
      ...segments
    ]);
    setNewSegName('');
    showToast('Segmento de clientes creado con éxito', 'success');
    triggerConfetti();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs max-w-4xl">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          Segmentación Avanzada de Clientes & Audiencias
        </h3>
        <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Crea audiencias dinámicas basadas en comportamiento, etiquetas y etapas del pipeline para campañas de marketing.</p>
      </div>

      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] space-y-4 max-w-xl">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">Crear Nuevo Segmento Dinámico</h4>
        <form onSubmit={createSegment} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Nombre del Segmento</label>
            <input
              type="text"
              value={newSegName}
              onChange={(e) => setNewSegName(e.target.value)}
              placeholder="ej. Leads Inmobiliaria Buenos Aires"
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear Segmento</span>
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">Segmentos Activos</h4>
        <div className="space-y-3">
          {segments.map((s, idx) => (
            <div key={idx} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">{s.name}</div>
                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{s.filter}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-emerald-400 text-sm">{s.count} contactos</span>
                <button
                  onClick={() => showToast(`Exportando contactos de ${s.name}`, 'success')}
                  className="px-3 py-1.5 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2333] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#252f44] text-[var(--text-primary,#0f172a)] dark:text-white rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Ver Audiencia
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
