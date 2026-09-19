import React, { useState } from 'react';
import {
  Kanban,
  Bot,
  Layers,
  Send,
  Search,
  Receipt,
  BarChart3,
  Cpu,
  Boxes,
  ArrowRight,
  CheckCircle2,
  Play,
  Sparkles,
  MessageSquare,
  Link,
  Globe
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';
import { PublicDashboardShowcase } from './PublicDashboardShowcase';

interface PublicProductPageProps {
  currentSubPath?: string;
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicProductPage: React.FC<PublicProductPageProps> = ({
  currentSubPath,
  onNavigate,
}) => {
  const { enterApp } = useCRM();

  // Extract initial active tab from path or default to 'overview'
  const getInitialTab = () => {
    if (currentSubPath?.includes('dashboard')) return 'dashboard';
    if (currentSubPath?.includes('crm')) return 'crm';
    if (currentSubPath?.includes('whatsapp')) return 'whatsapp';
    if (currentSubPath?.includes('automatizaciones')) return 'automatizaciones';
    if (currentSubPath?.includes('marketing')) return 'marketing';
    if (currentSubPath?.includes('seo')) return 'seo';
    if (currentSubPath?.includes('erp')) return 'erp';
    if (currentSubPath?.includes('bi')) return 'bi';
    if (currentSubPath?.includes('agentes-ia')) return 'agentes-ia';
    if (currentSubPath?.includes('integraciones')) return 'integraciones';
    return 'overview';
  };

  const [activeModule, setActiveModule] = useState<string>(getInitialTab());

  const modules = [
    {
      id: 'overview',
      name: 'Resumen de Suite',
      icon: Boxes,
      badge: 'Suite Completa',
      tagline: 'Todo el ciclo de vida del cliente en una arquitectura unificada.'
    },
    {
      id: 'dashboard',
      name: 'Dashboard Ejecutivo',
      icon: BarChart3,
      badge: 'Control 360°',
      tagline: 'Semáforo de focos urgentes, deal rotting, pipeline ponderado y Copilot con IA.'
    },
    {
      id: 'crm',
      name: 'CRM 360° Omnicanal',
      icon: Kanban,
      badge: 'Core Comercial',
      tagline: 'Pipelines Kanban, vista de hoja de cálculo y scoring predictivo MEDDIC.'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp IA & Bots',
      icon: MessageSquare,
      badge: 'Más Usado',
      tagline: 'Atención 24/7 con Gemini 3.6 Flash y derivación inteligente a vendedores.'
    },
    {
      id: 'automatizaciones',
      name: 'Automatizaciones DAG',
      icon: Layers,
      badge: 'Sin Código',
      tagline: 'Editor visual jerárquico para disparadores, condiciones y acciones automáticas.'
    },
    {
      id: 'marketing',
      name: 'Marketing & Outreach',
      icon: Send,
      badge: 'Growth',
      tagline: 'Campañas de difusión masivas, copywriter con IA y nutrición de prospectos.'
    },
    {
      id: 'erp',
      name: 'ERP & Facturación AFIP',
      icon: Receipt,
      badge: 'Fiscal RG 4291',
      tagline: 'Comprobantes oficiales electrónicos con CAE automático y control de inventario.'
    },
    {
      id: 'bi',
      name: 'Business Intelligence',
      icon: BarChart3,
      badge: 'Analítica',
      tagline: 'Métricas de conversión por asesor, atribución de canales y pronósticos de ingresos.'
    },
    {
      id: 'agentes-ia',
      name: 'Agent OS (14 Agentes)',
      icon: Cpu,
      badge: 'Autónomo',
      tagline: 'Red de agentes autónomos para prospección, calificación y análisis de mercado.'
    },
    {
      id: 'seo',
      name: 'SEO & Visibilidad Web',
      icon: Search,
      badge: 'Posicionamiento',
      tagline: 'Auditoría SEO On-Page, palabras clave, brief de contenidos con IA y visibilidad en Google.'
    },
    {
      id: 'integraciones',
      name: 'Integraciones Nativas',
      icon: Link,
      badge: 'API & Webhooks',
      tagline: 'MercadoPago, Google Workspace, WordPress, MercadoLibre y conectores REST API.'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans bg-white text-slate-900">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Arquitectura Integral para Empresas en Crecimiento</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          La Suite Tecnológica Comercial más Potente de Latam
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Diseñada para eliminar los silos de información: ventas, WhatsApp, automatizaciones, analítica y facturación fiscal trabajando sobre la misma base de datos.
        </p>
      </div>

      {/* Module Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* Module Detailed Content */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* Module Header */}
        {(() => {
          const current = modules.find((m) => m.id === activeModule) || modules[0];
          const Icon = current.icon;
          return (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{current.name}</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {current.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{current.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => enterApp()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Probar en Vivo</span>
                </button>
                <button
                  onClick={() => onNavigate('/contacto')}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-xs transition-all cursor-pointer shadow-xs"
                >
                  Solicitar Demo
                </button>
              </div>
            </div>
          );
        })()}

        {/* Dynamic Detail Body by Module */}
        {activeModule === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Kanban className="w-4 h-4 text-blue-600" />
                <span>1. Ventas & CRM 360°</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Visualización integral de clientes, contactos y tratos con cálculo automático de probabilidades de cierre y tiempo en etapa.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>2. Inteligencia Artificial Gemini</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Chatbots que atienden 24/7 y organigrama de 14 agentes de IA especializados en Growth, Ventas, Soporte, SEO y Copias publicitarias.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-purple-600" />
                <span>3. Facturación AFIP & Finanzas</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Conexión nativa con servidores fiscales para emitir comprobantes oficiales con CAE en el momento exacto del cierre de la venta.
              </p>
            </div>
          </div>
        )}

        {activeModule === 'dashboard' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Centro de Mando Ejecutivo para Líderes de Negocio
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Unifica los 5 indicadores de salud comercial, semáforo de tareas vencidas, detección preventiva de enfriamiento de tratos y Copilot conversacional con IA.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                  Actualización en tiempo real
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Pipeline Ponderado Activo
                  </div>
                  <p className="text-slate-600">
                    Calcula el valor real estimado ajustado por probabilidad de etapa (ej. 40% en Prospecto vs 85% en Propuesta formal).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Alerta de "Deal Rotting"
                  </div>
                  <p className="text-slate-600">
                    Avisa al líder comercial si un trato supera los 7 días sin nueva llamada, mensaje de WhatsApp o actividad registrada.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    Copilot con Asistente Gemini
                  </div>
                  <p className="text-slate-600">
                    Consultas conversacionales inmediatas de KPIs, redacción de objeciones y sugerencias tácticas para acelerar el cierre.
                  </p>
                </div>
              </div>
            </div>

            <PublicDashboardShowcase
              onNavigate={onNavigate}
            />
          </div>
        )}

        {activeModule === 'crm' && (
          <div className="space-y-6 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Pipeline de Oportunidades Visual & Flexible</h3>
                <p className="text-slate-600 leading-relaxed">
                  Arrastra tarjetas entre columnas con actualización en tiempo real del valor ponderado del embudo. Configura etapas según tu ciclo de venta (B2B, mayorista o comercio).
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Vista dual: Tablero Kanban y Hoja de cálculo con edición inline ultrarrápida</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Calificación predictiva MEDDIC (Metrics, Economic Buyer, Decision Criteria, etc.)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Generador de presupuestos formales en PDF con membrete y envío por WhatsApp</span>
                  </li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Métricas de Rendimiento</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-2xl font-extrabold text-slate-900">+35%</div>
                    <div className="text-[11px] text-slate-500">Aumento en tasa de cierre</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-2xl font-extrabold text-emerald-600">-50%</div>
                    <div className="text-[11px] text-slate-500">Tiempo de ciclo de venta</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'whatsapp' && (
          <div className="space-y-6 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Bandeja de Entrada Multicanal & Bots de IA</h3>
                <p className="text-slate-600 leading-relaxed">
                  Conecta tus líneas comerciales existentes sin perder historial. Nuestro bot impulsado por Gemini 3.6 responde consultas frecuentes, envía catálogos y califica al comprador.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Doble conectividad: Código QR en 60 segundos o WhatsApp Cloud API Oficial</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Detección automática de intención del cliente (Precios, Soporte, Demo, Reclamos)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Derivación fluida al asesor comercial asignado en cuanto el lead está maduro</span>
                  </li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Capacidades del Bot</div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>Tiempo de respuesta promedio:</span>
                    <span className="font-bold text-emerald-600">&lt; 3 segundos</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>Disponibilidad ininterrumpida:</span>
                    <span className="font-bold text-slate-900">24 horas / 7 días</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>Entrenamiento con catálogo:</span>
                    <span className="font-bold text-blue-600">PDF, Excel o Web</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'erp' && (
          <div className="space-y-6 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Facturación Electrónica AFIP Homologada</h3>
                <p className="text-slate-600 leading-relaxed">
                  Genera comprobantes fiscales oficiales sin salir del CRM. Cumple con la normativa tributaria con obtención instantánea de Código de Autorización Electrónico (CAE).
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Emisión de Facturas A, B y C con discriminación de alícuotas (21%, 10.5%, 27%)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Control de stock con alerta de punto de reorden en tiempo real</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Registro y categorización de gastos operativos por centro de costo</span>
                  </li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">Ahorro Administrativo</div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                  <div className="text-3xl font-extrabold text-purple-600">20+ Horas</div>
                  <div className="text-slate-500 text-xs">Ahorradas al mes por el equipo contable</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'seo' && (
          <div className="space-y-6 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Suite SEO & Inteligencia de Búsqueda</h3>
                <p className="text-slate-600 leading-relaxed">
                  Optimiza la presencia digital de tu marca en Google y motores de búsqueda. Analiza la intención de búsqueda de tus compradores y genera briefs de contenidos con IA en segundos.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Auditoría SEO On-Page instantánea (Etiquetas OpenGraph, Meta Titles, Schema.org)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Rastreo y monitoreo de posicionamiento orgánico para palabras clave de alto impacto</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Generación asistida con Gemini IA de artículos optimizados para blog y fichas de producto</span>
                  </li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Tráfico & Leads Orgánicos</div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                  <div className="text-3xl font-extrabold text-blue-600">+140%</div>
                  <div className="text-slate-500 text-xs">Aumento promedio en visitas orgánicas sostenidas</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'integraciones' && (
          <div className="space-y-6 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Integraciones Nativas & Ecosistema Abierto</h3>
                <p className="text-slate-600 leading-relaxed">
                  Conecta Clientum con tus herramientas existentes sin silos de información ni reprocesos manuales.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>MercadoPago: Enlaces de pago, suscripciones recurrentes y cobro con Código QR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Google Workspace & Outlook: Sincronización bidireccional de correos y calendarios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>MercadoLibre & WooCommerce: Sincronización automática de publicaciones y pedidos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>API REST Gateway & Webhooks seguros para integración con ERPs legados</span>
                  </li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Conectividad Abierta</div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                  <div className="text-3xl font-extrabold text-emerald-600">&lt; 1 Seg</div>
                  <div className="text-slate-500 text-xs">Latencia de disparo de Webhooks y sincronización</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA bottom row */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            ¿Querés ver este módulo funcionando con tus propios datos y productos?
          </div>
          <button
            onClick={() => onNavigate('/contacto')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <span>Agendar Demostración Técnica</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
