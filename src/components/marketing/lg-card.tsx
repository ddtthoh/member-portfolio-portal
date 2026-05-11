import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Liquid-glass card with mouse-tracked spotlight (--mx, --my CSS vars).
 * Always renders a <div> to avoid invalid HTML nesting (no <a> inside <a>).
 * Wrap with <Link> externally if you need it clickable.
 */
export function LGCard({ children, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={cn("lg-card", className)}>
      <div className="lg-noise" />
      <div className="relative z-[3]">{children}</div>
    </div>
  );
}
