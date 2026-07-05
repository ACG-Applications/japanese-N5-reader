/* ============================================================
   sw.js - Service Worker for JLPT N5 Reading App
   Enables offline support and caching for GitHub Pages
   ============================================================ */

// ============================================================
// CONSTANTS
// ============================================================

const CACHE_NAME = 'jlpt-n5-reader-v1.0.0';
const OFFLINE_URL = 'offline.html';

// Files to cache for offline use
const PRECACHE_URLS = [
  // Core HTML
  '/',
  '/index.html',
  '/offline.html',
  
  // Styles
  '/style.css',
  
  // JavaScript
  '/app.js',
  '/data.js',
  '/grammar-patterns.js',
  '/analytics.js',
  '/grammar-game.js',
  
  // Icons
  '/favicon.ico',
  '/icon-48x48.png',
  '/icon-72x72.png',
  '/icon-96x96.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  
  // Manifest
  '/manifest.json'
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
// FETCH STRATEGY: Stale-While-Revalidate
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
  
  // Skip browser extensions and analytics
  if (url.pathname.startsWith('/_') || url.pathname.includes('chrome-extension')) {
    return;
  }
  
  // Special handling for data.js (refresh on every request in development)
  // In production, you might want to cache this too
  if (url.pathname.includes('data.js')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }
  
  // Stale-while-revalidate strategy for everything else
  event.respondWith(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.match(request)
          .then((cachedResponse) => {
            const fetchPromise = fetch(request)
              .then((networkResponse) => {
                // Update cache with fresh response
                cache.put(request, networkResponse.clone());
                return networkResponse;
              })
              .catch((error) => {
                console.warn('[ServiceWorker] Fetch failed:', error);
                // If offline and cached response exists, return it
                if (cachedResponse) {
                  return cachedResponse;
                }
                // If offline and no cache, return offline page
                if (request.mode === 'navigate') {
                  return cache.match(OFFLINE_URL);
                }
                // Return a basic error response
                return new Response('Network error', {
                  status: 503,
                  statusText: 'Service Unavailable'
                });
              });
            
            // Return cached response immediately, then update in background
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
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.keys();
      })
      .then((keys) => {
        const size = keys.length;
        event.ports[0].postMessage({ size });
      })
      .catch((error) => {
        event.ports[0].postMessage({ size: 0, error: error });
      });
  }
});

// ============================================================
// BACKGROUND SYNC (Optional)
// ============================================================

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // If you want to sync progress data to a server
  // This is a placeholder for future implementation
  console.log('[ServiceWorker] Syncing progress...');
}

// ============================================================
// PUSH NOTIFICATIONS (Optional)
// ============================================================

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Time to practice Japanese! 📚',
    icon: 'icon-192x192.png',
    badge: 'icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
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
  
  const url = event.notification.data.url || '/';
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

// ============================================================
// VERSION CHECK
// ============================================================

self.addEventListener('fetch', (event) => {
  // Check for update requests
  if (event.request.url.includes('check-version')) {
    event.respondWith(
      new Response(JSON.stringify({
        version: '1.0.0',
        cacheName: CACHE_NAME,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    );
  }
});

// ============================================================
// LOGGING (Development Only)
// ============================================================

if (process.env.NODE_ENV === 'development') {
  console.log('[ServiceWorker] Development mode enabled');
}