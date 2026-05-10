import { useEffect, type RefObject } from "react";

/**
 * Bidirectional scroll reveal for the portal.
 *
 * Top-level portal blocks fade/lift into view, and fade/lift back out when
 * they leave the viewport, so the user can scroll up and down repeatedly
 * and see the effect every time. No blur — nothing on the page should
 * ever look shrouded or foggy.
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
      ".portal-page > div",
    ].join(", ");

    let main = mainRef?.current ?? document.querySelector("main");
    let mo: MutationObserver | null = null;
    let io: IntersectionObserver | null = null;
    let rescanTimer: ReturnType<typeof setTimeout> | null = null;
    let firstPass = true;

    function scan() {
      if (!main) return;
      const els = Array.from(
        main.querySelectorAll<HTMLElement>(revealSelector)
      ).filter((el) => {
        if (el.hidden || el.closest("[data-radix-portal]")) return false;
        // Avoid nested reveal targets — only animate the outer block.
        const parent = el.parentElement?.closest(".reveal-on-scroll");
        return !parent;
      });

      let initialIndex = 0;
      els.forEach((el) => {
        if (el.dataset.revealInit === "1") return;
        el.dataset.revealInit = "1";
        el.classList.add("reveal-on-scroll");

        if (reduce) {
          el.classList.add("is-revealed");
          return;
        }

        // First-screen content: reveal immediately with a small stagger so
        // the page doesn't sit in a half-faded state on load.
        const rect = el.getBoundingClientRect();
        const inViewNow = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
        if (firstPass && inViewNow) {
          const delay = 80 + initialIndex * 110;
          el.style.setProperty("--reveal-delay", `${delay}ms`);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => el.classList.add("is-revealed"))
          );
          initialIndex++;
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
                el.style.setProperty("--reveal-delay", "0ms");
                el.classList.add("is-revealed");
              } else {
                el.classList.remove("is-revealed");
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );
      }

      scan();

      mo = new MutationObserver(() => {
        if (rescanTimer) clearTimeout(rescanTimer);
        rescanTimer = setTimeout(scan, 30);
      });
      mo.observe(main, { childList: true, subtree: true });
      return true;
    }

    if (!setup()) {
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
