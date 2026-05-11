import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Splits text into lines of words; each word slides up + fades on view.
 * Use one per line. Word wrap is handled by CSS — we wrap each word in a span.
 */
export function SplitLines({
  text, className, delay = 0, stagger = 60,
}: { text: string; className?: string; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.querySelectorAll(".sl-w").forEach((w) => (w as HTMLElement).style.opacity = "1");
      return;
    }
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          el.querySelectorAll<HTMLElement>(".sl-w").forEach((w, i) => {
            w.style.transitionDelay = `${delay + i * stagger}ms`;
            w.style.opacity = "1";
            w.style.transform = "translateY(0)";
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, stagger]);
  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="sl-w inline-block opacity-0 will-change-transform" style={{ transform: "translateY(28px)", transition: "opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1)" }}>
          {w}{i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
