import { useEffect, useState } from "react";

export type DeviceTier = "low" | "mid" | "high";
export type DeviceCapability = {
  tier: DeviceTier;
  coarse: boolean;
  reduceMotion: boolean;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

const fallback: DeviceCapability = {
  tier: "high",
  coarse: false,
  reduceMotion: false,
  isPhone: false,
  isTablet: false,
  isDesktop: true,
};

export function useDeviceCapability(): DeviceCapability {
  const [cap, setCap] = useState<DeviceCapability>(fallback);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const compute = (): DeviceCapability => {
      const w = window.innerWidth;
      const isPhone = w < 640;
      const isTablet = w >= 640 && w < 1024;
      const isDesktop = w >= 1024;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cores = navigator.hardwareConcurrency ?? 4;
      // @ts-expect-error deviceMemory not in lib.dom for all
      const mem: number = navigator.deviceMemory ?? 4;
      let tier: DeviceTier = "high";
      if (isPhone || cores <= 4 || mem <= 2) tier = "low";
      else if (isTablet || cores <= 6 || mem <= 4) tier = "mid";
      return { tier, coarse, reduceMotion, isPhone, isTablet, isDesktop };
    };
    setCap(compute());
    const onResize = () => setCap(compute());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return cap;
}
