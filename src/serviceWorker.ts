const CACHE_NAME = 'hipster-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Hier kannst du weitere statische Dateien hinzufügen, die zwischengespeichert werden sollen.
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
