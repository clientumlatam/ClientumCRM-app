import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Terminal,
  Play,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Send,
  FileSpreadsheet,
  MessageSquare,
  Bot
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';

interface PublicAcademyLandingProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenSimulator?: () => void;
}

export const PublicAcademyLanding: React.FC<PublicAcademyLandingProps> = ({
  onNavigate,
  onOpenSimulator
}) => {
  const { enterApp, showToast, triggerConfetti } = useCRM();
  const [activeTab, setActiveTab] = useState<'courses' | 'sandboxes' | 'certifications'>('courses');

  // Interactive Sandbox state
  const [sandboxAction, setSandboxAction] = useState<'invoice' | 'broadcast' | 'kanban'>('invoice');
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);

  const flagshipCourses = [
    {
      id: 'curso-ventas-b2b',
      title: 'Maestría en Ventas B2B con CRM y Automatización',
      badge: 'Más Solicitado',
      badgeColor: 'bg-blue-100 text-blue-800',
      duration: '4 semanas (16 horas cátedra)',
      level: 'Intermedio • Directores Comerciales y Vendedores',
      description: 'Aprende a estructurar un pipeline de 5 etapas, calificar prospectos bajo la metodología MEDDIC y programar secuencias de seguimiento que multiplican tus cierres.',
      modules: [
        'Estructura del pipeline de 5 etapas y SLAs de atención',
        'Calificación rigurosa de prospectos con metodología MEDDIC',
        'Automatización de alertas para evitar enfriamiento de presupuestos',
        'Analítica de forecast y métricas individuales por vendedor'
      ]
    },
    {
      id: 'curso-agentes-ia',
      title: 'Creación de Agentes de IA en WhatsApp sin Código',
      badge: 'Inteligencia Artificial',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      duration: '3 semanas (12 horas cátedra)',
      level: 'Todos los niveles • Sin requisitos de programación',
      description: 'Diseño paso a paso de flujos conversacionales con Gemini 3.7 Flash, configuración de catálogos dinámicos y reglas de derivación transparente a vendedores humanos.',
      modules: [
        'Arquitectura de agentes conversacionales y prompts efectivos',
        'Integración con catálogos de productos y listas de precios',
        'Reglas de derivación y handoff asistido a vendedores',
        'Simulación de pruebas de estrés y auditoría de calidad'
      ]
    },
    {
      id: 'curso-seo-marketing',
      title: 'Marketing Digital y SEO Avanzado para PyMEs',
      badge: 'Crecimiento Orgánico',
      badgeColor: 'bg-purple-100 text-purple-800',
      duration: '3 semanas (12 horas cátedra)',
      level: 'Intermedio • Equipos de Marketing y Emprendedores',
      description: 'Domina el posicionamiento local en Google Maps, optimización de velocidad web en Cloudflare y estrategias de prospección B2B saliente.',
      modules: [
        'Auditoría y optimización de fichas de Google Business Profile',
        'Arquitectura web técnica, Core Web Vitals y CDN Anycast',
        'Estrategias de prospección B2B en frío vía Maps y WhatsApp',
        'Medición de ROI y atribución de ventas por canal'
      ]
    }
  ];

  const handleRunSandbox = () => {
    if (sandboxAction === 'invoice') {
      setSandboxOutput('✅ [TEST ENVIRONMENT] Factura Electrónica B 0001-00004821 generada con éxito. CAE: 74218940192841. Comprobante de prueba emitido sin impacto fiscal real.');
    } else if (sandboxAction === 'broadcast') {
      setSandboxOutput('✅ [TEST ENVIRONMENT] Campaña simulada a 25 contactos de prueba completada. Tasa de entrega: 100%. Tiempo promedio: 1.2s. Sin consumo de créditos reales.');
    } else {
      setSandboxOutput('✅ [TEST ENVIRONMENT] Lead calificado movido a "Propuesta Presentada". Alerta automática de seguimiento programada para +48hs.');
    }
    triggerConfetti();
    showToast('Práctica en sandbox ejecutada correctamente', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans bg-white text-slate-900">
      
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Campus Virtual & Academia LMS Clientum</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Capacitación Comercial & Tecnología Práctica para PyMEs
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Cursos y entrenamientos interactivos para que tu equipo comercial domine el CRM, cree agentes de IA en WhatsApp y aumente sus ventas con simuladores en tiempo real.
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center pt-4">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'courses' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cursos Disponibles (3)
            </button>
            <button
              onClick={() => setActiveTab('sandboxes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sandboxes' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sandboxes & Prácticas</span>
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'certifications' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Certificación Oficial
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: COURSES */}
      {activeTab === 'courses' && (
        <section className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {flagshipCourses.map((course) => (
              <div
                key={course.id}
                className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-6 shadow-2xs hover:border-blue-300 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${course.badgeColor}`}>
                      {course.badge}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0f172a] dark:text-white dark:text-slate-400" />
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                    {course.title}
                  </h3>

                  <div className="text-xs text-blue-700 font-medium">
                    {course.level}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
                      Módulos Prácticos:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {course.modules.map((m, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <button
                    onClick={() => enterApp()}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Iniciar Curso en Campus Virtual</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: SANDBOXES & PRÁCTICAS INTERACTIVAS */}
      {activeTab === 'sandboxes' && (
        <section className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Sandbox de Entrenamiento Sin Riesgo</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Experimenta con emisión simulada de facturas, flujos de WhatsApp y cambios de etapa en pipeline antes de tocar datos reales.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Entorno Aislado 100% Seguro
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                setSandboxAction('invoice');
                setSandboxOutput(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                sandboxAction === 'invoice'
                  ? 'bg-white border-blue-600 shadow-xs text-blue-900'
                  : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 text-blue-600 mb-2" />
              <div className="font-bold text-xs">1. Emisión Factura AFIP</div>
              <p className="text-[11px] text-slate-500 mt-1">Simula cálculo de IVA, alícuotas y CAE de prueba.</p>
            </button>

            <button
              onClick={() => {
                setSandboxAction('broadcast');
                setSandboxOutput(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                sandboxAction === 'broadcast'
                  ? 'bg-white border-blue-600 shadow-xs text-blue-900'
                  : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              <Send className="w-5 h-5 text-emerald-600 mb-2" />
              <div className="font-bold text-xs">2. Broadcast WhatsApp</div>
              <p className="text-[11px] text-slate-500 mt-1">Prueba envío masivo de catálogo con variables dinámicas.</p>
            </button>

            <button
              onClick={() => {
                setSandboxAction('kanban');
                setSandboxOutput(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                sandboxAction === 'kanban'
                  ? 'bg-white border-blue-600 shadow-xs text-blue-900'
                  : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              <Bot className="w-5 h-5 text-purple-600 mb-2" />
              <div className="font-bold text-xs">3. Calificación & Pipeline</div>
              <p className="text-[11px] text-slate-500 mt-1">Evalúa criterios MEDDIC y transición de etapa.</p>
            </button>
          </div>

          {/* Interactive Run Console */}
          <div className="bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 rounded-2xl p-5 text-[#0f172a] dark:text-white font-mono text-xs space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-[#0f172a] dark:text-white dark:text-slate-400 border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                clientum-sandbox://sim-{sandboxAction}
              </span>
              <span>TestMode: Active</span>
            </div>

            <div className="py-2 text-[#0f172a] dark:text-white dark:text-slate-300">
              {sandboxAction === 'invoice' && '> Preparando petición WSFE mock: CUIT 30-71829384-9, Factura B, Total $124.500 ARS...'}
              {sandboxAction === 'broadcast' && '> Preparando plantilla pre-aprobada con placeholders: {{1}}=Nombre, {{2}}=Oferta...'}
              {sandboxAction === 'kanban' && '> Evaluando oportunidad #9421: Presupuesto validado, tomador de decisión identificado...'}
            </div>

            {sandboxOutput && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 animate-in fade-in">
                {sandboxOutput}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleRunSandbox}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ejecutar Prueba en Sandbox</span>
              </button>
              <span className="text-[11px] text-slate-500 font-sans">
                Sin consumo de saldo ni tokens
              </span>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: CERTIFICATIONS */}
      {activeTab === 'certifications' && (
        <section className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Certificación Oficial Clientum Certified Professional
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Al completar las prácticas en el campus y aprobar el examen final de 30 preguntas, recibes un diploma digital verificable por blockchain para validar tus competencias ante empleadores y clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-900">Diploma Verificable</div>
              <p className="text-[11px] text-slate-500">ID único de validación para LinkedIn y CV profesional.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-900">Examen Práctico</div>
              <p className="text-[11px] text-slate-500">Evaluación de escenarios reales de ventas y automatización.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-900">Bolsa de Trabajo</div>
              <p className="text-[11px] text-slate-500">Acceso prioritario a empresas de la red que buscan operadores.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => enterApp()}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
            >
              Inscribirme al Programa de Certificación
            </button>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="text-center p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
        <h3 className="text-lg font-bold text-slate-900">¿Deseas capacitar a todo el equipo de tu empresa?</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Ofrecemos planes corporativos in-company con cohortes privadas y tutores dedicados.
        </p>
        <button
          onClick={() => onNavigate('/contacto')}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs cursor-pointer shadow-2xs"
        >
          Consultar por Capacitación In-Company
        </button>
      </section>

    </div>
  );
};
