import React, { useState } from 'react';
import { FileText, Plus, Sparkles, CheckCircle2, Copy, Trash2, Edit3, Send } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'Marketing' | 'Utility' | 'Authentication';
  language: string;
  content: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  variables: string[];
}

export const TemplateView: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: 'tpl-1',
      name: 'bienvenida_lead_q3',
      category: 'Marketing',
      language: 'es_AR',
      content: 'Hola {{1}}, gracias por tu interés en ClientumCRM. Hemos asignado al especialista {{2}} para coordinar tu demo de 20 minutos. ¿Te parece bien este jueves?',
      status: 'Approved',
      variables: ['1: Nombre', '2: Nombre Agente']
    },
    {
      id: 'tpl-2',
      name: 'recordatorio_reunion_demo',
      category: 'Utility',
      language: 'es_AR',
      content: 'Estimado/a {{1}}, te recordamos que tenemos agendada nuestra reunión de demostración de ClientumCRM hoy a las {{2}}. Aquí tienes el enlace de acceso: {{3}}',
      status: 'Approved',
      variables: ['1: Nombre Cliente', '2: Hora', '3: Link Meet']
    },
    {
      id: 'tpl-3',
      name: 'facturacion_afip_emitida',
      category: 'Utility',
      language: 'es_AR',
      content: 'Hola {{1}}, tu factura electrónica correspondiente al abono mensual por ${{2}} ya ha sido generada y enviada a AFIP. Comprobante N° {{3}}.',
      status: 'Approved',
      variables: ['1: Nombre', '2: Monto', '3: N° Comprobante']
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'Marketing' | 'Utility' | 'Authentication'>('Marketing');

  const createTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tpl: WhatsAppTemplate = {
      id: `tpl-${Date.now()}`,
      name: newTitle.toLowerCase().replace(/\s+/g, '_'),
      category: newCategory,
      language: 'es_AR',
      content: newContent,
      status: 'Approved',
      variables: ['1: Variable Personalizada']
    };

    setTemplates([tpl, ...templates]);
    setNewTitle('');
    setNewContent('');
    showToast('Plantilla de WhatsApp creada y aprobada por Meta', 'success');
    triggerConfetti();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Plantillas Oficiales de WhatsApp (Meta Business API)
          </h3>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Diseña y gestiona plantillas con variables dinámicas para notificaciones masivas y automatizaciones.</p>
        </div>
      </div>

      {/* Create Template Form */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] space-y-4 max-w-2xl">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">Crear Nueva Plantilla</h4>
        <form onSubmit={createTemplate} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Nombre de Plantilla (slug)</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="ej. promocion_verano_2026"
                className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Categoría</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Marketing">Marketing (Promociones)</option>
                <option value="Utility">Utilidad (Avisos, Facturas)</option>
                <option value="Authentication">Autenticación (OTP)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Contenido del Mensaje (Usa {`{{1}}`}, {`{{2}}`} para variables)</label>
            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Hola {{1}}, tenemos una oferta exclusiva para tu empresa..."
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white p-3 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enviar a Aprobación en Meta API</span>
          </button>
        </form>
      </div>

      {/* Templates List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">Plantillas Registradas ({templates.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(tpl => (
            <div key={tpl.id} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] p-4 rounded-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-xs bg-[var(--bg-card,#ffffff)] dark:bg-[#1a2133] px-2.5 py-1 rounded border border-[var(--border-subtle,#e2e8f0)] dark:border-[#28324a]">
                    {tpl.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-medium border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {tpl.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-medium border border-blue-500/20">
                      {tpl.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary,#475569)] dark:text-slate-300 bg-[var(--bg-card,#ffffff)] dark:bg-[#171d2b] p-3 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232d42] leading-relaxed">
                  {tpl.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2638] text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <span>Variables:</span>
                  <strong className="text-[var(--text-primary,#0f172a)] dark:text-white">{tpl.variables.join(', ')}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tpl.content);
                      showToast('Plantilla copiada al portapapeles', 'success');
                    }}
                    className="p-1.5 bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#1c2333] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#252f44] text-[var(--text-secondary,#475569)] dark:text-slate-300 rounded transition-colors cursor-pointer"
                    title="Copiar contenido"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setTemplates(prev => prev.filter(t => t.id !== tpl.id));
                      showToast('Plantilla eliminada', 'info');
                    }}
                    className="p-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition-colors cursor-pointer"
                    title="Eliminar plantilla"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
