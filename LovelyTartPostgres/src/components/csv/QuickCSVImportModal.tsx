import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  FileSpreadsheet,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  Users2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCRM } from '../../context/CRMContext';
import { Person } from '../../types';

interface QuickCSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCSVImportModal: React.FC<QuickCSVImportModalProps> = ({ isOpen, onClose }) => {
  const { addPerson, showToast, triggerConfetti } = useCRM();

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Field mapping
  const [mapping, setMapping] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    jobTitle: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
  });

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.type.includes('csv') && !file.type.includes('excel')) {
      showToast('Por favor sube un archivo con formato .CSV', 'warning');
      return;
    }

    setCsvFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const rawHeaders = results.meta.fields || Object.keys((results.data[0] as object) || {});
          setHeaders(rawHeaders);
          setParsedRows(results.data);

          // Auto-guess mapping based on common names
          const newMap = { firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '' };
          rawHeaders.forEach((h) => {
            const lower = h.toLowerCase().trim();
            if (!newMap.firstName && (lower.includes('nombre') || lower.includes('first') || lower.includes('name'))) {
              newMap.firstName = h;
            } else if (!newMap.lastName && (lower.includes('apellido') || lower.includes('last'))) {
              newMap.lastName = h;
            } else if (!newMap.email && (lower.includes('mail') || lower.includes('correo'))) {
              newMap.email = h;
            } else if (!newMap.phone && (lower.includes('tel') || lower.includes('phone') || lower.includes('cel') || lower.includes('whatsapp'))) {
              newMap.phone = h;
            } else if (!newMap.company && (lower.includes('empresa') || lower.includes('company') || lower.includes('organizacion'))) {
              newMap.company = h;
            } else if (!newMap.jobTitle && (lower.includes('cargo') || lower.includes('puesto') || lower.includes('job') || lower.includes('title') || lower.includes('rol'))) {
              newMap.jobTitle = h;
            }
          });
          setMapping(newMap);
        } else {
          showToast('El archivo no contiene filas legibles', 'error');
        }
      },
      error: (error) => {
        console.error(error);
        showToast(`Error al leer CSV: ${error.message}`, 'error');
      },
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);

    try {
      let importedCount = 0;

      for (const row of parsedRows) {
        const rawFirst = mapping.firstName ? String(row[mapping.firstName] || '').trim() : '';
        const rawLast = mapping.lastName ? String(row[mapping.lastName] || '').trim() : '';
        const rawEmail = mapping.email ? String(row[mapping.email] || '').trim() : '';
        const rawPhone = mapping.phone ? String(row[mapping.phone] || '').trim() : '';
        const rawCompany = mapping.company ? String(row[mapping.company] || '').trim() : '';
        const rawJob = mapping.jobTitle ? String(row[mapping.jobTitle] || '').trim() : '';

        // Split single full name if last name column is empty
        let fName = rawFirst;
        let lName = rawLast;
        if (rawFirst && !rawLast && rawFirst.includes(' ')) {
          const parts = rawFirst.split(' ');
          fName = parts[0];
          lName = parts.slice(1).join(' ');
        }

        if (!fName && !rawEmail && !rawPhone) {
          continue; // skip completely empty rows
        }

        addPerson({
          firstName: fName || 'Contacto',
          lastName: lName || '-',
          email: rawEmail || `contacto-${Date.now()}-${importedCount}@clientum.local`,
          phone: rawPhone || '',
          companyName: rawCompany || '',
          jobTitle: rawJob || 'Contacto',
          status: 'Lead',
        });

        importedCount++;
      }

      triggerConfetti();
      showToast(`¡Se importaron exitosamente ${importedCount} contactos y se sincronizaron en tiempo real!`, 'success');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Ocurrió un error al importar los registros', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e111a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20273a] rounded-2xl shadow-2xl overflow-hidden text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c2233] bg-[var(--bg-card,#ffffff)] dark:bg-[#121623] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
                  Importador de Contactos (CSV / Excel)
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Batch Firestore
                  </span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  Carga rápida de bases de datos masivas directamente a tu CRM
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1c2233] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* File drop area */}
            {!csvFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${ isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-[var(--border-subtle,#e2e8f0)] dark:border-[#263147] hover:border-emerald-500/60 bg-[var(--bg-card,#ffffff)] dark:bg-[#131724]' }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[var(--text-primary,#0f172a)] dark:text-white font-semibold text-sm">
                    Arrastra aquí tu archivo CSV o haz clic para seleccionarlo
                  </p>
                  <p className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs mt-1">
                    Compatible con exportaciones de Excel, Google Sheets, HubSpot o WhatsApp
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File info bar */}
                <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{csvFile.name}</span>
                      <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 ml-2">({parsedRows.length} filas detectadas)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCsvFile(null);
                      setParsedRows([]);
                      setHeaders([]);
                    }}
                    className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400 cursor-pointer"
                  >
                    Cambiar archivo
                  </button>
                </div>

                {/* Column Mapping Section */}
                <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#131724] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20273a] space-y-3">
                  <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    Asignación de Columnas
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                    <div>
                      <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Nombre</label>
                      <select
                        value={mapping.firstName}
                        onChange={(e) => setMapping({ ...mapping, firstName: e.target.value })}
                        className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1017] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293b] rounded-lg p-2 text-[var(--text-primary,#0f172a)] dark:text-white"
                      >
                        <option value="">-- No asignar --</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Apellido</label>
                      <select
                        value={mapping.lastName}
                        onChange={(e) => setMapping({ ...mapping, lastName: e.target.value })}
                        className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1017] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293b] rounded-lg p-2 text-[var(--text-primary,#0f172a)] dark:text-white"
                      >
                        <option value="">-- No asignar --</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Email</label>
                      <select
                        value={mapping.email}
                        onChange={(e) => setMapping({ ...mapping, email: e.target.value })}
                        className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1017] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293b] rounded-lg p-2 text-[var(--text-primary,#0f172a)] dark:text-white"
                      >
                        <option value="">-- No asignar --</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Teléfono / WhatsApp</label>
                      <select
                        value={mapping.phone}
                        onChange={(e) => setMapping({ ...mapping, phone: e.target.value })}
                        className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1017] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293b] rounded-lg p-2 text-[var(--text-primary,#0f172a)] dark:text-white"
                      >
                        <option value="">-- No asignar --</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Empresa</label>
                      <select
                        value={mapping.company}
                        onChange={(e) => setMapping({ ...mapping, company: e.target.value })}
                        className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1017] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293b] rounded-lg p-2 text-[var(--text-primary,#0f172a)] dark:text-white"
                      >
                        <option value="">-- No asignar --</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Cargo / Puesto</label>
                      <select
                        value={mapping.jobTitle}
                        onChange={(e) => setMapping({ ...mapping, jobTitle: e.target.value })}
                        className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1017] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293b] rounded-lg p-2 text-[var(--text-primary,#0f172a)] dark:text-white"
                      >
                        <option value="">-- No asignar --</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs">
                    Vista previa (Primeros 4 registros)
                  </h4>
                  <div className="border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20273a] rounded-xl overflow-x-auto bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1017]">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] text-[var(--text-muted,#64748b)] dark:text-slate-400 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#20273a]">
                        <tr>
                          <th className="p-2.5">Nombre</th>
                          <th className="p-2.5">Email</th>
                          <th className="p-2.5">Teléfono</th>
                          <th className="p-2.5">Empresa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1b2131]">
                        {parsedRows.slice(0, 4).map((row, idx) => (
                          <tr key={idx} className="hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#131724]">
                            <td className="p-2.5 text-[var(--text-primary,#0f172a)] dark:text-white">
                              {mapping.firstName ? row[mapping.firstName] : ''}{' '}
                              {mapping.lastName ? row[mapping.lastName] : ''}
                            </td>
                            <td className="p-2.5 text-[var(--text-secondary,#475569)] dark:text-slate-300">
                              {mapping.email ? row[mapping.email] : '-'}
                            </td>
                            <td className="p-2.5 text-[var(--text-secondary,#475569)] dark:text-slate-300">
                              {mapping.phone ? row[mapping.phone] : '-'}
                            </td>
                            <td className="p-2.5 text-[var(--text-secondary,#475569)] dark:text-slate-300">
                              {mapping.company ? row[mapping.company] : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c2233] bg-[var(--bg-card,#ffffff)] dark:bg-[#121623] flex items-center justify-between">
            <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
              {parsedRows.length > 0 && `${parsedRows.length} contactos se guardarán en tu Firestore.`}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#181d2c] transition-colors"
              >
                Cancelar
              </button>
              {parsedRows.length > 0 && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleImport}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Importando a Firestore...' : `Importar ${parsedRows.length} Contactos`}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
