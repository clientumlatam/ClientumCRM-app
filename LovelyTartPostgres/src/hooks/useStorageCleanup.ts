import { useEffect, useState, useCallback } from 'react';
import { cleanOutdatedLocalStorage, cleanOutdatedIndexedDB, CleanupReport } from '../utils/storageCleaner';

export interface UseStorageCleanupOptions {
  autoRunOnMount?: boolean;
  intervalMs?: number; // default: 15 mins
  maxAgeMs?: number; // default: 7 days
}

export function useStorageCleanup(options: UseStorageCleanupOptions = {}) {
  const { autoRunOnMount = true, intervalMs = 15 * 60 * 1000, maxAgeMs = 7 * 24 * 60 * 60 * 1000 } = options;

  const [lastReport, setLastReport] = useState<CleanupReport | null>(null);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);

  const executeCleanup = useCallback(async () => {
    setIsCleaning(true);
    try {
      const report = cleanOutdatedLocalStorage(maxAgeMs);
      const idbStatus = await cleanOutdatedIndexedDB();
      report.indexedDbStatus = idbStatus;

      setLastReport(report);

      if (report.localStorageKeysRemoved.length > 0) {
        console.log('🧹 [useStorageCleanup] Removed stale entries:', report);
      }
    } catch (error) {
      console.error('Error during storage cleanup:', error);
    } finally {
      setIsCleaning(false);
    }
  }, [maxAgeMs]);

  useEffect(() => {
    if (autoRunOnMount) {
      executeCleanup();
    }

    const timer = setInterval(() => {
      executeCleanup();
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [autoRunOnMount, intervalMs, executeCleanup]);

  return {
    executeCleanup,
    lastReport,
    isCleaning,
  };
}
