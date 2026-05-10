import { useEffect } from "react";

/**
 * Editorial cinematic scroll-reveal for the portal.
 *
 * Watches the <main> subtree with a MutationObserver so it picks up cards
 * mounted by AnimatePresence's `mode="wait"` page transitions (which mount
 * the new route AFTER the old one finishes exiting). Any `.liquid-glass`
 * card or `[data-reveal]` element gets a 24px lift + opacity fade with
 * luxury easing the moment it enters the viewport. Cards already in view
 * on first paint stagger by 80ms each.
 */
export function usePortalReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const main = document.querySelector("main");
    if (!main) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.dataset.revealed === "1") return;
          el.dataset.revealed = "1";
          el.style.setProperty("--reveal-delay", "0ms");
          el.classList.add("is-revealed");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    let initialBatchIndex = 0;
    let initialBatchTimer: ReturnType<typeof setTimeout> | null = null;

    function processNewElements() {
      const vh = window.innerHeight;
      const els = Array.from(
        main!.querySelectorAll<HTMLElement>(".liquid-glass, [data-reveal]")
      ).filter((el) => el.dataset.revealInit !== "1");

      if (els.length === 0) return;

      // Reset stagger counter for each fresh batch (e.g. new route mount).
      // We debounce so multiple mutations within a tick share the same batch.
      if (initialBatchTimer) clearTimeout(initialBatchTimer);
      initialBatchTimer = setTimeout(() => {
        initialBatchIndex = 0;
      }, 50);

      els.forEach((el) => {
        el.dataset.revealInit = "1";
        el.classList.add("reveal-on-scroll");

        if (reduce) {
          el.classList.add("is-revealed");
          el.dataset.revealed = "1";
          return;
        }

        const rect = el.getBoundingClientRect();
        const inView = rect.top < vh * 0.95 && rect.bottom > 0;
        if (inView) {
          el.dataset.revealed = "1";
          el.style.setProperty("--reveal-delay", `${initialBatchIndex * 80}ms`);
          initialBatchIndex++;
          requestAnimationFrame(() =>
            requestAnimationFrame(() => el.classList.add("is-revealed"))
          );
        } else {
          io.observe(el);
        }
      });
    }

    processNewElements();

    const mo = new MutationObserver(() => {
      processNewElements();
    });
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      if (initialBatchTimer) clearTimeout(initialBatchTimer);
      mo.disconnect();
      io.disconnect();
    };
  }, []);
}
