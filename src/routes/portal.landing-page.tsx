import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, Download, Share2, ImageIcon, FileText, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deriveMemberId } from "@/lib/member-id";

export const Route = createFileRoute("/portal/landing-page")({
  component: MyLandingPage,
});

function MyLandingPage() {
  const { user } = useAuth();
  const memberId = useMemo(() => deriveMemberId(user?.id), [user?.id]);
  const inviteUrl = `https://invite.naslabtec.com/${memberId}`;
  const localPreviewPath = `/invite/${memberId}`;
  const printPreviewPath = `/invite/${memberId}?print=1`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=560x560&margin=2&qzone=2&format=png&ecc=H&color=0a0a0a&bgcolor=ffffff&data=${encodeURIComponent(inviteUrl)}`;

  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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

  const downloadPNG = async () => {
    if (!iframeRef.current?.contentDocument) {
      toast.error("Preview not ready yet");
      return;
    }
    toast.loading("Generating PNG...", { id: "png" });
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const target = iframeRef.current.contentDocument.querySelector(".landing-root") as HTMLElement;
      if (!target) throw new Error("no target");
      const canvas = await html2canvas(target, {
        backgroundColor: "#07080c",
        scale: 1,
        windowWidth: 1280,
        windowHeight: target.scrollHeight,
      });
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

  const downloadPDF = () => {
    // Simplest reliable approach: open print view in new window, browser's print dialog → save as PDF
    const win = window.open(printPreviewPath, "_blank");
    if (!win) {
      toast.error("Pop-up blocked. Please allow pop-ups for this site.");
      return;
    }
    toast.info("Use your browser's Print → Save as PDF");
    win.addEventListener("load", () => {
      setTimeout(() => win.print(), 800);
    });
  };

  const openFull = () => window.open(localPreviewPath, "_blank");

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <PageHeader
        eyebrow="Marketing"
        title="My Landing Page"
        description="Your personalized invitation page. Share the link, scan the QR, or download as PDF / PNG to send to prospects."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        {/* === Live preview === */}
        <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-gold/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 truncate font-mono text-[11px] text-foreground/60">
                {inviteUrl}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openFull}
              className="text-gold hover:bg-gold/10 hover:text-gold"
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Open
            </Button>
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#07080c] sm:aspect-[16/10]">
            <iframe
              ref={iframeRef}
              src={localPreviewPath}
              title="Landing page preview"
              className="absolute left-0 top-0 origin-top-left"
              style={{
                width: "1280px",
                height: "1600px",
                transform: "scale(0.5)",
                border: 0,
              }}
            />
          </div>
        </SpotlightCard>

        {/* === Side panel: link + QR + actions === */}
        <div className="space-y-4">
          {/* Link card */}
          <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
            <div className="border-b border-gold/10 px-5 py-3.5">
              <h3 className="font-serif text-[15px] font-semibold text-gold">Your Invite Link</h3>
            </div>
            <div className="space-y-3 p-5">
              <div className="rounded-lg border border-gold/20 bg-background/40 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold/55">URL</div>
                <div className="mt-1 truncate font-mono text-[12px] text-foreground/90">
                  {inviteUrl}
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

          {/* QR card */}
          <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
            <div className="border-b border-gold/10 px-5 py-3.5">
              <h3 className="font-serif text-[15px] font-semibold text-gold">QR Code</h3>
            </div>
            <div className="p-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mx-auto w-full max-w-[220px]"
              >
                <div className="rounded-xl bg-gradient-to-br from-gold/40 via-gold/15 to-gold/40 p-[1.5px]">
                  <div className="rounded-xl bg-white p-3">
                    <img src={qrSrc} alt="Invite QR" className="h-auto w-full" />
                  </div>
                </div>
              </motion.div>
              <div className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-gold/55">
                Member #{memberId}
              </div>
            </div>
          </SpotlightCard>

          {/* Download / share */}
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
                Open Full Page
              </Button>
            </div>
            <div className="border-t border-gold/10 bg-background/30 px-5 py-3 text-[11px] leading-relaxed text-foreground/55">
              <strong className="text-gold/80">Tip:</strong> PDF uses your browser's print dialog
              — choose <em>Save as PDF</em> for the cleanest output. Video is intentionally
              excluded from PDF & PNG.
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
