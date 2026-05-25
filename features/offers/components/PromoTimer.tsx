"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface PromoTimerProps {
  promoEndAt: string;
  promoTimeLeft?: string | null;
}

function getTimeLeft(endAt: string) {
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return `${h}h ${m}m ${s}s`;
}

export function PromoTimer({ promoEndAt, promoTimeLeft }: PromoTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(
    promoEndAt ? getTimeLeft(promoEndAt) : promoTimeLeft ?? null
  );

  useEffect(() => {
    if (!promoEndAt) return;
    const interval = setInterval(() => {
      const remaining = getTimeLeft(promoEndAt);
      setTimeLeft(remaining);
      if (!remaining) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [promoEndAt]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5">
      <Clock className="h-4 w-4 text-bg-error" />
      <span className="text-label-md font-semibold text-bg-error">
        Promo ends in {timeLeft}
      </span>
    </div>
  );
}
