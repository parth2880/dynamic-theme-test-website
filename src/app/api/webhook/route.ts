import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const themeData = await request.json();

    // Extract theme information as per the guide
    const { theme, themeId, themeName } = themeData;

    if (!theme || !themeId) {
      return NextResponse.json(
        { error: 'Invalid webhook payload - missing theme or themeId' },
        { status: 400 }
      );
    }

    // Generate CSS variables as shown in the guide
    const cssVariables = `
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
      }
    `;

    // Log the webhook for debugging
    console.log('Theme webhook received:', {
      themeId,
      themeName,
      theme,
      timestamp: new Date().toISOString(),
    });

    // In a real implementation, you would:
    // 1. Validate the webhook signature
    // 2. Save theme to database
    // 3. Update CSS variables dynamically
    // 4. Trigger a rebuild if needed

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
async function saveThemeToStorage(themeData: any) {
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
  });
}
