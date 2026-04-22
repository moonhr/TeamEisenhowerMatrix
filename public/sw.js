// Minimal service worker to satisfy root-scope registrations in development.
// We intentionally avoid caching or fetch interception here.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
