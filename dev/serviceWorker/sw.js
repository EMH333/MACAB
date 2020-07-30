let CACHE_NAME = 'abday-ethohampton-cache-v1.8.0';
let cacheWhitelist = [CACHE_NAME]; //NOTE If we change files, change cache name so we update them
let urlsToCache = [
    '/',
    '/index.html',
    '/index.html?utm_source=direct&utm_medium=homescreen&utm_campaign=homescreen',//TODO ignore query params for cache
    '/about.html',
    '/schedule.html',
    '/finals.html',
    '/seniors.html',
    '/climate.html',
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
                console.log('Opened cache');
                const request = new Request('https://www.google-analytics.com/analytics.js', {
                    mode: 'no-cors'
                });//Add google analytics to cache
                fetch(request).then(response => cache.put(request, response));
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    let url = new URL(event.request.url);

    //handle google analytics requests
    if ((url.hostname === 'www.google-analytics.com' ||
            url.hostname === 'ssl.google-analytics.com') &&
        url.pathname === '/collect') {
        event.respondWith(fetch(event.request));
    } else {//handle all other requests
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
