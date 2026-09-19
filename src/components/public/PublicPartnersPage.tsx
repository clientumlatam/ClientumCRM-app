import React, { useState } from 'react';
import {
  Handshake,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  Zap,
  Globe,
  Sparkles,
  Building2,
  Clock,
  ExternalLink,
  Users2,
  Layers,
  Award
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';
import { ClientumLogo } from '../common/ClientumLogo';
import { PublicEcosystemSections } from './PublicEcosystemSections';

interface PublicPartnersPageProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicPartnersPage: React.FC<PublicPartnersPageProps> = ({ onNavigate }) => {
  const { showToast, triggerConfetti } = useCRM();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<'afiliado' | 'implementador'>('afiliado');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    country: 'Argentina',
    message: ''
  });

  const stats = [
    { value: '30%', label: 'Comisión recurrente' },
    { value: '+120', label: 'Partners activos' },
    { value: '500+', label: 'PyMEs digitalizadas' },
    { value: '24 hs', label: 'Soporte al partner' },
  ];

  const levels = [
    {
      level: 'Nivel 01',
      title: 'Afiliado',
      desc: 'Sin requisitos técnicos. Compartís tu link, cobrás comisión recurrente y accedés al material de marketing.'
    },
    {
      level: 'Nivel 02',
      title: 'Partner Certificado',
      desc: 'Agencias e implementadores con onboarding técnico aprobado. Precios de revendedor y soporte prioritario.'
    },
    {
      level: 'Nivel 03',
      title: 'Partner Preferente',
      desc: 'Volumen sostenido de clientes activos. Marca blanca completa, derivación de leads y presencia destacada en clientum.com.ar.'
    }
  ];

  const steps = [
    {
      num: '1',
      title: 'Postulate',
      desc: 'Contanos tu perfil: si sos afiliado o partner de implementación.'
    },
    {
      num: '2',
      title: 'Reunión inicial',
      desc: 'Revisamos condiciones, comisiones y alcance juntos sin compromiso.'
    },
    {
      num: '3',
      title: 'Onboarding',
      desc: 'Capacitación en la plataforma y, si aplica, certificación técnica.'
    },
    {
      num: '4',
      title: 'A vender',
      desc: 'Accedés a tu panel, material de marketing y empezás a generar comisiones.'
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      showToast('Por favor completá tu nombre y correo electrónico.', 'error');
      return;
    }
    triggerConfetti();
    showToast('¡Postulación recibida con éxito! Te contactaremos dentro de las 24 hs.', 'success');
    setIsApplyModalOpen(false);
    setForm({ name: '', email: '', phone: '', company: '', role: '', country: 'Argentina', message: '' });
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
          <Handshake className="w-3.5 h-3.5 text-blue-600" />
          <span>Programa de Alianzas</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Asociate y potenciá tu negocio con Clientum
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Sumate a nuestro ecosistema y ganá dinero ayudando a digitalizar PyMEs de la Patagonia y toda Latinoamérica.
        </p>

        {/* 4 Stats */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((st, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center shadow-2xs">
              <div className="text-3xl font-black text-blue-600">{st.value}</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Programa de Afiliados vs Partners de Implementación */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Track 1: Programa de Afiliados */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Creadores & Mentores
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                30% Recurrente
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">Programa de Afiliados</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Perfecto para influencers de negocios, creadores de contenido, mentores y cualquier profesional que recomiende Clientum. Recibe una recompensa recurrente por el valor de tus referidos.
            </p>

            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>30% de Comisión Recurrente:</strong> Recibe el 30% del abono mensual de cada cliente que mantenga activa su cuenta de por vida.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Panel Transparente:</strong> Monitorea en vivo tus clicks, conversiones y comisiones listas para liquidar.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Material de Soporte Gratuito:</strong> Banners, videos promocionales, plantillas de correo y copys listos para compartir.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('afiliado');
                setIsApplyModalOpen(true);
              }}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <span>Unirme como Afiliado Gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Track 2: Partners de Implementación */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Agencias & Consultoras
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                White Label
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">Partners de Implementación</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Especial para agencias de marketing digital, consultores de negocios e implementadores de software. Ofrece la potencia tecnológica de Clientum CRM bajo tu marca y añade valor a tu cartera de clientes.
            </p>

            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Precios de Revendedor Preferenciales:</strong> Descuentos exclusivos y la opción de configurar marca blanca (White Label).
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Capacitación y Certificación VIP:</strong> Onboarding técnico premium directo con nuestros desarrolladores.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Derivación de Leads Locales:</strong> Compartimos contigo leads en tu zona geográfica que requieran servicios de implementación manual en campo.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setSelectedTrack('implementador');
                setIsApplyModalOpen(true);
              }}
              className="w-full py-3.5 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 hover:bg-[#eef1f6] hover:dark:bg-[#eef1f6] hover:dark:bg-slate-800 text-[#0f172a] dark:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <span>Postularme como Partner Certificado</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </section>

      {/* 3. Niveles: Del primer referido a partner preferente */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono uppercase text-blue-600 font-bold">Escala Comercial</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Niveles: Del primer referido a partner preferente
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((lvl, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs">
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
                {lvl.level}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{lvl.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{lvl.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Cómo sumarte: Cuatro pasos para empezar */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono uppercase text-blue-600 font-bold">Proceso Simple</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Cómo sumarte: Cuatro pasos para empezar
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-2xs relative">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
                {st.num}
              </span>
              <h3 className="font-bold text-base text-slate-900">{st.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reusable Ecosystem Sections: Industrias & Casos, Soluciones & Servicios, # Leverage, Empezar, Características */}
      <PublicEcosystemSections onNavigate={onNavigate} />

      {/* Postulation Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedTrack === 'afiliado' ? 'Unirme como Afiliado' : 'Postulación Partner Certificado'}
                </h3>
                <p className="text-xs text-slate-500">Completá tus datos para contactarte en 24 horas.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Marcelo Gómez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="marcelo@agencia.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+54 9 298 451-0883"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Empresa / Agencia</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Mi Agencia Digital"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modalidad</label>
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="afiliado">Programa de Afiliados (30% Recurrente)</option>
                    <option value="implementador">Partner de Implementación (White Label)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mensaje o comentarios</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Contanos brevemente sobre tu perfil o cartera de clientes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
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
