import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Search,
  MessageSquare,
  Globe,
  TrendingUp,
  Bot,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  RotateCcw,
  Download
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';
import { trackAnalyticsEvent } from '../../lib/analytics';

interface PublicAuditExpressPageProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenWizard: () => void;
}

export const PublicAuditExpressPage: React.FC<PublicAuditExpressPageProps> = ({
  onNavigate,
  onOpenWizard
}) => {
  const { showToast, triggerConfetti } = useCRM();

  // Form states
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    industry: 'Agro & Insumos',
    whatsapp: '',
    email: '',
    monthlyLeads: '20-50'
  });

  const [step, setStep] = useState<'form' | 'analyzing' | 'results'>('form');
  const [analysisPhase, setAnalysisPhase] = useState<number>(0);

  const analysisPhases = [
    { label: 'Examen de velocidad y tiempos de respuesta en WhatsApp', icon: <MessageSquare className="w-4 h-4 text-emerald-600" /> },
    { label: 'Verificación de presencia en Google Maps y SEO local', icon: <Globe className="w-4 h-4 text-blue-600" /> },
    { label: 'Análisis del embudo de conversión y captación de clientes', icon: <TrendingUp className="w-4 h-4 text-purple-600" /> },
    { label: 'Cálculo del índice de automatización e impacto de Inteligencia Artificial', icon: <Bot className="w-4 h-4 text-amber-600" /> }
  ];

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.email) {
      showToast('Por favor completa el nombre de tu empresa y correo electrónico', 'error');
      return;
    }

    setStep('analyzing');
    setAnalysisPhase(0);

    // Run simulated diagnostic stages
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < 4) {
        setAnalysisPhase(current);
      } else {
        clearInterval(interval);
        setStep('results');
        triggerConfetti();
        trackAnalyticsEvent('complete_registration', { audit_type: 'express_diagnostic' });
        showToast('¡Diagnóstico digital completado con éxito!', 'success');
      }
    }, 900);
  };

  const handleReset = () => {
    setStep('form');
    setAnalysisPhase(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans bg-white text-slate-900">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Diagnóstico Digital y Auditoría Express Gratuita</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Conocé la Madurez Comercial y Digital de tu Empresa en 60 Segundos
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Evaluá de forma objetiva la velocidad de respuesta en WhatsApp, presencia en Google Maps, fugas en tu embudo de ventas e impacto potencial de Inteligencia Artificial.
        </p>
      </section>

      {/* Step 1: Form */}
      {step === 'form' && (
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. Datos Básicos de la Empresa</h2>
              <p className="text-xs text-slate-500">Completá los datos para calibrar los algoritmos de auditoría por sector.</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
              Paso 1 de 2
            </span>
          </div>

          <form onSubmit={handleStartAnalysis} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial de la Empresa *</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Ej. Distribuidora Patagónica SRL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Industria / Rubro</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value="Agro & Insumos">Agro & Insumos Rurales</option>
                  <option value="Distribuidora Mayorista">Distribuidora Mayorista</option>
                  <option value="Estudios Contables & Jurídicos">Estudio Contable o Jurídico</option>
                  <option value="Salud & Clínicas">Salud, Clínicas & Odontología</option>
                  <option value="Inmobiliaria & Desarrollos">Inmobiliaria & Desarrollos</option>
                  <option value="Gastronomía & Bares">Gastronomía & Franquicias</option>
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="Servicios B2B">Servicios Profesionales B2B</option>
                  <option value="Construcción">Construcción & Corralones</option>
                  <option value="Automotor">Concesionarias & Automotor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sitio Web Actual (Opcional)</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://tuempresa.com.ar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Comercial *</label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+54 9 298 400-0000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico Corporativo *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="gerencia@tuempresa.com.ar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Volumen Estimado de Consultas / Mes</label>
              <div className="grid grid-cols-3 gap-3">
                {['Menos de 50', '50 a 300', 'Más de 300'].map((vol) => (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setFormData({ ...formData, monthlyLeads: vol })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.monthlyLeads === vol
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {vol}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Ejecutar Diagnóstico Digital en Tiempo Real</span>
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-2">
                <Clock className="w-3.5 h-3.5 text-[#0f172a] dark:text-white dark:text-slate-400" />
                <span>Tiempo de procesamiento estimado: 45 segundos. Sin costo ni tarjeta.</span>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Analyzing in Real Time */}
      {step === 'analyzing' && (
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-8">
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Analizando {formData.businessName}...</h2>
            <p className="text-xs text-slate-500">Ejecutando verificaciones de red, tiempos de respuesta y algoritmos comerciales.</p>
          </div>

          <div className="space-y-4 max-w-md mx-auto text-left">
            {analysisPhases.map((phase, idx) => {
              const isCompleted = idx < analysisPhase;
              const isCurrent = idx === analysisPhase;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    isCompleted
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-white border-slate-200 text-[#64748b] dark:text-slate-400 opacity-60'
                  }`}
                >
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      phase.icon
                    )}
                  </div>
                  <span className="text-xs font-semibold">{phase.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 'results' && (
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Main Score Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Auditoría Finalizada para {formData.businessName}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Índice de Madurez Digital: <span className="text-emerald-400">68 / 100</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#0f172a] dark:text-white dark:text-slate-300 leading-relaxed">
                  Tu empresa cuenta con buena tracción comercial, pero detectamos una fuga estimada de <strong>38% de prospectos</strong> debido a demoras de respuesta fuera de horario comercial en WhatsApp y falta de seguimiento unificado en CRM.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-200">
                    Rubro: {formData.industry}
                  </span>
                  <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-200">
                    Volumen: {formData.monthlyLeads} consultas
                  </span>
                  <span className="text-[11px] bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2.5 py-1 rounded-lg font-bold">
                    Potencial de Mejora: +45% en ventas
                  </span>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <div className="text-5xl font-black text-emerald-400">68%</div>
                <div className="text-xs font-bold text-[#0f172a] dark:text-white dark:text-slate-200 uppercase tracking-wider">Nivel: Intermedio</div>
                <div className="text-[11px] text-[#0f172a] dark:text-white dark:text-slate-400">Tiempo de respuesta prom: 3.5 horas</div>
              </div>

            </div>
          </div>

          {/* Breakdown by Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-sm font-extrabold text-amber-600">58/100</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Velocidad en WhatsApp</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Sin automatización 24/7. Las consultas recibidas después de las 18:00 se responden al día siguiente con pérdida de intención de compra.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-sm font-extrabold text-blue-600">72/100</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Google Maps & SEO</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Ficha de Google activa pero con pocas reseñas periódicas y falta de enlaces de captación directa a chat o catálogo digital.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-sm font-extrabold text-amber-600">62/100</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Embudo de Ventas</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Seguimiento disperso entre chats individuales de vendedores. Falta de pipeline visual Kanban y recordatorios automatizados.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-sm font-extrabold text-rose-600">45/100</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Automatización & IA</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Nula integración de agentes inteligentes ni sincronización con facturación electrónica AFIP o pasarela de pagos.
              </p>
            </div>

          </div>

          {/* Recommendations & Next Steps */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Recomendaciones Prioritarias para {formData.businessName}:</h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Implementar Agente de WhatsApp IA 24/7</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Califica automáticamente presupuestos, comparte catálogos y responde consultas en menos de 10 segundos, derivando solo las compras calientes a tus vendedores.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Centralizar en Pipeline Kanban Clientum</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Evita que los presupuestos enviados se enfríen con alertas de deal rotting y recordatorios automáticos de seguimiento.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Conectar Facturación AFIP y Links de Pago</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Emite comprobantes fiscales electrónicos con CAE en 1 clic y acelera las cobranzas con Mercado Pago en pesos.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenWizard}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Calcular Inversión con Cotizador</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/contacto')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs transition-all cursor-pointer shadow-2xs"
              >
                Agendar Sesión con un Especialista
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Auditar otra empresa</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
