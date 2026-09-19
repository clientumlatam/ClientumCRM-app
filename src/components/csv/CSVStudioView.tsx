import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  AlertTriangle,
  Building2,
  FileSpreadsheet,
  Upload,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Database,
  Sparkles,
  Download,
  FileText,
  GitMerge,
  RotateCcw,
  Table,
  UsersRound,
  X
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { getClientumAuthJsonHeaders } from '../../lib/api';

type ValidationIssue = { row: number; message: string; severity: 'error' | 'warning' };
type ValidationReport = { errors: ValidationIssue[]; warnings: ValidationIssue[] };
type DuplicateCandidate = {
  pairKey: string;
  entityType: 'companies' | 'people';
  matchField: 'email' | 'phone' | 'domain' | 'name';
  matchValue: string;
  primary: Record<string, any>;
  duplicate: Record<string, any>;
};

const normalizeValue = (value: unknown, field: DuplicateCandidate['matchField']): string => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  if (field === 'phone') return raw.replace(/[^\d+]/g, '');
  if (field === 'domain') return raw.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  if (field === 'name') {
    return raw.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  }
  return raw;
};

const displayRecordName = (record: Record<string, any>): string =>
  [record.firstName, record.lastName].filter(Boolean).join(' ').trim() || record.name || record.email || record.domain || record.id;

const buildValidationReport = (
  target: 'opportunities' | 'companies' | 'people',
  rows: any[],
  people: Record<string, any>[],
  companies: Record<string, any>[],
): ValidationReport => {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const seenKeys = new Set<string>();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const name = String(row.name || row.dealName || row.companyName || row.firstName || '').trim();

    if (target === 'opportunities') {
      if (!name) errors.push({ row: rowNumber, message: 'El deal necesita un nombre.', severity: 'error' });
      if (row.amount !== undefined && row.amount !== '' && !Number.isFinite(Number(row.amount))) {
        errors.push({ row: rowNumber, message: 'El importe debe ser numérico.', severity: 'error' });
      }
    }

    if (target === 'companies') {
      const domain = normalizeValue(row.domain, 'domain');
      if (!name) errors.push({ row: rowNumber, message: 'La empresa necesita un nombre.', severity: 'error' });
      if (!domain) errors.push({ row: rowNumber, message: 'La empresa necesita un dominio para detectar duplicados.', severity: 'error' });
      if (domain && !domain.includes('.')) warnings.push({ row: rowNumber, message: 'El dominio no parece tener formato completo.', severity: 'warning' });
      const key = domain || normalizeValue(name, 'name');
      if (key && seenKeys.has(`company:${key}`)) warnings.push({ row: rowNumber, message: 'Repite una empresa dentro del mismo archivo.', severity: 'warning' });
      if (key) seenKeys.add(`company:${key}`);
      if (domain && companies.some((company) => normalizeValue(company.domain, 'domain') === domain)) {
        warnings.push({ row: rowNumber, message: `Ya existe una empresa con el dominio ${domain}.`, severity: 'warning' });
      }
    }

    if (target === 'people') {
      const firstName = String(row.firstName || row.name?.split(' ')[0] || '').trim();
      const email = normalizeValue(row.email, 'email');
      const phone = normalizeValue(row.phone, 'phone');
      if (!firstName) errors.push({ row: rowNumber, message: 'El contacto necesita nombre.', severity: 'error' });
      if (!email && !phone) errors.push({ row: rowNumber, message: 'El contacto necesita email o teléfono.', severity: 'error' });
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push({ row: rowNumber, message: 'El email no tiene un formato válido.', severity: 'error' });
      }
      if (email && people.some((person) => normalizeValue(person.email, 'email') === email)) {
        warnings.push({ row: rowNumber, message: `Ya existe un contacto con el email ${email}.`, severity: 'warning' });
      }
      if (phone && people.some((person) => normalizeValue(person.phone, 'phone') === phone)) {
        warnings.push({ row: rowNumber, message: 'Ya existe un contacto con el mismo teléfono.', severity: 'warning' });
      }
      for (const key of [`email:${email}`, `phone:${phone}`]) {
        if (key !== 'email:' && key !== 'phone:' && seenKeys.has(`person:${key}`)) {
          warnings.push({ row: rowNumber, message: 'Repite un contacto dentro del mismo archivo.', severity: 'warning' });
        }
        if (key !== 'email:' && key !== 'phone:') seenKeys.add(`person:${key}`);
      }
    }
  });

  return { errors, warnings };
};

export const CSVStudioView: React.FC = () => {
  const {
    importCSVData,
    exportOpportunitiesCSV,
    showToast,
    people,
    companies,
    currentUser,
    lastImport,
    undoLastImport,
    refreshCrmData,
  } = useCRM();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importTarget, setImportTarget] = useState<'opportunities' | 'companies' | 'people'>('opportunities');
  const [pastedData, setPastedData] = useState<string>('');

  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isParsed, setIsParsed] = useState(false);
  const [validationReport, setValidationReport] = useState<ValidationReport>({ errors: [], warnings: [] });
  const [duplicateCandidates, setDuplicateCandidates] = useState<DuplicateCandidate[]>([]);
  const [isScanningDuplicates, setIsScanningDuplicates] = useState(false);
  const [resolvingPair, setResolvingPair] = useState<string | null>(null);

  const applyParsedRows = (rows: any[], fields: string[]) => {
    setHeaders(fields);
    setParsedRows(rows);
    setValidationReport(buildValidationReport(importTarget, rows, people, companies));
    setIsParsed(true);
  };

  const handleParse = (data: string, isFile: boolean = false) => {
    Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          showToast(`Error parsing CSV: ${results.errors[0].message}`, 'error');
          return;
        }
        applyParsedRows(results.data as any[], results.meta.fields || []);
        showToast(`Parsed ${results.data.length} rows successfully`, 'success');
      },
      error: (error: Error) => {
        showToast(`Error: ${error.message}`, 'error');
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          showToast(`Error parsing CSV file: ${results.errors[0].message}`, 'error');
          return;
        }
        applyParsedRows(results.data as any[], results.meta.fields || []);
        showToast(`Parsed ${results.data.length} rows successfully`, 'success');
      }
    });
  };

  const handleParseManual = () => {
    if (!pastedData.trim()) {
      showToast('Please paste CSV or tabular data', 'error');
      return;
    }
    handleParse(pastedData);
  };

  const handleExecuteImport = () => {
    if (parsedRows.length === 0) return;
    if (validationReport.errors.length > 0) {
      showToast('Corrige los errores de validación antes de importar.', 'error');
      return;
    }
    importCSVData(importTarget, parsedRows);
    setIsParsed(false);
    setParsedRows([]);
    setPastedData('');
    setValidationReport({ errors: [], warnings: [] });
  };

  const scanDuplicates = async () => {
    setIsScanningDuplicates(true);
    try {
      const response = await fetch('/api/crm/duplicates', {
        headers: await getClientumAuthJsonHeaders(currentUser),
      });
      const payload = await response.json() as { duplicates?: DuplicateCandidate[]; error?: string };
      if (!response.ok) throw new Error(payload.error || 'No se pudo analizar la base.');
      setDuplicateCandidates(payload.duplicates || []);
      showToast(`${payload.duplicates?.length || 0} posibles duplicados encontrados.`, 'info');
    } catch (error: any) {
      showToast(error?.message || 'No se pudo analizar la base.', 'error');
    } finally {
      setIsScanningDuplicates(false);
    }
  };

  const resolveDuplicate = async (candidate: DuplicateCandidate, action: 'merge' | 'dismiss') => {
    setResolvingPair(candidate.pairKey);
    try {
      const response = await fetch('/api/crm/duplicates/resolve', {
        method: 'POST',
        headers: await getClientumAuthJsonHeaders(currentUser),
        body: JSON.stringify({
          entityType: candidate.entityType,
          primaryId: candidate.primary.id,
          duplicateId: candidate.duplicate.id,
          action,
        }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'No se pudo resolver el duplicado.');
      if (action === 'merge') await refreshCrmData();
      setDuplicateCandidates((previous) => previous.filter((item) => item.pairKey !== candidate.pairKey));
      showToast(action === 'merge' ? 'Registros fusionados correctamente.' : 'Coincidencia descartada.', 'success');
    } catch (error: any) {
      showToast(error?.message || 'No se pudo resolver el duplicado.', 'error');
    } finally {
      setResolvingPair(null);
    }
  };

  const changeImportTarget = (target: 'opportunities' | 'companies' | 'people') => {
    setImportTarget(target);
    if (isParsed) setValidationReport(buildValidationReport(target, parsedRows, people, companies));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[#e1e4ea] p-6">
      {/* Header Banner */}
      <div className="mb-6 p-6 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white tracking-tight">Clientum Data Import & Export Studio</h1>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                CSV Studio
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
              Bulk import leads, companies, and deals with field auto-mapping, schema validation, and CSV export.
            </p>
          </div>
        </div>

        <button
          onClick={exportOpportunitiesCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#202738] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs font-semibold transition-all shadow-md"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          Export Deals to CSV
        </button>
         {lastImport && (
           <button
             onClick={() => void undoLastImport()}
             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all"
           >
             <RotateCcw className="w-4 h-4" />
             Undo last import ({lastImport.count})
           </button>
         )}
      </div>

      {/* Grid: Config & Input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Target Entity & Input Area */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] space-y-4">
            <h2 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              1. Select Destination Entity
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <button
                 onClick={() => changeImportTarget('opportunities')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${ importTarget === 'opportunities' ? 'bg-blue-600 border-blue-500 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
              >
                Deals
              </button>
              <button
                 onClick={() => changeImportTarget('companies')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${ importTarget === 'companies' ? 'bg-blue-600 border-blue-500 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
              >
                Companies
              </button>
              <button
                 onClick={() => changeImportTarget('people')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${ importTarget === 'people' ? 'bg-blue-600 border-blue-500 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
              >
                People
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-2">
                  2. Upload or Paste CSV
                </label>
                <div 
                  className="w-full h-32 border-2 border-dashed border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090b0e]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-[var(--text-muted)] mb-2" />
                  <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Click to upload CSV</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".csv"
                  className="hidden" 
                />
              </div>

              <div>
                <textarea
                  value={pastedData}
                  onChange={(e) => {
                    setPastedData(e.target.value);
                    setIsParsed(false);
                  }}
                  placeholder="Or paste CSV content here..."
                  className="w-full h-32 px-3.5 py-2.5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090b0e] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleParseManual}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              Validate Pasted Data
            </button>
          </div>
        </div>

        {/* Right Col: Field Mapping & Preview Table */}
        <div className="lg:col-span-2">
          {isParsed ? (
            <div className="p-5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white uppercase tracking-wider">
                    3. Mapped Data Preview ({parsedRows.length} rows)
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                     onClick={() => {
                       setIsParsed(false);
                       setParsedRows([]);
                       setValidationReport({ errors: [], warnings: [] });
                     }}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs font-semibold hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleExecuteImport}
                     disabled={validationReport.errors.length > 0}
                     className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Import All {parsedRows.length} Records Now
                  </button>
                </div>
              </div>

               {(validationReport.errors.length > 0 || validationReport.warnings.length > 0) && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {validationReport.errors.length > 0 && (
                     <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                       <div className="flex items-center gap-2 text-red-300 text-xs font-bold">
                         <AlertCircle className="w-4 h-4" />
                         {validationReport.errors.length} errores bloquean la importación
                       </div>
                       <ul className="mt-2 space-y-1 text-[11px] text-red-200/80">
                         {validationReport.errors.slice(0, 5).map((issue, index) => (
                           <li key={`${issue.row}-${index}`}>Fila {issue.row}: {issue.message}</li>
                         ))}
                       </ul>
                     </div>
                   )}
                   {validationReport.warnings.length > 0 && (
                     <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                       <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                         <AlertTriangle className="w-4 h-4" />
                         {validationReport.warnings.length} advertencias para revisar
                       </div>
                       <ul className="mt-2 space-y-1 text-[11px] text-amber-200/80">
                         {validationReport.warnings.slice(0, 5).map((issue, index) => (
                           <li key={`${issue.row}-${index}`}>Fila {issue.row}: {issue.message}</li>
                         ))}
                       </ul>
                     </div>
                   )}
                 </div>
               )}

              {/* Data Table Preview */}
              <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090b0e] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141822] text-[var(--text-secondary,#475569)] dark:text-slate-300 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d]">
                      {headers.map((h, i) => (
                        <th key={i} className="px-3 py-2.5 font-bold font-mono text-[11px]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1e222d] text-[var(--text-secondary,#475569)] dark:text-slate-300">
                    {parsedRows.slice(0, 5).map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#121622]">
                        {headers.map((h, colIdx) => (
                          <td key={colIdx} className="px-3 py-2 text-[11px] truncate max-w-[180px]">
                            {row[h] || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 5 && (
                <p className="text-[11px] text-[var(--text-muted)] text-center italic">
                  Showing first 5 of {parsedRows.length} rows...
                </p>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-xl border border-dashed border-[var(--border-subtle,#e2e8f0)] dark:border-[#23293a] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14]/50 flex flex-col items-center justify-center text-center">
              <Table className="w-10 h-10 text-[var(--text-secondary)] mb-3" />
              <h3 className="text-sm font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">No CSV Data Parsed Yet</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
                Upload a CSV file or paste content on the left panel and click &quot;Validate&quot; to review the mapped table before importing.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Data quality & duplicate review</h2>
              <p className="text-xs text-[var(--text-muted)]">Find duplicate contacts by email/phone and companies by domain/name.</p>
            </div>
          </div>
          <button
            onClick={() => void scanDuplicates()}
            disabled={isScanningDuplicates}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            {isScanningDuplicates ? 'Scanning…' : 'Scan workspace'}
          </button>
        </div>

        {duplicateCandidates.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">No pending duplicate matches. Run a scan to check the workspace.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1e222d]">
            {duplicateCandidates.map((candidate) => (
              <div key={candidate.pairKey} className="py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {candidate.entityType === 'people'
                    ? <UsersRound className="w-4 h-4 mt-1 text-blue-300" />
                    : <Building2 className="w-4 h-4 mt-1 text-amber-300" />}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300">
                      <span className="font-semibold">{displayRecordName(candidate.primary)}</span>
                      <span className="text-[var(--text-secondary)]">↔</span>
                      <span className="font-semibold">{displayRecordName(candidate.duplicate)}</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">
                      Coinciden por {candidate.matchField}: <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300">{candidate.matchValue}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => void resolveDuplicate(candidate, 'dismiss')}
                    disabled={resolvingPair === candidate.pairKey}
                    className="px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white disabled:opacity-50 text-xs font-semibold"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => void resolveDuplicate(candidate, 'merge')}
                    disabled={resolvingPair === candidate.pairKey}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    Merge into first
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
