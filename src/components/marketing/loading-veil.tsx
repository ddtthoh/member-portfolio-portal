import { useEffect, useState } from "react";

const STORAGE_KEY = "naslab:lv:seen";

/** Initial app loading veil — golden N draws, then fades out.
 *  Shows once per browser session to avoid blocking every navigation. */
export function LoadingVeil() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    try { return sessionStorage.getItem(STORAGE_KEY) !== "1"; } catch { return true; }
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (typeof window === "undefined") return;
    const t1 = window.setTimeout(() => setFading(true), 650);
    const t2 = window.setTimeout(() => {
      setVisible(false);
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
    }, 1050);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visible]);

  if (!visible) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9500] flex items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at center, #1a0d05 0%, #06070b 75%)",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.4s ease-out",
      }}
    >
      <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
        <defs>
          <linearGradient id="lv-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd089" />
            <stop offset="100%" stopColor="#ff5a3c" />
          </linearGradient>
        </defs>
        <path
          d="M 18 142 L 18 18 L 38 18 L 102 124 L 102 18 L 102 142 L 82 142 L 18 38 L 18 142 Z"
          stroke="url(#lv-grad)"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeDasharray: 700,
            strokeDashoffset: 700,
            animation: "lv-draw 0.7s cubic-bezier(.76,0,.24,1) forwards",
          }}
        />
      </svg>
      <div
        className="absolute bottom-16 font-mono text-[10px] uppercase tracking-[0.5em] text-gold/60"
        style={{ opacity: 0, animation: "lv-fade-in 0.4s 0.25s ease-out forwards" }}
      >
        NASLAB
      </div>
      <style>{`
        @keyframes lv-draw { to { stroke-dashoffset: 0; } }
        @keyframes lv-fade-in { to { opacity: 1; } }
      `}</style>
    </div>
  );
}
