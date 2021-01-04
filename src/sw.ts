/* eslint-env serviceworker */
const cacheKey = 'Swipegeons';

// Content to cache like images, fonts, ... neededs to run the app
const appShellFiles = [
  "/",
  "/main.js",
  "/styles/index.css",
];

// Content to update at each connection

const onlineContent = [];


self.addEventListener("install", (e) => {
  console.log("[Service Worker] Installing");
  e.waitUntil(caches.open(cacheKey).then((cache) => {
    console.log("[Service Worker] Caching all: app shell and content");
    return cache.addAll(appShellFiles.concat(onlineContent));
  }))
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request).then((res) => {
    return caches.open(cacheKey).then((cache) => {
      cache.put(e.request, res.clone());
      return res;
    });
  })));
});
