"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeShortcut() {
  const { setTheme } = useTheme();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        const isDark = document.documentElement.classList.contains("dark");
        const next = isDark ? "light" : "dark";
        setTheme(next);
        setAnnouncement(`Theme changed to ${next}`);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setTheme]);

  return (
    <div aria-live="polite" className="sr-only">
      {announcement}
    </div>
  );
}
