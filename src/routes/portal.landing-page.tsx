import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, ImageIcon, FileText, MessageCircle, Link2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deriveMemberId } from "@/lib/member-id";
import { MobilePoster } from "@/components/marketing/mobile-poster";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/portal/landing-page")({
  component: MyLandingPage,
});

function MyLandingPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const memberId = useMemo(() => deriveMemberId(user?.id), [user?.id]);
  const inviteUrl = `https://invite.naslabtec.com/${memberId}`;
  const localPreviewPath = `/invite/${memberId}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=560x560&margin=2&qzone=2&format=png&ecc=H&color=0a0a0a&bgcolor=ffffff&data=${encodeURIComponent(inviteUrl)}`;

  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Invite link copied");
    setTimeout(() => setCopied(false), 1800);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `You're invited to NASLAB. Earn while the market sleeps with institutional-grade MEV trading.\n\n${inviteUrl}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const captureCanvas = async () => {
    const target = previewRef.current?.querySelector(".poster-root") as HTMLElement | null;
    if (!target) throw new Error("Poster not ready");
    const html2canvas = (await import("html2canvas-pro")).default;
    return html2canvas(target, {
      backgroundColor: "#050403",
      scale: 2,
      width: 1080,
      windowWidth: 1080,
      windowHeight: target.scrollHeight,
    });
  };

  const downloadPNG = async () => {
    toast.loading("Generating PNG...", { id: "png" });
    try {
      const canvas = await captureCanvas();
      const link = document.createElement("a");
      link.download = `naslab-invite-${memberId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("PNG downloaded", { id: "png" });
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PNG", { id: "png" });
    }
  };

  const downloadPDF = async () => {
    toast.loading("Generating PDF...", { id: "pdf" });
    try {
      const canvas = await captureCanvas();
      const { jsPDF } = await import("jspdf");
      // Use canvas pixel dimensions as the PDF page size so the poster lives
      // on ONE continuous page (no A4 slicing).
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
        compress: true,
      });
      const img = canvas.toDataURL("image/jpeg", 0.92);
      pdf.addImage(img, "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(`naslab-invite-${memberId}.pdf`);
      toast.success("PDF downloaded", { id: "pdf" });
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF", { id: "pdf" });
    }
  };

  const openFull = () => window.open(localPreviewPath, "_blank");

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <PageHeader
        eyebrow="Marketing"
        title="My Landing Page"
        description="Single-piece mobile poster for sharing on WhatsApp. Download as PNG or PDF, or scan the QR. The full desktop site opens in a new tab."
      />

      <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        {/* === Inline poster preview === */}
        <SpotlightCard className="liquid-glass self-start overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-gold/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 truncate font-mono text-[11px] text-foreground/60">
                {inviteUrl}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-gold/60">
              Live Preview
            </span>
          </div>

          <div className="relative w-full overflow-hidden bg-[#050403] p-4">
            <div className="mx-auto w-full">
              <div
                ref={previewRef}
                style={{
                  width: "1080px",
                  transform: "scale(var(--lp-scale, 0.55))",
                  transformOrigin: "top left",
                }}
                className="[--lp-scale:0.42] sm:[--lp-scale:0.55] md:[--lp-scale:0.62] lg:[--lp-scale:0.5] xl:[--lp-scale:0.62]"
              >
                <MobilePoster memberId={memberId} />
              </div>
              <ScaledSpacer targetRef={previewRef} />
            </div>
          </div>
        </SpotlightCard>

        {/* === Side panel === */}
        <div className="space-y-4">
          <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
            <div className="border-b border-gold/10 px-5 py-3.5">
              <h3 className="font-serif text-[15px] font-semibold text-gold">Your Invite Link</h3>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div className="group relative overflow-hidden rounded-lg border border-gold/20 bg-background/40">
                <div className="flex min-w-0 items-center gap-2 px-3 py-2.5">
                  <Link2 className="h-4 w-4 shrink-0 text-gold/70" />
                  <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-foreground/90 sm:text-[13px]">
                    {inviteUrl}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={copyLink}
                  className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  onClick={shareWhatsApp}
                  className="bg-emerald-500/90 text-white hover:bg-emerald-500"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
            <div className="border-b border-gold/10 px-5 py-3.5">
              <h3 className="font-serif text-[15px] font-semibold text-gold">Share & Download</h3>
            </div>
            <div className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-2">
              <Button
                onClick={downloadPDF}
                className="bg-gradient-to-r from-gold to-amber-400 text-background hover:opacity-90"
              >
                <FileText className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={downloadPNG}
                className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
              <Button
                variant="outline"
                onClick={openFull}
                className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold sm:col-span-2"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Full Page (Desktop Site)
              </Button>
            </div>
            <div className="border-t border-gold/10 bg-background/30 px-5 py-3 text-[11px] leading-relaxed text-foreground/55">
              <strong className="text-gold/80">Tip:</strong> The PNG / PDF is a single-piece
              mobile poster optimized for WhatsApp forwarding. The "Open Full Page" link shows the
              full multi-section website on desktop.
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}

/** Reserves the right amount of vertical space for the scaled preview. */
function ScaledSpacer({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const [h, setH] = useState(900);
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const compute = () => {
      const m = getComputedStyle(el).transform;
      let scale = 0.5;
      if (m && m.startsWith("matrix(")) {
        const parts = m.slice(7, -1).split(",").map((v) => parseFloat(v));
        if (!Number.isNaN(parts[0])) scale = parts[0];
      }
      setH(el.offsetHeight * scale);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [targetRef]);
  return <div aria-hidden style={{ height: h }} />;
}
