import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Users,
  TrendingUp,
  MapPin,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  DollarSign,
  HeartPulse,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Company } from '../../types';
import { SavedViewsBar } from '../common/SavedViewsBar';

export const CompaniesView: React.FC = () => {
  const {
    companies,
    deleteCompany,
    opportunities,
    people,
    setSelectedRecord,
    openNewRecordModal,
    openAICopilot,
    filterState,
    t,
    language,
  } = useCRM();

  const [viewStyle, setViewStyle] = useState<'grid' | 'table'>('grid');

  const filteredCompanies = companies.filter((c) => {
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchDomain = c.domain.toLowerCase().includes(q);
      const matchIndustry = c.industry.toLowerCase().includes(q);
      const matchTier = c.tier.toLowerCase().includes(q);
      if (!matchName && !matchDomain && !matchIndustry && !matchTier) return false;
    }
    return true;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Enterprise':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Scaleup':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Startup':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-[var(--text-muted,#64748b)] dark:text-slate-400 border-slate-500/20';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div id="clientum-companies-view" className="flex-1 flex flex-col h-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] overflow-y-auto select-none">
      <SavedViewsBar target="companies" />
      <div className="p-4 flex-1 flex flex-col">
        {/* Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{t('companies')}</h2>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
            {filteredCompanies.length} {t('records')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141822] p-0.5 rounded-md border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232838] flex items-center text-xs">
            <button
              id="companies-view-grid-btn"
              onClick={() => setViewStyle('grid')}
              className={`px-2 py-1 rounded transition-all ${ viewStyle === 'grid' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#202636] text-[var(--text-primary,#0f172a)] dark:text-white font-medium' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              {t('boardView')}
            </button>
            <button
              id="companies-view-table-btn"
              onClick={() => setViewStyle('table')}
              className={`px-2 py-1 rounded transition-all ${ viewStyle === 'table' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#202636] text-[var(--text-primary,#0f172a)] dark:text-white font-medium' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
            >
              {t('tableView')}
            </button>
          </div>

          <button
            id="add-company-btn"
            onClick={() => openNewRecordModal('company')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('newCompany')}
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewStyle === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCompanies.map((company) => {
            const companyOpps = opportunities.filter((o) => o.companyId === company.id);
            const companyPeople = people.filter((p) => p.companyId === company.id);
            const totalOppAmount = companyOpps.reduce((acc, o) => acc + o.amount, 0);

            return (
              <div
                key={company.id}
                id={`company-card-${company.id}`}
                onClick={() => setSelectedRecord({ type: 'company', id: company.id })}
                className="bg-[var(--bg-card,#ffffff)] dark:bg-[#12151d] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#161a24] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] border-[var(--border-subtle,#e2e8f0)] dark:hover:border-[#2d3548] p-4 rounded-xl shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Company Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345] flex items-center justify-center text-[var(--text-primary,#0f172a)] dark:text-slate-200 font-bold text-sm shrink-0">
                        {company.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-[var(--text-primary,#0f172a)] dark:text-white group-hover:text-blue-400 transition-colors truncate">
                          {company.name}
                        </h3>
                        <a
                          href={`https://${company.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
                        >
                          <Globe className="w-2.5 h-2.5" />
                          {company.domain}
                        </a>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getTierColor(company.tier)}`}>
                      {company.tier}
                    </span>
                  </div>

                  {/* Description */}
                  {company.description && (
                    <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                      {company.description}
                    </p>
                  )}

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a1f2c] text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                      <span>{company.employees} staff</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                      <span className="truncate">{company.city || company.country || 'Global'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HeartPulse className={`w-3.5 h-3.5 ${getHealthColor(company.healthScore)}`} />
                      <span>Health: <strong className={getHealthColor(company.healthScore)}>{company.healthScore}%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ARR: <strong>${Math.round((company.arr || 0) / 1000)}k</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Connected Stats */}
                <div className="mt-3 pt-2.5 flex items-center justify-between text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#181d28] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[10px] font-mono">
                      {companyOpps.length} {companyOpps.length === 1 ? 'deal' : 'deals'} (${Math.round(totalOppAmount / 1000)}k)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#181d28] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[10px] font-mono">
                      {companyPeople.length} {companyPeople.length === 1 ? 'contact' : 'contacts'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      id={`company-copilot-${company.id}`}
                      onClick={() =>
                        openAICopilot({
                          type: 'company',
                          id: company.id,
                          name: company.name,
                          initialPrompt: language === 'es'
                            ? `Proporciona una estrategia de expansión de cuenta y análisis de sentimiento del cliente para ${company.name} (${company.industry}, ARR: $${company.arr?.toLocaleString()}).`
                            : language === 'pt'
                            ? `Forneça uma estratégia de expansão de conta e análise de sentimento do cliente para ${company.name} (${company.industry}, ARR: $${company.arr?.toLocaleString()}).`
                            : `Provide an account expansion strategy and customer sentiment analysis for ${company.name} (${company.industry}, ARR: $${company.arr?.toLocaleString()}).`,
                        })
                      }
                      className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                      title="AI Company Expansion Analysis"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`delete-company-${company.id}`}
                      onClick={() => {
                        if (confirm(`Delete company ${company.name}?`)) {
                          deleteCompany(company.id);
                        }
                      }}
                      className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141822] text-[var(--text-muted,#64748b)] dark:text-slate-400 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
              <tr>
                <th className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">Company</th>
                <th className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">Industry</th>
                <th className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">Tier</th>
                <th className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">ARR</th>
                <th className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">Health</th>
                <th className="px-3 py-2.5 font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">Owner</th>
                <th className="w-16 px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle,#e2e8f0)] dark:divide-[#191e2a]">
              {filteredCompanies.map((c) => (
                <tr
                  key={c.id}
                  id={`company-row-${c.id}`}
                  onClick={() => setSelectedRecord({ type: 'company', id: c.id })}
                  className="hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#161a24] cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2.5 font-semibold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-800 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 flex items-center justify-center text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs font-bold shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[var(--text-primary,#0f172a)] dark:text-white hover:text-blue-400">{c.name}</div>
                      <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-normal">{c.domain}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary,#475569)] dark:text-slate-300">{c.industry}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getTierColor(c.tier)}`}>
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono font-bold text-[var(--text-primary,#0f172a)] dark:text-slate-200">
                    ${c.arr?.toLocaleString() || '0'}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`font-semibold ${getHealthColor(c.healthScore)}`}>
                      {c.healthScore}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-muted,#64748b)] dark:text-slate-400">{c.assignedTo}</td>
                  <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      id={`table-delete-company-${c.id}`}
                      onClick={() => {
                        if (confirm(`Delete ${c.name}?`)) deleteCompany(c.id);
                      }}
                      className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
};
