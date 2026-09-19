import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  LayoutTemplate,
  X,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import {
  TrackedEmailRecord,
  getTrackedEmails,
  refreshEmailStatus,
  sendTransactionalEmail,
  getMailSettings,
  MailTemplate,
} from '../../services/crmMailService';
import { MailAnalyticsPanel } from '../mail/MailAnalyticsPanel';
import { MailTemplateEditor } from '../mail/MailTemplateEditor';

interface EmailStatusTrackerPanelProps {
  targetType?: 'opportunity' | 'person' | 'company';
  targetId?: string;
  targetName?: string;
  defaultRecipient?: string;
  compact?: boolean;
}

export const EmailStatusTrackerPanel: React.FC<EmailStatusTrackerPanelProps> = ({
  targetType,
  targetId,
  targetName,
  defaultRecipient = '',
  compact = false,
}) => {
  const { showToast, triggerConfetti, addActivity } = useCRM();
  const [emails, setEmails] = useState<TrackedEmailRecord[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Compose form state
  const [toEmail, setToEmail] = useState(defaultRecipient);
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('presupuesto');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadEmails();
  }, [targetId]);

  useEffect(() => {
    if (defaultRecipient) {
      setToEmail(defaultRecipient);
    }
  }, [defaultRecipient]);

  const loadEmails = () => {
    const list = getTrackedEmails(targetId);
    setEmails(list);
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    showToast('Actualizando estado de entrega desde Resend API...', 'info');
    try {
      for (const email of emails.slice(0, 5)) {
        await refreshEmailStatus(email.id);
      }
      loadEmails();
      showToast('Estados de entrega sincronizados.', 'success');
    } catch {
      showToast('Error al actualizar estados de entrega.', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleApplyTemplate = (tpl: string) => {
    setSelectedTemplate(tpl);
    const client = targetName || 'Estimado cliente';
    if (tpl === 'presupuesto') {
      setSubject(`Propuesta Comercial - Clientum CRM para ${client}`);
      setBodyText(
        `Hola ${client},\n\n` +
        `Adjuntamos la propuesta técnica y económica personalizada para la implementación de Clientum CRM.\n` +
        `Incluye acceso completo al Pipeline Kanban, integración de WhatsApp Multiagente y emisión de Facturas AFIP.\n\n` +
        `Quedamos a su disposición para coordinar una reunión de demostración guiada.\n\n` +
        `Saludos cordiales,\nEquipo Comercial Clientum CRM`
      );
    } else if (tpl === 'factura') {
      setSubject(`Factura Electrónica AFIP CAE - Comprobante de Servicio`);
      setBodyText(
        `Estimado/a ${client},\n\n` +
        `Adjuntamos el comprobante fiscal electrónico correspondiente al período en curso, debidamente validado ante AFIP (WSFE v1).\n` +
        `Podrá descargar el duplicado y efectuar el pago mediante los enlaces autorizados.\n\n` +
        `Muchas gracias por su confianza.\nAdministración Clientum`
      );
    } else if (tpl === 'seguimiento') {
      setSubject(`Seguimiento de consulta comercial - Clientum CRM`);
      setBodyText(
        `Hola ${client},\n\n` +
        `Esperamos que estés teniendo una excelente semana. Nos comunicamos para conocer si pudiste revisar los materiales que te enviamos y si tienes alguna consulta sobre la suite.\n\n` +
        `¿Te vendría bien una llamada de 10 minutos mañana para responder dudas puntuales?\n\n` +
        `Saludos,\nClientum CRM`
      );
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !subject.trim() || !bodyText.trim()) {
      showToast('Por favor complete destinatario, asunto y mensaje.', 'warning');
      return;
    }

    setIsSending(true);
    try {
      const result = await sendTransactionalEmail({
        to: toEmail.trim(),
        subject: subject.trim(),
        text: bodyText.trim(),
        html: `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b;">${bodyText.replace(/\n/g, '<br/>')}</div>`,
        targetType,
        targetId,
        targetName,
      });

      if (result.success) {
        // Log to Activity Timeline in CRM
        addActivity({
          title: `Email Transaccional: ${subject.trim()}`,
          content: `Enviado a ${toEmail.trim()} vía Resend API. Estado: ${result.status.toUpperCase()}`,
          author: 'Clientum CRM (Resend)',
          type: 'email',
          targetType: targetType || 'opportunity',
          targetId: targetId || 'general',
        });

        loadEmails();
        setShowComposeModal(false);
        triggerConfetti();
        showToast(`Email enviado exitosamente vía ${result.provider === 'resend' ? 'Resend API' : 'SMTP'}.`, 'success');
        
        // Reset form
        setSubject('');
        setBodyText('');
      } else {
        showToast(result.message || 'No se pudo enviar el correo.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error al enviar email.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: TrackedEmailRecord['status']) => {
    switch (status) {
      case 'opened':
      case 'clicked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Eye className="w-2.5 h-2.5" />
            Abierto
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Entregado
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Send className="w-2.5 h-2.5" />
            Enviado
          </span>
        );
      case 'bounced':
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-2.5 h-2.5" />
            Rebotado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-2.5 h-2.5" />
            En cola
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090F1E] p-4 text-[var(--text-primary,#0f172a)] dark:text-slate-200 shadow-md font-['Inter',sans-serif]">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-1.5">
              <span>Emails Transaccionales</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-sky-400 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                Resend API
              </span>
            </h4>
            <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
              Seguimiento de entrega y apertura en tiempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowAnalyticsModal(true)}
            className="px-2 py-1 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Ver métricas de entrega, apertura y clics (Recharts)"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Métricas</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTemplatesModal(true)}
            className="px-2 py-1 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-purple-400 hover:text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Diseñar y gestionar plantillas con editor WYSIWYG"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plantillas</span>
          </button>

          <button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 hover:bg-slate-800 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 text-xs transition-colors cursor-pointer"
            title="Sincronizar estado con Resend API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
          <button
            onClick={() => {
              if (defaultRecipient) setToEmail(defaultRecipient);
              handleApplyTemplate('presupuesto');
              setShowComposeModal(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enviar Email</span>
          </button>
        </div>
      </div>

      {/* Email Status Timeline List */}
      {emails.length === 0 ? (
        <div className="py-6 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 rounded-lg">
          <Mail className="w-6 h-6 mx-auto text-[var(--text-secondary)] mb-1.5 opacity-60" />
          <p>No hay correos transaccionales registrados para este registro.</p>
          <button
            onClick={() => {
              if (defaultRecipient) setToEmail(defaultRecipient);
              handleApplyTemplate('presupuesto');
              setShowComposeModal(true);
            }}
            className="mt-2 text-blue-400 hover:underline text-[11px] font-semibold"
          >
            Enviar primer correo con Resend
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {emails.map((email) => (
            <div
              key={email.id}
              className="p-2.5 rounded-lg bg-slate-900/80 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 border-[var(--border-subtle,#e2e8f0)] dark:hover:border-slate-700 transition-all flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white truncate max-w-[200px]" title={email.subject}>
                    {email.subject}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
                    {email.to.join(', ')}
                  </span>
                </div>
                <div>{getStatusBadge(email.status)}</div>
              </div>

              <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 line-clamp-1">
                {email.bodySnippet}
              </p>

              <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/60 font-mono">
                <span>
                  {new Date(email.createdAt).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Proveedor: {email.provider.toUpperCase()} ({email.id.substring(0, 10)})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compose Transactional Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090F1E] border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 p-6 text-[var(--text-primary,#0f172a)] dark:text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                  Redactar Email Transaccional (Resend API)
                </h3>
              </div>
              <button
                onClick={() => setShowComposeModal(false)}
                className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            {/* Template Selector Quick Pills */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Plantillas Rápidas
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('presupuesto')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${ selectedTemplate === 'presupuesto' ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'bg-slate-900 text-[var(--text-muted,#64748b)] dark:text-slate-400 border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                >
                  Presupuesto Comercial
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('factura')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${ selectedTemplate === 'factura' ? 'bg-sky-600/20 text-sky-400 border-sky-500/40' : 'bg-slate-900 text-[var(--text-muted,#64748b)] dark:text-slate-400 border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                >
                  Factura AFIP CAE
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('seguimiento')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${ selectedTemplate === 'seguimiento' ? 'bg-purple-600/20 text-purple-400 border-purple-500/40' : 'bg-slate-900 text-[var(--text-muted,#64748b)] dark:text-slate-400 border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                >
                  Seguimiento Lead
                </button>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold mb-1">Destinatario:</label>
                <input
                  type="email"
                  required
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="cliente@empresa.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold mb-1">Asunto:</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Asunto del correo"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold mb-1">Cuerpo del Mensaje:</label>
                <textarea
                  required
                  rows={6}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Escriba el contenido del mensaje..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Salida certificada con Resend API
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowComposeModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:bg-slate-800 font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Enviando...' : 'Enviar Ahora'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: MailAnalyticsPanel (Recharts) */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090F1E] border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 p-6 shadow-2xl text-[var(--text-primary,#0f172a)] dark:text-slate-200 custom-scrollbar">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary,#0f172a)] dark:text-white">
                    Panel de Rendimiento & Analítica de Correo (Recharts)
                  </h3>
                  <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Tasas de entrega, apertura y clics (CTR) en tiempo real
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAnalyticsModal(false)}
                className="p-2 rounded-xl text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <MailAnalyticsPanel
              onSendTest={() => {
                setShowAnalyticsModal(false);
                setShowComposeModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal: MailTemplateEditor (WYSIWYG) */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#090F1E] border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 p-6 shadow-2xl text-[var(--text-primary,#0f172a)] dark:text-slate-200 custom-scrollbar">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary,#0f172a)] dark:text-white">
                    Editor de Plantillas de Correo Transaccional (WYSIWYG)
                  </h3>
                  <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Diseñá y guardá plantillas comerciales reutilizables con tokens dinámicos
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="p-2 rounded-xl text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <MailTemplateEditor
              onSelectTemplateForUse={(template) => {
                setSubject(template.subject);
                // Convert simple HTML template to plain text if needed or apply template
                setBodyText(template.htmlContent.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n\n').trim());
                setShowTemplatesModal(false);
                setShowComposeModal(true);
                showToast(`Plantilla "${template.name}" cargada en el compositor.`, 'success');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
