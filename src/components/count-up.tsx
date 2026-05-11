import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /**
   * When true (default), the count-up animation is gated until the element
   * scrolls into the viewport, and resets to 0 each time it leaves. Set to
   * false in tooltips / hidden elements where IntersectionObserver wouldn't
   * fire reliably.
   */
  triggerInView?: boolean;
  /** Fired the moment the count-up animation actually starts (frame 0). */
  onStart?: () => void;
  /** Fired when the count-up reaches its final value. */
  onComplete?: () => void;
};

// Ease-out cubic for a smooth, premium ramp-up.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
  value,
  duration = 1500,
  decimals = 2,
  prefix = "",
  suffix = "",
  className,
  triggerInView = true,
  onStart,
  onComplete,
}: Props) {
  const elRef = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const [inView, setInView] = useState(!triggerInView);
  const rafRef = useRef<number | null>(null);

  // Bidirectional viewport observer — every time the element enters the
  // viewport we re-arm the count-up, and reset to 0 when it leaves.
  useEffect(() => {
    if (!triggerInView) return;
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const el = elRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerInView]);

  useEffect(() => {
    if (typeof window === "undefined") {
      setDisplay(value);
      return;
    }

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !Number.isFinite(value)) {
      setDisplay(value);
      return;
    }

    if (!inView) {
      setDisplay(0);
      return;
    }

    // Skip animation entirely for non-positive targets — no glow/start/complete fires.
    if (value <= 0) {
      setDisplay(value);
      return;
    }

    // Always start fresh from 0 → value.
    const to = value;
    setDisplay(0);
    let start = 0;
    let firedStart = false;

    const tick = (now: number) => {
      if (start === 0) start = now;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOut(t);
      const next = to * eased;
      // Fire onStart on the first frame where the displayed value actually moves above 0.
      if (!firedStart && next > 0) {
        firedStart = true;
        onStart?.();
      }
      setDisplay(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, inView]);

  const text =
    prefix +
    display.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;

  return <span ref={elRef} className={className}>{text}</span>;
}
