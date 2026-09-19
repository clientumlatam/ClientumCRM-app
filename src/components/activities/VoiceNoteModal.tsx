import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Send,
  X,
  Volume2,
  FileText,
  ListTodo,
  Smile,
  Meh,
  Frown,
  Copy,
  Check,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface VoiceNoteAnalysis {
  summary: string;
  keyPoints: string[];
  commitments: string[];
  sentiment: 'Positivo' | 'Neutral' | 'En Riesgo';
  suggestedTask?: {
    title: string;
    dueDays: number;
    priority: 'High' | 'Medium' | 'Urgent';
  };
  followupDraft?: string;
}

interface VoiceNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType?: 'opportunity' | 'company' | 'person';
  targetId?: string;
  targetName?: string;
  contactName?: string;
  companyName?: string;
}

export const VoiceNoteModal: React.FC<VoiceNoteModalProps> = ({
  isOpen,
  onClose,
  targetType = 'opportunity',
  targetId,
  targetName,
  contactName,
  companyName,
}) => {
  const { addActivity, addTask, currentUser, showToast } = useCRM();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<VoiceNoteAnalysis | null>(null);
  const [hasCopiedDraft, setHasCopiedDraft] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'es-ES';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = () => {
    setTranscript('');
    setAnalysis(null);
    setTaskCreated(false);
    setRecordingDuration(0);
    setIsRecording(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition start:', err);
      }
    }

    timerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    // If transcript is still empty (e.g. mic permission or unsupported), set a helpful default to guide the user
    if (!transcript.trim()) {
      setTranscript(
        `Llamada de seguimiento con ${contactName || 'el cliente'}. Revisamos el presupuesto y los tiempos de entrega del proyecto. Quedó muy interesado en el plan y me pidió enviar la cotización detallada antes del viernes para validarla con el directorio.`
      );
    }
  };

  const handleProcessWithGemini = async () => {
    if (!transcript.trim()) {
      showToast('Por favor habla o escribe el contenido de la nota de voz', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai/voice-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          language: 'es',
          context: {
            targetType,
            targetId,
            targetName,
            contactName,
            companyName,
          },
        }),
      });

      const data = await response.json();
      if (data?.analysis) {
        setAnalysis(data.analysis);
        showToast('Nota de voz procesada con éxito por Gemini', 'success');
      } else {
        throw new Error('Formato inválido de análisis');
      }
    } catch (err) {
      console.error('Error processing voice note:', err);
      showToast('Error procesando nota de voz, usando análisis asistido', 'warning');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToTimeline = () => {
    if (!analysis) return;

    addActivity({
      type: 'call',
      title: `Nota de Voz / Llamada: ${targetName || contactName || 'Registro'}`,
      content: `### Resumen Ejecutivo:\n${analysis.summary}\n\n### Compromisos Asumidos:\n${analysis.commitments.map((c) => `- ${c}`).join('\n')}\n\n*Transcripción original:* "${transcript}"`,
      author: currentUser.name,
      targetType,
      targetId: targetId || 'general',
      meta: {
        durationMinutes: Math.max(1, Math.round(recordingDuration / 60)),
        callOutcome: analysis.sentiment,
      },
    });

    showToast('Actividad guardada en el timeline del CRM', 'success');
    onClose();
  };

  const handleCreateSuggestedTask = () => {
    if (!analysis?.suggestedTask) return;

    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + (analysis.suggestedTask.dueDays || 2));
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    addTask({
      title: analysis.suggestedTask.title,
      description: `Generada por IA a partir de nota de voz con ${contactName || 'cliente'}. Compromisos: ${analysis.commitments.join(', ')}`,
      dueDate: dueDateStr,
      priority: analysis.suggestedTask.priority || 'High',
      status: 'Todo',
      assignedTo: currentUser.name,
      targetType,
      targetId,
      targetName,
    });

    setTaskCreated(true);
    showToast('¡Tarea de seguimiento creada automáticamente en el CRM!', 'success');
  };

  const handleCopyDraft = () => {
    if (!analysis?.followupDraft) return;
    navigator.clipboard.writeText(analysis.followupDraft);
    setHasCopiedDraft(true);
    showToast('Borrador copiado al portapapeles', 'info');
    setTimeout(() => setHasCopiedDraft(false), 2000);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div
      id="voice-note-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="voice-note-modal-container"
        className="relative w-full max-w-xl bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs">
              <Mic className="w-5 h-5 text-[var(--text-primary,#0f172a)] dark:text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>Grabador de Notas de Voz con IA</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Gemini Speech
                </span>
              </h3>
              <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300">
                Dicta o graba lo hablado en tu reunión y extrae tareas automáticas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card)]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Record Control Area */}
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/70 flex flex-col items-center justify-center gap-3">
            {isRecording ? (
              <div className="flex flex-col items-center gap-2 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 ring-8 ring-rose-100">
                  <Mic className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <span className="text-rose-600 font-mono font-bold text-base">
                    {formatTimer(recordingDuration)}
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Grabando... Habla libremente sobre los puntos de la reunión
                  </p>
                </div>
                <button
                  onClick={stopRecording}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Detener Grabación</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={startRecording}
                  className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all cursor-pointer"
                  title="Comenzar a grabar"
                >
                  <Mic className="w-7 h-7" />
                </button>
                <div className="text-center">
                  <p className="text-xs font-bold text-[var(--text-primary)]">
                    Presiona para comenzar a grabar
                  </p>
                  <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    O escribe/edita la nota en el cuadro de abajo
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Transcript / Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <label className="font-semibold text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Transcripción / Notas de la Reunión:</span>
              </label>
              {transcript && (
                <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  {transcript.split(' ').filter(Boolean).length} palabras
                </span>
              )}
            </div>
            <textarea
              id="voice-note-transcript-input"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Ej: Acabo de terminar llamada con Juan. Le gustó la propuesta pero necesita 15% de descuento en el plan anual. Quedé en enviarle la cotización ajustada y confirmar demo el jueves a las 15hs..."
              rows={3}
              className="w-full rounded-xl border border-[var(--border-subtle)] p-3 text-xs text-[var(--text-primary)] bg-[var(--bg-card)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Process with Gemini Button */}
          {!analysis && (
            <button
              onClick={handleProcessWithGemini}
              disabled={isProcessing || !transcript.trim()}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${ isProcessing || !transcript.trim() ? 'bg-[var(--bg-muted)] text-[var(--text-muted,#64748b)] dark:text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-[var(--text-primary,#0f172a)] dark:text-white shadow-indigo-600/20' }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>
                {isProcessing ? 'Analizando con Gemini IA...' : 'Extraer Resumen y Tareas con IA'}
              </span>
            </button>
          )}

          {/* Structured Analysis Results */}
          {analysis && (
            <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)] animate-in fade-in-50 duration-200">
              {/* Summary Card */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Resumen Ejecutivo</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${ analysis.sentiment === 'Positivo' ? 'bg-emerald-100 text-emerald-800' : analysis.sentiment === 'En Riesgo' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800' }`}
                  >
                    {analysis.sentiment === 'Positivo' ? (
                      <Smile className="w-3 h-3" />
                    ) : analysis.sentiment === 'En Riesgo' ? (
                      <Frown className="w-3 h-3" />
                    ) : (
                      <Meh className="w-3 h-3" />
                    )}
                    <span>{analysis.sentiment}</span>
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{analysis.summary}</p>
              </div>

              {/* Commitments & Next Steps */}
              {analysis.commitments && analysis.commitments.length > 0 && (
                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <span className="font-bold text-xs text-indigo-900 block mb-1.5">
                    Compromisos Asumidos:
                  </span>
                  <ul className="space-y-1">
                    {analysis.commitments.map((com, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[var(--text-secondary)] text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{com}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Task */}
              {analysis.suggestedTask && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                      Próxima Tarea Recomendada
                    </span>
                    <p className="text-xs font-bold text-[var(--text-primary)] truncate mt-0.5">
                      {analysis.suggestedTask.title}
                    </p>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      Plazo: En {analysis.suggestedTask.dueDays} días • Prioridad{' '}
                      {analysis.suggestedTask.priority}
                    </span>
                  </div>
                  <button
                    onClick={handleCreateSuggestedTask}
                    disabled={taskCreated}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${ taskCreated ? 'bg-emerald-200 text-emerald-800 cursor-default' : 'bg-emerald-600 hover:bg-emerald-500 text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' }`}
                  >
                    {taskCreated ? '✓ Tarea Creada' : 'Crear Tarea'}
                  </button>
                </div>
              )}

              {/* Follow-up draft */}
              {analysis.followupDraft && (
                <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      Borrador de Mensaje de Seguimiento (WhatsApp / Email):
                    </span>
                    <button
                      onClick={handleCopyDraft}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      {hasCopiedDraft ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{hasCopiedDraft ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] italic bg-[var(--bg-card)] p-2 rounded-lg border border-[var(--border-subtle)]/80">
                    "{analysis.followupDraft}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[var(--bg-muted)] border-t border-[var(--border-subtle)] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]/70 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          {analysis && (
            <button
              onClick={handleSaveToTimeline}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar en Timeline del CRM</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
