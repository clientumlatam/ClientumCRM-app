import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeMode, ContrastMode } from '../types';
import { syncWorkspaceToFirestore } from '../firebase';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
  contrast: ContrastMode;
  setTheme: (theme: ThemeMode) => void;
  setContrast: (contrast: ContrastMode) => void;
  toggleTheme: () => void;
  toggleContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'clientum_theme';
const CONTRAST_STORAGE_KEY = 'clientum_contrast';

export const getSystemThemePreference = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

/**
 * Retrieves persisted theme preference from localStorage or automatically detects OS preference on initial load
 */
const getInitialTheme = (defaultFallback?: ThemeMode): ThemeMode => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved as ThemeMode;
      }
    } catch {
      // storage unavailable
    }

    // Automatically detect user's OS preference using window.matchMedia('(prefers-color-scheme: dark)') on initial load
    if (window.matchMedia) {
      const detectedTheme: ThemeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, detectedTheme);
        localStorage.setItem('theme', detectedTheme);
      } catch {
        // storage unavailable
      }
      return detectedTheme;
    }
  }
  return defaultFallback || 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode; defaultTheme?: ThemeMode }> = ({
  children,
  defaultTheme,
}) => {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemThemePreference);

  // Initial state with automatic OS preference detection and localStorage persistence layer
  const [theme, setThemeState] = useState<ThemeMode>(() => getInitialTheme(defaultTheme));
  const [contrast, setContrastState] = useState<ContrastMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CONTRAST_STORAGE_KEY);
        if (saved === 'aaa' || saved === 'normal') return saved as ContrastMode;
      } catch {}
    }
    return 'normal';
  });

  // Calculate resolved theme based on current mode and system OS preference
  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? systemTheme : theme;

  // 1. System OS Theme Listener
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const newSysTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSysTheme);
    };

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleSystemChange);
      return () => (mediaQuery as any).removeListener(handleSystemChange);
    }
  }, []);

  // 2. Synchronize DOM document root attributes and localStorage
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-mode', resolvedTheme);
    root.setAttribute('data-theme-setting', theme);
    root.setAttribute('data-contrast', contrast);

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    root.style.colorScheme = resolvedTheme;

    // Advanced Contrast Selector (WCAG AAA) & High Contrast Filter in Dark Mode
    if (contrast === 'aaa') {
      root.classList.add('contrast-aaa');
      if (resolvedTheme === 'light') {
        root.style.setProperty('--bg-canvas', '#ffffff');
        root.style.setProperty('--text-primary', '#000000');
        root.style.setProperty('--border-subtle', '#64748b');
      } else {
        root.style.setProperty('--bg-canvas', '#000000');
        root.style.setProperty('--bg-surface', '#030303');
        root.style.setProperty('--bg-card', '#080808');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--border-subtle', '#334155');
        root.style.setProperty('filter', 'contrast(1.35) saturate(1.1)');
      }
    } else {
      root.classList.remove('contrast-aaa');
      root.style.removeProperty('--bg-canvas');
      root.style.removeProperty('--bg-surface');
      root.style.removeProperty('--bg-card');
      root.style.removeProperty('--text-primary');
      root.style.removeProperty('--border-subtle');
      root.style.removeProperty('filter');
    }

    // Persist current theme mode selection across refreshes
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem('theme', theme);
      localStorage.setItem(CONTRAST_STORAGE_KEY, contrast);
    } catch {
      // storage unavailable
    }
  }, [theme, resolvedTheme, contrast]);

  // 3. Listen to cross-tab storage updates
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if ((e.key === THEME_STORAGE_KEY || e.key === 'theme') && e.newValue) {
        if (e.newValue === 'dark' || e.newValue === 'light' || e.newValue === 'system') {
          setThemeState(e.newValue as ThemeMode);
        }
      }
      if (e.key === CONTRAST_STORAGE_KEY && e.newValue) {
        if (e.newValue === 'aaa' || e.newValue === 'normal') {
          setContrastState(e.newValue as ContrastMode);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      localStorage.setItem('theme', newTheme);
    } catch {
      // storage unavailable
    }

    // Persist to Firestore if user is authenticated
    try {
      const authUserStr = localStorage.getItem('clientum_auth_user');
      if (authUserStr) {
        const userObj = JSON.parse(authUserStr);
        if (userObj?.id) {
          syncWorkspaceToFirestore(userObj.id, { theme: newTheme });
        }
      }
    } catch (err) {
      console.warn('Failed to sync theme preference to Firestore:', err);
    }
  }, []);

  const setContrast = useCallback((newContrast: ContrastMode) => {
    setContrastState(newContrast);
    try {
      localStorage.setItem(CONTRAST_STORAGE_KEY, newContrast);
    } catch {
      // storage unavailable
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const currentResolved = current === 'system' ? getSystemThemePreference() : current;
      const next: ThemeMode = currentResolved === 'dark' ? 'light' : 'dark';

      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
        localStorage.setItem('theme', next);
      } catch {
        // storage unavailable
      }

      try {
        const authUserStr = localStorage.getItem('clientum_auth_user');
        if (authUserStr) {
          const userObj = JSON.parse(authUserStr);
          if (userObj?.id) {
            syncWorkspaceToFirestore(userObj.id, { theme: next });
          }
        }
      } catch {
        // ignore
      }

      return next;
    });
  }, []);

  const toggleContrast = useCallback(() => {
    setContrastState((current) => {
      const next: ContrastMode = current === 'aaa' ? 'normal' : 'aaa';
      try {
        localStorage.setItem(CONTRAST_STORAGE_KEY, next);
      } catch {
        // storage unavailable
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        systemTheme,
        contrast,
        setTheme,
        setContrast,
        toggleTheme,
        toggleContrast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeContext };
