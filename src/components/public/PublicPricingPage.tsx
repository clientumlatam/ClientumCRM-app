import React, { useState } from 'react';
import {
  Check,
  Receipt,
  HelpCircle,
  Sparkles,
  Clock,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Zap,
  Download,
  FileSpreadsheet,
  Sliders,
  ChevronDown,
  Building2,
  X,
  MessageSquare,
  Bot
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';
import { ClientumPlanId } from '../../types';
import { downloadWooCommerceCsv } from '../../data/woocommerceCatalog';

interface PublicPricingPageProps {
  currency: 'ARS' | 'USD';
  onToggleCurrency: () => void;
  onNavigate: (path: PublicRoutePath) => void;
  onOpenWizard: () => void;
}

export const PublicPricingPage: React.FC<PublicPricingPageProps> = ({
  currency,
  onToggleCurrency,
  onNavigate,
  onOpenWizard,
}) => {
  const {
    enterApp,
    trialSubscription,
    startFreeTrial,
    openMercadoPagoCheckout,
    showToast,
  } = useCRM();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const isAnnual = billingCycle === 'annual';

  // Interactive Calculator State
  const [projectCount, setProjectCount] = useState<number>(30);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Main 3 Plans
  const plans = [
    {
      id: 'starter' as ClientumPlanId,
      name: 'Plan Inicial Starter',
      subtitle: 'Para emprendedores y profesionales que quieren ordenar su gestión básica.',
      priceMonthlyUSD: 25,
      priceAnnualUSD: 20,
      savingsAnnualUSD: 60,
      setupFeeUSD: 50,
      badge: null,
      popular: false,
      includes: [
        'CRM básico hasta 500 contactos y clientes',
        'Emisión de presupuestos y cotizaciones',
        '1 Usuario comercial incluido',
        'Soporte por email en 24h',
        'Exportación de datos a Excel/CSV',
      ],
      excludes: [
        'Chatbot WhatsApp con IA generativa',
        'Facturación electrónica automática AFIP',
        'Prospección masiva en Google Maps',
      ],
      cta: 'Elegir Plan Inicial',
    },
    {
      id: 'professional' as ClientumPlanId,
      name: 'Plan Profesional + WhatsApp IA',
      subtitle: 'El más elegido: Chatbot WhatsApp con IA y CRM de ventas sincronizado 24/7.',
      priceMonthlyUSD: 99,
      priceAnnualUSD: 79,
      savingsAnnualUSD: 240,
      setupFeeUSD: 120,
      badge: 'MÁS POPULAR · MEJOR VALOR',
      popular: true,
      includes: [
        'Chatbot WhatsApp IA con Meta Cloud API oficial',
        'CRM Kanban ilimitado con pipeline comercial',
        'Facturación Electrónica AFIP oficial (Facturas A, B, C)',
        'Hasta 5 usuarios de equipo con roles definidos',
        'Derivación inteligente a asesores con alertas',
        'Soporte prioritário vía WhatsApp y asistencia remota',
      ],
      excludes: [],
      cta: 'Elegir Plan Profesional IA',
    },
    {
      id: 'enterprise' as ClientumPlanId,
      name: 'Suite Integral Growth',
      subtitle: 'Para empresas que quieren liderar su sector con prospección activa y desarrollo a medida.',
      priceMonthlyUSD: 199,
      priceAnnualUSD: 159,
      savingsAnnualUSD: 480,
      setupFeeUSD: 200,
      badge: 'FULL SUITE INTEGRAL',
      popular: false,
      includes: [
        'Todo lo del Plan Pro incluido',
        'Módulo de Prospección Maps IA para extraer clientes B2B',
        'Web corporativa ultra rápida o portal de clientes',
        'Usuarios de equipo ilimitados',
        'Auditorías SEO On-Page y generación de contenido',
        'Account Manager dedicado y reuniones de optimización quincenales',
      ],
      excludes: [],
      cta: 'Elegir Suite Enterprise',
    },
  ];

  // 5-Tier Scale Comparison Matrix
  const matrixPlans = [
    {
      id: 'inicial',
      name: 'Plan Inicial',
      desc: 'Para emprendedores e iniciativas pequeñas.',
      priceUSD: 20,
      features: [
        { label: 'Web', val: 'Landing page responsiva' },
        { label: 'CRM/ERP', val: 'Embudo básico (200 cont.)' },
        { label: 'Seguridad', val: 'Respaldos mensuales' },
        { label: 'IA & BI', val: 'Bot de bienvenida fijo' },
      ],
    },
    {
      id: 'pyme',
      name: 'Plan PyME',
      desc: 'Para comercios con ventas activas: tienda online, stock, AFIP y bot WhatsApp.',
      priceUSD: 45,
      recommended: projectCount <= 40,
      features: [
        { label: 'Web', val: 'Tienda online estándar' },
        { label: 'CRM/ERP', val: 'Stock + AFIP (1.000 cont.)' },
        { label: 'Seguridad', val: 'Cifrado de base de datos' },
        { label: 'IA & BI', val: 'Bot WhatsApp con FAQs' },
      ],
    },
    {
      id: 'pro',
      name: 'Plan Pro',
      badge: 'Más Elegido ⭐',
      desc: 'Para automatizar con IA, bots y facturación.',
      priceUSD: 80,
      recommended: projectCount > 40 && projectCount <= 70,
      features: [
        { label: 'Web', val: 'E-Commerce premium total' },
        { label: 'CRM/ERP', val: 'Multi-embudo ilimitado' },
        { label: 'Seguridad', val: 'Auditorías de software' },
        { label: 'IA & BI', val: 'Agente IA & BI avanzado' },
      ],
    },
    {
      id: 'corp',
      name: 'Plan Corporativo',
      desc: 'Para empresas con múltiples canales activos.',
      priceUSD: 150,
      recommended: projectCount > 70 && projectCount <= 90,
      features: [
        { label: 'Web', val: 'Portal B2B + Web integral' },
        { label: 'CRM/ERP', val: 'Pipeline multi-sucursal' },
        { label: 'Seguridad', val: 'Hardening y firewall' },
        { label: 'IA & BI', val: 'Analítica predictiva & bots' },
      ],
    },
    {
      id: 'custom',
      name: 'Plan Especializado',
      desc: 'Infraestructura y desarrollos a medida.',
      priceUSD: 250,
      recommended: projectCount > 90,
      features: [
        { label: 'Web', val: 'Apps web & mobile infinitas' },
        { label: 'CRM/ERP', val: 'Integraciones ERP legacy' },
        { label: 'Seguridad', val: 'SOC activo 24/7 dedicado' },
        { label: 'IA & BI', val: 'Modelos LLM corporativos' },
      ],
    },
  ];

  // Dynamic recommendation based on slider
  const recommendedPlan =
    projectCount <= 25
      ? matrixPlans[0]
      : projectCount <= 50
      ? matrixPlans[1]
      : projectCount <= 75
      ? matrixPlans[2]
      : projectCount <= 90
      ? matrixPlans[3]
      : matrixPlans[4];

  const faqs = [
    {
      q: '¿Cuál es el propósito del período de prueba?',
      a: 'El período de prueba de 7 días te permite acceder a todas las funcionalidades del CRM, el Chatbot IA con respuestas personalizadas y el módulo de presupuestos y facturación AFIP sin ingresar tarjeta de crédito. Así puedes validar en vivo el incremento de velocidad y ventas de tu equipo.',
    },
    {
      q: '¿Ofrecen opciones de pago mensual o anual?',
      a: 'Sí. Puedes abonar mes a mes o contratar el ciclo anual con un 20% de descuento directo (equivalente a 2 meses 100% bonificados). Emitimos Factura A o B oficial ante AFIP para desgravar IVA.',
    },
    {
      q: '¿Puedo cancelar o cambiar de plan en cualquier momento?',
      a: 'Por supuesto. No exigimos contratos forzosos ni penalizaciones por baja. Puedes escalar de plan a medida que sumas asesores o pausar tu suscripción directamente desde el panel de facturación.',
    },
    {
      q: '¿Se calcula el Impuesto al Valor Agregado (IVA) en los precios?',
      a: 'Los precios publicados son netos. Al momento de generar tu factura fiscal según tu condición tributaria ante AFIP (Responsable Inscripto, Monotributo o Exento) se discriminará la alícuota correspondiente con CAE electrónico.',
    },
  ];

  const handleSelectPlan = (planId: ClientumPlanId) => {
    startFreeTrial(planId);
    showToast(`¡Plan seleccionado! Iniciando configuración para ${planId}`, 'success');
    enterApp(true);
  };

  const handleDownloadBrochure = () => {
    showToast('Generando Brochure Oficial de Clientum (PDF 8 Páginas)...', 'info');
    setTimeout(() => {
      showToast('Descarga de Brochure iniciada con éxito', 'success');
    }, 1000);
  };

  const handleExportWooCommerce = () => {
    downloadWooCommerceCsv();
    showToast('Catálogo completo exportado a formato WooCommerce CSV', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans bg-white text-slate-900">
      
      {/* 1. Header Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Nuestra Oferta Comercial · Planes Transparentes para Todos</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Precios Claros y Sin Costos Ocultos
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Ofrecemos soluciones adaptadas a las necesidades de cada cliente. Nuestros planes están diseñados para brindar servicios de alta calidad, asegurando que cada empresa encuentre el soporte adecuado para su crecimiento.
        </p>

        {/* Action Buttons: Brochure & WooCommerce CSV Export */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleDownloadBrochure}
            className="px-5 py-2.5 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 hover:bg-[#eef1f6] hover:dark:bg-[#eef1f6] hover:dark:bg-slate-800 text-[#0f172a] dark:text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Descargar Brochure & Planes PDF</span>
          </button>

          <button
            type="button"
            onClick={handleExportWooCommerce}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Exportar todo a WooCommerce · CSV</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 pt-1">
          Comienza hoy mismo con una solución llave en mano garantizada. Facturación oficial AFIP en Pesos Argentinos (ARS) o Dólares (USD).
        </p>
      </section>

      {/* 2. Billing Cycle Switch */}
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !isAnnual
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Facturación Mensual
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isAnnual
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Facturación Anual</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black">
              20% OFF
            </span>
          </button>
        </div>

        {isAnnual && (
          <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ✨ Ahorra 2 meses completos contratando el plan anual
          </div>
        )}
      </div>

      {/* 3. Three Main Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((p) => {
          const price = isAnnual ? p.priceAnnualUSD : p.priceMonthlyUSD;
          return (
            <div
              key={p.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                p.popular
                  ? 'bg-slate-900 text-[#0f172a] dark:text-white shadow-2xl ring-2 ring-blue-500 scale-[1.02]'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 shadow-sm hover:shadow-md'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md">
                  {p.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black">{p.name}</h3>
                  <p className={`text-xs mt-2 leading-relaxed ${p.popular ? 'text-[#475569] dark:text-slate-300' : 'text-slate-600'}`}>
                    {p.subtitle}
                  </p>
                </div>

                <div className="border-t border-b py-4 space-y-1.5 border-slate-200/40">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black tracking-tight">${price}</span>
                    <span className={`text-xs font-semibold ${p.popular ? 'text-[#475569] dark:text-slate-300' : 'text-slate-500'}`}>
                      USD / mes
                    </span>
                  </div>

                  {isAnnual && (
                    <div className="text-[11px] text-emerald-400 font-bold">
                      Ahorras ${p.savingsAnnualUSD} USD al año
                    </div>
                  )}

                  <div className={`text-[11px] pt-1 ${p.popular ? 'text-[#64748b] dark:text-slate-400' : 'text-slate-500'}`}>
                    Setup e Implementación: <strong className={p.popular ? 'text-[#0f172a] dark:text-white' : 'text-slate-800'}>${p.setupFeeUSD} USD (único)</strong>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className={`font-bold uppercase text-[10px] tracking-wider ${p.popular ? 'text-blue-300' : 'text-blue-700'}`}>
                    Qué incluye este plan:
                  </div>
                  <ul className="space-y-2.5">
                    {p.includes.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${p.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {p.excludes.length > 0 && (
                    <ul className="space-y-2.5 pt-2 border-t border-slate-200/30">
                      {p.excludes.map((ex, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[#0f172a] dark:text-white dark:text-slate-400">
                          <X className="w-4 h-4 shrink-0 mt-0.5 text-[#0f172a] dark:text-white dark:text-slate-400" />
                          <span className="leading-snug line-through">{ex}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="pt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(p.id)}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${
                    p.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-[#0f172a] dark:text-white'
                  }`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className={`text-[10px] text-center ${p.popular ? 'text-[#64748b] dark:text-slate-400' : 'text-slate-500'} flex items-center justify-center gap-1`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Garantía de satisfacción o reembolso en 15 días</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. ERP Integrations Custom Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-300 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Integraciones Corporativas</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            ¿Tu empresa requiere integraciones personalizadas con ERPs existentes?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Desarrollamos conectores a medida con SAP, Tango, Bejerman, MercadoLibre y APIs propietarias.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/contacto')}
          className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shrink-0 shadow-lg cursor-pointer transition-colors"
        >
          Solicitar Reunión con un Arquitecto de Soluciones
        </button>
      </section>

      {/* 5. Calculador Comparativo Inteligente de Planes */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase text-blue-600 font-bold flex items-center gap-1.5">
            <Sliders className="w-4 h-4" />
            <span>Simulador de Escala</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Calculador Comparativo Inteligente de Planes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
            Mueve las barras para simular la escala de tu negocio en número de proyectos y contactos. Te recomendaremos el plan exacto.
          </p>
        </div>

        {/* Interactive Slider */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-800">Cantidad de Proyectos / Contactos:</span>
            <span className="text-lg font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
              Hasta {projectCount}
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={projectCount}
            onChange={(e) => setProjectCount(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />

          <div className="flex justify-between text-[11px] text-[#0f172a] dark:text-white dark:text-slate-400 font-mono">
            <span>10 (Inicial)</span>
            <span>40 (PyME)</span>
            <span>70 (Pro)</span>
            <span>90 (Corporativo)</span>
            <span>120+ (Custom)</span>
          </div>
        </div>

        {/* Features included in all plans banner */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold uppercase text-blue-900">
            Todos los planes de Clientum incluyen:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Aplicación de escritorio y móvil</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Estimaciones de tiempos operacionales</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Facturación integrada y link de cobros</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Reportes automatizados de métricas</span>
            </div>
          </div>
        </div>

        {/* Plan Recomendado Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-2 border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Plan Recomendado para Ti
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">{recommendedPlan.name}</h3>
            <p className="text-xs text-slate-600 max-w-xl">{recommendedPlan.desc}</p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">${recommendedPlan.priceUSD}</div>
              <div className="text-[10px] text-slate-500">/ mes</div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/contacto')}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition-colors"
            >
              Contratar Plan Recomendado
            </button>
          </div>
        </div>

        {/* 5 Plans Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {matrixPlans.map((mp) => (
            <div
              key={mp.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition-all ${
                mp.recommended
                  ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-500/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {mp.badge && (
                  <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block">
                    {mp.badge}
                  </span>
                )}
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{mp.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{mp.desc}</p>
                </div>

                <div className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
                  ${mp.priceUSD} <span className="text-[10px] font-normal text-slate-500">/ mes</span>
                </div>

                <ul className="space-y-2 text-[11px]">
                  {mp.features.map((f, i) => (
                    <li key={i} className="space-y-0.5">
                      <span className="font-bold text-slate-700">{f.label}:</span>{' '}
                      <span className="text-slate-600">{f.val}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/contacto')}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  mp.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Seleccionar {mp.name.replace('Plan ', '')}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase text-blue-600 font-bold">Dudas Habituales</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Preguntas Frecuentes sobre Planes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900">
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
