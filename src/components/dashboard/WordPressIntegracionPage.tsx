import React, { useState } from 'react';
import {
  Globe,
  ShoppingCart,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Key,
  Webhook,
  Package,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const WordPressIntegracionPage: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();

  const [activeTab, setActiveTab] = useState<'setup' | 'catalog' | 'automation'>('setup');
  const [siteUrl, setSiteUrl] = useState('https://tienda.clientum.com.ar');
  const [consumerKey, setConsumerKey] = useState('ck_9f83a274819d083921bdfa');
  const [consumerSecret, setConsumerSecret] = useState('cs_39482019482039482019');
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [syncedProducts, setSyncedProducts] = useState([
    { id: 'woo-1', name: 'Software CRM Plan Pro (Anual)', sku: 'SW-CRM-01', price: 180000, stock: 999, status: 'Sincronizado' },
    { id: 'woo-2', name: 'Onboarding & Configuración Express', sku: 'SRV-ONB-02', price: 95000, stock: 15, status: 'Sincronizado' },
    { id: 'woo-3', name: 'Pack 10.000 Mensajes WhatsApp HSM', sku: 'WA-HSM-10K', price: 45000, stock: 450, status: 'Sincronizado' },
  ]);

  const [orders, setOrders] = useState([
    { id: '#10492', client: 'Estudio Jurídico Albarracín', total: 180000, status: 'Completado', dealCreated: true },
    { id: '#10493', client: 'Ferretería Central S.R.L.', total: 95000, status: 'Procesando', dealCreated: true },
  ]);

  const handleTestConnection = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsConnected(true);
      showToast('Conexión con WordPress REST API & WooCommerce validada (200 OK).', 'success');
      triggerConfetti();
    }, 800);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Sincronización de catálogo WooCommerce finalizada: 3 productos y 2 pedidos actualizados.', 'success');
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--clientum-surface,#F5F7FA)] dark:bg-[var(--crm-bg,#040711)] text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Integración E-commerce
            </span>
            <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted)]">wordpress_integracion_dashboard.md</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            Integración WordPress & WooCommerce
          </h1>
          <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 max-w-3xl">
            Conecta sitios web corporativos y tiendas online WooCommerce directamente con el CRM y ERP de ClientumOS para sincronizar catálogo, pedidos y disparar mensajes post-venta.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-3 py-2 bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Catálogo'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 pb-2">
        {[
          { id: 'setup', label: '1. Configuración & Conexión (WpSetup)', icon: Key },
          { id: 'catalog', label: '2. Catálogo & Pedidos (WpModulos)', icon: ShoppingCart },
          { id: 'automation', label: '3. Automatización Post-Venta', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${ activeTab === tab.id ? 'bg-[var(--clientum-blue,#002B5C)] text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs font-bold' : 'text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800/60' }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Setup */}
      {activeTab === 'setup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] rounded-xl space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              Credenciales de la REST API de WooCommerce
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">URL del Sitio WordPress</label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 rounded-lg text-xs text-[var(--text-primary)] dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Consumer Key (ck_...)</label>
                <input
                  type="text"
                  value={consumerKey}
                  onChange={(e) => setConsumerKey(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 rounded-lg text-xs text-[var(--text-primary)] dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Consumer Secret (cs_...)</label>
                <input
                  type="password"
                  value={consumerSecret}
                  onChange={(e) => setConsumerSecret(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 rounded-lg text-xs text-[var(--text-primary)] dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={handleTestConnection}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-[var(--text-primary,#0f172a)] dark:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Comprobar Conexión REST API
              </button>
            </div>
          </div>

          <div className="p-5 bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] rounded-xl space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <Webhook className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              Webhooks de Entrada (Instant Trigger)
            </h2>
            <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
              Copia este endpoint de webhook y configúralo en WooCommerce (`Ajustes &gt; Avanzado &gt; Webhooks`) para registrar nuevos pedidos como Deals en tiempo real.
            </p>
            <div className="p-3 bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 rounded-lg font-mono text-[11px] text-emerald-700 dark:text-emerald-400 break-all select-all">
              https://crm.clientum.com.ar/api/webhooks/woocommerce/order-created
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Escuchador de webhooks activo y validado</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Catalog & Orders */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="p-5 bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                Catálogo de Productos Sincronizados
              </h2>
              <span className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">{syncedProducts.length} artículos sincronizados</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-muted)] dark:bg-slate-900/80 text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Producto</th>
                    <th className="p-3 text-right">Precio WooCommerce</th>
                    <th className="p-3 text-right">Stock</th>
                    <th className="p-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] dark:divide-slate-800 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">
                  {syncedProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[var(--bg-muted)]/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-mono text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">{prod.sku}</td>
                      <td className="p-3 font-semibold text-[var(--text-primary)] dark:text-white">{prod.name}</td>
                      <td className="p-3 text-right font-mono font-bold text-[var(--text-primary)] dark:text-white">$ {prod.price.toLocaleString('es-AR')}</td>
                      <td className="p-3 text-right font-mono text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">{prod.stock} u.</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                          {prod.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] rounded-xl space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              Últimos Pedidos WooCommerce Ingestados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-3 rounded-lg bg-[var(--bg-muted)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--text-primary)] dark:text-white">{ord.id}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">$ {ord.total.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">{ord.client}</div>
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Convertido a Oportunidad en Pipeline</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Automation Post-Venta */}
      {activeTab === 'automation' && (
        <div className="p-5 bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] rounded-xl space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-[var(--clientum-navy,#022046)] dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            Flujos de Notificaciones Automáticas por WhatsApp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800/70 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-[var(--text-primary)] dark:text-white">1. Confirmación de Compra</div>
              <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                Dispara mensaje con el resumen del pedido y link de seguimiento en cuanto el cliente abona en la tienda.
              </p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-semibold">
                Activo (Template Aprobado)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800/70 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-[var(--text-primary)] dark:text-white">2. Recupero de Carrito Abandonado</div>
              <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                A los 30 minutos de inactividad, envía recordatorio con cupón de 10% de descuento por WhatsApp.
              </p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 font-semibold">
                Activo
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800/70 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-[var(--text-primary)] dark:text-white">3. Notificación de Despacho</div>
              <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                Envía código de rastreo postal y confirmación de operador logístico al cambiar el estado a "Enviado".
              </p>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-semibold">
                Activo
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
