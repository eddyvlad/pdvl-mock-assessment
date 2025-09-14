'use client';

import { ComponentProps, ComponentType, useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

type Theme = 'system' | 'light' | 'dark';
const STORAGE_KEY = 'theme';

type ThemeItem = {
  ariaLabel: string;
  icon: ComponentType<ComponentProps<'svg'>>;
  value: Theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

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

