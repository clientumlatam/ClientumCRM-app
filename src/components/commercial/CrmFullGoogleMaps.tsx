import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Building2,
  Phone,
  Globe,
  Star,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
  Download,
  Filter,
  Layers,
  Compass,
  Check,
  Settings2
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { getClientumAuthJsonHeaders } from '../../lib/api';
import { ModuleCredentialsModal } from '../settings/ModuleCredentialsModal';
import { moduleNeedsUserCredentials } from '../../data/moduleCredentials';
export { ModuleProspeccionMaps } from './ModuleProspeccionMaps';

interface ScrapedLead {
  id: string;
  name: string;
  niche: string;
  city: string;
  phone: string;
  address: string;
  website: string;
  rating: number;
  reviewsCount: number;
  status: 'Alta Intención' | 'Excelente Prospecto' | 'Calificación Media';
  isImported?: boolean;
}

export const CrmFullGoogleMaps: React.FC = () => {
  const { addCompany, addOpportunity, showToast, triggerConfetti } = useCRM();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const [keyword, setKeyword] = useState('Distribuidora Mayorista');
  const [city, setCity] = useState('General Roca, Río Negro');
  const [radiusKm, setRadiusKm] = useState(25);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ScrapedLead | null>(null);

  const [leads, setLeads] = useState<ScrapedLead[]>([
    {
      id: 'gmap-1',
      name: 'Distribuidora Patagónica de Alimentos S.R.L.',
      niche: 'Distribuidora Mayorista',
      city: 'General Roca, Río Negro',
      phone: '+54 298 442-1920',
      address: 'Parque Industrial Lote 14, General Roca',
      website: 'www.distribuidorapatagonica.com.ar',
      rating: 4.8,
      reviewsCount: 142,
      status: 'Alta Intención',
      isImported: false
    },
    {
      id: 'gmap-2',
      name: 'Acopio y Maquinaria Agrícola del Valle',
      niche: 'Agro e Insumos',
      city: 'General Roca, Río Negro',
      phone: '+54 298 450-8831',
      address: 'Ruta Nacional 22 Km 1178, General Roca',
      website: 'www.maquinariadelvalle.com.ar',
      rating: 4.6,
      reviewsCount: 89,
      status: 'Excelente Prospecto',
      isImported: false
    },
    {
      id: 'gmap-3',
      name: 'Estudio Contable & Consultores Asociados',
      niche: 'Estudios Contables',
      city: 'Neuquén Capital',
      phone: '+54 299 443-8100',
      address: 'Av. Argentina 450 Piso 6, Neuquén',
      website: 'www.estudiocontableneuquen.com',
      rating: 4.9,
      reviewsCount: 64,
      status: 'Alta Intención',
      isImported: false
    },
    {
      id: 'gmap-4',
      name: 'Clínica Integral del Sol',
      niche: 'Salud y Especialidades',
      city: 'Cipolletti, Río Negro',
      phone: '+54 299 478-2200',
      address: 'Calle Mengelle 240, Cipolletti',
      website: 'www.clinicadelsolpatagonia.com',
      rating: 4.4,
      reviewsCount: 310,
      status: 'Excelente Prospecto',
      isImported: false
    },
    {
      id: 'gmap-5',
      name: 'Constructora Austral Desarrollos',
      niche: 'Construcción e Ingeniería',
      city: 'General Roca, Río Negro',
      phone: '+54 298 443-9090',
      address: 'Av. Roca 1250, General Roca',
      website: 'www.constructoraaustral.com.ar',
      rating: 4.5,
      reviewsCount: 48,
      status: 'Calificación Media',
      isImported: false
    }
  ]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !city.trim()) {
      showToast('Ingresa nicho y localidad para buscar en Google Maps', 'warning');
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch('/api/ai/prospect', {
        method: 'POST',
         headers: await getClientumAuthJsonHeaders(),
        body: JSON.stringify({ niche: keyword, city, radiusKm })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          const formatted: ScrapedLead[] = data.results.map((r: any, idx: number) => ({
            id: `gmap-ai-${Date.now()}-${idx}`,
            name: r.name,
            niche: keyword,
            city: city,
            phone: r.phone || '+54 11 4000-0000',
            address: r.address || `${city} Centro`,
            website: r.website || `www.${r.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.ar`,
            rating: parseFloat(String(r.rating)) || 4.7,
            reviewsCount: Number(r.reviewsCount) || 0,
            status: r.status || 'Alta Intención',
            isImported: false
          }));

          setLeads(prev => [...formatted, ...prev]);
          showToast(
            data.source === 'google_places'
              ? `Google Maps encontró ${formatted.length} prospectos en ${city}`
              : `Se localizaron ${formatted.length} prospectos demo en ${city}`,
            'success',
          );
        }
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'No se pudo consultar Google Maps', 'error');
      }
    } catch (err) {
      console.warn('Fallback search used:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImportSingle = (lead: ScrapedLead) => {
    if (lead.isImported) return;

    // Add company
    addCompany({
      name: lead.name,
      domain: lead.website.replace(/^www\./, ''),
      industry: lead.niche,
      phone: lead.phone,
      address: lead.address,
      tags: ['Google Maps', 'Latam', lead.niche],
      customFields: {
        googleRating: lead.rating,
        reviewsCount: lead.reviewsCount
      }
    } as any);

    // Add opportunity
    addOpportunity({
      name: `Oportunidad: ${lead.name}`,
      stage: 'lead',
      currency: 'USD',
      amount: 150000,
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      probability: 30,
      priority: lead.status === 'Alta Intención' ? 'High' : 'Medium',
      type: 'New Business',
      assignedTo: 'Sarah Chen',
      companyName: lead.name,
      tags: ['Google Maps Scraper', lead.city]
    });

    setLeads(prev =>
      prev.map(l => (l.id === lead.id ? { ...l, isImported: true } : l))
    );

    triggerConfetti();
    showToast(`"${lead.name}" importado exitosamente a Empresas y Pipeline Kanban`, 'success');
  };

  const handleImportAll = () => {
    const unimported = leads.filter(l => !l.isImported);
    if (unimported.length === 0) {
      showToast('Todos los prospectos ya fueron importados al CRM', 'info');
      return;
    }

    unimported.forEach(lead => {
      addCompany({
        name: lead.name,
        domain: lead.website.replace(/^www\./, ''),
        industry: lead.niche,
        phone: lead.phone,
        address: lead.address,
        tags: ['Google Maps Masivo', lead.city]
      } as any);

      addOpportunity({
        name: `Prospecto Maps: ${lead.name}`,
        stage: 'lead',
        currency: 'USD',
        amount: 140000,
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        probability: 25,
        priority: 'Medium',
        type: 'New Business',
        assignedTo: 'Sarah Chen',
        companyName: lead.name,
        tags: ['Google Maps Masivo']
      });
    });

    setLeads(prev => prev.map(l => ({ ...l, isImported: true })));
    triggerConfetti();
    showToast(`Se importaron ${unimported.length} prospectos directamente a tu CRM`, 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Módulo Comercial 2.4
            </span>
            <h1 className="text-xl font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              Prospección Geolocalizada con Google Maps
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1">
            Encuentra empresas, comercios y distribuidores locales por nicho y ciudad. Extrae teléfonos, web y calificaciones e impórtalos en un clic.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {moduleNeedsUserCredentials('googleMaps') && (
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#111a2a] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#182640] text-cyan-200 border border-cyan-400/25 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
              <span>Configurar API</span>
            </button>
          )}
          <button
            onClick={handleImportAll}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Importar Todo a Oportunidades</span>
          </button>
        </div>
      </div>
      <ModuleCredentialsModal
        moduleId={isConfigOpen ? 'googleMaps' : null}
        onClose={() => setIsConfigOpen(false)}
      />

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="p-4 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d121c] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1 font-medium">Palabra Clave / Nicho Comercial</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ej: Distribuidora, Maquinaria, Estudio Contable..."
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] rounded-lg px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1 font-medium">Ciudad / Localidad / Coordenadas</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[var(--text-muted)] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: General Roca, Neuquén, Rosario..."
                className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2942] rounded-lg pl-8 pr-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 block mb-1 font-medium">Radio ({radiusKm} km)</label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-2 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              {isSearching ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Rastreando...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Escanear Mapa</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Grid: Map Preview Simulator + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c101a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#182133] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500 animate-pulse" />
                Radar Geográfico Activo
              </span>
              <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                {city} ({radiusKm} km)
              </span>
            </div>

            {/* Stylized Vector Radar Map */}
            <div className="relative h-64 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080d16] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#162033] overflow-hidden flex items-center justify-center p-4">
              {/* Radar Grid Lines */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="w-44 h-44 rounded-full border border-cyan-500/20 absolute animate-ping" />
              <div className="w-32 h-32 rounded-full border border-cyan-500/30 absolute" />
              <div className="w-16 h-16 rounded-full border border-cyan-500/40 absolute" />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute shadow-lg shadow-cyan-400/80" />

              {/* Pinned Leads on the Radar */}
              {leads.map((lead, idx) => {
                const angle = (idx * (360 / leads.length) * Math.PI) / 180;
                const dist = 40 + (idx % 3) * 20;
                const left = `calc(50% + ${Math.cos(angle) * dist}px)`;
                const top = `calc(50% + ${Math.sin(angle) * dist}px)`;

                return (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    style={{ left, top }}
                    title={lead.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full bg-rose-600/90 hover:bg-rose-500 border border-white text-white transition-transform hover:scale-125 z-10 cursor-pointer shadow-lg"
                  >
                    <Building2 className="w-3 h-3" />
                  </button>
                );
              })}

              <div className="absolute bottom-2 left-2 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1322]/90 backdrop-blur-md px-2 py-1 rounded text-[10px] text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1d273d]">
                📍 {leads.length} negocios detectados
              </div>
            </div>

            {/* Selected Lead Quick Inspector */}
            {selectedLead && (
              <div className="p-3.5 rounded-xl bg-[var(--bg-card,#ffffff)] dark:bg-[#111726] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f2c45] space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">{selectedLead.niche}</span>
                    <h4 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs">{selectedLead.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    ★ {selectedLead.rating}
                  </span>
                </div>

                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
                    <span>{selectedLead.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[var(--text-muted)]" />
                    <span>{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-[var(--text-muted)]" />
                    <span className="text-cyan-400">{selectedLead.website}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleImportSingle(selectedLead)}
                    disabled={selectedLead.isImported}
                    className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${ selectedLead.isImported ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md' }`}
                  >
                    {selectedLead.isImported ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Ya en el CRM</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Importar a Pipeline</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scraped Leads Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c101a] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#182133] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs">
                Empresas & Prospectos Extraídos ({leads.length})
              </h3>
              <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                {leads.filter(l => l.isImported).length} importadas
              </span>
            </div>

            <div className="space-y-2.5">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className={`p-3.5 rounded-xl border transition-all ${ selectedLead?.id === lead.id ? 'bg-[var(--bg-card,#ffffff)] dark:bg-[#131b2e] border-cyan-500/40 shadow-md' : 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0f1422] border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b253b] border-[var(--border-subtle,#e2e8f0)] dark:hover:border-slate-700' }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                          {lead.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300">
                          {lead.niche}
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                          ★ {lead.rating} <span className="text-[var(--text-muted)]">({lead.reviewsCount})</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[var(--text-muted)]" /> {lead.address}
                        </span>
                        <span className="flex items-center gap-1 text-[var(--text-secondary,#475569)] dark:text-slate-300">
                          <Phone className="w-3 h-3 text-[var(--text-muted)]" /> {lead.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ lead.status === 'Alta Intención' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : lead.status === 'Excelente Prospecto' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-slate-800 text-[var(--text-secondary,#475569)] dark:text-slate-300 border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700' }`}>
                        {lead.status}
                      </span>

                      <button
                        onClick={() => handleImportSingle(lead)}
                        disabled={lead.isImported}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${ lead.isImported ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' : 'bg-emerald-600 hover:bg-emerald-500 text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm' }`}
                      >
                        {lead.isImported ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Importado</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Importar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
