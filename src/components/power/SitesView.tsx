import React, { useState } from 'react';
import { Globe, Plus, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const SitesView: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();
  const [sites, setSites] = useState([
    { name: 'ClientumCRM Landing Page', domain: 'clientumcrm.latam.site', visits: '14,200', status: 'Publicado' },
    { name: 'Portal de Clientes VIP', domain: 'portal.clientum.io', visits: '3,850', status: 'Publicado' }
  ]);
  const [siteName, setSiteName] = useState('');

  const createSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim()) return;

    setSites([
      { name: siteName, domain: `${siteName.toLowerCase().replace(/\s+/g, '')}.clientum.site`, visits: '12', status: 'En Despliegue' },
      ...sites
    ]);
    setSiteName('');
    showToast('Sitio web desplegado en CDN Global con éxito', 'success');
    triggerConfetti();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          Creador de Sitios, Landing Pages & Portales
        </h3>
        <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Despliegue automático de páginas de aterrizaje con SSL integrado y dominios personalizados.</p>
      </div>

      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] space-y-4 max-w-xl">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">Desplegar Nueva Landing Page</h4>
        <form onSubmit={createSite} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Nombre del Proyecto</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="ej. Campaña Verano 2026"
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Desplegar en CDN Global</span>
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">Sitios Activos</h4>
        <div className="space-y-3">
          {sites.map((s, idx) => (
            <div key={idx} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">{s.name}</div>
                <div className="text-[11px] text-cyan-400 font-mono">{s.domain} • Visitas: {s.visits}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium text-[10px] border border-emerald-500/20">
                  {s.status}
                </span>
                <button
                  onClick={() => showToast(`Abriendo ${s.domain}`, 'info')}
                  className="p-2 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2333] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#252f44] text-[var(--text-primary,#0f172a)] dark:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
