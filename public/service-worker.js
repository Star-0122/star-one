// STAR ONE Service Worker
// GitHub Pages のサブパス（例: /star-one/）配下でも正しく動くよう、
// このファイル自身の場所からスコープを導出する（絶対パスを固定しない）。
const SCOPE = self.registration.scope; // 例: https://user.github.io/star-one/
const CACHE_NAME = 'star-one-cache-v1';

const CORE_ASSETS = [
  SCOPE,
  SCOPE + 'manifest.webmanifest',
  SCOPE + 'favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for navigation (so users get fresh content when online),
// falling back to the cached shell when offline.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(SCOPE).then((r) => r || caches.match(request)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached)
    )
  );
});
