import type { ReactNode } from "react";

/** Static wrapper (tilt removed for performance). */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
