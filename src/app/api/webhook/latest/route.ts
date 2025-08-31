import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const webhookDataPath = path.join(process.cwd(), 'webhook-data.json');

        // Check if the file exists
        try {
            await fs.access(webhookDataPath);
        } catch {
            // File doesn't exist, return empty data
            return NextResponse.json({
                success: true,
                data: null,
                timestamp: new Date().toISOString(),
            });
        }

        // Read the webhook data from file
        const webhookData = await fs.readFile(webhookDataPath, 'utf-8');
        const parsedData = JSON.parse(webhookData);

        return NextResponse.json({
            success: true,
            data: parsedData,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error reading webhook data:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to read webhook data',
            timestamp: new Date().toISOString(),
        });
    }
}
