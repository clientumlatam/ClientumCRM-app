import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Calendar,
  FileDown,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'chatbot' | 'demo' | 'proposal' | 'activation';
  title: string;
  company: string;
  location: string;
  timeAgo: string;
  actionText: string;
}

export const PublicActivityTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const activities: ActivityItem[] = [
    {
      id: 'act-1',
      type: 'chatbot',
      title: 'Nueva consulta de Chatbot IA',
      company: 'Distribuidora Patagónica',
      location: 'Neuquén, Argentina',
      timeAgo: 'Hace 4 minutos',
      actionText: 'Contacto',
    },
    {
      id: 'act-2',
      type: 'demo',
      title: 'Agendamento de Demo WhatsApp IA',
      company: 'Clínica Odontológica DentalCare',
      location: 'Rio de Janeiro, Brasil',
      timeAgo: 'Hace 18 minutos',
      actionText: 'Demo Agendada',
    },
    {
      id: 'act-3',
      type: 'proposal',
      title: 'Descarga de Propuesta Técnica en PDF',
      company: 'Inmobiliaria & Real Estate Group',
      location: 'Córdoba, Argentina',
      timeAgo: 'Hace 25 minutos',
      actionText: 'Propuesta PDF',
    },
    {
      id: 'act-4',
      type: 'activation',
      title: 'Activación de CRM + Facturación AFIP',
      company: 'Estudio Jurídico & Asociados',
      location: 'Buenos Aires, Argentina',
      timeAgo: 'Hace 12 minutos',
      actionText: 'Live CAE',
    },
  ];

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, [activities.length, isDismissed]);

  if (isDismissed) return null;

  const current = activities[currentIndex];

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'chatbot':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'demo':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'proposal':
        return <FileDown className="w-4 h-4 text-purple-400" />;
      case 'activation':
        return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
    }
  };

  const getBadgeColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'chatbot':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'demo':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'proposal':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'activation':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <aside
      aria-label="Notificaciones de actividad en vivo"
      className={`fixed bottom-5 left-5 z-40 max-w-xs sm:max-w-sm transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-[#0f172a] dark:text-white border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl flex items-start gap-3 relative group">
        
        {/* Type Icon Badge */}
        <div className="p-2 rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 border border-[#cbd5e1] dark:border-[#cbd5e1] dark:border-slate-700 shrink-0 mt-0.5">
          {getIcon(current.type)}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-1">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getBadgeColor(current.type)}`}>
              {current.actionText}
            </span>
            <span className="text-[10px] text-[#0f172a] dark:text-white dark:text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              {current.timeAgo}
            </span>
          </div>

          <div className="text-xs font-bold text-[#0f172a] dark:text-white dark:text-slate-100 truncate">
            {current.title}
          </div>

          <div className="text-[11px] font-medium text-emerald-300 truncate">
            {current.company}
          </div>

          <div className="text-[10px] text-[#0f172a] dark:text-white dark:text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{current.location}</span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-500 hover:text-[#0f172a] hover:dark:text-white hover:dark:text-slate-300 p-1 rounded-md transition-colors cursor-pointer shrink-0"
          title="Ocultar notificaciones"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
