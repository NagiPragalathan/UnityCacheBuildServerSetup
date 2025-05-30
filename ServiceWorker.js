const cacheName = "BattleAway-BattleAway-1.0";
const contentToCache = [
    "./",
    "./index.html",
    "./Build/Web.loader.js",
    "./Build/Web.framework.js",
    "./Build/Web.data",
    "./Build/Web.wasm",
    "./TemplateData/style.css",
    "./manifest.webmanifest"
];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
        try {
            const cache = await caches.open(cacheName);
            console.log('[Service Worker] Caching all: app shell and content');
            // Cache files one by one to handle failures better
            for (let file of contentToCache) {
                try {
                    await cache.add(file);
                } catch (err) {
                    console.error(`Failed to cache ${file}:`, err);
                }
            }
        } catch (error) {
            console.error('[Service Worker] Cache addAll failed:', error);
        }
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
        try {
            const r = await caches.match(e.request);
            if (r) return r;
            
            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            
            // Only cache successful responses
            if (response.status === 200) {
                console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
                cache.put(e.request, response.clone());
            }
            
            return response;
        } catch (error) {
            console.error('[Service Worker] Fetch failed:', error);
            throw error;
        }
    })());
});
