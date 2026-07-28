"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n-context";

type Timings = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const EMOJI: Record<string, string> = {
  Fajr: "🌄",
  Dhuhr: "☀️",
  Asr: "🌤️",
  Maghrib: "🌇",
  Isha: "🌙",
};

export default function PrayerTimes() {
  const t = useT();
  const [times, setTimes] = useState<Timings | null>(null);
  const [state, setState] = useState<"loading" | "denied" | "error" | "ok">("loading");
  const [remind, setRemind] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => {
    setRemind(localStorage.getItem("wird_prayer_remind") === "1");
    if (!("geolocation" in navigator)) return setState("error");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const d = new Date();
        const date = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
        try {
          const r = await fetch(
            `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`,
          );
          const j = await r.json();
          setTimes(j.data.timings);
          setState("ok");
        } catch {
          setState("error");
        }
      },
      () => setState("denied"),
      { timeout: 10000 },
    );
    return clearTimers;
  }, []);

  // Schedule alarms for the rest of today when reminders are on.
  useEffect(() => {
    clearTimers();
    if (!remind || !times) return;
    const now = Date.now();
    for (const p of PRAYERS) {
      const [h, m] = times[p].split(":").map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);
      const ms = target.getTime() - now;
      if (ms > 0 && ms < 86400000) {
        timers.current.push(window.setTimeout(() => fireAlarm(p), ms));
      }
    }
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remind, times]);

  function fireAlarm(prayer: string) {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`🕌 ${t("prayer.timeFor")} ${t("prayer." + prayer.toLowerCase())}`, {
          body: t("prayer.alarmBody"),
        });
      }
    } catch {}
    // simple beeping alarm
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      let count = 0;
      const beep = () => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 880;
        g.gain.value = 0.25;
        o.start();
        o.stop(ctx.currentTime + 0.35);
        if (++count < 6) setTimeout(beep, 550);
      };
      beep();
    } catch {}
  }

  async function toggleRemind() {
    const next = !remind;
    if (next && "Notification" in window && Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
    setRemind(next);
    localStorage.setItem("wird_prayer_remind", next ? "1" : "0");
  }

  // next upcoming prayer today
  let nextPrayer = "";
  if (times) {
    const now = new Date();
    for (const p of PRAYERS) {
      const [h, m] = times[p].split(":").map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);
      if (target > now) {
        nextPrayer = p;
        break;
      }
    }
  }

  return (
    <div className="wird-card p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-bold" style={{ color: "var(--wird-green)" }}>
          🕌 {t("prayer.title")}
        </h3>
        {state === "ok" ? (
          <button
            type="button"
            onClick={toggleRemind}
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={
              remind
                ? { background: "var(--wird-green)", color: "#fff" }
                : { border: "1px solid var(--wird-border)" }
            }
          >
            {remind ? `🔔 ${t("prayer.on")}` : `🔕 ${t("prayer.off")}`}
          </button>
        ) : null}
      </div>

      {state === "loading" ? (
        <p className="text-sm wird-muted">📍 {t("prayer.locating")}</p>
      ) : state === "denied" ? (
        <p className="text-sm wird-muted">📍 {t("prayer.needLocation")}</p>
      ) : state === "error" ? (
        <p className="text-sm wird-muted">{t("prayer.error")}</p>
      ) : times ? (
        <div className="grid grid-cols-5 gap-1 text-center">
          {PRAYERS.map((p) => (
            <div
              key={p}
              className="rounded-lg py-2"
              style={
                p === nextPrayer
                  ? { background: "#f1f8f3", border: "1px solid var(--wird-green)" }
                  : undefined
              }
            >
              <div className="text-lg">{EMOJI[p]}</div>
              <div className="text-[11px] font-semibold wird-muted">{t("prayer." + p.toLowerCase())}</div>
              <div className="text-sm font-bold" dir="ltr">
                {times[p]}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
