import React, { useState } from 'react';
import {
  Mail,
  HardDrive,
  Calendar,
  Send,
  Plus,
  RefreshCw,
  CheckCircle2,
  Folder,
  FileText,
  Clock,
  ExternalLink,
  Sparkles,
  Inbox,
  Paperclip
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const GoogleWorkspaceDashboardPage: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();

  const [activeTab, setActiveTab] = useState<'drive' | 'campaigns' | 'calendar'>('drive');
  const [isSyncing, setIsSyncing] = useState(false);

  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileFolder, setNewFileFolder] = useState('Presupuestos & Cotizaciones');

  const [isTmplModalOpen, setIsTmplModalOpen] = useState(false);
  const [newTmplName, setNewTmplName] = useState('');
  const [newTmplSubject, setNewTmplSubject] = useState('');

  const [isCalModalOpen, setIsCalModalOpen] = useState(false);
  const [newCalTitle, setNewCalTitle] = useState('');
  const [newCalClient, setNewCalClient] = useState('');

  const handleCreateDriveFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const newFile = {
      id: `f-${Date.now()}`,
      name: newFileName.endsWith('.pdf') || newFileName.endsWith('.docx') ? newFileName : `${newFileName}.pdf`,
      size: '1.2 MB',
      updated: 'Ahora',
      folder: newFileFolder
    };
    setDriveFiles([newFile, ...driveFiles]);
    setIsDriveModalOpen(false);
    setNewFileName('');
    showToast(`Archivo "${newFile.name}" subido a Google Drive`, 'success');
    triggerConfetti();
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTmplName.trim() || !newTmplSubject.trim()) return;
    const newTmpl = {
      id: `tmpl-${Date.now()}`,
      name: newTmplName,
      subject: newTmplSubject,
      openRate: '100%',
      sentCount: 1
    };
    setEmailTemplates([newTmpl, ...emailTemplates]);
    setIsTmplModalOpen(false);
    setNewTmplName('');
    setNewTmplSubject('');
    showToast(`Plantilla de email "${newTmpl.name}" guardada`, 'success');
  };

  const handleCreateCalendarEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCalTitle.trim()) return;
    const newEvt = {
      id: `cal-${Date.now()}`,
      title: newCalTitle,
      client: newCalClient || 'General',
      time: '16:00 - 16:30',
      status: 'Confirmado',
      meetLink: `meet.google.com/meet-${Math.floor(Math.random()*1000)}`
    };
    setCalendarEvents([newEvt, ...calendarEvents]);
    setIsCalModalOpen(false);
    setNewCalTitle('');
    setNewCalClient('');
    showToast(`Evento "${newEvt.title}" agendado en Google Calendar`, 'success');
    triggerConfetti();
  };

  const [driveFiles, setDriveFiles] = useState([
    { id: 'f-1', name: 'Presupuesto Comercial - Distribuidora Patagónica.pdf', size: '1.4 MB', updated: 'Hoy 10:20', folder: 'Presupuestos & Cotizaciones' },
    { id: 'f-2', name: 'Contrato Marco de Servicios SaaS ClientumOS.docx', size: '420 KB', updated: 'Ayer', folder: 'Legales & Contratos' },
    { id: 'f-3', name: 'Manual de Identidad y Logo Vectorial.zip', size: '8.2 MB', updated: '08 Sep', folder: 'Branding & Diseño' },
    { id: 'f-4', name: 'Planilla de Objetivos Comerciales Q3.xlsx', size: '890 KB', updated: '05 Sep', folder: 'Finanzas' },
  ]);

  const [emailTemplates, setEmailTemplates] = useState([
    { id: 'tmpl-1', name: 'Secuencia Bienvenida B2B', subject: 'Bienvenido a Clientum CRM - Próximos pasos', openRate: '68%', sentCount: 142 },
    { id: 'tmpl-2', name: 'Seguimiento Propuesta Comercial', subject: 'Revisión de propuesta y dudas técnicas', openRate: '54%', sentCount: 89 },
    { id: 'tmpl-3', name: 'Reactiva Tratos Fríos', subject: '¿Sigue vigente el proyecto de automatización?', openRate: '41%', sentCount: 210 },
  ]);

  const [calendarEvents, setCalendarEvents] = useState([
    { id: 'cal-1', title: 'Demo ClientumOS + WhatsApp CRM', client: 'Distribuidora Patagónica', time: '15:00 - 15:45', status: 'Confirmado', meetLink: 'meet.google.com/abc-wxyz-123' },
    { id: 'cal-2', title: 'Reunión de Onboarding y Cuentas', client: 'Ferretería Central S.R.L.', time: '17:00 - 17:30', status: 'Confirmado', meetLink: 'meet.google.com/def-uvwx-456' },
  ]);

  const handleSyncDrive = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Sincronización con Google Drive completada (4 carpetas actualizadas).', 'success');
      triggerConfetti();
    }, 800);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--clientum-surface,#F5F7FA)] dark:bg-[var(--crm-bg,#040711)] text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              Google Workspace
            </span>
            <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted)]">workspace_integrations_dashboard.md</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2.5">
            <HardDrive className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            Integraciones Google Workspace, Gmail y Drive
          </h1>
          <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 max-w-3xl">
            Conectividad con herramientas de Google Workspace (Drive, Gmail, Calendar y SMTP) para centralizar la documentación corporativa, el envío de campañas de correo y la sincronización de agendas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSyncDrive}
            disabled={isSyncing}
            className="px-3 py-2 bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar con Drive'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 pb-2">
        {[
          { id: 'drive', label: '1. Google Drive & Document Manager', icon: HardDrive },
          { id: 'campaigns', label: '2. Campañas Email & Plantillas HTML', icon: Mail },
          { id: 'calendar', label: '3. Calendario & Google Meet', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${ activeTab === tab.id ? 'bg-[var(--clientum-blue,#002B5C)] text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs font-bold' : 'text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800/60' }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Drive */}
      {activeTab === 'drive' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <Folder className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              Archivos y Carpetas Sincronizadas en la Nube
            </h2>
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="px-3 py-1.5 bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Subir a Drive
            </button>
          </div>

          <div className="bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-muted)] dark:bg-slate-900/80 text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                <tr>
                  <th className="p-3">Nombre del Archivo</th>
                  <th className="p-3">Carpeta</th>
                  <th className="p-3">Tamaño</th>
                  <th className="p-3">Última Modificación</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] dark:divide-slate-800 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">
                {driveFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-[var(--bg-muted)]/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />
                      <span>{file.name}</span>
                    </td>
                    <td className="p-3 text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-muted)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                        {file.folder}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">{file.size}</td>
                    <td className="p-3 text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">{file.updated}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => showToast(`Abriendo ${file.name} en Google Drive`, 'info')}
                        className="text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer flex items-center gap-1 ml-auto font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              Plantillas HTML y Secuencias de Correo Comercial
            </h2>
            <button
              onClick={() => setIsTmplModalOpen(true)}
              className="px-3 py-1.5 bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva Plantilla
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emailTemplates.map((tmpl) => (
              <div key={tmpl.id} className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] space-y-3 shadow-xs">
                <div className="text-xs font-bold text-[var(--text-primary)] dark:text-white">{tmpl.name}</div>
                <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 line-clamp-1 italic">"{tmpl.subject}"</div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/60 text-xs">
                  <span className="text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">Aperturas: <strong className="text-emerald-600 dark:text-emerald-400">{tmpl.openRate}</strong></span>
                  <span className="text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">Enviados: <strong className="text-[var(--text-primary)] dark:text-white">{tmpl.sentCount}</strong></span>
                </div>
                <button
                  onClick={() => showToast(`Enviando prueba de "${tmpl.name}" vía SMTP verificado...`, 'info')}
                  className="w-full py-1.5 bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text-primary)] dark:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                  Enviar Prueba SMTP
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              Reuniones y Demos en Google Calendar
            </h2>
            <button
              onClick={() => setIsCalModalOpen(true)}
              className="px-3 py-1.5 bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Agendar Evento
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {calendarEvents.map((evt) => (
              <div key={evt.id} className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)] dark:text-white">{evt.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                    {evt.status}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">Cliente: {evt.client}</div>
                <div className="text-xs text-sky-600 dark:text-sky-400 font-mono flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {evt.time}
                </div>
                <div className="pt-2 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">{evt.meetLink}</span>
                  <button
                    onClick={() => showToast(`Abriendo enlace de Google Meet: ${evt.meetLink}`, 'info')}
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-semibold cursor-pointer shadow-xs"
                  >
                    Unirse a Meet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drive File Upload Modal */}
      {isDriveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg-card)] dark:bg-[#121622] border border-[var(--border-subtle)] dark:border-[#232b3f] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <Folder className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              Subir Archivo a Google Drive
            </h3>
            <form onSubmit={handleCreateDriveFile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Nombre del Archivo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Propuesta_Comercial_2026.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-[var(--bg-muted)] dark:bg-[#181d2c] text-[var(--text-primary)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle)] dark:border-[#273248] text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Carpeta de Destino</label>
                <select
                  value={newFileFolder}
                  onChange={(e) => setNewFileFolder(e.target.value)}
                  className="w-full bg-[var(--bg-muted)] dark:bg-[#181d2c] text-[var(--text-primary)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle)] dark:border-[#273248] text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="Presupuestos & Cotizaciones">Presupuestos & Cotizaciones</option>
                  <option value="Contratos & NDA">Contratos & NDA</option>
                  <option value="Manuales & Presentaciones">Manuales & Presentaciones</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDriveModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Subir a Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Template Modal */}
      {isTmplModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg-card)] dark:bg-[#121622] border border-[var(--border-subtle)] dark:border-[#232b3f] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              Nueva Plantilla de Correo HTML
            </h3>
            <form onSubmit={handleCreateTemplate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Nombre Interno</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Bienvenida Nuevos Clientes B2B"
                  value={newTmplName}
                  onChange={(e) => setNewTmplName(e.target.value)}
                  className="w-full bg-[var(--bg-muted)] dark:bg-[#181d2c] text-[var(--text-primary)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle)] dark:border-[#273248] text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Asunto del Email</label>
                <input
                  type="text"
                  required
                  placeholder="ej. ¡Bienvenido a ClientumCRM! Tu cuenta está lista..."
                  value={newTmplSubject}
                  onChange={(e) => setNewTmplSubject(e.target.value)}
                  className="w-full bg-[var(--bg-muted)] dark:bg-[#181d2c] text-[var(--text-primary)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle)] dark:border-[#273248] text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTmplModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Guardar Plantilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar Event Modal */}
      {isCalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg-card)] dark:bg-[#121622] border border-[var(--border-subtle)] dark:border-[#232b3f] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              Agendar Demo / Reunión en Google Calendar
            </h3>
            <form onSubmit={handleCreateCalendarEvent} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Título de la Reunión</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Demo Técnica ClientumCRM & API WhatsApp"
                  value={newCalTitle}
                  onChange={(e) => setNewCalTitle(e.target.value)}
                  className="w-full bg-[var(--bg-muted)] dark:bg-[#181d2c] text-[var(--text-primary)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle)] dark:border-[#273248] text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Cliente / Asistentes</label>
                <input
                  type="text"
                  placeholder="ej. Carlos Mendoza (ABEPOL S.R.L.)"
                  value={newCalClient}
                  onChange={(e) => setNewCalClient(e.target.value)}
                  className="w-full bg-[var(--bg-muted)] dark:bg-[#181d2c] text-[var(--text-primary)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle)] dark:border-[#273248] text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCalModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Agendar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
