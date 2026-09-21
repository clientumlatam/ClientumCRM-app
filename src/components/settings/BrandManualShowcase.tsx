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
  ExternalLink 
} from 'lucide-react';
import { ClientumLogo } from '../common/ClientumLogo';

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
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'palette' | 'logo' | 'typography' | 'identity'>('palette');

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs">
      {/* Header with Brand Purpose */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#022046]" />
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Manual de Marca Oficial — Clientum v1.0
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0056B3] dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800">
              Activo
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)] max-w-2xl leading-relaxed">
            Directrices visuales institucionales para preservar la <strong>claridad comercial editorial</strong> y la identidad unificada de Clientum.
          </p>
        </div>

        {/* Brand Traits Pills */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {['Profesional', 'Cercano', 'Tecnológico', 'Resolutivo'].map((trait) => (
            <span
              key={trait}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Segmented Navigation */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)]">
        <button
          onClick={() => setActiveTab('palette')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'palette'
              ? 'bg-[var(--bg-card)] text-[#0056B3] shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Paleta Cromática Oficial
        </button>
        <button
          onClick={() => setActiveTab('logo')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'logo'
              ? 'bg-[var(--bg-card)] text-[#0056B3] shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Sistema de Logotipo & Área de Protección
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'typography'
              ? 'bg-[var(--bg-card)] text-[#0056B3] shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Jerarquía Tipográfica (Inter)
        </button>
        <button
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'identity'
              ? 'bg-[var(--bg-card)] text-[#0056B3] shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Lenguaje Visual & Tono
        </button>
      </div>

      {/* Tab: Paleta Cromática */}
      {activeTab === 'palette' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {BRAND_COLORS.map((token) => (
              <div
                key={token.hex}
                className="group relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden shadow-2xs hover:border-[var(--border-strong)] transition-all"
              >
                {/* Color Swatch block */}
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
                      aria-label={`Copiar ${token.hex}`}
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

                {/* Description & Usage */}
                <div className="p-3">
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {token.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              <strong>Garantía de contraste WCAG AA/AAA:</strong> El texto institucional <strong>#212121</strong> sobre el fondo <strong>#F5F7FA</strong> supera el ratio mínimo de accesibilidad 14.8:1, garantizando legibilidad en pantallas de alta densidad y jornadas operativas prolongadas.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Sistema de Logotipo */}
      {activeTab === 'logo' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Version 1: Logotipo Horizontal */}
            <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Versión 1: Logotipo Horizontal
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#0056B3] border border-blue-200">
                  Min. 209px
                </span>
              </div>

              {/* Live Preview Container with Area of Protection dashed border */}
              <div className="h-28 rounded-lg bg-white border border-dashed border-blue-400/50 flex items-center justify-center p-4 relative overflow-hidden">
                <span className="absolute top-1 left-2 text-[9px] font-mono text-blue-500/70">
                  Área de protección
                </span>
                <ClientumLogo
                  variant="horizontal"
                  size="md"
                  badge="CRM"
                  minWidth209={true}
                  alt="Clientum CRM Horizontal"
                />
              </div>

              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Utilizado en encabezados de navegación (Navbar), headers de autenticación y documentos comerciales. Ancho mínimo reglamentario: <strong>209px horizontal</strong>.
              </p>
            </div>

            {/* Version 2: Isotipo Standalone */}
            <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Versión 2: Isotipo
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Ratio 1:1
                </span>
              </div>

              {/* Live Preview Container with Area of Protection */}
              <div className="h-28 rounded-lg bg-white border border-dashed border-blue-400/50 flex items-center justify-center p-4 relative overflow-hidden">
                <span className="absolute top-1 left-2 text-[9px] font-mono text-blue-500/70">
                  Área de protección
                </span>
                <ClientumLogo
                  variant="isotipo"
                  size="xl"
                  showClearance={true}
                  alt="Clientum Isotipo"
                />
              </div>

              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Utilizado en la barra lateral colapsada, favicons, avatares de sistema e indicadores de estado. Conserva siempre su tarjeta de protección con radio 12px.
              </p>
            </div>
          </div>

          {/* Usos Correctos e Incorrectos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Usos Autorizados
              </div>
              <ul className="text-[11px] text-emerald-900/80 dark:text-emerald-400 space-y-1 list-disc list-inside">
                <li>Logotipo horizontal sobre fondos blancos y Surface (#F5F7FA).</li>
                <li>Mantener siempre libre el área de protección perimetral.</li>
                <li>Uso de Inter Bold para la marca y Action Blue (#0056B3) para el distintivo.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                Usos Prohibidos (Manual Sección 08)
              </div>
              <ul className="text-[11px] text-rose-900/80 dark:text-rose-400 space-y-1 list-disc list-inside">
                <li>No estirar ni deformar las proporciones del logotipo.</li>
                <li>No alterar los colores corporativos oficiales.</li>
                <li>No añadir sombras pesadas, biseles ni gradientes arbitrarios.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Jerarquía Tipográfica */}
      {activeTab === 'typography' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-bold text-[var(--text-primary)]">
                Familia Principal: Inter / Arial
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                font-family: 'Inter', Arial, sans-serif
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {/* H1 */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-[var(--border-subtle)]">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#022046] dark:text-white">
                    H1 — Resumen Ejecutivo Comercial
                  </h1>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    Bold (700) • Encabezados principales de vistas
                  </span>
                </div>
              </div>

              {/* H2 */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-[var(--border-subtle)]">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                    H2 — Pipeline Funnel & Distribución de Oportunidades
                  </h2>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    SemiBold (600) • Secciones operativas y módulos
                  </span>
                </div>
              </div>

              {/* H3 */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-secondary)]">
                    H3 — Métricas de Conversión y Tasa de Ganados
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    Medium (500) • Subtítulos de tarjetas y agrupaciones
                  </span>
                </div>
              </div>

              {/* Cuerpo */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="text-xs text-[var(--text-secondary)] font-normal leading-relaxed">
                    Cuerpo — Tecnología simple que permite a las PyMEs escalar sus negocios con control y profesionalismo comercial en tiempo real.
                  </p>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    Regular (400) • Textos de lectura, tablas e inputs
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <button className="crm-cta px-4 py-2 rounded-xl bg-[#0056B3] hover:bg-[#002B5C] text-white text-xs font-semibold shadow-xs transition-colors">
                    CTA — Botón de Acción Principal
                  </button>
                  <span className="block mt-1 text-[10px] font-mono text-[var(--text-muted)]">
                    SemiBold (600) • Botones de acción y enlaces clave
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Lenguaje Visual & Tono */}
      {activeTab === 'identity' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visual Guidelines */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] space-y-2.5">
              <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0056B3]" />
                Recursos Gráficos y Arquitectura
              </h4>
              <ul className="text-xs text-[var(--text-secondary)] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0056B3] mt-1.5 shrink-0" />
                  <span><strong>White cards on light grey:</strong> Tarjetas blancas (#FFFFFF) montadas sobre fondo Surface (#F5F7FA).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0056B3] mt-1.5 shrink-0" />
                  <span><strong>Bordes redondeados:</strong> Esquinas contenidas de 12px a 16px (rounded-xl/2xl) sin distorsión.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0056B3] mt-1.5 shrink-0" />
                  <span><strong>Sombras suaves:</strong> Elevación sutil (shadow-xs / shadow-sm) sin glow exagerado.</span>
                </li>
              </ul>
            </div>

            {/* Tone Guidelines */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] space-y-2.5">
              <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0056B3]" />
                Tono Verbal y Vocabulario
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Tono: <strong>Profesional, claro y directo.</strong>
              </p>
              <div className="space-y-1 text-xs">
                <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                  Palabras preferidas: <em>Simple, claro, automatizar, escala, control.</em>
                </div>
                <div className="text-rose-700 dark:text-rose-400 font-medium">
                  Palabras evitadas: <em>Magia, garantizado, revolucionario.</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
