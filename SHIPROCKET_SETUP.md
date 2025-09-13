# 🚚 Shiprocket Integration Setup Guide

## Overview
Your SlimX Mantra website now has **real-time Shiprocket integration**! When customers place orders (guest or logged-in), their details are automatically sent to Shiprocket for shipping management.

## ✅ What's Implemented

### 🔄 **Real-Time Order Flow**
1. **Customer places order** → Order saved locally
2. **Automatic Shiprocket submission** → Order details sent to Shiprocket API
3. **Shipping label generation** → Shiprocket creates AWB and assigns courier
4. **Order confirmation** → Customer gets email/SMS with tracking info

### 📦 **Order Data Sent to Shiprocket**
- **Customer Details:** Name, phone, email, full address, PIN code
- **Product Info:** Plan name, price, quantity, HSN code
- **Shipping Details:** Package dimensions, weight, pickup location
- **Payment Method:** Prepaid/COD status

### 🎛️ **Admin Control Panel**
- **Configure Shiprocket credentials** in Super Admin → Shipping tab
- **Test API connection** before going live
- **Enable/disable integration** as needed
- **Set package dimensions** for accurate shipping costs

## 🛠️ Setup Instructions

### Step 1: Get Shiprocket API Credentials
1. Log into your **Shiprocket dashboard**
2. Go to **Settings → API → Configure**
3. Click **"Create An API User"**
4. Enter your **email and password** (these become your API credentials)
5. Note down the **Channel ID** from Integrations section

### Step 2: Configure in Admin Panel
1. Login to **Super Admin Dashboard**
2. Go to **"Shipping"** tab
3. Enter your **Shiprocket email and password**
4. Add your **Channel ID**
5. Set **pickup location** (usually "Primary")
6. Configure **package dimensions** for your products

### Step 3: Test the Integration
1. Click **"Test Shiprocket Connection"** button
2. Verify successful authentication
3. Enable the integration once testing passes
4. Place a test order to confirm everything works

### Step 4: Go Live
1. Switch **Test Mode** to OFF
2. Enable **"Enable Shiprocket"** toggle
3. All new orders will automatically sync to Shiprocket

## 📊 Features

### ✅ **Automated Order Processing**
- Orders automatically appear in your Shiprocket dashboard
- Shipping labels generated instantly
- Courier assignment based on serviceability
- Real-time tracking updates

### ✅ **Error Handling**
- If Shiprocket fails, orders still process normally
- Error logging for debugging
- Fallback ensures no orders are lost

### ✅ **Data Mapping**
```javascript
SlimX Order → Shiprocket Format:
- Customer name → billing_customer_name
- Phone → billing_phone
- Address → billing_address
- PIN code → billing_pincode
- Plan name → order_items[0].name
- Price → order_items[0].selling_price
```

## 🔧 Configuration Options

### Package Dimensions
- **Length:** 15cm (default)
- **Breadth:** 10cm (default)  
- **Height:** 5cm (default)
- **Weight:** 0.5kg (default)

### HSN Code
- **30049090** (Health supplements - auto-assigned)

### Payment Methods
- **Prepaid:** Online payments
- **COD:** Cash on delivery (if enabled)

## 🚨 Important Notes

### Security
- **API credentials are encrypted** and stored securely
- **Test mode available** for safe testing
- **Real credentials never exposed** in frontend

### Order Flow
- **Guest orders:** Full address captured and sent to Shiprocket
- **Logged-in users:** Saved address used for shipping
- **PIN code validation:** Ensures deliverable locations

### Troubleshooting
- Check **server logs** for Shiprocket API errors
- Verify **credentials** using test connection
- Ensure **pickup location** exists in Shiprocket
- Confirm **package dimensions** are realistic

## 📈 Benefits

### For You (Admin)
- **Automated shipping** - no manual data entry
- **Real-time sync** - orders appear instantly in Shiprocket
- **Professional tracking** - customers get courier tracking
- **Cost optimization** - Shiprocket finds best courier rates

### For Customers
- **Faster processing** - immediate shipping label generation
- **Better tracking** - real courier tracking numbers
- **Reliable delivery** - professional courier network
- **Transparent communication** - real delivery updates

## 🎯 Ready to Use!
Your Shiprocket integration is complete and ready. Just add your credentials in the admin panel and start enjoying automated shipping management!

---
**Need help?** Check the admin logs or test the connection to troubleshoot any issues.