import { useEffect, useState, type ReactNode } from "react";
import { SpotlightCard } from "@/components/spotlight-card";

/**
 * Wraps content in the same glow shell as the "Your Position" card on
 * /portal/staking-plans: outer conic gradient ring, gold border, soft drop
 * shadow, two corner radial glows, and a one-shot diagonal sweep on mount.
 *
 * Renders an inner SpotlightCard so the spotlight hover effect is preserved.
 */
export function GlowFrame({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  /** Extra classes for the outermost relative wrapper. */
  className?: string;
  /** Extra classes for the inner SpotlightCard. */
  innerClassName?: string;
}) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    // Defer one frame so the compositor layer is created before the keyframes
    // start, matching the staking-plans fix that prevents a first-paint flash.
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Outer conic gradient ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-90 blur-[2px]"
        style={{
          background:
            "conic-gradient(from 140deg at 50% 50%, color-mix(in oklab, var(--gold) 55%, transparent), transparent 30%, color-mix(in oklab, var(--gold) 35%, transparent) 55%, transparent 80%, color-mix(in oklab, var(--gold) 55%, transparent))",
        }}
      />
      <SpotlightCard
        className={`liquid-glass relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-card/95 via-card/80 to-background/95 ${innerClassName}`}
        style={{
          boxShadow:
            "0 10px 40px -12px color-mix(in oklab, var(--gold) 35%, transparent)",
          isolation: "isolate",
          contain: "paint",
        }}
      >
        {/* Corner glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -bottom-20 h-44 w-44 rounded-full bg-gold/10 blur-3xl"
        />
        {/* Diagonal sweep — overlay always mounted, class toggled to play once. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -inset-[15%] ${play ? "animate-position-sweep" : ""}`}
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, color-mix(in oklab, var(--gold) 35%, transparent) 50%, transparent 70%)",
            mixBlendMode: "screen",
            opacity: 0,
            willChange: "transform, opacity",
            transform: "translate3d(-60%, -60%, 0)",
          }}
          onAnimationEnd={() => setPlay(false)}
        />
        {children}
      </SpotlightCard>
    </div>
  );
}
