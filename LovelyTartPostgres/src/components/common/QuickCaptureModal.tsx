import React, { useState } from 'react';
import { Mic, MicOff, Square, Check, X, Sparkles, Building, User, Phone, Mail } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({ isOpen, onClose }) => {
  const { addPerson, addOpportunity, currentUser, showToast } = useCRM();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadNotes, setLeadNotes] = useState('');

  if (!isOpen) return null;

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast('Micrófono activado. Escuchando...', 'info');
      // Simulate speech-to-text recording capture after 3 seconds for demo in preview
      setTimeout(() => {
        setLeadName('Martín Rodríguez');
        setLeadCompany('Industrias Metalúrgicas Sur');
        setLeadPhone('+54 9 11 5544-3322');
        setLeadEmail('mrodriguez@metalurgicasur.com.ar');
        setLeadNotes('Cliente interesado en automatización de stock y facturación AFIP. Llamar el jueves por la mañana.');
        setTranscript('Martín Rodríguez de Industrias Metalúrgicas Sur, teléfono 11 5544 3322, correo mrodriguez@metalurgicasur.com.ar, interesado en automatización de stock.');
        setIsRecording(false);
        showToast('Transcripción de voz completada con éxito', 'success');
      }, 3500);
    } else {
      setIsRecording(false);
      showToast('Grabación detenida', 'info');
    }
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName) {
      showToast('Por favor ingresa al menos el nombre del lead', 'warning');
      return;
    }

    addPerson({
      firstName: leadName.split(' ')[0] || leadName,
      lastName: leadName.split(' ').slice(1).join(' ') || '',
      email: leadEmail || `${leadName.toLowerCase().replace(/\s+/g, '')}@lead.com.ar`,
      phone: leadPhone || '+54 9 11 0000-0000',
      jobTitle: 'Prospecto / Lead',
      companyName: leadCompany || 'Empresa Potencial',
      status: 'Lead',
      assignedTo: currentUser.name,
      notes: leadNotes || transcript || 'Capturado rápidamente por voz en reunión.',
    });

    showToast(`Lead "${leadName}" registrado con éxito`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden text-xs text-[var(--text-primary)]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--bg-muted)] border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Captura Rápida por Voz</h3>
              <p className="text-[10px] text-[var(--text-muted)]">Graba notas de voz en reuniones para crear leads al instante</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recording Widget */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col items-center justify-center py-6 bg-[var(--bg-muted)]/40 border border-dashed border-[var(--border-subtle)] rounded-2xl">
            <button
              type="button"
              onClick={handleToggleRecording}
              className={`relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all cursor-pointer ${ isRecording ? 'bg-rose-600 text-[var(--text-primary,#0f172a)] dark:text-white animate-pulse shadow-rose-500/50' : 'bg-blue-600 hover:bg-blue-500 text-[var(--text-primary,#0f172a)] dark:text-white shadow-blue-500/30' }`}
            >
              {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-7 w-7" />}
              {isRecording && (
                <span className="absolute -inset-2 rounded-full border-2 border-rose-500 animate-ping opacity-75" />
              )}
            </button>
            <p className="mt-3 text-xs font-semibold text-[var(--text-primary)]">
              {isRecording ? 'Escuchando y transcribiendo audio...' : 'Toca para iniciar grabación de voz'}
            </p>
            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              {isRecording ? 'Habla claramente sobre el contacto y su empresa' : 'Simula dictado automático para pruebas rápidas'}
            </p>
          </div>

          {transcript && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[11px]">
                <Sparkles className="h-3 w-3" />
                <span>Transcripción Inteligente IA</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] italic">"{transcript}"</p>
            </div>
          )}

          {/* Form extracted from voice */}
          <form onSubmit={handleSaveLead} className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Nombre del Lead</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="ej. Martín Rodríguez"
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Empresa</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    placeholder="ej. Metalúrgica Sur"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+54 9 11..."
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="ej. martin@empresa.com.ar"
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[var(--bg-muted)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] rounded-xl font-medium transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Guardar Lead</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
