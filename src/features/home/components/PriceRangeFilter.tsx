"use client";

import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 40,
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="space-y-5">
      <Slider.Root
        className="relative flex h-5 w-full items-center touch-none select-none"
        min={min}
        max={max}
        step={step}
        value={localValue}
        minStepsBetweenThumbs={1}
        onValueChange={(v) => setLocalValue(v as [number, number])}
        onValueCommit={(v) => onChange(v as [number, number])}
      >
        <Slider.Track className="relative h-1.5 grow rounded-full bg-gray-200">
          <Slider.Range className="absolute h-full rounded-full bg-stitch-primary" />
        </Slider.Track>

        <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-stitch-primary bg-white shadow transition hover:scale-105 focus:outline-none" />

        <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-stitch-primary bg-white shadow transition hover:scale-105 focus:outline-none" />
      </Slider.Root>

      <div className="flex justify-between gap-3">
        <div className="flex-1 rounded-xl border p-3 text-center">
          <p className="text-xs text-gray-500">Minimum</p>
          <p className="mt-1 font-semibold">
            ₹{localValue[0].toLocaleString()}
          </p>
        </div>

        <div className="flex-1 rounded-xl border p-3 text-center">
          <p className="text-xs text-gray-500">Maximum</p>
          <p className="mt-1 font-semibold">
            ₹{localValue[1].toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
