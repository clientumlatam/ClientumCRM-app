import { User } from '../types';

export const getClientumUserHeaders = (user?: Pick<User, 'id' | 'role'>): Record<string, string> => {
  let userId = user?.id;
  if (!userId && typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem('clientum_crm_current_user');
      userId = saved ? (JSON.parse(saved) as User).id : undefined;
    } catch {
      userId = undefined;
    }
  }

  const headers: Record<string, string> = userId ? { 'x-clientum-user-id': userId } : {};
  if ((import.meta as any)?.env?.DEV && user?.role) {
    headers['x-clientum-user-role'] = user.role;
  }
  return headers;
};

export const getClientumJsonHeaders = (user?: Pick<User, 'id' | 'role'>): Record<string, string> => ({
  'Content-Type': 'application/json',
  ...getClientumUserHeaders(user),
});

export const getClientumAuthHeaders = async (user?: Pick<User, 'id' | 'role'>): Promise<Record<string, string>> => {
  // Clerk authenticates browser requests with the same-origin session cookie.
  // The user header remains only as a development aid for local smoke tests.
  return getClientumUserHeaders(user);
};

export const getClientumAuthJsonHeaders = async (user?: Pick<User, 'id' | 'role'>): Promise<Record<string, string>> => ({
  'Content-Type': 'application/json',
  ...(await getClientumAuthHeaders(user)),
});

export interface ClientumAccountBootstrap {
  success: boolean;
  userId?: string;
  tenantId?: string;
  workspaceName?: string;
  error?: string;
}

/**
 * Creates the authenticated user's initial workspace membership and updates
 * its display name when the registration form supplied a company name.
 *
 * Authentication should not be lost if PostgreSQL is temporarily unavailable:
 * Clerk remains the source of truth for the session and the CRM bootstrap can
 * retry tenant initialization on the next authenticated request.
 */
export const bootstrapClientumAccount = async (profile: {
  name?: string;
  company?: string;
}): Promise<ClientumAccountBootstrap> => {
  try {
    const response = await fetch('/api/account/bootstrap', {
      method: 'POST',
      headers: await getClientumAuthJsonHeaders(),
      body: JSON.stringify({
        name: profile.name?.trim().slice(0, 120) || undefined,
        company: profile.company?.trim().slice(0, 160) || undefined,
      }),
    });

    const payload = await response.json().catch(() => ({})) as ClientumAccountBootstrap;
    if (!response.ok) {
      console.warn('Clientum account bootstrap failed:', response.status, payload.error);
      return {
        success: false,
        error: payload.error || 'No se pudo inicializar el workspace.',
      };
    }

    return payload;
  } catch (error) {
    console.warn('Clientum account bootstrap unavailable:', error);
    return {
      success: false,
      error: 'El workspace se inicializará cuando el servidor vuelva a estar disponible.',
    };
  }
};