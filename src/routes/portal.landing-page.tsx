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
    // Render a fresh, unscaled, 1080px-wide MobilePoster into an offscreen
    // container — completely independent of the on-page preview (which is
    // scaled with transform: scale(...) and would otherwise be captured
    // at the wrong size).
    const { createRoot } = await import("react-dom/client");
    const host = document.createElement("div");
    host.style.cssText = [
      "position: fixed",
      "left: 0",
      "top: 0",
      "width: 1080px",
      "z-index: -1",
      "pointer-events: none",
      "opacity: 0",
      // keep it inside the viewport so html2canvas measures it correctly
      "transform: translate(0, 0)",
    ].join(";");
    document.body.appendChild(host);
    const root = createRoot(host);

    const mounted = new Promise<HTMLElement>((resolve, reject) => {
      try {
        root.render(
          <MobilePoster memberId={memberId} theme={theme} exportMode />,
        );
        // wait for the .poster-root to appear
        let tries = 0;
        const tick = () => {
          const el = host.querySelector(".poster-root") as HTMLElement | null;
          if (el && el.scrollHeight > 100) return resolve(el);
          if (++tries > 120) return reject(new Error("Poster mount timeout"));
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      } catch (err) {
        reject(err);
      }
    });

    try {
      const target = await mounted;

      // wait for fonts
      try {
        await (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
      } catch {
        /* ignore */
      }

      // wait for all images (logo, QR) to fully decode
      const imgs = Array.from(target.querySelectorAll("img")) as HTMLImageElement[];
      await Promise.all(
        imgs.map((img) =>
          img.complete && img.naturalWidth > 0
            ? img.decode().catch(() => undefined)
            : new Promise<void>((resolve) => {
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
              }),
        ),
      );

      // two RAFs to ensure layout/paint settles
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(target, {
        backgroundColor: theme === "light" ? "#ffffff" : "#050403",
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: 1080,
        height: target.scrollHeight,
        windowWidth: 1080,
        windowHeight: target.scrollHeight,
      });
      return canvas;
    } finally {
      try {
        root.unmount();
      } catch {
        /* ignore */
      }
      host.remove();
    }
  };

  const downloadPNG = async () => {
    toast.loading("Generating PNG...", { id: "png" });
    try {
      const canvas = await captureCanvas();
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `naslab-invite-${memberId}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
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
          <FitPoster theme={theme} innerRef={previewRef}>
            <MobilePoster memberId={memberId} theme={theme} />
          </FitPoster>
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

/** Scales the 1080px-wide poster to fit the available container width. */
function FitPoster({
  theme,
  innerRef,
  children,
}: {
  theme: "light" | "dark";
  innerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.5);
  const [innerH, setInnerH] = useState(900);

  useEffect(() => {
    const wrap = wrapRef.current;
    const el = innerRef.current;
    if (!wrap || !el) return;
    const compute = () => {
      const cs = window.getComputedStyle(wrap);
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const w = wrap.clientWidth - padX;
      const s = Math.min(1, Math.max(0.1, w / 1080));
      setScale(s);
      // unscaled height of the poster
      const h = el.scrollHeight;
      setInnerH(Math.ceil(h * s));
    };
    compute();
    const raf = requestAnimationFrame(compute);
    const ro = new ResizeObserver(compute);
    ro.observe(wrap);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [innerRef]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden p-4"
      style={{ background: theme === "light" ? "#f4f4f5" : "#050403" }}
    >
      <div style={{ height: innerH }}>
        <div
          ref={innerRef}
          style={{
            width: "1080px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
