import { useEffect } from "react";

/**
 * Editorial cinematic scroll-reveal for the portal.
 *
 * Scans <main> on mount and on every DOM mutation. Any `.liquid-glass` card
 * or `[data-reveal]` element gets a fade + lift + subtle blur clear when it
 * enters the viewport. First-screen cards stagger by 110ms so the initial
 * paint feels like pages turning.
 */
export function usePortalReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let main = document.querySelector("main");
    let mo: MutationObserver | null = null;
    let io: IntersectionObserver | null = null;
    let rescanTimer: ReturnType<typeof setTimeout> | null = null;
    let batchResetTimer: ReturnType<typeof setTimeout> | null = null;
    let initialBatchIndex = 0;

    function reveal(el: HTMLElement, delay: number) {
      el.style.setProperty("--reveal-delay", `${delay}ms`);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => el.classList.add("is-revealed"))
      );
    }

    function processNewElements() {
      if (!main) return;
      const vh = window.innerHeight;
      const els = Array.from(
        main.querySelectorAll<HTMLElement>(".liquid-glass, [data-reveal]")
      ).filter((el) => el.dataset.revealInit !== "1");

      if (els.length === 0) return;

      // Reset stagger counter for each fresh batch (route mount, late content).
      if (batchResetTimer) clearTimeout(batchResetTimer);
      batchResetTimer = setTimeout(() => { initialBatchIndex = 0; }, 80);

      els.forEach((el) => {
        el.dataset.revealInit = "1";
        el.classList.add("reveal-on-scroll");

        if (reduce) {
          el.classList.add("is-revealed");
          return;
        }

        const rect = el.getBoundingClientRect();
        const inView = rect.top < vh * 0.95 && rect.bottom > 0;
        if (inView) {
          reveal(el, initialBatchIndex * 110);
          initialBatchIndex++;
        } else if (io) {
          io.observe(el);
        }
      });
    }

    function setup() {
      main = document.querySelector("main");
      if (!main) return false;

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            if (el.classList.contains("is-revealed")) return;
            reveal(el, 0);
            io!.unobserve(el);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );

      processNewElements();

      mo = new MutationObserver(() => {
        if (rescanTimer) clearTimeout(rescanTimer);
        rescanTimer = setTimeout(processNewElements, 30);
      });
      mo.observe(main, { childList: true, subtree: true });
      return true;
    }

    if (!setup()) {
      // <main> may not be mounted yet (auth loading). Poll briefly.
      const start = Date.now();
      const poll = setInterval(() => {
        if (setup() || Date.now() - start > 5000) clearInterval(poll);
      }, 100);
      return () => {
        clearInterval(poll);
        if (rescanTimer) clearTimeout(rescanTimer);
        if (batchResetTimer) clearTimeout(batchResetTimer);
        mo?.disconnect();
        io?.disconnect();
      };
    }

    return () => {
      if (rescanTimer) clearTimeout(rescanTimer);
      if (batchResetTimer) clearTimeout(batchResetTimer);
      mo?.disconnect();
      io?.disconnect();
    };
  }, []);
}
