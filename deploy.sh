#!/bin/bash

echo "🚀 Starting deployment for ayurvedicmantra.com..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Step 2: Build the application
echo "🔨 Building the application..."
npm run build

# Step 3: Test the build
echo "🧪 Testing the build..."
npm run lint

# Step 4: Create deployment package
echo "📦 Creating deployment package..."
tar -czf ayurvedicmantra-deployment.tar.gz \
  .next/ \
  public/ \
  package.json \
  package-lock.json \
  next.config.js \
  .env.production \
  node_modules/

echo "✅ Deployment package created: ayurvedicmantra-deployment.tar.gz"
echo "📁 Upload this file to your hosting server"
echo ""
echo "📋 Next steps:"
echo "1. Upload ayurvedicmantra-deployment.tar.gz to your server"
echo "2. Extract it: tar -xzf ayurvedicmantra-deployment.tar.gz"
echo "3. Start the application: npm start"
echo "4. Set up reverse proxy (nginx) to point to port 3000"
echo ""
echo "🔧 Server requirements:"
echo "- Node.js 18+ installed"
echo "- PM2 for process management (recommended)"
echo "- Nginx for reverse proxy (recommended)"