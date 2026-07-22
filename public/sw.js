// Wird service worker — minimal for now (makes the app installable).
// Push-notification handlers are added in Epic 8 (reminders).

const CACHE = "wird-shell-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// A fetch handler is required for installability. Network-first passthrough:
// we don't cache aggressively yet (offline support is a later enhancement).
self.addEventListener("fetch", () => {
  // Intentionally no respondWith — requests go to the network as normal.
});
