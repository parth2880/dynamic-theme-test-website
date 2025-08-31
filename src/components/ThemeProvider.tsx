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
  lastWebhookUpdate: string | null;
}

const defaultTheme: Theme = {
  background: '#ffffff',
  foreground: '#171717',
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#f59e0b',
  muted: '#6b7280',
  border: '#e2e8f0',
  card: '#ffffff',
  popover: '#ffffff',
  destructive: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastWebhookUpdate, setLastWebhookUpdate] = useState<string | null>(null);

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

  // Function to apply webhook theme data
  const applyWebhookTheme = (themeData: any) => {
    console.log('🎨 APPLYING WEBHOOK THEME TO WEBSITE:');
    console.log('📋 Theme data received:', themeData);

    // Handle both direct theme object and nested theme structure
    const theme = themeData.theme || themeData;

    if (theme && theme.colors) {
      console.log('🎨 Theme colors to apply:', theme.colors);
      console.log('📐 Theme radius to apply:', theme.radius);

      const newTheme = {
        background: '#ffffff',
        foreground: '#171717',
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        muted: theme.colors.neutral,
        border: '#e2e8f0',
        card: '#ffffff',
        popover: '#ffffff',
        destructive: theme.colors.error,
        success: theme.colors.success,
        warning: theme.colors.warning,
      };

      console.log('🎨 New theme object:', newTheme);
      updateTheme(newTheme);
      setLastWebhookUpdate(new Date().toISOString());

      // Also apply the CSS variables directly
      const root = document.documentElement;
      console.log('🎨 Applying CSS variables to DOM...');

      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value as string);
        console.log(`  ✅ Applied --color-${key}: ${value}`);
      });

      if (theme.radius) {
        Object.entries(theme.radius).forEach(([key, value]) => {
          root.style.setProperty(`--radius-${key}`, `${value}px`);
          console.log(`  ✅ Applied --radius-${key}: ${value}px`);
        });
      }

      // Apply legacy variables
      root.style.setProperty('--primary', theme.colors.primary);
      root.style.setProperty('--secondary', theme.colors.secondary);
      root.style.setProperty('--accent', theme.colors.accent);
      root.style.setProperty('--destructive', theme.colors.error);
      root.style.setProperty('--success', theme.colors.success);
      root.style.setProperty('--warning', theme.colors.warning);

      console.log('🎨 Theme application completed!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.error('❌ Invalid theme data - missing theme or colors');
      console.error('📋 Received data structure:', themeData);
      console.error('🔍 Theme object:', theme);
    }
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
        applyWebhookTheme(event.data.theme);
      }
    };

    // Listen for webhook messages (for demo purposes)
    window.addEventListener('message', handleWebhook);

    // Set up polling to check for webhook updates (for production)
    const checkWebhookUpdates = async () => {
      try {
        const response = await fetch('/api/webhook');
        if (response.ok) {
          const data = await response.json();
          // In a real implementation, you might check for new themes here
        }
      } catch (error) {
        console.log('Webhook check failed:', error);
      }
    };

    // Check for updates every 5 seconds (more frequent for testing)
    const interval = setInterval(checkWebhookUpdates, 5000);

    // Simple polling approach instead of SSE
    const checkForWebhookUpdates = async () => {
      try {
        // Check if there are any recent webhook updates in localStorage
        const webhookHistory = JSON.parse(localStorage.getItem('webhook-history') || '[]');
        const lastWebhook = webhookHistory[webhookHistory.length - 1];

        if (lastWebhook && lastWebhook.timestamp !== lastWebhookUpdate) {
          console.log('🎨 New webhook detected, applying theme...');
          applyWebhookTheme(lastWebhook.theme);
          setLastWebhookUpdate(lastWebhook.timestamp);
        }
      } catch (error) {
        console.log('Webhook check failed:', error);
      }
    };

    return () => {
      window.removeEventListener('message', handleWebhook);
      clearInterval(interval);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, isUpdating, lastWebhookUpdate }}>
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
