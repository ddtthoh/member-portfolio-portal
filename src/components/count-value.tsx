import CountUp from "react-countup";

export function CountValue({
  value,
  prefix = "$",
  decimals = 0,
  duration = 1.5,
}: {
  value: number;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  return (
    <CountUp
      start={0}
      end={value}
      prefix={prefix}
      decimals={decimals}
      duration={duration}
      separator=","
    />
  );
}
