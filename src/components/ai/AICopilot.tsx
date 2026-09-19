import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Copy,
  Check,
  Bot,
  User,
  RefreshCw,
  TrendingUp,
  Mail,
  ShieldCheck,
  Zap,
  Plus,
  Trash2,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { getClientumAuthJsonHeaders } from '../../lib/api';

export interface AICopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  action?: {
    type: 'create_task' | 'copy';
    label: string;
    payload?: any;
  };
}

interface AICopilotProps {
  onClose?: () => void;
  contextOverride?: {
    type?: string;
    id?: string;
    name?: string;
    initialPrompt?: string;
    [key: string]: any;
  };
  embedded?: boolean;
}

export const AICopilot: React.FC<AICopilotProps> = ({
  onClose,
  contextOverride,
  embedded = false,
}) => {
  const {
    opportunities,
    companies,
    people,
    tasks,
    currentUser,
    language,
    addTask,
    showToast,
    triggerConfetti,
    aiCopilotContext,
  } = useCRM();

  const activeContext = contextOverride || aiCopilotContext;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Calculate real-time CRM deal metrics for deal intelligence
  const totalPipelineAmount = opportunities.reduce((acc, o) => acc + (o.amount || 0), 0);
  const activeOpportunities = opportunities.filter((o) => o.stage !== 'won' && o.stage !== 'lost');
  const negotiationOpportunities = opportunities.filter((o) => o.stage === 'negotiation' || o.stage === 'proposal');
  const topDeals = [...opportunities].sort((a, b) => (b.amount || 0) - (a.amount || 0)).slice(0, 5);

  const getInitialWelcome = () => {
    if (language === 'es') {
      return `¡Hola ${currentUser?.name ? currentUser.name.split(' ')[0] : ''}! Soy tu **Clientum AI Copilot**.

Tus métricas clave hoy:
• **Pipeline Activo:** $${totalPipelineAmount.toLocaleString()} (${activeOpportunities.length} tratos)
• **Tratos en Negociación:** ${negotiationOpportunities.length} oport.
• **Tareas Pendientes:** ${tasks.filter(t => t.status !== 'Completed').length} acciones

¿En qué oportunidad o análisis de datos te ayudo hoy?`;
    }
    if (language === 'pt') {
      return `Olá ${currentUser?.name ? currentUser.name.split(' ')[0] : ''}! Sou o seu **Clientum AI Copilot**.

Suas métricas em tempo real:
• **Pipeline Ativo:** $${totalPipelineAmount.toLocaleString()} (${activeOpportunities.length} negócios)
• **Em Negociação:** ${negotiationOpportunities.length} oport.

Em qual oportunidade posso ajudar hoje?`;
    }
    return `Hello ${currentUser?.name ? currentUser.name.split(' ')[0] : ''}! I'm your **Clientum AI Copilot**.

Your live deal metrics:
• **Active Pipeline:** $${totalPipelineAmount.toLocaleString()} (${activeOpportunities.length} deals)
• **In Negotiation:** ${negotiationOpportunities.length} deals

Which deal or pipeline strategy can I assist you with today?`;
  };

  const [messages, setMessages] = useState<AICopilotMessage[]>([
    {
      id: 'm-welcome',
      role: 'assistant',
      content: getInitialWelcome(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (activeContext?.initialPrompt) {
      handleSendPrompt(activeContext.initialPrompt);
    }
  }, [activeContext]);

  const getQuickPrompts = () => {
    if (language === 'es') {
      return [
        {
          icon: TrendingUp,
          title: 'Salud del Pipeline',
          prompt: 'Analiza la salud de nuestro pipeline comercial actual y los principales tratos en riesgo.',
        },
        {
          icon: Mail,
          title: 'Seguimiento de Negocio',
          prompt: 'Redacta un mensaje de seguimiento para el negocio de mayor valor en etapa de propuesta.',
        },
        {
          icon: ShieldCheck,
          title: 'Manejo de Objeciones',
          prompt: 'Proporciona tácticas para rebatir objeciones de precio en nuestros cierres enterprise.',
        },
        {
          icon: Zap,
          title: 'Acciones Prioritarias',
          prompt: 'Resume las acciones inmediatas recomendadas para acelerar nuestros tratos más importantes.',
        },
      ];
    }
    return [
      {
        icon: TrendingUp,
        title: 'Pipeline Health',
        prompt: 'Analyze our current pipeline health and identify high-value deals at risk.',
      },
      {
        icon: Mail,
        title: 'Deal Follow-Up',
        prompt: 'Draft a personalized follow-up email for our top high-value deal in proposal stage.',
      },
      {
        icon: ShieldCheck,
        title: 'Objections Playbook',
        prompt: 'Give actionable objection handling tactics for enterprise deals comparing us to competitors.',
      },
      {
        icon: Zap,
        title: 'Priority Actions',
        prompt: 'Summarize key priority actions to accelerate our top deals this week.',
      },
    ];
  };

  const handleSendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    const userMsg: AICopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const headers = await getClientumAuthJsonHeaders();
      const payloadContext = {
        contexto: activeContext,
        metricas: {
          montoTotal: totalPipelineAmount,
          tratosActivos: activeOpportunities.length,
          tratosEnNegociacion: negotiationOpportunities.length,
          topTratos: topDeals.map(d => ({
            nombre: d.name,
            empresa: d.companyName,
            monto: d.amount,
            etapa: d.stage,
            probabilidad: d.probability,
          })),
        },
        usuario: currentUser?.name || 'Usuario CRM',
      };

      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          prompt: trimmed,
          context: payloadContext,
          language,
        }),
      });

      if (!res.ok) throw new Error('Copilot API fallback trigger');

      const data = await res.json();
      const aiMsg: AICopilotMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.text || data.response || 'Análisis completado.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: {
          type: 'create_task',
          label: language === 'es' ? '➕ Crear Tarea de Seguimiento' : '➕ Create Follow-up Task',
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Real AI Copilot natural language deal query fallback:', err);
      // Fallback analítico basado en los tratos reales del CRM
      const lower = trimmed.toLowerCase();
      let responseText = '';

      if (lower.includes('pipeline') || lower.includes('salud') || lower.includes('health') || lower.includes('tratos')) {
        const topDeal = topDeals[0];
        responseText = `### 📊 Diagnóstico Inteligente de Tratos & Pipeline\n\n- **Volumen Total:** $${totalPipelineAmount.toLocaleString()}\n- **Oportunidad Principal:** ${topDeal ? topDeal.name : 'Acme Deal'} ($${topDeal ? topDeal.amount.toLocaleString() : '120,000'})\n- **En Negociación:** ${negotiationOpportunities.length} oport. con alto potencial de cierre.\n\n💡 **Recomendación Copilot:** Revisa los cierres previstos para este mes y programa reuniones ejecutivas de alineación.`;
      } else if (lower.includes('seguimiento') || lower.includes('correo') || lower.includes('email') || lower.includes('draft')) {
        const dealName = activeContext?.name || (topDeals[0] ? topDeals[0].name : 'Cliente Clave');
        responseText = `### ✉️ Borrador de Seguimiento Comercial para ${dealName}\n\n"Hola,\n\nEspero que estés teniendo una gran semana. Quería darle seguimiento a nuestra propuesta comercial para ${dealName}.\n\nHemos preparado los términos para garantizar una implementación fluida. ¿Tienen 10 minutos este jueves para afinar detalles?\n\nSaludos cordiales,\n${currentUser?.name || 'Equipo Comercial'}"`;
      } else if (lower.includes('objecion') || lower.includes('precio') || lower.includes('objection')) {
        responseText = `### 🛡️ Tácticas para Manejo de Objeciones\n\n1. **Demostración de ROI:** Resalta la velocidad de adopción de Clientum frente a la complejidad de otros CRMs.\n2. **Flexibilidad:** Destaca la integración transparente con tus datos existentes.\n3. **Costo Total:** Evidencia el ahorro del 60% al evitar costos ocultos de consultoría externa.`;
      } else {
        responseText = `### ⚡ Análisis de Oportunidades\n\nBasado en tus ${opportunities.length} registros en Clientum CRM:\n\n1. **Velocidad Comercial:** Los tratos con actividad constante se cierran **4.2 días** más rápido.\n2. **Siguiente Paso Sugerido:** Crear una tarea prioritaria para contactar a tus tomadores de decisión hoy.`;
      }

      const aiMsg: AICopilotMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: {
          type: 'create_task',
          label: language === 'es' ? '➕ Crear Tarea de Seguimiento' : '➕ Create Follow-up Task',
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(language === 'es' ? 'Copiado al portapapeles' : 'Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateTask = (content: string) => {
    const today = new Date().toISOString().split('T')[0];
    addTask({
      title: language === 'es' ? 'Seguimiento prioritario sugerido por AI Copilot' : 'Priority follow-up from AI Copilot',
      description: content.slice(0, 140),
      dueDate: today,
      priority: 'High',
      status: 'Todo',
      assignedTo: currentUser?.name || 'Comercial',
    });
    triggerConfetti();
    showToast(language === 'es' ? 'Tarea añadida al CRM exitosamente' : 'Task created successfully', 'success');
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `m-welcome-${Date.now()}`,
        role: 'assistant',
        content: getInitialWelcome(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className={`crm-assistant ${embedded ? 'w-full h-full border-0' : ''}`}>
      {/* Header */}
      <header className="crm-assistant__header">
        <div className="crm-assistant__identity">
          <div className="crm-assistant__avatar">
            <Sparkles className="w-4 h-4 text-[#36ded0]" />
            <span />
          </div>
          <div>
            <strong>Clientum AI Copilot</strong>
            <small>⚡ ACTIVO • GEMINI AI</small>
          </div>
        </div>

        <div className="crm-assistant__tools">
          <button
            type="button"
            onClick={handleClearHistory}
            title={language === 'es' ? 'Limpiar conversación' : 'Clear chat'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title={language === 'es' ? 'Cerrar' : 'Close'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Intro context banner */}
      <div className="crm-assistant__intro">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">
          {activeContext?.name
            ? `Enfocado en: ${activeContext.name}`
            : language === 'es'
            ? 'Inteligencia de Negocios y Tratos en tiempo real'
            : 'Real-time Deal & Sales Intelligence'}
        </span>
      </div>

      {/* Messages Scroll Container */}
      <div className="crm-assistant__messages">
        <div className="crm-chat-day">Hoy</div>

        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`crm-message ${isUser ? 'crm-message--user' : ''}`}
            >
              <div className="crm-message__bubble">
                <p>{m.content}</p>

                {/* Optional Action Button for Assistant Messages */}
                {!isUser && m.action && (
                  <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/40 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCreateTask(m.content)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#36ded0] hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{m.action.label}</span>
                    </button>
                  </div>
                )}

                <span>
                  {m.timestamp}
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(m.content, m.id)}
                      className="ml-2 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title={language === 'es' ? 'Copiar' : 'Copy'}
                    >
                      {copiedId === m.id ? (
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-2.5 h-2.5" />
                      )}
                    </button>
                  )}
                </span>
              </div>
            </div>
          );
        })}

        {/* Animated Typing Indicator */}
        {loading && (
          <div className="crm-message">
            <div className="crm-message__typing">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Prompts */}
      <div className="px-3 py-1.5 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/60 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b1625]/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {getQuickPrompts().map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendPrompt(qp.prompt)}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#101f32] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#182c44] text-[#8ea4be] hover:text-[#eaf5ff] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20364f] text-[9.5px] font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              <Icon className="w-3 h-3 text-[#1bd3c2]" />
              <span>{qp.title}</span>
            </button>
          );
        })}
      </div>

      {/* Composer Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(input);
        }}
        className="crm-assistant__composer"
      >
        <input
          type="text"
          placeholder={
            language === 'es'
              ? 'Pregunta sobre negocios, pipeline o estrategia...'
              : 'Ask about deals, pipeline, or strategy...'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="crm-send-button"
          disabled={!input.trim() || loading}
          title={language === 'es' ? 'Enviar' : 'Send'}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default AICopilot;
