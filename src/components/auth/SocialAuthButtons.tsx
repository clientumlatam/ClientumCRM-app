import React, { useState } from 'react';
import {
  signInWithGoogle,
  signInWithGithub,
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

export const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
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

  const handleProviderLogin = async (provider: 'google' | 'github') => {
    setLoadingProvider(provider);
    try {
      const result = provider === 'google' ? await signInWithGoogle() : await signInWithGithub();

      if (provider === 'google' && result.token) {
        setGmailAccessToken(result.token);
      }

      setLoadingProvider(null);

      if (result.success && result.user) {
        const userEmail = result.user.email || `${provider}.user@clientum.dev`;
        const displayName = result.user.displayName || (provider === 'google' ? 'Google User' : 'GitHub Developer');
        
        await bootstrapClientumAccount({ name: displayName });
        login(userEmail, 'oauth-session');

        // Enhance user with social profile attributes
        updateCurrentUser({
          name: displayName,
          avatar: result.user.photoURL || (
            provider === 'google'
              ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          ),
          role: 'Workspace Admin',
        });

        const providerNames = {
          google: 'Google Workspace',
          github: 'GitHub',
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
          O continuar con SSO Firebase
        </span>
        <div className="flex-grow border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]"></div>
      </div>

      <div
        className={
          layout === 'grid'
            ? 'grid grid-cols-2 gap-2.5'
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
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#111624] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#182033] text-[var(--text-primary,#0f172a)] dark:text-slate-200 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21293c] hover:border-blue-500/40 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loadingProvider === 'google' ? (
            <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
          )}
          <span>Google</span>
        </button>

        {/* GitHub Button */}
        <button
          id="social-auth-github-btn"
          type="button"
          onClick={() => handleProviderLogin('github')}
          disabled={isBusy}
          title="Iniciar sesión con cuenta GitHub"
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#181717] hover:bg-[#222222] text-white border border-slate-700/80 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loadingProvider === 'github' ? (
            <span className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GithubIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 text-white" />
          )}
          <span>GitHub</span>
        </button>
      </div>
    </div>
  );
};
