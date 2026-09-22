import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Kanban, 
  Boxes, 
  Workflow, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2,
  Zap,
  Globe
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface TutorialStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  actionTab?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: '¡Bienvenido a Clientum Cloud CRM!',
    subtitle: 'Tu ecosistema comercial inteligente',
    description: 'Clientum Cloud centraliza tu CRM, ERP, WhatsApp, automatizaciones y asistencia de IA en una plataforma rápida y robusta. Con este tour rápido, descubre las funciones clave para acelerar tus ventas.',
    icon: Sparkles,
    badge: 'Introducción'
  },
  {
    title: 'Tablero Kanban Comercial',
    subtitle: 'Gestión visual de oportunidades y tratos',
    description: 'Controla cada etapa de tu embudo de ventas en tiempo real. Arrastra tarjetas entre columnas, actualiza montos, prioriza tratos calientes y automatiza notificaciones instantáneas.',
    icon: Kanban,
    badge: 'Módulo Clave',
    actionTab: 'opportunities'
  },
  {
    title: 'Hub de Ecosistemas (Módulos Migrados)',
    subtitle: 'Personaliza tu arquitectura modular',
    description: 'Organiza y reordena la prioridad de tus módulos migrados con arrastrar y soltar (Drag & Drop) o botones de prioridad rápida. Activa ERP, WhatsApp, Mapas o Automatizaciones con un solo clic.',
    icon: Boxes,
    badge: 'Personalización',
    actionTab: 'ecosystemHub'
  },
  {
    title: 'IA Copilot & Acceso Sin Conexión',
    subtitle: 'Inteligencia en vivo y resiliencia offline',
    description: 'Consulta sugerencias comerciales con Gemini AI en cualquier momento y navega por el contenido de tu dashboard incluso sin conexión a internet gracias al almacenamiento en caché del Service Worker.',
    icon: Zap,
    badge: 'Tecnología Avanzada'
  }
];

export const TutorialOnboardingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { setActiveTab } = useCRM();

  useEffect(() => {
    const hasSeen = localStorage.getItem('clientum_has_seen_onboarding');
    if (!hasSeen) {
      // Mostrar al primer acceso tras un pequeño retraso
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('clientum_has_seen_onboarding', 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const stepInfo = TUTORIAL_STEPS[nextStep];
      if (stepInfo.actionTab) {
        setActiveTab(stepInfo.actionTab as any);
      }
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const stepInfo = TUTORIAL_STEPS[prevStep];
      if (stepInfo.actionTab) {
        setActiveTab(stepInfo.actionTab as any);
      }
    }
  };

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[var(--bg-card)] dark:bg-slate-900 rounded-2xl shadow-2xl border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 overflow-hidden">
        {/* Cabecera decorativa */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-secondary)] dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800 transition"
          title="Omitir tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Indicador de progreso */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              {step.badge}
            </span>
            <div className="flex items-center gap-1.5">
              {TUTORIAL_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${ idx === currentStep ? 'w-6 bg-blue-600' : idx < currentStep ? 'w-1.5 bg-blue-400' : 'w-1.5 bg-[var(--bg-muted)] dark:bg-slate-700' }`}
                />
              ))}
            </div>
          </div>

          {/* Icono y Títulos */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-inner">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">
                {step.title}
              </h2>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                {step.subtitle}
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-[var(--bg-muted)] dark:bg-slate-950/50 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 rounded-xl p-4 mb-8 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 text-sm leading-relaxed">
            {step.description}
          </div>

          {/* Acciones inferiores */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
            <button
              onClick={handleClose}
              className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] dark:hover:text-[var(--text-secondary,#475569)] dark:hover:text-slate-300 transition"
            >
              Omitir tour
            </button>

            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 bg-[var(--bg-card)] dark:bg-slate-800 border border-[var(--border-default)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 rounded-xl hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-blue-500/20 transition flex items-center gap-1.5"
              >
                {currentStep === TUTORIAL_STEPS.length - 1 ? (
                  <>
                    ¡Empezar a usar CRM!
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
