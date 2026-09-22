import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Palette } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const SaaSThemeView: React.FC = () => {
  const { showToast } = useCRM();
  const [brandName, setBrandName] = useState('ClientumCRM');
  const [primaryColor, setPrimaryColor] = useState('#10b981');

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs max-w-2xl">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" />
          Personalización de Marca White-Label & Temas
        </h3>
        <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Configura el nombre de marca, logotipo y colores corporativos para tu agencia o franquicia.</p>
      </div>

      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Nombre de la Marca en Interfaz</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Color Principal de Acento</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248]"
            />
            <span className="font-mono text-[var(--text-primary,#0f172a)] dark:text-white text-xs">{primaryColor}</span>
          </div>
        </div>
        <button
          onClick={() => showToast('Configuración White-Label guardada con éxito', 'success')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-md"
        >
          Guardar Cambios de Marca
        </button>
      </div>
    </div>
  );
};
