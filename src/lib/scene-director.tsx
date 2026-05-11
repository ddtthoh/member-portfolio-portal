import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
function ensureRegistered() {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/** Pin a tall section and provide a scrub progress 0..1 to children via CSS var --p. */
export function PinScrub({
  children,
  className = "",
  height = "200vh",
  start = "top top",
  end = "+=120%",
}: {
  children: ReactNode;
  className?: string;
  height?: string;
  start?: string;
  end?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureRegistered();
    const w = wrap.current, i = inner.current;
    if (!w || !i) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const st = ScrollTrigger.create({
      trigger: w,
      start,
      end,
      pin: i,
      scrub: 0.6,
      onUpdate: (self) => {
        i.style.setProperty("--p", String(self.progress));
      },
    });
    return () => { st.kill(); };
  }, [start, end]);

  return (
    <div ref={wrap} className={className} style={{ height }}>
      <div ref={inner} className="h-screen w-full overflow-hidden">{children}</div>
    </div>
  );
}

/** Stagger-reveal children marked with [data-stagger]. */
export function StaggerReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = el.querySelectorAll<HTMLElement>("[data-stagger]");
    if (!items.length) return;
    gsap.set(items, { y: 36, opacity: 0 });
    const tween = gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 78%" },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

/** Draw-on for SVG paths with class `draw-path`. */
export function DrawOn({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const paths = Array.from(el.querySelectorAll<SVGPathElement | SVGLineElement | SVGCircleElement>(".draw-path"));
    paths.forEach((p) => {
      try {
        const len = (p as SVGPathElement).getTotalLength?.() ?? 200;
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      } catch { /* circles, etc. */ }
    });
    const tween = gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: "power2.out",
      stagger: 0.04,
      scrollTrigger: { trigger: el, start: "top 80%" },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
