import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MessageSquare,
  Key,
  Webhook,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  Send,
  X,
  Clock,
  Mail,
  ShoppingCart,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { WebhookConfig } from '../../types';
import { CloudflareWebmailTab } from './CloudflareWebmailTab';
import { UserApiKeysTab } from './UserApiKeysTab';

export const IntegrationsHubTab: React.FC = () => {
  const {
    googleCalendarSync,
    updateCalendarSync,
    syncGoogleCalendarNow,
    slackIntegration,
    updateSlackIntegration,
    sendSlackTestMessage,
    webhooks,
    addWebhook,
    deleteWebhook,
    triggerTestWebhook,
    currentUser,
    showToast,
  } = useCRM();

  const [activeSection, setActiveSection] = useState<'calendar' | 'slack' | 'emailRouting' | 'userApiKeys' | 'webhooks' | 'commercial'>('emailRouting');
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [isSendingSlack, setIsSendingSlack] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('clientum_settings_section') === 'userApiKeys') {
        setActiveSection('userApiKeys');
        sessionStorage.removeItem('clientum_settings_section');
      }
    } catch {
      // Keep the default section when browser storage is disabled.
    }
  }, []);

  // Webhook creation modal
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [webhookName, setWebhookName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState<string[]>(['deal.won', 'deal.created']);

  const handleManualCalendarSync = async () => {
    setIsSyncingCalendar(true);
    try {
      await syncGoogleCalendarNow();
    } finally {
      setIsSyncingCalendar(false);
    }
  };

  const handleSendSlackTest = async () => {
    setIsSendingSlack(true);
    try {
      await sendSlackTestMessage();
    } finally {
      setIsSendingSlack(false);
    }
  };

  const handleCreateWebhookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookName.trim() || !webhookUrl.trim()) return;
    addWebhook({
      name: webhookName.trim(),
      url: webhookUrl.trim(),
      events: webhookEvents,
      secret: 'whsec_' + Math.random().toString(36).substring(2, 15),
      isActive: true,
      status: 'active',
    });
    setIsWebhookModalOpen(false);
    setWebhookName('');
    setWebhookUrl('');
  };

  return (
    <div id="integrations-hub-container" className="space-y-6">
      {/* Navigation Sub-Pills */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSection('emailRouting')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shrink-0 ${ activeSection === 'emailRouting' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs font-semibold' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a202c]' }`}
        >
          <Mail className="w-3.5 h-3.5 text-blue-300" />
          <span>Cloudflare Email & Webmail Worker</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => setActiveSection('calendar')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shrink-0 ${ activeSection === 'calendar' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs font-semibold' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a202c]' }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Google Calendar Bidireccional</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        <button
          onClick={() => setActiveSection('slack')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shrink-0 ${ activeSection === 'slack' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs font-semibold' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a202c]' }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Slack Notifications Bot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        <button
          id="integration-user-api-keys-tab"
          onClick={() => setActiveSection('userApiKeys')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shrink-0 ${ activeSection === 'userApiKeys' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs font-semibold' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a202c]' }`}
        >
          <Key className="w-3.5 h-3.5 text-purple-300" />
          <span>API Keys por usuario</span>
        </button>

        <button
          onClick={() => setActiveSection('webhooks')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shrink-0 ${ activeSection === 'webhooks' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs font-semibold' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a202c]' }`}
        >
          <Webhook className="w-3.5 h-3.5" />
          <span>Webhooks Outbound ({webhooks.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('commercial')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shrink-0 ${ activeSection === 'commercial' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs font-semibold' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a202c]' }`}
        >
          <ShoppingCart className="w-3.5 h-3.5 text-emerald-300" />
          <span>Conectores comerciales</span>
        </button>
      </div>

      {/* SECTION 0: COMMERCIAL CONNECTORS DESCRIBED IN THE INTEGRATIONS BRIEF */}
      {activeSection === 'commercial' && (
        <div id="section-commercial-connectors" className="space-y-4">
          <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Conectores comerciales</h3>
                <p className="mt-1 max-w-3xl text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  Prepará las conexiones que aparecen en la propuesta de Clientum. Estas tarjetas muestran el estado real de configuración y no simulan una cuenta conectada.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                {
                  title: 'Facebook & Instagram Ads',
                  description: 'Recibir Lead Ads directamente en el embudo comercial.',
                  scope: 'Leads en tiempo real',
                },
                {
                  title: 'WooCommerce & Shopify',
                  description: 'Sincronizar productos, precios, stock y carritos abandonados.',
                  scope: 'Catálogo bidireccional',
                },
                {
                  title: 'Tango / Bejerman',
                  description: 'Conectar stock, listas de precios y compras con el ERP.',
                  scope: 'ERP corporativo',
                },
              ].map((connector) => (
                <div key={connector.title} className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2a3449] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{connector.title}</h4>
                    <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300">No conectado</span>
                  </div>
                  <p className="mt-2 min-h-10 text-[11px] leading-relaxed text-[var(--text-muted,#64748b)] dark:text-slate-400">{connector.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{connector.scope}</span>
                    <button
                      onClick={() => showToast(`${connector.title}: configurá las credenciales del proveedor para habilitar la conexión.`, 'info')}
                      className="rounded-lg border border-blue-400/30 px-2.5 py-1.5 text-[10px] font-semibold text-blue-300 transition-colors hover:bg-blue-400/10 hover:text-blue-200"
                    >
                      Preparar conexión
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-400/20 bg-blue-400/5 p-3 text-[11px] leading-relaxed text-[var(--text-muted,#64748b)] dark:text-slate-400">
              <Webhook className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-300" />
              <span>Las conexiones sin API nativa pueden operar mediante los webhooks outbound que ya están disponibles en esta misma sección.</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 0: CLOUDFLARE EMAIL ROUTING & WEBMAIL WORKER */}
      {activeSection === 'emailRouting' && <CloudflareWebmailTab />}

      {/* SECTION 1: GOOGLE CALENDAR TWO-WAY SYNC */}
      {activeSection === 'calendar' && (
        <div id="section-gcal-sync" className="space-y-4">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Sincronización Bidireccional Google Calendar</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Conectado
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                    Vincula automáticamente tus reuniones comerciales, llamadas y fechas de cierre de oportunidades con tu cuenta de Google Calendar.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="gcal-sync-now-btn"
                  onClick={handleManualCalendarSync}
                  disabled={isSyncingCalendar}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-2xs transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCalendar ? 'animate-spin' : ''}`} />
                  <span>Sincronizar Ahora</span>
                </button>
              </div>
            </div>

            {/* Config Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-2">
              <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-lg p-3 text-xs space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold block">
                  Cuenta Vinculada
                </span>
                <div className="text-[var(--text-primary,#0f172a)] dark:text-white font-medium truncate">{googleCalendarSync.calendarEmail}</div>
                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  Último sync: {googleCalendarSync.lastSyncAt ? new Date(googleCalendarSync.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Nunca'}
                </div>
              </div>

              <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-lg p-3 text-xs space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold block">
                  Eventos en Sincronía
                </span>
                <div className="text-xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{googleCalendarSync.eventsSyncedCount}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Actualizado en tiempo real
                </div>
              </div>

              <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-lg p-3 text-xs space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold block">
                  Opciones de Sincronización
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={googleCalendarSync.syncOpportunities}
                    onChange={(e) => updateCalendarSync({ syncOpportunities: e.target.checked })}
                    className="rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] text-blue-600 focus:ring-0"
                  />
                  <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[11px]">Sincronizar Cierres de Deals</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={googleCalendarSync.syncTasks}
                    onChange={(e) => updateCalendarSync({ syncTasks: e.target.checked })}
                    className="rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] text-blue-600 focus:ring-0"
                  />
                  <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[11px]">Sincronizar Tareas & Llamadas</span>
                </label>
              </div>
            </div>

            {/* Synced Events Live Preview List */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Eventos de Google Calendar Vinculados al CRM
              </h4>
              <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#181f2f] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-lg overflow-hidden">
                {googleCalendarSync.syncedEventsList.slice(0, 5).map((evt) => (
                  <div key={evt.id} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#141924] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white block truncate">{evt.title}</span>
                        <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block truncate">
                          {new Date(evt.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(evt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {evt.crmLinkedName && ` • Vinculado a ${evt.crmLinkedName}`}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium shrink-0">
                      Google Calendar OK
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SLACK NOTIFICATIONS BOT */}
      {activeSection === 'slack' && (
        <div id="section-slack-sync" className="space-y-4">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Bot de Notificaciones para Slack</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Conectado a {slackIntegration.workspaceName}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                    Recibe alertas automáticas en canales de Slack cuando se ganan negocios, se detectan anomalías de seguridad o vencen tareas importantes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="slack-send-test-btn"
                  onClick={handleSendSlackTest}
                  disabled={isSendingSlack}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition-colors"
                >
                  <Send className={`w-3.5 h-3.5 ${isSendingSlack ? 'animate-spin' : ''}`} />
                  <span>Enviar Alerta de Prueba</span>
                </button>
              </div>
            </div>

            {/* Slack Config Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs font-medium mb-1">
                    Canal Principal de Ventas
                  </label>
                  <input
                    type="text"
                    value={slackIntegration.defaultChannel}
                    onChange={(e) => updateSlackIntegration({ defaultChannel: e.target.value })}
                    className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] rounded-md px-3 py-1.5 text-xs text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold block">
                    Disparadores Automáticos (Triggers)
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={slackIntegration.notifyOnDealWon}
                      onChange={(e) => updateSlackIntegration({ notifyOnDealWon: e.target.checked })}
                      className="rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] text-emerald-600 focus:ring-0"
                    />
                    <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300">🎉 Celebración de Oportunidades Ganadas (Deal Won)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={slackIntegration.notifyOnHighValueLead}
                      onChange={(e) => updateSlackIntegration({ notifyOnHighValueLead: e.target.checked })}
                      className="rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] text-emerald-600 focus:ring-0"
                    />
                    <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300">⭐ Leads de Alto Valor Asignados (&gt; $10,000)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={slackIntegration.notifyOnSecurityAnomaly}
                      onChange={(e) => updateSlackIntegration({ notifyOnSecurityAnomaly: e.target.checked })}
                      className="rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] text-emerald-600 focus:ring-0"
                    />
                    <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300">🛡️ Alertas Críticas de Seguridad & Anomalías SOC2</span>
                  </label>
                </div>
              </div>

              {/* Slack Card Preview */}
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#1b1d21] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2c313a] rounded-lg p-4 font-sans text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#4a154b] text-white flex items-center justify-center font-bold text-[10px]">
                    #
                  </div>
                  <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-bold">{slackIntegration.defaultChannel}</span>
                  <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">APP • Bot Clientum</span>
                </div>
                <div className="bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#222529] border-l-4 border-emerald-500 p-3 rounded-r space-y-1">
                  <div className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-1.5">
                    🎉 ¡Nuevo Negocio Ganado en Clientum CRM!
                  </div>
                  <div className="text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[11px]">
                    <strong>Oportunidad:</strong> Expansión Cono Sur ($45,000 USD)<br />
                    <strong>Cliente:</strong> TechCorp LatAm • <strong>Ejecutivo:</strong> {currentUser.name}
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <button className="px-2 py-0.5 bg-[#35373b] hover:bg-[#404348] text-white rounded text-[10px] font-medium">
                      Ver Oportunidad
                    </button>
                    <button className="px-2 py-0.5 bg-[#35373b] hover:bg-[#404348] text-white rounded text-[10px] font-medium">
                      Generar Factura AFIP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'userApiKeys' && <UserApiKeysTab />}

      {/* SECTION 4: OUTBOUND WEBHOOKS */}
      {activeSection === 'webhooks' && (
        <div id="section-webhooks" className="space-y-4">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-1.5">
                  <Webhook className="w-4 h-4 text-emerald-400" />
                  Webhooks Outbound (Eventos HTTP en Tiempo Real)
                </h3>
                <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                  Envía payloads JSON firmados a tus servidores cuando ocurren eventos clave en el CRM.
                </p>
              </div>

              <button
                id="create-webhook-btn"
                onClick={() => setIsWebhookModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Webhook</span>
              </button>
            </div>

            <div className="mt-4 divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#181f2f]">
              {webhooks.map((wh) => (
                <div key={wh.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{wh.name}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        HTTP POST
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-blue-400 mt-1 truncate max-w-lg">
                      {wh.url}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Eventos suscritos:</span>
                      {wh.events.map((ev) => (
                        <span key={ev} className="px-1.5 py-0.2 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182030] text-emerald-300 text-[10px] font-mono">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => triggerTestWebhook(wh.id)}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2434] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#283247] text-[var(--text-primary,#0f172a)] dark:text-slate-200 transition-colors"
                      title="Enviar payload de prueba"
                    >
                      Test Endpoint
                    </button>
                    <button
                      onClick={() => deleteWebhook(wh.id)}
                      className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                      title="Eliminar webhook"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Webhook */}
      {isWebhookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222a3d] rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
              <div className="flex items-center gap-2">
                <Webhook className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Registrar Webhook Endpoint</h3>
              </div>
              <button onClick={() => setIsWebhookModalOpen(false)} className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWebhookSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Nombre del Webhook *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Servidor de Facturación, Lambda de Sincronización"
                  value={webhookName}
                  onChange={(e) => setWebhookName(e.target.value)}
                  className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] rounded-md px-3 py-2 text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">URL Endpoint Destino (HTTPS) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.tuempresa.com/webhooks/clientum"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] rounded-md px-3 py-2 text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Eventos Suscritos</label>
                <div className="space-y-1.5 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] rounded-md p-3">
                  {['deal.won', 'deal.created', 'deal.stage_change', 'contact.created', 'security.anomaly'].map((ev) => (
                    <label key={ev} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={webhookEvents.includes(ev)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWebhookEvents((prev) => [...prev, ev]);
                          } else {
                            setWebhookEvents((prev) => prev.filter((item) => item !== ev));
                          }
                        }}
                        className="rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] text-emerald-600 focus:ring-0"
                      />
                      <span className="font-mono text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[11px]">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
                <button
                  type="button"
                  onClick={() => setIsWebhookModalOpen(false)}
                  className="px-3 py-1.5 rounded-md text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Guardar Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
