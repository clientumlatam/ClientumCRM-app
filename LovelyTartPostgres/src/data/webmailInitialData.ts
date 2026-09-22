import { WebmailEmail, WebmailD1Stats } from '../types';

export const INITIAL_WEBMAIL_EMAILS: WebmailEmail[] = [
  {
    id: 'd1-msg-001',
    messageId: '<202609081105.d1.clientum.inbound001@techcorp-latam.com>',
    from: 'martin.gomez@techcorp-latam.com',
    fromName: 'Martín Gómez (TechCorp LatAm)',
    to: ['info@clientum.com.ar'],
    cc: ['direccion@techcorp-latam.com'],
    subject: 'Solicitud de Cotización Enterprise + Facturación AFIP',
    bodyText: `Estimado equipo comercial de Clientum,\n\nNos ponemos en contacto desde TechCorp LatAm tras analizar su suite en clientum.com.ar.\n\nEstamos evaluando migrar de Salesforce a Clientum CRM para nuestro equipo de 28 ejecutivos comerciales en Argentina y Uruguay.\n\nNos interesa particularmente:\n1. Integración nativa con Facturación AFIP (CAE automático)\n2. WhatsApp CRM multiagente con trazabilidad\n3. Sincronización bidireccional con Google Calendar y Webmail Worker\n\n¿Podríamos coordinar una sesión de demostración técnica para este jueves a las 15:00 hs (ART)?\n\nQuedamos a la espera de su respuesta.\n\nAtentamente,\nMartín Gómez\nDirector de Operaciones Comerciales\nTechCorp LatAm\nTel: +54 11 4890-1234`,
    bodyHtml: `<p>Estimado equipo comercial de <strong>Clientum</strong>,</p><p>Nos ponemos en contacto desde <strong>TechCorp LatAm</strong> tras analizar su suite en <a href="https://clientum.com.ar">clientum.com.ar</a>.</p><p>Estamos evaluando migrar de Salesforce a Clientum CRM para nuestro equipo de 28 ejecutivos comerciales en Argentina y Uruguay.</p><p><strong>Nos interesa particularmente:</strong></p><ol><li>Integración nativa con Facturación AFIP (CAE automático)</li><li>WhatsApp CRM multiagente con trazabilidad</li><li>Sincronización bidireccional con Google Calendar y Webmail Worker</li></ol><p>¿Podríamos coordinar una sesión de demostración técnica para este jueves a las 15:00 hs (ART)?</p><p>Quedamos a la espera de su respuesta.</p><br/><p>Atentamente,<br/><strong>Martín Gómez</strong><br/>Director de Operaciones Comerciales<br/>TechCorp LatAm<br/>Tel: +54 11 4890-1234</p>`,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    folder: 'inbox',
    isRead: false,
    isStarred: true,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    attachments: [
      {
        id: 'att-01',
        name: 'Requerimientos_Tecnicos_TechCorp_2026.pdf',
        size: 1450000,
        type: 'application/pdf',
      },
    ],
    direction: 'inbound',
    workerId: 'webmail-clientum-worker-edge-1',
    crmLinkedType: 'opportunity',
    crmLinkedName: 'TechCorp LatAm - Migración Salesforce 28 Asientos',
  },
  {
    id: 'd1-msg-002',
    messageId: '<202609081015.d1.clientum.inbound002@finanzasdigitales.com.ar>',
    from: 'lucia.vazquez@finanzasdigitales.com.ar',
    fromName: 'Lucía Vázquez (Finanzas Digitales)',
    to: ['info@clientum.com.ar'],
    subject: 'Confirmación de Firma de Contrato Anual y Orden de Compra',
    bodyText: `Hola Matías,\n\nTe confirmo que el directorio aprobó los términos de la propuesta comercial #PROP-2026-88. Adjuntamos la orden de compra firmada digitalmente.\n\nPor favor envíanos la Factura A electrónica con el CAE correspondiente para tramitar la transferencia bancaria.\n\nSaludos,\nLucía Vázquez\nCFO - Finanzas Digitales SA`,
    bodyHtml: `<p>Hola Matías,</p><p>Te confirmo que el directorio aprobó los términos de la propuesta comercial <strong>#PROP-2026-88</strong>. Adjuntamos la orden de compra firmada digitalmente.</p><p>Por favor envíanos la Factura A electrónica con el CAE correspondiente para tramitar la transferencia bancaria.</p><br/><p>Saludos,<br/><strong>Lucía Vázquez</strong><br/>CFO - Finanzas Digitales SA</p>`,
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    folder: 'inbox',
    isRead: true,
    isStarred: true,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    attachments: [
      {
        id: 'att-02',
        name: 'Orden_de_Compra_FD_Firmada.pdf',
        size: 890000,
        type: 'application/pdf',
      },
    ],
    direction: 'inbound',
    workerId: 'webmail-clientum-worker-edge-1',
    crmLinkedType: 'company',
    crmLinkedName: 'Finanzas Digitales SA',
  },
  {
    id: 'd1-msg-003',
    messageId: '<202609080920.d1.clientum.outbound001@clientum.com.ar>',
    from: 'info@clientum.com.ar',
    fromName: 'Clientum CRM Sales Team',
    to: ['santiago.perez@logisticalatam.com.ar'],
    subject: 'Propuesta de Implementación Clientum CRM + Bot WhatsApp 24/7',
    bodyText: `Estimado Santiago,\n\nUn gusto saludarte. Como conversamos en nuestra llamada, te adjunto la propuesta formal para la automatización de prospectos y asignación de ejecutivos comerciales vía WhatsApp y API REST.\n\nIncluye:\n- 10 Asientos de Agente OS\n- Conector AFIP homologado\n- Onboarding guiado de 15 días\n\nQuedo a tu disposición para coordinar los próximos pasos.\n\nSaludos cordiales,\nEquipo Comercial Clientum\nwww.clientum.com.ar`,
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    folder: 'sent',
    isRead: true,
    isStarred: false,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    attachments: [
      {
        id: 'att-03',
        name: 'Propuesta_Clientum_LogisticaLatAm.pdf',
        size: 2100000,
        type: 'application/pdf',
      },
    ],
    direction: 'outbound',
    workerId: 'webmail-clientum-worker-edge-1',
    crmLinkedType: 'opportunity',
    crmLinkedName: 'Logística Cono Sur - Expansión Bot WhatsApp',
  },
  {
    id: 'd1-msg-004',
    messageId: '<202609080800.d1.clientum.inbound003@saludintegral.org.ar>',
    from: 'dr.alvarez@saludintegral.org.ar',
    fromName: 'Dr. Roberto Álvarez',
    to: ['info@clientum.com.ar'],
    subject: 'Consulta sobre cumplimiento de confidencialidad y datos sensibles',
    bodyText: `Buen día,\n\nRepresento a una red de 12 policonsultorios médicos en Córdoba y Rosario. Deseamos saber si Clientum CRM cumple con los estándares de encriptación en reposo y tránsito para gestión de historias de contacto y turnos.\n\nQuedo atento a su documentación técnica.\n\nDr. Roberto Álvarez`,
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    folder: 'inbox',
    isRead: true,
    isStarred: false,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    attachments: [],
    direction: 'inbound',
    workerId: 'webmail-clientum-worker-edge-1',
  },
  {
    id: 'd1-msg-005',
    messageId: '<202609071840.d1.clientum.outbound002@clientum.com.ar>',
    from: 'info@clientum.com.ar',
    fromName: 'Clientum Soporte Técnico',
    to: ['soporte@agroexportadora.com'],
    subject: 'Re: Configuración de Webhooks en Tiempo Real para Negocios Ganados',
    bodyText: `Hola Carlos,\n\nConfirmamos que la firma HMAC SHA-256 está habilitada en sus webhooks outbound. Cada request enviado incluirá el header 'X-Clientum-Signature' para verificar la autenticidad del payload en su endpoint.\n\nCualquier consulta adicional estamos a disposición.\n\nSaludos,\nSoporte Clientum`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    folder: 'sent',
    isRead: true,
    isStarred: false,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    attachments: [],
    direction: 'outbound',
    workerId: 'webmail-clientum-worker-edge-1',
  },
  {
    id: 'd1-msg-006',
    messageId: '<202609071420.d1.clientum.inbound004@noreply.cloudflare.com>',
    from: 'noreply@cloudflare.com',
    fromName: 'Cloudflare Email Routing Service',
    to: ['info@clientum.com.ar'],
    subject: 'Cloudflare Email Routing: All DNS Records Active & Verified',
    bodyText: `Your domain clientum.com.ar has active MX, SPF and DKIM records.\n\nRule: info@clientum.com.ar -> Worker webmail-clientum\nAction: Send to a Worker\nDatabase Binding: D1 (webmail-db)\nDelivery Status: 100% Operational`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    folder: 'archive',
    isRead: true,
    isStarred: true,
    spfStatus: 'PASS',
    dkimStatus: 'PASS',
    dmarcStatus: 'PASS',
    attachments: [],
    direction: 'inbound',
    workerId: 'webmail-clientum-worker-edge-1',
  },
];

// 30 Days of historical volume data from D1 database
const generate30DayVolume = () => {
  const days = [];
  const baseDate = new Date(2026, 8, 8); // Sep 8, 2026
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dayName = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    
    // Realistic pattern: lower on weekends, busy midweek
    const baseInbound = isWeekend ? Math.floor(6 + Math.random() * 5) : Math.floor(18 + Math.random() * 12);
    const baseOutbound = isWeekend ? Math.floor(3 + Math.random() * 4) : Math.floor(12 + Math.random() * 9);
    
    days.push({
      date: dayName,
      fullDate: d.toISOString().split('T')[0],
      inbound: baseInbound,
      outbound: baseOutbound,
      total: baseInbound + baseOutbound,
    });
  }
  return days;
};

const volume30Days = generate30DayVolume();

export const INITIAL_WEBMAIL_D1_STATS: WebmailD1Stats = {
  totalInbound: 584,
  totalOutbound: 396,
  unreadCount: 1,
  spamBlocked: 118,
  deliverySuccessRate: 99.8,
  averageResponseTimeMinutes: 14,
  dailyVolume: volume30Days,
  hourlyDistribution: [
    { hour: '08:00', inbound: 6, outbound: 2 },
    { hour: '09:00', inbound: 14, outbound: 8 },
    { hour: '10:00', inbound: 22, outbound: 15 },
    { hour: '11:00', inbound: 25, outbound: 18 },
    { hour: '12:00', inbound: 16, outbound: 10 },
    { hour: '13:00', inbound: 9, outbound: 6 },
    { hour: '14:00', inbound: 18, outbound: 14 },
    { hour: '15:00', inbound: 21, outbound: 17 },
    { hour: '16:00', inbound: 19, outbound: 13 },
    { hour: '17:00', inbound: 12, outbound: 9 },
    { hour: '18:00', inbound: 5, outbound: 3 },
  ],
  topSenders: [
    { domain: 'techcorp-latam.com', count: 48, pct: 24 },
    { domain: 'finanzasdigitales.com.ar', count: 36, pct: 18 },
    { domain: 'logisticalatam.com.ar', count: 31, pct: 16 },
    { domain: 'saludintegral.org.ar', count: 24, pct: 12 },
    { domain: 'agroexportadora.com', count: 22, pct: 11 },
    { domain: 'otros', count: 38, pct: 19 },
  ],
};
