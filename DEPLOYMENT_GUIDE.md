# 🚀 Deployment Guide for ayurvedicmantra.com

## Prerequisites on Your Hosting Server

### 1. Server Requirements
- **Operating System**: Ubuntu 20.04+ or CentOS 7+
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 10GB free space
- **Node.js**: Version 18.x or higher
- **Domain**: ayurvedicmantra.com pointed to your server IP

### 2. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install SSL (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
```

## Step-by-Step Deployment

### Step 1: Prepare Your Local Code

1. **Build the application locally:**
```bash
npm install
npm run build
```

2. **Create deployment package:**
```bash
chmod +x deploy.sh
./deploy.sh
```

3. **Upload to server:**
```bash
# Upload the tar.gz file to your server
scp ayurvedicmantra-deployment.tar.gz user@your-server:/var/www/
```

### Step 2: Server Setup

1. **Connect to your server:**
```bash
ssh user@your-server-ip
```

2. **Create application directory:**
```bash
sudo mkdir -p /var/www/ayurvedicmantra
sudo chown $USER:$USER /var/www/ayurvedicmantra
cd /var/www/ayurvedicmantra
```

3. **Extract application:**
```bash
tar -xzf ../ayurvedicmantra-deployment.tar.gz
```

4. **Set up environment:**
```bash
# Copy production environment
cp .env.production .env.local

# Update the environment file with your specific details
nano .env.local
```

### Step 3: Configure Nginx

1. **Create Nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/ayurvedicmantra
```

2. **Copy the nginx.conf content from server-configs/nginx.conf**

3. **Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/ayurvedicmantra /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d ayurvedicmantra.com -d www.ayurvedicmantra.com

# Auto-renewal setup
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### Step 5: Start the Application

1. **Start with PM2:**
```bash
cd /var/www/ayurvedicmantra
pm2 start npm --name "ayurvedicmantra" -- start
pm2 save
pm2 startup
```

2. **Configure auto-start:**
```bash
sudo systemctl enable pm2-$USER
```

### Step 6: Verify Deployment

1. **Check application status:**
```bash
pm2 status
pm2 logs ayurvedicmantra
```

2. **Test the website:**
```bash
curl -I https://ayurvedicmantra.com
```

3. **Monitor logs:**
```bash
pm2 logs ayurvedicmantra --lines 100
```

## Important Post-Deployment Checks

### 1. Test All Integrations

- ✅ **Shiprocket**: Orders should sync automatically
- ✅ **Payment Gateway**: Test transactions
- ✅ **Email/SMS**: Verify notifications
- ✅ **Admin Panel**: Access via orders@ayurvedicmantra.com
- ✅ **Security**: Only OTP login should work

### 2. Performance Optimization

```bash
# Enable swap (if needed)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Add to /etc/fstab for persistence
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 3. Monitoring Setup

```bash
# Install monitoring tools
sudo npm install -g pm2-web
pm2 install pm2-server-monit

# View monitoring dashboard
pm2 web
```

## Backup Strategy

### Daily Backups
```bash
# Create backup script
sudo nano /usr/local/bin/backup-ayurvedicmantra.sh
```

Add backup script content and make it executable:
```bash
sudo chmod +x /usr/local/bin/backup-ayurvedicmantra.sh

# Add to crontab
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-ayurvedicmantra.sh
```

## Troubleshooting

### Common Issues:

1. **Application won't start:**
```bash
pm2 logs ayurvedicmantra
pm2 restart ayurvedicmantra
```

2. **SSL issues:**
```bash
sudo certbot renew --dry-run
sudo nginx -t && sudo systemctl reload nginx
```

3. **High memory usage:**
```bash
pm2 reload ayurvedicmantra
```

4. **Database/storage issues:**
```bash
# Check disk space
df -h
# Clear logs
pm2 flush
```

## Security Checklist

- ✅ SSL certificate installed and auto-renewing
- ✅ Firewall configured (ports 22, 80, 443 only)
- ✅ Regular security updates scheduled
- ✅ Admin access restricted to OTP only
- ✅ Database/storage properly secured
- ✅ Backup strategy implemented

## Maintenance

### Weekly Tasks:
- Check PM2 status and logs
- Monitor server resources
- Verify SSL certificate status
- Test critical functionality

### Monthly Tasks:
- Update system packages
- Review and rotate logs
- Test backup restoration
- Security audit

---

## 🆘 Emergency Contacts

- **Technical Issues**: Check PM2 logs first
- **SSL Problems**: Re-run certbot
- **High Traffic**: Scale PM2 instances
- **Security Concerns**: Check firewall and logs

**Your application is now live at: https://ayurvedicmantra.com** 🎉