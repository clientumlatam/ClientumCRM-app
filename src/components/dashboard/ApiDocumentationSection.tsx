import React, { useState, useMemo } from 'react';
import {
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Key,
  ShieldCheck,
  Terminal,
  Zap,
  Sparkles,
  Search,
  Download,
  Play,
  CheckCircle2,
  FileCode2,
  ExternalLink,
  Layers,
  BookOpen
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import {
  API_DOCUMENTATION_REGISTRY,
  API_DOC_CATEGORIES,
  generateOpenApiSpec,
  getApiEndpoints,
  EndpointDoc
} from '../../data/apiDocsRegistry';

export const ApiDocumentationSection: React.FC = () => {
  const { showToast, setActiveTab } = useCRM();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>('get-deals');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'js' | 'python'>('curl');
  const [testingEndpointId, setTestingEndpointId] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<{ status: number; duration: number; body: string } | null>(null);
  const [isTestingInProgress, setIsTestingInProgress] = useState(false);

  // Retrieve filtered endpoints from central registry
  const filteredEndpoints = useMemo(() => {
    return getApiEndpoints(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    showToast('Código de ejemplo copiado al portapapeles', 'success');
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleRunMockTest = (ep: EndpointDoc) => {
    setIsTestingInProgress(true);
    setTestingEndpointId(ep.id);
    setTestResponse(null);

    setTimeout(() => {
      setIsTestingInProgress(false);
      setTestResponse({
        status: 200,
        duration: Math.floor(Math.random() * 40) + 30,
        body: ep.responseExample,
      });
      showToast(`Petición simulada exitosa a ${ep.path} (200 OK)`, 'success');
    }, 400);
  };

  const handleDownloadOpenApi = () => {
    const spec = generateOpenApiSpec();
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientum-api-spec.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Especificación OpenAPI 3.0 descargada con éxito', 'success');
  };

  const getMethodBadge = (method: EndpointDoc['method']) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'POST':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'PATCH':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/30';
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs overflow-hidden transition-all">
      {/* Header Banner */}
      <div className="p-6 border-b border-[var(--border-subtle)] bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
              <Terminal className="w-3.5 h-3.5" />
              <span>Clientum REST API v1.0</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Central Registry Activo · 99.98% SLA
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span>API Documentation & Integraciones Externas</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Endpoints oficiales centralizados para conectar ClientumCRM con tiendas e-commerce (Tiendanube / WooCommerce), ERPs contables, facturación AFIP, pasarelas de pago Mercado Pago y canales WhatsApp / Resend.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadOpenApi}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer shadow-xs"
            title="Descargar especificación OpenAPI 3.0"
          >
            <Download className="w-3.5 h-3.5 text-blue-300" />
            <span>OpenAPI Spec</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Gestionar API Keys</span>
          </button>
        </div>
      </div>

      {/* Authentication & Quick Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border-subtle)] bg-[var(--bg-muted)]/30 border-b border-[var(--border-subtle)]">
        <div className="p-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Autenticación</span>
            <span className="text-xs font-semibold text-[var(--text-primary)] font-mono truncate block">Authorization: Bearer clt_live_...</span>
          </div>
        </div>

        <div className="p-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Rate Limits & Cuota</span>
            <span className="text-xs font-semibold text-[var(--text-primary)] block">120 peticiones / minuto por Tenant</span>
          </div>
        </div>

        <div className="p-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <FileCode2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Formato de Intercambio</span>
            <span className="text-xs font-semibold text-[var(--text-primary)] block">JSON UTF-8 estricto + Webhooks HMAC</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por endpoint, método, tag o descripción..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {/* Code Language Switcher */}
        <div className="flex items-center gap-2 self-end md:self-auto text-xs">
          <span className="text-[11px] font-medium text-[var(--text-muted)]">Lenguaje de ejemplo:</span>
          <div className="flex bg-[var(--bg-card)] p-0.5 rounded-lg border border-[var(--border-subtle)] font-mono text-[11px]">
            {(['curl', 'js', 'python'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setCodeLanguage(lang)}
                className={`px-2.5 py-1 rounded-md font-bold uppercase transition-all cursor-pointer ${
                  codeLanguage === lang
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-wrap items-center gap-1.5 overflow-x-auto">
        {API_DOC_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-[var(--bg-muted)]/60 hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
            }`}
          >
            {cat === 'all' ? `Todos los Endpoints (${API_DOCUMENTATION_REGISTRY.length})` : cat}
          </button>
        ))}
      </div>

      {/* Endpoints List Accordion */}
      <div className="divide-y divide-[var(--border-subtle)]">
        {filteredEndpoints.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)]">
            No se encontraron endpoints que coincidan con la búsqueda.
          </div>
        ) : (
          filteredEndpoints.map((ep) => {
            const isExpanded = expandedEndpoint === ep.id;
            const currentSnippet =
              codeLanguage === 'curl'
                ? ep.curlExample
                : codeLanguage === 'js'
                ? ep.jsExample
                : ep.pythonExample;

            return (
              <div key={ep.id} className="transition-colors">
                {/* Endpoint Summary Row */}
                <button
                  type="button"
                  onClick={() => setExpandedEndpoint(isExpanded ? null : ep.id)}
                  className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-[var(--bg-muted)]/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${getMethodBadge(
                        ep.method
                      )}`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)] truncate">
                      {ep.path}
                    </span>
                    <span className="hidden sm:inline text-xs text-[var(--text-muted)] truncate">
                      — {ep.summary}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hidden sm:inline">
                      {ep.category}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                  </div>
                </button>

                {/* Endpoint Details Drawer */}
                {isExpanded && (
                  <div className="p-5 bg-[var(--bg-muted)]/20 border-t border-[var(--border-subtle)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                        {ep.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRunMockTest(ep)}
                        disabled={isTestingInProgress}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isTestingInProgress ? 'Enviando...' : 'Probar Petición'}</span>
                      </button>
                    </div>

                    {/* Query Params if any */}
                    {ep.queryParams && ep.queryParams.length > 0 && (
                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                        <span className="text-[11px] font-bold text-[var(--text-primary)] block">
                          Parámetros de Consulta (Query String):
                        </span>
                        <div className="space-y-1">
                          {ep.queryParams.map((param) => (
                            <div key={param.name} className="flex items-baseline gap-2 text-xs">
                              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{param.name}</span>
                              <span className="text-[10px] text-[var(--text-muted)] font-mono">({param.type})</span>
                              {param.required && (
                                <span className="text-[9px] font-bold uppercase text-rose-500 bg-rose-500/10 px-1 rounded">Requerido</span>
                              )}
                              <span className="text-[var(--text-secondary)] text-[11px]">· {param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Left: Code Snippet */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-blue-500" />
                            Ejemplo de Petición ({codeLanguage.toUpperCase()})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(currentSnippet, `${ep.id}-req`)}
                            className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-500 font-semibold cursor-pointer"
                          >
                            {copiedCodeId === `${ep.id}-req` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-500">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                          <code>{currentSnippet}</code>
                        </pre>
                      </div>

                      {/* Right: Response Example */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-emerald-500" />
                            Respuesta HTTP 200 OK
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(ep.responseExample, `${ep.id}-res`)}
                            className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-500 font-semibold cursor-pointer"
                          >
                            {copiedCodeId === `${ep.id}-res` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-500">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                          <code>{ep.responseExample}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Interactive Live Test Simulator Output */}
                    {testingEndpointId === ep.id && testResponse && (
                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Resultado Simulado en Vivo · Status {testResponse.status} OK ({testResponse.duration}ms)
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                            X-Tenant-Id: clientum-default-tenant
                          </span>
                        </div>
                        <pre className="p-3 rounded-lg bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                          <code>{testResponse.body}</code>
                        </pre>
                      </div>
                    )}

                    {/* Request Body Schema if present */}
                    {ep.requestBody && (
                      <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1">
                        <span className="text-[11px] font-bold text-[var(--text-muted)] block">
                          Payload JSON de Entrada (Request Body):
                        </span>
                        <pre className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-secondary)] overflow-x-auto">
                          <code>{ep.requestBody}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-[var(--bg-muted)]/50 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Para revocar o generar nuevas API Keys por rol o usuario, dirígete a Configuración &gt; Claves de API.</span>
        </div>
        <span className="font-mono text-[11px] text-[var(--text-secondary)] shrink-0">
          Headers de Respuesta: X-RateLimit-Limit: 120 | X-RateLimit-Remaining: 119
        </span>
      </div>
    </div>
  );
};
