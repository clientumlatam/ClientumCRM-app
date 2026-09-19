/**
 * ClientumCRM Native & Web Push Notification System
 * Enables real device desktop and mobile push notifications via Notification API.
 */

export type PushPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

export interface PushPreferences {
  enabled: boolean;
  dealWon: boolean;
  taskDue: boolean;
  taskAssigned: boolean;
  mentions: boolean;
  systemAlerts: boolean;
  sound: boolean;
}

const STORAGE_KEY_PUSH_PREFS = 'clientum_push_preferences';

export const getDefaultPushPreferences = (): PushPreferences => ({
  enabled: true,
  dealWon: true,
  taskDue: true,
  taskAssigned: true,
  mentions: true,
  systemAlerts: true,
  sound: true,
});

export const loadPushPreferences = (): PushPreferences => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PUSH_PREFS);
    if (saved) {
      return { ...getDefaultPushPreferences(), ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load push preferences from localStorage', e);
  }
  return getDefaultPushPreferences();
};

export const savePushPreferences = (prefs: PushPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY_PUSH_PREFS, JSON.stringify(prefs));
  } catch (e) {
    console.warn('Failed to save push preferences to localStorage', e);
  }
};

export const isPushSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getPushPermissionStatus = (): PushPermissionStatus => {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
};

export const requestPushPermission = async (): Promise<PushPermissionStatus> => {
  if (!isPushSupported()) return 'unsupported';
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (e) {
    console.error('Error requesting push notification permission:', e);
    return 'denied';
  }
};

/**
 * Sends a native device push notification if supported and permitted
 */
export const sendNativePushNotification = (
  title: string,
  options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    onClick?: () => void;
  }
): boolean => {
  if (!isPushSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  const prefs = loadPushPreferences();
  if (!prefs.enabled) return false;

  try {
    const notification = new Notification(title, {
      body: options?.body || 'Nueva actualización en ClientumCRM',
      icon: options?.icon || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      badge: options?.badge,
      tag: options?.tag || `clientum-notif-${Date.now()}`,
      data: options?.data,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options?.onClick) {
        options.onClick();
      }
    };

    // Auto close after 6 seconds
    setTimeout(() => {
      notification.close();
    }, 6000);

    return true;
  } catch (e) {
    console.warn('Unable to show native push notification:', e);
    return false;
  }
};

export const sendLocalPushNotification = (options: { title: string; body?: string; tag?: string; onClick?: () => void }): boolean => {
  return sendNativePushNotification(options.title, {
    body: options.body,
    tag: options.tag,
    onClick: options.onClick,
  });
};

/**
 * Helper triggers for high-value CRM activities
 */
export const triggerDealWonPush = (dealName: string, amount: number): boolean => {
  const prefs = loadPushPreferences();
  if (!prefs.dealWon) return false;

  return sendNativePushNotification(`🎉 ¡Negocio Ganado! - ${dealName}`, {
    body: `Se ha registrado el cierre exitoso por $${amount.toLocaleString('es-AR')}. ¡Felicitaciones!`,
    tag: 'deal-won',
  });
};

export const triggerTaskDuePush = (taskTitle: string, dueDate: string): boolean => {
  const prefs = loadPushPreferences();
  if (!prefs.taskDue) return false;

  return sendNativePushNotification(`⏰ Tarea Próxima a Vencer: ${taskTitle}`, {
    body: `La tarea tiene fecha límite hoy (${dueDate}). Haz clic para gestionarla.`,
    tag: 'task-due',
  });
};

export const triggerTaskAssignedPush = (taskTitle: string, assignerName: string): boolean => {
  const prefs = loadPushPreferences();
  if (!prefs.taskAssigned) return false;

  return sendNativePushNotification(`📋 Nueva Tarea Asignada`, {
    body: `${assignerName} te ha asignado: "${taskTitle}".`,
    tag: 'task-assigned',
  });
};

export const triggerMentionPush = (authorName: string, snippet: string): boolean => {
  const prefs = loadPushPreferences();
  if (!prefs.mentions) return false;

  return sendNativePushNotification(`💬 @${authorName} te mencionó`, {
    body: `"${snippet.slice(0, 80)}..."`,
    tag: 'mention',
  });
};

export const triggerTestPushNotification = (): boolean => {
  return sendNativePushNotification(`🔔 Notificación de prueba ClientumCRM`, {
    body: `El sistema de notificaciones push en tu dispositivo está activo y funcionando correctamente.`,
    tag: 'test-push',
  });
};
