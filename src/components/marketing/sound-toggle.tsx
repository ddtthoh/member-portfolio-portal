import { useEffect, useRef, useState } from "react";

let audioCtx: AudioContext | null = null;
function ping(freq = 880, dur = 0.05, vol = 0.04) {
  if (typeof window === "undefined") return;
  if (!audioCtx) {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    audioCtx = new Ctx();
  }
  const ctx = audioCtx;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  g.gain.value = 0;
  o.connect(g); g.connect(ctx.destination);
  const t0 = ctx.currentTime;
  g.gain.linearRampToValueAtTime(vol, t0 + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

/** Floating sound toggle — when on, hover/click on data-cursor elements emits a soft ping. */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  const lastHover = useRef(0);

  useEffect(() => {
    if (!on) return;
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor], a, button");
      if (!t) return;
      const now = performance.now();
      if (now - lastHover.current < 140) return;
      lastHover.current = now;
      ping(1320, 0.04, 0.025);
    };
    const onClick = () => ping(660, 0.07, 0.05);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("click", onClick);
    };
  }, [on]);

  return (
    <button
      type="button"
      aria-label="Toggle sound"
      data-cursor={on ? "Sound ON" : "Sound OFF"}
      onClick={() => setOn((v) => !v)}
      className="fixed bottom-5 right-5 z-[7000] flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-background/60 backdrop-blur-md text-gold transition-all hover:border-gold hover:bg-gold/10"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        {on ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M19 5a9 9 0 0 1 0 14" />
          </>
        ) : (
          <>
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </>
        )}
      </svg>
    </button>
  );
}
