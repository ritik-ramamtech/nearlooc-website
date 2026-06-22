"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

interface PromoTimerProps {
  promoEndAt: string;
  promoTimeLeft?: string | null;
}

interface TimeUnits {
  days: number;
  hours: string;
  minutes: string;
  seconds: string;
}

function getTimeUnits(endAt: string): TimeUnits | null {
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return {
    days,
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    seconds: String(s).padStart(2, "0"),
  };
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="min-w-[2ch] rounded-md bg-white/20 px-2 py-0.5 text-center text-[18px] font-bold tabular-nums leading-tight text-white">
        {value}
      </span>
      <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-white/70">
        {label}
      </span>
    </div>
  );
}

export function PromoTimer({ promoEndAt, promoTimeLeft }: PromoTimerProps) {
  const [units, setUnits] = useState<TimeUnits | null>(
    promoEndAt ? getTimeUnits(promoEndAt) : null
  );

  useEffect(() => {
    if (!promoEndAt) return;
    const interval = setInterval(() => {
      const remaining = getTimeUnits(promoEndAt);
      setUnits(remaining);
      if (!remaining) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [promoEndAt]);

  if (!units) {
    if (!promoTimeLeft) return null;
    // Fallback: show raw string from backend
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5">
        <Flame className="h-4 w-4 text-red-500" />
        <span className="text-label-md font-semibold text-red-600">
          Ends in {promoTimeLeft}
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3">
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-white" />
        <span className="text-label-md font-semibold text-white">
          Offer ends in
        </span>
      </div>

      <div className="flex items-center gap-2">
        {units.days > 0 ? (
          <>
            <TimeUnit value={String(units.days)} label={units.days === 1 ? "day" : "days"} />
            <span className="mb-3 text-[18px] font-bold text-white/80">:</span>
            <TimeUnit value={units.hours} label="hrs" />
            <span className="mb-3 text-[18px] font-bold text-white/80">:</span>
            <TimeUnit value={units.minutes} label="min" />
          </>
        ) : (
          <>
            <TimeUnit value={units.hours} label="hrs" />
            <span className="mb-3 text-[18px] font-bold text-white/80">:</span>
            <TimeUnit value={units.minutes} label="min" />
            <span className="mb-3 text-[18px] font-bold text-white/80">:</span>
            <TimeUnit value={units.seconds} label="sec" />
          </>
        )}
      </div>
    </div>
  );
}
