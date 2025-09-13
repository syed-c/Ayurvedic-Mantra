# 🚀 Hostinger Cloud Professional Deployment Steps for ayurvedicmantra.com

## Your Plan is Perfect! ✅

**Hostinger Cloud Professional** is ideal for your ayurvedic website:
- ✅ Full Node.js 18+ support
- ✅ Easy domain management
- ✅ Free SSL certificates
- ✅ Email hosting included
- ✅ Great performance for your traffic

---

## Step 1: Prepare Your Files (5 minutes)

**Run the deployment script:**
```bash
chmod +x deploy-cloud-professional.sh
./deploy-cloud-professional.sh
```

**This creates:** `ayurvedicmantra-cloud.tar.gz` (your upload file)

---

## Step 2: Hostinger Dashboard Setup (10 minutes)

### A. Add Your Domain

1. **Login to Hostinger Dashboard**
2. **Go to:** Domains → Add Domain
3. **Add:** ayurvedicmantra.com
4. **DNS:** Will auto-configure to your Cloud Professional server
5. **SSL:** Enable "Force HTTPS" (free Let's Encrypt)

### B. Create Admin Email

1. **Go to:** Email → Create Email Account
2. **Create:** orders@ayurvedicmantra.com
3. **Password:** Choose a strong password
4. **Purpose:** This receives admin OTP codes

### C. Upload Your Application

**Option 1 - File Manager (Recommended):**
1. **Go to:** File Manager
2. **Navigate to:** public_html/ayurvedicmantra.com
3. **Upload:** ayurvedicmantra-cloud.tar.gz
4. **Extract:** Right-click → Extract here

**Option 2 - SSH Access:**
1. **Go to:** Advanced → SSH Access
2. **Upload and extract:** tar -xzf ayurvedicmantra-cloud.tar.gz

---

## Step 3: Configure Node.js Application (5 minutes)

### A. Create Node.js App

1. **Go to:** Advanced → Node.js Selector
2. **Click:** Create Application
3. **Settings:**
   - **Domain:** ayurvedicmantra.com
   - **Node.js Version:** 18+ (latest available)
   - **Application Root:** /public_html/ayurvedicmantra.com
   - **Application Startup File:** server.js
   - **Application URL:** https://ayurvedicmantra.com

4. **Click:** Create

### B. Set Environment Variables

**In the Node.js app settings, add these:**
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://ayurvedicmantra.com
ADMIN_EMAIL=orders@ayurvedicmantra.com
SHIPROCKET_EMAIL=crepact@gmail.com
SHIPROCKET_PASSWORD=aDIL@8899
SHIPROCKET_CHANNEL_ID=7303784
```

### C. Install Dependencies & Start

1. **In the Node.js app panel:** Click "Run NPM Install"
2. **Then:** Click "Restart App"

---

## Step 4: Verify Everything Works (5 minutes)

### Test Your Website:
- ✅ **Main site:** https://ayurvedicmantra.com
- ✅ **Admin login:** https://ayurvedicmantra.com/admin-login
- ✅ **Order process:** Place a test order
- ✅ **Shiprocket sync:** Check if order appears in Shiprocket dashboard

### Test Admin Access:
1. **Go to:** https://ayurvedicmantra.com/admin-login
2. **Enter:** orders@ayurvedicmantra.com
3. **Check email:** OTP code should arrive
4. **Login:** Verify admin dashboard works

### Test Order Process:
1. **Place order:** Go through checkout process
2. **Check Shiprocket:** Login to Shiprocket panel
3. **Verify sync:** Order should appear automatically

---

## Step 5: Final Optimizations (Optional)

### A. Performance Settings

**In Hostinger Dashboard:**
- **Enable:** CloudFlare integration (free)
- **Enable:** Browser caching
- **Enable:** GZIP compression

### B. Monitoring Setup

**In Cloud Professional dashboard:**
- **Check:** Application logs regularly
- **Monitor:** Server resource usage
- **Set up:** Email alerts for downtime

---

## Troubleshooting Common Issues

### Issue 1: "Application not starting"
**Solution:**
- Check Node.js version is 18+
- Verify server.js file exists
- Check application logs

### Issue 2: "Domain not resolving"
**Solution:**
- Wait 24-48 hours for DNS propagation
- Clear browser cache
- Check domain DNS settings

### Issue 3: "SSL certificate error"
**Solution:**
- Force SSL renewal in Hostinger
- Wait for certificate generation
- Clear browser cache

### Issue 4: "Email not working"
**Solution:**
- Verify email account created
- Check spam folder
- Test email sending manually

---

## Your Integrations Status ✅

**All these will work exactly as before:**

🚚 **Shiprocket Integration:** 
- Credentials preserved (crepact@gmail.com)
- Auto-order sync working
- AWB generation ready

🔐 **Security System:**
- OTP-only admin access
- No password logins allowed
- Admin restricted to orders@ayurvedicmantra.com

💰 **Order Processing:**
- Complete checkout flow
- Payment integration ready
- Customer dashboard working

📧 **Communication System:**
- Order confirmations
- SMS notifications
- Email delivery

---

## Support & Help

**Hostinger Cloud Professional Support:**
- **Live Chat:** 24/7 available
- **Knowledge Base:** Extensive documentation
- **Phone Support:** Available on your plan

**Common Help Topics:**
- "Node.js application setup"
- "Domain SSL configuration"
- "Email account management"
- "Application monitoring"

---

## Cost Summary

**Your Cloud Professional plan includes:**
- ✅ Node.js hosting
- ✅ SSL certificates
- ✅ Email hosting
- ✅ Domain management
- ✅ Daily backups
- ✅ 24/7 support

**Additional costs:**
- **Domain registration:** ~$12/year (ayurvedicmantra.com)
- **No other fees required**

---

## Final Checklist

- [ ] Domain ayurvedicmantra.com added and configured
- [ ] SSL certificate enabled and working
- [ ] Email orders@ayurvedicmantra.com created
- [ ] Node.js application created and running
- [ ] Environment variables configured
- [ ] Application files uploaded and extracted
- [ ] Website loading at https://ayurvedicmantra.com
- [ ] Admin panel accessible with OTP
- [ ] Order process tested
- [ ] Shiprocket integration verified

**🎉 Your ayurvedicmantra.com is ready to go live!**

**Estimated total setup time:** 25-30 minutes
**Your professional ayurvedic website will be live with all features working!**