import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Floating search button. Mobile/tablet only. */
export function MobileFab() {
  const { t } = useTranslation();
  const openPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <div
      className="pointer-events-none fixed right-4 z-40 flex flex-col items-end gap-3 lg:hidden"
      style={{ bottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}
      aria-hidden={false}
    >
      <button
        type="button"
        aria-label={t("fab.searchLabel")}
        onClick={openPalette}
        className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-gradient-to-br from-gold/30 to-amber-500/20 text-gold shadow-[0_12px_36px_-10px_color-mix(in_oklab,var(--gold)_70%,transparent),0_0_0_1px_color-mix(in_oklab,var(--gold)_35%,transparent)] active:scale-95 transition-transform"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}
