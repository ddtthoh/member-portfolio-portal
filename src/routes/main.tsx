import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { CursorGlow } from "@/components/cursor-glow";
import { SmoothScrollProvider } from "@/lib/scroll";
import { PageTransition } from "@/components/marketing/page-transition";
import { LGDefs } from "@/components/marketing/lg-defs";
import { LoadingVeil } from "@/components/marketing/loading-veil";
import { SoundToggle } from "@/components/marketing/sound-toggle";
import { ClientOnly } from "@/components/marketing/client-only";

export const Route = createFileRoute("/main")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <SmoothScrollProvider>
      <div className="marketing-root relative overflow-x-hidden">
        <div className="m-grid" />
        <div className="m-noise" />
        <ClientOnly><LGDefs /></ClientOnly>
        <ClientOnly><LoadingVeil /></ClientOnly>
        <ClientOnly><CursorGlow /></ClientOnly>
        <ClientOnly><PageTransition /></ClientOnly>
        <MarketingNav />
        <main className="relative z-10 pt-20">
          <Outlet />
        </main>
        <MarketingFooter />
        <ClientOnly><SoundToggle /></ClientOnly>
      </div>
    </SmoothScrollProvider>
  );
}
