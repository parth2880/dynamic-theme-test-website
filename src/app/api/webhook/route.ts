import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

interface ThemeRadius {
  box: number;
  field: number;
  selector: number;
}

interface ThemeEffects {
  depth: boolean;
  noise: boolean;
}

interface Theme {
  colors: ThemeColors;
  radius: ThemeRadius;
  effects: ThemeEffects;
}

interface ThemeData {
  theme: Theme;
  themeId: string;
  themeName: string;
  timestamp?: string;
  signature?: string;
}

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const themeData: ThemeData = JSON.parse(body);

    // Extract theme information as per the guide
    const { theme, themeId, themeName, signature } = themeData;

    if (!theme || !themeId) {
      return NextResponse.json(
        { error: 'Invalid webhook payload - missing theme or themeId' },
        { status: 400 }
      );
    }

    // Verify webhook signature if WEBHOOK_SECRET is set
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } else if (webhookSecret && !signature) {
      console.warn('Webhook secret is configured but no signature provided');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Log the webhook for debugging
    console.log('Theme webhook received:', {
      themeId,
      themeName,
      theme,
      timestamp: new Date().toISOString(),
      signature: signature ? 'verified' : 'none',
    });

    // In a real implementation, you would:
    // 1. Save theme to database
    // 2. Update CSS variables dynamically
    // 3. Trigger a rebuild if needed

    // For demo purposes, we'll store the theme in memory
    // In production, save to database or file system
    await saveThemeToStorage(themeData);

    return NextResponse.json({
      success: true,
      message: 'Theme updated successfully',
      themeId,
      themeName,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Theme webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}

// Simulate saving theme to storage
async function saveThemeToStorage(themeData: ThemeData): Promise<void> {
  // In production, save to database or file system
  // For demo, we'll just log it
  console.log('Saving theme to storage:', themeData);

  // You could also save to a JSON file or database here
  // await fs.writeFile('./theme-data.json', JSON.stringify(themeData));
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({
    status: 'healthy',
    message: 'Theme webhook endpoint is ready',
    timestamp: new Date().toISOString(),
    features: {
      signatureVerification: !!process.env.WEBHOOK_SECRET,
      environment: process.env.NODE_ENV || 'development',
    },
  });
}
