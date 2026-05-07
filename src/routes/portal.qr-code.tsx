import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { QrCode } from "lucide-react";

export const Route = createFileRoute("/portal/qr-code")({
  component: QrCodePage,
});

function QrCodePage() {
  const { user } = useAuth();
  const value = user?.id ?? "guest";
  // Use a public QR generation endpoint to render the code as an image.
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(value)}`;

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="My QR Code"
        description="Share this QR code so others can quickly find or refer you."
      />

      <SpotlightCard className="liquid-glass mt-4 rounded-2xl p-8">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-5 text-center">
          <div className="rounded-xl border border-gold/30 bg-background/60 p-4 shadow-[0_0_24px_-8px_color-mix(in_oklab,var(--gold)_50%,transparent)]">
            <img src={src} alt="My QR Code" className="h-64 w-64" />
          </div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
            <QrCode className="h-3.5 w-3.5" />
            Personal QR
          </div>
          <p className="break-all font-mono text-xs text-muted-foreground">{value}</p>
        </div>
      </SpotlightCard>
    </div>
  );
}
