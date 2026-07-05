/* ============================================================
   sw.js - Service Worker for JLPT N5 Reading App
   Enables offline support and caching for GitHub Pages
   ============================================================ */

const CACHE_NAME = 'jlpt-n5-reader-v2.0.0';
const OFFLINE_URL = '/japanese-N5-reader/offline.html';

// Files to cache for offline use
const PRECACHE_URLS = [
  '/japanese-N5-reader/',
  '/japanese-N5-reader/index.html',
  '/japanese-N5-reader/offline.html',
  '/japanese-N5-reader/404.html',
  '/japanese-N5-reader/style.css',
  '/japanese-N5-reader/app.js',
  '/japanese-N5-reader/data.js',
  '/japanese-N5-reader/grammar-patterns.js',
  '/japanese-N5-reader/analytics.js',
  '/japanese-N5-reader/grammar-game.js',
  '/japanese-N5-reader/furigana.js',
  '/japanese-N5-reader/favicon.ico',
  '/japanese-N5-reader/icon-48x48.png',
  '/japanese-N5-reader/icon-72x72.png',
  '/japanese-N5-reader/icon-96x96.png',
  '/japanese-N5-reader/icon-192x192.png',
  '/japanese-N5-reader/icon-512x512.png',
  '/japanese-N5-reader/manifest.json'
];

// ============================================================
// INSTALLATION
// ============================================================

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Pre-cache failed:', error);
      })
  );
});

// ============================================================
// ACTIVATION
// ============================================================

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// ============================================================
// FETCH STRATEGY
// ============================================================

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip browser extensions
  if (url.pathname.startsWith('/_') || url.pathname.includes('chrome-extension')) {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.match(request)
          .then((cachedResponse) => {
            const fetchPromise = fetch(request)
              .then((networkResponse) => {
                cache.put(request, networkResponse.clone());
                return networkResponse;
              })
              .catch((error) => {
                console.warn('[ServiceWorker] Fetch failed:', error);
                if (cachedResponse) {
                  return cachedResponse;
                }
                if (request.mode === 'navigate') {
                  return cache.match(OFFLINE_URL);
                }
                return new Response('Network error', {
                  status: 503,
                  statusText: 'Service Unavailable'
                });
              });
            
            return cachedResponse || fetchPromise;
          });
      })
  );
});

// ============================================================
// MESSAGE HANDLING
// ============================================================

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => {
        console.log('[ServiceWorker] Cache cleared');
        event.ports[0].postMessage({ success: true });
      })
      .catch((error) => {
        console.error('[ServiceWorker] Cache clear failed:', error);
        event.ports[0].postMessage({ success: false, error: error });
      });
  }
});

// ============================================================
// PUSH NOTIFICATIONS (Optional)
// ============================================================

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Time to practice Japanese! 📚',
    icon: '/japanese-N5-reader/icon-192x192.png',
    badge: '/japanese-N5-reader/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/japanese-N5-reader/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || '🎌 JLPT N5 Reading',
      options
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const url = event.notification.data.url || '/japanese-N5-reader/';
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});