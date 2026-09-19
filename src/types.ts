export type ThemeMode = 'dark' | 'light' | 'system';
export type Language = 'en' | 'es' | 'pt';

export type StageId = 'lead' | 'discovery' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface StageConfig {
  id: StageId;
  name: string;
  color: string;
  probability: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'date';
  options?: string[];
  value?: string | number | boolean;
}

export interface ContactEnrichmentData {
  bio?: string;
  seniority?: string;
  industry?: string;
  skills?: string[];
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  companyInfo?: {
    name?: string;
    domain?: string;
    size?: string;
    techStack?: string[];
    location?: string;
  };
  suggestedIcebreakers?: string[];
  confidenceScore?: number;
  enrichedAt?: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  companyId?: string;
  companyName?: string;
  avatar?: string;
  city?: string;
  country?: string;
  linkedin?: string;
  status: 'Lead' | 'Contacted' | 'Customer' | 'Churned';
  assignedTo?: string;
  createdAt: string;
  lastActivityDate: string;
  notes?: string;
  enrichmentStatus?: 'idle' | 'enriching' | 'enriched' | 'failed';
  enrichmentData?: ContactEnrichmentData;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  industry: string;
  employees: string;
  arr?: number;
  tier: 'Enterprise' | 'Mid-Market' | 'Startup' | 'Scaleup';
  healthScore: number; // 0-100
  address?: string;
  city?: string;
  country?: string;
  assignedTo: string;
  createdAt: string;
  description?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  amount: number;
  currency: string;
  stage: StageId;
  closeDate: string;
  probability: number;
  companyId?: string;
  companyName?: string;
  contactId?: string;
  contactName?: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'New Business' | 'Expansion' | 'Renewal';
  notes?: string;
  tags: string[];
  lossReason?: string;
  healthScore?: number;
  expectedCloseDate?: string;
  personName?: string;
  title?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'Completed';
  assignedTo?: string;
  targetType?: 'opportunity' | 'company' | 'person';
  targetId?: string;
  targetName?: string;
  subtasks?: Subtask[];
  createdAt: string;
  completedAt?: string;
}

export interface Activity {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'stage_change' | 'ai_insight';
  title: string;
  content: string;
  author: string;
  targetType: 'opportunity' | 'company' | 'person';
  targetId: string;
  createdAt: string;
  audioUrl?: string;
  meta?: {
    durationMinutes?: number;
    callOutcome?: string;
    fromStage?: StageId;
    toStage?: StageId;
    emailSubject?: string;
    channel?: string;
    recipientPhone?: string;
    [key: string]: any;
  };
}

export type ActiveTab = 
  | 'dashboard'
  | 'userDashboard'
  | 'ecosystemHub'
  | 'featureHub'
  | 'opportunities' 
  | 'companies' 
  | 'people' 
  | 'tasks' 
  | 'activityInbox'
  | 'operations'
  | 'calendar'
  | 'analytics' 
  | 'settings' 
  | 'powerSuite' 
  | 'whatsapp' 
  | 'messages'
  | 'erp' 
  | 'restaurant' 
  | 'ecommerce' 
  | 'saasCluster' 
  | 'sites' 
  | 'saasTheme' 
  | 'subscriptions' 
  | 'segments' 
  | 'chatbot' 
  | 'automation' 
  | 'knowledge'
  | 'campaigns'
  | 'aiAssistant'
  | 'mapsProspecting'
  | 'gtmStrategy'
  | 'meddic'
  | 'sdrOutreach'
  | 'adCopy'
  | 'payments'
  | 'clientPortal'
  | 'seoSuite'
  | 'webDev'
  | 'customObjects'
  | 'workflows'
  | 'csvStudio'
  | 'brochure'
  | 'agenteOS'
  | 'propuestas'
  | 'googleMaps'
  | 'domainManager'
  | 'campusLMS'
  | 'tiendaDigital'
  | 'industryLanding'
  | 'rbacRoles'
  | 'auditLogs'
  | 'apiIntegrations'
  | 'webmail'
  | 'erpAvanzado'
  | 'vscrmSuite'
  | 'wordpressIntegracion'
  | 'adminConsole'
  | 'workspaceIntegrations'
  | 'dashboardDocs'
  | 'competitorHub'
  | 'reportsAnalytics'
  | 'documentManagement'
  | 'integrationSettings'
  | 'teamManagement';

export type OpportunityViewMode = 'kanban' | 'table';

export interface FilterRule {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'isSet';
  value: string;
}

export interface SavedView {
  id: string;
  name: string;
  target: 'opportunities' | 'companies' | 'people' | 'customObject';
  customObjectId?: string;
  rules: FilterRule[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  columns?: string[];
  isDefault?: boolean;
}

export interface CustomObjectField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'date' | 'currency' | 'rating' | 'relation';
  options?: string[];
  required?: boolean;
  relationTarget?: 'Company' | 'Person' | 'Opportunity';
}

export interface CustomObjectDefinition {
  id: string;
  name: string; // e.g. 'Product', 'Project', 'Ticket'
  singularName: string;
  pluralName: string;
  icon: string;
  description: string;
  fields: CustomObjectField[];
  records: Array<Record<string, any>>;
  createdAt: string;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'webhook';
  title: string;
  description: string;
  config: Record<string, any>;
  icon: string;
  position?: { x: number; y: number };
  stageIndex?: number;
  stageName?: string;
  parentId?: string | null;
  branchLabel?: string;
  status?: 'idle' | 'running' | 'success' | 'failed';
}

export interface WorkflowConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  branch?: 'default' | 'true' | 'false' | 'fallback';
  status?: 'idle' | 'active' | 'success';
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggerType: 'record_created' | 'stage_changed' | 'field_updated' | 'schedule' | 'webhook';
  targetObject: 'opportunity' | 'company' | 'person' | 'task' | 'whatsapp';
  nodes: WorkflowNode[];
  connections?: WorkflowConnection[];
  lastRunAt?: string;
  runCount: number;
}

export interface CSVColumnMapping {
  csvHeader: string;
  targetField: string;
  sampleValue: string;
}

export interface FilterState {
  search: string;
  stage?: StageId | 'all';
  owner?: string | 'all';
  priority?: string | 'all';
  tier?: string | 'all';
  minAmount?: number;
  maxAmount?: number;
  customRules?: FilterRule[];
  selectedOwners?: string[];
  selectedPriorities?: ('Low' | 'Medium' | 'High' | 'Critical')[];
}

// ERP & Invoicing Types
export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export interface Invoice {
  id: string;
  opportunityId?: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  cuit?: string;
  invoiceType?: 'Factura A' | 'Factura B' | 'Factura C';
  puntoDeVenta?: string;
  cae?: string;
  caeExpires?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceLineItem[];
  subtotal: number;
  taxRate: number; // e.g. 16 or 21 percentage
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
}

export interface WarehouseLocation {
  warehouse: string;
  aisle?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockQuantity: number;
  reorderLevel: number;
  unitPrice: number;
  description?: string;
  linkedDealsCount?: number;
  lastRestocked?: string;
  warehouseLocation?: WarehouseLocation;
  warehouseLocationString?: string;
}

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: 'Software' | 'Marketing' | 'Travel' | 'Salaries' | 'Office' | 'Utilities' | 'Other';
  date: string;
  vendor?: string;
  assignedTo?: string;
  notes?: string;
}

// ==========================================
// ROLE-BASED ACCESS CONTROL (RBAC) TYPES
// ==========================================
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'manage';

export type PermissionResource =
  | 'opportunities'
  | 'companies'
  | 'people'
  | 'tasks'
  | 'analytics'
  | 'erp'
  | 'workflows'
  | 'customObjects'
  | 'auditLogs'
  | 'settings'
  | 'integrations';

export interface ResourcePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export?: boolean;
  manage?: boolean;
}

export type RolePermissionMatrix = Record<PermissionResource, ResourcePermissions>;

export interface RoleDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  color: string;
  badgeBg?: string;
  badgeText?: string;
  userCount?: number;
  permissions: RolePermissionMatrix;
  createdAt: string;
  updatedAt?: string;
}

// ==========================================
// AUDIT LOGGING & ANOMALY DETECTION TYPES
// ==========================================
export type AuditLogLevel = 'info' | 'warning' | 'critical' | 'security';

export interface AuditLogChangeDiff {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  userRole: string;
  action: string;
  actionLabel: string;
  entityType: string;
  entityId?: string;
  entityName?: string;
  details: string;
  diff?: AuditLogChangeDiff[];
  ipAddress: string;
  userAgent: string;
  location?: string;
  severity: AuditLogLevel;
  status: 'success' | 'warning' | 'denied' | 'flagged';
  metadata?: Record<string, any>;
}

export interface SecurityAnomaly {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  status: 'active' | 'resolved' | 'dismissed';
  triggerEventIds: string[];
  recommendation: string;
  affectedUser?: {
    id: string;
    name: string;
    email: string;
  };
  ruleType: 'bulk_deletion' | 'excessive_exports' | 'privilege_escalation' | 'suspicious_activity' | 'rapid_modifications';
}

// ==========================================
// API INTEGRATIONS, CALENDAR, SLACK & DEV HUB
// ==========================================
export interface GoogleCalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  crmLinkedType?: 'opportunity' | 'company' | 'person' | 'task';
  crmLinkedId?: string;
  crmLinkedName?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export interface GoogleCalendarSyncState {
  isConnected: boolean;
  autoSync: boolean;
  syncIntervalMinutes: number;
  calendarEmail: string;
  lastSyncAt?: string;
  syncDirection: 'two_way' | 'to_calendar' | 'to_crm';
  syncDeals: boolean;
  syncOpportunities?: boolean;
  syncTasks: boolean;
  syncMeetings: boolean;
  eventsSyncedCount: number;
  syncedEventsList: GoogleCalendarEvent[];
}

export interface SlackChannelMapping {
  id: string;
  eventType: 'deal_won' | 'lead_created' | 'high_priority_task' | 'stage_changed' | 'security_alert';
  channel: string;
  enabled: boolean;
}

export interface SlackIntegrationState {
  isConnected: boolean;
  webhookUrl: string;
  botName: string;
  workspaceName?: string;
  defaultChannel: string;
  notifyOnDealWon?: boolean;
  notifyOnHighValueLead?: boolean;
  notifyOnSecurityAnomaly?: boolean;
  channelMappings: SlackChannelMapping[];
  messagesSentCount: number;
  lastDispatchedAt?: string;
}

export interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  /**
   * Full token is available only during the creation response.
   * Persisted records should contain metadata and no raw secret.
   */
  token?: string;
  ownerUserId?: string;
  ownerUserName?: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  status: 'active' | 'revoked';
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  status?: 'active' | 'inactive';
  lastTriggeredAt?: string;
  lastResponseCode?: number;
  createdAt: string;
  deliverySuccessCount: number;
  deliveryFailureCount: number;
}

// ==========================================
// CLOUDFLARE WEBMAIL & D1 DATABASE TYPES
// ==========================================
export interface WebmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export type WebmailFolder = 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash' | 'starred';

export interface WebmailEmail {
  id: string;
  messageId: string;
  from: string;
  fromName: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  timestamp: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash';
  isRead: boolean;
  isStarred: boolean;
  spfStatus: 'PASS' | 'FAIL' | 'NEUTRAL';
  dkimStatus: 'PASS' | 'FAIL' | 'NEUTRAL';
  dmarcStatus: 'PASS' | 'FAIL' | 'NEUTRAL';
  attachments: WebmailAttachment[];
  crmLinkedType?: 'opportunity' | 'company' | 'person' | 'task';
  crmLinkedId?: string;
  crmLinkedName?: string;
  direction: 'inbound' | 'outbound';
  workerId?: string;
}

export interface WebmailD1Stats {
  totalInbound: number;
  totalOutbound: number;
  unreadCount: number;
  spamBlocked: number;
  deliverySuccessRate: number;
  averageResponseTimeMinutes: number;
  dailyVolume: Array<{
    date: string;
    inbound: number;
    outbound: number;
    total: number;
  }>;
  hourlyDistribution: Array<{
    hour: string;
    inbound: number;
    outbound: number;
  }>;
  topSenders: Array<{
    domain: string;
    count: number;
    pct: number;
  }>;
}

export type ClientumPlanId = 'starter' | 'professional' | 'enterprise';

export interface TrialSubscriptionState {
  plan: ClientumPlanId | 'trial';
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  trialStartDate: string;
  trialEndDate: string;
  daysRemaining: number;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  paymentMethod?: 'mercadopago' | 'credit_card' | 'bank_transfer';
  billingCycle: 'monthly' | 'annual';
  lastPaymentDate?: string;
  nextBillingDate?: string;
  subscriptionId?: string;
  amountARS?: number;
  cuitOrCuil?: string;
  businessName?: string;
}



