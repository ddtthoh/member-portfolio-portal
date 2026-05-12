import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Distance ahead of viewport where mount triggers. Default "30%". */
  rootMargin?: string;
  /** Optional placeholder shown until in view. */
  fallback?: ReactNode;
  /** Min height before mount so layout doesn't jump. */
  minHeight?: number | string;
  /** If true, unmount children again when scrolled away (frees GPU/CPU). */
  unmountWhenOut?: boolean;
};

/** Defer mounting heavy children until they approach the viewport.
 *  Prevents 3D scenes / large canvases from initialising on first paint. */
export function MountInView({
  children,
  rootMargin = "30% 0px",
  fallback,
  minHeight,
  unmountWhenOut = false,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setMounted(true);
          else if (unmountWhenOut) setMounted(false);
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, unmountWhenOut]);

  return (
    <div ref={ref} style={minHeight ? { minHeight } : undefined}>
      {mounted ? children : fallback ?? null}
    </div>
  );
}
