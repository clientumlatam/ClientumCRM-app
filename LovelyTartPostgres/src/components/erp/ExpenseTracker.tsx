import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  TrendingDown,
  PieChart as PieIcon,
  Search,
  Trash2,
  Calendar,
  Tag,
  DollarSign,
  Building,
  X,
  FileText,
  Sparkles,
  Loader2,
  Bot
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useCRM } from '../../context/CRMContext';
import { ExpenseItem } from '../../types';
import { getClientumAuthJsonHeaders } from '../../lib/api';

const CATEGORY_COLORS: Record<string, string> = {
  Software: '#3b82f6',
  Marketing: '#8b5cf6',
  Travel: '#f59e0b',
  Salaries: '#10b981',
  Office: '#ec4899',
  Utilities: '#06b6d4',
  Other: '#64748b'
};

export const ExpenseTracker: React.FC = () => {
  const { expenses, addExpense, deleteExpense, showToast, currentUser } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Expense form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(250);
  const [category, setCategory] = useState<ExpenseItem['category']>('Software');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [vendor, setVendor] = useState('');
  const [assignedTo, setAssignedTo] = useState('Operations');
  const [notes, setNotes] = useState('');

  // AI Auto-Categorization state
  const [isAiCategorizing, setIsAiCategorizing] = useState(false);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  const handleAiCategorize = async (descText?: string, vendorText?: string) => {
    const queryDesc = descText || description;
    if (!queryDesc || queryDesc.trim().length < 3) {
      showToast('Please type an expense description first', 'warning');
      return;
    }

    setIsAiCategorizing(true);
    setAiRationale(null);

    try {
      const res = await fetch('/api/expense/categorize', {
        method: 'POST',
        headers: await getClientumAuthJsonHeaders(currentUser),
        body: JSON.stringify({ description: queryDesc, vendor: vendorText || vendor }),
      });

      if (!res.ok) throw new Error('Failed to auto-categorize expense');
      const data = await res.json();

      if (data.category && CATEGORY_COLORS[data.category]) {
        setCategory(data.category as any);
        setAiRationale(data.rationale || 'AI matched transaction pattern');
        showToast(`✨ Gemini AI categorized as "${data.category}"`, 'success');
      } else if (data.category) {
        setCategory('Other');
        setAiRationale('Categorized as Other');
      }
    } catch (err) {
      console.warn('AI categorization fallback:', err);
      // Client-side instant fallback
      const text = (queryDesc + ' ' + (vendorText || vendor)).toLowerCase();
      if (/flight|hotel|uber|taxi|cab|travel/i.test(text)) {
        setCategory('Travel');
        setAiRationale('Rule match: Travel & Transit');
      } else if (/aws|saas|software|slack|github|zoom/i.test(text)) {
        setCategory('Software');
        setAiRationale('Rule match: Cloud & SaaS');
      } else if (/paper|desk|office|supplies/i.test(text)) {
        setCategory('Office');
        setAiRationale('Rule match: Office Supplies');
      }
    } finally {
      setIsAiCategorizing(false);
    }
  };

  // Calculations
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group expenses by category for chart
  const categoryData: { name: string; value: number }[] = Object.entries(
    expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: Number(value) }));

  // Find top category
  const topCategory = categoryData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A';

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) {
      showToast('Please enter a description and amount', 'warning');
      return;
    }

    addExpense({
      description,
      amount: Number(amount) || 0,
      category,
      date,
      vendor,
      assignedTo,
      notes
    });

    setIsModalOpen(false);
    setDescription('');
    setVendor('');
    setNotes('');
  };

  const filteredExpenses = expenses.filter((e) => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.description.toLowerCase().includes(q) ||
        (e.vendor && e.vendor.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 text-xs">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Business Expenses</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400">
            ${totalExpenseAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">{expenses.length} recorded expense entries</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Top Expense Category</span>
            <Tag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary,#0f172a)] dark:text-white">{topCategory}</div>
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Largest operational cost center</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Average Expense Entry</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-400">
            ${expenses.length > 0 ? (totalExpenseAmount / expenses.length).toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Per transaction average</div>
        </div>
      </div>

      {/* Monthly Breakdown Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            Expenses Breakdown by Category ($ USD)
          </h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181d29', borderColor: '#273044', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs mb-3 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-400" />
            Category Allocation
          </h4>
          <div className="space-y-2.5">
            {categoryData.map((cat) => {
              const pct = totalExpenseAmount > 0 ? Math.round((cat.value / totalExpenseAmount) * 100) : 0;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#3b82f6' }}
                      />
                      {cat.name}
                    </span>
                    <span className="font-mono text-[var(--text-primary,#0f172a)] dark:text-white font-semibold">
                      ${cat.value.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CATEGORY_COLORS[cat.name] || '#3b82f6'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses by vendor or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none focus:border-rose-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 px-3 py-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {Object.keys(CATEGORY_COLORS).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setAiRationale(null);
            setDescription('');
            setVendor('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Expense Table */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-card,#ffffff)] dark:bg-[#151924] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
              <tr>
                <th className="p-3.5">Expense Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Vendor / Provider</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#181d28] text-[var(--text-secondary,#475569)] dark:text-slate-300">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    No expense entries found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#161b26] transition-colors">
                    <td className="p-3.5 font-medium text-[var(--text-primary,#0f172a)] dark:text-white">
                      <div>{exp.description}</div>
                      {exp.notes && <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{exp.notes}</div>}
                    </td>
                    <td className="p-3.5">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[var(--text-primary,#0f172a)] dark:text-white inline-block"
                        style={{ backgroundColor: `${CATEGORY_COLORS[exp.category]}33`, color: CATEGORY_COLORS[exp.category], border: `1px solid ${CATEGORY_COLORS[exp.category]}44` }}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-[var(--text-secondary,#475569)] dark:text-slate-300">{exp.vendor || '—'}</td>
                    <td className="p-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">{exp.date}</td>
                    <td className="p-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400">{exp.assignedTo || 'General'}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-rose-400 text-sm">
                      ${exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete expense entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD NEW EXPENSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212838] w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#212838] pb-3">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-rose-400" />
                Input New Business Expense
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium">Expense Description *</label>
                  <button
                    type="button"
                    onClick={() => handleAiCategorize()}
                    disabled={isAiCategorizing}
                    className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {isAiCategorizing ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                        <span>AI Categorizing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>✨ Auto-Categorize with Gemini</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delta Airlines roundtrip flight to Tech Conference"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => {
                    if (description.length > 4 && !aiRationale) {
                      handleAiCategorize();
                    }
                  }}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium">Category</label>
                    {aiRationale && (
                      <span className="text-[10px] text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/30 font-medium flex items-center gap-1">
                        <Bot className="w-2.5 h-2.5" /> AI Suggested
                      </span>
                    )}
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                  >
                    {Object.keys(CATEGORY_COLORS).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {aiRationale && (
                <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/30 text-[10px] text-purple-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                    <span><strong>Gemini AI Reasoning:</strong> {aiRationale}</span>
                  </span>
                  <span className="font-mono text-purple-300 font-bold shrink-0">Auto-Assigned</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon Web Services"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Department / Assigned Team</label>
                <input
                  type="text"
                  placeholder="e.g. Operations, Marketing, Engineering..."
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Notes / Receipt reference</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional context or invoice ref..."
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Record Expense Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
