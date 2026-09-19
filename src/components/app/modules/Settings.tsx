import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  MessageSquare,
  CreditCard,
  Mail,
  Zap,
  Globe,
  CheckCircle2,
  AlertCircle,
  Key,
  Webhook,
  RefreshCw,
  Save,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Settings: React.FC = () => {
  // Toggle states
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [mercadoPagoEnabled, setMercadoPagoEnabled] = useState(true);
  const [resendEmailEnabled, setResendEmailEnabled] = useState(true);
  const [googleWorkspaceEnabled, setGoogleWorkspaceEnabled] = useState(false);
  const [webhooksEnabled, setWebhooksEnabled] = useState(true);

  // Form states
  const [whatsappPhone, setWhatsappPhone] = useState('+54 9 11 3892-4001');
  const [whatsappApiKey, setWhatsappApiKey] = useState('wace_live_9f88a123bc789e001');
  const [mpPublicKey, setMpPublicKey] = useState('APP_USR-7829103847209-001');
  const [mpAccessToken, setMpAccessToken] = useState('APP_USR-sec_key_****************');
  const [mpSandbox, setMpSandbox] = useState(false);

  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-primary,#F8FAFC)] dark:bg-[#070C18] text-[var(--text-primary,#0F172A)] dark:text-slate-100 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Integration Settings & API Studio
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configura y conecta tus integraciones omnicanal, pasarelas de pago y webhooks
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Cambios</span>
        </button>
      </div>

      {savedNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>¡Configuraciones e integraciones guardadas exitosamente en el Workspace!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp Integration Card */}
        <div className="rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs p-5 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    WhatsApp WACE Hub
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Oficial API
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sincronización bidireccional y auto-respuesta con IA Gemini
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setWhatsappEnabled(!whatsappEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                whatsappEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  whatsappEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {whatsappEnabled && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número Telefónico Conectado
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  API Token WACE / Meta Business
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={whatsappApiKey}
                    onChange={(e) => setWhatsappApiKey(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Estado: Conectado a la red Meta Graph API v19.0</span>
                </div>
                <button className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                  Probar Webhook
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MercadoPago Integration Card */}
        <div className="rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs p-5 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    MercadoPago Subscriptions & Checkout
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    Pro Payments
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cobros recurrentes, suscripciones automáticas y links de pago
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setMercadoPagoEnabled(!mercadoPagoEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                mercadoPagoEnabled ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  mercadoPagoEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {mercadoPagoEnabled && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Public Key (PK)
                </label>
                <input
                  type="text"
                  value={mpPublicKey}
                  onChange={(e) => setMpPublicKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Access Token (Secret)
                </label>
                <input
                  type="password"
                  value={mpAccessToken}
                  onChange={(e) => setMpAccessToken(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Modo Sandbox / Pruebas
                </span>
                <button
                  onClick={() => setMpSandbox(!mpSandbox)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    mpSandbox
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {mpSandbox ? 'SANDBOX ACTIVO' : 'MODO PRODUCCIÓN'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Integrations List */}
      <div className="rounded-2xl bg-white dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Otras Integraciones Disponibles</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Resend Mail API</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Emails transaccionales</p>
              </div>
            </div>
            <button
              onClick={() => setResendEmailEnabled(!resendEmailEnabled)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                resendEmailEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                  resendEmailEnabled ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Google Workspace</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Calendar & Drive Sync</p>
              </div>
            </div>
            <button
              onClick={() => setGoogleWorkspaceEnabled(!googleWorkspaceEnabled)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                googleWorkspaceEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                  googleWorkspaceEnabled ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Webhook className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Webhooks & Zapier</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Eventos HTTP POST</p>
              </div>
            </div>
            <button
              onClick={() => setWebhooksEnabled(!webhooksEnabled)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                webhooksEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                  webhooksEnabled ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
