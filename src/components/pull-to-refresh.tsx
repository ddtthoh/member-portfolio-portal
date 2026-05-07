import { useEffect, useRef, useState, type ReactNode } from "react";

const THRESHOLD = 72;
const MAX = 120;

/**
 * Native-feeling pull-to-refresh for mobile/tablet.
 * Shows a golden arc spinner that fills as the user pulls.
 * Triggers `onRefresh` (defaults to window reload) when released past threshold.
 */
export function PullToRefresh({
  children,
  onRefresh,
}: {
  children: ReactNode;
  onRefresh?: () => Promise<void> | void;
}) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const active = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) return;

    const onStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || refreshing) return;
      startY.current = e.touches[0]?.clientY ?? null;
      active.current = true;
    };
    const onMove = (e: TouchEvent) => {
      if (!active.current || startY.current == null) return;
      const dy = (e.touches[0]?.clientY ?? 0) - startY.current;
      if (dy <= 0) {
        setPull(0);
        return;
      }
      // resistance curve
      const eased = Math.min(MAX, Math.pow(dy, 0.85));
      setPull(eased);
    };
    const onEnd = async () => {
      if (!active.current) return;
      active.current = false;
      const shouldRefresh = pull >= THRESHOLD;
      if (shouldRefresh) {
        setRefreshing(true);
        setPull(THRESHOLD);
        try {
          if (onRefresh) await onRefresh();
          else await new Promise((r) => setTimeout(r, 600));
        } finally {
          if (!onRefresh) window.location.reload();
          setRefreshing(false);
          setPull(0);
        }
      } else {
        setPull(0);
      }
      startY.current = null;
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [pull, refreshing, onRefresh]);

  const progress = Math.min(1, pull / THRESHOLD);
  const ready = progress >= 1;

  return (
    <>
      {/* Indicator */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center lg:hidden"
        style={{
          transform: `translateY(${pull * 0.5}px)`,
          opacity: pull > 4 ? 1 : 0,
          transition: active.current ? "none" : "transform 280ms cubic-bezier(.2,.8,.2,1), opacity 200ms",
        }}
      >
        <div
          className="mt-2 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-background/70 backdrop-blur-md"
          style={{
            boxShadow: ready
              ? "0 0 24px -4px color-mix(in oklab, var(--gold) 80%, transparent)"
              : "0 0 12px -4px color-mix(in oklab, var(--gold) 50%, transparent)",
          }}
        >
          <svg
            viewBox="0 0 36 36"
            className="h-6 w-6"
            style={{
              transform: `rotate(${pull * 4}deg)`,
              animation: refreshing ? "ptr-spin 0.8s linear infinite" : undefined,
            }}
          >
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="color-mix(in oklab, var(--gold) 25%, transparent)"
              strokeWidth="2.5"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 14}
              strokeDashoffset={2 * Math.PI * 14 * (1 - (refreshing ? 0.75 : progress))}
              transform="rotate(-90 18 18)"
              style={{ transition: refreshing ? "none" : "stroke-dashoffset 80ms linear" }}
            />
          </svg>
        </div>
      </div>

      <div
        style={{
          transform: pull > 0 ? `translateY(${pull * 0.35}px)` : undefined,
          transition: active.current ? "none" : "transform 280ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        {children}
      </div>
    </>
  );
}
