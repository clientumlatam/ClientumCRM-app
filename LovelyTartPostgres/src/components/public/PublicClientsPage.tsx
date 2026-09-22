import React, { useState } from 'react';
// Re-saved to ensure build system picks up case-sensitive filename
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
  Award,
  Globe,
  Users,
  Calendar,
  Radio,
  Briefcase
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { RealTeamsSection } from './RealTeamsSection';

interface PublicClientsPageProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenWizard?: () => void;
}

export const PublicClientsPage: React.FC<PublicClientsPageProps> = ({ onNavigate, onOpenWizard }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const stats = [
    { label: 'Clientes activos', value: '+35', sub: 'Alto Valle y Patagonia' },
    { label: 'Organismos públicos', value: '4', sub: 'Municipios y gremios' },
    { label: 'Sectores de medios', value: '3', sub: 'TV, radio y digitales' },
    { label: 'Primer cliente', value: '2016', sub: '10 años de continuidad' },
  ];

  const patterns = [
    {
      icon: '🏛️',
      title: 'Transformación Institucional',
      sub: 'Sector público y gremial',
      desc: 'Organismos como Canal 10, el Municipio de 25 de Mayo y el CEC pasaron de ser portales informativos a centros de servicios digitales que requieren alta disponibilidad, seguridad y gestión de contenidos permanente.'
    },
    {
      icon: '🌾',
      title: 'Digitalización de la Cadena de Valor',
      sub: 'Agroindustria y distribución',
      desc: 'El Consorcio de Riego y el Frigorífico J.J. Gómez representan la columna vertebral de la economía del Alto Valle. La integración tecnológica aquí es operativa: ERP, trazabilidad de lote, logística y comercialización mayorista.'
    },
    {
      icon: '🛒',
      title: 'Potenciación del Retail y Servicios',
      sub: 'Comercio B2C y servicios',
      desc: 'Lubrano Hogar, Morgado Hogar y Growlife Patagonia ejemplifican el paso al comercio omnicanal: e-commerce, integración con MercadoPago, analítica de conversión y automatización de campañas de marketing digital.'
    }
  ];

  const categories = [
    { id: 'all', label: 'Todos los Sectores' },
    { id: 'publico', label: 'Sector Público & Gremial' },
    { id: 'medios', label: 'Medios & Comunicación' },
    { id: 'realestate', label: 'Real Estate & Propiedades' },
    { id: 'agro', label: 'Agroindustria & Producción' },
    { id: 'retail', label: 'Retail & Comercio' },
    { id: 'salud', label: 'Salud & Bienestar' },
    { id: 'automotriz', label: 'Automotriz & Logística' },
    { id: 'servicios', label: 'Servicios Profesionales & Tech' },
  ];

  const clientDirectory = [
    // Sector Público
    {
      name: 'Canal 10 TV',
      domain: 'canal10rn.tv',
      type: 'Medios Públicos',
      cat: 'publico',
      desc: 'Televisión pública de Río Negro y Neuquén con plataforma de contenidos y gestión comercial.'
    },
    {
      name: 'Diario 10',
      domain: 'diario10.com.ar',
      type: 'Medios Digitales',
      cat: 'publico',
      desc: 'Portal de noticias de alta concurrencia con distribución digital automatizada.'
    },
    {
      name: 'Municipio de 25 de Mayo',
      domain: '25demayo.gob.ar',
      type: 'Gobierno Municipal · La Pampa',
      cat: 'publico',
      desc: 'Servicios digitales a la comunidad y portal ciudadano.'
    },
    {
      name: 'Municipio de Maquinchao',
      domain: '',
      type: 'Gobierno Municipal · Río Negro',
      cat: 'publico',
      desc: 'Digitalización municipal de trámites y atención vecinal.'
    },
    {
      name: 'Centro Empleados de Comercio',
      domain: 'cecgroca.com.ar',
      type: 'Gremio / Institucional',
      cat: 'publico',
      desc: 'Padrón de afiliados, turismo y servicios para trabajadores mercantiles del Alto Valle.'
    },

    // Medios & Comunicación
    {
      name: 'Frecuencia Urbana 887 FM',
      domain: 'frecuenciaurbana.com.ar',
      type: 'Radio / Medios',
      cat: 'medios',
      desc: 'Streaming de radio online y gestión publicitaria.'
    },

    // Real Estate
    {
      name: 'Aitue Propiedades',
      domain: 'aitue.com.ar',
      type: 'Inmobiliaria',
      cat: 'realestate',
      desc: 'Portal de propiedades, tasaciones y gestión de consultas comerciales.'
    },
    {
      name: 'Terbay Propiedades',
      domain: 'terbaypropiedades.com.ar',
      type: 'Inmobiliaria',
      cat: 'realestate',
      desc: 'Catálogo de desarrollos inmobiliarios y atención omnicanal.'
    },
    {
      name: 'Hábitat Sur',
      domain: '',
      type: 'Real Estate / Construcción',
      cat: 'realestate',
      desc: 'Gestión comercial de proyectos residenciales y urbanizaciones.'
    },

    // Agroindustria & Producción
    {
      name: 'Consorcio de Riego General Roca',
      domain: 'consorcioderiegoroca.com.ar',
      type: 'Riego / Agroindustria',
      cat: 'agro',
      desc: 'Administración hídrica y comunicación con regantes de la cuenca frutícola.'
    },
    {
      name: 'Cooperativa Frigorífico J.J. Gómez',
      domain: 'frigorificojpgomez.com.ar',
      type: 'Frigorífico / Agroindustria',
      cat: 'agro',
      desc: 'Trazabilidad de faena, stock cárnico y canal mayorista B2B.'
    },
    {
      name: 'Forestal Norte',
      domain: '',
      type: 'Forestal / Agroindustria',
      cat: 'agro',
      desc: 'Producción maderera y logística de distribución regional.'
    },

    // Retail & Comercio
    {
      name: 'Lubrano Hogar',
      domain: 'lubranohogar.com.ar',
      type: 'Electrodomésticos / Retail',
      cat: 'retail',
      desc: 'Tienda digital, planes de cuotas y catálogo de artículos del hogar.'
    },
    {
      name: 'Morgado Hogar',
      domain: 'morgadohogar.com.ar',
      type: 'Hogar / Retail',
      cat: 'retail',
      desc: 'Ventas online multicanal con stock sincronizado en sucursales.'
    },
    {
      name: 'Growlife Patagonia',
      domain: 'growlifepatagonia.com.ar',
      type: 'Comercio / Growshop',
      cat: 'retail',
      desc: 'E-commerce especializado con cobro en MercadoPago y envíos regionales.'
    },
    {
      name: 'Bauleras Roca',
      domain: '',
      type: 'Guardamuebles / Almacenaje',
      cat: 'retail',
      desc: 'Gestión de contratos de alquiler de bauleras y depósitos temporales.'
    },
    {
      name: 'AKBAR SRL',
      domain: '',
      type: 'Comercio',
      cat: 'retail',
      desc: 'Distribución mayorista y ventas comerciales.'
    },
    {
      name: 'LP SRL',
      domain: '',
      type: 'Comercio',
      cat: 'retail',
      desc: 'Gestión de inventarios y presupuestos comerciales.'
    },
    {
      name: 'AMBAR',
      domain: '',
      type: 'Comercio / Servicios',
      cat: 'retail',
      desc: 'Comercialización de artículos y atención al cliente.'
    },

    // Salud & Bienestar
    {
      name: 'Farmacia San Martín',
      domain: '',
      type: 'Farmacia',
      cat: 'salud',
      desc: 'Recepción de recetas digitales y pedidos por mensajería.'
    },
    {
      name: 'Coe Consultorio',
      domain: '',
      type: 'Consultorio Médico',
      cat: 'salud',
      desc: 'Agendamiento de citas y recordatorios a pacientes.'
    },
    {
      name: 'Consultorio Cerol',
      domain: '',
      type: 'Consultorio Médico',
      cat: 'salud',
      desc: 'Gestión de historias clínicas y turnos online.'
    },
    {
      name: 'Grupo Bio',
      domain: '',
      type: 'Salud / Bienestar',
      cat: 'salud',
      desc: 'Servicios de salud integral y bienestar.'
    },

    // Automotriz & Logística
    {
      name: 'Cabarcos Motores SRL',
      domain: 'cabarcosmotores.com.ar',
      type: 'Automotriz / Industrial',
      cat: 'automotriz',
      desc: 'Rectificación de motores, repuestos pesados y presupuestador web.'
    },
    {
      name: 'Patagonia Remolques',
      domain: '',
      type: 'Remolques / Automotriz',
      cat: 'automotriz',
      desc: 'Fabricación y comercialización de trailers y acoplados homologados.'
    },
    {
      name: 'KJ Logística',
      domain: 'kjlogistica.com.ar',
      type: 'Logística / Transporte',
      cat: 'automotriz',
      desc: 'Rastreo de cargas y cotizaciones de fletes interurbanos.'
    },
    {
      name: 'Naval Patagonia',
      domain: '',
      type: 'Náutica / Servicios',
      cat: 'automotriz',
      desc: 'Equipamiento náutico y servicios mecánicos para embarcaciones.'
    },

    // Servicios Profesionales & Tech
    {
      name: 'AFP Service',
      domain: 'afpservice.com.ar',
      type: 'Servicios Técnicos',
      cat: 'servicios',
      desc: 'Mantenimiento preventivo e instalaciones electromecánicas.'
    },
    {
      name: 'YendoApp',
      domain: 'yendoapp.com.ar',
      type: 'Tecnología / App Móvil',
      cat: 'servicios',
      desc: 'Plataforma digital de movilidad urbana en el Alto Valle.'
    },
    {
      name: 'Saitt',
      domain: '',
      type: 'Tecnología / Servicios',
      cat: 'servicios',
      desc: 'Soluciones IT y soporte de infraestructura para empresas.'
    },
    {
      name: 'Estudio Integra',
      domain: '',
      type: 'Estudio Profesional',
      cat: 'servicios',
      desc: 'Asesoramiento contable, fiscal y financiero.'
    },
    {
      name: 'Estudio Méndez & Asoc.',
      domain: '',
      type: 'Estudio / Consultoría',
      cat: 'servicios',
      desc: 'Auditorías de procesos y consultoría impositiva.'
    },
    {
      name: 'Grupo de Asesores',
      domain: '',
      type: 'Consultoría',
      cat: 'servicios',
      desc: 'Consultoría en recursos humanos y desarrollo organizacional.'
    },
    {
      name: 'Anmerica',
      domain: '',
      type: 'Servicios',
      cat: 'servicios',
      desc: 'Servicios corporativos y gestión administrativa.'
    },
    {
      name: 'Agua Wass',
      domain: '',
      type: 'Agua / Servicios',
      cat: 'servicios',
      desc: 'Distribución y logística de bidones de agua purificada.'
    },
    {
      name: 'SCT Patagonia',
      domain: '',
      type: 'Servicios / Construcción',
      cat: 'servicios',
      desc: 'Obras de infraestructura y servicios civiles.'
    },
    {
      name: 'Poliservice Suministros',
      domain: '',
      type: 'Suministros Industriales',
      cat: 'servicios',
      desc: 'Provisión de insumos y materiales para la industria petrolera y minera.'
    }
  ];

  const filteredClients = selectedCategory === 'all'
    ? clientDirectory
    : clientDirectory.filter(c => c.cat === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 font-sans bg-white text-slate-900">
      
      {/* 1. Header Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-2xs">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Ecosistema empresarial del Alto Valle</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Nuestros Principales Clientes
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Más de 35 organizaciones del Alto Valle de Río Negro y Neuquén llevan adelante su transformación digital con Clientum — desde municipios y canales de TV hasta ferreterías, farmacias, propiedades e inmobiliarias.
        </p>

        {/* 4 Stats Grid */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((st, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-blue-600">{st.value}</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{st.label}</div>
              <div className="text-[11px] text-slate-500">{st.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Tres Patrones de Transformación Digital */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-mono uppercase text-blue-600 font-bold">Cómo adoptan tecnología nuestros clientes</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tres patrones de transformación digital
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            La diversidad de sectores que atendemos exige enfoques distintos. Identificamos tres estrategias según el tipo de organización.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {patterns.map((pt, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
              <div className="text-3xl">{pt.icon}</div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{pt.title}</h3>
                <div className="text-xs font-semibold text-blue-600">{pt.sub}</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{pt.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-xs text-slate-700 leading-relaxed">
          <strong>Infraestructura unificada:</strong> Todos los sectores requieren infraestructura resiliente (hosting, correos corporativos) y una capa estratégica de datos (Business Intelligence) — Clientum lo centraliza en una sola plataforma.
        </div>
      </section>

      {/* 3. Directorio Completo de Clientes */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Directorio de Organizaciones y Empresas
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mostrando {filteredClients.length} de {clientDirectory.length} clientes del Alto Valle y Patagonia
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-[#0f172a] dark:text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Clients Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {client.type}
                  </span>
                  {client.domain && (
                    <span className="text-[10px] font-mono text-[#0f172a] dark:text-white dark:text-slate-400">
                      {client.domain}
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-slate-900">{client.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{client.desc}</p>
              </div>

              {client.domain && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                  <span className="font-mono text-[11px] truncate">{client.domain}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Equipos Reales en Acción */}
      <RealTeamsSection onNavigate={onNavigate} />

      {/* 5. CTA Footer */}
      <section className="rounded-3xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 text-[#0f172a] dark:text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase text-emerald-400 font-bold">¿Querés unirte?</div>
          <h2 className="text-2xl sm:text-4xl font-black">
            Tu empresa podría ser la próxima
          </h2>
          <p className="text-xs sm:text-sm text-[#0f172a] dark:text-white dark:text-slate-300 max-w-2xl mx-auto">
            Implementación en 5 días hábiles, soporte en español 24/7 y tecnología que se adapta a tu rubro. Sin contratos mínimos.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/contacto')}
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg cursor-pointer transition-colors"
          >
            Solicitar Demo Gratuita
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/precios')}
            className="px-6 py-3.5 rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-700 text-[#0f172a] dark:text-white dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors"
          >
            Ver Planes & Precios
          </button>
        </div>
      </section>

    </div>
  );
};
