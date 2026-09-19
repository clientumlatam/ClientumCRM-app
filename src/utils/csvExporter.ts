import { Opportunity } from '../types';
import { STAGES } from '../data/initialData';

/**
 * Converts pipeline opportunities into a clean CSV file and triggers a browser download.
 */
export function exportOpportunitiesToCSV(opportunities: Opportunity[], filenamePrefix = 'ClientumCRM_Pipeline'): void {
  if (!opportunities || opportunities.length === 0) {
    alert('No hay negocios disponibles para exportar.');
    return;
  }

  // Headers for CSV
  const headers = [
    'ID Negocio',
    'Nombre del Negocio',
    'Monto ($ USD)',
    'Etapa ID',
    'Nombre de Etapa',
    'Probabilidad (%)',
    'Prioridad',
    'Empresa',
    'Contacto',
    'Propietario',
    'Fecha Estimada Cierre',
    'Etiquetas',
    'Puntaje de Salud',
    'Fecha Creacion',
    'Ultima Actualizacion',
  ];

  // Helper to escape values safely for CSV format
  const escapeCSV = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = opportunities.map((opp) => {
    const stageObj = STAGES.find((s) => s.id === opp.stage);
    const stageName = stageObj ? stageObj.name : opp.stage;
    const probability = opp.probability ?? stageObj?.probability ?? 0;
    const tagsStr = Array.isArray(opp.tags) ? opp.tags.join(', ') : '';

    return [
      escapeCSV(opp.id),
      escapeCSV(opp.name),
      escapeCSV(opp.amount),
      escapeCSV(opp.stage),
      escapeCSV(stageName),
      escapeCSV(probability),
      escapeCSV(opp.priority),
      escapeCSV(opp.companyName || ''),
      escapeCSV(opp.contactName || ''),
      escapeCSV(opp.assignedTo),
      escapeCSV(opp.closeDate),
      escapeCSV(tagsStr),
      escapeCSV(opp.healthScore || ''),
      escapeCSV(opp.createdAt || ''),
      escapeCSV(opp.updatedAt || ''),
    ].join(',');
  });

  // UTF-8 BOM prefix for proper Excel character encoding
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `${filenamePrefix}_${timestamp}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
