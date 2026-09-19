import React, { useState } from 'react';
import { Send, Plus, CheckCircle2, Clock, Users, Sparkles, BarChart2, Mic } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { WhatsAppVoiceDictationBar } from './WhatsAppVoiceDictationBar';

export const BroadcastsView: React.FC = () => {
  const { showToast, triggerConfetti } = useCRM();
  const [isVoiceDictationOpen, setIsVoiceDictationOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState([
    {
      id: 'b-1',
      title: 'Lanzamiento Nuevas Funciones IA August 2026',
      audience: 'Todos los Leads (1,420)',
      sentCount: 1420,
      deliveredRate: '98.4%',
      readRate: '74.2%',
      status: 'Completado',
      date: '21 Ago 2026'
    },
    {
      id: 'b-2',
      title: 'Promoción Anual Facturación AFIP & MP',
      audience: 'Clientes Activos (380)',
      sentCount: 380,
      deliveredRate: '99.1%',
      readRate: '88.0%',
      status: 'Completado',
      date: '18 Ago 2026'
    }
  ]);

  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('Todos los Leads y Cuentas');
  const [message, setMessage] = useState('');

  const launchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newB = {
      id: `b-${Date.now()}`,
      title,
      audience,
      sentCount: 540,
      deliveredRate: '99.0%',
      readRate: '81.5%',
      status: 'En Proceso',
      date: 'Hace un momento'
    };

    setBroadcasts([newB, ...broadcasts]);
    setTitle('');
    setMessage('');
    showToast('Campaña masiva de WhatsApp lanzada con éxito', 'success');
    triggerConfetti();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0c10] text-[var(--text-secondary,#475569)] dark:text-slate-300 text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-400" />
            Campañas Masivas de WhatsApp (Broadcasts)
          </h3>
          <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Envía difusiones segmentadas a través de la API oficial con analíticas de entrega en tiempo real.</p>
        </div>
      </div>

      {/* Campaign Launcher */}
      <div className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] p-5 rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] space-y-4 max-w-2xl">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">Lanzar Nueva Campaña de Difusión</h4>
        <form onSubmit={launchBroadcast} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Título de Campaña</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej. Lanzamiento Webinar Q3"
                className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Segmento Objetivo</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white px-3 py-2 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-blue-500"
              >
                <option>Todos los Leads y Cuentas (1,420)</option>
                <option>Empresas Tier Enterprise (380)</option>
                <option>Prospectos en Negociación (85)</option>
                <option>Clientes Activos (410)</option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300">
                Mensaje de Difusión (Plantilla Aprobada)
              </label>
              <button
                type="button"
                onClick={() => setIsVoiceDictationOpen(!isVoiceDictationOpen)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${ isVoiceDictationOpen ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30' }`}
              >
                <Mic className={`w-3 h-3 ${isVoiceDictationOpen ? 'animate-pulse text-red-400' : ''}`} />
                <span>{isVoiceDictationOpen ? 'Cerrar Dictado' : 'Dictar por voz'}</span>
              </button>
            </div>

            {isVoiceDictationOpen && (
              <div className="mb-2">
                <WhatsAppVoiceDictationBar
                  onInsertText={(text, mode) => {
                    if (mode === 'replace') {
                      setMessage(text);
                    } else {
                      setMessage(prev => prev ? `${prev.trim()} ${text}` : text);
                    }
                    setIsVoiceDictationOpen(false);
                  }}
                  currentInputText={message}
                  onClose={() => setIsVoiceDictationOpen(false)}
                />
              </div>
            )}

            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hola, te invitamos a nuestra sesión exclusiva este jueves a las 16hs..."
              className="w-full bg-[var(--bg-card,#ffffff)] dark:bg-[#181d2c] text-[var(--text-primary,#0f172a)] dark:text-white p-3 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#273248] text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Lanzar Campaña Masiva</span>
          </button>
        </form>
      </div>

      {/* Campaigns History */}
      <div className="space-y-3">
        <h4 className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-xs uppercase tracking-wider text-[var(--text-muted,#64748b)] dark:text-slate-400">Historial de Campañas</h4>
        <div className="space-y-3">
          {broadcasts.map(b => (
            <div key={b.id} className="bg-[var(--bg-card,#ffffff)] dark:bg-[#131722] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#212a3d] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-[var(--text-primary,#0f172a)] dark:text-white text-sm">{b.title}</div>
                <div className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 mt-0.5">Audiencia: {b.audience} • Fecha: {b.date}</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white">{b.sentCount} envíos</div>
                  <div className="text-[10px] text-emerald-400">Entrega {b.deliveredRate}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-blue-400">{b.readRate}</div>
                  <div className="text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400">Tasa de lectura</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium text-[10px] border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
