"use client";

import { useEffect, useState } from "react";
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
const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const dirWord = (deg: number) => DIRS[Math.round(deg / 45) % 8];

export default function QiblaCompass() {
  const t = useT();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [state, setState] = useState<"loading" | "denied" | "error" | "ok">("loading");
  const [needMotion, setNeedMotion] = useState(false);

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
    if (h != null) setHeading(h);
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
  // Live (phone): dial turns with you → align 🕋 to the ▲.
  // Static (laptop): North-up dial, needle points to the Qibla from North.
  const needleAngle = live ? (bearing - heading! + 360) % 360 : bearing;
  const aligned = live && (needleAngle < 8 || needleAngle > 352);
  const mapEmbed = `https://maps.google.com/maps?saddr=${coords.lat},${coords.lng}&daddr=${KAABA_LAT},${KAABA_LNG}&output=embed`;
  const mapsDir = `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${KAABA_LAT},${KAABA_LNG}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        dir="ltr"
        className="relative flex h-64 w-64 items-center justify-center rounded-full"
        style={{ border: "4px solid var(--wird-border)", background: aligned ? "#f1f8f3" : "var(--wird-card)" }}
      >
        {/* cardinal labels (North-up) */}
        <span className="absolute left-1/2 top-1 -translate-x-1/2 text-xs font-bold" style={{ color: "var(--wird-green)" }}>
          {live ? "▲" : "N"}
        </span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold wird-muted">S</span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold wird-muted">E</span>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold wird-muted">W</span>

        {/* needle → Qibla */}
        <div className="absolute inset-0 flex items-start justify-center transition-transform duration-150" style={{ transform: `rotate(${needleAngle}deg)` }}>
          <div className="flex flex-col items-center pt-1">
            <span className="text-3xl leading-none">🕋</span>
            <div style={{ width: "3px", height: "84px", background: "var(--wird-gold)", borderRadius: "2px" }} />
          </div>
        </div>

        {/* center label */}
        <span className="z-10 max-w-[64%] rounded bg-white/70 px-1 text-center text-sm font-bold" style={{ color: aligned ? "var(--wird-green)" : "var(--wird-fg)" }}>
          {live ? (aligned ? `✅ ${t("qibla.aligned")}` : t("qibla.turn")) : `${Math.round(bearing)}° ${dirWord(bearing)}`}
        </span>
      </div>

      {live ? (
        <p className="text-xs wird-muted">🧭 {Math.round(heading!)}° · 🕋 {Math.round(bearing)}° {t("qibla.fromNorth")}</p>
      ) : (
        <>
          <p className="max-w-xs text-center text-sm wird-muted">🕋 {t("qibla.northUp")}</p>
          <iframe
            title="Qibla map"
            src={mapEmbed}
            width="100%"
            height="260"
            loading="lazy"
            style={{ border: 0, borderRadius: "12px" }}
          />
          <a href={mapsDir} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: "var(--wird-green)" }}>
            📍 {t("qibla.maps")}
          </a>
          {needMotion ? (
            <button type="button" onClick={enableMotion} className="text-xs underline wird-muted">
              🧭 {t("qibla.enable")}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
