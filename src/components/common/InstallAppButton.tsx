import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallAppButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      localStorage.setItem('clientum_pwa_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // If user previously dismissed in this session, keep hidden
    if (sessionStorage.getItem('clientum_install_dismissed') === 'true') {
      setIsDismissed(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        setIsVisible(false);
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
    } catch (err) {
      console.error('[PWA] Error during installation prompt:', err);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    sessionStorage.setItem('clientum_install_dismissed', 'true');
  };

  if (!isVisible || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 animate-bounce duration-1000">
      <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-1.5 shadow-2xl shadow-blue-500/30 border border-white/20 text-white backdrop-blur-md">
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition-all hover:bg-white/10 active:scale-95 focus:outline-hidden cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/25 shadow-xs">
            <Download className="h-4 w-4 animate-pulse text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span>Instalar ClientumOS</span>
              <Sparkles className="h-3 w-3 text-amber-300" />
            </div>
            <p className="text-[10px] font-normal text-blue-100">Acceso rápido y offline</p>
          </div>
        </button>
        <button
          onClick={handleDismiss}
          className="mr-1 flex h-6 w-6 items-center justify-center rounded-full text-blue-200 hover:bg-white/20 hover:text-white transition-colors"
          title="Cerrar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
