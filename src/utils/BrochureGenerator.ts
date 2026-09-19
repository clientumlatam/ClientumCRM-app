import { jsPDF } from 'jspdf';
import {
  CLIENTUM_BROCHURE_METRICS,
  CLIENTUM_PILLARS,
  CLIENTUM_PLANS,
  CLIENTUM_SERVICES,
  CLIENTUM_CASE_STUDY
} from '../data/clientumCatalog';

export interface BrochureGenerationOptions {
  currency?: 'ARS' | 'USD';
  includeServicesMatrix?: boolean;
  watermarkText?: string;
  clientName?: string;
}

/**
 * Utility to generate and download a comprehensive, executive PDF dossier
 * covering the entire public offering, technology stack, and commercial solutions of Clientum CRM.
 */
export async function generateBrochurePDF(options: BrochureGenerationOptions = {}): Promise<{
  blob: Blob;
  download: (fileName?: string) => void;
}> {
  const {
    currency = 'ARS',
    clientName = '',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Color Palette (Clientum Navy Theme)
  const NAVY_DARK = [9, 15, 30]; // #090F1E
  const NAVY_ACCENT = [15, 23, 42]; // #0F172A
  const BLUE_PRIMARY = [37, 99, 235]; // #2563EB
  const CYAN_ACCENT = [14, 165, 233]; // #0EA5E9
  const TEXT_DARK = [30, 41, 59]; // #1E293B
  const TEXT_MUTED = [100, 116, 139]; // #64748B
  const CARD_BG = [248, 250, 252]; // #F8FAFC
  const CARD_BORDER = [226, 232, 240]; // #E2E8F0

  const drawHeader = (pageNumber: number, totalPages: number, title = 'CLIENTUM CRM | DOSSIER COMERCIAL') => {
    // Top colored bar
    doc.setFillColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
    doc.rect(0, 0, pageWidth, 18, 'F');

    // Accent line
    doc.setFillColor(CYAN_ACCENT[0], CYAN_ACCENT[1], CYAN_ACCENT[2]);
    doc.rect(0, 18, pageWidth, 1.2, 'F');

    // Logo & Header text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('CLIENTUM CRM', margin, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(186, 230, 253);
    doc.text(title, margin + 35, 11);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`https://clientum.com.ar`, pageWidth - margin - 35, 11);

    // Footer
    doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('Confidencial | Clientum CRM © 2026 — Todos los derechos reservados. Patagonia Argentina.', margin, pageHeight - 7);
    doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - margin - 18, pageHeight - 7);
  };

  // ==========================================
  // PAGE 1: COVER & EXECUTIVE SUMMARY
  // ==========================================
  drawHeader(1, 3, 'DOSSIER EJECUTIVO');

  let y = 28;

  // Title section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
  doc.text('Sistema Operativo Comercial', margin, y);
  y += 7;
  doc.setTextColor(BLUE_PRIMARY[0], BLUE_PRIMARY[1], BLUE_PRIMARY[2]);
  doc.text('para PyMEs Argentinas y de LATAM', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  const subtitle = clientName
    ? `Propuesta técnica y comercial personalizada para: ${clientName} | Edición 2026`
    : 'Dossier institucional, arquitectura tecnológica, planes y catálogo integral de servicios.';
  doc.text(subtitle, margin, y);
  y += 8;

  // Hero Card with Executive Summary
  doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
  doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
  doc.text('Resumen Ejecutivo & Propuesta de Valor', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  const execText =
    'Clientum CRM unifica en una sola plataforma en la nube la gestión completa del ciclo comercial: ' +
    'Pipeline Kanban interactivo, mensajería WhatsApp multiagente conectada a la IA, emisión de Facturas Electrónicas ' +
    'con validación de CAE ante AFIP, cobros automáticos mediante Mercado Pago y un ejército de 14 agentes de IA autónomos ' +
    'diseñados para acelerar las ventas B2B y el servicio al cliente.';
  const splitExec = doc.splitTextToSize(execText, contentWidth - 8);
  doc.text(splitExec, margin + 4, y + 12);
  y += 38;

  // Key Metrics Row
  const metricBoxWidth = (contentWidth - 9) / 4;
  const metrics = [
    { label: 'Uptime SLA', val: '99.9%' },
    { label: 'Tasa de Cierre', val: '+38%' },
    { label: 'Tiempo de Respuesta', val: '2.4x' },
    { label: 'Agentes de IA', val: '14' },
  ];

  metrics.forEach((m, idx) => {
    const xPos = margin + idx * (metricBoxWidth + 3);
    doc.setFillColor(NAVY_ACCENT[0], NAVY_ACCENT[1], NAVY_ACCENT[2]);
    doc.roundedRect(xPos, y, metricBoxWidth, 18, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(CYAN_ACCENT[0], CYAN_ACCENT[1], CYAN_ACCENT[2]);
    doc.text(m.val, xPos + metricBoxWidth / 2, y + 8, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(m.label, xPos + metricBoxWidth / 2, y + 14, { align: 'center' });
  });
  y += 24;

  // Pillars Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
  doc.text('Los 4 Pilares del Ecosistema Clientum', margin, y);
  y += 5;

  const pillarHeight = 35;
  const pillarWidth = (contentWidth - 4) / 2;

  CLIENTUM_PILLARS.slice(0, 4).forEach((pillar, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = margin + col * (pillarWidth + 4);
    const py = y + row * (pillarHeight + 4);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
    doc.roundedRect(px, py, pillarWidth, pillarHeight, 1.5, 1.5, 'FD');

    // Pillar Header tag
    doc.setFillColor(BLUE_PRIMARY[0], BLUE_PRIMARY[1], BLUE_PRIMARY[2]);
    doc.rect(px, py, 2.5, pillarHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
    doc.text(pillar.title, px + 5, py + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    const splitDesc = doc.splitTextToSize(pillar.desc, pillarWidth - 8);
    doc.text(splitDesc, px + 5, py + 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(BLUE_PRIMARY[0], BLUE_PRIMARY[1], BLUE_PRIMARY[2]);
    doc.text(`Patagonia, Argentina`, px + 5, py + pillarHeight - 4);
  });

  y += 2 * (pillarHeight + 4) + 6;

  // Case Study Snapshot
  doc.setFillColor(240, 249, 255); // #F0F9FF
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(BLUE_PRIMARY[0], BLUE_PRIMARY[1], BLUE_PRIMARY[2]);
  doc.text(`Caso Testigo: ${CLIENTUM_CASE_STUDY.company} — ${CLIENTUM_CASE_STUDY.author}`, margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  const splitCase = doc.splitTextToSize(`"${CLIENTUM_CASE_STUDY.quote}"`, contentWidth - 8);
  doc.text(splitCase, margin + 4, y + 11);

  // ==========================================
  // PAGE 2: PLANS & MODULES ARCHITECTURE
  // ==========================================
  doc.addPage();
  drawHeader(2, 3, 'PLANES & MATRIZ DE SOLUCIONES');
  y = 28;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
  doc.text('Planes Comerciales & Licenciamiento PyME', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Facturación en moneda local con cumplimiento tributario AFIP o en dólares vía Stripe / PayPal.', margin, y);
  y += 6;

  // Plans Grid
  const planWidth = (contentWidth - 6) / 3;
  const planHeight = 65;

  CLIENTUM_PLANS.slice(0, 4).forEach((plan, i) => {
    const px = margin + i * (planWidth + 3);
    const isPopular = plan.id === 'pln-2' || plan.sku === 'PLN-pyme';

    // Card background
    if (isPopular) {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(BLUE_PRIMARY[0], BLUE_PRIMARY[1], BLUE_PRIMARY[2]);
      doc.setLineWidth(0.6);
    } else {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
      doc.setLineWidth(0.2);
    }
    doc.roundedRect(px, y, planWidth, planHeight, 2, 2, 'FD');

    // Popular badge
    if (isPopular) {
      doc.setFillColor(BLUE_PRIMARY[0], BLUE_PRIMARY[1], BLUE_PRIMARY[2]);
      doc.rect(px, y, planWidth, 5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text('RECOMENDADO PYMES', px + planWidth / 2, y + 3.5, { align: 'center' });
    }

    const cardY = isPopular ? y + 8 : y + 5;

    // Plan name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
    doc.text(plan.name, px + 4, cardY);

    // Price
    const priceStr = currency === 'ARS'
      ? `$${(plan.regularPrice * 1350).toLocaleString('es-AR')} ARS/mes`
      : `$${plan.regularPrice} USD/mes`;

    doc.setFontSize(9);
    doc.setTextColor(BLUE_PRIMARY[0], BLUE_PRIMARY[1], BLUE_PRIMARY[2]);
    doc.text(priceStr, px + 4, cardY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(plan.shortDescription || plan.name, px + 4, cardY + 9.5);

    // Features list from specs or features
    let featY = cardY + 14;
    const planSpecs = plan.specs
      ? Object.values(plan.specs).filter(Boolean) as string[]
      : plan.features || [plan.shortDescription];

    planSpecs.slice(0, 5).forEach(f => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(CYAN_ACCENT[0], CYAN_ACCENT[1], CYAN_ACCENT[2]);
      doc.text('•', px + 4, featY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      const featText = doc.splitTextToSize(f, planWidth - 9);
      doc.text(featText, px + 7, featY);
      featY += 6;
    });
  });

  y += planHeight + 10;

  // Core Services & Modules Matrix
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
  doc.text('Catálogo de Soluciones & Servicios Profesionales B2B', margin, y);
  y += 5;

  // Table header
  doc.setFillColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
  doc.rect(margin, y, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('MÓDULO / SERVICIO', margin + 3, y + 4.8);
  doc.text('ALCANCE TÉCNICO', margin + 50, y + 4.8);
  doc.text('TIEMPO DE ENTREGA', margin + 120, y + 4.8);
  doc.text('SLA / GARANTÍA', margin + 155, y + 4.8);
  y += 7;

  // Table Rows
  CLIENTUM_SERVICES.slice(0, 6).forEach((service, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
    doc.line(margin, y + 12, margin + contentWidth, y + 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
    doc.text(service.name, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(service.category, margin + 3, y + 9);

    const deliverables = service.features || [service.shortDescription];
    const splitScope = doc.splitTextToSize(deliverables.slice(0, 2).join(', '), 65);
    doc.text(splitScope, margin + 50, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(BLUE_PRIMARY[0], BLUE_PRIMARY[1], BLUE_PRIMARY[2]);
    doc.text(service.implementationDays || '5 días hábiles', margin + 120, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text('Garantía 100%', margin + 155, y + 6);

    y += 12;
  });

  // ==========================================
  // PAGE 3: AI COPILOT, SECURITY & CONTACT
  // ==========================================
  doc.addPage();
  drawHeader(3, 3, 'IA AUTÓNOMA & CONTACTO CORPORATIVO');
  y = 28;

  // AI & Technology Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
  doc.text('Suite Agente OS: 14 Agentes de IA Integrados', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Inteligencia artificial generativa y predictiva integrada nativamente en cada proceso comercial.', margin, y);
  y += 6;

  // 6 Highlighted AI Agents
  const aiAgents = [
    { name: 'Agente Ventas & Prospección', desc: 'Clasificación de leads en Kanban, enrichment automático de empresas y cálculo de probabilidad de cierre.' },
    { name: 'Copilot WhatsApp Multiagente', desc: 'Respuestas automáticas inteligentes, detección de intenciones de compra y derivación a asesores humanos.' },
    { name: 'Auditor Tributario AFIP', desc: 'Validación de CUITs en padrón de AFIP, asignación de condición fiscal e informe de discrepancias impositivas.' },
    { name: 'Cobranzas & Conciliación MP', desc: 'Seguimiento automatizado de facturas vencidas y conciliación instantánea con Mercado Pago.' },
    { name: 'Scraper Google Maps B2B', desc: 'Extracción de comercios y profesionales locales con teléfonos, correos y páginas web en segundos.' },
    { name: 'Webmail Assistant', desc: 'Redacción asistida de correos transaccionales, pulido de tono formal y síntesis de hilos extensos.' },
  ];

  const agentWidth = (contentWidth - 4) / 2;
  const agentHeight = 22;

  aiAgents.forEach((agent, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const ax = margin + col * (agentWidth + 4);
    const ay = y + row * (agentHeight + 3);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
    doc.roundedRect(ax, ay, agentWidth, agentHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(BLUE_PRIMARY[0], BLUE_PRIMARY[1], BLUE_PRIMARY[2]);
    doc.text(agent.name, ax + 3, ay + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    const splitAgent = doc.splitTextToSize(agent.desc, agentWidth - 6);
    doc.text(splitAgent, ax + 3, ay + 10.5);
  });

  y += 3 * (agentHeight + 3) + 8;

  // Security & Data Sovereignty Box
  doc.setFillColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Soberanía de Datos, Seguridad & Cumplimiento', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  const secText =
    '• Infraestructura de alta disponibilidad con redundancia geográfica y encriptación AES-256 en reposo y en tránsito.\n' +
    '• Roles RBAC granulares (Super Admin, Ventas, Operaciones, Soporte, Finanzas) y registro de auditoría inmutable.\n' +
    '• Facturación electrónica homologada bajo normativa RG AFIP y protección de bases de datos según Ley 25.326 de Protección de Datos Personales de la República Argentina.\n' +
    '• Acceso offline progresivo mediante Service Worker PWA con sincronización bidireccional automática.';
  const splitSec = doc.splitTextToSize(secText, contentWidth - 10);
  doc.text(splitSec, margin + 5, y + 13);

  y += 42;

  // Contact Information Card
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(NAVY_DARK[0], NAVY_DARK[1], NAVY_DARK[2]);
  doc.text('Contacto Corporativo & Atención al Cliente', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);

  doc.text('• Sitio Web Oficial: https://clientum.com.ar', margin + 5, y + 15);
  doc.text('• Correo Corporativo: info@clientum.com.ar / soporte@clientum.com.ar', margin + 5, y + 21);
  doc.text('• WhatsApp Comercial / Soporte: +54 9 298 451-0883', margin + 5, y + 27);
  doc.text('• Sedes: Patagonia Argentina (General Roca, Río Negro) & Filial São Paulo (Brasil)', margin + 5, y + 33);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(BLUE_PRIMARY[0], BLUE_PRIMARY[1], BLUE_PRIMARY[2]);
  doc.text('¿Listo para escalar sus ventas? Solicite una demo guiada de 20 minutos con nuestros consultores.', margin + 5, y + 39);

  // Generate output blob
  const pdfBlob = doc.output('blob');

  // Try caching the generated PDF in the browser cache so the service worker serves it offline
  if (typeof caches !== 'undefined') {
    try {
      const response = new Response(pdfBlob, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="clientum-crm-brochure-2026.pdf"'
        }
      });
      caches.open('clientum-crm-v6.2-pwa-brochure').then(cache => {
        cache.put('/brochure.pdf', response);
      }).catch(() => {});
    } catch {
      // Ignored
    }
  }

  return {
    blob: pdfBlob,
    download: (fileName = 'ClientumCRM-Brochure-Corporativo-2026.pdf') => {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };
}
