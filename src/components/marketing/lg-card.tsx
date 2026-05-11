import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "a" | "button";
  href?: string;
  onClick?: () => void;
};

/**
 * Liquid-glass card with mouse-tracked spotlight (--mx, --my CSS vars).
 * Drop-in replacement for the old `m-glass` div.
 */
export function LGCard({ children, className, as = "div", href, onClick }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const Tag: any = as;
  return (
    <Tag
      ref={ref as any}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      className={cn("lg-card", className)}
    >
      <div className="lg-noise" />
      <div className="relative z-[3]">{children}</div>
    </Tag>
  );
}
