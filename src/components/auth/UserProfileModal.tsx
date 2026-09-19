import React, { useState } from 'react';
import { User, Mail, Shield, Key, LogOut, CheckCircle2, X, Camera, Lock, Building, Bell } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { firebaseSignOut } from '../../firebase';

export const UserProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUser, logout, showToast } = useCRM();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(currentUser.role);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification preferences state
  const [notifPreferences, setNotifPreferences] = useState({
    pushTaskAssignments: true,
    emailTaskAssignments: true,
    pushDeadlines: true,
    emailDeadlines: true,
    pushMentions: true,
    emailMentions: true,
  });

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      email,
      role,
      avatar,
    });
    showToast('Perfil de usuario actualizado correctamente', 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Por favor completa las contraseñas', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
    showToast('Las contraseñas nuevas no coinciden', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Contraseña restablecida con éxito', 'success');
  };

  const handleSaveNotificationPreferences = () => {
    showToast('Preferencias de notificaciones actualizadas con éxito', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden text-xs text-[var(--text-primary)]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--bg-muted)] border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Perfil de Usuario y Notificaciones</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Avatar & Basic Info */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={avatar}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/50 shadow-md"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--bg-card)]" />
              </div>
              <div className="flex-1 space-y-1">
                <label className="block text-[11px] font-semibold text-[var(--text-muted)]">URL del Avatar / Foto</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Rol / Cargo Comercial</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Guardar Cambios de Perfil
              </button>
            </div>
          </form>

          <hr className="border-[var(--border-subtle)]" />

          {/* Notification Preferences Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-blue-500" />
              <h4 className="text-xs font-bold text-[var(--text-primary)]">Preferencias de Notificaciones (Push & Email)</h4>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Configura qué alertas deseas recibir en tiempo real y por correo electrónico.
            </p>

            <div className="space-y-3 bg-[var(--bg-muted)]/50 p-4 rounded-xl border border-[var(--border-subtle)]">
              {/* Task Assignments */}
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
                <div>
                  <span className="font-semibold text-[var(--text-primary)] block">Asignaciones de tareas</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Cuando se te asigne una nueva tarea comercial o operativa</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifPreferences.pushTaskAssignments}
                      onChange={(e) => setNotifPreferences({ ...notifPreferences, pushTaskAssignments: e.target.checked })}
                      className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500"
                    />
                    Push
                  </label>
                  <label className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifPreferences.emailTaskAssignments}
                      onChange={(e) => setNotifPreferences({ ...notifPreferences, emailTaskAssignments: e.target.checked })}
                      className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500"
                    />
                    Email
                  </label>
                </div>
              </div>

              {/* Deadlines */}
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
                <div>
                  <span className="font-semibold text-[var(--text-primary)] block">Fechas límites próximas</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Alertas sobre vencimientos de tratos y compromisos</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifPreferences.pushDeadlines}
                      onChange={(e) => setNotifPreferences({ ...notifPreferences, pushDeadlines: e.target.checked })}
                      className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500"
                    />
                    Push
                  </label>
                  <label className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifPreferences.emailDeadlines}
                      onChange={(e) => setNotifPreferences({ ...notifPreferences, emailDeadlines: e.target.checked })}
                      className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500"
                    />
                    Email
                  </label>
                </div>
              </div>

              {/* Mentions */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="font-semibold text-[var(--text-primary)] block">Menciones (@mentions)</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Cuando alguien te mencione en notas o comentarios</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifPreferences.pushMentions}
                      onChange={(e) => setNotifPreferences({ ...notifPreferences, pushMentions: e.target.checked })}
                      className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500"
                    />
                    Push
                  </label>
                  <label className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifPreferences.emailMentions}
                      onChange={(e) => setNotifPreferences({ ...notifPreferences, emailMentions: e.target.checked })}
                      className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500"
                    />
                    Email
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotificationPreferences}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Guardar Preferencias de Notificación
              </button>
            </div>
          </div>

          <hr className="border-[var(--border-subtle)]" />

          {/* Change Password / Reestablecer Contraseña */}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>Seguridad y Restablecimiento de Contraseña</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Actualizar Contraseña
              </button>
            </div>
          </form>

          <hr className="border-[var(--border-subtle)]" />

          {/* Logout */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[var(--text-primary)] font-medium block">Cerrar Sesión</span>
              <span className="text-[11px] text-[var(--text-muted)]">Finaliza tu sesión actual en este dispositivo.</span>
            </div>
            <button
              onClick={async () => {
                await firebaseSignOut();
                logout();
                onClose();
                showToast('Has cerrado sesión correctamente', 'info');
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

