import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Info, Server, Clock, Cpu } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export interface DeploymentMonitorProps {
  version?: string;
  buildTimestamp?: string;
  className?: string;
}

export const DeploymentMonitor: React.FC<DeploymentMonitorProps> = ({
  version = 'v1.0.5-prod',
  buildTimestamp = '2026-09-13 21:26:00 UTC',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isOnline, isFirestoreConnected } = useNetworkStatus();

  const handleCopySupportInfo = () => {
    const info = {
      app: 'ClientumCRM (ClientumOS)',
      version,
      buildTimestamp,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      onlineStatus: isOnline ? 'Online' : 'Offline',
      firestoreStatus: isFirestoreConnected ? 'Connected' : 'Disconnected',
      screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A',
      localTime: new Date().toISOString(),
    };

    navigator.clipboard.writeText(JSON.stringify(info, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      aria-label="Deployment Monitor"
      className={`select-none transition-all ${className}`}
    >
      <div className="bg-slate-900/95 dark:bg-slate-900/95 text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 rounded-lg p-2.5 text-xs shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono">
            <Server className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-100">{version}</span>
            <span
              className={`w-2 h-2 rounded-full ${ isOnline && isFirestoreConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse' }`}
              title={isOnline ? 'Deployment Active' : 'Offline Mode'}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Ver detalles de versión y sistema"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopySupportInfo}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30 text-[11px] font-medium transition-colors cursor-pointer"
              title="Copiar información técnica para soporte interno"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Soporte</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 space-y-1.5 font-mono text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[var(--text-muted)]" /> Compilación:
              </span>
              <span className="text-[var(--text-primary,#0f172a)] dark:text-slate-200">{buildTimestamp}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[var(--text-muted)]" /> Firestore DB:
              </span>
              <span className={isFirestoreConnected ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {isFirestoreConnected ? 'Conectado' : 'Caché Offline'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[var(--text-muted)]" /> Entorno:
              </span>
              <span className="text-blue-400">Cloud Run / Vercel Edge</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
