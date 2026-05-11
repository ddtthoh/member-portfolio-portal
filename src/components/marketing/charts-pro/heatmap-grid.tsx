/**
 * 24×7 activity heatmap, hour-of-day × day-of-week, gold scale.
 * Hover for value tooltip.
 */
import { useState } from "react";

export function HeatmapGrid() {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const data = days.map(() =>
    Array.from({ length: 24 }, (_, h) => {
      // Higher activity during US/EU/Asia overlap windows
      const peak = Math.exp(-((h - 13) ** 2) / 30) + 0.5 * Math.exp(-((h - 21) ** 2) / 26);
      return Math.max(0.05, Math.min(1, peak * (0.6 + Math.random() * 0.5)));
    }),
  );
  const [hover, setHover] = useState<{ d: number; h: number } | null>(null);

  return (
    <div className="lg-card relative p-6 md:p-8">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">Activity Heatmap</div>
            <div className="mt-2 font-display text-2xl md:text-3xl tracking-tight">When the market breathes.</div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
            <span>low</span>
            <span className="flex">
              {[0.15, 0.35, 0.55, 0.75, 0.95].map((s) => (
                <span key={s} className="h-3 w-5 border border-black/40" style={{ background: `rgba(255, ${190 + s * 30}, ${60 + s * 60}, ${s})` }} />
              ))}
            </span>
            <span>high</span>
          </div>
        </div>

        <div className="relative mt-5 overflow-x-auto">
          <div className="inline-flex flex-col gap-1">
            <div className="ml-10 flex gap-[2px] font-mono text-[8px] tracking-[0.15em] text-foreground/40">
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="w-5 text-center">{h % 3 === 0 ? `${h}h` : ""}</div>
              ))}
            </div>
            {data.map((row, di) => (
              <div key={di} className="flex items-center gap-1">
                <div className="w-9 text-right font-mono text-[9px] tracking-[0.15em] text-foreground/45">{days[di]}</div>
                <div className="flex gap-[2px]">
                  {row.map((v, hi) => (
                    <div
                      key={hi}
                      onMouseEnter={() => setHover({ d: di, h: hi })}
                      onMouseLeave={() => setHover(null)}
                      className="h-5 w-5 rounded-[2px] transition-transform"
                      style={{
                        background: `rgba(255, ${190 + v * 30}, ${60 + v * 60}, ${0.15 + v * 0.85})`,
                        transform: hover?.d === di && hover.h === hi ? "scale(1.4)" : undefined,
                        outline: hover?.d === di && hover.h === hi ? "1px solid #ffd166" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {hover && (
            <div className="pointer-events-none mt-3 inline-block rounded-md border border-gold/30 bg-black/85 px-3 py-1.5 font-mono text-[10px] tracking-wider text-foreground/85 backdrop-blur">
              {days[hover.d]} · {hover.h}h00 · activity {(data[hover.d][hover.h] * 100).toFixed(0)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
