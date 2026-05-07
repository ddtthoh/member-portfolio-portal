import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

type Props = {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function CountUp({
  value,
  duration = 1.2,
  decimals = 2,
  prefix = "",
  suffix = "",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const fmt = (v: number) =>
      prefix +
      v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.textContent = fmt(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        node.textContent = fmt(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, decimals, prefix, suffix]);

  const initial =
    prefix +
    (0).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;

  return (
    <span ref={ref} className={className}>
      {initial}
    </span>
  );
}
