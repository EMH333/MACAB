let CACHE_NAME = 'abday-ethohampton-cache-v2.1.0';
let cacheWhitelist = [CACHE_NAME]; //NOTE If we change files, change cache name so we update them
let urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/schedule.html',
    //'/finals.html',
    //'/seniors.html',
    //'/climate.html',
    //'/hoco.html',
    '/css/style.css',
    '/js/main.js',
    '/images/icon-192.png',
    '/images/uploadIcon.png',
];


self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    // always get fresh javascript and use cache for everything else
    if (event.request.url.indexOf('main.js') > -1) {
        event.respondWith(
            fetch(event.request).catch(function () {
                return caches.match(event.request);
            }),
        );
    } else {
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
    }
});

self.addEventListener('activate', function (event) {
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
