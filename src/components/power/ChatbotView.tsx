import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const ChatbotView: React.FC = () => {
  const { showToast } = useCRM();
  const [systemPrompt, setSystemPrompt] = useState('Eres el asistente virtual inteligente de ventas y atención de ClientumCRM. Responde de forma amable, concisa y altamente profesional orientada al cierre de negocios.');
  const [tone, setTone] = useState('Comercial y Amigable');

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs max-w-3xl">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          Configuración del Chatbot de IA de ClientumCRM
        </h3>
        <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Configura el prompt del sistema, tono de voz y directrices para que la IA responda automáticamente en WhatsApp.</p>
      </div>

      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-6 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Tono de Voz del Asistente</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-purple-500"
          >
            <option>Comercial y Amigable</option>
            <option>Formal y Corporativo</option>
            <option>Soporte Técnico Especializado</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Prompt del Sistema (Instrucciones de la IA)</label>
          <textarea
            rows={4}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white p-3 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-purple-500 leading-relaxed"
          />
        </div>

        <button
          onClick={() => showToast('Configuración del Chatbot IA guardada en Gemini Engine', 'success')}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-md flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Actualizar Comportamiento del Chatbot</span>
        </button>
      </div>
    </div>
  );
};
