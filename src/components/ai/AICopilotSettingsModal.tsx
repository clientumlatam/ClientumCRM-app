import React, { useState, useEffect } from 'react';
import {
  X,
  Bot,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  Trash2,
  Check,
  RotateCw,
  CircleDot,
  Activity,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { getClientumAuthHeaders, getClientumAuthJsonHeaders } from '../../lib/api';

interface AICopilotSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProviderStatus {
  preferredProvider: string;
  openRouter: {
    configured: boolean;
    model: string;
    maskedKey: string | null;
  };
  openai: {
    configured: boolean;
    model: string;
    maskedKey: string | null;
  };
  gemini: {
    configured: boolean;
    model: string;
  };
}

const OPENROUTER_MODELS = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tag: 'Recomendado para Deals B2B',
    description: 'Máxima precisión analítica, redacción persuasiva y detección de objeciones.',
  },
  {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    tag: 'Razonamiento Profundo',
    description: 'Cadena de pensamiento exhaustiva para estrategias complejas y contratos enterprise.',
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    tag: 'Rápido & Ultra Económico',
    description: 'Alta velocidad para resúmenes rápidos de pipeline y borradores cotidianos.',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o (vía OpenRouter)',
    provider: 'OpenAI',
    tag: 'Inteligencia Multimodal',
    description: 'Potencia insignia de OpenAI con enrutamiento inteligente de OpenRouter.',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    tag: 'Open Weights',
    description: 'Modelo de pesos abiertos líder para razonamiento y estructuración de datos.',
  },
];

const OPENAI_MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    tag: 'Modelo Insignia',
    description: 'El modelo más potente y rápido de OpenAI para análisis de pipeline y negociación.',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    tag: 'Económico & Eficiente',
    description: 'Respuestas instantáneas con costo mínimo para operaciones de alto volumen.',
  },
  {
    id: 'o1-mini',
    name: 'o1 Mini',
    tag: 'Razonamiento Lógico',
    description: 'Especializado en cálculos de pricing, márgenes comerciales y contratos.',
  },
];

export interface KeyVerificationState {
  status: 'idle' | 'checking' | 'active' | 'invalid' | 'not_configured';
  message?: string;
  latencyMs?: number;
  statusCode?: number;
  testedAt?: string;
  model?: string;
}

export const AICopilotSettingsModal: React.FC<AICopilotSettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, showToast, language } = useCRM();

  const [activeTab, setActiveTab] = useState<'openrouter' | 'openai' | 'gemini'>('openrouter');
  const [preferredProvider, setPreferredProvider] = useState<'openrouter' | 'openai' | 'gemini'>('openrouter');

  // Input states
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [openRouterModel, setOpenRouterModel] = useState('anthropic/claude-3.5-sonnet');
  const [customOpenRouterModel, setCustomOpenRouterModel] = useState('');
  const [showCustomModelInput, setShowCustomModelInput] = useState(false);
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);

  const [openAIKey, setOpenAIKey] = useState('');
  const [openAIModel, setOpenAIModel] = useState('gpt-4o');
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);

  // Status & loading states
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    timestamp?: string;
  } | null>(null);

  // Real-time verification indicators for stored API keys
  const [openRouterVerification, setOpenRouterVerification] = useState<KeyVerificationState>({
    status: 'idle',
  });
  const [openAIVerification, setOpenAIVerification] = useState<KeyVerificationState>({
    status: 'idle',
  });

  // Verify connection status with API call
  const verifyKeyConnection = async (
    provider: 'openrouter' | 'openai',
    keyOverride?: string,
    modelOverride?: string
  ) => {
    const isRouter = provider === 'openrouter';
    const setVerification = isRouter ? setOpenRouterVerification : setOpenAIVerification;
    const currentInputKey = isRouter ? openRouterKey.trim() : openAIKey.trim();
    const effectiveKey = keyOverride !== undefined ? keyOverride.trim() : currentInputKey;
    const isConfigured = isRouter ? providerStatus?.openRouter.configured : providerStatus?.openai.configured;

    if (!effectiveKey && !isConfigured) {
      setVerification({
        status: 'not_configured',
        message: language === 'es' ? 'Sin clave configurada' : 'No key configured',
      });
      return;
    }

    setVerification((prev) => ({
      ...prev,
      status: 'checking',
      message: language === 'es' ? 'Verificando estado de conexión con API...' : 'Verifying connection status with API...',
    }));
    setIsTesting(true);

    try {
      const model = modelOverride || (isRouter
        ? (showCustomModelInput && customOpenRouterModel.trim() ? customOpenRouterModel.trim() : openRouterModel)
        : openAIModel);

      const res = await fetch('/api/ai/copilot/test-connection', {
        method: 'POST',
        headers: await getClientumAuthJsonHeaders(),
        body: JSON.stringify({
          provider,
          apiKey: effectiveKey || '__USE_STORED__',
          model,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        const state: KeyVerificationState = {
          status: 'active',
          message: data.message || (language === 'es' ? 'Clave válida y conexión activa.' : 'Key is valid and connection active.'),
          latencyMs: data.latencyMs,
          statusCode: data.statusCode || 200,
          model: data.model || model,
          testedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setVerification(state);
        setTestResult({
          success: true,
          message: state.message,
          timestamp: state.testedAt,
        });
      } else {
        const state: KeyVerificationState = {
          status: 'invalid',
          message: data.error || (language === 'es' ? 'Fallo de autenticación con el proveedor.' : 'Authentication failed with provider.'),
          latencyMs: data.latencyMs,
          statusCode: data.statusCode || res.status,
          model,
          testedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setVerification(state);
        setTestResult({
          success: false,
          error: state.message,
          timestamp: state.testedAt,
        });
      }
    } catch (err: any) {
      const state: KeyVerificationState = {
        status: 'invalid',
        message: err?.message || (language === 'es' ? 'Error al contactar el servidor de verificación.' : 'Verification error.'),
        testedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setVerification(state);
      setTestResult({
        success: false,
        error: state.message,
        timestamp: state.testedAt,
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Load configured keys from server and trigger verification
  const loadProviderStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/ai/copilot/provider-status', {
        headers: await getClientumAuthHeaders(currentUser),
      });
      if (res.ok) {
        const data: ProviderStatus = await res.json();
        setProviderStatus(data);
        if (data.preferredProvider === 'openrouter' || data.preferredProvider === 'openai' || data.preferredProvider === 'gemini') {
          setPreferredProvider(data.preferredProvider);
        }
        if (data.openRouter.model) {
          const isPreset = OPENROUTER_MODELS.some((m) => m.id === data.openRouter.model);
          if (isPreset) {
            setOpenRouterModel(data.openRouter.model);
            setShowCustomModelInput(false);
          } else {
            setOpenRouterModel('custom');
            setCustomOpenRouterModel(data.openRouter.model);
            setShowCustomModelInput(true);
          }
        }
        if (data.openai.model) {
          setOpenAIModel(data.openai.model);
        }

        // Automatic connection status check for configured keys
        if (data.openRouter.configured) {
          void verifyKeyConnection('openrouter', undefined, data.openRouter.model);
        } else {
          setOpenRouterVerification({
            status: 'not_configured',
            message: language === 'es' ? 'Sin clave configurada' : 'No key configured',
          });
        }

        if (data.openai.configured) {
          void verifyKeyConnection('openai', undefined, data.openai.model);
        } else {
          setOpenAIVerification({
            status: 'not_configured',
            message: language === 'es' ? 'Sin clave configurada' : 'No key configured',
          });
        }
      }
    } catch (err) {
      console.warn('Could not load AI provider status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      void loadProviderStatus();
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Test current key
  const handleTestConnection = async (provider: 'openrouter' | 'openai') => {
    setIsTesting(true);
    setTestResult(null);

    const apiKey = provider === 'openrouter' ? openRouterKey.trim() : openAIKey.trim();
    const model = provider === 'openrouter'
      ? (showCustomModelInput && customOpenRouterModel.trim() ? customOpenRouterModel.trim() : openRouterModel)
      : openAIModel;

    if (!apiKey) {
      // Check if already configured on server
      if (
        (provider === 'openrouter' && !providerStatus?.openRouter.configured) ||
        (provider === 'openai' && !providerStatus?.openai.configured)
      ) {
        setTestResult({
          success: false,
          error: language === 'es'
            ? 'Por favor ingresa tu API Key antes de realizar la prueba.'
            : 'Please enter your API Key before testing.',
        });
        setIsTesting(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/ai/copilot/test-connection', {
        method: 'POST',
        headers: await getClientumAuthJsonHeaders(),
        body: JSON.stringify({
          provider,
          apiKey: apiKey || '__USE_STORED__',
          model,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || (language === 'es' ? 'Conexión exitosa y verificada.' : 'Connection verified successfully.'),
          timestamp: new Date().toLocaleTimeString(),
        });
        showToast(
          language === 'es'
            ? `Conexión exitosa con ${provider === 'openrouter' ? 'OpenRouter' : 'OpenAI'}`
            : `Connection to ${provider === 'openrouter' ? 'OpenRouter' : 'OpenAI'} verified`,
          'success'
        );
      } else {
        setTestResult({
          success: false,
          error: data.error || (language === 'es' ? 'Fallo de autenticación con el proveedor.' : 'Authentication failed with provider.'),
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || (language === 'es' ? 'Error al contactar el servidor de verificación.' : 'Verification error.'),
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Save credentials securely to server vault
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const selectedModel = showCustomModelInput && customOpenRouterModel.trim()
        ? customOpenRouterModel.trim()
        : openRouterModel;

      const payloadValues: Record<string, string> = {
        PREFERRED_AI_PROVIDER: preferredProvider,
      };

      if (openRouterKey.trim()) {
        payloadValues.OPENROUTER_API_KEY = openRouterKey.trim();
      }
      if (selectedModel) {
        payloadValues.OPENROUTER_MODEL = selectedModel;
      }

      if (openAIKey.trim()) {
        payloadValues.OPENAI_API_KEY = openAIKey.trim();
      }
      if (openAIModel) {
        payloadValues.OPENAI_MODEL = openAIModel;
      }

      const res = await fetch('/api/user-credentials', {
        method: 'PUT',
        headers: await getClientumAuthJsonHeaders(),
        body: JSON.stringify({
          moduleId: 'aiCopilot',
          values: payloadValues,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'No se pudo guardar la configuración segura.');
      }

      showToast(
        language === 'es'
          ? 'Claves de IA guardadas y cifradas exitosamente'
          : 'AI keys securely saved and encrypted',
        'success'
      );

      // Reload fresh provider status
      await loadProviderStatus();
      setOpenRouterKey('');
      setOpenAIKey('');
    } catch (err: any) {
      showToast(err.message || 'Error al guardar credenciales', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Remove a key
  const handleRemoveKey = async (keyField: 'OPENROUTER_API_KEY' | 'OPENAI_API_KEY') => {
    if (!confirm(language === 'es' ? '¿Deseas desvincular esta clave de IA de tu espacio?' : 'Disconnect this AI key?')) {
      return;
    }
    try {
      // Re-save with empty or call endpoint
      const res = await fetch('/api/user-credentials', {
        method: 'PUT',
        headers: await getClientumAuthJsonHeaders(),
        body: JSON.stringify({
          moduleId: 'aiCopilot',
          values: {
            [keyField]: '',
          },
        }),
      });
      if (res.ok) {
        showToast(language === 'es' ? 'Clave eliminada del vault' : 'Key removed', 'info');
        await loadProviderStatus();
      }
    } catch (e) {
      showToast('Error al eliminar la clave', 'error');
    }
  };

  return (
    <div
      id="ai-copilot-settings-modal-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="ai-copilot-settings-modal"
        className="w-full max-w-2xl bg-white dark:bg-[#0d1829] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#101e33]/60 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-teal-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-500 dark:text-cyan-400 shrink-0 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                  {language === 'es' ? 'Configuración de IA • Deal Copilot' : 'AI Deal Copilot • Engine Settings'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  OpenRouter & OpenAI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'es'
                  ? 'Configura y almacena de forma segura tus claves para alimentar el análisis de tratos con modelos LLM de última generación.'
                  : 'Securely store your OpenRouter or OpenAI keys to power real-time sales intelligence and deal copilot.'}
              </p>
            </div>
          </div>

          <button
            id="ai-copilot-settings-close-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={language === 'es' ? 'Cerrar' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Active Provider Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {language === 'es' ? 'Proveedor Principal Activo para Tratos' : 'Active Primary Deal AI Provider'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* OpenRouter Pill */}
              <button
                type="button"
                id="provider-select-openrouter"
                onClick={() => {
                  setPreferredProvider('openrouter');
                  setActiveTab('openrouter');
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  preferredProvider === 'openrouter'
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-950 dark:text-cyan-100 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <Globe className="w-3.5 h-3.5 text-cyan-500" />
                    <span>OpenRouter</span>
                  </div>
                  {preferredProvider === 'openrouter' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                  )}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                  Claude 3.5, DeepSeek R1, Llama 3.3
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={`inline-block w-2 h-2 rounded-full transition-all ${
                      openRouterVerification.status === 'active'
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                        : openRouterVerification.status === 'checking'
                        ? 'bg-cyan-500 animate-ping'
                        : openRouterVerification.status === 'invalid'
                        ? 'bg-rose-500'
                        : providerStatus?.openRouter.configured
                        ? 'bg-emerald-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    {openRouterVerification.status === 'active'
                      ? (language === 'es' ? 'Activa & Verificada' : 'Active & Verified')
                      : openRouterVerification.status === 'checking'
                      ? (language === 'es' ? 'Verificando...' : 'Verifying...')
                      : openRouterVerification.status === 'invalid'
                      ? (language === 'es' ? 'Error en clave' : 'Key error')
                      : providerStatus?.openRouter.configured
                      ? (language === 'es' ? 'Configurada' : 'Configured')
                      : (language === 'es' ? 'Sin clave' : 'No key')}
                  </span>
                </div>
              </button>

              {/* OpenAI Pill */}
              <button
                type="button"
                id="provider-select-openai"
                onClick={() => {
                  setPreferredProvider('openai');
                  setActiveTab('openai');
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  preferredProvider === 'openai'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    <span>OpenAI Directo</span>
                  </div>
                  {preferredProvider === 'openai' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                  GPT-4o, GPT-4o Mini, o1
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={`inline-block w-2 h-2 rounded-full transition-all ${
                      openAIVerification.status === 'active'
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                        : openAIVerification.status === 'checking'
                        ? 'bg-emerald-500 animate-ping'
                        : openAIVerification.status === 'invalid'
                        ? 'bg-rose-500'
                        : providerStatus?.openai.configured
                        ? 'bg-emerald-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    {openAIVerification.status === 'active'
                      ? (language === 'es' ? 'Activa & Verificada' : 'Active & Verified')
                      : openAIVerification.status === 'checking'
                      ? (language === 'es' ? 'Verificando...' : 'Verifying...')
                      : openAIVerification.status === 'invalid'
                      ? (language === 'es' ? 'Error en clave' : 'Key error')
                      : providerStatus?.openai.configured
                      ? (language === 'es' ? 'Configurada' : 'Configured')
                      : (language === 'es' ? 'Sin clave' : 'No key')}
                  </span>
                </div>
              </button>

              {/* Gemini Platform Pill */}
              <button
                type="button"
                id="provider-select-gemini"
                onClick={() => {
                  setPreferredProvider('gemini');
                  setActiveTab('gemini');
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  preferredProvider === 'gemini'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-950 dark:text-blue-100 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>Google Gemini</span>
                  </div>
                  {preferredProvider === 'gemini' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  )}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                  Gemini 2.5 (Plataforma)
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    Activo por defecto
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Provider Tabs Header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              id="tab-openrouter"
              onClick={() => setActiveTab('openrouter')}
              className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'openrouter'
                  ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Configuración OpenRouter</span>
              {openRouterVerification.status === 'active' ? (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : openRouterVerification.status === 'checking' ? (
                <RotateCw className="w-2.5 h-2.5 animate-spin text-cyan-500" />
              ) : openRouterVerification.status === 'invalid' ? (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              ) : providerStatus?.openRouter.configured ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ) : null}
            </button>

            <button
              type="button"
              id="tab-openai"
              onClick={() => setActiveTab('openai')}
              className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'openai'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Configuración OpenAI</span>
              {openAIVerification.status === 'active' ? (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : openAIVerification.status === 'checking' ? (
                <RotateCw className="w-2.5 h-2.5 animate-spin text-emerald-500" />
              ) : openAIVerification.status === 'invalid' ? (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              ) : providerStatus?.openai.configured ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ) : null}
            </button>

            <button
              type="button"
              id="tab-gemini"
              onClick={() => setActiveTab('gemini')}
              className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'gemini'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Plataforma</span>
            </button>
          </div>

          {/* Tab 1: OpenRouter */}
          {activeTab === 'openrouter' && (
            <div className="space-y-4 animate-fade-in">
              {/* Key Input Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      OpenRouter API Key
                    </label>
                    {/* Visual Status Indicator Pill */}
                    <span
                      id="openrouter-status-badge"
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-medium transition-all ${
                        openRouterVerification.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : openRouterVerification.status === 'checking'
                          ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 animate-pulse'
                          : openRouterVerification.status === 'invalid'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                          : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {openRouterVerification.status === 'active' ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="font-semibold">{language === 'es' ? 'Activa y Válida' : 'Active & Valid'}</span>
                          {openRouterVerification.latencyMs !== undefined && (
                            <span className="text-[9.5px] font-mono opacity-80">{openRouterVerification.latencyMs}ms</span>
                          )}
                        </>
                      ) : openRouterVerification.status === 'checking' ? (
                        <>
                          <RotateCw className="w-2.5 h-2.5 animate-spin text-cyan-600" />
                          <span>{language === 'es' ? 'Verificando...' : 'Verifying...'}</span>
                        </>
                      ) : openRouterVerification.status === 'invalid' ? (
                        <>
                          <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
                          <span className="font-semibold">{language === 'es' ? 'Clave No Válida' : 'Invalid Key'}</span>
                        </>
                      ) : (
                        <>
                          <CircleDot className="w-2.5 h-2.5" />
                          <span>
                            {providerStatus?.openRouter.configured
                              ? (language === 'es' ? 'Guardada' : 'Stored')
                              : (language === 'es' ? 'Sin configurar' : 'Not configured')}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    <span>{language === 'es' ? 'Obtener clave en OpenRouter' : 'Get OpenRouter Key'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {providerStatus?.openRouter.configured && !openRouterKey && (
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                          {language === 'es' ? 'Clave actual cifrada en Vault:' : 'Stored encrypted key:'}
                        </span>{' '}
                        <code className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">
                          {providerStatus.openRouter.maskedKey || 'sk-or-v1-••••••••••••'}
                        </code>
                      </div>
                      {openRouterVerification.status === 'active' && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'es' ? 'Confirmada' : 'Confirmed'}</span>
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveKey('OPENROUTER_API_KEY')}
                      className="text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{language === 'es' ? 'Desvincular' : 'Remove'}</span>
                    </button>
                  </div>
                )}

                <div className="relative">
                  <input
                    id="openrouter-api-key-input"
                    type={showOpenRouterKey ? 'text' : 'password'}
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                    placeholder={
                      providerStatus?.openRouter.configured
                        ? 'Ingresa una nueva clave para reemplazar la actual...'
                        : 'sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                    }
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showOpenRouterKey ? 'Ocultar' : 'Mostrar'}
                  >
                    {showOpenRouterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Visual Connection Indicator Card directly next to input */}
                <div
                  id="openrouter-connection-indicator"
                  className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between gap-3 ${
                    openRouterVerification.status === 'active'
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800/60'
                      : openRouterVerification.status === 'checking'
                      ? 'bg-cyan-50/80 dark:bg-cyan-950/25 border-cyan-300 dark:border-cyan-800/60'
                      : openRouterVerification.status === 'invalid'
                      ? 'bg-rose-50/80 dark:bg-rose-950/25 border-rose-300 dark:border-rose-800/60'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {openRouterVerification.status === 'active' ? (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : openRouterVerification.status === 'checking' ? (
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-600 dark:text-cyan-400">
                        <RotateCw className="w-4 h-4 animate-spin" />
                      </div>
                    ) : openRouterVerification.status === 'invalid' ? (
                      <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 text-slate-500">
                        <CircleDot className="w-4 h-4" />
                      </div>
                    )}

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-xs ${
                            openRouterVerification.status === 'active'
                              ? 'text-emerald-900 dark:text-emerald-200'
                              : openRouterVerification.status === 'checking'
                              ? 'text-cyan-900 dark:text-cyan-200'
                              : openRouterVerification.status === 'invalid'
                              ? 'text-rose-900 dark:text-rose-200'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {openRouterVerification.status === 'active'
                            ? language === 'es' ? 'Clave Activa y Verificada' : 'Key Active & Verified'
                            : openRouterVerification.status === 'checking'
                            ? language === 'es' ? 'Verificando con llamada API en vivo...' : 'Verifying via live API call...'
                            : openRouterVerification.status === 'invalid'
                            ? language === 'es' ? 'Clave No Válida o Rechazada' : 'Invalid Key or Connection Failure'
                            : language === 'es' ? 'Estado de Conexión de Clave' : 'Key Connection Status'}
                        </span>

                        {openRouterVerification.status === 'active' && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                            HTTP 200 OK
                          </span>
                        )}
                        {openRouterVerification.status === 'invalid' && openRouterVerification.statusCode && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-700 dark:text-rose-300">
                            HTTP {openRouterVerification.statusCode}
                          </span>
                        )}
                        {openRouterVerification.latencyMs !== undefined && (
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {openRouterVerification.latencyMs}ms
                          </span>
                        )}
                        {openRouterVerification.testedAt && (
                          <span className="text-[10px] text-slate-400">
                            {openRouterVerification.testedAt}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] truncate text-slate-600 dark:text-slate-400">
                        {openRouterVerification.message || (
                          openRouterVerification.status === 'active'
                            ? language === 'es'
                              ? 'La API de OpenRouter respondió exitosamente y está lista para el Copilot.'
                              : 'OpenRouter responded successfully and is ready for Copilot.'
                            : language === 'es'
                              ? 'Ejecuta una verificación en vivo para confirmar la autenticidad de la clave.'
                              : 'Run a live verification to confirm the authenticity of the key.'
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="btn-verify-openrouter-key"
                    onClick={() => verifyKeyConnection('openrouter')}
                    disabled={openRouterVerification.status === 'checking' || isTesting || (!openRouterKey.trim() && !providerStatus?.openRouter.configured)}
                    className="shrink-0 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title={language === 'es' ? 'Ejecutar llamada API para verificar clave' : 'Run live API call to verify key'}
                  >
                    <RotateCw className={`w-3 h-3 ${openRouterVerification.status === 'checking' ? 'animate-spin text-cyan-500' : ''}`} />
                    <span>
                      {openRouterVerification.status === 'checking'
                        ? (language === 'es' ? 'Verificando...' : 'Checking...')
                        : openRouterVerification.status === 'active'
                        ? (language === 'es' ? 'Re-verificar' : 'Re-verify')
                        : (language === 'es' ? 'Verificar Ahora' : 'Verify Now')}
                    </span>
                  </button>
                </div>

                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                  {language === 'es'
                    ? 'Soporta cualquier modelo disponible en OpenRouter con una única clave y facturación centralizada.'
                    : 'Access models from Anthropic, Meta, DeepSeek, and OpenAI via a single key.'}
                </p>
              </div>

              {/* Model Selection */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {language === 'es' ? 'Modelo de OpenRouter para Deal Copilot' : 'OpenRouter Model for Deal Copilot'}
                </label>

                <div className="space-y-2">
                  {OPENROUTER_MODELS.map((m) => {
                    const isSelected = !showCustomModelInput && openRouterModel === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setOpenRouterModel(m.id);
                          setShowCustomModelInput(false);
                        }}
                        className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/40'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {m.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {m.provider}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9.5px] font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                              {m.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {m.description}
                          </p>
                        </div>
                        <div className="pt-0.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-cyan-500 bg-cyan-500 text-white'
                                : 'border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Custom Model Option */}
                  <div
                    onClick={() => setShowCustomModelInput(true)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      showCustomModelInput
                        ? 'border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {language === 'es' ? 'Otro modelo de OpenRouter (Personalizado)' : 'Other OpenRouter Model (Custom ID)'}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          showCustomModelInput
                            ? 'border-cyan-500 bg-cyan-500 text-white'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {showCustomModelInput && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    {showCustomModelInput && (
                      <input
                        type="text"
                        value={customOpenRouterModel}
                        onChange={(e) => setCustomOpenRouterModel(e.target.value)}
                        placeholder="ej: mistralai/mistral-large-2411 o qwen/qwen-2.5-72b-instruct"
                        className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Test Button for OpenRouter */}
              <div className="pt-1">
                <button
                  type="button"
                  id="test-openrouter-btn"
                  onClick={() => handleTestConnection('openrouter')}
                  disabled={isTesting || (!openRouterKey.trim() && !providerStatus?.openRouter.configured)}
                  className="px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>
                    {isTesting
                      ? language === 'es'
                        ? 'Verificando con OpenRouter...'
                        : 'Testing OpenRouter connection...'
                      : language === 'es'
                      ? 'Probar Conexión con OpenRouter'
                      : 'Test OpenRouter Connection'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: OpenAI */}
          {activeTab === 'openai' && (
            <div className="space-y-4 animate-fade-in">
              {/* Key Input Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      OpenAI API Key
                    </label>
                    {/* Visual Status Indicator Pill */}
                    <span
                      id="openai-status-badge"
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-medium transition-all ${
                        openAIVerification.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : openAIVerification.status === 'checking'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 animate-pulse'
                          : openAIVerification.status === 'invalid'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                          : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {openAIVerification.status === 'active' ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="font-semibold">{language === 'es' ? 'Activa y Válida' : 'Active & Valid'}</span>
                          {openAIVerification.latencyMs !== undefined && (
                            <span className="text-[9.5px] font-mono opacity-80">{openAIVerification.latencyMs}ms</span>
                          )}
                        </>
                      ) : openAIVerification.status === 'checking' ? (
                        <>
                          <RotateCw className="w-2.5 h-2.5 animate-spin text-emerald-600" />
                          <span>{language === 'es' ? 'Verificando...' : 'Verifying...'}</span>
                        </>
                      ) : openAIVerification.status === 'invalid' ? (
                        <>
                          <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
                          <span className="font-semibold">{language === 'es' ? 'Clave No Válida' : 'Invalid Key'}</span>
                        </>
                      ) : (
                        <>
                          <CircleDot className="w-2.5 h-2.5" />
                          <span>
                            {providerStatus?.openai.configured
                              ? (language === 'es' ? 'Guardada' : 'Stored')
                              : (language === 'es' ? 'Sin configurar' : 'Not configured')}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>{language === 'es' ? 'Obtener clave en OpenAI Platform' : 'Get OpenAI Key'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {providerStatus?.openai.configured && !openAIKey && (
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                          {language === 'es' ? 'Clave actual cifrada en Vault:' : 'Stored encrypted key:'}
                        </span>{' '}
                        <code className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">
                          {providerStatus.openai.maskedKey || 'sk-••••••••••••'}
                        </code>
                      </div>
                      {openAIVerification.status === 'active' && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'es' ? 'Confirmada' : 'Confirmed'}</span>
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveKey('OPENAI_API_KEY')}
                      className="text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{language === 'es' ? 'Desvincular' : 'Remove'}</span>
                    </button>
                  </div>
                )}

                <div className="relative">
                  <input
                    id="openai-api-key-input"
                    type={showOpenAIKey ? 'text' : 'password'}
                    value={openAIKey}
                    onChange={(e) => setOpenAIKey(e.target.value)}
                    placeholder={
                      providerStatus?.openai.configured
                        ? 'Ingresa una nueva clave para reemplazar la actual...'
                        : 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                    }
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showOpenAIKey ? 'Ocultar' : 'Mostrar'}
                  >
                    {showOpenAIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Visual Connection Indicator Card directly next to input */}
                <div
                  id="openai-connection-indicator"
                  className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-between gap-3 ${
                    openAIVerification.status === 'active'
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800/60'
                      : openAIVerification.status === 'checking'
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800/60'
                      : openAIVerification.status === 'invalid'
                      ? 'bg-rose-50/80 dark:bg-rose-950/25 border-rose-300 dark:border-rose-800/60'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {openAIVerification.status === 'active' ? (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : openAIVerification.status === 'checking' ? (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                        <RotateCw className="w-4 h-4 animate-spin" />
                      </div>
                    ) : openAIVerification.status === 'invalid' ? (
                      <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 text-slate-500">
                        <CircleDot className="w-4 h-4" />
                      </div>
                    )}

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-xs ${
                            openAIVerification.status === 'active'
                              ? 'text-emerald-900 dark:text-emerald-200'
                              : openAIVerification.status === 'checking'
                              ? 'text-emerald-900 dark:text-emerald-200'
                              : openAIVerification.status === 'invalid'
                              ? 'text-rose-900 dark:text-rose-200'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {openAIVerification.status === 'active'
                            ? language === 'es' ? 'Clave Activa y Verificada' : 'Key Active & Verified'
                            : openAIVerification.status === 'checking'
                            ? language === 'es' ? 'Verificando con llamada API en vivo...' : 'Verifying via live API call...'
                            : openAIVerification.status === 'invalid'
                            ? language === 'es' ? 'Clave No Válida o Rechazada' : 'Invalid Key or Connection Failure'
                            : language === 'es' ? 'Estado de Conexión de Clave' : 'Key Connection Status'}
                        </span>

                        {openAIVerification.status === 'active' && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                            HTTP 200 OK
                          </span>
                        )}
                        {openAIVerification.status === 'invalid' && openAIVerification.statusCode && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-700 dark:text-rose-300">
                            HTTP {openAIVerification.statusCode}
                          </span>
                        )}
                        {openAIVerification.latencyMs !== undefined && (
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {openAIVerification.latencyMs}ms
                          </span>
                        )}
                        {openAIVerification.testedAt && (
                          <span className="text-[10px] text-slate-400">
                            {openAIVerification.testedAt}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] truncate text-slate-600 dark:text-slate-400">
                        {openAIVerification.message || (
                          openAIVerification.status === 'active'
                            ? language === 'es'
                              ? 'La API de OpenAI respondió exitosamente y está lista para el Copilot.'
                              : 'OpenAI responded successfully and is ready for Copilot.'
                            : language === 'es'
                              ? 'Ejecuta una verificación en vivo para confirmar la autenticidad de la clave.'
                              : 'Run a live verification to confirm the authenticity of the key.'
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="btn-verify-openai-key"
                    onClick={() => verifyKeyConnection('openai')}
                    disabled={openAIVerification.status === 'checking' || isTesting || (!openAIKey.trim() && !providerStatus?.openai.configured)}
                    className="shrink-0 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title={language === 'es' ? 'Ejecutar llamada API para verificar clave' : 'Run live API call to verify key'}
                  >
                    <RotateCw className={`w-3 h-3 ${openAIVerification.status === 'checking' ? 'animate-spin text-emerald-500' : ''}`} />
                    <span>
                      {openAIVerification.status === 'checking'
                        ? (language === 'es' ? 'Verificando...' : 'Checking...')
                        : openAIVerification.status === 'active'
                        ? (language === 'es' ? 'Re-verificar' : 'Re-verify')
                        : (language === 'es' ? 'Verificar Ahora' : 'Verify Now')}
                    </span>
                  </button>
                </div>

                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                  {language === 'es'
                    ? 'Conexión directa con la API oficial de OpenAI para GPT-4o y modelos de razonamiento.'
                    : 'Direct official OpenAI API integration for GPT-4o and advanced sales reasoning.'}
                </p>
              </div>

              {/* Model Selection */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {language === 'es' ? 'Modelo de OpenAI' : 'OpenAI Model'}
                </label>

                <div className="space-y-2">
                  {OPENAI_MODELS.map((m) => {
                    const isSelected = openAIModel === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setOpenAIModel(m.id)}
                        className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/40'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {m.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9.5px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              {m.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {m.description}
                          </p>
                        </div>
                        <div className="pt-0.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Test Button for OpenAI */}
              <div className="pt-1">
                <button
                  type="button"
                  id="test-openai-btn"
                  onClick={() => handleTestConnection('openai')}
                  disabled={isTesting || (!openAIKey.trim() && !providerStatus?.openai.configured)}
                  className="px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>
                    {isTesting
                      ? language === 'es'
                        ? 'Verificando con OpenAI...'
                        : 'Testing OpenAI connection...'
                      : language === 'es'
                      ? 'Probar Conexión con OpenAI'
                      : 'Test OpenAI Connection'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Gemini Platform */}
          {activeTab === 'gemini' && (
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-semibold">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Google Gemini 2.5 • Plataforma Integrada</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11.5px] leading-relaxed">
                {language === 'es'
                  ? 'Clientum CRM cuenta con Google Gemini preconfigurado a nivel de plataforma. Si no deseas utilizar una clave de OpenRouter u OpenAI, el Deal Copilot operará automáticamente con Gemini para análisis de embudo, emails y detección de riesgos.'
                  : 'Google Gemini is preconfigured at the platform level. If you prefer not to use custom OpenRouter or OpenAI keys, the Deal Copilot will seamlessly run on Gemini.'}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Listo para operar sin configuración adicional requerida.</span>
              </div>
            </div>
          )}

          {/* Live Test Feedback Banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs animate-fade-in ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 flex-1">
                <div className="font-semibold">
                  {testResult.success ? 'Prueba Exitosa' : 'Error en la Verificación'}
                </div>
                <div className="text-[11px] opacity-90">
                  {testResult.message || testResult.error}
                </div>
                {testResult.timestamp && (
                  <div className="text-[10px] opacity-60">
                    Hora: {testResult.timestamp}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                {language === 'es' ? 'Cifrado Fuerte AES-256-GCM por Workspace' : 'AES-256-GCM Workspace Encryption'}
              </span>
              <p className="text-[11px] leading-relaxed">
                {language === 'es'
                  ? 'Tus claves se guardan cifradas server-side con autenticación de integridad (Auth Tag) y vector de inicialización único. Nunca se devuelven en texto plano al navegador ni se comparten con otros usuarios.'
                  : 'Keys are stored server-side encrypted with per-tenant isolation. They are only utilized to process deal copilot requests.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#101e33]/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </button>

          <button
            id="save-ai-copilot-keys-btn"
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-xs shadow-md hover:shadow-cyan-500/25 transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>{language === 'es' ? 'Guardando Cifrado...' : 'Saving Encrypted...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'es' ? 'Guardar Configuración Segura' : 'Save Secure Configuration'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICopilotSettingsModal;
