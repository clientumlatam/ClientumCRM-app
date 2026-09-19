import React, { useState } from 'react';
import { FileText, Plus, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const KnowledgeBaseView: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();
  const [documents, setDocuments] = useState([
    { title: 'Política de Precios y Descuentos por Volumen Q3', category: 'Comercial', words: '1,420 palabras', date: 'Hace 2 días' },
    { title: 'Guía de Integración API con SAP y Salesforce', category: 'Técnico', words: '3,850 palabras', date: 'Hace 5 días' },
    { title: 'Preguntas Frecuentes Facturación AFIP y MercadoPago', category: 'Soporte', words: '980 palabras', date: 'Hace 1 semana' }
  ]);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');

  const addDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim()) return;

    setDocuments([
      { title: docTitle, category: 'Personalizado', words: `${docContent.split(' ').length} palabras`, date: 'Hoy' },
      ...documents
    ]);
    setDocTitle('');
    setDocContent('');
    showToast('Documento indexado en la Base de Conocimientos de la IA', 'success');
    triggerConfetti();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Base de Conocimientos (Entrenamiento IA Gemini)
        </h3>
        <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Sube manuales, políticas y FAQs para que el chatbot responda con precisión exacta basada en tus documentos.</p>
      </div>

      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] space-y-4 max-w-2xl">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">Añadir Documento o FAQ</h4>
        <form onSubmit={addDoc} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Título del Documento</label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="ej. Manual de Garantías y Devoluciones"
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Contenido / Preguntas y Respuestas</label>
            <textarea
              rows={4}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              placeholder="Pega aquí el contenido detallado que la IA debe aprender..."
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white p-3 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Indexar en Base de Conocimientos AI</span>
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">Documentos Indexados</h4>
        <div className="space-y-3">
          {documents.map((d, idx) => (
            <div key={idx} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs">{d.title}</div>
                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Categoría: {d.category} • {d.words} • Actualizado: {d.date}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 font-medium text-[10px] border border-purple-500/25 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Indexado OK
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
