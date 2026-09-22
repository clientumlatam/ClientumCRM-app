import React from 'react';
import { Mail, MessageSquare, ArrowRight, Inbox, Send } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const MessagesView: React.FC = () => {
  const { setActiveTab, webmailEmails } = useCRM();
  const unreadEmailCount = webmailEmails.filter((email) => email.folder === 'inbox' && !email.isRead).length;

  return (
    <div id="clientum-messages-view" className="flex-1 overflow-y-auto bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] p-5 text-[var(--text-primary,#0f172a)] dark:text-slate-200">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5">
          <div className="mb-1 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            <h2 className="text-base font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Mensajes</h2>
          </div>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">Central de acceso rápido para todas tus conversaciones comerciales.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            id="messages-whatsapp-card"
            onClick={() => setActiveTab('whatsapp')}
            className="group rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-[#11141c] p-5 text-left transition-colors hover:border-emerald-400/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <MessageSquare className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-emerald-300" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">WhatsApp CRM</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted,#64748b)] dark:text-slate-400">Inbox multiagente, plantillas y campañas masivas.</p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          </button>

          <button
            id="messages-webmail-card"
            onClick={() => setActiveTab('webmail')}
            className="group rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-[#11141c] p-5 text-left transition-colors hover:border-blue-400/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                <Mail className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-blue-300" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[var(--text-primary,#0f172a)] dark:text-white">Webmail Cloudflare</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted,#64748b)] dark:text-slate-400">Correo corporativo, routing y sincronización D1.</p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-300">
              <Inbox className="h-3 w-3" />
              {unreadEmailCount} sin leer
            </span>
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c] p-4">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <p className="mt-3 text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white">12</p>
            <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Conversaciones activas</p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c] p-4">
            <Mail className="h-4 w-4 text-blue-400" />
            <p className="mt-3 text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{unreadEmailCount}</p>
            <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Correos pendientes</p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] bg-[var(--bg-card,#ffffff)] dark:bg-[#11141c] p-4">
            <Send className="h-4 w-4 text-violet-400" />
            <p className="mt-3 text-lg font-bold text-[var(--text-primary,#0f172a)] dark:text-white">24/7</p>
            <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Disponibilidad del chatbot</p>
          </div>
        </div>
      </div>
    </div>
  );
};