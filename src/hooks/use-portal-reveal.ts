import { useEffect, type RefObject } from "react";

/**
 * Bidirectional scroll reveal for the portal.
 *
 * Top-level portal blocks fade/lift into view, and fade/lift back out when
 * they leave the viewport. To keep the first scroll smooth we:
 *  - Pre-warm GPU layers in idle time after mount (avoids first-scroll jank).
 *  - Apply `will-change` only when an element is near the viewport, and remove
 *    it after it settles, so we don't keep dozens of layers alive.
 *  - Stagger simultaneous transitions by ~25ms so a single frame doesn't kick
 *    off many transitions at once.
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
    let prewarmIo: IntersectionObserver | null = null;
    let rescanTimer: ReturnType<typeof setTimeout> | null = null;
    let firstPass = true;
    let entryBatchTick = 0;
    let lastBatchFrame = -1;

    const ric: (cb: () => void) => void =
      (window as any).requestIdleCallback?.bind(window) ??
      ((cb: () => void) => setTimeout(cb, 1));

    function setWillChange(el: HTMLElement, on: boolean) {
      el.style.willChange = on ? "opacity, transform" : "";
    }

    function scan() {
      if (!main) return;
      const all = main.querySelectorAll<HTMLElement>(revealSelector);
      const fresh: HTMLElement[] = [];
      all.forEach((el) => {
        if (el.dataset.revealInit === "1") return;
        if (el.hidden || el.closest("[data-radix-portal]")) return;
        if (el.parentElement?.closest(".reveal-on-scroll")) return;
        fresh.push(el);
      });

      let initialIndex = 0;
      fresh.forEach((el) => {
        el.dataset.revealInit = "1";
        el.classList.add("reveal-on-scroll");

        if (reduce) {
          el.classList.add("is-revealed");
          return;
        }

        const rect = el.getBoundingClientRect();
        const inViewNow = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
        if (firstPass && inViewNow) {
          setWillChange(el, true);
          const delay = 80 + initialIndex * 110;
          el.style.setProperty("--reveal-delay", `${delay}ms`);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => el.classList.add("is-revealed"))
          );
          initialIndex++;
          // Drop will-change after the transition completes (~0.75s + delay).
          setTimeout(() => setWillChange(el, false), 1200 + delay);
        }

        io?.observe(el);
        prewarmIo?.observe(el);
      });
      firstPass = false;

      // Pre-warm: in idle time, briefly add will-change to off-screen reveal
      // elements so the compositor allocates layers before the user scrolls.
      if (fresh.length) {
        ric(() => {
          fresh.forEach((el, i) => {
            if (el.classList.contains("is-revealed")) return;
            setWillChange(el, true);
            // Release after a short window — long enough for the browser to
            // promote the layer, short enough to not hog GPU memory.
            setTimeout(() => {
              if (!el.classList.contains("is-revealed")) setWillChange(el, false);
            }, 600 + i * 20);
          });
        });
      }
    }

    function setup() {
      main = mainRef?.current ?? document.querySelector("main");
      if (!main) return false;

      if (!reduce) {
        io = new IntersectionObserver(
          (entries) => {
            // Stagger transitions that fire on the same frame so the main
            // thread doesn't start dozens of animations simultaneously.
            const now = performance.now();
            if (now - lastBatchFrame > 32) {
              entryBatchTick = 0;
              lastBatchFrame = now;
            }
            entries.forEach((entry) => {
              const el = entry.target as HTMLElement;
              if (entry.isIntersecting) {
                setWillChange(el, true);
                const delay = entryBatchTick * 25;
                el.style.setProperty("--reveal-delay", `${delay}ms`);
                entryBatchTick++;
                el.classList.add("is-revealed");
                // Remove will-change after the transition has settled.
                setTimeout(() => {
                  if (el.classList.contains("is-revealed")) setWillChange(el, false);
                }, 900 + delay);
              } else {
                setWillChange(el, true);
                el.classList.remove("is-revealed");
                setTimeout(() => {
                  if (!el.classList.contains("is-revealed")) setWillChange(el, false);
                }, 900);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );

        // Wider rootMargin observer just for pre-warming layers before they
        // actually need to animate. Doesn't toggle classes.
        prewarmIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const el = entry.target as HTMLElement;
              if (entry.isIntersecting && !el.classList.contains("is-revealed")) {
                setWillChange(el, true);
              }
            });
          },
          { rootMargin: "400px 0px 400px 0px" }
        );
      }

      scan();

      mo = new MutationObserver(() => {
        if (rescanTimer) clearTimeout(rescanTimer);
        rescanTimer = setTimeout(scan, 80);
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
        prewarmIo?.disconnect();
      };
    }

    return () => {
      if (rescanTimer) clearTimeout(rescanTimer);
      mo?.disconnect();
      io?.disconnect();
      prewarmIo?.disconnect();
    };
  }, [scopeKey]);
}
