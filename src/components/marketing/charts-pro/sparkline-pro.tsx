import { useEffect, useRef, useState } from "react";

export function SparklinePro({
  data, width = 120, height = 36, color = "var(--gold)", showDot = true,
}: {
  data: number[]; width?: number; height?: number; color?: string; showDot?: boolean;
}) {
  const ref = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 6) - 3] as const);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ");
  const dArea = d + ` L${width} ${height} L0 ${height} Z`;
  useEffect(() => { if (ref.current) setLen(ref.current.getTotalLength()); }, [d]);
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="spp-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={dArea} fill="url(#spp-fill)" />
      <path
        ref={ref}
        d={d}
        stroke={color}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len}
        style={{ animation: len ? "spp-draw 1.6s cubic-bezier(.2,.8,.2,1) forwards" : undefined, filter: `drop-shadow(0 0 4px ${color})` }}
      />
      {showDot && (
        <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
          <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      <style>{`@keyframes spp-draw { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}
