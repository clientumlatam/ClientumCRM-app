import React from 'react';
import { PublicFloatingChatbot } from './PublicFloatingChatbot';
import { PublicRoutePath } from './publicRoutes';

interface PublicChatbotProps {
  onNavigate?: (path: PublicRoutePath) => void;
  onOpenSimulator?: () => void;
  onOpenWizard?: () => void;
}

export const PublicChatbot: React.FC<PublicChatbotProps> = ({
  onNavigate = () => {},
  onOpenSimulator = () => {},
  onOpenWizard = () => {},
}) => {
  return (
    <PublicFloatingChatbot
      onNavigate={onNavigate}
      onOpenSimulator={onOpenSimulator}
      onOpenWizard={onOpenWizard}
    />
  );
};
