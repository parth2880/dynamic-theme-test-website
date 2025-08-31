import { NextRequest } from 'next/server';

// Store connected clients
const clients = new Set<ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
    const stream = new ReadableStream({
        start(controller) {
            // Add this client to the set
            clients.add(controller);

            // Send initial connection message
            controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ type: 'connected', message: 'SSE connection established' })}\n\n`)
            );

            // Remove client when connection closes
            request.signal.addEventListener('abort', () => {
                clients.delete(controller);
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control',
        },
    });
}

// Function to broadcast webhook updates to all connected clients
export function broadcastWebhookUpdate(webhookData: any) {
    const message = `data: ${JSON.stringify(webhookData)}\n\n`;

    clients.forEach((controller) => {
        try {
            controller.enqueue(new TextEncoder().encode(message));
        } catch (error) {
            console.error('Error broadcasting to client:', error);
            clients.delete(controller);
        }
    });
}
