import React, { useState, useMemo } from 'react';
import {
  Mail,
  Inbox,
  Send,
  Star,
  Trash2,
  Tag,
  Paperclip,
  RefreshCw,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Zap,
  Briefcase,
  User,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Globe,
  Radio,
  Reply,
  Forward,
  CheckCircle2,
  XCircle,
  Eye,
  MailOpen,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { WebmailEmail, WebmailFolder } from '../../types';

export const WebmailInboxView: React.FC = () => {
  const {
    webmailEmails,
    markWebmailEmailAsRead,
    toggleWebmailStar,
    deleteWebmailEmail,
    openComposeEmailModal,
    showToast,
    sendWebmailEmail,
    currentUser,
  } = useCRM();

  const [webmailSelectedFolder, setWebmailSelectedFolder] = useState<WebmailFolder>('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [filterHasAttachment, setFilterHasAttachment] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Quick reply state
  const [quickReplyText, setQuickReplyText] = useState('');
  const [isSendingQuickReply, setIsSendingQuickReply] = useState(false);

  // Folders definition
  const folders: { id: WebmailFolder; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'inbox', label: 'Bandeja de entrada', icon: Inbox },
    { id: 'starred', label: 'Destacados', icon: Star },
    { id: 'sent', label: 'Enviados', icon: Send },
    { id: 'drafts', label: 'Borradores', icon: Clock },
    { id: 'trash', label: 'Papelera', icon: Trash2 },
  ];

  // Filter emails according to active folder, search query and toggles
  const filteredEmails = useMemo(() => {
    return webmailEmails.filter((email) => {
      // Folder filter
      if (webmailSelectedFolder === 'starred') {
        if (!email.isStarred) return false;
      } else if (email.folder !== webmailSelectedFolder) {
        return false;
      }

      // Unread only toggle
      if (filterUnreadOnly && email.isRead) return false;

      // Has attachment toggle
      if (filterHasAttachment && (!email.attachments || email.attachments.length === 0)) return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchSubject = email.subject.toLowerCase().includes(q);
        const matchFrom = email.from.toLowerCase().includes(q) || (email.fromName && email.fromName.toLowerCase().includes(q));
        const matchBody = email.bodyText.toLowerCase().includes(q);
        const matchTo = email.to.some((t) => t.toLowerCase().includes(q));
        if (!matchSubject && !matchFrom && !matchBody && !matchTo) return false;
      }

      return true;
    });
  }, [webmailEmails, webmailSelectedFolder, filterUnreadOnly, filterHasAttachment, searchTerm]);

  // Selected email object
  const selectedEmail = useMemo(() => {
    if (!selectedEmailId && filteredEmails.length > 0) {
      return filteredEmails[0];
    }
    return webmailEmails.find((e) => e.id === selectedEmailId) || (filteredEmails.length > 0 ? filteredEmails[0] : null);
  }, [selectedEmailId, filteredEmails, webmailEmails]);

  // Handle manual sync simulation
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Bandeja de entrada sincronizada con Cloudflare D1 (0.04s)', 'success');
    }, 600);
  };

  // Select email and mark as read
  const handleSelectEmail = (email: WebmailEmail) => {
    setSelectedEmailId(email.id);
    if (!email.isRead) {
      markWebmailEmailAsRead(email.id, true);
    }
  };

  // Quick reply submit
  const handleQuickReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail || !quickReplyText.trim()) return;

    setIsSendingQuickReply(true);
    try {
      await sendWebmailEmail({
        from: 'info@clientum.com.ar',
        fromName: currentUser.name || 'Clientum Sales Team',
        to: [selectedEmail.from],
        subject: selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
        bodyText: quickReplyText.trim(),
        bodyHtml: `<p>${quickReplyText.trim().replace(/\n/g, '<br/>')}</p>`,
        folder: 'sent',
        isRead: true,
        isStarred: false,
        spfStatus: 'PASS',
        dkimStatus: 'PASS',
        dmarcStatus: 'PASS',
        attachments: [],
        crmLinkedType: selectedEmail.crmLinkedType,
        crmLinkedId: selectedEmail.crmLinkedId,
        crmLinkedName: selectedEmail.crmLinkedName,
      });

      setQuickReplyText('');
      showToast('Respuesta despachada vía Worker binding a ' + selectedEmail.from, 'success');
    } catch (err) {
      showToast('Error enviando la respuesta rápida', 'error');
    } finally {
      setIsSendingQuickReply(false);
    }
  };

  // Count unread per folder
  const unreadCounts = useMemo(() => {
    const counts: Record<string, number> = { inbox: 0, starred: 0, sent: 0, drafts: 0, trash: 0 };
    webmailEmails.forEach((e) => {
      if (!e.isRead) {
        if (counts[e.folder] !== undefined) {
          counts[e.folder]++;
        }
        if (e.isStarred) {
          counts.starred++;
        }
      }
    });
    return counts;
  }, [webmailEmails]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-muted)] text-[var(--text-primary)] overflow-hidden">
      {/* Top Banner / Cloudflare Worker Status */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-subtle)] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-[var(--text-primary)] leading-tight">
                Webmail Corporativo • Cloudflare Email Routing
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                D1 Database Sync
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              Worker: <span className="text-blue-600">webmail-clientum-worker</span> • Dominio: <span className="text-[var(--text-secondary)] font-semibold">clientum.com.ar</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] text-[var(--text-secondary)] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--text-muted)] ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
          </button>

          <button
            onClick={() => openComposeEmailModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Redactar</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Column: Folders Navigation */}
        <div className="w-56 bg-[var(--bg-card)] border-r border-[var(--border-subtle)] flex flex-col p-3 space-y-4 shrink-0">
          <div>
            <div className="text-[10px] font-bold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Carpetas
            </div>
            <nav className="space-y-0.5">
              {folders.map((f) => {
                const IconComponent = f.icon;
                const isActive = webmailSelectedFolder === f.id;
                const unread = unreadCounts[f.id] || 0;
                return (
                  <button
                    key={f.id}
                    onClick={() => setWebmailSelectedFolder(f.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${ isActive ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]' }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400'}`} />
                      <span className="truncate">{f.label}</span>
                    </div>
                    {unread > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono bg-blue-600 text-white">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick CRM Accounts Link */}
          <div className="pt-3 border-t border-[var(--border-subtle)]">
            <div className="text-[10px] font-bold text-[var(--text-muted,#64748b)] dark:text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Cuentas Activas
            </div>
            <div className="space-y-1 text-xs">
              <div className="px-2 py-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)]/80 font-mono text-[11px] text-[var(--text-secondary)] flex items-center justify-between">
                <span className="truncate font-semibold">info@clientum.com.ar</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <div className="px-2 py-1.5 rounded-lg hover:bg-[var(--bg-muted)] font-mono text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                <span className="truncate">ventas@clientum.com.ar</span>
                <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
              </div>
              <div className="px-2 py-1.5 rounded-lg hover:bg-[var(--bg-muted)] font-mono text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                <span className="truncate">soporte@clientum.com.ar</span>
                <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
              </div>
            </div>
          </div>

          {/* Worker Specs Card */}
          <div className="mt-auto p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px] space-y-1 text-[var(--text-secondary)]">
            <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Edge Architecture
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-tight">
              Recepción vía Email Routing, almacenamiento en Cloudflare D1 y despacho con send_email binding.
            </p>
          </div>
        </div>

        {/* Middle Column: Email List */}
        <div className="w-80 lg:w-96 bg-[var(--bg-card)] border-r border-[var(--border-subtle)] flex flex-col shrink-0">
          {/* Search and Filters Bar */}
          <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)] space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted,#64748b)] dark:text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por remitente, asunto o texto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted,#64748b)] dark:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-[var(--bg-card)]"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-0.5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${ filterUnreadOnly ? 'bg-blue-600 text-white' : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)]' }`}
                >
                  No leídos
                </button>
                <button
                  onClick={() => setFilterHasAttachment(!filterHasAttachment)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${ filterHasAttachment ? 'bg-blue-600 text-white' : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)]' }`}
                >
                  Con adjuntos
                </button>
              </div>
              <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
                {filteredEmails.length} correos
              </span>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-subtle)] custom-scrollbar">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted,#64748b)] dark:text-slate-400 text-xs space-y-2">
                <Mail className="w-8 h-8 mx-auto text-[var(--text-secondary,#475569)] dark:text-slate-300" />
                <p>No se encontraron correos en esta carpeta.</p>
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                return (
                  <div
                    key={email.id}
                    onClick={() => handleSelectEmail(email)}
                    className={`p-3.5 cursor-pointer transition-all relative text-xs space-y-1.5 ${ isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : email.isRead ? 'bg-[var(--bg-card)] hover:bg-[var(--bg-muted)]' : 'bg-blue-50/30 hover:bg-blue-50/50' }`}
                  >
                    {/* Header line: Sender & Time */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWebmailStar(email.id);
                          }}
                          className={`p-0.5 rounded transition-colors cursor-pointer ${ email.isStarred ? 'text-amber-500' : 'text-[var(--text-secondary,#475569)] dark:text-slate-300 hover:text-[var(--text-muted)]' }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${email.isStarred ? 'fill-amber-400' : ''}`} />
                        </button>
                        <span
                          className={`truncate font-medium ${ !email.isRead ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]' }`}
                        >
                          {email.fromName || email.from}
                        </span>
                      </div>

                      <span className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 shrink-0 font-mono">
                        {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Subject */}
                    <div
                      className={`truncate text-xs ${ !email.isRead ? 'text-blue-900 font-bold' : 'text-[var(--text-secondary)]' }`}
                    >
                      {email.subject}
                    </div>

                    {/* Body snippet */}
                    <div className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                      {email.bodyText}
                    </div>

                    {/* Meta badges: Attachments, SPF, CRM Link */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {email.attachments && email.attachments.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)] text-[9px] font-mono flex items-center gap-1">
                          <Paperclip className="w-2.5 h-2.5 text-[var(--text-muted)]" />
                          {email.attachments.length}
                        </span>
                      )}

                      {email.direction === 'outbound' ? (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-semibold">
                          Enviado Worker
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-semibold">
                          Inbound D1
                        </span>
                      )}

                      {email.crmLinkedName && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-semibold truncate max-w-[130px]">
                          CRM: {email.crmLinkedName}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Email Reading Pane */}
        <div className="flex-1 bg-[var(--bg-muted)]/60 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          {selectedEmail ? (
            <div className="p-4 sm:p-6 space-y-4 max-w-4xl">
              {/* Action Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      openComposeEmailModal({
                        from: 'info@clientum.com.ar',
                        to: [selectedEmail.from],
                        subject: selectedEmail.subject.startsWith('Re:')
                          ? selectedEmail.subject
                          : `Re: ${selectedEmail.subject}`,
                        bodyText: selectedEmail.bodyText,
                        crmLinkedType: selectedEmail.crmLinkedType,
                        crmLinkedId: selectedEmail.crmLinkedId,
                        crmLinkedName: selectedEmail.crmLinkedName,
                      })
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Responder</span>
                  </button>

                  <button
                    onClick={() =>
                      openComposeEmailModal({
                        from: 'info@clientum.com.ar',
                        subject: `Fwd: ${selectedEmail.subject}`,
                        bodyText: selectedEmail.bodyText,
                        attachments: selectedEmail.attachments,
                      })
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] text-xs font-semibold border border-[var(--border-subtle)] shadow-xs transition-colors cursor-pointer"
                  >
                    <Forward className="w-3.5 h-3.5" />
                    <span>Reenviar</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => markWebmailEmailAsRead(selectedEmail.id, !selectedEmail.isRead)}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border-subtle)] transition-colors text-xs cursor-pointer"
                    title={selectedEmail.isRead ? 'Marcar como no leído' : 'Marcar como leído'}
                  >
                    {selectedEmail.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => deleteWebmailEmail(selectedEmail.id)}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors text-xs cursor-pointer"
                    title="Eliminar correo de D1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subject Title */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug">
                  {selectedEmail.subject}
                </h3>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    SPF: {selectedEmail.spfStatus} • DKIM: {selectedEmail.dkimStatus}
                  </span>

                  <span className="text-[var(--text-muted,#64748b)] dark:text-slate-400 text-[11px] font-mono">
                    Message-ID: {selectedEmail.messageId}
                  </span>
                </div>
              </div>

              {/* Sender & Recipient Card */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {selectedEmail.fromName ? selectedEmail.fromName[0].toUpperCase() : selectedEmail.from[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[var(--text-primary)] font-bold flex items-center gap-2">
                      <span>{selectedEmail.fromName || selectedEmail.from}</span>
                      <span className="text-[var(--text-muted)] text-[11px] font-normal">&lt;{selectedEmail.from}&gt;</span>
                    </div>
                    <div className="text-[var(--text-muted)] text-[11px] mt-0.5">
                      Para: <span className="text-[var(--text-secondary)] font-mono font-medium">{selectedEmail.to.join(', ')}</span>
                      {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                        <span className="ml-2">CC: <span className="text-[var(--text-secondary)] font-mono">{selectedEmail.cc.join(', ')}</span></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 shrink-0 font-mono">
                  {new Date(selectedEmail.timestamp).toLocaleString()}
                </div>
              </div>

              {/* CRM Linked Banner */}
              {selectedEmail.crmLinkedName && (
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-purple-900 font-medium">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Vinculado con registro CRM: <strong>{selectedEmail.crmLinkedName}</strong></span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold uppercase">
                    {selectedEmail.crmLinkedType}
                  </span>
                </div>
              )}

              {/* Email Body */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-5 text-[var(--text-primary)] text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans shadow-xs">
                {selectedEmail.bodyText}
              </div>

              {/* Attachments Section */}
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                    Archivos Adjuntos ({selectedEmail.attachments.length})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedEmail.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Paperclip className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[var(--text-primary)] font-medium truncate font-mono text-[11px]">{att.name}</div>
                            <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 font-mono">
                              {Math.round(att.size / 1024)} KB • {att.type}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => showToast(`Descargando ${att.name}...`, 'info')}
                          className="px-2.5 py-1 rounded bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] text-blue-700 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                        >
                          Descargar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inline Quick Reply Box */}
              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Reply className="w-3.5 h-3.5 text-blue-600" />
                    Respuesta Rápida desde info@clientum.com.ar
                  </span>
                  <button
                    onClick={() =>
                      openComposeEmailModal({
                        from: 'info@clientum.com.ar',
                        to: [selectedEmail.from],
                        subject: selectedEmail.subject.startsWith('Re:')
                          ? selectedEmail.subject
                          : `Re: ${selectedEmail.subject}`,
                      })
                    }
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    Abrir editor completo &rarr;
                  </button>
                </div>

                <form onSubmit={handleQuickReply} className="space-y-2">
                  <textarea
                    rows={3}
                    placeholder={`Escribe una respuesta rápida para ${selectedEmail.fromName || selectedEmail.from}...`}
                    value={quickReplyText}
                    onChange={(e) => setQuickReplyText(e.target.value)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg p-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted,#64748b)] dark:text-slate-400 focus:outline-hidden focus:border-blue-600 leading-relaxed font-sans shadow-xs"
                  />

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSendingQuickReply || !quickReplyText.trim()}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingQuickReply ? 'Preparando...' : 'Responder'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[var(--text-muted,#64748b)] dark:text-slate-400 space-y-2">
              <Mail className="w-12 h-12 text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-2" />
              <h4 className="text-sm font-semibold text-[var(--text-secondary)]">Ningún correo seleccionado</h4>
              <p className="text-xs max-w-sm text-[var(--text-muted)]">
                Selecciona un correo de la lista o redacta un nuevo mensaje para comenzar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
