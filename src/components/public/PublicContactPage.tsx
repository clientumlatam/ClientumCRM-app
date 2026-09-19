import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Building2,
  Users
} from 'lucide-react';
import { CLIENTUM_BROCHURE_METRICS } from '../../data/clientumCatalog';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';
import { trackAnalyticsEvent } from '../../lib/analytics';

interface PublicContactPageProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicContactPage: React.FC<PublicContactPageProps> = ({ onNavigate }) => {
  const { showToast, triggerConfetti } = useCRM();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: 'Agro',
    teamSize: '3-10 vendedores',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/public/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'No se pudo enviar la solicitud.');

      setSubmitted(true);
      trackAnalyticsEvent('generate_lead', { lead_type: 'demo_request' });
      triggerConfetti();
      showToast('¡Solicitud enviada con éxito! Un consultor se comunicará en menos de 4 horas hábiles.', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo enviar la solicitud.';
      setSubmitError(message);
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans bg-white text-slate-900">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>Contacto & Solicitud de Demostración</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Hablemos sobre el Crecimiento Comercial de tu Empresa
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          ¿Querés ver una demo adaptada a tu rubro, evaluar costos o resolver dudas técnicas? Estamos para ayudarte.
        </p>
      </section>

      {/* Main Grid: Form + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Contact Info & Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900">Canales de Atención Directa</h2>
            
            <div className="space-y-4 text-xs">
              <a
                href="https://wa.me/542984510883?text=Hola%20ClientumCRM,%20quiero%20solicitar%20una%20demostraci%C3%B3n"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 flex items-start gap-3 transition-colors block shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">WhatsApp Oficial Directo</div>
                  <div className="text-emerald-700 font-mono mt-0.5 font-bold">{CLIENTUM_BROCHURE_METRICS.phone}</div>
                  <div className="text-[11px] text-slate-600 mt-1">Respuesta inmediata de lunes a viernes (9:00 a 18:00 hs ART).</div>
                </div>
              </a>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Correo Corporativo</div>
                  <a href={`mailto:${CLIENTUM_BROCHURE_METRICS.email}`} className="text-blue-600 font-mono mt-0.5 block hover:underline font-semibold">
                    {CLIENTUM_BROCHURE_METRICS.email}
                  </a>
                  <div className="text-[11px] text-slate-600 mt-1">Para consultas comerciales, licitaciones y alianzas de software.</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Sedes Operativas</div>
                  <div className="text-slate-800 mt-0.5 font-semibold">{CLIENTUM_BROCHURE_METRICS.location}</div>
                  <div className="text-[11px] text-slate-600 mt-1">Patagonia Argentina & Rosario, Santa Fe.</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 text-xs text-slate-600 shadow-xs">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Tiempo de respuesta garantizado menor a 4 horas hábiles.</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Form */}
        <div className="lg:col-span-7">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Solicitar Demostración 1-a-1</h2>
              <p className="text-xs text-slate-600 mt-1">
                Completa el formulario y te prepararemos una sesión interactiva enfocada en tu industria.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">¡Mensaje Recibido, {form.name}!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Uno de nuestros consultores especialistas en {form.industry} se contactará al {form.phone || form.email} para coordinar la demo.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer shadow-xs"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <fieldset disabled={isSubmitting} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ej: Laura Gómez"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-[#0f172a] placeholder:dark:text-white placeholder:dark:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Email Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="laura@miempresa.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-[#0f172a] placeholder:dark:text-white placeholder:dark:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">WhatsApp / Teléfono *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+54 9 11 ..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-[#0f172a] placeholder:dark:text-white placeholder:dark:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Empresa *</label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Nombre comercial"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-[#0f172a] placeholder:dark:text-white placeholder:dark:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Industria / Rubro</label>
                    <select
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs"
                    >
                      <option value="Agro">Agro & Maquinaria</option>
                      <option value="Estudios Contables">Estudios Contables & Finanzas</option>
                      <option value="Distribuidoras">Distribuidoras Mayoristas</option>
                      <option value="Salud">Salud, Clínicas & Sanatorios</option>
                      <option value="Inmobiliarias">Inmobiliarias & Desarrollos</option>
                      <option value="Gastronomia">Gastronomía & Franquicias</option>
                      <option value="E-Commerce">E-Commerce & Retail</option>
                      <option value="Construccion">Construcción & Obras</option>
                      <option value="Automotor">Automotor & Concesionarias</option>
                      <option value="Servicios B2B">Servicios Profesionales B2B</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Equipo Comercial</label>
                    <select
                      value={form.teamSize}
                      onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs"
                    >
                      <option value="1-2">1 a 2 personas</option>
                      <option value="3-10">3 a 10 vendedores</option>
                      <option value="11-25">11 a 25 vendedores</option>
                      <option value="25+">Más de 25 personas</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">¿Qué desafío te gustaría resolver principalmente?</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Ej: Queremos automatizar WhatsApp para que ningún cliente espere y poder emitir facturas AFIP en el momento..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-[#0f172a] placeholder:dark:text-white placeholder:dark:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none shadow-xs"
                  />
                </div>

                {submitError && (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs text-red-700">
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando solicitud...' : 'Enviar y Agendar Demostración'}</span>
                </button>
                </fieldset>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Preguntas Frecuentes & Confianza (contacto_faq.md) */}
      <section className="space-y-8 pt-6 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Preguntas Frecuentes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Todo lo que necesitas saber antes de comenzar con Clientum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">
              ¿Cuánto demora la implementación del CRM y WhatsApp IA?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menos de 48 horas en promedio. Nuestro equipo de onboarding se encarga de la configuración del pipeline, importación de tus contactos desde Excel y conexión del número oficial de WhatsApp.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">
              ¿Es compatible con facturación electrónica de AFIP?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sí, 100% compatible. Emitimos Facturas A, B y C con CAE oficial y código QR directamente desde el trato comercial mediante el webservice WSFE oficial de AFIP en menos de 2 segundos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">
              ¿Puedo cancelar mi suscripción en cualquier momento?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sí, totalmente. No tenemos cláusulas de permanencia forzada ni penalidades de cancelación. Tus datos son siempre de tu propiedad y puedes exportarlos en formato CSV cuando lo desees.
            </p>
          </div>
        </div>

        {/* Confianza y SLA 99.9% */}
        <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Infraestructura Segura, Confiable y con Soberanía de Datos</span>
            </div>
            <p className="text-xs text-blue-800 max-w-2xl">
              Cifrado SSL de 256 bits, centros de datos Anycast de alta redundancia, 99.9% de uptime garantizado por SLA y soporte humano directo en tu mismo huso horario.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/brochure')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-all"
          >
            Ver Ficha Técnica y SLA
          </button>
        </div>
      </section>

    </div>
  );
};
