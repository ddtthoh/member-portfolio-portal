import { useState, type ReactNode, type MouseEvent } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SpotlightCard } from "@/components/spotlight-card";
import { cn } from "@/lib/utils";

function handleSpotlightMove(e: MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
  el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
}

/**
 * Shared portal building blocks. Use these on every /portal page so headers,
 * cards, tables and filter panels stay perfectly consistent.
 *
 * Conventions:
 *  - Section titles: font-serif text-base font-semibold text-gold md:text-lg
 *  - Body / data: sans (default)
 *  - Card shell:   liquid-glass rounded-2xl with mt-4 spacing between sections
 *  - Table head:   uppercase tracking, gold, [11px]
 */

export function SectionCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <SpotlightCard className={cn("liquid-glass glass-shimmer glass-spotlight mt-4 rounded-2xl", className)}>
      <div
        onMouseMove={handleSpotlightMove}
        className="contents"
      >
        <span aria-hidden className="shimmer-streak" />
        <span aria-hidden className="spotlight-layer" />
        {children}
      </div>
    </SpotlightCard>
  );
}

export function SectionHeader({
  title,
  subtitle,
  actions,
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-3 border-b border-gold/10 px-5 py-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div>
        <h3 className="font-serif text-base font-semibold text-gold text-gold-shine md:text-lg">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-gold/55">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionBody({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("px-5 py-5", className)}>{children}</div>;
}

export function CollapsibleFilter({
  title = "Filter",
  defaultOpen = false,
  children,
  className = "",
}: {
  title?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <SectionCard className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-serif text-base font-semibold text-gold md:text-lg">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gold/70" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gold/70" />
        )}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </SectionCard>
  );
}

export function FieldLabel({
  children,
  required,
  className = "",
}: {
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-gold/80",
        className,
      )}
    >
      {children}
      {required && <span className="ml-1 text-gold">*</span>}
    </label>
  );
}

/**
 * Table primitives — keeps headers, rows, and empty states identical.
 */
export function DataTable({
  className = "",
  minWidth = 640,
  children,
}: {
  className?: string;
  minWidth?: number;
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto px-2 pb-4 sm:px-5">
      <table
        style={{ minWidth }}
        className={cn(
          "w-full table-fixed border-collapse text-left text-sm",
          className,
        )}
      >
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-y border-border/40 text-[11px] uppercase tracking-[0.18em] text-gold">
        {children}
      </tr>
    </thead>
  );
}

export function Th({
  children,
  className = "",
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  const a =
    align === "right"
      ? "text-right"
      : align === "center"
      ? "text-center"
      : "text-left";
  return (
    <th className={cn("px-3 py-3 font-semibold", a, className)}>{children}</th>
  );
}

export function Td({
  children,
  className = "",
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  const a =
    align === "right"
      ? "text-right"
      : align === "center"
      ? "text-center"
      : "text-left";
  return (
    <td className={cn("px-3 py-3.5", a, className)}>{children}</td>
  );
}

export function EmptyRow({
  colSpan,
  children = "No records yet.",
}: {
  colSpan: number;
  children?: ReactNode;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-3 py-12 text-center text-sm text-muted-foreground"
      >
        {children}
      </td>
    </tr>
  );
}

/** Animated KPI number — tabular-nums + reveal. */
export function KpiNumber({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("num-tick", className)}>{children}</span>;
}

/** Pulsing status dot. */
export function StatusDot({
  active = true,
  className = "",
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        active ? "bg-gold ring-pulse" : "bg-muted-foreground/40",
        className,
      )}
    />
  );
}
