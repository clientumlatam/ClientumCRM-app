import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Download,
  Search,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  Tag,
  PlusCircle,
  Video,
  Mail,
  User,
  MessageSquare,
  ChevronRight,
  Send,
  X,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';

interface PublicResourcesPageProps {
  onNavigate: (path: PublicRoutePath) => void;
}

interface BlogPost {
  id: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  summary: string;
  author: string;
  content: string;
}

export const PublicResourcesPage: React.FC<PublicResourcesPageProps> = ({ onNavigate }) => {
  const { showToast } = useCRM();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [consultPost, setConsultPost] = useState<BlogPost | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Article Form
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Marketing Digital',
    author: '',
    summary: '',
    content: ''
  });

  const posts: BlogPost[] = [
    {
      id: 'post-1',
      category: 'Marketing Digital',
      date: '15 de Agosto, 2026',
      readTime: '5 min de lectura',
      title: 'Cómo mejorar el SEO y Arquitectura Web de tu PyME en 2026',
      summary: 'Descubre las mejores prácticas de arquitectura semántica, optimización de velocidad de carga y contenidos de valor para disparar tus visitas orgánicas gratis.',
      author: 'Martín Rodríguez · Lead Architect',
      content: `En 2026, el posicionamiento en motores de búsqueda ya no se trata solo de repetir palabras clave, sino de optimizar la experiencia completa de navegación (Core Web Vitals) y estructurar datos comprensibles tanto para Google como para modelos de búsqueda generativa (AI Overviews).

Pilares clave para PyMEs:
1. Arquitectura Semántica: Cada página debe tener un propósito unívoco con encabezados H1-H3 jerarquizados, metadatos enriquecidos y OpenGraph configurado.
2. Velocidad de Carga Instantánea (< 1 segundo): Las aplicaciones desarrolladas en React + Vite comprimidas con CDN en Edge logran tasas de conversión 3x superiores a plataformas monolíticas lentas.
3. Contenido de Autoridad Local: Publicar casos reales de éxito, guías del sector y testimonios con geolocalización regional en Argentina y el Cono Sur posiciona a tu negocio como líder de confianza.`
    },
    {
      id: 'post-2',
      category: 'Diseño & E-Commerce',
      date: '10 de Agosto, 2026',
      readTime: '7 min de lectura',
      title: 'Tendencias en Comercio Electrónico Omnicanal y WhatsApp IA',
      summary: 'Cómo conectar las experiencias físicas en tu local (como códigos QR de mesa) con tus canales digitales de venta y mensajería en piloto automático.',
      author: 'Equipo Comercial Clientum',
      content: `El cliente moderno no distingue entre comprar por mostrador o por WhatsApp: espera que su carrito, historial de compras y puntos de fidelidad estén sincronizados en tiempo real.

Estrategia omnicanal en 3 pasos:
1. Puntos de contacto QR en tiendas físicas: Al escanear un código en el local, el cliente inicia una conversación por WhatsApp donde el bot le comparte catálogo, promociones del día y link de pago Mercado Pago.
2. Recupero de carritos abandonados: Si un comprador consulta un producto y no finaliza la compra, un workflow automatizado le envía un recordatorio con descuento exclusivo a las 2 horas.
3. Emisión instantánea de Factura AFIP y entrega: Una vez acreditado el pago, el bot despacha la factura electrónica en PDF y notifica al depósito para el armado del pedido.`
    },
    {
      id: 'post-3',
      category: 'Estrategia Pyme',
      date: '02 de Agosto, 2026',
      readTime: '6 min de lectura',
      title: 'Estrategias de Marketing Digital & Embudo Comercial Automatizado',
      summary: 'Descubre el embudo de ventas que duplica cierres de transacciones comerciales reduciendo el esfuerzo operativo del equipo de ventas.',
      author: 'Sofía Méndez · Growth Specialist',
      content: `Muchas PyMEs pierden el 60% de sus potenciales clientes por demoras en la primera respuesta. La automatización del embudo permite capturar el interés en el instante exacto en que surge.

Estructura del embudo de alta conversión:
1. Atracción: Campañas de Google Ads y prospección B2B en Google Maps dirigidas a tomadores de decisión.
2. Calificación Inmediata (< 2 minutos): El bot calificador hace 3 preguntas clave (volumen mensual, rubro y presupuesto estimado).
3. Agendamiento y Derivación: Los prospectos calificados se asignan al vendedor especialista con recordatorio automático en Google Calendar.
4. Cierre y Seguimiento: Si la cotización no tiene respuesta en 48h, se activa una secuencia inteligente de follow-up por WhatsApp.`
    },
    {
      id: 'post-4',
      category: 'Tecnología ERP',
      date: '25 de Julio, 2026',
      readTime: '8 min de lectura',
      title: 'El Impacto de la Inteligencia Artificial en Sistemas ERP',
      summary: 'Por qué automatizar las tareas repetitivas y la conciliación de facturas de AFIP libera hasta un 40% del tiempo de tu personal de administración.',
      author: 'Diego Fernández · CTO',
      content: `La gestión administrativa tradicional insume cientos de horas en carga manual de comprobantes, conciliación de extractos bancarios y tipeo de facturas en la web de AFIP.

La revolución de los Agentes IA aplicados a ERP:
1. Conciliación automática de cobranzas: El agente de IA cruza los comprobantes de transferencia bancaria y Mercado Pago con los presupuestos pendientes del CRM, aprobándolos al instante.
2. Facturación masiva con CAE: Generación en lote de Facturas A, B y C con validación de CUIT online ante los servidores de AFIP.
3. Reportes ejecutivos de flujo de fondos: En lugar de procesar planillas complejas, el directivo recibe un resumen diario por WhatsApp con margen bruto, cuentas por cobrar y alertas de stock crítico.`
    }
  ];

  const categories = ['all', 'Marketing Digital', 'Diseño & E-Commerce', 'Estrategia Pyme', 'Tecnología ERP'];

  const filteredPosts = posts.filter((p) => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.author || !newPost.summary) {
      showToast('Por favor completa los campos obligatorios', 'warning');
      return;
    }
    showToast('Artículo enviado a revisión editorial con éxito', 'success');
    setIsAddModalOpen(false);
    setNewPost({ title: '', category: 'Marketing Digital', author: '', summary: '', content: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-['Plus_Jakarta_Sans',sans-serif] bg-white text-slate-900">
      
      {/* 1. Header Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Base de Conocimientos & Novedades</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Blog & Publicaciones de Clientum
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Guías estratégicas, tendencias en software y tutoriales para acelerar la transformación de tu empresa.
        </p>

        {/* Action Controls: Search, Add Article, Stats */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-mono">
              Total publicaciones: {posts.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748b] dark:text-white dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-blue-500 outline-none w-52 sm:w-64"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Añadir Nuevo Artículo</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-[#0f172a] dark:text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todos los Temas' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Grid of 4 Main Blog Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="rounded-3xl bg-slate-50 border border-slate-200 p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 font-bold">
                  {post.category}
                </span>
                <div className="flex items-center gap-3 text-[#64748b] dark:text-white dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                {post.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {post.summary}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <User className="w-4 h-4 text-blue-600" />
                <span>{post.author}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedPost(post)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <span>Leer artículo completo</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setConsultPost(post)}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Consultar sobre este tema</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* 3. Ebooks y Guías PDF + Videos Educativos */}
      <section className="space-y-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-mono uppercase text-blue-600 font-bold">Material de Descarga Directa</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Ebooks y Guías PDF</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ebook 1 */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Ebook: Optimización E-commerce</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Todo sobre conversiones y control de stock omnicanal.
              </p>
            </div>

            <button
              onClick={() => showToast('Descargando Ebook de Optimización E-commerce (PDF)...', 'success')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#f8fafc] dark:bg-slate-900 hover:bg-[#eef1f6] hover:dark:bg-slate-800 text-[#0f172a] dark:text-white dark:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Descargar PDF Gratis</span>
            </button>
          </div>

          {/* Ebook 2 */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Guía de Automatización ERP</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cómo enlazar bots de WhatsApp con transacciones.
              </p>
            </div>

            <button
              onClick={() => showToast('Te hemos enviado la Guía de Automatización ERP a tu correo electrónico.', 'success')}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Solicitar por Email</span>
            </button>
          </div>

          {/* Video Tutorials */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Videos Educativos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accede a nuestra biblioteca de tutoriales para comprender el uso de herramientas CRM integradas.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/academia')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm shadow-emerald-600/20"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Ver Tutoriales en Video</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modal: Full Article Reader */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                {selectedPost.category}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-lg text-[#64748b] dark:text-white dark:text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {selectedPost.title}
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span>{selectedPost.author}</span>
                <span>•</span>
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span>{selectedPost.readTime}</span>
              </div>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {selectedPost.content}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  setSelectedPost(null);
                  setConsultPost(selectedPost);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                Consultar con un Especialista
              </button>

              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Consult on Topic */}
      {consultPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Consultar sobre este tema</h3>
              <button onClick={() => setConsultPost(null)} className="text-[#64748b] dark:text-white dark:text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Envía tu consulta respecto a: <strong className="text-slate-900">{consultPost.title}</strong>
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Consulta enviada. Un asesor técnico se comunicará a la brevedad.', 'success');
                setConsultPost(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tu Nombre *</label>
                <input required type="text" placeholder="Ej: Marcelo Rossi" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email / WhatsApp *</label>
                <input required type="text" placeholder="+54 9 298 4..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pregunta o Requerimiento *</label>
                <textarea rows={3} required placeholder="¿Cómo puedo aplicar esto a mi empresa?" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setConsultPost(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer">
                  Enviar Consulta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Article */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                <span>Añadir Nuevo Artículo</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#64748b] dark:text-white dark:text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título de la Publicación *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Nuevas regulaciones de AFIP para e-Commerce en 2026"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  >
                    <option value="Marketing Digital">Marketing Digital</option>
                    <option value="Diseño & E-Commerce">Diseño & E-Commerce</option>
                    <option value="Estrategia Pyme">Estrategia Pyme</option>
                    <option value="Tecnología ERP">Tecnología ERP</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Autor / Cargo *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej: Marcelo Rossi · Consultor"
                    value={newPost.author}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Resumen Corto *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Breve sinopsis para la tarjeta del blog..."
                  value={newPost.summary}
                  onChange={(e) => setNewPost({ ...newPost, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contenido Principal</label>
                <textarea
                  rows={4}
                  placeholder="Redacta el contenido o borrador del artículo..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer shadow-md shadow-blue-600/20"
                >
                  Publicar Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
