import React, { useState } from 'react';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Minus,
  Trash2,
  X,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Store,
  MapPin,
  Phone,
  Tag
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  variants?: { name: string; options: string[] }[];
}

interface CartItem {
  product: ProductItem;
  quantity: number;
  selectedVariant?: string;
}

export const TiendaDigitalView: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();

  const [selectedBranch, setSelectedBranch] = useState('Casa Central - General Roca');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sample store products
  const products: ProductItem[] = [
    {
      id: 'prod-1',
      name: 'Implementación CRM Comercial Express',
      category: 'Servicios',
      description: 'Puesta en marcha de pipeline de ventas, migración de base de datos de hasta 500 contactos y capacitación.',
      price: 150000,
      badge: 'Más Vendido',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
      variants: [
        { name: 'Plan', options: ['Básico (1-3 usuarios)', 'PyME (4-10 usuarios)', 'Corporativo (Ilimitado)'] }
      ]
    },
    {
      id: 'prod-2',
      name: 'Setup Facturación AFIP Electrónica WSFE',
      category: 'ERP & Fiscal',
      description: 'Configuración de certificados digitales, vinculación con clave fiscal nivel 3 y emisión automática con CAE.',
      price: 90000,
      badge: 'Homologado',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod-3',
      name: 'Bot WhatsApp IA Autónomo (Gemini 3.7)',
      category: 'Automatizaciones',
      description: 'Entrenamiento con catálogo de productos, respuestas 24/7, derivación de leads calificados y cotización en tiempo real.',
      price: 120000,
      badge: 'IA Avanzada',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod-4',
      name: 'Módulo de Rutas & Prospección Google Maps',
      category: 'Servicios',
      description: 'Extracción masiva de negocios locales con teléfono verificado y optimización de rutas para vendedores de calle.',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod-5',
      name: 'Carta QR & Comandas para Bares / Gastronomía',
      category: 'Gastronomía & Retail',
      description: 'Menú digital dinámico con fotos, cálculo de mesa, división de cuentas y checkout directo a WhatsApp del mozo.',
      price: 65000,
      badge: 'Especial Gastronomía',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod-6',
      name: 'Curso In-Company: Metodología MEDDIC y WhatsApp',
      category: 'Capacitación',
      description: 'Taller intensivo de 6 horas para equipos comerciales dictado por consultores sénior de Clientum.',
      price: 180000,
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, selectedVariant: product.variants?.[0]?.options[0] }];
    });
    setIsCartOpen(true);
    showToast(`"${product.name}" agregado al pedido`, 'success');
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let text = `🛒 *Nuevo Pedido desde la Tienda Digital*\n`;
    text += `📍 *Sucursal seleccionada:* ${selectedBranch}\n\n`;
    text += `*Ítems solicitados:*\n`;

    cart.forEach((item, i) => {
      text += `${i + 1}. *${item.product.name}* (x${item.quantity})\n`;
      if (item.selectedVariant) {
        text += `   ↳ Opción: ${item.selectedVariant}\n`;
      }
      text += `   ↳ Subtotal: $ ${(item.product.price * item.quantity).toLocaleString('es-AR')}\n`;
    });

    text += `\n💰 *Total del Pedido:* $ ${cartSubtotal.toLocaleString('es-AR')}\n\n`;
    text += `Por favor confirmen disponibilidad y datos para la emisión de la Factura AFIP correspondiente. ¡Muchas gracias!`;

    const url = `https://wa.me/542984510883?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    triggerConfetti();
    showToast('Pedido enviado a WhatsApp con éxito', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white text-slate-900 text-xs min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Store Banner */}
      <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Catálogo Digital Público
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Patagonia Argentina
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Store className="w-6 h-6 text-blue-600" />
              Tienda Oficial Clientum Latam
            </h1>
            <p className="text-xs text-slate-600">
              Explora soluciones, planes y servicios con cotización en tiempo real y checkout directo a WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Branch Selector */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
            >
              <option value="Casa Central - General Roca">Casa Central - General Roca</option>
              <option value="Sucursal Alto Valle - Neuquén">Sucursal Alto Valle - Neuquén</option>
              <option value="Región Metropolitana - Buenos Aires">Región Metropolitana - Buenos Aires</option>
            </select>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer shadow-md shadow-blue-600/20"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white shadow-xs">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {['all', 'Servicios', 'Automatizaciones', 'ERP & Fiscal', 'Gastronomía & Retail', 'Capacitación'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todos los Productos' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#64748b] dark:text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en catálogo..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col hover:border-blue-300 hover:shadow-md transition-all group shadow-xs"
            >
              {/* Product Image */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                    {product.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-slate-800 border border-slate-200 shadow-xs">
                  {product.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#64748b] dark:text-slate-400 block font-semibold">Precio Base</span>
                    <div className="text-base font-extrabold text-blue-600">
                      $ {product.price.toLocaleString('es-AR')}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-md bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Tu Pedido Comercial</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-lg text-[#64748b] dark:text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-[#64748b] dark:text-slate-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto opacity-40" />
                  <p>Tu carrito está vacío.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{item.product.name}</h4>
                        {item.selectedVariant && (
                          <span className="text-[10px] text-blue-600 font-semibold">{item.selectedVariant}</span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        $ {(item.product.price * item.quantity).toLocaleString('es-AR')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-slate-900 text-xs px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => updateQuantity(item.product.id, -item.quantity)}
                        className="text-[#64748b] dark:text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>Subtotal Estimado</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    $ {cartSubtotal.toLocaleString('es-AR')}
                  </span>
                </div>

                <p className="text-[10px] text-slate-500">
                  Al confirmar, serás redirigido a WhatsApp con el detalle del pedido para coordinar pago y facturación AFIP.
                </p>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Completar Pedido por WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
