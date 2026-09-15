// Retirement worker: remove only this application's old caches and unregister.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('eds-dental-')) await caches.delete(key);
    }
    await self.registration.unregister();
    await self.clients.claim();
  })());
});
