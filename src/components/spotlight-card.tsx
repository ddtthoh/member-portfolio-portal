import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

export function SpotlightCard({ children, className = "font-normal", intensity = 18 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    if (
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("is-scrolling") ||
        document.documentElement.classList.contains("initial-scroll-safe"))
    ) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }
  function handleLeave() {
    ref.current?.style.setProperty("--spot-x", "-200px");
    ref.current?.style.setProperty("--spot-y", "-200px");
  }

  const spotlightStyle = {
    background: `radial-gradient(420px circle at var(--spot-x, -200px) var(--spot-y, -200px), color-mix(in oklab, var(--gold) ${intensity}%, transparent), transparent 60%)`,
  } satisfies CSSProperties;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group relative ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={spotlightStyle}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
