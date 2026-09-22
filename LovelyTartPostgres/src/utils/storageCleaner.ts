/**
 * Helper utility to periodically check and clear outdated IndexedDB or localStorage entries
 * used by ClientumCRM, preventing storage bloat for users with long-running sessions.
 */

export interface CleanupReport {
  timestamp: string;
  localStorageKeysInspected: number;
  localStorageKeysRemoved: string[];
  bytesFreed: number;
  indexedDbStatus: string;
}

const CRM_STORAGE_PREFIXES = [
  'clientum_',
  'clientum_crm_',
  'clientum_cache_',
  'clientum_temp_',
];

// Keys that should NEVER be automatically cleared (essential state)
const CRITICAL_STORAGE_KEYS = [
  'clientum_auth_user',
  'clientum_is_authenticated',
  'clientum_crm_opportunities',
  'clientum_crm_companies',
  'clientum_crm_people',
  'clientum_crm_tasks',
  'clientum_crm_activities',
  'clientum_crm_current_user',
  'theme',
  'clientum_theme',
  'clientum_crm_language',
];

/**
 * Clears outdated or oversized localStorage entries older than maxAgeMs (default: 7 days).
 */
export function cleanOutdatedLocalStorage(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): CleanupReport {
  const report: CleanupReport = {
    timestamp: new Date().toISOString(),
    localStorageKeysInspected: 0,
    localStorageKeysRemoved: [],
    bytesFreed: 0,
    indexedDbStatus: 'pending',
  };

  if (typeof window === 'undefined' || !window.localStorage) {
    report.indexedDbStatus = 'localStorage unavailable';
    return report;
  }

  const now = Date.now();
  const keysToRemove: string[] = [];

  try {
    const totalKeys = localStorage.length;
    report.localStorageKeysInspected = totalKeys;

    for (let i = 0; i < totalKeys; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Skip critical persistent keys
      if (CRITICAL_STORAGE_KEYS.includes(key)) continue;

      // Inspect keys belonging to clientum
      const isCrmKey = CRM_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix));

      if (isCrmKey) {
        // Check if key is a temporary reset log, temp draft, or old audit log chunk
        if (key.startsWith('clientum_temp_') || key.startsWith('clientum_cache_')) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const item = JSON.parse(raw);
              if (item && item.timestamp && now - new Date(item.timestamp).getTime() > maxAgeMs) {
                keysToRemove.push(key);
                report.bytesFreed += raw.length * 2;
              }
            }
          } catch {
            // Malformed entry - mark for cleanup if old
            keysToRemove.push(key);
          }
        } else if (key === 'clientum_pending_resets') {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const resets = JSON.parse(raw);
              let changed = false;
              for (const email of Object.keys(resets)) {
                if (resets[email] && resets[email].expiresAt && now > resets[email].expiresAt) {
                  delete resets[email];
                  changed = true;
                }
              }
              if (changed) {
                localStorage.setItem(key, JSON.stringify(resets));
              }
            }
          } catch (e) {
            console.warn('Failed to clean pending resets:', e);
          }
        }
      }
    }

    // Execute key removals
    for (const k of keysToRemove) {
      localStorage.removeItem(k);
      report.localStorageKeysRemoved.push(k);
    }
  } catch (err) {
    console.error('Error during localStorage cleanup:', err);
  }

  return report;
}

/**
 * Checks and cleans outdated IndexedDB database entries if available.
 */
export async function cleanOutdatedIndexedDB(): Promise<string> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return 'IndexedDB not supported in environment';
  }

  try {
    if ('databases' in indexedDB) {
      const dbs = await indexedDB.databases();
      let cleanedCount = 0;

      for (const dbInfo of dbs) {
        if (dbInfo.name && (dbInfo.name.startsWith('clientum_temp') || dbInfo.name.startsWith('clientum_cache'))) {
          indexedDB.deleteDatabase(dbInfo.name);
          cleanedCount++;
        }
      }
      return `IndexedDB inspected (${dbs.length} databases found, ${cleanedCount} temporary databases purged)`;
    }
    return 'IndexedDB inspected (databases() API not available)';
  } catch (e) {
    return `IndexedDB inspection error: ${(e as Error).message}`;
  }
}

/**
 * Periodically initializes storage cleanup interval (runs every 15 minutes by default).
 */
export function initPeriodicStorageCleaner(intervalMs: number = 15 * 60 * 1000): () => void {
  // Initial run on mount
  const runCleanup = async () => {
    const report = cleanOutdatedLocalStorage();
    const idbMsg = await cleanOutdatedIndexedDB();
    report.indexedDbStatus = idbMsg;

    if (report.localStorageKeysRemoved.length > 0) {
      console.log('🧹 [Clientum StorageCleaner] Purged stale entries:', report);
    }
  };

  runCleanup();

  const timerId = setInterval(runCleanup, intervalMs);

  return () => {
    clearInterval(timerId);
  };
}
