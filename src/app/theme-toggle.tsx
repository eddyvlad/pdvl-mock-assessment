'use client';

import { ComponentProps, ComponentType, useEffect, useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

type Theme = 'system' | 'light' | 'dark';
const STORAGE_KEY = 'theme';

type ThemeItem = {
  ariaLabel: string;
  icon: ComponentType<ComponentProps<'svg'>>;
  value: Theme;
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

function subscribeToTheme(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };
  const handleThemeChange = () => onStoreChange();

  window.addEventListener('storage', handleStorage);
  window.addEventListener('pdvl-theme-change', handleThemeChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('pdvl-theme-change', handleThemeChange);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, readStoredTheme, () => 'system');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (value: Theme) => {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event('pdvl-theme-change'));
  };

  const themes: ThemeItem[] = [
    {
      ariaLabel: 'System theme',
      icon: Monitor,
      value: 'system',
    },
    {
      ariaLabel: 'Dark mode',
      icon: Moon,
      value: 'dark',
    },
    {
      ariaLabel: 'Light mode',
      icon: Sun,
      value: 'light',
    }
  ];

  return (
    <div className="fixed bottom-1 right-1 flex flex-row gap-2 bg-background/50 backdrop-blur-sm rounded-lg shadow-lg z-50">
      {themes.map(({ariaLabel, icon: Icon, value}) => (
        <button
          key={value}
          aria-label={ariaLabel}
          className={clsx('btn btn-ghost p-2 rounded-full', {
            'text-primary': theme === value,
          })}
          onClick={() => setTheme(value)}
        >
          <Icon className="h-4 w-4"/>
        </button>
      ))}
    </div>
  );
}
