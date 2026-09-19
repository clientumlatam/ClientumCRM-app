import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeAnalytics } from './lib/analytics';

initializeAnalytics();

// Verificación de nuevo deploy para invalidar caché y forzar re-lectura del bundle
const currentBuildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
try {
  const previousBuildTime = localStorage.getItem('clientum_last_deploy_time');
  if (previousBuildTime && previousBuildTime !== currentBuildTime) {
    console.log(`[Deploy Update] Nuevo deploy detectado (${currentBuildTime} vs ${previousBuildTime}). Limpiando cachés...`);
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
  }
  localStorage.setItem('clientum_last_deploy_time', currentBuildTime);
} catch (e) {
  console.warn('Deploy storage check error:', e);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `/sw.js?v=${encodeURIComponent(currentBuildTime)}`;
    navigator.serviceWorker.register(swUrl).then((registration) => {
      console.log('ServiceWorker registrado exitosamente con scope:', registration.scope);
      
      // Comprobar actualización en cada carga
      registration.update();

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[Deploy Update] Nuevo SW detectado. Aplicando actualización inmediata...');
                installingWorker.postMessage({ type: 'SKIP_WAITING' });
                installingWorker.postMessage({ type: 'CLEAR_CACHE' });
              }
            }
          };
        }
      };
    }).catch((err) => {
      console.log('ServiceWorker registration failed: ', err);
    });

    // Re-comprobar SW al recuperar el foco de la ventana tras un deploy
    window.addEventListener('focus', () => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.update();
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('[Deploy Update] Recargando aplicación para cargar nuevo código...');
        window.location.reload();
      }
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
