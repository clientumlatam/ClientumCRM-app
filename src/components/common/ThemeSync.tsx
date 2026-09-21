/**
 * Centralized ThemeSync Component
 * Archivo: src/components/common/ThemeSync.tsx
 *
 * Monitors changes in the 'data-theme' (and related) attribute on the document root
 * and propagates these changes to all nested dashboard components to prevent style flickering.
 * Supports both standalone placement (<ThemeSync />) and wrapper usage (<ThemeSync>{children}</ThemeSync>).
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCRM } from '../../context/CRMContext';
import { ThemeMode, ContrastMode } from '../../types';
import {
  syncThemeToDOM,
  isDOMThemeOutOfSync,
  observeDocumentTheme,
  propagateThemeToDashboardNodes,
  getActiveThemeAttributes,
  ThemeSyncOptions,
  ThemeSyncAttributes,
} from '../../lib/theme/ThemeSync';

export interface SyncedThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  contrast: ContrastMode;
  isPublicSite: boolean;
  isSynced: boolean;
  syncCount: number;
}

const ThemeSyncContext = createContext<SyncedThemeState>({
  theme: 'light',
  resolvedTheme: 'light',
  contrast: 'normal',
  isPublicSite: false,
  isSynced: true,
  syncCount: 0,
});

/**
 * Hook to access the live DOM-synced theme state inside any nested component.
 */
export const useSyncedTheme = (): SyncedThemeState => useContext(ThemeSyncContext);
export const useThemeSyncState = (): SyncedThemeState => useContext(ThemeSyncContext);

export interface ThemeSyncProps {
  children?: React.ReactNode;
  className?: string;
  dataContainerId?: string;
}

export const ThemeSync: React.FC<ThemeSyncProps> = ({
  children,
  className,
  dataContainerId,
}) => {
  const { theme, resolvedTheme, contrast, setTheme, setContrast } = useTheme();
  const { isPublicSiteVisible } = useCRM();

  const [syncCount, setSyncCount] = useState(0);
  const isSyncingRef = useRef(false);

  const syncOptions: ThemeSyncOptions = useMemo(
    () => ({
      theme,
      resolvedTheme,
      contrast,
      isPublicSite: isPublicSiteVisible,
    }),
    [theme, resolvedTheme, contrast, isPublicSiteVisible]
  );

  // 1. Synchronous deep comparison check during render
  // Runs before DOM paint to preemptively eliminate visual jumps
  if (typeof document !== 'undefined' && isDOMThemeOutOfSync(syncOptions)) {
    syncThemeToDOM(syncOptions);
  }

  // 2. Pre-paint layout effect to guarantee DOM synchronization
  useLayoutEffect(() => {
    if (typeof document !== 'undefined' && isDOMThemeOutOfSync(syncOptions)) {
      syncThemeToDOM(syncOptions);
    } else if (typeof document !== 'undefined') {
      propagateThemeToDashboardNodes(theme, resolvedTheme, contrast);
    }
  }, [syncOptions, theme, resolvedTheme, contrast]);

  // 3. Monitor changes in the 'data-theme' attribute on the document root using MutationObserver
  useEffect(() => {
    const unobserve = observeDocumentTheme((attributes: ThemeSyncAttributes) => {
      // Prevent cyclical re-triggering
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;

      try {
        // Propagate theme changes directly to all nested dashboard DOM components
        propagateThemeToDashboardNodes(
          attributes.dataTheme,
          attributes.dataMode,
          attributes.dataContrast
        );

        // If the DOM was mutated from an external source, synchronize React Context state
        if (attributes.dataTheme && attributes.dataTheme !== theme) {
          setTheme(attributes.dataTheme);
        }
        if (attributes.dataContrast && attributes.dataContrast !== contrast && setContrast) {
          setContrast(attributes.dataContrast);
        }

        setSyncCount((prev) => prev + 1);
      } finally {
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 50);
      }
    });

    return () => {
      unobserve();
    };
  }, [theme, contrast, setTheme, setContrast]);

  // Context value exposing live synchronized theme state to all children
  const contextValue: SyncedThemeState = useMemo(() => {
    const currentDOM = getActiveThemeAttributes();
    return {
      theme: currentDOM.dataTheme || theme,
      resolvedTheme: currentDOM.dataMode || resolvedTheme,
      contrast: currentDOM.dataContrast || contrast,
      isPublicSite: isPublicSiteVisible,
      isSynced: true,
      syncCount,
    };
  }, [theme, resolvedTheme, contrast, isPublicSiteVisible, syncCount]);

  if (!children) {
    return (
      <ThemeSyncContext.Provider value={contextValue}>
        {null}
      </ThemeSyncContext.Provider>
    );
  }

  return (
    <ThemeSyncContext.Provider value={contextValue}>
      <div
        id={dataContainerId}
        data-theme={contextValue.theme}
        data-mode={contextValue.resolvedTheme}
        data-contrast={contextValue.contrast}
        data-theme-container="true"
        data-theme-boundary="true"
        className={`theme-sync-boundary ${className || 'contents'}`}
        style={{
          '--crm-grid-gap': 'var(--space-grid-gap, 16px)',
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeSyncContext.Provider>
  );
};
