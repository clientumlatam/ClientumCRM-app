import React from 'react';
import {
  Building2,
  Users,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Code2,
  Cpu,
  Headphones,
  Globe2,
  ArrowRight,
  ExternalLink,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';

interface PublicOrganigramaPageProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicOrganigramaPage: React.FC<PublicOrganigramaPageProps> = ({ onNavigate }) => {
  const { enterApp } = useCRM();

  const leadership = [
    {
      name: 'Jonathan Ledantes',
      role: 'CEO & Co-Fundador (Dirección General)',
      country: 'Argentina',
      flag: '🇦🇷',
      city: 'General Roca, Río Negro, Patagonia',
      email: 'info@clientum.com.ar',
      responsibilities: [
        'Visión Estratégica & Arquitectura de IA Comercial',
        'Liderazgo de Producto, Pipeline y Suite ClientumCRM',
        'Supervisión General de Operaciones de Ingeniería y AFIP CAE'
      ],
      bio: 'Especialista en arquitectura cloud, automatización comercial y desarrollo de software para PyMEs del Cono Sur.'
    },
    {
      name: 'Matias Rotili',
      role: 'Director Internacional & Co-Fundador',
      country: 'Brasil',
      flag: '🇧🇷',
      city: 'Arraial do Cabo, Rio de Janeiro',
      email: 'brasil@clientum.com.ar',
      responsibilities: [
        'Expansión Comercial en Brasil y Alianzas Mercosur',
        'Relaciones Institucionales B2B y Canales Mayoristas',
        'Operaciones de Crecimiento y Desembarco Regional'
      ],
      bio: 'Líder en desarrollo de negocios internacionales, alianzas corporativas y expansión de plataformas SaaS en mercados emergentes.'
    }
  ];

  const functionalAreas = [
    {
      title: 'Ingeniería & Desarrollo de Software',
      lead: 'Equipo Core Tech',
      icon: <Code2 className="w-5 h-5 text-blue-600" />,
      description: 'Diseño y mantenimiento de la arquitectura de microservicios, API REST de alta concurrencia, sincronización con webhooks y optimización de latencia en tiempo real.',
      deliverables: ['Pipeline React 18 + Vite', 'Motor de Facturación AFIP WSFE', 'SDK de Integración REST']
    },
    {
      title: 'Inteligencia Artificial Aplicada',
      lead: 'Equipo AI Lab',
      icon: <Cpu className="w-5 h-5 text-emerald-600" />,
      description: 'Entrenamiento de modelos conversacionales con Gemini 3.7 y arquitecturas de agentes autónomos para prospección B2B, WhatsApp y scoring predictivo.',
      deliverables: ['Simulador WhatsApp Multiagente', 'Prospección Maps IA B2B', 'Agente OS Autónomo (14 Roles)']
    },
    {
      title: 'Customer Success & Onboarding',
      lead: 'Equipo de Éxito del Cliente',
      icon: <Headphones className="w-5 h-5 text-purple-600" />,
      description: 'Acompañamiento personalizado en la puesta en marcha, migración de bases de datos desde Excel u otros CRM, y capacitación continua a equipos de ventas.',
      deliverables: ['Migración de Datos en 48hs', 'Capacitaciones Academia LMS', 'Soporte Directo por WhatsApp']
    },
    {
      title: 'Ciberseguridad & Infraestructura Cloud',
      lead: 'Equipo Cloud Edge',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      description: 'Monitoreo de red Anycast 24/7, auditoría de certificados SSL TLS 1.3, mitigación de ataques volumétricos DDoS y copias de seguridad redundantes automatizadas.',
      deliverables: ['99.9% Uptime SLA', 'Enrutamiento Anycast Global', 'Copias de Seguridad Cifradas']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans bg-white text-slate-900">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 shadow-xs">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>Organigrama Directivo & Presencia Regional</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Estructura Institucional y Sedes Internacionales
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Conocé a los fundadores, directores y áreas operativas que impulsan la tecnología y el acompañamiento humano de Clientum en Argentina, Brasil y América Latina.
        </p>
      </section>

      {/* Leadership Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900">Dirección Ejecutiva & Co-Fundadores</h2>
          <span className="text-xs text-slate-500 font-semibold">Gobernanza Corporativa</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {leadership.map((leader, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-6 shadow-2xs hover:border-blue-300 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{leader.flag}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {leader.country}
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{leader.name}</h3>
                    <p className="text-xs font-bold text-blue-700 mt-0.5">{leader.role}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 shrink-0 shadow-2xs">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{leader.city}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {leader.bio}
                </p>

                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
                    Responsabilidades Clave:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {leader.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <a href={`mailto:${leader.email}`} className="hover:text-blue-700 font-semibold">
                    {leader.email}
                  </a>
                </div>
                <button
                  onClick={() => onNavigate('/contacto')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Contactar →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Operative Areas */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Áreas Operativas y de Soporte</h2>
            <p className="text-xs text-slate-500">Departamentos técnicos y comerciales de la suite</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            100% Personal Propio
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {functionalAreas.map((area, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 w-fit shadow-2xs">
                  {area.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{area.title}</h3>
                  <div className="text-[11px] font-semibold text-slate-500 mt-0.5">{area.lead}</div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {area.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Entregables:</div>
                <div className="flex flex-wrap gap-1.5">
                  {area.deliverables.map((del, dIdx) => (
                    <span key={dIdx} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      {del}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map & Office Information */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Infraestructura Regional y Cobertura</h3>
            <p className="text-xs text-slate-600 mt-1">
              Atención presencial en oficinas centrales y despliegue virtual en todo el Cono Sur.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/contacto')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Solicitar Reunión Presencial o Virtual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Oficina Central Río Negro (Argentina)</span>
            </div>
            <p className="text-xs text-slate-600">
              General Roca, Río Negro, Patagonia Argentina. Punto neurálgico de investigación de producto, soporte técnico y facturación electrónica.
            </p>
            <div className="text-[11px] text-blue-700 font-semibold pt-1">
              Horario: Lunes a Viernes de 09:00 a 18:00 (GMT-3)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Sede Internacional Río de Janeiro (Brasil)</span>
            </div>
            <p className="text-xs text-slate-600">
              Arraial do Cabo, Rio de Janeiro, Brasil. Centro de expansión estratégica para el mercado brasileño y cono sur.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold pt-1">
              Horario: Segunda a Sexta das 09:00 às 18:00 (GMT-3)
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
