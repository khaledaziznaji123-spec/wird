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
  const [state, setState] = useState<"loading" | "denied" | "error" | "ok">("loading");

  useEffect(() => {
    if (!("geolocation" in navigator)) return setState("error");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
        setState("ok");
      },
      () => setState("denied"),
      { timeout: 10000 },
    );
  }, []);

  if (state === "loading") return <p className="wird-muted">📍 {t("prayer.locating")}</p>;
  if (state === "denied") return <p className="wird-muted">📍 {t("prayer.needLocation")}</p>;
  if (state === "error" || !coords) return <p className="wird-muted">{t("prayer.error")}</p>;

  const brg = Math.round(bearingToKaaba(coords.lat, coords.lng));
  const mapsDir = `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${KAABA_LAT},${KAABA_LNG}`;
  const mapEmbed = `https://maps.google.com/maps?saddr=${coords.lat},${coords.lng}&daddr=${KAABA_LAT},${KAABA_LNG}&output=embed`;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center">
        🕋 <b>{t("qibla.title")}:</b> {brg}° {dirWord(brg)} {t("qibla.fromNorth")}
      </p>

      <iframe
        title="Qibla map"
        src={mapEmbed}
        width="100%"
        height="300"
        loading="lazy"
        style={{ border: 0, borderRadius: "12px" }}
      />

      <a href={mapsDir} target="_blank" rel="noopener noreferrer" className="wird-btn text-center">
        📍 {t("qibla.maps")}
      </a>
      <p className="text-center text-xs wird-muted">{t("qibla.hint")}</p>
    </div>
  );
}
