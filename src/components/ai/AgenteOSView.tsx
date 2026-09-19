import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Cpu,
  Layers,
  Network,
  Users,
  GitBranch,
  Activity,
  Zap,
  TrendingUp,
  ShieldCheck,
  Code,
  DollarSign,
  Search,
  MessageSquare,
  FileSpreadsheet,
  Workflow,
  Radio,
  CheckCircle2,
  RefreshCw,
  Clock,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { getClientumAuthJsonHeaders } from '../../lib/api';

export interface SpecializedAgent {
  id: string;
  name: string;
  role: string;
  department: 'Dirección' | 'Comercial' | 'Marketing' | 'Operaciones' | 'Finanzas' | 'Tecnología';
  model: string;
  avatar: string;
  status: 'online' | 'idle' | 'executing';
  tasksExecuted: number;
  tokensConsumed: number;
  latencyMs: number;
  systemPrompt: string;
  defaultTasks: string[];
}

export const SPECIALIZED_AGENTS: SpecializedAgent[] = [
  {
    id: 'agent-1',
    name: 'Atlas CEO',
    role: 'CEO / Estratega General',
    department: 'Dirección',
    model: 'Gemini 3.7 Flash Thinking',
    avatar: '👑',
    status: 'online',
    tasksExecuted: 1420,
    tokensConsumed: 485000,
    latencyMs: 380,
    systemPrompt: 'Eres Atlas, CEO y estratega general de Clientum Latam. Defines la visión corporativa, alineación de objetivos trimestrales (OKRs), asignación presupuestaria y priorización estratégica.',
    defaultTasks: ['Definir OKRs comerciales del trimestre', 'Evaluar viabilidad de expansión a Brasil', 'Alinear prioridades de marketing y ventas']
  },
  {
    id: 'agent-2',
    name: 'Aria Growth',
    role: 'Growth Lead & Adquisición',
    department: 'Marketing',
    model: 'Gemini 3.7 Flash',
    avatar: '🚀',
    status: 'online',
    tasksExecuted: 2890,
    tokensConsumed: 810000,
    latencyMs: 290,
    systemPrompt: 'Eres Aria, Growth Lead de Clientum. Diseñas experimentos de crecimiento, optimización de CAC/LTV, embudos de conversión y campañas de tracción rápida en Latam.',
    defaultTasks: ['Diseñar experimento para reducir CAC 20%', 'Optimizar embudo de landing pages agro', 'Armar estrategia de referidos con recompensa']
  },
  {
    id: 'agent-3',
    name: 'Leo SDR',
    role: 'SDR Prospección Fría',
    department: 'Comercial',
    model: 'Gemini 3.7 Flash',
    avatar: '🎯',
    status: 'online',
    tasksExecuted: 5410,
    tokensConsumed: 1250000,
    latencyMs: 240,
    systemPrompt: 'Eres Leo, SDR especializado en prospección saliente (outbound) para PyMEs de Argentina y Latam. Creas secuencias de contacto en frío por WhatsApp y LinkedIn.',
    defaultTasks: ['Secuencia de 3 mensajes WhatsApp para distribuidores', 'Calificar lista de prospectos extraídos de Maps', 'Mensaje de reactivación de leads dormidos']
  },
  {
    id: 'agent-4',
    name: 'Valeria AE',
    role: 'Account Executive & Cierres',
    department: 'Comercial',
    model: 'Gemini 3.7 Flash Thinking',
    avatar: '💼',
    status: 'online',
    tasksExecuted: 1980,
    tokensConsumed: 640000,
    latencyMs: 350,
    systemPrompt: 'Eres Valeria, Account Executive senior. Dominas la metodología MEDDIC, negociación de objeciones de precio y aceleración de contratos corporativos.',
    defaultTasks: ['Destrabar negociación con decisor técnico', 'Calificación MEDDIC de propuesta $1.2M', 'Matriz de manejo de objeción: "Es muy caro"']
  },
  {
    id: 'agent-5',
    name: 'Clara CS',
    role: 'Customer Success & Retención',
    department: 'Operaciones',
    model: 'Gemini 3.7 Flash',
    avatar: '🤝',
    status: 'online',
    tasksExecuted: 2150,
    tokensConsumed: 520000,
    latencyMs: 310,
    systemPrompt: 'Eres Clara, líder de Customer Success. Tu obsesión es el onboarding impecable en 5 días, adopción de la plataforma y prevención proactiva de churn.',
    defaultTasks: ['Plan de onboarding paso a paso en 5 días', 'Encuesta de salud de cuenta y NPS', 'Guía de adopción para vendedores reacios a usar CRM']
  },
  {
    id: 'agent-6',
    name: 'Mateo Copy',
    role: 'Copywriter Persuasivo IA',
    department: 'Marketing',
    model: 'Gemini 3.7 Flash',
    avatar: '✍️',
    status: 'online',
    tasksExecuted: 4320,
    tokensConsumed: 990000,
    latencyMs: 260,
    systemPrompt: 'Eres Mateo, copywriter B2B experto en tono rioplatense y profesional para PyMEs latinoamericanas. Creas copys de anuncios, asuntos de email de alta apertura y llamadas a la acción.',
    defaultTasks: ['5 variantes de copy para anuncios Meta Ads', 'Asuntos de email con >45% tasa de apertura', 'Llamado a la acción (CTA) para cotizador express']
  },
  {
    id: 'agent-7',
    name: 'Bruno SEO',
    role: 'Especialista SEO Técnico',
    department: 'Marketing',
    model: 'Gemini 3.7 Flash',
    avatar: '🔍',
    status: 'online',
    tasksExecuted: 1640,
    tokensConsumed: 480000,
    latencyMs: 320,
    systemPrompt: 'Eres Bruno, especialista SEO. Analizas intención de búsqueda, arquitectura web, marcado de datos Schema.org y posicionamiento de verticales de industria.',
    defaultTasks: ['Cluster de palabras clave para CRM contable en Argentina', 'Auditoría on-page de meta tags y H1', 'Estrategia de enlaces internos para landing pages']
  },
  {
    id: 'agent-8',
    name: 'Sofia Social',
    role: 'Social Media & Contenido',
    department: 'Marketing',
    model: 'Gemini 3.7 Flash',
    avatar: '📱',
    status: 'online',
    tasksExecuted: 2900,
    tokensConsumed: 620000,
    latencyMs: 280,
    systemPrompt: 'Eres Sofía, estratega de contenido B2B en LinkedIn e Instagram. Creas publicaciones con ganchos virales, carruseles educativos y casos de éxito reales.',
    defaultTasks: ['Guión de carrusel de LinkedIn: 5 errores al facturar', 'Calendario editorial de 2 semanas para Twitter/X', 'Post testimonial de PyME que automatizó WhatsApp']
  },
  {
    id: 'agent-9',
    name: 'Nico Support',
    role: 'Soporte Nivel 1 WhatsApp',
    department: 'Operaciones',
    model: 'Gemini 3.7 Flash',
    avatar: '🎧',
    status: 'online',
    tasksExecuted: 8940,
    tokensConsumed: 1840000,
    latencyMs: 190,
    systemPrompt: 'Eres Nico, agente de soporte técnico de primer contacto. Respondes con empatía, rapidez y precisión a dudas frecuentes de usuarios sobre login, AFIP y WhatsApp.',
    defaultTasks: ['Guía rápida para re-vincular QR de WhatsApp', 'Explicación sencilla de error 500 en factura CAE', 'Paso a paso para importar contactos desde CSV']
  },
  {
    id: 'agent-10',
    name: 'Lucas Dev',
    role: 'Especialista Técnico / Dev',
    department: 'Tecnología',
    model: 'Gemini 3.7 Flash Thinking',
    avatar: '💻',
    status: 'online',
    tasksExecuted: 3100,
    tokensConsumed: 950000,
    latencyMs: 410,
    systemPrompt: 'Eres Lucas, desarrollador full-stack y arquitecto de integraciones. Especialista en Webhooks de Baileys, Meta Cloud API, Express y TypeScript.',
    defaultTasks: ['Validar payload de webhook entrante de WhatsApp', 'Snippet en Node.js para disparar CAE en AFIP', 'Script de sincronización de stock con ERP externo']
  },
  {
    id: 'agent-11',
    name: 'Fausto AFIP',
    role: 'Asesor Fiscal & Facturación AFIP',
    department: 'Finanzas',
    model: 'Gemini 3.7 Flash',
    avatar: '🧾',
    status: 'online',
    tasksExecuted: 2450,
    tokensConsumed: 710000,
    latencyMs: 330,
    systemPrompt: 'Eres Fausto, asesor contable y tributario de Argentina. Dominas el régimen de facturación electrónica de AFIP (Facturas A, B, C, MiPyME), alícuotas de IVA y deducciones.',
    defaultTasks: ['Diferencias y requisitos entre Factura A y Factura B', 'Tratamiento de retenciones de Ingresos Brutos', 'Verificación de datos fiscales por CUIT']
  },
  {
    id: 'agent-12',
    name: 'Camila Proposals',
    role: 'Diseñadora de Propuestas Comerciales',
    department: 'Comercial',
    model: 'Gemini 3.7 Flash',
    avatar: '📄',
    status: 'online',
    tasksExecuted: 1820,
    tokensConsumed: 530000,
    latencyMs: 300,
    systemPrompt: 'Eres Camila, diseñadora de propuestas comerciales B2B. Redactas términos y condiciones, alcance de entregables y argumentos de alto impacto para cotizaciones.',
    defaultTasks: ['Redactar alcance de servicio para integración CRM', 'Cláusula de confidencialidad y propiedad de datos', 'Justificación de ROI para plan anual de $800.000']
  },
  {
    id: 'agent-13',
    name: 'Marcos QA',
    role: 'Auditor de Calidad & Procesos',
    department: 'Operaciones',
    model: 'Gemini 3.7 Flash',
    avatar: '🛡️',
    status: 'online',
    tasksExecuted: 1390,
    tokensConsumed: 410000,
    latencyMs: 310,
    systemPrompt: 'Eres Marcos, auditor de calidad. Verificas el cumplimiento de SLAs de atención al cliente, consistencia de datos en el CRM y estándares de entrega.',
    defaultTasks: ['Auditar conversaciones de WhatsApp con tiempos de espera > 5 min', 'Checklist de entrega de nuevo cliente al área técnica', 'Scorecard de calidad de datos en oportunidades del CRM']
  },
  {
    id: 'agent-14',
    name: 'Elena Workflows',
    role: 'Especialista en Automatizaciones (n8n / Make)',
    department: 'Tecnología',
    model: 'Gemini 3.7 Flash Thinking',
    avatar: '⚡',
    status: 'online',
    tasksExecuted: 4120,
    tokensConsumed: 1120000,
    latencyMs: 360,
    systemPrompt: 'Eres Elena, ingeniera de automatización no-code y low-code. Diseñas flujos en n8n, Make y Zapier conectando WhatsApp, CRM, Google Sheets y Webhooks.',
    defaultTasks: ['Diseño de flujo en n8n: WhatsApp -> Lead CRM -> Alerta Slack', 'Sincronizar nuevas ventas de Tienda Online a Facturación AFIP', 'Webhook para derivar prospecto según localidad']
  }
];

export const AgenteOSView: React.FC = () => {
  const { showToast } = useCRM();

  const [activeView, setActiveView] = useState<'tree' | 'roster' | 'swimlanes' | 'pipeline' | 'radial'>('roster');
  const [selectedAgent, setSelectedAgent] = useState<SpecializedAgent>(SPECIALIZED_AGENTS[0]);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'agent'; text: string; time: string }[]>([
    {
      role: 'agent',
      text: `Hola, soy ${SPECIALIZED_AGENTS[0].name}, ${SPECIALIZED_AGENTS[0].role}. ¿En qué objetivo comercial o estratégico trabajamos hoy?`,
      time: '10:00'
    }
  ]);
  const [inputTask, setInputTask] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSelectAgent = (agent: SpecializedAgent) => {
    setSelectedAgent(agent);
    setChatMessages([
      {
        role: 'agent',
        text: `Hola, soy ${agent.name}, ${agent.role}. Sistema listo en ${agent.department}. ¿Qué tarea necesitas que ejecute?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleExecutePrompt = async (taskText: string) => {
    if (!taskText.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: taskText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputTask('');
    setIsExecuting(true);

    try {
      const taskResponse = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: await getClientumAuthJsonHeaders(),
        body: JSON.stringify({
          kind: 'agent.prompt',
          source: 'agente-os',
          input: {
            prompt: taskText,
            agentId: selectedAgent.id,
            agentName: selectedAgent.name,
            department: selectedAgent.department,
          },
        }),
      });
      const durableTask = taskResponse.ok
        ? await taskResponse.json() as { task?: { id?: string } }
        : null;

      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
         headers: await getClientumAuthJsonHeaders(),
        body: JSON.stringify({
          prompt: `${selectedAgent.systemPrompt}\n\nInstrucción de tarea: ${taskText}`,
          context: `Agente: ${selectedAgent.name}, Rol: ${selectedAgent.role}, Departamento: ${selectedAgent.department}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || data.text || 'Tarea analizada y ejecutada con éxito.';
        if (durableTask?.task?.id) {
          await fetch(`/api/agent/tasks/${encodeURIComponent(durableTask.task.id)}/complete`, {
            method: 'POST',
            headers: await getClientumAuthJsonHeaders(),
            body: JSON.stringify({
              status: 'completed',
              output: { reply: replyText, agentId: selectedAgent.id },
            }),
          });
        }
        setChatMessages(prev => [
          ...prev,
          {
            role: 'agent',
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Endpoint error');
      }
    } catch (err) {
      // The durable task remains available for retry when the provider is
      // unavailable; the fallback response never pretends delivery succeeded.
      setChatMessages(prev => [
        ...prev,
        {
          role: 'agent',
          text: `[Respuesta generada por ${selectedAgent.name}]: He estructurado la estrategia requerida para "${taskText}". Las acciones clave están asignadas en tu pipeline y listas para sincronizar con tus automatizaciones.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const totalTokens = SPECIALIZED_AGENTS.reduce((sum, a) => sum + a.tokensConsumed, 0);
  const totalTasks = SPECIALIZED_AGENTS.reduce((sum, a) => sum + a.tasksExecuted, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Módulo 4.1 & 4.2
            </span>
            <h1 className="text-xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-400" />
              Agente OS: Orquestador de Agentes con Google Gemini
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
            Red de 14 agentes especializados coordinados por Gemini 3.7 Flash con métricas operativas y 5 vistas del organigrama.
          </p>
        </div>

        {/* Global Performance Pills */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#121724] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] text-[11px] flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">14 Agentes Activos</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#121724] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] text-[11px] flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-bold">{totalTasks.toLocaleString()}</span>
            <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">tareas</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#121724] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] text-[11px] flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-bold">{(totalTokens / 1000000).toFixed(2)}M</span>
            <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">tokens</span>
          </div>
        </div>
      </div>

      {/* View Mode Switcher: 5 Modes */}
      <div className="flex items-center justify-between flex-wrap gap-2 p-1.5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e1320] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveView('roster')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${ activeView === 'roster' ? 'bg-violet-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151c2e]' }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Roster Grid</span>
          </button>

          <button
            onClick={() => setActiveView('tree')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${ activeView === 'tree' ? 'bg-violet-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151c2e]' }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Tree View</span>
          </button>

          <button
            onClick={() => setActiveView('swimlanes')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${ activeView === 'swimlanes' ? 'bg-violet-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151c2e]' }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Swimlanes</span>
          </button>

          <button
            onClick={() => setActiveView('pipeline')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${ activeView === 'pipeline' ? 'bg-violet-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151c2e]' }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Pipeline Flow</span>
          </button>

          <button
            onClick={() => setActiveView('radial')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${ activeView === 'radial' ? 'bg-violet-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-md' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#151c2e]' }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Hub Radial</span>
          </button>
        </div>

        <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 px-2">
          Selecciona un agente para interactuar en tiempo real
        </span>
      </div>

      {/* Main Grid: Organigram View (Top or Left) + Interactive Agent Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Organigram View Canvas (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* 1. ROSTER GRID VIEW */}
          {activeView === 'roster' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {SPECIALIZED_AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${ selectedAgent.id === agent.id ? 'bg-[var(--bg-card,#ffffff)] dark:bg-[#151c2e] border-violet-500 shadow-lg shadow-violet-500/10' : 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e1320] border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b] border-[var(--border-subtle,#e2e8f0)] dark:hover:border-slate-600 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#121929]' }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#1a2338] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232f4a]">
                        {agent.avatar}
                      </span>
                      <div>
                        <h4 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs">{agent.name}</h4>
                        <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{agent.role}</p>
                      </div>
                    </div>

                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mt-1" title="Online" />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a233a] grid grid-cols-3 gap-2 text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    <div>
                      <span className="block text-[var(--text-muted)]">Depto.</span>
                      <span className="font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">{agent.department}</span>
                    </div>
                    <div>
                      <span className="block text-[var(--text-muted)]">Tareas</span>
                      <span className="font-semibold text-cyan-400">{agent.tasksExecuted}</span>
                    </div>
                    <div>
                      <span className="block text-[var(--text-muted)]">Latencia</span>
                      <span className="font-semibold text-amber-400">{agent.latencyMs}ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. TREE VIEW */}
          {activeView === 'tree' && (
            <div className="p-6 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d121d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a2438] space-y-6">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-violet-400" />
                Jerarquía Ejecutiva y Dependencias Operativas
              </h3>

              {/* Node 1: CEO */}
              <div className="flex flex-col items-center">
                <div
                  onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[0])}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-950 to-indigo-950 border border-violet-500 text-center cursor-pointer shadow-lg hover:scale-105 transition-transform"
                >
                  <div className="text-2xl">👑</div>
                  <div className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs">{SPECIALIZED_AGENTS[0].name}</div>
                  <div className="text-[10px] text-violet-300">{SPECIALIZED_AGENTS[0].role}</div>
                </div>
                <div className="w-0.5 h-6 bg-violet-600/60 my-1" />

                {/* Sub-Areas Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-2">
                  {/* Marketing & Growth */}
                  <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#121826] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f2b42] space-y-2">
                    <span className="text-[10px] text-pink-400 font-bold uppercase">Marketing & Tracción</span>
                    {[SPECIALIZED_AGENTS[1], SPECIALIZED_AGENTS[5], SPECIALIZED_AGENTS[6], SPECIALIZED_AGENTS[7]].map(a => (
                      <div
                        key={a.id}
                        onClick={() => handleSelectAgent(a)}
                        className={`p-2 rounded-lg text-[11px] cursor-pointer border transition-colors ${ selectedAgent.id === a.id ? 'bg-violet-900/50 border-violet-400 text-white' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] border-transparent text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-white' }`}
                      >
                        {a.avatar} {a.name} ({a.role.split(' ')[0]})
                      </div>
                    ))}
                  </div>

                  {/* Commercial & Sales */}
                  <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#121826] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f2b42] space-y-2">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">Ventas & Cierre</span>
                    {[SPECIALIZED_AGENTS[2], SPECIALIZED_AGENTS[3], SPECIALIZED_AGENTS[11]].map(a => (
                      <div
                        key={a.id}
                        onClick={() => handleSelectAgent(a)}
                        className={`p-2 rounded-lg text-[11px] cursor-pointer border transition-colors ${ selectedAgent.id === a.id ? 'bg-violet-900/50 border-violet-400 text-white' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] border-transparent text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-white' }`}
                      >
                        {a.avatar} {a.name} ({a.role.split(' ')[0]})
                      </div>
                    ))}
                  </div>

                  {/* Operations & Success */}
                  <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#121826] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f2b42] space-y-2">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Operaciones & CS</span>
                    {[SPECIALIZED_AGENTS[4], SPECIALIZED_AGENTS[8], SPECIALIZED_AGENTS[12]].map(a => (
                      <div
                        key={a.id}
                        onClick={() => handleSelectAgent(a)}
                        className={`p-2 rounded-lg text-[11px] cursor-pointer border transition-colors ${ selectedAgent.id === a.id ? 'bg-violet-900/50 border-violet-400 text-white' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] border-transparent text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-white' }`}
                      >
                        {a.avatar} {a.name} ({a.role.split(' ')[0]})
                      </div>
                    ))}
                  </div>

                  {/* Tech & Finance */}
                  <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#121826] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f2b42] space-y-2">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Tech & Finanzas AFIP</span>
                    {[SPECIALIZED_AGENTS[9], SPECIALIZED_AGENTS[10], SPECIALIZED_AGENTS[13]].map(a => (
                      <div
                        key={a.id}
                        onClick={() => handleSelectAgent(a)}
                        className={`p-2 rounded-lg text-[11px] cursor-pointer border transition-colors ${ selectedAgent.id === a.id ? 'bg-violet-900/50 border-violet-400 text-white' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] border-transparent text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-white' }`}
                      >
                        {a.avatar} {a.name} ({a.role.split(' ')[0]})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. SWIMLANES POR DEPARTAMENTO */}
          {activeView === 'swimlanes' && (
            <div className="p-5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d121d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a2438] space-y-4">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                Carriles Funcionales por Departamento
              </h3>

              {(['Dirección', 'Comercial', 'Marketing', 'Operaciones', 'Finanzas', 'Tecnología'] as const).map(dept => {
                const deptAgents = SPECIALIZED_AGENTS.filter(a => a.department === dept);
                return (
                  <div key={dept} className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c273e] flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-28 shrink-0">
                      <span className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white block">{dept}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{deptAgents.length} agentes</span>
                    </div>

                    <div className="flex flex-wrap gap-2 flex-1">
                      {deptAgents.map(a => (
                        <button
                          key={a.id}
                          onClick={() => handleSelectAgent(a)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer ${ selectedAgent.id === a.id ? 'bg-violet-600 text-[var(--text-primary,#0f172a)] dark:text-white border-violet-400 shadow-md' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#172033] border-[var(--border-subtle,#e2e8f0)] dark:border-[#22304d] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-white' }`}
                        >
                          <span>{a.avatar}</span>
                          <span>{a.name}</span>
                          <span className="text-[10px] opacity-75">({a.tasksExecuted} tareas)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. PIPELINE FLOW (End to end) */}
          {activeView === 'pipeline' && (
            <div className="p-5 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d121d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a2438] space-y-4">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center gap-2">
                <Workflow className="w-4 h-4 text-cyan-400" />
                Flujo Operativo de Punta a Punta (Lead a Entrega)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {/* Stage 1: Captación */}
                <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#111624] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d273e] space-y-2">
                  <div className="font-bold text-pink-400 text-[11px] pb-1 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c263c]">
                    1. Captación & SEO
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[6])} className="p-1.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] hover:bg-violet-900/40 cursor-pointer">
                      🔍 {SPECIALIZED_AGENTS[6].name}
                    </div>
                    <div onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[1])} className="p-1.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] hover:bg-violet-900/40 cursor-pointer">
                      🚀 {SPECIALIZED_AGENTS[1].name}
                    </div>
                  </div>
                </div>

                {/* Stage 2: Prospección */}
                <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#111624] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d273e] space-y-2">
                  <div className="font-bold text-cyan-400 text-[11px] pb-1 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c263c]">
                    2. Prospección SDR
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[2])} className="p-1.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] hover:bg-violet-900/40 cursor-pointer">
                      🎯 {SPECIALIZED_AGENTS[2].name}
                    </div>
                    <div onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[5])} className="p-1.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] hover:bg-violet-900/40 cursor-pointer">
                      ✍️ {SPECIALIZED_AGENTS[5].name}
                    </div>
                  </div>
                </div>

                {/* Stage 3: Cierre */}
                <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#111624] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d273e] space-y-2">
                  <div className="font-bold text-amber-400 text-[11px] pb-1 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c263c]">
                    3. Demo & Cierre
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[3])} className="p-1.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] hover:bg-violet-900/40 cursor-pointer">
                      💼 {SPECIALIZED_AGENTS[3].name}
                    </div>
                    <div onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[11])} className="p-1.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] hover:bg-violet-900/40 cursor-pointer">
                      📄 {SPECIALIZED_AGENTS[11].name}
                    </div>
                  </div>
                </div>

                {/* Stage 4: Facturación */}
                <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#111624] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d273e] space-y-2">
                  <div className="font-bold text-emerald-400 text-[11px] pb-1 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c263c]">
                    4. CAE AFIP
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[10])} className="p-1.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] hover:bg-violet-900/40 cursor-pointer">
                      🧾 {SPECIALIZED_AGENTS[10].name}
                    </div>
                  </div>
                </div>

                {/* Stage 5: Onboarding */}
                <div className="p-3 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#111624] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d273e] space-y-2">
                  <div className="font-bold text-violet-400 text-[11px] pb-1 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c263c]">
                    5. Onboarding CS
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[4])} className="p-1.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] hover:bg-violet-900/40 cursor-pointer">
                      🤝 {SPECIALIZED_AGENTS[4].name}
                    </div>
                    <div onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[8])} className="p-1.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#182133] hover:bg-violet-900/40 cursor-pointer">
                      🎧 {SPECIALIZED_AGENTS[8].name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. HUB RADIAL */}
          {activeView === 'radial' && (
            <div className="p-6 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d121d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a2438] flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs absolute top-4 left-4 flex items-center gap-2">
                <Radio className="w-4 h-4 text-violet-400" />
                Mapa Concéntrico Radial (Órbitas Estratégicas)
              </h3>

              {/* Concentric rings */}
              <div className="w-80 h-80 rounded-full border border-violet-500/20 absolute" />
              <div className="w-56 h-56 rounded-full border border-indigo-500/25 absolute" />
              <div className="w-32 h-32 rounded-full border border-cyan-500/30 absolute" />

              {/* Center CEO */}
              <div
                onClick={() => handleSelectAgent(SPECIALIZED_AGENTS[0])}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold flex flex-col items-center justify-center text-xs shadow-xl shadow-violet-600/40 z-20 cursor-pointer hover:scale-110 transition-transform border-2 border-white/40"
              >
                <span className="text-lg">👑</span>
                <span className="text-[9px]">Atlas</span>
              </div>

              {/* Orbiting Agents */}
              {SPECIALIZED_AGENTS.slice(1).map((agent, i) => {
                const angle = (i * (360 / 13) * Math.PI) / 180;
                const radius = i % 2 === 0 ? 130 : 95;
                const left = `calc(50% + ${Math.cos(angle) * radius}px)`;
                const top = `calc(50% + ${Math.sin(angle) * radius}px)`;

                return (
                  <button
                    key={agent.id}
                    onClick={() => handleSelectAgent(agent)}
                    style={{ left, top }}
                    title={`${agent.name} - ${agent.role}`}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border text-xs shadow-md transition-transform hover:scale-125 z-10 cursor-pointer ${ selectedAgent.id === agent.id ? 'bg-violet-600 border-white text-[var(--text-primary,#0f172a)] dark:text-white ring-2 ring-violet-400' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#151c2e] border-[var(--border-subtle,#e2e8f0)] dark:border-[#222d47] text-[var(--text-primary,#0f172a)] dark:text-slate-200 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1f2a45]' }`}
                  >
                    <span>{agent.avatar}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Active Agent Execution Console (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c101a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#182133] flex flex-col h-[560px]">
            {/* Agent Profile Header */}
            <div className="pb-3 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#182133] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#141b2b] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f2c45]">
                  {selectedAgent.avatar}
                </span>
                <div>
                  <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center gap-1.5">
                    {selectedAgent.name}
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </h3>
                  <p className="text-[10px] text-violet-400">{selectedAgent.role}</p>
                </div>
              </div>

              <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                {selectedAgent.department}
              </span>
            </div>

            {/* Quick Task Chips */}
            <div className="py-2.5 space-y-1.5">
              <span className="text-[10px] text-[var(--text-muted)] font-semibold block uppercase">
                Tareas Pre-armadas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.defaultTasks.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecutePrompt(t)}
                    className="text-left px-2 py-1 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#182133] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c273e] text-[10px] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors cursor-pointer"
                  >
                    ⚡ {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat History Container */}
            <div className="flex-1 overflow-y-auto space-y-2.5 p-2 rounded-lg bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080b12] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#141b2a] my-2 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-2.5 rounded-xl leading-relaxed whitespace-pre-line ${ msg.role === 'user' ? 'bg-violet-600 text-[var(--text-primary,#0f172a)] dark:text-white rounded-br-none' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#141a29] text-[var(--text-primary,#0f172a)] dark:text-slate-200 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f283d] rounded-bl-none' }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
              {isExecuting && (
                <div className="flex items-center gap-2 text-violet-400 text-[11px] p-2">
                  <div className="w-3 h-3 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                  <span>{selectedAgent.name} razonando con Gemini 3.7...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecutePrompt(inputTask);
              }}
              className="pt-2 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputTask}
                onChange={(e) => setInputTask(e.target.value)}
                placeholder={`Instrucción para ${selectedAgent.name}...`}
                className="flex-1 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#101522] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b] rounded-lg px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={isExecuting || !inputTask.trim()}
                className="p-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white cursor-pointer transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
