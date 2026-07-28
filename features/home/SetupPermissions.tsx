"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n-context";

export default function SetupPermissions() {
  const t = useT();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Trigger the location prompt as soon as the home loads.
    try {
      navigator.geolocation?.getCurrentPosition(
        () => {},
        () => {},
        { timeout: 8000 },
      );
    } catch {}
    try {
      if (
        localStorage.getItem("wird_setup_done") === "1" ||
        (typeof Notification !== "undefined" && Notification.permission === "granted")
      ) {
        setHidden(true);
      }
    } catch {}
  }, []);

  async function enableAll() {
    try {
      if (typeof Notification !== "undefined") await Notification.requestPermission();
    } catch {}
    try {
      const D = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof D?.requestPermission === "function") await D.requestPermission();
    } catch {}
    try {
      navigator.geolocation?.getCurrentPosition(() => {}, () => {});
    } catch {}
    localStorage.setItem("wird_setup_done", "1");
    setHidden(true);
  }

  function later() {
    localStorage.setItem("wird_setup_done", "1");
    setHidden(true);
  }

  if (hidden) return null;
  return (
    <div className="wird-card mb-6 p-4 text-center" style={{ borderColor: "var(--wird-gold)" }}>
      <p className="mb-3 text-sm font-semibold">🔔 {t("setup.msg")}</p>
      <div className="flex justify-center gap-2">
        <button type="button" onClick={enableAll} className="wird-btn-gold">
          {t("setup.allow")}
        </button>
        <button type="button" onClick={later} className="wird-btn-outline">
          {t("setup.later")}
        </button>
      </div>
    </div>
  );
}
