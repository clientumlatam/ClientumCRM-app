import React from 'react';
import { Phone, Mail, ShieldCheck, Sparkles, HelpCircle, GraduationCap, ChevronRight, Activity } from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';

interface PublicTopHeaderProps {
  onNavigate: (path: PublicRoutePath) => void;
  currency: 'ARS' | 'USD';
  onToggleCurrency: () => void;
  onOpenAudit: () => void;
}

export const PublicTopHeader: React.FC<PublicTopHeaderProps> = ({
  onNavigate,
  currency,
  onToggleCurrency,
  onOpenAudit,
}) => {
  return (
    <div
      id="public-top-header-bar"
      className="bg-[#eef1f6] dark:bg-[#0F172A] text-[#475569] dark:text-slate-300 border-b border-[#e2e8f0] dark:border-slate-800 text-[11px] font-['Plus_Jakarta_Sans',sans-serif] z-50 relative select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
        
        {/* Left Side: System Status, Contact & WhatsApp */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">Sistema Operativo</span>
            <span className="font-bold">99.99% Uptime</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[#64748b] dark:text-white dark:text-slate-400">
            <a
              href="https://wa.me/5492984510883?text=Hola%20Clientum%20CRM,%20quisiera%20más%20información."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+54 298 451-0883</span>
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="mailto:info@clientum.com.ar"
              className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <Mail className="w-3 h-3 text-blue-400" />
              <span>info@clientum.com.ar</span>
            </a>
          </div>
        </div>

        {/* Center: Dynamic Announcement Banner */}
        <div className="hidden lg:flex items-center gap-2 overflow-hidden text-center truncate">
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold tracking-wide uppercase shrink-0">
            V6.0 RELEASE
          </span>
          <button
            onClick={() => onNavigate('/producto/whatsapp-ia')}
            className="text-[#334155] dark:text-white dark:text-slate-200 hover:text-[#0f172a] hover:dark:text-white hover:dark:text-white font-medium hover:underline transition-all truncate flex items-center gap-1 cursor-pointer"
          >
            <span>CRM 360° + Bot WhatsApp Multiagente IA + Facturación AFIP CAE en tiempo real</span>
            <ChevronRight className="w-3 h-3 text-blue-400 shrink-0" />
          </button>
        </div>

        {/* Right Side: Quick Utilities & Currency Switcher */}
        <div className="flex items-center gap-3 shrink-0 ml-auto lg:ml-0">
          <button
            onClick={onOpenAudit}
            className="hidden sm:flex items-center gap-1 text-[#475569] dark:text-white dark:text-slate-300 hover:text-amber-300 transition-colors cursor-pointer font-semibold"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Auditoría Express</span>
          </button>

          <button
            onClick={() => onNavigate('/academia')}
            className="hidden sm:flex items-center gap-1 text-[#475569] dark:text-white dark:text-slate-300 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <GraduationCap className="w-3 h-3 text-blue-400" />
            <span>Academia LMS</span>
          </button>

          <button
            onClick={() => onNavigate('/ayuda')}
            className="flex items-center gap-1 text-[#475569] dark:text-white dark:text-slate-300 hover:text-[#0f172a] hover:dark:text-white hover:dark:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3 h-3 text-[#64748b] dark:text-white dark:text-slate-400" />
            <span className="hidden xs:inline">Ayuda</span>
          </button>

          {/* Currency Toggle in Top Header */}
          <button
            onClick={onToggleCurrency}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-700 border border-[#cbd5e1] dark:border-slate-700 text-[#334155] dark:text-white dark:text-slate-200 hover:text-[#0f172a] hover:dark:text-white hover:dark:text-white font-bold text-[10px] transition-colors cursor-pointer"
            title="Cambiar moneda entre Pesos Argentinos (ARS) y Dólares (USD)"
          >
            <span>Moneda:</span>
            <span className={currency === 'ARS' ? 'text-emerald-400 font-extrabold' : 'text-sky-400 font-extrabold'}>
              {currency}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
