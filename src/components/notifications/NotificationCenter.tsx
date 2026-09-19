import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  MessageSquare,
  AlertTriangle,
  UserCheck,
  Settings,
  X,
  Check,
  Shield,
  Sliders,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useTheme } from '../../context/ThemeContext';
import {
  getPushPermissionStatus,
  requestPushPermission,
  sendLocalPushNotification,
  PushPermissionStatus,
} from '../../lib/pushNotifications';

interface AppNotification {
  id: string;
  type: 'task_assignment' | 'approaching_deadline' | 'mention' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { tasks, opportunities, setActiveTab, showToast } = useCRM();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'task_assignment',
      title: 'Nueva tarea asignada',
      message: 'Martín Gómez te asignó la revisión del contrato SaaS Enterprise v2.',
      timestamp: 'Hace 15 min',
      read: false,
      linkTab: 'tasks',
    },
    {
      id: 'notif-2',
      type: 'approaching_deadline',
      title: 'Fecha límite próxima',
      message: 'El negocio "Licenciamiento Cloud B2B" vence hoy por $145.000.',
      timestamp: 'Hace 1 hora',
      read: false,
      linkTab: 'opportunities',
    },
    {
      id: 'notif-3',
      type: 'mention',
      title: 'Mención en comentarios',
      message: '@Valeria te mencionó en el caso #402: "¿Podemos coordinar la demo técnica?"',
      timestamp: 'Hace 3 horas',
      read: true,
      linkTab: 'opportunities',
    },
    {
      id: 'notif-4',
      type: 'system',
      title: 'Sincronización con Firebase',
      message: 'Base de datos en la nube sincronizada correctamente con Firestore.',
      timestamp: 'Hace 5 horas',
      read: true,
    },
  ]);

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState<PushPermissionStatus>(getPushPermissionStatus());
  const [preferences, setPreferences] = useState({
    taskAssignments: true,
    approachingDeadlines: true,
    mentions: true,
    emailAlerts: true,
    soundAlerts: false,
    pushAlerts: true,
  });

  const handleTogglePush = async () => {
    if (pushStatus === 'granted') {
      showToast('Las alertas Push ya están habilitadas en este navegador', 'info');
      return;
    }
    const status = await requestPushPermission();
    setPushStatus(status);
    if (status === 'granted') {
      showToast('¡Permiso de notificaciones Push concedido!', 'success');
      sendLocalPushNotification({
        title: '¡Push Activado en Clientum!',
        body: 'Recibirás avisos de tareas urgentes, menciones y negocios ganados.',
        tag: 'push-activated',
      });
    } else if (status === 'denied') {
      showToast('Permiso de notificaciones denegado en el navegador', 'error');
    }
  };

  const handleTestPush = () => {
    if (pushStatus !== 'granted') {
      showToast('Primero debes habilitar los permisos Push', 'warning');
      return;
    }
    sendLocalPushNotification({
      title: 'Prueba de Alerta Push Clientum CRM',
      body: 'Sistema de notificaciones push funcionando en tiempo real.',
      tag: 'test-push',
    });
    showToast('Notificación push de prueba enviada al dispositivo', 'success');
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    showToast('Todas las notificaciones marcadas como leídas', 'success');
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications(
      notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.linkTab) {
      setActiveTab(notif.linkTab as any);
      onClose();
    }
  };

  return (
    <div className="absolute right-4 top-14 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[var(--text-primary)]">Centro de Notificaciones</h3>
            <p className="text-[10px] text-[var(--text-muted)]">
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsPreferencesOpen(true)}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Preferencias de notificación"
          >
            <Sliders className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preferences Submodal */}
      {isPreferencesOpen ? (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <h4 className="text-xs font-bold text-[var(--text-primary)]">Preferencias de Alertas</h4>
            <button
              type="button"
              onClick={() => setIsPreferencesOpen(false)}
              className="text-[10px] text-blue-500 hover:underline"
            >
              Volver
            </button>
          </div>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text-primary)]">Asignaciones de tareas</span>
              <input
                type="checkbox"
                checked={preferences.taskAssignments}
                onChange={(e) =>
                  setPreferences({ ...preferences, taskAssignments: e.target.checked })
                }
                className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text-primary)]">Fechas límites próximas</span>
              <input
                type="checkbox"
                checked={preferences.approachingDeadlines}
                onChange={(e) =>
                  setPreferences({ ...preferences, approachingDeadlines: e.target.checked })
                }
                className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text-primary)]">Menciones (@mentions)</span>
              <input
                type="checkbox"
                checked={preferences.mentions}
                onChange={(e) => setPreferences({ ...preferences, mentions: e.target.checked })}
                className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text-primary)]">Resumen por correo electrónico</span>
              <input
                type="checkbox"
                checked={preferences.emailAlerts}
                onChange={(e) => setPreferences({ ...preferences, emailAlerts: e.target.checked })}
                className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500"
              />
            </label>

            {/* Push Notifications Section */}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[var(--text-primary)] block">Notificaciones Push</span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {pushStatus === 'granted'
                      ? 'Activas en este navegador'
                      : pushStatus === 'denied'
                      ? 'Bloqueadas en el navegador'
                      : 'Sin configurar'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePush}
                  disabled={pushStatus === 'granted'}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${ pushStatus === 'granted' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-[var(--text-primary,#0f172a)] dark:text-white cursor-pointer' }`}
                >
                  {pushStatus === 'granted' ? 'Habilitadas' : 'Activar Push'}
                </button>
              </div>

              {pushStatus === 'granted' && (
                <button
                  type="button"
                  onClick={handleTestPush}
                  className="w-full py-1 text-[10px] text-blue-500 hover:bg-blue-500/10 rounded border border-blue-500/20 font-medium transition-colors"
                >
                  Enviar notificación push de prueba
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsPreferencesOpen(false);
              showToast('Preferencias guardadas correctamente', 'success');
            }}
            className="w-full rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Guardar preferencias
          </button>
        </div>
      ) : (
        <>
          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-[var(--border-subtle)]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                No tienes notificaciones recientes.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex gap-3 p-3.5 transition-colors cursor-pointer hover:bg-[var(--bg-muted)] ${ !notif.read ? 'bg-blue-500/5' : '' }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'task_assignment' && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                        <UserCheck className="h-3.5 w-3.5" />
                      </div>
                    )}
                    {notif.type === 'approaching_deadline' && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                    )}
                    {notif.type === 'mention' && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                        <MessageSquare className="h-3.5 w-3.5" />
                      </div>
                    )}
                    {notif.type === 'system' && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                        <Shield className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--text-secondary)] line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="mt-2 h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-4 py-2.5 bg-[var(--bg-muted)]/50">
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
              Marcar todo como leído
            </button>
            <span className="text-[10px] text-[var(--text-muted)]">Clientum Sync</span>
          </div>
        </>
      )}
    </div>
  );
};
