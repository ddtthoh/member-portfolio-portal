import { useMemo } from "react";

export function Sparkline({
  seed = 1,
  positive = true,
  width = 120,
  height = 28,
}: {
  seed?: number;
  positive?: boolean;
  width?: number;
  height?: number;
}) {
  const points = useMemo(() => {
    const n = 16;
    const arr: number[] = [];
    let v = 0.5;
    for (let i = 0; i < n; i++) {
      const r = Math.sin(seed * (i + 1) * 1.7) * 0.18;
      v = Math.max(0.05, Math.min(0.95, v + r));
      arr.push(v);
    }
    if (positive) arr[arr.length - 1] = Math.max(arr[arr.length - 1], 0.6);
    else arr[arr.length - 1] = Math.min(arr[arr.length - 1], 0.4);
    return arr;
  }, [seed, positive]);

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - p * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const stroke = positive ? "var(--success)" : "var(--destructive)";

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 400,
          strokeDashoffset: 400,
          animation: "spark-draw 1.4s ease-out forwards",
        }}
      />
    </svg>
  );
}
