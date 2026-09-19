import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code,
  Layers,
  BarChart3,
  Bot,
  Calendar,
  Award
} from 'lucide-react';
import { CLIENTUM_SERVICES } from '../../data/clientumCatalog';
import { PublicRoutePath } from './publicRoutes';

interface PublicServicesPageProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenWizard: () => void;
}

export const PublicServicesPage: React.FC<PublicServicesPageProps> = ({ onNavigate, onOpenWizard }) => {
  const [selectedScope, setSelectedScope] = useState<'express' | 'full' | 'enterprise'>('full');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-['Plus_Jakarta_Sans',sans-serif] bg-white text-slate-900">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>Servicios Profesionales de Implementación & Consultoría</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Ingeniería Comercial y Automatizaciones Llave en Mano
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          No te dejamos solo con el software. Diseñamos, configuramos y conectamos tus procesos con tiempos de entrega garantizados en menos de 5 a 18 días hábiles.
        </p>
      </section>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLIENTUM_SERVICES.map((srv) => (
          <div
            key={srv.id}
            className="rounded-3xl bg-slate-50 border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all space-y-6 shadow-xs"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
                  {srv.sku}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{srv.implementationDays}</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{srv.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{srv.shortDescription}</p>
              </div>

              {/* Price */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Inversión Base</div>
                <div className="text-xl font-extrabold text-slate-900">
                  ${srv.regularPrice.toLocaleString('es-AR')} ARS
                </div>
              </div>

              {/* Features */}
              {srv.features && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Entregables incluidos:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => onNavigate('/contacto')}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>Solicitar Presupuesto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive SLA & Implementation Calculator */}
      <section className="bg-[#f8fafc] dark:bg-slate-900 text-[#0f172a] dark:text-white dark:text-white border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Estimador Interactivo de Plazos & SLA Garantizado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Seleccioná el Alcance de Implementación para tu PyME
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-white dark:text-slate-300">
            Compromiso por contrato con penalización por demora. Entregamos soluciones listas para operar con capacitación de personal.
          </p>
        </div>

        {/* Scope Selector Tabs */}
        <div className="flex justify-center relative z-10">
          <div className="inline-flex p-1 rounded-xl bg-[#ffffff] dark:bg-slate-800 border border-[#cbd5e1] dark:border-slate-700">
            <button
              onClick={() => setSelectedScope('express')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedScope === 'express' ? 'bg-blue-600 text-white shadow-xs' : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white'
              }`}
            >
              Arranque Exprés (5 Días)
            </button>
            <button
              onClick={() => setSelectedScope('full')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedScope === 'full' ? 'bg-blue-600 text-white shadow-xs' : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white'
              }`}
            >
              Puesta en Marcha Integral (10 Días)
            </button>
            <button
              onClick={() => setSelectedScope('enterprise')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedScope === 'enterprise' ? 'bg-blue-600 text-white shadow-xs' : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white'
              }`}
            >
              Enterprise & ERP Custom (18 Días)
            </button>
          </div>
        </div>

        {/* Dynamic Scope Result Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 relative z-10">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-xs">
            <div className="text-xs text-[#64748b] dark:text-white dark:text-slate-400 font-semibold">Tiempo Estimado de Entrega</div>
            <div className="text-2xl font-black text-blue-400 font-mono">
              {selectedScope === 'express' && '5 Días Hábiles'}
              {selectedScope === 'full' && '10 Días Hábiles'}
              {selectedScope === 'enterprise' && '18 Días Hábiles'}
            </div>
            <div className="text-[11px] text-[#475569] dark:text-white dark:text-slate-300">Garantía por SLA con entrega auditada por acta.</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-xs">
            <div className="text-xs text-[#64748b] dark:text-white dark:text-slate-400 font-semibold">Entregables Principales</div>
            <div className="text-xs font-bold text-[#0f172a] dark:text-white dark:text-white leading-relaxed">
              {selectedScope === 'express' && 'Sincronización WhatsApp + Pipeline CRM + Plantillas Oficiales.'}
              {selectedScope === 'full' && 'WhatsApp IA Gemini + Homologación AFIP + Certificados + Capacitación.'}
              {selectedScope === 'enterprise' && 'Conectores ERP + API Gateway + Flujos Custom DAG + Capacitación In-Company.'}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Ingeniero Asignado</div>
              <div className="text-sm font-bold text-[#0f172a] dark:text-white dark:text-white mt-1">Especialista Sénior Dedicado</div>
              <p className="text-[11px] text-blue-100 mt-0.5">Acompañamiento 1 a 1 por canal directo de WhatsApp.</p>
            </div>
            <button
              onClick={onOpenWizard}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs cursor-pointer transition-colors shadow-xs"
            >
              Reservar Fecha de Inicio
            </button>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Nuestra Metodología
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Cómo trabajamos en cada proyecto de consultoría
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="text-blue-700 font-bold text-sm">Paso 1: Relevamiento & Auditoría</div>
            <p className="text-slate-600 leading-relaxed">Analizamos tus canales actuales de WhatsApp, planillas de Excel y ciclo de facturación para diseñar el mapa de procesos.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="text-blue-700 font-bold text-sm">Paso 2: Configuración & Migración</div>
            <p className="text-slate-600 leading-relaxed">Cargamos contactos, entrenamos los agentes de IA con tu catálogo y homologamos los certificados fiscales en AFIP.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="text-blue-700 font-bold text-sm">Paso 3: Capacitación & Acompañamiento</div>
            <p className="text-slate-600 leading-relaxed">Capacitamos a tu equipo de ventas y administración en vivo para asegurar una adopción del 100% desde el día 1.</p>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="p-8 rounded-3xl bg-blue-50/80 border border-blue-200 text-center space-y-4 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">¿Tenés un requerimiento especial o integración a medida?</h2>
        <p className="text-xs text-slate-600 max-w-lg mx-auto">
          Podemos conectar Clientum con tu ERP existente, software contable o sistemas legados mediante APIs y webhooks seguros.
        </p>
        <button
          onClick={() => onNavigate('/contacto')}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-all shadow-xs"
        >
          Hablar con el Equipo de Ingeniería
        </button>
      </section>

    </div>
  );
};
