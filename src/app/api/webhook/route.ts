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

  console.log('Signature verification debug:', {
    receivedSignature: signature,
    expectedSignature: expectedSignature,
    payloadLength: payload.length,
    secretLength: secret.length,
    signaturesMatch: signature === expectedSignature,
    payloadPreview: payload.substring(0, 200) + '...',
    payloadEnd: payload.substring(payload.length - 50)
  });

  // Use simple string comparison instead of timingSafeEqual for better debugging
  return signature === expectedSignature;
}

// Apply theme to CSS variables
function applyThemeToCSS(theme: Theme): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-neutral: ${theme.colors.neutral};
      --color-info: ${theme.colors.info};
      --color-success: ${theme.colors.success};
      --color-warning: ${theme.colors.warning};
      --color-error: ${theme.colors.error};
      --radius-box: ${theme.radius.box}px;
      --radius-field: ${theme.radius.field}px;
      --radius-selector: ${theme.radius.selector}px;
      
      /* Legacy variables for backward compatibility */
      --primary: ${theme.colors.primary};
      --secondary: ${theme.colors.secondary};
      --accent: ${theme.colors.accent};
      --destructive: ${theme.colors.error};
      --success: ${theme.colors.success};
      --warning: ${theme.colors.warning};
    }
  `;
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
    const isDevelopment = process.env.NODE_ENV === 'development';
    const skipSignatureCheck = process.env.SKIP_SIGNATURE_CHECK === 'true';

    if (skipSignatureCheck) {
      console.warn('Skipping signature verification (SKIP_SIGNATURE_CHECK=true)');
    } else if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } else if (webhookSecret && !signature && !isDevelopment) {
      // Only require signature in production
      console.warn('Webhook secret is configured but no signature provided');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    } else if (webhookSecret && !signature && isDevelopment) {
      console.warn('Development mode: Skipping signature verification for local testing');
    }

    // Log the webhook for debugging
    console.log('🎨 DYNAMIC THEME GENERATOR WEBHOOK RECEIVED:');
    console.log('📋 Full webhook payload:', JSON.stringify(themeData, null, 2));
    console.log('🔑 Webhook details:', {
      themeId,
      themeName,
      theme,
      timestamp: new Date().toISOString(),
      signature: signature ? 'verified' : 'none',
      signatureLength: signature ? signature.length : 0,
      payloadLength: body.length,
    });
    console.log('🎨 Theme colors:', theme.colors);
    console.log('📐 Theme radius:', theme.radius);
    console.log('✨ Theme effects:', theme.effects);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Apply the theme to CSS variables
    const cssVariables = applyThemeToCSS(theme);
    console.log('🎨 Generated CSS variables:', cssVariables);
    console.log('📝 CSS variables summary:', {
      primaryColor: theme.colors.primary,
      secondaryColor: theme.colors.secondary,
      accentColor: theme.colors.accent,
      boxRadius: `${theme.radius.box}px`,
      fieldRadius: `${theme.radius.field}px`,
    });

    // Save theme to storage
    await saveThemeToStorage(themeData);

    // Store webhook data for client-side access
    const webhookInfo = {
      timestamp: new Date().toISOString(),
      themeId,
      themeName,
      theme,
      fullWebhookData: themeData,
      cssVariables: cssVariables,
    };

    console.log('Webhook data stored for client access:', webhookInfo);

    // Store the webhook data for client access
    try {
      // Store in a simple way that doesn't require external function imports
      const fs = await import('fs');
      const path = await import('path');

      // Create a simple JSON file to store the latest webhook data
      const webhookDataPath = path.join(process.cwd(), 'webhook-data.json');
      await fs.promises.writeFile(webhookDataPath, JSON.stringify(webhookInfo, null, 2));

      console.log('Webhook data stored to file:', webhookDataPath);
    } catch (error) {
      console.error('Failed to store webhook data:', error);
    }

    // Return the theme data so the client can apply it
    return NextResponse.json({
      success: true,
      message: 'Theme updated successfully',
      themeId,
      themeName,
      timestamp: new Date().toISOString(),
      cssVariables: cssVariables,
      theme: theme, // Include the full theme object for client-side application
      webhookInfo: webhookInfo, // Include the webhook info for client-side storage
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
      webhookSecretConfigured: !!process.env.WEBHOOK_SECRET,
      webhookSecretLength: process.env.WEBHOOK_SECRET ? process.env.WEBHOOK_SECRET.length : 0,
    },
  });
}
