/* Display Viewer service worker. GENERATED at build time from src/sw-template.js.
 * Job: keep a copy of every app file so the app opens with no network
 * (Airplane Mode). It never talks to any other server. */
const BUILD_ID = '0.2.1-52289da-20260926T2305';
const PRECACHE = [
  "./",
  "./assets/index-BeRWluQG.css",
  "./assets/index-CFTjwXE1.js",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./index.html",
  "./manifest.webmanifest"
];
const CACHE = 'sdv-' + BUILD_ID;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('sdv-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // Single-page app: every page load gets the cached index.html.
    event.respondWith(
      caches.match(new URL('./index.html', self.registration.scope).href).then((hit) => hit || fetch(req)),
    );
    return;
  }
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
