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

    // Always start fresh from 0 → value.
    const start = performance.now();
    const to = value;
    setDisplay(0);

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOut(t);
      setDisplay(to * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
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
