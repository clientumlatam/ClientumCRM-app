import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Webhook,
  KeyRound,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Send,
  Zap,
  Sparkles,
  Server,
  Layers,
  ChevronRight,
  ExternalLink,
  Bot
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';

interface PublicDeveloperApiViewProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicDeveloperApiView: React.FC<PublicDeveloperApiViewProps> = ({ onNavigate }) => {
  const { showToast } = useCRM();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<number>(0);
  const [selectedWebhookEvent, setSelectedWebhookEvent] = useState<string>('deal.won');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copiado al portapapeles', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/contacts',
      desc: 'Listar contactos con filtros de búsqueda por email, teléfono, empresa o tags.',
      auth: 'Bearer <TOKEN>',
      responseExample: `{
  "status": "success",
  "data": [
    {
      "id": "cnt_91823",
      "name": "Marcelo Rossi",
      "email": "mrossi@distribuidorapatagonica.com",
      "phone": "+5492984123456",
      "company": "Distribuidora Patagónica",
      "stage": "Customer",
      "created_at": "2026-08-10T14:20:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 482 }
}`
    },
    {
      method: 'POST',
      path: '/api/contacts',
      desc: 'Crear un nuevo contacto y asociarlo a un vendedor o empresa automáticamente.',
      auth: 'Bearer <TOKEN>',
      responseExample: `{
  "status": "created",
  "data": {
    "id": "cnt_91824",
    "name": "Laura Gómez",
    "email": "lgomez@frutasdelcomahue.ar",
    "whatsapp_status": "OptedIn",
    "assigned_rep": "Julian Rossi"
  }
}`
    },
    {
      method: 'GET',
      path: '/api/deals',
      desc: 'Obtener deals del pipeline con etapas, importes ponderados y scoring MEDDIC.',
      auth: 'Bearer <TOKEN>',
      responseExample: `{
  "status": "success",
  "data": [
    {
      "id": "DL-2847",
      "title": "Maquinaria Agrícola Cosecha 2026",
      "amount": 4500000,
      "currency": "ARS",
      "stage": "Propuesta Técnica",
      "probability": 0.75,
      "company_id": "comp_3910"
    }
  ]
}`
    },
    {
      method: 'POST',
      path: '/api/deals',
      desc: 'Crear un deal y asignarlo a un contacto y embudo comercial específico.',
      auth: 'Bearer <TOKEN>',
      responseExample: `{
  "status": "created",
  "deal_id": "DL-2848",
  "stage": "Nuevo Lead Calificado",
  "assigned_to": "Carla Lucero"
}`
    },
    {
      method: 'PATCH',
      path: '/api/deals/:id/stage',
      desc: 'Avanzar o retroceder la etapa de un deal disparando eventos y tareas vinculadas.',
      auth: 'Bearer <TOKEN>',
      responseExample: `{
  "status": "updated",
  "deal_id": "DL-2847",
  "previous_stage": "Propuesta",
  "new_stage": "Ganado (Cerrado)",
  "automation_triggered": "generate_afip_invoice_job"
}`
    },
    {
      method: 'GET',
      path: '/api/invoices',
      desc: 'Listar facturas emitidas con CAE de AFIP, código QR y estado de cobro en tiempo real.',
      auth: 'Bearer <TOKEN>',
      responseExample: `{
  "status": "success",
  "invoices": [
    {
      "id": "INV-2026-0912",
      "type": "Factura A",
      "cae": "74123456789012",
      "cae_vto": "2026-09-22",
      "amount_total": 540000.00,
      "status": "Aprobada AFIP"
    }
  ]
}`
    },
    {
      method: 'POST',
      path: '/api/webhooks',
      desc: 'Registrar un endpoint HTTPS seguro para recibir eventos en streaming.',
      auth: 'Bearer <TOKEN>',
      responseExample: `{
  "status": "registered",
  "webhook_id": "whk_7718",
  "target_url": "https://api.tuempresa.com/clientum-events",
  "events_subscribed": ["deal.won", "invoice.issued"]
}`
    },
    {
      method: 'GET',
      path: '/api/activity',
      desc: 'Obtener el log unificado de actividad (WhatsApp, emails, llamadas, notas) por contacto o deal.',
      auth: 'Bearer <TOKEN>',
      responseExample: `{
  "status": "success",
  "timeline": [
    {
      "event": "whatsapp_incoming",
      "text": "Hola, confirmo el presupuesto para la entrega en Roca.",
      "timestamp": "2026-08-11T16:04:12Z"
    }
  ]
}`
    }
  ];

  const webhookEvents = [
    'lead.created',
    'lead.qualified',
    'deal.created',
    'deal.stage_changed',
    'deal.won',
    'deal.lost',
    'invoice.issued',
    'invoice.paid',
    'contact.updated',
    'message.received'
  ];

  const sampleWebhookPayload = `{
  "event": "${selectedWebhookEvent}",
  "timestamp": "2026-07-17T14:00:00Z",
  "data": {
    "deal_id": "DL-2847",
    "company": "Ferretería Central",
    "amount_usd": 450,
    "invoice_cae": "74123456789012",
    "customer": {
      "name": "Guillermo Silva",
      "phone": "+5492984123456",
      "email": "ventas@ferreteriacentral.com.ar"
    }
  }
}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans bg-white text-slate-900">
      
      {/* 1. Header Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <Terminal className="w-3.5 h-3.5 text-blue-600" />
          <span>Para Desarrolladores · Developer Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          API REST & Documentación Técnica
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Integrá Clientum con tus sistemas propios, automatizaciones externas o herramientas de BI usando nuestra API REST y sistema de webhooks en tiempo real.
        </p>
      </section>

      {/* 2. Three Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">API REST</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Endpoints autenticados con Bearer Token para leer y escribir contactos, deals, facturas y actividad del CRM desde cualquier sistema externo.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Webhook className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Webhooks en tiempo real</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recibí notificaciones instantáneas cuando ocurren eventos: lead creado, deal ganado, pago recibido, factura emitida, mensaje recibido.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">OAuth 2.0 / SSO</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Conectá tu sistema de autenticación propio usando el estándar OAuth 2.0. Compatible con Google Workspace, Microsoft 365 y proveedores SAML.
          </p>
        </div>
      </div>

      {/* 3. Interactive Endpoints Explorer */}
      <section className="bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 rounded-3xl p-6 sm:p-8 text-[#0f172a] dark:text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono uppercase text-blue-400 font-bold">REST Reference</div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] dark:text-white">Endpoints Disponibles</h2>
          </div>
          <div className="text-xs text-[#0f172a] dark:text-white dark:text-slate-400 font-mono">
            Base URL: <span className="text-emerald-400">https://api.clientum.com.ar/v1</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Endpoints List */}
          <div className="lg:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {endpoints.map((ep, idx) => {
              const isSelected = selectedEndpoint === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedEndpoint(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-950/80 border-blue-500 shadow-sm'
                      : 'bg-slate-800/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        ep.method === 'GET'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : ep.method === 'POST'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#0f172a] dark:text-white dark:text-slate-200 truncate">{ep.path}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Endpoint Details & Response Preview */}
          <div className="lg:col-span-7 bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-950 rounded-2xl p-5 border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                      endpoints[selectedEndpoint].method === 'GET'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : endpoints[selectedEndpoint].method === 'POST'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {endpoints[selectedEndpoint].method}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#0f172a] dark:text-white">
                    {endpoints[selectedEndpoint].path}
                  </span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `curl -X ${endpoints[selectedEndpoint].method} https://api.clientum.com.ar/v1${endpoints[selectedEndpoint].path} \\\n  -H "Authorization: Bearer YOUR_API_TOKEN"`,
                      'curl-copy'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-700 text-[#0f172a] dark:text-white dark:text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedId === 'curl-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'curl-copy' ? 'Copiado' : 'Copiar cURL'}</span>
                </button>
              </div>

              <p className="text-xs text-[#0f172a] dark:text-white dark:text-slate-400">
                {endpoints[selectedEndpoint].desc}
              </p>

              <div className="pt-2">
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
                  Ejemplo de Respuesta JSON:
                </div>
                <pre className="bg-slate-900/90 rounded-xl p-3.5 text-[11px] font-mono text-emerald-300 overflow-x-auto border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 max-h-56 leading-relaxed">
                  {endpoints[selectedEndpoint].responseExample}
                </pre>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between">
              <span>Header requerido: <code className="text-[#0f172a] dark:text-white dark:text-slate-300 font-mono">Authorization: Bearer &lt;TOKEN&gt;</code></span>
              <span className="text-emerald-400 font-bold">200 OK / 201 Created</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Webhooks Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-blue-600 font-bold">Event Stream</div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Eventos de Webhook Disponibles</h2>
          </div>
          <div className="text-xs text-slate-500">
            Envío asíncrono con firma HMAC SHA-256
          </div>
        </div>

        {/* Event Chips */}
        <div className="flex flex-wrap gap-2">
          {webhookEvents.map((evt) => (
            <button
              key={evt}
              onClick={() => setSelectedWebhookEvent(evt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                selectedWebhookEvent === evt
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300'
              }`}
            >
              {evt}
            </button>
          ))}
        </div>

        {/* Webhook JSON Payload Preview */}
        <div className="bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 rounded-2xl p-5 text-[#0f172a] dark:text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#0f172a] dark:text-white dark:text-slate-400">
              // POST a tu endpoint cuando se dispara: <strong className="text-blue-400">{selectedWebhookEvent}</strong>
            </span>
            <button
              onClick={() => copyToClipboard(sampleWebhookPayload, 'wh-copy')}
              className="px-2.5 py-1 rounded-lg bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-700 text-xs text-[#0f172a] dark:text-white dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedId === 'wh-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'wh-copy' ? 'Copiado' : 'Copiar Payload'}</span>
            </button>
          </div>

          <pre className="text-xs font-mono text-emerald-300 bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-950 p-4 rounded-xl overflow-x-auto border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800">
            {sampleWebhookPayload}
          </pre>
        </div>
      </section>

      {/* 5. Contact Technical Engineering Team CTA */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 text-white p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          ¿Necesitás integrar Clientum con tus sistemas?
        </h2>
        <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
          Nuestro equipo técnico puede guiarte en la integración. Escribinos y te respondemos en menos de 24 horas hábiles con acceso a la Sandbox de desarrollo.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('/contacto')}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Contactar al equipo técnico</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
