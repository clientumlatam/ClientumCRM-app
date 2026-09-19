import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Calendar,
  DollarSign,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface SimMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const WhatsAppSimulatorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { showToast } = useCRM();

  const [botType, setBotType] = useState<'ventas' | 'soporte' | 'turnos'>('ventas');
  const [messages, setMessages] = useState<SimMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: '¡Hola! 👋 Gracias por comunicarte con Clientum Latam. Soy el asistente comercial inteligente. ¿En qué te puedo asesorar hoy?',
      time: '10:30'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = {
    ventas: [
      '¿Cuáles son los precios de los planes?',
      '¿Cómo se conecta con la facturación de AFIP?',
      '¿Tienen soporte para distribuidoras mayoristas?'
    ],
    soporte: [
      'No puedo vincular el código QR de WhatsApp',
      '¿Dónde descargo el sitemap.xml de mi web?',
      '¿Cómo agrego un nuevo vendedor al CRM?'
    ],
    turnos: [
      'Quiero agendar una demo guiada para mañana',
      '¿Qué horarios tienen disponibles?',
      '¿La demostración tiene costo?'
    ]
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: SimMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Call server Gemini agent or smart simulated fallback
    try {
      const res = await fetch('/api/public-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          role: botType,
          context: 'WhatsApp Sales Bot Latam'
        })
      });

      let botReply = '';
      if (res.ok) {
        const data = await res.json();
        botReply = data.reply;
      }

      if (!botReply) {
        // High quality fallback responses
        if (botType === 'ventas') {
          botReply = '¡Excelente consulta! Nuestros planes comerciales inician en $15.000 ARS por usuario mensual en moneda local, con módulo de WhatsApp y facturación AFIP con CAE incluidos. ¿Te gustaría coordinar una demo de 15 minutos?';
        } else if (botType === 'soporte') {
          botReply = 'Para reconectar el Gateway Baileys: ve a Configuración > Conexión WhatsApp, presiona "Desvincular" y vuelve a escanear con la cámara de WhatsApp en tu celular. El proceso toma menos de 30 segundos.';
        } else {
          botReply = '¡Con gusto! Tenemos cupos disponibles de lunes a viernes a las 10:00 hs y 15:00 hs (hora de Argentina). ¿Qué día te resulta más conveniente?';
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-bot`,
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      const fallbackText = '¡Gracias por tu mensaje! Un asesor de Clientum te contactará en breve con la propuesta personalizada.';
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-bot`,
          sender: 'bot',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBotChange = (type: 'ventas' | 'soporte' | 'turnos') => {
    setBotType(type);
    let intro = '';
    if (type === 'ventas') intro = '¡Hola! 👋 Soy el bot de Ventas & Calificación. ¿Qué solución estás buscando para tu negocio?';
    if (type === 'soporte') intro = 'Hola, soy el asistente de Soporte Técnico Nivel 1. ¿En qué duda operativa o técnica te ayudo?';
    if (type === 'turnos') intro = '¡Bienvenido! Soy el gestor de citas y demos. ¿Qué día y horario te queda más cómodo para coordinar?';

    setMessages([
      {
        id: `m-init-${Date.now()}`,
        sender: 'bot',
        text: intro,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] border border-slate-200 text-xs font-['Plus_Jakarta_Sans',sans-serif]">
        {/* WhatsApp Mobile Header */}
        <div className="bg-emerald-700 p-3.5 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-white text-base shadow-xs">
                🤖
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5 text-[#0f172a] dark:text-white">
                Clientum Bot IA
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-800 text-emerald-100 font-semibold">
                  Verificado ✓
                </span>
              </h3>
              <p className="text-[10px] text-emerald-100">
                {isTyping ? 'escribiendo...' : 'en línea • Respuesta < 2s'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-emerald-100">
            <button onClick={onClose} className="p-1 hover:text-[#0f172a] hover:dark:text-white cursor-pointer transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bot Personality Switcher */}
        <div className="bg-slate-50 p-2 flex items-center justify-around border-b border-slate-200 text-[11px]">
          <button
            onClick={() => handleBotChange('ventas')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              botType === 'ventas' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            🛍️ Ventas & Precios
          </button>
          <button
            onClick={() => handleBotChange('soporte')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              botType === 'soporte' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            🛠️ Soporte Técnico
          </button>
          <button
            onClick={() => handleBotChange('turnos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              botType === 'turnos' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            📅 Demos & Citas
          </button>
        </div>

        {/* Chat Messages Body with WhatsApp light pattern */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#eef1f6] dark:bg-[#f0f2f5] relative">
          <div className="text-center my-2">
            <span className="px-3 py-1 rounded-full bg-white text-slate-500 text-[10px] shadow-xs border border-slate-200">
              🔒 Los mensajes están cifrados de extremo a extremo
            </span>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-slate-900 relative leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#eef1f6] dark:bg-[#d9fdd3] rounded-tr-none border border-emerald-200'
                    : 'bg-white rounded-tl-none border border-slate-200'
                }`}
              >
                <p className="text-xs whitespace-pre-line text-slate-800">{m.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[#64748b] dark:text-slate-400">
                  <span>{m.time}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200 text-[#64748b] dark:text-slate-400 w-24 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-slate-50 p-2 overflow-x-auto flex gap-1.5 border-t border-slate-200">
          {quickPrompts[botType].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-emerald-50 text-[10px] text-emerald-800 border border-emerald-200 font-semibold cursor-pointer transition-colors shadow-xs"
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="bg-white p-2.5 flex items-center gap-2 border-t border-slate-200"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe un mensaje para probar el bot..."
            className="flex-1 bg-slate-100 text-slate-900 rounded-xl px-3.5 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white cursor-pointer transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
