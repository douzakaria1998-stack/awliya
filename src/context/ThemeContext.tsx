'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { LevelId, LevelTheme } from '@/types';
import { getThemeForLevel, applyThemeCSS } from '@/lib/themes';
import { getItem, setItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { mockStudent } from '@/data/mock';

interface ThemeContextType {
  currentLevel: LevelId;
  theme: LevelTheme;
  setLevel: (level: LevelId) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentLevel, setCurrentLevel] = useState<LevelId>(mockStudent.currentLevel);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const setLevel = useCallback((level: LevelId) => {
    setCurrentLevel(level);
    setItem(STORAGE_KEYS.CURRENT_LEVEL, level);
    applyThemeCSS(level);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      setItem(STORAGE_KEYS.THEME_MODE, next ? 'dark' : 'light');
      if (typeof document !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('dark');
          document.body?.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body?.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
      return next;
    });
  }, []);

  // Initialize theme from storage and system preference
  useEffect(() => {
    const storedLevel = getItem<LevelId>(STORAGE_KEYS.CURRENT_LEVEL);
    const level = storedLevel || mockStudent.currentLevel;
    setCurrentLevel(level);
    applyThemeCSS(level);

    const storedMode = getItem<string>(STORAGE_KEYS.THEME_MODE);
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDark = storedMode ? storedMode === 'dark' : prefersDark;

    if (isDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const theme = getThemeForLevel(currentLevel);

  return (
    <ThemeContext.Provider value={{ currentLevel, theme, setLevel, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
