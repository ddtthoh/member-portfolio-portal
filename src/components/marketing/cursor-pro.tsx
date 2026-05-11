import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: small gold dot + ring. Ring grows + shows label on hover of [data-cursor].
 * SSR-safe (mounts only on client, hidden on touch).
 */
export function CursorPro() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (!ring.current || !label.current) return;
      if (t) {
        ring.current.classList.add("cp-ring--active");
        label.current.textContent = t.dataset.cursor || "";
        label.current.classList.add("cp-label--active");
      } else {
        ring.current.classList.remove("cp-ring--active");
        label.current.classList.remove("cp-label--active");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cp-ring pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-gold/55 backdrop-invert-[0.02] transition-[width,height,border-color,opacity] duration-300" />
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[9999] h-[6px] w-[6px] rounded-full bg-gold shadow-[0_0_12px_var(--gold)]" />
      <div ref={label} className="cp-label pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 translate-y-6 rounded-full bg-gold/95 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-foreground opacity-0 transition-opacity duration-200" style={{ transform: `translate3d(0,0,0)` }} />
      <style>{`
        body { cursor: none; }
        a, button, [role="button"], [data-cursor] { cursor: none; }
        .cp-ring--active { width: 56px !important; height: 56px !important; border-color: var(--gold) !important; mix-blend-mode: exclusion; }
        .cp-label--active { opacity: 1 !important; }
      `}</style>
    </>
  );
}
