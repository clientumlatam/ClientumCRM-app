export const PRIVATE_ROUTE_PREFIXES = ['/app', '/dashboard', '/crm', '/erp', '/pipeline', '/contacts', '/companies'] as const;

export const isPrivateAppPath = (pathname: string): boolean => {
  if (pathname === '/public' || pathname === '/sitio') return false;
  // Default to CRM workspace for root and standard CRM routes
  if (pathname === '/') return true;
  return PRIVATE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
};

export const navigateEnvironment = (pathname: '/' | '/app', replace = false): void => {
  if (typeof window === 'undefined') return;

  const hasDifferentPath = window.location.pathname !== pathname || window.location.hash.length > 0;
  if (!hasDifferentPath) return;

  window.history[replace ? 'replaceState' : 'pushState']({}, '', pathname);
  window.dispatchEvent(new PopStateEvent('popstate'));
};