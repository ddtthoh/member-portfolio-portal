import { useEffect, useRef } from "react";

type Node = { id: string; x: number; y: number; vx: number; vy: number; kind: "dex" | "cex" | "hub" };
type Edge = [number, number];

const VENUE_NAMES = ["Uniswap", "Curve", "Balancer", "Sushi", "Aerodrome", "Pancake", "Binance", "OKX", "Bybit", "Coinbase", "Kraken", "Bitfinex"];

export function ArbConstellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fit = () => {
      const r = cv.getBoundingClientRect();
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(cv);

    // build nodes
    const W = () => cv.getBoundingClientRect().width;
    const H = () => cv.getBoundingClientRect().height;
    const cx0 = () => W() / 2, cy0 = () => H() / 2;

    const nodes: Node[] = [
      { id: "Ncore X", kind: "hub", x: 0, y: 0, vx: 0, vy: 0 },
      ...VENUE_NAMES.map((id, i) => {
        const a = (i / VENUE_NAMES.length) * Math.PI * 2;
        return { id, kind: i < 6 ? ("dex" as const) : ("cex" as const), x: Math.cos(a) * 180, y: Math.sin(a) * 180, vx: 0, vy: 0 };
      }),
    ];

    const edges: Edge[] = [];
    for (let i = 1; i < nodes.length; i++) {
      edges.push([0, i]);
      // some peer-to-peer edges
      if (Math.random() < 0.32) edges.push([i, 1 + Math.floor(Math.random() * (nodes.length - 1))]);
    }

    // pulses (active arb routes)
    type Pulse = { e: Edge; t: number; dur: number; profit: number };
    let pulses: Pulse[] = [];
    const spawnPulse = () => {
      const e = edges[Math.floor(Math.random() * edges.length)];
      pulses.push({ e, t: 0, dur: 1200 + Math.random() * 1400, profit: +(Math.random() * 240 + 20).toFixed(0) });
    };
    const pulseInt = setInterval(spawnPulse, 380);

    let raf = 0; let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(33, now - last); last = now;
      ctx.clearRect(0, 0, W(), H());

      // physics: gentle force-directed
      for (let i = 1; i < nodes.length; i++) {
        const n = nodes[i];
        // attraction to ring radius 180
        const r = Math.hypot(n.x, n.y) || 1;
        const targetR = 180;
        const fr = (targetR - r) * 0.005;
        n.vx += (n.x / r) * fr;
        n.vy += (n.y / r) * fr;
        // repulsion between peers
        for (let j = 1; j < nodes.length; j++) if (j !== i) {
          const o = nodes[j]; const dx = n.x - o.x, dy = n.y - o.y; const d2 = dx * dx + dy * dy + 1;
          const f = 220 / d2;
          n.vx += (dx / Math.sqrt(d2)) * f * 0.15;
          n.vy += (dy / Math.sqrt(d2)) * f * 0.15;
        }
        n.vx *= 0.86; n.vy *= 0.86;
        n.x += n.vx * dt * 0.06; n.y += n.vy * dt * 0.06;
      }

      const cx = cx0(), cy = cy0();

      // grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
      for (let r = 60; r < 240; r += 60) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); }

      // edges
      ctx.lineWidth = 0.6; ctx.strokeStyle = "rgba(255,209,102,0.16)";
      for (const [a, b] of edges) {
        ctx.beginPath();
        ctx.moveTo(cx + nodes[a].x, cy + nodes[a].y);
        ctx.lineTo(cx + nodes[b].x, cy + nodes[b].y);
        ctx.stroke();
      }

      // pulses
      pulses = pulses.filter((p) => p.t < p.dur);
      for (const p of pulses) {
        p.t += dt;
        const k = p.t / p.dur;
        const a = nodes[p.e[0]], b = nodes[p.e[1]];
        const x = cx + a.x + (b.x - a.x) * k;
        const y = cy + a.y + (b.y - a.y) * k;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 14);
        grad.addColorStop(0, "rgba(255,235,170,0.95)");
        grad.addColorStop(1, "rgba(255,90,60,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
      }

      // nodes
      for (const n of nodes) {
        const x = cx + n.x, y = cy + n.y;
        if (n.kind === "hub") {
          const grd = ctx.createRadialGradient(x, y, 2, x, y, 36);
          grd.addColorStop(0, "rgba(255,235,170,1)");
          grd.addColorStop(0.5, "rgba(255,180,80,0.5)");
          grd.addColorStop(1, "rgba(255,90,60,0)");
          ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(x, y, 36, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = "#0b0a08"; ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = "#ffd166";
          ctx.font = "600 9px ui-monospace, SFMono-Regular, monospace";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("Ncore X", x, y);
        } else {
          ctx.fillStyle = n.kind === "dex" ? "rgba(127,212,228,0.9)" : "rgba(255,209,102,0.9)";
          ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowColor = n.kind === "dex" ? "rgba(127,212,228,0.6)" : "rgba(255,209,102,0.6)"; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.font = "9px ui-monospace, SFMono-Regular, monospace";
          ctx.textAlign = "center";
          ctx.fillText(n.id.toUpperCase(), x, y - 12);
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); clearInterval(pulseInt); ro.disconnect(); };
  }, []);

  return (
    <div className="lg-card relative p-6 md:p-8">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">Arb Constellation</div>
            <div className="mt-2 font-display text-2xl md:text-3xl tracking-tight">Liquidity, force-directed.</div>
          </div>
          <div className="flex gap-5 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-300/90" /> DEX</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gold" /> CEX</span>
          </div>
        </div>
        <div className="relative mt-5 h-[460px] overflow-hidden rounded-md border border-foreground/10 bg-black/40">
          <canvas ref={ref} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
