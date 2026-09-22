import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Calculator,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Copy,
  Check,
  Zap,
  Sparkles,
  Building2,
  Users,
  Receipt,
  MessageSquare,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  Clock,
  Briefcase,
  Play,
  RotateCcw,
  CheckSquare
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { StageId, Opportunity } from '../../types';

interface MigrationPreviewRecord {
  sourceId: string;
  name: string;
  companyName: string;
  contactName: string;
  amount: number;
  currency: string;
  sourceStage: string;
  mappedStage: StageId;
  closeDate: string;
  sourceSystem: 'HubSpot' | 'Salesforce';
}

const HUBSPOT_SAMPLE_DEALS: MigrationPreviewRecord[] = [
  {
    sourceId: 'HS-DEAL-901',
    name: 'Implementación Omnicanal WhatsApp & Facturación',
    companyName: 'Logística Austral S.R.L.',
    contactName: 'Mariana Benítez',
    amount: 18500,
    currency: 'USD',
    sourceStage: 'contractsent',
    mappedStage: 'proposal',
    closeDate: '2026-09-30',
    sourceSystem: 'HubSpot',
  },
  {
    sourceId: 'HS-DEAL-902',
    name: 'Plataforma B2B y Catálogo Digital',
    companyName: 'Distribuidora San Telmo',
    contactName: 'Carlos Mendonça',
    amount: 24000,
    currency: 'USD',
    sourceStage: 'decisionmakerbought',
    mappedStage: 'negotiation',
    closeDate: '2026-10-15',
    sourceSystem: 'HubSpot',
  },
  {
    sourceId: 'HS-DEAL-903',
    name: 'Suscripción CRM 25 Asientos + ERP Stock',
    companyName: 'Grupo Farmacéutico Andino',
    contactName: 'Valeria Rossi',
    amount: 32000,
    currency: 'USD',
    sourceStage: 'closedwon',
    mappedStage: 'won',
    closeDate: '2026-09-10',
    sourceSystem: 'HubSpot',
  },
  {
    sourceId: 'HS-DEAL-904',
    name: 'Integración Pasarela Pagos y Webmail Worker',
    companyName: 'Retail Express LatAm',
    contactName: 'Diego Albarracín',
    amount: 12000,
    currency: 'USD',
    sourceStage: 'qualifiedtobuy',
    mappedStage: 'qualified',
    closeDate: '2026-11-05',
    sourceSystem: 'HubSpot',
  },
  {
    sourceId: 'HS-DEAL-905',
    name: 'Auditoría y Automatizaciones Flujos DAG',
    companyName: 'Fintech Solutions CABA',
    contactName: 'Esteban Paz',
    amount: 9500,
    currency: 'USD',
    sourceStage: 'appointmentscheduled',
    mappedStage: 'discovery',
    closeDate: '2026-10-20',
    sourceSystem: 'HubSpot',
  },
];

const SALESFORCE_SAMPLE_DEALS: MigrationPreviewRecord[] = [
  {
    sourceId: 'SF-OPP-4401',
    name: 'Migración Enterprise 45 Licencias + Facturación AFIP',
    companyName: 'TechCorp Argentina S.A.',
    contactName: 'Martín Gómez',
    amount: 45000,
    currency: 'USD',
    sourceStage: 'Proposal/Price Quote',
    mappedStage: 'proposal',
    closeDate: '2026-10-02',
    sourceSystem: 'Salesforce',
  },
  {
    sourceId: 'SF-OPP-4402',
    name: 'Suite Operaciones Comerciales y WhatsApp Multiagente',
    companyName: 'Agroquímica Pampa Verde',
    contactName: 'Florencia Dávalos',
    amount: 28000,
    currency: 'USD',
    sourceStage: 'Value Proposition',
    mappedStage: 'qualified',
    closeDate: '2026-10-18',
    sourceSystem: 'Salesforce',
  },
  {
    sourceId: 'SF-OPP-4403',
    name: 'Implementación ERP y Facturación CAE Automático',
    companyName: 'Distribuidora Cuyo Mayorista',
    contactName: 'Roberto Salvatierra',
    amount: 36500,
    currency: 'USD',
    sourceStage: 'Negotiation/Review',
    mappedStage: 'negotiation',
    closeDate: '2026-09-29',
    sourceSystem: 'Salesforce',
  },
  {
    sourceId: 'SF-OPP-4404',
    name: 'Renovación Anual CRM + Tienda Digital B2B',
    companyName: 'Inmobiliaria & Desarrollos Río de la Plata',
    contactName: 'Laura Echeverría',
    amount: 52000,
    currency: 'USD',
    sourceStage: 'Closed Won',
    mappedStage: 'won',
    closeDate: '2026-09-05',
    sourceSystem: 'Salesforce',
  },
  {
    sourceId: 'SF-OPP-4405',
    name: 'Relevamiento Inicial y Consultoría MEDDIC',
    companyName: 'Constructora del Centro',
    contactName: 'Gonzalo Peñaloza',
    amount: 14000,
    currency: 'USD',
    sourceStage: 'Qualification',
    mappedStage: 'discovery',
    closeDate: '2026-11-12',
    sourceSystem: 'Salesforce',
  },
];

export const CompetitorHubView: React.FC = () => {
  const { addOpportunity, addCompany, addPerson, showToast, triggerConfetti, setActiveTab } = useCRM();

  const [activeSubTab, setActiveSubTab] = useState<'migration' | 'calculator' | 'battlecards' | 'matrix'>('migration');
  const [selectedSource, setSelectedSource] = useState<'HubSpot' | 'Salesforce'>('HubSpot');
  const [migrationData, setMigrationData] = useState<MigrationPreviewRecord[]>(HUBSPOT_SAMPLE_DEALS);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  // TCO Calculator State
  const [seatCount, setSeatCount] = useState<number>(10);
  const [contactCount, setContactCount] = useState<number>(15000);
  const [needsWhatsApp, setNeedsWhatsApp] = useState<boolean>(true);
  const [needsAFIPBilling, setNeedsAFIPBilling] = useState<boolean>(true);
  const [hasCopiedCase, setHasCopiedCase] = useState<boolean>(false);
  const [hasCopiedPitch, setHasCopiedPitch] = useState<string | null>(null);

  // Switcher between demo datasets
  const handleSelectSource = (source: 'HubSpot' | 'Salesforce') => {
    setSelectedSource(source);
    setMigrationData(source === 'HubSpot' ? HUBSPOT_SAMPLE_DEALS : SALESFORCE_SAMPLE_DEALS);
    setImportSuccessCount(null);
  };

  // Run the actual migration into Clientum CRM state
  const handleExecuteMigration = () => {
    setIsImporting(true);

    setTimeout(() => {
      let createdCount = 0;
      for (const item of migrationData) {
        // 1. Create Company
        addCompany({
          name: item.companyName,
          domain: `${item.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.ar`,
          industry: 'Servicios & Comercio B2B',
          employees: '25-100',
          tier: 'Mid-Market',
          healthScore: 92,
          assignedTo: 'Equipo de Cuentas Clientum',
        });

        // 2. Create Person
        const nameParts = item.contactName.split(' ');
        addPerson({
          firstName: nameParts[0] || 'Contacto',
          lastName: nameParts.slice(1).join(' ') || 'Comercial',
          email: `${nameParts[0].toLowerCase()}@${item.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.ar`,
          phone: '+54 9 11 5555-' + Math.floor(1000 + Math.random() * 9000),
          jobTitle: 'Gerente de Compras & Operaciones',
          companyName: item.companyName,
          status: 'Lead',
        });

        // 3. Create Opportunity in CRM Pipeline
        addOpportunity({
          name: item.name,
          amount: item.amount,
          currency: item.currency,
          stage: item.mappedStage,
          closeDate: item.closeDate,
          probability: item.mappedStage === 'won' ? 100 : item.mappedStage === 'negotiation' ? 80 : item.mappedStage === 'proposal' ? 60 : 40,
          companyName: item.companyName,
          contactName: item.contactName,
          assignedTo: 'Equipo de Cuentas Clientum',
          priority: item.amount > 25000 ? 'High' : 'Medium',
          type: 'New Business',
          tags: [`Migración ${item.sourceSystem}`, 'B2B', 'Switch 2026'],
        });

        createdCount++;
      }

      setIsImporting(false);
      setImportSuccessCount(createdCount);
      triggerConfetti();
      showToast(
        `¡Migración exitosa! Se importaron ${createdCount} negocios, empresas y contactos desde ${selectedSource} al Pipeline.`,
        'success'
      );
    }, 800);
  };

  // TCO Calculations
  const tcoMetrics = useMemo(() => {
    // 1. HubSpot Cost
    // Sales Hub Pro: $100/user/mo ($1200/user/yr)
    // Contact Tier: $50/mo per 5k contacts beyond base 2k
    const hsExtraContactTiers = Math.max(0, Math.ceil((contactCount - 2000) / 5000));
    const hsContactCostPerYear = hsExtraContactTiers * 50 * 12;
    const hsSeatsPerYear = seatCount * 100 * 12;
    const hsWhatsAppAddon = needsWhatsApp ? 120 * 12 : 0; // Twilio / BSP monthly costs
    const hsAFIPIntegration = needsAFIPBilling ? 150 * 12 : 0; // Zapier / Custom connector
    const hsMandatoryOnboarding = 3000; // HubSpot Pro mandatory setup fee
    const hsTotalYear = hsSeatsPerYear + hsContactCostPerYear + hsWhatsAppAddon + hsAFIPIntegration + hsMandatoryOnboarding;

    // 2. Salesforce Cost
    // Sales Cloud Enterprise: $165/user/mo ($1980/user/yr)
    const sfSeatsPerYear = seatCount * 165 * 12;
    const sfWhatsAppAddon = needsWhatsApp ? seatCount * 75 * 12 : 0; // Digital engagement licenses
    const sfAFIPIntegration = needsAFIPBilling ? 250 * 12 : 0; // Integration middleware
    const sfConsultingSetup = 5000; // Certified administrator / partner configuration
    const sfTotalYear = sfSeatsPerYear + sfWhatsAppAddon + sfAFIPIntegration + sfConsultingSetup;

    // 3. ClientumOS Cost (Full suite, no contact penalties, native AFIP & WhatsApp)
    // $35/user/mo flat
    const clSeatsPerYear = seatCount * 35 * 12;
    const clTotalYear = clSeatsPerYear; // No onboarding extortion, no contact penalties

    const savingsVsHubSpot = Math.max(0, hsTotalYear - clTotalYear);
    const savingsVsSalesforce = Math.max(0, sfTotalYear - clTotalYear);
    const percentSavingsVsHubSpot = Math.round((savingsVsHubSpot / hsTotalYear) * 100);
    const percentSavingsVsSalesforce = Math.round((savingsVsSalesforce / sfTotalYear) * 100);

    return {
      hsTotalYear,
      sfTotalYear,
      clTotalYear,
      savingsVsHubSpot,
      savingsVsSalesforce,
      percentSavingsVsHubSpot,
      percentSavingsVsSalesforce,
    };
  }, [seatCount, contactCount, needsWhatsApp, needsAFIPBilling]);

  const copyExecutiveBusinessCase = () => {
    const text = `RESUMEN EJECUTIVO - EVALUACIÓN TCO & ROI
Plataforma: ClientumOS vs. HubSpot & Salesforce
Fecha: Septiembre 2026

1. PARÁMETROS DE EVALUACIÓN:
- Asientos comerciales requeridos: ${seatCount} ejecutivos
- Base de datos comercial: ${contactCount.toLocaleString()} contactos
- Módulos críticos incluidos: Facturación AFIP (CAE directo), WhatsApp Multiagente nativo, ERP de Stock, Copilot IA con Gemini.

2. COMPARATIVA DE COSTO ANUAL TOTAL (TCO):
- HubSpot Sales Hub Pro + Tiers + Onboarding: $${tcoMetrics.hsTotalYear.toLocaleString()} USD / año
- Salesforce Sales Cloud Enterprise + Add-ons + Consultoría: $${tcoMetrics.sfTotalYear.toLocaleString()} USD / año
- ClientumOS (Todo Incluido sin costos ocultos): $${tcoMetrics.clTotalYear.toLocaleString()} USD / año

3. IMPACTO FINANCIERO & AHORRO:
- Ahorro anual estimado vs HubSpot: $${tcoMetrics.savingsVsHubSpot.toLocaleString()} USD (${tcoMetrics.percentSavingsVsHubSpot}%)
- Ahorro anual estimado vs Salesforce: $${tcoMetrics.savingsVsSalesforce.toLocaleString()} USD (${tcoMetrics.percentSavingsVsSalesforce}%)
- Retorno de inversión (Payback): Inmediato (Puesta en marcha en 48 horas sin honorarios de consultoría obligatoria).

4. BENEFICIOS OPERATIVOS REGIONALES:
- Facturación con CAE nativo en el mismo pipeline (sin conectores externos).
- WhatsApp sin cobro punitivo por mensaje y con soporte en español local.`;

    navigator.clipboard.writeText(text);
    setHasCopiedCase(true);
    showToast('Resumen ejecutivo copiado al portapapeles. Listo para presentar a Dirección o CFO.', 'success');
    setTimeout(() => setHasCopiedCase(false), 3000);
  };

  const copyPitch = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopiedPitch(id);
    showToast('Argumento táctico copiado al portapapeles.', 'success');
    setTimeout(() => setHasCopiedPitch(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-muted)] dark:bg-[#0b1329] text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-100 overflow-y-auto">
      {/* Header Banner */}
      <div className="border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800/80 bg-[var(--bg-card)] dark:bg-[#0f172a] px-6 py-5 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Zap className="w-3.5 h-3.5" /> Suite Competitiva & Migración
              </span>
              <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">vs HubSpot & Salesforce</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] dark:text-white">
              Centro de Migración, Ahorro TCO & Battlecards
            </h1>
            <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 max-w-2xl">
              Herramientas de nivel empresarial para comparar costos, rebatir objeciones y migrar oportunidades y contactos en 1 clic desde HubSpot y Salesforce sin fricción técnica.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('opportunities')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 bg-[var(--bg-muted)] dark:bg-slate-800 hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-blue-500" /> Ir al Pipeline Kanban
            </button>
            <button
              onClick={copyExecutiveBusinessCase}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer"
            >
              {hasCopiedCase ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{hasCopiedCase ? '¡Copiado!' : 'Copiar Business Case CFO'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-6 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 -mb-5">
          <button
            onClick={() => setActiveSubTab('migration')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${ activeSubTab === 'migration' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            <ArrowLeftRight className="w-4 h-4" /> Migrador 1-Click (HubSpot / Salesforce)
          </button>
          <button
            onClick={() => setActiveSubTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${ activeSubTab === 'calculator' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            <Calculator className="w-4 h-4" /> Calculadora TCO & Ahorro Real (82%)
          </button>
          <button
            onClick={() => setActiveSubTab('battlecards')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${ activeSubTab === 'battlecards' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            <ShieldCheck className="w-4 h-4" /> Battlecards & Manejo de Objeciones
          </button>
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${ activeSubTab === 'matrix' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            <Layers className="w-4 h-4" /> Matriz de Comparación (22 Funciones)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: 1-CLICK MIGRATION WIZARD */}
        {/* ========================================================================= */}
        {activeSubTab === 'migration' && (
          <div className="space-y-6">
            {/* Top Explanation Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-700/40 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                      Asistente Inteligente de Migración 1-Click
                    </h2>
                    <p className="text-xs text-blue-200/80 mt-0.5">
                      Exporta tus negocios (Deals/Opportunities), contactos y cuentas desde HubSpot o Salesforce y múdalos a Clientum en segundos con mapeo de etapas automático.
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                  <button
                    onClick={() => handleSelectSource('HubSpot')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${ selectedSource === 'HubSpot' ? 'bg-orange-500 text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
                  >
                    Dataset HubSpot Deals
                  </button>
                  <button
                    onClick={() => handleSelectSource('Salesforce')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${ selectedSource === 'Salesforce' ? 'bg-sky-500 text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
                  >
                    Dataset Salesforce Opty
                  </button>
                </div>
              </div>
            </div>

            {/* Step 1 & 2 Mappings Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--bg-card)] dark:bg-[#0f172a] border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">Paso 1: Origen</span>
                <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 mt-1 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-500" /> Formato Compatible
                </h3>
                <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
                  Acepta exportaciones directas en CSV o JSON desde el panel de HubSpot (Sales Hub) o Salesforce Report Export.
                </p>
              </div>

              <div className="bg-[var(--bg-card)] dark:bg-[#0f172a] border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">Paso 2: Auto-Mapeo</span>
                <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 mt-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" /> Etapas Homologadas
                </h3>
                <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
                  Mapeo directo: <em>contractsent / Proposal</em> &rarr; Propuesta, <em>closedwon</em> &rarr; Ganada, <em>qualifiedtobuy</em> &rarr; Calificada.
                </p>
              </div>

              <div className="bg-[var(--bg-card)] dark:bg-[#0f172a] border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">Paso 3: Cero Pérdidas</span>
                <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500" /> Integridad de Datos
                </h3>
                <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
                  Crea automáticamente las Empresas y Contactos asociados vinculados a la oportunidad sin duplicados.
                </p>
              </div>
            </div>

            {/* Preview Table */}
            <div className="bg-[var(--bg-card)] dark:bg-[#0f172a] border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[var(--bg-muted)]/50 dark:bg-slate-900/30">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
                    <span>Vista Previa de Registros a Migrar ({migrationData.length} Negocios)</span>
                    <span className="text-xs font-normal text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      Total a incorporar: ${migrationData.reduce((acc, d) => acc + d.amount, 0).toLocaleString()} USD
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                    Revisa las columnas antes de consolidar la migración definitiva a tu CRM.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExecuteMigration}
                    disabled={isImporting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                  >
                    {isImporting ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Migrando registros...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ejecutar Migración Inmediata</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {importSuccessCount !== null && (
                <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>¡Éxito comprobado!</strong> Se migraron correctamente <strong>{importSuccessCount}</strong> oportunidades y sus respectivas cuentas y contactos al pipeline activo de Clientum.
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('opportunities')}
                    className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-500 transition-colors"
                  >
                    Ver en Kanban
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">
                  <thead className="bg-[var(--bg-muted)] dark:bg-slate-800/60 text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">ID Origen</th>
                      <th className="px-4 py-3">Negocio / Deal</th>
                      <th className="px-4 py-3">Empresa</th>
                      <th className="px-4 py-3">Contacto Asignado</th>
                      <th className="px-4 py-3">Monto</th>
                      <th className="px-4 py-3">Etapa en {selectedSource}</th>
                      <th className="px-4 py-3">Mapeo en Clientum</th>
                      <th className="px-4 py-3">Cierre Estimado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] dark:divide-slate-800">
                    {migrationData.map((row) => (
                      <tr key={row.sourceId} className="hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">{row.sourceId}</td>
                        <td className="px-4 py-3 font-semibold text-[var(--text-primary)] dark:text-white">{row.name}</td>
                        <td className="px-4 py-3 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                          <span>{row.companyName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">
                            <Users className="w-3.5 h-3.5 text-blue-500" /> {row.contactName}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                          ${row.amount.toLocaleString()} {row.currency}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                          {row.sourceStage}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                            <Check className="w-3 h-3 text-blue-500" /> {row.mappedStage.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-muted,#64748b)] dark:text-slate-400">{row.closeDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TCO CALCULATOR & ROI */}
        {/* ========================================================================= */}
        {activeSubTab === 'calculator' && (
          <div className="space-y-6">
            {/* Calculator Header & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-[var(--bg-card)] dark:bg-[#0f172a] border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-5">
                <div className="border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-indigo-500" /> Parámetros de tu Empresa
                  </h3>
                  <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                    Modifica los valores para calcular la fuga de dinero en licencias tradicionales.
                  </p>
                </div>

                {/* Seat Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">Vendedores / Asientos:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{seatCount} usuarios</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="60"
                    step="1"
                    value={seatCount}
                    onChange={(e) => setSeatCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-[var(--bg-muted)] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
                    <span>2 usuarios</span>
                    <span>30</span>
                    <span>60 usuarios</span>
                  </div>
                </div>

                {/* Contact Count Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">Base de Contactos:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                      {contactCount.toLocaleString()} contactos
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="60000"
                    step="1000"
                    value={contactCount}
                    onChange={(e) => setContactCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-[var(--bg-muted)] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <p className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
                    *HubSpot cobra penalidades mensuales a partir de 2,000 contactos. En Clientum no hay cobro punitivo.
                  </p>
                </div>

                {/* Add-ons Toggles */}
                <div className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Multiagente Oficial
                    </span>
                    <input
                      type="checkbox"
                      checked={needsWhatsApp}
                      onChange={(e) => setNeedsWhatsApp(e.target.checked)}
                      className="rounded border-[var(--border-default)] text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-blue-500" /> Facturación AFIP & CAE Directo
                    </span>
                    <input
                      type="checkbox"
                      checked={needsAFIPBilling}
                      onChange={(e) => setNeedsAFIPBilling(e.target.checked)}
                      className="rounded border-[var(--border-default)] text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </label>
                </div>

                <button
                  onClick={copyExecutiveBusinessCase}
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar Propuesta para Directorio
                </button>
              </div>

              {/* TCO Cards Result */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* HubSpot Card */}
                <div className="bg-[var(--bg-card)] dark:bg-[#0f172a] border border-orange-200 dark:border-orange-950/60 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                        HubSpot
                      </span>
                      <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">Sales Pro</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-2xl font-black text-[var(--text-primary)] dark:text-white">
                        ${tcoMetrics.hsTotalYear.toLocaleString()}
                      </span>
                      <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 block mt-0.5">USD / año total</span>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      <li className="flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>+$50 USD/mes por cada 5k contactos adicionales</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>$3,000 USD de Setup / Onboarding obligatorio</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>Sin facturación AFIP nativa (requiere Zapier)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                    Costo mensual: ~${Math.round(tcoMetrics.hsTotalYear / 12).toLocaleString()} USD/mes
                  </div>
                </div>

                {/* Salesforce Card */}
                <div className="bg-[var(--bg-card)] dark:bg-[#0f172a] border border-sky-200 dark:border-sky-950/60 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                        Salesforce
                      </span>
                      <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">Enterprise</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-2xl font-black text-[var(--text-primary)] dark:text-white">
                        ${tcoMetrics.sfTotalYear.toLocaleString()}
                      </span>
                      <span className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 block mt-0.5">USD / año total</span>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      <li className="flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>$165 USD/usuario/mes básico</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>WhatsApp exige Digital Engagement ($75/u)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>Honorarios consultores certificados ($5,000+)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                    Costo mensual: ~${Math.round(tcoMetrics.sfTotalYear / 12).toLocaleString()} USD/mes
                  </div>
                </div>

                {/* ClientumOS Winner Card */}
                <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900 border-2 border-indigo-500 rounded-xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full uppercase tracking-wider">
                    Ahorro hasta 85%
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        ClientumOS
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-3xl font-black text-[var(--text-primary,#0f172a)] dark:text-white">
                        ${tcoMetrics.clTotalYear.toLocaleString()}
                      </span>
                      <span className="text-xs text-indigo-200/70 block mt-0.5">USD / año todo incluido</span>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs text-indigo-100">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Facturación AFIP con CAE nativo incluido</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>WhatsApp multiagente sin costo extra</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Contactos ilimitados sin aumentos sorpresa</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Puesta en marcha en 48 horas sin consultores</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-indigo-700/50 text-xs font-bold text-emerald-400">
                    Ahorro vs HubSpot: ${tcoMetrics.savingsVsHubSpot.toLocaleString()} USD ({tcoMetrics.percentSavingsVsHubSpot}%)
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Big Callout */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                    Ahorro estimado de capital para tu empresa: ${tcoMetrics.savingsVsHubSpot.toLocaleString()} USD al año
                  </h3>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    Equivalente a más de $35.000.000 ARS reinyectables en pauta publicitaria, contrataciones o margen operativo neto.
                  </p>
                </div>
              </div>

              <button
                onClick={copyExecutiveBusinessCase}
                className="px-4 py-2.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shrink-0 shadow-md cursor-pointer"
              >
                Descargar / Copiar Caso para CFO
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BATTLECARDS & OBJECTION HANDLING */}
        {/* ========================================================================= */}
        {activeSubTab === 'battlecards' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Battlecard 1: vs HubSpot */}
            <div className="bg-[var(--bg-card)] dark:bg-[#0f172a] border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-lg bg-orange-500/10 text-orange-500 font-bold flex items-center justify-center text-xs">
                    HS
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                      Clientum vs. HubSpot (Sales & Marketing Hub)
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Argumentos tácticos para cerrar prospectos</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Ventaja: Operación LatAm
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[var(--bg-muted)] dark:bg-slate-900/60 rounded-lg border border-[var(--border-subtle)]/70 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
                  <span className="font-bold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 block mb-1">
                    🎯 El Golpe Maestro (Killer Feature):
                  </span>
                  <p className="text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    <strong>Facturación AFIP y WhatsApp sin fricción:</strong> HubSpot no emite facturas con CAE ni descuenta stock físico. Clientum factura en 1 click al cerrar la oportunidad comercial y envía la factura en PDF por WhatsApp al comprador.
                  </p>
                </div>

                <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900/40">
                  <span className="font-bold text-rose-700 dark:text-rose-300 block mb-1">
                    ⚠️ La Trampa Oculta de HubSpot:
                  </span>
                  <p className="text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Cobra por <strong>contactos de marketing</strong>. Cuando tu base supera los 10k o 20k registros, el costo de la suscripción se dispara miles de dólares sin importar si esos contactos compran o no.
                  </p>
                </div>

                {/* Objection Script */}
                <div className="p-3 bg-slate-900 text-[var(--text-primary,#0f172a)] dark:text-slate-200 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-amber-400 text-[11px]">
                      🗣️ Objeción: &quot;Ya estamos cómodos con las plantillas de email de HubSpot&quot;
                    </span>
                    <button
                      onClick={() =>
                        copyPitch(
                          'hs1',
                          'Entendemos el valor del email, pero hoy el 85% de las conversiones en nuestra región ocurren en WhatsApp. Con Clientum tienes webmail corporativo completo Y WhatsApp multiagente con IA en una misma pantalla, además de facturación directa sin pagar conectores extra.'
                        )
                      }
                      className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {hasCopiedPitch === 'hs1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copiar Guion</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300 italic">
                    &quot;Entendemos el valor del email, pero hoy el 85% de las conversiones en nuestra región ocurren en WhatsApp. Con Clientum tienes webmail corporativo completo Y WhatsApp multiagente con IA en una misma pantalla, además de facturación directa sin pagar conectores extra.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Battlecard 2: vs Salesforce */}
            <div className="bg-[var(--bg-card)] dark:bg-[#0f172a] border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-lg bg-sky-500/10 text-sky-500 font-bold flex items-center justify-center text-xs">
                    SF
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                      Clientum vs. Salesforce (Sales Cloud)
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Argumentos tácticos para cuentas Mid-Market y Enterprise</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Ventaja: Time-to-Value
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[var(--bg-muted)] dark:bg-slate-900/60 rounded-lg border border-[var(--border-subtle)]/70 dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
                  <span className="font-bold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 block mb-1">
                    🎯 El Golpe Maestro (Killer Feature):
                  </span>
                  <p className="text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    <strong>Adopción en 48 horas vs 6 meses:</strong> Salesforce requiere contratos anuales cautivos, parametrización en código Apex y pagar consultores externos. Clientum se configura visualmente en 1 día y el equipo lo adopta de inmediato.
                  </p>
                </div>

                <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900/40">
                  <span className="font-bold text-rose-700 dark:text-rose-300 block mb-1">
                    ⚠️ La Trampa Oculta de Salesforce:
                  </span>
                  <p className="text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    Ecosistema fragmentado: cada módulo se cobra por separado (Sales Cloud, Service Cloud, Digital Engagement, CPQ). El costo final real de la factura suele triplicar la cotización inicial.
                  </p>
                </div>

                {/* Objection Script */}
                <div className="p-3 bg-slate-900 text-[var(--text-primary,#0f172a)] dark:text-slate-200 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sky-400 text-[11px]">
                      🗣️ Objeción: &quot;Nuestra casa matriz nos exige Salesforce por gobernanza&quot;
                    </span>
                    <button
                      onClick={() =>
                        copyPitch(
                          'sf1',
                          'Para la operación local en LatAm, los vendedores evitan cargar datos en Salesforce por ser lento y sobrecargado. Clientum funciona como la capa ágil de ejecución en español con WhatsApp y AFIP, sincronizable con su central vía API abierta.'
                        )
                      }
                      className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {hasCopiedPitch === 'sf1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copiar Guion</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300 italic">
                    &quot;Para la operación local en LatAm, los vendedores evitan cargar datos en Salesforce por ser lento y sobrecargado. Clientum funciona como la capa ágil de ejecución en español con WhatsApp y AFIP, sincronizable con su central vía API abierta.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FEATURE-BY-FEATURE MATRIX */}
        {/* ========================================================================= */}
        {activeSubTab === 'matrix' && (
          <div className="bg-[var(--bg-card)] dark:bg-[#0f172a] border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 bg-[var(--bg-muted)]/50 dark:bg-slate-900/30">
              <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                Matriz Comparativa de Capacidades Clave
              </h3>
              <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">
                Comparación directa entre ClientumOS, HubSpot Sales Hub y Salesforce Sales Cloud.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-muted)] dark:bg-slate-800 text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-5 py-3">Funcionalidad</th>
                    <th className="px-5 py-3 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-black">
                      ClientumOS
                    </th>
                    <th className="px-5 py-3">HubSpot</th>
                    <th className="px-5 py-3">Salesforce</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] dark:divide-slate-800">
                  {[
                    {
                      feat: 'Pipeline Kanban con Lead Scoring MEDDIC',
                      cl: 'Nativo',
                      hs: 'Nativo',
                      sf: 'Nativo',
                    },
                    {
                      feat: 'Facturación Electrónica AFIP (CAE nativo)',
                      cl: 'Nativo (Facturas A, B, C)',
                      hs: 'No (Exige ERP externo)',
                      sf: 'No (Requiere conector pago)',
                    },
                    {
                      feat: 'WhatsApp Multiagente & Baileys QR',
                      cl: 'Nativo sin costo por mensaje',
                      hs: 'Add-on con cobro por mensaje',
                      sf: 'Add-on Digital Engagement ($75/u)',
                    },
                    {
                      feat: 'Control de Stock e Inventario por SKU',
                      cl: 'Nativo (ERP integrado)',
                      hs: 'No disponible',
                      sf: 'No (Requiere módulo Commerce/ERP)',
                    },
                    {
                      feat: 'Storefront B2B & Catálogo WhatsApp',
                      cl: 'Nativo incluido',
                      hs: 'No disponible',
                      sf: 'Requiere Salesforce Commerce Cloud',
                    },
                    {
                      feat: 'Prospección Geográfica con Google Maps',
                      cl: 'Nativo con buscador de ICPs',
                      hs: 'No disponible',
                      sf: 'Requiere add-on Salesforce Maps',
                    },
                    {
                      feat: 'Copilot IA Generativa (Gemini 2.5)',
                      cl: 'Nativo incluido',
                      hs: 'HubSpot Breeze (Créditos)',
                      sf: 'Einstein AI (Plan Enterprise)',
                    },
                    {
                      feat: 'Costo punitivo por contactos acumulados',
                      cl: 'Sin cobro punitivo',
                      hs: 'Sí (+$50/5k contactos)',
                      sf: 'No en Sales Cloud básico',
                    },
                    {
                      feat: 'Tarifa de Onboarding / Setup obligatoria',
                      cl: '$0 USD (Autoservicio ágil)',
                      hs: '$3,000 - $6,000 USD obligatorio',
                      sf: '$5,000+ USD en consultores',
                    },
                    {
                      feat: 'Facturación y cobro en moneda local (ARS / USD)',
                      cl: 'Sí (Mercado Pago / Transferencia)',
                      hs: 'Solo USD con tarjeta internacional',
                      sf: 'Solo contratos corporativos USD',
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3 font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200">{row.feat}</td>
                      <td className="px-5 py-3 font-bold text-emerald-600 dark:text-emerald-400 bg-indigo-50/30 dark:bg-indigo-950/20">
                        {row.cl}
                      </td>
                      <td className="px-5 py-3 text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">{row.hs}</td>
                      <td className="px-5 py-3 text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">{row.sf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
