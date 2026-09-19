import React, { useEffect, useState } from 'react';
import { getClientumAuthJsonHeaders } from '../../lib/api';
import {
  LayoutGrid,
  Map,
  Percent,
  TrendingUp,
  Mail,
  MessageSquare,
  Bot,
  UserSquare2,
  Cpu,
  Target,
  FileText,
  Globe,
  Link2,
  Receipt,
  CreditCard,
  Code2,
  Check,
  Play,
  Sparkles,
  ArrowRight,
  Send,
  Plus,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight,
  QrCode,
  DollarSign,
  Download,
  Terminal,
  AlertCircle,
  Inbox,
  CheckCircle2,
  XCircle,
  CircleDot,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { STAGES } from '../../data/initialData';
import { getGmailMessages, sendGmailMessage } from '../../lib/gmailService';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  column: number;
  featured?: boolean;
}

type MercadoPagoCheckoutStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

interface MercadoPagoCheckout {
  checkoutId: string;
  preferenceId: string | null;
  externalReference: string;
  amount: number;
  currency: string;
  title: string;
  status: MercadoPagoCheckoutStatus;
  checkoutUrl: string | null;
  providerPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
}

const MERCADO_PAGO_STATUS_META: Record<MercadoPagoCheckoutStatus, {
  label: string;
  detail: string;
  className: string;
  icon: React.ElementType;
}> = {
  approved: {
    label: 'Aprobado',
    detail: 'Mercado Pago confirmó el pago.',
    className: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    icon: CheckCircle2,
  },
  pending: {
    label: 'Pendiente',
    detail: 'Aún no hay confirmación final del proveedor.',
    className: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    icon: CircleDot,
  },
  rejected: {
    label: 'Rechazado',
    detail: 'Mercado Pago rechazó el intento de pago.',
    className: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
    icon: XCircle,
  },
  cancelled: {
    label: 'Cancelado',
    detail: 'El checkout fue cancelado.',
    className: 'text-[var(--text-secondary,#475569)] dark:text-slate-300 bg-slate-500/10 border-slate-500/30',
    icon: AlertCircle,
  },
};

export const PowerSuiteView: React.FC<{ defaultModule?: string }> = ({ defaultModule }) => {
  const { opportunities, addOpportunity, addPerson, addCompany, addTask, updateOpportunity, showToast, triggerConfetti, setActiveTab, t, gmailAccessToken } = useCRM();
  const [selectedModule, setSelectedModule] = useState<string | null>(defaultModule || null);

  // Gmail State
  const [gmailMessages, setGmailMessages] = useState<any[]>([]);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // --- INTERACTIVE MODULE STATES ---
  // 2. Maps Prospección
  const [mapsCity, setMapsCity] = useState('Buenos Aires');
  const [mapsNiche, setMapsNiche] = useState('Gimnasios');
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsResults, setMapsResults] = useState<any[]>([]);

  // 3. MEDDIC Lead Scoring
  const [meddicM, setMeddicM] = useState(3); // 1-5
  const [meddicE, setMeddicE] = useState(2);
  const [meddicDc, setMeddicDc] = useState(3);
  const [meddicDp, setMeddicDp] = useState(2);
  const [meddicI, setMeddicI] = useState(4);
  const [meddicC, setMeddicC] = useState(3);
  const [meddicCalculated, setMeddicCalculated] = useState(false);

  // 4. Business Intelligence
  const [biCac, setBiCac] = useState(150);
  const [biLtv, setBiLtv] = useState(1200);
  const [biConversion, setBiConversion] = useState(4.5);

  // 5. Campañas & Automatización
  const [dripName, setDripName] = useState('Nurturing Prospectos Nuevos');
  const [dripSteps, setDripSteps] = useState([
    { delay: '0', action: 'Enviar Email de Bienvenida' },
    { delay: '3', action: 'Enviar Caso de Éxito PDF' },
    { delay: '7', action: 'Ofrecer Demo Agendada' }
  ]);

  // 6. WhatsApp Chatbot Simulator
  const [waMessages, setWaMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: '¡Hola! Bienvenido al asistente inteligente de WhatsApp de ClientumCRM. ¿En qué puedo ayudarte hoy?\n\n1. Precios 💰\n2. Agendar Demo 📅\n3. Soporte Técnico 🛠️' }
  ]);
  const [waInput, setWaInput] = useState('');

  // 7. Agente Outreach Automático SDR
  const [sdrLogs, setSdrLogs] = useState<string[]>([]);
  const [sdrRunning, setSdrRunning] = useState(false);

  // 8. Portal del Cliente Tickets
  const [portalTickets, setPortalTickets] = useState([
    { id: 'T-102', title: 'Error de sincronización con HubSpot', status: 'Abierto', date: 'Hoy' },
    { id: 'T-098', title: 'Solicitud de factura tipo A', status: 'Cerrado', date: 'Ayer' }
  ]);
  const [newTicketTitle, setNewTicketTitle] = useState('');

  // 9. Asistente IA Gemini 3.8
  const [geminiQuery, setGeminiQuery] = useState('Estrategia de retención para agencias de desarrollo');
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState('');

  // 10. Generador de Estrategias GTM
  const [gtmProduct, setGtmProduct] = useState('Plataforma SaaS para inmobiliarias');
  const [gtmAudience, setGtmAudience] = useState('Agentes de bienes raíces independientes');
  const [gtmLoading, setGtmLoading] = useState(false);
  const [gtmStrategy, setGtmStrategy] = useState('');

  // 11. AI Ad Copy Studio
  const [adProduct, setAdProduct] = useState('ClientumCRM Open Source');
  const [adPlatform, setAdPlatform] = useState('LinkedIn');
  const [adCopies, setAdCopies] = useState<string[]>([]);
  const [adLoading, setAdLoading] = useState(false);

  // 12. SEO Suite Complete
  const [seoDomain, setSeoDomain] = useState('mi-empresa.com');
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoResult, setSeoResult] = useState<any>(null);

  // 13. Integraciones Webhook
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.clientum.com/v1/deal-triggers');
  const [webhookLogs, setWebhookLogs] = useState<string[]>([]);

  // 14. Facturación AFIP
  const [afipCuit, setAfipCuit] = useState('20-38472910-8');
  const [afipType, setAfipType] = useState('Factura A');
  const [afipLoading, setAfipLoading] = useState(false);
  const [afipInvoice, setAfipInvoice] = useState<any>(null);

  // 15. Cobros MercadoPago
  const [mpAmount, setMpAmount] = useState(15000);
  const [mpLoading, setMpLoading] = useState(false);
  const [mpLink, setMpLink] = useState('');
  const [mpCheckoutId, setMpCheckoutId] = useState('');
  const [mpStatus, setMpStatus] = useState<MercadoPagoCheckoutStatus | null>(null);
  const [mpCheckouts, setMpCheckouts] = useState<MercadoPagoCheckout[]>([]);
  const [mpStatusLoading, setMpStatusLoading] = useState(false);
  const [mpStatusError, setMpStatusError] = useState('');
  const [mpProviderConfigured, setMpProviderConfigured] = useState<boolean | null>(null);

  // 16. Desarrollo Web - Embebido
  const [formWidgetTitle, setFormWidgetTitle] = useState('¡Escríbenos para recibir tu Demo!');
  const [webFormName, setWebFormName] = useState('');
  const [webFormEmail, setWebFormEmail] = useState('');

  const loadMercadoPagoStatus = async (checkoutId?: string) => {
    setMpStatusLoading(true);
    setMpStatusError('');
    try {
      const query = checkoutId ? `?checkoutId=${encodeURIComponent(checkoutId)}` : '';
      const response = await fetch(`/api/payments/status${query}`, {
        headers: await getClientumAuthJsonHeaders(),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo cargar el estado de los pagos.');
      }

      const checkouts = Array.isArray(payload.checkouts)
        ? payload.checkouts as MercadoPagoCheckout[]
        : [];
      const selectedCheckout = payload.checkout as MercadoPagoCheckout | null | undefined;
      setMpProviderConfigured(Boolean(payload.configured));
      setMpCheckouts(checkouts);

      if (selectedCheckout) {
        setMpCheckoutId(selectedCheckout.checkoutId);
        setMpStatus(selectedCheckout.status);
        setMpLink(selectedCheckout.checkoutUrl || '');
      } else if (checkoutId) {
        setMpStatus(null);
      } else if (mpCheckoutId) {
        const currentCheckout = checkouts.find((checkout) => checkout.checkoutId === mpCheckoutId);
        if (currentCheckout) setMpStatus(currentCheckout.status);
      }
    } catch (error: any) {
      setMpStatusError(error?.message || 'No se pudo cargar el estado de los pagos.');
    } finally {
      setMpStatusLoading(false);
    }
  };

  useEffect(() => {
    if (selectedModule === 'mercadopago') {
      void loadMercadoPagoStatus();
    }
  }, [selectedModule]);

  // --- FEATURES LIST EXACTLY CORRESPONDING TO THE 16 TILES ---
  const features: FeatureCard[] = [
    // Column 1
    { id: 'crm', title: 'CRM Inteligente', description: 'Kanban de oportunidades y gestión de deals', icon: LayoutGrid, column: 1 },
    { id: 'maps', title: 'Prospección Maps IA', description: 'Descubrí negocios por zona con Gemini AI', icon: Map, column: 1 },
    { id: 'meddic', title: 'Lead Scoring MEDDIC', description: 'Calificá leads con metodología empresaria B2B', icon: Percent, column: 1 },
    { id: 'bi', title: 'Business Intelligence', description: 'CAC, LTV y métricas de conversión en tiempo real', icon: TrendingUp, column: 1 },
    
    // Column 2
    { id: 'campaigns', title: 'Campañas & Automatización', description: 'Drip email, broadcast masivo y nurturing', icon: Mail, column: 2 },
    { id: 'gmail', title: 'Gmail Inbox', description: 'Visualiza tus correos', icon: Inbox, column: 2 },
    { id: 'chatbot', title: 'Chatbot WhatsApp 24/7', description: 'Atención automática, sin código ni IT', icon: MessageSquare, column: 2, featured: true },
    { id: 'outreach', title: 'Agente Outreach Automático', description: 'SDR IA que prospecta y hace seguimiento solo', icon: Bot, column: 2 },
    { id: 'portal', title: 'Portal del Cliente', description: 'Autoatención, tickets y seguimiento en línea', icon: UserSquare2, column: 2 },
    
    // Column 3
    { id: 'gemini', title: 'Asistente IA Gemini 3.8', description: 'Analista CMO disponible en todo momento', icon: Cpu, column: 3 },
    { id: 'gtm', title: 'Generador de Estrategias', description: 'Planes go-to-market con IA en minutos', icon: Target, column: 3 },
    { id: 'adcopy', title: 'AI Ad Copy Studio', description: 'Copys para LinkedIn, anuncios y email', icon: FileText, column: 3 },
    { id: 'seo', title: 'Suite SEO Completa', description: 'Keywords, auditoría, rank tracker y calendario', icon: Globe, column: 3 },
    
    // Column 4
    { id: 'integrations', title: '60+ Integraciones', description: 'WhatsApp, ERP, APIs, webhooks y más', icon: Link2, column: 4 },
    { id: 'afip', title: 'Facturá AFIP', description: 'Facturá electrónicamente sin salir del CRM', icon: Receipt, column: 4 },
    { id: 'mercadopago', title: 'Cobros MercadoPago', description: 'Suscripciones y links de pago automáticos', icon: CreditCard, column: 4 },
    { id: 'webdev', title: 'Desarrollo Web', description: 'Tu sitio conectado al CRM desde el día 1', icon: Code2, column: 4 }
  ];

  // --- ACTIONS ---
  
  // 2. Maps Prospecting Run
  const runMapsProspecting = async () => {
    setMapsLoading(true);
    fetch('/api/ai/prospect', {
      method: 'POST',
       headers: await getClientumAuthJsonHeaders(),
      body: JSON.stringify({ city: mapsCity, niche: mapsNiche })
    })
      .then(res => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then(data => {
        setMapsResults(data.results);
        setMapsLoading(false);
        showToast('Descubrimiento completado con Gemini AI', 'success');
      })
      .catch((err) => {
        console.warn('Real prospecting failed, falling back to simulation:', err);
        const mockPlaces = [
          { name: `${mapsNiche} El Templo - ${mapsCity}`, phone: '+54 11 4839-2012', address: 'Av. Santa Fe 3420', status: 'Alta Intención', rating: '4.7 ★' },
          { name: `Sport & Health ${mapsNiche}`, phone: '+54 11 4981-5503', address: 'Calle Florida 521', status: 'Excelente Prospecto', rating: '4.5 ★' },
          { name: `${mapsCity} Fitness Studio`, phone: '+54 11 4110-9821', address: 'Pampa 1902', status: 'Calificación Media', rating: '4.2 ★' }
        ];
        setMapsResults(mockPlaces);
        setMapsLoading(false);
        showToast('Descubrimiento completado (Simulado - No API Key)', 'success');
      });
  };

  const importMapsProspect = (place: any) => {
    const createdComp = addCompany({
      name: place.name,
      domain: place.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
      industry: 'Deportes y Entretenimiento',
      employees: '11-50',
      arr: 12000,
      tier: 'Startup',
      healthScore: 85,
      city: mapsCity,
      country: 'Argentina',
      assignedTo: 'Sasha Kowalski',
      description: `Prospecto importado desde Prospección Maps IA con calificación ${place.status}.`
    });

    addOpportunity({
      name: `Licencia CRM - ${place.name}`,
      amount: 14400,
      currency: 'USD',
      stage: 'lead',
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      probability: 10,
      companyId: createdComp.id,
      companyName: createdComp.name,
      assignedTo: 'Sasha Kowalski',
      priority: 'High',
      type: 'New Business',
      tags: ['Maps-Prospect', 'SaaS']
    });

    showToast(`Empresa y Trato creados para: ${place.name}`, 'success');
    triggerConfetti();
  };

  // 3. MEDDIC Calculation
  const runMEDDIC = () => {
    setMeddicCalculated(true);
    showToast('MEDDIC Calification Computed', 'info');
  };

  // 6. WhatsApp Chatbot Send Message
  const handleWaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waInput.trim()) return;

    const userMsg = { sender: 'user' as const, text: waInput };
    setWaMessages(prev => [...prev, userMsg]);
    const inputClean = waInput.toLowerCase().trim();
    setWaInput('');

    setTimeout(() => {
      let reply = 'Lo siento, no comprendo esa opción. Por favor escribe "1", "2" o "3".';
      if (inputClean.includes('1') || inputClean.includes('precio') || inputClean.includes('costo')) {
        reply = '💳 *Nuestros Planes CRM:*\n\n• *Startup:* $29/usuario al mes\n• *Growth:* $79/usuario al mes\n• *Enterprise:* Consultar con ventas.\n\nEscribe "2" si deseas agendar una demo.';
      } else if (inputClean.includes('2') || inputClean.includes('demo') || inputClean.includes('agenda')) {
        reply = '📅 *Agendar Demo con un Consultor:*\n\nExcelente decisión. Haz clic en el siguiente enlace para reservar un espacio:\n👉 _calendly.com/clientum-crm-demo_';
      } else if (inputClean.includes('3') || inputClean.includes('soporte') || inputClean.includes('ayuda')) {
        reply = '🛠️ *Soporte Técnico Especializado:*\n\nTu ticket ha sido derivado. En breve un ingeniero te contactará directamente por este medio. ¡Gracias!';
      } else if (inputClean.includes('hola') || inputClean.includes('buenos dias')) {
        reply = '👋 ¡Hola! ¿Cómo estás? Por favor elige una opción:\n\n1. Precios 💰\n2. Agendar Demo 📅\n3. Soporte Técnico 🛠️';
      }

      setWaMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  // 7. SDR Agent Start
  const startSdrAgent = () => {
    setSdrRunning(true);
    setSdrLogs([]);
    const logs = [
      '🔍 Buscando empresas del sector en LinkedIn y directorios...',
      '📈 Encontradas 14 empresas ideales para el nicho.',
      '🤖 Analizando sitio web de "SaaS Solutions" con Gemini AI...',
      '📧 Redactando email frío hiper-personalizado para CEO de SaaS Solutions...',
      '📤 Email enviado automáticamente (Tracking ID: outbound-8402)',
      '📝 Programando seguimiento automático para dentro de 3 días...',
      '🤖 Procesando respuesta recibida de "TechCorp"...',
      '🎉 Respuesta positiva: "Me interesa una demo". Creando oportunidad en CRM...',
      '🎯 SDR Agent finalizó con éxito. 1 nuevo lead agendado.'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setSdrLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setSdrRunning(false);
          // Auto add a person
          const createdSDRPerson = addPerson({
            firstName: 'Santiago',
            lastName: 'Mendoza',
            email: 'santiago@techcorp.io',
            phone: '+54 9 11 5202-9901',
            jobTitle: 'VP of Engineering',
            companyName: 'TechCorp Solutions',
            city: 'Santiago',
            country: 'Chile',
            status: 'Contacted',
            assignedTo: 'Sasha Kowalski',
            notes: 'Contacto generado por Agente SDR de Outreach Automático.'
          });

          addOpportunity({
            name: 'Outbound - TechCorp Solutions',
            amount: 28000,
            currency: 'USD',
            stage: 'discovery',
            closeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            probability: 25,
            companyName: 'TechCorp Solutions',
            contactId: createdSDRPerson.id,
            contactName: `${createdSDRPerson.firstName} ${createdSDRPerson.lastName}`,
            assignedTo: 'Sasha Kowalski',
            priority: 'Medium',
            type: 'New Business',
            tags: ['AI-SDR', 'Outbound']
          });

          showToast('¡Oportunidad y Contacto creados de forma autónoma!', 'success');
          triggerConfetti();
        }
      }, (index + 1) * 800);
    });
  };

  // 8. Create Client Ticket
  const createPortalTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;

    const newTicket = {
      id: `T-${100 + portalTickets.length + 5}`,
      title: newTicketTitle,
      status: 'Abierto',
      date: 'Hace un momento'
    };
    setPortalTickets([newTicket, ...portalTickets]);
    setNewTicketTitle('');
    showToast('Ticket de soporte registrado en el portal', 'success');
  };

  // 9. Asistente IA Gemini 2.5
  const runGeminiAsistente = async () => {
    setGeminiLoading(true);
    fetch('/api/ai/cmo', {
      method: 'POST',
       headers: await getClientumAuthJsonHeaders(),
      body: JSON.stringify({ query: geminiQuery })
    })
      .then(res => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then(data => {
        setGeminiResponse(data.text);
        setGeminiLoading(false);
        showToast('Estrategia de Inteligencia Generada', 'success');
      })
      .catch((err) => {
        console.warn('Real CMO strategy failed, falling back to simulation:', err);
        setGeminiResponse(`### 🧠 Propuesta del CMO para: "${geminiQuery}"\n\n1. **Propuesta de Posicionamiento:** Enfocar los beneficios del producto en "Ahorro de Tiempo de Configuración" mediante plantillas sectoriales listas para usar. Las agencias valoran la facturación veloz.\n\n2. **Estrategia de Email Marketing:** Configurar un embudo automatizado (drip email) de 4 secuencias ofreciendo una auditoría de procesos gratuita en lugar de una demo genérica.\n\n3. **Plan de Contenidos:** Publicar mini-estudios de caso semanales en LinkedIn demostrando cómo un cliente redujo el Churn en un 12% en menos de 90 días.\n\n*(Note: Displaying simulated proposal. Configure a real Gemini API key in Secrets)*`);
        setGeminiLoading(false);
        showToast('Estrategia de Inteligencia Generada (Simulada)', 'success');
      });
  };

  // 10. GTM Strategy Generator
  const runGTMGenerator = async () => {
    setGtmLoading(true);
    fetch('/api/ai/gtm', {
      method: 'POST',
       headers: await getClientumAuthJsonHeaders(),
      body: JSON.stringify({ product: gtmProduct, audience: gtmAudience })
    })
      .then(res => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then(data => {
        setGtmStrategy(data.text);
        setGtmLoading(false);
        showToast('Plan GTM de IA Generado', 'success');
      })
      .catch((err) => {
        console.warn('Real GTM failed, falling back to simulation:', err);
        setGtmStrategy(`### 🎯 Plan Go-To-Market para: ${gtmProduct}\n\n*   **Audiencia Clave:** ${gtmAudience}\n*   **Canal Principal sugerido:** Campañas en LinkedIn Ads segmentando por cargo exacto y prospección fría semi-automatizada por WhatsApp.\n*   **Propuesta de Valor única:** Automatización completa del flujo de contactos sin requerir programadores ni integraciones manuales costosas.\n*   **Sugerencia de Precios:** Plan Piloto Mensual de $49 con garantía de reembolso de 14 días para bajar la barrera de entrada.\n\n*(Note: Displaying simulated GTM plan. Configure a real Gemini API key in Secrets)*`);
        setGtmLoading(false);
        showToast('Plan GTM de IA Generado (Simulado)', 'success');
      });
  };

  // 11. AI Ad Copy Studio
  const runAdStudio = async () => {
    setAdLoading(true);
    fetch('/api/ai/adcopy', {
      method: 'POST',
       headers: await getClientumAuthJsonHeaders(),
      body: JSON.stringify({ product: adProduct, platform: adPlatform })
    })
      .then(res => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then(data => {
        setAdCopies(data.copies);
        setAdLoading(false);
        showToast('Borradores publicitarios de IA listos', 'success');
      })
      .catch((err) => {
        console.warn('Real Ad Copy failed, falling back to simulation:', err);
        const copies = [
          `🔥 **Variante 1 (Impacto Directo):** ¿Cansado de CRM lentos e imposibles de configurar? Descubre ${adProduct}. Diseñado especialmente para optimizar procesos comerciales sin costo de IT. ¡Consigue tu demo hoy!`,
          `💡 **Variante 2 (Beneficio MEDDIC):** Optimiza tu tasa de cierre empresarial B2B con la metodología incorporada en ${adProduct}. Califica tus leads con precisión científica y acelera tu pipeline sin fricciones.`,
          `✉️ **Variante 3 (Gancho Creativo):** El CRM Open Source del que todo el ecosistema de desarrollo está hablando. Simple, potente y totalmente personalizable. Únete a miles de equipos comerciales. *(Note: Displaying simulated copy. Configure a real Gemini API key in Secrets)*`
        ];
        setAdCopies(copies);
        setAdLoading(false);
        showToast('Borradores publicitarios de IA listos (Simulados)', 'success');
      });
  };

  // 12. Run SEO Suite
  const runSEOSuite = () => {
    setSeoLoading(true);
    setTimeout(() => {
      setSeoResult({
        score: 84,
        keywords: [
          { word: 'crm argentina', search: '2,400/mes', difficulty: 'Bajo' },
          { word: 'sistema de gestion ventas', search: '1,200/mes', difficulty: 'Medio' },
          { word: 'automatizacion whatsapp api', search: '850/mes', difficulty: 'Alto' }
        ],
        issues: [
          'Faltan etiquetas alt en 14 imágenes principales.',
          'El tiempo de carga inicial en móviles es superior a 3.4s.'
        ]
      });
      setSeoLoading(false);
      showToast('Auditoría SEO completa', 'success');
    }, 1200);
  };

  // 14. Emitir Factura AFIP
  const emitirFacturaAFIP = () => {
    setAfipLoading(true);
    setTimeout(() => {
      setAfipInvoice({
        cae: '73940291048291',
        vto: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        number: '00003-00000492',
        date: new Date().toLocaleDateString(),
        amount: '$145,200.00 ARS',
        client: 'TechCorp S.A.'
      });
      setAfipLoading(false);
      showToast('Factura Electrónica aprobada por AFIP', 'success');
      triggerConfetti();
    }, 1500);
  };

  // 15. Cobros MercadoPago
  const generateMPLink = async () => {
    setMpLoading(true);
    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: await getClientumAuthJsonHeaders(),
        body: JSON.stringify({
          title: 'Cobro ClientumCRM',
          amount: mpAmount,
          currency: 'ARS',
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || 'No se pudo crear el checkout.');
      }
      setMpLink(payload.checkoutUrl);
      setMpCheckoutId(String(payload.checkoutId || ''));
      setMpStatus((payload.status || 'pending') as MercadoPagoCheckoutStatus);
      if (payload.checkoutId) {
        void loadMercadoPagoStatus(String(payload.checkoutId));
      }
      showToast('Checkout real de Mercado Pago generado', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Configura Mercado Pago para crear un link real.', 'error');
    } finally {
      setMpLoading(false);
    }
  };

  // 16. Webform submit demo
  const handleWebformDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webFormEmail.trim() || !webFormName.trim()) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    const createdFormComp = addCompany({
      name: `${webFormName} Co.`,
      domain: webFormEmail.split('@')[1],
      industry: 'Tecnología',
      employees: '1-10',
      arr: 5000,
      tier: 'Startup',
      healthScore: 90,
      assignedTo: 'Sasha Kowalski',
      description: 'Lead registrado de forma autónoma desde el widget web conectado.'
    });

    addOpportunity({
      name: `Licencia de Interés - ${webFormName}`,
      amount: 4800,
      currency: 'USD',
      stage: 'lead',
      closeDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      probability: 10,
      companyId: createdFormComp.id,
      companyName: createdFormComp.name,
      assignedTo: 'Sasha Kowalski',
      priority: 'Medium',
      type: 'New Business',
      tags: ['Form-Widget']
    });

    setWebFormEmail('');
    setWebFormName('');
    showToast('¡Formulario Web Enviado! Nuevo lead registrado en ClientumCRM', 'success');
    triggerConfetti();
  };

  // Render the 16 grid features matching column layouts
  const getColumnFeatures = (colIndex: number) => {
    return features.filter(f => f.column === colIndex);
  };

  // If a module is selected, render the dedicated full-screen workspace page
  if (selectedModule) {
    const feat = features.find(f => f.id === selectedModule) || features[0];
    const Icon = feat.icon;

    return (
      <div id={`power-module-workspace-${selectedModule}`} className="flex-1 flex flex-col h-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] overflow-hidden select-none relative">
        {/* Top Workspace Navigation Bar */}
        <div className="p-4 bg-[var(--bg-card,#ffffff)] dark:bg-[#11141e] border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedModule(null);
                if (defaultModule) {
                  setActiveTab('powerSuite');
                }
              }}
              className="px-3.5 py-1.5 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#283042] text-[var(--text-primary,#0f172a)] dark:text-slate-200 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2c354a] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>← Volver a Suite de Poder (16 Módulos)</span>
            </button>
            <div className="h-5 w-[1px] bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#222a3d] hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm sm:text-base text-[var(--text-primary,#0f172a)] dark:text-white">{feat.title}</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Módulo Activo en Tiempo Real
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">{feat.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 hidden md:flex items-center gap-1.5 bg-[var(--bg-card,#ffffff)] dark:bg-[#171c2a] px-3 py-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232c40]">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Sincronizado con ClientumCRM
            </span>
            <button
              onClick={() => {
                showToast(`Módulo ${feat.title} configurado e integrado con éxito.`, 'success');
                triggerConfetti();
              }}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Aplicar e Integrar</span>
            </button>
          </div>
        </div>

        {/* Scrollable Main Workspace Container */}
        <div className="flex-1 overflow-y-auto p-6 text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs relative max-w-6xl mx-auto w-full space-y-6">
          
          {/* 1. CRM Inteligente sandbox */}
          {selectedModule === 'crm' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Centro Operativo del Pipeline CRM</h3>
                    <p className="text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed text-xs mt-1">
                      El motor principal de pipeline gestiona prospectos, estados de trato y sincronización automática con WhatsApp y automatizaciones.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('opportunities');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-md shadow-blue-600/20"
                  >
                    <span>Ir al Pipeline Kanban Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2130] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c]">
                    <div className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold">Oportunidades Activas</div>
                    <div className="text-xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white mt-1">
                      {opportunities.filter(o => o.stage !== 'won' && o.stage !== 'lost').length} deals
                    </div>
                  </div>
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2130] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c]">
                    <div className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold">Valor Total del Pipeline</div>
                    <div className="text-xl font-bold text-emerald-400 mt-1">
                      ${opportunities.reduce((acc, o) => acc + o.amount, 0).toLocaleString()} USD
                    </div>
                  </div>
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2130] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c]">
                    <div className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold">Tasa de Conversión</div>
                    <div className="text-xl font-bold text-blue-400 mt-1">
                      68.4%
                    </div>
                  </div>
                </div>
              </div>

              {/* Opportunities list preview */}
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151f] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2332] space-y-3">
                <h4 className="font-bold text-sm text-[var(--text-primary,#0f172a)] dark:text-white">Últimos Deals en Pipeline</h4>
                <div className="space-y-2">
                  {opportunities.slice(0, 5).map((opp) => (
                    <div key={opp.id} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-3 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#262f42] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{opp.name}</div>
                        <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{opp.companyName || 'Empresa No Asignada'} • Asignado: {opp.assignedTo}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-400 font-bold">${opp.amount.toLocaleString()} {opp.currency}</span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                          {opp.stage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Maps Prospección Sandbox */}
          {selectedModule === 'maps' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Prospección Territorial e Inteligencia Geográfica</h3>
                <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed">
                  Localiza negocios por ciudad y rubro utilizando Gemini AI para identificar prospectos de alta intención comercial, teléfono y dirección física.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Zona / Ciudad</label>
                    <input
                      type="text"
                      value={mapsCity}
                      onChange={(e) => setMapsCity(e.target.value)}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Rubro / Tipo de Negocio</label>
                    <input
                      type="text"
                      value={mapsNiche}
                      onChange={(e) => setMapsNiche(e.target.value)}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>

                <button
                  onClick={runMapsProspecting}
                  disabled={mapsLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 text-xs"
                >
                  {mapsLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Escaneando zona con Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Escanear y Buscar Clientes en {mapsCity}</span>
                    </>
                  )}
                </button>
              </div>

              {mapsResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[var(--text-primary,#0f172a)] dark:text-white">Prospectos Encontrados ({mapsResults.length}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mapsResults.map((place, idx) => (
                      <div key={idx} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21283a] p-4 rounded-xl flex flex-col justify-between gap-3 hover:border-blue-500/30 transition-all">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                              {place.status}
                            </span>
                            <span className="text-xs text-amber-400 font-bold">{place.rating || '4.5 ★'}</span>
                          </div>
                          <div className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm mt-2">{place.name}</div>
                          <div className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">{place.address}</div>
                          <div className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 mt-1 font-mono">{place.phone}</div>
                        </div>

                        <button
                          onClick={() => importMapsProspect(place)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-sm"
                        >
                          Importar como Empresa + Deal
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Lead Scoring MEDDIC Sandbox */}
          {selectedModule === 'meddic' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Calculadora y Diagnóstico MEDDIC B2B</h3>
                <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed">
                  Evalúa cuantitativamente la solidez de cualquier trato comercial analizando las 6 variables esenciales de compra corporativa.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* M */}
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242d40]">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-200">Metrics (Métricas Cuantitativas)</span>
                      <span className="text-blue-400 font-bold text-sm">{meddicM}/5</span>
                    </div>
                    <input
                      type="range" min="1" max="5" value={meddicM} onChange={(e) => setMeddicM(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] h-2 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  {/* E */}
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242d40]">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-200">Economic Buyer (Comprador Económico)</span>
                      <span className="text-blue-400 font-bold text-sm">{meddicE}/5</span>
                    </div>
                    <input
                      type="range" min="1" max="5" value={meddicE} onChange={(e) => setMeddicE(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] h-2 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  {/* Dc */}
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242d40]">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-200">Decision Criteria (Criterios de Decisión)</span>
                      <span className="text-blue-400 font-bold text-sm">{meddicDc}/5</span>
                    </div>
                    <input
                      type="range" min="1" max="5" value={meddicDc} onChange={(e) => setMeddicDc(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] h-2 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  {/* Dp */}
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242d40]">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-200">Decision Process (Proceso Técnico de Compra)</span>
                      <span className="text-blue-400 font-bold text-sm">{meddicDp}/5</span>
                    </div>
                    <input
                      type="range" min="1" max="5" value={meddicDp} onChange={(e) => setMeddicDp(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] h-2 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  {/* I */}
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242d40]">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-200">Identify Pain (Dolor Crítico Identificado)</span>
                      <span className="text-blue-400 font-bold text-sm">{meddicI}/5</span>
                    </div>
                    <input
                      type="range" min="1" max="5" value={meddicI} onChange={(e) => setMeddicI(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] h-2 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  {/* C */}
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242d40]">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-200">Champion (Sponsor o Embajador Interno)</span>
                      <span className="text-blue-400 font-bold text-sm">{meddicC}/5</span>
                    </div>
                    <input
                      type="range" min="1" max="5" value={meddicC} onChange={(e) => setMeddicC(Number(e.target.value))}
                      className="w-full accent-blue-500 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] h-2 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={runMEDDIC}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs shadow-lg shadow-blue-600/20"
                >
                  Calcular Puntaje y Diagnóstico MEDDIC
                </button>

                {meddicCalculated && (
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-blue-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-bold text-sm">Calificación Global de Cierre:</span>
                      <span className="text-2xl font-bold text-emerald-400">
                        {Math.round(((meddicM + meddicE + meddicDc + meddicDp + meddicI + meddicC) / 30) * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2130] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b354c]">
                      <strong>Recomendación IA:</strong> {meddicC < 3 ? 'Alerta Crítica: El valor del Champion es bajo. Asegúrate de agendar una llamada con un sponsor interno que valide la propuesta antes de presentarla al Comprador Económico.' : 'Estructura de compra con alto nivel de cualificación. Se recomienda presentar propuesta comercial formal y solicitar compromiso de firma.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Business Intelligence Sandbox */}
          {selectedModule === 'bi' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Simulador de Unit Economics y BI</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1.5">Costo Adquisición (CAC)</label>
                    <input
                      type="number" value={biCac} onChange={(e) => setBiCac(Number(e.target.value))}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1.5">Valor de Vida (LTV)</label>
                    <input
                      type="number" value={biLtv} onChange={(e) => setBiLtv(Number(e.target.value))}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold mb-1.5">Conversión Web (%)</label>
                    <input
                      type="number" step="0.1" value={biConversion} onChange={(e) => setBiConversion(Number(e.target.value))}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2130] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2a3449]">
                    <div className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold">Relación LTV : CAC</div>
                    <div className={`text-2xl font-bold mt-1 ${(biLtv / biCac) >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {(biLtv / biCac).toFixed(1)}x
                    </div>
                    <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Óptimo recomendado: 3.0x en adelante</div>
                  </div>

                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2130] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2a3449]">
                    <div className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 font-semibold">Retorno de Inversión (ROI)</div>
                    <div className="text-2xl font-bold text-blue-400 mt-1">
                      {Math.round(((biLtv - biCac) / biCac) * 100)}%
                    </div>
                    <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">Por cada dólar invertido en adquisición</div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    <span>Ver Analíticas y Reportes Completos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Campañas & Automatización Sandbox */}
          {selectedModule === 'campaigns' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Configuración de Campaña Drip & Nurturing</h3>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Nombre de la Campaña</label>
                  <input
                    type="text" value={dripName} onChange={(e) => setDripName(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">Secuencia de Pasos Automatizados:</div>
                  {dripSteps.map((step, idx) => (
                    <div key={idx} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222b3d] p-3.5 rounded-xl flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 flex items-center justify-between text-xs">
                        <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-semibold">{step.action}</span>
                        <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[11px] bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2330] px-2.5 py-1 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3346] font-mono">
                          Día {step.delay}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    showToast(`Campaña "${dripName}" activada con éxito para nuevos leads.`, 'success');
                    triggerConfetti();
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs shadow-lg shadow-emerald-600/20"
                >
                  Activar e Integrar Campaña
                </button>
              </div>
            </div>
          )}

          {/* Gmail Inbox Sandbox */}
          {selectedModule === 'gmail' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Gmail Inbox</h3>
                <button
                  onClick={async () => {
                    if (!gmailAccessToken) {
                      showToast('No has iniciado sesión con Google', 'error');
                      return;
                    }
                    setGmailLoading(true);
                    try {
                      const data = await getGmailMessages(gmailAccessToken);
                      setGmailMessages(data.messages || []);
                    } catch (e) {
                      showToast('Error al cargar correos', 'error');
                    } finally {
                      setGmailLoading(false);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs cursor-pointer"
                >
                  Cargar Correos
                </button>
                {gmailLoading && <p className="text-xs">Cargando...</p>}
                <div className="space-y-2">
                  {gmailMessages.map((msg: any) => (
                    <div key={msg.id} className="p-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] rounded-lg text-xs">ID: {msg.id}</div>
                  ))}
                </div>
              </div>
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Enviar Email</h3>
                <input type="email" placeholder="Para" value={emailTo} onChange={e => setEmailTo(e.target.value)} className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white p-2 rounded-lg text-xs" />
                <input type="text" placeholder="Asunto" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white p-2 rounded-lg text-xs" />
                <textarea placeholder="Mensaje" value={emailBody} onChange={e => setEmailBody(e.target.value)} className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white p-2 rounded-lg text-xs h-24" />
                <button
                  onClick={async () => {
                    if (!gmailAccessToken) {
                      showToast('No has iniciado sesión con Google', 'error');
                      return;
                    }
                    setSendingEmail(true);
                    try {
                      await sendGmailMessage(gmailAccessToken, emailTo, emailSubject, emailBody);
                      showToast('Email enviado con éxito', 'success');
                      setEmailTo(''); setEmailSubject(''); setEmailBody('');
                    } catch (e) {
                      showToast('Error al enviar correo', 'error');
                    } finally {
                      setSendingEmail(false);
                    }
                  }}
                  disabled={sendingEmail}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs cursor-pointer"
                >
                  {sendingEmail ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          )}

          {/* 6. Chatbot WhatsApp Sandbox */}
          {selectedModule === 'chatbot' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10141e] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] rounded-2xl overflow-hidden flex flex-col h-[420px]">
                {/* Phone Header */}
                <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b141a] p-3.5 px-5 flex items-center justify-between border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b252c]">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-200">Bot Conversacional de WhatsApp 24/7</div>
                      <div className="text-[10px] text-emerald-400">Atención en línea sin intervención humana</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Abrir WhatsApp CRM
                  </button>
                </div>

                {/* Chat Log */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0d11]">
                  {waMessages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[80%] whitespace-pre-wrap leading-relaxed text-xs ${ m.sender === 'user' ? 'bg-emerald-600 text-[var(--text-primary,#0f172a)] dark:text-white rounded-tr-none' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#1b212c] text-[var(--text-primary,#0f172a)] dark:text-slate-200 rounded-tl-none border border-[var(--border-subtle,#e2e8f0)] dark:border-[#27303f]' }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Phone Input */}
                <form onSubmit={handleWaSubmit} className="p-3 bg-[var(--bg-card,#ffffff)] dark:bg-[#121620] border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] flex gap-2">
                  <input
                    type="text" value={waInput} onChange={(e) => setWaInput(e.target.value)}
                    placeholder="Escribe '1' para precios, '2' para demo o '3' para soporte..."
                    className="flex-1 bg-[var(--bg-card,#ffffff)] dark:bg-[#1a202d] text-[var(--text-primary,#0f172a)] dark:text-white px-4 py-2 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#283247] text-xs focus:outline-none"
                  />
                  <button type="submit" className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 7. SDR Outreach Sandbox */}
          {selectedModule === 'outreach' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Agente Autónomo de Prospección SDR</h3>
                <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed">
                  El agente inteligente escanea cuentas, identifica tomadores de decisión en LinkedIn y envía secuencias frías de alto impacto directo a tu CRM.
                </p>

                <button
                  onClick={startSdrAgent}
                  disabled={sdrRunning}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-600/20"
                >
                  {sdrRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Ejecutando Agente SDR Prospectando...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Ejecutar Agente SDR Autónomo</span>
                    </>
                  )}
                </button>

                {sdrLogs.length > 0 && (
                  <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0c10] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d2433] rounded-xl p-4 font-mono text-xs space-y-2 h-[220px] overflow-y-auto shadow-inner">
                    {sdrLogs.map((log, idx) => (
                      <div key={idx} className="text-emerald-400">
                        <span className="text-[var(--text-muted)] mr-2">&gt;</span>
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. Portal del Cliente Sandbox */}
          {selectedModule === 'portal' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21283a] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Soporte y Gestión de Tickets del Portal de Clientes</h3>
                <div className="space-y-2.5">
                  {portalTickets.map((t) => (
                    <div key={t.id} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#1b2130] p-3.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2a3449] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-blue-400 font-mono font-bold mr-2">{t.id}</span>
                        <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-semibold">{t.title}</span>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${ t.status === 'Abierto' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-[var(--text-muted,#64748b)] dark:text-slate-400 border border-slate-500/20' }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={createPortalTicket} className="flex gap-2 pt-2">
                  <input
                    type="text" value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)}
                    placeholder="Registrar nuevo ticket de soporte desde el portal..."
                    className="flex-1 bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                  />
                  <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md">
                    Crear Ticket
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 9. Asistente IA Gemini 3.8 Sandbox */}
          {selectedModule === 'gemini' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Consulta Estratégica al Asistente IA CMO</h3>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Pregunta o Escenario Comercial</label>
                  <textarea
                    rows={3} value={geminiQuery} onChange={(e) => setGeminiQuery(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={runGeminiAsistente}
                  disabled={geminiLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs shadow-lg shadow-blue-600/20"
                >
                  {geminiLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analizando con Gemini 3.8 AI...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Consultar Asistente CMO</span>
                    </>
                  )}
                </button>

                {geminiResponse && (
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] p-5 rounded-2xl border border-blue-500/30 text-[var(--text-primary,#0f172a)] dark:text-slate-200 leading-relaxed text-xs whitespace-pre-wrap">
                    {geminiResponse}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 10. Generador de Estrategias Sandbox */}
          {selectedModule === 'gtm' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Generador de Planes Go-To-Market</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Producto o Servicio</label>
                    <input
                      type="text" value={gtmProduct} onChange={(e) => setGtmProduct(e.target.value)}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Público Objetivo / Nicho</label>
                    <input
                      type="text" value={gtmAudience} onChange={(e) => setGtmAudience(e.target.value)}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={runGTMGenerator}
                  disabled={gtmLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs shadow-lg shadow-blue-600/20"
                >
                  {gtmLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generando Estrategia con IA...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      <span>Generar Plan Go-To-Market</span>
                    </>
                  )}
                </button>

                {gtmStrategy && (
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] p-5 rounded-2xl border border-blue-500/30 text-[var(--text-primary,#0f172a)] dark:text-slate-200 leading-relaxed text-xs whitespace-pre-wrap">
                    {gtmStrategy}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 11. AI Ad Copy Studio Sandbox */}
          {selectedModule === 'adcopy' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Estudio de Redacción Publicitaria IA</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Nombre del Producto</label>
                    <input
                      type="text" value={adProduct} onChange={(e) => setAdProduct(e.target.value)}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Plataforma</label>
                    <select
                      value={adPlatform} onChange={(e) => setAdPlatform(e.target.value)}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Email Frío">Email Frío</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={runAdStudio}
                  disabled={adLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs shadow-lg shadow-blue-600/20"
                >
                  {adLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Redactando copys con IA...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Generar Ad Copies</span>
                    </>
                  )}
                </button>

                {adCopies.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {adCopies.map((copy, idx) => (
                      <div key={idx} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21283a] p-4 rounded-xl text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs leading-relaxed flex items-start justify-between gap-3">
                        <div className="flex-1 whitespace-pre-wrap">{copy}</div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(copy);
                            showToast('Copiado al portapapeles', 'success');
                          }}
                          className="px-3 py-1.5 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1e2536] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#283248] text-[var(--text-secondary,#475569)] dark:text-slate-300 rounded-lg text-[11px] font-semibold shrink-0 cursor-pointer"
                        >
                          Copiar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 12. SEO Suite Complete Sandbox */}
          {selectedModule === 'seo' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Auditoría y Suite SEO Completa</h3>
                <div className="flex gap-3">
                  <input
                    type="text" value={seoDomain} onChange={(e) => setSeoDomain(e.target.value)}
                    placeholder="mi-empresa.com"
                    className="flex-1 bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                  />
                  <button
                    onClick={runSEOSuite}
                    disabled={seoLoading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-2 shrink-0 shadow-md"
                  >
                    {seoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    <span>Analizar Dominio</span>
                  </button>
                </div>

                {seoResult && (
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21283a] space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] pb-3">
                      <span className="text-[var(--text-primary,#0f172a)] dark:text-slate-200 font-bold text-sm">Puntaje de Salud SEO:</span>
                      <span className="text-xl font-bold text-emerald-400">{seoResult.score} / 100</span>
                    </div>

                    <div className="space-y-2">
                      <div className="font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-200">Palabras Clave Destacadas:</div>
                      {seoResult.keywords.map((kw: any, idx: number) => (
                        <div key={idx} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2a] p-3 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252e42] flex justify-between text-xs">
                          <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-semibold">{kw.word}</span>
                          <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400">Búsquedas: {kw.search} • Dificultad: {kw.difficulty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 13. Webhooks & Integrations Sandbox */}
          {selectedModule === 'integrations' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Consola de Webhooks e Integraciones</h3>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Endpoint URL de Destino</label>
                  <input
                    type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    const logStr = `[${new Date().toLocaleTimeString()}] Evento gatillado: Oportunidad "Upgrading Enterprise" actualizada. Webhook enviado exitosamente (Status HTTP 200 OK).`;
                    setWebhookLogs([logStr, ...webhookLogs]);
                    showToast('Evento de prueba enviado con éxito', 'success');
                    triggerConfetti();
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  Enviar Evento de Prueba (Payload Test)
                </button>

                {webhookLogs.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-[var(--text-secondary,#475569)] dark:text-slate-300">Registro de Transmisiones:</div>
                    {webhookLogs.map((log, idx) => (
                      <div key={idx} className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0c10] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21283a] p-3 rounded-xl text-xs font-mono text-blue-400">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 14. Facturación AFIP Sandbox */}
          {selectedModule === 'afip' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Emisión de Factura Electrónica AFIP</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">CUIT del Cliente</label>
                    <input
                      type="text" value={afipCuit} onChange={(e) => setAfipCuit(e.target.value)}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Tipo de Factura</label>
                    <select
                      value={afipType} onChange={(e) => setAfipType(e.target.value)}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                    >
                      <option value="Factura A">Factura A (Responsable Inscripto)</option>
                      <option value="Factura B">Factura B (Consumidor Final)</option>
                      <option value="Factura C">Factura C (Monotributo)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={emitirFacturaAFIP}
                  disabled={afipLoading}
                  className="w-full py-3 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#252d42] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#2d364e] disabled:opacity-50 text-[var(--text-primary,#0f172a)] dark:text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  {afipLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Autorizando Comprobante con Servidores de AFIP...</span>
                    </>
                  ) : (
                    <>
                      <Receipt className="w-4 h-4" />
                      <span>Emitir Factura Electrónica Autorizada</span>
                    </>
                  )}
                </button>

                {afipInvoice && (
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] p-5 rounded-2xl border border-blue-500/30 text-xs space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-center border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#21283a] pb-2 font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">
                      <span>Comprobante Electrónico Oficial</span>
                      <span className="text-blue-400">{afipType}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200">
                      <div><strong>Nro Comprobante:</strong> {afipInvoice.number}</div>
                      <div><strong>Fecha Emisión:</strong> {afipInvoice.date}</div>
                      <div><strong>Receptor CUIT:</strong> {afipCuit}</div>
                      <div><strong>Total:</strong> {afipInvoice.amount}</div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#21283a] flex items-center justify-between">
                      <div>
                        <div className="text-emerald-400 font-bold text-xs">CAE Autorizado: {afipInvoice.cae}</div>
                        <div className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[11px] mt-0.5">Vencimiento CAE: {afipInvoice.vto}</div>
                      </div>
                      <div className="p-1.5 bg-[var(--bg-card)] rounded-lg">
                        <QrCode className="w-9 h-9 text-black" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 15. Cobros MercadoPago Sandbox */}
          {selectedModule === 'mercadopago' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Cobros Mercado Pago</h3>
                    <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
                      Genera checkouts reales y confirma su estado desde el webhook del proveedor.
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${ mpProviderConfigured === false ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' }`}>
                    {mpProviderConfigured === false ? 'Proveedor sin configurar' : 'Mercado Pago'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Monto ($ ARS / USD)</label>
                    <input
                      type="number" value={mpAmount} onChange={(e) => setMpAmount(Number(e.target.value))}
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#161a26] text-[var(--text-primary,#0f172a)] dark:text-white px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1.5">Cuenta Asignada</label>
                    <input
                      type="text" value="TechCorp Solutions" disabled
                      className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] text-[var(--text-muted,#64748b)] dark:text-slate-400 px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={generateMPLink}
                  disabled={mpLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  {mpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  <span>Generar Link de Cobro y Código QR</span>
                </button>

                <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10131d] rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Estado confirmado</h4>
                      <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                        Se actualiza con la información persistida del webhook de Mercado Pago.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void loadMercadoPagoStatus(mpCheckoutId || undefined)}
                      disabled={mpStatusLoading}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2c3751] text-[11px] font-semibold text-[var(--text-primary,#0f172a)] dark:text-slate-200 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1c2233] disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${mpStatusLoading ? 'animate-spin' : ''}`} />
                      Actualizar
                    </button>
                  </div>

                  {mpStatusError && (
                    <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-200">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{mpStatusError}</span>
                    </div>
                  )}

                  {mpStatus && mpCheckoutId && (() => {
                    const statusMeta = MERCADO_PAGO_STATUS_META[mpStatus];
                    const StatusIcon = statusMeta.icon;
                    return (
                      <div className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${statusMeta.className}`}>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="text-xs font-bold">{statusMeta.label}</div>
                            <div className="text-[11px] opacity-80">{statusMeta.detail}</div>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] opacity-80">{mpCheckoutId}</span>
                      </div>
                    );
                  })()}

                  {!mpStatus && !mpStatusLoading && mpCheckouts.length === 0 && (
                    <div className="rounded-lg border border-dashed border-[var(--border-subtle,#e2e8f0)] dark:border-[#2c3751] px-3 py-3 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      Todavía no hay checkouts registrados para este workspace.
                    </div>
                  )}

                  {mpCheckouts.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                        Checkouts recientes
                      </div>
                      {mpCheckouts.map((checkout) => {
                        const statusMeta = MERCADO_PAGO_STATUS_META[checkout.status];
                        const StatusIcon = statusMeta.icon;
                        return (
                          <button
                            key={checkout.checkoutId}
                            type="button"
                            onClick={() => {
                              setMpCheckoutId(checkout.checkoutId);
                              setMpStatus(checkout.status);
                              setMpLink(checkout.checkoutUrl || '');
                              void loadMercadoPagoStatus(checkout.checkoutId);
                            }}
                            className={`w-full flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer ${ checkout.checkoutId === mpCheckoutId ? 'border-blue-500/50 bg-blue-500/10' : 'border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3f] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1c2233]' }`}
                          >
                            <span className="min-w-0">
                              <span className="block text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-slate-200 truncate">{checkout.title}</span>
                              <span className="block text-[10px] text-[var(--text-muted)]">
                                {checkout.currency} {checkout.amount.toLocaleString()} · {new Date(checkout.createdAt).toLocaleString()}
                              </span>
                            </span>
                            <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-bold ${statusMeta.className.split(' ')[0]}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {statusMeta.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {mpLink && (
                  <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#121622] p-5 rounded-2xl border border-blue-500/30 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-primary,#0f172a)] dark:text-slate-200 font-bold">Link de Pago Activo:</span>
                      <span className="text-xs text-blue-400 select-all font-mono bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2233] px-3 py-1 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2c3751]">
                        {mpLink}
                      </span>
                    </div>

                    <div className="flex justify-center p-3 bg-[var(--bg-card)] rounded-xl w-28 h-28 mx-auto shadow-md">
                      <QrCode className="w-full h-full text-black" />
                    </div>

                    <button
                      onClick={() => window.open(mpLink, '_blank', 'noopener,noreferrer')}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir Checkout Real de Mercado Pago</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 16. Desarrollo Web Widget Sandbox */}
          {selectedModule === 'webdev' && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d] space-y-4">
                <h3 className="font-bold text-base text-[var(--text-primary,#0f172a)] dark:text-white">Widget Web Embebido de Captura de Leads</h3>
                <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-relaxed">
                  Copia el snippet de código e insértalo en tu sitio web. Los registros generarán prospectos y oportunidades automáticamente en ClientumCRM.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Live Widget Form Preview */}
                  <div className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10131d] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21283a] space-y-3">
                    <h4 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-center text-xs">{formWidgetTitle}</h4>
                    <form onSubmit={handleWebformDemo} className="space-y-3">
                      <input
                        type="text" placeholder="Tu Nombre Completo" value={webFormName} onChange={(e) => setWebFormName(e.target.value)}
                        className="w-full bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2231] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2c3751] text-xs focus:outline-none"
                      />
                      <input
                        type="email" placeholder="Tu Correo Electrónico" value={webFormEmail} onChange={(e) => setWebFormEmail(e.target.value)}
                        className="w-full bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2231] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2c3751] text-xs focus:outline-none"
                      />
                      <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md">
                        Enviar Consulta
                      </button>
                    </form>
                  </div>

                  {/* Copiable Code Embed */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[var(--text-secondary,#475569)] dark:text-slate-300">Código de Integración HTML:</div>
                    <textarea
                      readOnly
                      rows={6}
                      value={`<!-- ClientumCRM Form Integration -->\n<form action="https://hooks.clientum.com/v1/webform/new-lead" method="POST">\n  <input type="text" name="name" placeholder="Tu Nombre" required />\n  <input type="email" name="email" placeholder="Tu Email" required />\n  <button type="submit">Enviar</button>\n</form>`}
                      className="w-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0b0c10] text-xs font-mono text-blue-400 p-3.5 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21283a] focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div id="clientum-power-suite" className="flex-1 flex flex-col h-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] overflow-y-auto p-5 select-none relative">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Callout */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            Suite de Poder / Power Apps CRM
          </h2>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
            Automatizaciones, bots conversacionales, pasarelas de pago y asistentas de IA listos para potenciar tus ventas desde el primer día.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="text-[11px] font-semibold text-emerald-300">
            Chatbot WhatsApp 24/7 y Agentes IA Activos
          </span>
        </div>
      </div>

      {/* Grid of Columns - Exact Replica of Uploaded Image Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {[1, 2, 3, 4].map((colNum) => (
          <div key={colNum} className="space-y-3.5">
            {getColumnFeatures(colNum).map((f) => {
              const Icon = f.icon;
              const isChatbotSpecial = f.id === 'chatbot';
              return (
                <div
                  key={f.id}
                  id={`feature-card-${f.id}`}
                  onClick={() => setSelectedModule(f.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] flex items-start gap-3.5 relative ${ isChatbotSpecial ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/5 border-l-[3.5px] border-l-emerald-400' : 'border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border-[var(--border-subtle,#e2e8f0)] dark:hover:border-[#2a3348] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#161a26]' }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${ isChatbotSpecial ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#1b212f] text-blue-400' }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[13px] font-semibold text-[var(--text-primary,#0f172a)] dark:text-white truncate leading-tight">
                        {f.title}
                      </h3>
                      {isChatbotSpecial && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 leading-snug">
                      {f.description}
                    </p>
                  </div>

                  {/* Open indicators */}
                  <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
