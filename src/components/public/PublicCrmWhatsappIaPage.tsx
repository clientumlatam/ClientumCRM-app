import React, { useState } from 'react';
import {
  MessageSquare,
  Bot,
  Sparkles,
  Kanban,
  Users,
  FileSpreadsheet,
  Send,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Clock,
  ChevronRight,
  Smartphone,
  Play
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { useCRM } from '../../context/CRMContext';

interface PublicCrmWhatsappIaPageProps {
  onNavigate: (path: PublicRoutePath) => void;
  onOpenSimulator: () => void;
  onOpenWizard: () => void;
}

export const PublicCrmWhatsappIaPage: React.FC<PublicCrmWhatsappIaPageProps> = ({
  onNavigate,
  onOpenSimulator,
  onOpenWizard
}) => {
  const { enterApp } = useCRM();

  // Quick inline chat simulator state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: '¡Hola! Bienvenido a Clientum. ¿En qué podemos ayudarte hoy? (Podés consultar por precios, facturación AFIP o pedir una demo).',
      time: '11:00'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    '¿Qué precio tiene el CRM?',
    '¿Cómo funciona la facturación AFIP?',
    '¿Puedo conectar varios vendedores?',
    'Quiero una demo personalizada'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const newMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'Con gusto te asesoramos. El CRM de Clientum centraliza tus chats de WhatsApp, automatiza presupuestos y sincroniza con facturación AFIP en tiempo real.';
      const lower = query.toLowerCase();

      if (lower.includes('precio') || lower.includes('plan') || lower.includes('costo')) {
        reply = 'Nuestros planes arrancan desde $29 USD/mes ($32.000 ARS/mes) para Starter, $79 USD/mes para Professional y $199 USD/mes para Enterprise sin límites.';
      } else if (lower.includes('afip') || lower.includes('cae') || lower.includes('factura')) {
        reply = 'Clientum se conecta nativamente al webservice WSFE de AFIP. Emitís Facturas A, B, C y notas de crédito en 1 clic con CAE oficial y código QR.';
      } else if (lower.includes('vendedor') || lower.includes('multiagente') || lower.includes('agente')) {
        reply = '¡Exacto! Varios asesores atienden desde una misma línea de WhatsApp, asignando chats por cola, turno o departamento, con auditoría total del historial.';
      } else if (lower.includes('demo')) {
        reply = '¡Excelente! Podés ingresar ya mismo a nuestra demo interactiva en vivo o dejarnos tu contacto para una sesión guiada con un especialista comercial.';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans bg-white text-slate-900">
      
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Solución Comercial Integrada WhatsApp + CRM + AFIP</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          CRM, WhatsApp e Inteligencia Artificial para PyMEs
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Atención comercial inmediata 24/7 con IA oficial, sincronizada en tiempo real con tu pipeline Kanban de ventas, base de contactos y facturación electrónica AFIP.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenSimulator}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Abrir Simulador WhatsApp en Pantalla Completa</span>
          </button>
          <button
            onClick={() => enterApp()}
            className="px-6 py-3 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 hover:bg-[#eef1f6] hover:dark:bg-[#eef1f6] hover:dark:bg-slate-800 text-[#0f172a] dark:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <span>Ver Demo del CRM en Vivo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Embedded Live Simulator Box */}
      <section className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900">Simulador de Chat en Tiempo Real</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Experimentá cómo atiende el bot inteligente a un cliente potencial.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Motor Gemini 3.7 Flash + Baileys
          </span>
        </div>

        {/* Chat Window */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 h-80 overflow-y-auto space-y-3 flex flex-col justify-between shadow-2xs">
          <div className="space-y-3 overflow-y-auto pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-blue-200' : 'text-[#64748b] dark:text-slate-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-2xl rounded-bl-none text-xs text-slate-500 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-150" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-300" />
                </div>
              </div>
            )}
          </div>

          {/* Quick prompt buttons */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qp)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribí una pregunta (ej. ¿Cómo se emite la factura AFIP?)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </form>
      </section>

      {/* 4 Key Pillars of Integration */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            El Circuito Comercial Completo en 4 Fases
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Desde el primer mensaje de WhatsApp hasta la emisión de la factura oficial AFIP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 w-fit">
              <Bot className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-emerald-700">Fase 1</div>
            <h3 className="text-base font-bold text-slate-900">Atención WhatsApp IA 24/7</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              El bot atiende en menos de 10 segundos, responde dudas frecuentes, califica el perfil del prospecto y recopila datos clave para el equipo.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-800 w-fit">
              <Kanban className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-blue-700">Fase 2</div>
            <h3 className="text-base font-bold text-slate-900">Pipeline Kanban Automático</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cada lead calificado crea automáticamente una oportunidad en el CRM con cálculo de probabilidad, responsable asignado y fecha prevista de cierre.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-800 w-fit">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-purple-700">Fase 3</div>
            <h3 className="text-base font-bold text-slate-900">Bandeja Multiagente Unificada</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tus asesores comerciales toman la conversación sin que el cliente note el cambio de canal, con historial compartido y notas internas.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-800 w-fit">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-amber-700">Fase 4</div>
            <h3 className="text-base font-bold text-slate-900">Facturación AFIP con CAE</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Al ganar la oportunidad, generás la Factura A, B o C en 1 clic. Se envía el PDF y enlace de comprobante directo al chat del comprador.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 text-[#0f172a] dark:text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Comenzá a Automatizar tus Ventas por WhatsApp Hoy Mismo
        </h2>
        <p className="text-xs sm:text-sm text-[#0f172a] dark:text-white dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Probá nuestra demo interactiva completa, simulá tus flujos comerciales o cotizá la implementación para tu empresa en 2 minutos.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenWizard}
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Cotizar Plan a Medida</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/contacto')}
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#0f172a] dark:text-white font-bold text-xs transition-all cursor-pointer"
          >
            Hablar con un Asesor
          </button>
        </div>
      </section>

    </div>
  );
};
