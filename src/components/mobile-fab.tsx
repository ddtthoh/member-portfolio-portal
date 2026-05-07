import { useEffect, useState } from "react";
import { ArrowUp, Search } from "lucide-react";

/** Floating action cluster: command palette + scroll-to-top. Mobile/tablet only. */
export function MobileFab() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <div
      className="pointer-events-none fixed right-4 z-40 flex flex-col items-end gap-3 lg:hidden"
      style={{ bottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}
      aria-hidden={false}
    >
      {showTop && (
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-background/80 text-gold shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--gold)_55%,transparent)] backdrop-blur active:scale-95 transition-transform"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        aria-label="Search (Cmd K)"
        onClick={openPalette}
        className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-gradient-to-br from-gold/30 to-amber-500/20 text-gold shadow-[0_12px_36px_-10px_color-mix(in_oklab,var(--gold)_70%,transparent),0_0_0_1px_color-mix(in_oklab,var(--gold)_35%,transparent)] backdrop-blur-md active:scale-95 transition-transform"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-gold/15 blur-xl" />
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}
