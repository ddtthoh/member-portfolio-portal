import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Mail, UserCircle2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/portal/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] ?? "Member";

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Your account details and verification status."
      />

      <SpotlightCard className="liquid-glass mt-4 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/40">
            <UserCircle2 className="h-8 w-8 text-gold" />
          </div>
          <div>
            <div className="text-lg font-semibold">{name}</div>
            <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-gold/90">
              <ShieldCheck className="h-3 w-3" /> Verified
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-md border border-border/40 bg-background/30 p-4">
            <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Email</dt>
            <dd className="mt-1.5 flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4 text-gold" />
              {user?.email ?? "—"}
            </dd>
          </div>
          <div className="rounded-md border border-border/40 bg-background/30 p-4">
            <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Member ID</dt>
            <dd className="mt-1.5 font-mono text-xs text-foreground">{user?.id ?? "—"}</dd>
          </div>
        </dl>
      </SpotlightCard>
    </div>
  );
}
