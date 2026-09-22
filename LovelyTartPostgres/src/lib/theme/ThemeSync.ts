/**
 * Centralized ThemeSync Utility
 * Archivo: src/lib/theme/ThemeSync.ts
 *
 * Ensures seamless synchronization of CSS classes, data attributes, and
 * design system tokens between the Public Site and the Private Dashboard.
 * Eliminates style flickering, layout jumps, and font-scale mismatches.
 */

import { ThemeMode, ContrastMode } from '../../types';

export const CLIENTUM_THEME_CHANGE_EVENT = 'clientum:theme-change';
export const THEME_SWITCH_EVENT = 'theme-switch';
export const THEME_MUTATION_EVENT = 'clientum:theme-mutation';

export interface ThemeSyncOptions {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  contrast?: ContrastMode;
  isPublicSite?: boolean;
}

export interface ThemeSyncAttributes {
  dataTheme: ThemeMode;
  dataMode: 'light' | 'dark';
  dataContrast: ContrastMode;
  dataEnvironment: 'public' | 'private';
  classList: string[];
}

export interface ThemeEventDetail {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  contrast: ContrastMode;
  isPublicSite: boolean;
  previousTheme: ThemeMode | null;
  previousMode: 'light' | 'dark' | null;
  timestamp: number;
}

/**
 * Propagates theme attributes directly to all nested dashboard DOM containers
 * to ensure nested components and CSS container rules reflect theme changes synchronously,
 * completely preventing style flickering.
 */
export function propagateThemeToDashboardNodes(
  theme: ThemeMode,
  resolvedTheme: 'light' | 'dark',
  contrast: ContrastMode = 'normal'
): void {
  if (typeof document === 'undefined') return;

  const selector = [
    '#clientum-private-environment',
    '#crm-main-viewport',
    '.crm-dashboard',
    '.crm-main-content',
    '.crm-private-environment',
    '[data-theme-container]',
    '[data-theme-boundary]',
  ].join(', ');

  const targets = document.querySelectorAll<HTMLElement>(selector);
  targets.forEach((el) => {
    if (el.getAttribute('data-theme') !== theme) {
      el.setAttribute('data-theme', theme);
    }
    if (el.getAttribute('data-mode') !== resolvedTheme) {
      el.setAttribute('data-mode', resolvedTheme);
    }
    if (el.getAttribute('data-contrast') !== contrast) {
      el.setAttribute('data-contrast', contrast);
    }

    // Ensure CSS Grid Gap variable is declared and stabilized
    if (!el.style.getPropertyValue('--crm-grid-gap')) {
      el.style.setProperty('--crm-grid-gap', 'var(--space-grid-gap, 16px)');
    }
  });
}

/**
 * Performs a deep comparison of the current application state against the DOM's
 * data-theme attributes, data-mode, data-contrast, data-environment, and corresponding classList.
 * Returns true if the DOM is out of sync and requires immediate update.
 */
export function isDOMThemeOutOfSync(options: ThemeSyncOptions): boolean {
  if (typeof document === 'undefined') return false;

  const root = document.documentElement;
  const body = document.body;

  const { theme, resolvedTheme, contrast = 'normal', isPublicSite = false } = options;
  const expectedEnv = isPublicSite ? 'public' : 'private';

  // 1. Check Data Attributes
  if (root.getAttribute('data-theme') !== theme) return true;
  if (root.getAttribute('data-mode') !== resolvedTheme) return true;
  if (root.getAttribute('data-theme-setting') !== theme) return true;
  if ((root.getAttribute('data-contrast') || 'normal') !== contrast) return true;
  if (root.getAttribute('data-environment') !== expectedEnv) return true;

  // 2. Check Mode Classes
  const isDarkClassPresent = root.classList.contains('dark');
  const isLightClassPresent = root.classList.contains('light');
  if (resolvedTheme === 'dark' && (!isDarkClassPresent || isLightClassPresent)) return true;
  if (resolvedTheme === 'light' && (!isLightClassPresent || isDarkClassPresent)) return true;

  // 3. Check Variant Classes (executive vs clarity)
  const isExecutivePresent = root.classList.contains('theme-executive');
  const isClarityPresent = root.classList.contains('theme-clarity');
  if (theme === 'executive' && (!isExecutivePresent || isClarityPresent)) return true;
  if (theme === 'clarity' && (!isClarityPresent || isExecutivePresent)) return true;
  if (theme !== 'executive' && theme !== 'clarity' && (isExecutivePresent || isClarityPresent)) return true;

  // 4. Check Contrast Class
  const isAaaPresent = root.classList.contains('contrast-aaa');
  if (contrast === 'aaa' && !isAaaPresent) return true;
  if (contrast !== 'aaa' && isAaaPresent) return true;

  // 5. Check Environment Classes on root and body
  const expectedEnvClass = isPublicSite ? 'clientum-env-public' : 'clientum-env-private';
  const unexpectedEnvClass = isPublicSite ? 'clientum-env-private' : 'clientum-env-public';
  if (!root.classList.contains(expectedEnvClass) || root.classList.contains(unexpectedEnvClass)) return true;
  if (body && (!body.classList.contains(expectedEnvClass) || body.classList.contains(unexpectedEnvClass))) return true;

  return false;
}

/**
 * Synchronizes DOM document root attributes and classes across Public & Private views.
 * Dispatches a custom event to notify listening components when a theme switch occurs.
 * Returns true if a change was applied, false if DOM was already synchronized.
 */
export function syncThemeToDOM(options: ThemeSyncOptions): boolean {
  if (typeof document === 'undefined') return false;

  const root = document.documentElement;
  const body = document.body;

  const { theme, resolvedTheme, contrast = 'normal', isPublicSite = false } = options;

  // Deep comparison before touching the DOM
  const outOfSync = isDOMThemeOutOfSync(options);
  if (!outOfSync) {
    // Even if root is in sync, ensure nested dashboard nodes are propagated
    propagateThemeToDashboardNodes(theme, resolvedTheme, contrast);
    return false;
  }

  // Capture previous state for event payload
  const previousTheme = (root.getAttribute('data-theme') as ThemeMode) || null;
  const previousMode = (root.getAttribute('data-mode') as 'light' | 'dark') || null;

  // 1. Synchronize Data Attributes
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-mode', resolvedTheme);
  root.setAttribute('data-theme-setting', theme);
  root.setAttribute('data-contrast', contrast);
  root.setAttribute('data-environment', isPublicSite ? 'public' : 'private');

  // 2. ClassList Synchronization
  // Manage Mode: light vs dark
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }

  // Manage Specific Theme Variants
  if (theme === 'executive') {
    root.classList.add('theme-executive');
    root.classList.remove('theme-clarity');
  } else if (theme === 'clarity') {
    root.classList.add('theme-clarity');
    root.classList.remove('theme-executive');
  } else {
    root.classList.remove('theme-executive');
    root.classList.remove('theme-clarity');
  }

  // Manage Accessibility Contrast
  if (contrast === 'aaa') {
    root.classList.add('contrast-aaa');
  } else {
    root.classList.remove('contrast-aaa');
  }

  // Manage Environment Classes
  if (isPublicSite) {
    root.classList.add('clientum-env-public');
    root.classList.remove('clientum-env-private');
    if (body) {
      body.classList.add('clientum-env-public');
      body.classList.remove('clientum-env-private');
    }
  } else {
    root.classList.add('clientum-env-private');
    root.classList.remove('clientum-env-public');
    if (body) {
      body.classList.add('clientum-env-private');
      body.classList.remove('clientum-env-public');
    }
  }

  // 3. Color Scheme Meta Style
  root.style.colorScheme = resolvedTheme;

  // 4. Smooth Layout Shift Prevention (Prevent scrollbar jump between public/private)
  root.style.scrollbarGutter = 'stable';

  // 5. Propagate immediately to nested dashboard nodes
  propagateThemeToDashboardNodes(theme, resolvedTheme, contrast);

  // 6. Dispatch custom events to notify components and prevent layout flickers
  try {
    const detail: ThemeEventDetail = {
      theme,
      resolvedTheme,
      contrast,
      isPublicSite,
      previousTheme,
      previousMode,
      timestamp: Date.now(),
    };

    const themeChangeEvent = new CustomEvent(CLIENTUM_THEME_CHANGE_EVENT, {
      detail,
      bubbles: true,
      cancelable: false,
    });
    window.dispatchEvent(themeChangeEvent);
    document.dispatchEvent(themeChangeEvent);

    const themeSwitchEvent = new CustomEvent(THEME_SWITCH_EVENT, {
      detail,
      bubbles: true,
      cancelable: false,
    });
    window.dispatchEvent(themeSwitchEvent);
    document.dispatchEvent(themeSwitchEvent);
  } catch {
    // Gracefully handle environments where CustomEvent constructor is constrained
  }

  return true;
}

/**
 * Returns current active theme attributes from the DOM root.
 */
export function getActiveThemeAttributes(): ThemeSyncAttributes {
  if (typeof document === 'undefined') {
    return {
      dataTheme: 'light',
      dataMode: 'light',
      dataContrast: 'normal',
      dataEnvironment: 'public',
      classList: ['light'],
    };
  }
  const root = document.documentElement;
  return {
    dataTheme: (root.getAttribute('data-theme') as ThemeMode) || 'light',
    dataMode: (root.getAttribute('data-mode') as 'light' | 'dark') || 'light',
    dataContrast: (root.getAttribute('data-contrast') as ContrastMode) || 'normal',
    dataEnvironment: (root.getAttribute('data-environment') as 'public' | 'private') || 'private',
    classList: Array.from(root.classList),
  };
}

/**
 * Monitors changes in the 'data-theme' (and related) attribute on the document root
 * using MutationObserver and invokes callback when an attribute change is detected.
 * Also automatically propagates changes down to nested dashboard components.
 */
export function observeDocumentTheme(
  callback: (attributes: ThemeSyncAttributes) => void
): () => void {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {};
  }

  const root = document.documentElement;
  let lastTheme = root.getAttribute('data-theme');
  let lastMode = root.getAttribute('data-mode');
  let lastContrast = root.getAttribute('data-contrast');

  const observer = new MutationObserver((mutations) => {
    let hasRelevantMutation = false;
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName &&
        [
          'data-theme',
          'data-mode',
          'data-contrast',
          'data-environment',
          'data-theme-setting',
          'class',
        ].includes(mutation.attributeName)
      ) {
        hasRelevantMutation = true;
        break;
      }
    }

    if (hasRelevantMutation) {
      const currentAttributes = getActiveThemeAttributes();
      const themeChanged =
        currentAttributes.dataTheme !== lastTheme ||
        currentAttributes.dataMode !== lastMode ||
        currentAttributes.dataContrast !== lastContrast;

      if (themeChanged) {
        lastTheme = currentAttributes.dataTheme;
        lastMode = currentAttributes.dataMode;
        lastContrast = currentAttributes.dataContrast;

        // Propagate to all nested dashboard nodes
        propagateThemeToDashboardNodes(
          currentAttributes.dataTheme,
          currentAttributes.dataMode,
          currentAttributes.dataContrast
        );

        callback(currentAttributes);
      }
    }
  });

  observer.observe(root, {
    attributes: true,
    attributeFilter: [
      'data-theme',
      'data-mode',
      'data-contrast',
      'data-environment',
      'data-theme-setting',
      'class',
    ],
  });

  return () => {
    observer.disconnect();
  };
}
