"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n-context";

// Kaaba coordinates
const KAABA_LAT = 21.4224779;
const KAABA_LNG = 39.8251832;

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

function bearingToKaaba(lat: number, lng: number) {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δλ = toRad(KAABA_LNG - lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export default function QiblaCompass() {
  const t = useT();
  const [qibla, setQibla] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [state, setState] = useState<"loading" | "denied" | "error" | "ok">("loading");
  const [needMotion, setNeedMotion] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) return setState("error");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setQibla(bearingToKaaba(pos.coords.latitude, pos.coords.longitude));
        setState("ok");
        // iOS requires a user gesture to grant motion; show the button there.
        const D = window.DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        };
        if (typeof D?.requestPermission === "function") setNeedMotion(true);
        else startCompass();
      },
      () => setState("denied"),
      { timeout: 10000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onOrient(e: DeviceOrientationEvent) {
    const webkit = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
    if (typeof webkit === "number") setHeading(webkit);
    else if (e.absolute && e.alpha != null) setHeading((360 - e.alpha) % 360);
    else if (e.alpha != null) setHeading((360 - e.alpha) % 360);
  }

  function startCompass() {
    window.addEventListener("deviceorientationabsolute", onOrient as EventListener);
    window.addEventListener("deviceorientation", onOrient as EventListener);
  }

  async function enableMotion() {
    const D = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    try {
      const res = await D.requestPermission?.();
      if (res === "granted") {
        setNeedMotion(false);
        startCompass();
      }
    } catch {}
  }

  useEffect(
    () => () => {
      window.removeEventListener("deviceorientationabsolute", onOrient as EventListener);
      window.removeEventListener("deviceorientation", onOrient as EventListener);
    },
    [],
  );

  // arrow points to qibla relative to where the phone faces
  const arrow = qibla != null && heading != null ? (qibla - heading + 360) % 360 : qibla ?? 0;
  const aligned = qibla != null && heading != null && Math.abs(((arrow + 180) % 360) - 180) < 8;

  return (
    <div className="flex flex-col items-center gap-4">
      {state === "loading" ? (
        <p className="wird-muted">📍 {t("prayer.locating")}</p>
      ) : state === "denied" ? (
        <p className="wird-muted">📍 {t("prayer.needLocation")}</p>
      ) : state === "error" ? (
        <p className="wird-muted">{t("prayer.error")}</p>
      ) : (
        <>
          <div
            className="relative flex h-64 w-64 items-center justify-center rounded-full"
            style={{
              border: "4px solid var(--wird-border)",
              background: aligned ? "#f1f8f3" : "var(--wird-card)",
            }}
          >
            <span className="absolute top-2 text-xs font-bold wird-muted">N</span>
            <div
              className="transition-transform duration-150"
              style={{ transform: `rotate(${arrow}deg)` }}
            >
              <div className="text-6xl">🕋</div>
              <div className="mx-auto -mt-1 text-3xl" style={{ color: "var(--wird-gold)" }}>
                ↑
              </div>
            </div>
          </div>

          {heading == null ? (
            needMotion ? (
              <button type="button" onClick={enableMotion} className="wird-btn">
                🧭 {t("qibla.enable")}
              </button>
            ) : (
              <p className="text-sm wird-muted">🧭 {t("qibla.rotate")}</p>
            )
          ) : (
            <p className="text-sm font-semibold" style={{ color: aligned ? "var(--wird-green)" : undefined }}>
              {aligned ? `✅ ${t("qibla.aligned")}` : `🕋 ${Math.round(arrow)}°`}
            </p>
          )}
          <p className="text-xs wird-muted">{t("qibla.hint")}</p>
        </>
      )}
    </div>
  );
}
