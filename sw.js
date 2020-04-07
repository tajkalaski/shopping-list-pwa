// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
//importScripts('serviceworker-cache-polyfill.js');

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function(event) {
    // We pass a promise to event.waitUntil to signal how 
    // long install takes, and if it failed
    event.waitUntil(
        // We open a cache…
        caches.open('simple-sw-v1').then(function(cache) {
            // And add resources to it
            return cache.addAll([
                //TODO: add the files that needs to be cached
                '/',
                '/index.html',
                '/logging.js',
                '/package.json',
                '/script.js',
                '/serviceworker-cache-polyfill.js',
                '/style.css',
                '/reset/index.html',
                '/reset/sw.js',
                '/sw.js',
                '/favicon.ico',
                '/add-icon.svg',
                '/db.js'
            ]);
        })
    );
});

//TODO: create the EventListener for 'fetch'.
//it should check if the url exists in the cache, if so get the response from the cache, otherwise get it
self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                console.log('Found ', event.request.url, ' in cache');
                return response;
            }
            console.log('Network request for ', event.request.url);
            return fetch(event.request)

            // TODO 4 - Add fetched files to the cache

        }).catch(error => {

            // TODO 6 - Respond with custom offline page

        })
    );
});