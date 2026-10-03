import React, { useState, useEffect } from 'react';
import { Cloud, RefreshCw, CheckCircle2, Clock, Database, ShieldAlert, ArrowUpCircle } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const SyncStatusWidget: React.FC = () => {
  const { people, opportunities, companies } = useCRM();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>(() =>
    new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [pendingChangesCount, setPendingChangesCount] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSync(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setPendingChangesCount(0);
    };
    const handleOffline = () => {
      setIsOnline(false);
      // Simulate pending offline writes count
      setPendingChangesCount(Math.floor(Math.random() * 3) + 1);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setPendingChangesCount(0);
    }, 1200);
  };

  const totalRecords = people.length + opportunities.length + companies.length;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#1c2d47] bg-white dark:bg-[#090F1E] p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isOnline ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white">Estado de Sincronización DB</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isOnline ? 'Sincronizado con Firebase Firestore' : 'Modo Offline - Almacenamiento Local'}
            </p>
          </div>
        </div>
        <button
          onClick={handleManualSync}
          disabled={isSyncing || !isOnline}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          title="Forzar Sincronización"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400">Registros en Caché</p>
          <p className="text-xs font-bold text-slate-800 dark:text-white font-mono mt-0.5">{totalRecords}</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400">Pendientes Subida</p>
          <p className={`text-xs font-bold font-mono mt-0.5 ${pendingChangesCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {pendingChangesCount} ops
          </p>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400">Última Sincronización</p>
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 font-mono mt-0.5">{lastSync}</p>
        </div>
      </div>
    </div>
  );
};
