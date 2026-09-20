import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Search,
  Filter,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  Clock,
  User,
  Globe,
  RefreshCw,
  Sparkles,
  ChevronRight,
  X,
  FileSpreadsheet,
  FileCode,
  Zap,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { AuditLogEntry } from '../../types';

export const SystemLogsViewer: React.FC = () => {
  const {
    auditLogs,
    clearAuditLogs,
    exportAuditCSV,
    exportAuditJSON,
    logAuditEvent,
    currentUser,
    showToast,
  } = useCRM();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'security' | 'critical'>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Extract unique module / entity types for filtering
  const availableModules = useMemo(() => {
    const set = new Set<string>();
    auditLogs.forEach((l) => {
      if (l.entityType) set.add(l.entityType);
    });
    return Array.from(set);
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        log.actionLabel.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.userEmail.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.entityName && log.entityName.toLowerCase().includes(q)) ||
        (log.ipAddress && log.ipAddress.includes(q)) ||
        log.action.toLowerCase().includes(q);

      const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
      const matchesModule = moduleFilter === 'all' || log.entityType === moduleFilter;

      return matchesSearch && matchesSeverity && matchesModule;
    });
  }, [auditLogs, searchTerm, severityFilter, moduleFilter]);

  const handleSimulateLogEvent = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const mockEvents: Array<Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>> = [
        {
          action: 'AFIP_WSFE_CAE_GENERATED',
          actionLabel: 'Factura Electrónica AFIP Aprobada',
          entityType: 'AFIP_Facturacion',
          entityId: 'FAC-' + Math.floor(1000 + Math.random() * 9000),
          entityName: 'Factura A #0001-00004819',
          severity: 'info',
          status: 'success',
          details: 'CAE #74892189031238 otorgado por AFIP WSFE v1.0. Monto: $340.000 ARS.',
          userId: currentUser?.id || 'usr-admin',
          userName: currentUser?.name || 'Administrador',
          userEmail: currentUser?.email || 'admin@clientum.com',
          userRole: currentUser?.role || 'Admin',
        },
        {
          action: 'WHATSAPP_CAMPAIGN_BATCH_SENT',
          actionLabel: 'Campaña WhatsApp masiva ejecutada',
          entityType: 'WhatsApp_Bot',
          entityId: 'camp-' + Math.floor(100 + Math.random() * 900),
          entityName: 'Recordatorio Webinar SaaS',
          severity: 'info',
          status: 'success',
          details: '148 mensajes entregados exitosamente vía Meta Graph API v20.0.',
          userId: currentUser?.id || 'usr-admin',
          userName: currentUser?.name || 'Administrador',
          userEmail: currentUser?.email || 'admin@clientum.com',
          userRole: currentUser?.role || 'Admin',
        },
        {
          action: 'SECURITY_LOGIN_ATTEMPT',
          actionLabel: 'Inicio de sesión con doble factor',
          entityType: 'Auth_Security',
          entityId: currentUser?.id || 'usr-1',
          entityName: currentUser?.name || 'Usuario',
          severity: 'info',
          status: 'success',
          details: 'Autenticación exitosa desde IP 181.46.120.89 con verificación 2FA.',
          userId: currentUser?.id || 'usr-admin',
          userName: currentUser?.name || 'Administrador',
          userEmail: currentUser?.email || 'admin@clientum.com',
          userRole: currentUser?.role || 'Admin',
        },
      ];

      const chosen = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      logAuditEvent(chosen);
      setIsSimulating(false);
      showToast('Nuevo evento de sistema registrado en el log', 'success');
    }, 400);
  };

  const getSeverityBadge = (severity: AuditLogEntry['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Crítico
          </span>
        );
      case 'security':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Seguridad
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Advertencia
          </span>
        );
      case 'info':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-500 border border-blue-500/30 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Info
          </span>
        );
    }
  };

  return (
    <div id="system-logs-viewer-container" className="space-y-4">
      {/* Top Header & Search / Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--bg-card)] p-3.5 rounded-xl border border-[var(--border-subtle)] shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por acción, usuario, IP, entidad..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs text-[var(--text-primary)] font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">Todas las severidades</option>
            <option value="info">Info / Éxito</option>
            <option value="warning">Advertencias</option>
            <option value="security">Seguridad</option>
            <option value="critical">Crítico</option>
          </select>

          {/* Module Filter */}
          {availableModules.length > 0 && (
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs text-[var(--text-primary)] font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">Todos los módulos</option>
              {availableModules.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          )}

          {/* Simulate Event Button */}
          <button
            type="button"
            onClick={handleSimulateLogEvent}
            disabled={isSimulating}
            className="px-2.5 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Generar evento de prueba en vivo"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Test Log</span>
          </button>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1 border-l border-[var(--border-subtle)] pl-2">
            <button
              type="button"
              onClick={exportAuditCSV}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Exportar registros a CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            </button>
            <button
              type="button"
              onClick={exportAuditJSON}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Exportar registros a JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-500" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Estás seguro de que deseas limpiar el historial de eventos del sistema?')) {
                  clearAuditLogs();
                }
              }}
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
              title="Limpiar historial de eventos"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Log Count Badge */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
        <span>
          Mostrando <strong className="text-[var(--text-primary)]">{filteredLogs.length}</strong> de{' '}
          {auditLogs.length} eventos registrados
        </span>
        <span className="flex items-center gap-1 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Monitoreo en tiempo real activo
        </span>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-[var(--bg-muted)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-3.5 py-2.5">Fecha y Hora</th>
                <th className="px-3.5 py-2.5">Severidad</th>
                <th className="px-3.5 py-2.5">Evento / Acción</th>
                <th className="px-3.5 py-2.5">Módulo / Entidad</th>
                <th className="px-3.5 py-2.5">Usuario</th>
                <th className="px-3.5 py-2.5">Detalles</th>
                <th className="px-3.5 py-2.5 text-right">Ver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[var(--text-muted)]">
                    No se encontraron eventos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-[var(--bg-muted)]/50 cursor-pointer transition-colors"
                  >
                    <td className="px-3.5 py-2.5 text-[var(--text-muted)] font-mono whitespace-nowrap text-[11px]">
                      {new Date(log.timestamp).toLocaleString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="px-3.5 py-2.5 font-semibold text-[var(--text-primary)]">
                      {log.actionLabel}
                    </td>
                    <td className="px-3.5 py-2.5 text-[var(--text-secondary)]">
                      <span className="px-2 py-0.5 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] font-mono text-[10px]">
                        {log.entityType || 'Sistema'}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-[var(--text-secondary)] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-[var(--text-muted)]" />
                        <span>{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-[var(--text-muted)] truncate max-w-xs text-[11px]">
                      {log.details}
                    </td>
                    <td className="px-3.5 py-2.5 text-right">
                      <ChevronRight className="w-3.5 h-3.5 inline text-[var(--text-muted)]" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Registro de Auditoría #{selectedLog.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Acción</span>
                  <span className="font-semibold text-[var(--text-primary)]">{selectedLog.actionLabel}</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-0.5">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Severidad</span>
                  <div className="mt-1">{getSeverityBadge(selectedLog.severity)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Usuario</span>
                  <span className="font-semibold text-[var(--text-primary)]">{selectedLog.userName} ({selectedLog.userRole})</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">{selectedLog.userEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Timestamp</span>
                  <span className="font-mono text-[var(--text-primary)]">{new Date(selectedLog.timestamp).toISOString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Módulo / Entidad</span>
                  <span className="font-medium text-[var(--text-primary)]">{selectedLog.entityType || '—'} {selectedLog.entityName ? `(${selectedLog.entityName})` : ''}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">IP & Origen</span>
                  <span className="font-mono text-[var(--text-primary)]">{selectedLog.ipAddress || '127.0.0.1 (Local)'}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[var(--text-primary)] block mb-1">Detalle del Evento:</span>
                <div className="p-3 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                  {selectedLog.details}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
                  showToast('Detalle de log copiado al portapapeles', 'info');
                }}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs font-semibold transition-colors"
              >
                Copiar JSON
              </button>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
