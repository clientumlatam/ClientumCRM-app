import React, { useState } from 'react';
import {
  Mail,
  Server,
  Database,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Inbox,
  Clock,
  Sparkles,
  Info,
  ArrowRight,
  Globe,
  Lock,
  Layers,
  FileCode,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface WebmailMessage {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  spfStatus: 'PASS' | 'NEUTRAL';
  dkimStatus: 'PASS' | 'NEUTRAL';
  isRead: boolean;
}

export const CloudflareWebmailTab: React.FC = () => {
  const { showToast, currentUser } = useCRM();

  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<WebmailMessage | null>(null);
  const [isSimulatingSend, setIsSimulatingSend] = useState(false);

  // Test Email form state
  const [testSender, setTestSender] = useState('contacto@empresa-cliente.com');
  const [testSubject, setTestSubject] = useState('Consulta Comercial sobre Licencias Clientum CRM');
  const [testBody, setTestBody] = useState(
    'Hola equipo de Clientum,\n\nQueremos evaluar la contratación del plan Enterprise para 25 ejecutivos comerciales. ¿Podrían coordinar una demo para el próximo jueves?\n\nSaludos cordiales,\nMartín Gómez - Gerente Comercial'
  );

  // Local demo emails; the app does not connect to D1 at runtime yet.
  const [emails, setEmails] = useState<WebmailMessage[]>([
    {
      id: 'msg-101',
      from: 'martin.gomez@techcorp-latam.com',
      fromName: 'Martín Gómez',
      to: 'info@clientum.com.ar',
      subject: 'Solicitud de Presupuesto - Implementación CRM Cono Sur',
      body: 'Estimado equipo de Clientum,\n\nNos ponemos en contacto desde TechCorp LatAm para solicitar cotización formal sobre la integración de su CRM con Facturación AFIP y WhatsApp Multiagente.\n\nAgradecemos pronta respuesta.\n\nAtte,\nMartín Gómez',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      spfStatus: 'PASS',
      dkimStatus: 'PASS',
      isRead: true,
    },
    {
      id: 'msg-102',
      from: 'consultas@finanzasdigitales.com.ar',
      fromName: 'Finanzas Digitales SA',
      to: 'info@clientum.com.ar',
      subject: 'Validación de Webhooks y API REST Clientum',
      body: 'Hola,\n\nEstamos configurando los webhooks outbound hacia nuestro ERP SAP. ¿Podrían confirmar el formato del token HMAC SHA256 para validación de firma en recepción?\n\nGracias,\nEquipo de Arquitectura',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      spfStatus: 'PASS',
      dkimStatus: 'PASS',
      isRead: false,
    },
    {
      id: 'msg-103',
      from: 'noreply@cloudflare.com',
      fromName: 'Cloudflare Email Routing',
      to: 'info@clientum.com.ar',
      subject: 'Email Routing Rule Activated: info@clientum.com.ar -> webmail-clientum',
      body: 'Your email routing rule for info@clientum.com.ar has been routed to Worker "webmail-clientum" successfully.\n\nDestination: Worker Binding\nD1 Database: webmail-db\nStatus: Enabled',
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      spfStatus: 'PASS',
      dkimStatus: 'PASS',
      isRead: true,
    },
  ]);

  const handleCopySnippet = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    showToast('Comando copiado', 'success');
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleSimulateTestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testSender || !testSubject) return;

    setIsSimulatingSend(true);
    setTimeout(() => {
      const newMsg: WebmailMessage = {
        id: 'msg-' + Date.now(),
        from: testSender.trim(),
        fromName: testSender.split('@')[0],
        to: 'info@clientum.com.ar',
        subject: testSubject.trim(),
        body: testBody.trim(),
        timestamp: new Date().toISOString(),
        spfStatus: 'PASS',
        dkimStatus: 'PASS',
        isRead: false,
      };

      setEmails((prev) => [newMsg, ...prev]);
      setSelectedEmail(newMsg);
      setIsSimulatingSend(false);
      showToast('Email simulado localmente; no se envió ni se guardó en D1', 'info');
    }, 800);
  };

  return (
    <div id="cloudflare-webmail-tab" className="space-y-6">
      {/* Overview Banner: Solución al Problema de Deduplicación de Gmail */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-blue-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Cloudflare Worker & D1 — configuración pendiente
              </span>
              <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">info@clientum.com.ar</span>
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
              Centro de Enrutamiento de Email & Webmail Autónomo
            </h3>
            <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed max-w-3xl">
              Arquitectura prevista de recepción mediante Cloudflare Email Routing hacia el Worker{' '}
              <span className="font-mono text-blue-300 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2434] px-1.5 py-0.5 rounded">webmail-clientum</span>, con persistencia en Cloudflare D1 cuando se complete la conexión. Permite operar tu propio webmail en{' '}
              <a
                href="https://webmail.clientum.com.ar"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline font-mono"
              >
                webmail.clientum.com.ar
              </a>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://webmail.clientum.com.ar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir Webmail</span>
            </a>
          </div>
        </div>

        {/* Root Cause & Solution Info Callout */}
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c0f17] rounded-lg p-3.5 text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 space-y-2">
          <div className="flex items-start gap-2 text-amber-300 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>Diagnóstico del Problema de Recepción en Gmail:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[var(--text-secondary,#475569)] dark:text-slate-300 pl-6">
            La configuración recomendada evita reenviar a <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-mono">clientumlatam@gmail.com</span>, porque Gmail puede detectar el mismo Message-ID y descartarlo como duplicado. La regla <strong>"Send to a Worker" &rarr; webmail-clientum</strong> queda pendiente de publicación y conexión con D1.
          </p>
        </div>
      </div>

      {/* Grid: 3-Pillar Technical Setup Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium">1. Enrutamiento Cloudflare</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Send to a Worker</div>
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
            Regla documentada: <span className="text-amber-300 font-mono">info@clientum.com.ar</span> &rarr; <span className="text-blue-300 font-mono">webmail-clientum</span>
          </div>
        </div>

        <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium">2. Base de Datos D1</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">webmail-db — demo</div>
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
            La bandeja actual usa datos locales; D1 todavía no está conectado en runtime
          </div>
        </div>

        <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium">3. Dominio & Encriptación</span>
            <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">webmail.clientum.com.ar — NXDOMAIN</div>
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
            Falta publicar el hostname antes de poder validar SSL
          </div>
        </div>
      </div>

      {/* Live Mailbox & Test Sender Simulation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Test Email Sender Simulator */}
        <div className="lg:col-span-5 bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-xl p-4.5 space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white uppercase tracking-wider">
                Simulador de Envío a info@clientum.com.ar
              </h4>
            </div>
          </div>

          <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed">
            Simula un correo localmente para revisar la interfaz. No envía mensajes ni escribe en Cloudflare/D1:
          </p>

          <form onSubmit={handleSimulateTestEmail} className="space-y-3 text-xs">
            <div>
              <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Remitente (De:) *</label>
              <input
                type="email"
                required
                value={testSender}
                onChange={(e) => setTestSender(e.target.value)}
                placeholder="ej. prospecto@empresa.com"
                className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] rounded-md px-3 py-1.5 text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Destinatario (Para:)</label>
              <input
                type="text"
                disabled
                value="info@clientum.com.ar"
                className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090c12] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-md px-3 py-1.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono text-[11px] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Asunto *</label>
              <input
                type="text"
                required
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
                className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] rounded-md px-3 py-1.5 text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Cuerpo del Mensaje</label>
              <textarea
                rows={4}
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
                className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c] rounded-md p-2.5 text-[var(--text-primary,#0f172a)] dark:text-white text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSimulatingSend}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Send className={`w-3.5 h-3.5 ${isSimulatingSend ? 'animate-spin' : ''}`} />
              <span>{isSimulatingSend ? 'Enrutando vía Cloudflare Worker...' : 'Disparar Email de Prueba'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Webmail Inbox Preview */}
        <div className="lg:col-span-7 bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-xl p-4.5 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white uppercase tracking-wider">
                Bandeja de Entrada D1 (webmail-db) ({emails.length})
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Sincronizado en Vivo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[320px]">
            {/* List of Messages */}
            <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#181f2f] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-lg overflow-y-auto max-h-[340px]">
              {emails.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedEmail(msg)}
                  className={`p-3 cursor-pointer transition-colors text-xs space-y-1 ${ selectedEmail?.id === msg.id ? 'bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2334] border-l-2 border-blue-500' : 'hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#141924]' }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white truncate max-w-[140px]">
                      {msg.fromName || msg.from}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium truncate">{msg.subject}</div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">{msg.body}</div>
                </div>
              ))}
            </div>

            {/* Selected Message Viewer */}
            <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-lg p-3.5 flex flex-col justify-between text-xs">
              {selectedEmail ? (
                <div className="space-y-2.5 overflow-y-auto max-h-[320px]">
                  <div>
                    <h5 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm leading-tight">{selectedEmail.subject}</h5>
                    <div className="mt-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 flex flex-wrap items-center gap-2">
                      <span><strong>De:</strong> {selectedEmail.from}</span>
                      <span>•</span>
                      <span><strong>Para:</strong> {selectedEmail.to}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        SPF: {selectedEmail.spfStatus}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        DKIM: {selectedEmail.dkimStatus}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {new Date(selectedEmail.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs whitespace-pre-line leading-relaxed font-sans">
                    {selectedEmail.body}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[var(--text-muted)] space-y-1">
                  <Mail className="w-8 h-8 text-[var(--text-secondary)] mb-1" />
                  <span>Selecciona un correo para inspeccionar el contenido decodificado por postal-mime</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cloudflare Worker Deployment & Wrangler CLI Hub */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-xl p-5 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                Guía de Deploy & Wrangler CLI
              </h4>
              <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
                Comandos oficiales para configurar D1 y publicar el Worker. Las credenciales deben gestionarse fuera del código.
              </p>
            </div>
          </div>
        </div>

        {/* Secure setup note */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">Acceso seguro al repositorio:</span>
          <div className="flex items-start gap-2 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0d14] border border-amber-500/20 rounded-lg p-3 text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              No se muestran comandos con tokens embebidos. Usa un repositorio autenticado mediante tu proveedor Git o configura Wrangler con secretos administrados por Cloudflare.
            </p>
          </div>
        </div>

        {/* 5-Step Terminal Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          {[
            {
              id: 'cmd-1',
              step: 'Paso 1: Crear Base D1',
              cmd: 'npx wrangler d1 create webmail-db',
              desc: 'Crea la base de datos SQL distribuida de Cloudflare y genera el database_id.',
            },
            {
              id: 'cmd-2',
              step: 'Paso 2: Ejecutar Schema SQL',
              cmd: 'npx wrangler d1 execute webmail-db --remote --file=schema.sql',
              desc: 'Crea las tablas emails, recipients, attachments y mailbox_config.',
            },
            {
              id: 'cmd-3',
              step: 'Paso 3: Instalar Dependencias',
              cmd: 'npm install',
              desc: 'Instala postal-mime y librerías de parseo MIME de correo electrónico.',
            },
            {
              id: 'cmd-4',
              step: 'Paso 4: Clave Secreta Webmail',
              cmd: 'npx wrangler secret put WEBMAIL_PASSWORD --config webmail-wrangler.jsonc',
              desc: 'Guarda la contraseña de acceso encriptada para el panel web.',
            },
            {
              id: 'cmd-5',
              step: 'Paso 5: Deployar Worker a Producción',
              cmd: 'npx wrangler deploy --config webmail-wrangler.jsonc',
              desc: 'Publica el Worker en Cloudflare Edge y configura después el dominio webmail.clientum.com.ar.',
            },
            {
              id: 'cmd-6',
              step: 'Paso 6: Regla de Email Routing',
              cmd: 'Cloudflare Dashboard > Email Routing > Rules: info@clientum.com.ar -> Worker webmail-clientum',
              desc: 'Cambia la acción a "Send to a Worker" para recibir todos los emails sin depender de Gmail.',
            },
          ].map((item) => (
            <div key={item.id} className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs">{item.step}</span>
                <button
                  onClick={() => handleCopySnippet(item.cmd, item.id)}
                  className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white p-1 rounded hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1e2434] transition-colors"
                  title="Copiar comando"
                >
                  {copiedCmd === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="font-mono text-[11px] text-blue-300 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090c12] p-1.5 rounded truncate border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a2130]">
                {item.cmd}
              </div>
              <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cloudflare DNS Verification Checklist */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-xl p-4.5 space-y-3">
        <h4 className="text-xs font-bold text-[var(--text-secondary,#475569)] dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Registros DNS Requeridos para clientum.com.ar
        </h4>

        <div className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#181f2f] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e121a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] rounded-lg overflow-hidden text-xs">
          <div className="p-3 flex items-center justify-between gap-2">
            <div>
                <span className="font-mono font-bold text-[var(--text-primary,#0f172a)] dark:text-white">MX (Prioridad 37, 70, 72)</span>
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block text-[11px] font-mono">
                route1.mx.cloudflare.net, route2.mx.cloudflare.net, route3.mx.cloudflare.net
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium shrink-0">
              Activo
            </span>
          </div>

          <div className="p-3 flex items-center justify-between gap-2">
            <div>
              <span className="font-mono font-bold text-[var(--text-primary,#0f172a)] dark:text-white">TXT (SPF)</span>
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block text-[11px] font-mono">
                v=spf1 include:_spf.mx.cloudflare.net ~all
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium shrink-0">
              Activo
            </span>
          </div>

          <div className="p-3 flex items-center justify-between gap-2">
            <div>
              <span className="font-mono font-bold text-[var(--text-primary,#0f172a)] dark:text-white">TXT (DKIM)</span>
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block text-[11px] font-mono">
                cf2024-1._domainkey.clientum.com.ar
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium shrink-0">
              Activo
            </span>
          </div>

          <div className="p-3 flex items-center justify-between gap-2">
            <div>
              <span className="font-mono font-bold text-[var(--text-primary,#0f172a)] dark:text-white">DMARC (monitorización)</span>
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block text-[11px] font-mono">
                _dmarc.clientum.com.ar — p=none
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-medium shrink-0">
              Sin enforcement
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
