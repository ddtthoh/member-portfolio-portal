import type { ReactNode } from "react";
import Tilt from "react-parallax-tilt";

export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
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
