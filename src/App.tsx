import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CRMProvider, useCRM } from './context/CRMContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';
import { PublicSite } from './components/public/PublicSite';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { NewRecordModal } from './components/common/NewRecordModal';
import { TrialBanner } from './components/billing/TrialBanner';
import { MercadoPagoSubscriptionModal } from './components/billing/MercadoPagoSubscriptionModal';
import { isPrivateAppPath } from './lib/router/routeRegistry';

import { CommandPalette } from './components/common/CommandPalette';
import { RecordDrawer } from './components/common/RecordDrawer';
import { PrivateEnvironment } from './components/app/PrivateEnvironment';

const AppContent: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const {
    isPublicSiteVisible,
    isAuthenticated,
    isAuthReady,
    openPublicSite,
    enterApp,
    isMpCheckoutModalOpen,
    setIsMpCheckoutModalOpen,
    selectedCheckoutPlan,
  } = useCRM();
  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname,
  );
  const isPrivateRoute = isPrivateAppPath(pathname);

  // Keep browser navigation and the context's environment state in sync.
  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    if (isPrivateRoute && isAuthenticated) {
      if (isPublicSiteVisible) enterApp();
      return;
    }

    if (isPrivateRoute && !isAuthenticated) {
      window.history.replaceState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      openPublicSite();
      return;
    }

    if (!isPrivateRoute && !isPublicSiteVisible) openPublicSite();
  }, [enterApp, isAuthReady, isAuthenticated, isPrivateRoute, isPublicSiteVisible, openPublicSite]);

  const publicEnvironment = (
    <div className="min-h-screen w-screen overflow-x-hidden bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100">
      <TrialBanner />
      <PublicSite />
      <CommandPalette />
      <NewRecordModal />
      <RecordDrawer />
      <AuthModal />
      <MercadoPagoSubscriptionModal
        isOpen={isMpCheckoutModalOpen}
        onClose={() => setIsMpCheckoutModalOpen(false)}
        initialPlan={selectedCheckoutPlan}
      />
      <ToastContainer />
    </div>
  );

  const privateEnvironment = (
    <PrivateEnvironment />
  );

  if (!isAuthReady && isPrivateRoute) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-[#0a0c10] text-sm text-slate-600 dark:text-slate-300">
        Verificando tu sesión segura con Firebase…
      </div>
    );
  }

  return (
    <ProtectedRoute
      isAuthenticated={isPrivateRoute && isAuthenticated && !isPublicSiteVisible}
      fallback={publicEnvironment}
    >
      {privateEnvironment}
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <CRMProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </CRMProvider>
    </ThemeProvider>
  );
}
