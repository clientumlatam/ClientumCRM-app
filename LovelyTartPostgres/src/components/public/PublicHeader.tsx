import React from 'react';
import { PublicTopHeader } from './PublicTopHeader';
import { PublicNavbar } from './PublicNavbar';
import { PublicRoutePath } from './publicRoutes';

export interface PublicHeaderProps {
  currentPath: string;
  onNavigate: (path: PublicRoutePath) => void;
  currency: 'ARS' | 'USD';
  onToggleCurrency: () => void;
  onOpenWizard: () => void;
  onOpenSimulator: () => void;
  onOpenAudit: () => void;
}

/**
 * Unified Header component for the public-facing site.
 * Maintains full visual parity, brand guidelines, menu structure, and theme switcher
 * with the main ClientumCRM application.
 */
export const PublicHeader: React.FC<PublicHeaderProps> = ({
  currentPath,
  onNavigate,
  currency,
  onToggleCurrency,
  onOpenWizard,
  onOpenSimulator,
  onOpenAudit,
}) => {
  return (
    <header
      id="clientum-public-unified-header"
      className="sticky top-0 z-50 w-full transition-colors duration-200"
    >
      {/* 1. Top Announcement & Utility Bar */}
      <PublicTopHeader
        onNavigate={onNavigate}
        currency={currency}
        onToggleCurrency={onToggleCurrency}
        onOpenAudit={onOpenAudit}
      />

      {/* 2. Main Navigation Bar with Theme Switcher & Brand Parity */}
      <PublicNavbar
        currentPath={currentPath}
        onNavigate={onNavigate}
        currency={currency}
        onToggleCurrency={onToggleCurrency}
        onOpenWizard={onOpenWizard}
        onOpenSimulator={onOpenSimulator}
        onOpenAudit={onOpenAudit}
      />
    </header>
  );
};

export default PublicHeader;
