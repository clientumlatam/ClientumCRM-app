import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Send,
  Bot,
  Phone,
  CheckCircle2,
  ArrowRight,
  Zap,
  ShieldCheck,
  Minimize2,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';

interface PublicFloatingChatbotProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenSimulator: () => void;
  onOpenWizard: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  options?: { label: string; action: string }[];
  isForm?: boolean;
}

export const PublicFloatingChatbot: React.FC<PublicFloatingChatbotProps> = ({
  onNavigate,
  onOpenSimulator,
  onOpenWizard,
}) => {
  const { enterApp, showToast, triggerConfetti } = useCRM();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Lead capture form state inside chatbot
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola! 👋 Soy **Valeria**, tu especialista comercial en Clientum CRM.\n\n¿En qué puedo ayudarte a potenciar las ventas de tu empresa hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: [
        { label: '🚀 Prueba Gratis de 7 días', action: 'trial' },
        { label: '📱 Demo WhatsApp Multiagente', action: 'whatsapp' },
        { label: '📄 Facturación AFIP CAE', action: 'afip' },
        { label: '💵 Ver Planes y Precios', action: 'pricing' },
        { label: '📅 Solicitar Demostración con Asesor', action: 'demo_form' },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const addBotMessage = (text: string, options?: { label: string; action: string }[], isForm?: boolean) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options,
          isForm,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleOptionClick = (action: string, labelText: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: labelText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Bot response logic
    if (action === 'trial') {
      addBotMessage(
        '✨ **Clientum CRM v6.0** te ofrece 7 días de acceso completo sin necesidad de tarjeta de crédito.\n\nIncluye:\n• CRM 360° Kanban con Scoring de Leads\n• WhatsApp Multiagente para 5 vendedores\n• Emisión de Facturas AFIP A, B, C con CAE\n• Agentes IA y Automatizaciones',
        [
          { label: 'Acceder a la Demo en Vivo', action: 'enter_demo' },
          { label: 'Ver Planes y Precios', action: 'pricing' },
          { label: 'Hablar por WhatsApp Oficial', action: 'wa_redirect' },
        ]
      );
    } else if (action === 'whatsapp') {
      addBotMessage(
        '📱 **Módulo WhatsApp Multiagente + Bot IA 24/7**\n\nConecta tu número de WhatsApp escaneando un código QR (vía protocolo Baileys). Tu equipo podrá responder simultáneamente desde la misma consola CRM y activar un bot que califica prospectos automáticamente.',
        [
          { label: 'Abrir Simulador Interactivo', action: 'open_simulator' },
          { label: 'Solicitar Asesor Comercial', action: 'demo_form' },
        ]
      );
    } else if (action === 'afip') {
      addBotMessage(
        '📄 **Facturación Electrónica AFIP Integrada**\n\nEmití facturas A, B, C y Notas de Crédito con CAE en menos de 2 segundos directamente desde la ficha de tu cliente o la oportunidad del CRM. Cumple con todas las normas de AFIP (WSFE v1).',
        [
          { label: 'Ver Módulo ERP & AFIP', action: 'nav_erp' },
          { label: 'Solicitar Asesor Comercial', action: 'demo_form' },
        ]
      );
    } else if (action === 'pricing') {
      addBotMessage(
        '💵 **Planes adaptados a tu escala**\n\n• **Plan Emprendedor**: ARS $45.000/mes (o USD $45/mes)\n• **Plan PyME Comercial**: ARS $85.000/mes (o USD $85/mes)\n• **Plan Enterprise**: Cotización a medida con SLA 99.99%',
        [
          { label: 'Ir a la página de Precios completa', action: 'nav_pricing' },
          { label: 'Usar Cotizador Interactivo', action: 'open_wizard' },
          { label: 'Solicitar Demostración', action: 'demo_form' },
        ]
      );
    } else if (action === 'demo_form') {
      addBotMessage(
        '📅 **¡Excelente elección!**\n\nPor favor déjanos tus datos de contacto para que un especialista senior de Clientum se comunique contigo en menos de 15 minutos o agende una videollamada:',
        undefined,
        true
      );
    } else if (action === 'enter_demo') {
      enterApp();
      setIsOpen(false);
    } else if (action === 'open_simulator') {
      onOpenSimulator();
      setIsOpen(false);
    } else if (action === 'open_wizard') {
      onOpenWizard();
      setIsOpen(false);
    } else if (action === 'nav_pricing') {
      onNavigate('/precios');
      setIsOpen(false);
    } else if (action === 'nav_erp') {
      onNavigate('/producto/erp');
      setIsOpen(false);
    } else if (action === 'wa_redirect') {
      window.open(
        'https://wa.me/5492984510883?text=Hola%20Clientum%20CRM,%20quisiera%20asesoramiento%20para%20mi%20empresa.',
        '_blank'
      );
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    const lower = query.toLowerCase();

    if (lower.includes('hola') || lower.includes('buenas')) {
      addBotMessage(
        '¡Hola! ¿En qué puedo ayudarte hoy? Puedes consultarme sobre nuestros módulos CRM, WhatsApp IA, Facturación AFIP o Planes.',
        [
          { label: 'Ver Planes y Precios', action: 'pricing' },
          { label: 'Solicitar Demostración', action: 'demo_form' },
        ]
      );
    } else if (lower.includes('afip') || lower.includes('factur')) {
      handleOptionClick('afip', query);
    } else if (lower.includes('precio') || lower.includes('plan') || lower.includes('costo') || lower.includes('cuanto')) {
      handleOptionClick('pricing', query);
    } else if (lower.includes('whatsapp') || lower.includes('bot') || lower.includes('mensaj')) {
      handleOptionClick('whatsapp', query);
    } else if (lower.includes('demo') || lower.includes('asesor') || lower.includes('contacto') || lower.includes('prueba')) {
      handleOptionClick('demo_form', query);
    } else {
      addBotMessage(
        `He recibido tu consulta sobre "${query}". Para darte una respuesta detallada e integrar Clientum en tu empresa, ¿te gustaría coordinar una demostración con un asesor o ingresar a la demo interactiva?`,
        [
          { label: 'Ingresar a la Demo en Vivo', action: 'enter_demo' },
          { label: 'Dejar datos para contacto', action: 'demo_form' },
          { label: 'Chatear por WhatsApp', action: 'wa_redirect' },
        ]
      );
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.phone.trim()) {
      showToast('Por favor completa al menos tu correo y teléfono.', 'warning');
      return;
    }

    setIsSubmittingForm(true);
    try {
      const response = await fetch('/api/public/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || 'Prospecto Web Chatbot',
          email: formData.email,
          phone: formData.phone,
          company: formData.company || 'Empresa No Especificada',
          source: 'Public Web Chatbot Widget',
          notes: 'Interesado registrado desde el asistente flotante en sitio público.',
        }),
      });

      setFormSubmitted(true);
      triggerConfetti();
      showToast('¡Gracias! Un especialista comercial te contactará a la brevedad.', 'success');

      addBotMessage(
        `🎉 **¡Excelente, ${formData.name || 'estimado/a'}!** Hemos registrado tu solicitud correctamente.\n\nNos comunicaremos al teléfono **${formData.phone}** y correo **${formData.email}**.`,
        [
          { label: 'Probar la Demo en Vivo Ahora', action: 'enter_demo' },
          { label: 'Contactar por WhatsApp Directo', action: 'wa_redirect' },
        ]
      );
    } catch (error) {
      showToast('No se pudo enviar el formulario, intenta nuevamente.', 'error');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (typeof document === 'undefined') return null;

  const content = (
    <div id="public-floating-chatbot-portal" className="font-sans">
      {/* FLOATING LAUNCHER BUTTON (Bottom-Right) */}
      {!isOpen && (
        <button
          id="public-chatbot-trigger-btn"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-[9999] group flex items-center gap-3 bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 hover:bg-slate-850 text-[#0f172a] dark:text-white p-3 pl-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-slate-700/80 backdrop-blur-md"
          aria-label="Abrir asistente de ventas en vivo"
        >
          {/* Avatar with live pulse status */}
          <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#0f172a] dark:text-white font-extrabold text-sm">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
          </div>

          <div className="flex flex-col text-left pr-2">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-xs tracking-wide">Asistente Clientum</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-900 uppercase">
                24/7
              </span>
            </div>
            <span className="text-[10px] text-blue-100 font-medium mt-1">¿Dudas o demostración? Chatea aquí</span>
          </div>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* CHATBOT CONTAINER WINDOW */}
      {isOpen && (
        <div
          id="public-chatbot-window"
          className={`fixed bottom-6 right-6 z-[9999] w-[375px] sm:w-[410px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Chat Window Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-4 flex items-center justify-between shrink-0 border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 select-none">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/30 text-white">
                <Bot className="w-5 h-5 text-sky-400" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xs text-[#0f172a] dark:text-white tracking-wide">Valeria | Clientum IA</h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-[#0f172a] dark:text-white dark:text-slate-300 mt-0.5 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  <span>Responde en tiempo real</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#0f172a] dark:text-white dark:text-slate-400">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-[#0f172a] hover:dark:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title={isMinimized ? 'Expandir' : 'Minimizar'}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-[#0f172a] hover:dark:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body & Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none font-medium'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      {/* Markdown rendering basic formatting */}
                      <div className="whitespace-pre-line space-y-1">
                        {msg.text.split('\n\n').map((paragraph, i) => (
                          <p key={i}>
                            {paragraph.split('**').map((part, j) =>
                              j % 2 === 1 ? <strong key={j} className="font-extrabold text-blue-900">{part}</strong> : part
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Lead form inside chatbot if requested */}
                      {msg.isForm && !formSubmitted && (
                        <form onSubmit={handleFormSubmit} className="mt-3 pt-3 border-t border-slate-200 space-y-2 bg-slate-50 p-3 rounded-xl border">
                          <div>
                            <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Nombre y Apellido</label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Ej. Martín Gómez"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">WhatsApp / Celular</label>
                              <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+54 9 11 ..."
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Email Empresa</label>
                              <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="martin@empresa.com"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Empresa / Rubro</label>
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              placeholder="Ej. Distribuidora del Sur SRL"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmittingForm}
                            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs mt-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isSubmittingForm ? 'Enviando...' : 'Confirmar Solicitud de Demo'}</span>
                          </button>
                        </form>
                      )}

                      {/* Quick options chips */}
                      {msg.options && msg.options.length > 0 && (
                        <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-100">
                          {msg.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleOptionClick(opt.action, opt.label)}
                              className="w-full py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs text-left transition-colors border border-blue-200/60 flex items-center justify-between group cursor-pointer"
                            >
                              <span>{opt.label}</span>
                              <ArrowRight className="w-3 h-3 text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-[#0f172a] dark:text-white dark:text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-[#0f172a] dark:text-white dark:text-slate-400 bg-white p-3 rounded-2xl border border-slate-200 w-24">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input & Footer Actions */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe tu consulta aquí..."
                    className="flex-1 px-3.5 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder:text-[#0f172a] placeholder:dark:text-white placeholder:dark:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all cursor-pointer shrink-0 shadow-xs"
                    title="Enviar mensaje"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Direct WhatsApp channel option */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Respuesta comercial directa</span>
                  </span>
                  <a
                    href="https://wa.me/5492984510883?text=Hola%20Clientum%20CRM,%20quisiera%20asesoramiento%20para%20mi%20empresa."
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>WhatsApp Directo</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  return createPortal(content, document.body);
};
