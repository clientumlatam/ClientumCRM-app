import React, { useState } from 'react';
import { Server, Copy, Check, Clock } from 'lucide-react';

export interface VersionInfoProps {
  version?: string;
  buildTimestamp?: string;
  className?: string;
}

export const VersionInfo: React.FC<VersionInfoProps> = ({
  version = 'v6.0-live',
  buildTimestamp = (import.meta.env.VITE_BUILD_TIME as string) || new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAuditInfo = () => {
    const auditData = {
      app: 'ClientumCRM (ClientumOS)',
      version,
      buildTimestamp,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      environment: 'Production Cloud Run / Vercel Edge',
      timestamp: new Date().toISOString(),
    };

    navigator.clipboard.writeText(JSON.stringify(auditData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="clientum-version-info-footer"
      className={`text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted)] font-mono flex items-center justify-between px-3 py-1.5 bg-[var(--bg-muted)]/60 dark:bg-slate-900/40 rounded-md border border-[var(--border-subtle)]/60 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/60 select-none ${className}`}
      title={`ClientumCRM Auditoría de Despliegue | Versión: ${version} | Compilación: ${buildTimestamp}`}
    >
      <div className="flex items-center gap-1.5 truncate">
        <Server className="w-3 h-3 text-blue-500 shrink-0" />
        <span className="font-bold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">{version}</span>
        <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300 dark:text-[var(--text-secondary)]">•</span>
        <span className="truncate hidden sm:inline text-[var(--text-muted)]">{buildTimestamp}</span>
      </div>

      <button
        onClick={handleCopyAuditInfo}
        className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer shrink-0 ml-2"
        title="Copiar datos de auditoría de versión"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copiado</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            <span>Auditar</span>
          </>
        )}
      </button>
    </div>
  );
};
