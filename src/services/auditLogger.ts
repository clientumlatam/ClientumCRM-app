import { AuditLogEntry, SecurityAnomaly, RoleDefinition, PermissionResource, PermissionAction } from '../types';

/**
 * Checks if a specific role has permission to perform an action on a resource
 */
export function hasPermission(
  role: RoleDefinition | undefined,
  resource: PermissionResource,
  action: PermissionAction
): boolean {
  if (!role) return false;
  // If Super Admin slug or name, allow everything
  if (role.slug === 'admin' || role.name.toLowerCase().includes('admin')) {
    return true;
  }

  const resourcePerms = role.permissions?.[resource];
  if (!resourcePerms) return false;

  if (action === 'view') return !!resourcePerms.view;
  if (action === 'create') return !!resourcePerms.create;
  if (action === 'edit') return !!resourcePerms.edit;
  if (action === 'delete') return !!resourcePerms.delete;
  if (action === 'export') return !!resourcePerms.export;
  if (action === 'manage') return !!resourcePerms.manage;

  return false;
}

/**
 * Analyzes the audit logs stream and identifies potential anomalies
 */
export function scanAuditLogsForAnomalies(logs: AuditLogEntry[]): SecurityAnomaly[] {
  const anomalies: SecurityAnomaly[] = [];
  const now = Date.now();
  const ONE_HOUR = 1000 * 60 * 60;
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // 1. Check for rapid multiple deletions in the last hour
  const deleteLogs = logs.filter(
    (l) =>
      (l.action.includes('.delete') || l.actionLabel.toLowerCase().includes('elimin')) &&
      now - new Date(l.timestamp).getTime() < ONE_HOUR * 2
  );

  if (deleteLogs.length >= 2) {
    const primaryUser = deleteLogs[0];
    anomalies.push({
      id: `anom-del-${Date.now()}`,
      title: 'Detección de Eliminación Rápida de Múltiples Registros',
      description: `Se detectaron ${deleteLogs.length} eliminaciones consecutivas en un período corto por ${primaryUser.userName}.`,
      severity: 'high',
      detectedAt: new Date().toISOString(),
      status: 'active',
      triggerEventIds: deleteLogs.map((l) => l.id),
      ruleType: 'bulk_deletion',
      recommendation: 'Revisar si las eliminaciones fueron accidentales o autorizadas; considerar restaurar datos desde el último backup JSON.',
      affectedUser: {
        id: primaryUser.userId,
        name: primaryUser.userName,
        email: primaryUser.userEmail,
      },
    });
  }

  // 2. Check for privilege escalation or unauthorized security setting changes
  const rbacLogs = logs.filter(
    (l) =>
      l.action.startsWith('rbac.') ||
      l.action.includes('role') ||
      l.action.includes('permission')
  );

  if (rbacLogs.length > 0) {
    const recentRbac = rbacLogs[0];
    if (recentRbac.severity === 'security') {
      anomalies.push({
        id: `anom-sec-${recentRbac.id}`,
        title: 'Modificación Crítica de Políticas de Seguridad RBAC',
        description: `Se han modificado los permisos o asignaciones de roles (${recentRbac.entityName || 'Roles'}) por ${recentRbac.userName}.`,
        severity: 'medium',
        detectedAt: recentRbac.timestamp,
        status: 'active',
        triggerEventIds: [recentRbac.id],
        ruleType: 'privilege_escalation',
        recommendation: 'Auditar los cambios aplicados en la matriz de permisos para garantizar el principio de menor privilegio.',
        affectedUser: {
          id: recentRbac.userId,
          name: recentRbac.userName,
          email: recentRbac.userEmail,
        },
      });
    }
  }

  // 3. Check for high volume data exports
  const exportLogs = logs.filter(
    (l) =>
      l.action.includes('export') &&
      now - new Date(l.timestamp).getTime() < ONE_DAY
  );

  if (exportLogs.length >= 2) {
    const expUser = exportLogs[0];
    anomalies.push({
      id: `anom-exp-${Date.now()}`,
      title: 'Múltiples Exportaciones de Datos Masivos Detectadas',
      description: `Se realizaron ${exportLogs.length} descargas de bases de datos completas (CSV / JSON) en las últimas 24 horas.`,
      severity: 'high',
      detectedAt: new Date().toISOString(),
      status: 'active',
      triggerEventIds: exportLogs.map((l) => l.id),
      ruleType: 'excessive_exports',
      recommendation: 'Verificar si el usuario requiere la descarga local de bases de datos de clientes para fines comerciales legítimos.',
      affectedUser: {
        id: expUser.userId,
        name: expUser.userName,
        email: expUser.userEmail,
      },
    });
  }

  return anomalies;
}

/**
 * Export audit logs to formatted CSV file
 */
export function exportAuditLogsCSV(logs: AuditLogEntry[]) {
  const headers = [
    'Log ID',
    'Timestamp (ISO)',
    'User ID',
    'User Name',
    'User Email',
    'User Role',
    'Action',
    'Action Label',
    'Entity Type',
    'Entity ID',
    'Entity Name',
    'Severity',
    'Status',
    'IP Address',
    'Location',
    'Details',
  ];

  const rows = logs.map((log) => [
    `"${log.id}"`,
    `"${log.timestamp}"`,
    `"${log.userId}"`,
    `"${log.userName.replace(/"/g, '""')}"`,
    `"${log.userEmail}"`,
    `"${log.userRole}"`,
    `"${log.action}"`,
    `"${log.actionLabel.replace(/"/g, '""')}"`,
    `"${log.entityType}"`,
    `"${log.entityId || ''}"`,
    `"${(log.entityName || '').replace(/"/g, '""')}"`,
    `"${log.severity}"`,
    `"${log.status}"`,
    `"${log.ipAddress}"`,
    `"${log.location || 'Local'}"`,
    `"${(log.details || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `clientum_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Export audit logs to formatted JSON file with SOC2 & ISO27001 metadata header
 */
export function exportAuditLogsJSON(logs: AuditLogEntry[], anomalies: SecurityAnomaly[]) {
  const compliancePayload = {
    complianceStandard: 'SOC2 Type II / ISO 27001 Security Audit Report',
    systemName: 'ClientumCRM Enterprise Platform',
    generatedAt: new Date().toISOString(),
    totalEventsCount: logs.length,
    activeAnomaliesCount: anomalies.filter((a) => a.status === 'active').length,
    anomaliesSummary: anomalies,
    events: logs,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(compliancePayload, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `clientum_compliance_audit_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
