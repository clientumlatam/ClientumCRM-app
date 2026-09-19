import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  CreditCard,
  ArrowRight,
  X,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const TrialBanner: React.FC = () => {
  const {
    trialSubscription,
    openMercadoPagoCheckout,
  } = useCRM();

  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const isExpired = trialSubscription.isTrialExpired;
  const isTrial = trialSubscription.status === 'trial';
  const isActivePaid = trialSubscription.status === 'active';

  // If user has an active paid subscription, no need to show countdown banner unless requested
  if (isActivePaid) {
    return null;
  }

  return (
    <div
      className={`w-full py-2.5 px-4 text-xs transition-all relative z-40 border-b font-['Plus_Jakarta_Sans',sans-serif] ${ isExpired ? 'bg-rose-900 text-rose-100 border-rose-800' : 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-blue-900/50 shadow-xs' }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {isExpired ? (
            <div className="w-6 h-6 rounded-full bg-rose-800 text-rose-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
          )}

          <div className="leading-snug">
            {isExpired ? (
              <span>
                <strong className="text-[var(--text-primary,#0f172a)] dark:text-white">Tu semana de prueba ha concluido:</strong> Para mantener activos tus bots de WhatsApp y la facturación AFIP, suscríbete a un plan.
              </span>
            ) : (
              <span>
                <strong className="text-emerald-300">⚡ Free Trial Activo (1 Semana):</strong> Te quedan{' '}
                <strong className="text-white font-extrabold px-1.5 py-0.5 rounded bg-blue-600/50 border border-blue-400/40">
                  {trialSubscription.daysRemaining} {trialSubscription.daysRemaining === 1 ? 'día' : 'días'}
                </strong>{' '}
                de prueba gratuita con acceso total a Clientum Pro sin compromiso.
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={() => openMercadoPagoCheckout(trialSubscription.plan === 'trial' ? 'professional' : trialSubscription.plan)}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#009ee3] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#0089c7] text-[var(--text-primary,#0f172a)] dark:text-white font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <CreditCard className="w-3 h-3" />
            <span>Suscribirme con Mercado Pago</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Cerrar aviso"
            className="p-1 rounded-md text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card)]/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
