import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ArrowRight,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  Code2,
  LayoutGrid,
  List,
  Sparkles,
  Layers,
  FileCode2,
  ChevronRight,
  Info
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import {
  DASHBOARD_DOCS_CATALOG,
  DASHBOARD_DOCS_README_MARKDOWN,
  DashboardDocItem
} from '../../data/dashboardDocsCatalog';
import { ActiveTab } from '../../types';

export const DashboardDocsExplorerPage: React.FC = () => {
  const { setActiveTab, showToast } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<DashboardDocItem | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'markdown'>('details');
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('grid');

  const categories = useMemo(() => {
    return [
      'all',
      'Comercial',
      'Comunicación',
      'IA & Automatización',
      'ERP & Finanzas',
      'Administración & Sistema',
    ];
  }, []);

  const filteredDocs = useMemo(() => {
    return DASHBOARD_DOCS_CATALOG.filter((doc) => {
      const matchCat = selectedCategory === 'all' || doc.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.filename.toLowerCase().includes(q) ||
        doc.badge.toLowerCase().includes(q) ||
        doc.purpose.toLowerCase().includes(q) ||
        doc.components.some((c) => c.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: DASHBOARD_DOCS_CATALOG.length };
    DASHBOARD_DOCS_CATALOG.forEach((doc) => {
      counts[doc.category] = (counts[doc.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleNavigateToModule = (tab: ActiveTab, docTitle: string) => {
    setActiveTab(tab);
    showToast(`Navegando a la vista operativa: ${docTitle}`, 'info');
  };

  const handleCopyMarkdown = (content: string, filename: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    showToast(`Copiado al portapapeles: ${filename}`, 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Descargando archivo ${filename}`, 'info');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[var(--clientum-surface,#F5F7FA)] dark:bg-[var(--crm-bg,#040711)] text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 transition-colors">
      {/* Breadcrumb & Header */}
      <div className="space-y-4 pb-4 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
            <span>ClientumOS</span>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-secondary)]" />
            <span>Documentación del Sistema</span>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-secondary)]" />
            <span className="text-[var(--clientum-action,#0056B3)] dark:text-blue-400 font-mono font-semibold">dashboard_docs</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReadmeModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] dark:bg-slate-800 hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>Ver README.md General</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                18 Módulos Canónicos
              </span>
              <span className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">Directorio /dashboard_docs/*.md</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--clientum-navy,#022046)] dark:text-white tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-500" />
              Documentación Técnica del Dashboard (dashboard_docs)
            </h1>
            <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Catálogo centralizado de los 18 documentos Markdown de arquitectura, especificación de componentes y flujos de negocio del panel de control de ClientumOS, vinculados 1-a-1 con cada pantalla y controlador operativo.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <div className="bg-[var(--bg-card)] dark:bg-slate-800/80 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 rounded-xl px-3 py-2 text-center min-w-[85px] shadow-xs">
              <span className="block text-base font-extrabold text-[var(--text-primary)] dark:text-white">18</span>
              <span className="block text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium uppercase">Módulos</span>
            </div>
            <div className="bg-[var(--bg-card)] dark:bg-slate-800/80 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 rounded-xl px-3 py-2 text-center min-w-[85px] shadow-xs">
              <span className="block text-base font-extrabold text-emerald-600 dark:text-emerald-400">100%</span>
              <span className="block text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium uppercase">Operativos</span>
            </div>
            <div className="bg-[var(--bg-card)] dark:bg-slate-800/80 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 rounded-xl px-3 py-2 text-center min-w-[85px] shadow-xs">
              <span className="block text-base font-extrabold text-blue-600 dark:text-blue-400">5</span>
              <span className="block text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 font-medium uppercase">Categorías</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[var(--bg-card)] dark:bg-slate-800/50 p-3 rounded-xl border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--text-muted,#64748b)] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por módulo, archivo .md, capacidad o propósito..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[var(--bg-muted)] dark:bg-slate-900/90 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 rounded-lg text-xs text-[var(--text-primary)] dark:text-white placeholder:text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${ isSelected ? 'bg-[var(--clientum-blue,#002B5C)] text-[var(--text-primary,#0f172a)] dark:text-white shadow-xs' : 'text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700/60' }`}
                >
                  <span>{cat === 'all' ? 'Todos' : cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${ isSelected ? 'bg-blue-900 text-blue-100' : 'bg-[var(--bg-muted)] dark:bg-slate-800 text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400' }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center border-l border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 pl-2 gap-1">
            <button
              onClick={() => setViewStyle('grid')}
              title="Vista en Cuadrícula"
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${ viewStyle === 'grid' ? 'bg-[var(--bg-muted)] dark:bg-slate-700 text-[var(--text-primary)] dark:text-white' : 'text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800' }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewStyle('list')}
              title="Vista en Lista"
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${ viewStyle === 'list' ? 'bg-[var(--bg-muted)] dark:bg-slate-700 text-[var(--text-primary)] dark:text-white' : 'text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800' }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List View */}
      {viewStyle === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.id}
                className="p-5 rounded-xl bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] hover:border-blue-500/50 hover:bg-[var(--bg-muted)]/50 dark:hover:bg-slate-800/60 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 bg-[var(--bg-muted)] dark:bg-slate-800/90 px-2 py-0.5 rounded border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                          {doc.filename}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] dark:bg-slate-800 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 shrink-0">
                      {doc.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white group-hover:text-[var(--clientum-action,#0056B3)] dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted)] tracking-wider">
                      Capacidades Documentadas:
                    </span>
                    <ul className="space-y-1 text-[11px] text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">
                      {doc.components.slice(0, 2).map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setModalTab('details');
                    }}
                    className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    <span>Ficha & .md</span>
                  </button>

                  <button
                    onClick={() => handleNavigateToModule(doc.activeTabTarget, doc.title)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Abrir Vista</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-[var(--bg-card)] dark:bg-[#0D1527] border border-[var(--border-subtle)] dark:border-[#1E2E4A] hover:border-blue-500/40 hover:bg-[var(--bg-muted)]/50 dark:hover:bg-slate-800/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 bg-[var(--bg-muted)] dark:bg-slate-800 px-1.5 py-0.5 rounded border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                        {doc.filename}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] dark:bg-slate-800 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                        {doc.badge}
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{doc.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white truncate">{doc.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 truncate mt-0.5">{doc.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setModalTab('details');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    <span>Ficha & Markdown</span>
                  </button>
                  <button
                    onClick={() => handleNavigateToModule(doc.activeTabTarget, doc.title)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Abrir Vista</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="text-center py-12 px-4 rounded-2xl bg-[var(--bg-card)] dark:bg-slate-800/20 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/40 space-y-3 shadow-xs">
          <BookOpen className="w-8 h-8 text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:text-[var(--text-muted)] mx-auto" />
          <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">No se encontraron documentos</h3>
          <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 max-w-sm mx-auto">
            No hay especificaciones que coincidan con &ldquo;{searchQuery}&rdquo; en la categoría seleccionada.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] dark:bg-slate-800 dark:hover:bg-slate-700 text-xs text-blue-600 dark:text-blue-400 font-semibold cursor-pointer transition-colors"
          >
            Limpiar filtros de búsqueda
          </button>
        </div>
      )}

      {/* Detail Modal with Tabs: Ficha Técnica vs Markdown Completo */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex items-start justify-between gap-4 shrink-0 bg-[var(--bg-muted)]/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <selectedDoc.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 bg-[var(--bg-muted)] dark:bg-slate-800 px-2 py-0.5 rounded border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
                      dashboard_docs/{selectedDoc.filename}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {selectedDoc.category}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-[var(--text-primary)] dark:text-white mt-1">{selectedDoc.title}</h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedDoc(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-5 pt-3 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex items-center justify-between shrink-0 bg-[var(--bg-muted)]/80 dark:bg-slate-900/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalTab('details')}
                  className={`pb-2.5 px-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${ modalTab === 'details' ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                >
                  Ficha Técnica & Capacidades
                </button>
                <button
                  onClick={() => setModalTab('markdown')}
                  className={`pb-2.5 px-2 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${ modalTab === 'markdown' ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Documento Markdown Completo (.md)</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 pb-2">
                <button
                  onClick={() => handleCopyMarkdown(selectedDoc.rawMarkdown, selectedDoc.filename)}
                  className="px-2.5 py-1 rounded-md bg-[var(--bg-card)] dark:bg-slate-800 hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs font-semibold flex items-center gap-1 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copiado' : 'Copiar MD'}</span>
                </button>
                <button
                  onClick={() => handleDownloadMarkdown(selectedDoc.rawMarkdown, selectedDoc.filename)}
                  className="px-2.5 py-1 rounded-md bg-[var(--bg-card)] dark:bg-slate-800 hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs font-semibold flex items-center gap-1 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3 h-3" />
                  <span>Descargar</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {modalTab === 'details' ? (
                <div className="space-y-5">
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 uppercase text-[11px] tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>1. Propósito y Alcance del Módulo</span>
                    </h4>
                    <div className="bg-[var(--bg-muted)] dark:bg-slate-800/60 p-3.5 rounded-xl border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 leading-relaxed text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">
                      {selectedDoc.purpose}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      <span>2. Componentes y Capacidades Especificadas</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedDoc.components.map((comp, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800/40 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/60 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300">{comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 flex items-start justify-between gap-3">
                    <div>
                      <span className="block font-bold text-blue-900 dark:text-blue-300 text-xs">Ubicación física en el repositorio:</span>
                      <code className="text-[11px] text-blue-800 dark:text-blue-200 font-mono">/dashboard_docs/{selectedDoc.filename}</code>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 text-[10px] font-bold shrink-0">
                      Markdown Válido
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">
                    <span>Contenido Markdown renderizado desde el archivo físico:</span>
                    <span className="font-mono text-[var(--text-secondary)] dark:text-[var(--text-muted)]">{selectedDoc.filename}</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 font-mono text-[11px] text-[var(--text-primary,#0f172a)] dark:text-slate-200 dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-blue-600 selection:text-white">
                    {selectedDoc.rawMarkdown}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex items-center justify-between shrink-0 bg-[var(--bg-muted)]/90 dark:bg-slate-900/90">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Cerrar
              </button>

              <button
                onClick={() => {
                  const target = selectedDoc.activeTabTarget;
                  const title = selectedDoc.title;
                  setSelectedDoc(null);
                  handleNavigateToModule(target, title);
                }}
                className="px-4 py-2 bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span>Acceder a la Vista Operativa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* General README Modal */}
      {isReadmeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex items-start justify-between gap-4 shrink-0 bg-[var(--bg-muted)]/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400">/dashboard_docs/README.md</span>
                  <h2 className="text-base font-bold text-[var(--text-primary)] dark:text-white mt-0.5">Índice General de Documentación del Dashboard</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyMarkdown(DASHBOARD_DOCS_README_MARKDOWN, 'README.md')}
                  className="px-2.5 py-1 rounded-md bg-[var(--bg-card)] dark:bg-slate-800 hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs font-semibold flex items-center gap-1 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 cursor-pointer shadow-xs transition-colors"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={() => setIsReadmeModalOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 dark:hover:text-white p-1 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              <pre className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 border border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 font-mono text-[11px] text-[var(--text-primary,#0f172a)] dark:text-slate-200 dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {DASHBOARD_DOCS_README_MARKDOWN}
              </pre>
            </div>

            <div className="p-4 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex justify-end shrink-0 bg-[var(--bg-muted)]/90 dark:bg-slate-900/90">
              <button
                onClick={() => setIsReadmeModalOpen(false)}
                className="px-4 py-2 bg-[var(--clientum-action,#0056B3)] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#004494] text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
