import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  Plus,
  Trash2,
  Copy,
  Edit2,
  Check,
  X,
  Lock,
  Unlock,
  AlertTriangle,
  Sparkles,
  Info,
  UserCheck,
  KeyRound,
  Eye,
  FileCheck,
  Layers,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import {
  RoleDefinition,
  PermissionResource,
  PermissionAction,
  ResourcePermissions,
  User,
} from '../../types';

const RESOURCE_LABELS: Record<PermissionResource, { label: string; description: string; icon: string }> = {
  opportunities: { label: 'Pipeline & Negocios', description: 'Gestión de deals comerciales, etapas y montos', icon: '💼' },
  companies: { label: 'Empresas & Cuentas', description: 'Directorio B2B y cuentas corporativas', icon: '🏢' },
  people: { label: 'Contactos & Leads', description: 'Directorio de personas y tomadores de decisión', icon: '👤' },
  tasks: { label: 'Tareas & Actividades', description: 'Seguimiento de pendientes, llamadas y notas', icon: '✅' },
  analytics: { label: 'Reportes & BI', description: 'Métricas de conversión, forecasting y KPIs', icon: '📊' },
  erp: { label: 'Facturación & ERP', description: 'Comprobantes fiscales AFIP, inventario y gastos', icon: '🧾' },
  workflows: { label: 'Workflows & Automatización', description: 'Reglas de negocio y triggers automáticos', icon: '⚡' },
  customObjects: { label: 'Custom Objects Studio', description: 'Esquemas de datos personalizados y entidades', icon: '🗄️' },
  settings: { label: 'Configuración del Sistema', description: 'Ajustes globales de workspace y personalización', icon: '⚙️' },
  auditLogs: { label: 'Logs de Auditoría & Seguridad', description: 'Registros de actividad, IP y trazabilidad SOC2', icon: '🛡️' },
  integrations: { label: 'Integraciones & API Hub', description: 'Google Calendar, Slack, Webhooks y API Keys', icon: '🔌' },
};

const ACTION_LABELS: Record<PermissionAction, { label: string; short: string }> = {
  view: { label: 'Visualizar', short: 'Ver' },
  create: { label: 'Crear Nuevo', short: 'Crear' },
  edit: { label: 'Modificar / Editar', short: 'Editar' },
  delete: { label: 'Eliminar / Purgar', short: 'Eliminar' },
  export: { label: 'Exportar (CSV/JSON)', short: 'Exportar' },
  manage: { label: 'Administrar Completo', short: 'Admin' },
};

export const RolesPermissionsTab: React.FC = () => {
  const {
    roles,
    currentRole,
    currentUser,
    users,
    addRole,
    updateRole,
    deleteRole,
    duplicateRole,
    assignUserRole,
    addUser,
    updateCurrentUser,
    showToast,
  } = useCRM();

  const [selectedRoleId, setSelectedRoleId] = useState<string>(() => roles[0]?.id || 'role-admin');
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Form states for creating custom role
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('blue');
  const [presetTemplate, setPresetTemplate] = useState<'admin' | 'sales_rep' | 'sales_manager' | 'auditor' | 'custom'>('custom');

  // Form states for adding user
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState(roles[0]?.name || 'Administrador');

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = (resource: PermissionResource, action: PermissionAction) => {
    if (!selectedRole) return;
    if (selectedRole.isSystem && selectedRole.slug === 'admin' && resource === 'settings' && action === 'manage') {
      showToast('No puedes remover el permiso maestro del Administrador del Sistema', 'warning');
      return;
    }

    const currentResourcePerms: ResourcePermissions = selectedRole.permissions[resource] || {
      view: false,
      create: false,
      edit: false,
      delete: false,
      export: false,
      manage: false,
    };

    const updatedResourcePerms: ResourcePermissions = {
      ...currentResourcePerms,
      [action]: !currentResourcePerms[action],
    };

    // If granting manage, auto-grant view, create, edit
    if (action === 'manage' && updatedResourcePerms.manage) {
      updatedResourcePerms.view = true;
      updatedResourcePerms.create = true;
      updatedResourcePerms.edit = true;
      updatedResourcePerms.export = true;
    }

    // If revoking view, auto-revoke edit, create, delete, export, manage
    if (action === 'view' && !updatedResourcePerms.view) {
      updatedResourcePerms.create = false;
      updatedResourcePerms.edit = false;
      updatedResourcePerms.delete = false;
      updatedResourcePerms.export = false;
      updatedResourcePerms.manage = false;
    }

    const updatedPermissions = {
      ...selectedRole.permissions,
      [resource]: updatedResourcePerms,
    };

    updateRole(selectedRole.id, { permissions: updatedPermissions });
  };

  const handleToggleAllResource = (resource: PermissionResource, grant: boolean) => {
    if (!selectedRole) return;
    const updatedPermissions = {
      ...selectedRole.permissions,
      [resource]: {
        view: grant,
        create: grant,
        edit: grant,
        delete: grant,
        export: grant,
        manage: grant,
      },
    };
    updateRole(selectedRole.id, { permissions: updatedPermissions });
    showToast(`${grant ? 'Concedidos' : 'Revocados'} todos los permisos en ${RESOURCE_LABELS[resource].label}`, 'info');
  };

  const handleCreateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    // Base template permissions
    let initialPerms: Record<PermissionResource, ResourcePermissions> = JSON.parse(
      JSON.stringify(roles.find((r) => r.slug === 'sales_rep')?.permissions || roles[0].permissions)
    );

    if (presetTemplate === 'admin') {
      initialPerms = JSON.parse(JSON.stringify(roles.find((r) => r.slug === 'admin')?.permissions || roles[0].permissions));
    } else if (presetTemplate === 'auditor') {
      initialPerms = JSON.parse(JSON.stringify(roles.find((r) => r.slug === 'auditor')?.permissions || roles[0].permissions));
    } else if (presetTemplate === 'sales_manager') {
      initialPerms = JSON.parse(JSON.stringify(roles.find((r) => r.slug === 'sales_manager')?.permissions || roles[0].permissions));
    }

    const newRole = addRole({
      name: newRoleName.trim(),
      slug: newRoleName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      description: newRoleDescription.trim() || 'Rol personalizado con permisos granulares definidos.',
      color: newRoleColor,
      isSystem: false,
      permissions: initialPerms,
    });

    setSelectedRoleId(newRole.id);
    setIsCreateRoleModalOpen(false);
    setNewRoleName('');
    setNewRoleDescription('');
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150`,
    });

    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div id="rbac-permissions-container" className="space-y-6">
      {/* Overview Banner & Current User Persona Switcher */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Control de Acceso Basado en Roles (RBAC)</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-550/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Seguridad Enterprise Activa
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
              Define políticas de acceso granular (Ver, Crear, Editar, Eliminar, Exportar y Administrar) sobre todos los módulos del CRM. Crea roles personalizados o asigna roles predefinidos a tu equipo comercial.
            </p>
          </div>
        </div>

        {/* Live Simulator Role Persona Switcher */}
        <div className="bg-[var(--bg-muted)] border border-[var(--border-subtle)] p-3 rounded-lg flex flex-col gap-1.5 shrink-0 min-w-[260px]">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span className="font-medium flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              Tu Sesión Actual:
            </span>
            <span className="text-[var(--text-primary)] font-semibold">{currentUser.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              id="rbac-current-user-role-select"
              value={currentUser.role}
              onChange={(e) => {
                const newRole = e.target.value;
                updateCurrentUser({ role: newRole });
                showToast(`Has cambiado tu rol activo a: "${newRole}". Las vistas y permisos se han actualizado.`, 'info');
              }}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-md px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-blue-500"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name} {r.isSystem ? '(Sistema)' : '(Personalizado)'}
                </option>
              ))}
            </select>
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">
            Cambia tu rol aquí para probar las restricciones en vivo.
          </span>
        </div>
      </div>

      {/* Main Roles Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Roles Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              Roles del Espacio ({roles.length})
            </h4>
            <button
              id="rbac-create-role-btn"
              onClick={() => setIsCreateRoleModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Rol</span>
            </button>
          </div>

          <div className="space-y-2">
            {roles.map((role) => {
              const isSelected = selectedRole.id === role.id;
              const userAssignedCount = users.filter((u) => u.role === role.name).length;

              return (
                <div
                  key={role.id}
                  id={`role-item-${role.id}`}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${ isSelected ? 'bg-blue-500/10 border-blue-500/50 shadow-sm ring-1 ring-blue-500/30' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] hover:border-[var(--border-strong)]' }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${ role.color === 'blue' ? 'bg-blue-400' : role.color === 'emerald' ? 'bg-emerald-400' : role.color === 'amber' ? 'bg-amber-400' : role.color === 'purple' ? 'bg-purple-400' : 'bg-rose-400' }`}
                      />
                      <span className="text-xs font-semibold text-[var(--text-primary)] truncate">{role.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {role.isSystem ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                          Sistema
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          Custom
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[var(--text-muted)]" />
                      {userAssignedCount} {userAssignedCount === 1 ? 'usuario' : 'usuarios'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const cloned = duplicateRole(role.id);
                          setSelectedRoleId(cloned.id);
                        }}
                        title="Duplicar Rol"
                        className="p-1 hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {!role.isSystem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`¿Seguro que deseas eliminar el rol "${role.name}"?`)) {
                              deleteRole(role.id);
                            }
                          }}
                          title="Eliminar Rol"
                          className="p-1 hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-500 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats Helper */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg p-3 text-[11px] text-[var(--text-muted)] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-medium">
              <Info className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>Reglas de Seguridad RBAC</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-normal">
              Las restricciones se evalúan en tiempo real. Si un usuario intenta realizar una acción sin permiso (como exportar o borrar deals), se registrará automáticamente en el registro de auditoría.
            </p>
          </div>
        </div>

        {/* Right Column: Permission Matrix Table for Selected Role */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5">
            {/* Role Header Info & Editable Name */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">{selectedRole.name}</h3>
                  {selectedRole.isSystem && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--bg-muted)] text-[var(--text-secondary)]">
                      Rol Predeterminado del Sistema
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{selectedRole.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="rbac-duplicate-selected-role"
                  onClick={() => {
                    const cloned = duplicateRole(selectedRole.id);
                    setSelectedRoleId(cloned.id);
                  }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]/80 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Clonar Rol</span>
              </button>
            </div>
          </div>

          {/* Granular Permission Matrix Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="py-2.5 px-3 min-w-[200px]">Módulo / Recurso</th>
                  {(['view', 'create', 'edit', 'delete', 'export', 'manage'] as PermissionAction[]).map((action) => (
                    <th key={action} className="py-2.5 px-2 text-center min-w-[70px]">
                      {ACTION_LABELS[action].short}
                    </th>
                  ))}
                  <th className="py-2.5 px-2 text-center min-w-[80px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                {(Object.keys(RESOURCE_LABELS) as PermissionResource[]).map((resourceKey) => {
                  const resourceInfo = RESOURCE_LABELS[resourceKey];
                  const perms = selectedRole.permissions[resourceKey] || {
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                    export: false,
                    manage: false,
                  };

                  const allGranted = perms.view && perms.create && perms.edit && perms.delete && perms.export && perms.manage;

                  return (
                    <tr
                      key={resourceKey}
                      id={`perm-row-${resourceKey}`}
                      className="hover:bg-[var(--bg-muted)]/50 transition-colors group"
                    >
                      {/* Resource Info */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{resourceInfo.icon}</span>
                          <div>
                            <span className="font-semibold text-[var(--text-primary)] block">{resourceInfo.label}</span>
                            <span className="text-[10px] text-[var(--text-muted)] block leading-tight">
                              {resourceInfo.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* View Checkbox */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(resourceKey, 'view')}
                          className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-all cursor-pointer ${ perms.view ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'bg-[var(--bg-input)] border border-[var(--border-strong)] text-transparent hover:border-slate-400' }`}
                          title={`Permitir ver ${resourceInfo.label}`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Create Checkbox */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(resourceKey, 'create')}
                          className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-all cursor-pointer ${ perms.create ? 'bg-emerald-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'bg-[var(--bg-input)] border border-[var(--border-strong)] text-transparent hover:border-slate-400' }`}
                          title={`Permitir crear en ${resourceInfo.label}`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Edit Checkbox */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(resourceKey, 'edit')}
                          className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-all cursor-pointer ${ perms.edit ? 'bg-amber-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'bg-[var(--bg-input)] border border-[var(--border-strong)] text-transparent hover:border-slate-400' }`}
                          title={`Permitir editar ${resourceInfo.label}`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Delete Checkbox */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(resourceKey, 'delete')}
                          className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-all cursor-pointer ${ perms.delete ? 'bg-rose-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'bg-[var(--bg-input)] border border-[var(--border-strong)] text-transparent hover:border-slate-400' }`}
                          title={`Permitir eliminar ${resourceInfo.label}`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Export Checkbox */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(resourceKey, 'export')}
                          className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-all cursor-pointer ${ perms.export ? 'bg-purple-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'bg-[var(--bg-input)] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] dark:border-[var(--border-strong)] text-transparent hover:border-slate-400' }`}
                          title={`Permitir exportar ${resourceInfo.label}`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Manage Checkbox */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(resourceKey, 'manage')}
                          className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-all cursor-pointer ${ perms.manage ? 'bg-indigo-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'bg-[var(--bg-input)] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] dark:border-[var(--border-strong)] text-transparent hover:border-slate-400' }`}
                          title={`Acceso Administrador a ${resourceInfo.label}`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                        {/* Quick Grant/Revoke All Button */}
                        <td className="py-3 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleAllResource(resourceKey, !allGranted)}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--bg-muted)] hover:bg-[var(--border-strong)] text-[var(--text-secondary)] transition-colors cursor-pointer"
                          >
                            {allGranted ? 'Quitar Todo' : 'Conceder'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Role Assignment Section */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  Asignación de Roles al Equipo ({users.length} Miembros)
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Administra y cambia instantáneamente el rol asignado a cada miembro de tu equipo.
                </p>
              </div>

              <button
                id="rbac-add-user-btn"
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--border-strong)] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>Agregar Miembro</span>
              </button>
            </div>

            <div className="mt-3 divide-y divide-[var(--border-subtle)]">
              {users.map((user) => {
                const isCurrent = user.id === currentUser.id;

                return (
                  <div
                    key={user.id}
                    id={`user-row-${user.id}`}
                    className="py-2.5 flex items-center justify-between gap-3 hover:bg-[var(--bg-muted)]/50 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-[var(--border-subtle)]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[var(--text-primary)] truncate">{user.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                              Tú
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)] block truncate">{user.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        id={`user-role-select-${user.id}`}
                        value={user.role}
                        onChange={(e) => assignUserRole(user.id, e.target.value)}
                        className="bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-md px-2.5 py-1 text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-blue-500 cursor-pointer"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Custom Role */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Crear Rol Personalizado</h3>
              </div>
              <button
                onClick={() => setIsCreateRoleModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1">Nombre del Rol *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Especialista en Cierre, SDR Jr, Auditor Fiscal"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-md px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Describe las responsabilidades y nivel de acceso..."
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-md px-3 py-1.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1">Plantilla Base de Permisos</label>
                <select
                  value={presetTemplate}
                  onChange={(e: any) => setPresetTemplate(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value="sales_rep">Ejecutivo de Ventas (Pipeline + Contactos)</option>
                  <option value="sales_manager">Gerente Comercial (Acceso Completo Pipeline + Reportes)</option>
                  <option value="auditor">Auditor de Cumplimiento (Solo Lectura + Logs)</option>
                  <option value="admin">Administrador Total (Todos los Permisos)</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1">Color Identificador</label>
                <div className="flex items-center gap-3">
                  {(['blue', 'emerald', 'amber', 'purple', 'rose'] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewRoleColor(color)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${ newRoleColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100' } ${ color === 'blue' ? 'bg-blue-500' : color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : color === 'purple' ? 'bg-purple-500' : 'bg-rose-500' }`}
                    >
                      {newRoleColor === color && <Check className="w-3.5 h-3.5 text-[var(--text-primary,#0f172a)] dark:text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-3 py-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm cursor-pointer"
                >
                  Crear Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Team Member */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Agregar Miembro al Equipo</h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Lucía Fernández"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-md px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1">Email Corporativo *</label>
                <input
                  type="email"
                  required
                  placeholder="lucia.fernandez@clientum.com.ar"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-md px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] font-medium mb-1">Rol Inicial Asignado</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-strong)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-3 py-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm cursor-pointer"
                >
                  Guardar Miembro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
