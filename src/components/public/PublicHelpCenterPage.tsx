import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Ticket,
  Mail,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  ArrowRight,
  Search,
  ExternalLink
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';

interface PublicHelpCenterPageProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenWizard: () => void;
}

export const PublicHelpCenterPage: React.FC<PublicHelpCenterPageProps> = ({
  onNavigate,
  onOpenWizard,
}) => {
  const { showToast } = useCRM();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    company: '',
    category: 'Soporte Técnico',
    message: '',
  });

  const faqs = [
    {
      q: '¿Qué servicios integrales ofrece exactamente Clientum?',
      a: 'Clientum es una plataforma unificada y agencia de consultoría tecnológica que combina: CRM omnicanal para ventas, Chatbots con Inteligencia Artificial conectados a WhatsApp (Meta Cloud API oficial), facturación electrónica homologada ante AFIP con CAE automático, herramientas de prospección masiva en Google Maps y desarrollo web corporativo ultra rápido de alta conversión.',
    },
    {
      q: '¿Cuánto tiempo toma el desarrollo y puesta en marcha de un sitio web o CRM?',
      a: 'Nuestros despliegues estándar se realizan en un plazo garantizado de 5 a 7 días hábiles (SLA certificado). El equipo técnico configura tus etapas de embudo, migra tus bases de datos de Excel o contactos antiguos, entrena el bot de WhatsApp con tu catálogo oficial y vincula los certificados fiscales de AFIP para que comiences a operar de inmediato.',
    },
    {
      q: '¿Qué métodos de pago aceptan y si el IVA se calcula en el precio?',
      a: 'Aceptamos transferencias bancarias en Pesos Argentinos (ARS), tarjetas de crédito y débito vía Mercado Pago, y pagos internacionales en Dólares (USD) mediante Stripe o PayPal. Todos los precios están expresados en valores netos; emitimos Facturas Oficiales A, B o C según la condición fiscal de tu empresa ante AFIP.',
    },
    {
      q: '¿Ofrecen soporte técnico post-implementación?',
      a: 'Sí, todos nuestros planes incluyen soporte continuo. Los planes Iniciales cuentan con soporte vía correo electrónico con respuesta en menos de 24 horas hábiles. Los planes Profesional y Enterprise cuentan con soporte prioritario vía WhatsApp en tiempo real, canales dedicados de Slack/Teams y reuniones quincenales de optimización con un Account Manager asignado.',
    },
    {
      q: '¿Qué ventajas tiene Clientum sobre otras agencias tradicionales?',
      a: 'A diferencia de consultoras tradicionales o software genérico de Silicon Valley, Clientum está 100% adaptado a la realidad operativa de las PyMEs de Argentina y Latinoamérica: costos previsibles en moneda local, integración nativa con AFIP y Mercado Pago, soporte humano en tu mismo huso horario y puesta en marcha express sin contratos forzosos de permanencia.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.name || !ticketForm.email || !ticketForm.message) {
      showToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }
    showToast(`Ticket #${Math.floor(1000 + Math.random() * 9000)} generado con éxito. Te contactaremos en menos de 4 horas.`, 'success');
    setIsTicketModalOpen(false);
    setTicketForm({ name: '', email: '', company: '', category: 'Soporte Técnico', message: '' });
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent('Hola equipo de soporte Clientum, necesito asistencia técnica con mi cuenta.');
    window.open(`https://wa.me/5492984123456?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans bg-white text-slate-900">
      
      {/* 1. Header Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Centro de Ayuda · Soporte 24/7</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Soporte & Base de Conocimiento
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Encuentra respuestas inmediatas a tus dudas técnicas o contáctate directamente con nuestro equipo de soporte prioritario.
        </p>

        {/* Search Input */}
        <div className="pt-2 max-w-lg mx-auto relative">
          <Search className="w-5 h-5 text-[#0f172a] dark:text-white dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por servicio, AFIP, WhatsApp, facturación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition-all"
          />
        </div>
      </section>

      {/* 2. Direct Support Channels Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Channel */}
        <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Canal de Soporte de WhatsApp</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ¿Necesitas asistencia inmediata? Chatea directamente con nuestro bot calificador y sé derivado a un operador técnico si es necesario. Atendemos consultas generales las 24 horas.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Iniciar Chat WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Ticket & Email Support Channel */}
        <div className="p-8 rounded-3xl bg-blue-50/60 border border-blue-200 space-y-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Soporte por Ticket & Correo Electrónico</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Para consultas de facturación, contratos corporativos, solicitudes de integraciones complejas con ERP locales o problemas con cursos de Clientum Academia.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Ticket className="w-4 h-4" />
              <span>Crear Ticket Prioritario</span>
            </button>

            <a
              href="mailto:info@clientum.com.ar"
              className="flex-1 py-3.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Enviar Email</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Accordion FAQs Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase text-blue-600 font-bold">Respuestas Directas</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <span className="font-bold text-base sm:text-lg text-slate-900">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Ticket className="w-5 h-5 text-blue-600" />
                <span>Generar Ticket de Soporte</span>
              </div>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcelo Rossi"
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email de Contacto *</label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@empresa.com"
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Empresa / Organización</label>
                  <input
                    type="text"
                    placeholder="Ej: Agro Sur SRL"
                    value={ticketForm.company}
                    onChange={(e) => setTicketForm({ ...ticketForm, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoría del Requerimiento</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
                >
                  <option value="Soporte Técnico">Soporte Técnico & Integración</option>
                  <option value="Facturación AFIP">Facturación AFIP & Certificados</option>
                  <option value="Chatbot WhatsApp">Chatbot WhatsApp Meta API</option>
                  <option value="Comercial / Planes">Comercial / Cambio de Plan</option>
                  <option value="Academia & Cursos">Academia & Certificaciones</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción del Problema o Solicitud *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detalla tu consulta para asignarla de inmediato al especialista correspondiente..."
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
