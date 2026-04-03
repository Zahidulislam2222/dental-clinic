const CACHE_NAME = 'eds-dental-v2';
const PRECACHE_URLS = [
  '/',
  '/index.html',
];

// SEC-SW-001: Routes that must NEVER be cached (contain PHI or auth data)
const SENSITIVE_PATTERNS = [
  /\/dashboard/,
  /\/admin/,
  /\/patient/,
  /\/login/,
  /\/signup/,
  /\/reset-password/,
  /\/api\//,
  /\/fhir\//,
  /supabase/,
  /\.supabase\.co/,
  /stripe/,
];

function isSensitive(url) {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(url));
}

// Install — cache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache (skip sensitive routes)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Never cache sensitive routes
  if (isSensitive(event.request.url)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
