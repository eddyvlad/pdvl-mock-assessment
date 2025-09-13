"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "system" | "light" | "dark";
const STORAGE_KEY = "theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      <button
        aria-label="System theme"
        className="btn btn-ghost"
        onClick={() => setTheme("system")}
      >
        <Monitor className="h-4 w-4" />
      </button>
      <button
        aria-label="Dark mode"
        className="btn btn-ghost"
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        aria-label="Light mode"
        className="btn btn-ghost"
        onClick={() => setTheme("light")}
      >
        <Sun className="h-4 w-4" />
      </button>
    </div>
  );
}

