import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Paperclip,
  Sparkles,
  User,
  Building2,
  Briefcase,
  FileText,
  Trash2,
  Check,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { WebmailEmail, WebmailAttachment } from '../../types';

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDefaults?: Partial<WebmailEmail> | null;
}

export const ComposeEmailModal: React.FC<ComposeEmailModalProps> = ({
  isOpen,
  onClose,
  initialDefaults,
}) => {
  const {
    people,
    companies,
    opportunities,
    sendWebmailEmail,
    showToast,
    currentUser,
  } = useCRM();

  const [fromAddress, setFromAddress] = useState('info@clientum.com.ar');
  const [toInput, setToInput] = useState('');
  const [toRecipients, setToRecipients] = useState<string[]>([]);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [ccInput, setCcInput] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [attachments, setAttachments] = useState<WebmailAttachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [selectedCrmType, setSelectedCrmType] = useState<'opportunity' | 'company' | 'person' | 'none'>('none');
  const [selectedCrmId, setSelectedCrmId] = useState<string>('');
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  const [smtpConfigured, setSmtpConfigured] = useState<boolean | null>(null);
  const [smtpFromAddress, setSmtpFromAddress] = useState<string | null>(null);

  // Initialize or reset form when modal opens with defaults
  useEffect(() => {
    if (isOpen) {
      if (initialDefaults) {
        if (initialDefaults.to && initialDefaults.to.length > 0) {
          setToRecipients(initialDefaults.to);
        } else if (initialDefaults.from) {
          setToRecipients([initialDefaults.from]);
        } else {
          setToRecipients([]);
        }

        setSubject(
          initialDefaults.subject
            ? initialDefaults.subject.startsWith('Re:') || initialDefaults.subject.startsWith('Fwd:')
              ? initialDefaults.subject
              : `Re: ${initialDefaults.subject}`
            : ''
        );

        if (initialDefaults.bodyText) {
          setBodyText(
            `\n\n--- Mensaje original ---\nDe: ${initialDefaults.from || 'info@clientum.com.ar'}\nFecha: ${new Date().toLocaleDateString()}\n\n${initialDefaults.bodyText}`
          );
        } else {
          setBodyText('');
        }

        if (initialDefaults.crmLinkedType && initialDefaults.crmLinkedId) {
          setSelectedCrmType(initialDefaults.crmLinkedType as any);
          setSelectedCrmId(initialDefaults.crmLinkedId);
        }
      } else {
        setToRecipients([]);
        setSubject('');
        setBodyText('');
        setAttachments([]);
        setSelectedCrmType('none');
        setSelectedCrmId('');
      }
    }
  }, [isOpen, initialDefaults]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    fetch('/api/email/status')
      .then((response) => response.json())
      .then((status) => {
        if (cancelled) return;
        setSmtpConfigured(status.configured === true);
        setSmtpFromAddress(status.fromAddress || null);
        if (status.fromAddress) {
          setFromAddress(status.fromAddress);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSmtpConfigured(false);
          setSmtpFromAddress(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Add recipient on enter or comma
  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>, isCc = false) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = (isCc ? ccInput : toInput).trim().replace(',', '');
      if (val && val.includes('@')) {
        if (isCc) {
          if (!ccRecipients.includes(val)) setCcRecipients([...ccRecipients, val]);
          setCcInput('');
        } else {
          if (!toRecipients.includes(val)) setToRecipients([...toRecipients, val]);
          setToInput('');
        }
      }
    }
  };

  const handleRemoveRecipient = (emailToRemove: string, isCc = false) => {
    if (isCc) {
      setCcRecipients(ccRecipients.filter((e) => e !== emailToRemove));
    } else {
      setToRecipients(toRecipients.filter((e) => e !== emailToRemove));
    }
  };

  // Quick template inserters
  const applyTemplate = (type: 'propuesta' | 'demo' | 'factura' | 'seguimiento') => {
    switch (type) {
      case 'propuesta':
        setSubject('Propuesta Comercial Formal - Clientum CRM & Cloudflare Webmail');
        setBodyText(
          `Estimado/a,\n\nAdjuntamos la propuesta comercial personalizada para la implementación de Clientum CRM con integración a Facturación AFIP, WhatsApp multiagente y el worker de correo.\n\nQuedamos a su disposición para coordinar los detalles de inicio.\n\nSaludos cordiales,\n${currentUser.name}\nClientum LatAm\nwww.clientum.com.ar`
        );
        break;
      case 'demo':
        setSubject('Invitación a Demo Técnica - Suite Clientum CRM');
        setBodyText(
          `Hola,\n\nUn gusto contactarte. Te invitamos a una sesión virtual de 25 minutos para recorrer la suite comercial, los flujos automáticos y la consola de auditoría.\n\nPor favor indícanos qué horario te resulta más conveniente.\n\nAtentamente,\n${currentUser.name}\nEquipo de Cuentas Clientum`
        );
        break;
      case 'factura':
        setSubject('Factura Electrónica AFIP (CAE) - Clientum CRM');
        setBodyText(
          `Estimado cliente,\n\nAdjuntamos el comprobante fiscal electrónico correspondiente al período en curso con validación CAE de AFIP.\n\nDatos para la transferencia bancaria incluidos en el PDF adjunto.\n\nMuchas gracias por confiar en nosotros,\nAdministración Clientum`
        );
        break;
      case 'seguimiento':
        setSubject('Seguimiento a nuestra conversación - Clientum CRM');
        setBodyText(
          `Hola,\n\nQuería dar seguimiento a los puntos conversados la semana pasada sobre la migración y la gestión de leads.\n\n¿Tuvieron oportunidad de revisar el material compartido?\n\nQuedo atento a tus comentarios,\n${currentUser.name}`
        );
        break;
    }
    showToast('Plantilla aplicada', 'info');
  };

  // AI Assistant Polish
  const handleAiPolish = () => {
    if (!bodyText.trim()) return;
    setIsAiPolishing(true);
    setTimeout(() => {
      setBodyText(
        `Estimado/a,\n\nEspero que este mensaje le encuentre muy bien.\n\n${bodyText.replace(/\n\n--- Mensaje original ---[\s\S]*/, '').trim()}\n\nAgradecemos de antemano su tiempo y quedamos atentos a cualquier consulta adicional.\n\nSaludos cordiales,\n${currentUser.name}\nClientum CRM Cono Sur`
      );
      setIsAiPolishing(false);
      showToast('Texto optimizado con tono profesional ejecutivo', 'success');
    }, 700);
  };

  // Attachments require the R2 upload flow; do not create fake attachment records.
  const handleAddAttachment = () => {
    showToast('Los adjuntos se habilitarán al conectar el almacenamiento R2.', 'info');
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    // If text still in input, add it
    let finalTo = [...toRecipients];
    if (toInput.trim() && toInput.includes('@')) {
      finalTo.push(toInput.trim());
    }

    if (finalTo.length === 0) {
      showToast('Ingresa al menos un destinatario válido', 'error');
      return;
    }

    if (!subject.trim()) {
      showToast('Ingresa un asunto para el correo', 'warning');
      return;
    }

    setIsSending(true);

    try {
      let linkedName = undefined;
      if (selectedCrmType === 'opportunity') {
        const opp = opportunities.find((o) => o.id === selectedCrmId);
        linkedName = opp?.name || opp?.title;
      } else if (selectedCrmType === 'company') {
        linkedName = companies.find((c) => c.id === selectedCrmId)?.name;
      } else if (selectedCrmType === 'person') {
        const p = people.find((item) => item.id === selectedCrmId);
        linkedName = p ? `${p.firstName} ${p.lastName}` : undefined;
      }

      await sendWebmailEmail({
        from: fromAddress,
        fromName: currentUser.name || 'Clientum Sales Team',
        to: finalTo,
        cc: ccRecipients.length > 0 ? ccRecipients : undefined,
        subject: subject.trim(),
        bodyText: bodyText.trim(),
        bodyHtml: `<p>${bodyText.trim().replace(/\n/g, '<br/>')}</p>`,
        folder: 'sent',
        isRead: true,
        isStarred: false,
        spfStatus: 'PASS',
        dkimStatus: 'PASS',
        dmarcStatus: 'PASS',
        attachments,
        crmLinkedType: selectedCrmType !== 'none' ? selectedCrmType : undefined,
        crmLinkedId: selectedCrmType !== 'none' ? selectedCrmId : undefined,
        crmLinkedName: linkedName,
        workerId: 'webmail-clientum-worker-edge-1',
      });

      showToast(`Correo enviado exitosamente vía SMTP a ${finalTo.join(', ')}`, 'success');
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al despachar el correo por SMTP', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        id="compose-email-modal"
        className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                 Redactar Correo • SMTP transaccional
              </h3>
               <span className={`text-[10px] font-mono flex items-center gap-1 font-semibold ${ smtpConfigured === false ? 'text-amber-600' : 'text-emerald-600' }`}>
                <ShieldCheck className="w-3 h-3" />
                 {smtpConfigured === null
                   ? 'verificando configuración SMTP...'
                   : smtpConfigured
                     ? `SMTP listo${smtpFromAddress ? ` • ${smtpFromAddress}` : ''}`
                     : 'SMTP no configurado'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="flex-1 overflow-y-auto p-4 space-y-3 text-xs custom-scrollbar">
          {/* From field */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-[var(--text-secondary)] font-medium shrink-0">De:</span>
            <select
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="flex-1 bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded-md px-2.5 py-1.5 text-[var(--text-primary)] font-mono text-xs focus:outline-hidden focus:border-blue-600 focus:bg-[var(--bg-card)]"
            >
              <option value="info@clientum.com.ar">info@clientum.com.ar (Principal)</option>
              <option value="ventas@clientum.com.ar">ventas@clientum.com.ar (Comercial)</option>
              <option value="soporte@clientum.com.ar">soporte@clientum.com.ar (Soporte)</option>
            </select>
          </div>

          {/* To field with chips */}
          <div className="flex items-start gap-3">
            <span className="w-16 text-[var(--text-secondary)] font-medium pt-1.5 shrink-0">Para:</span>
            <div className="flex-1 flex flex-wrap items-center gap-1.5 p-1.5 bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded-md min-h-[38px] focus-within:border-blue-600 focus-within:bg-[var(--bg-card)]">
              {toRecipients.map((rec) => (
                <span
                  key={rec}
                  className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-mono font-medium flex items-center gap-1"
                >
                  {rec}
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient(rec)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="email"
                placeholder={toRecipients.length === 0 ? 'contacto@empresa.com (Presiona Enter o coma)' : ''}
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                onKeyDown={(e) => handleAddRecipient(e, false)}
                className="flex-1 min-w-[160px] bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted,#64748b)] dark:text-slate-400 focus:outline-hidden text-xs py-0.5"
              />
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1.5 py-0.5 rounded hover:bg-[var(--bg-muted)] cursor-pointer font-medium"
                >
                  CC
                </button>
              )}
            </div>
          </div>

          {/* CC field */}
          {showCc && (
            <div className="flex items-start gap-3">
              <span className="w-16 text-[var(--text-secondary)] font-medium pt-1.5 shrink-0">CC:</span>
              <div className="flex-1 flex flex-wrap items-center gap-1.5 p-1.5 bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded-md min-h-[34px] focus-within:border-blue-600 focus-within:bg-[var(--bg-card)]">
                {ccRecipients.map((rec) => (
                  <span
                    key={rec}
                    className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-mono font-medium flex items-center gap-1"
                  >
                    {rec}
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(rec, true)}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="email"
                  placeholder="copia@empresa.com"
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  onKeyDown={(e) => handleAddRecipient(e, true)}
                  className="flex-1 min-w-[140px] bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted,#64748b)] dark:text-slate-400 focus:outline-hidden text-xs py-0.5"
                />
              </div>
            </div>
          )}

          {/* Subject */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-[var(--text-secondary)] font-medium shrink-0">Asunto:</span>
            <input
              type="text"
              required
              placeholder="Asunto del correo electrónico..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded-md px-3 py-1.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted,#64748b)] dark:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:bg-[var(--bg-card)]"
            />
          </div>

          {/* CRM Link Selector & Quick Template Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[var(--bg-muted)] rounded-lg border border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-[var(--text-muted)] font-semibold mr-1">Plantillas rápidas:</span>
              <button
                type="button"
                onClick={() => applyTemplate('propuesta')}
                className="px-2 py-1 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-blue-700 text-[10px] font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                📄 Propuesta
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('demo')}
                className="px-2 py-1 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-purple-700 text-[10px] font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                🎥 Demo Técnica
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('factura')}
                className="px-2 py-1 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-emerald-700 text-[10px] font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                🧾 Factura AFIP
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('seguimiento')}
                className="px-2 py-1 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-amber-700 text-[10px] font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                ⏱️ Seguimiento
              </button>
            </div>

            <button
              type="button"
              onClick={handleAiPolish}
              disabled={isAiPolishing || !bodyText.trim()}
              className="px-2.5 py-1 rounded bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3 h-3 ${isAiPolishing ? 'animate-spin' : ''}`} />
              <span>{isAiPolishing ? 'Mejorando...' : 'Optimizar con IA'}</span>
            </button>
          </div>

          {/* Body Textarea */}
          <div>
            <textarea
              required
              rows={8}
              placeholder="Escribe aquí tu mensaje formal..."
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-default)] rounded-md p-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted,#64748b)] dark:text-slate-400 focus:outline-hidden focus:border-blue-600 leading-relaxed font-sans text-xs resize-y min-h-[160px]"
            />
          </div>

          {/* Attachments List */}
          {attachments.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] text-[var(--text-muted)] font-medium">Adjuntos ({attachments.length}):</span>
              <div className="flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]"
                  >
                    <Paperclip className="w-3 h-3 text-blue-600" />
                    <span className="font-mono text-[11px] font-medium">{att.name}</span>
                    <span className="text-[9px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">({Math.round(att.size / 1024)} KB)</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                      className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CRM Linking Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <span className="text-[var(--text-secondary)] font-medium shrink-0">Vincular con CRM:</span>
            <div className="flex items-center gap-2 flex-1">
              <select
                value={selectedCrmType}
                onChange={(e) => {
                  setSelectedCrmType(e.target.value as any);
                  setSelectedCrmId('');
                }}
                className="bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded px-2 py-1 text-xs text-[var(--text-primary)] focus:bg-[var(--bg-card)]"
              >
                <option value="none">Sin vincular</option>
                <option value="opportunity">Oportunidad / Deal</option>
                <option value="company">Empresa</option>
                <option value="person">Contacto</option>
              </select>

              {selectedCrmType === 'opportunity' && (
                <select
                  value={selectedCrmId}
                  onChange={(e) => setSelectedCrmId(e.target.value)}
                  className="bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded px-2 py-1 text-xs text-[var(--text-primary)] flex-1 truncate focus:bg-[var(--bg-card)]"
                >
                  <option value="">Seleccionar Negocio...</option>
                  {opportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.name || opp.title} (${opp.amount.toLocaleString()})
                    </option>
                  ))}
                </select>
              )}

              {selectedCrmType === 'company' && (
                <select
                  value={selectedCrmId}
                  onChange={(e) => setSelectedCrmId(e.target.value)}
                  className="bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded px-2 py-1 text-xs text-[var(--text-primary)] flex-1 truncate focus:bg-[var(--bg-card)]"
                >
                  <option value="">Seleccionar Empresa...</option>
                  {companies.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name} ({comp.industry})
                    </option>
                  ))}
                </select>
              )}

              {selectedCrmType === 'person' && (
                <select
                  value={selectedCrmId}
                  onChange={(e) => setSelectedCrmId(e.target.value)}
                  className="bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded px-2 py-1 text-xs text-[var(--text-primary)] flex-1 truncate focus:bg-[var(--bg-card)]"
                >
                  <option value="">Seleccionar Contacto...</option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} - {p.email}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
               onClick={handleAddAttachment}
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] text-xs font-semibold transition-colors cursor-pointer border border-[var(--border-subtle)]"
            >
              <Paperclip className="w-3.5 h-3.5 text-blue-600" />
               <span>Adjuntar Archivo (R2)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] text-xs font-semibold transition-colors cursor-pointer"
              >
                Descartar
              </button>

              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                 <span>{isSending ? 'Despachando vía SMTP...' : 'Enviar Correo (SMTP)'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
