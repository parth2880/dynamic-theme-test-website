# Dynamic Theme Test Website

A Next.js test website that demonstrates dynamic theme updates via webhooks. This site serves as a testing ground for theme pusher systems and dynamic theme generation.

## Features

- **Dynamic Theme Updates**: Real-time theme changes via webhook notifications
- **Portfolio Website**: Complete portfolio site with multiple sections
- **Webhook Endpoint**: API endpoint to receive theme updates
- **Theme Persistence**: Themes are saved to localStorage
- **Smooth Transitions**: CSS transitions for theme changes
- **Responsive Design**: Works on all device sizes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Webhook Integration

### Webhook Endpoint

The website includes a webhook endpoint at `/api/webhook` that accepts POST requests with theme data.

**Endpoint**: `POST /api/webhook`

**Request Body** (following the Dynamic Theme Generator format):
```json
{
  "theme": {
    "colors": {
      "primary": "#3b82f6",
      "secondary": "#64748b",
      "accent": "#f59e0b",
      "neutral": "#6b7280",
      "info": "#06b6d4",
      "success": "#10b981",
      "warning": "#f59e0b",
      "error": "#ef4444"
    },
    "radius": {
      "box": 8,
      "field": 6,
      "selector": 4
    },
    "effects": {
      "depth": true,
      "noise": false
    }
  },
  "themeId": "theme_123",
  "themeName": "My Custom Theme",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Theme updated successfully",
  "themeId": "theme_123",
  "themeName": "My Custom Theme",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Health Check

Check if the webhook endpoint is ready:
```bash
curl http://localhost:3000/api/webhook
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`

## Theme Pusher Integration

### 1. Register Your Site

After deploying, register your site in your theme pusher system with:
- **Site URL**: Your deployed website URL
- **Webhook URL**: `https://your-site.com/api/webhook`
- **Site ID**: A unique identifier for your site

### 2. Test Webhook

Use the "Test Webhook" button in the bottom-right corner to simulate a theme update.

### 3. Receive Updates

The website will automatically update its theme when it receives webhook notifications from your theme pusher system.

## Theme Variables

The website uses the following CSS custom properties for theming:

### Primary Theme Variables (from Dynamic Theme Generator):
- `--color-primary`: Primary brand color
- `--color-secondary`: Secondary color
- `--color-accent`: Accent color
- `--color-neutral`: Neutral color
- `--color-info`: Info color
- `--color-success`: Success color
- `--color-warning`: Warning color
- `--color-error`: Error color
- `--radius-box`: Box border radius
- `--radius-field`: Form field border radius
- `--radius-selector`: Selector border radius

### Legacy Variables (for backward compatibility):
- `--background`: Main background color
- `--foreground`: Main text color
- `--muted`: Muted text color
- `--border`: Border color
- `--card`: Card background color
- `--popover`: Popover background color

## Development

### Project Structure

```
src/
├── app/
│   ├── api/webhook/route.ts    # Webhook endpoint
│   ├── globals.css             # Global styles and theme variables
│   ├── layout.tsx              # Root layout with ThemeProvider
│   └── page.tsx                # Main page
└── components/
    ├── ThemeProvider.tsx       # Theme context and management
    ├── PortfolioSite.tsx       # Portfolio website component
    └── WebhookEndpoint.tsx     # Webhook status component
```

### Adding New Theme Variables

1. Add the variable to the `Theme` interface in `ThemeProvider.tsx`
2. Add the CSS custom property to `globals.css`
3. Update the default theme object
4. Use the variable in your components

## Testing

### Manual Webhook Testing

You can test the webhook endpoint manually using curl:

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "theme": {
      "colors": {
        "primary": "#8b5cf6",
        "secondary": "#94a3b8",
        "accent": "#f97316",
        "neutral": "#6b7280",
        "info": "#06b6d4",
        "success": "#10b981",
        "warning": "#f59e0b",
        "error": "#ef4444"
      },
      "radius": {
        "box": 12,
        "field": 8,
        "selector": 6
      },
      "effects": {
        "depth": true,
        "noise": false
      }
    },
    "themeId": "test_theme_123",
    "themeName": "Test Purple Theme"
  }'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
