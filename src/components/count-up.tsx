import { useEffect, useRef, useState } from "react";
import { useInViewOnce } from "@/hooks/use-in-view-once";

type Props = {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /**
   * When true (default), the count-up animation is gated until the element
   * scrolls into the viewport. Set to false in tooltips / hidden elements
   * where IntersectionObserver wouldn't fire reliably.
   */
  triggerInView?: boolean;
};

// Ease-out cubic for a smooth, premium ramp-up.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
  value,
  duration = 2200,
  decimals = 2,
  prefix = "",
  suffix = "",
  className,
  triggerInView = true,
}: Props) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const { ref, inView } = useInViewOnce<HTMLSpanElement>({ amount: 0.2 });

  const armed = triggerInView ? inView : true;

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

    // Wait until the element is in view before animating.
    if (!armed) {
      setDisplay(0);
      return;
    }

    // Skip animating to a 0 placeholder — wait for the real value so all
    // CountUps on the page animate together once their data resolves.
    if (value === 0 && fromRef.current === 0) {
      setDisplay(0);
      return;
    }

    const start = performance.now();
    const from = fromRef.current;
    const to = value;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOut(t);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      fromRef.current = value;
    };
  }, [value, duration, armed]);

  const text =
    prefix +
    display.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;

  return <span ref={ref} className={className}>{text}</span>;
}
