"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useFitCount — returns how many skeleton placeholders are needed to fill the
 * available space, so loading states match the real content density instead of
 * relying on a hardcoded count. Attach the returned `ref` to the container.
 *
 * Recomputes on mount and on any container/viewport resize (ResizeObserver).
 *
 *   "row"  — one horizontal row; fills the container width + `overscan` extra
 *            cards so the row overflows/clips past the right edge (carousels).
 *   "grid" — fills `rows` worth of columns that fit the container width.
 *   "list" — vertical list; fills the viewport height below the container.
 */
type FitOptions =
  | { axis: "row"; itemWidth: number; gap?: number; overscan?: number; min?: number }
  | { axis: "grid"; itemWidth: number; gap?: number; rows?: number; min?: number }
  | { axis: "list"; itemHeight: number; gap?: number; min?: number; max?: number };

export function useFitCount<T extends HTMLElement = HTMLDivElement>(opts: FitOptions) {
  const ref = useRef<T>(null);
  const [count, setCount] = useState(opts.min ?? 4);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const gap = opts.gap ?? 16;

    const compute = () => {
      if (opts.axis === "list") {
        const top = el.getBoundingClientRect().top;
        const available = window.innerHeight - top;
        const n = Math.ceil(available / (opts.itemHeight + gap));
        setCount(Math.min(opts.max ?? 12, Math.max(opts.min ?? 3, n)));
        return;
      }

      const width = el.clientWidth || window.innerWidth;
      const cols = Math.max(1, Math.floor((width + gap) / (opts.itemWidth + gap)));

      if (opts.axis === "row") {
        setCount(Math.max(opts.min ?? 1, cols + (opts.overscan ?? 1)));
      } else {
        setCount(Math.max(opts.min ?? 2, cols * (opts.rows ?? 2)));
      }
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
    // Options are passed inline per-call; re-running on identity churn is undesirable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, count };
}
