import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Building2,
  Users2,
  CheckSquare,
  Plus,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { STAGES } from '../../data/initialData';
import { StageId } from '../../types';

export const NewRecordModal: React.FC = () => {
  const {
    isNewRecordModalOpen,
    setIsNewRecordModalOpen,
    newRecordType,
    setNewRecordType,
    addOpportunity,
    addCompany,
    addPerson,
    addTask,
    companies,
    people,
    currentUser,
    t,
  } = useCRM();

  // Opportunity state
  const [dealName, setDealName] = useState('');
  const [dealAmount, setDealAmount] = useState('50000');
  const [dealStage, setDealStage] = useState<StageId>('lead');
  const [dealCloseDate, setDealCloseDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dealCompanyId, setDealCompanyId] = useState('');
  const [dealPriority, setDealPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [dealTags, setDealTags] = useState('Enterprise, Cloud');

  // Company state
  const [companyName, setCompanyName] = useState('');
  const [companyDomain, setCompanyDomain] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('SaaS / Software');
  const [companyEmployees, setCompanyEmployees] = useState('50-100');
  const [companyArr, setCompanyArr] = useState('50000');
  const [companyTier, setCompanyTier] = useState<'Enterprise' | 'Scaleup' | 'Startup'>('Scaleup');
  const [companyDesc, setCompanyDesc] = useState('');

  // Person state
  const [personFirstName, setPersonFirstName] = useState('');
  const [personLastName, setPersonLastName] = useState('');
  const [personEmail, setPersonEmail] = useState('');
  const [personPhone, setPersonPhone] = useState('+1 (555) 000-0000');
  const [personJobTitle, setPersonJobTitle] = useState('VP of Product');
  const [personCompanyId, setPersonCompanyId] = useState('');
  const [personStatus, setPersonStatus] = useState<'Lead' | 'Contacted' | 'Customer'>('Lead');

  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('High');

  if (!isNewRecordModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newRecordType === 'opportunity') {
      if (!dealName.trim()) return;
      const comp = companies.find((c) => c.id === dealCompanyId);
      addOpportunity({
        name: dealName,
        amount: Number(dealAmount) || 0,
        currency: 'USD',
        stage: dealStage,
        closeDate: dealCloseDate,
        probability: STAGES.find((s) => s.id === dealStage)?.probability || 50,
        companyId: comp?.id,
        companyName: comp?.name,
        assignedTo: currentUser.name,
        priority: dealPriority,
        type: 'New Business',
        tags: dealTags.split(',').map((t) => t.trim()).filter(Boolean),
      });
    } else if (newRecordType === 'company') {
      if (!companyName.trim()) return;
      addCompany({
        name: companyName,
        domain: companyDomain || `${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        industry: companyIndustry,
        employees: companyEmployees,
        arr: Number(companyArr) || 0,
        tier: companyTier,
        healthScore: 85,
        assignedTo: currentUser.name,
        description: companyDesc,
      });
    } else if (newRecordType === 'person') {
      if (!personFirstName.trim()) return;
      const comp = companies.find((c) => c.id === personCompanyId);
      addPerson({
        firstName: personFirstName,
        lastName: personLastName,
        email: personEmail || `${personFirstName.toLowerCase()}@${comp?.domain || 'company.com'}`,
        phone: personPhone,
        jobTitle: personJobTitle,
        companyId: comp?.id,
        companyName: comp?.name,
        status: personStatus,
        assignedTo: currentUser.name,
      });
    } else if (newRecordType === 'task') {
      if (!taskTitle.trim()) return;
      addTask({
        title: taskTitle,
        description: taskDesc,
        dueDate: taskDueDate,
        priority: taskPriority,
        status: 'Todo',
        assignedTo: currentUser.name,
      });
    }

    setIsNewRecordModalOpen(false);
  };

  return (
    <div
      id="new-record-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setIsNewRecordModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#242b3d] rounded-2xl shadow-2xl overflow-hidden text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Type selector */}
        <div className="p-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] flex items-center justify-between bg-[var(--bg-card,#ffffff)] dark:bg-[#151924]">
          <div className="flex items-center gap-1.5 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e1118] p-1 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
            <button
              onClick={() => setNewRecordType('opportunity')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${ newRecordType === 'opportunity' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#22293b] text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              {t('opportunities')}
            </button>
            <button
              onClick={() => setNewRecordType('company')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${ newRecordType === 'company' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#22293b] text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              {t('companies')}
            </button>
            <button
              onClick={() => setNewRecordType('person')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${ newRecordType === 'person' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#22293b] text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              <Users2 className="w-3.5 h-3.5" />
              {t('people')}
            </button>
            <button
              onClick={() => setNewRecordType('task')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${ newRecordType === 'task' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#22293b] text-white' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              {t('tasks')}
            </button>
          </div>

          <button
            onClick={() => setIsNewRecordModalOpen(false)}
            className="p-1.5 rounded hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1f2535] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {/* 1. OPPORTUNITY FORM */}
          {newRecordType === 'opportunity' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Deal / Opportunity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp Enterprise Platform"
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    value={dealAmount}
                    onChange={(e) => setDealAmount(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs font-mono text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Pipeline Stage</label>
                  <select
                    value={dealStage}
                    onChange={(e) => setDealStage(e.target.value as StageId)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.probability}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Close Target Date</label>
                  <input
                    type="date"
                    value={dealCloseDate}
                    onChange={(e) => setDealCloseDate(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={dealPriority}
                    onChange={(e) => setDealPriority(e.target.value as any)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Associated Company</label>
                <select
                  value={dealCompanyId}
                  onChange={(e) => setDealCompanyId(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select an existing company (Optional)</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.domain})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Enterprise, Expansion, Cloud"
                  value={dealTags}
                  onChange={(e) => setDealTags(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* 2. COMPANY FORM */}
          {newRecordType === 'company' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Domain</label>
                  <input
                    type="text"
                    placeholder="acme.com"
                    value={companyDomain}
                    onChange={(e) => setCompanyDomain(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">ARR ($)</label>
                  <input
                    type="number"
                    value={companyArr}
                    onChange={(e) => setCompanyArr(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Industry</label>
                  <input
                    type="text"
                    value={companyIndustry}
                    onChange={(e) => setCompanyIndustry(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Tier</label>
                  <select
                    value={companyTier}
                    onChange={(e) => setCompanyTier(e.target.value as any)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  >
                    <option value="Startup">Startup</option>
                    <option value="Scaleup">Scaleup</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Overview of business, tech stack, and goals..."
                  value={companyDesc}
                  onChange={(e) => setCompanyDesc(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white p-2.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* 3. PERSON FORM */}
          {newRecordType === 'person' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={personFirstName}
                    onChange={(e) => setPersonFirstName(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={personLastName}
                    onChange={(e) => setPersonLastName(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={personEmail}
                    onChange={(e) => setPersonEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    value={personPhone}
                    onChange={(e) => setPersonPhone(e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={personJobTitle}
                    onChange={(e) => setPersonJobTitle(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Status</label>
                  <select
                    value={personStatus}
                    onChange={(e) => setPersonStatus(e.target.value as any)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Associated Company</label>
                <select
                  value={personCompanyId}
                  onChange={(e) => setPersonCompanyId(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select company (Optional)</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Background enrichment feature banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-950/40 to-blue-950/20 border border-indigo-500/20 flex items-start gap-2.5 text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white block text-xs">
                    Enriquecimiento Automático en Segundo Plano
                  </span>
                  <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 leading-normal">
                    Al crear el contacto, la utilidad en segundo plano consultará y completará automáticamente seniority, presencia en LinkedIn, tecnologías inferidas y sugerencias de apertura comercial.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 4. TASK FORM */}
          {newRecordType === 'task' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow up on procurement review"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Additional context or notes..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white p-2.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d29] text-xs text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] focus:outline-none focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2434] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewRecordModalOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181d28] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#202636] text-[var(--text-secondary,#475569)] dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
