import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Printer,
  Download,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  DollarSign,
  Search,
  Eye,
  Send,
  Clock,
  Ban
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Invoice, InvoiceStatus, InvoiceLineItem } from '../../types';

export const InvoicingModule: React.FC = () => {
  const { invoices, opportunities, addInvoice, updateInvoiceStatus, deleteInvoice, showToast, triggerConfetti } = useCRM();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for New Invoice
  const [selectedOppId, setSelectedOppId] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [taxRate, setTaxRate] = useState<number>(16); // 16% tax default
  const [notes, setNotes] = useState('Payment due within 15 days via bank transfer or credit card.');
  const [lineItems, setLineItems] = useState<Omit<InvoiceLineItem, 'id' | 'total'>[]>([
    { description: 'Professional Services / Deal Implementation', quantity: 1, unitPrice: 1000 }
  ]);

  // Handle selecting closed opportunity to auto-fill
  const handleSelectOpportunity = (oppId: string) => {
    setSelectedOppId(oppId);
    if (!oppId) return;
    const opp = opportunities.find((o) => o.id === oppId);
    if (opp) {
      setClientName(opp.companyName || opp.name);
      setClientEmail(opp.contactName ? `${opp.contactName.toLowerCase().replace(/\s+/g, '.')}@client.com` : 'finance@client.com');
      setLineItems([
        {
          description: `Contract Implementation: ${opp.name}`,
          quantity: 1,
          unitPrice: opp.amount
        }
      ]);
      showToast(`Autofilled invoice data from closed deal "${opp.name}"`, 'info');
    }
  };

  // Calculations
  const calculatedSubtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const calculatedTax = (calculatedSubtotal * taxRate) / 100;
  const calculatedTotal = calculatedSubtotal + calculatedTax;

  const handleAddItem = () => {
    setLineItems([...lineItems, { description: 'Additional Item / Service', quantity: 1, unitPrice: 100 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof Omit<InvoiceLineItem, 'id' | 'total'>, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      showToast('Please enter a client name', 'warning');
      return;
    }

    const items: InvoiceLineItem[] = lineItems.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      description: item.description,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      total: (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0)
    }));

    addInvoice({
      opportunityId: selectedOppId || undefined,
      clientName,
      clientEmail,
      clientAddress,
      issueDate,
      dueDate,
      status: 'Draft',
      items,
      subtotal: calculatedSubtotal,
      taxRate: Number(taxRate) || 0,
      taxAmount: calculatedTax,
      totalAmount: calculatedTotal,
      notes
    });

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedOppId('');
    setClientName('');
    setClientEmail('');
    setClientAddress('');
    setLineItems([{ description: 'Professional Services', quantity: 1, unitPrice: 1000 }]);
    setTaxRate(16);
  };

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (filterStatus !== 'all' && inv.status.toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        (inv.clientEmail && inv.clientEmail.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Closed deals list
  const closedDeals = opportunities.filter((o) => o.stage === 'won' || o.stage === 'proposal');

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Send className="w-3 h-3" /> Sent
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-slate-500/20">
            <Clock className="w-3 h-3" /> Draft
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" /> Overdue
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Ban className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices by ID, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] p-1 rounded-lg">
            {['all', 'Paid', 'Sent', 'Draft', 'Overdue'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${ filterStatus === st ? 'bg-emerald-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
              >
                {st === 'all' ? 'All Invoices' : st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Invoices List Table */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-card,#ffffff)] dark:bg-[#151924] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
              <tr>
                <th className="p-3.5">Invoice ID</th>
                <th className="p-3.5">Client / Company</th>
                <th className="p-3.5">Issue Date</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Subtotal</th>
                <th className="p-3.5">Tax ({taxRate}%)</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#181d28] text-[var(--text-secondary,#475569)] dark:text-slate-300">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    No invoices found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#161b26] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{inv.id}</span>
                    </td>
                    <td className="p-3.5 font-medium text-[var(--text-primary,#0f172a)] dark:text-white">
                      <div>{inv.clientName}</div>
                      {inv.clientEmail && (
                        <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">{inv.clientEmail}</div>
                      )}
                    </td>
                    <td className="p-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">{inv.issueDate}</td>
                    <td className="p-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">{inv.dueDate}</td>
                    <td className="p-3.5 font-mono text-[var(--text-secondary,#475569)] dark:text-slate-300">${inv.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-3.5 font-mono text-[var(--text-muted,#64748b)] dark:text-slate-400">${inv.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400 text-sm">
                      ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5">{getStatusBadge(inv.status)}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                          title="View / Print PDF Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <select
                          value={inv.status}
                          onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as InvoiceStatus)}
                          className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300 px-2 py-1 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Paid">Paid</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="p-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] hover:bg-rose-500/20 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212838] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[var(--bg-card,#ffffff)] dark:bg-[#161a25] border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#212838] flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Generate Tax Invoice from Closed Deal
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#202738]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Select Deal auto-fill */}
              <div className="p-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] space-y-1.5">
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold text-[11px]">
                  Link Closed Opportunity (Autofill Client & Line Items)
                </label>
                <select
                  value={selectedOppId}
                  onChange={(e) => handleSelectOpportunity(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2c364e] focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Choose a Closed Opportunity --</option>
                  {closedDeals.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.name} ({opp.companyName || 'No company'}) — ${opp.amount.toLocaleString()} [{opp.stage.toUpperCase()}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Client Name / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. ABEPOL S.R.L."
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Client Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="billing@client.com"
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Line Items & Services</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] p-2.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222a3d]">
                      <input
                        type="text"
                        placeholder="Description..."
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        className="flex-1 bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-16 bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] text-[var(--text-primary,#0f172a)] dark:text-white px-2 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] text-center focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        className="w-24 bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] text-[var(--text-primary,#0f172a)] dark:text-white px-2 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] font-mono text-right focus:outline-none"
                      />
                      <div className="w-24 text-right font-mono font-bold text-emerald-400 text-xs">
                        ${((item.quantity || 1) * (item.unitPrice || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automatic Tax Calculation Breakdown */}
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-3.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] space-y-1.5 text-right font-mono">
                <div className="flex justify-between text-[var(--text-secondary,#475569)] dark:text-slate-300">
                  <span>Subtotal:</span>
                  <span>${calculatedSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[11px]">
                  <span>Automatic Tax ({taxRate}%):</span>
                  <span>+${calculatedTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold text-sm pt-1 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#29344c]">
                  <span>Total Due:</span>
                  <span>${calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Issue & Save Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE / PDF INVOICE VIEW MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] text-[var(--text-primary)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Controls Header */}
            <div className="p-3 bg-slate-900 text-[var(--text-primary,#0f172a)] dark:text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs">{selectedInvoice.id} — Official Tax Invoice</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div id="printable-invoice" className="p-8 overflow-y-auto space-y-6 text-xs bg-[var(--bg-card)] text-[var(--text-primary)]">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-6">
                <div>
                  <div className="text-xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                    CLIENTUM CRM & ERP
                  </div>
                  <div className="text-[var(--text-muted)] text-[11px] mt-1">
                    Clientum Systems S.A. • CUIT 30-71829384-9<br />
                    Av. Corrientes 1250, Piso 10, Buenos Aires, Argentina
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-600 font-mono">{selectedInvoice.id}</div>
                  <div className="text-[var(--text-muted)] text-[11px] font-medium mt-1">
                    Issue Date: <strong>{selectedInvoice.issueDate}</strong><br />
                    Due Date: <strong>{selectedInvoice.dueDate}</strong>
                  </div>
                </div>
              </div>

              {/* Seller & Buyer Details */}
              <div className="grid grid-cols-2 gap-6 bg-[var(--bg-muted)] p-4 rounded-xl border border-[var(--border-subtle)]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">
                    Billed To (Client):
                  </span>
                  <div className="font-bold text-sm text-[var(--text-primary)]">{selectedInvoice.clientName}</div>
                  {selectedInvoice.clientEmail && (
                    <div className="text-[var(--text-secondary)]">{selectedInvoice.clientEmail}</div>
                  )}
                  {selectedInvoice.clientAddress && (
                    <div className="text-[var(--text-muted)] text-[11px] mt-0.5">{selectedInvoice.clientAddress}</div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">
                    Payment Status:
                  </span>
                  <div className="font-bold text-sm text-emerald-700">{selectedInvoice.status.toUpperCase()}</div>
                  <div className="text-[var(--text-muted)] text-[11px] mt-1">Currency: USD ($)</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-[var(--text-secondary)] font-bold text-[11px]">
                    <th className="py-2">Item / Service Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-mono">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-sans font-medium text-[var(--text-primary)]">{item.description}</td>
                      <td className="py-2.5 text-center text-[var(--text-secondary)]">{item.quantity}</td>
                      <td className="py-2.5 text-right text-[var(--text-secondary)]">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 text-right font-bold text-[var(--text-primary)]">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tax Summary Breakdown */}
              <div className="flex justify-end pt-4 border-t border-[var(--border-subtle)] font-mono">
                <div className="w-64 space-y-1.5 text-right text-xs">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Subtotal:</span>
                    <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Tax ({selectedInvoice.taxRate}%):</span>
                    <span>${selectedInvoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-[var(--text-primary)] pt-2 border-t-2 border-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-emerald-700">${selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer notes */}
              {selectedInvoice.notes && (
                <div className="p-3 bg-[var(--bg-muted)] rounded-lg text-[var(--text-secondary)] text-[11px]">
                  <strong>Notes / Payment Instructions:</strong> {selectedInvoice.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
