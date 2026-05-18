import { useEffect, useRef, useState } from "react";

interface IntroVideoOverlayProps {
  src: string;
  onFinish: () => void;
  /** Max time to wait before auto-dismissing if the video never loads/plays. */
  fallbackTimeoutMs?: number;
}

/**
 * Full-screen black overlay that plays a short intro video with sound, then
 * calls onFinish when it ends (or fails to load).
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
    </div>
  );
}

export const INTRO_VIDEO_SIGNIN = "/videos/signin.mp4";
export const INTRO_VIDEO_SIGNOUT = "/videos/signout.mp4";
