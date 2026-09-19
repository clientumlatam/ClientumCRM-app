import React, { useState } from 'react';
import {
  Users,
  Handshake,
  Briefcase,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  Zap,
  Globe,
  MapPin,
  FileCheck
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';

interface CareersPartnersSectionProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const CareersPartnersSection: React.FC<CareersPartnersSectionProps> = ({ onNavigate }) => {
  const { showToast, triggerConfetti } = useCRM();
  const [selectedJob, setSelectedJob] = useState<{ title: string; type: string } | null>(null);
  const [jobForm, setJobForm] = useState({ name: '', email: '', linkedin: '', portfolio: '' });

  const partnerTracks = [
    {
      title: 'Track Afiliados & Creadores',
      commission: '30% Recurrente',
      badge: 'Ingresos Pasivos',
      desc: 'Para influencers, consultores independientes y profesionales que recomiendan Clientum a su red de contactos.',
      features: [
        'Comisión vitalicia mensual del 30% por cada suscripción',
        'Panel de control en tiempo real con links de tracking',
        'Kits de banners, copies de WhatsApp y material oficial'
      ]
    },
    {
      title: 'Partners de Implementación',
      commission: 'White Label & Revendedor',
      badge: 'Agencias & Consultoras',
      desc: 'Para agencias de marketing y consultoras que desean integrar Clientum en su oferta de servicios B2B.',
      features: [
        '3 Niveles de Partner: Afiliado, Certificado y Preferente',
        'Marca blanca (White Label) para revender con tu logo',
        'Capacitación técnica VIP y derivación de leads calificados'
      ]
    }
  ];

  const jobs = [
    {
      id: 'job-fullstack',
      title: 'Full Stack Developer',
      type: 'Full Time · Remoto',
      stack: 'React, TypeScript, Node/Express, PostgreSQL, REST APIs',
      desc: 'Desarrollo de módulos CRM, integraciones en tiempo real y optimización de modelos de lenguaje IA.'
    },
    {
      id: 'job-implementation',
      title: 'Consultor/a de Implementación',
      type: 'Full Time · Remoto',
      stack: 'CRM, Onboarding PyME, WhatsApp Business, Procesos',
      desc: 'Acompañamiento a nuevos clientes en la configuración de sus pipelines, WhatsApp y facturación AFIP.'
    },
    {
      id: 'job-sales',
      title: 'Ejecutivo/a Comercial B2B',
      type: 'Full Time · Remoto',
      stack: 'Ventas Consultivas, CRM, Demos en Vivo, WhatsApp',
      desc: 'Prospección y cierre de cuentas PyME e industriales en Argentina y el Cono Sur.'
    },
    {
      id: 'job-uiux',
      title: 'Diseñador/a UI/UX',
      type: 'Part Time · Remoto',
      stack: 'Figma, Tailwind CSS, Design Systems, Mobile First',
      desc: 'Evolución de la interfaz de ClientumOS, micro-interacciones y flujos de usuario intuitivos.'
    }
  ];

  const handleSubmitJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.name || !jobForm.email) {
      showToast('Por favor completa tu nombre y correo electrónico.', 'error');
      return;
    }
    triggerConfetti();
    showToast(`¡Postulación enviada con éxito para ${selectedJob?.title}! Nos contactaremos a la brevedad.`, 'success');
    setSelectedJob(null);
    setJobForm({ name: '', email: '', linkedin: '', portfolio: '' });
  };

  return (
    <section className="space-y-12 font-sans">
      {/* 1. Programa de Alianzas / Partners */}
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 shadow-xs">
            <Handshake className="w-3.5 h-3.5 text-blue-600" />
            <span>Programa de Alianzas & Partners</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Crece Junto a la Red de Tecnología Líder en la Región
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Más de 120 partners activos y más de 500 PyMEs digitalizadas. Rentabiliza tus recomendaciones o amplía la cartera de tu agencia.
          </p>
        </div>

        {/* Partner Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-blue-700">+120</div>
            <div className="text-xs font-bold text-slate-800">Partners Activos</div>
            <div className="text-[11px] text-slate-500">Agencias y consultores en LATAM</div>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">500+</div>
            <div className="text-xs font-bold text-slate-800">PyMEs Digitalizadas</div>
            <div className="text-[11px] text-slate-500">A través de nuestra red de partners</div>
          </div>
          <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-purple-700">24hs</div>
            <div className="text-xs font-bold text-slate-800">Soporte al Partner</div>
            <div className="text-[11px] text-slate-500">Canal exclusivo y asesor dedicado</div>
          </div>
        </div>

        {/* Partner Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partnerTracks.map((track, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-xs hover:shadow-md space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                    {track.badge}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {track.commission}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{track.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{track.desc}</p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {track.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('/contacto')}
                className="w-full py-3 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 hover:bg-[#eef1f6] hover:dark:bg-[#eef1f6] hover:dark:bg-slate-800 text-[#0f172a] dark:text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
              >
                Postularme como Partner
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Bolsa de Empleos / Talento */}
      <div className="space-y-8 pt-6 border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-xs">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>Oportunidades Laborales · Trabajo Remoto</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Únete al Equipo de Clientum Latam
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Buscamos personas apasionadas por construir tecnología de alto impacto para el sector productivo de la región.
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                    {job.type}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-blue-700">
                  {job.stack}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {job.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedJob({ title: job.title, type: job.type })}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Postularme</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  Postulación de Empleo
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedJob.title}</h3>
                <p className="text-xs text-slate-500">{selectedJob.type}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitJob} className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={jobForm.name}
                  onChange={(e) => setJobForm({ ...jobForm, name: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={jobForm.email}
                  onChange={(e) => setJobForm({ ...jobForm, email: e.target.value })}
                  placeholder="juan@ejemplo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Perfil LinkedIn o GitHub</label>
                <input
                  type="text"
                  value={jobForm.linkedin}
                  onChange={(e) => setJobForm({ ...jobForm, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Portfolio / Resumen de Experiencia</label>
                <textarea
                  rows={2}
                  value={jobForm.portfolio}
                  onChange={(e) => setJobForm({ ...jobForm, portfolio: e.target.value })}
                  placeholder="Breve reseña sobre tus proyectos y experiencia relevante..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Postulación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
