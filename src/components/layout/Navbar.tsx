import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { moduleNeedsUserCredentials } from '../../data/moduleCredentials';
import { CrmTopHeader } from './CrmTopHeader';
import { CrmSubHeader } from './CrmSubHeader';
import { ModuleCredentialsModal } from '../settings/ModuleCredentialsModal';
import { VoiceNoteModal } from '../activities/VoiceNoteModal';
import { AutomationsManagerModal } from '../workflows/AutomationsManagerModal';
import { TeamLeaderboardModal } from '../analytics/TeamLeaderboardModal';

export const Navbar: React.FC = () => {
  const { activeTab } = useCRM();

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isVoiceNoteOpen, setIsVoiceNoteOpen] = useState(false);
  const [isAutomationsOpen, setIsAutomationsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const configModuleId = activeTab === 'mapsProspecting' ? 'googleMaps' : activeTab;
  const hasModuleCredentials = moduleNeedsUserCredentials(configModuleId);

  return (
    <div id="clientum-top-navbar" className="flex flex-col w-full shrink-0 z-30">
      {/* 1. Main Top Header (Branding, User Profile, Search, Connectivity, Quick Actions) */}
      <CrmTopHeader
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenVoiceNote={() => setIsVoiceNoteOpen(true)}
        onOpenAutomations={() => setIsAutomationsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        hasModuleCredentials={hasModuleCredentials}
      />

      {/* 2. Top Sub-Header Navigation Bar */}
      <CrmSubHeader />

      {/* Integrated Action Modals */}
      <ModuleCredentialsModal
        moduleId={isConfigOpen ? configModuleId : null}
        onClose={() => setIsConfigOpen(false)}
      />
      <VoiceNoteModal
        isOpen={isVoiceNoteOpen}
        onClose={() => setIsVoiceNoteOpen(false)}
      />
      <AutomationsManagerModal
        isOpen={isAutomationsOpen}
        onClose={() => setIsAutomationsOpen(false)}
      />
      <TeamLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
};
