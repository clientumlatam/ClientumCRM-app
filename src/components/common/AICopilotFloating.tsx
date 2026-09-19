import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AICopilot } from '../ai/AICopilot';

export const AICopilotFloating: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id="clientum-ai-copilot-floating"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto"
    >
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-850 text-[var(--text-primary,#0f172a)] dark:text-white font-bold text-xs shadow-2xl transition-all duration-200 flex items-center gap-2 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 cursor-pointer hover:scale-105 active:scale-95 backdrop-blur-md"
          title="Abrir Clientum AI Copilot"
        >
          <div className="w-5 h-5 rounded-full bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
          </div>
          <span className="tracking-tight text-indigo-100">Copilot IA</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
        </button>
      )}

      {isOpen && (
        <div className="w-[345px] max-w-[92vw] h-[520px] max-h-[85vh] shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
          <AICopilot onClose={() => setIsOpen(false)} embedded={true} />
        </div>
      )}
    </div>
  );
};

export default AICopilotFloating;
