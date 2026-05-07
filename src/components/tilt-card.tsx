import { useEffect, useRef, useState, type ReactNode } from "react";
import Tilt from "react-parallax-tilt";

/**
 * Tilt card. Mouse parallax on fine pointers; gyroscope parallax on touch devices.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const c = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCoarse(c);
    if (!c || reduce) return;

    const onOrient = (ev: DeviceOrientationEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const beta = Math.max(-30, Math.min(30, ev.beta ?? 0)); // front-back
      const gamma = Math.max(-30, Math.min(30, ev.gamma ?? 0)); // left-right
      const rx = (beta / 30) * 4;
      const ry = (gamma / 30) * 4;
      el.style.transform = `perspective(900px) rotateX(${-rx}deg) rotateY(${ry}deg)`;
    };

    let added = false;
    const attach = () => {
      if (added) return;
      window.addEventListener("deviceorientation", onOrient, true);
      added = true;
    };

    // iOS gating
    // @ts-expect-error requestPermission may exist
    const reqPerm = DeviceOrientationEvent?.requestPermission as undefined | (() => Promise<string>);
    if (typeof reqPerm === "function") {
      const onFirstTap = async () => {
        try {
          const res = await reqPerm();
          if (res === "granted") attach();
        } catch {}
        window.removeEventListener("touchend", onFirstTap);
      };
      window.addEventListener("touchend", onFirstTap, { once: true });
    } else {
      attach();
    }

    return () => {
      if (added) window.removeEventListener("deviceorientation", onOrient, true);
    };
  }, []);

  if (coarse) {
    return (
      <div
        ref={wrapRef}
        className={className}
        style={{ transition: "transform 240ms cubic-bezier(.2,.8,.2,1)", willChange: "transform" }}
      >
        {children}
      </div>
    );
  }

  return (
    <Tilt
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      glareEnable
      glareMaxOpacity={0.18}
      glareColor="#ffd97a"
      glarePosition="all"
      glareBorderRadius="12px"
      transitionSpeed={1200}
      className={className}
    >
      {children}
    </Tilt>
  );
}
