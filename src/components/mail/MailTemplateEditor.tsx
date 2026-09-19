import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  Code,
  Edit3,
  Save,
  RotateCcw,
  Sparkles,
  FileText,
  Mail,
  Send,
  HelpCircle,
  Tag,
  ExternalLink,
} from 'lucide-react';
import {
  MailTemplate,
  getMailTemplates,
  saveMailTemplate,
  deleteMailTemplate,
  DEFAULT_MAIL_TEMPLATES,
} from '../../services/crmMailService';

interface MailTemplateEditorProps {
  className?: string;
  onSelectTemplateForUse?: (template: MailTemplate) => void;
}

export const MailTemplateEditor: React.FC<MailTemplateEditorProps> = ({
  className = '',
  onSelectTemplateForUse,
}) => {
  const [templates, setTemplates] = useState<MailTemplate[]>(() => getMailTemplates());
  const [selectedId, setSelectedId] = useState<string>(() => templates[0]?.id || 'tpl-quote-1');
  const [viewMode, setViewMode] = useState<'wysiwyg' | 'preview' | 'html'>('wysiwyg');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Active template state
  const activeTemplate = templates.find((t) => t.id === selectedId) || templates[0] || DEFAULT_MAIL_TEMPLATES[0];

  const [formName, setFormName] = useState(activeTemplate?.name || '');
  const [formCategory, setFormCategory] = useState<MailTemplate['category']>(activeTemplate?.category || 'quote');
  const [formSubject, setFormSubject] = useState(activeTemplate?.subject || '');
  const [formDescription, setFormDescription] = useState(activeTemplate?.description || '');
  const [formHtml, setFormHtml] = useState(activeTemplate?.htmlContent || '');

  const editorRef = useRef<HTMLDivElement>(null);

  // Sync state when selected template changes
  useEffect(() => {
    if (activeTemplate) {
      setFormName(activeTemplate.name);
      setFormCategory(activeTemplate.category);
      setFormSubject(activeTemplate.subject);
      setFormDescription(activeTemplate.description);
      setFormHtml(activeTemplate.htmlContent);
      if (editorRef.current && viewMode === 'wysiwyg') {
        editorRef.current.innerHTML = activeTemplate.htmlContent;
      }
    }
  }, [selectedId]);

  // Keep editor content in sync when switching back to WYSIWYG
  useEffect(() => {
    if (viewMode === 'wysiwyg' && editorRef.current) {
      editorRef.current.innerHTML = formHtml;
    }
  }, [viewMode]);

  // Execute formatting command in contentEditable
  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      setFormHtml(editorRef.current.innerHTML);
    }
  };

  // Insert custom dynamic variable token
  const insertToken = (token: string) => {
    if (viewMode === 'wysiwyg' && editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, token);
      setFormHtml(editorRef.current.innerHTML);
    } else {
      setFormHtml((prev) => prev + ` ${token} `);
    }
  };

  // Insert CTA Button element
  const insertCtaButton = () => {
    const text = prompt('Texto del botón de acción (CTA):', 'Ver y Aprobar Propuesta');
    if (!text) return;
    const url = prompt('Enlace o variable de destino:', '{{enlace_documento}}');
    if (!url) return;

    const buttonHtml = `
      <div style="text-align: center; margin: 24px 0;">
        <a href="${url}" style="background: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          ${text}
        </a>
      </div>
    `;

    if (viewMode === 'wysiwyg' && editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, buttonHtml);
      setFormHtml(editorRef.current.innerHTML);
    } else {
      setFormHtml((prev) => prev + '\n' + buttonHtml);
    }
  };

  // Save current template
  const handleSave = () => {
    const htmlToSave = viewMode === 'wysiwyg' && editorRef.current ? editorRef.current.innerHTML : formHtml;

    const updated: MailTemplate = {
      id: activeTemplate.id,
      name: formName || 'Plantilla Sin Título',
      category: formCategory,
      subject: formSubject,
      description: formDescription,
      htmlContent: htmlToSave,
      updatedAt: new Date().toISOString(),
      isDefault: activeTemplate.isDefault,
    };

    const newTemplates = saveMailTemplate(updated);
    setTemplates(newTemplates);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Create new template
  const handleCreateNew = () => {
    const newId = `tpl-custom-${Date.now()}`;
    const newTpl: MailTemplate = {
      id: newId,
      name: 'Nueva Plantilla Personalizada',
      category: 'custom',
      subject: 'Asunto del correo para {{empresa}}',
      description: 'Plantilla de correspondencia transaccional editable.',
      updatedAt: new Date().toISOString(),
      htmlContent: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
  <h2 style="color: #090F1E; margin-top: 0;">Estimado/a {{nombre_contacto}},</h2>
  <p>Te escribimos desde <strong>{{empresa}}</strong> para hacerte llegar la siguiente información:</p>
  <p>Podes completar el siguiente paso haciendo clic en el enlace a continuación:</p>
  <div style="text-align: center; margin: 24px 0;">
    <a href="{{enlace_documento}}" style="background: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Ver Documento</a>
  </div>
  <p style="font-size: 13px; color: #64748b;">Atentamente,<br /><strong>{{vendedor_nombre}}</strong></p>
</div>
      `.trim(),
    };

    const newTemplates = saveMailTemplate(newTpl);
    setTemplates(newTemplates);
    setSelectedId(newId);
  };

  // Duplicate current template
  const handleDuplicate = () => {
    const newId = `tpl-copy-${Date.now()}`;
    const copyTpl: MailTemplate = {
      ...activeTemplate,
      id: newId,
      name: `${formName} (Copia)`,
      updatedAt: new Date().toISOString(),
      isDefault: false,
    };
    const newTemplates = saveMailTemplate(copyTpl);
    setTemplates(newTemplates);
    setSelectedId(newId);
  };

  // Delete current template
  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar la plantilla "${formName}"?`)) {
      const remaining = deleteMailTemplate(activeTemplate.id);
      setTemplates(remaining);
      if (remaining.length > 0) {
        setSelectedId(remaining[0].id);
      }
    }
  };

  // Reset to system defaults
  const handleResetDefaults = () => {
    if (confirm('¿Restaurar las plantillas oficiales predeterminadas de Clientum CRM?')) {
      localStorage.removeItem('clientum_mail_templates_v1');
      setTemplates(DEFAULT_MAIL_TEMPLATES);
      setSelectedId(DEFAULT_MAIL_TEMPLATES[0].id);
    }
  };

  // Copy HTML to clipboard
  const handleCopyHtml = () => {
    navigator.clipboard.writeText(formHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  // Generate Sample Live Preview HTML with replaced variables
  const sampleRenderedHtml = formHtml
    .replace(/{{nombre_contacto}}/g, 'Gonzalo Morales')
    .replace(/{{empresa}}/g, 'Distribuidora del Valle SRL')
    .replace(/{{monto_total}}/g, '$380.000 ARS + IVA')
    .replace(/{{fecha_vencimiento}}/g, '28/09/2026')
    .replace(/{{numero_cotizacion}}/g, 'COT-2026-094')
    .replace(/{{numero_factura}}/g, '0001-00049210')
    .replace(/{{numero_cae}}/g, '76498210398412')
    .replace(/{{fecha_reunion}}/g, 'Miércoles 18 de Septiembre - 11:00 hs')
    .replace(/{{enlace_documento}}/g, '#')
    .replace(/{{enlace_reunion}}/g, 'https://meet.google.com/xyz-clientum')
    .replace(/{{enlace_calendario}}/g, '#')
    .replace(/{{vendedor_nombre}}/g, 'Mariana Castro')
    .replace(/{{vendedor_telefono}}/g, '+54 9 11 5821-9944');

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div
      id="mail-template-editor"
      className={`grid grid-cols-1 lg:grid-cols-12 gap-6 font-['Plus_Jakarta_Sans',sans-serif] ${className}`}
    >
      {/* LEFT COLUMN: Template Navigator & Library (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Catálogo de Plantillas
            </h4>
            <button
              type="button"
              onClick={handleCreateNew}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              title="Crear nueva plantilla"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva</span>
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Buscar plantilla..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800/80 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-xs text-[var(--text-primary)] dark:text-[var(--text-primary,#0f172a)] dark:text-slate-200 focus:outline-none focus:border-blue-500"
          />

          {/* Category Filter Badges */}
          <div className="flex flex-wrap gap-1 text-[11px]">
            {['all', 'quote', 'invoice', 'demo', 'followup', 'custom'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer ${ categoryFilter === cat ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'bg-[var(--bg-muted)] dark:bg-slate-800 text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:bg-[var(--bg-muted)]' }`}
              >
                {cat === 'all'
                  ? 'Todas'
                  : cat === 'quote'
                  ? 'Cotizaciones'
                  : cat === 'invoice'
                  ? 'Facturas AFIP'
                  : cat === 'demo'
                  ? 'Demos'
                  : cat === 'followup'
                  ? 'Seguimiento'
                  : 'Personalizadas'}
              </button>
            ))}
          </div>

          {/* Templates List */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${ selectedId === t.id ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-xs' : 'bg-[var(--bg-card)] dark:bg-slate-800/50 border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 hover:border-[var(--border-default)]' }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs text-[var(--text-primary)] dark:text-white line-clamp-1">
                    {t.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0 ${ t.category === 'quote' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300' : t.category === 'invoice' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' : t.category === 'demo' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] dark:bg-slate-700 dark:text-[var(--text-secondary,#475569)] dark:text-slate-300' }`}
                  >
                    {t.category}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 line-clamp-2 mt-1">
                  {t.subject}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 text-[11px] flex items-center gap-1 cursor-pointer"
              title="Restaurar plantillas de fábrica"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar originales</span>
            </button>
            <span className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">
              {templates.length} plantillas guardadas
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: WYSIWYG Editor Canvas & Toolbar (8 cols) */}
      <div className="lg:col-span-8 space-y-4">
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800 shadow-xs space-y-4">
          {/* Metadata Inputs (Name, Category, Subject) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider mb-1">
                Nombre de la Plantilla
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-xs font-bold text-[var(--text-primary)] dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider mb-1">
                Categoría
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-xs font-semibold text-[var(--text-primary)] dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="quote">Cotización</option>
                <option value="invoice">Factura AFIP</option>
                <option value="demo">Demostración</option>
                <option value="followup">Seguimiento</option>
                <option value="welcome">Bienvenida</option>
                <option value="custom">Personalizada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--text-muted)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider mb-1">
              Asunto del Correo (Soporta variables)
            </label>
            <input
              type="text"
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              placeholder="Ej: Propuesta Comercial #{{numero_cotizacion}} — Clientum CRM"
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-xs text-[var(--text-primary)] dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Dynamic Variable Tokens Inserter */}
          <div className="p-3 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800/60 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 flex items-center gap-1.5 text-[11px]">
                <Tag className="w-3.5 h-3.5 text-blue-500" />
                Variables Dinámicas (Hacé clic para insertar en el cursor):
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { token: '{{nombre_contacto}}', desc: 'Nombre del cliente' },
                { token: '{{empresa}}', desc: 'Empresa / Razón Social' },
                { token: '{{monto_total}}', desc: 'Importe cotización / factura' },
                { token: '{{fecha_vencimiento}}', desc: 'Vencimiento' },
                { token: '{{enlace_documento}}', desc: 'Link a cotización o PDF AFIP' },
                { token: '{{numero_cotizacion}}', desc: 'N° Presupuesto' },
                { token: '{{numero_factura}}', desc: 'N° Comprobante' },
                { token: '{{numero_cae}}', desc: 'CAE AFIP' },
                { token: '{{vendedor_nombre}}', desc: 'Nombre ejecutivo' },
                { token: '{{vendedor_telefono}}', desc: 'WhatsApp vendedor' },
              ].map((item) => (
                <button
                  key={item.token}
                  type="button"
                  onClick={() => insertToken(item.token)}
                  className="px-2 py-0.8 rounded-lg bg-[var(--bg-card)] dark:bg-slate-700 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-600 text-[10px] font-mono text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors cursor-pointer shadow-2xs"
                  title={item.desc}
                >
                  {item.token}
                </button>
              ))}
            </div>
          </div>

          {/* WYSIWYG Toolbar & Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-800 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700">
            {/* View Mode Switcher */}
            <div className="inline-flex rounded-lg bg-[var(--bg-card)] dark:bg-slate-900 p-0.5 border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('wysiwyg')}
                className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition-all cursor-pointer ${ viewMode === 'wysiwyg' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white' }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor Visual</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition-all cursor-pointer ${ viewMode === 'preview' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white' }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Vista Previa</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('html')}
                className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 transition-all cursor-pointer ${ viewMode === 'html' ? 'bg-blue-600 text-[var(--text-primary,#0f172a)] dark:text-white shadow-2xs' : 'text-[var(--text-secondary)] dark:text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white' }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Código HTML</span>
              </button>
            </div>

            {/* WYSIWYG Action Buttons (Visible in editor mode) */}
            {viewMode === 'wysiwyg' && (
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => execCmd('bold')}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer"
                  title="Negrita"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('italic')}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer"
                  title="Cursiva"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('underline')}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer"
                  title="Subrayado"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />
                <button
                  type="button"
                  onClick={() => execCmd('justifyLeft')}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer"
                  title="Alinear Izquierda"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('justifyCenter')}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer"
                  title="Centrar"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('justifyRight')}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer"
                  title="Alinear Derecha"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />
                <button
                  type="button"
                  onClick={() => execCmd('insertUnorderedList')}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer"
                  title="Lista con viñetas"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('insertOrderedList')}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 cursor-pointer"
                  title="Lista numerada"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />
                <button
                  type="button"
                  onClick={insertCtaButton}
                  className="px-2 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer border border-blue-200 dark:border-blue-800"
                  title="Insertar botón de acción"
                >
                  <Plus className="w-3 h-3" />
                  <span>Botón CTA</span>
                </button>
              </div>
            )}
          </div>

          {/* MAIN EDITOR CANVAS */}
          <div className="rounded-xl border border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-700 bg-[var(--bg-card)] min-h-[380px] overflow-hidden">
            {viewMode === 'wysiwyg' && (
              <div
                ref={editorRef}
                contentEditable
                onInput={() => {
                  if (editorRef.current) {
                    setFormHtml(editorRef.current.innerHTML);
                  }
                }}
                className="p-6 text-[var(--text-primary)] min-h-[380px] focus:outline-none prose max-w-none font-sans text-sm"
              />
            )}

            {viewMode === 'preview' && (
              <div className="p-6 bg-[var(--bg-muted)]/60 min-h-[380px] flex items-center justify-center">
                <div className="w-full max-w-2xl bg-[var(--bg-card)] rounded-xl shadow-md border border-[var(--border-subtle)] p-2">
                  <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase px-4 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between">
                    <span>Vista previa para el cliente: {formSubject}</span>
                    <span className="text-emerald-600 font-semibold">Variables Resueltas</span>
                  </div>
                  <div
                    className="p-4"
                    dangerouslySetInnerHTML={{ __html: sampleRenderedHtml }}
                  />
                </div>
              </div>
            )}

            {viewMode === 'html' && (
              <textarea
                value={formHtml}
                onChange={(e) => setFormHtml(e.target.value)}
                className="w-full p-4 font-mono text-xs text-[var(--text-primary)] bg-slate-900 text-[var(--text-primary,#0f172a)] dark:text-slate-100 min-h-[380px] focus:outline-none resize-y"
                spellCheck={false}
              />
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)] dark:border-[var(--border-subtle,#e2e8f0)] dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                {savedSuccess ? <Check className="w-4 h-4 text-[var(--text-primary,#0f172a)] dark:text-white" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? '¡Guardado con éxito!' : 'Guardar Plantilla'}</span>
              </button>

              <button
                type="button"
                onClick={handleDuplicate}
                className="px-3 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicar</span>
              </button>

              <button
                type="button"
                onClick={handleCopyHtml}
                className="px-3 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--text-secondary)] dark:text-[var(--text-secondary,#475569)] dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedHtml ? 'Copiado' : 'Copiar HTML'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onSelectTemplateForUse && (
                <button
                  type="button"
                  onClick={() => onSelectTemplateForUse(activeTemplate)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Usar para Enviar</span>
                </button>
              )}

              {!activeTemplate.isDefault && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Eliminar plantilla"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
