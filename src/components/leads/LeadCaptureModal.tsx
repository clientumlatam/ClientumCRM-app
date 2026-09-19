import React, { useState } from 'react';
import { Sparkles, X, Globe, Copy, Check, Send, User, Mail, Phone, Building2, DollarSign, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCRM } from '../../context/CRMContext';
import { STAGES } from '../../data/initialData';
import { StageId } from '../../types';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose }) => {
  const { addPerson, addOpportunity, showToast, triggerConfetti } = useCRM();

  const [activeTab, setActiveTab] = useState<'form' | 'embed'>('form');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [dealTitle, setDealTitle] = useState('');
  const [budget, setBudget] = useState('1500');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/lead-form` : 'https://clientum.com.ar/lead-form';
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0" style="border:none;border-radius:12px;overflow:hidden;"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email) {
      showToast('Por favor ingrese al menos nombre y correo', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create Person
      addPerson({
        firstName,
        lastName: lastName || '-',
        email,
        phone,
        companyName: companyName || 'Lead Web',
        jobTitle: 'Prospecto Web',
        status: 'Lead',
        assignedTo: 'clientumlatam@gmail.com',
      });

      // 2. Create Opportunity in first stage
      const firstStage: StageId = STAGES[0]?.id || 'lead';
      addOpportunity({
        name: dealTitle || `Interés de ${firstName} ${lastName}`,
        amount: Number(budget) || 1000,
        currency: 'ARS',
        stage: firstStage,
        probability: 20,
        closeDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedTo: 'clientumlatam@gmail.com',
        priority: 'High',
        type: 'New Business',
        contactName: `${firstName} ${lastName}`.trim(),
        companyName: companyName || 'Lead Web',
        tags: ['Lead Web', 'Inbound'],
      });

      triggerConfetti();
      showToast('¡Lead capturado e ingresado al embudo de ventas!', 'success');

      // Reset
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setCompanyName('');
      setDealTitle('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Error al registrar el lead', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e111a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20273a] rounded-2xl shadow-2xl overflow-hidden text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c2233] bg-[var(--bg-card,#ffffff)] dark:bg-[#121623] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
                  Captura Automática de Leads
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                    Web & Enlace
                  </span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  Ingreso directo al primer paso de tu pipeline de ventas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1c2233] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c2233] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10131e] px-4">
            <button
              onClick={() => setActiveTab('form')}
              className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${ activeTab === 'form' ? 'border-blue-500 text-[var(--text-primary,#0f172a)] dark:text-white font-semibold' : 'border-transparent text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              Probar Formulario
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${ activeTab === 'embed' ? 'border-blue-500 text-[var(--text-primary,#0f172a)] dark:text-white font-semibold' : 'border-transparent text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              Enlace Público & Código Embed
            </button>
          </div>

          <div className="p-5 max-h-[75vh] overflow-y-auto">
            {activeTab === 'form' ? (
              <form onSubmit={handleSubmitLead} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Nombre *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Martín"
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] rounded-xl pl-8 pr-3 py-2 text-[var(--text-primary,#0f172a)] dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Apellido</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Gómez"
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] rounded-xl px-3 py-2 text-[var(--text-primary,#0f172a)] dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Email *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mgomez@empresa.com"
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] rounded-xl pl-8 pr-3 py-2 text-[var(--text-primary,#0f172a)] dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Teléfono / WhatsApp</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+54 9 11 9876 5432"
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] rounded-xl pl-8 pr-3 py-2 text-[var(--text-primary,#0f172a)] dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Empresa</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Distribuidora del Sur"
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] rounded-xl pl-8 pr-3 py-2 text-[var(--text-primary,#0f172a)] dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Presupuesto Estimado ($)</label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="1500"
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] rounded-xl pl-8 pr-3 py-2 text-[var(--text-primary,#0f172a)] dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Proyecto o Servicio Solicitado</label>
                  <input
                    type="text"
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    placeholder="Implementación CRM + Automatización WhatsApp"
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] rounded-xl px-3 py-2 text-[var(--text-primary,#0f172a)] dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/30 text-[11px] text-blue-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    El lead se creará de forma instantánea en tu embudo Kanban y se sincronizará automáticamente en Firestore.
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#181d2c] transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Guardando...' : 'Capturar Lead Ahora'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Public link */}
                <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#131724] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20273a] space-y-2">
                  <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center justify-between">
                    <span>1. Enlace Directo (Para link en bio de Instagram, WhatsApp o Web)</span>
                    <button
                      onClick={handleCopyLink}
                      className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedLink ? 'Copiado' : 'Copiar enlace'}
                    </button>
                  </h4>
                  <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e16] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b2234] rounded-lg p-2.5 font-mono text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[11px] break-all">
                    {publicUrl}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Cualquier persona que entre a este enlace podrá enviarte sus datos directamente sin necesidad de iniciar sesión.
                  </p>
                </div>

                {/* Embed code */}
                <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#131724] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20273a] space-y-2">
                  <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center justify-between">
                    <span>2. Código HTML Embed (Para insertar en WordPress, Webflow o tu web)</span>
                    <button
                      onClick={handleCopyEmbed}
                      className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      {copiedEmbed ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedEmbed ? 'Copiado' : 'Copiar código iframe'}
                    </button>
                  </h4>
                  <textarea
                    readOnly
                    rows={3}
                    value={embedCode}
                    className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e16] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b2234] rounded-lg p-2.5 font-mono text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[11px] resize-none focus:outline-none"
                  />
                  <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Pega este bloque en cualquier página web para tener tu formulario 100% conectado a Clientum.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
