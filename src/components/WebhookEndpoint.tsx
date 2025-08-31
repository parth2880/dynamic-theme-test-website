'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeProvider';

interface WebhookData {
    timestamp: string;
    themeId: string;
    themeName: string;
    theme: {
        colors: {
            primary: string;
            secondary: string;
            accent: string;
            neutral: string;
            info: string;
            success: string;
            warning: string;
            error: string;
        };
        radius?: {
            box: number;
            field: number;
            selector: number;
        };
        effects?: {
            depth: boolean;
            noise: boolean;
        };
    };
    fullWebhookData: Record<string, unknown>;
    cssVariables?: string;
}

export function WebhookEndpoint() {
    const { updateTheme, isUpdating, lastWebhookUpdate } = useTheme();
    const [lastWebhookData, setLastWebhookData] = useState<WebhookData | null>(null);
    const [webhookHistory, setWebhookHistory] = useState<WebhookData[]>([]);

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    // Function to apply theme from webhook data
    const applyThemeFromWebhookData = useCallback((webhookData: WebhookData) => {
        console.log('🎨 APPLYING THEME FROM WEBHOOK DATA:', webhookData);
        console.log('🔍 Webhook data structure:', {
            hasTheme: !!webhookData.theme,
            hasColors: !!(webhookData.theme && webhookData.theme.colors),
            themeKeys: webhookData.theme ? Object.keys(webhookData.theme) : [],
            colorKeys: webhookData.theme && webhookData.theme.colors ? Object.keys(webhookData.theme.colors) : []
        });

        // Use the theme from the webhook data
        const theme = webhookData.theme;
        if (!theme || !theme.colors) {
            console.error('❌ Invalid webhook data structure:', webhookData);
            return;
        }

        console.log('🎨 Theme colors to apply:', theme.colors);
        console.log('📐 Theme radius to apply:', theme.radius);

        // Apply the theme using the ThemeProvider
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

        // Apply CSS variables directly to the document
        const root = document.documentElement;
        console.log('🎨 Applying CSS variables to DOM...');
        console.log('🔍 Current CSS variables before:', {
            primary: getComputedStyle(root).getPropertyValue('--color-primary'),
            secondary: getComputedStyle(root).getPropertyValue('--color-secondary'),
            accent: getComputedStyle(root).getPropertyValue('--color-accent')
        });

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

        // Apply legacy variables for backward compatibility
        root.style.setProperty('--primary', theme.colors.primary);
        root.style.setProperty('--secondary', theme.colors.secondary);
        root.style.setProperty('--accent', theme.colors.accent);
        root.style.setProperty('--destructive', theme.colors.error);
        root.style.setProperty('--success', theme.colors.success);
        root.style.setProperty('--warning', theme.colors.warning);

        console.log('🔍 CSS variables after application:', {
            primary: getComputedStyle(root).getPropertyValue('--color-primary'),
            secondary: getComputedStyle(root).getPropertyValue('--color-secondary'),
            accent: getComputedStyle(root).getPropertyValue('--color-accent')
        });

        console.log('🎨 Theme application completed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }, [updateTheme]);

    // Load existing webhook history from localStorage and fetch latest webhook data
    useEffect(() => {
        const existingHistory = JSON.parse(localStorage.getItem('webhook-history') || '[]');
        setWebhookHistory(existingHistory);
        if (existingHistory.length > 0) {
            setLastWebhookData(existingHistory[existingHistory.length - 1]);
        }

        // Fetch latest webhook data from server
        const fetchLatestWebhookData = async () => {
            try {
                const response = await fetch('/api/webhook/latest');
                const data = await response.json();

                if (data.success && data.data) {
                    console.log('📥 Fetched latest webhook data:', data.data);
                    setLastWebhookData(data.data);

                    // Add to history if it's new
                    const existingHistory = JSON.parse(localStorage.getItem('webhook-history') || '[]');
                    const isNew = !existingHistory.some((item: WebhookData) => item.timestamp === data.data.timestamp);

                    if (isNew) {
                        const updatedHistory = [...existingHistory, data.data].slice(-10);
                        setWebhookHistory(updatedHistory);
                        localStorage.setItem('webhook-history', JSON.stringify(updatedHistory));

                        // Apply the theme immediately when new webhook data is received
                        console.log('🎨 Applying theme from new webhook data...');
                        applyThemeFromWebhookData(data.data);
                    }
                }
            } catch (error) {
                console.log('Failed to fetch latest webhook data:', error);
            }
        };

        fetchLatestWebhookData();

        // Poll for new webhook data every 3 seconds
        const interval = setInterval(fetchLatestWebhookData, 3000);

        return () => clearInterval(interval);
    }, [applyThemeFromWebhookData]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
                <h3 className="text-sm font-semibold mb-2 text-foreground">Dynamic Theme Generator</h3>
                <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-warning animate-pulse' : 'bg-success'}`} />
                    <span className="text-xs text-foreground">
                        {isUpdating ? 'Updating theme...' : 'Ready for webhooks'}
                    </span>
                </div>

                {lastWebhookUpdate && (
                    <div className="mb-3 p-2 bg-success/10 border border-success/20 rounded text-xs">
                        <div className="text-success font-medium">Last Update</div>
                        <div className="text-muted">{formatTime(lastWebhookUpdate)}</div>
                    </div>
                )}

                <button
                    onClick={() => {
                        // Show the last webhook data received from dynamic theme generator
                        if (lastWebhookData) {
                            console.log('📋 LAST WEBHOOK DATA FROM DYNAMIC THEME GENERATOR:', lastWebhookData);
                            alert(`Last webhook data:\n\n${JSON.stringify(lastWebhookData, null, 2)}`);
                        } else {
                            alert('No webhook data received yet. Send a webhook from your dynamic theme generator first.');
                        }
                    }}
                    disabled={isUpdating}
                    className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 disabled:opacity-50 font-medium w-full mb-2"
                >
                    Show DTG Webhook Data
                </button>

                <button
                    onClick={() => {
                        // Manually apply the last webhook theme
                        if (lastWebhookData) {
                            console.log('🔧 Manually applying last webhook theme...');
                            applyThemeFromWebhookData(lastWebhookData);
                        } else {
                            alert('No webhook data available. Send a webhook from your dynamic theme generator first.');
                        }
                    }}
                    disabled={isUpdating}
                    className="text-xs bg-success text-white px-3 py-1 rounded hover:bg-success/90 disabled:opacity-50 font-medium w-full mb-2"
                >
                    Apply Last Webhook Theme
                </button>

                <div className="text-xs text-muted">
                    Endpoint: /api/webhook
                </div>

                <div className="text-xs text-muted mt-1">
                    Real webhooks from your theme generator will update the site automatically
                </div>
            </div>
        </div>
    );
}
