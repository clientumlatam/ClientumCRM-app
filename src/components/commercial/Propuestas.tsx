import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Send,
  Printer,
  CheckCircle2,
  Copy,
  Sparkles,
  Calendar,
  Building2,
  User,
  DollarSign,
  ShieldCheck,
  FileCheck,
  Share2,
  Eye
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { CLIENTUM_SERVICES, CLIENTUM_PLANS } from '../../data/clientumCatalog';

interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage
  ivaRate: number; // 21, 10.5, 0
}

export const Propuestas: React.FC = () => {
  const { opportunities, showToast, triggerConfetti, currency = 'ARS' } = useCRM() as any;

  const [selectedOppId, setSelectedOppId] = useState<string>('');
  const [clientName, setClientName] = useState('TechGlobal S.A.');
  const [clientEmail, setClientEmail] = useState('contacto@techglobal.com');
  const [clientPhone, setClientPhone] = useState('+54 9 11 4839-2012');
  const [proposalTitle, setProposalTitle] = useState('Propuesta Técnico-Comercial: Implementación ClientumCRM & Bot IA');
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [paymentTerms, setPaymentTerms] = useState('50% anticipo al inicio del proyecto, 50% contra entrega y capacitación del equipo.');
  const [confidentialityClause, setConfidentialityClause] = useState(
    'Toda la información compartida en esta propuesta y los datos comerciales de la empresa están protegidos bajo estricto acuerdo de confidencialidad y secreto profesional.'
  );

  const [items, setItems] = useState<ProposalItem[]>([
    {
      id: 'item-1',
      description: 'Implementación y Configuración de Pipeline Comercial Kanban y Roles',
      quantity: 1,
      unitPrice: 150000,
      discount: 10,
      ivaRate: 21
    },
    {
      id: 'item-2',
      description: 'Desarrollo de Agente Virtual WhatsApp IA con Google Gemini y Catálogo Propio',
      quantity: 1,
      unitPrice: 180000,
      discount: 0,
      ivaRate: 21
    },
    {
      id: 'item-3',
      description: 'Módulo de Facturación Electrónica AFIP (Facturas A, B, C con CAE en tiempo real)',
      quantity: 1,
      unitPrice: 120000,
      discount: 5,
      ivaRate: 21
    }
  ]);

  const [previewMode, setPreviewMode] = useState(false);

  // Auto-fill from selected CRM opportunity
  const handleSelectOpp = (oppId: string) => {
    setSelectedOppId(oppId);
    if (!oppId) return;
    const opp = opportunities.find((o: any) => o.id === oppId);
    if (opp) {
      setClientName(opp.companyName || opp.name);
      setProposalTitle(`Propuesta de Solución Comercial: ${opp.name}`);
      setItems([
        {
          id: `item-${Date.now()}`,
          description: `Servicio integral para ${opp.name}`,
          quantity: 1,
          unitPrice: opp.amount || 250000,
          discount: 0,
          ivaRate: 21
        }
      ]);
      showToast(`Datos completados desde la oportunidad "${opp.name}"`, 'info');
    }
  };

  // Pre-designed templates
  const applyTemplate = (templateName: string) => {
    if (templateName === 'crm_basico') {
      setProposalTitle('Propuesta Comercial: Puesta a Punto ClientumCRM PyME');
      setItems([
        { id: '1', description: 'Licencia Anual Plan PyME (Hasta 10 vendedores)', quantity: 1, unitPrice: 450000, discount: 15, ivaRate: 21 },
        { id: '2', description: 'Migración inicial de base de datos de clientes desde Excel', quantity: 1, unitPrice: 80000, discount: 0, ivaRate: 21 },
        { id: '3', description: 'Capacitación presencial/virtual al equipo de ventas (3 sesiones)', quantity: 1, unitPrice: 90000, discount: 0, ivaRate: 21 }
      ]);
    } else if (templateName === 'bot_ia') {
      setProposalTitle('Propuesta: Solución Conversacional WhatsApp IA 24/7');
      setItems([
        { id: '1', description: 'Entrenamiento de Modelo IA Gemini con catálogo de productos y FAQs', quantity: 1, unitPrice: 220000, discount: 10, ivaRate: 21 },
        { id: '2', description: 'Integración Oficial WhatsApp Business Multiagente con Gateway', quantity: 1, unitPrice: 140000, discount: 0, ivaRate: 21 },
        { id: '3', description: 'Soporte y Monitoreo de Conversaciones Primeros 3 Meses', quantity: 3, unitPrice: 40000, discount: 0, ivaRate: 21 }
      ]);
    } else if (templateName === 'integral') {
      setProposalTitle('Propuesta Transformación Digital B2B: CRM + AFIP + WhatsApp Bot');
      setItems([
        { id: '1', description: 'Suite Comercial Completa ClientumCRM Enterprise', quantity: 1, unitPrice: 650000, discount: 20, ivaRate: 21 },
        { id: '2', description: 'Integración Web Service AFIP para Facturación A y B con CAE', quantity: 1, unitPrice: 180000, discount: 10, ivaRate: 21 },
        { id: '3', description: 'Agente IA Autónomo para calificar prospectos y agendar demos', quantity: 1, unitPrice: 240000, discount: 0, ivaRate: 21 },
        { id: '4', description: 'Portal del Cliente Marca Blanca para consulta de comprobantes', quantity: 1, unitPrice: 160000, discount: 0, ivaRate: 21 }
      ]);
    }
    showToast(`Plantilla "${templateName}" aplicada correctamente`, 'success');
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: 'Nuevo servicio / ítem de propuesta',
        quantity: 1,
        unitPrice: 50000,
        discount: 0,
        ivaRate: 21
      }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof ProposalItem, value: any) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, [field]: value } : i)));
  };

  // Financial calculations
  const subtotalGross = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalDiscount = items.reduce((sum, item) => {
    const gross = item.quantity * item.unitPrice;
    return sum + (gross * item.discount) / 100;
  }, 0);
  const netTaxable = subtotalGross - totalDiscount;
  const totalTax = items.reduce((sum, item) => {
    const net = item.quantity * item.unitPrice * (1 - item.discount / 100);
    return sum + (net * item.ivaRate) / 100;
  }, 0);
  const grandTotal = netTaxable + totalTax;

  const handlePrintPDF = () => {
    if (!previewMode) {
      setPreviewMode(true);
      setTimeout(() => {
        window.print();
      }, 250);
    } else {
      window.print();
    }
  };

  const handleShareWhatsApp = () => {
    const cleanPhone = clientPhone.replace(/\D/g, '');
    const message = `*${proposalTitle}*\nEstimado/a ${clientName},\nAdjuntamos el resumen de la propuesta técnico-comercial preparada para su empresa.\n\n*Total de la inversión:* $ ${Math.round(grandTotal).toLocaleString('es-AR')} (IVA incluido).\n*Términos de pago:* ${paymentTerms}\n*Validez hasta:* ${validUntil}\n\nQuedamos a disposición para coordinar el inicio. Saludos cordiales,\n*Equipo Comercial Clientum Latam*`;
    const url = `https://wa.me/${cleanPhone || '542984510883'}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    triggerConfetti();
    showToast('Enlace de WhatsApp generado con la propuesta', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Módulo Comercial 2.3
            </span>
            <h1 className="text-xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Cotizador & Generador de Propuestas
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
            Diseña presupuestos técnico-comerciales con membrete oficial, cálculo automático de IVA y exportación directa a PDF o WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3.5 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a2133] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222b40] text-[var(--text-primary,#0f172a)] dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>{previewMode ? 'Volver a Edición' : 'Vista Previa Formal'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            <Share2 className="w-4 h-4" />
            <span>Enviar por WhatsApp</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {!previewMode ? (
        /* Edit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Templates Bar */}
            <div className="p-4 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e1320] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Plantillas Rápidas Prediseñadas
                </span>
                <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Haz clic para cargar ítems estándar</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('crm_basico')}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141c2e] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a253e] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22304d] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  🚀 Implementación CRM PyME
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('bot_ia')}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141c2e] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a253e] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22304d] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  🤖 Chatbot WhatsApp IA 24/7
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('integral')}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141c2e] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a253e] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22304d] text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  💼 Suite Integral (CRM + AFIP + IA)
                </button>
              </div>
            </div>

            {/* General Info Card */}
            <div className="p-5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c101a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#182133] space-y-4">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">1. Datos del Cliente & Encabezado</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Vincular con Oportunidad CRM</label>
                  <select
                    value={selectedOppId}
                    onChange={(e) => handleSelectOpp(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] rounded-lg px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                  >
                    <option value="">Seleccionar oportunidad existente...</option>
                    {opportunities.map((opp: any) => (
                      <option key={opp.id} value={opp.id}>
                        {opp.name} ({opp.companyName || 'Sin empresa'}) - ${opp.amount?.toLocaleString('es-AR')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Título de la Propuesta</label>
                  <input
                    type="text"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] rounded-lg px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Cliente / Empresa</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] rounded-lg px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Email de Contacto</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] rounded-lg px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] rounded-lg px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Vigencia hasta</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] rounded-lg px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="p-5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c101a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#182133] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">2. Desglose de Servicios & Precios</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Ítem</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => {
                  const gross = item.quantity * item.unitPrice;
                  const discountAmount = (gross * item.discount) / 100;
                  const net = gross - discountAmount;
                  const tax = (net * item.ivaRate) / 100;
                  const lineTotal = net + tax;

                  return (
                    <div key={item.id} className="p-3 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#111624] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c263c] space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-1">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Descripción del entregable o servicio..."
                          className="flex-1 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e18] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b] rounded px-2.5 py-1.5 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px]">
                        <div>
                          <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-0.5">Cant.</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                            className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e18] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b] rounded px-2 py-1 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-0.5">Precio Unit. ($)</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                            className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e18] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b] rounded px-2 py-1 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-0.5">Desc. (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, 'discount', Number(e.target.value))}
                            className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e18] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b] rounded px-2 py-1 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-0.5">IVA AFIP</label>
                          <select
                            value={item.ivaRate}
                            onChange={(e) => updateItem(item.id, 'ivaRate', Number(e.target.value))}
                            className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e18] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b] rounded px-2 py-1 text-xs text-[var(--text-primary,#0f172a)] dark:text-white"
                          >
                            <option value="21">21.0% (General)</option>
                            <option value="10.5">10.5% (Reducido)</option>
                            <option value="0">0% (Exento)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-0.5">Total Línea</label>
                          <div className="font-bold text-cyan-400 py-1 text-xs">
                            $ {Math.round(lineTotal).toLocaleString('es-AR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="p-5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c101a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#182133] space-y-4">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">3. Condiciones Comerciales & Cláusulas</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Condiciones de Pago</label>
                  <textarea
                    rows={2}
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] rounded-lg px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white resize-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Cláusula de Confidencialidad & Propiedad</label>
                  <textarea
                    rows={2}
                    value={confidentialityClause}
                    onChange={(e) => setConfidentialityClause(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] rounded-lg px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Financial Summary & Actions */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e1422] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c263c] space-y-4 sticky top-6">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Resumen Económico
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  <span>Subtotal Bruto</span>
                  <span>$ {Math.round(subtotalGross).toLocaleString('es-AR')}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-medium">
                    <span>Bonificación / Descuentos</span>
                    <span>-$ {Math.round(totalDiscount).toLocaleString('es-AR')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[var(--text-secondary,#475569)] dark:text-slate-300">
                  <span>Base Imponible Neta</span>
                  <span>$ {Math.round(netTaxable).toLocaleString('es-AR')}</span>
                </div>

                <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  <span>Impuesto IVA Liquidado</span>
                  <span>$ {Math.round(totalTax).toLocaleString('es-AR')}</span>
                </div>

                <div className="border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c263c] pt-3 flex items-center justify-between text-[var(--text-primary,#0f172a)] dark:text-white font-extrabold text-base">
                  <span>Inversión Total</span>
                  <span className="text-cyan-400">$ {Math.round(grandTotal).toLocaleString('es-AR')}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className="w-full py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Documento Final</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full py-2 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e2a22] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#13382e] border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enviar Presupuesto a WhatsApp</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080c14] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#161d2d] text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Homologación Fiscal</span>
                </div>
                <p>
                  Esta propuesta es compatible para emitir Factura Electrónica A, B o C con CAE una vez aprobada por el cliente.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Formal Preview Mode (Printable / PDF Style) */
        <div className="max-w-4xl mx-auto bg-[var(--bg-card)] text-[var(--text-primary)] p-8 sm:p-12 rounded-2xl shadow-2xl space-y-8 font-sans">
          {/* Header Membrete */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--border-subtle)] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-950 text-cyan-400 font-extrabold flex items-center justify-center text-sm">
                  C
                </div>
                <span className="text-xl font-extrabold text-slate-950 tracking-tight">Clientum Latam S.A.</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Plataforma CRM, Automatizaciones & Agentes IA • CUIT 30-71829304-9
              </p>
              <p className="text-xs text-[var(--text-muted)]">General Roca, Patagonia Argentina • info@clientum.com.ar</p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 uppercase tracking-wider">
                Propuesta Técnico-Comercial
              </span>
              <div className="text-xs text-[var(--text-muted)]">Fecha de emisión: {new Date().toLocaleDateString('es-AR')}</div>
              <div className="text-xs font-semibold text-rose-600">Válida hasta: {validUntil}</div>
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs">
            <div>
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block font-medium">Dirigido a:</span>
              <div className="font-bold text-[var(--text-primary)] text-sm">{clientName}</div>
              <div className="text-[var(--text-secondary)]">{clientEmail}</div>
              <div className="text-[var(--text-secondary)]">{clientPhone}</div>
            </div>
            <div>
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block font-medium">Asunto del proyecto:</span>
              <div className="font-semibold text-[var(--text-primary)]">{proposalTitle}</div>
              <div className="text-[var(--text-muted)] mt-1">Atención personalizada: Asesor Comercial Senior</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-[var(--text-primary)] text-sm">Detalle de Soluciones & Inversión</h4>
            <div className="overflow-x-auto border border-[var(--border-subtle)] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-muted)] text-[var(--text-secondary)] font-bold border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Servicio / Módulo</th>
                    <th className="p-3 text-center">Cant.</th>
                    <th className="p-3 text-right">Precio Unit.</th>
                    <th className="p-3 text-right">Desc.</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
                  {items.map((item, i) => {
                    const gross = item.quantity * item.unitPrice;
                    const disc = (gross * item.discount) / 100;
                    const net = gross - disc;
                    return (
                      <tr key={item.id}>
                        <td className="p-3 text-[var(--text-muted,#64748b)] dark:text-slate-400">{i + 1}</td>
                        <td className="p-3 font-medium text-[var(--text-primary)]">{item.description}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">$ {item.unitPrice.toLocaleString('es-AR')}</td>
                        <td className="p-3 text-right text-emerald-600">{item.discount > 0 ? `-${item.discount}%` : '-'}</td>
                        <td className="p-3 text-right font-bold">$ {Math.round(net).toLocaleString('es-AR')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Box */}
          <div className="flex justify-end">
            <div className="w-72 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2 text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal Neto:</span>
                <span>$ {Math.round(netTaxable).toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>IVA Liquidado:</span>
                <span>$ {Math.round(totalTax).toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-950 border-t border-[var(--border-subtle)] pt-2">
                <span>Total General:</span>
                <span className="text-cyan-700">$ {Math.round(grandTotal).toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>

          {/* Terms & Confidentiality */}
          <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <div>
              <span className="font-bold text-[var(--text-primary)] block">Condiciones de Contratación:</span>
              <p>{paymentTerms}</p>
            </div>
            <div>
              <span className="font-bold text-[var(--text-primary)] block">Cláusula de Confidencialidad:</span>
              <p className="text-[var(--text-muted)] text-[11px]">{confidentialityClause}</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-10 grid grid-cols-2 gap-12 text-center text-xs text-[var(--text-secondary)]">
            <div className="border-t border-[var(--border-default)] pt-2">
              <div className="font-bold text-[var(--text-primary)]">Clientum Latam S.A.</div>
              <div className="text-[11px] text-[var(--text-muted)]">Dirección Comercial & Operaciones</div>
            </div>
            <div className="border-t border-[var(--border-default)] pt-2">
              <div className="font-bold text-[var(--text-primary)]">{clientName}</div>
              <div className="text-[11px] text-[var(--text-muted)]">Aceptación de Propuesta & Firma</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
