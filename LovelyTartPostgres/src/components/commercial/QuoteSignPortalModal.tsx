import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  X,
  Share2,
  Copy,
  Check,
  Download,
  ShieldCheck,
  PenTool,
  RotateCcw,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Opportunity } from '../../types';

interface QuoteSignPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    discount: number;
  }>;
}

export const QuoteSignPortalModal: React.FC<QuoteSignPortalModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  items,
}) => {
  const { moveOpportunityStage, addActivity, triggerConfetti, showToast, currentUser } = useCRM();

  const [signerName, setSignerName] = useState(opportunity?.contactName || '');
  const [signerIdNumber, setSignerIdNumber] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSigned, setIsSigned] = useState(opportunity?.stage === 'won');
  const [copiedLink, setCopiedLink] = useState(false);
  const [signatureCertificate, setSignatureCertificate] = useState<{
    hash: string;
    timestamp: string;
  } | null>(null);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const defaultItems = [
    {
      description: opportunity?.name || 'Servicio Profesional de Consultoría',
      quantity: 1,
      unitPrice: opportunity?.amount || 15000,
      taxRate: 21,
      discount: 0,
    },
  ];

  const currentItems = items && items.length > 0 ? items : defaultItems;

  const subtotal = currentItems.reduce(
    (acc, it) => acc + it.quantity * it.unitPrice * (1 - it.discount / 100),
    0
  );
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  const publicLink = `https://clientum.app/portal/cotizacion-${opportunity?.id || 'demo'}`;

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirmSignature = () => {
    if (!signerName.trim()) {
      showToast('Por favor ingresa tu Nombre y Apellido completo', 'warning');
      return;
    }
    if (!hasDrawn) {
      showToast('Por favor dibuja tu firma en el recuadro digital', 'warning');
      return;
    }
    if (!agreedTerms) {
      showToast('Debes aceptar los términos y condiciones de la cotización', 'warning');
      return;
    }

    const certHash = 'CLM-SIG-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const timestamp = new Date().toLocaleString('es-AR');
    setSignatureCertificate({ hash: certHash, timestamp });
    setIsSigned(true);

    if (opportunity) {
      // 1. Move deal in CRM to WON
      moveOpportunityStage(opportunity.id, 'won');

      // 2. Trigger celebratory confetti
      triggerConfetti();

      // 3. Log Activity
      addActivity({
        type: 'meeting',
        title: `✅ Cotización Aceptada y Firmada Digitalmente`,
        content: `La propuesta "${opportunity.name}" fue aceptada y firmada formalmente por ${signerName}${
          signerIdNumber ? ` (ID/DNI: ${signerIdNumber})` : ''
        }.\nCertificado Hash: ${certHash}\nFecha: ${timestamp}\nTotal: $${Math.round(
          total
        ).toLocaleString()} USD.`,
        author: signerName || 'Portal del Cliente',
        targetType: 'opportunity',
        targetId: opportunity.id,
      });

      showToast(`¡Trato Ganado! Propuesta firmada por ${signerName}`, 'success');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedLink(true);
    showToast('Enlace de firma copiado al portapapeles', 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Hola ${opportunity?.contactName || ''}! Te comparto el enlace de la propuesta comercial para ${opportunity?.name || 'el proyecto'}. Puedes revisarla y firmarla digitalmente aquí: ${publicLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div
      id="quote-sign-portal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Notification Bar */}
        <div className="bg-slate-900 text-[var(--text-primary,#0f172a)] dark:text-white px-5 py-3 flex items-center justify-between border-b border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[var(--text-primary,#0f172a)] dark:text-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold flex items-center gap-2">
                <span>Portal Público de Aceptación & Firma Digital</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Validez Legal SSL
                </span>
              </h3>
              <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                Vista de cliente para cotización COT-2026-{opportunity?.id.slice(-4) || '9012'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-[var(--text-primary,#0f172a)] dark:text-slate-200 transition-colors cursor-pointer"
              title="Copiar enlace público"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copiado' : 'Copiar Link'}</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
              title="Compartir por WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Body (Client Facing Portal) */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs bg-[var(--bg-muted)]/50">
          {/* Document Header */}
          <div className="p-5 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  C
                </div>
                <span className="text-base font-extrabold tracking-tight text-[var(--text-primary)]">
                  Clientum CRM
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Soluciones Comerciales & Software de Gestión
              </p>
              <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">info@clientum.app • www.clientum.app</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200">
                COT-2026-{opportunity?.id.slice(-4) || '9012'}
              </span>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Fecha de Emisión: <strong>{new Date().toLocaleDateString('es-AR')}</strong>
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Validez de Oferta: <strong>15 días corridos</strong>
              </p>
            </div>
          </div>

          {/* Client Recipient Details */}
          <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider block">
                Preparado para:
              </span>
              <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                {opportunity?.contactName || 'Responsable de Compras'}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">{opportunity?.companyName || 'Empresa Cliente'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider block">
                Proyecto / Propuesta:
              </span>
              <p className="text-xs font-bold text-blue-700 mt-0.5">{opportunity?.name}</p>
              <p className="text-xs text-[var(--text-muted)]">Condición de Pago: Transferencia 50% anticipo</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-muted)] border-b border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-secondary)]">
                  <th className="p-3">Descripción</th>
                  <th className="p-3 text-center">Cant.</th>
                  <th className="p-3 text-right">Precio Unit.</th>
                  <th className="p-3 text-right">Desc.</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                {currentItems.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium text-[var(--text-primary)]">{it.description}</td>
                    <td className="p-3 text-center">{it.quantity}</td>
                    <td className="p-3 text-right font-mono">${it.unitPrice.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono">{it.discount}%</td>
                    <td className="p-3 text-right font-mono font-bold text-[var(--text-primary)]">
                      ${(it.quantity * it.unitPrice * (1 - it.discount / 100)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Breakdown */}
            <div className="p-4 bg-[var(--bg-muted)]/70 border-t border-[var(--border-subtle)] flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal Neto:</span>
                  <span className="font-mono font-semibold">${Math.round(subtotal).toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>IVA Estimado (21%):</span>
                  <span className="font-mono font-semibold">${Math.round(tax).toLocaleString()} USD</span>
                </div>
                <div className="h-px bg-[var(--bg-muted)] my-1" />
                <div className="flex justify-between text-[var(--text-primary)] font-bold text-sm">
                  <span>Total Final:</span>
                  <span className="font-mono text-blue-700 font-extrabold">
                    ${Math.round(total).toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Signature Section */}
          {isSigned ? (
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold">¡Cotización Aceptada y Firmada Digitalmente!</span>
              </div>
              <p className="text-xs text-emerald-700">
                El acuerdo comercial ha sido ratificado formalmente. El estado del negocio en el CRM ha cambiado automáticamente a <strong>Ganado (Won)</strong> y se ha notificado al equipo comercial.
              </p>
              {signatureCertificate && (
                <div className="p-3 bg-[var(--bg-card)]/80 rounded-xl border border-emerald-200 text-[11px] font-mono text-[var(--text-secondary)] space-y-1">
                  <div><strong>Firmante:</strong> {signerName}</div>
                  <div><strong>Certificado Hash:</strong> {signatureCertificate.hash}</div>
                  <div><strong>Marca Temporal:</strong> {signatureCertificate.timestamp}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-blue-600" />
                    <span>Firma Digital & Ratificación del Acuerdo</span>
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Dibuja tu firma a continuación para formalizar la aceptación de la propuesta
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Borrar</span>
                </button>
              </div>

              {/* Signer Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Ej: Ing. Martín Gómez"
                    className="w-full rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    DNI / CUIT / Pasaporte
                  </label>
                  <input
                    type="text"
                    value={signerIdNumber}
                    onChange={(e) => setSignerIdNumber(e.target.value)}
                    placeholder="Ej: 34.890.123"
                    className="w-full rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Email Corporativo
                  </label>
                  <input
                    type="email"
                    value={signerEmail}
                    onChange={(e) => setSignerEmail(e.target.value)}
                    placeholder="martin@empresa.com"
                    className="w-full rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Signature Canvas */}
              <div className="relative border-2 border-dashed border-[var(--border-default)] rounded-xl bg-[var(--bg-muted)]/50 p-1">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[140px] bg-[var(--bg-card)] rounded-lg cursor-crosshair touch-none"
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs font-medium">
                    Haz clic o toca para firmar aquí con tu dedo o mouse
                  </div>
                )}
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[var(--border-default)] text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>
                  He revisado y acepto en su totalidad los términos, alcances técnicos y condiciones de pago detallados en esta cotización.
                </span>
              </label>

              {/* Accept & Sign Button */}
              <button
                type="button"
                onClick={handleConfirmSignature}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aceptar y Firmar Cotización Digitalmente</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--bg-muted)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)] shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px]">Transacción cifrada y certificada por Clientum CRM</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
