import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { AICopilot } from './AICopilot';

export const AICopilotModal: React.FC = () => {
  const { isAICopilotModalOpen, setIsAICopilotModalOpen } = useCRM();

  if (!isAICopilotModalOpen) return null;

  return (
    <div
      id="clientum-ai-copilot-backdrop"
      className="crm-assistant-backdrop bg-slate-950/60 backdrop-blur-xs fixed inset-0 z-50 flex justify-end animate-in fade-in duration-150"
      onClick={() => setIsAICopilotModalOpen(false)}
    >
      <div
        className="h-full max-w-sm w-full shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <AICopilot onClose={() => setIsAICopilotModalOpen(false)} />
      </div>
    </div>
  );
};

export default AICopilotModal;
