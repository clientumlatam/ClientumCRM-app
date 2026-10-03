/**
 * Central API Documentation Registry for ClientumCRM
 * Contains all official REST endpoints, authentication protocols, rate limits,
 * payload definitions and multi-language code snippets (cURL, JavaScript, Python).
 */

export interface QueryParamDoc {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface StatusCodeDoc {
  code: number;
  description: string;
}

export interface EndpointDoc {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  category:
    | 'Deals & Pipeline'
    | 'Contactos & Leads'
    | 'WhatsApp & Emails'
    | 'E-Commerce & Tiendanube'
    | 'Facturación AFIP'
    | 'Pagos & Webhooks'
    | 'Seguridad & Autenticación';
  summary: string;
  description: string;
  authRequired: boolean;
  queryParams?: QueryParamDoc[];
  requestBody?: string;
  responseExample: string;
  curlExample: string;
  jsExample: string;
  pythonExample: string;
  statusCodes?: StatusCodeDoc[];
  tags: string[];
}

export const API_DOC_CATEGORIES = [
  'all',
  'Deals & Pipeline',
  'Contactos & Leads',
  'WhatsApp & Emails',
  'E-Commerce & Tiendanube',
  'Facturación AFIP',
  'Pagos & Webhooks',
  'Seguridad & Autenticación',
] as const;

export const API_DOCUMENTATION_REGISTRY: EndpointDoc[] = [
  {
    id: 'get-deals',
    method: 'GET',
    path: '/api/crm/records/opportunities',
    category: 'Deals & Pipeline',
    summary: 'Listar oportunidades del pipeline comercial',
    description:
      'Obtiene el listado paginado de negocios comerciales del pipeline con soporte para filtros por etapa de embudo, rango de fechas, moneda y usuario comercial asignado.',
    authRequired: true,
    tags: ['Deals', 'Pipeline', 'CRM'],
    queryParams: [
      { name: 'stage', type: 'string', required: false, description: 'Filtrar por etapa (lead, meeting, proposal, negotiation, won, lost)', example: 'proposal' },
      { name: 'limit', type: 'number', required: false, description: 'Cantidad máxima de registros por página (defecto: 50, máx: 250)', example: '50' },
      { name: 'currency', type: 'string', required: false, description: 'Filtrar por divisa (ARS o USD)', example: 'ARS' },
      { name: 'assignedTo', type: 'string', required: false, description: 'ID o email del vendedor responsable' }
    ],
    statusCodes: [
      { code: 200, description: 'Lista de oportunidades obtenida correctamente' },
      { code: 401, description: 'No autenticado o API Key inválida' },
      { code: 429, description: 'Límite de tasa excedido (120 req/min)' }
    ],
    responseExample: JSON.stringify(
      {
        success: true,
        count: 2,
        total: 18,
        data: [
          {
            id: 'opp_101',
            name: 'Implementación ERP Koalas',
            amount: 450000,
            currency: 'ARS',
            stage: 'proposal',
            contactName: 'Martín Benítez',
            companyName: 'Koalas Retail',
            probability: 70,
            closeDate: '2026-10-25',
            updatedAt: '2026-10-02T14:30:00Z'
          },
          {
            id: 'opp_102',
            name: 'Suscripción Enterprise Anual',
            amount: 1200000,
            currency: 'ARS',
            stage: 'negotiation',
            contactName: 'Laura Gómez',
            companyName: 'Distribuidora Sur',
            probability: 85,
            closeDate: '2026-10-18',
            updatedAt: '2026-10-02T15:10:00Z'
          }
        ]
      },
      null,
      2
    ),
    curlExample: `curl -X GET "https://api.clientum.com/api/crm/records/opportunities?limit=50&stage=proposal" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    jsExample: `const response = await fetch("https://api.clientum.com/api/crm/records/opportunities?limit=50&stage=proposal", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  }
});
const data = await response.json();
console.log(data);`,
    pythonExample: `import requests

url = "https://api.clientum.com/api/crm/records/opportunities"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
params = {"limit": 50, "stage": "proposal"}

response = requests.get(url, headers=headers, params=params)
print(response.json())`
  },
  {
    id: 'post-deals',
    method: 'POST',
    path: '/api/crm/records/opportunities',
    category: 'Deals & Pipeline',
    summary: 'Crear nueva oportunidad o trato',
    description:
      'Registra un nuevo negocio en el pipeline, dispara automatizaciones visuales asociadas, calcula scoring y envía notificaciones por WhatsApp o email.',
    authRequired: true,
    tags: ['Deals', 'Pipeline', 'Creación'],
    statusCodes: [
      { code: 201, description: 'Oportunidad creada exitosamente' },
      { code: 400, description: 'Parámetros obligatorios faltantes o tipo inválido' },
      { code: 401, description: 'API Key no autorizada' }
    ],
    requestBody: JSON.stringify(
      {
        name: 'Venta Mayorista Lote #45',
        amount: 850000,
        currency: 'ARS',
        stage: 'lead',
        contactId: 'ct_889',
        companyName: 'Logística Andina SA',
        priority: 'High',
        tags: ['Mayorista', 'Google Maps']
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        message: 'Oportunidad creada exitosamente.',
        id: 'opp_9941',
        createdAt: '2026-10-02T16:08:00.000Z',
        workflowsTriggered: ['Notificar WhatsApp Asignado', 'Crear Tarea Seguimiento 48hs']
      },
      null,
      2
    ),
    curlExample: `curl -X POST "https://api.clientum.com/api/crm/records/opportunities" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Venta Mayorista Lote #45",
    "amount": 850000,
    "currency": "ARS",
    "stage": "lead",
    "priority": "High"
  }'`,
    jsExample: `const response = await fetch("https://api.clientum.com/api/crm/records/opportunities", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Venta Mayorista Lote #45",
    amount: 850000,
    currency: "ARS",
    stage: "lead",
    priority: "High"
  })
});
const result = await response.json();
console.log(result);`,
    pythonExample: `import requests

url = "https://api.clientum.com/api/crm/records/opportunities"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "name": "Venta Mayorista Lote #45",
    "amount": 850000,
    "currency": "ARS",
    "stage": "lead",
    "priority": "High"
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`
  },
  {
    id: 'post-leads',
    method: 'POST',
    path: '/api/crm/records/people',
    category: 'Contactos & Leads',
    summary: 'Capturar nuevo prospecto con deduplicación inteligente',
    description:
      'Registra un contacto con validación de duplicados en tiempo real por email o teléfono normalizado E.164, enriquecimiento opcional y asignación automática.',
    authRequired: true,
    tags: ['Contactos', 'Leads', 'Deduplicación'],
    statusCodes: [
      { code: 201, description: 'Contacto creado o actualizado correctamente' },
      { code: 400, description: 'Formato de email o teléfono inválido' }
    ],
    requestBody: JSON.stringify(
      {
        firstName: 'Esteban',
        lastName: 'Navarro',
        email: 'esteban@empresa.com',
        phone: '+5491144556677',
        company: 'Navarro & Asoc.',
        role: 'Director de Compras',
        leadSource: 'Web Form',
        customFields: {
          rubro: 'Distribución',
          presupuestoEstimado: '1000000'
        }
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        contactId: 'ct_1204',
        created: true,
        deduplicationStatus: 'unique',
        meddicScore: 84
      },
      null,
      2
    ),
    curlExample: `curl -X POST "https://api.clientum.com/api/crm/records/people" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Esteban",
    "lastName": "Navarro",
    "email": "esteban@empresa.com",
    "phone": "+5491144556677"
  }'`,
    jsExample: `const response = await fetch("https://api.clientum.com/api/crm/records/people", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    firstName: "Esteban",
    lastName: "Navarro",
    email: "esteban@empresa.com",
    phone: "+5491144556677"
  })
});
const lead = await response.json();`,
    pythonExample: `import requests

payload = {
    "firstName": "Esteban",
    "lastName": "Navarro",
    "email": "esteban@empresa.com",
    "phone": "+5491144556677"
}
response = requests.post(
    "https://api.clientum.com/api/crm/records/people",
    json=payload,
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)
print(response.json())`
  },
  {
    id: 'post-crm-sync',
    method: 'POST',
    path: '/api/crm/records/sync',
    category: 'Contactos & Leads',
    summary: 'Sincronización masiva de registros (Batch Upsert)',
    description:
      'Permite sincronizar lotes de hasta 500 contactos, tratos o empresas en una sola transacción segura con resolución idempotente de duplicados.',
    authRequired: true,
    tags: ['Batch', 'Sync', 'Importación'],
    requestBody: JSON.stringify(
      {
        entityType: 'opportunities',
        records: [
          { externalId: 'ERP-101', name: 'Servicio Cloud Mensual', amount: 120000, stage: 'won' },
          { externalId: 'ERP-102', name: 'Licenciamiento SaaS Anual', amount: 980000, stage: 'negotiation' }
        ]
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        tenantId: 'clientum-default-tenant',
        upsertedCount: 2,
        duplicatesDetected: 0
      },
      null,
      2
    ),
    curlExample: `curl -X POST "https://api.clientum.com/api/crm/records/sync" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"entityType": "opportunities", "records": [{"name": "Trato 1", "amount": 100000}]}'`,
    jsExample: `const res = await fetch("https://api.clientum.com/api/crm/records/sync", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({ entityType: "opportunities", records: [{ name: "Trato 1", amount: 100000 }] })
});`,
    pythonExample: `import requests
requests.post(
    "https://api.clientum.com/api/crm/records/sync",
    json={"entityType": "opportunities", "records": [{"name": "Trato 1", "amount": 100000}]},
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)`
  },
  {
    id: 'post-whatsapp',
    method: 'POST',
    path: '/api/whatsapp/send',
    category: 'WhatsApp & Emails',
    summary: 'Enviar mensaje de WhatsApp transaccional',
    description:
      'Envía un mensaje de texto o plantilla interactiva a través del gateway Baileys o Meta Cloud API con registro automático en el historial de actividad.',
    authRequired: true,
    tags: ['WhatsApp', 'Mensajería', 'Omnicanal'],
    requestBody: JSON.stringify(
      {
        to: '+5491144556677',
        message: '¡Hola Esteban! Tu cotización #1042 ya está lista para revisión y firma digital.',
        targetType: 'opportunity',
        targetId: 'opp_101'
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        messageId: 'wa_msg_88491',
        status: 'delivered',
        timestamp: '2026-10-02T16:09:12Z'
      },
      null,
      2
    ),
    curlExample: `curl -X POST "https://api.clientum.com/api/whatsapp/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+5491144556677",
    "message": "Hola! Tu cotización ya está disponible."
  }'`,
    jsExample: `const res = await fetch("https://api.clientum.com/api/whatsapp/send", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: "+5491144556677",
    message: "Hola! Tu cotización ya está disponible."
  })
});`,
    pythonExample: `import requests

requests.post(
    "https://api.clientum.com/api/whatsapp/send",
    json={"to": "+5491144556677", "message": "Tu cotización está lista"},
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)`
  },
  {
    id: 'post-email-resend',
    method: 'POST',
    path: '/api/email/resend/send',
    category: 'WhatsApp & Emails',
    summary: 'Enviar correo con Resend API',
    description:
      'Despacha correos electrónicos transaccionales usando Resend con seguimiento de entrega, aperturas y clics en tiempo real.',
    authRequired: true,
    tags: ['Resend', 'Email', 'Transaccional'],
    requestBody: JSON.stringify(
      {
        to: ['cliente@empresa.com'],
        from: 'Clientum CRM <onboarding@resend.dev>',
        subject: 'Confirmación de Orden #4092',
        html: '<strong>Gracias por tu compra.</strong> Tu orden ha sido confirmada.'
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        id: 're_123456789',
        provider: 'resend',
        status: 'sent'
      },
      null,
      2
    ),
    curlExample: `curl -X POST "https://api.clientum.com/api/email/resend/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": ["cliente@empresa.com"],
    "subject": "Factura de Compra",
    "html": "<p>Adjuntamos el comprobante fiscal.</p>"
  }'`,
    jsExample: `const res = await fetch("https://api.clientum.com/api/email/resend/send", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: ["cliente@empresa.com"],
    subject: "Factura de Compra",
    html: "<p>Adjuntamos el comprobante fiscal.</p>"
  })
});`,
    pythonExample: `import requests

requests.post(
    "https://api.clientum.com/api/email/resend/send",
    json={"to": ["cliente@empresa.com"], "subject": "Factura", "html": "<p>Comprobante</p>"},
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)`
  },
  {
    id: 'post-tiendanube-webhook',
    method: 'POST',
    path: '/api/ecommerce/tiendanube/webhook',
    category: 'E-Commerce & Tiendanube',
    summary: 'Webhook Receptor de Tiendanube (Órdenes & Carritos)',
    description:
      'Punto de enlace para notificaciones de órdenes creadas, pagos recibidos y carritos abandonados desde Tiendanube, registrando automáticamente el cliente y la oportunidad en el CRM.',
    authRequired: false,
    tags: ['Tiendanube', 'E-Commerce', 'Webhooks'],
    requestBody: JSON.stringify(
      {
        event: 'order/created',
        store_id: 1849201,
        id: 45892,
        currency: 'ARS',
        total: '34990.00',
        customer: {
          name: 'Sofía Pereyra',
          email: 'sofia.pereyra@gmail.com',
          phone: '+5491138294411'
        },
        shipping_address: {
          city: 'Rosario',
          province: 'Santa Fe',
          zipcode: '2000'
        }
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        action: 'deal_created',
        opportunityId: 'opp_tiendanube_45892',
        contactId: 'ct_sofia_pereyra',
        afipInvoiceReady: true
      },
      null,
      2
    ),
    curlExample: `curl -X POST "https://api.clientum.com/api/ecommerce/tiendanube/webhook" \\
  -H "X-LinkedStore-HMAC-SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069" \\
  -H "Content-Type: application/json" \\
  -d '{"event": "order/created", "store_id": 1849201, "id": 45892, "total": "34990.00"}'`,
    jsExample: `// Notificación despachada automáticamente por Tiendanube al emitirse una venta`,
    pythonExample: `# Endpoint receptor para configurar en el panel de Partners / Apps de Tiendanube`
  },
  {
    id: 'post-afip-invoice',
    method: 'POST',
    path: '/api/erp/afip/invoice',
    category: 'Facturación AFIP',
    summary: 'Emisión de Factura Electrónica AFIP (WSFE)',
    description:
      'Genera comprobantes oficiales Factura A, B, C o Nota de Crédito autorizadas con CAE, código de barras fiscal y PDF emitido para el comprador.',
    authRequired: true,
    tags: ['AFIP', 'Facturación', 'CAE'],
    requestBody: JSON.stringify(
      {
        cbteTipo: 6,
        docTipo: 96,
        docNro: '34892011',
        impTotal: 45000.0,
        impNeto: 37190.08,
        impIVA: 7809.92,
        concepto: 2,
        fchServDesde: '20261001',
        fchServHasta: '20261031'
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        success: true,
        cae: '74392819028491',
        caeVto: '2026-10-12',
        cbteNro: 1042,
        puntoVenta: 4,
        pdfUrl: 'https://api.clientum.com/invoices/fc-b-0004-00001042.pdf'
      },
      null,
      2
    ),
    curlExample: `curl -X POST "https://api.clientum.com/api/erp/afip/invoice" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "cbteTipo": 6,
    "docTipo": 96,
    "docNro": "34892011",
    "impTotal": 45000.00
  }'`,
    jsExample: `const response = await fetch("https://api.clientum.com/api/erp/afip/invoice", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    cbteTipo: 6,
    docTipo: 96,
    docNro: "34892011",
    impTotal: 45000.00
  })
});
const invoice = await response.json();`,
    pythonExample: `import requests

payload = {"cbteTipo": 6, "docTipo": 96, "docNro": "34892011", "impTotal": 45000.00}
r = requests.post(
    "https://api.clientum.com/api/erp/afip/invoice",
    json=payload,
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)`
  },
  {
    id: 'post-webhook-mp',
    method: 'POST',
    path: '/api/webhooks/mercadopago',
    category: 'Pagos & Webhooks',
    summary: 'Webhook Receptor de Mercado Pago (IPN / Webhooks)',
    description:
      'Punto de entrada para notificaciones emitidas por Mercado Pago tras eventos de pagos y suscripciones aprobadas, actualizando el estado de tratos y facturación automáticamente.',
    authRequired: false,
    tags: ['Mercado Pago', 'Pagos', 'Suscripciones'],
    requestBody: JSON.stringify(
      {
        action: 'payment.created',
        data: { id: '1234567890' },
        type: 'payment'
      },
      null,
      2
    ),
    responseExample: JSON.stringify(
      {
        status: 200,
        received: true,
        processed: true,
        associatedDealStage: 'won'
      },
      null,
      2
    ),
    curlExample: `curl -X POST "https://api.clientum.com/api/webhooks/mercadopago" \\
  -H "x-signature: ts=1600000000,v1=abcdef..." \\
  -H "Content-Type: application/json" \\
  -d '{"action": "payment.created", "data": {"id": "1234567890"}}'`,
    jsExample: `// Notificación entrante enviada directamente por los servidores de Mercado Pago`,
    pythonExample: `# Endpoint receptor para configurar en https://www.mercadopago.com.ar/developers/`
  }
];

/**
 * Filter documentation registry by category and search query
 */
export function getApiEndpoints(category: string = 'all', query: string = ''): EndpointDoc[] {
  const cleanQuery = query.toLowerCase().trim();
  return API_DOCUMENTATION_REGISTRY.filter((ep) => {
    const matchCategory = category === 'all' || ep.category === category;
    const matchQuery =
      !cleanQuery ||
      ep.path.toLowerCase().includes(cleanQuery) ||
      ep.summary.toLowerCase().includes(cleanQuery) ||
      ep.description.toLowerCase().includes(cleanQuery) ||
      ep.method.toLowerCase().includes(cleanQuery) ||
      ep.tags.some((t) => t.toLowerCase().includes(cleanQuery));

    return matchCategory && matchQuery;
  });
}

/**
 * Generate full OpenAPI 3.0 specification object
 */
export function generateOpenApiSpec(): Record<string, any> {
  return {
    openapi: '3.0.3',
    info: {
      title: 'ClientumCRM External Integrations API',
      version: '1.0.0',
      description:
        'Especificación OpenAPI oficial para conectar tiendas e-commerce (Tiendanube/WooCommerce), ERPs, AFIP, canales de mensajería WhatsApp y pasarelas de pago con ClientumCRM.',
      contact: {
        name: 'Clientum Developer Relations',
        email: 'soporte@clientum.com',
        url: 'https://clientum.com'
      }
    },
    servers: [
      {
        url: 'https://api.clientum.com',
        description: 'Servidor de Producción Clientum Cloud'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'API Key (clt_live_...)'
        }
      }
    },
    security: [{ BearerAuth: [] }],
    paths: API_DOCUMENTATION_REGISTRY.reduce((acc, ep) => {
      const methodKey = ep.method.toLowerCase();
      if (!acc[ep.path]) acc[ep.path] = {};

      acc[ep.path][methodKey] = {
        summary: ep.summary,
        description: ep.description,
        tags: [ep.category],
        security: ep.authRequired ? [{ BearerAuth: [] }] : [],
        parameters: (ep.queryParams || []).map((q) => ({
          name: q.name,
          in: 'query',
          required: q.required,
          description: q.description,
          schema: { type: q.type }
        })),
        ...(ep.requestBody
          ? {
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      example: JSON.parse(ep.requestBody)
                    }
                  }
                }
              }
            }
          : {}),
        responses: {
          '200': {
            description: 'Operación exitosa',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: JSON.parse(ep.responseExample)
                }
              }
            }
          }
        }
      };
      return acc;
    }, {} as Record<string, any>)
  };
}
