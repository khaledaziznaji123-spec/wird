"use client";

import { useEffect, useState } from "react";
import DhikrCard from "./DhikrCard";
import { markDayComplete } from "@/features/streak/actions";
import { useT } from "@/lib/i18n-context";
import type { Dhikr } from "./data";

export default function AdhkarRunner({
  adhkar,
  topicId,
  isRoutine,
  isLoggedIn,
  alreadyDone,
  favIds = [],
}: {
  adhkar: Dhikr[];
  topicId: number;
  isRoutine: boolean;
  isLoggedIn: boolean;
  alreadyDone: boolean;
  favIds?: number[];
}) {
  const t = useT();
  const [done, setDone] = useState<boolean[]>(() => adhkar.map(() => false));
  const [marked, setMarked] = useState(alreadyDone);
  const allDone = done.length > 0 && done.every(Boolean);

  useEffect(() => {
    if (allDone && isRoutine && isLoggedIn && !marked) {
      setMarked(true);
      const localDate = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local
      markDayComplete(topicId, localDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  function setOne(i: number, v: boolean) {
    setDone((prev) => {
      if (prev[i] === v) return prev;
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  return (
    <div>
      {isRoutine && (marked || alreadyDone) ? (
        <div
          className="mb-4 rounded-xl p-4 text-center font-bold"
          style={{ background: "#f1f8f3", color: "var(--wird-green)", border: "1px solid var(--wird-green)" }}
        >
          🔥 {t("streak.dayDone")}
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {adhkar.map((d, i) => (
          <DhikrCard
            key={d.id}
            dhikr={d}
            index={i}
            onDoneChange={setOne}
            isFav={favIds.includes(d.id)}
            canFav={isLoggedIn}
          />
        ))}
      </div>

      {allDone && !isRoutine ? (
        <div className="mt-4 rounded-xl p-4 text-center font-bold" style={{ background: "#f1f8f3", color: "var(--wird-green)" }}>
          ✓ {t("adhkar.allDone")}
        </div>
      ) : null}
    </div>
  );
}
