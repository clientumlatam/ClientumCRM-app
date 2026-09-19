import React from 'react';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Receipt,
  FileText,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { ClientumPlanId } from '../../types';

export const SubscriptionsView: React.FC = () => {
  const {
    trialSubscription,
    startFreeTrial,
    openMercadoPagoCheckout,
    showToast,
  } = useCRM();

  const isTrial = trialSubscription.status === 'trial';
  const isExpired = trialSubscription.isTrialExpired;
  const isActivePaid = trialSubscription.status === 'active';

  const planTitles: Record<string, string> = {
    trial: 'Free Trial (Semana de Prueba)',
    starter: 'Clientum Starter',
    professional: 'Clientum Professional (Pro)',
    enterprise: 'Clientum Enterprise (Escala Total)',
  };

  const currentPlanTitle = planTitles[trialSubscription.plan] || 'Clientum Pro';

  const sampleInvoices = [
    {
      id: trialSubscription.subscriptionId || 'MP-83921049',
      date: trialSubscription.lastPaymentDate
        ? new Date(trialSubscription.lastPaymentDate).toLocaleDateString('es-AR')
        : 'Reciente',
      concept: `Abono Mensual ${currentPlanTitle}`,
      method: 'Mercado Pago (Débito Automático)',
      amount: trialSubscription.amountARS
        ? `$${trialSubscription.amountARS.toLocaleString('es-AR')} ARS`
        : '$29.900 ARS',
      status: isActivePaid ? 'Aprobado' : isTrial ? 'En Prueba (Sin Cargo)' : 'Vencido',
      cae: '74829103847291',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold text-[11px] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Facturación & Suscripciones Clientum</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary,#0f172a)] dark:text-white tracking-tight">
            Gestión de Suscripción & Pagos Mercado Pago
          </h2>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 max-w-2xl">
            Controlá tu período de Free Trial de una semana, la renovación de tus planes y tus comprobantes fiscales AFIP en pesos argentinos (ARS).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openMercadoPagoCheckout('professional')}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#009ee3] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#0089c7] text-[var(--text-primary,#0f172a)] dark:text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#009ee3]/20 cursor-pointer transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span>Suscribirme con Mercado Pago</span>
          </button>
        </div>
      </div>

      {/* Main Status Card: Free Trial or Active Plan */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-6 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Estado de tu cuenta:</div>
            <div className="text-xl font-black text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
              <span>{currentPlanTitle}</span>
              {isActivePaid && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold text-[11px] border border-emerald-500/20">
                  Activo
                </span>
              )}
              {isTrial && !isExpired && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 font-bold text-[11px] border border-blue-500/20 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 7 Días de Free Trial
                </span>
              )}
              {isExpired && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-bold text-[11px] border border-rose-500/20">
                  Prueba Vencida
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            {isTrial && !isExpired && (
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-left sm:text-right">
                <div className="text-[11px] text-blue-300 font-semibold">Tiempo restante de prueba:</div>
                <div className="text-lg font-black text-[var(--text-primary,#0f172a)] dark:text-white">
                  {trialSubscription.daysRemaining} {trialSubscription.daysRemaining === 1 ? 'Día' : 'Días'}
                </div>
                <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  Vence el {new Date(trialSubscription.trialEndDate).toLocaleDateString('es-AR')}
                </div>
              </div>
            )}

            {isActivePaid && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-left sm:text-right">
                <div className="text-[11px] text-emerald-300 font-semibold">Próxima renovación automática:</div>
                <div className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                  {trialSubscription.nextBillingDate
                    ? new Date(trialSubscription.nextBillingDate).toLocaleDateString('es-AR')
                    : 'Próximo mes'}
                </div>
                <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  Mercado Pago • Débito automático
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action announcement when in trial */}
        {isTrial && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/40 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-xl">
              <div className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>¿Deseás asegurar la continuidad de tu cuenta?</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed">
                Activá la suscripción mensual o anual con <strong>Mercado Pago</strong> antes de que termine tu semana de prueba para no perder las integraciones de WhatsApp ni la emisión de comprobantes AFIP.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openMercadoPagoCheckout('professional')}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#009ee3] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#0089c7] text-[var(--text-primary,#0f172a)] dark:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md shrink-0"
            >
              <span>Elegir Plan en Mercado Pago</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Feature limits and meters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2638]">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] space-y-1">
            <div className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[11px] flex justify-between">
              <span>Mensajes WhatsApp CRM</span>
              <span className="text-emerald-400 font-bold">Ilimitados</span>
            </div>
            <div className="text-[var(--text-primary,#0f172a)] dark:text-white font-black text-base">Activo en Pro</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full w-[45%]" />
            </div>
          </div>

          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] space-y-1">
            <div className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[11px] flex justify-between">
              <span>Chatbot Gemini IA 24/7</span>
              <span className="text-blue-400 font-bold">Habilitado</span>
            </div>
            <div className="text-[var(--text-primary,#0f172a)] dark:text-white font-black text-base">Gemini 3.6 Flash</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-blue-500 h-full w-[60%]" />
            </div>
          </div>

          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] space-y-1">
            <div className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[11px] flex justify-between">
              <span>Facturación Electrónica AFIP</span>
              <span className="text-emerald-400 font-bold">CAE Online</span>
            </div>
            <div className="text-[var(--text-primary,#0f172a)] dark:text-white font-black text-base">Factura A y B</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-purple-500 h-full w-[30%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans Selector within Private Dashboard */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-400" />
          <span>Planes de Suscripción Oficiales con Mercado Pago</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'starter' as ClientumPlanId,
              name: 'Starter',
              price: '$14.900 ARS',
              period: '/mes',
              users: '2 usuarios incluidos',
              features: ['WhatsApp CRM (2 usuarios)', 'Pipeline Kanban ilimitado', 'Prospección Google Maps'],
            },
            {
              id: 'professional' as ClientumPlanId,
              name: 'Professional',
              badge: 'Más Elegido',
              price: '$29.900 ARS',
              period: '/mes',
              users: '5 usuarios incluidos',
              features: ['Todo lo de Starter +', 'Facturación AFIP con CAE', 'Chatbot IA 24/7 Gemini', 'Workflows automáticos'],
            },
            {
              id: 'enterprise' as ClientumPlanId,
              name: 'Enterprise',
              badge: 'Escala Total',
              price: '$59.900 ARS',
              period: '/mes',
              users: 'Usuarios ilimitados',
              features: ['Todo lo de Professional +', 'Custom Objects Studio', 'Agente OS autónomo (14 roles)', 'SLA 99.9% y soporte 24/7'],
            },
          ].map((plan) => (
            <div
              key={plan.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${ trialSubscription.plan === plan.id ? 'border-blue-500 bg-blue-950/20' : 'border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] bg-[var(--bg-card,#ffffff)] dark:bg-[#111520] border-[var(--border-subtle,#e2e8f0)] dark:hover:border-slate-700' }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">{plan.name}</div>
                  {plan.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-600 text-white">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xl font-black text-[var(--text-primary,#0f172a)] dark:text-white">{plan.price}</span>
                  <span className="text-xs text-[var(--text-muted)]"> {plan.period}</span>
                </div>

                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{plan.users}</div>

                <ul className="space-y-1.5 pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2638] text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => openMercadoPagoCheckout(plan.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${ trialSubscription.plan === plan.id && isActivePaid ? 'bg-slate-800 text-[var(--text-muted,#64748b)] dark:text-slate-400 cursor-default' : 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#009ee3] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#0089c7] text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    {trialSubscription.plan === plan.id && isActivePaid
                      ? 'Plan Actual'
                      : 'Suscribirme con Mercado Pago'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing & Invoices History */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-6 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Historial de Comprobantes y Facturación AFIP</span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] font-mono">RG 4291 AFIP</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                <th className="pb-3 font-semibold">Comprobante</th>
                <th className="pb-3 font-semibold">Fecha</th>
                <th className="pb-3 font-semibold">Concepto</th>
                <th className="pb-3 font-semibold">Medio de Pago</th>
                <th className="pb-3 font-semibold">Importe</th>
                <th className="pb-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#1c2333]">
              {sampleInvoices.map((inv, idx) => (
                <tr key={idx} className="text-[var(--text-secondary,#475569)] dark:text-slate-300">
                  <td className="py-3 font-mono text-[11px] text-blue-400">{inv.id}</td>
                  <td className="py-3">{inv.date}</td>
                  <td className="py-3 font-medium text-[var(--text-primary,#0f172a)] dark:text-white">{inv.concept}</td>
                  <td className="py-3 text-[var(--text-muted,#64748b)] dark:text-slate-400">{inv.method}</td>
                  <td className="py-3 font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{inv.amount}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ inv.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : inv.status.includes('Prueba') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20' }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
