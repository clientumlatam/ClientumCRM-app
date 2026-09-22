import React from 'react';
import {
  ArrowRight,
  Bot,
  Layers,
  BarChart3,
  Building2,
  Tractor,
  HeartPulse,
  Truck,
  Store,
  Sparkles,
  Zap,
  CheckCircle2,
  Mail,
  GraduationCap,
  Users2,
  Phone,
  Newspaper
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';

interface PublicEcosystemSectionsProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicEcosystemSections: React.FC<PublicEcosystemSectionsProps> = ({ onNavigate }) => {
  const { showToast, triggerConfetti } = useCRM();

  const industries = [
    { name: 'Comercio y Retail', code: 'RETAIL', path: '/industrias/ecommerce' as PublicRoutePath, icon: Store },
    { name: 'Salud', code: 'HEALTH', path: '/industrias/salud' as PublicRoutePath, icon: HeartPulse },
    { name: 'Agroindustria', code: 'AGRO', path: '/industrias/agro' as PublicRoutePath, icon: Tractor },
    { name: 'Inmobiliaria', code: 'REAL', path: '/industrias/inmobiliaria' as PublicRoutePath, icon: Building2 },
    { name: 'Logística & Distribución', code: 'LOG', path: '/industrias/distribuidoras' as PublicRoutePath, icon: Truck },
  ];

  const solutions = [
    { title: 'APIs de ChatBot Inteligencia IA', path: '/producto/whatsapp-ia' as PublicRoutePath },
    { title: 'CRM Inteligencia IA', path: '/clientum-crm' as PublicRoutePath },
    { title: 'Casacheras IA CRM Inteligencia', path: '/producto/agentes-ia' as PublicRoutePath },
    { title: 'Automatización de Procesos & QA Phase', path: '/producto/automatizaciones' as PublicRoutePath },
    { title: 'Portales SOS & Automatización', path: '/producto/integraciones' as PublicRoutePath },
  ];

  const leverageLinks = [
    { name: 'Santi/Clientum', sub: 'Soluciones inteligentes', path: '/producto/agentes-ia' as PublicRoutePath, icon: Sparkles },
    { name: 'Academia Clientum', sub: 'Capacitación continua', path: '/academia' as PublicRoutePath, icon: GraduationCap },
    { name: 'Partners', sub: 'Red de aliados', path: '/partners' as PublicRoutePath, icon: Users2 },
    { name: 'Contacto', sub: 'Equipo dedicado', path: '/contacto' as PublicRoutePath, icon: Phone },
    { name: 'Noticias & Prensa', sub: 'Históricos de medios', path: '/recursos' as PublicRoutePath, icon: Newspaper },
  ];

  const features = [
    {
      title: 'Automatización IA',
      desc: 'Agentes inteligentes para WhatsApp, email y SMS con Hermes Prime.',
      icon: Bot,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'CRM Completo',
      desc: 'Gestión integral de clientes con seguimiento automático y prospecting.',
      icon: Layers,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Analítica & BI',
      desc: 'Reportes inteligentes y dashboards personalizables en tiempo real.',
      icon: BarChart3,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  ];

  return (
    <div className="space-y-16 pt-8 border-t border-slate-200 text-slate-900 font-sans">
      
      {/* 1. Industrias & Soluciones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Industrias & Casos */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Industrias & Casos
            </h3>
            <span className="text-[10px] font-bold text-[#0f172a] dark:text-white dark:text-slate-400 uppercase tracking-wider">Especialidades</span>
          </div>
          <div className="space-y-2.5">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onNavigate(ind.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white hover:border-slate-300 border border-transparent text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                      {ind.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#0f172a] dark:text-white dark:text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                      {ind.code}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0f172a] dark:text-white dark:text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Soluciones & Servicios */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Soluciones & Servicios
            </h3>
            <span className="text-[10px] font-bold text-[#0f172a] dark:text-white dark:text-slate-400 uppercase tracking-wider">Tecnología</span>
          </div>
          <div className="space-y-2.5">
            {solutions.map((sol, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onNavigate(sol.path)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white hover:border-slate-300 border border-transparent text-left transition-all group cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 flex items-center gap-2">
                  <span className="text-blue-600">→</span>
                  {sol.title}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0f172a] dark:text-white dark:text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* # Leverage */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span className="text-blue-600">#</span> Leverage
            </h3>
            <span className="text-[10px] font-bold text-[#0f172a] dark:text-white dark:text-slate-400 uppercase tracking-wider">Ecosistema</span>
          </div>
          <div className="space-y-2.5">
            {leverageLinks.map((lev, i) => {
              const Icon = lev.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onNavigate(lev.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white hover:border-slate-300 border border-transparent text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                        {lev.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {lev.sub}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0f172a] dark:text-white dark:text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Empezar Banner */}
      <div className="rounded-3xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-950 text-[#0f172a] dark:text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
            <Zap className="w-3.5 h-3.5" />
            <span>Empezar Hoy</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Transforma tu negocio con automatización IA. Sin código. Sin contratos largos.
          </h3>
          <p className="text-xs text-[#0f172a] dark:text-white dark:text-slate-400 max-w-2xl">
            Implementación guiada en 5 días hábiles. Comprobantes fiscales con CAE y WhatsApp oficial de Meta listos para facturar.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('/planes')}
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            Suscribirse
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/contacto')}
            className="px-5 py-3.5 rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-700 text-[#0f172a] dark:text-white dark:text-slate-200 font-bold text-xs border border-[#cbd5e1] dark:border-[#cbd5e1] dark:border-slate-700 cursor-pointer transition-colors"
          >
            Hablar con Asesor
          </button>
        </div>
      </div>

      {/* 3. Características Principales */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Características principales
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Herramientas robustas diseñadas para la productividad operativa diaria de empresas y PyMEs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{feat.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
