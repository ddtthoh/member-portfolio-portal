import { useEffect, useRef, useState } from "react";

/* Tiny inline sparkline that animates its dasharray on first view. */
export function Sparkline({
  data,
  width = 120,
  height = 36,
  className = "",
  color = "var(--gold)",
}: {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}) {
  const ref = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const d = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  // Area path
  const dArea =
    d +
    ` L${width} ${height} L0 ${height} Z`;

  useEffect(() => {
    if (ref.current) setLen(ref.current.getTotalLength());
  }, [d]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      <defs>
        <linearGradient id="sparkfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={dArea} fill="url(#sparkfill)" />
      <path
        ref={ref}
        d={d}
        stroke={color}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len}
        style={{
          animation: len ? "spark-draw 1.4s ease-out forwards" : undefined,
          filter: `drop-shadow(0 0 4px ${color})`,
        }}
      />
      <style>{`@keyframes spark-draw { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}
