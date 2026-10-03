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
  BookOpen,
  Send,
  RefreshCw,
  Server,
  Lock,
  Globe,
  Sliders,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import {
  API_DOCUMENTATION_REGISTRY,
  API_DOC_CATEGORIES,
  generateOpenApiSpec,
  getApiEndpoints,
  EndpointDoc,
} from '../../data/apiDocsRegistry';

interface ApiDocumentationProps {
  className?: string;
}

export const ApiDocumentation: React.FC<ApiDocumentationProps> = ({ className = '' }) => {
  const { showToast, setActiveTab } = useCRM();

  // Component state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>('get-deals');
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'js' | 'python'>('curl');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Live Test Request Simulator State
  const [testingEndpointId, setTestingEndpointId] = useState<string | null>(null);
  const [isTestingInProgress, setIsTestingInProgress] = useState(false);
  const [testResponse, setTestResponse] = useState<{
    status: number;
    durationMs: number;
    headers: Record<string, string>;
    body: string;
  } | null>(null);

  // Fetch filtered endpoints from the central documentation registry
  const filteredEndpoints = useMemo(() => {
    return getApiEndpoints(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  // Copy code snippet helper
  const handleCopyCode = (text: string, snippetId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(snippetId);
    showToast('Código de ejemplo copiado al portapapeles', 'success');
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Download OpenAPI 3.0 specification file
  const handleDownloadOpenApi = () => {
    const specObj = generateOpenApiSpec();
    const specStr = typeof specObj === 'string' ? specObj : JSON.stringify(specObj, null, 2);
    const blob = new Blob([specStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clientum-api-v1-openapi.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Especificación OpenAPI 3.0 descargada', 'success');
  };

  // Simulate Live API Test Request
  const handleRunMockTest = (endpoint: EndpointDoc) => {
    setIsTestingInProgress(true);
    setTestingEndpointId(endpoint.id);
    setTestResponse(null);

    const startTime = performance.now();
    setTimeout(() => {
      const endTime = performance.now();
      const durationMs = Math.round(endTime - startTime);

      setIsTestingInProgress(false);
      setTestResponse({
        status: 200,
        durationMs: durationMs > 0 ? durationMs : 42,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-clientum-ratelimit-remaining': '998',
          'x-clientum-version': 'v1.4.0',
          'access-control-allow-origin': '*',
        },
        body: endpoint.responseExample,
      });
      showToast(`Petición a ${endpoint.path} completada (200 OK en ${durationMs}ms)`, 'success');
    }, 600);
  };

  const getMethodBadgeClass = (method: EndpointDoc['method']) => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'POST':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'PATCH':
      case 'PUT':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Globe size={11} />
                Clientum REST API v1.4
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck size={11} />
                SLA 99.98%
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              Documentación Oficial de la API REST
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Integra tu CRM Clientum con sistemas externos, e-commerce, WhatsApp Bots, webhooks de cobro de Mercado Pago y facturación fiscal AFIP mediante nuestras APIs RESTful con autenticación por clave de API y JWT.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownloadOpenApi}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download size={15} />
              <span>Exportar OpenAPI 3.0</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Key size={15} />
              <span>Gestionar API Keys</span>
            </button>
          </div>
        </div>

        {/* Global Spec Quick Stats */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Server size={16} className="text-blue-400" />
            <div>
              <div className="text-[10px] text-slate-400">Base URL</div>
              <div className="font-mono text-slate-200">https://clientum.com.ar/api</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Lock size={16} className="text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400">Autenticación</div>
              <div className="font-semibold text-slate-200">Bearer Token / X-API-Key</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400">Límite de Cuota</div>
              <div className="font-semibold text-slate-200">1,000 req / min</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-purple-400" />
            <div>
              <div className="text-[10px] text-slate-400">Registro Central</div>
              <div className="font-semibold text-slate-200">{API_DOCUMENTATION_REGISTRY.length} Endpoints Oficiales</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Documentation Card */}
      <div className="bg-[var(--bg-card)] dark:bg-[#0f172a] rounded-2xl border border-[var(--border-subtle)] dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Controls Toolbar: Search & Categories */}
        <div className="p-5 border-b border-[var(--border-subtle)] dark:border-slate-800 bg-[var(--bg-muted)]/50 dark:bg-slate-900/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] dark:text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por endpoint, método HTTP, categoría o palabra clave..."
                className="w-full bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {/* Language snippet selector */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-card)] dark:bg-slate-900 p-1 rounded-xl border border-[var(--border-subtle)] dark:border-slate-800 shrink-0">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] dark:text-slate-400 px-2">
                Snippets:
              </span>
              {[
                { id: 'curl', label: 'cURL' },
                { id: 'js', label: 'JavaScript' },
                { id: 'python', label: 'Python' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setCodeLanguage(lang.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    codeLanguage === lang.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-[var(--text-muted)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {API_DOC_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 text-[var(--text-secondary)] dark:text-slate-300 hover:border-blue-500/50'
                }`}
              >
                {cat === 'all' ? 'Todos los Endpoints' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Endpoints Registry List */}
        <div className="divide-y divide-[var(--border-subtle)] dark:divide-slate-800">
          {filteredEndpoints.length > 0 ? (
            filteredEndpoints.map((ep) => {
              const isExpanded = expandedEndpoint === ep.id;
              const codeSnippet =
                codeLanguage === 'curl'
                  ? ep.curlExample
                  : codeLanguage === 'js'
                  ? ep.jsExample
                  : ep.pythonExample;

              return (
                <div key={ep.id} className="transition-colors hover:bg-[var(--bg-muted)]/30 dark:hover:bg-slate-900/30">
                  {/* Accordion Header */}
                  <div
                    onClick={() => setExpandedEndpoint(isExpanded ? null : ep.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 flex-wrap min-w-0">
                      {/* Method Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border font-mono ${getMethodBadgeClass(
                          ep.method
                        )}`}
                      >
                        {ep.method}
                      </span>

                      {/* Path */}
                      <span className="font-mono text-xs sm:text-sm font-semibold text-[var(--text-primary)] dark:text-slate-100 truncate">
                        {ep.path}
                      </span>

                      {/* Category Badge */}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--bg-muted)] dark:bg-slate-800 text-[var(--text-muted)] dark:text-slate-400">
                        {ep.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-[var(--text-muted)] dark:text-slate-400 hidden md:inline">
                        {ep.summary}
                      </span>
                      {isExpanded ? (
                        <ChevronDown size={18} className="text-blue-500" />
                      ) : (
                        <ChevronRight size={18} className="text-[var(--text-muted)] dark:text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Endpoint Details */}
                  {isExpanded && (
                    <div className="px-4 pb-6 sm:px-6 pt-2 space-y-6 border-t border-[var(--border-subtle)]/60 dark:border-slate-800/60 bg-[var(--bg-muted)]/20 dark:bg-slate-900/20">
                      {/* Description & Auth status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 text-xs">
                        <p className="text-[var(--text-secondary)] dark:text-slate-300 leading-relaxed">
                          {ep.description}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          {ep.authRequired ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold text-[11px]">
                              <Lock size={12} />
                              Requiere API Key / Bearer
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
                              Público
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Query Parameters Table */}
                      {ep.queryParams && ep.queryParams.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-[var(--text-primary)] dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <Sliders size={13} className="text-blue-500" />
                            Parámetros de Consulta (Query Params)
                          </h4>
                          <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] dark:border-slate-800">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[var(--bg-muted)] dark:bg-slate-900/80 text-[var(--text-muted)] dark:text-slate-400 border-b border-[var(--border-subtle)] dark:border-slate-800">
                                <tr>
                                  <th className="p-2.5 font-semibold">Parámetro</th>
                                  <th className="p-2.5 font-semibold">Tipo</th>
                                  <th className="p-2.5 font-semibold">Requerido</th>
                                  <th className="p-2.5 font-semibold">Descripción</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--border-subtle)] dark:divide-slate-800 bg-[var(--bg-card)] dark:bg-slate-900/40">
                                {ep.queryParams.map((param) => (
                                  <tr key={param.name}>
                                    <td className="p-2.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                                      {param.name}
                                    </td>
                                    <td className="p-2.5 font-mono text-slate-500 dark:text-slate-400">
                                      {param.type}
                                    </td>
                                    <td className="p-2.5">
                                      {param.required ? (
                                        <span className="text-rose-500 font-semibold">Sí</span>
                                      ) : (
                                        <span className="text-slate-400">Opcional</span>
                                      )}
                                    </td>
                                    <td className="p-2.5 text-[var(--text-secondary)] dark:text-slate-300">
                                      {param.description}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Two-column view: Code Snippet & Response Example */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Column 1: Request Code Example */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-[var(--text-primary)] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                              <Terminal size={13} className="text-blue-500" />
                              Ejemplo de Petición ({codeLanguage.toUpperCase()})
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(codeSnippet, `code-${ep.id}`)}
                              className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-slate-700 text-[11px] text-[var(--text-secondary)] dark:text-slate-300 hover:text-blue-500 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              {copiedCodeId === `code-${ep.id}` ? (
                                <>
                                  <Check size={12} className="text-emerald-500" />
                                  <span className="text-emerald-500">Copiado</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                          </div>

                          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto custom-scrollbar leading-relaxed">
                            {codeSnippet}
                          </pre>
                        </div>

                        {/* Column 2: Expected JSON Response */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-[var(--text-primary)] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="text-emerald-500" />
                              Respuesta JSON Esperada (200 OK)
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleRunMockTest(ep)}
                              disabled={isTestingInProgress && testingEndpointId === ep.id}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer shadow-xs disabled:opacity-50"
                            >
                              {isTestingInProgress && testingEndpointId === ep.id ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : (
                                <Play size={12} />
                              )}
                              <span>Probar Petición</span>
                            </button>
                          </div>

                          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto custom-scrollbar leading-relaxed">
                            {ep.responseExample}
                          </pre>
                        </div>
                      </div>

                      {/* Live Test Execution Result Box */}
                      {testingEndpointId === ep.id && testResponse && (
                        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                                HTTP {testResponse.status} OK
                              </span>
                              <span className="text-slate-400">
                                Latencia: <strong className="text-white">{testResponse.durationMs} ms</strong>
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              Respuesta en Vivo Simulada
                            </span>
                          </div>
                          <pre className="p-3 rounded-lg bg-slate-950 text-[11px] font-mono text-slate-200 overflow-x-auto">
                            {testResponse.body}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Code2 size={24} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-[var(--text-primary)] dark:text-slate-200">
                No se encontraron endpoints para esta búsqueda
              </p>
              <p className="text-[11px] text-[var(--text-muted)] dark:text-slate-400 mt-1">
                Intenta cambiar los términos de búsqueda o el filtro de categoría.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
