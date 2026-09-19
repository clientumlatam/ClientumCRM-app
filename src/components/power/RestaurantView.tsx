import React, { useState } from 'react';
import { Utensils, Plus, CheckCircle2, Clock, Users, Flame } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const RestaurantView: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();
  const [tables, setTables] = useState([
    { id: 'Mesa 1', status: 'Ocupada', guests: 4, order: '2x Bife de Chorro, 1x Malbec', total: '$68.00' },
    { id: 'Mesa 2', status: 'Libre', guests: 0, order: 'Sin comanda', total: '$0.00' },
    { id: 'Mesa 3', status: 'Esperando Plato', guests: 2, order: '1x Salmón Grillado, 1x Risotto', total: '$54.00' },
    { id: 'Mesa 4', status: 'Pagando', guests: 3, order: '3x Picadas de Campo, Cervezas', total: '$92.00' }
  ]);

  const [kitchenOrders, setKitchenOrders] = useState([
    { id: 'ORD-101', table: 'Mesa 3', items: '1x Salmón Grillado, 1x Risotto', status: 'En Preparación (Fuego)', time: 'Hace 8 min' },
    { id: 'ORD-102', table: 'Mesa 1', items: '2x Flan Casero con Dulce de Leche', status: 'Listo para Servir', time: 'Hace 2 min' }
  ]);

  const markReady = (orderId: string) => {
    setKitchenOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Entregado a Mesa' } : o));
    showToast(`Comanda ${orderId} marcada como entregada`, 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            Sistema para Restaurantes & Hospitality (POS & KDS)
          </h3>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Gestión de mesas, carta digital, comandas y pantalla de cocina en tiempo real (KDS).</p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="space-y-3">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">Estado de Salón y Mesas</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {tables.map((t, idx) => (
            <div key={idx} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">{t.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${ t.status === 'Libre' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : t.status === 'Ocupada' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20' }`}>
                  {t.status}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Comensales: {t.guests}</div>
              <div className="text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200 font-medium truncate">{t.order}</div>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2638]">
                <span className="font-mono font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{t.total}</span>
                <button
                  onClick={() => showToast(`Asignando orden a ${t.id}`, 'info')}
                  className="px-2.5 py-1 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2333] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#252f44] text-[var(--text-primary,#0f172a)] dark:text-white rounded transition-colors"
                >
                  Ver Comanda
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kitchen Display System (KDS) */}
      <div className="space-y-3 pt-4">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400 flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-400 animate-pulse" />
          Pantalla de Cocina en Vivo (KDS)
        </h4>
        <div className="space-y-3">
          {kitchenOrders.map(ord => (
            <div key={ord.id} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">{ord.id}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] border border-amber-500/20 font-mono">
                    {ord.table}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{ord.time}</span>
                </div>
                <div className="text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200 font-semibold">{ord.items}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-[10px] border border-purple-500/20 font-medium">
                  {ord.status}
                </span>
                <button
                  onClick={() => markReady(ord.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Marcar Entregado
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
