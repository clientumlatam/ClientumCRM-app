import React from 'react';
import { ArrowRight, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const PublicSessionBanner: React.FC = () => {
  const { isAuthenticated, currentUser, enterApp } = useCRM();

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-[calc(100vw-2rem)] rounded-2xl border border-blue-200 bg-white/95 p-2 shadow-xl shadow-slate-900/10 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 pl-2 sm:flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Sesión activa</p>
            <p className="max-w-[9rem] truncate text-[11px] text-slate-500">{currentUser.name}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => enterApp()}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[.98]"
          aria-label="Ir al Dashboard de Clientum"
        >
          <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Ir al Dashboard</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};