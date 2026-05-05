import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "iv-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(KEY)) as Theme | null;
    const initial: Theme = stored ?? "dark";
    setThemeState(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(KEY, t);
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
