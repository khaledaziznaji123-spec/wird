"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n-context";

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
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [state, setState] = useState<"loading" | "denied" | "error" | "ok">("loading");
  const [needMotion, setNeedMotion] = useState(false);
  const headingRef = useRef<number | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return setState("error");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
        setState("ok");
        const D = window.DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        };
        if (typeof D?.requestPermission === "function") setNeedMotion(true);
        else startCompass();
      },
      () => setState("denied"),
      { timeout: 10000 },
    );
    return stopCompass;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onOrient(e: DeviceOrientationEvent) {
    const webkit = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
    let h: number | null = null;
    if (typeof webkit === "number") h = webkit;
    else if (e.alpha != null) h = (360 - e.alpha) % 360;
    if (h != null) {
      headingRef.current = h;
      setHeading(h);
    }
  }
  function startCompass() {
    window.addEventListener("deviceorientationabsolute", onOrient as EventListener);
    window.addEventListener("deviceorientation", onOrient as EventListener);
  }
  function stopCompass() {
    window.removeEventListener("deviceorientationabsolute", onOrient as EventListener);
    window.removeEventListener("deviceorientation", onOrient as EventListener);
  }
  async function enableMotion() {
    const D = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    try {
      if (typeof D?.requestPermission === "function") {
        if ((await D.requestPermission()) !== "granted") return;
      }
    } catch {}
    setNeedMotion(false);
    startCompass();
  }

  if (state === "loading") return <p className="wird-muted">📍 {t("prayer.locating")}</p>;
  if (state === "denied") return <p className="wird-muted">📍 {t("prayer.needLocation")}</p>;
  if (state === "error" || !coords) return <p className="wird-muted">{t("prayer.error")}</p>;

  const bearing = bearingToKaaba(coords.lat, coords.lng);
  const live = heading != null;
  // Live: Kaaba moves as you turn. Static (no sensor): points from North (screen-up).
  const kaabaAngle = live ? (bearing - heading! + 360) % 360 : bearing;
  const aligned = live && (kaabaAngle < 8 || kaabaAngle > 352);
  const mapsDir = `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${KAABA_LAT},${KAABA_LNG}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex h-64 w-64 items-center justify-center rounded-full"
        style={{ border: "4px solid var(--wird-border)", background: aligned ? "#f1f8f3" : "var(--wird-card)" }}
      >
        {/* top marker: the phone's facing (live) or North (static) */}
        <div className="absolute top-1 flex flex-col items-center">
          <span style={{ color: "var(--wird-gold)" }} className="text-2xl leading-none">▲</span>
          <span className="text-[10px] font-bold wird-muted">{live ? t("qibla.you") : "N"}</span>
        </div>

        {/* rotating Kaaba marker */}
        <div className="absolute inset-0 transition-transform duration-150" style={{ transform: `rotate(${kaabaAngle}deg)` }}>
          <div className="absolute left-1/2 top-3 -translate-x-1/2 text-4xl">🕋</div>
        </div>

        <span className="max-w-[70%] text-center text-sm font-bold" style={{ color: aligned ? "var(--wird-green)" : undefined }}>
          {live ? (aligned ? `✅ ${t("qibla.aligned")}` : t("qibla.turn")) : `🕋 ${Math.round(bearing)}°`}
        </span>
      </div>

      {live ? (
        <p className="text-xs wird-muted">🧭 {Math.round(heading!)}° · 🕋 {Math.round(bearing)}° {t("qibla.fromNorth")}</p>
      ) : (
        <>
          <button type="button" onClick={enableMotion} className="wird-btn">
            🧭 {t("qibla.enable")}
          </button>
          <p className="max-w-xs text-center text-xs wird-muted">⚠️ {t("qibla.noCompass")}</p>
        </>
      )}

      <a href={mapsDir} target="_blank" rel="noopener noreferrer" className="text-xs underline wird-muted">
        {t("qibla.maps")}
      </a>
    </div>
  );
}
