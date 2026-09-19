import React, { useState, useEffect } from 'react';
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  ChevronUp,
  Sparkles,
  FileSpreadsheet,
  Globe,
  Award,
  Users,
  Handshake,
  CheckCircle2,
  Lock,
  Clock,
  Terminal,
  Download,
  FileText,
  Eye,
} from 'lucide-react';
import { ClientumLogo } from '../common/ClientumLogo';
import { CLIENTUM_BROCHURE_METRICS } from '../../data/clientumCatalog';
import { useCRM } from '../../context/CRMContext';
import { PublicRoutePath } from './publicRoutes';
import { trackAnalyticsEvent } from '../../lib/analytics';
import { generateBrochurePDF } from '../../utils/BrochureGenerator';
import { BrochurePreviewDrawer } from './BrochurePreviewDrawer';

interface PublicFooterProps {
  onNavigate: (path: PublicRoutePath) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  const { enterApp, showToast, triggerConfetti } = useCRM();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingBrochure, setIsDownloadingBrochure] = useState(false);
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);

  const handleDownloadBrochure = async () => {
    try {
      setIsDownloadingBrochure(true);
      showToast('Generando dossier corporativo en PDF...', 'info');
      const { download } = await generateBrochurePDF({ currency: 'ARS' });
      download('ClientumCRM-Brochure-Corporativo-2026.pdf');
      trackAnalyticsEvent('brochure_download');
      triggerConfetti();
      showToast('Brochure descargado exitosamente.', 'success');
    } catch (err) {
      console.error('Error generating brochure PDF:', err);
      showToast('No se pudo generar el brochure en este momento.', 'error');
    } finally {
      setIsDownloadingBrochure(false);
    }
  };

  // Resolved build time string for support team debugging
  const buildTime =
    (import.meta.env.VITE_BUILD_TIME as string) ||
    new Date().toISOString();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__VITE_BUILD_TIME__ = buildTime;
      console.log(`[Clientum CRM Support Debug] VITE_BUILD_TIME: ${buildTime}`);
    }
  }, [buildTime]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/public/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'No se pudo registrar la suscripción.');

      setSubscribed(true);
      trackAnalyticsEvent('newsletter_signup');
      triggerConfetti();
      showToast('¡Gracias por suscribirte al boletín de Clientum CRM!', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'No se pudo registrar la suscripción.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nav = (path: PublicRoutePath) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 bg-[#eef1f6] dark:bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-[#090F1E] text-[#0f172a] dark:text-white dark:text-slate-300 font-sans relative overflow-hidden select-none">
      
      {/* ACCESSIBLE HIDDEN METADATA ELEMENT FOR SUPPORT TEAM & BUG REPORTING */}
      <div
        id="vite-build-time-metadata"
        aria-hidden="true"
        data-build-time={buildTime}
        className="sr-only font-mono text-[10px] text-slate-500"
      >
        VITE_BUILD_TIME: {buildTime}
      </div>

      {/* 1. TOP PRE-FOOTER BANNER: Newsletter & Instant Audit CTA */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Boletín de Inteligencia Comercial PyME
              </span>
              <h3 className="text-2xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
                Estrategias de ventas, WhatsApp IA y facturación en tu inbox
              </h3>
              <p className="text-xs text-[#0f172a] dark:text-white dark:text-slate-400 mt-2 leading-relaxed">
                Únete a más de 4.500 dueños de negocio, directores de ventas y contadores en América Latina. Recibe guías prácticas sin spam.
              </p>
            </div>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-md">
              <div className="relative flex-1 w-full">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="tu.email@empresa.com"
                  disabled={subscribed}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-800/80 border border-[#cbd5e1] dark:border-[#cbd5e1] dark:border-slate-700 text-xs text-[#0f172a] dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-blue-600/20 active:scale-95"
              >
                {subscribed ? '¡Suscrito con Éxito!' : isSubmitting ? 'Enviando...' : 'Suscribirme Gratis'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER SITEMAP GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-xs">
          
          {/* Column 1: Brand & Headquarters */}
          <div className="col-span-2 space-y-4 pr-0 lg:pr-4">
            <div className="flex items-center gap-3">
              <ClientumLogo className="w-9 h-9" />
              <div>
                <span className="text-lg font-extrabold text-[#0f172a] dark:text-white tracking-tight">Clientum</span>
                <span className="text-lg font-extrabold text-blue-500 tracking-tight">CRM</span>
                <span className="block text-[10px] text-[#0f172a] dark:text-white dark:text-slate-400 font-semibold tracking-wider uppercase">
                  Suite Comercial & AFIP CAE
                </span>
              </div>
            </div>

            <p className="text-xs text-[#0f172a] dark:text-white dark:text-slate-400 leading-relaxed max-w-sm">
              Plataforma omnicanal de gestión comercial, automatizaciones y agentes de Inteligencia Artificial para empresas y PyMEs de América Latina.
            </p>

            <div className="space-y-2 pt-2 text-xs border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-[#0f172a] dark:text-white dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{CLIENTUM_BROCHURE_METRICS.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[#0f172a] dark:text-white dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/5492984510883"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 font-semibold transition-colors"
                >
                  {CLIENTUM_BROCHURE_METRICS.phone} (WhatsApp Oficial)
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#0f172a] dark:text-white dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${CLIENTUM_BROCHURE_METRICS.email}`}
                  className="hover:text-blue-400 font-semibold transition-colors"
                >
                  {CLIENTUM_BROCHURE_METRICS.email}
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => enterApp()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/20"
              >
                <span>Acceder a la Demo en Vivo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="footer-download-brochure-btn"
                onClick={handleDownloadBrochure}
                disabled={isDownloadingBrochure}
                aria-label="Descargar Brochure Corporativo en PDF"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eef1f6] dark:bg-[#ffffff] dark:bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-[#cbd5e1] dark:border-[#cbd5e1] dark:border-slate-700 hover:border-sky-500/40 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>{isDownloadingBrochure ? 'Generando...' : 'Descargar Brochure (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* Column 2: Producto */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#0f172a] dark:text-white uppercase tracking-wider border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 pb-2">
              Producto
            </h4>
            <ul className="space-y-2 text-[#0f172a] dark:text-white dark:text-slate-400">
              <li>
                <button onClick={() => nav('/producto')} className="hover:text-[#0f172a] hover:dark:text-white transition-colors text-left">
                  Overview Suite
                </button>
              </li>
              <li>
                <button onClick={() => nav('/clientum-crm')} className="hover:text-blue-400 font-bold transition-colors text-left">
                  CRM 360° Kanban
                </button>
              </li>
              <li>
                <button onClick={() => nav('/producto/whatsapp-ia')} className="hover:text-emerald-400 transition-colors text-left">
                  WhatsApp Multiagente
                </button>
              </li>
              <li>
                <button onClick={() => nav('/producto/erp')} className="hover:text-sky-400 transition-colors text-left">
                  Facturación AFIP CAE
                </button>
              </li>
              <li>
                <button onClick={() => nav('/producto/agentes-ia')} className="hover:text-purple-400 transition-colors text-left">
                  Agent OS (14 Agentes)
                </button>
              </li>
              <li>
                <button onClick={() => nav('/producto/automatizaciones')} className="hover:text-amber-400 transition-colors text-left">
                  Automatizaciones DAG
                </button>
              </li>
              <li>
                <button onClick={() => nav('/producto/bi')} className="hover:text-blue-400 transition-colors text-left">
                  Business Intelligence
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Industrias */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#0f172a] dark:text-white uppercase tracking-wider border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 pb-2">
              Industrias
            </h4>
            <ul className="space-y-2 text-[#0f172a] dark:text-white dark:text-slate-400">
              <li>
                <button onClick={() => nav('/industrias')} className="hover:text-blue-400 font-bold text-blue-400 transition-colors text-left">
                  Directorio (10 Sectores)
                </button>
              </li>
              <li>
                <button onClick={() => nav('/industrias/agro')} className="hover:text-emerald-400 transition-colors text-left">
                  Agroindustria
                </button>
              </li>
              <li>
                <button onClick={() => nav('/industrias/estudios-contables')} className="hover:text-[#0f172a] hover:dark:text-white transition-colors text-left">
                  Estudios Contables
                </button>
              </li>
              <li>
                <button onClick={() => nav('/industrias/distribuidoras')} className="hover:text-amber-400 transition-colors text-left">
                  Distribuidoras Mayoristas
                </button>
              </li>
              <li>
                <button onClick={() => nav('/industrias/salud')} className="hover:text-rose-400 transition-colors text-left">
                  Salud & Clínicas
                </button>
              </li>
              <li>
                <button onClick={() => nav('/industrias/inmobiliaria')} className="hover:text-indigo-400 transition-colors text-left">
                  Inmobiliarias
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legales & Contacto */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#0f172a] dark:text-white uppercase tracking-wider border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 pb-2">
              Legales & Contacto
            </h4>
            <ul className="space-y-2 text-[#0f172a] dark:text-white dark:text-slate-400">
              <li>
                <button onClick={() => nav('/privacidad')} className="hover:text-emerald-400 font-semibold transition-colors text-left">
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button onClick={() => nav('/terminos')} className="hover:text-sky-400 font-semibold transition-colors text-left">
                  Términos del Servicio
                </button>
              </li>
              <li>
                <button onClick={() => nav('/legal')} className="hover:text-[#0f172a] hover:dark:text-white transition-colors text-left">
                  Aviso Legal & SLA 99.99%
                </button>
              </li>
              <li>
                <button onClick={() => nav('/contacto')} className="hover:text-blue-400 transition-colors text-left">
                  Contacto Comercial
                </button>
              </li>
              <li>
                <button onClick={() => nav('/precios')} className="hover:text-[#0f172a] hover:dark:text-white transition-colors text-left">
                  Planes & Precios
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Recursos & Soporte */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#0f172a] dark:text-white uppercase tracking-wider border-b border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 pb-2">
              Recursos
            </h4>
            <ul className="space-y-2 text-[#0f172a] dark:text-white dark:text-slate-400">
              <li>
                <button onClick={() => nav('/desarrolladores')} className="hover:text-sky-400 font-bold text-sky-400 transition-colors text-left">
                  API REST & Webhooks
                </button>
              </li>
              <li>
                <button onClick={() => nav('/ayuda')} className="hover:text-[#0f172a] hover:dark:text-white transition-colors text-left">
                  Centro de Ayuda
                </button>
              </li>
              <li>
                <button onClick={() => nav('/academia')} className="hover:text-amber-400 transition-colors text-left">
                  Campus Academia LMS
                </button>
              </li>
              <li>
                <button onClick={() => nav('/casos')} className="hover:text-blue-400 font-semibold transition-colors text-left">
                  Casos de Éxito
                </button>
              </li>
              <li>
                <button onClick={() => nav('/brochure')} className="hover:text-[#0f172a] hover:dark:text-white transition-colors text-left">
                  Brochure Institucional
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPreviewDrawerOpen(true)}
                  className="hover:text-cyan-300 font-semibold text-cyan-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-cyan-400" />
                  <span>Previsualizar Brochure</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleDownloadBrochure}
                  disabled={isDownloadingBrochure}
                  className="hover:text-sky-400 font-semibold text-sky-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3 text-sky-400" />
                  <span>Descargar PDF</span>
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. CERTIFICATIONS & INTEGRATIONS BADGE BAR */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#0f172a] dark:text-white dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-1.5 text-[#0f172a] dark:text-white dark:text-slate-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Facturación AFIP CAE (WSFE v1)
              </span>
              <span className="flex items-center gap-1.5 text-[#0f172a] dark:text-white dark:text-slate-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Meta WhatsApp Business API
              </span>
              <span className="flex items-center gap-1.5 text-[#0f172a] dark:text-white dark:text-slate-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                Google Workspace ISV Partner
              </span>
              <span className="flex items-center gap-1.5 text-[#0f172a] dark:text-white dark:text-slate-300 font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Soberanía de Datos & Encriptación AES-256
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-[#0f172a] dark:text-white dark:text-slate-400 font-mono">
              <span title="Build Time Timestamp">{buildTime}</span>
              <span>•</span>
              <span className="text-emerald-400">Uptime: 99.99%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM COPYRIGHT & LEGAL LINKS BAR */}
      <div className="border-t border-[#cbd5e1] dark:border-[#e2e8f0] dark:border-slate-800 bg-[#eef1f6] dark:bg-[#eef1f6] dark:bg-[#f8fafc] dark:bg-[#060A14] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#0f172a] dark:text-white dark:text-slate-400">
          <div>
            © 2026 Clientum Latam. Todos los derechos reservados. Desarrollado y operado en Patagonia Argentina.
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => nav('/privacidad')} className="hover:text-[#0f172a] hover:dark:text-white transition-colors">
              Política de Privacidad
            </button>
            <span>•</span>
            <button onClick={() => nav('/terminos')} className="hover:text-[#0f172a] hover:dark:text-white transition-colors">
              Términos del Servicio
            </button>
            <span>•</span>
            <button onClick={() => nav('/contacto')} className="hover:text-[#0f172a] hover:dark:text-white transition-colors">
              Contacto
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-blue-400 hover:text-[#0f172a] hover:dark:text-white transition-colors font-bold cursor-pointer"
              title="Volver arriba"
            >
              <span>Volver arriba</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Brochure PDF Preview Side Drawer */}
      <BrochurePreviewDrawer
        isOpen={isPreviewDrawerOpen}
        onClose={() => setIsPreviewDrawerOpen(false)}
      />
    </footer>
  );
};
