import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Bot,
  MessageSquare,
  Briefcase,
  Building2,
  Users,
  BarChart3,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Globe,
  Star,
  Layers,
  Zap,
  Check,
  Receipt,
  Clock,
  Play,
  ChevronRight,
  ChevronDown,
  Calculator,
  Kanban,
  Award,
  HelpCircle,
  FolderGit2,
  CheckSquare
} from 'lucide-react';
import { CLIENTUM_BROCHURE_METRICS, CLIENTUM_PILLARS, CLIENTUM_SOLUTIONS } from '../../data/clientumCatalog';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';
import { PublicPlatformMap } from './PublicPlatformMap';
import { PublicSiteHighlights } from './PublicSiteHighlights';
import { PublicDashboardShowcase } from './PublicDashboardShowcase';
import { SolutionSelectorWidget } from './SolutionSelectorWidget';
import { RealTeamsSection } from './RealTeamsSection';

interface PublicHomeProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenWizard: () => void;
  onOpenSimulator: () => void;
  onOpenAudit: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onNavigate,
  onOpenWizard,
  onOpenSimulator,
  onOpenAudit,
}) => {
  const { enterApp } = useCRM();

  // Preview active tab state
  const [previewTab, setPreviewTab] = useState<'pipeline' | 'whatsapp' | 'afip'>('pipeline');
  
  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // ROI Calculator state
  const [roiRepCount, setRoiRepCount] = useState<number>(5);
  const [roiMonthlyLeads, setRoiMonthlyLeads] = useState<number>(180);
  const [roiAvgDealARS, setRoiAvgDealARS] = useState<number>(550000);

  const estimatedExtraRevenue = Math.round(roiMonthlyLeads * 0.16 * roiAvgDealARS);
  const estimatedHoursSaved = roiRepCount * 24;

  // WhatsApp demo interactive messages
  const [waMessages, setWaMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { sender: 'user', text: 'Hola, vi sus planes de CRM para distribución mayorista. ¿Tienen precios en pesos?', time: '10:42' },
    { sender: 'bot', text: '¡Hola! Sí, absolutamente. Todos nuestros planes son 100% en Pesos Argentinos (ARS) sin retenciones ni sorpresas en tarjeta. ¿Cuántos vendedores operan en tu equipo comercial?', time: '10:42' },
    { sender: 'user', text: 'Somos 6 ejecutivos de ventas en calle y 2 en administración.', time: '10:43' },
    { sender: 'bot', text: 'Excelente. Te recomendamos el Plan Profesional con módulo de Prospección Google Maps y Facturación AFIP integrada. ¿Te gustaría agendar una demo guiada de 15 minutos hoy?', time: '10:43' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userText = chatInput;
    setWaMessages(prev => [...prev, { sender: 'user', text: userText, time: now }]);
    setChatInput('');

    setTimeout(() => {
      setWaMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `Entendido: "${userText}". Nuestro Agente Comercial califica este requerimiento y asigna un ejecutivo con SLA < 4 horas.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 900);
  };

  const faqs = [
    {
      q: '¿Por qué elegir Clientum en lugar de HubSpot o Salesforce?',
      a: 'Clientum está diseñado desde cero para la realidad operativa de las PyMEs de América Latina: precios transparentes en pesos sin impuestos al dólar, soporte humano directo por WhatsApp en menos de 4 horas, integración homologada con AFIP para emitir facturas A, B y C con CAE automático en 1 clic, y una puesta en marcha de menos de 5 días hábiles.'
    },
    {
      q: '¿Cómo funciona la integración de WhatsApp con Inteligencia Artificial?',
      a: 'Soportamos tanto conexión por código QR (mediante gateway Baileys para usar tu número actual en minutos) como la API oficial de Meta Cloud API para números corporativos. Nuestro bot impulsado por un asistente IA se entrena con tu catálogo de productos y preguntas frecuentes, respondiendo en segundos y transfiriendo leads calificados a tus vendedores.'
    },
    {
      q: '¿Cuánto tiempo toma la implementación y migración de datos?',
      a: 'El 90% de las empresas están 100% operativas en menos de 5 días hábiles. Además, nuestro equipo de ingenieros realiza la migración asistida de tus contactos y bases de datos desde planillas de Excel o CRMs anteriores sin costo adicional.'
    },
    {
      q: '¿Se requiere tarjeta de crédito para probar la plataforma?',
      a: 'No. Puedes explorar la demostración interactiva en vivo con datos precargados con un solo clic, sin formularios obligatorios ni datos bancarios.'
    },
    {
      q: '¿Es compatible con facturación electrónica de AFIP?',
      a: 'Sí, totalmente. Clientum cuenta con módulo nativo para generar Facturas A, B y C con obtención de CAE y código QR fiscal en tiempo real, permitiendo enviar la factura en PDF directamente por WhatsApp o email al cliente en cuanto se cierra la oportunidad.'
    }
  ];

  return (
    <div className="bg-[var(--bg-canvas)] dark:bg-[#040711] text-[var(--text-primary)] dark:text-slate-100 space-y-24 pb-20 transition-colors duration-200">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-14 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-[var(--border-subtle)] dark:border-[#1e2e4a] bg-gradient-to-b from-[var(--bg-muted)] via-[var(--bg-canvas)] to-[var(--bg-surface)] dark:from-[#080d1a] dark:via-[#050812] dark:to-[#090e1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-900 dark:text-blue-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Plataforma Comercial Omnicanal • +1.750 PyMEs en Cono Sur</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] dark:text-white tracking-tight leading-[1.15]">
              El CRM comercial que convierte tus{' '}
              <span className="text-[var(--clientum-action,#0056B3)] dark:text-blue-400">
                Conversaciones en Ventas
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Unifica WhatsApp, pipeline visual Kanban y facturación AFIP en una sola plataforma.
              Operá con soporte humano, moneda local y herramientas pensadas para PyMEs latinoamericanas.
            </p>

            {/* Primary Action Buttons - Pill Navy Palette */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => enterApp()}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer active:scale-98"
              >
                <span>Probar Demo Interactiva Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenWizard}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-2xs flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer active:scale-98"
              >
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Calcular Ahorro & ROI</span>
              </button>

              <button
                onClick={onOpenAudit}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-2xs flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Auditoría Digital 60s</span>
              </button>
            </div>

            {/* Verified Metric Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] dark:bg-[#0d1527] border border-[var(--border-subtle)] dark:border-[#1e2e4a] shadow-2xs transition-colors">
                <div className="text-xl sm:text-2xl font-black text-[var(--text-primary)] dark:text-white">{CLIENTUM_BROCHURE_METRICS.activePymes}</div>
                <div className="text-xs text-[var(--text-muted)] dark:text-slate-400 font-medium">PyMEs Activas en Latam</div>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] dark:bg-[#0d1527] border border-[var(--border-subtle)] dark:border-[#1e2e4a] shadow-2xs transition-colors">
                <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">{CLIENTUM_BROCHURE_METRICS.slaReal}</div>
                <div className="text-xs text-[var(--text-muted)] dark:text-slate-400 font-medium">Disponibilidad SLA Real</div>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] dark:bg-[#0d1527] border border-[var(--border-subtle)] dark:border-[#1e2e4a] shadow-2xs transition-colors">
                <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">&lt; 4 horas</div>
                <div className="text-xs text-[var(--text-muted)] dark:text-slate-400 font-medium">Soporte Humano WhatsApp</div>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] dark:bg-[#0d1527] border border-[var(--border-subtle)] dark:border-[#1e2e4a] shadow-2xs transition-colors">
                <div className="text-xl sm:text-2xl font-black text-[var(--text-primary)] dark:text-white">&lt; 5 días</div>
                <div className="text-xs text-[var(--text-muted)] dark:text-slate-400 font-medium">Implementación Completa</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PUBLIC SITE DOCUMENTATION HIGHLIGHTS */}
      <PublicSiteHighlights
        onNavigate={onNavigate}
        onOpenWizard={onOpenWizard}
        onOpenSimulator={onOpenSimulator}
      />

      {/* 3. EXECUTIVE DASHBOARD SHOWCASE */}
      <PublicDashboardShowcase
        onNavigate={onNavigate}
        onOpenSimulator={onOpenSimulator}
        onOpenWizard={onOpenWizard}
      />

      {/* 4. INTERACTIVE PRODUCT PREVIEW SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Play className="w-3 h-3 text-blue-600" />
            <span>Demostración en Vivo</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Experimenta el Poder de Clientum sin Registrarte
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Elegí una capacidad para ver cómo Clientum ordena una tarea comercial concreta.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setPreviewTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              previewTab === 'pipeline'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Pipeline Kanban</span>
          </button>

          <button
            onClick={() => setPreviewTab('whatsapp')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              previewTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Bot IA</span>
          </button>

          <button
            onClick={() => setPreviewTab('afip')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              previewTab === 'afip'
                ? 'bg-blue-800 text-white shadow-md shadow-blue-800/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Facturación AFIP</span>
          </button>
        </div>

        {/* Dynamic Interactive Stage Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Top Window Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs text-slate-500 font-mono ml-2">app.clientum.com.ar/{previewTab}</span>
            </div>
            <button
              onClick={() => enterApp()}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir vista completa en CRM</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Tab 1: Pipeline Kanban View */}
          {previewTab === 'pipeline' && (
            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1 */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Prospección Calificada
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">$3.450.000 ARS</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors shadow-xs">
                    <div className="text-xs font-bold text-slate-900">Frigorífico del Valle S.A.</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Plan ERP + 12 terminales</div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-600">$1.850.000 ARS</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">Alta Probabilidad</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors shadow-xs">
                    <div className="text-xs font-bold text-slate-900">Agropecuaria Patagonia</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Módulo de Trazabilidad & GPS</div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-600">$1.600.000 ARS</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">WhatsApp Activo</span>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Propuesta Enviada (PDF)
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">$5.200.000 ARS</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-amber-300 transition-colors shadow-xs">
                    <div className="text-xs font-bold text-slate-900">Distribuidora Andina SRL</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Suite Completa + AFIP Masivo</div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-600">$3.200.000 ARS</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-[10px]">Vence en 48hs</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-amber-300 transition-colors shadow-xs">
                    <div className="text-xs font-bold text-slate-900">Clínica Roca Salud</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Turnos WhatsApp + Pacientes</div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-600">$2.000.000 ARS</span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold text-[10px]">Demo Realizada</span>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Cierre & Facturado AFIP
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">$8.900.000 ARS</span>
                  </div>
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg shadow-xs">
                    <div className="text-xs font-bold text-slate-900">Logística Fueguina</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Factura A-0001-00049281 • CAE Emitido</div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-700">$4.500.000 ARS</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">Pagado MP</span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg shadow-xs">
                    <div className="text-xs font-bold text-slate-900">Bodega Alto Valle</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Tienda Digital + WhatsApp Bot</div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-700">$4.400.000 ARS</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">CAE Aprobado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: WhatsApp Bot IA Simulator */}
          {previewTab === 'whatsapp' && (
            <div className="p-6 bg-slate-100 flex justify-center">
              <div className="w-full max-w-md bg-[#eef1f6] dark:bg-[[#eef1f6]] dark:bg-[#e5ddd5] rounded-2xl overflow-hidden shadow-lg border border-slate-300">
                {/* Chat Header */}
                <div className="bg-[#eef1f6] dark:bg-[[#eef1f6]] dark:bg-[#075e54] text-[#0f172a] dark:text-white dark:text-white p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center font-bold text-slate-900 text-xs">
                      IA
                    </div>
                    <div>
                      <div className="text-xs font-bold">Clientum Bot • Asistente IA</div>
                      <div className="text-[10px] text-emerald-200">En línea • Responde en 2 segundos</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-full font-semibold">Oficial</span>
                </div>

                {/* Chat Message Stream */}
                <div className="p-4 space-y-3 h-72 overflow-y-auto bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]">
                  {waMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-2.5 text-xs shadow-xs ${
                          msg.sender === 'user'
                            ? 'bg-[#eef1f6] dark:bg-[#dcf8c6] text-slate-900 rounded-tr-none'
                            : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                        }`}
                      >
                        <div>{msg.text}</div>
                        <div className="text-[9px] text-[#64748b] dark:text-white dark:text-slate-400 text-right mt-1">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChatMessage} className="p-2 bg-[#eef1f6] dark:bg-[[#eef1f6]] dark:bg-[#f0f0f0] border-t border-slate-300 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Escribe un mensaje de prueba al bot..."
                    className="flex-1 px-3 py-1.5 rounded-full bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-[#eef1f6] dark:bg-[[#eef1f6]] dark:bg-[#075e54] hover:bg-[#eef1f6] hover:dark:bg-[[#eef1f6]] hover:dark:bg-[#064942] text-[#0f172a] dark:text-white dark:text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 3: Facturación AFIP View */}
          {previewTab === 'afip' && (
            <div className="p-6 bg-slate-50 flex justify-center">
              <div className="w-full max-w-xl bg-white border-2 border-slate-300 rounded-xl p-6 shadow-md space-y-4">
                <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                  <div>
                    <div className="text-xl font-black text-slate-900">FACTURA "A"</div>
                    <div className="text-xs text-slate-500 font-mono">N° 0001-00049281 • Original</div>
                    <div className="text-xs text-slate-600 font-semibold mt-1">CLIENTUM TECNOLOGÍAS S.A.S.</div>
                    <div className="text-[11px] text-slate-500">CUIT: 30-71829341-9 • IVA Responsable Inscripto</div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>CAE APROBADO</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600 mt-1">CAE: 74920194827103</div>
                    <div className="text-[11px] text-slate-500">Vto. CAE: 18/09/2026</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <div className="text-[#64748b] dark:text-white dark:text-slate-400 font-bold uppercase text-[10px]">Cliente / Receptor</div>
                    <div className="font-bold text-slate-900">FRIGORÍFICO DEL VALLE S.A.</div>
                    <div className="text-slate-500">CUIT: 30-68492011-4</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#64748b] dark:text-white dark:text-slate-400 font-bold uppercase text-[10px]">Condición de Venta</div>
                    <div className="font-bold text-slate-900">Transferencia / MercadoPago</div>
                    <div className="text-emerald-700 font-semibold">1 Pago Acreditado</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="grid grid-cols-4 bg-slate-100 p-2 font-bold text-slate-700 border-b border-slate-200">
                    <span className="col-span-2">Concepto</span>
                    <span className="text-center">Alícuota</span>
                    <span className="text-right">Subtotal</span>
                  </div>
                  <div className="grid grid-cols-4 p-2 text-slate-800 border-b border-slate-100">
                    <span className="col-span-2 font-medium">Suscripción Anual Clientum Suite CRM + WhatsApp Bot</span>
                    <span className="text-center">21.0%</span>
                    <span className="text-right font-mono">$1.528.925 ARS</span>
                  </div>
                  <div className="grid grid-cols-4 p-2 text-slate-800">
                    <span className="col-span-2 font-medium">Implementación & Capacitación In-Company (5 días)</span>
                    <span className="text-center">21.0%</span>
                    <span className="text-right font-mono">$321.075 ARS</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-slate-200 border border-slate-300 rounded flex items-center justify-center text-[9px] font-mono text-slate-500">
                      QR AFIP
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Homologado bajo RG AFIP 4291/18<br />Generado automáticamente por Clientum
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Importe Total:</div>
                    <div className="text-xl font-black text-slate-900 font-mono">$2.238.500 ARS</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. FOUR CORE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Diseñado para la Realidad del Empresario Latinoamericano
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Sin barreras en dólares, sin contratos leoninos y con atención en tu mismo huso horario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CLIENTUM_PILLARS.map((pillar, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                {i === 0 ? <Receipt className="w-5 h-5" /> : i === 1 ? <Clock className="w-5 h-5" /> : i === 2 ? <MessageSquare className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <h3 className="text-base font-bold text-slate-900">{pillar.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTEGRATED SOLUTIONS MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-3 h-3 text-blue-600" />
            <span>Suite Todo-en-Uno</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Todo lo que Necesitas para Escalar en un Solo Lugar
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Reemplaza hasta 7 suscripciones aisladas por una sola plataforma integrada y sin fricciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLIENTUM_SOLUTIONS.map((sol, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {sol.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">{sol.regularPrice}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {sol.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sol.shortDescription}
                </p>
                {sol.features && (
                  <ul className="space-y-1 pt-2">
                    {sol.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('/producto')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver detalles</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onOpenWizard}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cotizar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5.1 INTERACTIVE SOLUTION SELECTOR */}
      <SolutionSelectorWidget onNavigate={onNavigate} onOpenWizard={onOpenWizard} />

      {/* 6. PLATFORM MAP FROM THE CLIENTUMOS DOCUMENTATION */}
      <PublicPlatformMap
        onNavigate={onNavigate}
        onOpenWizard={onOpenWizard}
        onOpenSimulator={onOpenSimulator}
      />

      {/* 6.1 INTERACTIVE ROI & FINANCIAL SAVINGS CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-[#e2e8f0] dark:border-slate-800 shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Calculator className="w-3.5 h-3.5 text-blue-400" />
              <span>Calculadora de Impacto Comercial & ROI</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a] dark:text-white dark:text-white">
              Calculá el Retorno de Inversión Estimado para tu Empresa
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-white dark:text-slate-300">
              Simulá los resultados proyectados al automatizar conversaciones de WhatsApp, reducir el enfriamiento de ofertas y facturar con CAE automático.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Sliders Box */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs space-y-6">
              {/* Slider 1: Reps Count */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#475569] dark:text-white dark:text-slate-300">Vendedores en el Equipo:</span>
                  <span className="font-black text-blue-300 bg-blue-900/60 px-2.5 py-0.5 rounded border border-blue-700/60">
                    {roiRepCount} Asesores
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={roiRepCount}
                  onChange={(e) => setRoiRepCount(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Monthly Leads */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#475569] dark:text-white dark:text-slate-300">Consultas / Leads por Mes (WhatsApp & Web):</span>
                  <span className="font-black text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded border border-emerald-700/60">
                    {roiMonthlyLeads} Leads / mes
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1000"
                  step="10"
                  value={roiMonthlyLeads}
                  onChange={(e) => setRoiMonthlyLeads(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3: Ticket Promedio ARS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#475569] dark:text-white dark:text-slate-300">Valor Promedio de Venta / Venta Promedio (ARS):</span>
                  <span className="font-black text-amber-300 bg-amber-900/60 px-2.5 py-0.5 rounded border border-amber-700/60">
                    ${roiAvgDealARS.toLocaleString('es-AR')} ARS
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="3000000"
                  step="50000"
                  value={roiAvgDealARS}
                  onChange={(e) => setRoiAvgDealARS(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Impact Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 space-y-5 shadow-lg border border-blue-400/30">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Resultados Proyectados Estimados
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10">
                  <div className="text-[11px] text-blue-100 font-medium">Facturación Adicional Estimada / Mes:</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white dark:text-white font-mono mt-0.5">
                    +${estimatedExtraRevenue.toLocaleString('es-AR')} ARS
                  </div>
                  <div className="text-[10px] text-emerald-300 font-semibold mt-1">
                    ✨ +16% de tasa de conversión incremental estimada
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                    <div className="text-[10px] text-blue-100">Horas Ahorradas / Mes:</div>
                    <div className="text-xl font-black text-[#0f172a] dark:text-white dark:text-white font-mono">{estimatedHoursSaved}hs</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                    <div className="text-[10px] text-blue-100">Recuperación Inversión:</div>
                    <div className="text-xl font-black text-emerald-300 font-mono">&lt; 9 Días</div>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenWizard}
                className="w-full py-3 rounded-xl bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Descargar Informe de ROI Personalizado</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLIENTUM VS TRADITIONAL CRM COMPARISON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ¿Por Qué las PyMEs Eligen Clientum?
            </h2>
            <p className="text-sm text-slate-600">
              Comparativa transparente frente a las soluciones corporativas tradicionales.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="pb-3">Criterio de Evaluación</th>
                  <th className="pb-3 text-blue-600 font-extrabold text-sm sm:text-base">Clientum CRM</th>
                  <th className="pb-3 text-slate-500">HubSpot / Salesforce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 font-semibold text-slate-800">Moneda & Facturación</td>
                  <td className="py-3 text-emerald-700 font-bold">100% Pesos (ARS) fijos sin sorpresas</td>
                  <td className="py-3 text-slate-500">Dólares (USD) + Impuestos bancarios (60%+)</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-slate-800">Facturación AFIP con CAE</td>
                  <td className="py-3 text-emerald-700 font-bold">Nativa en 1 clic (A, B, C y MiPyME)</td>
                  <td className="py-3 text-slate-500">Requiere desarrollo externo o Zapier costoso</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-slate-800">WhatsApp Omnicanal con IA</td>
                  <td className="py-3 text-emerald-700 font-bold">Incluido sin costo extra por mensaje</td>
                  <td className="py-3 text-slate-500">Add-ons adicionales desde $300 USD/mes</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-slate-800">Tiempo de Implementación</td>
                  <td className="py-3 text-emerald-700 font-bold">&lt; 5 días hábiles promedio</td>
                  <td className="py-3 text-slate-500">3 a 6 meses de consultoría externa</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-slate-800">Soporte Técnico</td>
                  <td className="py-3 text-emerald-700 font-bold">Humano directo por WhatsApp (&lt; 4 horas)</td>
                  <td className="py-3 text-slate-500">Tickets en inglés con respuesta en 48hs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. REAL TEAMS IN ACTION ACROSS ARGENTINA */}
      <RealTeamsSection onNavigate={onNavigate} onOpenWizard={onOpenWizard} />

      {/* 8.1 REAL CLIENT CASE STUDIES & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resultados Comprobados en Empresas Reales
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Historias de éxito de clientes que multiplicaron su conversión con Clientum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "Centralizamos a nuestros 18 vendedores de calle en WhatsApp y el pipeline de Clientum. Duplicamos la velocidad de respuesta y emitimos más de 1.400 facturas electrónicas mensuales sin errores."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                MR
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Ing. Marcelo Rossi</div>
                <div className="text-[10px] text-slate-500">Director Comercial • Distribuidora Patagónica</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "El módulo de prospección con Google Maps y el Agente de IA para responder consultas de stock en WhatsApp nos permitió abrir 45 cuentas mayoristas nuevas en apenas 60 días."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                CL
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Carla Lucero</div>
                <div className="text-[10px] text-slate-500">Gerente de Ventas • Bodega Valle Austral</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "Migrar desde Salesforce nos ahorró más de $12.000 USD al año y el equipo adoptó la plataforma en menos de 3 días porque la interfaz es directa y habla el idioma de nuestro negocio."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                FD
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Dr. Fernando Domínguez</div>
                <div className="text-[10px] text-slate-500">Socio Administrador • Sanatorio del Sur</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-sm text-slate-600">
            Todo lo que necesitas saber antes de comenzar.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div
                key={i}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL HIGH-CONVERSION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center space-y-6 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#0f172a] dark:text-white dark:text-white text-xs font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Puesta en Marcha en 5 Días</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Comienza a Automatizar tus Ventas Hoy Mismo
          </h2>

          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Únete a más de 1.750 empresas que aumentaron un 34% su facturación durante su primer trimestre con Clientum.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => enterApp()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-900 font-bold text-sm shadow-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Ingresar al CRM Ahora
            </button>

            <button
              onClick={onOpenWizard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white border border-white/20 font-bold text-sm transition-colors cursor-pointer"
            >
              Cotizar Plan Personalizado
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
