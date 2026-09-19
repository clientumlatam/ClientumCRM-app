import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Sidebar } from './Sidebar';
import { Navbar } from '../layout/Navbar';
import { RecordDrawer } from '../common/RecordDrawer';
import { CommandPalette } from '../common/CommandPalette';
import { NewRecordModal } from '../common/NewRecordModal';
import { AICopilotModal } from '../ai/AICopilotModal';
import { AuthModal } from '../auth/AuthModal';
import { UserProfileModal } from '../auth/UserProfileModal';
import { ComposeEmailModal } from '../webmail/ComposeEmailModal';
import { ToastContainer } from '../common/ToastContainer';
import { AICopilotFloating } from '../common/AICopilotFloating';
import { TutorialOnboardingModal } from '../common/TutorialOnboardingModal';
import { TrialBanner } from '../billing/TrialBanner';
import { MercadoPagoSubscriptionModal } from '../billing/MercadoPagoSubscriptionModal';
import { useStorageCleanup } from '../../hooks/useStorageCleanup';
import { initPeriodicStorageCleaner } from '../../utils/storageCleaner';

// Modals dynamically opened via state
import { QuoteWizardModal } from '../public/QuoteWizardModal';
import { WhatsAppSimulatorModal } from '../public/WhatsAppSimulatorModal';
import { ExpressAuditModal } from '../public/ExpressAuditModal';

// Dynamic Route Views with React.lazy and specific chunk names for optimized code-splitting
const ExecutiveDashboardView = lazy(
  () => import(/* webpackChunkName: "dashboard-executive" */ '../dashboard/ExecutiveDashboardView').then((m) => ({ default: m.ExecutiveDashboardView }))
);
const UnifiedControlHub = lazy(
  () => import(/* webpackChunkName: "workspace-unified-hub" */ '../workspace/UnifiedControlHub').then((m) => ({ default: m.UnifiedControlHub }))
);
const KanbanView = lazy(
  () => import(/* webpackChunkName: "kanban-view" */ '../opportunities/KanbanView').then((m) => ({ default: m.KanbanView }))
);
const TableView = lazy(
  () => import(/* webpackChunkName: "table-view" */ '../opportunities/TableView').then((m) => ({ default: m.TableView }))
);
const CompaniesView = lazy(
  () => import(/* webpackChunkName: "companies-view" */ '../companies/CompaniesView').then((m) => ({ default: m.CompaniesView }))
);
const PeopleView = lazy(
  () => import(/* webpackChunkName: "people-view" */ '../people/PeopleView').then((m) => ({ default: m.PeopleView }))
);
const TasksView = lazy(
  () => import(/* webpackChunkName: "tasks-view" */ '../tasks/TasksView').then((m) => ({ default: m.TasksView }))
);
const ActivityInboxView = lazy(
  () => import(/* webpackChunkName: "activity-inbox-view" */ '../activities/ActivityInboxView').then((m) => ({ default: m.ActivityInboxView }))
);
const OperationsView = lazy(
  () => import(/* webpackChunkName: "operations-view" */ '../operations/OperationsView').then((m) => ({ default: m.OperationsView }))
);
const CalendarView = lazy(
  () => import(/* webpackChunkName: "calendar-view" */ '../calendar/CalendarView').then((m) => ({ default: m.CalendarView }))
);
const AnalyticsView = lazy(
  () => import(/* webpackChunkName: "analytics-view" */ '../analytics/AnalyticsView').then((m) => ({ default: m.AnalyticsView }))
);
const PowerSuiteView = lazy(
  () => import(/* webpackChunkName: "power-suite-view" */ '../power/PowerSuiteView').then((m) => ({ default: m.PowerSuiteView }))
);
const SettingsView = lazy(
  () => import(/* webpackChunkName: "settings-view" */ '../settings/SettingsView').then((m) => ({ default: m.SettingsView }))
);
const ErpView = lazy(
  () => import(/* webpackChunkName: "erp-view" */ '../power/ErpView').then((m) => ({ default: m.ErpView }))
);
const RestaurantView = lazy(
  () => import(/* webpackChunkName: "restaurant-view" */ '../power/RestaurantView').then((m) => ({ default: m.RestaurantView }))
);
const EcommerceView = lazy(
  () => import(/* webpackChunkName: "ecommerce-view" */ '../power/EcommerceView').then((m) => ({ default: m.EcommerceView }))
);
const SaaSClusterView = lazy(
  () => import(/* webpackChunkName: "saas-cluster-view" */ '../power/SaaSClusterView').then((m) => ({ default: m.SaaSClusterView }))
);
const SitesView = lazy(
  () => import(/* webpackChunkName: "sites-view" */ '../power/SitesView').then((m) => ({ default: m.SitesView }))
);
const SaaSThemeView = lazy(
  () => import(/* webpackChunkName: "saas-theme-view" */ '../power/SaaSThemeView').then((m) => ({ default: m.SaaSThemeView }))
);
const SubscriptionsView = lazy(
  () => import(/* webpackChunkName: "subscriptions-view" */ '../power/SubscriptionsView').then((m) => ({ default: m.SubscriptionsView }))
);
const CustomerSegmentsView = lazy(
  () => import(/* webpackChunkName: "customer-segments-view" */ '../power/CustomerSegmentsView').then((m) => ({ default: m.CustomerSegmentsView }))
);
const ChatbotView = lazy(
  () => import(/* webpackChunkName: "chatbot-view" */ '../power/ChatbotView').then((m) => ({ default: m.ChatbotView }))
);
const AutomationView = lazy(
  () => import(/* webpackChunkName: "automation-view" */ '../power/AutomationView').then((m) => ({ default: m.AutomationView }))
);
const KnowledgeBaseView = lazy(
  () => import(/* webpackChunkName: "knowledge-base-view" */ '../power/KnowledgeBaseView').then((m) => ({ default: m.KnowledgeBaseView }))
);
const WhatsAppView = lazy(
  () => import(/* webpackChunkName: "whatsapp-view" */ '../whatsapp/WhatsAppView').then((m) => ({ default: m.WhatsAppView }))
);
const CustomObjectsView = lazy(
  () => import(/* webpackChunkName: "custom-objects-view" */ '../custom/CustomObjectsView').then((m) => ({ default: m.CustomObjectsView }))
);
const WorkflowsView = lazy(
  () => import(/* webpackChunkName: "workflows-view" */ '../workflows/WorkflowsView').then((m) => ({ default: m.WorkflowsView }))
);
const CSVStudioView = lazy(
  () => import(/* webpackChunkName: "csv-studio-view" */ '../csv/CSVStudioView').then((m) => ({ default: m.CSVStudioView }))
);
const AgenteOSView = lazy(
  () => import(/* webpackChunkName: "agente-os-view" */ '../ai/AgenteOSView').then((m) => ({ default: m.AgenteOSView }))
);
const Propuestas = lazy(
  () => import(/* webpackChunkName: "propuestas-view" */ '../commercial/Propuestas').then((m) => ({ default: m.Propuestas }))
);
const ModuleProspeccionMaps = lazy(
  () => import(/* webpackChunkName: "module-prospeccion-maps" */ '../commercial/ModuleProspeccionMaps').then((m) => ({ default: m.ModuleProspeccionMaps }))
);
const PublicDomainManagerPage = lazy(
  () => import(/* webpackChunkName: "public-domain-manager-page" */ '../power/PublicDomainManagerPage').then((m) => ({ default: m.PublicDomainManagerPage }))
);
const CampusLMSView = lazy(
  () => import(/* webpackChunkName: "campus-lms-view" */ '../power/CampusLMSView').then((m) => ({ default: m.CampusLMSView }))
);
const TiendaDigitalView = lazy(
  () => import(/* webpackChunkName: "tienda-digital-view" */ '../public/TiendaDigitalView').then((m) => ({ default: m.TiendaDigitalView }))
);
const IndustryLandingPage = lazy(
  () => import(/* webpackChunkName: "industry-landing-page" */ '../public/IndustryLandingPage').then((m) => ({ default: m.IndustryLandingPage }))
);
const WebmailInboxView = lazy(
  () => import(/* webpackChunkName: "webmail-inbox-view" */ '../webmail/WebmailInboxView').then((m) => ({ default: m.WebmailInboxView }))
);
const PlatformBillingView = lazy(
  () => import(/* webpackChunkName: "platform-billing-view" */ '../billing/PlatformBillingView').then((m) => ({ default: m.PlatformBillingView }))
);
const MessagesView = lazy(
  () => import(/* webpackChunkName: "messages-view" */ '../messages/MessagesView').then((m) => ({ default: m.MessagesView }))
);
const ErpAvanzadoDashboardPage = lazy(
  () => import(/* webpackChunkName: "erp-avanzado-dashboard-page" */ '../dashboard/ErpAvanzadoDashboardPage').then((m) => ({ default: m.ErpAvanzadoDashboardPage }))
);
const VscrmSuitePage = lazy(
  () => import(/* webpackChunkName: "vscrm-suite-page" */ '../dashboard/VscrmSuitePage').then((m) => ({ default: m.VscrmSuitePage }))
);
const WordPressIntegracionPage = lazy(
  () => import(/* webpackChunkName: "wordpress-integracion-page" */ '../dashboard/WordPressIntegracionPage').then((m) => ({ default: m.WordPressIntegracionPage }))
);
const AdminConsoleDashboardPage = lazy(
  () => import(/* webpackChunkName: "admin-console-dashboard-page" */ '../dashboard/AdminConsoleDashboardPage').then((m) => ({ default: m.AdminConsoleDashboardPage }))
);
const GoogleWorkspaceDashboardPage = lazy(
  () => import(/* webpackChunkName: "google-workspace-dashboard-page" */ '../dashboard/GoogleWorkspaceDashboardPage').then((m) => ({ default: m.GoogleWorkspaceDashboardPage }))
);
const DashboardDocsExplorerPage = lazy(
  () => import(/* webpackChunkName: "dashboard-docs-explorer-page" */ '../dashboard/DashboardDocsExplorerPage').then((m) => ({ default: m.DashboardDocsExplorerPage }))
);
const CompetitorHubView = lazy(
  () => import(/* webpackChunkName: "competitor-hub-view" */ '../competitor/CompetitorHubView').then((m) => ({ default: m.CompetitorHubView }))
);
const TeamView = lazy(
  () => import(/* webpackChunkName: "team-view" */ './modules/Team').then((m) => ({ default: m.Team }))
);
const IntegrationSettingsView = lazy(
  () => import(/* webpackChunkName: "integration-settings-view" */ './modules/Settings').then((m) => ({ default: m.Settings }))
);
const ReportsView = lazy(
  () => import(/* webpackChunkName: "reports-view" */ './modules/Reports').then((m) => ({ default: m.Reports }))
);

const ViewFallbackLoader: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[350px] select-none">
    <div className="relative flex items-center justify-center w-12 h-12 mb-3">
      <div className="absolute w-12 h-12 rounded-full border-2 border-blue-500/20 animate-ping" />
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
    <span className="text-xs font-semibold text-[var(--text-muted)] animate-pulse">Cargando módulo...</span>
  </div>
);

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    viewMode,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isComposeEmailModalOpen,
    closeComposeEmailModal,
    composeEmailDefaults,
    isOnline,
    isSyncPending,
    isMpCheckoutModalOpen,
    setIsMpCheckoutModalOpen,
    selectedCheckoutPlan,
  } = useCRM();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Hook for automatic periodic storage cleanup (localStorage & IndexedDB)
  useStorageCleanup();

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      {(!isOnline || isSyncPending) && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm z-50 transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping shrink-0" />
            <span>
              {!isOnline
                ? '⚠️ Estás sin conexión (Offline). Tus cambios recientes de prioridad y estado se guardarán localmente en la cola offline y se sincronizarán con Firebase en cuanto se restablezca la conexión.'
                : '🔄 Sincronizando cambios pendientes de prioridad con Firebase en segundo plano...'}
            </span>
          </div>
          <span className="text-[11px] opacity-90 uppercase tracking-wider font-bold shrink-0">Clientum Cloud Sync</span>
        </div>
      )}
      <Navbar />
      <TrialBanner />

      <main className="crm-main-content flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <Suspense fallback={<ViewFallbackLoader />}>
          {(activeTab === 'dashboard' || activeTab === 'userDashboard') && <ExecutiveDashboardView />}
          {(activeTab === 'ecosystemHub' || activeTab === 'featureHub') && <UnifiedControlHub />}
          {activeTab === 'opportunities' && (viewMode === 'kanban' ? <KanbanView /> : <TableView />)}
          {activeTab === 'companies' && <CompaniesView />}
          {activeTab === 'people' && <PeopleView />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'activityInbox' && <ActivityInboxView />}
          {activeTab === 'operations' && <OperationsView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'reportsAnalytics' && <ReportsView />}
          {activeTab === 'powerSuite' && <PowerSuiteView />}
          {activeTab === 'whatsapp' && <WhatsAppView />}
          {activeTab === 'messages' && <MessagesView />}
          {activeTab === 'erp' && <ErpView />}
          {activeTab === 'restaurant' && <RestaurantView />}
          {activeTab === 'ecommerce' && <EcommerceView />}
          {activeTab === 'saasCluster' && <SaaSClusterView />}
          {activeTab === 'sites' && <SitesView />}
          {activeTab === 'saasTheme' && <SaaSThemeView />}
          {activeTab === 'subscriptions' && <SubscriptionsView />}
          {activeTab === 'segments' && <CustomerSegmentsView />}
          {activeTab === 'chatbot' && <ChatbotView />}
          {activeTab === 'automation' && <AutomationView />}
          {activeTab === 'knowledge' && <KnowledgeBaseView />}
          {activeTab === 'mapsProspecting' && <PowerSuiteView defaultModule="maps" />}
          {activeTab === 'meddic' && <PowerSuiteView defaultModule="meddic" />}
          {activeTab === 'campaigns' && <PowerSuiteView defaultModule="campaigns" />}
          {activeTab === 'aiAssistant' && <PowerSuiteView defaultModule="gemini" />}
          {activeTab === 'gtmStrategy' && <PowerSuiteView defaultModule="gtm" />}
          {activeTab === 'sdrOutreach' && <PowerSuiteView defaultModule="sdr" />}
          {activeTab === 'adCopy' && <PowerSuiteView defaultModule="adcopy" />}
          {activeTab === 'payments' && <PlatformBillingView />}
          {activeTab === 'clientPortal' && <PowerSuiteView defaultModule="portal" />}
          {activeTab === 'seoSuite' && <PowerSuiteView defaultModule="seo" />}
          {activeTab === 'webDev' && <PowerSuiteView defaultModule="webdev" />}
          {activeTab === 'customObjects' && <CustomObjectsView />}
          {activeTab === 'workflows' && <WorkflowsView />}
          {activeTab === 'csvStudio' && <CSVStudioView />}
          {activeTab === 'agenteOS' && <AgenteOSView />}
          {activeTab === 'propuestas' && <Propuestas />}
          {activeTab === 'googleMaps' && <ModuleProspeccionMaps />}
          {activeTab === 'domainManager' && <PublicDomainManagerPage />}
          {activeTab === 'campusLMS' && <CampusLMSView />}
          {activeTab === 'tiendaDigital' && <TiendaDigitalView />}
          {activeTab === 'industryLanding' && (
            <IndustryLandingPage
              onOpenWizard={() => setIsWizardOpen(true)}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
              onBackToHome={() => setActiveTab('dashboard')}
            />
          )}
          {activeTab === 'teamManagement' && <TeamView />}
          {activeTab === 'integrationSettings' && <IntegrationSettingsView />}
          {(activeTab === 'settings' || activeTab === 'rbacRoles' || activeTab === 'auditLogs' || activeTab === 'apiIntegrations') && <SettingsView />}
          {activeTab === 'webmail' && <WebmailInboxView />}
          {activeTab === 'erpAvanzado' && <ErpAvanzadoDashboardPage />}
          {activeTab === 'vscrmSuite' && <VscrmSuitePage />}
          {activeTab === 'wordpressIntegracion' && <WordPressIntegracionPage />}
          {activeTab === 'adminConsole' && <AdminConsoleDashboardPage />}
          {activeTab === 'workspaceIntegrations' && <GoogleWorkspaceDashboardPage />}
          {(activeTab === 'dashboardDocs' || activeTab === 'documentManagement') && <DashboardDocsExplorerPage />}
          {activeTab === 'competitorHub' && <CompetitorHubView />}
        </Suspense>
      </main>

      <RecordDrawer />
      <CommandPalette />
      <NewRecordModal />
      <AICopilotModal />
      <AuthModal />
      <ComposeEmailModal
        isOpen={isComposeEmailModalOpen}
        onClose={closeComposeEmailModal}
        initialDefaults={composeEmailDefaults}
      />
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <QuoteWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
      <WhatsAppSimulatorModal isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />
      <ExpressAuditModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />
      <AICopilotFloating />
      <ToastContainer />
      <TutorialOnboardingModal />
      <MercadoPagoSubscriptionModal
        isOpen={isMpCheckoutModalOpen}
        onClose={() => setIsMpCheckoutModalOpen(false)}
        initialPlan={selectedCheckoutPlan}
      />
    </div>
  );
};

export const PrivateEnvironment: React.FC = () => (
  <div className="clientum-light-dashboard flex h-[100dvh] min-h-screen w-screen overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] font-['Inter',sans-serif]">
    <Sidebar />
    <MainContent />
  </div>
);
