import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Globe,
  Layers,
  Sparkles,
  Zap,
  Bot,
  Kanban,
  FileSpreadsheet,
  Server
} from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';
import { CLIENTUM_SERVICES, CLIENTUM_PLANS, CLIENTUM_BROCHURE_METRICS } from '../../data/clientumCatalog';
import { useCRM } from '../../context/CRMContext';
import { generateBrochurePDF } from '../../utils/BrochureGenerator';
import { BrochurePreviewDrawer } from './BrochurePreviewDrawer';
import { Eye } from 'lucide-react';

interface PublicBrochurePageProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicBrochurePage: React.FC<PublicBrochurePageProps> = ({ onNavigate }) => {
  const { enterApp, showToast, triggerConfetti } = useCRM();
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      showToast('Generando dossier corporativo en formato PDF...', 'info');
      const { download } = await generateBrochurePDF({ currency });
      download(`ClientumCRM-Brochure-${currency}-2026.pdf`);
      triggerConfetti();
      showToast('Brochure descargado exitosamente.', 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Error al exportar el PDF. Utilice la opción de impresión del navegador.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans bg-white text-slate-900 print:py-2 print:px-0">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 print:hidden shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Ficha Técnica y Folleto Corporativo Oficial • ClientumOS v2.4</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrency(currency === 'ARS' ? 'USD' : 'ARS')}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
          >
            Ver en {currency === 'ARS' ? 'USD' : 'ARS'}
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Previsualizar PDF en el navegador"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Previsualizar PDF</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="px-3.5 py-2 rounded-xl bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-slate-900 hover:bg-[#eef1f6] hover:dark:bg-[#eef1f6] hover:dark:bg-slate-800 text-[#0f172a] dark:text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="Descargar Dossier Completo en PDF"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* 1. Resumen Ejecutivo Header */}
      <section className="border-b border-slate-200 pb-10 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              Dossier Institucional & Comercial
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              ClientumOS Brochure Corporativo
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Sistema Operativo de Crecimiento Comercial, Inteligencia Artificial & Automatización para Pequeñas y Medianas Empresas en América Latina.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-right md:text-right shrink-0">
            <div className="text-xs font-bold text-blue-900">Uptime Garantizado: 99.9%</div>
            <div className="text-[11px] text-blue-700 mt-0.5">SLA con Servidores Cloud Anycast</div>
            <div className="text-[10px] text-slate-500 mt-1">Revisión Septiembre 2026</div>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2 mt-6">
          <h3 className="font-bold text-sm text-slate-900">1. Resumen Ejecutivo & Propuesta de Valor</h3>
          <p>
            Clientum nació para nivelar el terreno de juego tecnológico para las pequeñas y medianas empresas de habla hispana. Mientras que los sistemas ERP y CRM internacionales imponen contratos en dólares, implementaciones de varios meses y costos desmedidos de soporte, Clientum ofrece una suite unificada en moneda local, con integración oficial de WhatsApp Business API, facturación electrónica AFIP con CAE nativo y modelos de Inteligencia Artificial generativa listos para operar desde el primer día.
          </p>
        </div>
      </section>

      {/* 2. Matriz de Servicios */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">2. Matriz de Servicios y Soluciones B2B</h2>
          <span className="text-xs text-slate-500">Tiempos de entrega garantizados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 w-fit">
              <Kanban className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Implementación CRM</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modelado de pipeline en 5 etapas, calificación comercial MEDDIC, migración de bases y capacitación del equipo de ventas.
            </p>
            <div className="text-[11px] font-semibold text-blue-700">Entrega: 5 a 10 días hábiles</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 w-fit">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">WhatsApp Business API</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conexión Cloud API oficial o Baileys QR, agentes autónomos 24/7 entrenados con catálogo de productos y derivación de asesores.
            </p>
            <div className="text-[11px] font-semibold text-emerald-700">Entrega: 48 a 72 horas</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 w-fit">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Desarrollo Web & E-Commerce</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tiendas de alto rendimiento, portales B2B, checkout Mercado Pago, optimización Core Web Vitals y diseño responsive.
            </p>
            <div className="text-[11px] font-semibold text-purple-700">Entrega: 10 a 18 días hábiles</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Ciberseguridad & Cloud</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enrutamiento Anycast Cloudflare, mitigación DDoS en el borde, auditoría de certificados SSL y copias de seguridad redundantes.
            </p>
            <div className="text-[11px] font-semibold text-amber-700">Disponibilidad 24/7 Anycast</div>
          </div>

        </div>
      </section>

      {/* 3. Planes de Precios y SLA */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">3. Planes de Precios y Niveles de Servicio (SLA)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CLIENTUM_PLANS.slice(0, 3).map((plan) => (
            <div
              key={plan.id}
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {plan.currency === 'USD' ? 'USD Oficial' : 'Moneda Local'}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 mb-2">
                  ${plan.regularPrice.toLocaleString('es-AR')} {plan.currency}/mes
                </div>
                <p className="text-xs text-slate-600 mb-4">{plan.shortDescription}</p>

                {plan.specs && (
                  <ul className="space-y-2 text-xs text-slate-700">
                    {Object.entries(plan.specs).map(([key, value]) => (
                      <li key={key} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                Soporte: {plan.id.includes('pro') || plan.id.includes('corp') ? 'Dedicado 24/7 con SLA' : 'WhatsApp comercial prioritario'}
              </div>
            </div>
          ))}
        </div>

        {/* SLA Guarantee Box */}
        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Garantía de Nivel de Servicio (SLA 99.9%)</span>
            </div>
            <p className="text-blue-800">
              Tiempo de primera respuesta humano menor a 4 horas hábiles por canal WhatsApp exclusivo y correo directivo.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/contacto')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer"
          >
            Solicitar Contrato SLA
          </button>
        </div>
      </section>

      {/* 4. Ficha de Contacto y Sedes */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">4. Ficha de Contacto y Sedes Internacionales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Argentina */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇦🇷</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Sede Matriz: Argentina</h3>
                <p className="text-xs text-slate-500">General Roca, Río Negro, Patagonia Argentina</p>
              </div>
            </div>
            <div className="text-xs space-y-1.5 text-slate-700">
              <p><strong>Liderazgo:</strong> Jonathan Ledantes — CEO & Co-Fundador</p>
              <p><strong>Alcance:</strong> Operaciones de Ingeniería, Suite CRM y Facturación AFIP</p>
              <p><strong>Correo:</strong> info@clientum.com.ar</p>
              <p><strong>WhatsApp:</strong> +54 9 298 451-0883</p>
            </div>
          </div>

          {/* Brasil */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇧🇷</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Sede Internacional: Brasil</h3>
                <p className="text-xs text-slate-500">Arraial do Cabo, Rio de Janeiro, Brasil</p>
              </div>
            </div>
            <div className="text-xs space-y-1.5 text-slate-700">
              <p><strong>Liderazgo:</strong> Matias Rotili — Director Internacional & Co-Fundador</p>
              <p><strong>Alcance:</strong> Expansión Comercial Cono Sur y Alianzas B2B Mercosur</p>
              <p><strong>Correo:</strong> brasil@clientum.com.ar</p>
              <p><strong>Canal:</strong> Canal Internacional Mercosur</p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => onNavigate('/')}
          className="text-xs text-slate-600 hover:text-blue-600 font-bold"
        >
          ← Volver al Portal Principal
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/contacto')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Solicitar Reunión Institucional</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Side Drawer Component for PDF Preview */}
      <BrochurePreviewDrawer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        initialCurrency={currency}
      />
    </div>
  );
};
