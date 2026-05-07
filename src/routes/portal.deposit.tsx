import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Check, ArrowLeftRight, ChevronRight, QrCode, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/deposit")({
  component: DepositPage,
});

type Settings = {
  network: string;
  network_label: string;
  wallet_address: string;
  qr_url: string | null;
};

function DepositPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("deposit_settings")
      .select("network, network_label, wallet_address, qr_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setSettings(data ?? { network: "BSC", network_label: "BNB Smart Chain (BEP20)", wallet_address: "", qr_url: null }));
  }, [user]);

  const addr = settings?.wallet_address ?? "";
  const head = addr.slice(0, 6);
  const tail = addr.slice(-6);
  const middle = addr.length > 12 ? addr.slice(6, -6) : "";

  const copy = async () => {
    if (!addr) return;
    await navigator.clipboard.writeText(addr);
    setCopied(true);
    toast.success("Address copied");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div>
      <PageHeader
        eyebrow={t("pages.deposit.eyebrow")}
        title={t("pages.deposit.title")}
        description={t("pages.deposit.description")}
        actions={null}
      />

      <SpotlightCard className="liquid-glass mx-auto max-w-md rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center">
          <div className="rounded-2xl bg-white p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-gold/30">
            {settings?.qr_url ? (
              <img src={settings.qr_url} alt="Deposit QR code" className="h-56 w-56 rounded-lg object-contain" />
            ) : (
              <div className="flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-lg bg-muted/40 text-muted-foreground">
                <QrCode className="h-10 w-10" />
                <span className="text-[11px] uppercase tracking-[0.2em]">No QR uploaded</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Network</div>
              <div className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">{settings?.network ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{settings?.network_label ?? ""}</div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div>
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Deposit Address <ChevronRight className="h-3 w-3" />
            </div>
            <div className="mt-2 flex items-start gap-3">
              <div className="min-w-0 flex-1 break-all font-mono text-[15px] leading-relaxed text-foreground/80">
                {addr ? (
                  <>
                    <span className="font-semibold text-gold">{head}</span>
                    <span>{middle}</span>
                    <span className="font-semibold text-gold">{tail}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">No address set. Use Edit to configure.</span>
                )}
              </div>
              <button
                type="button"
                onClick={copy}
                disabled={!addr}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground transition hover:border-gold/50 hover:text-gold disabled:opacity-40"
                aria-label="Copy address"
              >
                {copied ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
