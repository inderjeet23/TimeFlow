'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-12 h-12 bg-card border border-border rounded-xl" />
        <div className="w-12 h-12 bg-card border border-border rounded-xl" />
      </div>
    );
  }

  return <ThemeToggleContent />;
}

function ThemeToggleContent() {
  const { theme, accentColor, toggleTheme, setAccentColor } = useTheme();
  const [showAccentMenu, setShowAccentMenu] = useState(false);

  const accentColors = [
    { name: 'orange', color: '#f97316', label: 'Orange' },
    { name: 'blue', color: '#3b82f6', label: 'Blue' },
    { name: 'purple', color: '#a855f7', label: 'Purple' },
    { name: 'green', color: '#22c55e', label: 'Green' },
  ] as const;

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative p-3 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-all duration-200 touch-target"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <div className="relative w-5 h-5">
            <Sun 
              className={`absolute inset-0 w-5 h-5 text-foreground transition-all duration-300 ${
                theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
              }`} 
            />
            <Moon 
              className={`absolute inset-0 w-5 h-5 text-foreground transition-all duration-300 ${
                theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
              }`} 
            />
          </div>
        </button>

        {/* Accent Color Toggle */}
        <button
          onClick={() => setShowAccentMenu(!showAccentMenu)}
          className="relative p-3 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-all duration-200 touch-target"
          title="Change accent color"
        >
          <Palette className="w-5 h-5 text-foreground" />
          <div 
            className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card"
            style={{ backgroundColor: accentColors.find(c => c.name === accentColor)?.color }}
          />
        </button>
      </div>

      {/* Accent Color Menu */}
      {showAccentMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowAccentMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 z-50 bg-card border border-border rounded-xl shadow-lg p-3 min-w-[200px] animate-fadeIn">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground mb-1">Accent Color</h3>
              <p className="text-xs text-muted-foreground">Choose your preferred accent color</p>
            </div>
            
            <div className="space-y-1">
              {accentColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setAccentColor(color.name);
                    setShowAccentMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-border flex items-center justify-center"
                    style={{ backgroundColor: color.color }}
                  >
                    {accentColor === color.name && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm text-foreground">{color.label}</span>
                  {accentColor === color.name && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                More colors coming soon
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function SimpleThemeToggle() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 bg-card border border-border rounded-lg" />
    );
  }

  return <SimpleThemeToggleContent />;
}

function SimpleThemeToggleContent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-card border border-border hover:bg-secondary/50 transition-all duration-200 touch-target"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-4 h-4">
        <Sun
          className={`absolute inset-0 w-4 h-4 text-foreground transition-all duration-300 ${
            theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
          }`}
        />
        <Moon 
          className={`absolute inset-0 w-4 h-4 text-foreground transition-all duration-300 ${
            theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
          }`} 
        />
      </div>
    </button>
  );
}