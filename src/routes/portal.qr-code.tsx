import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  QrCode as QrCodeIcon,
  Copy,
  Check,
  Download,
  Share2,
  Link2,
  Sparkles,
  ShieldCheck,
  IdCard,
} from "lucide-react";

export const Route = createFileRoute("/portal/qr-code")({
  component: QrCodePage,
});

const REFERRAL_BASE = "https://member.naslabtec.com/register";

function QrCodePage() {
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const memberId = useMemo(() => {
    const raw = (user?.id ?? "").replace(/-/g, "");
    let h = 0;
    for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0;
    return String(h % 99999999).padStart(8, "0");
  }, [user?.id]);

  const referralUrl = `${REFERRAL_BASE}?referral=${memberId}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=560x560&margin=2&qzone=2&format=png&ecc=H&color=0a0a0a&bgcolor=ffffff&data=${encodeURIComponent(
    referralUrl,
  )}`;

  const memberName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Member";

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    toast.success("Referral link copied");
    setTimeout(() => setCopiedLink(false), 1800);
  };

  const copyId = async () => {
    await navigator.clipboard.writeText(memberId);
    setCopiedId(true);
    toast.success("Member ID copied");
    setTimeout(() => setCopiedId(false), 1800);
  };

  const downloadQR = async () => {
    try {
      const res = await fetch(qrSrc);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `naslab-referral-${memberId}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("QR code downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join via my referral",
          text: `Register using my member ID ${memberId}`,
          url: referralUrl,
        });
      } catch {
        /* cancelled */
      }
    } else {
      copyLink();
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="My Referral QR Code"
        description="Your unique invitation card. Share with prospective clients to register under your account."
        actions={
          <div className="hidden items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Referral
          </div>
        }
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* === Premium QR card === */}
        <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
          <div ref={cardRef} className="relative">
            {/* Decorative corners */}
            <CornerOrnaments />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_-20%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_60%)]" />

            <div className="relative px-6 pt-6 pb-5">
              {/* Brand row */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-gold">
                  <Sparkles className="h-3 w-3" />
                  Naslabtec • Private Invitation
                </div>
                <span className="rounded-full border border-gold/30 bg-background/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-gold/80">
                  No. {memberId.slice(0, 4)}
                </span>
              </div>

              {/* Member */}
              <div className="mt-5">
                <div className="text-[10px] uppercase tracking-[0.22em] text-gold/60">
                  Introduced by
                </div>
                <div className="mt-1 font-serif text-[22px] font-semibold leading-tight text-gold">
                  {memberName}
                </div>
              </div>

              {/* QR */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative mx-auto mt-5 w-full max-w-[300px]"
              >
                <div className="relative rounded-2xl bg-gradient-to-br from-gold/40 via-gold/20 to-gold/40 p-[1.5px] shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--gold)_60%,transparent)]">
                  <div className="rounded-2xl bg-white p-4">
                    <img
                      src={qrSrc}
                      alt={`Referral QR for member ${memberId}`}
                      className="h-auto w-full select-none"
                      draggable={false}
                    />
                  </div>
                </div>
                {/* Center monogram badge */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background ring-2 ring-gold shadow-[0_0_18px_color-mix(in_oklab,var(--gold)_55%,transparent)]">
                    <span className="font-serif text-lg font-bold text-gold">N</span>
                  </div>
                </div>
              </motion.div>

              {/* Member ID */}
              <div className="mt-5 flex items-center justify-center gap-2 text-center">
                <IdCard className="h-3.5 w-3.5 text-gold/70" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-gold/60">
                  Member ID
                </span>
                <span className="font-mono text-sm font-semibold tracking-[0.2em] text-foreground">
                  {memberId}
                </span>
              </div>

              {/* Footer */}
              <div className="mt-5 border-t border-gold/15 pt-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gold/55">
                  Scan to register under this advisor
                </p>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* === Side panel: link + actions === */}
        <div className="space-y-4">
          <SpotlightCard className="liquid-glass rounded-2xl">
            <div className="border-b border-gold/10 px-5 py-3.5">
              <h3 className="font-serif text-[15px] font-semibold text-gold">
                Referral Link
              </h3>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-gold/50">
                Direct registration URL with your member tag
              </p>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div className="group relative overflow-hidden rounded-lg border border-gold/20 bg-background/40">
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <Link2 className="h-4 w-4 shrink-0 text-gold/70" />
                  <span className="truncate font-mono text-[13px] text-foreground/90">
                    {referralUrl}
                  </span>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  variant="outline"
                  onClick={copyLink}
                  className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  {copiedLink ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copiedLink ? "Copied" : "Copy Link"}
                </Button>
                <Button
                  onClick={downloadQR}
                  className="bg-gradient-to-r from-gold to-amber-400 text-background hover:opacity-90"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR
                </Button>
                <Button
                  variant="outline"
                  onClick={share}
                  className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={copyId}
                  className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  {copiedId ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <IdCard className="mr-2 h-4 w-4" />
                  )}
                  {copiedId ? "Copied" : "Copy Member ID"}
                </Button>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="liquid-glass rounded-2xl">
            <div className="border-b border-gold/10 px-5 py-3.5">
              <h3 className="font-serif text-[15px] font-semibold text-gold">
                How it works
              </h3>
            </div>
            <ol className="space-y-3 px-5 py-5 text-sm text-foreground/85">
              {[
                "Send your QR code or referral link to your client.",
                "They scan or click — and land on the registration page pre-filled with your member tag.",
                "Once they complete sign-up, they are permanently linked to your network.",
              ].map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-[11px] font-semibold text-gold">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ol>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}

function CornerOrnaments() {
  const cls = "absolute h-5 w-5 border-gold/50";
  return (
    <>
      <div className={`${cls} left-3 top-3 border-l border-t`} />
      <div className={`${cls} right-3 top-3 border-r border-t`} />
      <div className={`${cls} left-3 bottom-3 border-l border-b`} />
      <div className={`${cls} right-3 bottom-3 border-r border-b`} />
    </>
  );
}
