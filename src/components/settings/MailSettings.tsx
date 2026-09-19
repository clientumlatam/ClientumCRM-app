import React, { useState, useEffect } from 'react';
import {
  Mail,
  Key,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Send,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Lock,
  Radio,
  Sliders,
  Check,
  TrendingUp,
  LayoutTemplate,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import {
  MailServiceSettings,
  getMailSettings,
  saveMailSettings,
} from '../../services/crmMailService';
import { MailAnalyticsPanel } from '../mail/MailAnalyticsPanel';
import { MailTemplateEditor } from '../mail/MailTemplateEditor';

export const MailSettings: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();
  const [activeTab, setActiveTab] = useState<'config' | 'analytics' | 'templates'>('config');
  const [settings, setSettings] = useState<MailServiceSettings>(getMailSettings());
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [isTestingResend, setIsTestingResend] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('soporte@clientum.com.ar');
  const [serverStatus, setServerStatus] = useState<{
    resendConfigured?: boolean;
    smtpConfigured?: boolean;
  }>({});
  const [isLoadingServerStatus, setIsLoadingServerStatus] = useState(false);

  useEffect(() => {
    checkServerConfig();
  }, []);

  const checkServerConfig = async () => {
    setIsLoadingServerStatus(true);
    try {
      const res = await fetch('/api/email/config');
      if (res.ok) {
        const data = await res.json();
        setServerStatus({
          resendConfigured: data.resend?.configured,
          smtpConfigured: data.smtp?.configured,
        });
      }
    } catch (e) {
      console.warn('Could not fetch email config from server:', e);
    } finally {
      setIsLoadingServerStatus(false);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveMailSettings(settings);
    triggerConfetti();
    showToast('Configuración de correo guardada exitosamente.', 'success');
  };

  const handleTestResend = async () => {
    setIsTestingResend(true);
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'resend',
          to: testEmailRecipient,
          resendApiKey: settings.resendApiKey || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerConfetti();
        showToast(data.message || 'Conexión con Resend API verificada correctamente.', 'success');
      } else {
        showToast(data.error || 'Fallo en la prueba de conexión con Resend.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error de red al conectar con Resend.', 'error');
    } finally {
      setIsTestingResend(false);
    }
  };

  const handleTestSmtp = async () => {
    setIsTestingSmtp(true);
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'smtp',
          to: testEmailRecipient,
          smtpConfig: {
            host: settings.smtpHost,
            port: settings.smtpPort,
            user: settings.smtpUser,
            secure: settings.smtpSecure,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerConfetti();
        showToast(data.message || 'Servidor SMTP verificado correctamente.', 'success');
      } else {
        showToast(data.error || 'Fallo al verificar el servidor SMTP.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error de red al conectar con SMTP.', 'error');
    } finally {
      setIsTestingSmtp(false);
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-[var(--text-primary,#0f172a)] dark:text-slate-200">
      {/* Header Overview Card */}
      <div className="rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090F1E] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white tracking-tight">
                Configuración de Correo Transaccional (Resend & SMTP)
              </h2>
            </div>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 max-w-2xl leading-relaxed">
              Conecta tu clave de API de <strong>Resend</strong> o tu servidor <strong>SMTP</strong> para emitir cotizaciones, facturas electrónicas de AFIP y notificaciones comerciales en tiempo real con trazabilidad total.
            </p>
          </div>

          {/* Quick Status Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 text-xs">
              <span className="text-[10px] text-[var(--text-muted)] block uppercase font-bold">Estado del Servicio</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-400">Activo (Modo Seguro)</span>
              </div>
            </div>

            <button
              onClick={checkServerConfig}
              disabled={isLoadingServerStatus}
              className="p-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 bg-slate-900 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-slate-800 transition-colors"
              title="Refrescar estado"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingServerStatus ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090F1E] border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-md">
        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${ activeTab === 'config' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-slate-800/60' }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Credenciales & Servidores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${ activeTab === 'analytics' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-slate-800/60' }`}
        >
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Panel de Analítica (Recharts)</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            En vivo
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${ activeTab === 'templates' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-slate-800/60' }`}
        >
          <LayoutTemplate className="w-4 h-4 text-purple-400" />
          <span>Editor de Plantillas WYSIWYG</span>
        </button>
      </div>

      {/* TAB 1: Config View */}
      {activeTab === 'config' && (
        <>
          {/* Main Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Resend API Configuration (Primary Provider) */}
        <div className="rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090F1E] p-6 shadow-lg space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 flex items-center justify-center text-white font-black text-xs">
                  R
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-1.5">
                    <span>Resend API</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Recomendado
                    </span>
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Infraestructura moderna para desarrolladores (entregabilidad 99.9%)
                  </p>
                </div>
              </div>

              <a
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Obtener API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1">
                  Resend API Key (re_...):
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.resendApiKey}
                    onChange={(e) => setSettings({ ...settings, resendApiKey: e.target.value })}
                    placeholder="re_123456789_abcdef..."
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-primary,#0f172a)] dark:text-white placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-blue-500 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary,#475569)] dark:hover:text-slate-300"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                  Si no especificas una clave personalizada, se utilizará la variable de entorno o el simulador transaccional.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1">
                    Email Remitente (From):
                  </label>
                  <input
                    type="email"
                    value={settings.resendFromEmail}
                    onChange={(e) => setSettings({ ...settings, resendFromEmail: e.target.value })}
                    placeholder="onboarding@resend.dev"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-primary,#0f172a)] dark:text-white placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1">
                    Nombre del Remitente:
                  </label>
                  <input
                    type="text"
                    value={settings.resendFromName}
                    onChange={(e) => setSettings({ ...settings, resendFromName: e.target.value })}
                    placeholder="Clientum CRM"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-primary,#0f172a)] dark:text-white placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resend Action Bar */}
          <div className="pt-4 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              DKIM & SPF administrado
            </span>

            <button
              type="button"
              onClick={handleTestResend}
              disabled={isTestingResend}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTestingResend ? 'Probando...' : 'Probar Conexión'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: SMTP Fallback / Dedicated Server */}
        <div className="rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090F1E] p-6 shadow-lg space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 flex items-center justify-center text-[var(--text-secondary,#475569)] dark:text-slate-300">
                  <Server className="w-4 h-4 text-[var(--text-secondary,#475569)] dark:text-slate-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                    Servidor SMTP Personalizado
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Google Workspace, Microsoft 365 o relay corporativo
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-[var(--text-muted,#64748b)] dark:text-slate-400 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                Fallback
              </span>
            </div>

            {/* SMTP Form Fields */}
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1">
                    Host SMTP:
                  </label>
                  <input
                    type="text"
                    value={settings.smtpHost || ''}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-primary,#0f172a)] dark:text-white placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1">
                    Puerto:
                  </label>
                  <input
                    type="number"
                    value={settings.smtpPort || 587}
                    onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) || 587 })}
                    placeholder="587"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-primary,#0f172a)] dark:text-white placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-blue-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1">
                    Usuario / Email:
                  </label>
                  <input
                    type="text"
                    value={settings.smtpUser || ''}
                    onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                    placeholder="usuario@empresa.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-primary,#0f172a)] dark:text-white placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1">
                    Contraseña / App Password:
                  </label>
                  <div className="relative">
                    <input
                      type={showSmtpPassword ? 'text' : 'password'}
                      value={settings.smtpPassword || ''}
                      onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-3 pr-9 py-2.5 rounded-xl bg-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-primary,#0f172a)] dark:text-white placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-blue-500 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary,#475569)] dark:hover:text-slate-300"
                    >
                      {showSmtpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
                  <input
                    type="checkbox"
                    checked={Boolean(settings.smtpSecure)}
                    onChange={(e) => setSettings({ ...settings, smtpSecure: e.target.checked })}
                    className="rounded border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Utilizar conexión segura SSL / TLS directa (Puerto 465)</span>
                </label>
              </div>
            </div>
          </div>

          {/* SMTP Action Bar */}
          <div className="pt-4 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-mono">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              STARTTLS soportado
            </span>

            <button
              type="button"
              onClick={handleTestSmtp}
              disabled={isTestingSmtp}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[var(--text-primary,#0f172a)] dark:text-slate-200 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTestingSmtp ? 'Verificando...' : 'Verificar SMTP'}</span>
            </button>
          </div>
        </div>

      </div>

        {/* Global Save Button Card */}
        <div className="rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#060A14] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                Sincronización en tiempo real habilitada
              </p>
              <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                Las credenciales se encriptan localmente y se protegen de exposición indebida.
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </>
    )}

    {/* TAB 2: Recharts Analytics Panel */}
    {activeTab === 'analytics' && (
      <MailAnalyticsPanel
        onSendTest={() => {
          setActiveTab('config');
          showToast('Podés enviar una prueba desde el panel de configuración.', 'info');
        }}
      />
    )}

    {/* TAB 3: WYSIWYG Mail Template Editor */}
    {activeTab === 'templates' && (
      <MailTemplateEditor
        onSelectTemplateForUse={(template) => {
          showToast(`Plantilla "${template.name}" seleccionada para envíos transaccionales.`, 'success');
        }}
      />
    )}
    </div>
  );
};
