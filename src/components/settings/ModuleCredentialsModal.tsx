import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  KeyRound,
  LockKeyhole,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { getModuleCredentialDefinition, ModuleCredentialDefinition } from '../../data/moduleCredentials';
import { getClientumAuthHeaders, getClientumAuthJsonHeaders } from '../../lib/api';

interface ModuleCredentialsModalProps {
  moduleId: string | null;
  onClose: () => void;
}

interface StoredField {
  fieldId: string;
  configured: boolean;
}

export const ModuleCredentialsModal: React.FC<ModuleCredentialsModalProps> = ({ moduleId, onClose }) => {
  const {
    currentUser,
    setActiveTab,
    showToast,
  } = useCRM();
  const [values, setValues] = useState<Record<string, string>>({});
  const [configuredFields, setConfiguredFields] = useState<StoredField[]>([]);
  const [secureKeys, setSecureKeys] = useState<Array<{ id: string; name: string; scopes: string[]; status: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [revealedToken, setRevealedToken] = useState<string | null>(null);

  const definition: ModuleCredentialDefinition | null = useMemo(
    () => moduleId ? getModuleCredentialDefinition(moduleId) : null,
    [moduleId],
  );

  const userModuleKeys = useMemo(
    () => (moduleId
      ? secureKeys.filter((key) => key.status === 'active' && key.scopes.includes(`module:${moduleId}`))
      : []),
    [moduleId, secureKeys],
  );

  useEffect(() => {
    if (!moduleId || !definition) return;
    setValues({});
    setConfiguredFields([]);
    setRevealedToken(null);
    setIsLoading(true);
    let isMounted = true;
    void (async () => {
      try {
        const response = await fetch(`/api/user-credentials?moduleId=${encodeURIComponent(moduleId)}`, {
          headers: await getClientumAuthHeaders(currentUser),
        });
        if (!response.ok) throw new Error('credential read failed');
        const payload = await response.json() as { fields?: StoredField[] };
        if (isMounted) setConfiguredFields(payload.fields || []);
        const keyResponse = await fetch('/api/user-api-keys', {
          headers: await getClientumAuthHeaders(currentUser),
        });
        if (keyResponse.ok) {
          const keyPayload = await keyResponse.json() as { keys?: Array<{ id: string; name: string; scopes: string[]; status: string }> };
          if (isMounted) setSecureKeys(keyPayload.keys || []);
        }
      } catch {
        if (isMounted) showToast('No se pudo leer el estado de las credenciales de este módulo', 'warning');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [currentUser, definition, moduleId, showToast]);

  if (!moduleId || !definition) return null;

  const isConfigured = (fieldId: string) => configuredFields.some((field) => field.fieldId === fieldId && field.configured);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextValues = Object.fromEntries(
      Object.entries(values).filter(([, value]) => typeof value === 'string' && value.trim().length > 0),
    );
    if (Object.keys(nextValues).length === 0) {
      showToast('Agrega al menos una credencial antes de guardar', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user-credentials', {
        method: 'PUT',
        headers: await getClientumAuthJsonHeaders(currentUser),
        body: JSON.stringify({ moduleId, values: nextValues }),
      });
      if (!response.ok) throw new Error('credential write failed');
      const payload = await response.json() as { fields?: StoredField[] };
      setConfiguredFields(payload.fields || []);
      setValues({});
      showToast(`Credenciales de ${definition.label} guardadas de forma segura`, 'success');
    } catch {
      showToast('No se pudieron guardar las credenciales. Verifica la configuración segura del servidor.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm(`¿Eliminar las credenciales guardadas para ${definition.label}?`)) return;
    setIsRemoving(true);
    try {
      const response = await fetch(`/api/user-credentials?moduleId=${encodeURIComponent(moduleId)}`, {
        method: 'DELETE',
        headers: await getClientumAuthHeaders(currentUser),
      });
      if (!response.ok) throw new Error('credential delete failed');
      setConfiguredFields([]);
      showToast(`Credenciales de ${definition.label} eliminadas`, 'info');
    } catch {
      showToast('No se pudieron eliminar las credenciales', 'error');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCreateModuleKey = () => {
    void (async () => {
      try {
        const response = await fetch('/api/user-api-keys', {
          method: 'POST',
          headers: await getClientumAuthJsonHeaders(currentUser),
          body: JSON.stringify({
            name: `${definition.label} · API`,
            scopes: [`module:${moduleId}`],
          }),
        });
        if (!response.ok) throw new Error('api key create failed');
        const payload = await response.json() as { key: { id: string; name: string; scopes: string[]; status: string }; token: string };
        setSecureKeys((previous) => [payload.key, ...previous]);
        setRevealedToken(payload.token);
        showToast(`API Key REST de ${definition.label} generada`, 'success');
      } catch {
        showToast('No se pudo generar la API Key REST segura', 'error');
      }
    })();
  };

  const handleManageAllKeys = () => {
    try {
      sessionStorage.setItem('clientum_settings_section', 'userApiKeys');
      sessionStorage.setItem('clientum_api_key_module', moduleId);
    } catch {
      // Navigation still works when storage is unavailable.
    }
    onClose();
    setActiveTab('settings');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#283953] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1726] text-[var(--text-primary,#0f172a)] dark:text-slate-200 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#20344d] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-cyan-300/70">{definition.group}</p>
              <h2 className="mt-1 text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white">Configurar {definition.label}</h2>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-[var(--text-muted,#64748b)] dark:text-slate-400">{definition.description}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-card)]/5 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white" aria-label="Cerrar configuración">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] leading-relaxed text-emerald-100/80">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            <span>Estas credenciales pertenecen al workspace de <strong className="text-emerald-200">{currentUser.name}</strong>, se cifran en el backend y no se guardan en localStorage ni se muestran completas después de guardar.</span>
          </div>

          {definition.platformConfigurations && definition.platformConfigurations.length > 0 && (
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
                <div>
                  <h3 className="text-xs font-semibold text-blue-100">Configuración administrada por ClientumCRM</h3>
                  <p className="mt-1 text-[10px] leading-relaxed text-blue-100/65">
                    Estas variables pertenecen a la plataforma o a una conexión administrada. No se editan desde el navegador ni se mezclan con las credenciales de tu workspace.
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                {definition.platformConfigurations.map((configuration) => (
                  <div key={configuration.key} className="rounded-lg border border-blue-500/10 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a1321]/70 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-[var(--text-primary,#0f172a)] dark:text-slate-200">{configuration.label}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${ configuration.kind === 'server-secret' ? 'bg-rose-500/10 text-rose-200' : configuration.kind === 'managed-connection' ? 'bg-purple-500/10 text-purple-200' : 'bg-cyan-500/10 text-cyan-200' }`}>
                        {configuration.kind === 'server-secret' ? 'Backend' : configuration.kind === 'managed-connection' ? 'Conexión' : 'Público'}
                      </span>
                    </div>
                    <code className="mt-1 block truncate text-[9px] text-blue-200/65">{configuration.key}</code>
                    <p className="mt-1 text-[9px] leading-relaxed text-[var(--text-muted)]">{configuration.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {definition.fields.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border-subtle,#e2e8f0)] dark:border-[#304762] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a1321] p-5 text-center">
              <ShieldCheck className="mx-auto h-7 w-7 text-cyan-300/70" />
              <p className="mt-2 text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">{definition.note || 'No requiere una API key externa'}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Podés asignar una API Key REST interna con scope para este módulo.</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Credenciales del proveedor</h3>
                  <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">Completá solo los campos que correspondan a tu cuenta.</p>
                </div>
                {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-cyan-300" />}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {definition.fields.map((credentialField) => (
                  <label key={credentialField.id} className="block">
                    <span className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">
                      {credentialField.label}
                      {isConfigured(credentialField.id) && <span className="text-[9px] font-medium text-emerald-300">Configurada</span>}
                    </span>
                    {credentialField.inputType === 'select' ? (
                      <select
                        value={values[credentialField.id] || ''}
                        onChange={(event) => setValues((previous) => ({ ...previous, [credentialField.id]: event.target.value }))}
                        className="w-full rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#29415c] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a1321] px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
                      >
                        <option value="">Seleccionar…</option>
                        {credentialField.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    ) : (
                      <input
                        type={credentialField.inputType === 'text' ? 'text' : 'password'}
                        value={values[credentialField.id] || ''}
                        onChange={(event) => setValues((previous) => ({ ...previous, [credentialField.id]: event.target.value }))}
                        placeholder={isConfigured(credentialField.id) ? '•••••••••••• (guardada)' : credentialField.placeholder}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#29415c] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a1321] px-3 py-2 text-xs text-[var(--text-primary,#0f172a)] dark:text-white outline-none placeholder:text-[var(--text-secondary)] focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
                      />
                    )}
                    {credentialField.description && <span className="mt-1 block text-[10px] leading-relaxed text-[var(--text-muted)]">{credentialField.description}</span>}
                  </label>
                ))}
              </div>
              {definition.note && <p className="rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-[10px] leading-relaxed text-amber-100/70">{definition.note}</p>}
              <div className="flex items-center justify-end gap-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#20344d] pt-3">
                {configuredFields.length > 0 && <button type="button" disabled={isRemoving} onClick={handleRemove} className="mr-auto inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 px-3 py-2 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Eliminar</button>}
                <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-[11px] font-semibold text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white">Cancelar</button>
                <button type="submit" disabled={isSaving} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-2 text-[11px] font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"><ShieldCheck className="h-3.5 w-3.5" /> {isSaving ? 'Guardando…' : 'Guardar credenciales'}</button>
              </div>
            </form>
          )}

          <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#243b57] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#101e30] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary,#0f172a)] dark:text-white"><KeyRound className="h-3.5 w-3.5 text-purple-300" /> API Key REST de este módulo</h3>
                <p className="mt-1 text-[10px] leading-relaxed text-[var(--text-muted,#64748b)] dark:text-slate-400">Token interno de ClientumCRM, independiente de las credenciales del proveedor.</p>
              </div>
              <button type="button" onClick={handleCreateModuleKey} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-[11px] font-bold text-white hover:bg-purple-500"><Plus className="h-3.5 w-3.5" /> Generar para este módulo</button>
            </div>
            {revealedToken && (
              <div className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3">
                <p className="text-[10px] font-semibold text-amber-200">Copiá este token ahora. Se muestra una sola vez.</p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded-md border border-amber-500/20 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a1321] px-2.5 py-2 font-mono text-[10px] text-amber-100">{revealedToken}</code>
                  <button type="button" onClick={() => { navigator.clipboard.writeText(revealedToken); showToast('Token copiado', 'success'); }} className="rounded-md border border-amber-500/20 p-2 text-amber-200 hover:bg-amber-500/10" title="Copiar token"><Copy className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => setRevealedToken(null)} className="rounded-md p-2 text-amber-200/70 hover:bg-amber-500/10" aria-label="Ocultar token"><Check className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            )}
            {userModuleKeys.length > 0 && !revealedToken && (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-500/15 bg-emerald-500/5 px-3 py-2 text-[10px] text-emerald-200/80">
                <span>{userModuleKeys.length} token{userModuleKeys.length === 1 ? '' : 's'} activo{userModuleKeys.length === 1 ? '' : 's'} con scope <code>module:{moduleId}</code></span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              </div>
            )}
            <button type="button" onClick={handleManageAllKeys} className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-300 hover:text-cyan-200"><ExternalLink className="h-3 w-3" /> Administrar todas las API Keys por usuario</button>
          </div>
        </div>
      </div>
    </div>
  );
};