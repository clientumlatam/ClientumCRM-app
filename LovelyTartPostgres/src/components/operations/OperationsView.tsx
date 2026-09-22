import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  FolderKanban,
  Plus,
  Search,
  Ticket,
  Truck,
  Users2,
  Wrench,
  X,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

type OperationsSection = 'tickets' | 'projects' | 'suppliers' | 'contracts' | 'services';
type TicketStatus = 'Abierto' | 'En progreso' | 'Resuelto';
type ProjectStatus = 'Planificación' | 'En curso' | 'Bloqueado' | 'Finalizado';
type ServiceStatus = 'Programada' | 'En curso' | 'Completada';

interface SupportTicket {
  id: string;
  title: string;
  account: string;
  priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  status: TicketStatus;
  assignee: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  client: string;
  owner: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  status: 'Activo' | 'En revisión';
  spend: number;
}

interface Contract {
  id: string;
  name: string;
  account: string;
  type: 'Servicio' | 'Mantenimiento' | 'Licencia';
  status: 'Activo' | 'Por vencer' | 'Renovación';
  renewalDate: string;
  value: number;
}

interface ServiceOrder {
  id: string;
  title: string;
  account: string;
  technician: string;
  scheduledFor: string;
  status: ServiceStatus;
  location: string;
}

const initialTickets: SupportTicket[] = [
  { id: 'TCK-1042', title: 'Error al emitir factura electrónica A', account: 'Vercel Inc.', priority: 'Alta', status: 'En progreso', assignee: 'Sarah Chen', updatedAt: 'Hoy, 10:42' },
  { id: 'TCK-1041', title: 'Configurar usuarios y permisos del workspace', account: 'Linear App', priority: 'Media', status: 'Abierto', assignee: 'Elena Rostova', updatedAt: 'Ayer, 16:20' },
  { id: 'TCK-1038', title: 'Consulta sobre sincronización de stock', account: 'Supabase Inc.', priority: 'Baja', status: 'Resuelto', assignee: 'Marcus Vance', updatedAt: '05 sep, 09:15' },
];

const initialProjects: Project[] = [
  { id: 'PRJ-028', name: 'Implementación Clientum Sales OS', client: 'Stripe Payments', owner: 'Fernando Díaz', status: 'En curso', progress: 68, dueDate: '2026-09-28' },
  { id: 'PRJ-027', name: 'Migración de catálogo y stock', client: 'Raycast', owner: 'Sarah Chen', status: 'Planificación', progress: 18, dueDate: '2026-10-11' },
  { id: 'PRJ-024', name: 'Integración de API Gateway', client: 'Supabase Inc.', owner: 'Marcus Vance', status: 'Bloqueado', progress: 42, dueDate: '2026-09-19' },
];

const initialSuppliers: Supplier[] = [
  { id: 'SUP-019', name: 'Andreani Logística', category: 'Envíos', contact: 'cuentas@andreani.com', status: 'Activo', spend: 428000 },
  { id: 'SUP-017', name: 'Cloudflare', category: 'Infraestructura', contact: 'billing@cloudflare.com', status: 'Activo', spend: 185000 },
  { id: 'SUP-014', name: 'Estudio Contable del Sur', category: 'Servicios profesionales', contact: 'admin@estudiodelsur.com', status: 'En revisión', spend: 96000 },
];

const initialContracts: Contract[] = [
  { id: 'CTR-088', name: 'Soporte y evolución CRM', account: 'Linear App', type: 'Servicio', status: 'Activo', renewalDate: '2026-12-15', value: 960000 },
  { id: 'CTR-084', name: 'Mantenimiento plataforma web', account: 'Vercel Inc.', type: 'Mantenimiento', status: 'Por vencer', renewalDate: '2026-09-21', value: 420000 },
  { id: 'CTR-081', name: 'Licencias y servicios cloud', account: 'Stripe Payments', type: 'Licencia', status: 'Renovación', renewalDate: '2026-10-03', value: 720000 },
];

const initialServices: ServiceOrder[] = [
  { id: 'OT-221', title: 'Relevamiento de procesos comerciales', account: 'Stripe Payments', technician: 'Fernando Díaz', scheduledFor: '2026-09-10 09:30', status: 'Programada', location: 'Remoto' },
  { id: 'OT-220', title: 'Capacitación de equipo de ventas', account: 'Linear App', technician: 'Elena Rostova', scheduledFor: '2026-09-09 14:00', status: 'En curso', location: 'Buenos Aires' },
  { id: 'OT-218', title: 'Auditoría de integraciones', account: 'Supabase Inc.', technician: 'Marcus Vance', scheduledFor: '2026-09-06 11:00', status: 'Completada', location: 'Remoto' },
];

const sectionMeta: Record<OperationsSection, { label: string; icon: React.ElementType; description: string }> = {
  tickets: { label: 'Soporte', icon: Ticket, description: 'Tickets, prioridades y responsables de atención.' },
  projects: { label: 'Proyectos', icon: FolderKanban, description: 'Implementaciones, avances y fechas comprometidas.' },
  suppliers: { label: 'Proveedores', icon: Building2, description: 'Terceros, categorías y gasto acumulado.' },
  contracts: { label: 'Contratos', icon: FileText, description: 'Servicios, licencias y renovaciones próximas.' },
  services: { label: 'Intervenciones', icon: Wrench, description: 'Órdenes de trabajo, visitas y soporte profesional.' },
};

const money = (value: number) => `$${value.toLocaleString('es-AR')}`;

export const OperationsView: React.FC = () => {
  const { showToast } = useCRM();
  const [activeSection, setActiveSection] = useState<OperationsSection>('tickets');
  const [search, setSearch] = useState('');
  const [tickets, setTickets] = useState(initialTickets);
  const [projects, setProjects] = useState(initialProjects);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [contracts, setContracts] = useState(initialContracts);
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAccount, setNewItemAccount] = useState('');

  const visibleTickets = useMemo(() => tickets.filter((item) => `${item.title} ${item.account} ${item.assignee}`.toLowerCase().includes(search.toLowerCase())), [search, tickets]);
  const visibleProjects = useMemo(() => projects.filter((item) => `${item.name} ${item.client} ${item.owner}`.toLowerCase().includes(search.toLowerCase())), [projects, search]);
  const visibleSuppliers = useMemo(() => suppliers.filter((item) => `${item.name} ${item.category} ${item.contact}`.toLowerCase().includes(search.toLowerCase())), [search, suppliers]);
  const visibleContracts = useMemo(() => contracts.filter((item) => `${item.name} ${item.account} ${item.type}`.toLowerCase().includes(search.toLowerCase())), [contracts, search]);
  const visibleServices = useMemo(() => services.filter((item) => `${item.title} ${item.account} ${item.technician}`.toLowerCase().includes(search.toLowerCase())), [search, services]);

  const advanceTicket = (id: string) => {
    setTickets((items) => items.map((item) => {
      if (item.id !== id) return item;
      const nextStatus: TicketStatus = item.status === 'Abierto' ? 'En progreso' : item.status === 'En progreso' ? 'Resuelto' : 'Abierto';
      return { ...item, status: nextStatus, updatedAt: 'Ahora' };
    }));
    showToast('Estado del ticket actualizado.', 'success');
  };

  const advanceProject = (id: string) => {
    setProjects((items) => items.map((item) => {
      if (item.id !== id) return item;
      const nextProgress = Math.min(100, item.progress + 10);
      return { ...item, progress: nextProgress, status: nextProgress >= 100 ? 'Finalizado' : item.status === 'Bloqueado' ? 'En curso' : item.status };
    }));
    showToast('Avance del proyecto actualizado.', 'success');
  };

  const toggleSupplier = (id: string) => {
    setSuppliers((items) => items.map((item) => item.id === id ? { ...item, status: item.status === 'Activo' ? 'En revisión' : 'Activo' } : item));
    showToast('Estado del proveedor actualizado.', 'info');
  };

  const advanceContract = (id: string) => {
    setContracts((items) => items.map((item) => item.id === id ? { ...item, status: item.status === 'Por vencer' ? 'Renovación' : item.status === 'Renovación' ? 'Activo' : 'Por vencer' } : item));
    showToast('Estado contractual actualizado.', 'info');
  };

  const completeService = (id: string) => {
    setServices((items) => items.map((item) => item.id === id ? { ...item, status: item.status === 'Completada' ? 'Programada' : 'Completada' } : item));
    showToast('Orden de trabajo actualizada.', 'success');
  };

  const openCreateModal = () => {
    if (!['tickets', 'projects'].includes(activeSection)) {
      showToast('La edición de proveedores, contratos e intervenciones se gestiona desde sus fichas operativas.', 'info');
      return;
    }
    setNewItemName('');
    setNewItemAccount('');
    setIsModalOpen(true);
  };

  const createItem = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newItemName.trim() || !newItemAccount.trim()) return;
    if (activeSection === 'tickets') {
      setTickets((items) => [{
        id: `TCK-${1043 + items.length}`,
        title: newItemName.trim(),
        account: newItemAccount.trim(),
        priority: 'Media',
        status: 'Abierto',
        assignee: 'Sin asignar',
        updatedAt: 'Ahora',
      }, ...items]);
      showToast('Ticket creado en Soporte.', 'success');
    } else {
      setProjects((items) => [{
        id: `PRJ-${29 + items.length}`,
        name: newItemName.trim(),
        client: newItemAccount.trim(),
        owner: 'Sin asignar',
        status: 'Planificación',
        progress: 0,
        dueDate: '2026-10-15',
      }, ...items]);
      showToast('Proyecto creado en Operaciones.', 'success');
    }
    setIsModalOpen(false);
  };

  const openItems = tickets.filter((item) => item.status !== 'Resuelto').length;
  const activeProjects = projects.filter((item) => item.status !== 'Finalizado').length;
  const renewalContracts = contracts.filter((item) => item.status !== 'Activo').length;
  const scheduledServices = services.filter((item) => item.status !== 'Completada').length;

  return (
    <div id="clientum-operations-view" className="flex-1 overflow-y-auto bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] p-5 text-[var(--text-primary,#0f172a)] dark:text-slate-200">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-emerald-400" />
              <h1 className="text-base font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Operaciones ERP</h1>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">Backoffice</span>
            </div>
            <p className="max-w-2xl text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Gestiona soporte, proyectos, terceros, contratos e intervenciones en un solo espacio operativo.</p>
          </div>
          <button onClick={openCreateModal} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500">
            <Plus className="h-3.5 w-3.5" /> {activeSection === 'projects' ? 'Nuevo proyecto' : 'Nuevo ticket'}
          </button>
        </header>

        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Tickets abiertos', value: openItems, caption: 'Atención pendiente', icon: Ticket, color: 'text-amber-300' },
            { label: 'Proyectos activos', value: activeProjects, caption: 'Implementaciones en curso', icon: FolderKanban, color: 'text-blue-300' },
            { label: 'Renovaciones', value: renewalContracts, caption: 'Contratos a revisar', icon: FileText, color: 'text-violet-300' },
            { label: 'Intervenciones', value: scheduledServices, caption: 'Órdenes pendientes', icon: Wrench, color: 'text-emerald-300' },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#263047] bg-[var(--bg-card,#ffffff)] dark:bg-[#121722] p-4">
              <div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{metric.label}</p><metric.icon className={`h-4 w-4 ${metric.color}`} /></div>
              <p className="mt-1 text-2xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{metric.value}</p>
              <p className="mt-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{metric.caption}</p>
            </div>
          ))}
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c] p-1">
            {(Object.keys(sectionMeta) as OperationsSection[]).map((section) => {
              const meta = sectionMeta[section];
              const Icon = meta.icon;
              return <button key={section} onClick={() => setActiveSection(section)} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${activeSection === section ? 'bg-emerald-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1b2130] hover:text-white'}`}><Icon className="h-3.5 w-3.5" />{meta.label}</button>;
            })}
          </nav>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-[var(--text-muted)]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Buscar en ${sectionMeta[activeSection].label.toLowerCase()}`} className="w-56 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] bg-[var(--bg-card,#ffffff)] dark:bg-[#111722] py-2 pl-8 pr-3 text-xs text-[var(--text-primary,#0f172a)] dark:text-white outline-none placeholder:text-[var(--text-secondary)] focus:border-emerald-500/60" />
          </div>
        </div>

        <section className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c]">
          <div className="border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] px-4 py-3">
            <div className="flex items-center gap-2"><h2 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{sectionMeta[activeSection].label}</h2><span className="text-xs text-[var(--text-muted)]">·</span><p className="text-xs text-[var(--text-muted)]">{sectionMeta[activeSection].description}</p></div>
          </div>

          {activeSection === 'tickets' && (
            <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1e2330]">
              {visibleTickets.map((ticket) => (
                <div key={ticket.id} className="flex flex-wrap items-center gap-3 px-4 py-4 transition-colors hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151a25]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-300"><Ticket className="h-4 w-4" /></div>
                  <div className="min-w-[220px] flex-1"><p className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{ticket.title}</p><p className="mt-1 text-[11px] text-[var(--text-muted)]">{ticket.id} · {ticket.account} · actualizado {ticket.updatedAt}</p></div>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${ticket.priority === 'Crítica' || ticket.priority === 'Alta' ? 'border-rose-400/20 bg-rose-400/10 text-rose-300' : 'border-slate-500/20 bg-slate-500/10 text-[var(--text-muted,#64748b)] dark:text-slate-400'}`}>{ticket.priority}</span>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${ticket.status === 'Resuelto' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-blue-400/20 bg-blue-400/10 text-blue-300'}`}>{ticket.status}</span>
                  <span className="hidden min-w-28 items-center gap-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 md:flex"><Users2 className="h-3 w-3" />{ticket.assignee}</span>
                  <button onClick={() => advanceTicket(ticket.id)} className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">Avanzar <ChevronRight className="h-3 w-3" /></button>
                </div>
              ))}
              {visibleTickets.length === 0 && <EmptyOperationsState />}
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1e2330]">
              {visibleProjects.map((project) => (
                <div key={project.id} className="flex flex-wrap items-center gap-3 px-4 py-4 transition-colors hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151a25]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-400/10 text-blue-300"><FolderKanban className="h-4 w-4" /></div>
                  <div className="min-w-[220px] flex-1"><p className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{project.name}</p><p className="mt-1 text-[11px] text-[var(--text-muted)]">{project.id} · {project.client} · vence {project.dueDate}</p></div>
                  <div className="w-32"><div className="mb-1 flex justify-between text-[10px] text-[var(--text-muted)]"><span>Avance</span><strong className="text-[var(--text-secondary,#475569)] dark:text-slate-300">{project.progress}%</strong></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#202738]"><div className="h-full rounded-full bg-blue-500" style={{ width: `${project.progress}%` }} /></div></div>
                  <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-1 text-[10px] font-semibold text-blue-300">{project.status}</span>
                  <button onClick={() => advanceProject(project.id)} className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">Actualizar <ChevronRight className="h-3 w-3" /></button>
                </div>
              ))}
              {visibleProjects.length === 0 && <EmptyOperationsState />}
            </div>
          )}

          {activeSection === 'suppliers' && (
            <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1e2330]">
              {visibleSuppliers.map((supplier) => (
                <div key={supplier.id} className="flex flex-wrap items-center gap-3 px-4 py-4 transition-colors hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151a25]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300"><Building2 className="h-4 w-4" /></div>
                  <div className="min-w-[220px] flex-1"><p className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{supplier.name}</p><p className="mt-1 text-[11px] text-[var(--text-muted)]">{supplier.id} · {supplier.category} · {supplier.contact}</p></div>
                  <span className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-slate-200">{money(supplier.spend)}</span>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${supplier.status === 'Activo' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/20 bg-amber-400/10 text-amber-300'}`}>{supplier.status}</span>
                  <button onClick={() => toggleSupplier(supplier.id)} className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">Cambiar estado</button>
                </div>
              ))}
              {visibleSuppliers.length === 0 && <EmptyOperationsState />}
            </div>
          )}

          {activeSection === 'contracts' && (
            <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1e2330]">
              {visibleContracts.map((contract) => (
                <div key={contract.id} className="flex flex-wrap items-center gap-3 px-4 py-4 transition-colors hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151a25]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300"><FileText className="h-4 w-4" /></div>
                  <div className="min-w-[220px] flex-1"><p className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{contract.name}</p><p className="mt-1 text-[11px] text-[var(--text-muted)]">{contract.id} · {contract.account} · {contract.type}</p></div>
                  <span className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-slate-200">{money(contract.value)}</span>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400"><CalendarDays className="h-3 w-3" /> {contract.renewalDate}</span>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${contract.status === 'Activo' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/20 bg-amber-400/10 text-amber-300'}`}>{contract.status}</span>
                  <button onClick={() => advanceContract(contract.id)} className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">Actualizar</button>
                </div>
              ))}
              {visibleContracts.length === 0 && <EmptyOperationsState />}
            </div>
          )}

          {activeSection === 'services' && (
            <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1e2330]">
              {visibleServices.map((service) => (
                <div key={service.id} className="flex flex-wrap items-center gap-3 px-4 py-4 transition-colors hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151a25]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"><Wrench className="h-4 w-4" /></div>
                  <div className="min-w-[220px] flex-1"><p className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{service.title}</p><p className="mt-1 text-[11px] text-[var(--text-muted)]">{service.id} · {service.account} · {service.location}</p></div>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400"><Clock3 className="h-3 w-3" /> {service.scheduledFor}</span>
                  <span className="hidden items-center gap-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 md:flex"><Users2 className="h-3 w-3" /> {service.technician}</span>
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${service.status === 'Completada' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-blue-400/20 bg-blue-400/10 text-blue-300'}`}>{service.status}</span>
                  <button onClick={() => completeService(service.id)} className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">{service.status === 'Completada' ? 'Reabrir' : 'Completar'}</button>
                </div>
              ))}
              {visibleServices.length === 0 && <EmptyOperationsState />}
            </div>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form onSubmit={createItem} className="w-full max-w-md rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2a3348] bg-[var(--bg-card,#ffffff)] dark:bg-[#111722] p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div><h2 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{activeSection === 'projects' ? 'Nuevo proyecto' : 'Nuevo ticket'}</h2><p className="mt-1 text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Crea un registro operativo para darle seguimiento desde este módulo.</p></div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#202838] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">{activeSection === 'projects' ? 'Nombre del proyecto' : 'Motivo del ticket'}
              <input required value={newItemName} onChange={(event) => setNewItemName(event.target.value)} className="mt-1 w-full rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b1018] px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white outline-none focus:border-emerald-500/60" placeholder={activeSection === 'projects' ? 'Implementación de...' : 'Describir el problema...'} />
            </label>
            <label className="mt-3 block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">{activeSection === 'projects' ? 'Cliente' : 'Empresa o cuenta'}
              <input required value={newItemAccount} onChange={(event) => setNewItemAccount(event.target.value)} className="mt-1 w-full rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b1018] px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white outline-none focus:border-emerald-500/60" placeholder="Seleccionar o escribir..." />
            </label>
            <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] px-3 py-2 text-xs font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">Cancelar</button><button type="submit" className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500">Guardar</button></div>
          </form>
        </div>
      )}
    </div>
  );
};

const EmptyOperationsState: React.FC = () => (
  <div className="px-6 py-14 text-center">
    <AlertCircle className="mx-auto h-8 w-8 text-[var(--text-secondary)]" />
    <p className="mt-3 text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">No hay registros que coincidan</p>
    <p className="mt-1 text-xs text-[var(--text-muted)]">Prueba otra búsqueda o crea un nuevo registro operativo.</p>
  </div>
);