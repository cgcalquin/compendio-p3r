// Service worker: guarda la app en el teléfono para que funcione sin conexión.
const CACHE = 'compendio-p3r-9b87e787bd';
const FILES = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "fonts/barlow-condensed-latin-500-normal.woff2",
 "fonts/barlow-condensed-latin-600-normal.woff2",
 "fonts/barlow-condensed-latin-700-italic.woff2",
 "fonts/barlow-condensed-latin-700-normal.woff2",
 "fonts/barlow-condensed-latin-800-italic.woff2",
 "fonts/barlow-latin-400-normal.woff2",
 "fonts/barlow-latin-500-normal.woff2",
 "fonts/barlow-latin-600-normal.woff2",
 "icons/apple-touch-icon.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/maskable-192.png",
 "icons/maskable-512.png"
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Página: primero la red (para recibir actualizaciones), si no hay conexión, la copia guardada.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('./', c)); return r; })
      .catch(() => caches.match('./').then(r => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
