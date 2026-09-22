import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Bot,
  MapPin,
  TrendingUp,
  HardDrive,
  Receipt,
  Shield,
  GraduationCap,
  Workflow,
  Boxes,
  Send,
  Briefcase,
  ShieldAlert,
  Globe,
  CheckSquare,
  Building2,
} from 'lucide-react';
import { ActiveTab } from '../types';

export interface DashboardDocItem {
  id: string;
  slug: string;
  filename: string;
  title: string;
  category: 'Comercial' | 'Comunicación' | 'IA & Automatización' | 'ERP & Finanzas' | 'Administración & Sistema';
  badge: string;
  summary: string;
  purpose: string;
  components: string[];
  activeTabTarget: ActiveTab;
  icon: React.ElementType;
  rawMarkdown: string;
}

export const DASHBOARD_DOCS_README_MARKDOWN = `# Índice General de Documentación del Dashboard - ClientumOS

Este directorio contiene todos los archivos Markdown con la extracción detallada de las vistas, páginas, pestañas y módulos operativos del panel de control (Dashboard) de ClientumOS.

---

## 📚 Índice Completo de Módulos del Dashboard (18 Secciones Canónicas):

1. **[Overview y Resumen Ejecutivo](./overview_dashboard.md)**
   - KPIs, métricas de negocio en tiempo real y accesos rápidos operativos.
2. **[CRM Kanban y Oportunidades](./crm_pipeline_dashboard.md)**
   - Tablero de ventas interactivo, etapas del pipeline y fichas 360° con MEDDIC.
3. **[WhatsApp Business y Asistente IA](./whatsapp_ia_dashboard.md)**
   - Bandeja omnicanal, simulador de chatbot y campañas masivas de mensajería.
4. **[AI Hub y Orquestador de IA](./ai_intelligence_dashboard.md)**
   - Asistente de marketing, generación de copys y reglas automatizadas con Gemini.
5. **[Prospección Geolocalizada e ICP Builder](./sales_prospector_dashboard.md)**
   - Mapa interactivo Leaflet, extracción de leads comerciales y constructor de ICPs.
6. **[Analíticas, SEO y Auditorías](./analytics_seo_dashboard.md)**
   - Gráficos de rendimiento, Rank Tracker y escáneres de velocidad on-page.
7. **[Integraciones Google Workspace y Gmail](./workspace_integrations_dashboard.md)**
   - Explorador de Google Drive, constructor de plantillas de correo y SMTP.
8. **[ERP, Facturación AFIP y Storefront B2B](./erp_storefront_dashboard.md)**
   - Comprobantes fiscales electrónicos, control de stock y tienda online B2B.
9. **[Consola de Administración y Dominios Cloudflare](./admin_settings_dashboard.md)**
   - Gestión de DNS Anycast, certificados SSL y control de usuarios (RBAC).
10. **[Academia LMS y Sandboxes Interactivos](./academia_lms_dashboard.md)**
    - Cursos corporativos, seguimiento de progreso y entornos de práctica seguros.
11. **[Workflows y Automatizaciones Visuales](./workflows_automations_dashboard.md)**
    - Constructor de flujos trigger & action y registro de ejecuciones.
12. **[Módulos ERP Avanzados (Inventario y Gastos)](./erp_avanzado_dashboard.md)**
    - Control de stock por producto, expense tracker y detalle de facturación.
13. **[Suite Avanzada de WhatsApp (Baileys y Broadcasts)](./whatsapp_suite_avanzado.md)**
    - Bandeja en vivo, plantillas aprobadas y campañas masivas de difusión.
14. **[VS CRM & ERP Suite](./vscrm_suite_dashboard.md)**
    - Gestión de proyectos, control de horas (time tracking) y finanzas de agencias.
15. **[Consola de Administración y Estadísticas Avanzadas](./admin_console_dashboard.md)**
    - Métricas agregadas de plataforma, auditoría de seguridad y control RBAC.
16. **[Integración WordPress y WooCommerce](./wordpress_integracion_dashboard.md)**
    - Sincronización de catálogo, pedidos y webhooks con WooCommerce.
17. **[Gestión de Tareas y Actividades](./tareas_actividades_dashboard.md)**
    - Organización de pendientes, recordatorios y agenda de seguimientos.
18. **[Directorio de Empresas y Cuentas B2B](./empresas_cuentas_dashboard.md)**
    - Fichas corporativas 360°, cuentas comerciales y relación institucional.`;

export const DASHBOARD_DOCS_CATALOG: DashboardDocItem[] = [
  {
    id: 'doc-overview',
    slug: 'overview',
    filename: 'overview_dashboard.md',
    title: 'Resumen y Overview de ClientumOS (Dashboard Principal)',
    category: 'Comercial',
    badge: 'Core Dashboard',
    summary: 'Visión ejecutiva inmediata del estado del negocio, métricas clave de rendimiento (KPIs), accesos directos y actividad reciente.',
    purpose: 'El panel Overview es la vista central al ingresar a ClientumOS. Proporciona una visión ejecutiva inmediata del estado del negocio, métricas clave de rendimiento (KPIs), accesos directos a herramientas de alta frecuencia y actividad reciente en tiempo real.',
    components: [
      'KPIs Principales: Oportunidades Totales, Tasa de Conversión, Interacciones WhatsApp 24/7, Ingresos Facturados AFIP',
      'Accesos Rápidos: Nuevo Lead / Oportunidad, Campañas Masivas, Auditoría Express y Sincronización Cloud',
      'Monitor de Actividad Comercial en Tiempo Real'
    ],
    activeTabTarget: 'dashboard',
    icon: LayoutDashboard,
    rawMarkdown: `# Resumen y Overview de ClientumOS (Dashboard Principal)

## 1. Propósito del Módulo
El panel **Overview** es la vista central al ingresar al sistema operativo ClientumOS. Proporciona una visión ejecutiva inmediata del estado del negocio, métricas clave de rendimiento (KPIs), accesos directos a herramientas de alta frecuencia y actividad reciente en tiempo real.

---

## 2. Métricas y KPIs Principales
- **Oportunidades Totales:** Volumen y valor monetario acumulado de leads activos en el pipeline comercial.
- **Tasa de Conversión:** Porcentaje de leads calificados que avanzan hacia cierre ganado.
- **Interacciones de WhatsApp 24/7:** Volumen de consultas atendidas por el asistente inteligente sin intervención humana.
- **Ingresos Facturados (AFIP):** Resumen de comprobantes emitidos en el período corriente.

---

## 3. Accesos Rápidos y Widgets Interactivos
1. **Nuevo Lead / Oportunidad:** Creación rápida de prospectos con datos de contacto y asignación a ejecutivo.
2. **Enviar Campaña Masiva de WhatsApp:** Lanzamiento directo de secuencias de mensajería comercial.
3. **Auditoría Express de Clientes:** Diagnóstico instantáneo de salud digital y posicionamiento.
4. **Estado de Sincronización Cloud:** Indicador de conectividad con bases de datos, pasarelas de pago y API de WhatsApp.`
  },
  {
    id: 'doc-crm-pipeline',
    slug: 'crm-pipeline',
    filename: 'crm_pipeline_dashboard.md',
    title: 'CRM Kanban y Gestión de Oportunidades',
    category: 'Comercial',
    badge: 'Pipeline B2B',
    summary: 'Tablero interactivo de columnas deslizantes (drag and drop), etapas comerciales y fichas 360° con metodología MEDDIC.',
    purpose: 'Permite visualizar y administrar todo el ciclo de vida comercial de los prospectos mediante un tablero interactivo de columnas deslizantes (drag and drop), acompañado de fichas detalladas de contactos, empresas y metodologías de venta avanzadas.',
    components: [
      'Etapas del Pipeline: Lead Inbound, Calificación, Propuesta Comercial, Negociación, Cierre Ganado / Perdido',
      'Ficha 360° de Contactos y Empresas con Historial de Interacciones',
      'Calificación Estructurada MEDDIC y BANT',
      'Exportación CSV y Filtros Avanzados por Asesor'
    ],
    activeTabTarget: 'opportunities',
    icon: FolderKanban,
    rawMarkdown: `# CRM Kanban y Gestión de Oportunidades - ClientumOS

## 1. Propósito del Módulo
El módulo **CRM Kanban** permite visualizar y administrar todo el ciclo de vida comercial de los prospectos mediante un tablero interactivo de columnas deslizantes (drag and drop), acompañado de fichas detalladas de contactos, empresas y metodologías de venta avanzadas.

---

## 2. Etapas del Pipeline Comercial
1. **Nuevo Lead:** Prospectos recién ingresados desde WhatsApp, formularios web, campañas de anuncios o carga manual.
2. **Contacto & Calificación:** Validación de necesidades, presupuesto (BANT) y encuadre en el Perfil de Cliente Ideal (ICP).
3. **Propuesta Comercial:** Envío formal de cotización desglosada y condiciones comerciales.
4. **Negociación:** Ajuste de requerimientos, términos contractuales y objeciones de precio.
5. **Cierre Ganado / Perdido:** Venta concretada con emisión de factura AFIP o registro de motivo de pérdida.

---

## 3. Ficha 360° de Contactos y Empresas
- **Historial de Interacciones:** Registro cronológico de llamadas, notas internas, correos electrónicos y mensajes de WhatsApp.
- **Metodología MEDDIC / BANT:** Calificación estructurada de métricas, economic buyer, criterios de decisión, proceso de decisión, identificación de dolor y campeones internos.
- **Exportación y Filtros Avanzados:** Búsqueda por rango de fechas, ejecutivo asignado, etiqueta y valor monetario.`
  },
  {
    id: 'doc-empresas-cuentas',
    slug: 'empresas-cuentas',
    filename: 'empresas_cuentas_dashboard.md',
    title: 'Directorio de Empresas y Cuentas B2B',
    category: 'Comercial',
    badge: 'Cuentas Corporativas',
    summary: 'Directorio centralizado de cuentas corporativas, clientes B2B, distribuidoras y socios con relación institucional.',
    purpose: 'Gestiona el directorio centralizado de cuentas corporativas, clientes B2B, distribuidoras y socios estratégicos, estructurando la relación comercial a nivel institucional.',
    components: [
      'Ficha Corporativa 360° con CUIT, dirección, web y facturación estimada',
      'Relación Jerárquica de Contactos y Oportunidades por Empresa',
      'Historial Financiero y Documental conectado a AFIP y Google Drive'
    ],
    activeTabTarget: 'companies',
    icon: Building2,
    rawMarkdown: `# Directorio de Empresas y Cuentas B2B - ClientumOS

## 1. Propósito del Módulo
El módulo **Companies** gestiona el directorio centralizado de cuentas corporativas, clientes B2B, distribuidoras y socios estratégicos, estructurando la relación comercial a nivel institucional.

---

## 2. Componentes Principales
1. **Ficha Corporativa 360°:**
   - Información de la empresa, CUIT/RUC, dirección física, sitio web, categoría industrial y volumen de facturación estimada.
2. **Relación de Contactos y Oportunidades:**
   - Listado de personas asociadas a la cuenta (decisores, compradores, administradores) y oportunidades comerciales activas o cerradas.
3. **Historial Financiero y Documental:**
   - Acceso directo a facturas emitidas, presupuestos aprobados, documentos en Google Drive y registros de interacciones por WhatsApp.`
  },
  {
    id: 'doc-tareas-actividades',
    slug: 'tareas-actividades',
    filename: 'tareas_actividades_dashboard.md',
    title: 'Gestión de Tareas y Actividades',
    category: 'Comercial',
    badge: 'Agenda & Tareas',
    summary: 'Organización de pendientes comerciales y operativos, llamadas programadas, seguimientos y agenda estructurada.',
    purpose: 'Permite a los equipos comerciales y operativos organizar pendientes, programar llamadas, asignar seguimientos y llevar una agenda estructurada vinculada directamente a los contactos y oportunidades del CRM.',
    components: [
      'Listado y Tablero Kanban de Tareas por Vencimiento y Prioridad',
      'Asignación a Miembros del Equipo y Recordatorios In-App',
      'Vinculación 360° con Contactos, Negocios y WhatsApp'
    ],
    activeTabTarget: 'tasks',
    icon: CheckSquare,
    rawMarkdown: `# Gestión de Tareas y Actividades - ClientumOS

## 1. Propósito del Módulo
El módulo **Tasks** permite a los equipos comerciales y operativos organizar pendientes, programar llamadas, asignar seguimientos y llevar una agenda estructurada vinculada directamente a los contactos y oportunidades del CRM.

---

## 2. Componentes Principales
1. **Listado y Tablero de Tareas:**
   - Visualización de pendientes por fecha de vencimiento, prioridad (Alta, Media, Baja) y estado (Pendiente, En Progreso, Completada).
2. **Asignación y Recordatorios:**
   - Asignación de tareas a miembros específicos del equipo con notificaciones in-app y alertas automáticas.
3. **Vinculación 360°:**
   - Cada tarea está enlazada al perfil de la empresa o contacto correspondiente, permitiendo acceder al historial de chat de WhatsApp o cotizaciones con un solo clic.`
  },
  {
    id: 'doc-sales-prospector',
    slug: 'sales-prospector',
    filename: 'sales_prospector_dashboard.md',
    title: 'Prospección Geolocalizada e ICP Builder',
    category: 'Comercial',
    badge: 'Maps B2B',
    summary: 'Mapas interactivos de prospección territorial, geolocalización de comercios y constructor de Perfiles de Cliente Ideal.',
    purpose: 'Módulo avanzado para equipos de ventas outbound que combina mapas interactivos (Leaflet), geolocalización de negocios en tiempo real y construcción de Perfiles de Cliente Ideal (ICP).',
    components: [
      'Mapa Interactivo de Prospección con Búsqueda Territorial por Radio y Zona',
      'Extracción y Enriquecimiento de Datos de Contacto con Diagnóstico FODA por IA',
      'Constructor de ICP (Criterios Demográficos, Facturación y Pain Points)',
      'Importación Directa al Pipeline Comercial'
    ],
    activeTabTarget: 'googleMaps',
    icon: MapPin,
    rawMarkdown: `# Prospección Geolocalizada e ICP Builder - ClientumOS

## 1. Propósito del Módulo
Módulo avanzado para equipos de ventas outbound que combina mapas interactivos (Leaflet), geolocalización de negocios en tiempo real y construcción de Perfiles de Cliente Ideal (ICP).

---

## 2. Capacidades Principales
1. **Mapa Interactivo de Prospección:**
   - Búsqueda territorial por radio y zona (ej. comercios, distribuidoras, estudios en Neuquén o Buenos Aires).
   - Enriquecimiento de perfiles de empresas y extracción de datos de contacto.
   - Generación automática de diagnóstico FODA por IA para cada prospecto encontrado.
2. **Constructor de ICP (Perfil de Cliente Ideal):**
   - Definición de criterios demográficos, tamaño de empresa, facturación estimada y pain points para filtrar bases de datos comerciales.
   - Creación de secuencias de acercamiento automatizadas.`
  },
  {
    id: 'doc-whatsapp-ia',
    slug: 'whatsapp-ia',
    filename: 'whatsapp_ia_dashboard.md',
    title: 'WhatsApp Business y Asistente de IA',
    category: 'Comunicación',
    badge: 'Omnicanal',
    summary: 'Bandeja omnicanal de WhatsApp en vivo, derivación inteligente bot/humano y campañas masivas de mensajería.',
    purpose: 'Centro operativo para la gestión de conversaciones multicanal en WhatsApp, automatización de respuestas 24/7 mediante agentes de inteligencia artificial y ejecución de campañas masivas de mensajería comercial.',
    components: [
      'Bandeja de Entrada Omnicanal (Chat en Vivo y Derivación Asesor Humano)',
      'Simulador de Chatbot Autónomo con Pruebas de Políticas y Catálogo',
      'Campañas Masivas de Difusión con Métricas de Entrega y Lectura'
    ],
    activeTabTarget: 'whatsapp',
    icon: MessageSquare,
    rawMarkdown: `# WhatsApp Business y Asistente de IA - ClientumOS

## 1. Propósito del Módulo
Centro operativo para la gestión de conversaciones multicanal en WhatsApp, automatización de respuestas 24/7 mediante agentes de inteligencia artificial y ejecución de campañas masivas de mensajería comercial.

---

## 2. Funcionalidades Principales
1. **Bandeja de Entrada Omnicanal (Chat):**
   - Visualización de chats activos con clientes en tiempo real.
   - Derivación inteligente entre bot autónomo y asesores humanos.
   - Envío rápido de plantillas aprobadas, imágenes, cotizaciones y links de pago.
2. **Simulador de Chatbot:**
   - Entorno de pruebas para verificar las respuestas automáticas del bot según el catálogo y las políticas de la empresa.
3. **Campañas Masivas de WhatsApp:**
   - Creación de listas de difusión segmentadas por etiquetas y estado en el CRM.
   - Programación de envíos con reportes de entrega, lectura y tasa de respuesta.`
  },
  {
    id: 'doc-whatsapp-suite-avanzado',
    slug: 'whatsapp-suite-avanzado',
    filename: 'whatsapp_suite_avanzado.md',
    title: 'Suite Avanzada de WhatsApp (Baileys, Inbox & Broadcasts)',
    category: 'Comunicación',
    badge: 'Baileys & API',
    summary: 'Conexión multisesión con Baileys y API oficial, gestión de plantillas transaccionales HSM y broadcasts.',
    purpose: 'Centro operativo de mensajería instantánea que abarca la conexión multisesión (incluyendo pasarela Baileys), bandeja de entrada en vivo, gestión de plantillas aprobadas y campañas masivas de difusión.',
    components: [
      'Inbox Multicanal en Vivo con Historial y Asignación de Operadores',
      'Gestión y Validación de Plantillas HSM Transaccionales',
      'Campañas Masivas Segmentadas (Broadcasts) con Métricas',
      'Configuración de Enlace QR Baileys y Tokens Meta Cloud API'
    ],
    activeTabTarget: 'campaigns',
    icon: Send,
    rawMarkdown: `# Suite Avanzada de WhatsApp: Baileys, Inbox y Broadcasts - ClientumOS

## 1. Propósito del Módulo
Centro operativo de mensajería instantánea que abarca la conexión multisesión (incluyendo pasarela Baileys), bandeja de entrada en vivo, gestión de plantillas aprobadas y campañas masivas de difusión.

---

## 2. Componentes Principales
1. **Inbox Multicanal en Vivo:**
   - Interfaz de chat en tiempo real con historial de mensajes, notas internas y asignación de conversaciones a operadores específicos.
2. **Gestión de Plantillas (Templates):**
   - Creación y validación de plantillas de mensajes para notificaciones transaccionales y recordatorios comerciales.
3. **Campañas Masivas (Broadcasts):**
   - Envío programado de mensajes segmentados por listas de contactos del CRM con métricas de entrega y lectura.
4. **Configuración Baileys & API Oficial:**
   - Enlace de dispositivos mediante código QR o token de API oficial de WhatsApp Business.`
  },
  {
    id: 'doc-ai-intelligence',
    slug: 'ai-intelligence',
    filename: 'ai_intelligence_dashboard.md',
    title: 'AI Hub y Orquestador de Inteligencia Artificial',
    category: 'IA & Automatización',
    badge: 'Gemini 2.5',
    summary: 'Asistente de marketing, generación de copys, análisis predictivo de cierre y reglas automatizadas con Gemini.',
    purpose: 'Centraliza todas las capacidades generativas y de análisis predictivo potenciadas por modelos de lenguaje avanzado (Gemini), asistiendo en la redacción de copys comerciales, estrategias de marketing y automatizaciones inteligentes.',
    components: [
      'Asistente de Marketing IA y Planeación de Contenidos',
      'Copywriter & Generador de Brochures Comerciales',
      'Orquestador de Automatizaciones y Disparadores por Intención',
      'Análisis Predictivo de Oportunidades y Puntuación de Cierre'
    ],
    activeTabTarget: 'aiAssistant',
    icon: Bot,
    rawMarkdown: `# AI Hub y Orquestador de Inteligencia Artificial - ClientumOS

## 1. Propósito del Módulo
El **AI Hub** centraliza todas las capacidades generativas y de análisis predictivo potenciadas por modelos de lenguaje avanzado (Gemini), asistiendo en la redacción de copys comerciales, estrategias de marketing y automatizaciones inteligentes.

---

## 2. Herramientas del AI Hub
1. **Asistente de Marketing IA:** Generación automática de copys publicitarios, ganchos para redes sociales y planeación de contenidos mensuales.
2. **Copywriter & Generador de Brochures:** Creación instantánea de folletos comerciales y descripciones de productos optimizadas para conversión.
3. **Orquestador de Automatizaciones:** Configuración de reglas de negocio basadas en IA (ej. *"Si un cliente menciona la palabra 'urgente', notificar al supervisor de guardia por WhatsApp"*).
4. **Análisis Predictivo de Oportunidades:** Puntuación de probabilidad de cierre para cada prospecto basada en interacciones previas.`
  },
  {
    id: 'doc-workflows-automations',
    slug: 'workflows-automations',
    filename: 'workflows_automations_dashboard.md',
    title: 'Workflows y Automatizaciones Visuales',
    category: 'IA & Automatización',
    badge: 'Workflows DAG',
    summary: 'Diseñador visual de automatizaciones trigger & action para eventos del CRM, facturación y alertas internas.',
    purpose: 'Permite diseñar flujos de trabajo basados en eventos (triggers y acciones) para automatizar la atención al cliente, el movimiento de leads en el CRM, el envío de correos electrónicos y las alertas internas.',
    components: [
      'Constructor de Flujos Trigger & Action con Disparadores Configurables',
      'Historial de Ejecución en Tiempo Real y Monitoreo de Errores',
      'Plantillas Preconfiguradas: Bienvenida, Cobros y Reactivación de Carritos'
    ],
    activeTabTarget: 'workflows',
    icon: Workflow,
    rawMarkdown: `# Workflows y Automatizaciones Visuales - ClientumOS

## 1. Propósito del Módulo
El módulo de **Workflows y Automatizaciones** permite diseñar flujos de trabajo basados en eventos (triggers y acciones) para automatizar la atención al cliente, el movimiento de leads en el CRM, el envío de correos electrónicos y las alertas internas.

---

## 2. Capacidades Principales
1. **Constructor de Flujos (Trigger & Action):**
   - Disparadores configurables (ej. *Nuevo lead creado*, *Factura emitida*, *Mensaje de WhatsApp recibido*, *Oportunidad cambiada de etapa*).
   - Acciones automatizadas (ej. *Enviar mensaje por WhatsApp*, *Crear tarea interna*, *Asignar etiqueta*, *Notificar por correo*).
2. **Historial de Ejecución y Monitoreo:**
   - Registro en tiempo real de los workflows ejecutados, estado de éxito o error, y tiempos de respuesta.
3. **Plantillas Preconfiguradas:**
   - Automatizaciones listas para usar de bienvenida a nuevos prospectos, recordatorios de cobro y reactivación de carritos o cotizaciones inactivas.`
  },
  {
    id: 'doc-analytics-seo',
    slug: 'analytics-seo',
    filename: 'analytics_seo_dashboard.md',
    title: 'Analíticas, SEO y Auditorías',
    category: 'IA & Automatización',
    badge: 'Rank Tracker',
    summary: 'Centro de control de tráfico web, Rank Tracker de palabras clave y escáner técnico de Core Web Vitals on-page.',
    purpose: 'Centro de control de rendimiento orgánico, posicionamiento en motores de búsqueda (Rank Tracker), investigación de palabras clave y auditorías técnicas on-page.',
    components: [
      'Dashboard de Analíticas y Efectividad de Canales de Adquisición',
      'Rank Tracker y Monitoreo Diario de Posiciones en Google',
      'Auditoría On-Page de Velocidad, Meta Tags y Core Web Vitals',
      'Bóveda de Palabras Clave (Keyword Vault) con Agrupación Temática'
    ],
    activeTabTarget: 'analytics',
    icon: TrendingUp,
    rawMarkdown: `# Analíticas, SEO y Auditorías - ClientumOS

## 1. Propósito del Módulo
Centro de control de rendimiento orgánico, posicionamiento en motores de búsqueda (Rank Tracker), investigación de palabras clave y auditorías técnicas on-page.

---

## 2. Componentes Principales
1. **Dashboard de Analíticas:** Gráficos de evolución de tráfico, conversiones y efectividad de canales de adquisición (recharts / D3).
2. **Rank Tracker y Keyword Research:** Monitoreo diario de posiciones de palabras clave estratégicas en Google y sugerencia de términos de alta intención comercial.
3. **Auditoría On-Page:** Escaneo automático de velocidad, etiquetas meta, accesibilidad y Core Web Vitals del sitio web corporativo o de los clientes.
4. **Bóveda de Palabras Clave (Keyword Vault):** Almacenamiento organizado de términos agrupados por categoría e intención de búsqueda.`
  },
  {
    id: 'doc-workspace-integrations',
    slug: 'workspace-integrations',
    filename: 'workspace_integrations_dashboard.md',
    title: 'Integraciones Google Workspace, Gmail y Drive',
    category: 'Comunicación',
    badge: 'Google Suite',
    summary: 'Conexión con Drive, sincronización de Gmail, plantillas HTML con SMTP propio y agendamiento con Google Meet.',
    purpose: 'Módulo de conectividad con herramientas de Google Workspace (Drive, Gmail, Calendar y SMTP) para centralizar la documentación corporativa, el envío de campañas de correo y la sincronización de agendas.',
    components: [
      'Google Drive & Document Manager para Presupuestos y Contratos',
      'Campañas de Email con Editor Visual de Plantillas HTML y SMTP',
      'Sincronización de Calendario y Enlaces de Google Meet'
    ],
    activeTabTarget: 'workspaceIntegrations',
    icon: HardDrive,
    rawMarkdown: `# Integraciones Google Workspace, Gmail y Drive - ClientumOS

## 1. Propósito del Módulo
Módulo de conectividad con herramientas de Google Workspace (Drive, Gmail, Calendar y SMTP) para centralizar la documentación corporativa, el envío de campañas de correo y la sincronización de agendas.

---

## 2. Funcionalidades Principales
1. **Google Drive & Document Manager:** Explorador de archivos corporativos, presupuestos, contratos y carpetas de clientes sincronizados en la nube.
2. **Campañas de Email & Constructor de Plantillas:**
   - Creación de boletines y secuencias de correo comercial con editor visual de plantillas HTML.
   - Conexión SMTP personalizada para envío masivo con alta tasa de entregabilidad.
3. **Sincronización de Calendario y Tareas:** Agendamiento automático de reuniones comerciales con sincronización en Google Calendar y notificaciones in-app.`
  },
  {
    id: 'doc-erp-storefront',
    slug: 'erp-storefront',
    filename: 'erp_storefront_dashboard.md',
    title: 'ERP, Facturación AFIP y Storefront B2B',
    category: 'ERP & Finanzas',
    badge: 'Factura AFIP',
    summary: 'Emisión electrónica de Facturas A/B/C con CAE oficial, control de inventario y catálogo de venta online B2B.',
    purpose: 'Módulo de gestión administrativa, emisión de comprobantes fiscales (AFIP), control de inventario y administración del catálogo e-commerce (Storefront B2B).',
    components: [
      'Facturación Electrónica AFIP Directa con Código de Autorización Electrónico (CAE)',
      'Gestión de Inventario y Stock en Tiempo Real con Precios Diferenciados',
      'Storefront & Catálogo B2B con Pedidos Directos a WhatsApp',
      'Importación y Exportación de Listas de Precios en CSV'
    ],
    activeTabTarget: 'erp',
    icon: Receipt,
    rawMarkdown: `# ERP, Facturación AFIP y Storefront B2B - ClientumOS

## 1. Propósito del Módulo
Módulo de gestión administrativa, emisión de comprobantes fiscales (AFIP), control de inventario y administración del catálogo e-commerce (Storefront B2B).

---

## 2. Capacidades Principales
1. **Facturación Electrónica AFIP:** Generación directa de Facturas A, B y C con códigos CAE y validación fiscal sin duplicar carga manual.
2. **Gestión de Inventario y Stock:** Control en tiempo real de productos, SKUs, precios mayoristas y minoristas.
3. **Storefront & Catálogo B2B:** Administración de la tienda online, carritos de compra y derivación automatizada de pedidos hacia el CRM.
4. **Importación / Exportación CSV:** Carga masiva y exportación de listas de precios, bases de datos de clientes y reportes contables.`
  },
  {
    id: 'doc-erp-avanzado',
    slug: 'erp-avanzado',
    filename: 'erp_avanzado_dashboard.md',
    title: 'Módulos ERP Avanzados: Inventario, Gastos y Facturación',
    category: 'ERP & Finanzas',
    badge: 'Inventario & Gastos',
    summary: 'Control exhaustivo de stock multialmacén, registro de gastos operativos y auditoría detallada de facturación.',
    purpose: 'Subsistema ERP financiero y logístico dentro del dashboard para el control exhaustivo de inventarios multialmacén, registro de gastos operativos y auditoría detallada del historial de facturación electrónica.',
    components: [
      'Control de Stock Multialmacén y Alertas de Mínimo Stock por SKU',
      'Expense Tracker y Clasificación de Egresos para Flujo de Caja',
      'Historial de Facturación con Filtros de Estado AFIP y Descarga PDF/CAE'
    ],
    activeTabTarget: 'erpAvanzado',
    icon: Boxes,
    rawMarkdown: `# Módulos ERP Avanzados: Inventario, Gastos y Facturación - ClientumOS

## 1. Propósito del Módulo
Subsistema ERP financiero y logístico dentro del dashboard para el control exhaustivo de inventarios multialmacén, registro de gastos operativos y auditoría detallada del historial de facturación electrónica.

---

## 2. Componentes Principales
1. **Control de Inventario y Stock:**
   - Monitoreo de niveles de stock por producto, alertas de mínimo stock, gestión de SKUs y precios diferenciados (mayorista / minorista).
2. **Control de Gastos y Egresos (Expense Tracker):**
   - Registro de costos operativos, proveedores, categorías de gastos y reportes de flujo de caja.
3. **Historial y Detalle de Facturación (Invoice History):**
   - Listado completo de comprobantes emitidos, estado AFIP (Autorizado, Rechazado, Pendiente), montos netos, IVA y enlaces de descarga directa de PDF/CAE.`
  },
  {
    id: 'doc-vscrm-suite',
    slug: 'vscrm-suite',
    filename: 'vscrm_suite_dashboard.md',
    title: 'VS CRM & ERP Suite (Proyectos, Time Tracking & Horas)',
    category: 'ERP & Finanzas',
    badge: 'Agencias & Proyectos',
    summary: 'Gestión unificada de proyectos, control de horas trabajadas (Time Tracking), gastos de equipo y facturación de servicios.',
    purpose: 'Suite empresarial especializada en la gestión unificada de proyectos, control de horas trabajadas (Time Tracking), gastos de equipo y facturación integrada para empresas de servicios profesionales y agencias.',
    components: [
      'Control de Proyectos y Entregables por Hito y Cliente',
      'Registro de Horas (Time Tracking) con Cronómetros en Vivo',
      'Gestión de Cuentas VS CRM y Acuerdos de Nivel de Servicio (SLA)',
      'Módulo Financiero y Liquidación Rápida de Horas Facturables'
    ],
    activeTabTarget: 'vscrmSuite',
    icon: Briefcase,
    rawMarkdown: `# VS CRM & ERP Suite - ClientumOS

## 1. Propósito del Módulo
Suite empresarial especializada en la gestión unificada de proyectos, control de horas trabajadas (Time Tracking), gastos de equipo y facturación integrada para empresas de servicios profesionales y agencias.

---

## 2. Componentes Principales
1. **Control de Proyectos y Tareas:**
   - Asignación de hitos, seguimiento de entregables y estimación de tiempos de ejecución por cliente.
2. **Registro de Horas (Time Tracking):**
   - Cronómetros y bitácoras de horas dedicadas por operador a cada cuenta o proyecto billable.
3. **Gestión de Clientes y Proveedores (Vscrm Clients):**
   - Base de datos relacional vinculada directamente a facturas y proyectos activos.
4. **Módulo Financiero y Facturación Rápida:**
   - Emisión de presupuestos, notas de cobro y sincronización de gastos operativos.`
  },
  {
    id: 'doc-wordpress-integracion',
    slug: 'wordpress-integracion',
    filename: 'wordpress_integracion_dashboard.md',
    title: 'Integración WordPress y WooCommerce',
    category: 'ERP & Finanzas',
    badge: 'WooCommerce API',
    summary: 'Sincronización bidireccional de productos, pedidos automáticos al CRM y flujos post-venta por WhatsApp.',
    purpose: 'El módulo de integración con WordPress y WooCommerce permite conectar sitios web corporativos y tiendas de comercio electrónico basados en WordPress directamente con el CRM y el ERP de ClientumOS.',
    components: [
      'Configuración y Conexión REST API Segura (WpSetup)',
      'Sincronización de Catálogo y Conversión Automática de Pedidos en Deals',
      'Automatizaciones Post-Venta: Confirmación de Pedido y Recupero de Carritos'
    ],
    activeTabTarget: 'wordpressIntegracion',
    icon: Globe,
    rawMarkdown: `# Integración WordPress y WooCommerce - ClientumOS

## 1. Propósito del Módulo
El módulo de integración con **WordPress y WooCommerce** permite conectar sitios web corporativos y tiendas de comercio electrónico basados en WordPress directamente con el CRM y el ERP de ClientumOS.

---

## 2. Componentes Principales
1. **Configuración y Conexión (WpSetup):**
   - Vinculación mediante claves REST API y Webhooks seguros para sincronizar formularios de contacto, altas de usuarios y pedidos en tiempo real.
2. **Módulos y Sincronización de Catálogo (WpModulos):**
   - Sincronización bidireccional de productos, stock, precios y categorías entre WooCommerce y el ERP de Clientum.
   - Conversión automática de pedidos online en oportunidades comerciales dentro del pipeline del CRM.
3. **Automatización Post-Venta:**
   - Disparo de mensajes automáticos por WhatsApp ante confirmación de pedidos, actualización de envíos y carritos abandonados.`
  },
  {
    id: 'doc-academia-lms',
    slug: 'academia-lms',
    filename: 'academia_lms_dashboard.md',
    title: 'Academia LMS y Sandboxes Interactivos',
    category: 'Administración & Sistema',
    badge: 'Capacitación & Cursos',
    summary: 'Cursos corporativos interactivos, sandboxes de práctica seguros y evaluaciones para certificar a los operadores.',
    purpose: 'La Academia LMS integrada en el dashboard proporciona capacitación continua, cursos especializados para PyMEs y entornos de práctica (sandboxes) para que los equipos aprendan a dominar la automatización comercial, marketing digital y gestión de CRM.',
    components: [
      'Catálogo de Cursos Corporativos con Videos y Seguimiento de Progreso',
      'Sandboxes Interactivos para Pruebas Libres sin Riesgo en Producción',
      'Certificaciones Oficiales ClientumOS al Completar Módulos'
    ],
    activeTabTarget: 'campusLMS',
    icon: GraduationCap,
    rawMarkdown: `# Academia LMS y Sandboxes Interactivos - ClientumOS

## 1. Propósito del Módulo
La **Academia LMS** integrada en el dashboard proporciona capacitación continua, cursos especializados para PyMEs y entornos de práctica (sandboxes) para que los equipos aprendan a dominar la automatización comercial, marketing digital y gestión de CRM.

---

## 2. Componentes Principales
1. **Catálogo de Cursos Corporativos:**
   - Cursos sobre prospección B2B, integración con Meta Ads, configuración de chatbots de WhatsApp y buenas prácticas contables.
2. **Sandboxes Interactivos:**
   - Entornos simulados y seguros donde los operadores pueden probar embudos de venta, disparadores de bots y emisión de comprobantes sin afectar los datos reales de producción.
3. **Certificaciones y Evaluaciones:**
   - Cuestionarios al finalizar cada módulo para certificar a los operadores en el uso eficiente de ClientumOS.`
  },
  {
    id: 'doc-admin-settings',
    slug: 'admin-settings',
    filename: 'admin_settings_dashboard.md',
    title: 'Consola de Administración y Dominios Cloudflare',
    category: 'Administración & Sistema',
    badge: 'Cloudflare & DNS',
    summary: 'Gestión de registros DNS Anycast, certificados SSL universales, ajuste de divisas y roles de usuario (RBAC).',
    purpose: 'Panel de control reservado para administradores y directivos para gestionar la configuración global de la plataforma, dominios web, certificados SSL en infraestructura Cloudflare y permisos de usuario.',
    components: [
      'Gestor de Dominios y Cloudflare Anycast Edge (DNS A, CNAME, TXT)',
      'Consola de Usuarios y Políticas de Control de Acceso (RBAC)',
      'Ajustes Generales: Moneda, Datos de Empresa y Webhooks Externos'
    ],
    activeTabTarget: 'domainManager',
    icon: Shield,
    rawMarkdown: `# Consola de Administración y Ajustes - ClientumOS

## 1. Propósito del Módulo
Panel de control reservado para administradores y directivos para gestionar la configuración global de la plataforma, dominios web, certificados SSL en infraestructura Cloudflare y permisos de usuario.

---

## 2. Herramientas de Administración
1. **Gestor de Dominios y Cloudflare Anycast Edge:**
   - Configuración de registros DNS (A, CNAME, TXT).
   - Supervisión de certificados Universal SSL y protección DDoS en el borde.
2. **Consola de Usuarios y Roles (RBAC):**
   - Asignación de permisos para ejecutivos de cuenta, supervisores y administradores generales.
3. **Ajustes Generales y Sincronización:**
   - Configuración de marcas, divisas, pasarelas de pago y webhooks para integraciones externas.`
  },
  {
    id: 'doc-admin-console',
    slug: 'admin-console',
    filename: 'admin_console_dashboard.md',
    title: 'Consola de Administración y Estadísticas Avanzadas',
    category: 'Administración & Sistema',
    badge: 'Auditoría & Logs',
    summary: 'Métricas de uso de la plataforma, auditoría de seguridad inmutable, logs de sesión y control granular de operadores.',
    purpose: 'Panel de supervisión ejecutiva para administradores generales, encargado de auditar las estadísticas globales de la plataforma, el rendimiento de los operadores y la seguridad general del sistema.',
    components: [
      'Admin Stats Dashboard con Métricas Agregadas y Consumo de Tokens Gemini',
      'Control de Operadores con Asignación de Roles Granulares',
      'Auditoría de Seguridad y Logs Inmutables con Detección de Accesos',
      'Parámetros Globales: Políticas 2FA Obligatorio y Backups Diarios'
    ],
    activeTabTarget: 'adminConsole',
    icon: ShieldAlert,
    rawMarkdown: `# Consola de Administración y Estadísticas Avanzadas - ClientumOS

## 1. Propósito del Módulo
Panel de supervisión ejecutiva para administradores generales, encargado de auditar las estadísticas globales de la plataforma, el rendimiento de los operadores y la seguridad general del sistema.

---

## 2. Componentes Principales
1. **Admin Stats Dashboard:**
   - Métricas agregadas de uso de la plataforma, volumen total de transacciones, actividad de usuarios y consumo de recursos de IA.
2. **Control de Usuarios y Accesos (RBAC):**
   - Altas, bajas, modificación de perfiles y asignación de permisos granulares por rol (Administrador, Supervisor, Vendedor, Técnico).
3. **Auditoría de Seguridad y Logs:**
   - Registro de accesos, intentos fallidos de inicio de sesión y cambios en configuraciones críticas de dominios e infraestructura.`
  }
];
