import React, { useState } from 'react';
import {
  Boxes,
  Package,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Building2,
  Briefcase,
  History,
  TrendingDown,
  X,
  Zap,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { InventoryItem, Opportunity } from '../../types';

interface StockMovementLog {
  id: string;
  timestamp: string;
  dealTitle: string;
  productName: string;
  sku: string;
  quantityDeducted: number;
  warehouseName: string;
  locationString: string;
  remainingStock: number;
}

export const WarehouseErpModule: React.FC = () => {
  const {
    inventory,
    opportunities,
    updateInventoryStock,
    moveOpportunityStage,
    addInventoryItem,
    showToast,
    triggerConfetti,
    setActiveTab,
  } = useCRM();

  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Sale closure simulation state
  const [selectedDealId, setSelectedDealId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [deductQuantity, setDeductQuantity] = useState<number>(1);
  const [isProcessingClosure, setIsProcessingClosure] = useState(false);

  // New product form state
  const [newSku, setNewSku] = useState('SKU-RACK-SRV');
  const [newName, setNewName] = useState('Switch Gestionable 48 Puertos PoE+');
  const [newCategory, setNewCategory] = useState('Hardware');
  const [newPrice, setNewPrice] = useState('850');
  const [newStock, setNewStock] = useState('10');
  const [newReorder, setNewReorder] = useState('3');
  const [newWarehouse, setNewWarehouse] = useState('Depósito Central San Martín');
  const [newAisle, setNewAisle] = useState('Pasillo C-2');
  const [newRack, setNewRack] = useState('Rack Redes-04');
  const [newShelf, setNewShelf] = useState('Nivel 3');

  // Stock movement audit logs
  const [movementLogs, setMovementLogs] = useState<StockMovementLog[]>([
    {
      id: 'mov-1',
      timestamp: 'Hoy, 10:45 AM',
      dealTitle: 'ABEPOL S.R.L. - Expansión Enterprise',
      productName: 'Licencia ClientumCRM Enterprise (Anual)',
      sku: 'SKU-CLIENTUM-ENT',
      quantityDeducted: 2,
      warehouseName: 'Depósito Central San Martín',
      locationString: 'Pasillo Digital-A · Servidor SSD-01',
      remainingStock: 25,
    },
    {
      id: 'mov-2',
      timestamp: 'Ayer, 16:20 PM',
      dealTitle: 'Distribuidora San Telmo - Lectores Planta',
      productName: 'Lector de Código de Barras Industrial',
      sku: 'SKU-HW-RDR',
      quantityDeducted: 1,
      warehouseName: 'Depósito Central San Martín',
      locationString: 'Pasillo B-4 · Estantería 08 · Nivel 2',
      remainingStock: 2,
    },
  ]);

  // Open opportunities available for sale closure
  const openOpportunities = opportunities.filter((o) => o.stage !== 'won' && o.stage !== 'lost');

  // Filtered inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesWarehouse =
      selectedWarehouseFilter === 'all' ||
      item.warehouseLocation?.warehouse === selectedWarehouseFilter;

    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.warehouseLocationString &&
        item.warehouseLocationString.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesWarehouse && matchesSearch;
  });

  // Unique warehouses for filter
  const warehouses = Array.from(
    new Set(
      inventory
        .map((i) => i.warehouseLocation?.warehouse)
        .filter((w): w is string => Boolean(w))
    )
  );

  // Handle closing a deal and automatically deducting stock
  const handleCloseSaleAndDeductStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealId || !selectedProductId) {
      showToast('Seleccione la oportunidad y el producto para cerrar la venta', 'warning');
      return;
    }

    const targetItem = inventory.find((i) => i.id === selectedProductId);
    const targetDeal = opportunities.find((o) => o.id === selectedDealId);

    if (!targetItem || !targetDeal) return;

    if (targetItem.stockQuantity < deductQuantity) {
      showToast(
        `Stock insuficiente de ${targetItem.name} (${targetItem.stockQuantity} un. disponible, solicitado ${deductQuantity})`,
        'error'
      );
      return;
    }

    setIsProcessingClosure(true);

    setTimeout(() => {
      // 1. Move deal to won stage
      moveOpportunityStage(targetDeal.id, 'won');

      // 2. Automatically deduct stock
      updateInventoryStock(targetItem.id, -deductQuantity);

      const remaining = targetItem.stockQuantity - deductQuantity;

      // 3. Log movement audit
      const dealDisplayName = targetDeal.name || targetDeal.title || 'Negocio Ganado';
      const newLog: StockMovementLog = {
        id: `mov-${Date.now()}`,
        timestamp: 'Ahora mismo',
        dealTitle: dealDisplayName,
        productName: targetItem.name,
        sku: targetItem.sku,
        quantityDeducted: deductQuantity,
        warehouseName: targetItem.warehouseLocation?.warehouse || 'Depósito Central',
        locationString: targetItem.warehouseLocationString || 'Ubicación General',
        remainingStock: remaining,
      };

      setMovementLogs((prev) => [newLog, ...prev]);
      setIsProcessingClosure(false);
      setIsDeductModalOpen(false);

      showToast(
        `¡Venta cerrada! Negocio "${dealDisplayName}" ganado. Deducidas ${deductQuantity} un. de ${targetItem.sku} en ${newLog.warehouseName}`,
        'success'
      );
      triggerConfetti();
    }, 700);
  };

  // Handle creating a new inventory product with warehouse location
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(newPrice) || 100;
    const stock = parseInt(newStock, 10) || 1;
    const reorder = parseInt(newReorder, 10) || 5;

    const locString = `${newWarehouse} · ${newAisle} · ${newRack} · ${newShelf}`;

    addInventoryItem({
      sku: newSku,
      name: newName,
      category: newCategory,
      stockQuantity: stock,
      reorderLevel: reorder,
      unitPrice: price,
      description: `Producto catalogado en ERP. Ubicado en ${locString}.`,
      warehouseLocation: {
        warehouse: newWarehouse,
        aisle: newAisle,
        rack: newRack,
        shelf: newShelf,
      },
      warehouseLocationString: locString,
    });

    setIsAddProductModalOpen(false);
    showToast(`Producto ${newSku} catalogado con éxito en ${newWarehouse}`, 'success');
  };

  return (
    <div
      className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-xs transition-colors space-y-5"
      id="warehouse-erp-module"
    >
      {/* Header Banner & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] dark:text-white">
                Catálogo ERP, Almacenes & Deducción Automática por Venta
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 font-mono">
                Multi-Depósito Activo
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
              Rastreo físico de estanterías y pasillos con sincronización automática al cerrar oportunidades ganadas en CRM.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (openOpportunities.length > 0) {
                setSelectedDealId(openOpportunities[0].id);
              }
              if (inventory.length > 0) {
                setSelectedProductId(inventory[0].id);
              }
              setIsDeductModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Zap size={14} />
            <span>Cerrar Venta & Deducir Stock</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddProductModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)]/80 text-[var(--text-primary)] text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Warehouse Filter Chips & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1">
          <button
            type="button"
            onClick={() => setSelectedWarehouseFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${ selectedWarehouseFilter === 'all' ? 'bg-teal-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]' }`}
          >
            Todos los Depósitos ({inventory.length})
          </button>
          {warehouses.map((wh) => (
            <button
              key={wh}
              type="button"
              onClick={() => setSelectedWarehouseFilter(wh)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${ selectedWarehouseFilter === wh ? 'bg-teal-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]' }`}
            >
              <MapPin size={12} />
              <span>{wh}</span>
            </button>
          ))}
        </div>

        <div className="relative shrink-0 w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por SKU, nombre o pasillo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Product Catalog Grid with Warehouse Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredInventory.map((item) => {
          const isCritical = item.stockQuantity <= item.reorderLevel;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all space-y-3 ${ isCritical ? 'border-amber-400/60 bg-amber-50/15 dark:bg-amber-950/20' : 'border-[var(--border-subtle)] bg-[var(--bg-muted)]/30 hover:bg-[var(--bg-muted)]/60' }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-bold text-teal-600 dark:text-teal-400 block">
                    {item.sku}
                  </span>
                  <h4 className="font-bold text-xs text-[var(--text-primary)] dark:text-white truncate">
                    {item.name}
                  </h4>
                  <span className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Categoría: {item.category}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-lg font-extrabold font-mono ${ isCritical ? 'text-amber-500' : 'text-emerald-500' }`}
                  >
                    {item.stockQuantity} un.
                  </div>
                  <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Punto de reorden: {item.reorderLevel}
                  </div>
                </div>
              </div>

              {/* Physical Warehouse Location Pin */}
              <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200">
                  <MapPin size={12} className="text-teal-500 shrink-0" />
                  <span className="truncate">
                    {item.warehouseLocation?.warehouse || 'Depósito Central'}
                  </span>
                </div>

                <div className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono flex items-center gap-2 flex-wrap">
                  {item.warehouseLocation?.aisle && (
                    <span className="px-1.5 py-0.5 rounded-md bg-[var(--bg-muted)]">
                      {item.warehouseLocation.aisle}
                    </span>
                  )}
                  {item.warehouseLocation?.rack && (
                    <span className="px-1.5 py-0.5 rounded-md bg-[var(--bg-muted)]">
                      {item.warehouseLocation.rack}
                    </span>
                  )}
                  {item.warehouseLocation?.shelf && (
                    <span className="px-1.5 py-0.5 rounded-md bg-[var(--bg-muted)]">
                      {item.warehouseLocation.shelf}
                    </span>
                  )}
                  {item.warehouseLocation?.bin && (
                    <span className="px-1.5 py-0.5 rounded-md bg-[var(--bg-muted)]">
                      {item.warehouseLocation.bin}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Fast Restock action */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  $ {item.unitPrice.toLocaleString('es-AR')}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      updateInventoryStock(item.id, 10);
                      showToast(`+10 unidades reabastecidas en ${item.name}`, 'success');
                    }}
                    className="px-2 py-1 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[10px] font-semibold cursor-pointer transition-colors"
                  >
                    +10 Reponer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Deduction Audit Trail (CRM Integration Stream) */}
      <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <History size={14} className="text-teal-500" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Registro de Auditoría: Deducciones Automáticas por Cierre de Oportunidades
            </span>
          </div>
          <span className="text-[11px]">Sincronización en tiempo real</span>
        </div>

        <div className="divide-y divide-[var(--border-subtle)] rounded-xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-muted)]/20 text-xs">
          {movementLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[var(--bg-muted)]/60 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-primary)] dark:text-white">
                    {log.dealTitle}
                  </span>
                  <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400">
                    ({log.sku})
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin size={11} className="text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                  <span>Despachado desde: {log.warehouseName} ({log.locationString})</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right shrink-0">
                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{log.timestamp}</div>
                <div className="flex items-center gap-1 font-mono font-bold text-rose-500">
                  <TrendingDown size={13} />
                  <span>-{log.quantityDeducted} un.</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
                  Stock remanente: <strong className="text-[var(--text-primary)]">{log.remainingStock}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Close Deal & Automatically Deduct Stock */}
      {isDeductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600/10 text-teal-600 flex items-center justify-center">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                    Cierre de Venta con Deducción de Stock
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Cambia la oportunidad a 'Ganada' y rebaja el inventario del depósito correspondiente.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeductModalOpen(false)}
                className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCloseSaleAndDeductStock} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                  Oportunidad en Pipeline para Cerrar
                </label>
                <select
                  required
                  value={selectedDealId}
                  onChange={(e) => setSelectedDealId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)] font-medium"
                >
                  {openOpportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.name || opp.title} — $ {opp.amount.toLocaleString('es-AR')} ({opp.stage})
                    </option>
                  ))}
                  {openOpportunities.length === 0 && (
                    <option value="">No hay oportunidades abiertas (cree una primero)</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Producto a Despachar
                  </label>
                  <select
                    required
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)] font-medium"
                  >
                    {inventory.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.stockQuantity} un. disp.)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Cantidad Vendida
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={deductQuantity}
                    onChange={(e) => setDeductQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)] font-mono font-bold"
                  />
                </div>
              </div>

              {/* Selected product location confirmation */}
              {selectedProductId && (
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs space-y-1">
                  <div className="font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>Ubicación de Salida en Almacén:</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-mono">
                    {inventory.find((i) => i.id === selectedProductId)?.warehouseLocationString ||
                      'Depósito Central San Martín'}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeductModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessingClosure || !selectedDealId}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {isProcessingClosure ? 'Procesando Venta...' : 'Cerrar Venta & Deducir Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Catalog Product with Warehouse Location */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600/10 text-teal-600 flex items-center justify-center">
                  <Boxes size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                    Catalogar Nuevo Producto en Almacén
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Defina código SKU, precio de lista y coordenadas exactas en depósito.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Código SKU
                  </label>
                  <input
                    type="text"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    required
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Precio Unitario ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Punto Reorden
                  </label>
                  <input
                    type="number"
                    required
                    value={newReorder}
                    onChange={(e) => setNewReorder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-primary)] font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] space-y-2">
                <span className="font-bold text-[11px] text-[var(--text-primary)] block">
                  Ubicación Física en Almacén
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">
                      Depósito Principal
                    </label>
                    <select
                      value={newWarehouse}
                      onChange={(e) => setNewWarehouse(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                    >
                      <option value="Depósito Central San Martín">Depósito Central San Martín</option>
                      <option value="Depósito Cloud AWS">Depósito Cloud AWS</option>
                      <option value="Datacenter Dock Sud">Datacenter Dock Sud</option>
                      <option value="Oficina Central Puerto Madero">Oficina Central Puerto Madero</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">
                      Pasillo / Zona
                    </label>
                    <input
                      type="text"
                      value={newAisle}
                      onChange={(e) => setNewAisle(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">
                      Estantería / Rack
                    </label>
                    <input
                      type="text"
                      value={newRack}
                      onChange={(e) => setNewRack(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">
                      Nivel / Estante
                    </label>
                    <input
                      type="text"
                      value={newShelf}
                      onChange={(e) => setNewShelf(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer transition-all shadow-xs"
                >
                  Catalogar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
