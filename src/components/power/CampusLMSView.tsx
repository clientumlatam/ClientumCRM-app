import React, { useState } from 'react';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  FileText,
  Award,
  BookOpen,
  Sparkles,
  Download,
  Share2,
  Clock,
  ArrowRight,
  Code,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { CLIENTUM_COURSES } from '../../data/clientumCatalog';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'sandbox';
  isCompleted: boolean;
  content: string;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export const CampusLMSView: React.FC = () => {
  const { currentUser, showToast, triggerConfetti } = useCRM();

  const [selectedCourseId, setSelectedCourseId] = useState('crs-2');
  const [selectedLessonId, setSelectedLessonId] = useState('l-1');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: 'mod-1',
      title: 'Módulo 1: Fundamentos del Pipeline Comercial y Kanban',
      lessons: [
        {
          id: 'l-1',
          title: '1.1 Arquitectura del Embudo B2B y Ciclo de Venta',
          duration: '8 min',
          type: 'video',
          isCompleted: true,
          content: 'En esta lección aprenderás a diagramar los estados críticos de tu embudo comercial: Lead Inbound, Contacto Calificado, Propuesta Presentada, Negociación y Cierre Ganado.'
        },
        {
          id: 'l-2',
          title: '1.2 Configuración Práctica de Oportunidades y Roles',
          duration: '12 min',
          type: 'sandbox',
          isCompleted: true,
          content: 'Practica arrastrar tarjetas entre etapas del Kanban y configurar campos personalizados para registrar motivos de pérdida y fecha estimada de cierre.'
        }
      ]
    },
    {
      id: 'mod-2',
      title: 'Módulo 2: Automatización con Chatbots de WhatsApp IA',
      lessons: [
        {
          id: 'l-3',
          title: '2.1 Conexión de Gateway Baileys y Meta Cloud API',
          duration: '10 min',
          type: 'video',
          isCompleted: true,
          content: 'Explicación técnica de la vinculación por código QR y el uso del Webhook oficial de Meta para recibir mensajes entrantes de clientes sin caídas.'
        },
        {
          id: 'l-4',
          title: '2.2 Entrenamiento del Agente Gemini con Catálogo Propio',
          duration: '15 min',
          type: 'text',
          isCompleted: false,
          content: 'Cómo estructurar el prompt de sistema y las respuestas rápidas para que el bot responda con precios precisos en moneda local y derive a un vendedor humano.'
        }
      ]
    },
    {
      id: 'mod-3',
      title: 'Módulo 3: Facturación Electrónica AFIP y Cierre Contable',
      lessons: [
        {
          id: 'l-5',
          title: '3.1 Emisión de Facturas A y B con CAE Automático',
          duration: '9 min',
          type: 'sandbox',
          isCompleted: false,
          content: 'Flujo completo de facturación desde una oportunidad ganada en el CRM hacia el Web Service de AFIP, obteniendo el código CAE de 14 dígitos en menos de 2 segundos.'
        }
      ]
    }
  ]);

  const allLessons = modules.flatMap(m => m.lessons);
  const completedCount = allLessons.filter(l => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  const activeLesson = allLessons.find(l => l.id === selectedLessonId) || allLessons[0];

  const handleToggleComplete = (lessonId: string) => {
    setModules(prev =>
      prev.map(mod => ({
        ...mod,
        lessons: mod.lessons.map(l =>
          l.id === lessonId ? { ...l, isCompleted: !l.isCompleted } : l
        )
      }))
    );

    const isNowCompleted = !activeLesson.isCompleted;
    if (isNowCompleted) {
      showToast('¡Lección completada con éxito!', 'success');
      if (completedCount + 1 === allLessons.length) {
        triggerConfetti();
        setShowCertificateModal(true);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Módulo 7.1
            </span>
            <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              Campus Academia LMS Clientum
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Plataforma de capacitación interactiva para equipos de ventas, automatizadores y directores comerciales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] shadow-xs">
            <span className="text-[11px] text-[var(--text-secondary)]">Progreso del Curso:</span>
            <div className="w-24 h-2 rounded-full bg-[var(--bg-muted)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[var(--text-primary)]">{progressPercent}%</span>
          </div>

          <button
            onClick={() => setShowCertificateModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Ver Certificado</span>
          </button>
        </div>
      </div>

      {/* Main LMS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Syllabus & Module Tree (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <h3 className="font-bold text-[var(--text-primary)] text-xs flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Contenido del Programa
            </h3>

            <div className="space-y-3">
              {modules.map((mod) => (
                <div key={mod.id} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[var(--text-secondary)] px-1">{mod.title}</div>
                  <div className="space-y-1">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all shadow-xs ${ selectedLessonId === lesson.id ? 'bg-[var(--bg-card)] border-blue-400 text-blue-950 font-bold' : 'bg-[var(--bg-card)]/80 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]' }`}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleComplete(lesson.id);
                            }}
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors cursor-pointer ${ lesson.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[var(--border-default)] hover:border-amber-500 bg-[var(--bg-card)]' }`}
                          >
                            {lesson.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <span>{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Lesson Player / Sandbox (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-5 shadow-xs">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                  Lección Actual
                </span>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">{activeLesson.title}</h2>
              </div>

              <button
                onClick={() => handleToggleComplete(activeLesson.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${ activeLesson.isCompleted ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700 text-white' }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeLesson.isCompleted ? 'Completada' : 'Marcar como Completada'}</span>
              </button>
            </div>

            {/* Video / Visual Simulator Sandbox */}
            <div className="h-64 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex flex-col items-center justify-center relative overflow-hidden text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 cursor-pointer hover:scale-105 transition-transform">
                <Play className="w-6 h-6 ml-0.5 fill-current" />
              </div>
              <div>
                <span className="font-bold text-[var(--text-primary)] text-xs block">Reproductor Multimedia Interactivo</span>
                <span className="text-[11px] text-[var(--text-muted)]">Audio, subtítulos en español y marcadores clave de la clase</span>
              </div>
            </div>

            {/* Notes & Reading Material */}
            <div className="space-y-2">
              <h4 className="font-bold text-[var(--text-primary)] text-xs flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Guía de Estudio & Resumen
              </h4>
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] leading-relaxed text-xs shadow-xs">
                {activeLesson.content}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[var(--bg-card)] text-[var(--text-primary)] rounded-3xl shadow-2xl p-8 space-y-6 relative border-4 border-amber-400 font-sans">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-2 border-b border-[var(--border-subtle)] pb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white mx-auto flex items-center justify-center font-extrabold text-xl shadow-xs">
                C
              </div>
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Certificado Oficial de Especialización
              </h2>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold">
                Clientum Latam Academy • Programa Certificado 2026
              </p>
            </div>

            <div className="text-center space-y-4 py-2">
              <p className="text-xs text-[var(--text-secondary)]">Por cuanto ha aprobado satisfactoriamente todos los módulos de:</p>
              <h3 className="text-xl font-bold text-amber-600">
                CRM Clientum: Ventas, Kanban y Pipeline Inteligente
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Se otorga la presente acreditación a:</p>
              <div className="text-2xl font-black text-[var(--text-primary)] underline decoration-amber-400 decoration-2">
                {currentUser?.name || 'Profesional Certificado'}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-[11px] text-[var(--text-muted)]">
              <div>
                <span>ID Credencial: </span>
                <span className="font-mono text-[var(--text-primary)] font-bold">CLI-CERT-2026-9812</span>
              </div>
              <div>
                <span>Fecha: </span>
                <span className="font-bold text-[var(--text-primary)]">{new Date().toLocaleDateString('es-AR')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  showToast('Preparando certificado para impresión', 'info');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Diploma PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
