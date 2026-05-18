import { useEffect, useRef, useState } from "react";

interface IntroVideoOverlayProps {
  src: string;
  onFinish: () => void;
  /** Max time to wait before auto-dismissing if the video never loads/plays. */
  fallbackTimeoutMs?: number;
}

/**
 * Full-screen black overlay that plays a short intro video with sound, then
 * calls onFinish when it ends (or fails to load). A subtle "Skip" button is
 * always available in the top-right.
 */
export function IntroVideoOverlay({
  src,
  onFinish,
  fallbackTimeoutMs = 15000,
}: IntroVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishedRef = useRef(false);
  const [ready, setReady] = useState(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Try to play with sound (allowed because both triggers come from a user click).
    const tryPlay = async () => {
      try {
        v.muted = false;
        await v.play();
      } catch {
        // Browser blocked audio — fall back to muted so the video still shows.
        try {
          v.muted = true;
          await v.play();
        } catch {
          finish();
        }
      }
    };
    void tryPlay();

    // Safety net: if anything stalls, dismiss after fallbackTimeoutMs.
    const t = window.setTimeout(finish, fallbackTimeoutMs);
    return () => window.clearTimeout(t);
  }, [fallbackTimeoutMs]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      role="dialog"
      aria-label="Intro video"
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        autoPlay
        onCanPlay={() => setReady(true)}
        onEnded={finish}
        onError={finish}
        className={`h-full w-full object-contain transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
      <button
        type="button"
        onClick={finish}
        className="absolute right-4 top-4 rounded-full border border-gold/60 bg-black/40 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold backdrop-blur-sm transition-colors hover:bg-gold/10 hover:text-gold"
      >
        Skip
      </button>
    </div>
  );
}

export const INTRO_VIDEO_SIGNIN = "/videos/signin.mp4";
export const INTRO_VIDEO_SIGNOUT = "/videos/signout.mp4";
