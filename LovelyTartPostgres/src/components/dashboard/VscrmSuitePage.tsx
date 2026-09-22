import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  Users,
  FileSpreadsheet,
  Play,
  Square,
  Plus,
  CheckCircle2,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  FolderKanban,
  FileCheck
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface Project {
  id: string;
  name: string;
  client: string;
  budget: number;
  spentHours: number;
  estimatedHours: number;
  status: 'Activo' | 'En Pausa' | 'Completado';
  deadline: string;
}

interface TimeLog {
  id: string;
  project: string;
  task: string;
  operator: string;
  hours: number;
  ratePerHour: number;
  date: string;
  billable: boolean;
}

export const VscrmSuiteDashboardPage: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();

  const [activeTab, setActiveTab] = useState<'projects' | 'tracking' | 'clients' | 'invoicing'>('projects');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1420); // ~23 mins
  const [currentTimerTask, setCurrentTimerTask] = useState('Desarrollo Backend API & Auth');

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState(250000);
  const [newProjectEstimatedHours, setNewProjectEstimatedHours] = useState(40);

  const [isNewTimeLogModalOpen, setIsNewTimeLogModalOpen] = useState(false);
  const [newTimeProject, setNewTimeProject] = useState('Implementación E-commerce B2B');
  const [newTimeTask, setNewTimeTask] = useState('');
  const [newTimeHours, setNewTimeHours] = useState(2);
  const [newTimeRate, setNewTimeRate] = useState(12000);

  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectClient.trim()) return;
    const newPrj: Project = {
      id: `prj-${104 + projects.length}`,
      name: newProjectName,
      client: newProjectClient,
      budget: Number(newProjectBudget) || 0,
      spentHours: 0,
      estimatedHours: Number(newProjectEstimatedHours) || 10,
      status: 'Activo',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setProjects([newPrj, ...projects]);
    setIsNewProjectModalOpen(false);
    setNewProjectName('');
    setNewProjectClient('');
    showToast(`Proyecto "${newPrj.name}" creado con éxito`, 'success');
    triggerConfetti();
  };

  const handleCreateTimeLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimeTask.trim()) return;
    const newLog: TimeLog = {
      id: `tl-${Date.now()}`,
      project: newTimeProject,
      task: newTimeTask,
      operator: 'Alex Morgan',
      hours: Number(newTimeHours) || 1,
      ratePerHour: Number(newTimeRate) || 10000,
      date: 'Hoy',
      billable: true
    };
    setTimeLogs([newLog, ...timeLogs]);
    setIsNewTimeLogModalOpen(false);
    setNewTimeTask('');
    showToast('Horas registradas exitosamente en el proyecto', 'success');
  };

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'prj-101',
      name: 'Implementación E-commerce B2B',
      client: 'Distribuidora del Sur S.A.',
      budget: 350000,
      spentHours: 42,
      estimatedHours: 60,
      status: 'Activo',
      deadline: '2026-10-15',
    },
    {
      id: 'prj-102',
      name: 'Integración WhatsApp Business API',
      client: 'Logística & Envíos Express',
      budget: 180000,
      spentHours: 18,
      estimatedHours: 25,
      status: 'Activo',
      deadline: '2026-09-30',
    },
    {
      id: 'prj-103',
      name: 'Auditoría Fiscal & Facturación AFIP',
      client: 'Grupo Gastronómico Norte',
      budget: 220000,
      spentHours: 35,
      estimatedHours: 35,
      status: 'Completado',
      deadline: '2026-09-10',
    },
  ]);

  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([
    {
      id: 'tl-1',
      project: 'Implementación E-commerce B2B',
      task: 'Configuración de catálogo y stock',
      operator: 'Alex Morgan',
      hours: 4.5,
      ratePerHour: 12000,
      date: 'Hoy',
      billable: true,
    },
    {
      id: 'tl-2',
      project: 'Integración WhatsApp Business API',
      task: 'Prueba de webhooks y plantillas HSM',
      operator: 'María González',
      hours: 3.0,
      ratePerHour: 14000,
      date: 'Ayer',
      billable: true,
    },
    {
      id: 'tl-3',
      project: 'Implementación E-commerce B2B',
      task: 'Reunión de coordinación con cliente',
      operator: 'Alex Morgan',
      hours: 1.5,
      ratePerHour: 10000,
      date: '10 Sep',
      billable: false,
    },
  ]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
      showToast('Tiempo registrado con éxito en el proyecto.', 'success');
      triggerConfetti();
    } else {
      setIsTimerRunning(true);
      showToast(`Cronómetro iniciado para: ${currentTimerTask}`, 'info');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--clientum-surface,#F5F7FA)] dark:bg-[var(--crm-bg,#040711)] text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Módulo ERP & Servicios
            </span>
            <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted)]">vscrm_suite_dashboard.md</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            VS CRM & ERP Suite - Gestión de Proyectos y Horas
          </h1>
          <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 max-w-3xl">
            Suite empresarial especializada en la gestión unificada de proyectos, control de horas trabajadas (Time Tracking), gastos de equipo y facturación para empresas de servicios profesionales y agencias.
          </p>
        </div>

        {/* Live Timer Widget */}
        <div className="flex items-center gap-3 bg-[var(--bg-card)] dark:bg-slate-800/80 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 p-2.5 rounded-xl shadow-xs shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider font-semibold">Time Tracking Activo</div>
            <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatTimer(timerSeconds)}</div>
          </div>
          <button
            onClick={toggleTimer}
            className={`p-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${ isTimerRunning ? 'bg-rose-600 hover:bg-rose-500 text-[var(--text-primary,#0f172a)] dark:text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500 text-white' }`}
          >
            {isTimerRunning ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isTimerRunning ? 'Detener' : 'Iniciar'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 pb-2">
        {[
          { id: 'projects', label: '1. Proyectos y Tareas', icon: FolderKanban },
          { id: 'tracking', label: '2. Time Tracking (Horas)', icon: Clock },
          { id: 'clients', label: '3. Clientes & Cuentas VS', icon: Users },
          { id: 'invoicing', label: '4. Presupuestos y Cobros', icon: FileSpreadsheet },
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

      {/* Tab Contents */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Proyectos y Entregables Activos
            </h2>
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo Proyecto
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((p) => {
              const progress = Math.min(100, Math.round((p.spentHours / p.estimatedHours) * 100));
              return (
                <div key={p.id} className="bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] rounded-xl p-4 space-y-3 hover:border-blue-400/60 dark:border-[var(--border-subtle,#e2e8f0)] dark:hover:border-slate-600 shadow-xs transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 bg-[var(--bg-muted)] dark:bg-slate-800 px-2 py-0.5 rounded border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                      {p.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${ p.status === 'Activo' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30' }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">{p.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">{p.client}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      <span>Progreso de Horas</span>
                      <span className="font-semibold text-[var(--text-primary)] dark:text-white">
                        {p.spentHours}h / {p.estimatedHours}h ({progress}%)
                      </span>
                    </div>
                    <div className="w-full bg-[var(--bg-muted)] dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${ progress > 90 ? 'bg-amber-500' : 'bg-blue-500' }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">Presupuesto:</span>
                    <span className="font-bold text-[var(--text-primary)] dark:text-white font-mono">$ {p.budget.toLocaleString('es-AR')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'tracking' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              Bitácora de Horas y Control Operativo
            </h2>
            <button
              onClick={() => showToast('Nueva entrada manual de horas añadida.', 'success')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Cargar Horas Manuales
            </button>
          </div>

          <div className="bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-muted)] dark:bg-slate-900/80 text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Operador</th>
                  <th className="p-3">Proyecto / Tarea</th>
                  <th className="p-3 text-right">Horas</th>
                  <th className="p-3 text-right">Tarifa / Hora</th>
                  <th className="p-3 text-right">Total Facturable</th>
                  <th className="p-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] dark:divide-slate-800 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">
                {timeLogs.map((tl) => (
                  <tr key={tl.id} className="hover:bg-[var(--bg-muted)]/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">{tl.date}</td>
                    <td className="p-3 font-semibold text-[var(--text-primary)] dark:text-white">{tl.operator}</td>
                    <td className="p-3">
                      <div className="font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200">{tl.project}</div>
                      <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">{tl.task}</div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[var(--text-primary)] dark:text-white">{tl.hours}h</td>
                    <td className="p-3 text-right font-mono text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">$ {tl.ratePerHour.toLocaleString('es-AR')}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      $ {(tl.hours * tl.ratePerHour).toLocaleString('es-AR')}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${ tl.billable ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' : 'bg-[var(--bg-muted)] dark:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-600' }`}
                      >
                        {tl.billable ? 'Facturable' : 'No facturable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            Cuentas y Clientes Vinculados a VS CRM
          </h2>
          <div className="p-4 bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] rounded-xl space-y-3 shadow-xs">
            <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
              Las cuentas comerciales registradas en el CRM sincronizan automáticamente sus centros de costos, contratos vigentes y acuerdos de SLA con la suite VS CRM.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--bg-muted)] dark:bg-slate-800/70 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                <div className="text-xs font-bold text-[var(--text-primary)] dark:text-white">Distribuidora del Sur S.A.</div>
                <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">Contrato: Retainer Mensual 40hs</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">SLA: 4 horas de respuesta garantizada</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-muted)] dark:bg-slate-800/70 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                <div className="text-xs font-bold text-[var(--text-primary)] dark:text-white">Logística & Envíos Express</div>
                <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">Contrato: Llave en Mano - Implementación</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">SLA: Soporte 24/7 post lanzamiento</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invoicing' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            Emisión de Presupuestos y Certificación de Servicios
          </h2>
          <div className="p-5 bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] rounded-xl space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)] dark:text-white">Resumen de Horas Acumuladas Pendientes de Cobro</div>
                <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">Total acumulado durante el ciclo actual: 52.5 horas facturables.</div>
              </div>
              <button
                onClick={() => {
                  showToast('Presupuesto de liquidación generado en PDF con firma digital.', 'success');
                  triggerConfetti();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <FileCheck className="w-4 h-4" />
                Generar Nota de Liquidación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg-card)] dark:bg-[#121622] border border-[var(--border-subtle)] dark:border-[#232b3f] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <FolderKanban className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400" />
              Crear Nuevo Proyecto VS CRM
            </h3>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Nombre del Proyecto</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="ej. Implementación E-commerce B2B"
                  className="w-full bg-[var(--bg-muted)] dark:bg-[#181d2c] text-[var(--text-primary)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle)] dark:border-[#273248] text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Empresa / Cliente</label>
                <input
                  type="text"
                  required
                  value={newProjectClient}
                  onChange={(e) => setNewProjectClient(e.target.value)}
                  placeholder="ej. Distribuidora del Sur S.A."
                  className="w-full bg-[var(--bg-muted)] dark:bg-[#181d2c] text-[var(--text-primary)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle)] dark:border-[#273248] text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Presupuesto ($ ARS)</label>
                  <input
                    type="number"
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(Number(e.target.value))}
                    className="w-full bg-[var(--bg-muted)] dark:bg-[#181d2c] text-[var(--text-primary)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle)] dark:border-[#273248] text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Horas Estimadas</label>
                  <input
                    type="number"
                    value={newProjectEstimatedHours}
                    onChange={(e) => setNewProjectEstimatedHours(Number(e.target.value))}
                    className="w-full bg-[var(--bg-muted)] dark:bg-[#181d2c] text-[var(--text-primary)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle)] dark:border-[#273248] text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const VscrmSuitePage = VscrmSuiteDashboardPage;
