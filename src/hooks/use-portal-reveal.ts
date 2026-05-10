import { useEffect, type RefObject } from "react";

/**
 * Editorial cinematic scroll-reveal for the portal.
 *
 * Scans the portal page on mount, route changes and DOM mutations. Top-level
 * content blocks and explicit card targets get a clear book-like fade/lift as
 * they enter the viewport. The implementation is idempotent so React StrictMode
 * cannot leave off-screen elements initialized but unobserved.
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
      ".liquid-glass",
      ".portal-page > section",
      ".portal-page > article",
      ".portal-page > form",
      ".portal-page > div",
    ].join(", ");

    let main = mainRef?.current ?? document.querySelector("main");
    let mo: MutationObserver | null = null;
    let io: IntersectionObserver | null = null;
    let rescanTimer: ReturnType<typeof setTimeout> | null = null;
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
        main.querySelectorAll<HTMLElement>(revealSelector)
      ).filter((el) => {
        if (el.hidden || el.closest("[data-radix-portal]")) return false;
        const nestedReveal = el.parentElement?.closest(".reveal-on-scroll");
        return !nestedReveal;
      });

      if (els.length === 0) return;

      els.forEach((el) => {
        if (el.dataset.revealInit !== "1") {
          el.dataset.revealInit = "1";
          el.classList.add("reveal-on-scroll");
        }

        if (reduce) {
          el.classList.add("is-revealed");
          return;
        }

        if (el.classList.contains("is-revealed")) return;

        const rect = el.getBoundingClientRect();
        const inView = rect.top < vh * 0.92 && rect.bottom > 0;
        if (inView) {
          reveal(el, 180 + initialBatchIndex * 150);
          initialBatchIndex++;
        } else if (io) {
          io.observe(el);
        }
      });
    }

    function setup() {
      main = mainRef?.current ?? document.querySelector("main");
      if (!main) return false;

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            if (el.classList.contains("is-revealed")) return;
            reveal(el, 60);
            io!.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -90px 0px" }
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
        mo?.disconnect();
        io?.disconnect();
      };
    }

    return () => {
      if (rescanTimer) clearTimeout(rescanTimer);
      mo?.disconnect();
      io?.disconnect();
    };
  }, [scopeKey]);
}
