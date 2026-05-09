import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  Copy,
  Check,
  Download,
  Share2,
  Link2,
  ShieldCheck,
  IdCard,
} from "lucide-react";

export const Route = createFileRoute("/portal/qr-code")({
  component: QrCodePage,
});

const REFERRAL_BASE = "https://member.naslabtec.com/register";

function QrCodePage() {
  const { t } = useTranslation();
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

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    toast.success(t("pages.qrCode.toast.linkCopied"));
    setTimeout(() => setCopiedLink(false), 1800);
  };

  const copyId = async () => {
    await navigator.clipboard.writeText(memberId);
    setCopiedId(true);
    toast.success(t("pages.qrCode.toast.idCopied"));
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
      toast.success(t("pages.qrCode.toast.qrDownloaded"));
    } catch {
      toast.error(t("pages.qrCode.toast.downloadFailed"));
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("pages.qrCode.share.title"),
          text: t("pages.qrCode.share.text", { memberId }),
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
        eyebrow={t("account.label")}
        title={t("pages.qrCode.title")}
        description={t("pages.qrCode.description")}
        actions={
          <div className="hidden items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" /> {t("pages.qrCode.verifiedReferral")}
          </div>
        }
      />

      {/* Mobile-only verified badge */}
      <div className="mt-3 flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold md:hidden w-fit">
        <ShieldCheck className="h-3.5 w-3.5" /> {t("pages.qrCode.verifiedReferral")}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* === Premium QR card === */}
        <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
          <div ref={cardRef} className="relative">
            {/* Decorative corners */}
            <CornerOrnaments />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_-20%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_60%)]" />

            <div className="relative px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
              {/* QR */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px]"
              >
                <div className="relative rounded-2xl bg-gradient-to-br from-gold/40 via-gold/20 to-gold/40 p-[1.5px] shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--gold)_60%,transparent)]">
                  <div className="rounded-2xl bg-white p-3 sm:p-4">
                    <img
                      src={qrSrc}
                      alt={t("pages.qrCode.qrAlt", { memberId })}
                      className="h-auto w-full select-none"
                      draggable={false}
                    />
                  </div>
                </div>
                {/* Center monogram badge */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background ring-2 ring-gold shadow-[0_0_18px_color-mix(in_oklab,var(--gold)_55%,transparent)] sm:h-12 sm:w-12">
                    <span className="font-serif text-base font-bold text-gold sm:text-lg">N</span>
                  </div>
                </div>
              </motion.div>

              {/* Footer */}
              <div className="mt-4 border-t border-gold/15 pt-3 text-center sm:mt-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gold/55">
                  {t("pages.qrCode.scanToRegister")}
                </p>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* === Side panel: link + actions === */}
        <div className="space-y-4">
          <SpotlightCard className="liquid-glass rounded-2xl">
            <div className="border-b border-gold/10 px-4 py-3 sm:px-5 sm:py-3.5">
              <h3 className="font-serif text-[15px] font-semibold text-gold">
                {t("pages.qrCode.referralLink")}
              </h3>
            </div>
            <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
              <div className="group relative overflow-hidden rounded-lg border border-gold/20 bg-background/40">
                <div className="flex min-w-0 items-center gap-2 px-3 py-2.5">
                  <Link2 className="h-4 w-4 shrink-0 text-gold/70" />
                  <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-foreground/90 sm:text-[13px]">
                    {referralUrl}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  variant="outline"
                  onClick={copyLink}
                  className="w-full border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  {copiedLink ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copiedLink ? t("pages.deposit.toast.copied") : t("pages.qrCode.copyLink")}
                </Button>
                <Button
                  onClick={downloadQR}
                  className="w-full bg-gradient-to-r from-gold to-amber-400 text-background hover:opacity-90"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("pages.qrCode.downloadQr")}
                </Button>
                <Button
                  variant="outline"
                  onClick={share}
                  className="w-full border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {t("pages.qrCode.shareBtn")}
                </Button>
                <Button
                  variant="outline"
                  onClick={copyId}
                  className="w-full border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  {copiedId ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <IdCard className="mr-2 h-4 w-4" />
                  )}
                  {copiedId ? t("pages.deposit.toast.copied") : t("pages.qrCode.copyMemberId")}
                </Button>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="liquid-glass rounded-2xl">
            <div className="border-b border-gold/10 px-4 py-3 sm:px-5 sm:py-3.5">
              <h3 className="font-serif text-[15px] font-semibold text-gold">
                {t("pages.qrCode.howItWorks")}
              </h3>
            </div>
            <ol className="space-y-3 px-4 py-4 text-sm text-foreground/85 sm:px-5 sm:py-5">
              {[
                t("pages.qrCode.steps.1"),
                t("pages.qrCode.steps.2"),
                t("pages.qrCode.steps.3"),
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
