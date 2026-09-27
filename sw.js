/* Display Viewer service worker. GENERATED at build time from src/sw-template.js.
 * Job: keep a copy of every app file so the app opens with no network
 * (Airplane Mode). It never talks to any other server. */
const BUILD_ID = '0.4.1-e1d6b76-20260927T0307';
const PRECACHE = [
  "./",
  "./assets/detector.worker-BTVk_Xvk.js",
  "./assets/index-DSYLc-DF.js",
  "./assets/index-yRKVSwV-.css",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./index.html",
  "./legacy-nomodule.js",
  "./manifest.webmanifest"
];
const CACHE = 'sdv-' + BUILD_ID;
/** Marker (v0.4.0+): the running app has "Check for update", so a new version may WAIT for Ben's tap. */
const META = 'sdv-meta';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => caches.has(META))
      .then((updateAware) => {
        // First install, or coming from a version without the update button (≤ v0.3.0): take over
        // right away (that app reloads itself). Otherwise wait until the app says SKIP_WAITING
        // (Ben tapped "Update available" / Check for update) or the app is fully closed.
        if (!updateAware || !self.registration.active) return self.skipWaiting();
      }),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      // Old app versions' files only. Never IndexedDB (Gallery) or localStorage (settings).
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('sdv-') && k !== CACHE && k !== META).map((k) => caches.delete(k))))
      .then(() => caches.open(META))
      .then((c) => c.put(new Request('./update-aware'), new Response(BUILD_ID)))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // The update check must always ask the server (and fail honestly when offline).
  if (new URL(req.url).pathname.endsWith('/version.json')) return;
  // Only THIS version's cache (never a file left over from an older version).
  const mine = caches.open(CACHE);
  if (req.mode === 'navigate') {
    // Single-page app: every page load gets the cached index.html.
    event.respondWith(
      mine.then((c) => c.match(new URL('./index.html', self.registration.scope).href)).then((hit) => hit || fetch(req)),
    );
    return;
  }
  event.respondWith(mine.then((c) => c.match(req, { ignoreSearch: true })).then((hit) => hit || fetch(req)));
});
