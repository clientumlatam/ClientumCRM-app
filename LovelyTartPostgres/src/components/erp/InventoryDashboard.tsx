import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Search,
  Link,
  Trash2,
  RefreshCw,
  Tag,
  DollarSign,
  X,
  Layers
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { InventoryItem } from '../../types';

export const InventoryDashboard: React.FC = () => {
  const { inventory, opportunities, addInventoryItem, updateInventoryStock, deleteInventoryItem, showToast } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLinkDealModalOpen, setIsLinkDealModalOpen] = useState(false);
  const [selectedItemForDeal, setSelectedItemForDeal] = useState<InventoryItem | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string>('');
  const [qtyToDeduct, setQtyToDeduct] = useState<number>(1);

  // New Product Form state
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Software');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [reorderLevel, setReorderLevel] = useState<number>(5);
  const [unitPrice, setUnitPrice] = useState<number>(150);
  const [description, setDescription] = useState('');

  // Low Stock Items filter
  const lowStockItems = inventory.filter((item) => item.stockQuantity <= item.reorderLevel);

  // Categories list
  const categories = Array.from(new Set(inventory.map((item) => item.category)));

  // Total valuation
  const totalValuation = inventory.reduce((sum, item) => sum + (item.stockQuantity * item.unitPrice), 0);
  const totalStockUnits = inventory.reduce((sum, item) => sum + item.stockQuantity, 0);

  // Filtered inventory
  const filteredInventory = inventory.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) {
      showToast('Please fill in Product Name and SKU', 'warning');
      return;
    }

    addInventoryItem({
      sku: sku.toUpperCase(),
      name,
      category,
      stockQuantity: Number(stockQuantity) || 0,
      reorderLevel: Number(reorderLevel) || 5,
      unitPrice: Number(unitPrice) || 0,
      description,
      linkedDealsCount: 0,
      lastRestocked: new Date().toISOString().split('T')[0]
    });

    setIsAddModalOpen(false);
    setSku('');
    setName('');
    setDescription('');
  };

  const handleLinkStockToDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForDeal || !selectedDealId) return;

    const opp = opportunities.find((o) => o.id === selectedDealId);
    if (!opp) return;

    if (selectedItemForDeal.stockQuantity < qtyToDeduct) {
      showToast(`Insufficient stock! Available: ${selectedItemForDeal.stockQuantity}`, 'error');
      return;
    }

    // Deduct stock
    updateInventoryStock(selectedItemForDeal.id, -qtyToDeduct);
    showToast(`Deducted ${qtyToDeduct} unit(s) of ${selectedItemForDeal.name} for deal "${opp.name}"`, 'success');
    setIsLinkDealModalOpen(false);
    setSelectedItemForDeal(null);
  };

  return (
    <div className="space-y-5">
      {/* Low Stock Banner Alert */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-rose-950/30 to-[#12151d] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center gap-2">
                <span>Low Stock Reorder Alert!</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                  {lowStockItems.length} Product(s) Below Threshold
                </span>
              </h4>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                {lowStockItems.map((i) => `${i.name} (${i.stockQuantity} remaining)`).join(' • ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                lowStockItems.forEach((item) => {
                  showToast(
                    `⚠️ Minimum Stock Threshold Alert: "${item.name}" (${item.sku}) is at ${item.stockQuantity} units (Reorder Threshold: ${item.reorderLevel} min units)!`,
                    'warning'
                  );
                });
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 text-xs transition-colors cursor-pointer"
            >
              Fire Toast Alerts
            </button>
            <button
              onClick={() => {
                lowStockItems.forEach((i) => updateInventoryStock(i.id, 10));
                showToast(`Restocked +10 units for all low-stock items!`, 'success');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/30 text-xs transition-colors cursor-pointer"
            >
              Restock All (+10 Units)
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Valuation</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary,#0f172a)] dark:text-white">
            ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">{inventory.length} Product SKUs in inventory</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Stock Quantity</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-400">
            {totalStockUnits.toLocaleString()} units
          </div>
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Available for sale / deal delivery</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Reorder Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {lowStockItems.length}
          </div>
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Products needing restock</div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
          <div className="flex items-center justify-between text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Categories</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-400">
            {categories.length}
          </div>
          <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Product lines & services</div>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product SKU or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 px-3 py-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Inventory Item</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-card,#ffffff)] dark:bg-[#151924] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
              <tr>
                <th className="p-3.5">SKU & Item Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-center">In Stock</th>
                <th className="p-3.5 text-center">Reorder Level</th>
                <th className="p-3.5 text-right">Unit Price</th>
                <th className="p-3.5 text-right">Total Value</th>
                <th className="p-3.5 text-center">Stock Actions</th>
                <th className="p-3.5 text-right">Link to Deal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#181d28] text-[var(--text-secondary,#475569)] dark:text-slate-300">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    No products found in inventory.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.stockQuantity <= item.reorderLevel;
                  return (
                    <tr key={item.id} className="hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#161b26] transition-colors">
                      <td className="p-3.5 font-medium text-[var(--text-primary,#0f172a)] dark:text-white">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">SKU: {item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#181e2b] text-blue-300 text-[10px] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono">
                        <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${ isLow ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400' }`}>
                          {item.stockQuantity} units
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono text-[var(--text-muted,#64748b)] dark:text-slate-400">{item.reorderLevel} units</td>
                      <td className="p-3.5 text-right font-mono text-[var(--text-secondary,#475569)] dark:text-slate-300">${item.unitPrice.toLocaleString()}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                        ${(item.stockQuantity * item.unitPrice).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => updateInventoryStock(item.id, 5)}
                            className="px-2 py-0.5 bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] hover:bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold cursor-pointer"
                            title="Add 5 units"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => updateInventoryStock(item.id, -1)}
                            className="px-2 py-0.5 bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] hover:bg-rose-500/20 text-rose-400 rounded text-[10px] font-bold cursor-pointer"
                            title="Deduct 1 unit"
                          >
                            -1
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedItemForDeal(item);
                              setIsLinkDealModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] hover:bg-blue-500/20 text-blue-400 text-[11px] transition-colors cursor-pointer"
                          >
                            <Link className="w-3 h-3" /> Link Deal
                          </button>
                          <button
                            onClick={() => deleteInventoryItem(item.id)}
                            className="p-1 rounded hover:bg-rose-500/20 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212838] w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#212838] pb-3">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                Add New Inventory Item / Product
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SKU-HW-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Software, Hardware, Services..."
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Barcode Scanner Rugged"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="0"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(Number(e.target.value))}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details..."
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Save Product to Inventory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LINK STOCK TO DEAL MODAL */}
      {isLinkDealModalOpen && selectedItemForDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212838] w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#212838] pb-3">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm flex items-center gap-2">
                <Link className="w-4 h-4 text-blue-400" />
                Deduct Stock for Closed Deal
              </h3>
              <button onClick={() => setIsLinkDealModalOpen(false)} className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-3 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248]">
              <div className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{selectedItemForDeal.name}</div>
              <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
                Current Stock: <strong className="text-emerald-400">{selectedItemForDeal.stockQuantity} units</strong>
              </div>
            </div>

            <form onSubmit={handleLinkStockToDeal} className="space-y-3">
              <div>
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Select Deal / Opportunity</label>
                <select
                  required
                  value={selectedDealId}
                  onChange={(e) => setSelectedDealId(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                >
                  <option value="">-- Choose Opportunity --</option>
                  {opportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.name} (${opp.amount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium mb-1">Quantity to Deduct from Inventory</label>
                <input
                  type="number"
                  min="1"
                  max={selectedItemForDeal.stockQuantity}
                  value={qtyToDeduct}
                  onChange={(e) => setQtyToDeduct(Number(e.target.value))}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Confirm Stock Deduction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
