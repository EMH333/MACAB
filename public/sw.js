var CACHE_NAME = 'abday-ethohampton-cache-v1.4';
var urlsToCache = [
  '/',
  '/index.html',
  '/index.html?utm_source=homescreen',
  '/about.html',
  '/schedule.html',
  '/finals.html',
  '/css/style.css',
  '/js/main.js',
  '/images/icon-192.png',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css',
  'https://unpkg.com/umbrellajs@2.10.1/umbrella.min.js',
  //'https://www.google-analytics.com/analytics.js',
];


self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function (cache) {
      console.log('Opened cache');
      const request = new Request('https://www.google-analytics.com/analytics.js', {
        mode: 'no-cors'
      });
      fetch(request).then(response => cache.put(request, response));
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', function (event) {

  var cacheWhitelist = [CACHE_NAME]; //NOTE If we change files, change cache name so we update them

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});





