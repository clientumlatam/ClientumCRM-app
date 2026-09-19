import React, { useState } from 'react';
import {
  Tractor,
  FileSpreadsheet,
  Truck,
  HeartPulse,
  Home,
  UtensilsCrossed,
  ShoppingCart,
  Briefcase,
  HardHat,
  Car,
  CheckCircle2,
  ArrowRight,
  Calculator,
  MessageSquare,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export interface IndustryVertical {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  iconName: string;
  color: string;
  heroHeadline: string;
  heroSubheadline: string;
  painPoints: string[];
  keyFeatures: { title: string; desc: string }[];
  calculator: {
    label: string;
    unit: string;
    defaultValue: number;
    savingsMultiplier: number; // e.g. hours saved or extra sales %
    resultLabel: string;
  };
  testimonial: {
    quote: string;
    author: string;
    company: string;
    metric: string;
  };
}

export const INDUSTRY_VERTICALS: IndustryVertical[] = [
  {
    id: 'ind-agro',
    slug: 'agro',
    name: 'Agroindustria & Maquinaria',
    tagline: 'Acopios, maquinaria agrícola e insumos en el campo',
    iconName: 'Tractor',
    color: 'emerald',
    heroHeadline: 'Automatización Comercial para el Agro y Maquinaria en Patagonia y Pampa Húmeda',
    heroSubheadline: 'Controla el seguimiento de productores, órdenes de acopio y cotizaciones de maquinaria sin perder leads por falta de señal.',
    painPoints: [
      'Pérdida de contactos de chacareros y productores en libretas o WhatsApp personal de vendedores',
      'Demoras de días en cotizar repuestos e implementos agrícolas',
      'Falta de sincronización con facturación oficial AFIP de granos y hacienda'
    ],
    keyFeatures: [
      { title: 'Bot Rural de WhatsApp', desc: 'Atiende consultas de productores 24/7 y deriva cotizaciones de insumos automáticamente.' },
      { title: 'Pipeline por Zona y Cultivo', desc: 'Segmenta oportunidades por hectáreas, tipo de cultivo o flota de maquinaria activa.' },
      { title: 'Integración AFIP Agro', desc: 'Emisión de comprobantes y órdenes de entrega con CAE en tiempo real.' }
    ],
    calculator: {
      label: 'Consultas mensuales de productores',
      unit: 'consultas/mes',
      defaultValue: 180,
      savingsMultiplier: 0.35,
      resultLabel: 'Ventas adicionales estimadas al mes'
    },
    testimonial: {
      quote: 'Implementamos el bot de WhatsApp para repuestos de cosechadoras y cerramos un 40% más de pedidos durante la última cosecha.',
      author: 'Ing. Martín Zubeldía',
      company: 'Agro-Servicios del Valle',
      metric: '+40% Cierre en Cosecha'
    }
  },
  {
    id: 'ind-contable',
    slug: 'estudios-contables',
    name: 'Estudios Contables',
    tagline: 'Gestión de clientes, vencimientos y enlace AFIP',
    iconName: 'FileSpreadsheet',
    color: 'blue',
    heroHeadline: 'El CRM Especializado para Contadores y Asesores Impositivos',
    heroSubheadline: 'Automatiza recordatorios de vencimiento de IVA, Ganancias e Ingresos Brutos y mantén a tus clientes informados sin saturar tu WhatsApp.',
    painPoints: [
      'Clientes enviando comprobantes a último momento por fotos borrosas de WhatsApp',
      'Horas perdidas recordando fechas de vencimiento de declaraciones juradas',
      'Cobranza de honorarios demorada por falta de seguimiento recurrente'
    ],
    keyFeatures: [
      { title: 'Avisos Automáticos de Vencimientos', desc: 'Dispara alertas por WhatsApp a cada cliente 5 días antes del vencimiento fiscal.' },
      { title: 'Portal Documental del Contribuyente', desc: 'Espacio seguro donde el cliente descarga sus Facturas y Formularios AFIP.' },
      { title: 'Cobro de Honorarios Recurrente', desc: 'Suscripciones con enlace de pago para cobrar a término todos los meses.' }
    ],
    calculator: {
      label: 'Cantidad de clientes en el estudio',
      unit: 'clientes',
      defaultValue: 65,
      savingsMultiplier: 2.2,
      resultLabel: 'Horas administrativas ahorradas al mes'
    },
    testimonial: {
      quote: 'Nos quitamos de encima responder 200 mensajes al mes preguntando cuándo vence el IVA. Los clientes se auto-gestionan en su portal.',
      author: 'Cra. Luciana Benítez',
      company: 'Estudio Benítez & Asociados',
      metric: '-30hs Gestión Mensual'
    }
  },
  {
    id: 'ind-distribuidoras',
    slug: 'distribuidoras',
    name: 'Distribuidoras Mayoristas',
    tagline: 'Catálogo B2B, pedidos mayoristas y seguimiento de rutas',
    iconName: 'Truck',
    color: 'amber',
    heroHeadline: 'Digitaliza tu Preventa y Pedidos Mayoristas en Toda tu Región',
    heroSubheadline: 'Tus clientes comerciales eligen de tu catálogo B2B, arman el pedido y lo envían a tu depósito con cálculo automático de flete y stock.',
    painPoints: [
      'Preventistas anotando pedidos en papel y errores al cargar en el sistema al final del día',
      'Stock desactualizado que genera roturas de entrega y reclamos',
      'Falta de visibilidad sobre cuentas corrientes y saldos impagos'
    ],
    keyFeatures: [
      { title: 'Catálogo Digital Mayorista', desc: 'Listas de precios diferenciadas por cliente con fotos y descuentos por bulto.' },
      { title: 'Rutas y Territorios Comerciales', desc: 'Asignación de cartera por zona geográfica y visitas programadas.' },
      { title: 'Facturación Masiva con CAE', desc: 'Genera las facturas A o B en lote al confirmar el despacho del camión.' }
    ],
    calculator: {
      label: 'Pedidos mayoristas despachados por semana',
      unit: 'pedidos/sem',
      defaultValue: 220,
      savingsMultiplier: 450,
      resultLabel: 'Ahorro mensual en errores de despacho ($)'
    },
    testimonial: {
      quote: 'Los comercios ahora cargan el pedido la noche anterior por WhatsApp. A las 7 AM el depósito ya tiene todo empaquetado para la ruta.',
      author: 'Sebastián Rossi',
      company: 'Distribuidora Patagónica SRL',
      metric: '+55% Eficiencia Logística'
    }
  },
  {
    id: 'ind-salud',
    slug: 'salud',
    name: 'Clínicas & Salud',
    tagline: 'Recordatorios de turnos, seguimiento de pacientes y teleconsultas',
    iconName: 'HeartPulse',
    color: 'rose',
    heroHeadline: 'Reduce el Ausentismo de Pacientes a Menos del 5%',
    heroSubheadline: 'Confirmación interactiva de turnos médicos por WhatsApp y ficha clínica de seguimiento para consultorios y centros de diagnóstico.',
    painPoints: [
      'Ausentismo de hasta 25% de pacientes en turnos médicos programados',
      'Líneas telefónicas de recepción colapsadas en horario pico',
      'Historia de consultas dispersa entre fichas físicas y planillas'
    ],
    keyFeatures: [
      { title: 'Confirmador de Turnos Inteligente', desc: 'Mensaje con botones "Confirmar" o "Reprogramar" 24hs antes de la cita.' },
      { title: 'Re-asignación en Tiempo Real', desc: 'Si un paciente cancela, el bot ofrece el turno libre al siguiente en lista de espera.' },
      { title: 'Historia de Contacto y Recetas', desc: 'Registro de interacciones, estudios adjuntos y derivaciones médicas.' }
    ],
    calculator: {
      label: 'Turnos programados al mes',
      unit: 'turnos/mes',
      defaultValue: 450,
      savingsMultiplier: 0.18,
      resultLabel: 'Turnos recuperados que antes se perdían'
    },
    testimonial: {
      quote: 'Redujimos el ausentismo del 22% al 4%. Eso significó recuperar más de 70 consultas mensuales para nuestros especialistas.',
      author: 'Dra. Mariana Gómez',
      company: 'Centro Médico Roca',
      metric: '96% Asistencia a Turnos'
    }
  },
  {
    id: 'ind-inmobiliaria',
    slug: 'inmobiliaria',
    name: 'Inmobiliarias & Real Estate',
    tagline: 'Portales de propiedades, calificación de inquilinos y contratos',
    iconName: 'Home',
    color: 'cyan',
    heroHeadline: 'Califica Compradores e Inquilinos al Instante',
    heroSubheadline: 'Filtra prospectos por presupuesto y zona, agenda visitas automáticamente y gestiona vencimientos de contratos de alquiler.',
    painPoints: [
      'Cientos de mensajes preguntando "¿Sigue disponible?" sin presupuesto calificado',
      'Desorganización en agendas de visitas a departamentos y casas',
      'Seguimiento manual de renovaciones e incrementos de alquiler'
    ],
    keyFeatures: [
      { title: 'Calificador Automático de Compradores', desc: 'Filtra si buscan compra o alquiler y rango de presupuesto antes de derivar al corredor.' },
      { title: 'Ficha de Inmuebles con Galería', desc: 'Envía fichas completas con fotos y ubicación por WhatsApp en un segundo.' },
      { title: 'Alertas de Vencimiento de Contratos', desc: 'Avisos con 60 días de anticipación para negociar prórrogas o nuevas publicaciones.' }
    ],
    calculator: {
      label: 'Consultas recibidas por propiedades',
      unit: 'consultas/mes',
      defaultValue: 320,
      savingsMultiplier: 0.12,
      resultLabel: 'Visitas calificadas adicionales agendadas'
    },
    testimonial: {
      quote: 'El bot califica si el interesado cumple las garantías antes de que el asesor gaste una hora en mostrar la propiedad.',
      author: 'Facundo Navarro',
      company: 'Navarro Propiedades',
      metric: '3x Visitas Calificadas'
    }
  },
  {
    id: 'ind-gastronomia',
    slug: 'gastronomia',
    name: 'Gastronomía & Bares',
    tagline: 'Carta QR, reservas de mesas y pedidos por WhatsApp',
    iconName: 'UtensilsCrossed',
    color: 'orange',
    heroHeadline: 'Tu Menú Digital y Reservas Directas sin Comisiones Abusivas',
    heroSubheadline: 'Tus comensales escanean el QR en la mesa o reservan por WhatsApp para el fin de semana sin esperas ni llamadas perdidas.',
    painPoints: [
      'Comisiones de hasta 30% en apps de delivery tradicionales',
      'Mesas vacías por descontrol en reservas tomadas por teléfono',
      'Costos elevados de reimpresión de cartas físicas ante cambios de precios'
    ],
    keyFeatures: [
      { title: 'Carta QR en Tiempo Real', desc: 'Actualiza precios, platos del día y platos agotados al instante desde tu teléfono.' },
      { title: 'Gestor de Reservas por WhatsApp', desc: 'Confirma cantidad de personas, horario y tolerancia de espera automáticamente.' },
      { title: 'Pedidos Take-Away Directos', desc: 'Comanda formateada lista para imprimir en cocina sin comisiones intermedias.' }
    ],
    calculator: {
      label: 'Cubiertos / Pedidos semanales',
      unit: 'pedidos/sem',
      defaultValue: 350,
      savingsMultiplier: 420,
      resultLabel: 'Ahorro mensual en comisiones de delivery ($)'
    },
    testimonial: {
      quote: 'Dejamos de depender de apps externas para las reservas. El 80% de nuestros clientes habituales ahora pide por nuestra carta propia.',
      author: 'Claudio Méndez',
      company: 'Restó & Cervecería Río',
      metric: '-28% Costo Comisiones'
    }
  },
  {
    id: 'ind-ecommerce',
    slug: 'ecommerce',
    name: 'E-Commerce & Retail',
    tagline: 'Integración con carritos de compra y recuperación de abandonos',
    iconName: 'ShoppingCart',
    color: 'indigo',
    heroHeadline: 'Recupera hasta el 45% de tus Carritos Abandonados por WhatsApp',
    heroSubheadline: 'Conecta tu tienda online con un agente conversacional que ofrece asistencia de compra, cupones y seguimiento de envíos en tiempo real.',
    painPoints: [
      '7 de cada 10 compradores abandonan el carrito antes del checkout',
      'Emails de recuperación con tasas de apertura menores al 15%',
      'Clientes con dudas sobre talles o envíos que compran en la competencia'
    ],
    keyFeatures: [
      { title: 'Recuperador de Carritos WhatsApp', desc: 'Envía un mensaje personalizado con el producto exacto 20 minutos después del abandono.' },
      { title: 'Seguimiento de Envíos en Vivo', desc: 'Notifica al comprador con el código de seguimiento de Correo o Encomienda.' },
      { title: 'Cross-Selling Posventa', desc: 'Recomienda accesorios complementarios 10 días después de la entrega.' }
    ],
    calculator: {
      label: 'Carritos abandonados por mes',
      unit: 'carritos/mes',
      defaultValue: 250,
      savingsMultiplier: 0.32,
      resultLabel: 'Ventas rescatadas proyectadas al mes'
    },
    testimonial: {
      quote: 'El mensaje de WhatsApp con el botón de MercadoPago directo recupera carritos que antes dábamos por perdidos.',
      author: 'Victoria Morales',
      company: 'Tienda Deco Patagonia',
      metric: '+34% Carritos Recuperados'
    }
  },
  {
    id: 'ind-b2b',
    slug: 'b2b',
    name: 'B2B & Servicios Corporativos',
    tagline: 'Prospección de decisores corporativos y ciclos largos de venta',
    iconName: 'Briefcase',
    color: 'violet',
    heroHeadline: 'Acelera Ciclos Complejos de Venta B2B con Metodología MEDDIC',
    heroSubheadline: 'Monitorea comités de compra, decisores económicos y justificación de ROI para cerrar contratos corporativos de alto valor.',
    painPoints: [
      'Ciclos de venta de 6 a 12 meses donde las oportunidades se enfrían',
      'Desconocimiento del decisor económico real o los criterios de decisión',
      'Falta de seguimiento estructurado tras enviar propuestas comerciales'
    ],
    keyFeatures: [
      { title: 'Scorecard MEDDIC Integrado', desc: 'Evalúa métricas, decisor económico, criterios y dolores de cada cuenta clave.' },
      { title: 'Secuencias de Nutrición Ejecutiva', desc: 'Envío de casos de éxito y whitepapers en momentos estratégicos del ciclo.' },
      { title: 'Cotizador Formal con PDF', desc: 'Genera propuestas membretadas con desglose de ítems e IVA en 3 minutos.' }
    ],
    calculator: {
      label: 'Deals B2B activos en pipeline',
      unit: 'deals activos',
      defaultValue: 24,
      savingsMultiplier: 0.25,
      resultLabel: 'Aceleración en tasa de cierre trimestral'
    },
    testimonial: {
      quote: 'Pasamos de cerrar 2 de cada 10 propuestas a 5 de cada 10 gracias a la calificación estricta antes de cotizar.',
      author: 'Ing. Gustavo Peirano',
      company: 'Consultora Tech Sur',
      metric: '2.5x Tasa de Cierre'
    }
  },
  {
    id: 'ind-construccion',
    slug: 'construccion',
    name: 'Construcción & Obras',
    tagline: 'Presupuestos de obra, acopio de materiales y contratistas',
    iconName: 'HardHat',
    color: 'yellow',
    heroHeadline: 'Presupuestos de Obra Rápidos y Certificaciones al Día',
    heroSubheadline: 'Gestiona acopio de materiales, avance físico de obra y certificaciones de pago con subcontratistas en un solo lugar.',
    painPoints: [
      'Demoras en cotizar cómputos y presupuestos con precios de materiales que cambian constantemente',
      'Descoordinación entre lo presupuestado y los materiales acopiados en corralón',
      'Pérdida de facturas y certificados de subcontratistas'
    ],
    keyFeatures: [
      { title: 'Presupuestador con Actualización de Costos', desc: 'Ajusta índices CAC o inflación a presupuestos abiertos.' },
      { title: 'Control de Certificaciones de Obra', desc: 'Aprobación de etapas constructivas vinculadas a pagos parciales.' },
      { title: 'Canal de WhatsApp para Capataces', desc: 'Envío de pedidos de materiales desde la obra directo a compras.' }
    ],
    calculator: {
      label: 'Obras y reformas activas',
      unit: 'obras/mes',
      defaultValue: 8,
      savingsMultiplier: 15,
      resultLabel: 'Horas ahorradas en confección de presupuestos'
    },
    testimonial: {
      quote: 'Tener los precios de corralones cargados en el CRM nos permite enviar presupuestos en el mismo día de la visita técnica.',
      author: 'Arq. Esteban Valenzuela',
      company: 'Constructora del Comahue',
      metric: '-70% Tiempo Presupuesto'
    }
  },
  {
    id: 'ind-automotor',
    slug: 'automotor',
    name: 'Concesionarias & Automotor',
    tagline: 'Seguimiento de unidades, test drives y servicios postventa',
    iconName: 'Car',
    color: 'red',
    heroHeadline: 'Atención Inmediata a Consultas de Autos y Agendamiento de Test Drives',
    heroSubheadline: 'Responde a prospectos de portales automotrices en menos de 2 minutos, asigna vendedores por guardia y automatiza la posventa.',
    painPoints: [
      'Leads de MercadoLibre Autos o Facebook que tardan horas en ser contactados y compran en otra agencia',
      'Pérdida de contacto con compradores para los services de 10.000 y 20.000 km',
      'Falta de trazabilidad sobre qué vendedor atendió cada llamado o visita'
    ],
    keyFeatures: [
      { title: 'Respuesta Inmediata por WhatsApp', desc: 'Primer contacto con ficha del vehículo y cotización de entrega en < 60 segundos.' },
      { title: 'Agenda de Test Drives y Guardias', desc: 'Rotación justa de leads entre los vendedores de salón.' },
      { title: 'Recordatorio Posventa por Kilometraje', desc: 'Avisos automatizados para cambio de aceite, filtros y chequeos periódicos.' }
    ],
    calculator: {
      label: 'Consultas mensuales recibidas por autos',
      unit: 'consultas/mes',
      defaultValue: 280,
      savingsMultiplier: 0.15,
      resultLabel: 'Test drives adicionales agendados al mes'
    },
    testimonial: {
      quote: 'Responder en menos de 3 minutos nos duplicó las visitas al salón. En la venta de autos, el que responde primero se queda con el cliente.',
      author: 'Hernán Castro',
      company: 'Automotores Patagonia',
      metric: '2x Visitas al Salón'
    }
  }
];

export const IndustryLandingPage: React.FC<{
  initialSlug?: string;
  onOpenWizard: () => void;
  onOpenSimulator: () => void;
  onBackToHome: () => void;
}> = ({ initialSlug = 'agro', onOpenWizard, onOpenSimulator, onBackToHome }) => {
  const [activeSlug, setActiveSlug] = useState<string>(initialSlug);

  React.useEffect(() => {
    if (initialSlug) {
      setActiveSlug(initialSlug);
      const vertical = INDUSTRY_VERTICALS.find((v) => v.slug === initialSlug) || INDUSTRY_VERTICALS[0];
      setCalcInput(vertical.calculator.defaultValue);
    }
  }, [initialSlug]);

  const activeVertical = INDUSTRY_VERTICALS.find((v) => v.slug === activeSlug) || INDUSTRY_VERTICALS[0];

  const [calcInput, setCalcInput] = useState<number>(activeVertical.calculator.defaultValue);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Tractor': return <Tractor className="w-5 h-5" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-5 h-5" />;
      case 'Truck': return <Truck className="w-5 h-5" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5" />;
      case 'ShoppingCart': return <ShoppingCart className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'HardHat': return <HardHat className="w-5 h-5" />;
      case 'Car': return <Car className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  const calculatedResult = Math.round(calcInput * activeVertical.calculator.savingsMultiplier);

  return (
    <div className="bg-white text-slate-800 min-h-screen text-xs font-sans">
      {/* Top Vertical Switcher Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onBackToHome}
              className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ← Portal General
            </button>
            <span className="text-[#0f172a] dark:text-white dark:text-slate-300">|</span>
            <span className="text-[11px] text-slate-500 font-bold px-1 hidden sm:inline">
              Verticales de Industria:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {INDUSTRY_VERTICALS.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setActiveSlug(v.slug);
                  setCalcInput(v.calculator.defaultValue);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSlug === v.slug
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{getIcon(v.iconName)}</span>
                <span>{v.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold shadow-xs">
          <span>{getIcon(activeVertical.iconName)}</span>
          <span>Solución Especializada para {activeVertical.name}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {activeVertical.heroHeadline}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {activeVertical.heroSubheadline}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenWizard}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            Cotizar Implementación en 4 Pasos
          </button>

          <button
            onClick={onOpenSimulator}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Probar Simulador de WhatsApp</span>
          </button>
        </div>
      </section>

      {/* Pain Points vs Solutions Grid */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pain Points */}
          <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-rose-800 flex items-center gap-2">
              <span>⚠️</span>
              Dolores habituales en {activeVertical.name}
            </h3>
            <ul className="space-y-3 text-xs text-slate-700">
              {activeVertical.painPoints.map((pain, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span>{pain}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions / Features */}
          <div className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Cómo lo resuelve Clientum Latam
            </h3>
            <div className="space-y-3">
              {activeVertical.keyFeatures.map((feat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <span className="font-bold text-slate-900 text-xs">{feat.title}</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Vertical ROI Calculator */}
      <section className="py-12 px-6 max-w-4xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-slate-50 border border-blue-200 space-y-6 shadow-xs">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Calculadora de Impacto & ROI para {activeVertical.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                {activeVertical.calculator.label}: <span className="text-blue-700 font-bold">{calcInput}</span> {activeVertical.calculator.unit}
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={calcInput}
                onChange={(e) => setCalcInput(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Mueve la barra para calcular el beneficio proyectado</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
              <span className="text-[11px] text-slate-500">{activeVertical.calculator.resultLabel}</span>
              <div className="text-3xl font-black text-blue-600">
                +{calculatedResult.toLocaleString('es-AR')}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Impacto medible en menos de 30 días</span>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Testimonial Card */}
      <section className="py-12 px-6 max-w-3xl mx-auto text-center space-y-4">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="flex justify-center text-amber-500 gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <p className="text-sm italic text-slate-800">
            "{activeVertical.testimonial.quote}"
          </p>
          <div className="pt-2">
            <div className="font-bold text-slate-900 text-xs">{activeVertical.testimonial.author}</div>
            <div className="text-[11px] text-slate-500">{activeVertical.testimonial.company}</div>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {activeVertical.testimonial.metric}
            </span>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="pt-6">
          <button
            onClick={onOpenWizard}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            Solicitar Demostración Guiada para {activeVertical.name} →
          </button>
        </div>
      </section>
    </div>
  );
};
