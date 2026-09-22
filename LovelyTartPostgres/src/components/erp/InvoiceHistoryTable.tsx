import React, { useState } from 'react';
import {
  FileText,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  Send,
  Clock,
  AlertCircle,
  Ban,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Printer,
  X,
  ArrowUpDown,
  Filter,
  DollarSign
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Invoice, InvoiceStatus } from '../../types';

type SortField = 'issueDate' | 'clientName' | 'status' | 'totalAmount';
type SortOrder = 'asc' | 'desc';

export const InvoiceHistoryTable: React.FC = () => {
  const { invoices, updateInvoiceStatus, deleteInvoice, showToast } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('issueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Toggle sort field or direction
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter invoices
  const filtered = invoices.filter((inv) => {
    if (selectedStatus !== 'all' && inv.status.toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        (inv.clientEmail && inv.clientEmail.toLowerCase().includes(q)) ||
        (inv.notes && inv.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Sort invoices
  const sortedInvoices = [...filtered].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'clientName') {
      aVal = a.clientName.toLowerCase();
      bVal = b.clientName.toLowerCase();
    } else if (sortField === 'totalAmount') {
      aVal = a.totalAmount;
      bVal = b.totalAmount;
    } else if (sortField === 'issueDate') {
      aVal = new Date(a.issueDate).getTime();
      bVal = new Date(b.issueDate).getTime();
    } else if (sortField === 'status') {
      aVal = a.status.toLowerCase();
      bVal = b.status.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate totals
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const paidInvoiced = invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingInvoiced = invoices.filter((i) => i.status === 'Sent' || i.status === 'Draft').reduce((sum, i) => sum + i.totalAmount, 0);
  const overdueInvoiced = invoices.filter((i) => i.status === 'Overdue').reduce((sum, i) => sum + i.totalAmount, 0);

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
            <Send className="w-3 h-3" /> Sent / Pending
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

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-3 h-3 text-[var(--text-muted)] opacity-60" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-emerald-400 font-bold" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-emerald-400 font-bold" />
    );
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Top Aggregates Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium mb-1">Total Generated Invoices</div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary,#0f172a)] dark:text-white">{invoices.length}</div>
          <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
            Total Value: <span className="font-mono text-emerald-400">${totalInvoiced.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium mb-1">Total Paid Invoices</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            ${paidInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
            {invoices.filter((i) => i.status === 'Paid').length} paid entries
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium mb-1">Pending / Sent</div>
          <div className="text-xl font-bold font-mono text-blue-400">
            ${pendingInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Awaiting customer payment</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium mb-1">Overdue Outstanding</div>
          <div className="text-xl font-bold font-mono text-rose-400">
            ${overdueInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Requires follow-up</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice history by client or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] p-1 rounded-lg">
            {['all', 'Paid', 'Sent', 'Overdue', 'Draft'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${ selectedStatus === st ? 'bg-emerald-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
              >
                {st === 'all' ? 'All Statuses' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-right text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
          Showing <strong className="text-[var(--text-primary,#0f172a)] dark:text-white">{sortedInvoices.length}</strong> of {invoices.length} records
        </div>
      </div>

      {/* Sortable Invoice History Table */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-card,#ffffff)] dark:bg-[#151924] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] select-none">
              <tr>
                <th className="p-3.5">Invoice #</th>

                {/* Sortable Column: Client */}
                <th
                  onClick={() => handleSort('clientName')}
                  className="p-3.5 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1c2232] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Client / Organization</span>
                    {renderSortIcon('clientName')}
                  </div>
                </th>

                {/* Sortable Column: Issue Date */}
                <th
                  onClick={() => handleSort('issueDate')}
                  className="p-3.5 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1c2232] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Issue Date</span>
                    {renderSortIcon('issueDate')}
                  </div>
                </th>

                <th className="p-3.5">Due Date</th>

                {/* Sortable Column: Status */}
                <th
                  onClick={() => handleSort('status')}
                  className="p-3.5 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1c2232] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    {renderSortIcon('status')}
                  </div>
                </th>

                {/* Sortable Column: Total Amount */}
                <th
                  onClick={() => handleSort('totalAmount')}
                  className="p-3.5 text-right hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1c2232] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Total Amount ($)</span>
                    {renderSortIcon('totalAmount')}
                  </div>
                </th>

                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#181d28] text-[var(--text-secondary,#475569)] dark:text-slate-300">
              {sortedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    No invoice history matches your criteria.
                  </td>
                </tr>
              ) : (
                sortedInvoices.map((inv) => (
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
                    <td className="p-3.5 font-mono text-[var(--text-muted,#64748b)] dark:text-slate-400">{inv.issueDate}</td>
                    <td className="p-3.5 font-mono text-[var(--text-muted,#64748b)] dark:text-slate-400">{inv.dueDate}</td>
                    <td className="p-3.5">{getStatusBadge(inv.status)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400 text-sm">
                      ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                          title="View / Print PDF"
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

      {/* PRINTABLE / VIEW MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] text-[var(--text-primary)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
                <button onClick={() => setSelectedInvoice(null)} className="p-1 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-xs bg-[var(--bg-card)] text-[var(--text-primary)]">
              <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-6">
                <div>
                  <div className="text-xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                    CLIENTUM CRM & ERP
                  </div>
                  <div className="text-[var(--text-muted)] text-[11px] mt-1">
                    Clientum Systems S.A. • CUIT 30-71829384-9<br />
                    Av. Corrientes 1250, Piso 10, Buenos Aires
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

              <div className="grid grid-cols-2 gap-6 bg-[var(--bg-muted)] p-4 rounded-xl border border-[var(--border-subtle)]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">
                    Billed To:
                  </span>
                  <div className="font-bold text-sm text-[var(--text-primary)]">{selectedInvoice.clientName}</div>
                  {selectedInvoice.clientEmail && <div className="text-[var(--text-secondary)]">{selectedInvoice.clientEmail}</div>}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">
                    Status:
                  </span>
                  <div className="font-bold text-sm text-emerald-700">{selectedInvoice.status.toUpperCase()}</div>
                </div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-[var(--text-secondary)] font-bold text-[11px]">
                    <th className="py-2">Item Description</th>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
