import { useState, useEffect, useRef, useCallback } from 'react';

// Declare types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognitionInstance;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognitionInstance;
    };
  }
}

export interface VoiceTranscriptionOptions {
  language?: string;
  autoPunctuation?: boolean;
  onTranscriptChange?: (text: string, isFinal: boolean) => void;
}

// Convert common spoken punctuation commands in Spanish / English / Portuguese
export function formatSpokenPunctuation(text: string, lang = 'es-AR'): string {
  let formatted = text;
  
  if (lang.startsWith('es')) {
    formatted = formatted
      .replace(/\s+punto y aparte/gi, '.\n\n')
      .replace(/\s+punto y seguido/gi, '. ')
      .replace(/\s+punto/gi, '.')
      .replace(/\s+coma/gi, ',')
      .replace(/\s+dos puntos/gi, ':')
      .replace(/\s+punto y coma/gi, ';')
      .replace(/\s+signo de interrogación/gi, '?')
      .replace(/\s+signo de pregunta/gi, '?')
      .replace(/\s+cerrar pregunta/gi, '?')
      .replace(/\s+abrir pregunta/gi, ' ¿')
      .replace(/\s+signo de exclamación/gi, '!')
      .replace(/\s+cerrar admiración/gi, '!')
      .replace(/\s+abrir admiración/gi, ' ¡')
      .replace(/\s+nueva línea/gi, '\n')
      .replace(/\s+nuevo renglón/gi, '\n')
      .replace(/\s+nuevo párrafo/gi, '\n\n')
      .replace(/\s+abrir comillas/gi, ' "')
      .replace(/\s+cerrar comillas/gi, '" ')
      .replace(/\s+arroba/gi, '@')
      .replace(/\s+barra/gi, '/');
  } else if (lang.startsWith('en')) {
    formatted = formatted
      .replace(/\s+period/gi, '.')
      .replace(/\s+full stop/gi, '.')
      .replace(/\s+comma/gi, ',')
      .replace(/\s+colon/gi, ':')
      .replace(/\s+semicolon/gi, ';')
      .replace(/\s+question mark/gi, '?')
      .replace(/\s+exclamation mark/gi, '!')
      .replace(/\s+new line/gi, '\n')
      .replace(/\s+new paragraph/gi, '\n\n')
      .replace(/\s+open quote/gi, ' "')
      .replace(/\s+close quote/gi, '" ')
      .replace(/\s+at sign/gi, '@');
  } else if (lang.startsWith('pt')) {
    formatted = formatted
      .replace(/\s+ponto final/gi, '.')
      .replace(/\s+ponto/gi, '.')
      .replace(/\s+vírgula/gi, ',')
      .replace(/\s+dois pontos/gi, ':')
      .replace(/\s+ponto e vírgula/gi, ';')
      .replace(/\s+ponto de interrogação/gi, '?')
      .replace(/\s+ponto de exclamação/gi, '!')
      .replace(/\s+nova linha/gi, '\n')
      .replace(/\s+novo parágrafo/gi, '\n\n');
  }

  // Capitalize after periods, question marks, exclamation marks, or newlines
  formatted = formatted.replace(/(^|[.!?\n]\s+)([a-záéíóúñ])/g, (match, prefix, char) => {
    return prefix + char.toUpperCase();
  });

  return formatted;
}

export function useVoiceTranscription({
  language = 'es-AR',
  autoPunctuation = true,
  onTranscriptChange
}: VoiceTranscriptionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isSupported = typeof window !== 'undefined' && 
    (Boolean(window.SpeechRecognition || window.webkitSpeechRecognition) || 
     Boolean(navigator?.mediaDevices?.getUserMedia));

  // Clean up audio analysis and timer
  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Initialize live audio waveform visualizer from microphone stream
  const startAudioVisualizer = useCallback(async (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume level between 0 and 100
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(normalized);

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Audio visualizer could not be initialized:', err);
    }
  }, []);

  // Transcribe recorded audio with server AI fallback if browser recognition is unavailable
  const transcribeWithServerAI = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const response = await fetch('/api/ai/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Data,
              mimeType: blob.type || 'audio/webm'
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }

          const data = await response.json();
          resolve(data.text || '');
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read audio blob'));
      reader.readAsDataURL(blob);
    });
  };

  // Start Voice-to-Text Dictation
  const startListening = useCallback(async () => {
    setError(null);
    setTranscript('');
    setInterimText('');
    setDuration(0);

    try {
      // 1. Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      mediaStreamRef.current = stream;

      // 2. Start audio level visualizer
      startAudioVisualizer(stream);

      // 3. Start timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 500);

      // 4. Try native Web Speech Recognition
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        let accumulatedTranscript = '';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const item = event.results[i];
            const text = item[0].transcript;

            if (item.isFinal) {
              currentFinal += text + ' ';
            } else {
              currentInterim += text;
            }
          }

          if (currentFinal) {
            const formattedChunk = autoPunctuation 
              ? formatSpokenPunctuation(currentFinal, selectedLanguage) 
              : currentFinal;
            
            accumulatedTranscript += (accumulatedTranscript ? ' ' : '') + formattedChunk.trim();
            setTranscript(accumulatedTranscript);
            onTranscriptChange?.(accumulatedTranscript, true);
          }

          setInterimText(currentInterim);
          if (currentInterim && onTranscriptChange) {
            const fullPreview = accumulatedTranscript 
              ? `${accumulatedTranscript} ${currentInterim}` 
              : currentInterim;
            onTranscriptChange(fullPreview, false);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed') {
            setError('Permiso de micrófono denegado en el navegador.');
          } else if (event.error === 'network') {
            setError('Problema de conexión con el servicio de voz. Activando grabadora de audio...');
          } else if (event.error !== 'no-speech') {
            setError(`Error de reconocimiento de voz (${event.error})`);
          }
        };

        recognition.onend = () => {
          // If stopped by user, recognition ends gracefully
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } else {
        // Fallback: Use MediaRecorder + AI Transcription API
        if (typeof MediaRecorder !== 'undefined') {
          audioChunksRef.current = [];
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          mediaRecorder.start(250);
          setIsListening(true);
        } else {
          setError('El navegador no soporta captura de micrófono ni dictado por voz.');
        }
      }
    } catch (err: any) {
      console.error('Error starting voice dictation:', err);
      cleanupAudio();
      setIsListening(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Acceso al micrófono denegado. Permite el uso del micrófono para dictar mensajes.');
      } else {
        setError(err.message || 'No se pudo iniciar el dictado por voz.');
      }
    }
  }, [selectedLanguage, autoPunctuation, onTranscriptChange, startAudioVisualizer, cleanupAudio]);

  // Stop listening and finalize transcript
  const stopListening = useCallback(async (): Promise<string> => {
    setIsListening(false);

    // Stop native recognition if running
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    // Stop MediaRecorder if running
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      setIsProcessing(true);
      try {
        const audioBlob = await new Promise<Blob>((resolve) => {
          if (!mediaRecorderRef.current) {
            resolve(new Blob());
            return;
          }
          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
            resolve(blob);
          };
          mediaRecorderRef.current.stop();
        });

        if (audioBlob.size > 0 && !transcript) {
          const aiTranscribed = await transcribeWithServerAI(audioBlob);
          if (aiTranscribed) {
            const finalFormatted = autoPunctuation 
              ? formatSpokenPunctuation(aiTranscribed, selectedLanguage) 
              : aiTranscribed;
            setTranscript(finalFormatted);
            cleanupAudio();
            setIsProcessing(false);
            return finalFormatted;
          }
        }
      } catch (err) {
        console.warn('AI transcription fallback error:', err);
      }
      setIsProcessing(false);
    }

    cleanupAudio();

    const finalText = (transcript + (interimText ? ' ' + interimText : '')).trim();
    const formattedFinal = autoPunctuation 
      ? formatSpokenPunctuation(finalText, selectedLanguage) 
      : finalText;
    
    setTranscript(formattedFinal);
    setInterimText('');
    return formattedFinal;
  }, [transcript, interimText, autoPunctuation, selectedLanguage, cleanupAudio]);

  // Cancel and discard voice input
  const cancelListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      mediaRecorderRef.current = null;
    }
    cleanupAudio();
    setIsListening(false);
    setIsProcessing(false);
    setTranscript('');
    setInterimText('');
    setDuration(0);
    setError(null);
  }, [cleanupAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelListening();
    };
  }, [cancelListening]);

  return {
    isListening,
    isProcessing,
    transcript,
    interimText,
    audioLevel,
    duration,
    error,
    isSupported,
    selectedLanguage,
    setSelectedLanguage,
    startListening,
    stopListening,
    cancelListening,
    setTranscript
  };
}
