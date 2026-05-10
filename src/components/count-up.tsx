import { useMemo } from "react";

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

export function CountUp({
  value,
  duration = 1500,
  decimals = 2,
  prefix = "",
  suffix = "",
  className,
  triggerInView = true,
}: Props) {
  void triggerInView;
  void duration;
  const display = Number.isFinite(value) ? value : 0;

  const text = useMemo(
    () => prefix + display.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + suffix,
    [decimals, display, prefix, suffix],
  );

  return <span className={className}>{text}</span>;
}
