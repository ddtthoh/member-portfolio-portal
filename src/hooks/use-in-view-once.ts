import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref + a boolean that flips to `true` the first time the element
 * intersects the viewport, and stays true forever after. Used to gate
 * entrance animations so they only run when the user actually sees the
 * element (instead of finishing off-screen before they scroll down).
 */
export function useInViewOnce<T extends Element = HTMLElement>(opts?: {
  amount?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    if (inView) return;

    // SSR-safe: if IntersectionObserver is missing, fire immediately.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      {
        threshold: opts?.amount ?? 0.25,
        rootMargin: opts?.rootMargin ?? "0px 0px -10% 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, opts?.amount, opts?.rootMargin]);

  return { ref, inView };
}
