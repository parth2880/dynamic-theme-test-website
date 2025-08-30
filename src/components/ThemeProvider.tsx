'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Theme {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
  card: string;
  popover: string;
  destructive: string;
  success: string;
  warning: string;
}

interface ThemeContextType {
  theme: Theme;
  updateTheme: (newTheme: Theme) => void;
  isUpdating: boolean;
}

const defaultTheme: Theme = {
  background: '#ffffff',
  foreground: '#171717',
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#f59e0b',
  muted: '#f1f5f9',
  border: '#e2e8f0',
  card: '#ffffff',
  popover: '#ffffff',
  destructive: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateTheme = (newTheme: Theme) => {
    setIsUpdating(true);
    setTheme(newTheme);
    
    // Apply theme to CSS custom properties
    const root = document.documentElement;
    Object.entries(newTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Store theme in localStorage
    localStorage.setItem('dynamic-theme', JSON.stringify(newTheme));
    
    setTimeout(() => setIsUpdating(false), 500);
  };

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('dynamic-theme');
    if (savedTheme) {
      const parsedTheme = JSON.parse(savedTheme);
      updateTheme(parsedTheme);
    }

    // Set up webhook endpoint for theme updates
    const handleWebhook = (event: MessageEvent) => {
      if (event.data && event.data.type === 'theme-update') {
        updateTheme(event.data.theme);
      }
    };

    // Listen for webhook messages (for demo purposes)
    window.addEventListener('message', handleWebhook);

    return () => {
      window.removeEventListener('message', handleWebhook);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, isUpdating }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
