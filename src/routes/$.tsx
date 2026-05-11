import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/$")({
  component: NotFound,
});

function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // Make N-shape sample points
    const W = 220, H = 300, T = 56;
    const pts: { x: number; y: number; vx: number; vy: number; ox: number; oy: number }[] = [];
    while (pts.length < 1100) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      let ok = false;
      if (x < T) ok = true;
      else if (x > W - T) ok = true;
      else {
        const slope = (0 - H) / (W - 2 * T);
        const yOnLine = H + slope * (x - T);
        if (Math.abs(y - yOnLine) < T * 0.6) ok = true;
      }
      if (ok) {
        const ox = x - W / 2;
        const oy = y - H / 2;
        pts.push({
          x: ox + (Math.random() - 0.5) * 600,
          y: oy + (Math.random() - 0.5) * 400,
          vx: 0, vy: 0, ox, oy,
        });
      }
    }

    let raf = 0;
    const loop = () => {
      const w = c.width, h = c.height;
      ctx.fillStyle = "rgba(6,7,11,0.18)";
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      for (const p of pts) {
        const tx = p.ox * dpr, ty = p.oy * dpr;
        const dx = tx - p.x, dy = ty - p.y;
        p.vx = p.vx * 0.88 + dx * 0.018;
        p.vy = p.vy * 0.88 + dy * 0.018;
        p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = "rgba(255, 209, 130, 0.85)";
        ctx.fillRect(cx + p.x, cy + p.y, 1.4 * dpr, 1.4 * dpr);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06070b] text-foreground">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold/70">ERROR · 404</div>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="mt-4 text-[clamp(2.4rem,7vw,5.8rem)] font-light leading-[1] tracking-[-0.04em]"
        >
          Lost in the <span className="lg-tagline italic" style={{ fontFamily: "var(--font-serif)" }}>mempool</span>.
        </h1>
        <p className="mt-5 max-w-md text-foreground/65">
          The route you signed never made it into a block. Return to base before MEV bots front-run you.
        </p>
        <Link
          to="/main"
          data-cursor="Return"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-foreground shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--gold)_80%,transparent)] transition-transform hover:scale-[1.02]"
        >
          Return to base
        </Link>
      </div>
    </div>
  );
}
