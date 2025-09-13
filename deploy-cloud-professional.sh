#!/bin/bash

echo "🚀 Hostinger Cloud Professional Deployment for ayurvedicmantra.com"
echo "======================================================================"

# Step 1: Optimize for Cloud Professional
echo "☁️ Optimizing for Hostinger Cloud Professional..."

# Clean previous builds
rm -rf .next/ node_modules/ ayurvedicmantra-cloud.tar.gz

# Install dependencies for production
echo "📦 Installing production dependencies..."
npm install --omit=dev

# Build optimized for Cloud Professional
echo "🔨 Building optimized application..."
npm run build

# Create Cloud Professional specific server
echo "⚙️ Creating Cloud Professional server..."
cat > server.js << 'EOF'
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false // Always production on Hostinger
const hostname = '0.0.0.0' // Cloud Professional requirement
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log('🌟 Starting Ayurvedic Mantra on Hostinger Cloud Professional...')

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('❌ Error:', err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })
    .once('error', (err) => {
      console.error('❌ Server error:', err)
      process.exit(1)
    })
    .listen(port, hostname, () => {
      console.log(`✅ Ayurvedic Mantra ready on http://${hostname}:${port}`)
      console.log(`🌐 Domain: https://ayurvedicmantra.com`)
    })
})
EOF

# Create Cloud Professional package.json
echo "📋 Creating Cloud Professional package.json..."
cat > package.json << 'EOF'
{
  "name": "ayurvedicmantra",
  "version": "1.0.0",
  "description": "Ayurvedic Mantra - Weight Loss Solutions",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "build": "next build",
    "dev": "next dev"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.0.1",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-aspect-ratio": "^1.1.2",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.3",
    "@radix-ui/react-context-menu": "^2.2.6",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-hover-card": "^1.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-navigation-menu": "^1.2.5",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-toggle": "^1.1.2",
    "@radix-ui/react-toggle-group": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8",
    "axios": "^1.10.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.5.2",
    "framer-motion": "^12.6.3",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.487.0",
    "next": "15.2.4",
    "next-themes": "^0.4.6",
    "react": "^18.3.1",
    "react-beautiful-dnd": "^13.1.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.55.0",
    "react-resizable-panels": "^2.1.7",
    "react-sortablejs": "^6.1.4",
    "recharts": "^2.15.1",
    "sonner": "^2.0.3",
    "tailwind-merge": "^3.1.0",
    "tw-animate-css": "^1.2.5",
    "vaul": "^1.1.2",
    "zod": "^3.24.2"
  }
}
EOF

# Create deployment package for Cloud Professional
echo "📦 Creating Cloud Professional deployment package..."
tar -czf ayurvedicmantra-cloud.tar.gz \
  .next/ \
  public/ \
  package.json \
  server.js \
  next.config.js \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=src

echo ""
echo "✅ Cloud Professional deployment package ready!"
echo ""
echo "📂 Created: ayurvedicmantra-cloud.tar.gz"
echo "📄 Optimized for: Hostinger Cloud Professional"
echo "🌐 Domain: ayurvedicmantra.com"
echo ""
echo "🎉 Ready to upload to Hostinger!"