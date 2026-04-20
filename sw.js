/**

- Last War Enzy – Service Worker
- Ermöglicht Offline-Nutzung durch Caching aller App-Dateien.
- 
- Strategie: Cache-First (Offline-Priorität)
- – Beim ersten Start werden alle Dateien gecacht.
- – Folgende Aufrufe werden aus dem Cache bedient.
- – Bei neuer Cache-Version (CACHE_NAME ändern!) wird der alte Cache gelöscht.
  */

const CACHE_NAME = ‘lwe-cache-v1’;

/** Alle Dateien, die beim Install gecacht werden sollen */
const PRECACHE_FILES = [
‘./’,
‘./index.html’,
‘./manifest.json’,
‘./apple-touch-icon.png’,
‘./content-home.html’,
‘./content-basics.html’,
‘./content-heroes.html’,
‘./content-build.html’,
‘./content-tech.html’,
‘./content-alliance.html’,
‘./content-drone.html’,
‘./content-events.html’,
‘./content-calc.html’,
‘./content-s1.html’,
‘./content-s2.html’,
// Neue Seasons hier ergänzen:
// ‘./content-s3.html’,
// ‘./content-s4.html’,
// ‘./content-s5.html’,
// ‘./content-s6.html’,
];

/* ——————————————————————
INSTALL – Alle Dateien in den Cache laden
—————————————————————— */
self.addEventListener(‘install’, (event) => {
event.waitUntil(
caches.open(CACHE_NAME)
.then((cache) => {
console.log(’[SW] Pre-caching app files…’);
return cache.addAll(PRECACHE_FILES);
})
.then(() => {
// Sofort aktivieren, ohne auf Tab-Schließen zu warten
return self.skipWaiting();
})
);
});

/* ——————————————————————
ACTIVATE – Alten Cache löschen wenn CACHE_NAME geändert wurde
—————————————————————— */
self.addEventListener(‘activate’, (event) => {
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames
.filter((name) => name !== CACHE_NAME)
.map((name) => {
console.log(’[SW] Deleting old cache:’, name);
return caches.delete(name);
})
);
}).then(() => self.clients.claim())
);
});

/* ——————————————————————
FETCH – Cache-First Strategie

1. Cache prüfen → sofort antworten
1. Nicht im Cache → Netzwerk → in Cache speichern
1. Netzwerk-Fehler → Offline-Fallback
   —————————————————————— */
   self.addEventListener(‘fetch’, (event) => {
   // Nur GET-Anfragen cachen
   if (event.request.method !== ‘GET’) return;

```
// Nur same-origin Anfragen cachen (keine externen CDNs etc.)
const url = new URL(event.request.url);
if (url.origin !== self.location.origin) return;

event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
            // Aus Cache bedienen (Offline-fähig)
            return cachedResponse;
        }

        // Nicht im Cache → Netz
        return fetch(event.request)
            .then((networkResponse) => {
                // Erfolgreiche Antwort auch cachen
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Offline und nicht im Cache – Fallback auf index.html
                return caches.match('./index.html');
            });
    })
);
```

});