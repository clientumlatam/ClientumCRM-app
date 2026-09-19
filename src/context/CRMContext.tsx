import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Activity,
  ActiveTab,
  Company,
  CustomObjectDefinition,
  CustomObjectField,
  FilterState,
  Language,
  Opportunity,
  OpportunityViewMode,
  Person,
  SavedView,
  StageId,
  Task,
  ThemeMode,
  User,
  WorkflowRule,
  Invoice,
  InvoiceStatus,
  InventoryItem,
  ExpenseItem,
  RoleDefinition,
  PermissionResource,
  PermissionAction,
  AuditLogEntry,
  SecurityAnomaly,
  GoogleCalendarSyncState,
  SlackIntegrationState,
  APIKey,
  WebhookConfig,
  WebmailEmail,
  ClientumPlanId,
  TrialSubscriptionState,
} from '../types';
import { getTranslation, TranslationKey } from '../i18n/translations';
import { useTheme } from './ThemeContext';
import { getClientumAuthJsonHeaders } from '../lib/api';
import {
  firebaseSignOut,
  syncWorkspaceToFirestore,
  fetchWorkspaceFromFirestore,
  subscribeToUserSubcollection,
  saveUserSubcollectionRecord,
  deleteUserSubcollectionRecord,
  seedUserSubcollectionsIfEmpty,
  subscribeToAuthState,
  syncUserProfileToFirestore,
  db,
  isLiveFirebaseReady,
} from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { INITIAL_WEBMAIL_EMAILS } from '../data/webmailInitialData';
import {
  INITIAL_ACTIVITIES,
  INITIAL_COMPANIES,
  INITIAL_CUSTOM_OBJECTS,
  INITIAL_OPPORTUNITIES,
  INITIAL_PEOPLE,
  INITIAL_SAVED_VIEWS,
  INITIAL_TASKS,
  INITIAL_WORKFLOWS,
  STAGES,
  USERS,
} from '../data/initialData';
import {
  INITIAL_ROLES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SECURITY_ANOMALIES,
  INITIAL_CALENDAR_SYNC_STATE,
  INITIAL_SLACK_INTEGRATION_STATE,
  INITIAL_API_KEYS,
  INITIAL_WEBHOOKS,
} from '../data/rbacInitialData';
import {
  hasPermission as checkRoleHasPermission,
  scanAuditLogsForAnomalies,
  exportAuditLogsCSV,
  exportAuditLogsJSON,
} from '../services/auditLogger';
import {
  CLIENTUM_COMPANIES,
  CLIENTUM_PEOPLE,
  CLIENTUM_OPPORTUNITIES,
  CLIENTUM_TASKS,
  CLIENTUM_ACTIVITIES,
} from '../data/clientumLeads';
import {
  INITIAL_INVOICES,
  INITIAL_INVENTORY,
  INITIAL_EXPENSES,
} from '../data/erpInitialData';
import { isPrivateAppPath, navigateEnvironment } from '../lib/navigation';
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface CRMContextType {
  opportunities: Opportunity[];
  companies: Company[];
  people: Person[];
  tasks: Task[];
  activities: Activity[];
  users: User[];
  currentUser: User;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewMode: OpportunityViewMode;
  setViewMode: (mode: OpportunityViewMode) => void;
  selectedRecord: { type: 'opportunity' | 'company' | 'person' | 'task'; id: string } | null;
  setSelectedRecord: (record: { type: 'opportunity' | 'company' | 'person' | 'task'; id: string } | null) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  
  // Theme & Language
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;

  // Modals & Palettes & Mobile Nav
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isNewRecordModalOpen: boolean;
  setIsNewRecordModalOpen: (open: boolean) => void;
  newRecordType: 'opportunity' | 'company' | 'person' | 'task';
  setNewRecordType: (type: 'opportunity' | 'company' | 'person' | 'task') => void;
  openNewRecordModal: (type?: 'opportunity' | 'company' | 'person' | 'task') => void;
  isAICopilotModalOpen: boolean;
  setIsAICopilotModalOpen: (open: boolean) => void;
  aiCopilotContext: { type?: string; id?: string; name?: string; initialPrompt?: string; [key: string]: any } | null;
  openAICopilot: (context?: { type?: string; id?: string; name?: string; initialPrompt?: string; [key: string]: any }) => void;
  
  // Auth & Profile & Public Site
  isPublicSiteVisible: boolean;
  setIsPublicSiteVisible: (visible: boolean) => void;
  openPublicSite: () => void;
  exitToPublicSite: () => void;
  enterApp: (force?: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isAuthReady: boolean;
  gmailAccessToken: string | null;
  setGmailAccessToken: (token: string | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  login: (email: string, pass: string) => void;
  register: (name: string, email: string, pass: string, company: string) => void;
  logout: () => void;
  syncClerkAuth: (identity: { id: string; email: string; name: string; avatar?: string | null } | null) => void;
  resetPassword: (email: string) => void;

  // Free Trial & Mercado Pago Subscription
  trialSubscription: TrialSubscriptionState;
  startFreeTrial: (plan?: ClientumPlanId) => void;
  upgradeSubscription: (plan: ClientumPlanId, billingCycle?: 'monthly' | 'annual', mpInfo?: any) => Promise<boolean>;
  isMpCheckoutModalOpen: boolean;
  setIsMpCheckoutModalOpen: (open: boolean) => void;
  selectedCheckoutPlan: ClientumPlanId;
  setSelectedCheckoutPlan: (plan: ClientumPlanId) => void;
  openMercadoPagoCheckout: (plan?: ClientumPlanId) => void;
  
  // CRUD
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => Opportunity;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  moveOpportunityStage: (id: string, newStage: StageId) => void;

  addCompany: (comp: Omit<Company, 'id' | 'createdAt'>) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  addPerson: (person: Omit<Person, 'id' | 'createdAt' | 'lastActivityDate'>) => Person;
  updatePerson: (id: string, updates: Partial<Person>, silent?: boolean) => void;
  deletePerson: (id: string) => void;
  enrichContact: (personId: string, manualTrigger?: boolean) => Promise<boolean>;

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Activity;
  deleteActivity: (id: string) => void;

  // ClientumCRM Custom Objects & Metadata Studio
  customObjects: CustomObjectDefinition[];
  addCustomObject: (obj: Omit<CustomObjectDefinition, 'id' | 'createdAt' | 'fields' | 'records'>) => CustomObjectDefinition;
  addCustomFieldToObject: (objectId: string, field: Omit<CustomObjectField, 'id'>) => void;
  addRecordToCustomObject: (objectId: string, record: Record<string, any>) => void;
  deleteRecordFromCustomObject: (objectId: string, recordId: string) => void;

  // Clientum Workflows Engine
  workflows: WorkflowRule[];
  addWorkflow: (wf: Omit<WorkflowRule, 'id' | 'runCount'>) => WorkflowRule;
  updateWorkflow: (wf: WorkflowRule) => void;
  toggleWorkflow: (id: string) => void;
  deleteWorkflow: (id: string) => void;

  // Saved Views
  savedViews: SavedView[];
  addSavedView: (view: Omit<SavedView, 'id'>) => SavedView;
  deleteSavedView: (id: string) => void;

  // CSV Data Import Engine
  importCSVData: (target: 'opportunities' | 'companies' | 'people', items: any[]) => number;
  lastImport: { id: string; target: 'opportunities' | 'companies' | 'people'; count: number } | null;
  undoLastImport: () => Promise<boolean>;
  refreshCrmData: () => Promise<boolean>;

  // ERP Suite
  invoices: Invoice[];
  inventory: InventoryItem[];
  expenses: ExpenseItem[];
  addInvoice: (inv: Omit<Invoice, 'id' | 'createdAt'>) => Invoice;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
  updateInventoryStock: (id: string, deltaQuantity: number) => void;
  deleteInventoryItem: (id: string) => void;
  addExpense: (exp: Omit<ExpenseItem, 'id'>) => ExpenseItem;
  deleteExpense: (id: string) => void;
  exportFullWorkspaceJSON: () => void;

  // Data helpers
  resetToDemoData: () => void;
  loadClientumLeads: () => void;
  exportOpportunitiesCSV: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;

  // RBAC & Team Roles System
  roles: RoleDefinition[];
  currentRole: RoleDefinition;
  addRole: (role: Omit<RoleDefinition, 'id' | 'createdAt'>) => RoleDefinition;
  updateRole: (id: string, updates: Partial<RoleDefinition>) => void;
  deleteRole: (id: string) => boolean;
  duplicateRole: (id: string) => RoleDefinition;
  assignUserRole: (userId: string, roleNameOrSlug: string) => void;
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  hasPermission: (resource: PermissionResource, action: PermissionAction) => boolean;
  checkPermissionOrWarn: (resource: PermissionResource, action: PermissionAction, resourceLabel?: string) => boolean;

  // Audit Logging & Anomaly Detection System
  auditLogs: AuditLogEntry[];
  logAuditEvent: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'> & { ipAddress?: string; userAgent?: string }) => void;
  clearAuditLogs: () => void;
  exportAuditCSV: () => void;
  exportAuditJSON: () => void;
  securityAnomalies: SecurityAnomaly[];
  dismissAnomaly: (id: string) => void;
  resolveAnomaly: (id: string, actionNote?: string) => void;
  triggerSecurityScan: () => void;

  // API Integrations Hub (Google Calendar, Slack, Developer Hub, API Keys, Webhooks)
  googleCalendarSync: GoogleCalendarSyncState;
  updateCalendarSync: (updates: Partial<GoogleCalendarSyncState>) => void;
  syncGoogleCalendarNow: () => Promise<{ success: boolean; syncedCount: number }>;
  slackIntegration: SlackIntegrationState;
  updateSlackIntegration: (updates: Partial<SlackIntegrationState>) => void;
  sendSlackTestMessage: (channel?: string, eventType?: string) => Promise<boolean>;
  apiKeys: APIKey[];
  createAPIKey: (name: string, scopes: string[], ownerUserId?: string) => APIKey;
  revokeAPIKey: (id: string) => void;
  webhooks: WebhookConfig[];
  addWebhook: (wh: Omit<WebhookConfig, 'id' | 'createdAt' | 'deliverySuccessCount' | 'deliveryFailureCount'>) => WebhookConfig;
  updateWebhook: (id: string, updates: Partial<WebhookConfig>) => void;
  deleteWebhook: (id: string) => void;
  triggerTestWebhook: (id: string) => Promise<{ status: number; message: string }>;

  // Cloudflare Webmail Worker & D1 Database
  webmailEmails: WebmailEmail[];
  sendWebmailEmail: (email: Omit<WebmailEmail, 'id' | 'timestamp' | 'messageId' | 'direction'>) => Promise<boolean>;
  markWebmailEmailAsRead: (id: string, isRead?: boolean) => void;
  deleteWebmailEmail: (id: string) => void;
  toggleWebmailStar: (id: string) => void;
  isComposeEmailModalOpen: boolean;
  setIsComposeEmailModalOpen: (open: boolean) => void;
  composeEmailDefaults: Partial<WebmailEmail> | null;
  openComposeEmailModal: (defaults?: Partial<WebmailEmail>) => void;
  closeComposeEmailModal: () => void;

  // Ecosystem Hub Order & Sync Status
  ecosystemModuleOrder: string[];
  setEcosystemModuleOrder: (order: string[]) => void;
  isOnline: boolean;
  isSyncPending: boolean;
  offlinePriorityQueue: string[][];
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export interface AuthContextType {
  currentUser: User;
  users: User[];
  isAuthenticated: boolean;
  isAuthReady: boolean;
  gmailAccessToken: string | null;
  setGmailAccessToken: (token: string | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  login: (email: string, pass: string) => void;
  register: (name: string, email: string, pass: string, company: string) => void;
  logout: () => void;
  syncClerkAuth: (identity: { id: string; email: string; name: string; avatar?: string | null } | null) => void;
  resetPassword: (email: string) => void;
  roles: RoleDefinition[];
  currentRole: RoleDefinition;
  addRole: (role: Omit<RoleDefinition, 'id' | 'createdAt'>) => RoleDefinition;
  updateRole: (id: string, updates: Partial<RoleDefinition>) => void;
  deleteRole: (id: string) => boolean;
  duplicateRole: (id: string) => RoleDefinition;
  assignUserRole: (userId: string, roleNameOrSlug: string) => void;
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  hasPermission: (resource: PermissionResource, action: PermissionAction) => boolean;
  checkPermissionOrWarn: (resource: PermissionResource, action: PermissionAction, resourceLabel?: string) => boolean;
}

export interface CRMDataContextType {
  opportunities: Opportunity[];
  companies: Company[];
  people: Person[];
  tasks: Task[];
  activities: Activity[];
  customObjects: CustomObjectDefinition[];
  workflows: WorkflowRule[];
  savedViews: SavedView[];
  invoices: Invoice[];
  inventory: InventoryItem[];
  expenses: ExpenseItem[];
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => Opportunity;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  moveOpportunityStage: (id: string, newStage: StageId) => void;
  addCompany: (comp: Omit<Company, 'id' | 'createdAt'>) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  addPerson: (person: Omit<Person, 'id' | 'createdAt' | 'lastActivityDate'>) => Person;
  updatePerson: (id: string, updates: Partial<Person>, silent?: boolean) => void;
  deletePerson: (id: string) => void;
  enrichContact: (personId: string, manualTrigger?: boolean) => Promise<boolean>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Activity;
  deleteActivity: (id: string) => void;
  addCustomObject: (obj: Omit<CustomObjectDefinition, 'id' | 'createdAt' | 'fields' | 'records'>) => CustomObjectDefinition;
  addCustomFieldToObject: (objectId: string, field: Omit<CustomObjectField, 'id'>) => void;
  addRecordToCustomObject: (objectId: string, record: Record<string, any>) => void;
  deleteRecordFromCustomObject: (objectId: string, recordId: string) => void;
  addWorkflow: (wf: Omit<WorkflowRule, 'id' | 'runCount'>) => WorkflowRule;
  updateWorkflow: (wf: WorkflowRule) => void;
  toggleWorkflow: (id: string) => void;
  deleteWorkflow: (id: string) => void;
  addSavedView: (view: Omit<SavedView, 'id'>) => SavedView;
  deleteSavedView: (id: string) => void;
  importCSVData: (target: 'opportunities' | 'companies' | 'people', items: any[]) => number;
  lastImport: { id: string; target: 'opportunities' | 'companies' | 'people'; count: number } | null;
  undoLastImport: () => Promise<boolean>;
  refreshCrmData: () => Promise<boolean>;
  addInvoice: (inv: Omit<Invoice, 'id' | 'createdAt'>) => Invoice;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
  updateInventoryStock: (id: string, deltaQuantity: number) => void;
  deleteInventoryItem: (id: string) => void;
  addExpense: (exp: Omit<ExpenseItem, 'id'>) => ExpenseItem;
  deleteExpense: (id: string) => void;
  exportFullWorkspaceJSON: () => void;
  resetToDemoData: () => void;
  loadClientumLeads: () => void;
  exportOpportunitiesCSV: () => void;
  googleCalendarSync: GoogleCalendarSyncState;
  updateCalendarSync: (updates: Partial<GoogleCalendarSyncState>) => void;
  syncGoogleCalendarNow: () => Promise<{ success: boolean; syncedCount: number }>;
  slackIntegration: SlackIntegrationState;
  updateSlackIntegration: (updates: Partial<SlackIntegrationState>) => void;
  sendSlackTestMessage: (channel?: string, eventType?: string) => Promise<boolean>;
  apiKeys: APIKey[];
  createAPIKey: (name: string, scopes: string[], ownerUserId?: string) => APIKey;
  revokeAPIKey: (id: string) => void;
  webhooks: WebhookConfig[];
  addWebhook: (wh: Omit<WebhookConfig, 'id' | 'createdAt' | 'deliverySuccessCount' | 'deliveryFailureCount'>) => WebhookConfig;
  updateWebhook: (id: string, updates: Partial<WebhookConfig>) => void;
  deleteWebhook: (id: string) => void;
  triggerTestWebhook: (id: string) => Promise<{ status: number; message: string }>;
  webmailEmails: WebmailEmail[];
  sendWebmailEmail: (email: Omit<WebmailEmail, 'id' | 'timestamp' | 'messageId' | 'direction'>) => Promise<boolean>;
  markWebmailEmailAsRead: (id: string, isRead?: boolean) => void;
  deleteWebmailEmail: (id: string) => void;
  toggleWebmailStar: (id: string) => void;
  isOnline: boolean;
  isSyncPending: boolean;
  offlinePriorityQueue: string[][];
  ecosystemModuleOrder: string[];
  setEcosystemModuleOrder: (order: string[]) => void;
}

export interface UIContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewMode: OpportunityViewMode;
  setViewMode: (mode: OpportunityViewMode) => void;
  selectedRecord: { type: 'opportunity' | 'company' | 'person' | 'task'; id: string } | null;
  setSelectedRecord: (record: { type: 'opportunity' | 'company' | 'person' | 'task'; id: string } | null) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isNewRecordModalOpen: boolean;
  setIsNewRecordModalOpen: (open: boolean) => void;
  newRecordType: 'opportunity' | 'company' | 'person' | 'task';
  setNewRecordType: (type: 'opportunity' | 'company' | 'person' | 'task') => void;
  openNewRecordModal: (type?: 'opportunity' | 'company' | 'person' | 'task') => void;
  isAICopilotModalOpen: boolean;
  setIsAICopilotModalOpen: (open: boolean) => void;
  aiCopilotContext: { type?: string; id?: string; name?: string; initialPrompt?: string; [key: string]: any } | null;
  openAICopilot: (context?: { type?: string; id?: string; name?: string; initialPrompt?: string; [key: string]: any }) => void;
  trialSubscription: TrialSubscriptionState;
  startFreeTrial: (plan?: ClientumPlanId) => void;
  upgradeSubscription: (plan: ClientumPlanId, billingCycle?: 'monthly' | 'annual', mpInfo?: any) => Promise<boolean>;
  isMpCheckoutModalOpen: boolean;
  setIsMpCheckoutModalOpen: (open: boolean) => void;
  selectedCheckoutPlan: ClientumPlanId;
  setSelectedCheckoutPlan: (plan: ClientumPlanId) => void;
  openMercadoPagoCheckout: (plan?: ClientumPlanId) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  isComposeEmailModalOpen: boolean;
  setIsComposeEmailModalOpen: (open: boolean) => void;
  composeEmailDefaults: Partial<WebmailEmail> | null;
  openComposeEmailModal: (defaults?: Partial<WebmailEmail>) => void;
  closeComposeEmailModal: () => void;
  auditLogs: AuditLogEntry[];
  logAuditEvent: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'> & { ipAddress?: string; userAgent?: string }) => void;
  clearAuditLogs: () => void;
  exportAuditCSV: () => void;
  exportAuditJSON: () => void;
  securityAnomalies: SecurityAnomaly[];
  dismissAnomaly: (id: string) => void;
  resolveAnomaly: (id: string, actionNote?: string) => void;
  triggerSecurityScan: () => void;
}

export interface ERPContextType {
  invoices: Invoice[];
  inventory: InventoryItem[];
  expenses: ExpenseItem[];
  addInvoice: (inv: Omit<Invoice, 'id' | 'createdAt'>) => Invoice;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
  updateInventoryStock: (id: string, deltaQuantity: number) => void;
  deleteInventoryItem: (id: string) => void;
  addExpense: (exp: Omit<ExpenseItem, 'id'>) => ExpenseItem;
  deleteExpense: (id: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const CRMDataContext = createContext<CRMDataContextType | undefined>(undefined);
export const UIContext = createContext<UIContextType | undefined>(undefined);
export const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a CRMProvider');
  return context;
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) throw new Error('useERP must be used within a CRMProvider');
  return context;
};

export const useCRMData = () => {
  const context = useContext(CRMDataContext);
  if (!context) throw new Error('useCRMData must be used within a CRMProvider');
  return context;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a CRMProvider');
  return context;
};

const STORAGE_KEYS = {
  OPPORTUNITIES: 'clientum_crm_opportunities',
  COMPANIES: 'clientum_crm_companies',
  PEOPLE: 'clientum_crm_people',
  TASKS: 'clientum_crm_tasks',
  ACTIVITIES: 'clientum_crm_activities',
  THEME: 'clientum_crm_theme',
  LANGUAGE: 'clientum_crm_language',
  INVOICES: 'clientum_crm_invoices',
  INVENTORY: 'clientum_crm_inventory',
  EXPENSES: 'clientum_crm_expenses',
};

const ensureUniqueIds = <T extends { id: string }>(items: T[], prefix: string): T[] => {
  const seen = new Set<string>();

  return items.map((item, index) => {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      return item;
    }

    let replacementId = `${prefix}-${item.id}-${index}`;
    let suffix = 1;
    while (seen.has(replacementId)) {
      replacementId = `${prefix}-${item.id}-${index}-${suffix}`;
      suffix += 1;
    }
    seen.add(replacementId);
    return { ...item, id: replacementId };
  });
};

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, resolvedTheme, setTheme: setContextTheme, toggleTheme: toggleContextTheme } = useTheme();

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return saved === 'es' || saved === 'pt' || saved === 'en' ? (saved as Language) : 'en';
  });

  const showToastRef = useRef<((message: string, type?: 'success' | 'info' | 'warning' | 'error') => void) | null>(null);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
    const langNames: Record<Language, string> = {
      en: 'English (US)',
      es: 'Español (América Latina / España)',
      pt: 'Português (Brasil / Portugal)',
    };
    const toastMsgs: Record<Language, string> = {
      en: `Language set to ${langNames[newLang]}`,
      es: `Idioma cambiado a ${langNames[newLang]}`,
      pt: `Idioma alterado para ${langNames[newLang]}`,
    };
    showToastRef.current?.(toastMsgs[newLang], 'info');
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return getTranslation(key, language);
  }, [language]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setContextTheme(newTheme);
  }, [setContextTheme]);

  const toggleTheme = useCallback(() => {
    toggleContextTheme();
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    showToastRef.current?.(
      next === 'light' ? 'Modo Claro activado' : 'Modo Oscuro activado',
      'info'
    );
  }, [resolvedTheme, toggleContextTheme]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    return saved ? ensureUniqueIds(JSON.parse(saved), 'opp') : INITIAL_OPPORTUNITIES;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PEOPLE);
    return saved ? JSON.parse(saved) : INITIAL_PEOPLE;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // ERP State
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  // Custom Objects, Workflows, Saved Views State
  const [customObjects, setCustomObjects] = useState<CustomObjectDefinition[]>(() => {
    const saved = localStorage.getItem('clientum_crm_custom_objects');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_OBJECTS;
  });

  const [workflows, setWorkflows] = useState<WorkflowRule[]>(() => {
    const saved = localStorage.getItem('clientum_crm_workflows');
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOWS;
  });

  const [savedViews, setSavedViews] = useState<SavedView[]>(() => {
    const saved = localStorage.getItem('clientum_crm_saved_views');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_VIEWS;
  });

  // RBAC Roles State
  const [roles, setRoles] = useState<RoleDefinition[]>(() => {
    const saved = localStorage.getItem('clientum_crm_roles');
    return saved ? JSON.parse(saved) : INITIAL_ROLES;
  });

  useEffect(() => {
    localStorage.setItem('clientum_crm_roles', JSON.stringify(roles));
  }, [roles]);

  // Users State
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('clientum_crm_users_list');
      const parsed = saved ? JSON.parse(saved) : USERS;
      return Array.isArray(parsed) ? parsed : USERS;
    } catch {
      return USERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('clientum_crm_users_list', JSON.stringify(users));
  }, [users]);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('clientum_crm_current_user');
      return saved ? JSON.parse(saved) : USERS[0];
    } catch (e) {
      return USERS[0];
    }
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('clientum_crm_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('clientum_crm_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Security Anomalies State
  const [securityAnomalies, setSecurityAnomalies] = useState<SecurityAnomaly[]>(() => {
    const saved = localStorage.getItem('clientum_crm_security_anomalies');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_ANOMALIES;
  });

  useEffect(() => {
    localStorage.setItem('clientum_crm_security_anomalies', JSON.stringify(securityAnomalies));
  }, [securityAnomalies]);

  // Google Calendar Integration State
  const [googleCalendarSync, setGoogleCalendarSync] = useState<GoogleCalendarSyncState>(() => {
    const saved = localStorage.getItem('clientum_crm_gcal_sync');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_SYNC_STATE;
  });

  useEffect(() => {
    localStorage.setItem('clientum_crm_gcal_sync', JSON.stringify(googleCalendarSync));
  }, [googleCalendarSync]);

  // Slack Integration State
  const [slackIntegration, setSlackIntegration] = useState<SlackIntegrationState>(() => {
    const saved = localStorage.getItem('clientum_crm_slack_sync');
    return saved ? JSON.parse(saved) : INITIAL_SLACK_INTEGRATION_STATE;
  });

  useEffect(() => {
    localStorage.setItem('clientum_crm_slack_sync', JSON.stringify(slackIntegration));
  }, [slackIntegration]);

  // API Keys & Webhooks State
  const [apiKeys, setApiKeys] = useState<APIKey[]>(() => {
    const saved = localStorage.getItem('clientum_crm_api_keys');
    if (!saved) return INITIAL_API_KEYS;

    try {
      const parsed = JSON.parse(saved) as APIKey[];
      return parsed.map((key) =>
        ({
          ...key,
          ownerUserId: key.ownerUserId || 'platform',
          ownerUserName: key.ownerUserName || (key.ownerUserId ? undefined : 'ClientumCRM Platform'),
          token: undefined,
        }),
      );
    } catch {
      return INITIAL_API_KEYS;
    }
  });

  useEffect(() => {
    // Never persist raw API tokens in browser storage. A production API should
    // hash and store them server-side; this demo keeps only metadata locally.
    const safeApiKeys = apiKeys.map(({ token: _token, ...metadata }) => metadata);
    localStorage.setItem('clientum_crm_api_keys', JSON.stringify(safeApiKeys));
  }, [apiKeys]);

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(() => {
    const saved = localStorage.getItem('clientum_crm_webhooks');
    return saved ? JSON.parse(saved) : INITIAL_WEBHOOKS;
  });

  useEffect(() => {
    localStorage.setItem('clientum_crm_webhooks', JSON.stringify(webhooks));
  }, [webhooks]);

  const [ecosystemModuleOrder, setEcosystemModuleOrderState] = useState<string[]>(() => {
    const saved = localStorage.getItem('clientum_ecosystem_module_order');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      'mod-01-maps',
      'mod-02-erp',
      'mod-03-omnichannel',
      'mod-04-workflows',
      'mod-05-proposals',
      'mod-06-copilot',
      'mod-07-tasks-kanban',
      'mod-08-bi-dashboard',
      'mod-09-contacts-enrichment',
      'mod-10-calendar',
      'mod-11-webforms',
      'mod-12-email-cadences',
      'mod-13-checkout-gateways',
      'mod-14-helpdesk-tickets',
      'mod-15-catalog-pricing',
    ];
  });

  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });
  const [isSyncPending, setIsSyncPending] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const [offlinePriorityQueue, setOfflinePriorityQueue] = useState<string[][]>(() => {
    try {
      const saved = localStorage.getItem('clientum_offline_priority_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('clientum_offline_priority_queue', JSON.stringify(offlinePriorityQueue));
  }, [offlinePriorityQueue]);

  const setEcosystemModuleOrder = useCallback((newOrder: string[]) => {
    setEcosystemModuleOrderState(newOrder);
    localStorage.setItem('clientum_ecosystem_module_order', JSON.stringify(newOrder));

    if (!navigator.onLine) {
      setIsSyncPending(true);
      setOfflinePriorityQueue((prev) => [...prev, newOrder]);
      showToastRef.current?.('⚠️ Sin conexión: Cambio de prioridad guardado en cola offline para sincronización con Firebase', 'warning');
    } else {
      setIsSyncPending(true);
      setTimeout(() => {
        setIsSyncPending(false);
      }, 900);
    }
  }, []);
  const [activeTab, setActiveTab] = useState<ActiveTab>('opportunities');
  const [viewMode, setViewMode] = useState<OpportunityViewMode>('kanban');
  const [selectedRecord, setSelectedRecord] = useState<{ type: 'opportunity' | 'company' | 'person' | 'task'; id: string } | null>(null);

  const initialFilter: FilterState = {
    search: '',
    stage: 'all',
    owner: 'all',
    priority: 'all',
    tier: 'all',
  };
  const [filterState, setFilterState] = useState<FilterState>(initialFilter);

  // Modals & Palettes & Mobile Nav
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = useCallback(() => setIsMobileSidebarOpen((prev) => !prev), []);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [newRecordType, setNewRecordType] = useState<'opportunity' | 'company' | 'person' | 'task'>('opportunity');
  const [isAICopilotModalOpen, setIsAICopilotModalOpen] = useState(false);
  const [aiCopilotContext, setAICopilotContext] = useState<{ type?: string; id?: string; name?: string; initialPrompt?: string; [key: string]: any } | null>(null);
  const [isPublicSiteVisible, setIsPublicSiteVisible] = useState<boolean>(() => {
    try {
      const mode = sessionStorage.getItem('clientum_view_mode');
      if (mode === 'public') return true;
      return false; // Default directly into the CRM application workspace
    } catch (e) {
      return false;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const demoSessionRef = useRef(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [gmailAccessToken, setGmailAccessToken] = useState<string | null>(null);

  // Free Trial & Mercado Pago Subscription State
  const [trialSubscription, setTrialSubscription] = useState<TrialSubscriptionState>(() => {
    try {
      const saved = localStorage.getItem('clientum_subscription_state');
      if (saved) {
        const parsed = JSON.parse(saved) as TrialSubscriptionState;
        const now = Date.now();
        const end = new Date(parsed.trialEndDate).getTime();
        const days = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
        return {
          ...parsed,
          daysRemaining: days,
          isTrialActive: parsed.status === 'trial' ? days > 0 : false,
          isTrialExpired: parsed.status === 'trial' ? days <= 0 : false,
        };
      }
    } catch (e) {
      // ignore
    }

    // Default: 7-Day Free Trial (1 week)
    const now = Date.now();
    const trialStartDate = new Date(now).toISOString();
    const trialEndDate = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
    return {
      plan: 'trial',
      status: 'trial',
      trialStartDate,
      trialEndDate,
      daysRemaining: 7,
      isTrialActive: true,
      isTrialExpired: false,
      billingCycle: 'annual',
    };
  });

  const [isMpCheckoutModalOpen, setIsMpCheckoutModalOpen] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<ClientumPlanId>('professional');

  useEffect(() => {
    try {
      localStorage.setItem('clientum_subscription_state', JSON.stringify(trialSubscription));
    } catch (e) {}
  }, [trialSubscription]);

  const startFreeTrial = useCallback((plan: ClientumPlanId = 'professional') => {
    const now = Date.now();
    const trialStartDate = new Date(now).toISOString();
    const trialEndDate = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
    const updated: TrialSubscriptionState = {
      plan,
      status: 'trial',
      trialStartDate,
      trialEndDate,
      daysRemaining: 7,
      isTrialActive: true,
      isTrialExpired: false,
      billingCycle: 'annual',
    };
    setTrialSubscription(updated);
    try {
      localStorage.setItem('clientum_subscription_state', JSON.stringify(updated));
    } catch (e) {}
  }, []);

  const upgradeSubscription = useCallback(async (
    plan: ClientumPlanId,
    billingCycle: 'monthly' | 'annual' = 'annual',
    mpInfo?: any
  ): Promise<boolean> => {
    const now = new Date();
    const nextBill = new Date(now);
    if (billingCycle === 'annual') {
      nextBill.setFullYear(nextBill.getFullYear() + 1);
    } else {
      nextBill.setMonth(nextBill.getMonth() + 1);
    }

    const updated: TrialSubscriptionState = {
      plan,
      status: 'active',
      trialStartDate: trialSubscription.trialStartDate,
      trialEndDate: trialSubscription.trialEndDate,
      daysRemaining: 0,
      isTrialActive: false,
      isTrialExpired: false,
      billingCycle,
      paymentMethod: 'mercadopago',
      lastPaymentDate: now.toISOString(),
      nextBillingDate: nextBill.toISOString(),
      subscriptionId: mpInfo?.subscriptionId || `mp-sub-${Date.now()}`,
      amountARS: mpInfo?.amountARS || (plan === 'starter' ? 14900 : plan === 'professional' ? 29900 : 59900),
      cuitOrCuil: mpInfo?.cuitOrCuil,
      businessName: mpInfo?.businessName,
    };

    setTrialSubscription(updated);
    try {
      localStorage.setItem('clientum_subscription_state', JSON.stringify(updated));
    } catch (e) {}
    return true;
  }, [trialSubscription.trialStartDate, trialSubscription.trialEndDate]);

  const openMercadoPagoCheckout = useCallback((plan: ClientumPlanId = 'professional') => {
    setSelectedCheckoutPlan(plan);
    setIsMpCheckoutModalOpen(true);
  }, []);
  const [isCrmRemoteReady, setIsCrmRemoteReady] = useState(false);
  const [lastImport, setLastImport] = useState<{
    id: string;
    target: 'opportunities' | 'companies' | 'people';
    recordIds: string[];
    count: number;
  } | null>(null);
  const importBatchPersistenceRef = useRef<Promise<void> | null>(null);

  const refreshCrmData = useCallback(async (): Promise<boolean> => {
    if (!isAuthReady || !isAuthenticated || !currentUser.id) return false;
    try {
      const response = await fetch('/api/crm/bootstrap', {
        headers: await getClientumAuthJsonHeaders(currentUser),
      });
      if (!response.ok) throw new Error(`CRM bootstrap failed: ${response.status}`);
      const payload = await response.json() as {
        records?: {
          opportunities?: Opportunity[];
          companies?: Company[];
          people?: Person[];
          tasks?: Task[];
          activities?: Activity[];
        };
      };
      if (!payload.records) return false;
      setOpportunities(ensureUniqueIds(payload.records.opportunities || [], 'opp'));
      setCompanies(payload.records.companies || []);
      setPeople(payload.records.people || []);
      setTasks(payload.records.tasks || []);
      setActivities(payload.records.activities || []);
      setIsCrmRemoteReady(true);
      return true;
    } catch (error) {
      console.warn('Persistent CRM refresh unavailable:', error);
      return false;
    }
  }, [isAuthReady, isAuthenticated, currentUser]);

  const syncClerkAuth = useCallback((identity: { id: string; email: string; name: string; avatar?: string | null } | null) => {
    if (!identity) {
      if (demoSessionRef.current) {
        setIsAuthenticated(true);
        setIsAuthReady(true);
        return;
      }
      setIsAuthenticated(false);
      setIsAuthReady(true);
      setIsCrmRemoteReady(false);
      return;
    }

    demoSessionRef.current = false;
    const identityEmail = typeof identity.email === 'string' ? identity.email.trim() : '';
    const matchingUser = users.find(
      (user) =>
        typeof user?.email === 'string' &&
        user.email.toLowerCase() === identityEmail.toLowerCase(),
    );

    const formatDisplayName = (rawName?: string, rawEmail?: string): string => {
      if (rawName && rawName.trim()) {
        return rawName.trim();
      }
      if (rawEmail && rawEmail.includes('@')) {
        const handle = rawEmail.split('@')[0];
        return handle
          .split(/[._-]/)
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
      }
      return 'Usuario Clientum';
    };

    const computedName = formatDisplayName(identity.name, identityEmail);
    const computedAvatar =
      identity.avatar ||
      matchingUser?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(computedName)}&background=2563eb&color=fff`;

    const restoredUser: User = {
      id: identity.id,
      email: identityEmail || matchingUser?.email || 'usuario@clientum.com.ar',
      name: computedName,
      role: matchingUser?.role || 'Administrador',
      avatar: computedAvatar,
    };

    setCurrentUser(restoredUser);
    try {
      localStorage.setItem('clientum_crm_current_user', JSON.stringify(restoredUser));
    } catch {
      // Storage can be disabled by the browser; the in-memory session remains valid.
    }
    setIsAuthenticated(true);
    setIsAuthReady(true);
  }, [users]);

  // Centralized Firebase Authentication listener to avoid duplicate state synchronizations
  useEffect(() => {
    let lastUserId: string | null | undefined = undefined;

    const unsubscribe = subscribeToAuthState((fbUser) => {
      try {
        const userId = fbUser?.uid || null;

        if (lastUserId === userId && lastUserId !== undefined) {
          return;
        }
        const previousUserId = lastUserId;
        lastUserId = userId;

        if (fbUser) {
          Promise.resolve(
            syncUserProfileToFirestore({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName,
              photoURL: fbUser.photoURL,
              providerId: fbUser.providerData?.[0]?.providerId || 'google.com',
            })
          ).catch((err) => {
            console.warn('Non-fatal error syncing profile to Firestore:', err);
          });
        }

        syncClerkAuth(
          fbUser
            ? {
                id: fbUser.uid,
                email: fbUser.email || '',
                name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario Clientum',
                avatar: fbUser.photoURL || null,
              }
            : null
        );

        if (fbUser && isAuthModalOpen && previousUserId !== fbUser.uid) {
          setIsAuthModalOpen(false);
          setIsPublicSiteVisible(false);
          navigateEnvironment('/app');
        }
      } catch (error) {
        console.error('Centralized Firebase Auth error:', error);
        syncClerkAuth(null);
        lastUserId = null;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthModalOpen, syncClerkAuth]);

  // Online / Offline & Background Batching Sync Queue for Module Priority & Workspace State
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      if (offlinePriorityQueue.length > 0 || isSyncPending) {
        setIsSyncPending(true);
        try {
          const latestOrder = offlinePriorityQueue[offlinePriorityQueue.length - 1];
          if (latestOrder && isAuthenticated && currentUser.id) {
            await syncWorkspaceToFirestore(currentUser.id, {
              opportunities,
              companies,
              people,
              tasks,
              activities,
            });
          }
          setOfflinePriorityQueue([]);
          setIsSyncPending(false);
          showToast('🟢 Conexión restablecida: Cola de prioridad de módulos sincronizada con Firebase', 'success');
        } catch (err) {
          console.error('Batch sync priority queue failed:', err);
          setIsSyncPending(false);
        }
      } else {
        setIsSyncPending(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsSyncPending(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlinePriorityQueue, isSyncPending, isAuthenticated, currentUser, opportunities, companies, people, tasks, activities]);

  // PostgreSQL is the source of truth for the core CRM entities. The local
  // state remains as an offline/demo fallback while the authenticated
  // workspace is being hydrated.
  useEffect(() => {
    let cancelled = false;

    if (!isAuthReady || !isAuthenticated || !currentUser.id) {
      setIsCrmRemoteReady(false);
      return () => {
        cancelled = true;
      };
    }

    setIsCrmRemoteReady(false);
    const unsubs: Array<() => void> = [];

    void (async () => {
      try {
        // 1. Seed subcollections if empty so user has their data in individual documents in Firestore
        await seedUserSubcollectionsIfEmpty(currentUser.id, {
          opportunities,
          companies,
          people,
          tasks,
          activities,
        });

        if (cancelled) return;

        // 2. Attach real-time subcollection listeners (multi-device, instantaneous)
        const unsubOpp = subscribeToUserSubcollection<Opportunity>(
          currentUser.id,
          'opportunities',
          (items) => {
            if (items && items.length > 0) {
              setOpportunities(ensureUniqueIds(items, 'opp'));
            }
          }
        );
        const unsubComp = subscribeToUserSubcollection<Company>(
          currentUser.id,
          'companies',
          (items) => {
            if (items && items.length > 0) {
              setCompanies(items);
            }
          }
        );
        const unsubPeople = subscribeToUserSubcollection<Person>(
          currentUser.id,
          'people',
          (items) => {
            if (items && items.length > 0) {
              setPeople(items);
            }
          }
        );
        const unsubTasks = subscribeToUserSubcollection<Task>(
          currentUser.id,
          'tasks',
          (items) => {
            if (items && items.length > 0) {
              setTasks(items);
            }
          }
        );
        const unsubActivities = subscribeToUserSubcollection<Activity>(
          currentUser.id,
          'activities',
          (items) => {
            if (items && items.length > 0) {
              setActivities(items);
            }
          }
        );

        unsubs.push(unsubOpp, unsubComp, unsubPeople, unsubTasks, unsubActivities);

        // Fallback bootstrap check for legacy data
        try {
          const response = await fetch('/api/crm/bootstrap', {
            headers: await getClientumAuthJsonHeaders(currentUser),
          });
          if (response.ok) {
            const payload = await response.json() as {
              count?: number;
              records?: {
                opportunities?: Opportunity[];
                companies?: Company[];
                people?: Person[];
                tasks?: Task[];
                activities?: Activity[];
              };
            };
            if (payload.count && payload.records) {
              if (payload.records.opportunities?.length) setOpportunities(ensureUniqueIds(payload.records.opportunities, 'opp'));
              if (payload.records.companies?.length) setCompanies(payload.records.companies);
              if (payload.records.people?.length) setPeople(payload.records.people);
              if (payload.records.tasks?.length) setTasks(payload.records.tasks);
              if (payload.records.activities?.length) setActivities(payload.records.activities);
            }
          }
        } catch {
          // Keep Firestore data
        }

        if (!cancelled) setIsCrmRemoteReady(true);
      } catch (error) {
        console.warn('Realtime CRM bootstrap error:', error);
        if (!cancelled) setIsCrmRemoteReady(true);
      }
    })();

    return () => {
      cancelled = true;
      unsubs.forEach((unsub) => unsub());
    };
  }, [currentUser.id, isAuthReady, isAuthenticated]);

  const lastSyncedOpps = useRef<Opportunity[] | null>(null);
  const lastSyncedCompanies = useRef<Company[] | null>(null);
  const lastSyncedPeople = useRef<Person[] | null>(null);
  const lastSyncedTasks = useRef<Task[] | null>(null);
  const lastSyncedActivities = useRef<Activity[] | null>(null);

  // Helper function to perform granular updates to Firestore using 'setDoc' with 'merge: true' targeting specific collections
  const granularSyncToFirestore = useCallback(async (
    userId: string,
    collectionName: 'opportunities' | 'companies' | 'people' | 'tasks' | 'activities',
    items: any[]
  ) => {
    if (!isLiveFirebaseReady || !db || !userId) return;
    try {
      const collectionDocRef = doc(db, 'users', userId, 'collections', collectionName);
      await setDoc(collectionDocRef, {
        items,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      console.warn(`Granular Firestore update failed for ${collectionName}:`, error);
    }
  }, []);

  // Persist the complete core snapshot after local mutations. Debouncing
  // prevents a compound action (deal + activity + audit) from issuing a
  // request for every individual state update.
  const crmPersistTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!isCrmRemoteReady || !isAuthenticated || !currentUser.id) {
      lastSyncedOpps.current = null;
      lastSyncedCompanies.current = null;
      lastSyncedPeople.current = null;
      lastSyncedTasks.current = null;
      lastSyncedActivities.current = null;
      return;
    }

    // Initialize refs on first load so we don't sync right away if no changes have occurred
    if (lastSyncedOpps.current === null) {
      lastSyncedOpps.current = opportunities;
      lastSyncedCompanies.current = companies;
      lastSyncedPeople.current = people;
      lastSyncedTasks.current = tasks;
      lastSyncedActivities.current = activities;
      return;
    }

    const changedFields: Record<string, any> = {};
    if (opportunities !== lastSyncedOpps.current) {
      changedFields.opportunities = opportunities;
    }
    if (companies !== lastSyncedCompanies.current) {
      changedFields.companies = companies;
    }
    if (people !== lastSyncedPeople.current) {
      changedFields.people = people;
    }
    if (tasks !== lastSyncedTasks.current) {
      changedFields.tasks = tasks;
    }
    if (activities !== lastSyncedActivities.current) {
      changedFields.activities = activities;
    }

    // If nothing changed, skip
    if (Object.keys(changedFields).length === 0) {
      return;
    }

    if (crmPersistTimer.current !== null) {
      window.clearTimeout(crmPersistTimer.current);
    }
    crmPersistTimer.current = window.setTimeout(() => {
      void (async () => {
        try {
          // Sync ONLY the changed fields directly to Firestore with { merge: true }
          for (const key of Object.keys(changedFields)) {
            if (['opportunities', 'companies', 'people', 'tasks', 'activities'].includes(key)) {
              await granularSyncToFirestore(
                currentUser.id,
                key as any,
                changedFields[key]
              );
            }
          }

          // Update tracking refs to match current values
          if (changedFields.opportunities) lastSyncedOpps.current = changedFields.opportunities;
          if (changedFields.companies) lastSyncedCompanies.current = changedFields.companies;
          if (changedFields.people) lastSyncedPeople.current = changedFields.people;
          if (changedFields.tasks) lastSyncedTasks.current = changedFields.tasks;
          if (changedFields.activities) lastSyncedActivities.current = changedFields.activities;

          // Send ONLY the changed arrays to PostgreSQL
          await fetch('/api/crm/bootstrap', {
            method: 'PUT',
            headers: await getClientumAuthJsonHeaders(currentUser),
            body: JSON.stringify(changedFields),
          });
        } catch (error) {
          console.warn('Persistent CRM snapshot save failed:', error);
        }
      })();
    }, 500);

    return () => {
      if (crmPersistTimer.current !== null) {
        window.clearTimeout(crmPersistTimer.current);
        crmPersistTimer.current = null;
      }
    };
  }, [
    activities,
    companies,
    currentUser.id,
    currentUser.role,
    currentUser.name,
    currentUser.email,
    isAuthenticated,
    isCrmRemoteReady,
    opportunities,
    people,
    tasks,
  ]);

  // Webmail Cloudflare D1 Emails State
  const [webmailEmails, setWebmailEmails] = useState<WebmailEmail[]>(() => {
    try {
      const saved = localStorage.getItem('clientum_crm_webmail_emails');
      return saved ? JSON.parse(saved) : INITIAL_WEBMAIL_EMAILS;
    } catch (e) {
      return INITIAL_WEBMAIL_EMAILS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('clientum_crm_webmail_emails', JSON.stringify(webmailEmails));
    } catch (e) {
      console.error('Failed to save webmail emails to localStorage', e);
    }
  }, [webmailEmails]);

  const [isComposeEmailModalOpen, setIsComposeEmailModalOpen] = useState(false);
  const [composeEmailDefaults, setComposeEmailDefaults] = useState<Partial<WebmailEmail> | null>(null);

  const openComposeEmailModal = useCallback((defaults?: Partial<WebmailEmail>) => {
    setComposeEmailDefaults(defaults || null);
    setIsComposeEmailModalOpen(true);
  }, []);

  const closeComposeEmailModal = useCallback(() => {
    setIsComposeEmailModalOpen(false);
    setComposeEmailDefaults(null);
  }, []);

  const enterApp = useCallback((force = false) => {
    if (!isAuthenticated && !force) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsPublicSiteVisible(false);
    setActiveTab('dashboard');
    navigateEnvironment('/app');
    try {
      sessionStorage.setItem('clientum_view_mode', 'app');
    } catch (e) {}
  }, [isAuthenticated]);

  const openPublicSite = useCallback(() => {
    setIsPublicSiteVisible(true);
    navigateEnvironment('/');
    try {
      sessionStorage.setItem('clientum_view_mode', 'public');
    } catch (e) {}
  }, []);
  const exitToPublicSite = openPublicSite;

  const updateCurrentUser = useCallback((updates: Partial<User>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('clientum_crm_current_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const login = useCallback((email: string, _pass?: string) => {
    demoSessionRef.current = true;
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const handle = email.split('@')[0];
    const formattedName = handle
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ') || 'Usuario Clientum';

    const userToSet: User = found || {
      id: 'usr-' + Date.now(),
      name: formattedName,
      email,
      role: 'Administrador',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=2563eb&color=fff`,
    };
    setCurrentUser(userToSet);
    
    try {
      localStorage.setItem('clientum_crm_current_user', JSON.stringify(userToSet));
      sessionStorage.setItem('clientum_is_authenticated', 'true');
      localStorage.setItem('clientum_is_authenticated', 'true');
      sessionStorage.setItem('clientum_view_mode', 'app');
    } catch (error) {
      console.warn('Storage access denied', error);
    }

    setIsAuthenticated(true);
    setIsAuthReady(true);
    setActiveTab('dashboard');
    setIsAuthModalOpen(false);
    setIsPublicSiteVisible(false);
    navigateEnvironment('/app');
  }, [users]);

  const register = useCallback((name: string, email: string, _pass?: string, _company?: string) => {
    const userDisplayName = name.trim() || 'Usuario Clientum';
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: userDisplayName,
      email,
      role: 'Administrador',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&background=2563eb&color=fff`,
    };
    setCurrentUser(newUser);

    try {
      localStorage.setItem('clientum_crm_current_user', JSON.stringify(newUser));
      sessionStorage.setItem('clientum_is_authenticated', 'true');
      localStorage.setItem('clientum_is_authenticated', 'true');
      sessionStorage.setItem('clientum_view_mode', 'app');
    } catch (error) {
      console.warn('Storage access denied', error);
    }

    startFreeTrial('professional');

    setIsAuthenticated(true);
    setActiveTab('dashboard');
    setIsAuthModalOpen(false);
    setIsPublicSiteVisible(false);
    navigateEnvironment('/app');
  }, [startFreeTrial]);

  const logout = useCallback(() => {
    demoSessionRef.current = false;
    void firebaseSignOut();
    setIsAuthenticated(false);
    setGmailAccessToken(null);
    try {
      sessionStorage.removeItem('clientum_is_authenticated');
      localStorage.removeItem('clientum_is_authenticated');
      localStorage.removeItem('clientum_crm_current_user');
      sessionStorage.setItem('clientum_view_mode', 'public');
    } catch (error) {
      console.warn('Storage access denied', error);
    }
    setIsAuthModalOpen(false);
    setIsPublicSiteVisible(true);
  }, []);

  const resetPassword = useCallback((email: string) => {
    // Record password recovery simulation in logs
    console.log(`Password reset link dispatched for ClientumCRM account: ${email}`);
  }, []);
  
  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('clientum_crm_custom_objects', JSON.stringify(customObjects));
  }, [customObjects]);

  useEffect(() => {
    localStorage.setItem('clientum_crm_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('clientum_crm_saved_views', JSON.stringify(savedViews));
  }, [savedViews]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K (case-insensitive & cross-platform)
      const isCmdOrCtrlK =
        (e.metaKey || e.ctrlKey) &&
        (e.key === 'k' || e.key === 'K' || e.code === 'KeyK');

      if (isCmdOrCtrlK) {
        e.preventDefault();
        e.stopPropagation();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // 'c' to create new record when not typing in an editable field
      if (
        (e.key === 'c' || e.key === 'C') &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) &&
        !(e.target as HTMLElement)?.isContentEditable &&
        !isCommandPaletteOpen &&
        !isNewRecordModalOpen &&
        !isAICopilotModalOpen
      ) {
        e.preventDefault();
        openNewRecordModal();
        return;
      }

      // Escape closes open modals
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        } else if (isNewRecordModalOpen) {
          setIsNewRecordModalOpen(false);
        } else if (isAICopilotModalOpen) {
          setIsAICopilotModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isCommandPaletteOpen, isNewRecordModalOpen, isAICopilotModalOpen]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  showToastRef.current = showToast;

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'],
      });
    } catch {
      // fallback if canvas not available
    }
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState(initialFilter);
  }, []);

  const openNewRecordModal = useCallback((type: 'opportunity' | 'company' | 'person' | 'task' = 'opportunity') => {
    setNewRecordType(type);
    setIsNewRecordModalOpen(true);
  }, []);

  const openAICopilot = useCallback((context?: { type?: string; id?: string; name?: string; initialPrompt?: string }) => {
    setAICopilotContext(context || null);
    setIsAICopilotModalOpen(true);
  }, []);

  // Tracking refs for stable callback closures
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  const opportunitiesRef = useRef(opportunities);
  opportunitiesRef.current = opportunities;

  const companiesRef = useRef(companies);
  companiesRef.current = companies;

  const peopleRef = useRef(people);
  peopleRef.current = people;

  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const selectedRecordRef = useRef(selectedRecord);
  selectedRecordRef.current = selectedRecord;

  const invoicesRef = useRef(invoices);
  invoicesRef.current = invoices;

  const inventoryRef = useRef(inventory);
  inventoryRef.current = inventory;

  const expensesRef = useRef(expenses);
  expensesRef.current = expenses;

  const sendSlackTestMessageRef = useRef<((channel?: string, eventType?: string) => Promise<boolean>) | null>(null);
  const enrichContactRef = useRef<((personId: string, manualTrigger?: boolean) => Promise<boolean>) | null>(null);

  // RBAC Role Resolution
  const currentRole: RoleDefinition = React.useMemo(() => {
    const userRoleStr = (currentUser.role || '').toLowerCase();
    const found = roles.find(
      (r) =>
        r.name.toLowerCase() === userRoleStr ||
        r.slug.toLowerCase() === userRoleStr ||
        (userRoleStr.includes('admin') && r.slug === 'admin') ||
        (userRoleStr.includes('manager') && r.slug === 'sales_manager') ||
        (userRoleStr.includes('ejecutiv') && r.slug === 'sales_rep') ||
        (userRoleStr.includes('audit') && r.slug === 'auditor') ||
        (userRoleStr.includes('sdr') && r.slug === 'sdr')
    );
    return found || roles[0] || INITIAL_ROLES[0];
  }, [currentUser.role, roles]);

  const currentRoleRef = useRef(currentRole);
  currentRoleRef.current = currentRole;

  // Audit Logging
  const logAuditEvent = useCallback((
    entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'> & {
      ipAddress?: string;
      userAgent?: string;
    }
  ) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      ipAddress: entry.ipAddress || '181.46.139.84',
      userAgent: entry.userAgent || navigator.userAgent || 'Clientum-Web/1.0',
      location: entry.location || 'Buenos Aires, Argentina',
    };

    setAuditLogs((prev) => {
      const updatedLogs = [newLog, ...prev].slice(0, 500); // keep last 500 logs
      // Check for security anomalies
      const detected = scanAuditLogsForAnomalies(updatedLogs);
      if (detected.length > 0) {
        setSecurityAnomalies((prevAnoms) => {
          const newAnoms = detected.filter(
            (d) => !prevAnoms.some((p) => p.title === d.title && p.status === 'active')
          );
          if (newAnoms.length > 0) {
            showToast(`⚠️ Alerta de Seguridad: ${newAnoms[0].title}`, 'warning');
          }
          return [...newAnoms, ...prevAnoms];
        });
      }
      return updatedLogs;
    });
  }, [showToast]);

  const hasPermission = useCallback((resource: PermissionResource, action: PermissionAction): boolean => {
    return checkRoleHasPermission(currentRoleRef.current, resource, action);
  }, []);

  const checkPermissionOrWarn = useCallback((
    resource: PermissionResource,
    action: PermissionAction,
    resourceLabel?: string
  ): boolean => {
    const role = currentRoleRef.current;
    const allowed = checkRoleHasPermission(role, resource, action);
    if (!allowed) {
      const actionNames: Record<PermissionAction, string> = {
        view: 'ver',
        create: 'crear',
        edit: 'editar',
        delete: 'eliminar',
        export: 'exportar',
        manage: 'administrar',
      };
      const label = resourceLabel || resource;
      showToast(
        `Acceso Restringido: Tu rol "${role.name}" no tiene permisos para ${actionNames[action]} ${label}.`,
        'warning'
      );
      const user = currentUserRef.current;
      logAuditEvent({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: role.name,
        action: 'security.permission_denied',
        actionLabel: 'Intento de Acción Denegada por RBAC',
        entityType: resource,
        details: `Intento de ${actionNames[action]} en ${label} denegado para el rol ${role.name}.`,
        severity: 'warning',
        status: 'denied',
      });
      return false;
    }
    return true;
  }, [showToast, logAuditEvent]);

  // CRUD Activity (available to all entities)
  const addActivity = useCallback((data: Omit<Activity, 'id' | 'createdAt'>): Activity => {
    const newAct: Activity = {
      ...data,
      id: 'act-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);

    const user = currentUserRef.current;
    if (user.id) {
      void saveUserSubcollectionRecord(user.id, 'activities', newAct.id, newAct);
    }

    return newAct;
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));

    const user = currentUserRef.current;
    if (user.id) {
      void deleteUserSubcollectionRecord(user.id, 'activities', id);
    }
  }, []);

  // --- CRUD OPPORTUNITY ---
  const addOpportunity = useCallback((data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Opportunity => {
    const stageConf = STAGES.find((s) => s.id === data.stage);
    const newOpp: Opportunity = {
      ...data,
      id: `opp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      probability: data.probability ?? stageConf?.probability ?? 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOpportunities((prev) => [newOpp, ...prev]);

    const user = currentUserRef.current;
    // Add activity
    addActivity({
      type: 'stage_change',
      title: 'Created Opportunity',
      content: `${user.name} created opportunity "${newOpp.name}" ($${newOpp.amount.toLocaleString()})`,
      author: user.name,
      targetType: 'opportunity',
      targetId: newOpp.id,
      meta: { toStage: newOpp.stage },
    });

    // Real-time Firestore write
    if (user.id) {
      void saveUserSubcollectionRecord(user.id, 'opportunities', newOpp.id, newOpp);
    }

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'deal.create',
      actionLabel: 'Creación de Oportunidad Comercial',
      entityType: 'opportunities',
      entityId: newOpp.id,
      entityName: `${newOpp.name} ($${newOpp.amount.toLocaleString()} ${newOpp.currency})`,
      details: `Oportunidad creada por ${user.name} con monto de $${newOpp.amount.toLocaleString()} y asignada a ${newOpp.assignedTo}.`,
      severity: 'info',
      status: 'success',
    });

    showToast(`Opportunity "${newOpp.name}" created`, 'success');
    return newOpp;
  }, [addActivity, logAuditEvent, showToast]);

  const updateOpportunity = useCallback((id: string, updates: Partial<Opportunity>) => {
    const opp = opportunitiesRef.current.find((o) => o.id === id);
    let updatedOpp: Opportunity | null = null;
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updated = { ...o, ...updates, updatedAt: new Date().toISOString() };
          updatedOpp = updated;
          return updated;
        }
        return o;
      })
    );

    const user = currentUserRef.current;
    if (user.id && updatedOpp) {
      void saveUserSubcollectionRecord(user.id, 'opportunities', id, updatedOpp);
    }

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'deal.update',
      actionLabel: 'Actualización de Oportunidad',
      entityType: 'opportunities',
      entityId: id,
      entityName: opp?.name || id,
      details: `Oportunidad "${opp?.name || id}" modificada por ${user.name}. Campos: ${Object.keys(updates).join(', ')}.`,
      severity: 'info',
      status: 'success',
    });

    showToast('Opportunity updated', 'info');
  }, [logAuditEvent, showToast]);

  const deleteOpportunity = useCallback((id: string) => {
    const opp = opportunitiesRef.current.find((o) => o.id === id);
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    if (selectedRecordRef.current?.id === id) {
      setSelectedRecord(null);
    }

    const user = currentUserRef.current;
    if (user.id) {
      void deleteUserSubcollectionRecord(user.id, 'opportunities', id);
    }

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'deal.delete',
      actionLabel: 'Eliminación de Oportunidad',
      entityType: 'opportunities',
      entityId: id,
      entityName: opp ? `${opp.name} ($${opp.amount.toLocaleString()})` : id,
      details: `La oportunidad "${opp?.name || id}" fue eliminada del pipeline por ${user.name}.`,
      severity: 'warning',
      status: 'success',
    });

    showToast(`Opportunity "${opp?.name || id}" removed`, 'info');
  }, [logAuditEvent, showToast]);

  const moveOpportunityStage = useCallback((id: string, newStage: StageId) => {
    const opp = opportunitiesRef.current.find((o) => o.id === id);
    if (!opp || opp.stage === newStage) return;

    const oldStage = opp.stage;
    const stageConf = STAGES.find((s) => s.id === newStage);

    let movedOpp: Opportunity | null = null;
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          movedOpp = {
            ...o,
            stage: newStage,
            probability: stageConf?.probability ?? o.probability,
            updatedAt: new Date().toISOString(),
          };
          return movedOpp;
        }
        return o;
      })
    );

    const user = currentUserRef.current;
    if (user.id && movedOpp) {
      void saveUserSubcollectionRecord(user.id, 'opportunities', id, movedOpp);
    }

    // Record activity
    addActivity({
      type: 'stage_change',
      title: `Moved to ${stageConf?.name || newStage}`,
      content: `${user.name} moved deal from ${oldStage} to ${newStage}`,
      author: user.name,
      targetType: 'opportunity',
      targetId: id,
      meta: { fromStage: oldStage, toStage: newStage },
    });

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'deal.stage_change',
      actionLabel: `Avance de Deal a ${stageConf?.name || newStage}`,
      entityType: 'opportunities',
      entityId: id,
      entityName: opp.name,
      details: `Etapa cambiada de "${oldStage}" a "${newStage}" ($${opp.amount.toLocaleString()}).`,
      diff: [{ field: 'stage', oldValue: oldStage, newValue: newStage }],
      severity: 'info',
      status: 'success',
    });

    if (newStage === 'won') {
      triggerConfetti();
      showToast(`🎉 Deal Won! $${opp.amount.toLocaleString()} - ${opp.name}`, 'success');
      // Trigger Slack deal won simulation
      sendSlackTestMessageRef.current?.(undefined, 'deal_won');
    } else {
      showToast(`Deal moved to ${stageConf?.name}`, 'info');
    }
  }, [addActivity, logAuditEvent, showToast, triggerConfetti]);

  // --- CRUD COMPANY ---
  const addCompany = useCallback((data: Omit<Company, 'id' | 'createdAt'>): Company => {
    const newComp: Company = {
      ...data,
      id: 'c-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCompanies((prev) => [newComp, ...prev]);

    const user = currentUserRef.current;
    if (user.id) {
      void saveUserSubcollectionRecord(user.id, 'companies', newComp.id, newComp);
    }

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'company.create',
      actionLabel: 'Creación de Empresa',
      entityType: 'companies',
      entityId: newComp.id,
      entityName: newComp.name,
      details: `Empresa "${newComp.name}" (${newComp.industry || 'General'}) creada en la base de datos.`,
      severity: 'info',
      status: 'success',
    });

    showToast(`Company "${newComp.name}" added`, 'success');
    return newComp;
  }, [logAuditEvent, showToast]);

  const updateCompany = useCallback((id: string, updates: Partial<Company>) => {
    const comp = companiesRef.current.find((c) => c.id === id);
    let updatedComp: Company | null = null;
    setCompanies((prev) => prev.map((c) => {
      if (c.id === id) {
        updatedComp = { ...c, ...updates };
        return updatedComp;
      }
      return c;
    }));

    const user = currentUserRef.current;
    if (user.id && updatedComp) {
      void saveUserSubcollectionRecord(user.id, 'companies', id, updatedComp);
    }

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'company.update',
      actionLabel: 'Actualización de Empresa',
      entityType: 'companies',
      entityId: id,
      entityName: comp?.name || id,
      details: `Registro de empresa "${comp?.name || id}" editado por ${user.name}.`,
      severity: 'info',
      status: 'success',
    });

    showToast('Company updated', 'info');
  }, [logAuditEvent, showToast]);

  const deleteCompany = useCallback((id: string) => {
    const comp = companiesRef.current.find((c) => c.id === id);
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    if (selectedRecordRef.current?.id === id) {
      setSelectedRecord(null);
    }

    const user = currentUserRef.current;
    if (user.id) {
      void deleteUserSubcollectionRecord(user.id, 'companies', id);
    }

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'company.delete',
      actionLabel: 'Eliminación de Empresa',
      entityType: 'companies',
      entityId: id,
      entityName: comp?.name || id,
      details: `Empresa "${comp?.name || id}" eliminada de la plataforma por ${user.name}.`,
      severity: 'warning',
      status: 'success',
    });

    showToast(`Company "${comp?.name || id}" removed`, 'info');
  }, [logAuditEvent, showToast]);

  // --- CRUD PERSON ---
  const updatePerson = useCallback((id: string, updates: Partial<Person>, silent = false) => {
    const person = peopleRef.current.find((p) => p.id === id);
    let updatedPerson: Person | null = null;
    setPeople((prev) => prev.map((p) => {
      if (p.id === id) {
        updatedPerson = { ...p, ...updates };
        return updatedPerson;
      }
      return p;
    }));

    const user = currentUserRef.current;
    if (user.id && updatedPerson) {
      void saveUserSubcollectionRecord(user.id, 'people', id, updatedPerson);
    }

    if (!silent) {
      logAuditEvent({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        action: 'person.update',
        actionLabel: 'Actualización de Contacto',
        entityType: 'people',
        entityId: id,
        entityName: person ? `${person.firstName} ${person.lastName}` : id,
        details: `Datos del contacto ${person?.firstName || ''} ${person?.lastName || ''} actualizados.`,
        severity: 'info',
        status: 'success',
      });

      showToast('Contact updated', 'info');
    }
  }, [logAuditEvent, showToast]);

  const enrichContact = useCallback(async (personId: string, manualTrigger = false): Promise<boolean> => {
    const target = peopleRef.current.find((p) => p.id === personId);
    if (!target) return false;

    updatePerson(personId, { enrichmentStatus: 'enriching' }, true);
    if (manualTrigger) {
      showToast(`Buscando inteligencia profesional para ${target.firstName}...`, 'info');
    }

    try {
      const response = await fetch('/api/contacts/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personId: target.id,
          firstName: target.firstName,
          lastName: target.lastName,
          email: target.email,
          phone: target.phone,
          jobTitle: target.jobTitle,
          companyName: target.companyName,
          city: target.city,
          country: target.country,
          linkedin: target.linkedin,
          notes: target.notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Enrichment service responded with ${response.status}`);
      }

      const data = await response.json();
      if (data && data.enrichment) {
        const enriched = data.enrichment;
        const updates: Partial<Person> = {
          enrichmentStatus: 'enriched',
          enrichmentData: enriched,
        };

        if (!target.linkedin && enriched.socialProfiles?.linkedin) {
          updates.linkedin = enriched.socialProfiles.linkedin;
        }

        updatePerson(personId, updates, true);

        const user = currentUserRef.current;
        logAuditEvent({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
          action: 'person.update',
          actionLabel: 'Contacto Enriquecido con IA',
          entityType: 'people',
          entityId: target.id,
          entityName: `${target.firstName} ${target.lastName}`,
          details: `Enriquecimiento profesional completado (${enriched.seniority || 'Profesional'} - ${enriched.industry || 'B2B'}). Confianza: ${enriched.confidenceScore || 88}%.`,
          severity: 'info',
          status: 'success',
        });

        showToast(`✨ Contacto enriquecido: ${target.firstName} ${target.lastName} (${enriched.seniority || 'Profesional'})`, 'success');
        return true;
      } else {
        updatePerson(personId, { enrichmentStatus: 'failed' }, true);
        return false;
      }
    } catch (err) {
      console.warn('Contact enrichment background task error:', err);
      updatePerson(personId, { enrichmentStatus: 'failed' }, true);
      if (manualTrigger) {
        showToast(`No se pudo enriquecer el perfil de ${target.firstName}`, 'error');
      }
      return false;
    }
  }, [logAuditEvent, showToast, updatePerson]);

  enrichContactRef.current = enrichContact;

  const addPerson = useCallback((data: Omit<Person, 'id' | 'createdAt' | 'lastActivityDate'>): Person => {
    const newPerson: Person = {
      ...data,
      id: 'p-' + Date.now(),
      createdAt: new Date().toISOString(),
      lastActivityDate: new Date().toISOString(),
    };
    setPeople((prev) => [newPerson, ...prev]);

    const user = currentUserRef.current;
    if (user.id) {
      void saveUserSubcollectionRecord(user.id, 'people', newPerson.id, newPerson);
    }

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'person.create',
      actionLabel: 'Nuevo Contacto Registrado',
      entityType: 'people',
      entityId: newPerson.id,
      entityName: `${newPerson.firstName} ${newPerson.lastName}`,
      details: `Contacto ${newPerson.firstName} ${newPerson.lastName} (${newPerson.email || 'Sin email'}) añadido.`,
      severity: 'info',
      status: 'success',
    });

    showToast(`Contact "${newPerson.firstName} ${newPerson.lastName}" created`, 'success');

    // Auto-trigger background contact enrichment utility when a new lead/contact is added
    setTimeout(() => {
      void enrichContactRef.current?.(newPerson.id, false);
    }, 300);

    return newPerson;
  }, [logAuditEvent, showToast]);

  const deletePerson = useCallback((id: string) => {
    const person = peopleRef.current.find((p) => p.id === id);
    setPeople((prev) => prev.filter((p) => p.id !== id));
    if (selectedRecordRef.current?.id === id) {
      setSelectedRecord(null);
    }

    const user = currentUserRef.current;
    if (user.id) {
      void deleteUserSubcollectionRecord(user.id, 'people', id);
    }

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'person.delete',
      actionLabel: 'Eliminación de Contacto',
      entityType: 'people',
      entityId: id,
      entityName: person ? `${person.firstName} ${person.lastName}` : id,
      details: `Contacto ${person?.firstName || ''} ${person?.lastName || ''} eliminado del sistema.`,
      severity: 'warning',
      status: 'success',
    });

    showToast(`Contact "${person?.firstName} ${person?.lastName}" removed`, 'info');
  }, [logAuditEvent, showToast]);

  // --- CRUD TASK ---
  const addTask = useCallback((data: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...data,
      id: 't-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);

    const user = currentUserRef.current;
    if (user.id) {
      void saveUserSubcollectionRecord(user.id, 'tasks', newTask.id, newTask);
    }

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'task.create',
      actionLabel: 'Nueva Tarea Creada',
      entityType: 'tasks',
      entityId: newTask.id,
      entityName: newTask.title,
      details: `Tarea "${newTask.title}" asignada a ${newTask.assignedTo} (Vencimiento: ${newTask.dueDate}).`,
      severity: 'info',
      status: 'success',
    });

    showToast(`Task created: "${newTask.title}"`, 'success');
    return newTask;
  }, [logAuditEvent, showToast]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    let updatedTask: Task | null = null;
    setTasks((prev) => prev.map((t) => {
      if (t.id === id) {
        updatedTask = { ...t, ...updates };
        return updatedTask;
      }
      return t;
    }));

    const user = currentUserRef.current;
    if (user.id && updatedTask) {
      void saveUserSubcollectionRecord(user.id, 'tasks', id, updatedTask);
    }

    showToast('Task updated', 'info');
  }, [showToast]);

  const deleteTask = useCallback((id: string) => {
    const task = tasksRef.current.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedRecordRef.current?.id === id) {
      setSelectedRecord(null);
    }

    const user = currentUserRef.current;
    if (user.id) {
      void deleteUserSubcollectionRecord(user.id, 'tasks', id);
    }

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'task.delete',
      actionLabel: 'Eliminación de Tarea',
      entityType: 'tasks',
      entityId: id,
      entityName: task?.title || id,
      details: `Tarea "${task?.title || id}" eliminada por ${user.name}.`,
      severity: 'info',
      status: 'success',
    });

    showToast('Task deleted', 'info');
  }, [logAuditEvent, showToast]);

  const toggleTaskStatus = useCallback((id: string) => {
    let toggledTask: Task | null = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isDone = t.status === 'Completed';
          const newStatus = isDone ? 'Todo' : 'Completed';
          toggledTask = {
            ...t,
            status: newStatus,
            completedAt: isDone ? undefined : new Date().toISOString(),
          };
          return toggledTask;
        }
        return t;
      })
    );

    const user = currentUserRef.current;
    if (user.id && toggledTask) {
      void saveUserSubcollectionRecord(user.id, 'tasks', id, toggledTask);
    }
  }, []);

  // --- CLIENTUM CUSTOM OBJECTS STUDIO ---
  const addCustomObject = useCallback((data: Omit<CustomObjectDefinition, 'id' | 'createdAt' | 'fields' | 'records'>): CustomObjectDefinition => {
    const newObj: CustomObjectDefinition = {
      ...data,
      id: 'obj-' + Date.now(),
      createdAt: new Date().toISOString(),
      fields: [
        { id: 'f-name', name: 'name', label: `${data.singularName} Name`, type: 'text', required: true }
      ],
      records: [],
    };
    setCustomObjects((prev) => [...prev, newObj]);
    showToast(`Custom Object "${newObj.pluralName}" created`, 'success');
    return newObj;
  }, [showToast]);

  const addCustomFieldToObject = useCallback((objectId: string, fieldData: Omit<CustomObjectField, 'id'>) => {
    const newField: CustomObjectField = {
      ...fieldData,
      id: 'f-' + Date.now(),
    };
    setCustomObjects((prev) =>
      prev.map((obj) => {
        if (obj.id === objectId) {
          return { ...obj, fields: [...obj.fields, newField] };
        }
        return obj;
      })
    );
    showToast(`Added field "${newField.label}" to object schema`, 'info');
  }, [showToast]);

  const addRecordToCustomObject = useCallback((objectId: string, recordData: Record<string, any>) => {
    const newRecord = {
      id: 'rec-' + Date.now(),
      createdAt: new Date().toISOString(),
      ...recordData,
    };
    setCustomObjects((prev) =>
      prev.map((obj) => {
        if (obj.id === objectId) {
          return { ...obj, records: [newRecord, ...obj.records] };
        }
        return obj;
      })
    );
    showToast('Record added to Custom Object', 'success');
  }, [showToast]);

  const deleteRecordFromCustomObject = useCallback((objectId: string, recordId: string) => {
    setCustomObjects((prev) =>
      prev.map((obj) => {
        if (obj.id === objectId) {
          return { ...obj, records: obj.records.filter((r) => r.id !== recordId) };
        }
        return obj;
      })
    );
    showToast('Record removed', 'info');
  }, [showToast]);

  // --- CLIENTUM WORKFLOWS ENGINE ---
  const addWorkflow = useCallback((data: Omit<WorkflowRule, 'id' | 'runCount'>): WorkflowRule => {
    const newWf: WorkflowRule = {
      ...data,
      id: 'wf-' + Date.now(),
      runCount: 0,
    };
    setWorkflows((prev) => [newWf, ...prev]);
    showToast(`Workflow "${newWf.name}" active`, 'success');
    return newWf;
  }, [showToast]);

  const updateWorkflow = useCallback((updated: WorkflowRule) => {
    setWorkflows((prev) => prev.map((wf) => (wf.id === updated.id ? updated : wf)));
  }, []);

  const toggleWorkflow = useCallback((id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => (wf.id === id ? { ...wf, isActive: !wf.isActive } : wf))
    );
    showToast('Workflow status toggled', 'info');
  }, [showToast]);

  const deleteWorkflow = useCallback((id: string) => {
    setWorkflows((prev) => prev.filter((wf) => wf.id !== id));
    showToast('Workflow deleted', 'info');
  }, [showToast]);

  // --- SAVED VIEWS ---
  const addSavedView = useCallback((data: Omit<SavedView, 'id'>): SavedView => {
    const newView: SavedView = {
      ...data,
      id: 'sv-' + Date.now(),
    };
    setSavedViews((prev) => [...prev, newView]);
    showToast(`Saved view "${newView.name}" created`, 'success');
    return newView;
  }, [showToast]);

  const deleteSavedView = useCallback((id: string) => {
    setSavedViews((prev) => prev.filter((v) => v.id !== id));
    showToast('Saved view removed', 'info');
  }, [showToast]);

  // --- CSV IMPORT ENGINE ---
  const importCSVData = useCallback((target: 'opportunities' | 'companies' | 'people', items: any[]): number => {
    const user = currentUserRef.current;
    let count = 0;
    let importedRecords: Array<{ id: string; [key: string]: any }> = [];
    if (target === 'opportunities') {
      const newDeals: Opportunity[] = items.map((item, idx) => ({
        id: 'opp-import-' + Date.now() + '-' + idx,
        name: item.name || item.dealName || 'Imported Deal',
        amount: Number(item.amount || item.value) || 10000,
        currency: item.currency || 'USD',
        stage: item.stage || 'lead',
        closeDate: item.closeDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        probability: Number(item.probability) || 50,
        companyName: item.companyName || item.company,
        contactName: item.contactName || item.contact,
        assignedTo: item.assignedTo || user.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: item.priority || 'Medium',
        type: item.type || 'New Business',
        tags: item.tags ? String(item.tags).split(';') : ['CSV Import'],
      }));
      setOpportunities((prev) => [...newDeals, ...prev]);
      importedRecords = newDeals;
      count = newDeals.length;
    } else if (target === 'companies') {
      const newComps: Company[] = items.map((item, idx) => ({
        id: 'c-import-' + Date.now() + '-' + idx,
        name: item.name || item.companyName || 'Imported Company',
        domain: item.domain || 'example.com',
        industry: item.industry || 'Software',
        employees: item.employees || '10-50',
        arr: Number(item.arr) || 50000,
        tier: item.tier || 'Mid-Market',
        healthScore: 85,
        city: item.city || 'Buenos Aires',
        country: item.country || 'Argentina',
        assignedTo: item.assignedTo || user.name,
        createdAt: new Date().toISOString(),
      }));
      setCompanies((prev) => [...newComps, ...prev]);
      importedRecords = newComps;
      count = newComps.length;
    } else if (target === 'people') {
      const newPeople: Person[] = items.map((item, idx) => ({
        id: 'p-import-' + Date.now() + '-' + idx,
        firstName: item.firstName || item.name?.split(' ')[0] || 'Contact',
        lastName: item.lastName || item.name?.split(' ').slice(1).join(' ') || 'Imported',
        email: item.email || 'lead@example.com',
        phone: item.phone || '+54 11 5555-0000',
        jobTitle: item.jobTitle || 'Executive',
        companyName: item.companyName || item.company,
        status: item.status || 'Lead',
        assignedTo: item.assignedTo || user.name,
        createdAt: new Date().toISOString(),
        lastActivityDate: new Date().toISOString(),
      }));
      setPeople((prev) => [...newPeople, ...prev]);
      importedRecords = newPeople;
      count = newPeople.length;
    }

    const batch = {
      id: `import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      target,
      recordIds: importedRecords.map((record) => record.id),
      count,
    };
    setLastImport(batch);
    if (isCrmRemoteReady && isAuthenticated && user.id && importedRecords.length > 0) {
      importBatchPersistenceRef.current = (async () => {
        try {
          const headers = await getClientumAuthJsonHeaders(user);
          const response = await fetch('/api/crm/import-batches', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              id: batch.id,
              entityType: target,
              records: importedRecords,
            }),
          });
          if (!response.ok) throw new Error(`Import batch tracking failed: ${response.status}`);
        } catch (error) {
          console.warn('Import batch tracking unavailable; local undo remains available:', error);
        }
      })();
    }

    triggerConfetti();
    showToast(`Successfully imported ${count} ${target} records!`, 'success');
    return count;
  }, [isAuthenticated, isCrmRemoteReady, showToast, triggerConfetti]);

  const undoLastImport = useCallback(async (): Promise<boolean> => {
    const batch = lastImport;
    if (!batch) return false;

    if (batch.target === 'opportunities') {
      setOpportunities((prev) => prev.filter((record) => !batch.recordIds.includes(record.id)));
    } else if (batch.target === 'companies') {
      setCompanies((prev) => prev.filter((record) => !batch.recordIds.includes(record.id)));
    } else {
      setPeople((prev) => prev.filter((record) => !batch.recordIds.includes(record.id)));
    }

    const user = currentUserRef.current;
    if (isCrmRemoteReady && isAuthenticated && user.id) {
      try {
        await importBatchPersistenceRef.current;
        const headers = await getClientumAuthJsonHeaders(user);
        const response = await fetch(`/api/crm/import-batches/${encodeURIComponent(batch.id)}`, {
          method: 'DELETE',
          headers,
        });
        if (!response.ok && response.status !== 404) {
          console.warn(`Import undo persistence failed: ${response.status}`);
        }
      } catch (error) {
        console.warn('Import undo persistence unavailable; local undo applied:', error);
      }
    }

    importBatchPersistenceRef.current = null;
    setLastImport(null);
    showToast(`Reverted the last import (${batch.count} records)`, 'info');
    return true;
  }, [isAuthenticated, isCrmRemoteReady, lastImport, showToast]);

  // Reset to initial demo
  const resetToDemoData = useCallback(() => {
    setOpportunities(INITIAL_OPPORTUNITIES);
    setCompanies(INITIAL_COMPANIES);
    setPeople(INITIAL_PEOPLE);
    setTasks(INITIAL_TASKS);
    setActivities(INITIAL_ACTIVITIES);
    setInvoices(INITIAL_INVOICES);
    setInventory(INITIAL_INVENTORY);
    setExpenses(INITIAL_EXPENSES);
    localStorage.clear();
    showToast('CRM & ERP workspace reset to demo data', 'success');
  }, [showToast]);

  // Load Clientum leads list from B2B CSV dataset
  const loadClientumLeads = useCallback(() => {
    setOpportunities(CLIENTUM_OPPORTUNITIES);
    setCompanies(CLIENTUM_COMPANIES);
    setPeople(CLIENTUM_PEOPLE);
    setTasks(CLIENTUM_TASKS);
    setActivities(CLIENTUM_ACTIVITIES);
    
    // Save to local storage for persistence
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(CLIENTUM_OPPORTUNITIES));
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(CLIENTUM_COMPANIES));
    localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(CLIENTUM_PEOPLE));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(CLIENTUM_TASKS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(CLIENTUM_ACTIVITIES));
    
    triggerConfetti();
    showToast('¡Base de Datos de Leads de Clientum cargada con éxito! 🇦🇷', 'success');
  }, [showToast, triggerConfetti]);

  // ERP Handlers
  const addInvoice = useCallback((invData: Omit<Invoice, 'id' | 'createdAt'>): Invoice => {
    const count = invoicesRef.current.length + 1;
    const newInv: Invoice = {
      ...invData,
      id: `INV-2026-${String(count).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    setInvoices((prev) => [newInv, ...prev]);
    showToast(`Invoice ${newInv.id} created successfully!`, 'success');
    triggerConfetti();
    return newInv;
  }, [showToast, triggerConfetti]);

  const updateInvoiceStatus = useCallback((id: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
    showToast(`Invoice ${id} status updated to ${status}`, 'info');
  }, [showToast]);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    showToast(`Invoice ${id} removed`, 'info');
  }, [showToast]);

  const addInventoryItem = useCallback((itemData: Omit<InventoryItem, 'id'>): InventoryItem => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
    };
    setInventory((prev) => [newItem, ...prev]);
    if (newItem.stockQuantity <= newItem.reorderLevel) {
      showToast(
        `⚠️ Low Stock Threshold Alert: "${newItem.name}" (${newItem.sku}) added at or below minimum threshold (${newItem.stockQuantity}/${newItem.reorderLevel} units)!`,
        'warning'
      );
    } else {
      showToast(`Inventory item "${newItem.name}" added successfully!`, 'success');
    }
    return newItem;
  }, [showToast]);

  const updateInventoryStock = useCallback((id: string, deltaQuantity: number) => {
    let targetItemName = '';
    let isLowStockAlert = false;
    let alertDetails = '';

    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.stockQuantity + deltaQuantity);
          targetItemName = item.name;
          if (newQty <= item.reorderLevel) {
            isLowStockAlert = true;
            alertDetails = `⚠️ Low Stock Threshold Alert: "${item.name}" (SKU: ${item.sku}) has reached minimum stock threshold (${newQty}/${item.reorderLevel} min units remaining)!`;
          }
          return {
            ...item,
            stockQuantity: newQty,
            lastRestocked: deltaQuantity > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked
          };
        }
        return item;
      })
    );

    if (isLowStockAlert) {
      showToast(alertDetails, 'warning');
    } else {
      showToast(`Stock quantity updated for "${targetItemName}"`, 'info');
    }
  }, [showToast]);

  const deleteInventoryItem = useCallback((id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    showToast(`Inventory item removed`, 'info');
  }, [showToast]);

  const addExpense = useCallback((expData: Omit<ExpenseItem, 'id'>): ExpenseItem => {
    const newExp: ExpenseItem = {
      ...expData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
    showToast(`Expense recorded: $${newExp.amount}`, 'success');
    return newExp;
  }, [showToast]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    showToast(`Expense record deleted`, 'info');
  }, [showToast]);

  // Full Backup of CRM & ERP Data to JSON File
  const exportFullWorkspaceJSON = useCallback(() => {
    const fullBackup = {
      app: 'ClientumCRM & ERP Workspace',
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      user: currentUserRef.current,
      crm: {
        opportunities: opportunitiesRef.current,
        companies: companiesRef.current,
        people: peopleRef.current,
        tasks: tasksRef.current,
        activities,
        customObjects,
        workflows,
        savedViews,
      },
      erp: {
        invoices: invoicesRef.current,
        inventory: inventoryRef.current,
        expenses: expensesRef.current,
      },
      settings: {
        theme,
        language,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `clientum_crm_erp_full_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Full CRM & ERP workspace JSON backup created and downloaded!', 'success');
  }, [activities, customObjects, language, savedViews, showToast, theme, workflows]);

  // Export CSV
  const exportOpportunitiesCSV = useCallback(() => {
    if (!checkRoleHasPermission(currentRoleRef.current, 'opportunities', 'export')) {
      showToast('Acceso Denegado: Tu rol no tiene permisos para exportar oportunidades', 'warning');
      const user = currentUserRef.current;
      logAuditEvent({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        action: 'security.access_denied',
        actionLabel: 'Intento de Exportación No Autorizada',
        entityType: 'opportunities',
        details: `El usuario ${user.name} intentó exportar la base de oportunidades sin permisos requeridos.`,
        severity: 'warning',
        status: 'denied',
      });
      return;
    }

    const currentOpps = opportunitiesRef.current;
    const headers = ['ID', 'Deal Name', 'Amount', 'Currency', 'Stage', 'Close Date', 'Probability', 'Company', 'Contact', 'Owner', 'Priority', 'Type'];
    const rows = currentOpps.map((o) => [
      o.id,
      `"${o.name.replace(/"/g, '""')}"`,
      o.amount,
      o.currency,
      o.stage,
      o.closeDate,
      o.probability + '%',
      `"${(o.companyName || '').replace(/"/g, '""')}"`,
      `"${(o.contactName || '').replace(/"/g, '""')}"`,
      `"${o.assignedTo}"`,
      o.priority,
      o.type,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clientum_crm_deals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported opportunities as CSV', 'success');

    const user = currentUserRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'data.export',
      actionLabel: 'Exportación de Pipeline (CSV)',
      entityType: 'opportunities',
      entityName: 'Pipeline de Oportunidades',
      details: `Exportadas ${currentOpps.length} oportunidades comerciales a archivo CSV.`,
      severity: 'info',
      status: 'success',
    });
  }, [logAuditEvent, showToast]);

  // Additional state refs for stable callbacks
  const rolesRef = useRef(roles);
  rolesRef.current = roles;
  const usersRef = useRef(users);
  usersRef.current = users;
  const auditLogsRef = useRef(auditLogs);
  auditLogsRef.current = auditLogs;
  const securityAnomaliesRef = useRef(securityAnomalies);
  securityAnomaliesRef.current = securityAnomalies;
  const googleCalendarSyncRef = useRef(googleCalendarSync);
  googleCalendarSyncRef.current = googleCalendarSync;
  const slackIntegrationRef = useRef(slackIntegration);
  slackIntegrationRef.current = slackIntegration;
  const apiKeysRef = useRef(apiKeys);
  apiKeysRef.current = apiKeys;
  const webhooksRef = useRef(webhooks);
  webhooksRef.current = webhooks;
  const webmailEmailsRef = useRef(webmailEmails);
  webmailEmailsRef.current = webmailEmails;

  // ==========================================
  // RBAC & TEAM ROLES SYSTEM METHODS
  // ==========================================
  const addRole = useCallback((data: Omit<RoleDefinition, 'id' | 'createdAt'>): RoleDefinition => {
    const newRole: RoleDefinition = {
      ...data,
      id: 'role-' + Date.now(),
      createdAt: new Date().toISOString(),
      userCount: 0,
    };
    setRoles((prev) => [...prev, newRole]);
    showToast(`Rol personalizado "${newRole.name}" creado con éxito`, 'success');

    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'rbac.role_create',
      actionLabel: 'Creación de Rol Personalizado',
      entityType: 'settings',
      entityId: newRole.id,
      entityName: newRole.name,
      details: `Se creó el rol "${newRole.name}" con ${Object.values(newRole.permissions).filter((p) => p.view).length} módulos habilitados.`,
      severity: 'security',
      status: 'success',
    });
    return newRole;
  }, [logAuditEvent, showToast]);

  const updateRole = useCallback((id: string, updates: Partial<RoleDefinition>) => {
    const targetRole = rolesRef.current.find((r) => r.id === id);
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
    );
    showToast(`Rol "${targetRole?.name || id}" actualizado`, 'success');

    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'rbac.role_update',
      actionLabel: 'Modificación de Permisos de Rol',
      entityType: 'settings',
      entityId: id,
      entityName: targetRole?.name || id,
      details: `Permisos y políticas modificadas para el rol ${targetRole?.name || id}.`,
      severity: 'security',
      status: 'success',
    });
  }, [logAuditEvent, showToast]);

  const deleteRole = useCallback((id: string): boolean => {
    const roleToDelete = rolesRef.current.find((r) => r.id === id);
    if (!roleToDelete) return false;
    if (roleToDelete.isSystem) {
      showToast('No es posible eliminar roles predeterminados del sistema', 'error');
      return false;
    }
    setRoles((prev) => prev.filter((r) => r.id !== id));
    showToast(`Rol "${roleToDelete.name}" eliminado`, 'info');

    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'rbac.role_delete',
      actionLabel: 'Eliminación de Rol Personalizado',
      entityType: 'settings',
      entityId: id,
      entityName: roleToDelete.name,
      details: `El rol personalizado "${roleToDelete.name}" fue eliminado del sistema.`,
      severity: 'security',
      status: 'success',
    });
    return true;
  }, [logAuditEvent, showToast]);

  const duplicateRole = useCallback((id: string): RoleDefinition => {
    const source = rolesRef.current.find((r) => r.id === id);
    if (!source) throw new Error('Role not found');
    const clonedRole: RoleDefinition = {
      ...source,
      id: 'role-' + Date.now(),
      name: `${source.name} (Copia)`,
      slug: `${source.slug}_copy_${Date.now().toString().slice(-4)}`,
      isSystem: false,
      userCount: 0,
      createdAt: new Date().toISOString(),
      permissions: JSON.parse(JSON.stringify(source.permissions)),
    };
    setRoles((prev) => [...prev, clonedRole]);
    showToast(`Rol "${clonedRole.name}" duplicado`, 'success');
    return clonedRole;
  }, [showToast]);

  const assignUserRole = useCallback((userId: string, roleNameOrSlug: string) => {
    const targetUser = usersRef.current.find((u) => u.id === userId);
    const targetRole = rolesRef.current.find(
      (r) => r.name === roleNameOrSlug || r.slug === roleNameOrSlug || r.id === roleNameOrSlug
    );
    const roleNameToSet = targetRole ? targetRole.name : roleNameOrSlug;

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: roleNameToSet } : u))
    );

    const user = currentUserRef.current;
    if (user.id === userId) {
      updateCurrentUser({ role: roleNameToSet });
    }

    showToast(`Rol de ${targetUser?.name || 'usuario'} actualizado a "${roleNameToSet}"`, 'success');

    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'rbac.user_assign',
      actionLabel: 'Reasignación de Rol de Usuario',
      entityType: 'settings',
      entityId: userId,
      entityName: targetUser?.name || userId,
      details: `Asignado nuevo rol "${roleNameToSet}" al usuario ${targetUser?.name || userId} (${targetUser?.email || ''}).`,
      diff: [{ field: 'role', oldValue: targetUser?.role, newValue: roleNameToSet }],
      severity: 'security',
      status: 'success',
    });
  }, [logAuditEvent, showToast, updateCurrentUser]);

  const addUser = useCallback((userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: 'usr-' + Date.now(),
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Usuario "${newUser.name}" agregado al equipo`, 'success');

    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'rbac.user_create',
      actionLabel: 'Nuevo Usuario Creado en Workspace',
      entityType: 'settings',
      entityId: newUser.id,
      entityName: newUser.name,
      details: `Creado nuevo miembro de equipo "${newUser.name}" con rol "${newUser.role}".`,
      severity: 'security',
      status: 'success',
    });
    return newUser;
  }, [logAuditEvent, showToast]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    const userToUpdate = usersRef.current.find((u) => u.id === id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUserRef.current.id === id) {
      updateCurrentUser(updates);
    }
    showToast(`Usuario "${userToUpdate?.name || id}" actualizado`, 'info');
  }, [showToast, updateCurrentUser]);

  const deleteUser = useCallback((id: string) => {
    const userToDelete = usersRef.current.find((u) => u.id === id);
    if (!userToDelete) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast(`Usuario "${userToDelete.name}" removido`, 'info');

    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'rbac.user_delete',
      actionLabel: 'Usuario Removido de Workspace',
      entityType: 'settings',
      entityId: id,
      entityName: userToDelete.name,
      details: `El usuario ${userToDelete.name} (${userToDelete.email}) fue removido del workspace.`,
      severity: 'warning',
      status: 'success',
    });
  }, [logAuditEvent, showToast]);

  // ==========================================
  // AUDIT LOGGING & ANOMALIES METHODS
  // ==========================================
  const clearAuditLogs = useCallback(() => {
    setAuditLogs([]);
    showToast('Historial de logs de auditoría limpiado', 'info');
  }, [showToast]);

  const exportAuditCSV = useCallback(() => {
    exportAuditLogsCSV(auditLogsRef.current);
    showToast('Reporte de Auditoría exportado en CSV', 'success');
  }, [showToast]);

  const exportAuditJSON = useCallback(() => {
    exportAuditLogsJSON(auditLogsRef.current, securityAnomaliesRef.current);
    showToast('Certificado SOC2 / ISO 27001 exportado en JSON', 'success');
  }, [showToast]);

  const dismissAnomaly = useCallback((id: string) => {
    setSecurityAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'dismissed' } : a))
    );
    showToast('Incidencia de seguridad descartada', 'info');
  }, [showToast]);

  const resolveAnomaly = useCallback((id: string, actionNote?: string) => {
    setSecurityAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
    showToast(`Incidencia resuelta ${actionNote ? `: ${actionNote}` : ''}`, 'success');

    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'security.anomaly_resolved',
      actionLabel: 'Resolución de Anomalía de Seguridad',
      entityType: 'auditLogs',
      entityId: id,
      details: `Incidencia ${id} marcada como resuelta por ${user.name}. ${actionNote || ''}`,
      severity: 'info',
      status: 'success',
    });
  }, [logAuditEvent, showToast]);

  const triggerSecurityScan = useCallback(() => {
    const detected = scanAuditLogsForAnomalies(auditLogsRef.current);
    if (detected.length > 0) {
      setSecurityAnomalies((prev) => {
        const uniqueNew = detected.filter(
          (d) => !prev.some((p) => p.title === d.title && p.status === 'active')
        );
        return [...uniqueNew, ...prev];
      });
      showToast(`Escaneo de seguridad completado: ${detected.length} alertas detectadas`, 'warning');
    } else {
      showToast('Escaneo completado: No se detectaron anomalías en los registros recientes', 'success');
    }
  }, [showToast]);

  // ==========================================
  // API INTEGRATIONS HUB METHODS (GCAL, SLACK, API KEYS, WEBHOOKS)
  // ==========================================
  const updateCalendarSync = useCallback((updates: Partial<GoogleCalendarSyncState>) => {
    setGoogleCalendarSync((prev) => ({ ...prev, ...updates }));
    showToast('Configuración de Google Calendar actualizada', 'info');
  }, [showToast]);

  const syncGoogleCalendarNow = useCallback(async (): Promise<{ success: boolean; syncedCount: number }> => {
    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    // Generate fresh synced events based on current opportunities and tasks
    const oppEvents = opportunitiesRef.current.slice(0, 10).map((o, idx) => ({
      id: `gcal-opp-${o.id}`,
      title: `Cierre: ${o.name} ($${o.amount.toLocaleString()})`,
      description: `Oportunidad en etapa ${o.stage} con ${o.companyName || 'Cliente'}.`,
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * (idx + 1)).toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * (idx + 1) + 1)).toISOString(),
      attendees: [user.email, o.contactName || 'cliente@empresa.com'],
      crmLinkedType: 'opportunity' as const,
      crmLinkedId: o.id,
      crmLinkedName: o.name,
      status: 'confirmed' as const,
    }));

    const taskEvents = tasksRef.current.slice(0, 5).map((t, idx) => ({
      id: `gcal-task-${t.id}`,
      title: `Tarea CRM: ${t.title}`,
      description: `Prioridad ${t.priority}. Asignado a: ${t.assignedTo}`,
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 4 * (idx + 1)).toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * (4 * (idx + 1) + 1)).toISOString(),
      attendees: [user.email],
      crmLinkedType: 'task' as const,
      crmLinkedId: t.id,
      crmLinkedName: t.title,
      status: 'confirmed' as const,
    }));

    const allEvents = [...oppEvents, ...taskEvents];

    setGoogleCalendarSync((prev) => ({
      ...prev,
      lastSyncAt: new Date().toISOString(),
      eventsSyncedCount: allEvents.length,
      syncedEventsList: allEvents,
    }));

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'api.calendar_sync',
      actionLabel: 'Sincronización Bidireccional Google Calendar',
      entityType: 'integrations',
      entityId: 'gcal-primary',
      entityName: 'Google Calendar API',
      details: `Sincronizados ${allEvents.length} eventos y citas comerciales con la cuenta ${googleCalendarSyncRef.current.calendarEmail}.`,
      severity: 'info',
      status: 'success',
    });

    showToast(`Google Calendar sincronizado: ${allEvents.length} eventos actualizados`, 'success');
    return { success: true, syncedCount: allEvents.length };
  }, [logAuditEvent, showToast]);

  const updateSlackIntegration = useCallback((updates: Partial<SlackIntegrationState>) => {
    setSlackIntegration((prev) => ({ ...prev, ...updates }));
    showToast('Configuración de Slack actualizada', 'info');
  }, [showToast]);

  const sendSlackTestMessage = useCallback(async (channel?: string, eventType?: string): Promise<boolean> => {
    const slack = slackIntegrationRef.current;
    const targetChannel = channel || slack.defaultChannel || '#ventas-alertas';
    const event = eventType || 'deal_won';

    setSlackIntegration((prev) => ({
      ...prev,
      messagesSentCount: prev.messagesSentCount + 1,
      lastDispatchedAt: new Date().toISOString(),
    }));

    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'api.slack_broadcast',
      actionLabel: 'Despacho de Webhook a Slack',
      entityType: 'integrations',
      entityId: 'slack-bot',
      entityName: targetChannel,
      details: `Mensaje de prueba interactivo enviado exitosamente a canal Slack ${targetChannel} (${event}).`,
      severity: 'info',
      status: 'success',
    });

    showToast(`Mensaje enviado a Slack ${targetChannel}`, 'success');
    return true;
  }, [logAuditEvent, showToast]);
  sendSlackTestMessageRef.current = sendSlackTestMessage;

  const createAPIKey = useCallback((name: string, scopes: string[], ownerUserId = currentUserRef.current.id): APIKey => {
    const user = currentUserRef.current;
    const randomBytes = new Uint8Array(24);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(randomBytes);
    } else {
      for (let i = 0; i < randomBytes.length; i += 1) randomBytes[i] = Math.floor(Math.random() * 256);
    }
    const randomHex = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    const newKey: APIKey = {
      id: 'key-' + Date.now(),
      name,
      keyPrefix: `clm_live_${randomHex.slice(0, 4)}`,
      token: `clm_live_${randomHex}`,
      ownerUserId,
      ownerUserName: usersRef.current.find((u) => u.id === ownerUserId)?.name || user.name,
      scopes,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    setApiKeys((prev) => [newKey, ...prev]);
    showToast(`API Key "${name}" generada exitosamente`, 'success');

    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'api.key_create',
      actionLabel: 'Creación de Token de API REST',
      entityType: 'integrations',
      entityId: newKey.id,
      entityName: newKey.name,
      details: `Generada nueva clave API para ${newKey.ownerUserName} con scopes: ${scopes.join(', ')}.`,
      severity: 'security',
      status: 'success',
    });
    return newKey;
  }, [logAuditEvent, showToast]);

  const revokeAPIKey = useCallback((id: string) => {
    const targetKey = apiKeysRef.current.find((k) => k.id === id);
    setApiKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k))
    );
    showToast(`API Key "${targetKey?.name || id}" revocada`, 'warning');

    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'api.key_revoke',
      actionLabel: 'Revocación de Token de API',
      entityType: 'integrations',
      entityId: id,
      entityName: targetKey?.name || id,
      details: `El token ${targetKey?.keyPrefix}... fue revocado inmediatamente.`,
      severity: 'security',
      status: 'success',
    });
  }, [logAuditEvent, showToast]);

  const addWebhook = useCallback((
    wh: Omit<WebhookConfig, 'id' | 'createdAt' | 'deliverySuccessCount' | 'deliveryFailureCount'>
  ): WebhookConfig => {
    const newWebhook: WebhookConfig = {
      ...wh,
      id: 'wh-' + Date.now(),
      createdAt: new Date().toISOString(),
      deliverySuccessCount: 0,
      deliveryFailureCount: 0,
    };
    setWebhooks((prev) => [newWebhook, ...prev]);
    showToast(`Webhook "${newWebhook.name}" registrado`, 'success');

    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'api.webhook_create',
      actionLabel: 'Registro de Nuevo Webhook HTTP',
      entityType: 'integrations',
      entityId: newWebhook.id,
      entityName: newWebhook.name,
      details: `Registrado endpoint ${newWebhook.url} para eventos: ${newWebhook.events.join(', ')}.`,
      severity: 'info',
      status: 'success',
    });
    return newWebhook;
  }, [logAuditEvent, showToast]);

  const updateWebhook = useCallback((id: string, updates: Partial<WebhookConfig>) => {
    setWebhooks((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
    showToast('Webhook actualizado', 'info');
  }, [showToast]);

  const deleteWebhook = useCallback((id: string) => {
    const wh = webhooksRef.current.find((w) => w.id === id);
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    showToast(`Webhook "${wh?.name || id}" eliminado`, 'info');
  }, [showToast]);

  const triggerTestWebhook = useCallback(async (id: string): Promise<{ status: number; message: string }> => {
    const wh = webhooksRef.current.find((w) => w.id === id);
    if (!wh) return { status: 404, message: 'Webhook not found' };

    setWebhooks((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              lastTriggeredAt: new Date().toISOString(),
              lastResponseCode: 200,
              deliverySuccessCount: w.deliverySuccessCount + 1,
            }
          : w
      )
    );

    const user = currentUserRef.current;
    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'api.webhook_test',
      actionLabel: 'Prueba de Entrega de Webhook HTTP',
      entityType: 'integrations',
      entityId: id,
      entityName: wh.name,
      details: `Despachado payload de prueba a ${wh.url} (Respuesta: HTTP 200 OK en 112ms).`,
      severity: 'info',
      status: 'success',
    });

    showToast(`Test payload enviado a ${wh.url} (HTTP 200 OK)`, 'success');
    return { status: 200, message: 'HTTP 200 OK - Payload received by endpoint' };
  }, [logAuditEvent, showToast]);

  // Webmail Cloudflare Methods
  const sendWebmailEmail = useCallback(async (
    emailData: Omit<WebmailEmail, 'id' | 'timestamp' | 'messageId' | 'direction'>
  ): Promise<boolean> => {
    if (emailData.attachments?.length) {
      throw new Error('Los adjuntos reales se habilitarán al conectar el almacenamiento R2.');
    }

    const user = currentUserRef.current;
    const deliveryResponse = await fetch('/api/email/send', {
      method: 'POST',
      headers: await getClientumAuthJsonHeaders(user),
      body: JSON.stringify({
        from: emailData.from,
        fromName: emailData.fromName,
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        replyTo: emailData.replyTo,
        subject: emailData.subject,
        text: emailData.bodyText,
        html: emailData.bodyHtml,
      }),
    });
    const deliveryResult = await deliveryResponse.json().catch(() => ({}));
    if (!deliveryResponse.ok) {
      throw new Error(deliveryResult.error || 'No se pudo entregar el correo por SMTP.');
    }

    const newId = 'd1-msg-' + Date.now();
    const newMsgId = deliveryResult.messageId || `<${Date.now()}.smtp.clientum.outbound>`;
    const timestamp = new Date().toISOString();

    const newEmail: WebmailEmail = {
      ...emailData,
      from: deliveryResult.fromAddress || emailData.from,
      id: newId,
      messageId: newMsgId,
      timestamp,
      direction: 'outbound',
      folder: 'sent',
      isRead: true,
      isStarred: false,
      spfStatus: 'PASS',
      dkimStatus: 'PASS',
      dmarcStatus: 'PASS',
      workerId: 'webmail-clientum-worker-edge-1',
    };

    setWebmailEmails((prev) => [newEmail, ...prev]);

    // Also register in CRM Activities if linked
    if (emailData.crmLinkedType && emailData.crmLinkedId && emailData.crmLinkedType !== 'task') {
      addActivity({
        type: 'email',
        title: `Correo saliente: ${emailData.subject}`,
        content: `Para: ${emailData.to.join(', ')}\n\n${emailData.bodyText}`,
        author: user.name || 'Clientum Sales Team',
        targetType: emailData.crmLinkedType,
        targetId: emailData.crmLinkedId,
        meta: {
          emailSubject: emailData.subject,
        },
      });
    }

    const role = currentRoleRef.current;
    logAuditEvent({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: role.name,
      action: 'webmail.send_email',
      actionLabel: 'Despacho de Correo (send_email Worker)',
      entityType: 'webmail',
      entityId: newId,
      entityName: emailData.subject,
      details: `Correo entregado por SMTP a ${emailData.to.join(', ')} desde ${deliveryResult.fromAddress || emailData.from}.`,
      severity: 'info',
      status: 'success',
    });

    return true;
  }, [addActivity, logAuditEvent]);

  const markWebmailEmailAsRead = useCallback((id: string, isRead = true) => {
    setWebmailEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead } : e))
    );
  }, []);

  const deleteWebmailEmail = useCallback((id: string) => {
    const email = webmailEmailsRef.current.find((e) => e.id === id);
    if (!email) return;

    if (email.folder === 'trash') {
      // Permanent deletion
      setWebmailEmails((prev) => prev.filter((e) => e.id !== id));
      showToast('Correo eliminado definitivamente de D1', 'info');
    } else {
      // Move to trash
      setWebmailEmails((prev) =>
        prev.map((e) => (e.id === id ? { ...e, folder: 'trash' } : e))
      );
      showToast('Correo movido a la papelera', 'info');
    }
  }, [showToast]);

  const toggleWebmailStar = useCallback((id: string) => {
    setWebmailEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isStarred: !e.isStarred } : e))
    );
  }, []);

  const contextValue = useMemo<CRMContextType>(
    () => ({
      opportunities,
      companies,
      people,
      tasks,
      activities,
      users,
      currentUser,
      activeTab,
      setActiveTab,
      viewMode,
      setViewMode,
      selectedRecord,
      setSelectedRecord,
      filterState,
      setFilterState,
      resetFilters,
      theme,
      setTheme,
      toggleTheme,
      language,
      setLanguage,
      t,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      toggleMobileSidebar,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isNewRecordModalOpen,
      setIsNewRecordModalOpen,
      newRecordType,
      setNewRecordType,
      openNewRecordModal,
      isAICopilotModalOpen,
      setIsAICopilotModalOpen,
      aiCopilotContext,
      openAICopilot,
      isPublicSiteVisible,
      setIsPublicSiteVisible,
      openPublicSite,
      exitToPublicSite,
      enterApp,
      isAuthenticated,
      setIsAuthenticated,
      isAuthReady,
      gmailAccessToken,
      setGmailAccessToken,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isProfileModalOpen,
      setIsProfileModalOpen,
      updateCurrentUser,
      login,
      register,
      logout,
      resetPassword,
      syncClerkAuth,
      trialSubscription,
      startFreeTrial,
      upgradeSubscription,
      isMpCheckoutModalOpen,
      setIsMpCheckoutModalOpen,
      selectedCheckoutPlan,
      setSelectedCheckoutPlan,
      openMercadoPagoCheckout,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      moveOpportunityStage,
      addCompany,
      updateCompany,
      deleteCompany,
      addPerson,
      updatePerson,
      deletePerson,
      enrichContact,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addActivity,
      deleteActivity,
      customObjects,
      addCustomObject,
      addCustomFieldToObject,
      addRecordToCustomObject,
      deleteRecordFromCustomObject,
      workflows,
      addWorkflow,
      updateWorkflow,
      toggleWorkflow,
      deleteWorkflow,
      savedViews,
      addSavedView,
      deleteSavedView,
      importCSVData,
      lastImport,
      undoLastImport,
      refreshCrmData,
      resetToDemoData,
      loadClientumLeads,
      exportOpportunitiesCSV,
      invoices,
      inventory,
      expenses,
      addInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      addInventoryItem,
      updateInventoryStock,
      deleteInventoryItem,
      addExpense,
      deleteExpense,
      exportFullWorkspaceJSON,
      toasts,
      showToast,
      removeToast,
      triggerConfetti,

      // RBAC
      roles,
      currentRole,
      addRole,
      updateRole,
      deleteRole,
      duplicateRole,
      assignUserRole,
      addUser,
      updateUser,
      deleteUser,
      hasPermission,
      checkPermissionOrWarn,

      // Audit Logs & Anomalies
      auditLogs,
      logAuditEvent,
      clearAuditLogs,
      exportAuditCSV,
      exportAuditJSON,
      securityAnomalies,
      dismissAnomaly,
      resolveAnomaly,
      triggerSecurityScan,

      // API Integrations Hub
      googleCalendarSync,
      updateCalendarSync,
      syncGoogleCalendarNow,
      slackIntegration,
      updateSlackIntegration,
      sendSlackTestMessage,
      apiKeys,
      createAPIKey,
      revokeAPIKey,
      webhooks,
      addWebhook,
      updateWebhook,
      deleteWebhook,
      triggerTestWebhook,

      // Webmail Worker & D1
      webmailEmails,
      sendWebmailEmail,
      markWebmailEmailAsRead,
      deleteWebmailEmail,
      toggleWebmailStar,
      isComposeEmailModalOpen,
      setIsComposeEmailModalOpen,
      composeEmailDefaults,
      openComposeEmailModal,
      closeComposeEmailModal,

      // Ecosystem Hub Order & Sync Status
      ecosystemModuleOrder,
      setEcosystemModuleOrder,
      isOnline,
      isSyncPending,
      offlinePriorityQueue,
    }),
    [
      opportunities,
      companies,
      people,
      tasks,
      activities,
      users,
      currentUser,
      activeTab,
      setActiveTab,
      viewMode,
      setViewMode,
      selectedRecord,
      setSelectedRecord,
      filterState,
      setFilterState,
      resetFilters,
      theme,
      setTheme,
      toggleTheme,
      language,
      setLanguage,
      t,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      toggleMobileSidebar,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isNewRecordModalOpen,
      setIsNewRecordModalOpen,
      newRecordType,
      setNewRecordType,
      openNewRecordModal,
      isAICopilotModalOpen,
      setIsAICopilotModalOpen,
      aiCopilotContext,
      openAICopilot,
      isPublicSiteVisible,
      setIsPublicSiteVisible,
      openPublicSite,
      exitToPublicSite,
      enterApp,
      isAuthenticated,
      setIsAuthenticated,
      isAuthReady,
      gmailAccessToken,
      setGmailAccessToken,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isProfileModalOpen,
      setIsProfileModalOpen,
      updateCurrentUser,
      login,
      register,
      logout,
      resetPassword,
      syncClerkAuth,
      trialSubscription,
      startFreeTrial,
      upgradeSubscription,
      isMpCheckoutModalOpen,
      setIsMpCheckoutModalOpen,
      selectedCheckoutPlan,
      setSelectedCheckoutPlan,
      openMercadoPagoCheckout,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      moveOpportunityStage,
      addCompany,
      updateCompany,
      deleteCompany,
      addPerson,
      updatePerson,
      deletePerson,
      enrichContact,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addActivity,
      deleteActivity,
      customObjects,
      addCustomObject,
      addCustomFieldToObject,
      addRecordToCustomObject,
      deleteRecordFromCustomObject,
      workflows,
      addWorkflow,
      updateWorkflow,
      toggleWorkflow,
      deleteWorkflow,
      savedViews,
      addSavedView,
      deleteSavedView,
      importCSVData,
      lastImport,
      undoLastImport,
      refreshCrmData,
      resetToDemoData,
      loadClientumLeads,
      exportOpportunitiesCSV,
      invoices,
      inventory,
      expenses,
      addInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      addInventoryItem,
      updateInventoryStock,
      deleteInventoryItem,
      addExpense,
      deleteExpense,
      exportFullWorkspaceJSON,
      toasts,
      showToast,
      removeToast,
      triggerConfetti,
      roles,
      currentRole,
      addRole,
      updateRole,
      deleteRole,
      duplicateRole,
      assignUserRole,
      addUser,
      updateUser,
      deleteUser,
      hasPermission,
      checkPermissionOrWarn,
      auditLogs,
      logAuditEvent,
      clearAuditLogs,
      exportAuditCSV,
      exportAuditJSON,
      securityAnomalies,
      dismissAnomaly,
      resolveAnomaly,
      triggerSecurityScan,
      googleCalendarSync,
      updateCalendarSync,
      syncGoogleCalendarNow,
      slackIntegration,
      updateSlackIntegration,
      sendSlackTestMessage,
      apiKeys,
      createAPIKey,
      revokeAPIKey,
      webhooks,
      addWebhook,
      updateWebhook,
      deleteWebhook,
      triggerTestWebhook,
      webmailEmails,
      sendWebmailEmail,
      markWebmailEmailAsRead,
      deleteWebmailEmail,
      toggleWebmailStar,
      isComposeEmailModalOpen,
      setIsComposeEmailModalOpen,
      composeEmailDefaults,
      openComposeEmailModal,
      closeComposeEmailModal,
      ecosystemModuleOrder,
      setEcosystemModuleOrder,
      isOnline,
      isSyncPending,
      offlinePriorityQueue,
    ]
  );

  const authValue = useMemo<AuthContextType>(
    () => ({
      currentUser,
      users,
      isAuthenticated,
      isAuthReady,
      gmailAccessToken,
      setGmailAccessToken,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isProfileModalOpen,
      setIsProfileModalOpen,
      updateCurrentUser,
      login,
      register,
      logout,
      resetPassword,
      syncClerkAuth,
      roles,
      currentRole,
      addRole,
      updateRole,
      deleteRole,
      duplicateRole,
      assignUserRole,
      addUser,
      updateUser,
      deleteUser,
      hasPermission,
      checkPermissionOrWarn,
    }),
    [
      currentUser,
      users,
      isAuthenticated,
      isAuthReady,
      gmailAccessToken,
      setGmailAccessToken,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isProfileModalOpen,
      setIsProfileModalOpen,
      updateCurrentUser,
      login,
      register,
      logout,
      resetPassword,
      syncClerkAuth,
      roles,
      currentRole,
      addRole,
      updateRole,
      deleteRole,
      duplicateRole,
      assignUserRole,
      addUser,
      updateUser,
      deleteUser,
      hasPermission,
      checkPermissionOrWarn,
    ]
  );

  const crmDataValue = useMemo<CRMDataContextType>(
    () => ({
      opportunities,
      companies,
      people,
      tasks,
      activities,
      customObjects,
      workflows,
      savedViews,
      invoices,
      inventory,
      expenses,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      moveOpportunityStage,
      addCompany,
      updateCompany,
      deleteCompany,
      addPerson,
      updatePerson,
      deletePerson,
      enrichContact,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addActivity,
      deleteActivity,
      addCustomObject,
      addCustomFieldToObject,
      addRecordToCustomObject,
      deleteRecordFromCustomObject,
      addWorkflow,
      updateWorkflow,
      toggleWorkflow,
      deleteWorkflow,
      addSavedView,
      deleteSavedView,
      importCSVData,
      lastImport,
      undoLastImport,
      refreshCrmData,
      addInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      addInventoryItem,
      updateInventoryStock,
      deleteInventoryItem,
      addExpense,
      deleteExpense,
      exportFullWorkspaceJSON,
      resetToDemoData,
      loadClientumLeads,
      exportOpportunitiesCSV,
      googleCalendarSync,
      updateCalendarSync,
      syncGoogleCalendarNow,
      slackIntegration,
      updateSlackIntegration,
      sendSlackTestMessage,
      apiKeys,
      createAPIKey,
      revokeAPIKey,
      webhooks,
      addWebhook,
      updateWebhook,
      deleteWebhook,
      triggerTestWebhook,
      webmailEmails,
      sendWebmailEmail,
      markWebmailEmailAsRead,
      deleteWebmailEmail,
      toggleWebmailStar,
      isOnline,
      isSyncPending,
      offlinePriorityQueue,
      ecosystemModuleOrder,
      setEcosystemModuleOrder,
    }),
    [
      opportunities,
      companies,
      people,
      tasks,
      activities,
      customObjects,
      workflows,
      savedViews,
      invoices,
      inventory,
      expenses,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      moveOpportunityStage,
      addCompany,
      updateCompany,
      deleteCompany,
      addPerson,
      updatePerson,
      deletePerson,
      enrichContact,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addActivity,
      deleteActivity,
      addCustomObject,
      addCustomFieldToObject,
      addRecordToCustomObject,
      deleteRecordFromCustomObject,
      workflows,
      addWorkflow,
      updateWorkflow,
      toggleWorkflow,
      deleteWorkflow,
      savedViews,
      addSavedView,
      deleteSavedView,
      importCSVData,
      lastImport,
      undoLastImport,
      refreshCrmData,
      resetToDemoData,
      loadClientumLeads,
      exportOpportunitiesCSV,
      invoices,
      inventory,
      expenses,
      addInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      addInventoryItem,
      updateInventoryStock,
      deleteInventoryItem,
      addExpense,
      deleteExpense,
      exportFullWorkspaceJSON,
      googleCalendarSync,
      updateCalendarSync,
      syncGoogleCalendarNow,
      slackIntegration,
      updateSlackIntegration,
      sendSlackTestMessage,
      apiKeys,
      createAPIKey,
      revokeAPIKey,
      webhooks,
      addWebhook,
      updateWebhook,
      deleteWebhook,
      triggerTestWebhook,
      webmailEmails,
      sendWebmailEmail,
      markWebmailEmailAsRead,
      deleteWebmailEmail,
      toggleWebmailStar,
      ecosystemModuleOrder,
      setEcosystemModuleOrder,
      isOnline,
      isSyncPending,
      offlinePriorityQueue,
    ]
  );

  const uiValue = useMemo<UIContextType>(
    () => ({
      activeTab,
      setActiveTab,
      viewMode,
      setViewMode,
      selectedRecord,
      setSelectedRecord,
      filterState,
      setFilterState,
      resetFilters,
      theme,
      setTheme,
      toggleTheme,
      language,
      setLanguage,
      t,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      toggleMobileSidebar,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isNewRecordModalOpen,
      setIsNewRecordModalOpen,
      newRecordType,
      setNewRecordType,
      openNewRecordModal,
      isAICopilotModalOpen,
      setIsAICopilotModalOpen,
      aiCopilotContext,
      openAICopilot,
      trialSubscription,
      startFreeTrial,
      upgradeSubscription,
      isMpCheckoutModalOpen,
      setIsMpCheckoutModalOpen,
      selectedCheckoutPlan,
      setSelectedCheckoutPlan,
      openMercadoPagoCheckout,
      toasts,
      showToast,
      removeToast,
      triggerConfetti,
      isComposeEmailModalOpen,
      setIsComposeEmailModalOpen,
      composeEmailDefaults,
      openComposeEmailModal,
      closeComposeEmailModal,
      auditLogs,
      logAuditEvent,
      clearAuditLogs,
      exportAuditCSV,
      exportAuditJSON,
      securityAnomalies,
      dismissAnomaly,
      resolveAnomaly,
      triggerSecurityScan,
    }),
    [
      activeTab,
      setActiveTab,
      viewMode,
      setViewMode,
      selectedRecord,
      setSelectedRecord,
      filterState,
      setFilterState,
      resetFilters,
      theme,
      setTheme,
      toggleTheme,
      language,
      setLanguage,
      t,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      toggleMobileSidebar,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isNewRecordModalOpen,
      setIsNewRecordModalOpen,
      newRecordType,
      setNewRecordType,
      openNewRecordModal,
      isAICopilotModalOpen,
      setIsAICopilotModalOpen,
      aiCopilotContext,
      openAICopilot,
      trialSubscription,
      startFreeTrial,
      upgradeSubscription,
      isMpCheckoutModalOpen,
      setIsMpCheckoutModalOpen,
      selectedCheckoutPlan,
      setSelectedCheckoutPlan,
      openMercadoPagoCheckout,
      toasts,
      showToast,
      removeToast,
      triggerConfetti,
      auditLogs,
      logAuditEvent,
      clearAuditLogs,
      exportAuditCSV,
      exportAuditJSON,
      securityAnomalies,
      dismissAnomaly,
      resolveAnomaly,
      triggerSecurityScan,
      isComposeEmailModalOpen,
      setIsComposeEmailModalOpen,
      composeEmailDefaults,
      openComposeEmailModal,
      closeComposeEmailModal,
    ]
  );

  const erpValue = useMemo<ERPContextType>(
    () => ({
      invoices,
      inventory,
      expenses,
      addInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      addInventoryItem,
      updateInventoryStock,
      deleteInventoryItem,
      addExpense,
      deleteExpense,
    }),
    [
      invoices,
      inventory,
      expenses,
      addInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      addInventoryItem,
      updateInventoryStock,
      deleteInventoryItem,
      addExpense,
      deleteExpense,
    ]
  );

  return (
    <AuthContext.Provider value={authValue}>
      <CRMDataContext.Provider value={crmDataValue}>
        <UIContext.Provider value={uiValue}>
          <ERPContext.Provider value={erpValue}>
            <CRMContext.Provider value={contextValue}>
              {children}
            </CRMContext.Provider>
          </ERPContext.Provider>
        </UIContext.Provider>
      </CRMDataContext.Provider>
    </AuthContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
