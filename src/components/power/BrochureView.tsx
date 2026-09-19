import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Zap,
  Globe,
  Phone,
  Mail,
  MapPin,
  Bot,
  Users,
  Brain,
  Workflow,
  Calculator,
  ArrowRight,
  Star,
  Receipt,
  GraduationCap,
  Layers,
  Search,
  Check,
  Building2,
  DollarSign
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import {
  CLIENTUM_BROCHURE_METRICS,
  CLIENTUM_PILLARS,
  CLIENTUM_SERVICES,
  CLIENTUM_PLANS,
  CLIENTUM_COURSES,
  CLIENTUM_SOLUTIONS,
  CLIENTUM_CASE_STUDY,
  CatalogItem
} from '../../data/clientumCatalog';

export const BrochureView: React.FC = () => {
  const { showToast, addOpportunity, triggerConfetti } = useCRM();

  // Active view tab in brochure
  const [activeSubTab, setActiveSubTab] = useState<'brochure' | 'calculator' | 'catalog' | 'courses'>('brochure');

  // Calculator states
  const [billingCycle, setAnnual] = useState<'monthly' | 'annual'>('monthly');
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS');
  const [selectedServices, setSelectedServices] = useState<string[]>(['srv-1', 'srv-2', 'srv-3']); // Default 3 services selected

  // Catalog search/filter
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // Calculations
  const usdToArsRate = 1200; // Reference conversion rate for display
  const isAnnual = billingCycle === 'annual';
  const discountMultiplier = isAnnual ? 0.84 : 1.0; // 16% off for annual

  const activeServicesList = CLIENTUM_SERVICES.filter(s => selectedServices.includes(s.id));
  
  const rawSetupTotalARS = activeServicesList.reduce((acc, s) => acc + s.regularPrice, 0);
  const rawMonthlyTotalARS = activeServicesList.reduce((acc, s) => acc + Math.round(s.regularPrice * 0.3), 0);

  const finalSetupARS = Math.round(rawSetupTotalARS * discountMultiplier);
  const finalMonthlyARS = Math.round(rawMonthlyTotalARS * discountMultiplier);

  const displaySetup = currency === 'ARS' 
    ? `$${finalSetupARS.toLocaleString('es-AR')} ARS` 
    : `$${Math.round(finalSetupARS / usdToArsRate).toLocaleString()} USD`;

  const displayMonthly = currency === 'ARS'
    ? `$${finalMonthlyARS.toLocaleString('es-AR')} ARS/mes`
    : `$${Math.round(finalMonthlyARS / usdToArsRate).toLocaleString()} USD/mes`;

  const handleCreatePropFromCalc = () => {
    addOpportunity({
      name: `Propuesta ClientumCRM (${selectedServices.length} Módulos)`,
      amount: currency === 'ARS' ? finalSetupARS : Math.round(finalSetupARS / usdToArsRate),
      currency: currency === 'ARS' ? 'ARS' : 'USD',
      companyName: 'Cliente Potencial PyME',
      contactName: 'Interesado Comercial',
      stage: 'proposal',
      probability: 65,
      closeDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assignedTo: 'Alex Morgan',
      priority: 'High',
      type: 'New Business',
      tags: ['Propuesta', 'Cotización'],
      notes: `Servicios seleccionados: ${activeServicesList.map(s => s.name).join(', ')}. Abono: ${displayMonthly}`
    });
    triggerConfetti();
    showToast('¡Oportunidad creada en el Pipeline CRM con la cotización elegida!', 'success');
  };

  const allCatalogItems: CatalogItem[] = [
    ...CLIENTUM_SERVICES,
    ...CLIENTUM_PLANS,
    ...CLIENTUM_COURSES,
    ...CLIENTUM_SOLUTIONS
  ];

  const filteredCatalog = allCatalogItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] overflow-y-auto select-none">
      {/* Top Header Bar */}
      <div className="p-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2638] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f14] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-lg text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
              Brochure Corporativo & Catálogo 2026
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                Oficial ClientumCRM
              </span>
            </h2>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Agencia de Crecimiento Comercial, IA & Automatización para PyMEs en Argentina y LATAM</p>
          </div>
        </div>

        {/* SubTab Navigation Switcher */}
        <div className="flex items-center bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-1 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232b3e] text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('brochure')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${ activeSubTab === 'brochure' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Brochure 2026
          </button>
          <button
            onClick={() => setActiveSubTab('calculator')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${ activeSubTab === 'calculator' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Calculadora de Planes
          </button>
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${ activeSubTab === 'catalog' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Catálogo Completo
          </button>
          <button
            onClick={() => setActiveSubTab('courses')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${ activeSubTab === 'courses' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Campus Virtual
          </button>
        </div>
      </div>

      {/* SUBTAB 1: BROCHURE CORPORATIVO VISUAL (PÁGINAS PDF) */}
      {activeSubTab === 'brochure' && (
        <div className="p-6 space-y-8 max-w-6xl mx-auto w-full">
          {/* Hero Banner Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-[#0b1220] p-8 md:p-12 border border-blue-800/60 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/50 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                BROCHURE CORPORATIVO 2026
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-[var(--text-primary,#0f172a)] dark:text-white leading-tight">
                Agencia de Crecimiento Comercial,<br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Inteligencia Artificial & Automatización
                </span> para PyMEs
              </h1>

              <p className="text-sm md:text-base text-blue-200/90 max-w-3xl leading-relaxed">
                Consultoría estratégica, implementación de CRM, Agentes WhatsApp IA, Campañas de Marketing Digital,
                Desarrollo Web & E-Commerce, Integraciones AFIP y Analítica para escalar tu negocio.
              </p>

              {/* Key Metrics Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-blue-900/40 border border-blue-700/50 backdrop-blur-md">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-300">{CLIENTUM_BROCHURE_METRICS.activePymes}</div>
                  <div className="text-[11px] text-blue-200 font-medium uppercase tracking-wider mt-1">PyMEs Activas</div>
                </div>
                <div className="text-center border-l border-blue-800/60">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-300">{CLIENTUM_BROCHURE_METRICS.yearsExp}</div>
                  <div className="text-[11px] text-blue-200 font-medium uppercase tracking-wider mt-1">Años de Exp.</div>
                </div>
                <div className="text-center border-l border-blue-800/60">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-300">{CLIENTUM_BROCHURE_METRICS.satisfaction}</div>
                  <div className="text-[11px] text-blue-200 font-medium uppercase tracking-wider mt-1">Satisfacción</div>
                </div>
                <div className="text-center border-l border-blue-800/60">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-400">{CLIENTUM_BROCHURE_METRICS.slaReal}</div>
                  <div className="text-[11px] text-blue-200 font-medium uppercase tracking-wider mt-1">SLA Real</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Who We Are & Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] p-6 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d] space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                QUIÉNES SOMOS
              </span>
              <h3 className="text-xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Nacimos en la Patagonia para digitalizar la Argentina.</h3>
              <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed">
                Hace más de 12 años acompañamos PyMEs de todo el país en su transformación digital.
                Conocemos la realidad argentina: limitaciones de tiempo, presupuesto y equipo de IT.
              </p>
              <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed">
                Por eso construimos una plataforma que no requiere conocimientos técnicos, funciona en pesos
                y tiene soporte humano en español rioplatense.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Desde General Roca, Río Negro, llegamos a empresas de todos los rubros.</span>
              </div>
            </div>

            {/* Mission & 4 Pillars */}
            <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] p-6 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d] space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Nuestra Misión</h3>
              <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
                Nivelar la cancha para las empresas argentinas. Que una PyME de Neuquén tenga las mismas herramientas que una multinacional sin el costo ni la complejidad.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CLIENTUM_PILLARS.map((p, idx) => (
                  <div key={idx} className="p-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#181f30] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#28354f] space-y-1">
                    <div className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {p.title}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-normal">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: 6 Integrated Modules */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                LA PLATAFORMA INTEGRADA
              </span>
              <h3 className="text-2xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white mt-1">Todo lo que tu PyME necesita, en un solo lugar.</h3>
              <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Seis módulos integrados que trabajan juntos. Cada cliente, venta, conversación y factura conectados en tiempo real.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CLIENTUM_SOLUTIONS.slice(0, 6).map((sol) => (
                <div key={sol.id} className="p-5 bg-[var(--bg-card,#ffffff)] dark:bg-[#121724] rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222c42] hover:border-cyan-500/40 transition-all space-y-3 group">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                      {sol.id === 'sol-1' && <Bot className="w-5 h-5" />}
                      {sol.id === 'sol-2' && <Users className="w-5 h-5" />}
                      {sol.id === 'sol-3' && <Brain className="w-5 h-5" />}
                      {sol.id === 'sol-4' && <FileText className="w-5 h-5" />}
                      {sol.id === 'sol-5' && <Workflow className="w-5 h-5" />}
                      {sol.id === 'sol-6' && <Globe className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2336] text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3752]">
                      Incluido
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary,#0f172a)] dark:text-white">{sol.name}</h4>
                    <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 leading-relaxed">{sol.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Flow & AFIP Invoicing Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step-by-Step Flow */}
            <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] p-6 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d] space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MÓDULO WHATSAPP & CRM
              </span>
              <h3 className="text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Flujo Automatizado de Ventas 24/7</h3>
              <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Atención sin pausas para captar e incrementar conversaciones útiles.</p>

              <div className="space-y-3 pt-2">
                {[
                  { step: '1', title: 'Entrada de Prospecto', desc: 'El cliente envía mensaje por WhatsApp o llena el formulario web.' },
                  { step: '2', title: 'Atención IA Gemini 3.6', desc: 'El agente IA saluda, califica intención de compra y responde FAQs.' },
                  { step: '3', title: 'Sincronización en CRM', desc: 'Registra el lead en el pipeline Kanban y notifica al vendedor asignado.' },
                  { step: '4', title: 'Seguimiento Automático', desc: 'Emite recordatorios de reunión, propuestas y cotizaciones AFIP.' }
                ].map((st) => (
                  <div key={st.step} className="flex items-start gap-3 p-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#171e2e] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#263148]">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {st.step}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[var(--text-primary,#0f172a)] dark:text-white">{st.title}</div>
                      <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{st.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AFIP & Security Homologation */}
            <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] p-6 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  SEGURIDAD & AFIP
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Facturación Electrónica Homologada</h3>
                <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed">
                  ClientumCRM está homologado oficialmente ante AFIP como emisor de factura electrónica nacional.
                  Los datos se encriptan bajo claves bancarias y se almacenan en servidores nacionales de alta disponibilidad.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#182030] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#29364f] text-center">
                    <Receipt className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                    <div className="font-bold text-xs text-[var(--text-primary,#0f172a)] dark:text-white">CAE Automático</div>
                    <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Tipos A, B y C en tiempo real</div>
                  </div>
                  <div className="p-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#182030] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#29364f] text-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                    <div className="font-bold text-xs text-[var(--text-primary,#0f172a)] dark:text-white">CBU Directo</div>
                    <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Conciliación con MercadoPago & Banco</div>
                  </div>
                </div>
              </div>

              {/* Testimonial Box */}
              <div className="p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/40 text-xs italic text-blue-200">
                "{CLIENTUM_CASE_STUDY.quote}"
                <div className="mt-2 font-bold not-italic text-[var(--text-primary,#0f172a)] dark:text-white text-[11px]">
                  — {CLIENTUM_CASE_STUDY.author}, {CLIENTUM_CASE_STUDY.company}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Testimonials & Guaranteed Impact */}
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] p-8 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  GARANTÍAS Y RESULTADOS
                </span>
                <h3 className="text-xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white mt-1">La diferencia que sentís desde el primer día.</h3>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white ml-1">4.8 / 5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CLIENTUM_CASE_STUDY.metrics.map((m, idx) => (
                <div key={idx} className="p-4 bg-[var(--bg-card,#ffffff)] dark:bg-[#171e2e] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#263148] text-center">
                  <div className="text-3xl font-black text-cyan-300">{m.value}</div>
                  <div className="text-[11px] font-medium text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-[var(--bg-card,#ffffff)] dark:bg-[#172030] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#283652] text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed italic">
              "{CLIENTUM_CASE_STUDY.quote2}"
              <div className="mt-2 font-bold not-italic text-emerald-400 text-xs">
                {CLIENTUM_CASE_STUDY.author2} — <span className="text-[var(--text-secondary,#475569)] dark:text-slate-300 font-normal">{CLIENTUM_CASE_STUDY.company2}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CALCULADORA INTERACTIVA DE PLANES Y SERVICIOS */}
      {activeSubTab === 'calculator' && (
        <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] p-6 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d]">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-400" />
                Calculadora de Cotizaciones & Módulos
              </h3>
              <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Ajusta la moneda y el ciclo de facturación para calcular la inversión exacta de tu PyME.</p>
            </div>

            {/* Currency & Annual Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[var(--bg-card,#ffffff)] dark:bg-[#171e2e] p-1 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#263148] text-xs font-semibold">
                <button
                  onClick={() => setCurrency('ARS')}
                  className={`px-3 py-1 rounded-lg transition-all ${currency === 'ARS' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400'}`}
                >
                  ARS ($)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg transition-all ${currency === 'USD' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400'}`}
                >
                  USD ($)
                </button>
              </div>

              <div className="flex items-center bg-[var(--bg-card,#ffffff)] dark:bg-[#171e2e] p-1 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#263148] text-xs font-semibold">
                <button
                  onClick={() => setAnnual('monthly')}
                  className={`px-3 py-1 rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400'}`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setAnnual('annual')}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${billingCycle === 'annual' ? 'bg-emerald-600 text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400'}`}
                >
                  Anual <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1 rounded">16% OFF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Service Checkboxes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLIENTUM_SERVICES.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              const setupVal = currency === 'ARS' 
                ? `$${Math.round(service.regularPrice * discountMultiplier).toLocaleString('es-AR')} ARS` 
                : `$${Math.round((service.regularPrice * discountMultiplier) / usdToArsRate).toLocaleString()} USD`;
              
              const monthlyVal = currency === 'ARS'
                ? `$${Math.round(service.regularPrice * 0.3 * discountMultiplier).toLocaleString('es-AR')}/mes`
                : `$${Math.round((service.regularPrice * 0.3 * discountMultiplier) / usdToArsRate).toLocaleString()}/mes`;

              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer select-none space-y-3 ${ isSelected ? 'bg-blue-950/40 border-cyan-500/60 ring-1 ring-cyan-500/30 shadow-lg' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d] border-[var(--border-subtle,#e2e8f0)] dark:hover:border-slate-600' }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${ isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-[var(--border-subtle,#e2e8f0)] dark:border-slate-600' }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-[10px] text-cyan-400 font-bold tracking-wide uppercase">{service.sku}</span>
                        <h4 className="font-bold text-sm text-[var(--text-primary,#0f172a)] dark:text-white">{service.name}</h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed">{service.shortDescription}</p>

                  <div className="pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e273a] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[10px]">SETUP ÚNICO:</span>{' '}
                      <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{setupVal}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[10px]">ABONO:</span>{' '}
                      <span className="font-bold text-emerald-400">{monthlyVal}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calculator Summary Widget */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-6 rounded-2xl border border-blue-700/60 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-800/60 pb-4">
              <div>
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                  RESUMEN ESTIMADO ({selectedServices.length} MÓDULOS ACTIVOS)
                </span>
                <h4 className="text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white mt-0.5">Inversión & Retorno Proyectado</h4>
              </div>

              <button
                onClick={handleCreatePropFromCalc}
                disabled={selectedServices.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Generar Propuesta CRM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#101726] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202b42]">
                <div className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">INVERSIÓN ÚNICA SETUP:</div>
                <div className="text-2xl font-black text-[var(--text-primary,#0f172a)] dark:text-white mt-1">{displaySetup}</div>
                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Llave en mano operativo</div>
              </div>

              <div className="p-4 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#101726] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202b42]">
                <div className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">ABONO MENSUAL:</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{displayMonthly}</div>
                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Soporte + Servidores + Updates</div>
              </div>

              <div className="p-4 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#101726] rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202b42]">
                <div className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">RETORNO ESTIMADO (ROI):</div>
                <div className="text-2xl font-black text-cyan-300 mt-1">≈ 3 a 5 meses</div>
                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Ahorro comprobado de horas hombre</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CATÁLOGO COMPLETO (CSV DATA) */}
      {activeSubTab === 'catalog' && (
        <div className="p-6 space-y-6 max-w-6xl mx-auto w-full">
          {/* Filter & Search Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] p-4 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d]">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Buscar por SKU, nombre o categoría..."
                className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#263148] rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'service', label: 'Servicios' },
                { id: 'plan', label: 'Planes' },
                { id: 'solution', label: 'Soluciones' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${ selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => (
              <div key={item.id} className="p-5 bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d] hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.sku}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{item.category}</span>
                  </div>

                  <h4 className="font-bold text-sm text-[var(--text-primary,#0f172a)] dark:text-white">{item.name}</h4>
                  <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed">{item.shortDescription}</p>

                  {item.specs && (
                    <div className="pt-2 space-y-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 bg-[var(--bg-card,#ffffff)] dark:bg-[#171e2e] p-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#253046]">
                      {item.specs.web && <div><strong className="text-[var(--text-secondary,#475569)] dark:text-slate-300">Web:</strong> {item.specs.web}</div>}
                      {item.specs.crmErp && <div><strong className="text-[var(--text-secondary,#475569)] dark:text-slate-300">CRM:</strong> {item.specs.crmErp}</div>}
                      {item.specs.aiBi && <div><strong className="text-[var(--text-secondary,#475569)] dark:text-slate-300">IA:</strong> {item.specs.aiBi}</div>}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e273a] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">PRECIO:</span>
                    <span className="font-black text-sm text-emerald-400">
                      {item.regularPrice > 0 
                        ? `$${item.regularPrice.toLocaleString()} ${item.currency}`
                        : 'Incluido / Bonificado'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addOpportunity({
                        name: `Interés: ${item.name}`,
                        amount: item.regularPrice || 500,
                        currency: 'ARS',
                        companyName: 'Cliente Prospecto',
                        stage: 'lead',
                        probability: 25,
                        closeDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                        assignedTo: 'Alex Morgan',
                        priority: 'Medium',
                        type: 'New Business',
                        tags: ['Catálogo'],
                        notes: `Interesado en catálogo item: ${item.sku} - ${item.name}`
                      });
                      showToast(`Agregado "${item.name}" como Lead en el Pipeline`, 'success');
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Cotizar Lead
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: CAMPUS VIRTUAL & CURSOS */}
      {activeSubTab === 'courses' && (
        <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] p-6 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d] space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              CAMPUS VIRTUAL CLIENTUM ACADEMY
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Capacitación Gratuita para tu Equipo Comercial</h3>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Cursos prácticos para dueños de PyMEs, gerentes y vendedores que buscan maximizar ventas y automatizar con IA.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLIENTUM_COURSES.map((course) => (
              <div key={course.id} className="p-6 bg-[var(--bg-card,#ffffff)] dark:bg-[#111622] rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202a3d] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{course.sku}</span>
                  <h4 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">{course.name}</h4>
                  <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed">{course.description}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e273a] flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Acceso 100% Gratuito</span>
                  <button
                    onClick={() => showToast(`Accediendo al campus virtual para "${course.name}"`, 'info')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Iniciar Curso
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
