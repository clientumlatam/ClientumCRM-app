import React, { useState } from 'react';
import {
  signInWithGoogle,
} from '../../firebase';
import { useCRM } from '../../context/CRMContext';
import { bootstrapClientumAccount } from '../../lib/api';

interface SocialAuthButtonsProps {
  onSuccess?: () => void;
  layout?: 'grid' | 'stacked';
  disabled?: boolean;
}

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onSuccess,
  layout = 'grid',
  disabled = false,
}) => {
  const { login, updateCurrentUser, showToast, setGmailAccessToken } = useCRM();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleProviderLogin = async (provider: 'google') => {
    setLoadingProvider(provider);
    try {
      const result = await signInWithGoogle();
      if (result.token) {
        setGmailAccessToken(result.token);
      }

      setLoadingProvider(null);

      if (result.success && result.user) {
        const userEmail = result.user.email || `${provider}.user@clientum.dev`;
        const displayName = result.user.displayName || 'Google User';
        await bootstrapClientumAccount({ name: displayName });
        login(userEmail, 'oauth-session');

        // Enhance user with social profile attributes
        updateCurrentUser({
          name: displayName,
          avatar: result.user.photoURL || (
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
          ),
          role: 'Workspace Admin',
        });

        const providerNames = {
          google: 'Google Workspace',
        };

        showToast(`¡Sesión iniciada con éxito vía ${providerNames[provider]}!`, 'success');
        if (onSuccess) onSuccess();
      } else {
        showToast(result.error || `No se pudo conectar con ${provider}.`, 'error');
      }
    } catch (err: any) {
      setLoadingProvider(null);
      showToast(`Error al autenticar con ${provider}.`, 'error');
    }
  };

  const isBusy = Boolean(loadingProvider) || disabled;

  return (
    <div className="w-full space-y-2">
      <div className="relative flex items-center my-3">
        <div className="flex-grow border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]"></div>
        <span className="flex-shrink-0 mx-3 text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium uppercase tracking-wider">
          O continuar con SSO
        </span>
        <div className="flex-grow border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]"></div>
      </div>

      <div
        className={
          layout === 'grid'
            ? 'grid grid-cols-1 gap-2'
            : 'flex flex-col gap-2'
        }
      >
        {/* Google Button */}
        <button
          id="social-auth-google-btn"
          type="button"
          onClick={() => handleProviderLogin('google')}
          disabled={isBusy}
          title="Iniciar sesión con cuenta Google"
          className="flex items-center justify-center gap-2 py-2 px-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#111624] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#182033] text-[var(--text-primary,#0f172a)] dark:text-slate-200 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21293c] hover:border-blue-500/40 rounded-xl text-xs font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loadingProvider === 'google' ? (
            <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
          )}
          <span className={layout === 'grid' ? 'hidden sm:inline font-semibold' : 'font-semibold'}>
            Google
          </span>
        </button>

      </div>
    </div>
  );
};
