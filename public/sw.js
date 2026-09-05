const CacheName = 'kremen-transport-v2';
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

/**
 * The shell must be network-first: `index.html` carries the `?hash` that busts `/app.js`, so serving
 * a cached copy pins every visitor to the build they first opened. The cache stays as the offline
 * fallback. Everything else (icons, manifest, images) is content-stable and stays cache-first.
 */
const isShellRequest = (request, url) =>
  request.mode === 'navigate' || url.pathname === '/app.js' || url.pathname === '/app.css';

const cacheKey = request => (request.mode === 'navigate' ? '/' : request);

const networkFirst = async request => {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CacheName);
      await cache.put(cacheKey(request), response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(cacheKey(request), { ignoreSearch: true });
    if (cached) return cached;
    throw err;
  }
};

const cacheFirst = async request => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CacheName);
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(isShellRequest(event.request, url) ? networkFirst(event.request) : cacheFirst(event.request));
});
