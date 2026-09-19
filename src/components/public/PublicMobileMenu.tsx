import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  Bot,
  Briefcase,
  Calculator,
  FileSpreadsheet,
  Globe,
  Layers,
  MessageSquare,
  Search,
  Sparkles,
  Store,
  Zap,
  Handshake,
  Users,
} from 'lucide-react';
import { PublicRoutePath, INDUSTRIES_SUBNAV } from './publicRoutes';

interface PublicMobileMenuProps {
  currency: 'ARS' | 'USD';
  isAuthenticated: boolean;
  onNavigate: (path: PublicRoutePath) => void;
  onClose: () => void;
  onToggleCurrency: () => void;
  onOpenWizard: () => void;
  onOpenSimulator: () => void;
  onOpenAudit: () => void;
  onOpenLogin: () => void;
  onEnterApp: () => void;
}

type MobileSection = 'product' | 'industries' | 'resources';

const industryIcon = (path: string) => {
  if (path.includes('agro')) return <Briefcase className="h-4 w-4 text-emerald-600" aria-hidden="true" />;
  if (path.includes('salud')) return <Briefcase className="h-4 w-4 text-rose-600" aria-hidden="true" />;
  if (path.includes('gastronomia')) return <Briefcase className="h-4 w-4 text-orange-600" aria-hidden="true" />;
  if (path.includes('ecommerce')) return <Store className="h-4 w-4 text-cyan-600" aria-hidden="true" />;
  return <Briefcase className="h-4 w-4 text-blue-600" aria-hidden="true" />;
};

export const PublicMobileMenu: React.FC<PublicMobileMenuProps> = ({
  currency,
  isAuthenticated,
  onNavigate,
  onClose,
  onToggleCurrency,
  onOpenWizard,
  onOpenSimulator,
  onOpenAudit,
  onOpenLogin,
  onEnterApp,
}) => {
  const [mobileSection, setMobileSection] = useState<MobileSection>('product');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (path: PublicRoutePath) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className="xl:hidden max-h-[85vh] space-y-4 overflow-y-auto border-b border-slate-200 bg-white px-4 py-4 shadow-xl">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-[#64748b] dark:text-white dark:text-slate-400" aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Buscar módulo, industria o solución..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
          aria-label="Buscar en el menú móvil"
        />
      </div>

      <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
        {([
          ['product', 'Producto'],
          ['industries', 'Industrias'],
          ['resources', 'Recursos'],
        ] as const).map(([section, label]) => (
          <button
            type="button"
            key={section}
            onClick={() => setMobileSection(section)}
            className={`flex-1 rounded-lg py-1.5 text-center transition-colors ${
              mobileSection === section ? 'bg-white font-bold text-blue-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mobileSection === 'product' && (
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => navigate('/clientum-crm')}
            className="flex w-full items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-2.5 text-left text-xs font-bold text-blue-900"
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" aria-hidden="true" />
              CRM 360° Omnicanal
            </span>
            <span className="rounded bg-blue-200 px-1.5 py-0.5 text-[10px] text-blue-800">Ver Demo</span>
          </button>
          {[
            { path: '/producto/whatsapp-ia', label: 'WhatsApp Multiagente & Baileys', icon: MessageSquare, color: 'text-emerald-600' },
            { path: '/producto/erp', label: 'Facturación AFIP con CAE (WSFE)', icon: FileSpreadsheet, color: 'text-blue-600' },
            { path: '/producto/agentes-ia', label: 'Agente OS Autónomo (Gemini 3.7)', icon: Bot, color: 'text-purple-600' },
            { path: '/producto/automatizaciones', label: 'Automatizaciones & Flujos DAG', icon: Zap, color: 'text-amber-600' },
            { path: '/producto/bi', label: 'Business Intelligence & Forecast', icon: BarChart3, color: 'text-blue-600' },
          ].map(({ path, label, icon: Icon, color }) => (
            <button
              type="button"
              key={path}
              onClick={() => navigate(path as PublicRoutePath)}
              className="flex w-full items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}

      {mobileSection === 'industries' && (
        <div className="grid grid-cols-2 gap-1.5">
          {INDUSTRIES_SUBNAV.map((industry) => (
            <button
              type="button"
              key={industry.path}
              onClick={() => navigate(industry.path)}
              className="flex items-center gap-2 truncate rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left text-xs font-semibold text-slate-800 hover:bg-blue-50"
            >
              {industryIcon(industry.path)}
              <span className="truncate">{industry.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      )}

      {mobileSection === 'resources' && (
        <div className="space-y-1.5">
          {[
            ['/precios', 'Planes & Precios'],
            ['/casos', 'Casos de Éxito & Clientes'],
            ['/alianzas', 'Programa de Alianzas'],
            ['/trabajo', 'Trabajá con Nosotros'],
            ['/academia', 'Academia LMS Clientum'],
            ['/servicios', 'Servicios de Implementación'],
            ['/tienda/central', 'Tienda Digital Oficial'],
            ['/dominios', 'Gestor de Dominios & Cloudflare'],
          ].map(([path, label]) => (
            <button
              type="button"
              key={path}
              onClick={() => navigate(path as PublicRoutePath)}
              className="flex w-full items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              {path === '/casos' ? <Award className="h-4 w-4 text-blue-600" aria-hidden="true" /> : null}
              {path === '/alianzas' ? <Handshake className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : null}
              {path === '/trabajo' ? <Users className="h-4 w-4 text-purple-600" aria-hidden="true" /> : null}
              {path === '/servicios' ? <Briefcase className="h-4 w-4 text-blue-600" aria-hidden="true" /> : null}
              {path === '/tienda/central' ? <Store className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : null}
              {path === '/dominios' ? <Globe className="h-4 w-4 text-blue-600" aria-hidden="true" /> : null}
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-slate-200 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">Moneda de visualización:</span>
          <button type="button" onClick={onToggleCurrency} className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-bold text-slate-800">
            {currency === 'ARS' ? 'Pesos (ARS)' : 'Dólares (USD)'}
          </button>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          {!isAuthenticated && (
            <button type="button" onClick={onOpenLogin} className="rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700">
              Iniciar Sesión
            </button>
          )}
          <button
            type="button"
            onClick={onEnterApp}
            className={`rounded-xl bg-blue-600 py-2.5 text-center text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 ${
              isAuthenticated ? 'col-span-2' : ''
            }`}
          >
            {isAuthenticated ? 'Ir al Dashboard' : 'Ingresar al CRM'}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-200 pt-3">
          <button type="button" onClick={() => { onClose(); onOpenWizard(); }} className="flex flex-col items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 p-2 text-center text-[11px] font-bold text-blue-900">
            <Calculator className="h-4 w-4 text-blue-600" aria-hidden="true" />
            Cotizador
          </button>
          <button type="button" onClick={() => { onClose(); onOpenSimulator(); }} className="flex flex-col items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-center text-[11px] font-bold text-emerald-900">
            <Bot className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Simulador
          </button>
          <button type="button" onClick={() => { onClose(); onOpenAudit(); }} className="flex flex-col items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 p-2 text-center text-[11px] font-bold text-amber-900">
            <Sparkles className="h-4 w-4 text-amber-600" aria-hidden="true" />
            Auditoría
          </button>
        </div>
      </div>
    </div>
  );
};