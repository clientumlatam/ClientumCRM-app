import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowRight,
  Lock,
  Building,
  Receipt,
  Zap,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { ClientumPlanId } from '../../types';
import { getClientumAuthJsonHeaders } from '../../lib/api';
import { trackAnalyticsEvent } from '../../lib/analytics';

interface MercadoPagoSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: ClientumPlanId;
}

export const MercadoPagoSubscriptionModal: React.FC<MercadoPagoSubscriptionModalProps> = ({
  isOpen,
  onClose,
  initialPlan = 'professional',
}) => {
  const {
    currentUser,
    trialSubscription,
    startFreeTrial,
    upgradeSubscription,
    showToast,
    enterApp
  } = useCRM();

  const [selectedPlan, setSelectedPlan] = useState<ClientumPlanId>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [payerName, setPayerName] = useState(currentUser.name || '');
  const [payerEmail, setPayerEmail] = useState(currentUser.email || '');
  const [cuit, setCuit] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [invoiceType, setInvoiceType] = useState<'A' | 'B'>('A');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<{
    checkoutId: string;
    externalUrl: string;
    subscriptionId?: string | null;
    plan: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  } | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  if (!isOpen) return null;

  const plansData: Record<
    ClientumPlanId,
    {
      name: string;
      badge?: string;
      monthlyARS: number;
      annualARS: number;
      users: string;
      features: string[];
    }
  > = {
    starter: {
      name: 'Starter',
      monthlyARS: 14900,
      annualARS: 12665,
      users: '2 usuarios incluidos',
      features: [
        'Pipeline Kanban ilimitado',
        'WhatsApp CRM para 2 usuarios',
        'Gestión de contactos y empresas B2B',
        'Prospección con Google Maps',
        'Soporte por email en español',
      ],
    },
    professional: {
      name: 'Professional',
      badge: 'Más Elegido',
      monthlyARS: 29900,
      annualARS: 25415,
      users: '5 usuarios incluidos',
      features: [
        'Todo lo de Starter +',
        'Facturación AFIP con CAE (Facturas A y B)',
        'Chatbot IA 24/7 con Gemini 3.6 Flash',
        'Workflows automáticos sin código (DAG)',
        'Email cadences y seguimiento webmail',
        'Soporte prioritario por WhatsApp',
      ],
    },
    enterprise: {
      name: 'Enterprise',
      badge: 'Escala Total',
      monthlyARS: 59900,
      annualARS: 50915,
      users: 'Usuarios ilimitados',
      features: [
        'Todo lo de Professional +',
        'Custom Objects Studio & metadatos',
        'Agente OS autónomo (14 roles IA)',
        'Zona DNS & integración Cloudflare',
        'SLA garantizado del 99.9%',
        'Gerente de cuenta dedicado 24/7',
      ],
    },
  };

  const currentPlanMeta = plansData[selectedPlan];
  const unitPrice = billingCycle === 'annual' ? currentPlanMeta.annualARS : currentPlanMeta.monthlyARS;
  const totalPrice = billingCycle === 'annual' ? currentPlanMeta.annualARS * 12 : currentPlanMeta.monthlyARS;

  const handleStartTrial = () => {
    startFreeTrial(selectedPlan);
    trackAnalyticsEvent('trial_started', {
      plan: selectedPlan,
      billing_cycle: billingCycle,
    });
    showToast('¡Tu semana de prueba gratis (7 días) ha sido activada!', 'success');
    onClose();
    enterApp(true);
  };

  const handleMercadoPagoSubscribe = async () => {
    if (!payerEmail || !payerEmail.includes('@')) {
      showToast('Ingresa un correo electrónico válido para Mercado Pago', 'error');
      return;
    }

    setIsProcessing(true);
    setCheckoutError(null);
    try {
      const response = await fetch('/api/billing/mercadopago/checkout', {
        method: 'POST',
        headers: await getClientumAuthJsonHeaders(currentUser),
        body: JSON.stringify({
          planId: selectedPlan,
          payerEmail,
          billingCycle,
          businessName: businessName.trim() || undefined,
          cuit: cuit.trim() || undefined,
          invoiceType,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.checkoutUrl || !data.checkoutId) {
        throw new Error(data.error || 'No se pudo crear el checkout de Mercado Pago.');
      }

      trackAnalyticsEvent('checkout_started', {
        plan: selectedPlan,
        billing_cycle: billingCycle,
        provider: 'mercadopago',
      });

      window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
      setCheckoutSuccess({
        checkoutId: data.checkoutId,
        externalUrl: data.checkoutUrl,
        subscriptionId: data.subscriptionId || null,
        plan: currentPlanMeta.name,
        amount: totalPrice,
        status: 'pending',
      });
      showToast('Checkout abierto. Tu plan se activará cuando Mercado Pago confirme el pago.', 'info');
    } catch (err: any) {
      setCheckoutError(err?.message || 'No se pudo iniciar el pago con Mercado Pago.');
      showToast(err?.message || 'No se pudo iniciar el pago con Mercado Pago.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!checkoutSuccess) return;
    setIsCheckingStatus(true);
    setCheckoutError(null);
    try {
      const response = await fetch(
        `/api/billing/status?checkoutId=${encodeURIComponent(checkoutSuccess.checkoutId)}`,
        { headers: await getClientumAuthJsonHeaders(currentUser) },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'No se pudo comprobar el estado del pago.');

      const checkout = data.checkouts?.[0];
      const status = checkout?.status as 'pending' | 'approved' | 'rejected' | 'cancelled' | undefined;
      if (!status) throw new Error('Todavía no encontramos este checkout.');

      if (status === 'approved' || status === 'rejected' || status === 'cancelled') {
        const conversionOrigin = trialSubscription.status === 'trial' ? 'trial' : 'direct';
        trackAnalyticsEvent('subscription_status', {
          plan: selectedPlan,
          billing_cycle: billingCycle,
          provider: 'mercadopago',
          status: status === 'approved' ? 'confirmed' : status,
          origin: conversionOrigin,
        });

        if (status === 'approved' && conversionOrigin === 'trial') {
          trackAnalyticsEvent('trial_to_paid', {
            plan: selectedPlan,
            billing_cycle: billingCycle,
            provider: 'mercadopago',
          });
        }
      }

      setCheckoutSuccess((current) => current ? {
        ...current,
        status,
        subscriptionId: checkout.providerSubscriptionId || current.subscriptionId,
      } : current);

      if (status === 'approved') {
        await upgradeSubscription(selectedPlan, billingCycle, {
          paymentMethod: 'mercadopago',
          subscriptionId: checkout.providerSubscriptionId || checkoutSuccess.subscriptionId || checkoutSuccess.checkoutId,
          amountARS: totalPrice,
          cuitOrCuil: cuit,
          businessName,
        });
        showToast('¡Suscripción confirmada por Mercado Pago!', 'success');
      } else if (status === 'pending') {
        showToast('Mercado Pago todavía está procesando la suscripción.', 'info');
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'No se pudo comprobar el estado del pago.');
      showToast(err?.message || 'No se pudo comprobar el estado del pago.', 'error');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[var(--bg-card)] rounded-3xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden my-6">
        {/* Header with decorative badge */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--bg-card)]/10 hover:bg-[var(--bg-card)]/20 flex items-center justify-center text-[var(--text-primary,#0f172a)] dark:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[var(--bg-card)]/20 text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-1.5 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Suscripción Oficial Clientum & Mercado Pago
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary,#0f172a)] dark:text-white">
            Elegí tu Plan y comenzá tu Free Trial
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-lg leading-relaxed">
            Tenés 7 días gratis sin cargo (1 semana) o podés activar tu abono recurrente con débito directo en Mercado Pago.
          </p>
        </div>

        {checkoutSuccess ? (
          /* CHECKOUT STATUS VIEW */
          <div className="p-8 text-center space-y-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${
              checkoutSuccess.status === 'approved'
                ? 'bg-emerald-100 text-emerald-600'
                : checkoutSuccess.status === 'pending'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-rose-100 text-rose-600'
            }`}>
              {checkoutSuccess.status === 'approved' ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {checkoutSuccess.status === 'approved'
                  ? '¡Suscripción confirmada!'
                  : checkoutSuccess.status === 'pending'
                    ? 'Checkout pendiente de confirmación'
                    : 'El pago no fue aprobado'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {checkoutSuccess.status === 'approved'
                  ? <>Tu plan <strong className="text-[var(--text-primary)]">{checkoutSuccess.plan}</strong> fue confirmado por <strong className="text-blue-600">Mercado Pago</strong>.</>
                  : checkoutSuccess.status === 'pending'
                    ? <>Completá el checkout en Mercado Pago. Luego actualizá el estado aquí; el acceso no se activa hasta recibir la confirmación.</>
                    : <>Mercado Pago no confirmó esta suscripción. Podés volver a intentar el checkout.</>}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Referencia del checkout:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{checkoutSuccess.subscriptionId || checkoutSuccess.checkoutId}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Total Facturado:</span>
                <span className="font-bold text-[var(--text-primary)]">${checkoutSuccess.amount.toLocaleString('es-AR')} ARS</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Estado de la suscripción:</span>
                <span className={`font-semibold flex items-center gap-1 ${
                  checkoutSuccess.status === 'approved' ? 'text-emerald-700' : 'text-blue-700'
                }`}>
                  {checkoutSuccess.status === 'approved' ? <><CheckCircle2 className="w-3 h-3" /> Confirmada</> : 'Pendiente de confirmación'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {checkoutSuccess.status === 'pending' && (
                <button
                  onClick={handleCheckStatus}
                  disabled={isCheckingStatus}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  <span>{isCheckingStatus ? 'Comprobando...' : 'Actualizar estado'}</span>
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  if (checkoutSuccess.status === 'approved') enterApp(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <span>{checkoutSuccess.status === 'approved' ? 'Ir al CRM y comenzar' : 'Cerrar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {checkoutSuccess.externalUrl && checkoutSuccess.status !== 'approved' && (
                <a
                  href={checkoutSuccess.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Ver en Mercado Pago</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            {checkoutError && (
              <div className="max-w-md mx-auto rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-left text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{checkoutError}</span>
              </div>
            )}
          </div>
        ) : (
          /* CONFIGURATION AND CHECKOUT VIEW */
          <div className="p-6 space-y-6">
            {/* Free Trial Banner Announcement */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-2">
                  <span>Semana de Prueba Gratuita (7 Días)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-extrabold uppercase">
                    Sin Tarjeta
                  </span>
                </div>
                <p className="text-emerald-700 leading-relaxed">
                  ¿Querés probar Clientum antes de pagar? Podés activar tu Free Trial de 7 días con 1 solo clic. Tendrás acceso total a todas las herramientas Pro.
                </p>
                <div className="pt-1">
                  <button
                    onClick={handleStartTrial}
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-900 underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    <span>Activar Free Trial de 7 días ahora</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Billing cycle switch */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <span className="text-xs font-bold text-[var(--text-secondary)]">Frecuencia de Facturación:</span>
              <div className="p-1 rounded-xl bg-[var(--bg-muted)] flex items-center gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${ billingCycle === 'monthly' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-xs' : 'text-[var(--text-muted)]' }`}
                >
                  Mensual
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${ billingCycle === 'annual' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' : 'text-[var(--text-muted)]' }`}
                >
                  <span>Anual</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-extrabold">
                    -15%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan selection grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['starter', 'professional', 'enterprise'] as ClientumPlanId[]).map((planKey) => {
                const plan = plansData[planKey];
                const isSelected = selectedPlan === planKey;
                const priceToShow = billingCycle === 'annual' ? plan.annualARS : plan.monthlyARS;

                return (
                  <button
                    key={planKey}
                    type="button"
                    onClick={() => setSelectedPlan(planKey)}
                    className={`relative p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${ isSelected ? 'border-blue-600 bg-blue-50/40 shadow-md shadow-blue-500/10' : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-default)]' }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-2.5 right-3 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs uppercase">
                        {plan.badge}
                      </span>
                    )}

                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[var(--text-primary)]">{plan.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{plan.users}</div>
                      <div className="pt-2 text-lg font-black text-[var(--text-primary)]">
                        ${priceToShow.toLocaleString('es-AR')}
                        <span className="text-[10px] font-normal text-[var(--text-muted)]"> /mes</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center gap-1 text-[11px] font-semibold text-blue-700">
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Seleccionado</span>
                        </>
                      ) : (
                        <span>Elegir este</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Plan Features preview */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2">
              <div className="text-xs font-bold text-[var(--text-primary)]">
                Qué incluye el plan {currentPlanMeta.name}:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                {currentPlanMeta.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payer and AFIP invoicing details */}
            <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  Datos de Facturación Fiscal (AFIP RG 4291)
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setInvoiceType('A')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${ invoiceType === 'A' ? 'bg-blue-600 text-white' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)]' }`}
                  >
                    Factura A (Resp. Inscripto)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoiceType('B')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${ invoiceType === 'B' ? 'bg-blue-600 text-white' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)]' }`}
                  >
                    Factura B (Consumidor/Monotributo)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
                    Correo de tu cuenta Mercado Pago
                  </label>
                  <input
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    placeholder="ejemplo@tuempresa.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] focus:outline-hidden focus:border-blue-500 bg-[var(--bg-card)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
                    Razón Social / Titular
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Tu Empresa S.R.L."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] focus:outline-hidden focus:border-blue-500 bg-[var(--bg-card)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
                    CUIT / CUIL (Para comprobante oficial)
                  </label>
                  <input
                    type="text"
                    value={cuit}
                    onChange={(e) => setCuit(e.target.value)}
                    placeholder="30-71234567-9"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] focus:outline-hidden focus:border-blue-500 bg-[var(--bg-card)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-secondary)] block mb-1">
                    Total a Pagar ({billingCycle === 'annual' ? 'Anualizado' : 'Mensual'})
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] flex justify-between items-center">
                    <span>${totalPrice.toLocaleString('es-AR')} ARS</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                      IVA incluido
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Start Trial or Subscribe with Mercado Pago */}
            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
              {checkoutError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{checkoutError}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartTrial}
                  className="w-full sm:w-1/2 py-3.5 rounded-xl border border-[var(--border-default)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                >
                  <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>Probar 7 Días Gratis Sin Tarjeta</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleMercadoPagoSubscribe}
                  className="w-full sm:w-1/2 py-3.5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#009ee3] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#0089c7] text-[var(--text-primary,#0f172a)] dark:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-[#009ee3]/20 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Conectando con Mercado Pago...' : 'Suscribirme con Mercado Pago'}
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" /> Cobro seguro con cifrado TLS 256-bit
                </span>
                <span>Cancela o cambia de plan en cualquier momento</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
