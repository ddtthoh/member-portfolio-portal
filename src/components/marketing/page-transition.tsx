import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Diagonal gold curtain that sweeps when the route pathname changes.
 * Self-contained CSS, no AnimatePresence dependency.
 */
export function PageTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const [last, setLast] = useState(pathname);

  useEffect(() => {
    if (pathname === last) return;
    setPhase("in");
    const t1 = window.setTimeout(() => setPhase("out"), 380);
    const t2 = window.setTimeout(() => { setPhase("idle"); setLast(pathname); }, 760);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pathname, last]);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9000]"
        style={{
          transform:
            phase === "in"
              ? "translate(0%, 0%)"
              : phase === "out"
              ? "translate(-110%, -110%)"
              : "translate(110%, 110%)",
          transition: "transform 0.42s cubic-bezier(.76,0,.24,1)",
          background:
            "linear-gradient(135deg, #ffd089 0%, #ff7a1f 45%, #1a0d05 100%)",
          boxShadow: "0 0 80px rgba(255,170,80,0.35)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[8999]"
        style={{
          transform:
            phase === "in"
              ? "translate(-3%, -3%)"
              : phase === "out"
              ? "translate(-115%, -115%)"
              : "translate(115%, 115%)",
          transition: "transform 0.55s cubic-bezier(.76,0,.24,1) 0.04s",
          background: "#06070b",
        }}
      />
    </>
  );
}
