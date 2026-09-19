import React, { useState, useEffect } from 'react';
import {
  WifiOff,
  Wifi,
  CloudOff,
  Layers,
  Database,
  RefreshCw,
  Info,
  CheckCircle2,
  X,
  Smartphone,
} from 'lucide-react';

export const OfflineStatusIndicator: React.FC<{
  className?: string;
  variant?: 'header' | 'badge' | 'compact';
}> = ({ className = '', variant = 'header' }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [swActive, setSwActive] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [cacheName, setCacheName] = useState<string>('clientum-crm-v6.2-pwa-brochure');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect Service Worker
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        setSwActive(true);
      }
      navigator.serviceWorker.ready.then(() => {
        setSwActive(true);
      }).catch(() => {});
    }

    // Check Cache Storage
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then((keys) => {
        const found = keys.find(k => k.includes('clientum'));
        if (found) setCacheName(found);
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const effectiveOffline = !isOnline || isSimulatedOffline;

  // Toggle offline simulation for user convenience
  const toggleSimulation = () => {
    setIsSimulatedOffline(prev => !prev);
  };

  return (
    <div className={`relative inline-flex items-center select-none font-['Inter',sans-serif] ${className}`}>
      {/* Trigger Pill / Indicator Button */}
      {effectiveOffline ? (
        <button
          type="button"
          id="offline-sw-status-indicator"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-all shadow-xs cursor-pointer animate-pulse"
          title="Modo Offline activo: La aplicación está funcionando desde el caché del Service Worker"
        >
          <div className="relative flex h-2 w-2 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
          </div>
          <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="hidden sm:inline text-[11px] font-semibold tracking-tight">
            Modo Offline (Caché SW)
          </span>
          <span className="sm:hidden text-[11px]">Offline SW</span>
        </button>
      ) : (
        /* Subtle online status indicator with SW cache ready tooltip */
        <button
          type="button"
          id="online-sw-status-indicator"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.8 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 text-[10px] font-medium transition-colors cursor-pointer"
          title="Service Worker y Caché PWA activos. Clic para detalles o simular modo offline."
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-xs shadow-emerald-400/50" />
          <span>SW PWA Listo</span>
        </button>
      )}

      {/* Interactive Offline / Service Worker Info Popover */}
      {isPopoverOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsPopoverOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 z-50 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090F1E] p-4 text-[var(--text-primary,#0f172a)] dark:text-slate-200 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${effectiveOffline ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {effectiveOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                    {effectiveOffline ? 'Modo Offline Activo' : 'Conexión En Línea'}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Caché Service Worker Clientum
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPopoverOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white p-1 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="py-3 space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">Estado Service Worker:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {swActive ? 'Controlando la aplicación' : 'Registrado'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">Nombre de Caché:</span>
                  <span className="text-sky-300 font-mono text-[10px] truncate max-w-[140px]" title={cacheName}>
                    {cacheName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">Estrategia:</span>
                  <span className="text-[var(--text-primary,#0f172a)] dark:text-slate-200">Cache-First con Stale-While-Revalidate</span>
                </div>
              </div>

              <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed">
                {effectiveOffline
                  ? 'Estás navegando sin conexión a internet. Los catálogos, brochure, cronología y vistas continúan operando normalmente gracias al Service Worker.'
                  : 'Si tu dispositivo pierde la conexión a internet, el Service Worker mantendrá la aplicación accesible sin interrupciones.'}
              </p>

              {/* Simulation Toggle Button */}
              <div className="pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Prueba de interfaz:</span>
                <button
                  type="button"
                  onClick={toggleSimulation}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${ isSimulatedOffline ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' : 'bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300 border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 hover:text-white' }`}
                >
                  {isSimulatedOffline ? 'Desactivar Simulación' : 'Simular Modo Offline'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
