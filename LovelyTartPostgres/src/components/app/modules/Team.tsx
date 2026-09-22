import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Search,
  Filter,
  MoreVertical,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Building,
  ChevronRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales Manager' | 'Executive SDR' | 'Analyst' | 'Support';
  department: string;
  status: 'Active' | 'Away' | 'Offline' | 'Invited';
  lastActive: string;
  avatarUrl?: string;
  dealsAssigned: number;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'usr-01',
    name: 'Jonathan Le Dantec',
    email: 'jonathan@clientum.com',
    role: 'Admin',
    department: 'Dirección Comercial',
    status: 'Active',
    lastActive: 'Hace 2 mins',
    dealsAssigned: 18,
  },
  {
    id: 'usr-02',
    name: 'Sofia Martinez',
    email: 'sofia.m@clientum.com',
    role: 'Sales Manager',
    department: 'Ventas Enterprise',
    status: 'Active',
    lastActive: 'Hace 15 mins',
    dealsAssigned: 24,
  },
  {
    id: 'usr-03',
    name: 'Mateo Rossi',
    email: 'mateo.r@clientum.com',
    role: 'Executive SDR',
    department: 'Prospección B2B',
    status: 'Away',
    lastActive: 'Hace 1 hora',
    dealsAssigned: 31,
  },
  {
    id: 'usr-04',
    name: 'Camila Fernandez',
    email: 'camila.f@clientum.com',
    role: 'Analyst',
    department: 'Business Intelligence',
    status: 'Active',
    lastActive: 'Ahora mismo',
    dealsAssigned: 12,
  },
  {
    id: 'usr-05',
    name: 'Lucas Benitez',
    email: 'lucas.b@clientum.com',
    role: 'Support',
    department: 'Customer Success',
    status: 'Invited',
    lastActive: 'Invitación enviada',
    dealsAssigned: 0,
  },
  {
    id: 'usr-06',
    name: 'Valentina Gomez',
    email: 'valentina.g@clientum.com',
    role: 'Executive SDR',
    department: 'Ventas LATAM',
    status: 'Offline',
    lastActive: 'Ayer, 18:40',
    dealsAssigned: 15,
  },
];

export const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // New member form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<TeamMember['role']>('Executive SDR');
  const [newDepartment, setNewDepartment] = useState('Ventas');

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    const newMemberItem: TeamMember = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDepartment,
      status: 'Invited',
      lastActive: 'Invitación enviada',
      dealsAssigned: 0,
    };

    setMembers([newMemberItem, ...members]);
    setIsInviteModalOpen(false);
    setNewEmail('');
    setNewName('');
  };

// ... (import statements)
  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success-border)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Activo
          </span>
        );
      case 'Away':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning-border)]">
            <Clock className="w-3.5 h-3.5" />
            Ausente
          </span>
        );
      case 'Invited':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary-border)]">
            <Mail className="w-3.5 h-3.5" />
            Invitado
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
            <XCircle className="w-3.5 h-3.5" />
            Desconectado
          </span>
        );
    }
  };
// ... (rest of the file)

  const getRoleBadge = (role: TeamMember['role']) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Sales Manager':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Executive SDR':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'Analyst':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-primary,#F8FAFC)] dark:bg-[#070C18] text-[var(--text-primary,#0F172A)] dark:text-slate-100 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Gestión de Equipos & Usuarios
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administra roles, accesos y permisos de los miembros de tu Workspace CRM
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invitar Miembro</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Total de Miembros</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{members.length}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% cap de workspace</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Usuarios Activos</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {members.filter((m) => m.status === 'Active').length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Conectados hoy</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Invitaciones Pendientes</span>
            <Mail className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {members.filter((m) => m.status === 'Invited').length}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Pendientes de aceptar</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Seguridad RBAC</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">SOC2 Active</div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Cifrado & Auditoría</span>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar miembros por nombre, email o departamento..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Rol:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos los roles</option>
            <option value="Admin">Admin</option>
            <option value="Sales Manager">Sales Manager</option>
            <option value="Executive SDR">Executive SDR</option>
            <option value="Analyst">Analyst</option>
            <option value="Support">Support</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos los estados</option>
            <option value="Active">Activo</option>
            <option value="Away">Ausente</option>
            <option value="Invited">Invitado</option>
            <option value="Offline">Desconectado</option>
          </select>
        </div>
      </div>

      {/* Team Member List Table */}
      <div className="rounded-xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4">Miembro / Email</th>
                <th className="py-3 px-4">Rol & Nivel</th>
                <th className="py-3 px-4">Departamento</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Oportunidades</th>
                <th className="py-3 px-4">Última Actividad</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No se encontraron miembros con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {member.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getRoleBadge(
                          member.role
                        )}`}
                      >
                        <Shield className="w-3 h-3" />
                        {member.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{member.department}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(member.status)}</td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {member.dealsAssigned} deals
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {member.lastActive}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        title="Opciones de usuario"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Invitar Nuevo Miembro al Equipo
                </h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Andrés Morales"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="andres@empresa.com"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rol Asignado
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as TeamMember['role'])}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Executive SDR">Executive SDR</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="Ventas"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all"
                >
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
