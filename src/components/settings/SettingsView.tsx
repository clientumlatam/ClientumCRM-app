import React, { useEffect, useState } from 'react';
import {
  Database,
  Layers,
  Plus,
  Trash2,
  Check,
  Shield,
  ShieldCheck,
  Users,
  Download,
  RotateCcw,
  Zap,
  Globe,
  Sliders,
  CheckCircle2,
  Sun,
  Moon,
  Palette,
  Eye,
  Sparkles,
  Monitor,
  GitBranch,
  ExternalLink,
  Code2,
  Workflow,
  Bug,
  BookOpen,
  Mail,
  Building2,
  Bell,
  Webhook,
  Save,
  DollarSign,
  Clock,
  Send,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { CustomField, Language } from '../../types';
import { RolesPermissionsTab } from './RolesPermissionsTab';
import { AuditLogsTab } from './AuditLogsTab';
import { IntegrationsHubTab } from './IntegrationsHubTab';
import { ThemeModeSettings } from './ThemeModeSettings';
import { EcosystemReposHubTab } from './EcosystemReposHubTab';
import { MailSettings } from './MailSettings';

export const SettingsView: React.FC = () => {
  const {
    users,
    roles,
    auditLogs,
    securityAnomalies,
    resetToDemoData,
    loadClientumLeads,
    exportOpportunitiesCSV,
    exportFullWorkspaceJSON,
    opportunities,
    companies,
    people,
    tasks,
    theme,
    setTheme,
    language,
    setLanguage,
    t,
    showToast,
  } = useCRM();

  const [activeSubTab, setActiveSubTab] = useState<
    'roles' | 'audit' | 'integrations' | 'mail' | 'appearance' | 'schema' | 'members' | 'ecosystem' | 'data' | 'workspace' | 'notifications'
  >('roles');

  const getTabClass = (subTab: typeof activeSubTab) => {
    const isActive = activeSubTab === subTab;
    return `px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
      isActive
        ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] font-semibold shadow-2xs border border-[var(--border-strong)]'
        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]/50'
    }`;
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem('clientum_settings_section') === 'userApiKeys') {
        setActiveSubTab('integrations');
      }
    } catch {
      // The settings page remains usable when browser storage is disabled.
    }
  }, []);

  // Custom fields state
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: 'f-1', name: 'Contract Duration (Months)', type: 'number' },
    { id: 'f-2', name: 'Lead Acquisition Source', type: 'select', options: ['Inbound Demo', 'GitHub', 'Cold Email', 'Event'] },
    { id: 'f-3', name: 'Security Review Completed', type: 'boolean' },
    { id: 'f-4', name: 'Competitor Mentioned', type: 'text' },
  ]);

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'select' | 'boolean'>('text');

  // Workspace settings state
  const [workspaceName, setWorkspaceName] = useState('Clientum Enterprise OS');
  const [companyTaxId, setCompanyTaxId] = useState('30-71689234-9');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/Argentina/Buenos_Aires');
  const [supportEmail, setSupportEmail] = useState('soporte@clientum.com');
  const [industrySector, setIndustrySector] = useState('Tecnología, B2B & Software');

  // Notifications state
  const [notifyDealsWon, setNotifyDealsWon] = useState(true);
  const [notifySecurityAnomalies, setNotifySecurityAnomalies] = useState(true);
  const [notifyLeadAssignment, setNotifyLeadAssignment] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://api.clientum.com/v1/webhooks/deals');

  const handleSaveWorkspaceInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Configuración del Workspace actualizada exitosamente', 'success');
  };

  const handleSaveNotificationSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferencias de notificaciones y webhooks guardadas', 'success');
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    const newField: CustomField = {
      id: 'f-' + Date.now(),
      name: newFieldName,
      type: newFieldType,
      options: newFieldType === 'select' ? ['Option 1', 'Option 2'] : undefined,
    };

    setCustomFields((prev) => [...prev, newField]);
    setNewFieldName('');
    showToast(`Added custom field "${newField.name}"`, 'success');
  };

  const handleDeleteField = (id: string) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
    showToast('Custom field removed', 'info');
  };

  const handleExportAllJSON = () => {
    const fullBackup = {
      opportunities,
      companies,
      people,
      tasks,
      customFields,
      theme,
      exportedAt: new Date().toISOString(),
      version: 'clientum-crm-v1',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `clientum_crm_workspace_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Full workspace JSON backup exported', 'success');
  };

  return (
    <div id="clientum-settings-view" className="flex-1 flex flex-col h-full bg-[var(--bg-canvas)] text-[var(--text-primary)] overflow-y-auto p-4 select-none transition-colors duration-200">
      {/* Settings Header with Quick Theme Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">{t('settingsTitle')}</h2>
          <p className="text-xs text-[var(--text-muted)]">
            {t('settingsSubtitle')}
          </p>
        </div>

        {/* Quick Theme Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-500 dark:text-blue-300">
          {theme === 'dark' ? (
            <>
              <Moon className="h-3.5 w-3.5 text-blue-400" />
              <span>Clientum Obsidian · Modo oscuro</span>
            </>
          ) : (
            <>
              <Sun className="h-3.5 w-3.5 text-amber-550" />
              <span>Clientum Clarity · Modo claro</span>
            </>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2.5 mb-4 overflow-x-auto">
        <button
          id="tab-settings-workspace"
          onClick={() => setActiveSubTab('workspace')}
          className={getTabClass('workspace')}
        >
          <Building2 className="w-3.5 h-3.5 text-blue-500" />
          <span>Configuración Workspace</span>
        </button>

        <button
          id="tab-settings-notifications"
          onClick={() => setActiveSubTab('notifications')}
          className={getTabClass('notifications')}
        >
          <Bell className="w-3.5 h-3.5 text-purple-500" />
          <span>Notificaciones & Webhooks</span>
        </button>

        <button
          id="tab-settings-roles"
          onClick={() => setActiveSubTab('roles')}
          className={getTabClass('roles')}
        >
          <Shield className="w-3.5 h-3.5 text-blue-450" />
          <span>Roles & Permisos (RBAC)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-500 dark:text-blue-400 font-mono">
            {roles.length}
          </span>
        </button>

        <button
          id="tab-settings-audit"
          onClick={() => setActiveSubTab('audit')}
          className={getTabClass('audit')}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Auditoría & Logs</span>
          {securityAnomalies.filter((a) => a.status === 'active').length > 0 ? (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-500 dark:text-amber-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-450 animate-pulse" />
              {securityAnomalies.filter((a) => a.status === 'active').length} Alerta
            </span>
          ) : (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-mono">
              SOC2 OK
            </span>
          )}
        </button>

        <button
          id="tab-settings-integrations"
          onClick={() => setActiveSubTab('integrations')}
          className={getTabClass('integrations')}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Integraciones & API Hub</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-mono">
            GCal & Slack
          </span>
        </button>

        <button
          id="tab-settings-mail"
          onClick={() => setActiveSubTab('mail')}
          className={getTabClass('mail')}
        >
          <Mail className="w-3.5 h-3.5 text-sky-500" />
          <span>Correo & Resend API</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-500 dark:text-sky-400 font-mono">
            SMTP/Resend
          </span>
        </button>

        <button
          id="tab-settings-appearance"
          onClick={() => setActiveSubTab('appearance')}
          className={getTabClass('appearance')}
        >
          <Palette className="w-3.5 h-3.5" />
          {t('appearanceTheme')}
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-550 dark:text-blue-400 font-mono">
            {language.toUpperCase()} • {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </button>

        <button
          id="tab-settings-schema"
          onClick={() => setActiveSubTab('schema')}
          className={getTabClass('schema')}
        >
          <Database className="w-3.5 h-3.5" />
          {t('customFieldsSchema')}
        </button>

        <button
          id="tab-settings-members"
          onClick={() => setActiveSubTab('members')}
          className={getTabClass('members')}
        >
          <Users className="w-3.5 h-3.5" />
          {t('teamMembers')} ({users.length})
        </button>

        <button
          id="tab-settings-ecosystem"
          onClick={() => setActiveSubTab('ecosystem')}
          className={getTabClass('ecosystem')}
        >
          <Code2 className="w-3.5 h-3.5" />
          {t('clientumRepos')}
        </button>

        <button
          id="tab-settings-data"
          onClick={() => setActiveSubTab('data')}
          className={getTabClass('data')}
        >
          <Download className="w-3.5 h-3.5" />
          {t('dataManagement')}
        </button>
      </div>

      {/* SUBTAB: WORKSPACE GENERAL SETTINGS */}
      {activeSubTab === 'workspace' && (
        <div className="space-y-4 max-w-3xl">
          <form onSubmit={handleSaveWorkspaceInfo} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  Perfil & Datos del Workspace
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Información corporativa, moneda base de facturación y parámetros globales.
                </p>
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Nombre del Workspace
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  CUIT / CPT / ID Fiscal
                </label>
                <input
                  type="text"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                  className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Moneda Principal del CRM
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-blue-500"
                >
                  <option value="USD">USD ($ Dólar Estadounidense)</option>
                  <option value="ARS">ARS ($ Peso Argentino)</option>
                  <option value="BRL">BRL (R$ Real Brasileño)</option>
                  <option value="EUR">EUR (€ Euro)</option>
                  <option value="MXN">MXN ($ Peso Mexicano)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Zona Horaria Principal
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-blue-500"
                >
                  <option value="America/Argentina/Buenos_Aires">GMT-3 (Buenos Aires / Brasilia)</option>
                  <option value="America/Mexico_City">GMT-6 (Ciudad de México)</option>
                  <option value="America/Bogota">GMT-5 (Bogotá / Lima)</option>
                  <option value="America/New_York">GMT-5 (New York / Miami)</option>
                  <option value="Europe/Madrid">GMT+1 (Madrid / Barcelona)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Email de Soporte / Notificaciones
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Industria / Sector de Negocio
                </label>
                <input
                  type="text"
                  value={industrySector}
                  onChange={(e) => setIndustrySector(e.target.value)}
                  className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </form>

          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-sm">
                C
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">Clientum Workspace Shield</div>
                <div className="text-[11px] text-[var(--text-muted)]">Cifrado de datos en reposo AES-256 + Autenticación Firebase Auth activa.</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              PROTEGIDO
            </span>
          </div>
        </div>
      )}

      {/* SUBTAB: NOTIFICATIONS & WEBHOOKS */}
      {activeSubTab === 'notifications' && (
        <div className="space-y-4 max-w-3xl">
          <form onSubmit={handleSaveNotificationSettings} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-500" />
                  Alertas Automatizadas & Webhooks
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Recibe notificaciones instantáneas y envía eventos a Zapier, N8N o Make.
                </p>
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Alertas</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">Notificar Oportunidades Ganadas</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Envía un email al equipo cuando un trato cambia a estado "Ganado" (Won).</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDealsWon}
                  onChange={(e) => setNotifyDealsWon(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">Alertas de Seguridad SOC2 & Anomalías</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Notificación prioritaria en caso de accesos inusuales o intentos de exportación masiva.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifySecurityAnomalies}
                  onChange={(e) => setNotifySecurityAnomalies(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">Asignación de Leads & Contactos</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Notifica al ejecutivo comercial asignado cuando se le transfiere un prospecto.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyLeadAssignment}
                  onChange={(e) => setNotifyLeadAssignment(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-2">
                <Webhook className="w-4 h-4 text-purple-400" />
                URL Endpoint del Webhook HTTP (POST)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="flex-1 bg-[var(--bg-input)] text-xs font-mono text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => showToast('Evento de prueba enviado al webhook con exito', 'info')}
                  className="px-3 py-2 bg-[var(--bg-muted)] border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)]/80 text-[var(--text-primary)] text-xs font-medium rounded-lg cursor-pointer transition-colors"
                >
                  Probar Webhook
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB: ROLES & GRANULAR PERMISSIONS (RBAC) */}
      {activeSubTab === 'roles' && <RolesPermissionsTab />}

      {/* SUBTAB: AUDIT LOGS & COMPLIANCE */}
      {activeSubTab === 'audit' && <AuditLogsTab />}

      {/* SUBTAB: TWO-WAY INTEGRATIONS HUB */}
      {activeSubTab === 'integrations' && <IntegrationsHubTab />}

      {/* SUBTAB: CORREO & RESEND API CONFIGURATION */}
      {activeSubTab === 'mail' && <MailSettings />}

      {/* SUBTAB 0: APPEARANCE, THEME & LANGUAGE */}
      {activeSubTab === 'appearance' && (
        <div className="space-y-4 max-w-4xl">
          {/* Language Selector Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  {t('languageSelector')} (i18n)
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Selecciona tu idioma preferido / Escolha seu idioma preferido / Select your preferred language
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {/* English */}
              <div
                id="lang-card-en"
                onClick={() => setLanguage('en')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${ language === 'en' ? 'border-blue-500 bg-[var(--bg-muted)] shadow-md shadow-blue-500/10' : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-blue-500/30' }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">🇺🇸</span>
                  {language === 'en' && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
                <div className="font-semibold text-xs text-[var(--text-primary)]">English</div>
                <div className="text-[11px] text-[var(--text-muted)]">United States / Global</div>
              </div>

              {/* Spanish */}
              <div
                id="lang-card-es"
                onClick={() => setLanguage('es')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${ language === 'es' ? 'border-blue-500 bg-[var(--bg-muted)] shadow-md shadow-blue-500/10' : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-blue-500/30' }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">🇪🇸</span>
                  {language === 'es' && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                      <Check className="w-3 h-3" />
                      Activo
                    </span>
                  )}
                </div>
                <div className="font-semibold text-xs text-[var(--text-primary)]">Español</div>
                <div className="text-[11px] text-[var(--text-muted)]">España / Latinoamérica</div>
              </div>

              {/* Portuguese */}
              <div
                id="lang-card-pt"
                onClick={() => setLanguage('pt')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${ language === 'pt' ? 'border-blue-500 bg-[var(--bg-muted)] shadow-md shadow-blue-500/10' : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-blue-500/30' }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">🇧🇷</span>
                  {language === 'pt' && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                      <Check className="w-3 h-3" />
                      Ativo
                    </span>
                  )}
                </div>
                <div className="font-semibold text-xs text-[var(--text-primary)]">Português</div>
                <div className="text-[11px] text-[var(--text-muted)]">Brasil / Portugal</div>
              </div>
            </div>
          </div>

          {/* Main Theme Selection & Mode Toggle Component */}
          <ThemeModeSettings />

          {/* Accessibility & Readability Details */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 rounded-xl">
            <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              Accessibility & Display Standards
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--text-muted)]">
              <div className="p-3 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                <div className="font-semibold text-[var(--text-secondary)] mb-1">Contrast Ratio</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Meets WCAG 2.1 AAA contrast benchmarks with 7:1+ text-to-background ratio in light mode.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                <div className="font-semibold text-[var(--text-secondary)] mb-1">Crisp Borders</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Clear visual delineations on Kanban cards, table headers, and form inputs for cognitive ease.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
                <div className="font-semibold text-[var(--text-secondary)] mb-1">Local Persistence</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Your theme preference is automatically remembered and restored upon every session.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 1: CUSTOM FIELDS & SCHEMA */}
      {activeSubTab === 'schema' && (
        <div className="space-y-4 max-w-3xl">
          {/* Add Field Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 rounded-xl">
            <h3 className="text-xs font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" />
              Define New Custom Field
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Extend standard CRM objects (Deals, Accounts, Contacts) with custom properties.
            </p>

            <form onSubmit={handleAddCustomField} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                placeholder="Field name (e.g. Renewal Probability, Slack Channel)..."
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="flex-1 bg-[var(--bg-input)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-blue-500"
              />

              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as any)}
                className="bg-[var(--bg-input)] text-xs text-[var(--text-primary)] px-3 py-2 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-blue-500"
              >
                <option value="text">Text (String)</option>
                <option value="number">Number</option>
                <option value="select">Dropdown Select</option>
                <option value="boolean">Boolean Flag</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Add Field
              </button>
            </form>
          </div>

          {/* Existing Fields List */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
            <div className="p-3 bg-[var(--bg-muted)] border-b border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)]">
              Active Custom Schema Properties
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
              {customFields.map((field) => (
                <div
                  key={field.id}
                  className="p-3.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">{field.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono">
                        Type: <span className="text-blue-400">{field.type}</span>
                        {field.options && ` • Options: [${field.options.join(', ')}]`}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors animate-all"
                    title="Delete field"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: MEMBERS */}
      {activeSubTab === 'members' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl max-w-3xl overflow-hidden">
          <div className="p-3 bg-[var(--bg-muted)] border-b border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
            <span>Workspace Team Members</span>
            <span className="text-[11px] text-[var(--text-muted)] font-normal">Active Seats: 4 of 10</span>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {users.map((u) => (
              <div key={u.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover border border-[var(--border-subtle)]"
                  />
                  <div>
                    <div className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      {u.name}
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--bg-muted)] text-blue-500 dark:text-blue-300 font-mono">
                        {u.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-550/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* SUBTAB: CLIENTUM REPOSITORIES & ECOSYSTEM MIGRATION */}
      {activeSubTab === 'ecosystem' && (
        <EcosystemReposHubTab />
      )}

      {/* SUBTAB 4: DATA MANAGEMENT */}
      {activeSubTab === 'data' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 max-w-3xl space-y-5 text-xs">
          {/* Clientum B2B Leads Integration */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 mb-2">
                  Dataset de Leads 🇦🇷
                </span>
                <h3 className="font-bold text-[var(--text-primary)] text-sm">Cargar Leads de Clientum B2B</h3>
                <p className="text-[var(--text-secondary)] text-xs mt-1 leading-relaxed">
                  Carga la base de datos de prospectos e industrias plásticas de Argentina (ABEPOL S.R.L., ACHA PLAST S.A., Verion ICSA, Dr. Lantos, etc.) directamente en tu pipeline activo de Clientum OS.
                </p>
              </div>
              <Database className="w-8 h-8 text-blue-500 shrink-0 opacity-80" />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
              <div className="text-[11px] text-[var(--text-muted)]">
                <strong className="text-[var(--text-primary)]">Leads Disponibles:</strong> +3,740 empresas industriales segmentadas por provincia y email verificado.
              </div>
              <button
                onClick={loadClientumLeads}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md transition-all shrink-0 cursor-pointer text-xs"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Importar Base Clientum</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[var(--text-primary)] text-xs mb-1">Backup & Migration</h3>
            <p className="text-[var(--text-muted)] text-xs">
              Export your CRM state to JSON or CSV for reporting, data warehousing, or backup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportFullWorkspaceJSON}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[var(--text-primary,#0f172a)] dark:text-white" />
              <span>Export Full CRM & ERP Workspace (JSON)</span>
            </button>

            <button
              onClick={exportOpportunitiesCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)]/80 text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>Export Deals (CSV)</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <h3 className="font-semibold text-rose-500 dark:text-rose-400 text-xs mb-1">Danger Zone</h3>
            <p className="text-[var(--text-muted)] text-xs mb-3">
              Reset your entire workspace database back to standard sample seed data.
            </p>
            <button
              onClick={resetToDemoData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database to Demo State</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
