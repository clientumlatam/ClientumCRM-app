import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Clock,
  Download,
  Receipt,
  Zap,
  ChevronRight,
  Sparkles,
  XCircle,
  HelpCircle,
  Building2,
  Calendar
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { getClientumAuthJsonHeaders } from '../../lib/api';

export interface SubscriptionRecord {
  id: string;
  checkoutId?: string;
  planId: string;
  planName: string;
  amount: number | string;
  currency: string;
  status: 'approved' | 'pending' | 'cancelled' | 'rejected' | 'paused';
  createdAt: string;
  nextBillingDate?: string;
  paymentMethod?: string;
  invoiceUrl?: string;
}

export interface SubscriptionManagementProps {
  onOpenUpgradeModal?: () => void;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  onOpenUpgradeModal,
}) => {
  const { currentUser, showToast } = useCRM();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [history, setHistory] = useState<SubscriptionRecord[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<{
    planId: string;
    planName: string;
    status: 'approved' | 'pending' | 'cancelled' | 'trial' | 'none';
    billingCycle: 'monthly' | 'annual';
    amountARS: number;
    renewsAt: string;
    payerEmail?: string;
    portalUrl?: string;
  }>({
    planId: 'starter',
    planName: 'Starter',
    status: 'pending',
    billingCycle: 'monthly',
    amountARS: 29900,
    renewsAt: new Date(Date.now() + 30 * 86400000).toLocaleDateString('es-AR'),
    portalUrl: 'https://www.mercadopago.com.ar/subscriptions',
  });

  const loadSubscriptionData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/billing/status', {
        headers: await getClientumAuthJsonHeaders(currentUser || undefined),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.checkouts) {
        const mappedHistory: SubscriptionRecord[] = data.checkouts.map((ch: any) => ({
          id: ch.checkoutId || ch.id || `chk_${Math.random().toString(36).substr(2, 6)}`,
          checkoutId: ch.checkoutId || ch.id,
          planId: ch.planId || 'starter',
          planName: ch.planId === 'scale' ? 'Scale Enterprise' : ch.planId === 'growth' ? 'Growth' : 'Starter',
          amount: ch.amount || 29900,
          currency: ch.currency || 'ARS',
          status: ch.status || 'pending',
          createdAt: ch.createdAt || new Date().toISOString(),
          paymentMethod: 'Mercado Pago',
        }));

        setHistory(mappedHistory);

        // Find latest approved or active checkout
        const activeItem = mappedHistory.find((item) => item.status === 'approved') || mappedHistory[0];
        if (activeItem) {
          const planMeta = activeItem.planId === 'scale'
            ? { name: 'Scale Enterprise', price: 119900 }
            : activeItem.planId === 'growth'
            ? { name: 'Growth', price: 59900 }
            : { name: 'Starter', price: 29900 };

          setActiveSubscription({
            planId: activeItem.planId,
            planName: planMeta.name,
            status: activeItem.status as any,
            billingCycle: 'monthly',
            amountARS: Number(activeItem.amount) || planMeta.price,
            renewsAt: new Date(Date.now() + 30 * 86400000).toLocaleDateString('es-AR'),
            payerEmail: currentUser?.email || '',
            portalUrl: 'https://www.mercadopago.com.ar/subscriptions',
          });
        }
      }
    } catch (error) {
      console.warn('Error loading subscription status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubscriptionData();
  }, [currentUser?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSubscriptionData();
    showToast('Estado de suscripción actualizado', 'success');
  };

  const handleManageBilling = () => {
    // Mercado Pago official customer portal for managing active recurring subscriptions
    const mpPortalUrl = 'https://www.mercadopago.com.ar/subscriptions';
    window.open(mpPortalUrl, '_blank', 'noopener,noreferrer');
    showToast('Abriendo portal de gestión de suscripciones en Mercado Pago', 'info');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <CheckCircle2 size={13} />
            <span>Suscripción Activa</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
            <Clock size={13} />
            <span>Pago Pendiente</span>
          </span>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
            <XCircle size={13} />
            <span>Cancelada</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-500/20">
            <HelpCircle size={13} />
            <span>Sin Suscripción</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <CreditCard className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">Gestión de Suscripción & Facturación</h2>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Administra tu plan activo de ClientumCRM, revisa el historial de pagos y accede al portal seguro de Mercado Pago.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
            title="Actualizar estado"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleManageBilling}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Gestionar Suscripción</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Active Subscription Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Plan Summary Card */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
            <div>
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                Plan Actual en Producción
              </span>
              <h3 className="text-2xl font-extrabold text-[var(--text-primary)] flex items-center gap-2 mt-0.5">
                <span>Clientum {activeSubscription.planName}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {activeSubscription.billingCycle === 'annual' ? 'Facturación Anual (-20%)' : 'Facturación Mensual'}
                </span>
              </h3>
            </div>
            {getStatusBadge(activeSubscription.status)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] font-medium block">Importe Recurrente</span>
              <strong className="text-base font-bold text-[var(--text-primary)] block">
                $ {activeSubscription.amountARS.toLocaleString('es-AR')} <span className="text-xs text-[var(--text-muted)] font-normal">ARS / mes</span>
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] font-medium block">Próxima Renovación</span>
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>{activeSubscription.renewsAt}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] font-medium block">Medio de Pago</span>
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mercado Pago Subscriptions</span>
              </div>
            </div>
          </div>

          {/* Key Plan Highlights */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[var(--text-muted)] block mb-2">
              Inclusiones Principales del Plan {activeSubscription.planName}:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Pipeline CRM Kanban e ILimitado</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Facturación Electrónica AFIP</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Canal WhatsApp WACE Hub</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Copilot Ejecutivo con Gemini</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Integraciones E-Commerce</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Soporte Prioritario 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Portal Actions Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/10 via-[var(--bg-card)] to-indigo-900/10 border border-blue-500/20 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[var(--text-primary)]">Acciones de Cobro & Portal MP</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Modifica la tarjeta guardada, descarga los comprobantes fiscales o solicita la cancelación desde tu cuenta de Mercado Pago.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleManageBilling}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>Abrir Portal Mercado Pago</span>
              <ExternalLink size={14} />
            </button>

            {onOpenUpgradeModal && (
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)]/80 text-[var(--text-primary)] text-xs font-semibold border border-[var(--border-subtle)] transition-all cursor-pointer"
              >
                <Sparkles size={13} className="text-amber-500" />
                <span>Cambiar de Plan o Ciclo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subscription History Table */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-500" />
              <span>Historial de Suscripciones & Comprobantes</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Registro histórico de transacciones procesadas a través del gateway seguro.
            </p>
          </div>

          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            {history.length} {history.length === 1 ? 'Registro' : 'Registros'}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] animate-pulse">
            Cargando historial de suscripciones...
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] space-y-2">
            <p>No se encontraron registros de suscripción cargados previamente.</p>
            <p className="text-[11px]">Cuando inicies un pago en Mercado Pago, aparecerá reflejado aquí automáticamente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Plan / Detalle</th>
                  <th className="py-2.5 px-3">Importe</th>
                  <th className="py-2.5 px-3">Medio de Pago</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Comprobante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-[var(--text-secondary)] whitespace-nowrap">
                      {new Date(record.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 font-bold text-[var(--text-primary)]">
                      Clientum {record.planName}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[var(--text-primary)] whitespace-nowrap">
                      $ {Number(record.amount).toLocaleString('es-AR')} ARS
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">
                      {record.paymentMethod || 'Mercado Pago'}
                    </td>
                    <td className="py-3 px-3">{getStatusBadge(record.status)}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={handleManageBilling}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
                      >
                        <span>Ver Recibo MP</span>
                        <ExternalLink size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
