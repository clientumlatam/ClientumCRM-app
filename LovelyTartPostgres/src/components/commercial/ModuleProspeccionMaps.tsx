import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Building2,
  Phone,
  Globe,
  Star,
  CheckCircle2,
  Plus,
  Download,
  Filter,
  Compass,
  Check,
  Settings2,
  ExternalLink,
  Layers,
  Sparkles,
  Users,
  Briefcase,
  FileSpreadsheet,
  Maximize2,
  RefreshCw,
  Navigation
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { ModuleCredentialsModal } from '../settings/ModuleCredentialsModal';
import { moduleNeedsUserCredentials } from '../../data/moduleCredentials';

export interface ProspectLead {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  website: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  openNow: boolean;
  scoreStatus: 'Alta Intención' | 'Excelente Prospecto' | 'Oportunidad Media';
  isImported?: boolean;
}

const INITIAL_PROSPECTS: ProspectLead[] = [
  {
    id: 'gmap-b2b-1',
    name: 'Distribuidora Patagónica de Alimentos S.R.L.',
    category: 'Distribuidora Mayorista',
    city: 'General Roca, Río Negro',
    address: 'Parque Industrial Lote 14, General Roca',
    phone: '+54 298 442-1920',
    email: 'ventas@distribuidorapatagonica.com.ar',
    website: 'https://distribuidorapatagonica.com.ar',
    rating: 4.8,
    reviewCount: 142,
    lat: -39.027,
    lng: -67.575,
    openNow: true,
    scoreStatus: 'Alta Intención',
    isImported: false,
  },
  {
    id: 'gmap-b2b-2',
    name: 'Acopio y Maquinaria Agrícola del Valle',
    category: 'Agro e Insumos',
    city: 'General Roca, Río Negro',
    address: 'Ruta Nacional 22 Km 1178, General Roca',
    phone: '+54 298 450-8831',
    email: 'contacto@maquinariadelvalle.com.ar',
    website: 'https://maquinariadelvalle.com.ar',
    rating: 4.6,
    reviewCount: 89,
    lat: -39.035,
    lng: -67.585,
    openNow: true,
    scoreStatus: 'Excelente Prospecto',
    isImported: false,
  },
  {
    id: 'gmap-b2b-3',
    name: 'Estudio Contable & Consultores Asociados',
    category: 'Estudios Contables',
    city: 'Neuquén Capital',
    address: 'Av. Argentina 450 Piso 6, Neuquén',
    phone: '+54 299 448-2200',
    email: 'info@estudiocontableneuquen.com',
    website: 'https://estudiocontableneuquen.com',
    rating: 4.9,
    reviewCount: 64,
    lat: -38.951,
    lng: -68.059,
    openNow: false,
    scoreStatus: 'Alta Intención',
    isImported: false,
  },
  {
    id: 'gmap-b2b-4',
    name: 'Logística & Transportes del Comahue',
    category: 'Logística y Transporte',
    city: 'Cipolletti, Río Negro',
    address: 'Acceso Pacheco 1250, Cipolletti',
    phone: '+54 299 477-6100',
    email: 'operaciones@transcomahue.com.ar',
    website: 'https://transcomahue.com.ar',
    rating: 4.5,
    reviewCount: 112,
    lat: -38.938,
    lng: -67.992,
    openNow: true,
    scoreStatus: 'Excelente Prospecto',
    isImported: false,
  },
  {
    id: 'gmap-b2b-5',
    name: 'Clínica Médica y Traumatología del Sol',
    category: 'Salud y Clínicas',
    city: 'Neuquén Capital',
    address: 'Calle Mendoza 320, Neuquén',
    phone: '+54 299 443-5590',
    email: 'recepcion@clinicadelsolnqn.com.ar',
    website: 'https://clinicadelsolnqn.com.ar',
    rating: 4.7,
    reviewCount: 205,
    lat: -38.955,
    lng: -68.062,
    openNow: true,
    scoreStatus: 'Alta Intención',
    isImported: false,
  },
  {
    id: 'gmap-b2b-6',
    name: 'Bodegas & Viñedos Alto Valle',
    category: 'Bodegas y Agroindustria',
    city: 'Mainqué, Río Negro',
    address: 'Chacra 45, Ruta 22, Mainqué',
    phone: '+54 298 449-1055',
    email: 'comercial@altovallevinos.com',
    website: 'https://altovallevinos.com',
    rating: 4.9,
    reviewCount: 78,
    lat: -39.062,
    lng: -67.452,
    openNow: true,
    scoreStatus: 'Excelente Prospecto',
    isImported: false,
  },
];

export const ModuleProspeccionMaps: React.FC = () => {
  const { addCompany, addOpportunity, addPerson, showToast, triggerConfetti } = useCRM();

  const [keyword, setKeyword] = useState('Distribuidora Mayorista');
  const [city, setCity] = useState('General Roca, Río Negro');
  const [radiusKm, setRadiusKm] = useState(30);
  const [minRating, setMinRating] = useState<number>(0);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ProspectLead | null>(INITIAL_PROSPECTS[0]);
  const [leads, setLeads] = useState<ProspectLead[]>(INITIAL_PROSPECTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [zoomLevel, setZoomLevel] = useState(12);

  // Filtrado reactivo
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (minRating > 0 && l.rating < minRating) return false;
      return true;
    });
  }, [leads, minRating]);

  // Selección individual / múltiple
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l.id));
    }
  };

  // Simulación de búsqueda inteligente con Google Maps Places API
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      showToast('Ingresa un nicho o palabra clave', 'error');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // Generar resultados contextuales según la ciudad y rubro ingresados
      const dynamicResults: ProspectLead[] = [
        {
          id: `lead-search-${Date.now()}-1`,
          name: `${keyword} Central ${city.split(',')[0]} S.A.`,
          category: keyword,
          city: city,
          address: `Av. Principal 1420, ${city}`,
          phone: '+54 11 5263-8890',
          email: `ventas@${keyword.toLowerCase().replace(/\s+/g, '')}central.com`,
          website: `https://${keyword.toLowerCase().replace(/\s+/g, '')}central.com`,
          rating: 4.8,
          reviewCount: Math.floor(Math.random() * 150) + 40,
          lat: -39.027 + (Math.random() - 0.5) * 0.05,
          lng: -67.575 + (Math.random() - 0.5) * 0.05,
          openNow: true,
          scoreStatus: 'Alta Intención',
          isImported: false,
        },
        {
          id: `lead-search-${Date.now()}-2`,
          name: `Grupo Comercial & Logística ${keyword} del Sur`,
          category: keyword,
          city: city,
          address: `Parque Industrial Nave 4, ${city}`,
          phone: '+54 11 4782-9910',
          email: `info@grupocomercial${keyword.toLowerCase().replace(/\s+/g, '')}.com`,
          website: `https://grupocomercial${keyword.toLowerCase().replace(/\s+/g, '')}.com`,
          rating: 4.6,
          reviewCount: Math.floor(Math.random() * 90) + 20,
          lat: -39.035 + (Math.random() - 0.5) * 0.05,
          lng: -67.585 + (Math.random() - 0.5) * 0.05,
          openNow: true,
          scoreStatus: 'Excelente Prospecto',
          isImported: false,
        },
        {
          id: `lead-search-${Date.now()}-3`,
          name: `Soluciones Integrales ${keyword} Norte`,
          category: keyword,
          city: city,
          address: `Bv. San Martín 880, ${city}`,
          phone: '+54 11 4321-7788',
          email: `contacto@soluciones${keyword.toLowerCase().replace(/\s+/g, '')}.com`,
          website: `https://soluciones${keyword.toLowerCase().replace(/\s+/g, '')}.com`,
          rating: 4.9,
          reviewCount: Math.floor(Math.random() * 200) + 60,
          lat: -39.015 + (Math.random() - 0.5) * 0.05,
          lng: -67.565 + (Math.random() - 0.5) * 0.05,
          openNow: false,
          scoreStatus: 'Alta Intención',
          isImported: false,
        },
        ...INITIAL_PROSPECTS.map((p) => ({
          ...p,
          id: `${p.id}-${Date.now()}`,
          isImported: false,
        })),
      ];

      setLeads(dynamicResults);
      setSelectedLead(dynamicResults[0]);
      setSelectedIds([]);
      showToast(`Se localizaron ${dynamicResults.length} empresas en el radio de ${radiusKm} km`, 'success');
    }, 900);
  };

  // Exportar un prospecto individual a la base de datos de leads del CRM
  const handleExportSingleToLeads = (lead: ProspectLead) => {
    if (lead.isImported) {
      showToast('Este prospecto ya está registrado en tu CRM', 'info');
      return;
    }

    // 1. Crear Empresa
    addCompany({
      name: lead.name,
      domain: lead.website.replace(/^https?:\/\//, '').replace(/^www\./, ''),
      industry: lead.category,
      employees: '25-100',
      tier: lead.scoreStatus === 'Alta Intención' ? 'Enterprise' : 'Mid-Market',
      healthScore: Math.round(lead.rating * 20),
      phone: lead.phone,
      address: lead.address,
      city: lead.city,
      tags: ['Google Maps B2B', lead.category, lead.city],
    } as any);

    // 2. Crear Contacto Lead
    const nameParts = lead.name.split(' ');
    addPerson({
      firstName: nameParts[0] || 'Contacto',
      lastName: nameParts.slice(1, 3).join(' ') || 'Comercial',
      email: lead.email || `contacto@${lead.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}`,
      phone: lead.phone,
      jobTitle: 'Director General / Titular',
      companyName: lead.name,
      city: lead.city,
      status: 'Lead',
      assignedTo: 'Alex Morgan',
      notes: `Prospectado vía Google Maps API. Calificación: ${lead.rating}★ (${lead.reviewCount} reseñas). Dirección: ${lead.address}`,
    } as any);

    // 3. Crear Oportunidad en Pipeline Kanban
    addOpportunity({
      name: `Prospecto Maps: ${lead.name}`,
      stage: 'lead',
      currency: 'USD',
      amount: 125000,
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      probability: 30,
      priority: lead.rating >= 4.7 ? 'High' : 'Medium',
      type: 'New Business',
      assignedTo: 'Alex Morgan',
      companyName: lead.name,
      tags: ['Google Maps B2B', lead.category],
    });

    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, isImported: true } : l))
    );

    triggerConfetti();
    showToast(`"${lead.name}" exportado con éxito a Leads y Empresas del CRM`, 'success');
  };

  // Exportar masivamente los seleccionados o todos a la base de datos de leads
  const handleExportBatchToLeads = () => {
    const targets = selectedIds.length > 0
      ? leads.filter((l) => selectedIds.includes(l.id) && !l.isImported)
      : leads.filter((l) => !l.isImported);

    if (targets.length === 0) {
      showToast('No hay prospectos pendientes seleccionados para exportar', 'info');
      return;
    }

    targets.forEach((lead) => {
      // Crear Empresa
      addCompany({
        name: lead.name,
        domain: lead.website.replace(/^https?:\/\//, '').replace(/^www\./, ''),
        industry: lead.category,
        employees: '15-80',
        tier: 'Mid-Market',
        healthScore: Math.round(lead.rating * 20),
        phone: lead.phone,
        address: lead.address,
        city: lead.city,
        tags: ['Google Maps Masivo', lead.category],
      } as any);

      // Crear Lead Contacto
      addPerson({
        firstName: lead.name.split(' ')[0] || 'Responsable',
        lastName: 'Comercial',
        email: lead.email || `ventas@${lead.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}`,
        phone: lead.phone,
        jobTitle: 'Gerente Comercial',
        companyName: lead.name,
        city: lead.city,
        status: 'Lead',
        assignedTo: 'Alex Morgan',
        notes: `Importado en lote desde Google Maps API. Rating: ${lead.rating}★`,
      } as any);

      // Crear Oportunidad
      addOpportunity({
        name: `Prospecto Maps: ${lead.name}`,
        stage: 'lead',
        currency: 'USD',
        amount: 110000,
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        probability: 25,
        priority: 'Medium',
        type: 'New Business',
        assignedTo: 'Alex Morgan',
        companyName: lead.name,
        tags: ['Google Maps B2B'],
      });
    });

    const targetIds = targets.map((t) => t.id);
    setLeads((prev) =>
      prev.map((l) => (targetIds.includes(l.id) ? { ...l, isImported: true } : l))
    );

    setSelectedIds([]);
    triggerConfetti();
    showToast(`Se exportaron ${targets.length} prospectos a la base de datos de leads del CRM`, 'success');
  };

  // Descargar resultados en CSV
  const handleExportCSV = () => {
    const headers = ['Nombre', 'Categoría', 'Ciudad', 'Dirección', 'Teléfono', 'Email', 'Sitio Web', 'Rating', 'Reseñas', 'Estado'];
    const rows = filteredLeads.map((l) => [
      `"${l.name}"`,
      `"${l.category}"`,
      `"${l.city}"`,
      `"${l.address}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.website}"`,
      l.rating,
      l.reviewCount,
      `"${l.scoreStatus}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_google_maps_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo CSV descargado exitosamente', 'info');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[var(--bg-muted)] text-[var(--text-primary)] text-xs">
      {/* Header del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Google Maps Platform B2B
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Places API & Radar
            </span>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            Prospección Geolocalizada con Google Maps
          </h1>
          <p className="text-xs text-[var(--text-muted)] max-w-2xl">
            Localiza comercios, empresas y distribuidores en cualquier ciudad de América Latina. Visualiza marcadores interactivos en el mapa y expórtalos con 1 clic a la base de datos de leads de tu CRM.
          </p>
        </div>

        {/* Botones de acción principales */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-default)] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Descargar lista en CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Descargar CSV</span>
          </button>

          {moduleNeedsUserCredentials('googleMaps') && (
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="px-3 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-default)] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Settings2 className="w-4 h-4 text-blue-600" />
              <span>Configurar API</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportBatchToLeads}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>
              {selectedIds.length > 0
                ? `Exportar (${selectedIds.length}) a Leads CRM`
                : 'Exportar Todo a Leads CRM'}
            </span>
          </button>
        </div>
      </div>

      <ModuleCredentialsModal
        moduleId={isConfigOpen ? 'googleMaps' : null}
        onClose={() => setIsConfigOpen(false)}
      />

      {/* Formulario de Búsqueda y Filtros de Google Maps */}
      <form onSubmit={handleSearch} className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          {/* Palabra clave / Nicho */}
          <div className="sm:col-span-4">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              Rubro Comercial / Palabra Clave
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ej: Distribuidora, Maquinaria, Estudio Contable..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:bg-[var(--bg-card)] focus:border-blue-500 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Ciudad / Ubicación */}
          <div className="sm:col-span-4">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1">
              Ciudad / Coordenadas / Región
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: General Roca, Neuquén, Rosario, Santiago..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:bg-[var(--bg-card)] focus:border-blue-500 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Radio en KM */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-[var(--text-secondary)]">Radio</label>
              <span className="text-[11px] font-mono font-bold text-blue-600">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Botón Escanear */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[var(--text-primary,#0f172a)] dark:text-white" />
                  <span>Buscando...</span>
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

        {/* Sugerencias Rápidas de Nichos */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[var(--border-subtle)]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">
            Sugerencias:
          </span>
          {[
            'Distribuidora Mayorista',
            'Agro e Insumos',
            'Estudios Contables',
            'Logística y Transporte',
            'Clínicas Médicas',
            'Bodegas y Vinos',
            'Metalúrgicas',
          ].map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => setKeyword(sug)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${ keyword === sug ? 'bg-blue-100 text-blue-700 font-bold border border-blue-300' : 'bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)]' }`}
            >
              {sug}
            </button>
          ))}
        </div>
      </form>

      {/* Grid Principal: Mapa con Marcadores Interactivos + Panel de Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Mapa Interactivo con Marcadores */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-xs overflow-hidden flex flex-col">
            {/* Header del Mapa */}
            <div className="p-3.5 bg-slate-900 text-[var(--text-primary,#0f172a)] dark:text-white flex items-center justify-between border-b border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-xs">Radar Cartográfico Google Maps</span>
                <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
                  {city} ({radiusKm} km)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMapType(mapType === 'streets' ? 'satellite' : 'streets')}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)]/10 hover:bg-[var(--bg-card)]/20 text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Layers className="w-3 h-3" />
                  <span>{mapType === 'streets' ? 'Satélite' : 'Calles'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(z + 1, 16))}
                  className="w-6 h-6 rounded bg-[var(--bg-card)]/10 hover:bg-[var(--bg-card)]/20 text-[var(--text-primary,#0f172a)] dark:text-white font-bold flex items-center justify-center text-xs cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(z - 1, 8))}
                  className="w-6 h-6 rounded bg-[var(--bg-card)]/10 hover:bg-[var(--bg-card)]/20 text-[var(--text-primary,#0f172a)] dark:text-white font-bold flex items-center justify-center text-xs cursor-pointer"
                  title="Zoom Out"
                >
                  -
                </button>
              </div>
            </div>

            {/* Lienzo del Mapa con Marcadores y Coordenadas */}
            <div className="relative h-[380px] bg-slate-950 overflow-hidden flex items-center justify-center select-none">
              {/* Fondo del mapa (estilizado según Streets o Satélite) */}
              {mapType === 'streets' ? (
                <>
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
                  {/* Calles vectoriales simuladas */}
                  <div className="absolute inset-0 opacity-15">
                    <div className="absolute w-full h-[2px] bg-slate-400 top-1/3 rotate-3" />
                    <div className="absolute w-full h-[2px] bg-slate-400 top-2/3 -rotate-2" />
                    <div className="absolute h-full w-[2px] bg-slate-400 left-1/4 -rotate-6" />
                    <div className="absolute h-full w-[2px] bg-slate-400 left-2/3 rotate-4" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#08131d] opacity-90">
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>
              )}

              {/* Ondas concéntricas del radar */}
              <div className="w-80 h-80 rounded-full border border-blue-500/20 absolute pointer-events-none" />
              <div className="w-56 h-56 rounded-full border border-blue-500/30 absolute pointer-events-none" />
              <div className="w-32 h-32 rounded-full border border-blue-500/40 absolute pointer-events-none" />
              <div className="w-3 h-3 rounded-full bg-blue-500 absolute shadow-lg shadow-blue-500/80 pointer-events-none" />

              {/* Marcadores Geográficos Clave */}
              {filteredLeads.map((lead, idx) => {
                const angle = (idx * (360 / filteredLeads.length) * Math.PI) / 180;
                const dist = 55 + (idx % 4) * 32;
                const left = `calc(50% + ${Math.cos(angle) * dist}px)`;
                const top = `calc(50% + ${Math.sin(angle) * dist}px)`;
                const isSelected = selectedLead?.id === lead.id;

                return (
                  <div
                    key={lead.id}
                    style={{ left, top }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className={`relative p-2 rounded-full transition-all cursor-pointer shadow-lg flex items-center justify-center ${ isSelected ? 'bg-rose-600 text-[var(--text-primary,#0f172a)] dark:text-white scale-125 ring-4 ring-rose-400/40' : lead.isImported ? 'bg-emerald-600 text-[var(--text-primary,#0f172a)] dark:text-white hover:scale-110' : 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white hover:bg-blue-500 hover:scale-110' }`}
                      title={`${lead.name} (${lead.rating}★)`}
                    >
                      {lead.isImported ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}

                      {/* Tooltip con nombre flotante */}
                      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-slate-900 text-[var(--text-primary,#0f172a)] dark:text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap z-30 font-medium">
                        <span>{lead.name}</span>
                        <span className="text-amber-300">★{lead.rating}</span>
                      </span>
                    </button>
                  </div>
                );
              })}

              {/* Leyenda Inferior del Mapa */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  Prospecto Detectado ({filteredLeads.length})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Importado a Leads
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  Seleccionado
                </span>
              </div>
            </div>

            {/* Ficha Flotante del Marcador Seleccionado */}
            {selectedLead && (
              <div className="p-4 bg-[var(--bg-muted)] border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {selectedLead.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {selectedLead.rating} ({selectedLead.reviewCount} opiniones)
                    </span>
                    {selectedLead.isImported && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Ya en Base de Leads CRM
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">{selectedLead.name}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)] flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                      {selectedLead.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
                      {selectedLead.phone}
                    </span>
                    <a
                      href={selectedLead.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Sitio Web
                    </a>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleExportSingleToLeads(selectedLead)}
                    disabled={selectedLead.isImported}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${ selectedLead.isImported ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-600 hover:bg-emerald-500 text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' }`}
                  >
                    {selectedLead.isImported ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>En Leads CRM</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Exportar a Leads CRM</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Tabla y Lista Detallada de Prospectos */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-xs flex flex-col h-[480px]">
            {/* Cabecera del Listado */}
            <div className="p-3.5 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filteredLeads.length}
                  onChange={handleSelectAll}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  title="Seleccionar todos"
                />
                <span className="font-bold text-[var(--text-primary)] text-xs">
                  Resultados Localizados ({filteredLeads.length})
                </span>
              </div>

              {/* Filtro por estrellas */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Filtrar:</span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="text-[11px] bg-[var(--bg-muted)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 text-[var(--text-secondary)] outline-hidden cursor-pointer"
                >
                  <option value={0}>Todas las calificaciones</option>
                  <option value={4.0}>★ 4.0 o superior</option>
                  <option value={4.7}>★ 4.7+ (Alta intención)</option>
                </select>
              </div>
            </div>

            {/* Listado con scroll */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-[var(--border-subtle)]">
              {filteredLeads.map((lead) => {
                const isSelected = selectedIds.includes(lead.id);
                const isCurrentActive = selectedLead?.id === lead.id;

                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`pt-2.5 first:pt-0 p-2 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${ isCurrentActive ? 'bg-blue-50/70 border border-blue-200' : 'hover:bg-[var(--bg-muted)] border border-transparent' }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(lead.id);
                      }}
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-[var(--text-primary)] text-xs truncate">
                          {lead.name}
                        </h4>
                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 shrink-0">
                          ★ {lead.rating}
                        </span>
                      </div>

                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {lead.category} • {lead.address}
                      </p>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                          {lead.phone}
                        </span>
                        {lead.isImported ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 ml-auto flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            En Leads CRM
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportSingleToLeads(lead);
                            }}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-[var(--text-primary,#0f172a)] dark:text-white ml-auto flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Exportar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer de Acciones Rápidas */}
            <div className="p-3 bg-[var(--bg-muted)] border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
              <span className="text-[11px] text-[var(--text-muted)]">
                {selectedIds.length > 0
                  ? `${selectedIds.length} seleccionados`
                  : `${filteredLeads.length} prospectos listos`}
              </span>

              <button
                type="button"
                onClick={handleExportBatchToLeads}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar a Leads</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleProspeccionMaps;
