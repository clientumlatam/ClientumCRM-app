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
  FileText,
  BookOpen,
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
 * Main sidebar navigation configuration.
 * Reorganized according to the reference navigation structure:
 * 1. Inicio
 * 2. Contactos
 * 3. Empresas
 * 4. Oportunidades
 * 5. Pipeline
 * 6. Tareas
 * 7. Inbox
 * 8. Automatizaciones
 * 9. Reportes
 * 10. Documentos
 * 11. Configuración
 */
export const sidebarConfig: NavSection[] = [
  {
    id: 'main',
    label: 'CORE',
    categoryIcon: 'sales',
    items: [
      {
        id: 'dashboard',
        label: 'Inicio',
        icon: Home,
        subItems: [
          { id: 'dashboard', label: 'Resumen Ejecutivo', icon: Home },
          { id: 'userDashboard', label: 'Mi Dashboard Personal', icon: LayoutDashboard },
        ],
      },
      {
        id: 'people',
        label: 'Contactos',
        icon: Users2,
        subItems: [
          { id: 'people', label: 'Directorio B2B & Leads', icon: Users2 },
          { id: 'googleMaps', label: 'Google Maps Prospector B2B', icon: MapPin },
          { id: 'customObjects', label: 'Campos & Objetos Personalizados', icon: Database },
        ],
      },
      {
        id: 'companies',
        label: 'Empresas',
        icon: Building2,
        subItems: [
          { id: 'companies', label: 'Cuentas Clave Enterprise', icon: Building2 },
          { id: 'competitorHub', label: 'Radar de Competencia B2B', icon: Compass },
        ],
      },
      {
        id: 'meddic',
        label: 'Oportunidades',
        icon: Target,
        subItems: [
          { id: 'meddic', label: 'Matriz MEDDIC & Scoring', icon: Target },
          { id: 'opportunities', label: 'Listado de Negocios', icon: Briefcase },
          { id: 'clientPortal', label: 'Portal de Clientes VIP', icon: ShieldCheck },
        ],
      },
      {
        id: 'opportunities',
        label: 'Pipeline',
        icon: FolderKanban,
        subItems: [
          { id: 'opportunities', label: 'Embudo de Ventas Kanban', icon: FolderKanban },
          { id: 'analytics', label: 'Análisis de Desvíos CRM', icon: BarChart3 },
        ],
      },
      {
        id: 'tasks',
        label: 'Tareas',
        icon: CheckSquare,
        subItems: [
          { id: 'tasks', label: 'Agenda & Tareas Comerciales', icon: CheckSquare },
          { id: 'calendar', label: 'Calendario de Reuniones', icon: Calendar },
        ],
      },
      {
        id: 'activityInbox',
        label: 'Inbox',
        icon: Mail,
        subItems: [
          { id: 'activityInbox', label: 'Bandeja Unificada de Actividad', icon: Inbox },
          { id: 'whatsapp', label: 'WhatsApp WACE Hub', icon: MessageSquare },
          { id: 'messages', label: 'Mensajes Multicanal', icon: Send },
          { id: 'webmail', label: 'Correo Corporativo Webmail', icon: Mail },
        ],
      },
    ],
  },
  {
    id: 'control',
    label: 'MANAGEMENT',
    categoryIcon: 'admin',
    items: [
      {
        id: 'workflows',
        label: 'Automatizaciones',
        icon: Zap,
        subItems: [
          { id: 'workflows', label: 'Flujos de Trabajo & Workflows', icon: Workflow },
          { id: 'automation', label: 'Campañas Automáticas', icon: Zap },
          { id: 'chatbot', label: 'Reglas de Auto-Respuesta IA', icon: Bot },
          { id: 'agenteOS', label: 'AgenteOS (14 Roles IA)', icon: Cpu },
        ],
      },
      {
        id: 'reportsAnalytics',
        label: 'Reportes',
        icon: BarChart3,
        subItems: [
          { id: 'reportsAnalytics', label: 'Reports & BI Analytics', icon: BarChart3 },
          { id: 'analytics', label: 'Pronóstico de Ingresos & Pipeline', icon: BarChart3 },
        ],
      },
      {
        id: 'documentManagement',
        label: 'Documentos',
        icon: FileText,
        subItems: [
          { id: 'documentManagement', label: 'Gestión Documental & Archivos', icon: FolderKanban },
          { id: 'propuestas', label: 'Generador de Propuestas [PDF]', icon: FileSpreadsheet },
          { id: 'brochure', label: 'Brochures & Material Comercial', icon: BookOpen },
        ],
      },
      {
        id: 'settings',
        label: 'Configuración',
        icon: Settings,
        subItems: [
          { id: 'settings', label: 'Ajustes Workspace Settings', icon: Settings },
          { id: 'teamManagement', label: 'Gestión de Equipos', icon: Users },
          { id: 'rbacRoles', label: 'Roles & Permisos (RBAC)', icon: Shield },
          { id: 'integrationSettings', label: 'Integraciones & API Hub', icon: Zap },
          { id: 'auditLogs', label: 'Auditoría & Logs SOC2', icon: FileCheck },
          { id: 'erpAvanzado', label: 'Facturación Electrónica AFIP', icon: Receipt },
          { id: 'adminConsole', label: 'Consola Admin Root', icon: ShieldAlert },
        ],
      },
    ],
  },
];

export default sidebarConfig;
