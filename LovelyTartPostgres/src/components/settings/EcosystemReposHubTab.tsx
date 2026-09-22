import React, { useState } from 'react';
import {
  GitBranch,
  ExternalLink,
  Code2,
  FolderGit2,
  Sparkles,
  Layers,
  ArrowUpRight,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Mail,
  MessageSquare,
  Globe,
  Database,
  Terminal,
  Workflow,
  FileCode2,
  FileText,
  Cloud,
  Mic,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface ClientumRepo {
  id: string;
  name: string;
  repoName: string;
  url: string;
  category: 'core' | 'ai-audio' | 'webmail-comms' | 'public-web' | 'migration-arch' | 'metadata-schemas' | 'apps';
  status: 'consolidated' | 'integrated' | 'active-migration' | 'ready-to-sync';
  description: string;
  techStack: string[];
  keyFeatures: string[];
  integrationAction?: string;
}

export const CLIENTUM_REPOSITORIES: ClientumRepo[] = [
  // 1. Core Architecture & ClientumOS
  {
    id: 'repo-clientum-os',
    name: 'ClientumOS',
    repoName: 'clientumlatam/ClientumOS',
    url: 'https://github.com/clientumlatam/ClientumOS',
    category: 'core',
    status: 'consolidated',
    description: 'Sistema Operativo central de Clientum CRM con arquitectura modular, pipeline visual y soporte multi-tenant.',
    techStack: ['TypeScript', 'React 18', 'Tailwind CSS', 'PostgreSQL / Firestore'],
    keyFeatures: ['Pipeline Kanban', 'RBAC Multi-rol', 'Sincronización en tiempo real', 'Gestión de Leads & Deals'],
    integrationAction: 'Plataforma base activa',
  },
  {
    id: 'repo-arch-migration',
    name: 'ClientumOS Architecture Migration',
    repoName: 'clientumlatam/-ClientumOS-Architecture-Migration',
    url: 'https://github.com/clientumlatam/-ClientumOS-Architecture-Migration',
    category: 'migration-arch',
    status: 'active-migration',
    description: 'Roadmap y artefactos de arquitectura para migración a Next-Gen Cloud Run, TypeScript y servicios headless.',
    techStack: ['Architecture Specs', 'Docker / Cloud Run', 'REST / GraphQL', 'Vercel'],
    keyFeatures: ['Estrategia Zero-Downtime', 'Contenerización', 'Normalización de esquemas'],
    integrationAction: 'Roadmap de migración activo',
  },
  {
    id: 'repo-vercel',
    name: 'ClientumOS CRM en Vercel',
    repoName: 'clientumlatam/ClientumOS-CRM-en-Vercel',
    url: 'https://github.com/clientumlatam/ClientumOS-CRM-en-Vercel',
    category: 'core',
    status: 'consolidated',
    description: 'Build de distribución optimizado para edge functions y despliegue continuo en Vercel.',
    techStack: ['Vercel Serverless', 'Next.js / Vite', 'Edge Functions'],
    keyFeatures: ['Edge CDN Caching', 'Rutas de API ligeras', 'Despliegue automático'],
    integrationAction: 'Compatible con Vercel & Cloud Run',
  },
  {
    id: 'repo-dashboard-crm',
    name: 'Clientum Dashboard CRM',
    repoName: 'clientumlatam/clientum-dashboard-crm',
    url: 'https://github.com/clientumlatam/clientum-dashboard-crm',
    category: 'core',
    status: 'consolidated',
    description: 'Dashboard analítico con métricas de conversión, proyección de pipeline y cuotas de equipo comercial.',
    techStack: ['Recharts', 'TypeScript', 'Analytics Engine'],
    keyFeatures: ['Métricas en vivo', 'Forecasting ponderado', 'Leaderboard comercial'],
    integrationAction: 'Incorporado en vista Dashboard & Métricas',
  },

  // 2. WhatsApp & Audio-to-Text
  {
    id: 'repo-audio-whatsapp',
    name: 'Audio to Text for WhatsApp Web',
    repoName: 'clientumlatam/Audio-to-Text-for-WhatsApp-Web',
    url: 'https://github.com/clientumlatam/Audio-to-Text-for-WhatsApp-Web',
    category: 'ai-audio',
    status: 'integrated',
    description: 'Extensión y motor de transcripción de audios de WhatsApp Web con extracción inteligente de tareas vía Gemini AI.',
    techStack: ['Web Speech API', 'Gemini AI', 'Chrome Extension API', 'Audio Parsing'],
    keyFeatures: ['Transcripción instantánea', 'Detección de compromisos', 'Creación automática de tareas'],
    integrationAction: 'Módulo de Nota de Voz & IA integrado',
  },
  {
    id: 'repo-wace',
    name: 'WACE (WhatsApp Automation & Comms)',
    repoName: 'clientumlatam/WACE',
    url: 'https://github.com/clientumlatam/WACE',
    category: 'ai-audio',
    status: 'integrated',
    description: 'Motor de automatización y plantillas para prospección y seguimiento por WhatsApp.',
    techStack: ['WhatsApp Cloud API', 'Automation Workflows', 'Template Engine'],
    keyFeatures: ['Disparo de WhatsApp por cambio de etapa', 'Plantillas dinámicas de venta'],
    integrationAction: 'Conectado a Automatizaciones CRM',
  },

  // 3. Webmail & Communications
  {
    id: 'repo-webmail',
    name: 'Clientum Webmail',
    repoName: 'clientumlatam/clientum-webmail',
    url: 'https://github.com/clientumlatam/clientum-webmail',
    category: 'webmail-comms',
    status: 'integrated',
    description: 'Cliente de correo corporativo integrado con Cloudflare Email Routing & Workers con bandeja de entrada inteligente.',
    techStack: ['Cloudflare Workers', 'Email Routing', 'IMAP/SMTP/API', 'Tailwind'],
    keyFeatures: ['Bandeja unificada', 'Redacción asistida por Gemini', 'Vinculación a tratos/contactos'],
    integrationAction: 'Operativo en Hub de Integraciones & Webmail',
  },
  {
    id: 'repo-cloud',
    name: 'Clientum Cloud',
    repoName: 'clientumlatam/clientumcloud',
    url: 'https://github.com/clientumlatam/clientumcloud',
    category: 'webmail-comms',
    status: 'ready-to-sync',
    description: 'Servicios de almacenamiento en la nube para adjuntos, contratos firmados y propuestas comerciales.',
    techStack: ['Cloudflare R2 / S3', 'Node.js', 'CDN'],
    keyFeatures: ['Gestión documental', 'Firma de contratos', 'Almacenamiento seguro'],
    integrationAction: 'Almacenamiento Cloud disponible',
  },

  // 4. Metadata Schema Engine & Relational Custom Objects
  {
    id: 'repo-metadata-schemas',
    name: 'Metadata Schema Engine',
    repoName: 'clientumlatam/metadata-schemas',
    url: 'https://github.com/clientumlatam',
    category: 'metadata-schemas',
    status: 'ready-to-sync',
    description: 'Esquemas de metadatos dinámicos, GraphQL API y sincronización de objetos personalizados.',
    techStack: ['NestJS', 'GraphQL', 'PostgreSQL', 'TypeORM', 'Prisma'],
    keyFeatures: ['Esquemas de metadatos dinámicos', 'Conectores REST/GraphQL', 'Multi-workspace'],
    integrationAction: 'Conector de metadatos preparado',
  },

  // 5. Public Web & Portals
  {
    id: 'repo-web-public',
    name: 'Clientum Web Public',
    repoName: 'clientumlatam/clientum-web-public',
    url: 'https://github.com/clientumlatam/clientum-web-public',
    category: 'public-web',
    status: 'integrated',
    description: 'Sitio web comercial y portal de captura de leads con formularios integrados al pipeline del CRM.',
    techStack: ['Astro / Next.js', 'Tailwind CSS', 'Lead Ingestion Webhook'],
    keyFeatures: ['Captura de leads en tiempo real', 'SEO optimizado', 'Formularios interactivos'],
    integrationAction: 'Webhooks de captura listos',
  },
  {
    id: 'repo-website',
    name: 'Clientum Website & Clsite',
    repoName: 'clientumlatam/clientum-website',
    url: 'https://github.com/clientumlatam/clientum-website',
    category: 'public-web',
    status: 'consolidated',
    description: 'Página institucional con presentación de productos y cotizador interactivo.',
    techStack: ['React', 'Vite', 'Tailwind'],
    keyFeatures: ['Brochures digitales', 'Calculadora de ROI', 'Demo interactiva'],
    integrationAction: 'Sincronizado',
  },
  {
    id: 'repo-brochure-editor',
    name: 'Editor de Brochure Clientum',
    repoName: 'clientumlatam/remix-remix-editor-de-brochure-clientumzip22',
    url: 'https://github.com/clientumlatam/remix-remix-editor-de-brochure-clientumzip22',
    category: 'apps',
    status: 'integrated',
    description: 'Editor visual para generar propuestas comerciales, catálogos en PDF y brochures personalizados por cliente.',
    techStack: ['Canvas API', 'React', 'PDF Export', 'Brochure Templates'],
    keyFeatures: ['Exportación a PDF comercial', 'Personalización de marca', 'Plantillas de cotización'],
    integrationAction: 'Editor disponible en herramientas',
  },
  {
    id: 'repo-agentes',
    name: 'Clientum Agentes IA',
    repoName: 'clientumlatam/clientum-agentes',
    url: 'https://github.com/clientumlatam/clientum-agentes',
    category: 'ai-audio',
    status: 'integrated',
    description: 'Agentes inteligentes autónomos para prospección, calificación automática de leads y generación de borradores.',
    techStack: ['Gemini 2.5/3.0', 'LangChain / Antigravity Agent', 'Node.js'],
    keyFeatures: ['Score predictivo de leads', 'Resumen automático de reuniones', 'Respuestas automáticas'],
    integrationAction: 'Asistente IA activo en CRM',
  },
  {
    id: 'repo-shawarman',
    name: 'Shawarman / Koala / Colectivos',
    repoName: 'clientumlatam/Shawarman',
    url: 'https://github.com/clientumlatam/Shawarman',
    category: 'apps',
    status: 'ready-to-sync',
    description: 'Módulos verticales especializados para gestión de delivery, rutas comerciales y distribución territorial.',
    techStack: ['React Native / React', 'Geocoding', 'Route Planning'],
    keyFeatures: ['Geolocalización de clientes', 'Planificación de rutas de venta', 'Logística de entrega'],
    integrationAction: 'Integración vertical disponible',
  },
];

export const EcosystemReposHubTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [syncStatusFilter, setSyncStatusFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos los Repositorios', count: CLIENTUM_REPOSITORIES.length },
    { id: 'core', label: 'Core & ClientumOS', count: CLIENTUM_REPOSITORIES.filter(r => r.category === 'core').length },
    { id: 'ai-audio', label: 'IA & WhatsApp Audio', count: CLIENTUM_REPOSITORIES.filter(r => r.category === 'ai-audio').length },
    { id: 'webmail-comms', label: 'Webmail & Comunicaciones', count: CLIENTUM_REPOSITORIES.filter(r => r.category === 'webmail-comms').length },
    { id: 'metadata-schemas', label: 'Metadatos & Schema Engine', count: CLIENTUM_REPOSITORIES.filter(r => r.category === 'metadata-schemas').length },
    { id: 'public-web', label: 'Portales & Web Pública', count: CLIENTUM_REPOSITORIES.filter(r => r.category === 'public-web').length },
    { id: 'apps', label: 'Brochure & Verticales', count: CLIENTUM_REPOSITORIES.filter(r => r.category === 'apps').length },
  ];

  const filteredRepos = CLIENTUM_REPOSITORIES.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.repoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.techStack.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || repo.category === selectedCategory;
    const matchesStatus = syncStatusFilter === 'all' || repo.status === syncStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: ClientumRepo['status']) => {
    switch (status) {
      case 'consolidated':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Consolidado
          </span>
        );
      case 'integrated':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            <Zap className="w-3 h-3" />
            Módulo Integrado
          </span>
        );
      case 'active-migration':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            <RefreshCw className="w-3 h-3 animate-spin" />
            En Migración
          </span>
        );
      case 'ready-to-sync':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
            <Cloud className="w-3 h-3" />
            Listo para Sincronizar
          </span>
        );
    }
  };

  return (
    <div id="ecosystem-repos-hub" className="space-y-6 max-w-5xl">
      {/* Top Architecture & Roadmap Banner */}
      <div className="bg-gradient-to-r from-[var(--bg-muted)] via-[var(--bg-card)] to-[var(--bg-muted)] border border-[var(--border-strong)] p-5 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold border border-blue-500/30">
                  Clientum Latam Ecosystem
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">32+ Repositorios Mapeados</span>
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                Arquitectura, Migración & Sincronización de Módulos
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-2xl mt-1 leading-relaxed">
                Centro de comando para consolidar todos los módulos del ecosistema <strong className="text-blue-500 dark:text-blue-300 font-semibold">@clientumlatam</strong> en esta plataforma: transcripción de audio WhatsApp, Cloudflare Webmail, esquemas de metadatos dinámicos, automatizaciones y brochure builder.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://github.com/clientumlatam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <span>GitHub @clientumlatam</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Architecture Roadmap Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[var(--border-subtle)]">
            <div className="bg-[var(--bg-muted)]/80 p-3 rounded-xl border border-[var(--border-subtle)]">
              <div className="text-[11px] text-[var(--text-muted)] font-medium">Core CRM & CloudOS</div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4" /> 100% Consolidado
              </div>
            </div>

            <div className="bg-[var(--bg-muted)]/80 p-3 rounded-xl border border-[var(--border-subtle)]">
              <div className="text-[11px] text-[var(--text-muted)] font-medium">WhatsApp Audio & IA</div>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mt-0.5">
                <Mic className="w-4 h-4" /> Audio-to-Text Activo
              </div>
            </div>

            <div className="bg-[var(--bg-muted)]/80 p-3 rounded-xl border border-[var(--border-subtle)]">
              <div className="text-[11px] text-[var(--text-muted)] font-medium">Cloudflare Webmail</div>
              <div className="text-sm font-bold text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-4 h-4" /> Worker Integrado
              </div>
            </div>

            <div className="bg-[var(--bg-muted)]/80 p-3 rounded-xl border border-[var(--border-subtle)]">
              <div className="text-[11px] text-[var(--text-muted)] font-medium">Metadata Schema Engine</div>
              <div className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mt-0.5">
                <Database className="w-4 h-4" /> Metadata Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por módulo, repo o tecnología..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-primary)] pl-9 pr-3 py-2 rounded-xl border border-[var(--border-strong)] focus:outline-hidden focus:border-blue-500 placeholder-[var(--text-muted)]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-[var(--text-muted)] shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Estado:
          </span>
          <select
            value={syncStatusFilter}
            onChange={(e) => setSyncStatusFilter(e.target.value)}
            className="bg-[var(--bg-input)] text-xs text-[var(--text-secondary)] px-3 py-1.5 rounded-xl border border-[var(--border-strong)] focus:outline-hidden focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Todos los Estados</option>
            <option value="consolidated">Consolidados</option>
            <option value="integrated">Módulos Integrados</option>
            <option value="active-migration">En Migración</option>
            <option value="ready-to-sync">Listos para Sincronizar</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border-subtle)]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${ selectedCategory === cat.id ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white font-semibold shadow-2xs' : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)]' }`}
          >
            <span>{cat.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono opacity-80">
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Repositories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] p-4.5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:shadow-lg group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 shrink-0 font-bold text-xs">
                      {repo.category === 'ai-audio' && <Mic className="w-4 h-4" />}
                      {repo.category === 'webmail-comms' && <Mail className="w-4 h-4" />}
                      {repo.category === 'core' && <Layers className="w-4 h-4" />}
                      {repo.category === 'metadata-schemas' && <Database className="w-4 h-4" />}
                      {repo.category === 'public-web' && <Globe className="w-4 h-4" />}
                      {repo.category === 'apps' && <FileCode2 className="w-4 h-4" />}
                      {repo.category === 'migration-arch' && <RefreshCw className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                        {repo.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {repo.repoName}
                      </span>
                    </div>
                  </div>
                </div>

                {getStatusBadge(repo.status)}
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
                {repo.description}
              </p>

              {/* Key Features */}
              <div className="space-y-1 mb-3">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Capacidades Clave</div>
                <div className="flex flex-wrap gap-1.5">
                  {repo.keyFeatures.map((feat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[10px] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1 mb-4">
                {repo.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-[var(--bg-input)] text-[10px] font-mono text-blue-600 dark:text-blue-450 border border-[var(--border-subtle)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {repo.integrationAction}
              </span>

              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:text-blue-650 dark:hover:text-blue-300 text-xs font-semibold transition-colors"
              >
                <span>Ver Código</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredRepos.length === 0 && (
        <div className="text-center py-12 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6">
          <FolderGit2 className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[var(--text-secondary)]">No se encontraron repositorios</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Prueba con otros términos de búsqueda o filtros de estado.</p>
        </div>
      )}
    </div>
  );
};

export default EcosystemReposHubTab;
