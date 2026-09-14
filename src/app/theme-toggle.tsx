"use client";

import clsx from "clsx";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  type ComponentProps,
  type ComponentType,
  useEffect,
  useSyncExternalStore,
} from "react";

type Theme = "system" | "light" | "dark";
const STORAGE_KEY = "theme";

type ThemeItem = {
  ariaLabel: string;
  icon: ComponentType<ComponentProps<"svg">>;
  value: Theme;
};

function readStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
}

function subscribeToTheme(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };
  const handleThemeChange = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener("pdvl-theme-change", handleThemeChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("pdvl-theme-change", handleThemeChange);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    readStoredTheme,
    () => "system",
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const setTheme = (value: Theme) => {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event("pdvl-theme-change"));
  };

  const themes: ThemeItem[] = [
    {
      ariaLabel: "System theme",
      icon: Monitor,
      value: "system",
    },
    {
      ariaLabel: "Dark mode",
      icon: Moon,
      value: "dark",
    },
    {
      ariaLabel: "Light mode",
      icon: Sun,
      value: "light",
    },
  ];

  return (
    <div className="theme-toggle flex flex-row gap-1 rounded-full border border-border bg-card/95 p-1 shadow-lg backdrop-blur-sm">
      {themes.map(({ ariaLabel, icon: Icon, value }) => (
        <button
          key={value}
          type="button"
          aria-label={ariaLabel}
          aria-pressed={theme === value}
          className={clsx("btn btn-ghost h-9 min-h-0 w-9 rounded-full p-2", {
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground":
              theme === value,
          })}
          onClick={() => setTheme(value)}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
