import { useMemo, useState } from "react";
import { ChevronDown, Info, TrendingUp, TrendingDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type DayPL = { day: number; amount: number; pct: number };

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMay2026(base: number): DayPL[] {
  const rand = mulberry32(20260501);
  const lossDays = new Set<number>();
  while (lossDays.size < 2) lossDays.add(1 + Math.floor(rand() * 7));

  const out: DayPL[] = [];
  for (let d = 1; d <= 7; d++) {
    const isLoss = lossDays.has(d);
    const pct = isLoss
      ? -(0.1 + rand() * 0.2) // -0.1% .. -0.3%
      : 0.5 + rand() * 0.5; //  0.5% ..  1.0%
    const amount = (base * pct) / 100;
    out.push({ day: d, amount, pct });
  }
  return out;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const YEARS = [2024, 2025, 2026, 2027];

function fmtAmount(n: number) {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  const abs = Math.abs(n);
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(2)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

function fmtPct(n: number) {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(2)}%`;
}

export function PLCalendar({ participation = 250000 }: { participation?: number }) {
  const [month, setMonth] = useState(4); // May
  const [year, setYear] = useState(2026);

  const data = useMemo(() => {
    if (year === 2026 && month === 4) return generateMay2026(participation || 250000);
    return [];
  }, [year, month, participation]);

  const totals = useMemo(() => {
    const amount = data.reduce((s, d) => s + d.amount, 0);
    const pct = data.reduce((s, d) => s + d.pct, 0);
    return { amount, pct };
  }, [data]);

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<DayPL | null> = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(data.find((x) => x.day === d) ?? { day: d, amount: 0, pct: 0 });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: Array<Array<DayPL | null>> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const totalPositive = totals.amount > 0;
  const totalNegative = totals.amount < 0;
  const totalColor = totalPositive
    ? "text-success"
    : totalNegative
      ? "text-destructive"
      : "text-muted-foreground";
  const TotalIcon = totalPositive ? TrendingUp : totalNegative ? TrendingDown : null;

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 pb-5">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-gold">
            P/L Calendar
          </h3>
          <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
        </div>

        <div className="flex items-center gap-2">
          {/* Month selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-gold/60 hover:text-gold"
              >
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Month
                </span>
                <span>{MONTHS[month]}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 w-40 overflow-y-auto">
              {MONTHS.map((m, mi) => (
                <DropdownMenuItem key={mi} onSelect={() => setMonth(mi)}>
                  {m}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Year selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-gold/60 hover:text-gold"
              >
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Year
                </span>
                <span className="tabular-nums">{year}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              {YEARS.map((y) => (
                <DropdownMenuItem key={y} onSelect={() => setYear(y)} className="tabular-nums">
                  {y}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Totals strip */}
      <div className="mb-5 flex items-stretch justify-between gap-4 rounded-lg border border-border/50 bg-background/30 p-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {MONTHS[month]} {year} · P/L
          </div>
          <div
            className={`mt-1 flex items-center gap-2 text-2xl font-light tabular-nums tracking-[-0.03em] ${totalColor}`}
          >
            {TotalIcon && <TotalIcon className="h-5 w-5" />}
            <span>{fmtAmount(totals.amount)}</span>
          </div>
        </div>
        <div className="hidden h-auto w-px bg-border/50 sm:block" />
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Return
          </div>
          <div
            className={`mt-1 text-2xl font-light tabular-nums tracking-[-0.03em] ${totalColor}`}
          >
            {fmtPct(totals.pct)}
          </div>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 px-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="pb-2 text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-lg border border-border/40 bg-background/20">
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className={`grid grid-cols-7 ${wi !== 0 ? "border-t border-border/40" : ""}`}
          >
            {week.map((cell, ci) => {
              const isEmpty = cell === null;
              const has = !isEmpty && cell!.amount !== 0;
              const isProfit = has && cell!.amount > 0;
              const isLoss = has && cell!.amount < 0;

              const tone = isProfit
                ? "bg-success/5"
                : isLoss
                  ? "bg-destructive/5"
                  : "";
              const accent = isProfit
                ? "before:bg-success"
                : isLoss
                  ? "before:bg-destructive"
                  : "before:bg-transparent";
              const valueColor = isProfit
                ? "text-success"
                : isLoss
                  ? "text-destructive"
                  : "text-muted-foreground/50";

              return (
                <div
                  key={ci}
                  className={`relative min-h-[84px] px-2 py-2 transition-colors ${
                    ci !== 0 ? "border-l border-border/40" : ""
                  } ${tone} ${
                    has
                      ? `before:absolute before:inset-x-2 before:top-0 before:h-px ${accent}`
                      : ""
                  } hover:bg-accent/30`}
                >
                  {!isEmpty && (
                    <>
                      <div className="text-xs font-medium tabular-nums text-foreground/90">
                        {cell!.day}
                      </div>
                      {has && (
                        <div className={`mt-1.5 space-y-0.5 tabular-nums ${valueColor}`}>
                          <div className="text-[11px] font-medium leading-tight">
                            {fmtAmount(cell!.amount)}
                          </div>
                          <div className="text-[10px] leading-tight opacity-80">
                            {fmtPct(cell!.pct)}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
