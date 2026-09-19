import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Share2,
  ShieldAlert,
  Award
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const ExpressAuditModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { showToast, triggerConfetti } = useCRM();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  if (!isOpen) return null;

  const questions = [
    {
      q: '¿Cómo gestiona hoy tu equipo las consultas de clientes que entran por WhatsApp?',
      options: [
        { text: 'Cada vendedor usa su celular personal sin supervisión central', points: 10 },
        { text: 'Tenemos WhatsApp Web abierto en una computadora compartida', points: 20 },
        { text: 'Usamos una plataforma básica pero sin automatizaciones ni IA', points: 40 },
        { text: 'Tenemos una plataforma multiagente integrada al CRM', points: 50 }
      ]
    },
    {
      q: '¿Cuánto tiempo tarda tu empresa en emitir y conciliar facturas de AFIP tras cerrar una venta?',
      options: [
        { text: 'Días o semanas; el contador carga todo a fin de mes manualmente', points: 10 },
        { text: 'Varias horas de carga manual en la página de AFIP Comprobantes en Línea', points: 20 },
        { text: 'El mismo día usando un software local no conectado al CRM', points: 35 },
        { text: 'Instantáneo (< 2 seg) con CAE automático desde la oportunidad ganada', points: 50 }
      ]
    },
    {
      q: '¿Qué porcentaje de cotizaciones o propuestas comerciales enviadas reciben seguimiento estructurado?',
      options: [
        { text: 'Menos del 25%; dependemos de que el cliente vuelva a escribir', points: 10 },
        { text: 'Aproximadamente la mitad, si el vendedor recuerda hacer la llamada', points: 25 },
        { text: 'La mayoría, pero sin registro centralizado ni alertas de vencimiento', points: 35 },
        { text: '100% de las propuestas con recordatorios automáticos por WhatsApp', points: 50 }
      ]
    },
    {
      q: '¿Qué sucede cuando un cliente potencial consulta fuera del horario comercial (noches / fin de semana)?',
      options: [
        { text: 'Nadie responde hasta el siguiente día hábil (se enfría el lead)', points: 10 },
        { text: 'Un mensaje fijo de auto-respuesta genérico que pide esperar', points: 20 },
        { text: 'Un bot con opciones fijas que no resuelve dudas concretas', points: 30 },
        { text: 'Un Agente IA responde con catálogo, califica y agenda la reunión', points: 50 }
      ]
    }
  ];

  const handleSelectOption = (points: number) => {
    const updated = [...answers, points];
    setAnswers(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCalculated(true);
      triggerConfetti();
    }
  };

  const totalPoints = answers.reduce((a, b) => a + b, 0);
  const maxPoints = questions.length * 50;
  const scorePercent = Math.round((totalPoints / maxPoints) * 100);

  const getScoreDiagnosis = () => {
    if (scorePercent < 40) {
      return {
        level: 'Digitalización Temprana • Alto Riesgo de Pérdida de Clientes',
        badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
        recommendation: 'Tu empresa está perdiendo entre el 30% y 45% de leads por demoras en respuesta y falta de trazabilidad. La prioridad número 1 es unificar WhatsApp multiagente y automatizar respuestas fuera de horario.'
      };
    } else if (scorePercent < 75) {
      return {
        level: 'Digitalización Intermedia • Gran Potencial de Escala',
        badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
        recommendation: 'Cuentas con herramientas básicas pero existen cuellos de botella en la facturación y el seguimiento de propuestas. Integrar AFIP y un pipeline Kanban te permitirá liberar 20+ horas al mes.'
      };
    } else {
      return {
        level: 'Madurez Digital Avanzada • Preparado para Agentes IA Autónomos',
        badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
        recommendation: 'Tu operativa comercial es sólida. El siguiente gran salto de productividad es desplegar Agente OS con 14 roles especializados para prospección saliente y scoring predictivo MEDDIC.'
      };
    }
  };

  const diagnosis = getScoreDiagnosis();

  const handleConsultExpertWhatsApp = () => {
    const text = `📊 *Resultado de mi Auditoría Digital Clientum*\n\n` +
      `Puntaje obtenido: *${scorePercent}/100*\n` +
      `Diagnóstico: *${diagnosis.level}*\n\n` +
      `Me gustaría coordinar una sesión express de 15 minutos para ver cómo optimizar mis procesos comerciales y facturación.`;

    window.open(`https://wa.me/542984510883?text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 text-xs font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Auditoría Digital Express (1 Minuto)</h2>
              <p className="text-[11px] text-slate-500">Diagnóstico automático de madurez comercial y fiscal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isCalculated ? (
          /* Question step */
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Pregunta {currentStep + 1} de {questions.length}</span>
              <span>{Math.round(((currentStep) / questions.length) * 100)}% completado</span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>

            <h3 className="font-bold text-slate-900 text-sm pt-2 leading-relaxed">
              {questions[currentStep].q}
            </h3>

            <div className="space-y-2.5 pt-2">
              {questions[currentStep].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.points)}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs text-slate-800 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
                >
                  <span>{opt.text}</span>
                  <ArrowRight className="w-4 h-4 text-[#0f172a] dark:text-white dark:text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Diagnosis result */
          <div className="space-y-5 py-2">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Puntaje de Madurez Digital
              </span>
              <div className="text-5xl font-black text-blue-600 flex items-center justify-center gap-2">
                <span>{scorePercent}</span>
                <span className="text-xl text-[#0f172a] dark:text-white dark:text-slate-400 font-bold">/ 100</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${diagnosis.badgeColor}`}>
                {diagnosis.level}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Recomendación del Diagnóstico:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {diagnosis.recommendation}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleConsultExpertWhatsApp}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <Share2 className="w-4 h-4" />
                <span>Enviar Diagnóstico a un Asesor por WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
