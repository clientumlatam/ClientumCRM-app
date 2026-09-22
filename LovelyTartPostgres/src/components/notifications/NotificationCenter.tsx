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
  Play,
  RotateCcw,
  Zap,
  Mail,
  Receipt,
  Sparkles,
  ExternalLink,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Ban,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useTheme } from '../../context/ThemeContext';
import { AppNotification, AsyncJob } from '../../types';
import {
  getPushPermissionStatus,
  requestPushPermission,
  sendLocalPushNotification,
  PushPermissionStatus,
} from '../../lib/pushNotifications';

export const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    asyncJobs,
    startAsyncJob,
    cancelAsyncJob,
    setActiveTab,
    showToast,
  } = useCRM();

  const { resolvedTheme } = useTheme();
  const [filterType, setFilterType] = useState<'all' | 'async' | 'tasks' | 'system'>('all');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [pushStatus, setPushStatus] = useState<PushPermissionStatus>(getPushPermissionStatus());
  const [preferences, setPreferences] = useState({
    asyncJobs: true,
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
        body: 'Recibirás avisos de procesos asíncronos finalizados y alertas importantes.',
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
      body: 'Sistema de notificaciones asíncronas funcionando en tiempo real.',
      tag: 'test-push',
    });
    showToast('Notificación push de prueba enviada al dispositivo', 'success');
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeJobs = asyncJobs.filter((j) => j.status === 'in_progress');

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'async') return n.type === 'async_process';
    if (filterType === 'tasks') return n.type === 'task_assignment' || n.type === 'approaching_deadline';
    if (filterType === 'system') return n.type === 'system' || n.type === 'security' || n.type === 'integration';
    return true;
  });

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.linkTab) {
      setActiveTab(notif.linkTab as any);
      onClose();
    }
  };

  const triggerSampleJob = (type: 'email' | 'afip' | 'enrich') => {
    if (type === 'email') {
      startAsyncJob(
        'bulk_email',
        'Envío masivo de Campaña Email',
        '145 correos de propuesta comercial despachados vía Cloudflare Worker.',
        { linkTab: 'people', durationMs: 4000 }
      );
    } else if (type === 'afip') {
      startAsyncJob(
        'afip_sync',
        'Sincronización de Lote con AFIP WSFE',
        'Validación de CAE y comprobantes electrónicos con servidor fiscal de AFIP.',
        { linkTab: 'erp', durationMs: 4500 }
      );
    } else {
      startAsyncJob(
        'ai_enrichment',
        'Enriquecimiento masivo de Leads con IA',
        'Análisis de perfiles y actualización de seniority para 25 prospectos.',
        { linkTab: 'people', durationMs: 3500 }
      );
    }
  };

  const getNotificationIcon = (notif: AppNotification) => {
    if (notif.type === 'async_process') {
      if (notif.status === 'error') {
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
        );
      }
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (notif.type === 'task_assignment') {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
          <UserCheck className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (notif.type === 'approaching_deadline') {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
          <Clock className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (notif.type === 'mention') {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
          <MessageSquare className="h-3.5 w-3.5" />
        </div>
      );
    }
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 shrink-0">
        <Shield className="h-3.5 w-3.5" />
      </div>
    );
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3 bg-[var(--bg-card)]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[var(--text-primary)]">Centro de Notificaciones</h3>
            <p className="text-[10px] text-[var(--text-muted)] font-mono">
              {unreadCount > 0 ? `${unreadCount} pendientes de lectura` : 'Todo al día'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
            className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Preferencias de notificación"
          >
            <Sliders className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Cerrar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Active Async Process Monitoring Box (Always Visible when jobs are running) */}
      {activeJobs.length > 0 && (
        <div className="bg-blue-500/10 border-b border-blue-500/20 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Procesos en segundo plano ({activeJobs.length})</span>
            </div>
            <span className="text-[10px] font-mono text-blue-500">Persistente</span>
          </div>

          {activeJobs.map((job) => (
            <div key={job.id} className="bg-[var(--bg-card)] p-2.5 rounded-lg border border-blue-500/20 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--text-primary)] truncate text-[11px]">
                  {job.title}
                </span>
                <span className="font-mono text-[10px] text-blue-500 font-bold">{job.progress}%</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[var(--bg-muted)] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span className="truncate max-w-[200px]">{job.description}</span>
                <button
                  type="button"
                  onClick={() => cancelAsyncJob(job.id)}
                  className="text-rose-500 hover:underline font-semibold flex items-center gap-0.5"
                >
                  <Ban className="w-2.5 h-2.5" />
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Trigger Tool for Async Jobs (Simulator) */}
      <div className="px-3.5 py-2 bg-[var(--bg-muted)]/60 border-b border-[var(--border-subtle)] flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          Simular Proceso:
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => triggerSampleJob('email')}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 transition-colors flex items-center gap-1"
            title="Simular envío masivo de correos"
          >
            <Mail className="w-2.5 h-2.5" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => triggerSampleJob('afip')}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 border border-cyan-500/20 transition-colors flex items-center gap-1"
            title="Simular sincronización de lote AFIP"
          >
            <Receipt className="w-2.5 h-2.5" />
            <span>AFIP</span>
          </button>
          <button
            type="button"
            onClick={() => triggerSampleJob('enrich')}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 border border-indigo-500/20 transition-colors flex items-center gap-1"
            title="Simular enriquecimiento de leads con IA"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>IA Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] text-[11px] overflow-x-auto">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('async')}
          className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
            filterType === 'async'
              ? 'bg-blue-600 text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Zap className="w-2.5 h-2.5" />
          Procesos
        </button>
        <button
          type="button"
          onClick={() => setFilterType('tasks')}
          className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
            filterType === 'tasks'
              ? 'bg-blue-600 text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Tareas
        </button>
        <button
          type="button"
          onClick={() => setFilterType('system')}
          className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
            filterType === 'system'
              ? 'bg-blue-600 text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Sistema
        </button>
      </div>

      {/* Preferences Submodal */}
      {isPreferencesOpen ? (
        <div className="p-4 space-y-3.5 bg-[var(--bg-card)] animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
            <h4 className="text-xs font-bold text-[var(--text-primary)]">Preferencias de Alertas</h4>
            <button
              type="button"
              onClick={() => setIsPreferencesOpen(false)}
              className="text-[10px] text-blue-500 hover:underline"
            >
              Volver a lista
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text-primary)]">Procesos asíncronos finalizados</span>
              <input
                type="checkbox"
                checked={preferences.asyncJobs}
                onChange={(e) => setPreferences({ ...preferences, asyncJobs: e.target.checked })}
                className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text-primary)]">Asignaciones de tareas</span>
              <input
                type="checkbox"
                checked={preferences.taskAssignments}
                onChange={(e) =>
                  setPreferences({ ...preferences, taskAssignments: e.target.checked })
                }
                className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500 cursor-pointer"
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
                className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text-primary)]">Menciones (@mentions)</span>
              <input
                type="checkbox"
                checked={preferences.mentions}
                onChange={(e) => setPreferences({ ...preferences, mentions: e.target.checked })}
                className="rounded border-[var(--border-subtle)] text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>

            {/* Push Notifications Section */}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[var(--text-primary)] block text-xs">Notificaciones Push</span>
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
                  className={`px-2 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                    pushStatus === 'granted'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                  }`}
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
              showToast('Preferencias de notificación guardadas', 'success');
            }}
            className="w-full rounded-xl bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Guardar preferencias
          </button>
        </div>
      ) : (
        <>
          {/* Notifications List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-[var(--border-subtle)] bg-[var(--bg-surface)]">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                No tienes notificaciones en esta categoría.
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start gap-2.5 p-3 transition-colors cursor-pointer hover:bg-[var(--bg-muted)] group ${
                    !notif.read ? 'bg-blue-500/5' : ''
                  }`}
                >
                  <div className="mt-0.5">{getNotificationIcon(notif)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs truncate ${
                          !notif.read
                            ? 'font-bold text-[var(--text-primary)]'
                            : 'font-medium text-[var(--text-secondary)]'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Action button inside notification */}
                    {notif.actionLabel && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:underline">
                          <span>{notif.actionLabel}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-1 shrink-0">
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600" title="No leído" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-rose-500 hover:bg-rose-500/10 text-[var(--text-muted)] transition-all"
                      title="Eliminar notificación"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-3.5 py-2 bg-[var(--bg-card)]">
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-blue-500 transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
              <span>Marcar todo leído</span>
            </button>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="text-[10px] text-[var(--text-muted)] hover:text-rose-500 transition-colors"
              >
                Limpiar historial
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
