# 🚀 Hostinger Deployment Guide for ayurvedicmantra.com

## Step 1: Check Your Hostinger Plan

**You need one of these Hostinger plans for Next.js:**
- ✅ **VPS Hosting** (Recommended) - Full Node.js support
- ✅ **Cloud Hosting** - Good for Next.js apps  
- ✅ **Business Hosting** - Limited Node.js support
- ❌ **Shared Hosting** - No Node.js support (upgrade required)

**Check your plan:** Login to Hostinger → Dashboard → Your hosting plan

---

## Step 2: Hostinger-Specific Setup

### Option A: VPS Hosting (Best Option) 🌟

**1. Access your VPS:**
- Go to Hostinger Dashboard → VPS → Manage
- Click "Browser Terminal" or use SSH

**2. Install Node.js on your VPS:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx (if not installed)
sudo apt install -y nginx
```

**3. Upload your files:**
```bash
# Create directory
sudo mkdir -p /var/www/ayurvedicmantra
sudo chown $USER:$USER /var/www/ayurvedicmantra

# Upload using Hostinger File Manager or SCP
# Upload the ayurvedicmantra-deployment.tar.gz file
cd /var/www/ayurvedicmantra
tar -xzf ayurvedicmantra-deployment.tar.gz
```

**4. Configure domain in Hostinger:**
- Go to Hostinger Dashboard → Domains
- Add ayurvedicmantra.com
- Point A record to your VPS IP
- Enable SSL in Hostinger panel

### Option B: Cloud Hosting 🌐

**1. Access Cloud Hosting:**
- Hostinger Dashboard → Cloud Hosting → Manage
- Use the provided SSH access

**2. Follow similar steps as VPS** (Node.js usually pre-installed)

**3. Use Hostinger's built-in SSL and domain management**

### Option C: Business Hosting (Limited) ⚠️

**If you have Business hosting:**
- Node.js support is limited
- You might need to use a static export instead
- Consider upgrading to VPS for full functionality

---

## Step 3: Hostinger File Manager Upload

**If you prefer using Hostinger's File Manager:**

**1. Prepare files locally:**
```bash
# Run our deployment script
./deploy.sh

# This creates: ayurvedicmantra-deployment.tar.gz
```

**2. Upload via Hostinger File Manager:**
- Login to Hostinger Dashboard
- Go to File Manager
- Navigate to public_html or your domain folder
- Upload ayurvedicmantra-deployment.tar.gz
- Extract using File Manager's extract option

**3. Set up Node.js in Hostinger panel:**
- Go to Advanced → Node.js
- Create new Node.js app
- Set startup file: server.js or npm start
- Set Node.js version: 18+

---

## Step 4: Hostinger-Specific Configuration

### Environment Variables in Hostinger

**1. In Hostinger Dashboard:**
- Go to Advanced → Environment Variables
- Add these variables:

```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://ayurvedicmantra.com
ADMIN_EMAIL=orders@ayurvedicmantra.com
SHIPROCKET_EMAIL=crepact@gmail.com
SHIPROCKET_PASSWORD=aDIL@8899
SHIPROCKET_CHANNEL_ID=7303784
```

### SSL Setup in Hostinger

**1. Enable SSL:**
- Hostinger Dashboard → SSL
- Enable "Force HTTPS"
- Choose "Let's Encrypt" (free)

**2. Domain settings:**
- Add www.ayurvedicmantra.com
- Set redirect from www to non-www

---

## Step 5: Start Your Application

### Using Hostinger's Node.js Manager

**1. If Hostinger has Node.js support:**
- Go to Advanced → Node.js
- Create new application
- Set domain: ayurvedicmantra.com
- Startup file: server.js
- Click "Create"

### Using PM2 (VPS only)

**1. Start with PM2:**
```bash
cd /var/www/ayurvedicmantra
pm2 start npm --name "ayurvedicmantra" -- start
pm2 save
pm2 startup
```

---

## Step 6: Hostinger-Specific Domain Setup

**1. DNS Configuration:**
- Hostinger Dashboard → Domains → DNS Zone
- Add these records:
  ```
  Type: A
  Name: @
  Points to: [Your server IP]
  
  Type: A  
  Name: www
  Points to: [Your server IP]
  
  Type: CNAME
  Name: www
  Points to: ayurvedicmantra.com
  ```

**2. Email setup for orders@ayurvedicmantra.com:**
- Go to Email → Create email account
- Create: orders@ayurvedicmantra.com
- This email will receive admin OTPs

---

## Step 7: Verify Everything Works

**1. Test your website:**
- Visit https://ayurvedicmantra.com
- Check all pages load properly
- Test order placement

**2. Test admin access:**
- Go to https://ayurvedicmantra.com/admin-login
- Request OTP for orders@ayurvedicmantra.com
- Check email for OTP code

**3. Test Shiprocket:**
- Place a test order
- Check if it syncs to Shiprocket

---

## Troubleshooting Common Hostinger Issues

### Issue 1: "Node.js not available"
**Solution:** Upgrade to VPS or Cloud hosting

### Issue 2: "Permission denied"
**Solution:**
```bash
sudo chown -R $USER:$USER /var/www/ayurvedicmantra
chmod -R 755 /var/www/ayurvedicmantra
```

### Issue 3: "SSL not working"
**Solution:** 
- Wait 24-48 hours for DNS propagation
- Force SSL renewal in Hostinger panel

### Issue 4: "Application not starting"
**Solution:**
```bash
# Check logs
pm2 logs ayurvedicmantra

# Restart
pm2 restart ayurvedicmantra
```

### Issue 5: "Email not working"
**Solution:**
- Verify email account created in Hostinger
- Check spam folder for OTP emails
- Update SMTP settings if needed

---

## Hostinger Support Resources

**If you need help:**
1. **Hostinger Live Chat** - 24/7 support
2. **Hostinger Knowledge Base** - Help articles
3. **Hostinger Community** - User forums

**Common Hostinger help topics:**
- "How to deploy Node.js app"
- "SSL certificate setup"  
- "Domain DNS configuration"
- "Email account creation"

---

## Cost Considerations

**Recommended Hostinger plan for your needs:**
- **VPS Plan** ($4-12/month) - Best performance
- **Cloud Hosting** ($8-15/month) - Good balance
- **Business Plan** ($3-8/month) - Budget option with limitations

**Domain cost:** ~$10-15/year for .com

---

## Final Checklist for Hostinger

- [ ] Correct hosting plan (VPS/Cloud recommended)
- [ ] Node.js 18+ installed/enabled
- [ ] Domain ayurvedicmantra.com added and configured
- [ ] SSL certificate enabled and working
- [ ] Email account orders@ayurvedicmantra.com created
- [ ] Application files uploaded and extracted
- [ ] Environment variables configured
- [ ] Application started and running
- [ ] All integrations tested (Shiprocket, orders, admin)

**🎉 Your ayurvedicmantra.com will be live with all features working!**