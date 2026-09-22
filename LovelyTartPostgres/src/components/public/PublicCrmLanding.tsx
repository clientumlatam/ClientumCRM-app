import React, { useState } from 'react';
import {
  Kanban,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  FileSpreadsheet,
  MessageSquare,
  Sparkles,
  Zap,
  Play,
  Clock,
  ShieldCheck,
  Award,
  ChevronDown,
  Smartphone,
  Bot
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';
import { PublicDashboardShowcase } from './PublicDashboardShowcase';

interface PublicCrmLandingProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicCrmLanding: React.FC<PublicCrmLandingProps> = ({ onNavigate }) => {
  const { enterApp } = useCRM();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pipelineStages = [
    { number: '1', title: 'Nueva Oportunidad', desc: 'Captación automática desde WhatsApp, formularios web y prospección Google Maps.' },
    { number: '2', title: 'Contacto & Diagnóstico', desc: 'Validación de necesidades, calificación MEDDIC y asignación al vendedor indicado.' },
    { number: '3', title: 'Propuesta Presentada', desc: 'Envío de presupuesto con tracking de apertura y alertas automáticas de deal rotting.' },
    { number: '4', title: 'Negociación', desc: 'Ajuste de términos comerciales, formas de pago y seguimiento conversacional continuo.' },
    { number: '5', title: 'Cierre Ganado', desc: 'Emisión automática de Factura AFIP con CAE y pase a post-venta u operaciones.' }
  ];

  const coreFeatures = [
    {
      icon: <Kanban className="w-5 h-5 text-blue-600" />,
      title: 'Pipeline Drag & Drop Visual',
      desc: 'Visualiza tus negocios en columnas, calcula totales ponderados en pesos o dólares y arrastra tratos sin perder el rastro.'
    },
    {
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      title: 'Contactos y Empresas Centralizados',
      desc: 'Historial completo de llamadas, notas, presupuestos emitidos y mensajes de WhatsApp en una única ficha de cliente.'
    },
    {
      icon: <Bot className="w-5 h-5 text-purple-600" />,
      title: 'Asistente de IA Integrado (Gemini)',
      desc: 'Redacción automática de propuestas comerciales, resúmenes de reuniones y scoring predictivo de probabilidad de compra.'
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5 text-amber-600" />,
      title: 'Facturación Electrónica Automática AFIP',
      desc: 'Emisión de Facturas A, B y C con CAE oficial en menos de 2 segundos directamente al ganar una oportunidad en el pipeline.'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-cyan-600" />,
      title: 'Acceso Multi-Dispositivo (Desktop y Móvil)',
      desc: 'Tecnología PWA instalable en celulares y tablets sin necesidad de descargar apps pesadas de tiendas externas.'
    }
  ];

  const crmFaqs = [
    {
      q: '¿Qué es Clientum CRM?',
      a: 'Clientum CRM es la plataforma de gestión comercial diseñada para PyMEs que centraliza el embudo de ventas, conversaciones de WhatsApp, fichas de clientes y facturación electrónica AFIP en una sola interfaz simple y en moneda local.'
    },
    {
      q: '¿Puedo probarlo antes de contratar?',
      a: 'Sí. Puedes acceder de inmediato a nuestra demo interactiva en vivo o activar una prueba gratuita de 14 días sin ingresar tarjeta de crédito.'
    },
    {
      q: '¿Puedo trabajar con múltiples usuarios y permisos?',
      a: 'Sí. Puedes crear perfiles para directores, supervisores y vendedores con roles y permisos específicos (visibilidad de oportunidades, acceso a métricas y límites de edición).'
    },
    {
      q: '¿Con qué herramientas se integra?',
      a: 'Se integra de forma nativa con WhatsApp Business API, webservices de AFIP con CAE oficial, Mercado Pago, Google Workspace, y cuenta con API REST y Webhooks para conectar cualquier ERP existente.'
    },
    {
      q: '¿Cómo se protegen los datos?',
      a: 'Todos los datos viajan cifrados bajo estándar SSL/TLS de 256 bits, alojados en centros de datos Anycast de alta disponibilidad, con copias de seguridad automáticas y soberanía total de la información de tu empresa.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans bg-white text-slate-900">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <Kanban className="w-3.5 h-3.5 text-blue-600" />
          <span>Clientum CRM • Suite Comercial Omnicanal para PyMEs</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
          El CRM diseñado para PyMEs que quieren{' '}
          <span className="text-blue-600">
            vender más y trabajar mejor
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Gestiona contactos, oportunidades, cotizaciones en PDF y conversaciones de WhatsApp sin la complejidad ni los costos exorbitantes de los sistemas tradicionales.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => enterApp()}
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Probar la Demo Interactiva en Vivo</span>
          </button>
          <button
            onClick={() => onNavigate('/contacto')}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-sm transition-all cursor-pointer shadow-xs"
          >
            Solicitar Demostración Guiada
          </button>
        </div>
      </section>

      {/* 5 Pipeline Stages */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            El Pipeline Comercial en 5 Etapas Claras
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Diseñado para que tu equipo comercial nunca pierda de vista un presupuesto ni olvide un seguimiento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {pipelineStages.map((stage) => (
            <div
              key={stage.number}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors shadow-2xs"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-3">
                  {stage.number}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{stage.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
              </div>
              <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                Etapa {stage.number} del Embudo
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Showcase Preview */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Control Visual Completo de tu Operación</h2>
          <p className="text-xs text-slate-500">Métricas, alertas automáticas y semáforo de actividad en tiempo real.</p>
        </div>
        <PublicDashboardShowcase onNavigate={onNavigate} />
      </section>

      {/* 5 Core Features */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            5 Características Principales del CRM
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Todo lo que una PyME moderna necesita para acelerar ventas y automatizar administración.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div className="p-3 rounded-xl bg-white border border-slate-200 w-fit shadow-2xs">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}

          {/* Callout Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-between space-y-4 shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Soporte Humano Incluido
              </span>
              <h3 className="text-lg font-bold mt-2">Acompañamiento en la Puesta en Marcha</h3>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                Migramos tu base de clientes desde Excel u otros sistemas en menos de 48 horas sin costo adicional.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/contacto')}
              className="py-2.5 px-4 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition-colors cursor-pointer w-fit shadow-xs"
            >
              Solicitar Migración Gratuita
            </button>
          </div>
        </div>
      </section>

      {/* 5 FAQs Section */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Preguntas Frecuentes sobre Clientum CRM
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Respuestas claras a las consultas más habituales de dueños y gerentes comerciales.
          </p>
        </div>

        <div className="space-y-3">
          {crmFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 text-[#0f172a] dark:text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Moderniza el Equipo Comercial de tu Empresa
        </h2>
        <p className="text-xs sm:text-sm text-[#0f172a] dark:text-white dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Comienza con nuestra demo guiada o conversa con uno de nuestros directores para diseñar la arquitectura adecuada para tu negocio.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => enterApp()}
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Acceder a la Demo en Vivo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/contacto')}
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#0f172a] dark:text-white font-bold text-xs transition-all cursor-pointer"
          >
            Agendar Sesión con un Especialista
          </button>
        </div>
      </section>

    </div>
  );
};
