import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check, ExternalLink, ImageIcon, FileText, MessageCircle, Link2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deriveMemberId } from "@/lib/member-id";
import { useTheme } from "@/components/theme-provider";
import posterLight from "@/assets/naslab-poster-light.png.asset.json";
import posterDark from "@/assets/naslab-poster-dark.png.asset.json";

export const Route = createFileRoute("/portal/landing-page")({
  component: MyLandingPage,
});

function MyLandingPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const memberId = useMemo(() => deriveMemberId(user?.id), [user?.id]);
  const inviteUrl = `https://invite.naslabtec.com/${memberId}`;
  const localPreviewPath = `/invite/${memberId}`;

  const posterUrl = theme === "light" ? posterLight.url : posterDark.url;
  const posterLabel = theme === "light" ? "light" : "dark";

  const [copied, setCopied] = useState(false);

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

  const fetchPosterBlob = async () => {
    const res = await fetch(posterUrl);
    if (!res.ok) throw new Error("Failed to fetch poster");
    return await res.blob();
  };

  const downloadPNG = async () => {
    toast.loading("Downloading PNG...", { id: "png" });
    try {
      const blob = await fetchPosterBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `naslab-invite-${posterLabel}-${memberId}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("PNG downloaded", { id: "png" });
    } catch (e) {
      console.error(e);
      toast.error("Failed to download PNG", { id: "png" });
    }
  };

  const downloadPDF = async () => {
    toast.loading("Generating PDF...", { id: "pdf" });
    try {
      const blob = await fetchPosterBlob();
      const dataUrl: string = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = () => reject(fr.error);
        fr.readAsDataURL(blob);
      });
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Image load failed"));
        i.src = dataUrl;
      });
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [img.naturalWidth, img.naturalHeight],
        compress: true,
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, img.naturalWidth, img.naturalHeight);
      pdf.save(`naslab-invite-${posterLabel}-${memberId}.pdf`);
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
          <div
            className="relative w-full p-4"
            style={{ background: theme === "light" ? "#f4f4f5" : "#050403" }}
          >
            <img
              src={posterUrl}
              alt={`NASLAB invite poster (${posterLabel} mode) for member ${memberId}`}
              className="block h-auto w-full rounded-lg"
            />
          </div>
        </SpotlightCard>

        {/* === Side panel === */}
        <div className="space-y-4">
          <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
            <div className="border-b border-gold/10 px-5 py-3.5">
              <h3 className="font-serif text-base font-semibold text-gold text-gold-shine md:text-lg">Your Invite Link</h3>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div className="group relative overflow-hidden rounded-lg border border-gold/20 bg-background/40">
                <div className="flex min-w-0 items-center gap-2 px-3 py-2.5">
                  <Link2 className="h-4 w-4 shrink-0 text-gold/70" />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-foreground/90 sm:text-sm">
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
              <strong className="text-gold/80">Tip:</strong> The poster auto-switches between the
              light and dark version based on your current theme. Toggle the theme to download the
              other variant.
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
