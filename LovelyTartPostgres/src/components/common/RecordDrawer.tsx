import React, { useState, useRef } from 'react';
import {
  X,
  Building2,
  Users2,
  Calendar,
  DollarSign,
  Tag,
  Sparkles,
  MessageSquare,
  Phone,
  Mail,
  CalendarDays,
  Clock,
  Trash2,
  CheckCircle2,
  Send,
  User,
  Plus,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Mic,
  Square,
  Disc,
  FileText,
  Linkedin,
  Globe,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { STAGES } from '../../data/initialData';
import { Activity, Opportunity, Person, Company, Task, StageId } from '../../types';
import { getClientumAuthJsonHeaders } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppQuickActionModal } from '../whatsapp/WhatsAppQuickActionModal';
import { QuickQuoteDrawerTab } from '../commercial/QuickQuoteDrawerTab';

interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onDebouncedChange: (val: string) => void;
  debounceMs?: number;
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: externalValue,
  onDebouncedChange,
  debounceMs = 300,
  ...props
}) => {
  const [localValue, setLocalValue] = useState<string>(String(externalValue ?? ''));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setLocalValue(String(externalValue ?? ''));
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onDebouncedChange(val);
    }, debounceMs);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onDebouncedChange(localValue);
    props.onBlur?.(e);
  };

  return <input {...props} value={localValue} onChange={handleChange} onBlur={handleBlur} />;
};

interface DebouncedTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onDebouncedChange: (val: string) => void;
  debounceMs?: number;
}

const DebouncedTextarea: React.FC<DebouncedTextareaProps> = ({
  value: externalValue,
  onDebouncedChange,
  debounceMs = 300,
  ...props
}) => {
  const [localValue, setLocalValue] = useState<string>(externalValue ?? '');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setLocalValue(externalValue ?? '');
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onDebouncedChange(val);
    }, debounceMs);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onDebouncedChange(localValue);
    props.onBlur?.(e);
  };

  return <textarea {...props} value={localValue} onChange={handleChange} onBlur={handleBlur} />;
};

export const RecordDrawer: React.FC = React.memo(() => {
  const {
    selectedRecord,
    setSelectedRecord,
    opportunities,
    companies,
    people,
    tasks,
    activities,
    updateOpportunity,
    deleteOpportunity,
    moveOpportunityStage,
    updateCompany,
    deleteCompany,
    updatePerson,
    deletePerson,
    enrichContact,
    updateTask,
    deleteTask,
    addActivity,
    currentUser,
    openAICopilot,
    language,
    showToast,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'timeline' | 'ai' | 'details' | 'quote'>('timeline');
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activityType, setActivityType] = useState<'note' | 'call' | 'email' | 'meeting'>('note');
  const [callDuration, setCallDuration] = useState('15');
  const [emailSubject, setEmailSubject] = useState('');

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isWebSpeechActive, setIsWebSpeechActive] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Waveform state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const analyser = analyserRef.current;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      
      analyser.getByteTimeDomainData(dataArray);
      
      // bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2230] to match container
      ctx.fillStyle = 'rgb(27, 34, 48)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(96, 165, 250)'; // Tailwind blue-400
      
      ctx.beginPath();
      
      const sliceWidth = width * 1.0 / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    
    draw();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyser.fftSize = 2048;
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        stream.getTracks().forEach(track => track.stop());
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        setIsTranscribing(true);
        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64data = (reader.result as string).split(',')[1];
            const response = await fetch('/api/ai/transcribe', {
              method: 'POST',
               headers: await getClientumAuthJsonHeaders(),
              body: JSON.stringify({ audioBase64: base64data, mimeType: 'audio/webm' })
            });
            const data = await response.json();
            if (data.text) {
              setNewNote(prev => prev ? `${prev}\n\n${data.text}` : data.text);
              showToast('Audio transcribed successfully', 'success');
            } else if (data.error) {
               showToast('Transcription failed: ' + data.error, 'error');
            }
            setIsTranscribing(false);
          };
        } catch (err) {
          console.error(err);
          setIsTranscribing(false);
          showToast('Transcription failed', 'error');
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setAudioBlobUrl(null);
      
      // Delay waveform start slightly so canvas exists
      setTimeout(() => drawWaveform(), 100);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      showToast('No se pudo acceder al micrófono', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const toggleWebSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Tu navegador no soporta Web Speech API (Prueba con Google Chrome o Edge)', 'warning');
      return;
    }

    if (isWebSpeechActive) {
      setIsWebSpeechActive(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-AR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsWebSpeechActive(true);
        showToast('🎤 Web Speech API activa: Dicta tu nota de voz para esta interacción...', 'info');
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          }
        }
        if (finalStr) {
          setNewNote((prev) => (prev ? prev + ' ' + finalStr : finalStr));
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsWebSpeechActive(false);
      };

      recognition.onend = () => {
        setIsWebSpeechActive(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start Web Speech API:', err);
      setIsWebSpeechActive(false);
      showToast('No se pudo iniciar el dictado por voz', 'error');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedRecord) return null;

  // Resolve active entity
  const opp = selectedRecord.type === 'opportunity' ? opportunities.find((o) => o.id === selectedRecord.id) : null;
  const company = selectedRecord.type === 'company' ? companies.find((c) => c.id === selectedRecord.id) : null;
  const person = selectedRecord.type === 'person' ? people.find((p) => p.id === selectedRecord.id) : null;
  const task = selectedRecord.type === 'task' ? tasks.find((t) => t.id === selectedRecord.id) : null;

  if (!opp && !company && !person && !task) {
    return null;
  }

  // Contact resolution for WhatsApp
  const contactForWhatsApp = opp 
    ? (people.find((p) => p.id === opp.contactId) || people.find((p) => `${p.firstName} ${p.lastName}` === opp.contactName))
    : person;
  const recipientName = contactForWhatsApp ? `${contactForWhatsApp.firstName} ${contactForWhatsApp.lastName}` : (opp?.contactName || company?.name || '');
  const recipientPhone = contactForWhatsApp?.phone || (opp as any)?.contactPhone || (company as any)?.phone || '';
  const recipientCompany = company?.name || opp?.companyName || contactForWhatsApp?.companyName || '';

  // Filter activities for this record
  const recordActivities = activities.filter(
    (a) => a.targetType === selectedRecord.type && a.targetId === selectedRecord.id
  );

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() && !audioBlobUrl) return;

    addActivity({
      type: activityType,
      title:
        activityType === 'note'
          ? 'Internal Note Added'
          : activityType === 'call'
          ? `Call Logged (${callDuration} mins)`
          : activityType === 'email'
          ? `Email: ${emailSubject || 'No Subject'}`
          : 'Meeting Summary',
      content: newNote || 'Voice note attached',
      author: currentUser.name,
      targetType: selectedRecord.type as 'opportunity' | 'company' | 'person',
      targetId: selectedRecord.id,
      audioUrl: audioBlobUrl || undefined,
      meta: {
        durationMinutes: activityType === 'call' ? Number(callDuration) : undefined,
        emailSubject: activityType === 'email' ? emailSubject : undefined,
      },
    });

    setNewNote('');
    setEmailSubject('');
    setAudioBlobUrl(null);
    showToast('Activity logged to timeline', 'success');
  };

  const getRecordTitle = () => {
    if (opp) return opp.name;
    if (company) return company.name;
    if (person) return `${person.firstName} ${person.lastName}`;
    if (task) return task.title;
    return 'Record';
  };

  return (
    <div id="clientum-record-drawer-overlay" className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full max-w-2xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0f1219] border-l border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] h-full flex flex-col shadow-2xl text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300"
      >
        {/* Drawer Top Header */}
        <div className="p-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] flex items-center justify-between bg-[var(--bg-card,#ffffff)] dark:bg-[#131722]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2434] text-[var(--text-muted,#64748b)] dark:text-slate-400 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273044]">
              {selectedRecord.type}
            </span>
            <h2 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white truncate">{getRecordTitle()}</h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="drawer-whatsapp-quick-btn"
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors"
              title="Abrir WhatsApp directo con plantillas"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            <button
              id="drawer-ai-quick-btn"
              onClick={() =>
                openAICopilot({
                  type: selectedRecord.type,
                  id: selectedRecord.id,
                  name: getRecordTitle(),
                  initialPrompt: language === 'es'
                    ? `Proporciona información estratégica y acciones recomendadas para ${selectedRecord.type}: "${getRecordTitle()}".`
                    : language === 'pt'
                    ? `Forneça insights estratégicos e ações recomendadas para ${selectedRecord.type}: "${getRecordTitle()}".`
                    : `Provide strategic insights and recommended next actions for ${selectedRecord.type}: "${getRecordTitle()}".`,
                })
              }
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{language === 'es' ? 'Análisis IA' : language === 'pt' ? 'Análise IA' : 'AI Insights'}</span>
            </button>

            <button
              id="drawer-close-btn"
              onClick={() => setSelectedRecord(null)}
              className="p-1.5 rounded hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1f2535] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Opportunity Quick Stage Ribbon */}
        {opp && (
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#11141d] px-4 py-2 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a1f2c] flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1">
              {STAGES.map((s) => {
                const isCurrent = opp.stage === s.id;
                return (
                  <button
                    key={s.id}
                    id={`drawer-stage-step-${s.id}`}
                    onClick={() => moveOpportunityStage(opp.id, s.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${ isCurrent ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white font-semibold shadow-xs' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#181c28] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#202535]' }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Drawer Tab Navigation */}
        <div className="flex items-center border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] px-4 bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c]">
          <button
            id="drawer-tab-timeline"
            onClick={() => setActiveTab('timeline')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${ activeTab === 'timeline' ? 'border-blue-500 text-white' : 'border-transparent text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            Activity Timeline ({recordActivities.length})
          </button>
          <button
            id="drawer-tab-details"
            onClick={() => setActiveTab('details')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${ activeTab === 'details' ? 'border-blue-500 text-white' : 'border-transparent text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            Properties & Details
          </button>
          <button
            id="drawer-tab-ai"
            onClick={() => setActiveTab('ai')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${ activeTab === 'ai' ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI Intelligence
          </button>
          {opp && (
            <button
              id="drawer-tab-quote"
              onClick={() => setActiveTab('quote')}
              className={`py-2.5 px-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${ activeTab === 'quote' ? 'border-blue-500 text-white' : 'border-transparent text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Presupuesto & PDF
            </button>
          )}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: ACTIVITY TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {/* Activity Input Box */}
              <form
                onSubmit={handleAddActivity}
                className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222838] rounded-xl p-3 space-y-2.5 shadow-sm"
              >
                {/* Type Switcher */}
                <div className="flex items-center gap-1 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e1118] p-1 rounded-md border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b202c]">
                  <button
                    type="button"
                    onClick={() => setActivityType('note')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${ activityType === 'note' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#22293b] text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityType('call')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${ activityType === 'call' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#22293b] text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                  >
                    <Phone className="w-3 h-3" />
                    Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityType('email')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${ activityType === 'email' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#22293b] text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                  >
                    <Mail className="w-3 h-3" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityType('meeting')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${ activityType === 'meeting' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#22293b] text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                  >
                    <CalendarDays className="w-3 h-3" />
                    Meeting
                  </button>
                </div>

                {/* Extra inputs based on type */}
                {activityType === 'email' && (
                  <input
                    type="text"
                    placeholder="Email subject..."
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10131c] text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200 px-3 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242b3d] focus:outline-none focus:border-blue-500"
                  />
                )}

                {activityType === 'call' && (
                  <div className="flex items-center gap-2 text-[var(--text-secondary,#475569)] dark:text-slate-300">
                    <span className="text-[11px]">Duration (mins):</span>
                    <input
                      type="number"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                      className="w-16 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10131c] text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200 px-2 py-1 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242b3d] focus:outline-none"
                    />
                  </div>
                )}

                <textarea
                  placeholder={`Write a ${activityType} update for this record...`}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={2}
                  className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10131c] text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200 p-2.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242b3d] focus:outline-none focus:border-blue-500 resize-none"
                  disabled={isRecording}
                />

                {isRecording && (
                  <div className="flex flex-col gap-2 p-2 bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2230] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232c40] rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-xs text-red-400 font-medium">
                        Recording... {formatDuration(recordingDuration)}
                      </span>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium bg-red-500/10 px-2 py-1 rounded"
                      >
                        <Square className="w-3.5 h-3.5" />
                        Stop
                      </button>
                    </div>
                    <canvas ref={canvasRef} width={400} height={40} className="w-full h-10 rounded bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10131c] opacity-80" />
                  </div>
                )}

                {isTranscribing && (
                  <div className="flex items-center gap-3 p-2 bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2230] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232c40] rounded-md">
                    <div className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    <span className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium">Transcribing audio with Gemini AI...</span>
                  </div>
                )}

                {audioBlobUrl && !isTranscribing && (
                  <div className="flex items-center gap-3 p-2 bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2230] rounded-md border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232c40]">
                    <audio src={audioBlobUrl} controls className="h-8 flex-1" />
                    <button
                      type="button"
                      onClick={() => setAudioBlobUrl(null)}
                      className="p-1 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#232c40] rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-1.5 rounded-md border transition-colors ${ isRecording ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2230] border-[var(--border-subtle,#e2e8f0)] dark:border-[#232c40] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#232c40]' }`}
                      title={isRecording ? 'Detener grabación' : 'Grabar nota de voz'}
                    >
                      {isRecording ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleWebSpeechRecognition}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all ${ isWebSpeechActive ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2230] border-[var(--border-subtle,#e2e8f0)] dark:border-[#232c40] text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#232c40]' }`}
                      title="Dictado de voz Web Speech API (Voice-to-Text)"
                    >
                      <Mic className={`w-3.5 h-3.5 ${isWebSpeechActive ? 'text-red-400 animate-bounce' : 'text-blue-400'}`} />
                      <span>{isWebSpeechActive ? 'Escuchando voz...' : 'Dictado Web Speech'}</span>
                    </button>
                    <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 hidden sm:inline">
                      Logged as <strong className="text-[var(--text-secondary,#475569)] dark:text-slate-300">{currentUser.name}</strong>
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    Log Activity
                  </button>
                </div>
              </form>

              {/* Timeline Stream */}
              <div className="space-y-3 pt-2">
                {recordActivities.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f2433] rounded-xl text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs">
                    No activities recorded yet. Log a note, call, or email above.
                  </div>
                ) : (
                  recordActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#202534] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-1.5">
                          {act.type === 'stage_change' ? (
                            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                          ) : act.type === 'email' ? (
                            <Mail className="w-3.5 h-3.5 text-purple-400" />
                          ) : act.type === 'call' ? (
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          ) : act.type === 'ai_insight' ? (
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                          )}
                          {act.title}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
                          {new Date(act.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {act.content}
                      </p>

                      {act.audioUrl && (
                        <div className="mt-2 pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#232c40]">
                          <audio src={act.audioUrl} controls className="h-8 w-full" />
                        </div>
                      )}

                      <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 pt-1">
                        By {act.author}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILS & PROPERTIES */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {opp && (
                <div className="space-y-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
                  <h3 className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white mb-2">Deal Properties</h3>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Deal Name</label>
                      <DebouncedInput
                        type="text"
                        value={opp.name}
                        onDebouncedChange={(val) => updateOpportunity(opp.id, { name: val })}
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500 mt-0.5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Amount ($)</label>
                        <DebouncedInput
                          type="number"
                          value={opp.amount}
                          onDebouncedChange={(val) => updateOpportunity(opp.id, { amount: Number(val) || 0 })}
                          className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs font-mono font-bold text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500 mt-0.5"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Probability (%)</label>
                        <DebouncedInput
                          type="number"
                          value={opp.probability}
                          onDebouncedChange={(val) => updateOpportunity(opp.id, { probability: Number(val) || 0 })}
                          className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs font-mono text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500 mt-0.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Close Date</label>
                        <DebouncedInput
                          type="date"
                          value={opp.closeDate}
                          onDebouncedChange={(val) => updateOpportunity(opp.id, { closeDate: val })}
                          className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500 mt-0.5"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Priority</label>
                        <select
                          value={opp.priority}
                          onChange={(e) => updateOpportunity(opp.id, { priority: e.target.value as any })}
                          className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500 mt-0.5"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Associated Company</label>
                      <DebouncedInput
                        type="text"
                        value={opp.companyName || ''}
                        onDebouncedChange={(val) => updateOpportunity(opp.id, { companyName: val })}
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500 mt-0.5"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm(`Delete opportunity "${opp.name}"?`)) {
                          deleteOpportunity(opp.id);
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Opportunity
                    </button>
                  </div>
                </div>
              )}

              {company && (
                <div className="space-y-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
                  <h3 className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white mb-2">Company Information</h3>
                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Company Name</label>
                    <DebouncedInput
                      type="text"
                      value={company.name}
                      onDebouncedChange={(val) => updateCompany(company.id, { name: val })}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] mt-0.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Domain</label>
                      <DebouncedInput
                        type="text"
                        value={company.domain}
                        onDebouncedChange={(val) => updateCompany(company.id, { domain: val })}
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">ARR ($)</label>
                      <DebouncedInput
                        type="number"
                        value={company.arr || 0}
                        onDebouncedChange={(val) => updateCompany(company.id, { arr: Number(val) || 0 })}
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] mt-0.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Description</label>
                    <DebouncedTextarea
                      value={company.description || ''}
                      onDebouncedChange={(val) => updateCompany(company.id, { description: val })}
                      rows={3}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white p-2.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] mt-0.5 resize-none"
                    />
                  </div>
                </div>
              )}

              {person && (
                <>
                  <div className="space-y-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
                  <h3 className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white mb-2">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">First Name</label>
                      <DebouncedInput
                        type="text"
                        value={person.firstName}
                        onDebouncedChange={(val) => updatePerson(person.id, { firstName: val })}
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Last Name</label>
                      <DebouncedInput
                        type="text"
                        value={person.lastName}
                        onDebouncedChange={(val) => updatePerson(person.id, { lastName: val })}
                        className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] mt-0.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Email Address</label>
                    <DebouncedInput
                      type="email"
                      value={person.email}
                      onDebouncedChange={(val) => updatePerson(person.id, { email: val })}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Job Title</label>
                    <DebouncedInput
                      type="text"
                      value={person.jobTitle}
                      onDebouncedChange={(val) => updatePerson(person.id, { jobTitle: val })}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Phone / WhatsApp</label>
                    <DebouncedInput
                      type="tel"
                      value={person.phone || ''}
                      onDebouncedChange={(val) => updatePerson(person.id, { phone: val })}
                      placeholder="+54 9 11 1234-5678"
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#191d2a] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-2.5 py-1.5 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] mt-0.5"
                    />
                  </div>
                </div>

                {/* B2B Intelligence & Contact Enrichment Section */}
                <div className="space-y-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-4 rounded-xl border border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Inteligencia & Redes Sociales</h4>
                        <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Enriquecimiento automático en background</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => enrichContact(person.id, true)}
                      disabled={person.enrichmentStatus === 'enriching'}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[10px] font-medium transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${person.enrichmentStatus === 'enriching' ? 'animate-spin' : ''}`} />
                      <span>{person.enrichmentStatus === 'enriching' ? 'Analizando...' : 'Re-enriquecer'}</span>
                    </button>
                  </div>

                  {person.enrichmentStatus === 'enriching' && (
                    <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-center text-xs text-indigo-300">
                      <div className="inline-flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Consultando background API para extraer perfil social, seniority e icebreakers...</span>
                      </div>
                    </div>
                  )}

                  {person.enrichmentStatus === 'enriched' && person.enrichmentData && (
                    <div className="space-y-2.5 text-xs">
                      {/* Bio */}
                      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#171b26] p-2.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736]">
                        <span className="text-[10px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider block mb-1">
                          Perfil Profesional Detectado
                        </span>
                        <p className="text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs leading-relaxed">
                          {person.enrichmentData.bio}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {person.enrichmentData.seniority && (
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-medium">
                            {person.enrichmentData.seniority}
                          </span>
                        )}
                        {person.enrichmentData.industry && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-medium">
                            {person.enrichmentData.industry}
                          </span>
                        )}
                        {person.enrichmentData.confidenceScore && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-medium">
                            {person.enrichmentData.confidenceScore}% confianza
                          </span>
                        )}
                      </div>

                      {/* Social Links */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {(person.enrichmentData.socialProfiles?.linkedin || person.linkedin) && (
                          <a
                            href={
                              (person.enrichmentData.socialProfiles?.linkedin || person.linkedin || '').startsWith('http')
                                ? person.enrichmentData.socialProfiles?.linkedin || person.linkedin
                                : `https://${person.enrichmentData.socialProfiles?.linkedin || person.linkedin}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1f2538] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3e] text-blue-400 text-[11px] transition-colors"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <Linkedin className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate font-medium">LinkedIn</span>
                            </div>
                            <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                          </a>
                        )}

                        {(person.enrichmentData.socialProfiles?.website || person.enrichmentData.companyInfo?.domain) && (
                          <a
                            href={
                              (person.enrichmentData.socialProfiles?.website || person.enrichmentData.companyInfo?.domain || '').startsWith('http')
                                ? person.enrichmentData.socialProfiles?.website || person.enrichmentData.companyInfo?.domain
                                : `https://${person.enrichmentData.socialProfiles?.website || person.enrichmentData.companyInfo?.domain}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1f2538] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3e] text-emerald-400 text-[11px] transition-colors"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <Globe className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate font-medium">Web</span>
                            </div>
                            <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                          </a>
                        )}
                      </div>

                      {/* Skills */}
                      {person.enrichmentData.skills && person.enrichmentData.skills.length > 0 && (
                        <div className="pt-1">
                          <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Competencias clave:</span>
                          <div className="flex flex-wrap gap-1">
                            {person.enrichmentData.skills.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2130] text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#283248] text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Icebreaker */}
                      {person.enrichmentData.suggestedIcebreakers && person.enrichmentData.suggestedIcebreakers.length > 0 && (
                        <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#171b26] p-2.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] space-y-1.5">
                          <span className="text-[10px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider block">
                            Rompehielos Comercial Sugerido
                          </span>
                          <p className="text-xs italic text-[var(--text-secondary,#475569)] dark:text-slate-300">
                            "{person.enrichmentData.suggestedIcebreakers[0]}"
                          </p>
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(person.enrichmentData!.suggestedIcebreakers![0]);
                                showToast('Rompehielos copiado al portapapeles', 'info');
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#20273a] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#28324a] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[10px] font-medium transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(!person.enrichmentStatus || person.enrichmentStatus === 'idle' || person.enrichmentStatus === 'failed') && (
                    <div className="text-center py-2">
                      <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-2">
                        Obtén seniority, bio profesional y canales sociales con 1 clic.
                      </p>
                      <button
                        type="button"
                        onClick={() => enrichContact(person.id, true)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Enriquecer Contacto Ahora</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            </div>
          )}

          {/* TAB 3: AI COPILOT */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-blue-950/30 to-purple-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>ClientumCRM AI Copilot Intelligence</span>
                </div>
                <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed">
                  Real-time deal risk scoring, stakeholder sentiment analysis, and smart sales coaching.
                </p>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() =>
                      openAICopilot({
                        type: selectedRecord.type,
                        id: selectedRecord.id,
                        name: getRecordTitle(),
                        initialPrompt: language === 'es'
                          ? `Analiza los riesgos del negocio y la probabilidad de cierre para "${getRecordTitle()}". Detalla 3 pasos concretos para acelerar el cierre.`
                          : language === 'pt'
                          ? `Analise os riscos do negócio e a probabilidade de fechamento para "${getRecordTitle()}". Destaque 3 passos concretos para acelerar o fechamento.`
                          : `Analyze the deal risks and win probability for "${getRecordTitle()}". Outline 3 concrete steps to accelerate closing.`,
                      })
                    }
                    className="w-full text-left p-2.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1e2336] border border-indigo-500/20 text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200 flex items-center justify-between group transition-colors"
                  >
                    <span>🎯 {language === 'es' ? 'Evaluar Riesgos del Negocio y Probabilidad' : language === 'pt' ? 'Avaliar Riscos do Negócio e Probabilidade' : 'Generate Deal Risk & Win Probability Assessment'}</span>
                    <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() =>
                      openAICopilot({
                        type: selectedRecord.type,
                        id: selectedRecord.id,
                        name: getRecordTitle(),
                        initialPrompt: language === 'es'
                          ? `Redacta un correo de seguimiento ejecutivo conciso y de alto impacto para "${getRecordTitle()}".`
                          : language === 'pt'
                          ? `Redija um e-mail de acompanhamento executivo conciso e de alto impacto para "${getRecordTitle()}".`
                          : `Draft a concise, high-impact executive follow-up email for "${getRecordTitle()}".`,
                      })
                    }
                    className="w-full text-left p-2.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1e2336] border border-indigo-500/20 text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200 flex items-center justify-between group transition-colors"
                  >
                    <span>✉️ {language === 'es' ? 'Redactar Correo de Seguimiento Personalizado' : language === 'pt' ? 'Redigir E-mail de Follow-Up Personalizado' : 'Draft Personalized Follow-up Email'}</span>
                    <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() =>
                      openAICopilot({
                        type: selectedRecord.type,
                        id: selectedRecord.id,
                        name: getRecordTitle(),
                        initialPrompt: language === 'es'
                          ? `Extrae las tareas clave y próximos pasos a partir de las reuniones recientes sobre "${getRecordTitle()}".`
                          : language === 'pt'
                          ? `Extraia as principais tarefas de ação e próximos passos das reuniões recentes de "${getRecordTitle()}".`
                          : `Extract key action items and next steps from the latest meetings on "${getRecordTitle()}".`,
                      })
                    }
                    className="w-full text-left p-2.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1e2336] border border-indigo-500/20 text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200 flex items-center justify-between group transition-colors"
                  >
                    <span>📋 {language === 'es' ? 'Extraer Próximos Pasos y Lista de Tareas' : language === 'pt' ? 'Extrair Próximos Passos e Lista de Tarefas' : 'Extract Next Steps & Action Checklist'}</span>
                    <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* TAB 4: QUOTE BUILDER & PDF */}
          {activeTab === 'quote' && opp && (
            <QuickQuoteDrawerTab
              opp={opp}
              person={contactForWhatsApp || undefined}
              company={company || companies.find((c) => c.id === opp.companyId)}
              onUpdateDealAmount={(amt) => updateOpportunity(opp.id, { amount: amt })}
              onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
            />
          )}
        </div>

        {/* Quick WhatsApp Action Modal */}
        <WhatsAppQuickActionModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          recipientName={recipientName}
          recipientPhone={recipientPhone}
          companyName={recipientCompany}
          dealName={opp?.name}
          dealAmount={opp?.amount}
          onLogActivity={(msg) => {
            addActivity({
              type: 'call',
              title: `Mensaje de WhatsApp enviado a ${recipientName || 'contacto'}`,
              content: msg,
              author: currentUser.name,
              targetType: selectedRecord.type as 'opportunity' | 'company' | 'person',
              targetId: selectedRecord.id,
              meta: {
                channel: 'whatsapp',
                recipientPhone,
              },
            });
            showToast('Actividad registrada en el CRM y sincronizada en Firestore', 'success');
          }}
        />
      </motion.div>
    </div>
  );
});
