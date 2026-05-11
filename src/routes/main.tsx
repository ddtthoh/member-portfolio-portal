import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { CursorGlow } from "@/components/cursor-glow";

export const Route = createFileRoute("/main")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <div className="marketing-root relative overflow-x-hidden">
      <div className="m-grid" />
      <div className="m-noise" />
      <CursorGlow />
      <MarketingNav />
      <main className="relative z-10 pt-20">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
}
