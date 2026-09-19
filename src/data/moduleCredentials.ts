export interface ModuleCredentialField {
  id: string;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: 'secret' | 'text' | 'select';
  options?: Array<{ value: string; label: string }>;
}

export interface PlatformConfiguration {
  key: string;
  label: string;
  kind: 'server-secret' | 'public-config' | 'managed-connection';
  description: string;
}

export interface ModuleCredentialDefinition {
  id: string;
  label: string;
  group: string;
  description: string;
  fields: ModuleCredentialField[];
  note?: string;
  platformConfigurations?: PlatformConfiguration[];
}

const field = (
  id: string,
  label: string,
  placeholder: string,
  description?: string,
): ModuleCredentialField => ({ id, label, placeholder, description });

const platform = (
  key: string,
  label: string,
  kind: PlatformConfiguration['kind'],
  description: string,
): PlatformConfiguration => ({ key, label, kind, description });

const platformGroup = (...configurations: PlatformConfiguration[]) => ({
  platformConfigurations: configurations,
});

const AFIP_ENVIRONMENTS = [
  { value: 'homologacion', label: 'Homologación' },
  { value: 'produccion', label: 'Producción' },
];

const WHATSAPP = [
  field('WHATSAPP_ACCESS_TOKEN', 'WhatsApp Access Token', 'EAAB••••••••••••••••'),
  field('WHATSAPP_APP_SECRET', 'WhatsApp App Secret', '••••••••••••••••'),
  field('WHATSAPP_PHONE_NUMBER_ID', 'Phone Number ID', '123456789012345'),
  field('WHATSAPP_BUSINESS_ACCOUNT_ID', 'Business Account ID', '123456789012345'),
  field('WHATSAPP_WEBHOOK_VERIFY_TOKEN', 'Webhook Verify Token', 'token-de-verificacion'),
];

const MERCADOPAGO = [
  field('MERCADOPAGO_ACCESS_TOKEN', 'Mercado Pago Access Token', 'APP_USR-••••••••••••'),
  field('MERCADOPAGO_WEBHOOK_SECRET', 'Webhook Secret', '••••••••••••••••'),
  field('MERCADOPAGO_PUBLIC_KEY', 'Public Key', 'APP_USR-••••••••••••', 'Clave pública de la cuenta de esta empresa.'),
];

export const MODULE_CREDENTIALS: ModuleCredentialDefinition[] = [
  {
    id: 'dashboard',
    label: 'Resumen Ejecutivo',
    group: 'Gestión comercial',
    description: 'Métricas locales del CRM y datos del pipeline.',
    fields: [],
    note: 'Este módulo no necesita credenciales externas.',
  },
  {
    id: 'featureHub',
    label: 'Centro de funciones',
    group: 'Gestión comercial',
    description: 'Reutiliza las credenciales del módulo que abras.',
    fields: [],
    note: 'Configura la credencial desde el módulo específico para evitar duplicados.',
  },
  {
    id: 'opportunities',
    label: 'Pipeline Negocios',
    group: 'Gestión comercial',
    description: 'Pipeline, empresas, contactos y tareas del CRM.',
    fields: [],
    note: 'Los datos se gestionan dentro del CRM y no requieren una API key externa.',
  },
  {
    id: 'webmail',
    label: 'Webmail SMTP + Routing',
    group: 'Gestión comercial',
    description: 'Correo transaccional y routing de la plataforma.',
    fields: [],
    note: 'La configuración de SMTP, Cloudflare D1 y el Worker pertenece a la plataforma y se administra en Secrets. No se solicita a cada empresa.',
  },
  { id: 'companies', label: 'Empresas', group: 'Gestión comercial', description: 'Cuentas corporativas del CRM.', fields: [], note: 'Este módulo no necesita credenciales externas.' },
  { id: 'people', label: 'Contactos', group: 'Gestión comercial', description: 'Directorio de contactos del CRM.', fields: [], note: 'Este módulo no necesita credenciales externas.' },
  { id: 'tasks', label: 'Tareas & Actividades', group: 'Gestión comercial', description: 'Actividades y recordatorios del CRM.', fields: [], note: 'Este módulo no necesita credenciales externas.' },
  { id: 'calendar', label: 'Calendario', group: 'Gestión comercial', description: 'Agenda comercial y sincronización de reuniones.', fields: [], note: 'La sincronización se administra mediante una conexión OAuth dedicada.' },
  { id: 'analytics', label: 'Reportes & BI', group: 'Gestión comercial', description: 'Analítica local y reportes del espacio.', fields: [], note: 'Actualmente usa datos locales y no necesita credenciales externas.' },
  { id: 'whatsapp', label: 'WhatsApp CRM', group: 'Gestión comercial', description: 'WhatsApp Cloud API para conversaciones y envíos.', fields: WHATSAPP },
  {
    id: 'erp',
    label: 'Facturación AFIP (CAE)',
    group: 'Gestión comercial',
    description: 'Certificado y credenciales para facturación electrónica.',
    fields: [
      field('AFIP_CERTIFICATE_P12_BASE64', 'Certificado P12 (Base64)', '••••••••••••••••'),
      field('AFIP_PRIVATE_KEY', 'Clave privada', '••••••••••••••••'),
      field('AFIP_PRIVATE_KEY_PASSWORD', 'Contraseña de clave privada', '••••••••••••••••'),
      field('AFIP_CUIT', 'CUIT emisor', '20-12345678-9'),
      { ...field('AFIP_ENVIRONMENT', 'Entorno', 'homologacion'), inputType: 'select', options: AFIP_ENVIRONMENTS },
    ],
    note: 'El certificado y la contraseña se envían únicamente al backend, se cifran por workspace y nunca se devuelven al navegador.',
  },
  {
    id: 'propuestas',
    label: 'Propuestas & Presupuestos',
    group: 'Ventas & cierre',
    description: 'Envío de propuestas y presupuestos por email.',
    fields: [],
    note: 'El proveedor de email es de plataforma y se administra en Secrets. No se solicita una clave global a cada empresa.',
  },
  {
    id: 'googleMaps',
    label: 'Prospección Maps B2B',
    group: 'Ventas & cierre',
    description: 'Geocodificación y Places para prospección B2B.',
    fields: [
      field('GOOGLE_MAPS_SERVER_API_KEY', 'Google Maps Server API Key', 'AIza••••••••••••••••'),
    ],
  },
  { id: 'meddic', label: 'Lead Scoring MEDDIC', group: 'Ventas & cierre', description: 'Scoring y priorización de oportunidades.', fields: [], note: 'La IA usa GEMINI_API_KEY de plataforma; no se guarda una clave Gemini por empresa.' },
  { id: 'chatbot', label: 'Chatbot WhatsApp 24/7', group: 'Ventas & cierre', description: 'Respuestas automáticas y atención conversacional.', fields: WHATSAPP, note: 'WhatsApp pertenece a la empresa. La IA usa GEMINI_API_KEY de plataforma.' },
  {
    id: 'campaigns',
    label: 'Campañas Masivas',
    group: 'Ventas & cierre',
    description: 'Campañas de WhatsApp y email con control de consentimiento.',
    fields: WHATSAPP,
    note: 'Los proveedores de email de plataforma se administran en Secrets. WhatsApp sí se guarda por empresa.',
  },
  { id: 'agenteOS', label: 'Agent OS (14 Agentes)', group: 'Inteligencia artificial', description: 'Orquestación de agentes de IA.', fields: [], note: 'Usa GEMINI_API_KEY de plataforma.' },
  { id: 'aiAssistant', label: 'Asistente Gemini 3.6', group: 'Inteligencia artificial', description: 'Copilot, resúmenes y asistencia generativa.', fields: [], note: 'Usa GEMINI_API_KEY de plataforma.' },
  { id: 'gtmStrategy', label: 'Estrategias GTM', group: 'Inteligencia artificial', description: 'Planes go-to-market generados con IA.', fields: [], note: 'Usa GEMINI_API_KEY de plataforma.' },
  { id: 'sdrOutreach', label: 'Agente SDR Outreach', group: 'Inteligencia artificial', description: 'Prospección y outreach asistido por IA.', fields: WHATSAPP, note: 'La IA y el proveedor de email son de plataforma; WhatsApp pertenece a la empresa.' },
  { id: 'tiendaDigital', label: 'Tienda Digital WhatsApp', group: 'Operaciones & sistema', description: 'Catálogo, conversaciones y cobros.', fields: [...WHATSAPP, ...MERCADOPAGO] },
  { id: 'campusLMS', label: 'Campus Academia LMS', group: 'Operaciones & sistema', description: 'Cursos, alumnos y contenidos.', fields: [], note: 'La implementación actual no necesita credenciales externas.' },
  { id: 'workflows', label: 'Workflows & Flujos', group: 'Operaciones & sistema', description: 'Automatizaciones y proveedores conectados.', fields: [], note: 'Las credenciales se configuran dentro de cada conexión para mantener el alcance mínimo.' },
  { id: 'customObjects', label: 'Custom Objects Studio', group: 'Operaciones & sistema', description: 'Objetos, campos y registros personalizados.', fields: [], note: 'Este módulo no necesita credenciales externas.' },
  { id: 'csvStudio', label: 'CSV Import & Export', group: 'Operaciones & sistema', description: 'Importación y exportación de archivos.', fields: [], note: 'El procesamiento actual se realiza en el navegador.' },
  { id: 'domainManager', label: 'Gestor de Dominios', group: 'Operaciones & sistema', description: 'Cloudflare DNS y SSL por zona.', fields: [], note: 'Cloudflare API, Account ID y Zone ID pertenecen a la plataforma y se administran en Secrets.' },
  { id: 'settings', label: 'Configuración General', group: 'Operaciones & sistema', description: 'Ajustes del espacio, acceso y permisos.', fields: [], note: 'Las variables VITE_FIREBASE_* son configuración pública del entorno; no deben pedirse como secretos de usuario.' },
  { id: 'messages', label: 'Mensajes', group: 'Comunicación & marketing', description: 'Centro unificado de conversaciones.', fields: [], note: 'El módulo actual utiliza datos locales y no requiere credenciales externas.' },
];

const PLATFORM_CONFIGURATIONS: Record<string, PlatformConfiguration[]> = {
  webmail: [
    platform('SMTP_HOST', 'Servidor SMTP', 'server-secret', 'Remitente transaccional administrado por la plataforma.'),
    platform('SMTP_PORT', 'Puerto SMTP', 'server-secret', 'Configuración de transporte del correo.'),
    platform('SMTP_USER', 'Usuario SMTP', 'server-secret', 'Cuenta de envío del sistema.'),
    platform('SMTP_PASSWORD', 'Contraseña SMTP', 'server-secret', 'Nunca se expone al navegador.'),
    platform('CLOUDFLARE_ACCOUNT_ID', 'Cloudflare Account ID', 'public-config', 'Identificador de la cuenta del Worker/D1.'),
    platform('CLOUDFLARE_D1_DATABASE_ID', 'Cloudflare D1 Database ID', 'public-config', 'Identificador de la base de correo.'),
    platform('CLOUDFLARE_EMAIL_WORKER_URL', 'Email Worker URL', 'public-config', 'Endpoint interno para routing de correo.'),
    platform('CLOUDFLARE_API_TOKEN', 'Cloudflare API Token', 'server-secret', 'Token restringido, solo backend.'),
    platform('CLOUDFLARE_EMAIL_WORKER_SECRET', 'Email Worker Secret', 'server-secret', 'Firma compartida entre el backend y el Worker.'),
    platform('WEBMAIL_ENCRYPTION_KEY', 'Webmail Encryption Key', 'server-secret', 'Cifrado server-side del contenido o credenciales.'),
  ],
  calendar: [
    platform('GOOGLE_CLIENT_ID', 'Google OAuth Client ID', 'managed-connection', 'Se conecta mediante OAuth; no se guarda como credencial del módulo.'),
    platform('GOOGLE_CLIENT_SECRET', 'Google OAuth Client Secret', 'managed-connection', 'Se mantiene en el backend o en una integración administrada.'),
  ],
  analytics: [
    platform('GA_MEASUREMENT_ID', 'Google Analytics Measurement ID', 'public-config', 'Opcional y público; no es un secreto.'),
    platform('POSTHOG_PUBLIC_KEY', 'PostHog Public Key', 'public-config', 'Opcional y restringido por dominio.'),
    platform('POSTHOG_API_KEY', 'PostHog API Key', 'server-secret', 'Solo si los eventos se envían desde el backend.'),
  ],
  propuestas: [
    platform('RESEND_API_KEY', 'Resend API Key', 'server-secret', 'Elegir Resend o SMTP; nunca ambos como proveedores activos.'),
    platform('SENDGRID_API_KEY', 'SendGrid API Key', 'server-secret', 'Proveedor alternativo de email server-side.'),
    platform('MAIL_FROM_ADDRESS', 'Mail From Address', 'public-config', 'Remitente validado de la plataforma.'),
    platform('MAIL_FROM_NAME', 'Mail From Name', 'public-config', 'Nombre del remitente visible.'),
    platform('SMTP_HOST', 'SMTP Host', 'server-secret', 'Alternativa SMTP administrada por la plataforma.'),
    platform('SMTP_PORT', 'SMTP Port', 'server-secret', 'Puerto SMTP de la plataforma.'),
    platform('SMTP_USER', 'SMTP User', 'server-secret', 'Usuario SMTP de la plataforma.'),
    platform('SMTP_PASSWORD', 'SMTP Password', 'server-secret', 'Contraseña SMTP, solo backend.'),
  ],
  googleMaps: [
    platform('VITE_GOOGLE_MAPS_API_KEY', 'Google Maps Browser API Key', 'public-config', 'Opcional para mapas del navegador; debe estar restringida por dominio y APIs.'),
  ],
  meddic: [
    platform('GEMINI_API_KEY', 'Gemini API Key', 'server-secret', 'Capacidad de IA compartida por la plataforma.'),
  ],
  chatbot: [
    platform('GEMINI_API_KEY', 'Gemini API Key', 'server-secret', 'Capacidad de IA compartida por la plataforma.'),
  ],
  campaigns: [
    platform('GEMINI_API_KEY', 'Gemini API Key', 'server-secret', 'Contenido asistido por IA de la plataforma.'),
    platform('RESEND_API_KEY', 'Resend API Key', 'server-secret', 'Proveedor de email administrado por la plataforma.'),
    platform('SENDGRID_API_KEY', 'SendGrid API Key', 'server-secret', 'Proveedor alternativo de email administrado por la plataforma.'),
    platform('EMAIL_WEBHOOK_SIGNING_SECRET', 'Email Delivery Signing Secret', 'server-secret', 'Firma de eventos de entrega.'),
    platform('UNSUBSCRIBE_SIGNING_SECRET', 'Unsubscribe Signing Secret', 'server-secret', 'Firma de enlaces de baja.'),
  ],
  agenteOS: [
    platform('GEMINI_API_KEY', 'Gemini API Key', 'server-secret', 'Clave compartida de IA, solo backend.'),
  ],
  aiAssistant: [
    platform('GEMINI_API_KEY', 'Gemini API Key', 'server-secret', 'Clave compartida de IA, solo backend.'),
  ],
  gtmStrategy: [
    platform('GEMINI_API_KEY', 'Gemini API Key', 'server-secret', 'Clave compartida de IA, solo backend.'),
  ],
  sdrOutreach: [
    platform('GEMINI_API_KEY', 'Gemini API Key', 'server-secret', 'Clave compartida de IA, solo backend.'),
    platform('RESEND_API_KEY', 'Resend API Key', 'server-secret', 'Proveedor de email de plataforma.'),
    platform('SENDGRID_API_KEY', 'SendGrid API Key', 'server-secret', 'Proveedor alternativo de email.'),
  ],
  tiendaDigital: [
    platform('MERCADOPAGO_ENVIRONMENT', 'Mercado Pago Environment', 'public-config', 'Sandbox o producción, controlado por la plataforma.'),
  ],
  workflows: [
    platform('WORKFLOW_ENCRYPTION_KEY', 'Workflow Encryption Key', 'server-secret', 'Cifrado server-side de conexiones serializadas.'),
    platform('N8N_API_KEY', 'n8n API Key', 'managed-connection', 'Se configura dentro de una conexión n8n dedicada.'),
    platform('MAKE_WEBHOOK_SECRET', 'Make Webhook Secret', 'managed-connection', 'Se configura dentro de una conexión Make dedicada.'),
    platform('ZAPIER_WEBHOOK_SECRET', 'Zapier Webhook Secret', 'managed-connection', 'Se configura dentro de una conexión Zapier dedicada.'),
  ],
  domainManager: [
    platform('CLOUDFLARE_API_TOKEN', 'Cloudflare API Token', 'server-secret', 'Token limitado a la zona o cuenta necesaria.'),
    platform('CLOUDFLARE_ACCOUNT_ID', 'Cloudflare Account ID', 'public-config', 'Identificador de la cuenta.'),
    platform('CLOUDFLARE_ZONE_ID', 'Cloudflare Zone ID', 'public-config', 'Identificador de la zona DNS.'),
    platform('CLOUDFLARE_ZONE_NAME', 'Cloudflare Zone Name', 'public-config', 'Nombre de la zona administrada.'),
  ],
  settings: [
    platform('VITE_FIREBASE_API_KEY', 'Firebase API Key', 'public-config', 'Configuración pública restringida por dominio.'),
    platform('VITE_FIREBASE_AUTH_DOMAIN', 'Firebase Auth Domain', 'public-config', 'Dominio público de autenticación.'),
    platform('VITE_FIREBASE_PROJECT_ID', 'Firebase Project ID', 'public-config', 'Identificador público del proyecto.'),
    platform('VITE_FIREBASE_STORAGE_BUCKET', 'Firebase Storage Bucket', 'public-config', 'Bucket público configurado para el proyecto.'),
    platform('VITE_FIREBASE_MESSAGING_SENDER_ID', 'Firebase Messaging Sender ID', 'public-config', 'Identificador público de mensajería.'),
    platform('VITE_FIREBASE_APP_ID', 'Firebase App ID', 'public-config', 'Identificador público de la aplicación.'),
    platform('SESSION_SECRET', 'Session Secret', 'server-secret', 'Solo necesario si se agregan sesiones server-side.'),
  ],
};

export const getModuleCredentialDefinition = (moduleId: string): ModuleCredentialDefinition => {
  const definition = MODULE_CREDENTIALS.find((module) => module.id === moduleId);
  if (!definition) {
    return {
      id: moduleId,
      label: moduleId,
      group: 'Módulo',
      description: 'Configuración de credenciales del módulo.',
      fields: [],
      note: 'No hay credenciales adicionales definidas para este módulo.',
    };
  }
  return {
    ...definition,
    platformConfigurations: PLATFORM_CONFIGURATIONS[moduleId] || definition.platformConfigurations || [],
  };
};

export const moduleNeedsUserCredentials = (moduleId: string): boolean =>
  MODULE_CREDENTIALS.some((module) => module.id === moduleId && module.fields.length > 0);