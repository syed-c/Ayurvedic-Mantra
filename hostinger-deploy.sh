#!/bin/bash

echo "🚀 Starting Hostinger deployment for ayurvedicmantra.com..."

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next/
rm -rf node_modules/
rm -f ayurvedicmantra-hostinger.tar.gz

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Step 3: Build the application  
echo "🔨 Building the application..."
npm run build

# Step 4: Create Hostinger-specific server.js
echo "⚙️ Creating Hostinger server configuration..."
cat > server.js << 'EOF'
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || 3000

// When using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
EOF

# Step 5: Create .htaccess for Hostinger (if using shared hosting)
echo "📄 Creating .htaccess file..."
cat > .htaccess << 'EOF'
# Redirect to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Node.js application
DirectoryIndex server.js

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static files
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  Header set Cache-Control "public, immutable"
</FilesMatch>
EOF

# Step 6: Create startup script for Hostinger
echo "🚀 Creating startup script..."
cat > start-hostinger.sh << 'EOF'
#!/bin/bash
echo "Starting ayurvedicmantra.com on Hostinger..."

# Set production environment
export NODE_ENV=production
export PORT=3000

# Start the application
node server.js
EOF

chmod +x start-hostinger.sh

# Step 7: Copy hostinger-specific package.json
echo "📋 Using Hostinger-optimized package.json..."
cp hostinger-specific-files/package.json ./package.json

# Step 8: Create deployment package specifically for Hostinger
echo "📦 Creating Hostinger deployment package..."
tar -czf ayurvedicmantra-hostinger.tar.gz \
  .next/ \
  public/ \
  package.json \
  server.js \
  .htaccess \
  start-hostinger.sh \
  next.config.js \
  .env.production \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=src \
  --exclude=components \
  --exclude=app

# Step 9: Create upload instructions
echo "📝 Creating upload instructions..."
cat > HOSTINGER_UPLOAD_INSTRUCTIONS.txt << 'EOF'
🚀 HOSTINGER UPLOAD INSTRUCTIONS

1. LOGIN TO HOSTINGER:
   - Go to hostinger.com
   - Login to your account
   - Go to Hosting → Manage

2. UPLOAD FILES:
   Option A - File Manager:
   - Click "File Manager" 
   - Navigate to public_html or your domain folder
   - Upload ayurvedicmantra-hostinger.tar.gz
   - Right-click → Extract

   Option B - SSH (VPS only):
   - Click "SSH Access" or "Terminal"
   - Upload file and extract:
     tar -xzf ayurvedicmantra-hostinger.tar.gz

3. CONFIGURE NODE.JS:
   - Go to Advanced → Node.js
   - Create New Application
   - Domain: ayurvedicmantra.com
   - Startup file: server.js
   - Node version: 18+
   - Click Create

4. SET ENVIRONMENT VARIABLES:
   - Go to Advanced → Environment Variables
   - Add all variables from .env.production file

5. CONFIGURE DOMAIN:
   - Go to Domains → Manage
   - Add ayurvedicmantra.com
   - Enable SSL (Let's Encrypt)
   - Set up DNS records

6. CREATE EMAIL:
   - Go to Email → Create Account
   - Create: orders@ayurvedicmantra.com
   - This will receive admin OTP codes

7. TEST YOUR SITE:
   - Visit https://ayurvedicmantra.com
   - Test admin login at /admin-login
   - Place a test order

TROUBLESHOOTING:
- If Node.js not available: Upgrade to VPS/Cloud hosting
- If SSL not working: Wait 24-48 hours for DNS propagation
- If site not loading: Check file permissions and Node.js app status

SUPPORT:
- Hostinger Live Chat (24/7)
- Check application logs in Hostinger dashboard
EOF

echo ""
echo "✅ Hostinger deployment package created successfully!"
echo ""
echo "📂 Files created:"
echo "  - ayurvedicmantra-hostinger.tar.gz (Upload this to Hostinger)"
echo "  - server.js (Hostinger-compatible server)"
echo "  - .htaccess (Web server configuration)"
echo "  - start-hostinger.sh (Startup script)"
echo "  - HOSTINGER_UPLOAD_INSTRUCTIONS.txt (Step-by-step guide)"
echo ""
echo "📋 Next steps:"
echo "1. Read HOSTINGER_UPLOAD_INSTRUCTIONS.txt"
echo "2. Upload ayurvedicmantra-hostinger.tar.gz to Hostinger"
echo "3. Follow the configuration steps"
echo "4. Test your live website!"
echo ""
echo "🎉 Your ayurvedicmantra.com is ready for Hostinger hosting!"