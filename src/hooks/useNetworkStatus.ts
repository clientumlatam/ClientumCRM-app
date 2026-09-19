import { useState, useEffect } from 'react';
import { isLiveFirebaseReady } from '../firebase';

export interface NetworkStatus {
  isOnline: boolean;
  isFirestoreConnected: boolean;
  isOfflineMode: boolean;
  lastChecked: Date;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(isLiveFirebaseReady);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsFirestoreConnected(isLiveFirebaseReady);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsFirestoreConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOfflineMode = !isOnline || !isFirestoreConnected;

  return {
    isOnline,
    isFirestoreConnected,
    isOfflineMode,
    lastChecked: new Date(),
  };
}
