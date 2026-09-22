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
    label: 'OPERACIONES COMERCIALES',
    categoryIcon: 'sales',
    items: [
      {
        id: 'dashboard',
        label: 'Panel Directivo',
        icon: Home,
        subItems: [
          { id: 'dashboard', label: 'Resumen Ejecutivo', icon: Home },
          { id: 'userDashboard', label: 'Mi Panel Personal', icon: LayoutDashboard },
        ],
      },
      {
        id: 'people',
        label: 'Clientes & Leads',
        icon: Users2,
        subItems: [
          { id: 'people', label: 'Directorio de Prospectos', icon: Users2 },
          { id: 'googleMaps', label: 'Prospector Google Maps', icon: MapPin },
          { id: 'customObjects', label: 'Campos Personalizados B2B', icon: Database },
        ],
      },
      {
        id: 'companies',
        label: 'Cuentas Corporativas',
        icon: Building2,
        subItems: [
          { id: 'companies', label: 'Cuentas Clave Enterprise', icon: Building2 },
          { id: 'competitorHub', label: 'Radar de Competidores', icon: Compass },
        ],
      },
      {
        id: 'meddic',
        label: 'Oportunidades & Scoring',
        icon: Target,
        subItems: [
          { id: 'meddic', label: 'Scoring MEDDIC Activo', icon: Target },
          { id: 'opportunities', label: 'Matriz de Calificación', icon: Briefcase },
          { id: 'clientPortal', label: 'Portal de Clientes VIP', icon: ShieldCheck },
        ],
      },
      {
        id: 'opportunities',
        label: 'Embudo de Ventas',
        icon: FolderKanban,
        subItems: [
          { id: 'opportunities', label: 'Pipeline Kanban Dinámico', icon: FolderKanban },
          { id: 'analytics', label: 'Análisis de Desvíos', icon: BarChart3 },
        ],
      },
      {
        id: 'tasks',
        label: 'Agenda Comercial',
        icon: CheckSquare,
        subItems: [
          { id: 'tasks', label: 'Tareas & Seguimientos', icon: CheckSquare },
          { id: 'calendar', label: 'Calendario de Clientes', icon: Calendar },
        ],
      },
      {
        id: 'activityInbox',
        label: 'Bandeja Multicanal',
        icon: Mail,
        subItems: [
          { id: 'activityInbox', label: 'Inbox Central de Actividad', icon: Inbox },
          { id: 'whatsapp', label: 'WhatsApp WACE Hub', icon: MessageSquare },
          { id: 'messages', label: 'Mensajería Multicanal', icon: Send },
          { id: 'webmail', label: 'Correo Corporativo', icon: Mail },
        ],
      },
    ],
  },
  {
    id: 'control',
    label: 'INTELIGENCIA & SISTEMA',
    categoryIcon: 'admin',
    items: [
      {
        id: 'workflows',
        label: 'Automatizaciones IA',
        icon: Zap,
        subItems: [
          { id: 'workflows', label: 'Flujos de Trabajo Workflows', icon: Workflow },
          { id: 'automation', label: 'Campañas Automatizadas', icon: Zap },
          { id: 'chatbot', label: 'Reglas de Respuesta IA', icon: Bot },
          { id: 'agenteOS', label: 'AgenteOS (14 Roles IA)', icon: Cpu },
        ],
      },
      {
        id: 'reportsAnalytics',
        label: 'BI & Reportes',
        icon: BarChart3,
        subItems: [
          { id: 'reportsAnalytics', label: 'Reportes de Rendimiento', icon: BarChart3 },
          { id: 'analytics', label: 'Proyecciones de Ingreso', icon: BarChart3 },
        ],
      },
      {
        id: 'documentManagement',
        label: 'Propuestas & Catálogos',
        icon: FileText,
        subItems: [
          { id: 'documentManagement', label: 'Gestión Documental', icon: FolderKanban },
          { id: 'propuestas', label: 'Creador de Propuestas PDF', icon: FileSpreadsheet },
          { id: 'brochure', label: 'Catálogos & Material B2B', icon: BookOpen },
        ],
      },
      {
        id: 'settings',
        label: 'Ajustes de Sistema',
        icon: Settings,
        subItems: [
          { id: 'settings', label: 'Configuración General', icon: Settings },
          { id: 'teamManagement', label: 'Equipos & Usuarios', icon: Users },
          { id: 'rbacRoles', label: 'Roles & Permisos (RBAC)', icon: Shield },
          { id: 'integrationSettings', label: 'Integraciones API Hub', icon: Zap },
          { id: 'auditLogs', label: 'Logs de Auditoría SOC2', icon: FileCheck },
          { id: 'erpAvanzado', label: 'Facturación AFIP', icon: Receipt },
          { id: 'adminConsole', label: 'Consola de Administración', icon: ShieldAlert },
        ],
      },
    ],
  },
];

export default sidebarConfig;
