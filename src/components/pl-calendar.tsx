import { useMemo, useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type DayPL = { day: number; amount: number; pct: number };

// Seeded RNG so values stay stable across renders
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMay2026(): DayPL[] {
  const rand = mulberry32(20260501);
  // Days 1..7. 5 profit days, 2 loss days.
  const lossDays = new Set<number>();
  while (lossDays.size < 2) {
    lossDays.add(1 + Math.floor(rand() * 7));
  }
  const base = 250000; // notional base for amount calc
  const out: DayPL[] = [];
  for (let d = 1; d <= 7; d++) {
    const isLoss = lossDays.has(d);
    const pct = isLoss
      ? -(1 + rand() * 1) // -1% .. -2%
      : 2 + rand() * 2; //  2% ..  4%
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
  const sign = n > 0 ? "+" : n < 0 ? "-" : "+";
  const abs = Math.abs(n);
  if (abs >= 1000) {
    return `${sign}${(abs / 1000).toFixed(2)}K`;
  }
  return `${sign}${abs.toFixed(2)}`;
}

function fmtPct(n: number) {
  const sign = n > 0 ? "+" : n < 0 ? "-" : "+";
  return `${sign}${Math.abs(n).toFixed(2)}%`;
}

export function PLCalendar() {
  const [view, setView] = useState<"monthly" | "year">("monthly");
  const [month, setMonth] = useState(4); // May (0-indexed)
  const [year, setYear] = useState(2026);

  const data = useMemo(() => {
    if (year === 2026 && month === 4) return generateMay2026();
    return [];
  }, [year, month]);

  const totals = useMemo(() => {
    const amount = data.reduce((s, d) => s + d.amount, 0);
    const pct = data.reduce((s, d) => s + d.pct, 0);
    return { amount, pct };
  }, [data]);

  // First day of month: May 1 2026 = Friday (index 5, Sun=0)
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

  const totalColor =
    totals.amount > 0 ? "text-success" : totals.amount < 0 ? "text-destructive" : "text-foreground";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-1 pb-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-gold">
            P/L Calendar
          </h3>
          <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
        </div>
        <div className="inline-flex rounded-md border border-border/60 bg-background/40 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setView("monthly")}
            className={`rounded px-3 py-1 transition-colors ${
              view === "monthly"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setView("year")}
            className={`rounded px-3 py-1 transition-colors ${
              view === "year"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Month selector + totals */}
      <div className="flex items-end justify-between gap-3 px-1 pb-3">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-gold"
              >
                {view === "monthly" ? `${MONTHS[month]} ${year}` : `${year}`}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-72 w-44 overflow-y-auto">
              {view === "monthly"
                ? YEARS.flatMap((y) =>
                    MONTHS.map((m, mi) => (
                      <DropdownMenuItem
                        key={`${y}-${mi}`}
                        onSelect={() => {
                          setYear(y);
                          setMonth(mi);
                        }}
                      >
                        {m} {y}
                      </DropdownMenuItem>
                    )),
                  )
                : YEARS.map((y) => (
                    <DropdownMenuItem key={y} onSelect={() => setYear(y)}>
                      {y}
                    </DropdownMenuItem>
                  ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {MONTHS[month]} P/L · USD
          </div>
          <div className={`mt-0.5 text-xl font-light tabular-nums tracking-[-0.02em] ${totalColor}`}>
            {fmtAmount(totals.amount)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Return
          </div>
          <div className={`mt-0.5 text-xl font-light tabular-nums tracking-[-0.02em] ${totalColor}`}>
            {fmtPct(totals.pct)}
          </div>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 border-t border-border/60 px-1 pt-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="px-1 pb-2 text-left">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="overflow-hidden rounded-md border border-border/40">
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
              const color = isProfit
                ? "text-success"
                : isLoss
                  ? "text-destructive"
                  : "text-muted-foreground/60";
              return (
                <div
                  key={ci}
                  className={`min-h-[78px] px-2 py-2 ${ci !== 0 ? "border-l border-border/40" : ""}`}
                >
                  {!isEmpty && (
                    <>
                      <div className="text-sm tabular-nums text-foreground">{cell!.day}</div>
                      {has && (
                        <div className={`mt-1 space-y-0.5 text-[11px] tabular-nums ${color}`}>
                          <div>{fmtAmount(cell!.amount)}</div>
                          <div className="text-[10px] opacity-80">{fmtPct(cell!.pct)}</div>
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
