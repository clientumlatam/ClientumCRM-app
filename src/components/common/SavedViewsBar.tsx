import React, { useState } from 'react';
import { Bookmark, Plus, X, Filter, SlidersHorizontal, Check, Trash2, ArrowUpDown } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { SavedView } from '../../types';

interface SavedViewsBarProps {
  target: 'opportunities' | 'companies' | 'people';
}

export const SavedViewsBar: React.FC<SavedViewsBarProps> = ({ target }) => {
  const { savedViews, addSavedView, deleteSavedView, filterState, setFilterState, showToast } = useCRM();

  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewName, setViewName] = useState('');

  const targetViews = savedViews.filter((v) => v.target === target);

  const handleApplyView = (view: SavedView) => {
    setActiveViewId(view.id);
    // Apply rules from saved view
    if (view.rules.length > 0) {
      const rule = view.rules[0];
      if (rule.field === 'amount') {
        setFilterState((prev) => ({ ...prev, minAmount: Number(rule.value) || 0 }));
      } else if (rule.field === 'tier' || rule.field === 'priority' || rule.field === 'stage') {
        setFilterState((prev) => ({ ...prev, [rule.field]: rule.value }));
      }
    }
    showToast(`Applied view: ${view.name}`, 'info');
  };

  const handleClearView = () => {
    setActiveViewId(null);
    setFilterState({ search: '', stage: 'all', owner: 'all', priority: 'all', minAmount: 0 });
  };

  const handleSaveCurrentView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewName.trim()) return;

    const created = addSavedView({
      name: viewName,
      target,
      rules: filterState.priority && filterState.priority !== 'all' ? [{ id: 'r1', field: 'priority', operator: 'equals', value: String(filterState.priority) }] : [],
    });

    setActiveViewId(created.id);
    setIsModalOpen(false);
    setViewName('');
  };

  return (
    <div className="px-4 py-2 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c0e14] border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono uppercase font-semibold text-[var(--text-muted)] shrink-0 flex items-center gap-1">
          <Bookmark className="w-3 h-3 text-indigo-400" />
          Views:
        </span>

        <button
          onClick={handleClearView}
          className={`px-2.5 py-1 rounded-md transition-all text-[11px] font-medium shrink-0 ${ activeViewId === null ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736]' }`}
        >
          All Items
        </button>

        {targetViews.map((v) => {
          const isActive = activeViewId === v.id;
          return (
            <div key={v.id} className="flex items-center shrink-0">
              <button
                onClick={() => handleApplyView(v)}
                className={`px-2.5 py-1 rounded-l-md transition-all text-[11px] font-medium flex items-center gap-1.5 ${ isActive ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736]' }`}
              >
                <span>{v.name}</span>
              </button>
              <button
                onClick={() => deleteSavedView(v.id)}
                className="px-1.5 py-1 rounded-r-md bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400 border-y border-r border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] transition-colors"
                title="Delete view"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#202738] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3348] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-all text-[11px] font-medium"
        >
          <Plus className="w-3 h-3 text-indigo-400" />
          Save Current View
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e222d] rounded-2xl p-5 shadow-2xl text-[var(--text-primary,#0f172a)] dark:text-slate-200">
            <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white mb-1">Save View Preset</h3>
            <p className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs mb-3">Save current filter rules as a quick-access tab.</p>

            <form onSubmit={handleSaveCurrentView} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">View Name</label>
                <input
                  type="text"
                  placeholder="e.g. High Priority Deals"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141720] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-indigo-500 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-md"
                >
                  Save View
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
