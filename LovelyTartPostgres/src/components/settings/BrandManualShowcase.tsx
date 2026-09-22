import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Download,
  Code,
  Sun,
  ChevronRight,
  ChevronLeft,
  Settings2,
  Activity,
  Bell,
  Users,
  FileText
} from 'lucide-react';
import { ClientumLogo } from '../common/ClientumLogo';
import { useTheme } from '../../context/ThemeContext';

interface ColorToken {
  name: string;
  role: string;
  hex: string;
  usage: string;
  textColor: string;
  border?: boolean;
}

const BRAND_COLORS: ColorToken[] = [
  {
    name: 'Navy',
    role: 'Color Primario',
    hex: '#022046',
    usage: 'Fondo institucional, encabezados primarios y elementos de confianza.',
    textColor: '#FFFFFF',
  },
  {
    name: 'Blue',
    role: 'Color Corporativo',
    hex: '#002B5C',
    usage: 'Estructura corporativa, hover states y enlaces institucionales.',
    textColor: '#FFFFFF',
  },
  {
    name: 'Action',
    role: 'Color de Acción',
    hex: '#0056B3',
    usage: 'Botones primarios, llamadas a la acción (CTAs) y estados activos.',
    textColor: '#FFFFFF',
  },
  {
    name: 'Success',
    role: 'Color de Éxito',
    hex: '#4CAF50',
    usage: 'Confirmaciones, métricas positivas, leads ganados y facturación.',
    textColor: '#FFFFFF',
  },
  {
    name: 'Surface',
    role: 'Superficie de Interfaz',
    hex: '#F5F7FA',
    usage: 'Canvas base y fondos de interfaz; garantiza descanso visual editorial.',
    textColor: '#212121',
    border: true,
  },
  {
    name: 'Ink',
    role: 'Texto Principal',
    hex: '#212121',
    usage: 'Texto primario de alta legibilidad editorial con contraste WCAG AAA.',
    textColor: '#FFFFFF',
  },
];

export const BrandManualShowcase: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeSegment, setActiveSegment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'slides'>('grid');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const exportCSS = () => {
    const css = `:root, [data-theme="clarity"] {
  --color-navy: #022046;
  --color-corporate-blue: #002B5C;
  --color-action: #0056B3;
  --color-success: #4CAF50;
  --clientum-surface: #F5F7FA;
  --clientum-surface-card: #FFFFFF;
  --clientum-ink: #022046;
  --border-subtle: #E2E8F0;
}`;
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientum-clarity-theme.css';
    a.click();
    setDownloadSuccess('CSS descargado');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const exportJSON = () => {
    const tokens = {
      name: "Clientum Clarity Theme",
      version: "1.0",
      updatedAt: "Septiembre 2026",
      colors: BRAND_COLORS,
      typography: { family: "Inter, Arial, sans-serif" },
      promise: "Menos tareas manuales. Más control. Más crecimiento."
    };
    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientum-clarity-tokens.json';
    a.click();
    setDownloadSuccess('Tokens JSON descargados');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* Top Banner Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Configuración del Espacio de Trabajo</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configura temas visuales, idioma, campos de base de datos personalizados, permisos y datos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 text-xs font-bold">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Clientum Clarity · Modo claro</span>
          </span>
          <button
            onClick={() => setTheme('clarity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
              theme === 'clarity' || theme === 'light'
                ? 'bg-blue-600 text-white ring-2 ring-blue-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50'
            }`}
          >
            {theme === 'clarity' ? '✓ Tema Activo' : 'Activar Tema Clarity'}
          </button>
        </div>
      </div>

      {/* Sub-nav Tabs Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs border-b border-slate-200/80 dark:border-slate-800 scrollbar-none">
        <button className="p-1 rounded text-slate-400 hover:text-slate-600">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-medium shrink-0">
          <Settings2 className="w-3.5 h-3.5" />
          <span>Configuración Workspace</span>
        </button>

        <button className="px-3 py-1.5 rounded-lg bg-[#022046] text-white flex items-center gap-1.5 font-bold shrink-0 shadow-xs">
          <span>📘 Manual de Marca v1.0</span>
          <span className="px-1.5 py-0.2 rounded bg-blue-500/30 text-[9px] font-mono">Identidad</span>
        </button>

        <button className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-medium shrink-0">
          <Activity className="w-3.5 h-3.5" />
          <span>Salud de Integraciones</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono">Ping Tests</span>
        </button>

        <button className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-medium shrink-0">
          <Bell className="w-3.5 h-3.5" />
          <span>Notificaciones & Webhooks</span>
        </button>

        <button className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-medium shrink-0">
          <Users className="w-3.5 h-3.5" />
          <span>Roles & Permisos (RBAC)</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[9px] font-bold">5</span>
        </button>

        <button className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 font-medium shrink-0">
          <FileText className="w-3.5 h-3.5" />
          <span>Auditoría & Logs</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[9px] font-mono">3 Alerta</span>
        </button>

        <button className="p-1 rounded text-slate-400 hover:text-slate-600 ml-auto">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Manual Header Card */}
      <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#022046] flex items-center justify-center text-white border border-blue-400/30 shrink-0 shadow-md">
              <ClientumLogo variant="isotipo" size="md" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  MANUAL DE MARCA — ClientumOS
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700 text-[10px] font-mono font-bold">
                  Versión 1.0 · Septiembre 2026
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                Sistema de identidad visual, tipográfica, cromática y verbal oficial de Clientum.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={exportCSS}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Exportar CSS</span>
            </button>
            <button
              onClick={exportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0056B3] hover:bg-[#002B5C] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/20"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Exportar Tokens JSON</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-3 p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* Segment Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Ver Todo' },
            { id: 'essence', label: 'D1 · Esencia' },
            { id: 'logo', label: 'D2 · Logotipo' },
            { id: 'colors', label: 'D3 · Paleta Cromática' },
            { id: 'typography', label: 'D4 · Tipografía' },
            { id: 'visual', label: 'D5 · Lenguaje Visual' },
            { id: 'verbal', label: 'D6 · Identidad Verbal' },
            { id: 'incorrect', label: 'D8 · Usos Incorrectos' },
          ].map((seg) => (
            <button
              key={seg.id}
              onClick={() => setActiveSegment(seg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSegment === seg.id
                  ? 'bg-[#022046] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {seg.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold ${viewMode === 'grid' ? 'bg-[#022046] text-white' : 'text-slate-500'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('slides')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold ${viewMode === 'slides' ? 'bg-[#022046] text-white' : 'text-slate-500'}`}
          >
            Láminas
          </button>
        </div>
      </div>

      {/* SECTION 01: ESENCIA DE MARCA */}
      {(activeSegment === 'all' || activeSegment === 'essence') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-mono">01</span>
              <span>Esencia de Marca</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Fundamentos del Sistema Clientum
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Propósito & Personalidad */}
            <div className="lg:col-span-5 space-y-4">
              {/* Propósito Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#0056B3] dark:text-blue-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Propósito</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  El sistema CRM de la marca Clientum brinda soluciones de inteligencia y gestión comercial a PyMEs en Latinoamérica.
                </p>
              </div>

              {/* Personalidad Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Personalidad
                </div>
                <div className="space-y-2 text-xs font-medium">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Profesional</span>
                    <span className="text-slate-500 text-[11px]">Clara / Sólida</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Tecnológica</span>
                    <span className="text-slate-500 text-[11px]">Innovadora</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">Cercana</span>
                    <span className="text-slate-500 text-[11px]">Resolutiva</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Promesa de Marca (Featured Highlight Box) */}
            <div className="lg:col-span-7 flex flex-col justify-between clarity-promesa-card p-6 rounded-2xl relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#0056B3] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#0056B3]" />
                  <span>Promesa de Marca</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#022046] dark:text-white leading-snug">
                  "Menos tareas manuales. Más control. Más crecimiento."
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-blue-200/60 dark:border-blue-900/40">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold border border-emerald-300/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Claridad</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold border border-blue-300/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Confianza</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-bold border border-purple-300/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Progreso</span>
                </span>
              </div>
            </div>
          </div>

          {/* Pilares de Marca Grid */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Pilares de Marca
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="clarity-pillar-box p-4 rounded-xl">
                <div className="font-extrabold text-xs text-[#022046] dark:text-white">Claridad</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Visión limpia del embudo y procesos.
                </p>
              </div>
              <div className="clarity-pillar-box p-4 rounded-xl">
                <div className="font-extrabold text-xs text-[#022046] dark:text-white">Confianza</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Datos seguros y trazabilidad total.
                </p>
              </div>
              <div className="clarity-pillar-box p-4 rounded-xl">
                <div className="font-extrabold text-xs text-[#022046] dark:text-white">Progreso</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Automatización orientada a crecer.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 02: SISTEMA DE LOGOTIPO */}
      {(activeSegment === 'all' || activeSegment === 'logo') && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-mono">02</span>
              <span>Sistema de Logotipo</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Isotipo de Nodos & Isotipo Diamante
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[120px] shadow-xs">
              <ClientumLogo variant="horizontal" size="lg" badge="CRM" />
            </div>
            <div className="p-5 rounded-2xl bg-[#022046] border border-blue-900 flex items-center justify-center min-h-[120px] shadow-md">
              <ClientumLogo variant="horizontal" size="lg" badge="CRM" />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 03: PALETA CROMÁTICA */}
      {(activeSegment === 'all' || activeSegment === 'colors') && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-mono">03</span>
              <span>Paleta Cromática Oficial</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Clientum Clarity Color System
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {BRAND_COLORS.map((token) => (
              <div
                key={token.hex}
                className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs hover:border-blue-500 transition-all"
              >
                <div
                  className="h-20 w-full p-3 flex flex-col justify-between transition-transform duration-200 group-hover:scale-[1.01]"
                  style={{
                    backgroundColor: token.hex,
                    color: token.textColor,
                    borderBottom: token.border ? '1px solid #e2e8f0' : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-tight">
                      {token.name}
                    </span>
                    <button
                      onClick={() => copyToClipboard(token.hex)}
                      className="p-1 rounded-md bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white transition-opacity"
                      title="Copiar código hexadecimal"
                    >
                      {copiedHex === token.hex ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold">{token.hex}</span>
                    <span className="text-[10px] opacity-80">{token.role}</span>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {token.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManualShowcase;
