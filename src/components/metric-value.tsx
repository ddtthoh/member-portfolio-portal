import { CountUp } from "@/components/count-up";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Visual scale */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional small unit appended after the number (e.g. "days"). */
  unit?: string;
  className?: string;
  /** Disable the count-up entrance animation (e.g. inside dense tables). */
  static?: boolean;
  /** Override the count-up duration in ms. */
  duration?: number;
  /** Fired when the count-up animation actually starts. */
  onStart?: () => void;
};

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-base sm:text-lg",
  md: "text-xl sm:text-2xl",
  lg: "text-2xl sm:text-3xl",
  xl: "text-4xl sm:text-6xl",
};

/**
 * Unified portal metric display: gold + light weight + tight tracking + tabular nums.
 * Mirrors the hero $50,000.00 styling from /portal.
 */
export function MetricValue({
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  size = "md",
  unit,
  className = "",
  static: isStatic = false,
  duration,
  onStart,
}: Props) {
  return (
    <span
      className={`inline-flex items-baseline gap-1 font-light tabular-nums tracking-[-0.04em] text-gold ${sizeClasses[size]} ${className}`}
    >
      {isStatic ? (
        <span>
          {prefix}
          {value.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
          {suffix}
        </span>
      ) : (
        <CountUp value={value} prefix={prefix} suffix={suffix} decimals={decimals} duration={duration} onStart={onStart} />
      )}
      {unit && (
        <span className="text-xs font-normal text-muted-foreground">{unit}</span>
      )}
    </span>
  );
}
