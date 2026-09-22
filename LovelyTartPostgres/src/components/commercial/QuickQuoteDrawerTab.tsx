import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Share2,
  Send,
  Sparkles,
  Check,
  Building2,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { Opportunity, Person, Company } from '../../types';
import { useCRM } from '../../context/CRMContext';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  ivaRate: number;
}

interface QuickQuoteDrawerTabProps {
  opp: Opportunity;
  person?: Person;
  company?: Company;
  onUpdateDealAmount: (newAmount: number) => void;
  onOpenWhatsApp: (dealName: string, amount: number, currency: string) => void;
}

export const QuickQuoteDrawerTab: React.FC<QuickQuoteDrawerTabProps> = ({
  opp,
  person,
  company,
  onUpdateDealAmount,
  onOpenWhatsApp,
}) => {
  const { showToast, triggerConfetti } = useCRM();

  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [validDays, setValidDays] = useState(15);
  const [paymentTerms, setPaymentTerms] = useState('50% anticipo al inicio, 50% contra entrega.');
  const [notes, setNotes] = useState('Precios sujetos a confirmación. Válido por 15 días corridos.');

  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: 'item-1',
      description: opp.name || 'Servicio Profesional de Consultoría',
      quantity: 1,
      unitPrice: opp.amount > 0 ? opp.amount : 1200,
      discount: 0,
      ivaRate: 21,
    },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: 'Nuevo servicio / producto',
        quantity: 1,
        unitPrice: 500,
        discount: 0,
        ivaRate: 21,
      },
    ]);
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) {
      showToast('Debe haber al menos 1 ítem en el presupuesto', 'warning');
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
  const totalDiscount = items.reduce(
    (acc, it) => acc + (it.quantity * it.unitPrice * it.discount) / 100,
    0
  );
  const netSubtotal = subtotal - totalDiscount;
  const totalIva = items.reduce((acc, it) => {
    const itemNet = it.quantity * it.unitPrice * (1 - it.discount / 100);
    return acc + (itemNet * it.ivaRate) / 100;
  }, 0);
  const grandTotal = Math.round(netSubtotal + totalIva);

  const handleSyncToDeal = () => {
    onUpdateDealAmount(grandTotal);
    triggerConfetti();
    showToast(`Monto del negocio actualizado a ${currency === 'ARS' ? '$' : 'US$'}${grandTotal.toLocaleString()}`, 'success');
  };

  const handlePrintPDF = () => {
    const clientName = person ? `${person.firstName} ${person.lastName}` : (opp.contactName || 'Cliente');
    const companyStr = company ? company.name : (opp.companyName || '');
    const quoteNum = `COT-${opp.id.slice(-5).toUpperCase()}`;
    const today = new Date().toLocaleDateString('es-AR');
    const validityDate = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Por favor permite ventanas emergentes para generar el PDF', 'warning');
      return;
    }

    const itemsHtml = items.map((it, idx) => {
      const lineNet = it.quantity * it.unitPrice * (1 - it.discount / 100);
      const lineTotal = lineNet * (1 + it.ivaRate / 100);
      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; text-align: center; color: #64748b;">${idx + 1}</td>
          <td style="padding: 10px; font-weight: 600; color: #1e293b;">${it.description}</td>
          <td style="padding: 10px; text-align: center;">${it.quantity}</td>
          <td style="padding: 10px; text-align: right;">${currency === 'ARS' ? '$' : 'US$'}${it.unitPrice.toLocaleString()}</td>
          <td style="padding: 10px; text-align: center; color: #dc2626;">${it.discount > 0 ? `${it.discount}%` : '-'}</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${it.ivaRate}%</td>
          <td style="padding: 10px; text-align: right; font-weight: 700; color: #0f172a;">${currency === 'ARS' ? '$' : 'US$'}${Math.round(lineTotal).toLocaleString()}</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Presupuesto ${quoteNum} - Clientum</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 40px; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 800; color: #0284c7; letter-spacing: -0.5px; }
            .quote-title { font-size: 18px; font-weight: 700; color: #334155; text-align: right; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; font-size: 13px; }
            .info-card h4 { margin: 0 0 8px 0; color: #0284c7; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
            th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; }
            .totals-table { width: 300px; margin-left: auto; margin-bottom: 30px; }
            .totals-table tr td { padding: 6px 10px; }
            .totals-table tr.grand-total { font-size: 16px; font-weight: 800; color: #0284c7; border-top: 2px solid #0284c7; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Clientum CRM</div>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Soluciones Digitales & Automatización Comercial</p>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 12px;">contacto@clientum.com.ar • clientum.com.ar</p>
            </div>
            <div class="quote-title">
              <div>PRESUPUESTO / COTIZACIÓN</div>
              <div style="font-size: 14px; font-family: monospace; color: #0284c7; margin-top: 4px;"># ${quoteNum}</div>
              <div style="font-size: 12px; color: #64748b; font-weight: normal; margin-top: 4px;">Fecha: ${today}</div>
              <div style="font-size: 12px; color: #64748b; font-weight: normal;">Válido hasta: ${validityDate}</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-card">
              <h4>Cliente / Empresa</h4>
              <p style="margin: 0; font-size: 15px; font-weight: 700;">${companyStr || clientName}</p>
              <p style="margin: 4px 0 0 0; color: #475569;">Atención: ${clientName}</p>
              <p style="margin: 2px 0 0 0; color: #475569;">${opp.contactEmail || (person?.email || '')}</p>
              <p style="margin: 2px 0 0 0; color: #475569;">${opp.contactPhone || (person?.phone || '')}</p>
            </div>
            <div class="info-card">
              <h4>Proyecto / Referencia</h4>
              <p style="margin: 0; font-size: 15px; font-weight: 700;">${opp.name}</p>
              <p style="margin: 4px 0 0 0; color: #475569;">Condición de pago: ${paymentTerms}</p>
              <p style="margin: 2px 0 0 0; color: #475569;">Moneda: ${currency}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="text-align: center; width: 30px;">#</th>
                <th>Descripción del Servicio / Producto</th>
                <th style="text-align: center; width: 60px;">Cant.</th>
                <th style="text-align: right; width: 110px;">Precio Unit.</th>
                <th style="text-align: center; width: 70px;">Desc.</th>
                <th style="text-align: center; width: 70px;">IVA</th>
                <th style="text-align: right; width: 120px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td style="color: #64748b;">Subtotal Bruto:</td>
              <td style="text-align: right; font-weight: 600;">${currency === 'ARS' ? '$' : 'US$'}${Math.round(subtotal).toLocaleString()}</td>
            </tr>
            ${totalDiscount > 0 ? `
              <tr>
                <td style="color: #dc2626;">Descuentos:</td>
                <td style="text-align: right; font-weight: 600; color: #dc2626;">-${currency === 'ARS' ? '$' : 'US$'}${Math.round(totalDiscount).toLocaleString()}</td>
              </tr>
            ` : ''}
            <tr>
              <td style="color: #64748b;">IVA Estimado:</td>
              <td style="text-align: right; font-weight: 600;">${currency === 'ARS' ? '$' : 'US$'}${Math.round(totalIva).toLocaleString()}</td>
            </tr>
            <tr class="grand-total">
              <td>TOTAL:</td>
              <td style="text-align: right;">${currency === 'ARS' ? '$' : 'US$'}${grandTotal.toLocaleString()}</td>
            </tr>
          </table>

          <div class="footer">
            <p style="margin: 0 0 6px 0; font-weight: 700;">Condiciones y Observaciones:</p>
            <p style="margin: 0 0 20px 0; color: #475569;">${notes} ${paymentTerms}</p>
            <div style="margin-top: 50px; display: flex; justify-content: space-between;">
              <div style="border-top: 1px solid #94a3b8; width: 220px; text-align: center; padding-top: 8px;">
                Firma y Aclaración Cliente
              </div>
              <div style="border-top: 1px solid #94a3b8; width: 220px; text-align: center; padding-top: 8px;">
                Clientum CRM Latam
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4 text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300">
      {/* Top Controls Bar */}
      <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium">Moneda:</span>
          <div className="flex bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e111a] rounded-lg p-0.5 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293b]">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${ currency === 'USD' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
            >
              USD (US$)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('ARS')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${ currency === 'ARS' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
            >
              ARS ($)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[var(--text-primary,#0f172a)] dark:text-white text-[11px] font-semibold border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenWhatsApp(opp.name, grandTotal, currency)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Enviar WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            Líneas del Presupuesto ({items.length})
          </h4>
          <button
            type="button"
            onClick={addItem}
            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar ítem
          </button>
        </div>

        <div className="space-y-2">
          {items.map((it, idx) => {
            const lineNet = it.quantity * it.unitPrice * (1 - it.discount / 100);
            const lineTotal = lineNet * (1 + it.ivaRate / 100);

            return (
              <div
                key={it.id}
                className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#131724] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20273a] space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1f2638] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={it.description}
                    onChange={(e) => updateItem(it.id, 'description', e.target.value)}
                    placeholder="Descripción del servicio..."
                    className="flex-1 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e16] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536] rounded-lg px-2.5 py-1.5 text-[var(--text-primary,#0f172a)] dark:text-white text-xs focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="p-1 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                  <div>
                    <label className="text-[var(--text-muted)] block mb-0.5 text-[10px]">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={(e) => updateItem(it.id, 'quantity', Number(e.target.value))}
                      className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e16] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536] rounded-lg p-1.5 text-[var(--text-primary,#0f172a)] dark:text-white font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[var(--text-muted)] block mb-0.5 text-[10px]">Precio Unit. ({currency})</label>
                    <input
                      type="number"
                      value={it.unitPrice}
                      onChange={(e) => updateItem(it.id, 'unitPrice', Number(e.target.value))}
                      className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e16] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536] rounded-lg p-1.5 text-[var(--text-primary,#0f172a)] dark:text-white font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[var(--text-muted)] block mb-0.5 text-[10px]">Desc. (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={it.discount}
                      onChange={(e) => updateItem(it.id, 'discount', Number(e.target.value))}
                      className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e16] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536] rounded-lg p-1.5 text-[var(--text-primary,#0f172a)] dark:text-white font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[var(--text-muted)] block mb-0.5 text-[10px]">IVA AFIP</label>
                    <select
                      value={it.ivaRate}
                      onChange={(e) => updateItem(it.id, 'ivaRate', Number(e.target.value))}
                      className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0e16] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2536] rounded-lg p-1.5 text-[var(--text-primary,#0f172a)] dark:text-white text-xs focus:outline-none"
                    >
                      <option value="21">21%</option>
                      <option value="10.5">10.5%</option>
                      <option value="0">0%</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[var(--text-muted)] block mb-0.5 text-[10px]">Total Ítem</label>
                    <div className="font-bold text-blue-400 py-1 font-mono text-xs">
                      {currency === 'ARS' ? '$' : 'US$'}{Math.round(lineTotal).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
          <span>Subtotal Neto:</span>
          <span className="font-mono text-[var(--text-primary,#0f172a)] dark:text-white">{currency === 'ARS' ? '$' : 'US$'}{Math.round(netSubtotal).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
          <span>IVA Estimado:</span>
          <span className="font-mono text-[var(--text-primary,#0f172a)] dark:text-white">{currency === 'ARS' ? '$' : 'US$'}{Math.round(totalIva).toLocaleString()}</span>
        </div>
        <div className="border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#22293d] pt-2 flex items-center justify-between font-bold text-sm">
          <span className="text-[var(--text-primary,#0f172a)] dark:text-white">Total Presupuesto:</span>
          <span className="text-emerald-400 font-mono text-base">
            {currency === 'ARS' ? '$' : 'US$'}{grandTotal.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSyncToDeal}
          className="w-full mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Actualizar Monto del Trato en CRM (${grandTotal.toLocaleString()})</span>
        </button>
      </div>
    </div>
  );
};
