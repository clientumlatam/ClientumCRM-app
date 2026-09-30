import { jsPDF } from 'jspdf';
import fs from 'node:fs';
import path from 'node:path';

async function generateKoalasPdf() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182

  // Color Palette
  const NAVY = [9, 15, 30]; // #090F1E
  const CYAN = [14, 165, 233]; // #0EA5E9
  const DARK = [30, 41, 59]; // #1E293B
  const MUTED = [100, 116, 139]; // #64748B
  const CARD_BG = [248, 250, 252]; // #F8FAFC
  const CARD_BORDER = [226, 232, 240]; // #E2E8F0
  const HIGHLIGHT = [37, 99, 235]; // #2563EB

  let currentPage = 1;

  function drawHeader() {
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageWidth, 16, 'F');

    doc.setFillColor(CYAN[0], CYAN[1], CYAN[2]);
    doc.rect(0, 16, pageWidth, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('CLIENTUM CRM & CLOUD SOLUTIONS', margin, 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text('PROPUESTA TÉCNICO-COMERCIAL — VENTAS KOALAS', pageWidth - margin, 10.5, { align: 'right' });
  }

  function drawFooter(page, totalPages) {
    const footerY = pageHeight - 12;

    doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text('Documento Confidencial · Preparado exclusivamente para Koalas', margin, footerY + 3);

    const pageText = `Página ${page} de ${totalPages}`;
    doc.text(pageText, pageWidth - margin, footerY + 3, { align: 'right' });
  }

  let y = 24;

  function ensureSpace(neededHeight) {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      currentPage++;
      drawHeader();
      y = 24;
    }
  }

  // Draw initial header
  drawHeader();

  // Cover / Header Banner
  doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
  doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');

  // Accent bar on card
  doc.setFillColor(CYAN[0], CYAN[1], CYAN[2]);
  doc.roundedRect(margin, y, 4, 38, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('Propuesta Técnico-Comercial & Arquitectura Operativa', margin + 8, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2]);
  doc.text('Tienda Online, Logística, Stock en Tiempo Real y CRM — Ventas Koalas', margin + 8, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text('Cliente: Koalas Indumentaria & Diseño   ·   Fecha: Septiembre 2026   ·   Versión: 2.4 Final Consolidada', margin + 8, y + 25);
  doc.text('Alcance: E-Commerce, Catálogo Web, Logística Geocercada, Bot WhatsApp IA, WSFE AFIP y Depósito.', margin + 8, y + 31);

  y += 44;

  // Sections definitions
  const sections = [
    {
      num: '1',
      title: 'Sincronización y Actualización de Stock en la Página',
      bullets: [
        'Tiempo Real Nativo (0 segundos): La tienda web y el inventario central operan con Webhooks y APIs bidireccionales. Cada compra descuenta las unidades de inmediato.',
        'Prevención de Sobreventa (Anti-quiebre): En caso de compras simultáneas de una última unidad, el motor transaccional bloquea el duplicado en milisegundos.',
        'Sincronización Multicanal: Movimientos registrados en mostrador físico, caja o depósito impactan instantáneamente en la tienda web.',
      ]
    },
    {
      num: '2',
      title: 'Ingreso de Mercadería al Stock: Tiempo de Impacto',
      bullets: [
        'Impacto Inmediato: Al confirmar el remito de ingreso o escanear el código de barras/QR, el stock se actualiza en el acto.',
        'Reactivación Automática: Los artículos con etiqueta "Agotado" pasan automáticamente a "Disponible" para compra.',
        'Flujo Operativo: Recepción física -> Ingreso en ERP/Depósito -> Publicación digital con 1 clic (con opción de control de calidad previo).'
      ]
    },
    {
      num: '3',
      title: 'Logística, Cálculo de Fletes y Entregas Sin Cargo',
      bullets: [
        'Integración con Operadores Logísticos: Andreani, Correo Argentino, OCA, Shipnow, Moova. Cotización automática por Código Postal (CP), peso y cubicaje.',
        'Logística Propia / Cadetería por Zonas: Zona 1 (Cercanía local), Zona 2 (Periferia/Municipios aledaños), Zona 3 (Nacional / Expresos).',
        'Políticas de Envío Sin Cargo: Bonificación por radio geográfico estipulado (ej. 3 a 5 km desde depósito) y por monto mínimo de compra (ticket promedio).'
      ]
    },
    {
      num: '4',
      title: 'Consultas Técnicas: Chatbot Autónomo vs. Derivación a WhatsApp',
      bullets: [
        'Modelo Híbrido Inteligente: Chatbot en web resuelve 24/7 dudas frecuentes, tablas de medidas, materiales, lavado, garantías y medios de pago.',
        'Derivación Contextual con 1 Clic: Botón en cada ficha técnica "Consultar por WhatsApp" que abre el chat con el nombre y SKU del producto precargado.',
        'Escalamiento Humano Asistido: Cuando el bot detecta una consulta técnica compleja o un cliente solicitando asesor, deriva el contacto al CRM con historial completo.'
      ]
    },
    {
      num: '5',
      title: 'Captación de Clientes Más Allá de las Redes Sociales',
      bullets: [
        'SEO Orgánico en Google: Posicionamiento del catálogo para búsquedas de alta intención ("comprar artículos koalas en zona", talles, modelos).',
        'Google Mi Negocio / Google Maps: Ficha comercial geolocalizada con reseñas, fotos de productos y enlace directo a la tienda online.',
        'Google Ads & Google Shopping: Anuncios destacados con foto y precio que capturan al usuario en el momento exacto de compra.',
        'Recompra & Fidelización: Campañas automatizadas por WhatsApp y Email a clientes que ya compraron, más código QR con descuento en packaging físico.'
      ]
    },
    {
      num: '6',
      title: 'Búsqueda por Navegador y Radio Geográfico de Ventas',
      bullets: [
        'Área de Servicio en Google: Configuración del radio exacto de atención comercial para que Google priorice a Koalas en búsquedas locales.',
        'Campañas Geocercadas (Geofencing en Google Ads): Publicidad segmentada exclusivamente a usuarios dentro del radio en km de cobertura rentable.',
        'Verificador de Código Postal en Tienda: El cliente ingresa su CP y visualiza si califica para Envío Gratis o Entrega Express en el día.'
      ]
    },
    {
      num: '7',
      title: 'Pasarelas de Pago y Financiación Integrada',
      bullets: [
        'Mercado Pago Checkout Pro & Transparente: Tarjetas de crédito/débito, planes Cuota Simple, dinero en cuenta y Mercado Crédito (sin tarjeta).',
        'Transferencia Bancaria con Descuento Automático: Incentivo de X% OFF (ej. 10% o 15%) con validación automática y subida de comprobante.',
        'Efectivo contra Entrega: Habilitado para retiro en punto físico o cadetería local.'
      ]
    },
    {
      num: '8',
      title: 'Integración y Automatización Fiscal (AFIP / ARCA WSFE)',
      bullets: [
        'Emisión Automática de Comprobantes Electrónicos: Emisión de Facturas A, B, C y Ticket Consumidor Final vía Web Service con CAE oficial inmediato.',
        'Envío Digital al Comprador: Adjunto automático del PDF legal por correo electrónico y WhatsApp.'
      ]
    },
    {
      num: '9',
      title: 'Protocolo de Depósito: Picking, Packing y Etiquetas de Envío',
      bullets: [
        'Alerta de Pedido y Picking List: Aviso sonoro y visual en terminal de depósito para recolección ágil de mercadería.',
        'Control por Escaneo: Verificación de talle y modelo con lector de código de barras para eliminar errores de empaque.',
        'Impresión Térmica de Guías: Generación en 1 clic de etiqueta oficial con código de barras de Andreani/Correo y notificación de tracking al cliente.'
      ]
    },
    {
      num: '10',
      title: 'Panel de Control y Métricas Clave (KPIs en Vivo)',
      bullets: [
        'Tasa de Conversión Web, Ticket Promedio y Carritos Abandonados con rescate automático vía WhatsApp a los 45 minutos.',
        'Monitoreo de Costo Promedio de Flete y Tiempos de Despacho (SLA) para mantener la entrega en menos de 24 horas hábiles.'
      ]
    },
    {
      num: '11',
      title: 'Plantillas de Mensajes Transaccionales por WhatsApp',
      bullets: [
        'Compra Confirmada: "¡Hola {nombre}! 🎉 Confirmamos tu pago por ${total} (Pedido #{orden}). Tu paquete ya está en preparación."',
        'Despacho con Tracking: "¡Buenas noticias {nombre}! 📦 Tu pedido fue retirado por {correo}. Seguilo en vivo acá: {link_tracking}."',
        'Rescate de Carrito: "Hola {nombre} 👋 Guardamos tu stock por 2 horas y te dejamos un cupón especial 5% OFF: KOALASEXPRESS."',
        'Opinión en Google Maps: "¡Hola {nombre}! ¿Cómo fue tu experiencia con tu compra de Koalas? Dejanos tu reseña acá: {link_reviews}."'
      ]
    },
    {
      num: '12',
      title: 'Matriz de Roles y Seguridad del Personal (RBAC)',
      bullets: [
        'Administrador General: Acceso completo a facturación, márgenes, finanzas y configuración con 2FA.',
        'Encargado de Depósito: Gestión de picking, remitos, stock físico y etiquetas; sin acceso a datos bancarios ni márgenes.',
        'Vendedor de Mostrador / Atención: Gestión de chats de WhatsApp, catálogo y toma de pedidos manuales.',
        'Contabilidad: Acceso a libros de IVA digital, comprobantes AFIP/ARCA y liquidaciones de Mercado Pago.'
      ]
    },
    {
      num: '13',
      title: 'Gestión de Cambios, Devoluciones y Logística Inversa',
      bullets: [
        'Autogestión de Cambios Online: El cliente selecciona el motivo y el nuevo talle/color; validación automática de stock.',
        'Etiqueta Inversa: Impresión de etiqueta prepaga de correo para retorno ágil.',
        'Reincorporación a Stock: Al ingresar al depósito, el operario inspecciona la prenda y con 1 clic reincorpora la unidad a la tienda web.'
      ]
    },
    {
      num: '14',
      title: 'Infraestructura, Continuidad y Seguridad de Datos',
      bullets: [
        'Cloudflare CDN: Carga ultra rápida (menor a 1.2s) optimizada para celulares 4G y conexiones residenciales.',
        'Cifrado SSL/TLS 1.3 y Backups Diarios: Respaldos automáticos en la nube de pedidos, clientes y comprobantes fiscales.',
        'Modo Móvil de Contingencia: Capacidad de operar el panel y WhatsApp desde cualquier smartphone ante cortes de luz o internet en el local.'
      ]
    },
    {
      num: '15',
      title: 'Acuerdos de Nivel de Servicio (SLA) y Soporte Técnico Continuo',
      bullets: [
        'Disponibilidad del Sistema (Uptime): 99.8% mensual garantizado.',
        'Respuesta ante Incidencias Críticas: Menor a 2 horas (tienda o pasarela fuera de servicio). Consultas operativas resueltas en menos de 24 hs.',
        'Canal Exclusivo de Soporte: Asistencia técnica directa por WhatsApp y correo electrónico prioritario.'
      ]
    },
    {
      num: '16',
      title: 'Checklist de Requisitos Previos para el Inicio',
      bullets: [
        '[ ] 1. Dirección exacta del depósito o local central (Punto Cero para radio de envíos).',
        '[ ] 2. Número de WhatsApp Business oficial dedicado a la atención comercial.',
        '[ ] 3. Catálogo inicial en Excel/CSV (productos, talles, precios y stock inicial).',
        '[ ] 4. Logo en alta resolución y fotos de los productos.',
        '[ ] 5. Vinculación de cuenta de Mercado Pago y datos bancarios (Alias/CBU).',
        '[ ] 6. CUIT y delegación de punto de venta electrónico AFIP/ARCA WSFE.'
      ]
    },
    {
      num: '17',
      title: 'Cronograma de Implementación (4 Semanas)',
      bullets: [
        'Semana 1: Configuración de entorno, dominio, base de datos y carga de catálogo de productos.',
        'Semana 2: Integración de pasarelas de cobro, matrices de logística, radios de entrega y ticket mínimo.',
        'Semana 3: Entrenamiento del Chatbot IA, botones de WhatsApp, SEO local y pruebas de compra punta a punta.',
        'Semana 4: Capacitación al personal de ventas/depósito, activación de Google Ads por radio y Go-Live oficial.'
      ]
    }
  ];

  // Render each section
  for (const sec of sections) {
    ensureSpace(24);

    // Section title bar
    doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
    doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
    doc.roundedRect(margin, y, contentWidth, 7.5, 1.5, 1.5, 'FD');

    // Mini cyan tag
    doc.setFillColor(CYAN[0], CYAN[1], CYAN[2]);
    doc.rect(margin, y, 2.5, 7.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text(`${sec.num}. ${sec.title}`, margin + 5, y + 5.2);

    y += 11;

    // Bullets
    for (const bullet of sec.bullets) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(DARK[0], DARK[1], DARK[2]);

      const lines = doc.splitTextToSize(`• ${bullet}`, contentWidth - 4);
      ensureSpace(lines.length * 3.8 + 2);

      doc.text(lines, margin + 2, y);
      y += lines.length * 3.8 + 1.5;
    }

    y += 2.5;
  }

  // Acceptance / Signature section
  ensureSpace(45);
  doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
  doc.setDrawColor(CARD_BORDER[0], CARD_BORDER[1], CARD_BORDER[2]);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('Acta de Validación y Conformidad Comercial (Validez: 15 días)', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text('Por la Empresa Proveedora: CLIENTUM TECNOLOGÍA PyME', margin + 6, y + 14);
  doc.text('Firma: _____________________________________', margin + 6, y + 23);
  doc.text('Aclaración: Consultor de Implementaciones Clientum', margin + 6, y + 29);
  doc.text('Fecha: _____ / _____ / 2026', margin + 6, y + 34);

  doc.text('Por el Cliente: KOALAS INDUMENTARIA & DISEÑO', margin + 96, y + 14);
  doc.text('Firma: _____________________________________', margin + 96, y + 23);
  doc.text('Aclaración / Cargo: __________________________', margin + 96, y + 29);
  doc.text('Fecha: _____ / _____ / 2026', margin + 96, y + 34);

  // Draw footers on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(p, totalPages);
  }

  // Save to public and docs folders
  const outputData = doc.output('arraybuffer');
  const buffer = Buffer.from(outputData);

  const publicPath = path.resolve('public', 'propuesta-tecnica-comercial-koalas.pdf');
  const docsPath = path.resolve('docs', 'propuesta-tecnica-comercial-koalas.pdf');

  fs.writeFileSync(publicPath, buffer);
  fs.writeFileSync(docsPath, buffer);

  console.log(`PDF successfully written to:`);
  console.log(`- ${publicPath} (${buffer.length} bytes)`);
  console.log(`- ${docsPath} (${buffer.length} bytes)`);
  console.log(`Total Pages: ${totalPages}`);
}

generateKoalasPdf().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
