'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Script from 'next/script';

type Theme = 'light' | 'dark';
type AccentColor = 'orange' | 'blue' | 'purple' | 'green';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [accentColor, setAccentColor] = useState<AccentColor>('orange');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount and listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('timeflow-theme') as Theme;
    const savedAccent = localStorage.getItem('timeflow-accent') as AccentColor;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Auto-detect system preference
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    if (savedAccent) {
      setAccentColor(savedAccent);
    }

    setMounted(true);

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme and accent to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    root.classList.remove('accent-orange', 'accent-blue', 'accent-purple', 'accent-green');
    
    // Add current theme and accent
    root.classList.add(theme);
    root.classList.add(`accent-${accentColor}`);
    
    // Save to localStorage
    localStorage.setItem('timeflow-theme', theme);
    localStorage.setItem('timeflow-accent', accentColor);
  }, [theme, accentColor, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSetAccentColor = (color: AccentColor) => {
    setAccentColor(color);
  };

  return (
    <>
      <Script id="initial-theme" strategy="beforeInteractive">
        {`
          (function() {
            try {
              var theme = localStorage.getItem('timeflow-theme');
              if (!theme) {
                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                theme = systemDark ? 'dark' : 'light';
              }
              var root = document.documentElement;
              root.classList.remove('light', 'dark');
              root.classList.add(theme);
            } catch (e) {}
          })();
        `}
      </Script>
      {mounted ? (
        <ThemeContext.Provider
          value={{
            theme,
            accentColor,
            setTheme: handleSetTheme,
            setAccentColor: handleSetAccentColor,
            toggleTheme,
          }}
        >
          {children}
        </ThemeContext.Provider>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}