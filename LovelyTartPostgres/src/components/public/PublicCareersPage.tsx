import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
  Globe,
  MapPin,
  Heart,
  Code,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';
import { ClientumLogo } from '../common/ClientumLogo';
import { PublicEcosystemSections } from './PublicEcosystemSections';

interface PublicCareersPageProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicCareersPage: React.FC<PublicCareersPageProps> = ({ onNavigate }) => {
  const { showToast, triggerConfetti } = useCRM();
  const [selectedJob, setSelectedJob] = useState<{ title: string; type: string } | null>(null);
  const [jobForm, setJobForm] = useState({ name: '', email: '', linkedin: '', portfolio: '', notes: '' });

  const cultureValues = [
    {
      title: 'Autonomía real',
      desc: 'Cada integrante tiene ownership de su área. Sin micromanagement.'
    },
    {
      title: 'Impacto visible',
      desc: 'Lo que hacés se usa al día siguiente. Clientes reales, feedback inmediato.'
    },
    {
      title: 'Aprendizaje continuo',
      desc: 'Acceso a Clientum Academia, conferencias y cursos de la industria.'
    },
    {
      title: 'Equipo diverso',
      desc: 'Desarrolladores, marketers, consultores y diseñadores — todos en la misma mesa.'
    }
  ];

  const jobs = [
    {
      id: 'fullstack',
      title: 'Desarrollador/a Full Stack',
      type: 'Remoto · Full time',
      desc: 'Desarrollás nuevas funciones del CRM, integraciones con servicios externos y mejoras de performance del sistema.',
      tags: ['React / TypeScript', 'Node.js / Express', 'PostgreSQL', 'APIs REST']
    },
    {
      id: 'implementation',
      title: 'Consultor/a de Implementación',
      type: 'Remoto · Full time',
      desc: 'Acompañás a nuevos clientes en su proceso de adopción de Clientum: configuración, capacitación y soporte post-lanzamiento.',
      tags: ['CRM', 'Onboarding', 'WhatsApp Business', 'Excel/Sheets']
    },
    {
      id: 'commercial',
      title: 'Ejecutivo/a Comercial',
      type: 'Remoto · Full time',
      desc: 'Prospectás, calificás y cerrás clientes PyME en toda Argentina y Latinoamérica. Comisión sobre ventas + base.',
      tags: ['Ventas B2B', 'CRM', 'Propuestas', 'WhatsApp']
    },
    {
      id: 'uiux',
      title: 'Diseñador/a UI/UX',
      type: 'Remoto · Part time',
      desc: 'Diseñás nuevas interfaces del CRM, el sitio y las piezas de marketing. Trabajo asíncrono con el equipo de desarrollo.',
      tags: ['Figma', 'Tailwind CSS', 'Mobile first', 'Diseño de producto']
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.name || !jobForm.email) {
      showToast('Por favor completá tu nombre y correo electrónico.', 'error');
      return;
    }
    triggerConfetti();
    showToast(`¡Postulación enviada con éxito para ${selectedJob?.title}! Te contactaremos pronto.`, 'success');
    setSelectedJob(null);
    setJobForm({ name: '', email: '', linkedin: '', portfolio: '', notes: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 font-sans bg-white text-slate-900">
      
      {/* 1. Header & Hero */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <ClientumLogo className="w-5 h-5" />
          <span>CLIENTUM Agencia de Crecimiento & Consultoría</span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-2xs">
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>Trabajá con Nosotros</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Sumate al equipo que digitalizamos la Patagonia
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          En Clientum construimos tecnología real para PyMEs reales. Si te apasiona el impacto concreto, trabajar con autonomía y aprender rápido, este es tu lugar.
        </p>

        {/* 3 Key highlights */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700">
          <span className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-2 shadow-2xs">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Trabajo 100% remoto desde cualquier lugar de Argentina</span>
          </span>
          <span className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-2 shadow-2xs">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Equipo chico, decisiones rápidas y sin burocracia</span>
          </span>
          <span className="px-4 py-2 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-2 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Proyectos reales con clientes reales desde el día 1</span>
          </span>
        </div>
      </section>

      {/* 2. Cultura Clientum */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono uppercase text-blue-600 font-bold">Principios & Valores</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Cultura Clientum
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cultureValues.map((val, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
              <span className="inline-block w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                0{i + 1}
              </span>
              <h3 className="font-bold text-base text-slate-900">{val.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Posiciones Abiertas: Buscamos personas que resuelvan */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono uppercase text-blue-600 font-bold">Oportunidades Actuales</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Posiciones abiertas
          </h2>
          <p className="text-sm font-semibold text-slate-600">
            Buscamos personas que resuelvan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-slate-900">{job.title}</h3>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    {job.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{job.desc}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.tags.map((tg, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedJob({ title: job.title, type: job.type })}
                  className="w-full py-3 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 hover:bg-[#eef1f6] hover:dark:bg-[#eef1f6] hover:dark:bg-slate-800 text-[#0f172a] dark:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Postularme →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ¿No encontrás tu perfil? */}
      <section className="rounded-3xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 text-[#0f172a] dark:text-white p-8 sm:p-12 text-center space-y-5 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-black">
          ¿No encontrás tu perfil?
        </h2>
        <p className="text-xs sm:text-sm text-[#0f172a] dark:text-white dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Mandanos tu CV y contanos en qué podés aportar. Siempre estamos abiertos a perfiles que sorprendan.
        </p>
        <button
          type="button"
          onClick={() => setSelectedJob({ title: 'Candidatura Espontánea', type: 'Remoto' })}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          Enviar CV espontáneo →
        </button>
      </section>

      {/* Reusable Ecosystem Sections */}
      <PublicEcosystemSections onNavigate={onNavigate} />

      {/* Modal Postulación */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Postulación: {selectedJob.title}</h3>
                <p className="text-xs text-slate-500">{selectedJob.type}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={jobForm.name}
                  onChange={(e) => setJobForm({ ...jobForm, name: e.target.value })}
                  placeholder="Ej: Laura Martínez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={jobForm.email}
                  onChange={(e) => setJobForm({ ...jobForm, email: e.target.value })}
                  placeholder="laura@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perfil LinkedIn / GitHub</label>
                  <input
                    type="url"
                    value={jobForm.linkedin}
                    onChange={(e) => setJobForm({ ...jobForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enlace a CV o Portfolio</label>
                  <input
                    type="url"
                    value={jobForm.portfolio}
                    onChange={(e) => setJobForm({ ...jobForm, portfolio: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">¿Por qué te interesa sumarte a Clientum?</label>
                <textarea
                  rows={3}
                  value={jobForm.notes}
                  onChange={(e) => setJobForm({ ...jobForm, notes: e.target.value })}
                  placeholder="Contanos brevemente sobre tu experiencia y qué valor te gustaría aportar..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
                >
                  Enviar Postulación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
