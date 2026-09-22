import React, { useState } from 'react';
import {
  Building2,
  Landmark,
  Tv,
  Home,
  Sprout,
  ShoppingBag,
  HeartPulse,
  Truck,
  Wrench,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';

interface ClientPortfolioSectionProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const ClientPortfolioSection: React.FC<ClientPortfolioSectionProps> = ({ onNavigate }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const clientCategories = [
    { id: 'all', label: 'Todos los Sectores', icon: <Building2 className="w-4 h-4" /> },
    { id: 'publico', label: 'Sector Público & Medios', icon: <Landmark className="w-4 h-4 text-purple-600" /> },
    { id: 'realestate', label: 'Real Estate & Inmobiliario', icon: <Home className="w-4 h-4 text-blue-600" /> },
    { id: 'agro', label: 'Agropecuaria & Producción', icon: <Sprout className="w-4 h-4 text-emerald-600" /> },
    { id: 'retail', label: 'Retail & Distribución', icon: <ShoppingBag className="w-4 h-4 text-amber-600" /> },
    { id: 'salud', label: 'Salud & Bienestar', icon: <HeartPulse className="w-4 h-4 text-rose-600" /> },
    { id: 'logistica', label: 'Automoción & Logística', icon: <Truck className="w-4 h-4 text-cyan-600" /> },
    { id: 'tech', label: 'Servicios Profesionales', icon: <Wrench className="w-4 h-4 text-indigo-600" /> }
  ];

  const clientsData = [
    // Sector Público & Institucional
    {
      name: 'Municipio de 25 de Mayo',
      category: 'publico',
      tag: 'Sector Público',
      badge: 'Portal Digital & Trámites',
      location: 'La Pampa · Río Colorado',
      solution: 'Digitalización de expedientes y pagos online ciudadanos con seguridad bancaria.',
      highlight: 'Gobierno Abierto'
    },
    {
      name: 'Municipio de Maquinchao',
      category: 'publico',
      tag: 'Sector Público',
      badge: 'Atención Ciudadana',
      location: 'Línea Sur · Río Negro',
      solution: 'Sistema integral de reclamos, turnos digitales y recaudación municipal.',
      highlight: 'Gestión Pública'
    },
    {
      name: 'Canal 16 TV & Diario 10',
      category: 'publico',
      tag: 'Medios & Comunicación',
      badge: 'Portal Streaming & Pauta',
      location: 'Río Negro & Neuquén',
      solution: 'Gestión de anunciantes, contratos publicitarios y portal informativo de alta concurrencia.',
      highlight: 'Medios Masivos'
    },
    {
      name: 'Canal 14TV',
      category: 'publico',
      tag: 'Medios & Comunicación',
      badge: 'Streaming & Media CRM',
      location: 'Alto Valle · Patagonia',
      solution: 'Automatización de pauta publicitaria y atención a televidentes vía WhatsApp.',
      highlight: 'Broadcasting'
    },
    {
      name: 'Centro Empleados de Comercio',
      category: 'publico',
      tag: 'Institución & Gremial',
      badge: 'Padrón & Beneficios',
      location: 'General Roca · Río Negro',
      solution: 'Plataforma para gestión de afiliados, farmacia sindical y turismo.',
      highlight: 'Gremial'
    },

    // Real Estate & Inmobiliario
    {
      name: 'Orbis Propiedades',
      category: 'realestate',
      tag: 'Real Estate',
      badge: 'CRM Inmobiliario & Tasaciones',
      location: 'Neuquén & Confluencia',
      solution: 'Filtro automático de consultas de alquileres y ventas con agenda de visitas integrada.',
      highlight: '+42% Cierres'
    },
    {
      name: 'Turbay Propiedades',
      category: 'realestate',
      tag: 'Real Estate',
      badge: 'Pipeline Inmobiliario',
      location: 'General Roca · Río Negro',
      solution: 'Matriz de propiedades con seguimiento de inversores y contratos automatizados.',
      highlight: 'Loteos & Desarrollos'
    },
    {
      name: 'Habitar Sur Inmobiliaria',
      category: 'realestate',
      tag: 'Real Estate',
      badge: 'CRM + AFIP CAE',
      location: 'Bariloche & Cordillera',
      solution: 'Cobranza mensual de expensas y alquileres con facturación masiva AFIP CAE.',
      highlight: 'Automatización 100%'
    },

    // Agropecuaria & Producción
    {
      name: 'Grupo Agro-Industrial del Comahue',
      category: 'agro',
      tag: 'Agropecuaria',
      badge: 'Comercio Exterior & BI',
      location: 'Alto Valle · Río Negro',
      solution: 'Tableros de Business Intelligence para cotizaciones de exportación frutícola.',
      highlight: '+34% Velocidad'
    },
    {
      name: 'Comercio de Riego Patagónico',
      category: 'agro',
      tag: 'Agropecuaria',
      badge: 'IA WhatsApp & Catálogo',
      location: 'General Roca · Río Negro',
      solution: 'Cotizador técnico de bombas y cañerías por WhatsApp con cálculo hidráulico rápido.',
      highlight: 'Cotización Ágil'
    },
    {
      name: 'Coquería Patagónica & Flourella',
      category: 'agro',
      tag: 'Agroindustria',
      badge: 'Trazabilidad & Stock',
      location: 'Valle Medio · Patagonia',
      solution: 'Control de lotes de cosecha, stock mayorista y facturación a distribuidores.',
      highlight: 'Normas de Calidad'
    },

    // Retail & Distribución
    {
      name: 'Distribuidora Mayorista del Plata',
      category: 'retail',
      tag: 'Retail Mayorista',
      badge: 'Cotizador B2B & AFIP',
      location: 'Buenos Aires · CABA / Remoto',
      solution: 'Elaboración rápida de presupuestos y facturación en 1 clic para más de 400 comercios.',
      highlight: '< 2 min Respuesta'
    },
    {
      name: 'Ferrotera Norte / Portal Norte',
      category: 'retail',
      tag: 'Ferretería & Construcción',
      badge: 'CRM + Facturación AFIP',
      location: 'General Roca · Río Negro',
      solution: 'Catálogo de más de 8.000 artículos sincronizado en mostrador y WhatsApp.',
      highlight: '8.000+ SKUs'
    },
    {
      name: 'Polhamus Suministros Industriales',
      category: 'retail',
      tag: 'Suministros B2B',
      badge: 'CRM + IA Cotizadora',
      location: 'Neuquén · Parque Industrial',
      solution: 'Calificación automática de licitaciones y provisión a operadoras petroleras.',
      highlight: 'Sector Energético'
    },
    {
      name: 'Liderar Fitgo, Wergolf & Franklin',
      category: 'retail',
      tag: 'Indumentaria & E-commerce',
      badge: 'Omnicanalidad & Pagos',
      location: 'Patagonia & Nacional',
      solution: 'Tiendas online interconectadas con CRM, stock centralizado y MercadoPago.',
      highlight: 'E-commerce'
    },

    // Salud & Bienestar
    {
      name: 'Farmacia San Martín',
      category: 'salud',
      tag: 'Salud & Farma',
      badge: 'WhatsApp IA + Stock Recetas',
      location: 'General Roca · Río Negro',
      solution: 'Turnos para vacunatorio, consulta de obras sociales y reservas automáticas 24/7.',
      highlight: '-90% Espera'
    },
    {
      name: 'Clínica Cordillera & CondilMax',
      category: 'salud',
      tag: 'Salud & Clínicas',
      badge: 'Gestión de Pacientes',
      location: 'Neuquén & Río Negro',
      solution: 'Recordatorios preventivos de consultas por WhatsApp y seguimiento médico.',
      highlight: 'SLA Clínico'
    },

    // Automoción & Logística
    {
      name: 'Cabarcos Motores SRL',
      category: 'logistica',
      tag: 'Automoción',
      badge: 'Postventa & Repuestos',
      location: 'General Roca · Río Negro',
      solution: 'Alertas automáticas de service, gestión de presupuestos de taller y repuestos.',
      highlight: 'Postventa 360°'
    },
    {
      name: 'Logística Austral & Sural Patagonia',
      category: 'logistica',
      tag: 'Logística & Depósito',
      badge: 'Trazabilidad QR & Depósito',
      location: 'Neuquén · Vaca Muerta',
      solution: 'Control de flota, remitos digitales y notificaciones en ruta sin errores de stock.',
      highlight: '0% Extravíos'
    },

    // Servicios Profesionales & Tech
    {
      name: 'TechSolutions & Consultoría PyME',
      category: 'tech',
      tag: 'Servicios Tech',
      badge: 'Santi Copilot IA',
      location: 'Córdoba Capital · Centro',
      solution: 'Mesa de ayuda multi-agente para atención y onboarding de clientes B2B.',
      highlight: '98.5% CSAT'
    },
    {
      name: 'iGrabber, Starlingo & Cosentino',
      category: 'tech',
      tag: 'Servicios Profesionales',
      badge: 'Pipeline MEDDIC & Outbound',
      location: 'Buenos Aires & Rosario',
      solution: 'Prospección B2B automatizada y cierre de contratos de consultoría.',
      highlight: 'GTM B2B'
    }
  ];

  const filteredClients =
    selectedIndustry === 'all'
      ? clientsData
      : clientsData.filter((c) => c.category === selectedIndustry);

  return (
    <section className="space-y-10 font-sans">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 shadow-xs">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          <span>Portfolio de Clientes & Validación Territorial</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Más de 400 Empresas y Organismos Confían en Clientum
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Desde municipios y canales de televisión hasta agroindustrias, farmacias, inmobiliarias y mayoristas en toda la Patagonia y Argentina.
        </p>
      </div>

      {/* Industry Tabs */}
      <div className="flex justify-center overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 gap-1">
          {clientCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedIndustry(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                selectedIndustry === cat.id
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Client Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 uppercase tracking-wider">
                  {client.tag}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  {client.highlight}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {client.name}
                </h3>
                <div className="text-[11px] text-slate-500 font-medium">{client.location}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-blue-800">
                {client.badge}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {client.solution}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Implementación Activa</span>
              </span>
              <button
                onClick={() => onNavigate('/casos')}
                className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
              >
                <span>Ver Caso</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sector Público Highlight Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            <Landmark className="w-3.5 h-3.5" />
            <span>Sector Público, Gobiernos & Instituciones</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-bold">
            Soluciones Especiales para Municipios, Medios y Sindicatos
          </h3>
          <p className="text-xs sm:text-sm text-[#0f172a] dark:text-white dark:text-slate-300 leading-relaxed">
            Pliegos técnicos de homologación, facturación oficial, integración con pasarelas bancarias y soporte directo con ingenieros en territorio patagónico.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/contacto')}
          className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs tracking-wide shrink-0 cursor-pointer transition-all shadow-md"
        >
          Consultar Pliego Institucional
        </button>
      </div>
    </section>
  );
};
