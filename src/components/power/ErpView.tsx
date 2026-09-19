import React, { useState } from 'react';
import {
  Receipt,
  Package,
  CreditCard,
  Building2,
  PieChart,
  FileText,
  Boxes,
  TrendingDown,
  History,
  Layers
} from 'lucide-react';
import { InvoicingModule } from '../erp/InvoicingModule';
import { InvoiceHistoryTable } from '../erp/InvoiceHistoryTable';
import { InventoryDashboard } from '../erp/InventoryDashboard';
import { ExpenseTracker } from '../erp/ExpenseTracker';

export const ErpView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'history' | 'inventory' | 'expenses'>('history');

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-emerald-400" />
            Enterprise ERP Suite (Invoicing, History, Inventory & Expense Management)
          </h3>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
            Integrated resource planning module for commercial invoicing, sortable invoice history, real-time stock control, and monthly expense analytics.
          </p>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="flex items-center gap-1.5 bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] p-1.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${ activeTab === 'history' ? 'bg-emerald-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#181d29]' }`}
          >
            <History className="w-4 h-4" />
            <span>Invoice History</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${ activeTab === 'invoices' ? 'bg-emerald-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#181d29]' }`}
          >
            <FileText className="w-4 h-4" />
            <span>Generate Invoices</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${ activeTab === 'inventory' ? 'bg-emerald-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#181d29]' }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Inventory Stock</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${ activeTab === 'expenses' ? 'bg-emerald-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#181d29]' }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>Expense Tracker</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'history' && <InvoiceHistoryTable />}
      {activeTab === 'invoices' && <InvoicingModule />}
      {activeTab === 'inventory' && <InventoryDashboard />}
      {activeTab === 'expenses' && <ExpenseTracker />}
    </div>
  );
};
