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
    if (typeof webkit === "number") setHeading(webkit);
    else if (e.alpha != null) setHeading((360 - e.alpha) % 360);
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
  // where the Kaaba sits on the dial relative to the phone's top
  const kaabaAngle = heading != null ? (bearing - heading + 360) % 360 : bearing;
  const aligned = heading != null && (kaabaAngle < 8 || kaabaAngle > 352);
  const mapsDir = `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${KAABA_LAT},${KAABA_LNG}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex h-64 w-64 items-center justify-center rounded-full"
        style={{ border: "4px solid var(--wird-border)", background: aligned ? "#f1f8f3" : "var(--wird-card)" }}
      >
        {/* fixed pointer = the way your phone is facing */}
        <div className="absolute top-1 flex flex-col items-center">
          <span style={{ color: "var(--wird-gold)" }} className="text-2xl leading-none">
            ▲
          </span>
          <span className="text-[10px] font-bold wird-muted">{t("qibla.you")}</span>
        </div>

        {/* rotating Kaaba marker */}
        <div className="absolute inset-0 transition-transform duration-150" style={{ transform: `rotate(${kaabaAngle}deg)` }}>
          <div className="absolute left-1/2 top-3 -translate-x-1/2 text-4xl">🕋</div>
        </div>

        <div className="text-center">
          {heading != null ? (
            aligned ? (
              <span className="font-bold" style={{ color: "var(--wird-green)" }}>
                ✅ {t("qibla.aligned")}
              </span>
            ) : (
              <span className="text-sm wird-muted">{t("qibla.turn")}</span>
            )
          ) : null}
        </div>
      </div>

      {heading == null ? (
        <>
          <button type="button" onClick={enableMotion} className="wird-btn">
            🧭 {t("qibla.enable")}
          </button>
          <p className="text-xs wird-muted">{t("qibla.waiting")}</p>
        </>
      ) : (
        <p className="text-xs wird-muted">
          🧭 {Math.round(heading)}° · 🕋 {Math.round(bearing)}° {t("qibla.fromNorth")}
        </p>
      )}

      <a href={mapsDir} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: "var(--wird-green)" }}>
        📍 {t("qibla.maps")}
      </a>
    </div>
  );
}
