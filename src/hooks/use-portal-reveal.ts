import { useEffect, type RefObject } from "react";

/**
 * Lightweight bidirectional scroll reveal.
 * - One IntersectionObserver toggles `is-revealed` on/off.
 * - No inline `will-change`, no per-element setTimeout, no rescan stagger.
 *   CSS handles the transition; we don't write styles during scroll.
 * - Tracks scroll state on <html> via `is-scrolling` class so heavy CSS
 *   effects (shadows, glows, transitions) can be paused while scrolling.
 */
export function usePortalReveal(
  scopeKey = "",
  mainRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealSelector = [
      "[data-reveal]",
      ".portal-reveal-target",
      ".portal-page > section",
      ".portal-page > article",
      ".portal-page > form",
      ".portal-page > div > *",
      ".portal-page > section > *",
    ].join(", ");

    let main = mainRef?.current ?? document.querySelector("main");
    let mo: MutationObserver | null = null;
    let io: IntersectionObserver | null = null;
    let rescanTimer: ReturnType<typeof setTimeout> | null = null;
    let firstPass = true;

    function scan() {
      if (!main) return;
      const all = main.querySelectorAll<HTMLElement>(revealSelector);
      all.forEach((el) => {
        if (el.dataset.revealInit === "1") return;
        if (el.hidden || el.closest("[data-radix-portal]")) return;
        if (el.parentElement?.closest(".reveal-on-scroll")) return;

        el.dataset.revealInit = "1";
        el.classList.add("reveal-on-scroll");

        if (reduce) {
          el.classList.add("is-revealed");
          return;
        }

        // First-pass: anything already in view is marked synchronously so the
        // first scroll doesn't inherit queued animation-frame work.
        const rect = el.getBoundingClientRect();
        const inViewNow = rect.top < window.innerHeight && rect.bottom > 0;
        if (firstPass && inViewNow) {
          el.classList.add("is-revealed");
        }

        io?.observe(el);
      });
      firstPass = false;
    }

    function setup() {
      main = mainRef?.current ?? document.querySelector("main");
      if (!main) return false;

      if (!reduce) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const el = entry.target as HTMLElement;
              if (entry.isIntersecting) {
                el.classList.add("is-revealed");
              } else {
                el.classList.remove("is-revealed");
              }
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
        );
      }

      scan();

      mo = new MutationObserver(() => {
        if (rescanTimer) clearTimeout(rescanTimer);
        rescanTimer = setTimeout(scan, 120);
      });
      mo.observe(main, { childList: true, subtree: true });
      return true;
    }

    // ---- scroll-state tracking (global) ----
    // Adds .is-scrolling to <html> while the user is scrolling so CSS can
    // disable expensive effects (shadows, filters, transitions). One global
    // listener — cheap.
    const root = document.documentElement;
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (!root.classList.contains("is-scrolling")) {
        root.classList.add("is-scrolling");
      }
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        root.classList.remove("is-scrolling");
      }, 140);
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });

    if (!setup()) {
      const start = Date.now();
      const poll = setInterval(() => {
        if (setup() || Date.now() - start > 5000) clearInterval(poll);
      }, 100);
      return () => {
        clearInterval(poll);
        if (rescanTimer) clearTimeout(rescanTimer);
        if (scrollEndTimer) clearTimeout(scrollEndTimer);
        window.removeEventListener("scroll", onScroll, { capture: true } as any);
        root.classList.remove("is-scrolling");
        mo?.disconnect();
        io?.disconnect();
      };
    }

    return () => {
      if (rescanTimer) clearTimeout(rescanTimer);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      window.removeEventListener("scroll", onScroll, { capture: true } as any);
      root.classList.remove("is-scrolling");
      mo?.disconnect();
      io?.disconnect();
    };
  }, [scopeKey]);
}
