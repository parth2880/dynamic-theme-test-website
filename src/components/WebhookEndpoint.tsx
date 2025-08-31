'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export function WebhookEndpoint() {
    const { updateTheme, isUpdating, lastWebhookUpdate } = useTheme();
    const [lastWebhookData, setLastWebhookData] = useState<any>(null);
    const [webhookHistory, setWebhookHistory] = useState<any[]>([]);

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    // Load existing webhook history from localStorage
    useEffect(() => {
        const existingHistory = JSON.parse(localStorage.getItem('webhook-history') || '[]');
        setWebhookHistory(existingHistory);
        if (existingHistory.length > 0) {
            setLastWebhookData(existingHistory[existingHistory.length - 1]);
        }
    }, []);

    // Function to handle webhook response and store data
    const handleWebhookResponse = (webhookInfo: any) => {
        console.log('📥 WebhookEndpoint received webhook data:', webhookInfo);
        setLastWebhookData(webhookInfo);
        setWebhookHistory(prev => [...prev, webhookInfo].slice(-10)); // Keep last 10

        // Store in localStorage
        const existingHistory = JSON.parse(localStorage.getItem('webhook-history') || '[]');
        const updatedHistory = [...existingHistory, webhookInfo].slice(-10);
        localStorage.setItem('webhook-history', JSON.stringify(updatedHistory));
    };

    // Make the function available globally for the webhook endpoint
    useEffect(() => {
        (window as any).handleWebhookResponse = handleWebhookResponse;
        return () => {
            delete (window as any).handleWebhookResponse;
        };
    }, []);

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
