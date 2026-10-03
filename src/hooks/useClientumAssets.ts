import { useMemo } from 'react';

/**
 * Hook to centralize and standardize asset loading for the Clientum ecosystem.
 * Ensures all components use the single source of truth for branding assets.
 */
export const useClientumAssets = () => {
  const assets = useMemo(() => ({
    // Principal Branding Asset
    favicon: 'https://lh3.googleusercontent.com/a/ACg8ocLSPlzRCibVYMr9JueLEE_Cl1PMZG8TxzZAGpo_Q8dTLpUgnfE=s96-c',
    
    // Secondary Branding Asset
    logo: 'https://lh3.googleusercontent.com/a/ACg8ocLSPlzRCibVYMr9JueLEE_Cl1PMZG8TxzZAGpo_Q8dTLpUgnfE=s96-c',
  }), []);

  return assets;
};
