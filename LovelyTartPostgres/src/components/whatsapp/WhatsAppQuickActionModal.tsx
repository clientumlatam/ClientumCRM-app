import React, { useState } from 'react';
import { MessageSquare, Send, X, Sparkles, Phone, Check, Copy, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppVoiceDictationBar } from './WhatsAppVoiceDictationBar';

interface WhatsAppQuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientPhone?: string;
  companyName?: string;
  dealName?: string;
  dealAmount?: number;
  currency?: string;
  onLogActivity: (messageText: string) => void;
}

export const WhatsAppQuickActionModal: React.FC<WhatsAppQuickActionModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientPhone = '',
  companyName = '',
  dealName = '',
  dealAmount,
  currency = 'USD',
  onLogActivity,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(recipientPhone);
  const [selectedTemplate, setSelectedTemplate] = useState<'intro' | 'quote' | 'followup' | 'meeting' | 'custom'>('intro');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isVoiceDictationOpen, setIsVoiceDictationOpen] = useState(false);

  // Synchronize initial phone if it changes
  React.useEffect(() => {
    if (recipientPhone) {
      setPhoneNumber(recipientPhone);
    }
  }, [recipientPhone]);

  // Clean phone number for WhatsApp link
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '').replace(/^00/, '+');

  const getTemplateText = (template: string) => {
    const firstName = recipientName ? recipientName.split(' ')[0] : 'Estimado/a';
    const company = companyName ? ` de ${companyName}` : '';
    const deal = dealName ? `"${dealName}"` : 'tu propuesta';
    const amountStr = dealAmount ? ` por un valor de ${currency === 'ARS' ? '$' : 'US$'}${dealAmount.toLocaleString()}` : '';

    switch (template) {
      case 'intro':
        return `Hola ${firstName}! Te escribo de Clientum${company}. Quería consultarte si tienes unos minutos hoy para conversar sobre ${deal}. Saludos!`;
      case 'quote':
        return `Hola ${firstName}! Ya tenemos listo el presupuesto detallado para ${deal}${amountStr}. ¿Te gustaría que te lo comparta por aquí o coordinamos una breve videollamada para revisarlo?`;
      case 'followup':
        return `Hola ${firstName}! Espero que estés muy bien. Quería hacer un breve seguimiento sobre ${deal} para saber qué te pareció nuestra propuesta y si te quedó alguna duda técnica o comercial.`;
      case 'meeting':
        return `Hola ${firstName}! ¿Cómo estás? Te escribo para confirmar nuestra reunión agendada para revisar ${deal}. ¿Sigue en pie el horario acordado?`;
      case 'custom':
        return customMessage;
      default:
        return '';
    }
  };

  const messageToSend = selectedTemplate === 'custom' ? customMessage : getTemplateText(selectedTemplate);

  const handleSend = () => {
    if (!cleanPhone) return;
    const finalPhone = cleanPhone.startsWith('+') ? cleanPhone.replace('+', '') : cleanPhone;
    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(messageToSend)}`;
    
    // Open WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');

    // Automatically log activity to CRM
    onLogActivity(messageToSend);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageToSend);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0f1219] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293b] rounded-2xl shadow-2xl overflow-hidden text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f2638] bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
                  Contactar por WhatsApp
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Auto-Log CRM
                  </span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  {recipientName} {companyName && `(${companyName})`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1f2638] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Phone input */}
            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Número de Teléfono / WhatsApp (con código de país)</span>
                <span className="text-[10px] text-[var(--text-muted)]">Ej: +54 9 11 1234 5678</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+54 9 11 1234 5678"
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161b26] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242c40] rounded-xl pl-8 pr-3 py-2 text-[var(--text-primary,#0f172a)] dark:text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
              {!cleanPhone && (
                <p className="text-[10px] text-amber-400 mt-1">
                  * Ingrese el número telefónico para abrir WhatsApp.
                </p>
              )}
            </div>

            {/* Template Selector */}
            <div>
              <label className="text-[11px] font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300 block mb-1.5">
                Plantillas Rápidas de Venta
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'intro', label: 'Primer Contacto' },
                  { id: 'quote', label: 'Envío de Presupuesto' },
                  { id: 'followup', label: 'Seguimiento / Follow-up' },
                  { id: 'meeting', label: 'Confirmar Reunión' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id as any)}
                    className={`px-3 py-2 rounded-xl text-left border transition-all ${ selectedTemplate === tpl.id ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-semibold' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border-[var(--border-subtle,#e2e8f0)] dark:border-[#22283a] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 border-[var(--border-subtle,#e2e8f0)] dark:hover:border-[#2f384f]' }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Preview / Edit */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300 flex items-center gap-1.5">
                  <span>Mensaje a Enviar</span>
                  {selectedTemplate === 'custom' && (
                    <span className="text-[10px] text-emerald-400 font-normal">
                      (Personalizado / Dictado)
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedTemplate !== 'custom') {
                        setCustomMessage(getTemplateText(selectedTemplate));
                        setSelectedTemplate('custom');
                      }
                      setIsVoiceDictationOpen(!isVoiceDictationOpen);
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${ isVoiceDictationOpen ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }`}
                  >
                    <Mic className={`w-3 h-3 ${isVoiceDictationOpen ? 'animate-pulse text-red-400' : ''}`} />
                    <span>{isVoiceDictationOpen ? 'Cerrar Dictado' : 'Dictar por voz'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedTemplate !== 'custom') {
                        setCustomMessage(getTemplateText(selectedTemplate));
                        setSelectedTemplate('custom');
                      }
                    }}
                    className="text-[10px] text-blue-400 hover:underline"
                  >
                    Editar texto
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Voice Dictation Bar */}
              {isVoiceDictationOpen && (
                <div className="mb-2">
                  <WhatsAppVoiceDictationBar
                    onInsertText={(text, mode) => {
                      if (selectedTemplate !== 'custom') {
                        setSelectedTemplate('custom');
                      }
                      if (mode === 'replace') {
                        setCustomMessage(text);
                      } else {
                        setCustomMessage(prev => prev ? `${prev.trim()} ${text}` : text);
                      }
                      setIsVoiceDictationOpen(false);
                    }}
                    currentInputText={selectedTemplate === 'custom' ? customMessage : getTemplateText(selectedTemplate)}
                    onClose={() => setIsVoiceDictationOpen(false)}
                  />
                </div>
              )}

              {selectedTemplate === 'custom' ? (
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161b26] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242c40] rounded-xl p-3 text-[var(--text-primary,#0f172a)] dark:text-white text-xs leading-relaxed focus:border-emerald-500 focus:outline-none resize-none"
                  placeholder="Escribe o dicta tu mensaje de WhatsApp..."
                />
              ) : (
                <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536] rounded-xl p-3 text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs leading-relaxed font-sans min-h-[85px] whitespace-pre-wrap">
                  {messageToSend}
                </div>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-[11px] text-emerald-300/90 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Al hacer clic en <strong>"Abrir WhatsApp"</strong>, Clientum registrará automáticamente una actividad en la línea de tiempo del cliente y sincronizará en tiempo real en Firestore.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f2638] bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1d2333] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!cleanPhone}
              onClick={handleSend}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Abrir WhatsApp & Registrar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
