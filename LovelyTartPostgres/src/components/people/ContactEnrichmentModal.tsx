import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Linkedin,
  Twitter,
  Globe,
  Github,
  Building2,
  Briefcase,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  MessageSquare,
  ShieldCheck,
  Zap,
  ExternalLink,
  Layers,
  Award,
} from 'lucide-react';
import { Person } from '../../types';
import { useCRM } from '../../context/CRMContext';

interface ContactEnrichmentModalProps {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp?: (person: Person, message?: string) => void;
}

export const ContactEnrichmentModal: React.FC<ContactEnrichmentModalProps> = ({
  person,
  isOpen,
  onClose,
  onOpenWhatsApp,
}) => {
  const { enrichContact, showToast } = useCRM();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !person) return null;

  const enrichment = person.enrichmentData;
  const isEnriching = person.enrichmentStatus === 'enriching';
  const isEnriched = person.enrichmentStatus === 'enriched' && !!enrichment;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copiado al portapapeles', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleReEnrich = async () => {
    await enrichContact(person.id, true);
  };

  return (
    <div
      id="contact-enrichment-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#10131c] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222838] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d2333] flex items-center justify-between bg-gradient-to-r from-[#141824] to-[#10131c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                  Inteligencia de Contacto B2B
                </h3>
                {isEnriched && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    {enrichment?.confidenceScore || 90}% Confianza
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
                Enriquecimiento de perfil profesional y canales sociales en segundo plano
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1a202f] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Contact summary card */}
          <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={
                  person.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.firstName}-${person.lastName}`
                }
                alt={`${person.firstName} ${person.lastName}`}
                className="w-12 h-12 rounded-full object-cover border border-[var(--border-subtle,#e2e8f0)] dark:border-[#2b3345]"
              />
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white">
                  {person.firstName} {person.lastName}
                </h4>
                <p className="text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium">{person.jobTitle}</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                  {person.companyName && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-blue-400" />
                      {person.companyName}
                    </span>
                  )}
                  {person.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                      {person.city}, {person.country || 'Argentina'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleReEnrich}
              disabled={isEnriching}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
              title="Volver a consultar la API en segundo plano"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isEnriching ? 'animate-spin' : ''}`} />
              <span>{isEnriching ? 'Analizando...' : 'Re-enriquecer'}</span>
            </button>
          </div>

          {/* If enriching in background */}
          {isEnriching && (
            <div className="p-8 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">
                Extrayendo inteligencia profesional en segundo plano...
              </h4>
              <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 max-w-md mx-auto">
                Consultando el motor de enriquecimiento B2B para deducir seniority, competencias, canales sociales y rompehielos comerciales.
              </p>
            </div>
          )}

          {/* If not enriched and not enriching */}
          {!isEnriching && !isEnriched && (
            <div className="p-8 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">
                  Contacto aún sin enriquecimiento automático
                </h4>
                <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 max-w-md mx-auto mt-1">
                  Obtén de forma instantánea el perfil profesional inferido, seniority, presencia social y aperturas de ventas con un solo clic.
                </p>
              </div>
              <button
                onClick={handleReEnrich}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ejecutar Enriquecimiento Ahora</span>
              </button>
            </div>
          )}

          {/* Enriched Content */}
          {!isEnriching && isEnriched && enrichment && (
            <div className="space-y-4">
              {/* Bio summary */}
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                    Resumen Profesional
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Actualizado: {enrichment.enrichedAt ? new Date(enrichment.enrichedAt).toLocaleDateString() : 'Reciente'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200 leading-relaxed">
                  {enrichment.bio}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {enrichment.seniority && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-medium">
                      <Award className="w-3 h-3 text-purple-400" />
                      {enrichment.seniority}
                    </span>
                  )}
                  {enrichment.industry && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-medium">
                      <Layers className="w-3 h-3 text-blue-400" />
                      {enrichment.industry}
                    </span>
                  )}
                </div>
              </div>

              {/* Social Profiles Grid */}
              <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] space-y-3">
                <span className="text-[11px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Presencia Social & Profesional
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* LinkedIn */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3e]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                        <Linkedin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-[var(--text-primary,#0f172a)] dark:text-white truncate">LinkedIn</div>
                        <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 truncate">
                          {enrichment.socialProfiles?.linkedin || person.linkedin || 'No disponible'}
                        </div>
                      </div>
                    </div>
                    {(enrichment.socialProfiles?.linkedin || person.linkedin) && (
                      <a
                        href={
                          (enrichment.socialProfiles?.linkedin || person.linkedin || '').startsWith('http')
                            ? enrichment.socialProfiles?.linkedin || person.linkedin
                            : `https://${enrichment.socialProfiles?.linkedin || person.linkedin}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#20273a] text-blue-400 transition-colors"
                        title="Abrir perfil de LinkedIn"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Twitter / X */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3e]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                        <Twitter className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-[var(--text-primary,#0f172a)] dark:text-white truncate">Twitter / X</div>
                        <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 truncate">
                          {enrichment.socialProfiles?.twitter || 'No indexado'}
                        </div>
                      </div>
                    </div>
                    {enrichment.socialProfiles?.twitter && (
                      <a
                        href={enrichment.socialProfiles.twitter.startsWith('http') ? enrichment.socialProfiles.twitter : `https://${enrichment.socialProfiles.twitter}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#20273a] text-sky-400 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Company Web */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3e]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-[var(--text-primary,#0f172a)] dark:text-white truncate">Web Corporativa</div>
                        <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 truncate">
                          {enrichment.socialProfiles?.website || enrichment.companyInfo?.domain || 'Sitio oficial'}
                        </div>
                      </div>
                    </div>
                    {(enrichment.socialProfiles?.website || enrichment.companyInfo?.domain) && (
                      <a
                        href={
                          (enrichment.socialProfiles?.website || enrichment.companyInfo?.domain || '').startsWith('http')
                            ? enrichment.socialProfiles?.website || enrichment.companyInfo?.domain
                            : `https://${enrichment.socialProfiles?.website || enrichment.companyInfo?.domain}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#20273a] text-emerald-400 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* GitHub if present */}
                  {enrichment.socialProfiles?.github && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252c3e]">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                          <Github className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-medium text-[var(--text-primary,#0f172a)] dark:text-white truncate">GitHub</div>
                          <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 truncate">
                            {enrichment.socialProfiles.github}
                          </div>
                        </div>
                      </div>
                      <a
                        href={enrichment.socialProfiles.github.startsWith('http') ? enrichment.socialProfiles.github : `https://${enrichment.socialProfiles.github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#20273a] text-purple-400 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills and Competencies */}
              {enrichment.skills && enrichment.skills.length > 0 && (
                <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] space-y-2">
                  <span className="text-[11px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Competencias & Habilidades Clave
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {enrichment.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md bg-[var(--bg-card,#ffffff)] dark:bg-[#191f2e] text-[var(--text-primary,#0f172a)] dark:text-slate-200 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#262f44] text-[11px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Info & Tech Stack */}
              {enrichment.companyInfo && (
                <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] space-y-2.5">
                  <span className="text-[11px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    Inteligencia de Empresa ({enrichment.companyInfo.name || person.companyName})
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] p-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222838]">
                      <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block text-[10px]">Tamaño Estimado</span>
                      <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-medium">{enrichment.companyInfo.size || '50-200 empleados'}</span>
                    </div>
                    <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] p-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222838]">
                      <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 block text-[10px]">Sede Principal</span>
                      <span className="text-[var(--text-primary,#0f172a)] dark:text-white font-medium">{enrichment.companyInfo.location || person.city || 'Argentina'}</span>
                    </div>
                  </div>

                  {enrichment.companyInfo.techStack && enrichment.companyInfo.techStack.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1">Stack Tecnológico Detectado:</span>
                      <div className="flex flex-wrap gap-1">
                        {enrichment.companyInfo.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 text-[10px]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Suggested Icebreakers */}
              {enrichment.suggestedIcebreakers && enrichment.suggestedIcebreakers.length > 0 && (
                <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#141824] p-4 rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#222736] space-y-3">
                  <span className="text-[11px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    Rompehielos Recomendados para Contacto
                  </span>

                  <div className="space-y-2">
                    {enrichment.suggestedIcebreakers.map((icebreaker, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#252d40] text-[var(--text-primary,#0f172a)] dark:text-slate-200 leading-relaxed text-xs space-y-2"
                      >
                        <p className="italic">"{icebreaker}"</p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleCopy(icebreaker, `ice-${idx}`)}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#20273a] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#28324a] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[10px] font-medium transition-colors cursor-pointer"
                          >
                            {copiedKey === `ice-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedKey === `ice-${idx}` ? 'Copiado' : 'Copiar'}</span>
                          </button>

                          {onOpenWhatsApp && (
                            <button
                              onClick={() => onOpenWhatsApp(person, icebreaker)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3 text-emerald-400" />
                              <span>Enviar por WhatsApp</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d2333] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0e1118] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Enriquecimiento background con motor de IA Clientum</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2232] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#242b3e] text-[var(--text-primary,#0f172a)] dark:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
