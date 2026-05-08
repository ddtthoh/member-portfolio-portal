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
  decimals = 2,
  prefix = "",
  suffix = "",
  className,
}: Props) {
  const text =
    prefix +
    value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;
  return <span className={className}>{text}</span>;
}
