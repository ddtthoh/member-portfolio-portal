import CountUp from "react-countup";

export function CountValue({
  value,
  prefix = "$",
  decimals = 0,
  duration = 1.4,
}: {
  value: number;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  return (
    <CountUp
      end={value}
      prefix={prefix}
      decimals={decimals}
      duration={duration}
      separator=","
      preserveValue
    />
  );
}
