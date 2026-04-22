const CacheName = 'kremen-transport-v1';
const AppShell = ['/', '/app.js', '/app.css'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CacheName).then(cache => cache.addAll(AppShell)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(k => k !== CacheName).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request)),
  );
});
