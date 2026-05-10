import { useEffect } from "react";

/**
 * Editorial cinematic scroll-reveal for the portal.
 * Observes `.liquid-glass` cards and any `[data-reveal]` element inside <main>,
 * then fades them in with a 24px lift + luxury easing as they enter the viewport.
 * Elements already in the viewport on mount get a small stagger so the page
 * settles in like a printed annual report rather than popping in at once.
 */
export function usePortalReveal(routeKey: string) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const main = document.querySelector("main");
    if (!main) return;

    // Defer one frame so route transition mounts the new content first.
    const raf = requestAnimationFrame(() => {
      const els = Array.from(
        main.querySelectorAll<HTMLElement>(".liquid-glass, [data-reveal]")
      ).filter((el) => !el.dataset.revealInit);

      els.forEach((el) => {
        el.dataset.revealInit = "1";
        el.classList.add("reveal-on-scroll");
      });

      if (reduce) {
        els.forEach((el) => el.classList.add("is-revealed"));
        return;
      }

      const vh = window.innerHeight;
      let initialIndex = 0;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            if (el.dataset.revealed) return;
            el.dataset.revealed = "1";
            el.style.setProperty("--reveal-delay", "0ms");
            el.classList.add("is-revealed");
            io.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < vh * 0.95 && rect.bottom > 0;
        if (inView) {
          el.dataset.revealed = "1";
          el.style.setProperty("--reveal-delay", `${initialIndex * 80}ms`);
          requestAnimationFrame(() => el.classList.add("is-revealed"));
          initialIndex++;
        } else {
          io.observe(el);
        }
      });

      // Save observer for cleanup via a closure on the element set
      (main as unknown as { __revealIO?: IntersectionObserver }).__revealIO?.disconnect();
      (main as unknown as { __revealIO?: IntersectionObserver }).__revealIO = io;
    });

    return () => {
      cancelAnimationFrame(raf);
      const m = main as unknown as { __revealIO?: IntersectionObserver };
      m.__revealIO?.disconnect();
      m.__revealIO = undefined;
      // Reset markers so next route re-applies
      main.querySelectorAll<HTMLElement>("[data-reveal-init]").forEach((el) => {
        delete el.dataset.revealInit;
        delete el.dataset.revealed;
      });
    };
  }, [routeKey]);
}
