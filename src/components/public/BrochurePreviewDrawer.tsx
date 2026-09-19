import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  RefreshCw,
  Sparkles,
  Maximize2,
  Minimize2,
  ExternalLink,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { generateBrochurePDF, BrochureGenerationOptions } from '../../utils/BrochureGenerator';

interface BrochurePreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialCurrency?: 'ARS' | 'USD';
  defaultClientName?: string;
}

export const BrochurePreviewDrawer: React.FC<BrochurePreviewDrawerProps> = ({
  isOpen,
  onClose,
  initialCurrency = 'ARS',
  defaultClientName = '',
}) => {
  const [currency, setCurrency] = useState<'ARS' | 'USD'>(initialCurrency);
  const [clientName, setClientName] = useState<string>(defaultClientName);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadHandler, setDownloadHandler] = useState<((fileName?: string) => void) | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const prevBlobUrlRef = useRef<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Generate or regenerate PDF whenever currency or clientName changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGenerating(true);

    const timer = setTimeout(async () => {
      try {
        const { blob, download } = await generateBrochurePDF({
          currency,
          clientName: clientName.trim() || undefined,
        });

        if (!isMounted) return;

        // Revoke previous blob URL
        if (prevBlobUrlRef.current) {
          URL.revokeObjectURL(prevBlobUrlRef.current);
        }

        const url = URL.createObjectURL(blob);
        prevBlobUrlRef.current = url;
        setPdfBlobUrl(url);
        setDownloadHandler(() => download);
      } catch (err) {
        console.error('Error in BrochurePreviewDrawer:', err);
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, currency, clientName]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (downloadHandler) {
      const fileName = `ClientumCRM-Brochure-${currency}${clientName ? `-${clientName.replace(/\s+/g, '_')}` : ''}-2026.pdf`;
      downloadHandler(fileName);
    }
  };

  const handlePrint = () => {
    if (pdfBlobUrl) {
      const iframe = document.getElementById('brochure-preview-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.print();
        return;
      }
    }
    window.print();
  };

  return (
    <div
      id="brochure-preview-drawer-root"
      className="fixed inset-0 z-50 overflow-hidden font-sans"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          className={`w-screen transition-all duration-300 ease-in-out flex flex-col bg-white shadow-2xl border-l border-slate-200 ${
            isExpanded ? 'max-w-6xl' : 'max-w-3xl lg:max-w-4xl'
          }`}
        >
          {/* Top Drawer Header & Toolbar */}
          <div className="bg-[#eef1f6] dark:bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-[#090F1E] text-[#0f172a] dark:text-white px-5 py-4 flex flex-col gap-3 shrink-0 border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-300">
                  <FileText className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0f172a] dark:text-white flex items-center gap-2">
                    Previsualización del Dossier Comercial
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      PDF Interactivo
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#0f172a] dark:text-white dark:text-slate-400">
                    Revisá el folleto corporativo directamente en el navegador antes de descargarlo.
                  </p>
                </div>
              </div>

              {/* Action utilities */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden md:flex p-2 rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-700 text-[#0f172a] dark:text-white dark:text-slate-300 hover:text-[#0f172a] hover:dark:text-white transition-colors cursor-pointer"
                  title={isExpanded ? 'Reducir tamaño' : 'Pantalla completa'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-700 text-[#0f172a] dark:text-white dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white transition-colors cursor-pointer"
                  title="Cerrar vista previa (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Adjustment Controls (Currency, Client Name, Download) */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Currency Switcher */}
                <div className="inline-flex rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 p-0.8 border border-[#cbd5e1] dark:border-[#cbd5e1] dark:border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrency('ARS')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      currency === 'ARS' ? 'bg-blue-600 text-white shadow-2xs' : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white'
                    }`}
                  >
                    Pesos (ARS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      currency === 'USD' ? 'bg-blue-600 text-white shadow-2xs' : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] hover:dark:text-white'
                    }`}
                  >
                    Dólares (USD)
                  </button>
                </div>

                {/* Optional Client Name Personalization Input */}
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0f172a] dark:text-white dark:text-slate-400" />
                  <input
                    type="text"
                    placeholder="Personalizar para cliente..."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="px-2.5 py-1 rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 border border-[#cbd5e1] dark:border-[#cbd5e1] dark:border-slate-700 text-xs text-[#0f172a] dark:text-white dark:text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-44 sm:w-56"
                  />
                </div>
              </div>

              {/* Download & Print Primary Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-700 text-[#0f172a] dark:text-white dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimir</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-cyan-200" />
                  <span>Descargar PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Preview Container */}
          <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
            {isGenerating && (
              <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-2xs flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-xs font-bold text-slate-700">
                  Renderizando documento PDF corporativo ({currency})...
                </p>
              </div>
            )}

            {pdfBlobUrl ? (
              <iframe
                id="brochure-preview-iframe"
                src={`${pdfBlobUrl}#toolbar=1&navpanes=0&view=FitH`}
                className="w-full h-full border-none"
                title="Clientum CRM Brochure PDF Preview"
              />
            ) : (
              <div className="text-center p-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-[#0f172a] dark:text-white dark:text-slate-400" />
                <p className="text-sm font-semibold">Cargando previsualizador...</p>
              </div>
            )}
          </div>

          {/* Bottom Drawer Footer Notes */}
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Documento oficial con validez comercial de Clientum CRM Latam v6.2</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Resolución vectorial 300 DPI</span>
              <span>•</span>
              <span>Páginas: 4 (Estructura A4)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
