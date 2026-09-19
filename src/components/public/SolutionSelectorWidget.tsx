import React, { useState } from 'react';
import {
  MessageSquare,
  FileSpreadsheet,
  Globe,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Check,
  Send
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';

interface SolutionSelectorWidgetProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenWizard?: () => void;
}

export const SolutionSelectorWidget: React.FC<SolutionSelectorWidgetProps> = ({ onNavigate, onOpenWizard }) => {
  const { triggerConfetti, showToast } = useCRM();
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userContact, setUserContact] = useState({ name: '', whatsapp: '', company: '' });

  const solutions = [
    {
      id: 'sol-whatsapp',
      title: 'Chatbot WhatsApp con IA',
      badge: 'Atención 24/7',
      desc: 'Respuestas automáticas inteligentes con Gemini 3.6 Flash y captura de prospectos sin demoras.',
      icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
      idealFor: 'Negocios con alto volumen de consultas y ventas por chat.'
    },
    {
      id: 'sol-crm-afip',
      title: 'CRM + Facturación AFIP',
      badge: 'Ventas & Facturas',
      desc: 'Pipeline comercial Kanban con emisión de comprobantes electrónicos CAE en 1 clic.',
      icon: <FileSpreadsheet className="w-5 h-5 text-blue-600" />,
      idealFor: 'Distribuidores, mayoristas y servicios con facturación frecuente.'
    },
    {
      id: 'sol-web-ecommerce',
      title: 'Desarrollo Web & E-commerce',
      badge: 'Presencia & Pagos',
      desc: 'Sitios web de alta conversión y tiendas sincronizadas con MercadoPago y stock CRM.',
      icon: <Globe className="w-5 h-5 text-purple-600" />,
      idealFor: 'Marcas y comercios que buscan renovar su presencia digital.'
    },
    {
      id: 'sol-suite-pyme',
      title: 'Suite PyME Integral',
      badge: 'Todo en Uno',
      desc: '16 módulos activos para reemplazar más de 12 suscripciones dispersas y ahorrar costos.',
      icon: <Layers className="w-5 h-5 text-amber-600" />,
      idealFor: 'Empresas consolidadas que buscan centralización total.'
    }
  ];

  const handleSelect = (solId: string) => {
    setSelectedSolution(solId);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userContact.name || !userContact.whatsapp) {
      showToast('Por favor completa tu nombre y número de WhatsApp.', 'error');
      return;
    }
    triggerConfetti();
    showToast('¡Solicitud recibida! Un especialista de producto te contactará por WhatsApp en menos de 15 minutos.', 'success');
    setIsModalOpen(false);
    setUserContact({ name: '', whatsapp: '', company: '' });
  };

  return (
    <section className="p-8 sm:p-10 rounded-3xl bg-[#f8fafc] dark:bg-slate-900 text-[#0f172a] dark:text-white dark:text-white border border-[#e2e8f0] dark:border-slate-800 space-y-6 shadow-xl relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Diagnóstico Rápido de Solución</span>
        </div>
        <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
          ¿Qué solución necesita tu negocio hoy?
        </h3>
        <p className="text-xs sm:text-sm text-[#475569] dark:text-white dark:text-slate-300">
          Selecciona tu prioridad y te mostramos el flujo operativo recomendado para tu empresa.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {solutions.map((sol) => (
          <div
            key={sol.id}
            onClick={() => handleSelect(sol.id)}
            className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-cyan-400 hover:bg-[#eef1f6] hover:dark:bg-slate-800 transition-all cursor-pointer space-y-3 flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-[#f8fafc] dark:bg-slate-900 border border-[#cbd5e1] dark:border-slate-700">
                  {sol.icon}
                </div>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800">
                  {sol.badge}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#0f172a] dark:text-white dark:text-white group-hover:text-cyan-300 transition-colors">
                {sol.title}
              </h4>
              <p className="text-xs text-[#475569]/90 dark:text-slate-300/90 leading-relaxed">
                {sol.desc}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-cyan-400 font-bold">
              <span>Configurar flujo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Configuración Express
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {solutions.find((s) => s.id === selectedSolution)?.title}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Déjanos tus datos de contacto y un especialista te enviará una demo interactiva adaptada a tu sector en menos de 15 minutos.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-700">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  value={userContact.name}
                  onChange={(e) => setUserContact({ ...userContact, name: e.target.value })}
                  placeholder="Ej. Martín Gómez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Número de WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={userContact.whatsapp}
                  onChange={(e) => setUserContact({ ...userContact, whatsapp: e.target.value })}
                  placeholder="Ej. +54 9 298 412-3456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Nombre de la Empresa o Rubro</label>
                <input
                  type="text"
                  value={userContact.company}
                  onChange={(e) => setUserContact({ ...userContact, company: e.target.value })}
                  placeholder="Ej. Distribuidora del Valle"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Recibir Propuesta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
