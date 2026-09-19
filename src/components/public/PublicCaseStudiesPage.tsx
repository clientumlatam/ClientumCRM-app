import React, { useState } from 'react';
import {
  Star,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Building2,
  Tractor,
  Truck,
  HeartPulse,
  Home,
  ShoppingCart,
  Clock,
  Car,
  Tv,
  Factory,
  Landmark,
  MessageSquare,
  Sparkles,
  Quote
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';
import { RealTeamsSection } from './RealTeamsSection';
import { PublicEcosystemSections } from './PublicEcosystemSections';
import { ClientumLogo } from '../common/ClientumLogo';

interface PublicCaseStudiesPageProps {
  onNavigate: (path: PublicRoutePath) => void;
}

interface CaseStudyItem {
  id: string;
  title: string;
  industry: 'retail' | 'salud' | 'inmobiliaria' | 'agroindustria' | 'medios' | 'automotriz' | 'logistica' | 'industrial' | 'institucional';
  industryLabel: string;
  year: string;
  subtitle: string;
  desc: string;
}

export const PublicCaseStudiesPage: React.FC<PublicCaseStudiesPageProps> = ({ onNavigate }) => {
  const { showToast, triggerConfetti } = useCRM();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCaseModal, setSelectedCaseModal] = useState<CaseStudyItem | null>(null);
  const [modalForm, setModalForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' });

  const filterButtons = [
    { id: 'all', label: 'Ver Todos' },
    { id: 'retail', label: 'Retail' },
    { id: 'salud', label: 'Salud' },
    { id: 'inmobiliaria', label: 'Inmobiliaria' },
    { id: 'agroindustria', label: 'Agroindustria' },
    { id: 'medios', label: 'Medios' },
    { id: 'automotriz', label: 'Automotriz' },
    { id: 'logistica', label: 'Logística' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'institucional', label: 'Institucional' },
  ];

  const caseStudies: CaseStudyItem[] = [
    {
      id: 'morgado',
      title: 'Morgado Hogar',
      industry: 'retail',
      industryLabel: 'Retail',
      year: '2023',
      subtitle: 'E-Commerce + CRM Inteligente',
      desc: 'Tienda online con catálogo de muebles y deco sincronizado con stock físico. Pipeline de ventas y seguimiento automático de presupuestos por WhatsApp.'
    },
    {
      id: 'farmacia',
      title: 'Farmacia San Martín',
      industry: 'salud',
      industryLabel: 'Salud',
      year: '2023',
      subtitle: 'Bot WhatsApp + Gestión de Stock',
      desc: 'Bot 24/7 que responde consultas de disponibilidad de medicamentos, agenda turnos y envía recordatorios. Stock integrado con facturación AFIP.'
    },
    {
      id: 'terbay',
      title: 'Terbay Propiedades',
      industry: 'inmobiliaria',
      industryLabel: 'Inmobiliaria',
      year: '2023',
      subtitle: 'CRM Inmobiliario + Bot WhatsApp',
      desc: 'Bot califica interesados, envía planos y fotos, y agenda visitas automáticamente. Pipeline de operaciones con seguimiento de cada cliente hasta el cierre.'
    },
    {
      id: 'forestal',
      title: 'Forestal Norte',
      industry: 'agroindustria',
      industryLabel: 'Agroindustria',
      year: '2022',
      subtitle: 'ERP + AFIP + Cartas de Porte',
      desc: 'Digitalización de operaciones forestales: cartas de porte electrónicas, liquidaciones automáticas y trazabilidad de carga desde el campo hasta la planta.'
    },
    {
      id: 'riego',
      title: 'Consorcio de Riego General Roca',
      industry: 'agroindustria',
      industryLabel: 'Agroindustria',
      year: '2023',
      subtitle: 'Portal Institucional + Gestión de Turnos',
      desc: 'Portal con gestión de turnos de agua, calendario de riegos, pagos online integrados y comunicaciones automáticas a los regantes del Alto Valle.'
    },
    {
      id: 'habitat',
      title: 'Hábitat Sur',
      industry: 'inmobiliaria',
      industryLabel: 'Inmobiliaria',
      year: '2024',
      subtitle: 'Sitio Web + CRM Inmobiliario',
      desc: 'Sitio inmobiliario con listado de propiedades, filtros, ficha de contacto y catálogo de cotizaciones conectado al CRM. Automatización de seguimiento de cotizaciones.'
    },
    {
      id: 'municipio25',
      title: 'Municipio de 25 de Mayo',
      industry: 'institucional',
      industryLabel: 'Institucional',
      year: '2024',
      subtitle: 'Portal Municipal + Gestión de Trámites',
      desc: 'Portal de gobierno digital con acceso a trámites, novedades municipales, contacto ciudadano y gestión de contenidos desde un panel administrable.'
    },
    {
      id: 'canal10',
      title: 'Canal 10 TV',
      industry: 'medios',
      industryLabel: 'Medios',
      year: '2022',
      subtitle: 'Portal Web + Streaming Digital',
      desc: 'Rediseño del portal de noticias con integración de streaming en vivo, gestión de contenidos y automatización de publicaciones en redes sociales.'
    },
    {
      id: 'cabarcos',
      title: 'Cabarcos Motores SRL',
      industry: 'automotriz',
      industryLabel: 'Automotriz',
      year: '2023',
      subtitle: 'E-Commerce + CRM Automotriz',
      desc: 'Catálogo de vehículos y repuestos online con reservas digitales. CRM con seguimiento de consultas, test drives y posventa integrada a WhatsApp.'
    },
    {
      id: 'kj',
      title: 'KJ Logística',
      industry: 'logistica',
      industryLabel: 'Logística',
      year: '2023',
      subtitle: 'ERP + Rastreo de Flota',
      desc: 'Sistema de gestión de viajes, control de flota y liquidación de conductores. Reportes automáticos de kilómetros, combustible y rentabilidad por unidad.'
    },
    {
      id: 'poliservice',
      title: 'Poliservice Suministros',
      industry: 'industrial',
      industryLabel: 'Industrial',
      year: '2024',
      subtitle: 'Sitio Web + CRM de Distribución Zonal',
      desc: 'Sitio institucional con representación y distribución zonal, ficha de importador y catálogo de clientes. CRM para seguimiento de cotizaciones industriales.'
    },
    {
      id: 'sct',
      title: 'SCT Patagonia',
      industry: 'industrial',
      industryLabel: 'Industrial',
      year: '2024',
      subtitle: 'Sitio Web + Catálogo de Servicios',
      desc: 'Rediseño del sitio con catálogo de servicios de cintas transportadoras, video institucional y formulario de contacto conectado al CRM comercial.'
    },
    {
      id: 'afp',
      title: 'AFP Service',
      industry: 'industrial',
      industryLabel: 'Industrial',
      year: '2024',
      subtitle: 'E-Commerce + Catálogo de Productos',
      desc: 'Tienda online de ferretería industrial y unidades modulares con buscador inteligente, catálogo descargable y gestión de pedidos integrada al stock.'
    },
    {
      id: 'cec',
      title: 'Centro Empleados de Comercio',
      industry: 'institucional',
      industryLabel: 'Institucional',
      year: '2024',
      subtitle: 'Portal Institucional + Gestión de Novedades',
      desc: 'Portal gremial con beneficios destacados, novedades, escalas salariales y accesos directos a OSECAC y afiliación. Clientum nos ahorró un empleado administrativo.'
    }
  ];

  const testimonials = [
    {
      quote: 'Implementamos Clientum en 5 días. El bot de WhatsApp nos generó 40% más de consultas en el primer mes que las que llevaba nadie. Los reportes automáticos cambiaron la forma en que tomamos decisiones.',
      author: 'Martín B.',
      company: 'Distribuidora del Sur S.A. — Neuquén'
    },
    {
      quote: 'El bot califica los interesados, les envía las fotos y los planos, y agenda las visitas solo. Nosotros entramos a cerrar. Fue un cambio total en la forma de trabajar.',
      author: 'Equipo comercial',
      company: 'Terbay Propiedades'
    },
    {
      quote: 'Antes el teléfono no paraba. Ahora el bot responde si tenemos el medicamento, da el precio y reserva. Liberamos horas del mostrador que usamos para atención personalizada.',
      author: 'Administración',
      company: 'Farmacia San Martín'
    },
    {
      quote: 'Las cartas de porte y la liquidación AFIP se hacen solas. Lo que nos llevaba medio día de oficina ahora tarda minutos. Clientum nos ahorró un empleado administrativo.',
      author: 'Gerencia',
      company: 'Forestal Norte'
    }
  ];

  const filteredCases = selectedIndustry === 'all'
    ? caseStudies
    : caseStudies.filter((c) => c.industry === selectedIndustry);

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name || !modalForm.email) {
      showToast('Por favor completá tu nombre y correo electrónico.', 'error');
      return;
    }
    triggerConfetti();
    showToast(`¡Solicitud enviada para una solución similar a "${selectedCaseModal?.title}"! Te contactaremos dentro de las 24 horas.`, 'success');
    setSelectedCaseModal(null);
    setModalForm({ name: '', email: '', phone: '', company: '', notes: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 font-sans bg-white text-slate-900">
      
      {/* 1. Header & Hero */}
      <section className="text-center max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <ClientumLogo className="w-5 h-5" />
          <span>CLIENTUM Agencia de Crecimiento & Consultoría</span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-2xs">
          <Star className="w-3.5 h-3.5 fill-current text-blue-600" />
          <span>Historias de Nuestros Clientes</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Casos de Éxito por Industria
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Filtra nuestros proyectos realizados para ver cómo transformamos operaciones reales mediante tecnología robusta.
        </p>

        {/* Filter Buttons Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {filterButtons.map((btn) => {
            const isActive = selectedIndustry === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedIndustry(btn.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Grid de los 14 Casos de Éxito */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((cs) => (
            <div
              key={cs.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {cs.industryLabel}
                  </span>
                  <span className="text-[#0f172a] dark:text-white dark:text-slate-400 font-mono">
                    {cs.year}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {cs.title}
                  </h3>
                  <div className="text-xs font-bold text-blue-600 mt-1">
                    {cs.subtitle}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {cs.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCaseModal(cs)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-800 hover:text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Solicitar solución similar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Testimonios Destacados */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono uppercase text-blue-600 font-bold">Voces de la Industria</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Testimonios Destacados
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((test, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-blue-500 fill-blue-100" />
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{test.quote}"
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-black text-slate-900">{test.author}</div>
                <div className="text-[11px] text-slate-500 font-medium">{test.company}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Equipos Reales en Acción */}
      <RealTeamsSection onNavigate={onNavigate} />

      {/* 5. Banner Final de Cierre */}
      <section className="rounded-3xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-950 text-[#0f172a] dark:text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-black max-w-3xl mx-auto">
          ¿Querés que tu equipo también ahorre horas y multiplique sus ventas?
        </h2>
        <p className="text-xs sm:text-sm text-[#0f172a] dark:text-white dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Implementamos CRM, WhatsApp con IA y automatizaciones en 5 días hábiles con acompañamiento humano cercano.
        </p>
        <div>
          <button
            type="button"
            onClick={() => onNavigate('/contacto')}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            Consultar para mi PyME
          </button>
        </div>
      </section>

      {/* Reusable Ecosystem Sections */}
      <PublicEcosystemSections onNavigate={onNavigate} />

      {/* Modal: Solicitar solución similar */}
      {selectedCaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Solicitar Solución Similar
                </h3>
                <p className="text-xs text-blue-600 font-semibold mt-0.5">
                  Caso: {selectedCaseModal.title} ({selectedCaseModal.subtitle})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCaseModal(null)}
                className="text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  placeholder="Ej: Roberto Albarracín"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={modalForm.email}
                    onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                    placeholder="roberto@miempresa.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp / Teléfono</label>
                  <input
                    type="tel"
                    value={modalForm.phone}
                    onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                    placeholder="+54 9 298 451-0883"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre de tu PyME o Empresa</label>
                <input
                  type="text"
                  value={modalForm.company}
                  onChange={(e) => setModalForm({ ...modalForm, company: e.target.value })}
                  placeholder="Mi PyME SRL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">¿Qué desafío querés resolver en tu negocio?</label>
                <textarea
                  rows={3}
                  value={modalForm.notes}
                  onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                  placeholder={`Nos gustaría implementar algo similar al caso de ${selectedCaseModal.title} para automatizar...`}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCaseModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
                >
                  Solicitar Presupuesto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
