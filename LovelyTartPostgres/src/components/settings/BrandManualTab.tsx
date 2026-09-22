import React, { useState } from 'react';
import {
  Palette,
  Check,
  Copy,
  Download,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Layers,
  Shield,
  Type,
  FileText,
  MessageSquare,
  Share2,
  ExternalLink,
  Info,
  Maximize2,
  Eye,
  Sliders,
  Zap,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { ClientumLogo } from '../common/ClientumLogo';

export const BrandManualTab: React.FC = () => {
  const { showToast } = useCRM();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [activeTabMode, setActiveTabMode] = useState<'grid' | 'slides'>('grid');

  const brandTokens = [
    {
      name: '--clientum-navy',
      hex: '#022046',
      rgb: 'RGB(2, 32, 70)',
      usage: 'Fondo institucional, portadas, tarjetas de alta distinción',
      category: 'navy',
      proportion: '25% azul profundo',
      bgClass: 'bg-[#022046]',
      textClass: 'text-white',
    },
    {
      name: '--clientum-blue',
      hex: '#002B5C',
      rgb: 'RGB(0, 43, 92)',
      usage: 'Azul corporativo principal, cabecera, navegadores',
      category: 'blue',
      proportion: '25% azul profundo',
      bgClass: 'bg-[#002B5C]',
      textClass: 'text-white',
    },
    {
      name: '--clientum-action',
      hex: '#0056B3',
      rgb: 'RGB(0, 86, 179)',
      usage: 'Azul de acción, botones CTA, enlaces, interactividad',
      category: 'action',
      proportion: '10% azul de acción',
      bgClass: 'bg-[#0056B3]',
      textClass: 'text-white',
    },
    {
      name: '--clientum-success',
      hex: '#4CAF50',
      rgb: 'RGB(76, 175, 80)',
      usage: 'Éxito, confirmación, indicadores positivos',
      category: 'success',
      proportion: '5% verde',
      bgClass: 'bg-[#4CAF50]',
      textClass: 'text-white',
    },
    {
      name: '--clientum-surface',
      hex: '#F5F7FA',
      rgb: 'RGB(245, 247, 250)',
      usage: 'Fondo de superficie, tarjetas claras, separadores',
      category: 'surface',
      proportion: '60% blancos/grises',
      bgClass: 'bg-[#F5F7FA]',
      textClass: 'text-[#212121]',
      border: true,
    },
    {
      name: '--clientum-ink',
      hex: '#212121',
      rgb: 'RGB(33, 33, 33)',
      usage: 'Texto principal / Tipografía oscura',
      category: 'ink',
      proportion: 'Tipografía',
      bgClass: 'bg-[#212121]',
      textClass: 'text-white',
    },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    showToast(`Copiado: ${label}`, 'success');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleExportTokensJSON = () => {
    const jsonContent = JSON.stringify(
      {
        brand: 'ClientumOS',
        version: '1.0',
        date: 'Septiembre 2026',
        tokens: brandTokens.reduce((acc, item) => {
          acc[item.name] = item.hex;
          return acc;
        }, {} as Record<string, string>),
      },
      null,
      2
    );

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientum_brand_tokens_v1.0.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Tokens digitales exportados en formato JSON', 'success');
  };

  const handleExportTokensCSS = () => {
    const cssContent = `:root {\n${brandTokens.map((t) => `  ${t.name}: ${t.hex};`).join('\n')}\n}`;
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientum_brand_tokens_v1.0.css';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Tokens de marca exportados en CSS', 'success');
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Top Banner & Control Header */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#002B5C] text-white flex items-center justify-center shadow-md shrink-0">
              {/* Clientum Isotipo 4 Nodes SVG */}
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15 L85 50 L50 85 L15 50 Z" stroke="currentColor" strokeWidth="6" fill="none" />
                <circle cx="50" cy="15" r="8" fill="#4CAF50" />
                <circle cx="85" cy="50" r="8" fill="#0056B3" />
                <circle cx="50" cy="85" r="8" fill="#0056B3" />
                <circle cx="15" cy="50" r="8" fill="#0056B3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                  MANUAL DE MARCA — ClientumOS
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-extrabold font-mono rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Versión 1.0 · Septiembre 2026
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Sistema de identidad visual, tipográfica, cromática y verbal oficial de Clientum.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={handleExportTokensCSS}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Descargar variables CSS oficial de Clientum"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>Exportar CSS</span>
            </button>
            <button
              onClick={handleExportTokensJSON}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0056B3] hover:bg-[#002B5C] text-white shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Descargar JSON de tokens digitales"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Exportar Tokens JSON</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'Ver Todo', icon: Layers },
              { id: 'essence', label: '01 · Esencia', icon: Sparkles },
              { id: 'logo', label: '02 · Logotipo', icon: Shield },
              { id: 'palette', label: '03 · Paleta Cromática', icon: Palette },
              { id: 'typography', label: '04 · Tipografía', icon: Type },
              { id: 'language', label: '05 · Lenguaje Visual', icon: FileText },
              { id: 'verbal', label: '06 · Identidad Verbal', icon: MessageSquare },
              { id: 'donots', label: '08 · Usos Incorrectos', icon: XCircle },
            ].map((sec) => {
              const IconComp = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#002B5C] text-white shadow-xs'
                      : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 bg-[var(--bg-muted)] p-1 rounded-lg border border-[var(--border-subtle)] shrink-0">
            <button
              onClick={() => setActiveTabMode('grid')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTabMode === 'grid' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xs font-semibold' : 'text-[var(--text-muted)]'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setActiveTabMode('slides')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeTabMode === 'slides' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-2xs font-semibold' : 'text-[var(--text-muted)]'
              }`}
            >
              Láminas
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 01: ESENCIA DE MARCA */}
      {(activeSection === 'all' || activeSection === 'essence') && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#0056B3] font-mono uppercase tracking-wider">01</span>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Esencia de Marca</h4>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-medium">Fundamentos del Sistema Clientum</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Propósito */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
              <div className="flex items-center gap-2 text-[#002B5C] dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#0056B3]" />
                <span>Propósito</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                El sistema CRM de la marca Clientum brinda soluciones de inteligencia y gestión comercial a PyMEs en Latinoamérica.
              </p>
            </div>

            {/* Promesa de marca */}
            <div className="p-4 rounded-xl border-2 border-[#0056B3] bg-blue-500/5 space-y-2 lg:col-span-2">
              <div className="flex items-center gap-2 text-[#0056B3] font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Promesa de Marca</span>
              </div>
              <p className="text-base font-extrabold text-[#002B5C] dark:text-white tracking-tight">
                "Menos tareas manuales. Más control. Más crecimiento."
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Claridad
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confianza
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Progreso
                </span>
              </div>
            </div>

            {/* Personalidad */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
              <div className="text-[#002B5C] dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                Personalidad
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[var(--border-subtle)]">
                  <span className="font-semibold text-[var(--text-primary)]">Profesional</span>
                  <span className="text-[var(--text-muted)]">Close / Sólida</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[var(--border-subtle)]">
                  <span className="font-semibold text-[var(--text-primary)]">Tecnológica</span>
                  <span className="text-[var(--text-muted)]">Innovadora</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-[var(--text-primary)]">Cercana</span>
                  <span className="text-[var(--text-muted)]">Resolutiva</span>
                </div>
              </div>
            </div>

            {/* Pilares */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 lg:col-span-2">
              <div className="text-[#002B5C] dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                Pilares de Marca
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                  <div className="font-bold text-xs text-[#002B5C] dark:text-blue-300">Claridad</div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Visión limpia del embudo y procesos.</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                  <div className="font-bold text-xs text-[#002B5C] dark:text-blue-300">Confianza</div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Datos seguros y trazabilidad total.</div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                  <div className="font-bold text-xs text-[#002B5C] dark:text-blue-300">Progreso</div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Automatización orientada a crecer.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 02: SISTEMA DE LOGOTIPO */}
      {(activeSection === 'all' || activeSection === 'logo') && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#0056B3] font-mono uppercase tracking-wider">02</span>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Sistema de Logotipo</h4>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-medium">Isotipo de Nodos & Isotipo Diamante</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Version 1: Isotipo Aislado */}
            <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col items-center justify-center space-y-3 min-h-[160px] text-center">
              <ClientumLogo
                variant="isotipo"
                size="xl"
                showClearance={true}
                alt="Isotipo Aislado"
              />
              <div>
                <div className="font-bold text-xs text-[var(--text-primary)]">Isotipo Oficial</div>
                <div className="text-[11px] text-[var(--text-muted)]">Área de protección y clearance integrada</div>
              </div>
            </div>

            {/* Version 2: Logotipo Horizontal en Fondo Claro */}
            <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-white flex flex-col items-center justify-center space-y-3 min-h-[160px] text-center">
              <ClientumLogo
                variant="horizontal"
                size="md"
                badge="CRM"
                minWidth209={true}
                alt="Logotipo Horizontal"
              />
              <div>
                <div className="font-bold text-xs text-slate-900">Logotipo Horizontal</div>
                <div className="text-[11px] text-slate-500">Mínimo 209px horizontal para encabezados claros</div>
              </div>
            </div>

            {/* Version 3: Logo sobre Fondo Oscuro */}
            <div className="p-5 rounded-xl border border-slate-800 bg-[#022046] text-white flex flex-col items-center justify-center space-y-3 min-h-[160px] text-center shadow-md">
              <ClientumLogo
                variant="horizontal"
                size="md"
                badge="CRM"
                minWidth209={true}
                className="text-white"
                alt="Logo sobre Fondo Oscuro"
              />
              <div>
                <div className="font-bold text-xs text-white">Logo sobre Fondo Oscuro</div>
                <div className="text-[11px] text-blue-200">Fondo institucional #022046 / Navy</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-[var(--text-primary)] block mb-1">Área de Protección</span>
              <p className="text-[var(--text-muted)] leading-relaxed">
                El área de protección equivale a la altura del nodo superior. Ningún elemento gráfico ni tipográfico debe invadir este espacio.
              </p>
            </div>
            <div>
              <span className="font-bold text-[var(--text-primary)] block mb-1">Tamaño Mínimo Recomendado</span>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Ancho mínimo en pantalla: <strong className="text-[var(--text-primary)]">209 pixels</strong>. En piezas impresas: <strong className="text-[var(--text-primary)]">6 mm</strong> de altura mínima.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 03: PALETA CROMÁTICA OFICIAL */}
      {(activeSection === 'all' || activeSection === 'palette') && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#0056B3] font-mono uppercase tracking-wider">03</span>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Paleta Cromática Oficial</h4>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-medium">Valores HEX, RGB y Proporción Sugerida (60-25-10-5)</span>
          </div>

          {/* Proporción Sugerida Meter Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[var(--text-secondary)]">
              <span>Proporción Sugerida de Uso en Interfaz</span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">60% Superficie · 25% Azul Profundo · 10% Acción · 5% Verde</span>
            </div>
            <div className="h-4 rounded-full overflow-hidden flex border border-[var(--border-subtle)] shadow-inner">
              <div className="bg-[#F5F7FA] text-[#212121] flex items-center justify-center text-[10px] font-bold" style={{ width: '60%' }}>
                60% Blancos/Grises
              </div>
              <div className="bg-[#022046] text-white flex items-center justify-center text-[10px] font-bold" style={{ width: '25%' }}>
                25% Deep
              </div>
              <div className="bg-[#0056B3] text-white flex items-center justify-center text-[10px] font-bold" style={{ width: '10%' }}>
                10%
              </div>
              <div className="bg-[#4CAF50] text-white flex items-center justify-center text-[10px] font-bold" style={{ width: '5%' }}>
                5%
              </div>
            </div>
          </div>

          {/* Grid of Tokens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandTokens.map((token) => (
              <div
                key={token.name}
                className="rounded-xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-surface)] hover:border-[#0056B3] transition-all flex flex-col group"
              >
                {/* Color Block Header */}
                <div className={`h-20 ${token.bgClass} p-3 flex flex-col justify-between relative`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${token.textClass} bg-black/20 backdrop-blur-xs`}>
                      {token.proportion}
                    </span>
                    <button
                      onClick={() => handleCopy(token.hex, token.name)}
                      className={`p-1.5 rounded-lg bg-black/20 hover:bg-black/40 ${token.textClass} transition-colors cursor-pointer`}
                      title="Copiar código HEX"
                    >
                      {copiedToken === token.name ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className={`text-base font-extrabold font-mono ${token.textClass} tracking-wider`}>
                    {token.hex}
                  </div>
                </div>

                {/* Token Details Body */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-[#0056B3]">{token.name}</span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">{token.rgb}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1 leading-normal">{token.usage}</p>
                  </div>

                  <button
                    onClick={() => handleCopy(`var(${token.name})`, token.name)}
                    className="w-full text-[11px] font-mono font-medium py-1 px-2 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>var({token.name})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 04: TIPOGRAFÍA */}
      {(activeSection === 'all' || activeSection === 'typography') && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#0056B3] font-mono uppercase tracking-wider">04</span>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Tipografía Oficial</h4>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-medium">Inter (Primaria) / Arial (Alternativa)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase tracking-wider font-mono">
                  <th className="pb-3 font-bold">Uso</th>
                  <th className="pb-3 font-bold">Fuente / Peso</th>
                  <th className="pb-3 font-bold">Ejemplo en Vivo</th>
                  <th className="pb-3 font-bold text-right">Aplicación Recomendada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr>
                  <td className="py-3 font-bold text-[#002B5C] dark:text-blue-300">H1</td>
                  <td className="py-3 font-mono font-semibold">Bold / 700</td>
                  <td className="py-3 text-lg font-bold text-[var(--text-primary)]">Titular Principal de Vista</td>
                  <td className="py-3 text-right text-[var(--text-muted)]">Encabezados de módulo principal</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-[#002B5C] dark:text-blue-300">H2</td>
                  <td className="py-3 font-mono font-semibold">SemiBold / 600</td>
                  <td className="py-3 text-base font-semibold text-[var(--text-primary)]">Subsección & Tarjetas</td>
                  <td className="py-3 text-right text-[var(--text-muted)]">Títulos de tarjetas y modales</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-[#002B5C] dark:text-blue-300">H3</td>
                  <td className="py-3 font-mono font-semibold">Medium / 500</td>
                  <td className="py-3 text-sm font-medium text-[var(--text-primary)]">Métricas e Indicadores</td>
                  <td className="py-3 text-right text-[var(--text-muted)]">KPIs, tablas y listas</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-[#002B5C] dark:text-blue-300">Cuerpo</td>
                  <td className="py-3 font-mono font-semibold">Regular / 400</td>
                  <td className="py-3 text-xs font-normal text-[var(--text-secondary)]">Texto de lectura corrido y notas explicativas.</td>
                  <td className="py-3 text-right text-[var(--text-muted)]">Párrafos generales y mensajes</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-[#002B5C] dark:text-blue-300">CTA</td>
                  <td className="py-3 font-mono font-semibold">SemiBold / 600</td>
                  <td className="py-3">
                    <span className="px-3 py-1 rounded-lg bg-[#0056B3] text-white font-semibold text-xs inline-block">
                      Botón de Acción
                    </span>
                  </td>
                  <td className="py-3 text-right text-[var(--text-muted)]">Botones primarios e interactividad</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-[#002B5C] dark:text-blue-300">Nota</td>
                  <td className="py-3 font-mono font-semibold">Regular / 400</td>
                  <td className="py-3 text-[11px] text-[var(--text-muted)]">Badges, metadatos y pies de página</td>
                  <td className="py-3 text-right text-[var(--text-muted)]">Aclaraciones y subtexto</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 05 & 06: LENGUAJE VISUAL & IDENTIDAD VERBAL */}
      {(activeSection === 'all' || activeSection === 'language' || activeSection === 'verbal') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lenguaje Visual */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <span className="text-xs font-extrabold text-[#0056B3] font-mono uppercase tracking-wider">05</span>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Lenguaje Visual</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                <span className="font-bold text-[var(--text-primary)] block">Recursos Gráficos</span>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Tarjetas blancas sobre fondo gris claro (`#F5F7FA`), bordes redondeados moderados (12-16px / `rounded-xl`), sombras suaves (`shadow-sm`) y nodos/iconos lineales como elementos secundarios.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                <span className="font-bold text-[var(--text-primary)] block">Fotografía e Imágenes</span>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Imágenes reales de equipos de trabajo y PyMEs latinoamericanas. Evitar fotografía de stock artificial o poses sobreactuadas.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                <span className="font-bold text-[var(--text-primary)] block">Gráficos y Datos</span>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Reglas de alta legibilidad con resaltados en azul de acción (`#0056B3`) y verde de éxito (`#4CAF50`).
                </p>
              </div>
            </div>
          </div>

          {/* Identidad Verbal */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <span className="text-xs font-extrabold text-[#0056B3] font-mono uppercase tracking-wider">06</span>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Identidad Verbal</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-300">
                  <span className="font-bold block mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Palabras Preferidas
                  </span>
                  <ul className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                    <li>• Simple, claro, ordenado</li>
                    <li>• Automatización inteligente</li>
                    <li>• Crecimiento medible</li>
                    <li>• Control comercial</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-950 dark:text-rose-300">
                  <span className="font-bold block mb-1 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Palabras a Evitar
                  </span>
                  <ul className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                    <li>• Magia / Milagroso</li>
                    <li>• Garantizado 100%</li>
                    <li>• Excesos técnicos</li>
                    <li>• Jerga vacía / SaaS cliché</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                <span className="font-bold text-[var(--text-primary)] block">Firma de Correo Sugerida</span>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  Jonathan Ledantes — ClientumOS Team<br />
                  "Tecnología simple para PyMEs"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 08: USOS INCORRECTOS */}
      {(activeSection === 'all' || activeSection === 'donots') && (
        <div className="rounded-2xl border border-rose-500/30 bg-[var(--bg-card)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-rose-600 font-mono uppercase tracking-wider">08</span>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Usos Incorrectos de Marca</h4>
            </div>
            <span className="text-xs text-rose-600 font-medium font-mono">NUNCA PERMITIDO</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                <XCircle className="w-4 h-4" />
                <span>Deformación</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Nunca estirar, comprimir o alterar la proporción del logotipo o isotipo.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                <XCircle className="w-4 h-4" />
                <span>Colores No Autorizados</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                No cambiar la paleta por degradados arbitrarios o colores fuera del manual.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                <XCircle className="w-4 h-4" />
                <span>Efectos Excesivos</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                No aplicar sombras intensas, biseles 3D o neón sobre el isotipo.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                <XCircle className="w-4 h-4" />
                <span>Fondos de Bajo Contraste</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                No colocar la versión oscura sobre fondos oscuros o imágenes saturadas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
