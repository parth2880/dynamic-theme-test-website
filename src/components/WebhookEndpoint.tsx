'use client';

import { useTheme } from './ThemeProvider';

export function WebhookEndpoint() {
    const { updateTheme, isUpdating } = useTheme();

    // Simulate webhook endpoint for demo purposes
    const handleWebhookTest = () => {
        // Test theme data matching the guide's expected format
        const testThemeData = {
            theme: {
                colors: {
                    primary: "#8b5cf6",
                    secondary: "#94a3b8",
                    accent: "#f97316",
                    neutral: "#6b7280",
                    info: "#06b6d4",
                    success: "#10b981",
                    warning: "#f59e0b",
                    error: "#ef4444"
                },
                radius: {
                    box: 12,
                    field: 8,
                    selector: 6
                },
                effects: {
                    depth: true,
                    noise: false
                }
            },
            themeId: "test_theme_123",
            themeName: "Test Purple Theme",
            timestamp: new Date().toISOString()
        };

        // Simulate webhook call to our API endpoint
        fetch('/api/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testThemeData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Webhook response:', data);

                // Also update the local theme for immediate visual feedback
                const localTheme = {
                    background: '#1a1a1a',
                    foreground: '#ffffff',
                    primary: testThemeData.theme.colors.primary,
                    secondary: testThemeData.theme.colors.secondary,
                    accent: testThemeData.theme.colors.accent,
                    muted: '#a1a1aa',
                    border: '#4b5563',
                    card: '#262626',
                    popover: '#262626',
                    destructive: testThemeData.theme.colors.error,
                    success: testThemeData.theme.colors.success,
                    warning: testThemeData.theme.colors.warning,
                };

                updateTheme(localTheme);
            })
            .catch(error => {
                console.error('Webhook test failed:', error);
            });
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
                <h3 className="text-sm font-semibold mb-2 text-foreground">Theme Webhook Status</h3>
                <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-warning animate-pulse' : 'bg-success'}`} />
                    <span className="text-xs text-foreground">
                        {isUpdating ? 'Updating theme...' : 'Ready for webhooks'}
                    </span>
                </div>
                <button
                    onClick={handleWebhookTest}
                    disabled={isUpdating}
                    className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 disabled:opacity-50 font-medium"
                >
                    Test Webhook
                </button>
                <div className="mt-2 text-xs text-muted">
                    Endpoint: /api/webhook
                </div>
            </div>
        </div>
    );
}
