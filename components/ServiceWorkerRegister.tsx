"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker (/sw.js) so Wird is installable and can
 * later receive push notifications (Epic 8). Runs once on the client.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registration failures are non-fatal */
      });
    }
  }, []);
  return null;
}
