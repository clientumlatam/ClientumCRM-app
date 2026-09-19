import React, { useState } from 'react';
import { Users2, Plus, Search, Building2, Phone, Mail, Tag } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const ContactsView: React.FC = () => {
  const { people, companies, addPerson, showToast, triggerConfetti } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-blue-400" />
            Directorio Centralizado de Contactos & Leads
          </h3>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Gestión de personas, cuentas corporativas, historial de interacciones y etiquetas personalizadas.</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email o empresa..."
            className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#151924] text-[var(--text-primary,#0f172a)] dark:text-white pl-9 pr-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232b3f] text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] rounded-xl overflow-hidden">
        <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#212a3d]">
          {people.map(p => {
            const fullName = `${p.firstName} ${p.lastName}`.trim() || 'Contacto';
            return (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#161b28] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    {fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs">{fullName}</div>
                    <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{p.email} • {p.phone || 'Sin teléfono'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 font-medium text-[10px] border border-blue-500/20">
                    {p.companyName || 'Sin empresa'}
                  </span>
                  <button
                    onClick={() => showToast(`Abriendo expediente de ${fullName}`, 'info')}
                    className="px-3 py-1.5 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2333] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#252f44] text-[var(--text-primary,#0f172a)] dark:text-white rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    Ver Perfil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
