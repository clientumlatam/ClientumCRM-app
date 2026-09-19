import React, { useState } from 'react';
import { MessageSquare, Send, FileText, QrCode } from 'lucide-react';
import { InboxView } from './InboxView';
import { TemplateView } from './TemplateView';
import { BroadcastsView } from './BroadcastsView';
import { WhatsAppBaileysSettings } from './WhatsAppBaileysSettings';

export const WhatsAppView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'templates' | 'broadcasts' | 'settings'>('inbox');

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] overflow-hidden select-none relative text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      
      {/* Top Navigation Bar for WhatsApp Module */}
      <div className="h-14 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2330] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d0f17] px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <MessageSquare className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-bold text-[var(--text-primary,#0f172a)] dark:text-white text-sm flex items-center gap-2">
              WhatsApp CRM de ClientumCRM
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono font-normal">
                Pendiente de conexión segura
              </span>
            </h2>
            <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Bandeja multi-agente, modo dual bot/humano, plantillas y campañas masivas</p>
          </div>
        </div>

        {/* Sub-tabs selector */}
        <div className="flex items-center bg-[var(--bg-card,#ffffff)] dark:bg-[#151922] p-1 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#232a3d]">
          <button
            onClick={() => setActiveSubTab('inbox')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${ activeSubTab === 'inbox' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#20283b] text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inbox en Vivo</span>
          </button>

          <button
            onClick={() => setActiveSubTab('templates')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${ activeSubTab === 'templates' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#20283b] text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Plantillas Meta</span>
          </button>

          <button
            onClick={() => setActiveSubTab('broadcasts')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${ activeSubTab === 'broadcasts' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#20283b] text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            <Send className="w-3.5 h-3.5 text-purple-400" />
            <span>Campañas Masivas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${ activeSubTab === 'settings' ? 'bg-[var(--bg-muted,#f1f5f9)] dark:bg-[#20283b] text-[var(--text-primary,#0f172a)] dark:text-white shadow-sm' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200' }`}
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span>Conexión QR / API</span>
          </button>
        </div>
      </div>

      {/* SubTab Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeSubTab === 'inbox' && <InboxView />}
        {activeSubTab === 'templates' && <TemplateView />}
        {activeSubTab === 'broadcasts' && <BroadcastsView />}
        {activeSubTab === 'settings' && <WhatsAppBaileysSettings />}
      </div>

    </div>
  );
};
