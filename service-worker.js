const CACHE_NAME = 'v1:cache';

let toCache = [
  './',
  './index.html',
  './bundle.js',
  './style/style.css',
  'https://fonts.googleapis.com/css?family=Roboto:300,400'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(toCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
