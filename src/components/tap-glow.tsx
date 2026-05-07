import { useEffect, useState } from "react";

type Ring = { id: number; x: number; y: number };

/** Touch ripple — gold radial pulse at touch point on coarse-pointer devices. */
export function TapGlow() {
  const [rings, setRings] = useState<Ring[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!coarse || reduce) return;

    let id = 0;
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0] ?? e.changedTouches[0];
      if (!t) return;
      const next = { id: ++id, x: t.clientX, y: t.clientY };
      setRings((prev) => [...prev, next]);
      window.setTimeout(() => {
        setRings((prev) => prev.filter((r) => r.id !== next.id));
      }, 520);
    };
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9998]">
      {rings.map((r) => (
        <span
          key={r.id}
          className="tap-glow-ring"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </div>
  );
}
