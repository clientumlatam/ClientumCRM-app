import { useMemo } from 'react';

/**
 * Hook to centralize and standardize asset loading for the Clientum ecosystem.
 * Ensures all components use the single source of truth for branding assets.
 */
export const useClientumAssets = () => {
  const assets = useMemo(() => ({
    // Principal Branding Asset
    favicon: '/favicon.svg',
    
    // Secondary Branding Asset
    logo: '/logo.png',
  }), []);

  return assets;
};
