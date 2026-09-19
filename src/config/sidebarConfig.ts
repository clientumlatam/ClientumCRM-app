import React from 'react';
import {
  Home,
  LayoutDashboard,
  Briefcase,
  Target,
  BarChart3,
  Users2,
  Building2,
  Inbox,
  CheckSquare,
  Calendar,
  Workflow,
  FileSpreadsheet,
  FolderKanban,
  ShieldCheck,
  MapPin,
  Compass,
  Globe,
  MessageSquare,
  Send,
  Bot,
  Mail,
  ExternalLink,
  Cpu,
  Sparkles,
  Receipt,
  GraduationCap,
  Store,
  CreditCard,
  Database,
  HardDrive,
  Code2,
  ShieldAlert,
  Settings,
  Shield,
  Zap,
  Users,
  FileCheck,
  Key,
} from 'lucide-react';
import { ActiveTab } from '../types';

export interface SidebarNavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  configurable?: boolean;
  subItems?: SidebarNavItem[];
  defaultExpanded?: boolean;
}

export interface NavSection {
  id: 'main' | 'prospecting' | 'communication' | 'ai' | 'operations' | 'control';
  label: string;
  categoryIcon: 'sales' | 'communication' | 'ai' | 'erp' | 'admin' | null;
  items: SidebarNavItem[];
}

/**
 * Configuration-driven schema for ClientumOS Dashboard Navigation.
 * Easily extensible for adding new modules, sub-menus, and badges.
 */
export const defaultNavSections: NavSection[] = [
  {
    id: 'main',
    label: '1. Dirección Comercial & CRM',
    categoryIcon: 'sales',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard Directivo',
        icon: Home,
        badge: 'Live',
        badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono',
      },
      {
        id: 'userDashboard',
        label: 'Mi Dashboard Personal',
        icon: LayoutDashboard,
        badge: 'Ejecutivo',
        badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
      },
      {
        id: 'opportunities',
        label: 'Embudo de Ventas [Pipeline]',
        icon: Briefcase,
        badge: 'Kanban',
        badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        subItems: [
          { id: 'meddic', label: 'Matriz MEDDIC & Scoring', icon: Target },
          { id: 'analytics', label: 'Análisis de Desvíos CRM', icon: BarChart3 },
        ],
      },
      {
        id: 'reportsAnalytics',
        label: 'Análisis & Reportes BI',
        icon: BarChart3,
        badge: 'BI v2',
        badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
      },
      {
        id: 'people',
        label: 'Directorio B2B & Leads',
        icon: Users2,
        subItems: [
          { id: 'companies', label: 'Cuentas Clave Enterprise', icon: Building2 },
          { id: 'activityInbox', label: 'Historial de Interacciones', icon: Inbox },
        ],
      },
      {
        id: 'documentManagement',
        label: 'Gestión Documental & Archivos',
        icon: FolderKanban,
        badge: 'Vault',
        badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
      },
      {
        id: 'tasks',
        label: 'Agenda & Tareas Comerciales',
        icon: CheckSquare,
        subItems: [
          { id: 'calendar', label: 'Calendario de Reuniones', icon: Calendar },
          { id: 'workflows', label: 'Recordatorios Automatizados', icon: Workflow },
        ],
      },
      {
        id: 'propuestas',
        label: 'Generador de Propuestas [PDF]',
        icon: FileSpreadsheet,
        badge: 'Pro',
        badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono',
      },
      {
        id: 'clientPortal',
        label: 'Portal de Clientes VIP',
        icon: ShieldCheck,
        badge: 'Self-Service',
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      },
    ],
  },
  {
    id: 'prospecting',
    label: '2. Prospección B2B & Intelligence',
    categoryIcon: 'sales',
    items: [
      {
        id: 'googleMaps',
        label: 'Google Maps Prospector B2B',
        icon: MapPin,
        badge: 'IA Maps',
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      },
      {
        id: 'competitorHub',
        label: 'Radar de Competencia & Intel',
        icon: Compass,
        badge: 'Radar B2B',
        badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      },
      {
        id: 'seoSuite',
        label: 'Suite SEO & Auditoría Web',
        icon: Globe,
        badge: 'SEO v2',
        badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
      },
      {
        id: 'gtmStrategy',
        label: 'Estrategia Go-To-Market AI',
        icon: Target,
        badge: 'GTM AI',
        badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
      },
    ],
  },
  {
    id: 'communication',
    label: '3. Comunicación Omnicanal',
    categoryIcon: 'communication',
    items: [
      {
        id: 'whatsapp',
        label: 'WhatsApp WACE Hub [IA]',
        icon: MessageSquare,
        badge: 'En Línea',
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono',
        subItems: [
          { id: 'messages', label: 'Bandeja de Entrada Unificada', icon: Send },
          { id: 'campaigns', label: 'Campañas de Difusión', icon: Send },
          { id: 'chatbot', label: 'Reglas de Auto-Respuesta IA', icon: Bot },
        ],
      },
      {
        id: 'webmail',
        label: 'Correo Corporativo [Webmail]',
        icon: Mail,
        badge: 'Cloudflare',
        badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30 font-mono',
      },
      {
        id: 'wordpressIntegracion',
        label: 'Plugin WordPress & Webforms',
        icon: ExternalLink,
        badge: 'WP Sync',
        badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      },
    ],
  },
  {
    id: 'ai',
    label: '4. Inteligencia Artificial & Agentes',
    categoryIcon: 'ai',
    items: [
      {
        id: 'agenteOS',
        label: 'AgenteOS [14 Roles IA]',
        icon: Cpu,
        badge: 'Autónomo',
        badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
        subItems: [
          { id: 'sdrOutreach', label: 'Agente SDR Prospección 24/7', icon: Bot },
          { id: 'aiAssistant', label: 'Capital Gemini Forecasting', icon: Sparkles },
        ],
      },
      {
        id: 'adCopy',
        label: 'Generador Copy & Ad Creatives',
        icon: Sparkles,
        badge: 'Gemini 2.5',
        badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      },
    ],
  },
  {
    id: 'operations',
    label: '5. Operaciones, ERP & Facturación',
    categoryIcon: 'erp',
    items: [
      {
        id: 'operations',
        label: 'ERP & Logística Avanzada',
        icon: Compass,
        badge: 'Módulo 414',
        badgeColor: 'bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80',
        subItems: [
          { id: 'erp', label: 'Control de Stock & Delivery', icon: Receipt },
          { id: 'campusLMS', label: 'Campus LMS & Academia', icon: GraduationCap },
        ],
      },
      {
        id: 'erpAvanzado',
        label: 'Facturación Electrónica [AFIP]',
        icon: Receipt,
        badge: 'CAE Nativo',
        badgeColor: 'bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80',
      },
      {
        id: 'tiendaDigital',
        label: 'Portal E-Commerce & Tienda',
        icon: Store,
        badge: 'Catálogo',
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      },
      {
        id: 'payments',
        label: 'Suscripciones & MercadoPago',
        icon: CreditCard,
        badge: 'Checkout',
        badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
      },
    ],
  },
  {
    id: 'control',
    label: '6. Infraestructura, Sistema & Gobierno',
    categoryIcon: 'admin',
    items: [
      {
        id: 'teamManagement',
        label: 'Gestión de Equipos & Usuarios',
        icon: Users,
        badge: 'Equipo',
        badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
      },
      {
        id: 'integrationSettings',
        label: 'Hub de Integraciones API',
        icon: Zap,
        badge: 'API Studio',
        badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      },
      {
        id: 'auditLogs',
        label: 'Auditoría & Logs SOC2',
        icon: FileCheck,
        badge: 'SOC2 Security',
        badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      },
      {
        id: 'customObjects',
        label: 'Motor de Datos [Schema SQL]',
        icon: Database,
        badge: 'Módulo 49',
        badgeColor: 'bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80',
        subItems: [
          { id: 'csvStudio', label: 'Importador CSV Studio', icon: FileSpreadsheet },
        ],
      },
      {
        id: 'workspaceIntegrations',
        label: 'Sincronización Cloud & Backups',
        icon: HardDrive,
        badge: 'Cloud Sync',
        badgeColor: 'bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80',
      },
      {
        id: 'domainManager',
        label: 'Gestor de Dominios & DNS',
        icon: Globe,
        badge: 'DNS',
        badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      },
      {
        id: 'vscrmSuite',
        label: 'VSCode CRM Extension Studio',
        icon: Code2,
        badge: 'IDE Extension',
        badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
      },
      {
        id: 'adminConsole',
        label: 'Consola Admin Global',
        icon: ShieldAlert,
        badge: 'Root Ops',
        badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      },
      {
        id: 'settings',
        label: 'Configuración Workspace Settings',
        icon: Settings,
        badge: 'Enterprise',
        badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        subItems: [
          { id: 'rbacRoles', label: 'Roles & Permisos (RBAC)', icon: Shield },
          { id: 'auditLogs', label: 'Auditoría & Logs SOC2', icon: ShieldCheck },
          { id: 'apiIntegrations', label: 'Integraciones & API Hub', icon: Zap },
        ],
      },
    ],
  },
];
