const CACHE_NAME = 'clientum-crm-v6.2-pwa-brochure';

const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/og-image.png',
  '/og-image.svg',
  '/brochure',
  '/brochure.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('[SW] Pre-caching static assets and offline brochure...');
        
        // Cache the fundamental web assets
        for (const url of urlsToCache) {
          try {
            const response = await fetch(url, { cache: 'no-cache' });
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (err) {
            console.warn('[SW] Could not pre-cache:', url, err);
          }
        }

        // Synthesize fallback offline brochure PDF response in case network is dark
        try {
          const offlineBrochureHtml = `
            <!doctype html>
            <html lang="es">
              <head><meta charset="utf-8"><title>Clientum CRM | Brochure Offline</title></head>
              <body style="font-family: sans-serif; padding: 40px; background: #090F1E; color: #fff;">
                <h1 style="color: #38bdf8;">Clientum CRM — Dossier Comercial PyME (Modo Offline)</h1>
                <p>Estás visualizando la copia local en caché de Clientum CRM v6.2.</p>
                <p>Incluye: CRM 360° Kanban, WhatsApp Multiagente IA, Facturación Electrónica AFIP CAE, 14 Agentes IA Autónomos.</p>
                <p>Contacto comercial: info@clientum.com.ar | WhatsApp: +54 9 298 451-0883</p>
              </body>
            </html>
          `;
          const offlineResponse = new Response(offlineBrochureHtml, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
          await cache.put('/brochure-offline', offlineResponse);
        } catch (e) {
          // Ignored
        }
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((keys) => {
      keys.forEach((k) => caches.delete(k));
    });
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  
  // Ignore external origins or backend API calls
  if (requestUrl.origin !== self.location.origin) return;
  if (requestUrl.pathname.startsWith('/api/')) return;

  // Dedicated Offline-First handler for Brochure PDF and Brochure route
  if (requestUrl.pathname === '/brochure.pdf' || requestUrl.pathname === '/brochure') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cache and revalidate in background
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const copy = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return networkResponse;
          })
          .catch(async () => {
            const fallback = await caches.match('/brochure-offline') || await caches.match('/index.html');
            return fallback || new Response('Brochure temporalmente fuera de línea.', {
              status: 200,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
          });
      })
    );
    return;
  }

  // Network-First for HTML, JS, CSS and SPA navigations
  const isCodeAsset = event.request.mode === 'navigate' ||
    event.request.headers.get('accept')?.includes('text/html') ||
    requestUrl.pathname.endsWith('.js') ||
    requestUrl.pathname.endsWith('.css');

  if (isCodeAsset) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/index.html');
            }
            return new Response('Sin conexión a internet y recurso no disponible en caché.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
            });
          });
        })
    );
    return;
  }

  // Stale-While-Revalidate for images, icons, and static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
