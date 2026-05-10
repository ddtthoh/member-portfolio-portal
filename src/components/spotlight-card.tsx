import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

export function SpotlightCard({ children, className = "font-normal", intensity = 18 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    if (typeof document !== "undefined" && document.documentElement.classList.contains("is-scrolling")) return;
    const r = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  }
  function handleLeave() {
    mouseX.set(-200);
    mouseY.set(-200);
  }

  const background = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, color-mix(in oklab, var(--gold) ${intensity}%, transparent), transparent 60%)`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group relative ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
