import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Sparkles,
  Globe,
  Trash2,
  Check,
  AlertCircle,
  Volume2,
  ChevronDown,
  Wand2,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVoiceTranscription, formatSpokenPunctuation } from '../../hooks/useVoiceTranscription';

export interface WhatsAppVoiceDictationBarProps {
  onInsertText: (text: string, mode: 'append' | 'replace') => void;
  currentInputText?: string;
  onClose?: () => void;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'es-AR', label: 'Español (Argentina)', flag: '🇦🇷' },
  { code: 'es-419', label: 'Español (Latinoamérica)', flag: '🌎' },
  { code: 'es-ES', label: 'Español (España)', flag: '🇪🇸' },
  { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { code: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
];

export const WhatsAppVoiceDictationBar: React.FC<WhatsAppVoiceDictationBarProps> = ({
  onInsertText,
  currentInputText = '',
  onClose,
  className = '',
}) => {
  const [selectedLang, setSelectedLang] = useState('es-AR');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isPolishingAI, setIsPolishingAI] = useState(false);
  const [dictatedText, setDictatedText] = useState('');

  const {
    isListening,
    isProcessing,
    transcript,
    interimText,
    audioLevel,
    duration,
    error,
    isSupported,
    startListening,
    stopListening,
    cancelListening,
  } = useVoiceTranscription({
    language: selectedLang,
    autoPunctuation: true,
    onTranscriptChange: (text) => {
      setDictatedText(text);
    }
  });

  // Automatically start listening when the bar is mounted
  useEffect(() => {
    startListening();
    return () => {
      cancelListening();
    };
  }, []);

  const handleStopAndInsert = async (mode: 'append' | 'replace' = 'append') => {
    const finalResult = await stopListening();
    const textToInsert = finalResult || dictatedText || transcript;
    if (textToInsert.trim()) {
      onInsertText(textToInsert.trim(), mode);
    }
    if (onClose) onClose();
  };

  const handlePolishWithAI = async () => {
    const activeText = dictatedText || transcript;
    if (!activeText.trim()) return;

    setIsPolishingAI(true);
    try {
      // Call AI endpoint to polish and refine spoken WhatsApp message
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Eres un asistente de redacción comercial para WhatsApp en Argentina/Latinoamérica. 
Transforma el siguiente texto dictado por voz en un mensaje de WhatsApp impecable, natural, profesional, con puntuación perfecta y emojis sutiles si amerita. Conserva la intención exacta sin sonar robótico.

Texto dictado: "${activeText}"

Devuelve únicamente el texto final pulido, sin explicaciones ni comillas.`
        })
      });

      if (response.ok) {
        const data = await response.json();
        const refined = data.analysis || data.text || data.response;
        if (refined && typeof refined === 'string') {
          setDictatedText(refined.trim());
        }
      }
    } catch (err) {
      console.warn('Could not polish with AI:', err);
    } finally {
      setIsPolishingAI(false);
    }
  };

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const displayText = (dictatedText || transcript || interimText).trim();

  return (
    <div className={`w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#121722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232d42] rounded-2xl p-3.5 shadow-xl text-xs select-none ${className}`}>
      
      {/* Header Bar with Live Indicator, Audio Wave, Timer & Language */}
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1c2436]">
        
        {/* Live Recording Status */}
        <div className="flex items-center gap-2">
          {isListening ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-semibold">DICTANDO EN VIVO</span>
              <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 font-normal">({formatTime(duration)})</span>
            </div>
          ) : isProcessing ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[11px]">
              <Sparkles className="w-3 h-3 animate-spin text-purple-400" />
              <span>Transcribiendo con IA...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono text-[11px]">
              <Volume2 className="w-3 h-3" />
              <span>Micrófono en Pausa</span>
            </div>
          )}

          {/* Equalizer Soundwave Bars */}
          {isListening && (
            <div className="hidden sm:flex items-center gap-0.5 h-4 px-2">
              {[0.4, 0.8, 1.2, 0.6, 0.9, 1.4, 0.7, 1.1, 0.5, 0.8].map((multiplier, idx) => {
                const heightPercent = Math.max(15, Math.min(100, Math.round((audioLevel || 20) * multiplier)));
                return (
                  <motion.div
                    key={idx}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.08 }}
                    className="w-1 bg-emerald-400 rounded-full"
                    style={{ minHeight: '3px' }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Right Tools: Language Selector, Punctuation Tips & Cancel */}
        <div className="flex items-center gap-2 relative">
          
          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181f2f] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#20293d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#27344f] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[11px] transition-colors"
            >
              <span>{SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.flag}</span>
              <span className="hidden md:inline">{SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.label.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-[var(--bg-card,#ffffff)] dark:bg-[#151a26] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#26334a] rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[var(--text-muted,#64748b)] dark:text-slate-400 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#212b3e]">
                  Idioma de Reconocimiento
                </div>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setSelectedLang(lang.code);
                      setShowLangMenu(false);
                      if (isListening) {
                        stopListening().then(() => startListening());
                      }
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between text-xs hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1f2738] ${ selectedLang === lang.code ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-[var(--text-secondary,#475569)] dark:text-slate-300' }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {selectedLang === lang.code && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tips Button */}
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            title="Comandos de puntuación por voz"
            className={`p-1.5 rounded-lg border transition-colors ${ showTips ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#181f2f] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 border-[var(--border-subtle,#e2e8f0)] dark:border-[#27344f]' }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={() => {
              cancelListening();
              if (onClose) onClose();
            }}
            className="p-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181f2f] hover:bg-red-500/20 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-red-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#27344f] transition-colors"
            title="Descartar y cerrar"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Punctuation Voice Commands Cheat Sheet */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[var(--bg-card,#ffffff)] dark:bg-[#181f2e] border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#243046] px-3 py-2 text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300 space-y-1"
          >
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span>🎙️ Comandos de Puntuación por Voz Automática:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 pt-1">
              <div><strong className="text-[var(--text-primary,#0f172a)] dark:text-white">"punto"</strong> → .</div>
              <div><strong className="text-[var(--text-primary,#0f172a)] dark:text-white">"coma"</strong> → ,</div>
              <div><strong className="text-[var(--text-primary,#0f172a)] dark:text-white">"dos puntos"</strong> → :</div>
              <div><strong className="text-[var(--text-primary,#0f172a)] dark:text-white">"nuevo párrafo"</strong> → ↵↵</div>
              <div><strong className="text-[var(--text-primary,#0f172a)] dark:text-white">"signo de pregunta"</strong> → ?</div>
              <div><strong className="text-[var(--text-primary,#0f172a)] dark:text-white">"signo de exclamación"</strong> → !</div>
              <div><strong className="text-[var(--text-primary,#0f172a)] dark:text-white">"abrir comillas"</strong> → "</div>
              <div><strong className="text-[var(--text-primary,#0f172a)] dark:text-white">"arroba"</strong> → @</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state if microphone blocked */}
      {error && (
        <div className="mt-2.5 p-2.5 bg-red-950/50 border border-red-500/30 rounded-xl text-red-300 flex items-start gap-2 text-[11px]">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">{error}</span>
            <p className="text-[10px] text-red-400 mt-0.5">
              Asegúrate de permitir el micrófono en los permisos de tu navegador o prueba en una ventana nueva.
            </p>
          </div>
          <button
            type="button"
            onClick={() => startListening()}
            className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-medium text-[10px]"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Live Transcribed Text Box */}
      <div className="my-2.5 p-3 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c0f16] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2636] rounded-xl min-h-[68px] max-h-[140px] overflow-y-auto">
        {displayText ? (
          <p className="text-[var(--text-primary,#0f172a)] dark:text-slate-100 text-xs leading-relaxed whitespace-pre-wrap">
            {displayText}
            {interimText && <span className="text-emerald-400/80 italic font-mono"> {interimText}</span>}
          </p>
        ) : (
          <div className="flex items-center gap-2 text-[var(--text-muted)] italic py-3">
            <Mic className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Habla ahora claramente por tu micrófono... tu voz se transcribirá en tiempo real.</span>
          </div>
        )}
      </div>

      {/* Footer Controls: Toggle Mic, Polish with AI & Insert Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        
        {/* Left: Pause / Resume Mic */}
        <div className="flex items-center gap-2">
          {isListening ? (
            <button
              type="button"
              onClick={() => stopListening()}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-amber-300" />
              <span>Pausar Mic</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => startListening()}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 text-xs transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Continuar Hablando</span>
            </button>
          )}

          {/* Polish with AI Button */}
          <button
            type="button"
            onClick={handlePolishWithAI}
            disabled={!displayText || isPolishingAI}
            className="px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-medium flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Optimizar redacción, gramática y tono WhatsApp con IA"
          >
            <Sparkles className={`w-3.5 h-3.5 text-purple-400 ${isPolishingAI ? 'animate-spin' : ''}`} />
            <span>{isPolishingAI ? 'Pulir texto...' : 'Pulir con IA'}</span>
          </button>
        </div>

        {/* Right: Insert Options */}
        <div className="flex items-center gap-2">
          {currentInputText && (
            <button
              type="button"
              onClick={() => handleStopAndInsert('replace')}
              disabled={!displayText}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#182030] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#202b40] text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#29364f] font-medium text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Reemplazar Texto
            </button>
          )}

          <button
            type="button"
            onClick={() => handleStopAndInsert('append')}
            disabled={!displayText}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{currentInputText ? 'Agregar al Mensaje' : 'Insertar en Mensaje'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
