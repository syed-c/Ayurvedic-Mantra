// Centralized communication services for SMTP and SMS/Twilio
import { NextResponse } from 'next/server';

// Types for communication settings
export interface SMSConfig {
  enabled: boolean;
  provider: string;
  apiKey: string;
  senderId: string;
  template: string;
  baseUrl?: string; // For Infobip
}

export interface EmailConfig {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromName: string;
  subject: string;
}

export interface CommunicationSettings {
  sms: SMSConfig;
  email: EmailConfig;
}

// ENV email config override (optional)
function getEnvEmailConfig(): Partial<EmailConfig> | null {
  try {
    const host = process.env.SMTP_HOST;
    const portRaw = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = portRaw ? parseInt(portRaw as string, 10) : undefined;
    if (host && port && user && pass) {
      return {
        enabled: true,
        smtpHost: host,
        smtpPort: port,
        username: user,
        password: pass,
        fromName: process.env.SMTP_FROM_NAME || 'Ayurvedic Mantra',
        subject: process.env.SMTP_DEFAULT_SUBJECT || 'Your Login OTP - Ayurvedic Mantra'
      } as EmailConfig;
    }
  } catch {}
  return null;
}

function mergeEmailConfig(baseEmail: EmailConfig, overridePartial?: Partial<EmailConfig> | null): EmailConfig {
  if (!overridePartial) return baseEmail;
  return {
    enabled: overridePartial.enabled ?? baseEmail.enabled,
    smtpHost: overridePartial.smtpHost ?? baseEmail.smtpHost,
    smtpPort: overridePartial.smtpPort ?? baseEmail.smtpPort,
    username: overridePartial.username ?? baseEmail.username,
    password: overridePartial.password ?? baseEmail.password,
    fromName: overridePartial.fromName ?? baseEmail.fromName,
    subject: overridePartial.subject ?? baseEmail.subject,
  } as EmailConfig;
}

// Get current communication settings from persistent storage
async function getCommunicationSettings(): Promise<CommunicationSettings | null> {
  try {
    // Import storage dynamically to avoid circular dependencies
    const { storage } = await import('./storage');
    const settings = await storage.load();
    
    console.log('📧 Loading communication settings from persistent storage');
    
    const communications = settings.communications;
    if (communications && communications.sms && communications.email) {
      const envEmail = getEnvEmailConfig();
      return {
        sms: communications.sms,
        email: mergeEmailConfig(communications.email, envEmail)
      } as CommunicationSettings;
    } else {
      console.warn('⚠️ Communications settings incomplete, using defaults');
      const defaults = getDefaultCommunicationSettings();
      const envEmail = getEnvEmailConfig();
      return {
        sms: defaults.sms,
        email: mergeEmailConfig(defaults.email, envEmail)
      } as CommunicationSettings;
    }
  } catch (error) {
    console.error('❌ Error fetching communication settings:', error);
    const defaults = getDefaultCommunicationSettings();
    const envEmail = getEnvEmailConfig();
    return {
      sms: defaults.sms,
      email: mergeEmailConfig(defaults.email, envEmail)
    } as CommunicationSettings;
  }
}

// Default communication settings fallback
function getDefaultCommunicationSettings(): CommunicationSettings {
  return {
    sms: {
      enabled: true,
      provider: "infobip",
      apiKey: "42722043657b0c8bc9c75d13df7469f3-c238a19f-3c29-48d9-a969-ebaa38a4a868",
      senderId: "AyurMantra",
      template: "Your OTP is {otp}. Use this to verify your action on SlimX Mantra. Valid for 10 minutes.",
      baseUrl: "https://pez91m.api.infobip.com"
    },
    email: {
      enabled: true,
      smtpHost: "smtp.titan.email",
      smtpPort: 465,
      username: "",
      password: "",
      fromName: "Ayurvedic Mantra",
      subject: "Your Login OTP - Ayurvedic Mantra"
    }
  };
}

// Send SMS using configured provider (Twilio/Fast2SMS)
export async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    console.log(`📱 Sending SMS to ${phone}:`, message);
    
    const settings = await getCommunicationSettings();
    if (!settings?.sms?.enabled || !settings.sms.apiKey) {
      console.error('❌ SMS not enabled or API key missing');
      return false;
    }

    const { provider, apiKey, senderId } = settings.sms;

    if (provider === 'twilio') {
      return await sendTwilioSMS(phone, message, apiKey, senderId);
    } else if (provider === 'fast2sms') {
      return await sendFast2SMS(phone, message, apiKey, senderId);
    } else if (provider === 'infobip') {
      return await sendInfobipSMS(phone, message, apiKey, senderId, settings.sms.baseUrl || 'https://pez91m.api.infobip.com');
    } else {
      console.error('❌ Unsupported SMS provider:', provider);
      return false;
    }
  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    return false;
  }
}

// Send email with HTML content
export async function sendEmailWithHtml(to: string, subject: string, htmlBody: string): Promise<boolean> {
  try {
    console.log(`📧 Sending HTML email to ${to}:`, subject);
    
    const settings = await getCommunicationSettings();
    if (!settings?.email?.enabled || !settings.email.username || !settings.email.password) {
      console.error('❌ Email not enabled or credentials missing');
      return false;
    }

    // Import nodemailer dynamically
    const nodemailer = require('nodemailer');
    
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: settings.email.smtpHost,
      port: settings.email.smtpPort,
      secure: settings.email.smtpPort === 465,
      auth: {
        user: settings.email.username,
        pass: settings.email.password,
      },
      tls: {
        minVersion: 'TLSv1.2'
      },
      pool: true,
      maxConnections: 1,
      debug: false,
      logger: false
    });

    // Send email with HTML
    const mailOptions = {
      from: `${settings.email.fromName} <${settings.email.username}>`,
      to: to,
      subject: subject,
      html: htmlBody,
      text: htmlBody.replace(/<[^>]*>/g, '') // Strip HTML for plain text fallback
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ HTML Email sent successfully:', result.messageId);
    return true;
    
  } catch (error) {
    console.error('❌ HTML Email sending failed:', error);
    return false;
  }
}

// Send email using SMTP settings
export async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  try {
    console.log(`📧 Sending email to ${to}:`, subject);
    
    const settings = await getCommunicationSettings();
    if (!settings?.email?.enabled || !settings.email.username || !settings.email.password) {
      console.error('❌ Email not enabled or credentials missing');
      return false;
    }

    // Import nodemailer dynamically (Next.js compatible)
    const nodemailer = require('nodemailer');
    
    // Create SMTP transporter with proper SSL/TLS handling for Titan Email
    const transporter = nodemailer.createTransport({
      host: settings.email.smtpHost,
      port: settings.email.smtpPort,
      secure: settings.email.smtpPort === 465, // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user: settings.email.username,
        pass: settings.email.password,
      },
      tls: {
        minVersion: 'TLSv1.2'
      },
      pool: true, // Use connection pooling
      maxConnections: 1,
      debug: true, // Enable debug logging
      logger: true // Enable logger
    });

    // Verify SMTP configuration
    try {
      await transporter.verify();
      console.log('✅ SMTP server connection verified');
    } catch (verifyError: any) {
      console.warn('⚠️ SMTP verification failed:', verifyError?.message || verifyError);
      // Continue anyway - some providers don't support verify
    }

    // Send email
    const mailOptions = {
      from: `${settings.email.fromName} <${settings.email.username}>`,
      to: to,
      subject: subject,
      text: body,
      html: `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${body}</pre>`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return true;
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

// Twilio SMS implementation
async function sendTwilioSMS(phone: string, message: string, apiKey: string, senderId: string): Promise<boolean> {
  try {
    // Format phone number for Twilio (should start with +)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    console.log('🔄 Sending Twilio SMS to:', formattedPhone);
    
    // Import Twilio SDK dynamically
    const twilio = require('twilio');
    
    // Extract Account SID and Auth Token from apiKey
    // Format: "ACCOUNT_SID:AUTH_TOKEN" or just AUTH_TOKEN (assuming senderId is Account SID)
    let accountSid = senderId;
    let authToken = apiKey;
    
    if (apiKey.includes(':')) {
      [accountSid, authToken] = apiKey.split(':');
    }
    
    const client = twilio(accountSid, authToken);
    
    const result = await client.messages.create({
      body: message,
      from: senderId.startsWith('+') ? senderId : '+12345678901', // Use a Twilio phone number
      to: formattedPhone
    });

    console.log('✅ Twilio SMS sent successfully:', result.sid);
    return true;
    
  } catch (error) {
    console.error('❌ Twilio SMS failed:', error);
    return false;
  }
}

// Fast2SMS implementation
async function sendFast2SMS(phone: string, message: string, apiKey: string, senderId: string): Promise<boolean> {
  try {
    // Format phone number for Fast2SMS (remove + and country code)
    const formattedPhone = phone.replace(/^\+91/, '').replace(/^\+/, '');
    
    const fast2smsData = {
      route: 'otp',
      sender_id: senderId,
      message,
      language: 'english',
      flash: 0,
      numbers: formattedPhone
    };

    console.log('🔄 Sending Fast2SMS to:', formattedPhone);
    
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fast2smsData)
    });

    const result = await response.json();
    
    if (result.return === true) {
      console.log('✅ Fast2SMS sent successfully:', result);
      return true;
    } else {
      console.error('❌ Fast2SMS failed:', result);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Fast2SMS failed:', error);
    return false;
  }
}

// Infobip SMS implementation
async function sendInfobipSMS(phone: string, message: string, apiKey: string, senderId: string, baseUrl: string): Promise<boolean> {
  try {
    // Format phone number for Infobip (should include country code)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    console.log('🔄 Sending Infobip SMS to:', formattedPhone);
    
    const infobipData = {
      messages: [
        {
          from: senderId || "AyurMantra",
          destinations: [
            {
              to: formattedPhone
            }
          ],
          text: message
        }
      ]
    };

    const response = await fetch(`${baseUrl}/sms/2/text/advanced`, {
      method: 'POST',
      headers: {
        'Authorization': `App ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(infobipData)
    });

    const result = await response.json();
    console.log('Infobip SMS response:', result);
    
    if (response.ok && result.messages && result.messages[0].status?.groupId === 1) {
      console.log('✅ Infobip SMS sent successfully:', result.messages[0].messageId);
      return true;
    } else {
      console.error('❌ Infobip SMS failed:', result);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Infobip SMS failed:', error);
    return false;
  }
}

// Send OTP via preferred method (SMS or Email)
export async function sendOTP(contact: string, otp: string, method: 'sms' | 'email' = 'sms'): Promise<boolean> {
  try {
    console.log(`🔐 Sending OTP ${otp} to ${contact} via ${method}`);
    
    const settings = await getCommunicationSettings();
    if (!settings) {
      console.error('❌ Communication settings not available');
      return false;
    }

    if (method === 'sms') {
      const message = settings.sms.template.replace('{otp}', otp);
      return await sendSMS(contact, message);
    } else {
      const subject = settings.email.subject || 'Your OTP - SlimX Mantra';
      const body = `Your OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Please do not share this code with anyone.\n\nBest regards,\nSlimX Mantra Team`;
      return await sendEmail(contact, subject, body);
    }
  } catch (error) {
    console.error('❌ OTP sending failed:', error);
    return false;
  }
}

// Send order confirmation
export async function sendOrderConfirmation(orderData: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planName: string;
  price: number;
  deliveryDays: number;
}): Promise<{ emailSent: boolean; smsSent: boolean }> {
  try {
    console.log('📋 Sending order confirmation for:', orderData.orderId);
    
    const settings = await getCommunicationSettings();
    let emailSent = false;
    let smsSent = false;

    // Send email confirmation
    if (settings?.email?.enabled && orderData.customerEmail) {
      const emailSubject = `Order Confirmation #${orderData.orderId} - Ayurvedic Mantra`;
      const emailBodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0f8f0; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; }
    .header { background: linear-gradient(135deg, #1f3b20, #2D4A2D); color: white; padding: 30px; text-align: center; }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .content { padding: 30px; }
    .order-box { background: #f0f8f0; border: 2px solid #1f3b20; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .order-title { color: #1f3b20; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
    .order-item { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #ddd; }
    .order-item:last-child { border-bottom: none; }
    .total-amount { font-size: 20px; font-weight: bold; color: #1f3b20; text-align: center; margin: 15px 0; }
    .button { display: inline-block; background: #1f3b20; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 15px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .highlight { color: #D2691E; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌿 Ayurvedic Mantra</div>
      <p>Your Natural Wellness Journey Begins!</p>
    </div>
    
    <div class="content">
      <h2 style="color: #1f3b20;">Dear ${orderData.customerName},</h2>
      
      <p>Thank you for choosing Ayurvedic Mantra! Your order has been <span class="highlight">successfully confirmed</span> and we're excited to be part of your wellness journey.</p>
      
      <div class="order-box">
        <div class="order-title">📋 Order Summary</div>
        <div class="order-item">
          <span><strong>Order ID:</strong></span>
          <span style="font-weight: bold; color: #1f3b20;">#${orderData.orderId}</span>
        </div>
        <div class="order-item">
          <span><strong>Product:</strong></span>
          <span>${orderData.planName}</span>
        </div>
        <div class="order-item">
          <span><strong>Order Date:</strong></span>
          <span>${new Date().toLocaleDateString('en-IN')}</span>
        </div>
        <div class="order-item">
          <span><strong>Estimated Delivery:</strong></span>
          <span class="highlight">${orderData.deliveryDays} business days</span>
        </div>
        <div class="total-amount">
          Total Amount: ₹${orderData.price}
        </div>
      </div>
      
      <p>🚚 <strong>What happens next?</strong></p>
      <ul style="color: #333; line-height: 1.6;">
        <li>Your order will be processed within 24 hours</li>
        <li>You'll receive tracking details via SMS once shipped</li>
        <li>Free delivery to your doorstep</li>
        <li>Start your transformation as soon as you receive it!</li>
      </ul>
      
      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://ayurvedicmantra.com'}/thank-you?order=${orderData.orderId}" class="button">
          Track Your Order 📦
        </a>
      </p>
      
      <p>Need help? Our support team is here for you!</p>
      <p>📞 Phone: +919897990779<br>📧 Email: orders@ayurvedicmantra.com</p>
    </div>
    
    <div class="footer">
      <p><strong>Ayurvedic Mantra - Transform Your Life Naturally</strong></p>
      <p>This is an automated email. Please do not reply to this email.</p>
      <p>© 2024 Ayurvedic Mantra. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `;
      
      emailSent = await sendEmailWithHtml(orderData.customerEmail, emailSubject, emailBodyHtml);
    }

    // Send SMS confirmation
    if (settings?.sms?.enabled && orderData.customerPhone) {
      const smsMessage = `🎉 Order #${orderData.orderId} confirmed! ${orderData.planName} for ₹${orderData.price}. 
📦 Delivery: ${orderData.deliveryDays} days
🚚 Track: ${process.env.NEXT_PUBLIC_BASE_URL || 'ayurvedicmantra.com'}/thank-you?order=${orderData.orderId}
📞 Support: +919897990779
- Ayurvedic Mantra Team`;
      
      console.log('📱 Sending order confirmation SMS to:', orderData.customerPhone);
      smsSent = await sendSMS(orderData.customerPhone, smsMessage);
    }

    console.log(`✅ Order confirmation sent - Email: ${emailSent}, SMS: ${smsSent}`);
    return { emailSent, smsSent };
  } catch (error) {
    console.error('❌ Order confirmation failed:', error);
    return { emailSent: false, smsSent: false };
  }
}

// Send admin notification
export async function sendAdminNotification(type: string, data: any): Promise<boolean> {
  try {
    console.log(`🔔 Sending admin notification:`, type, data);
    
    const settings = await getCommunicationSettings();
    if (!settings?.email?.enabled || !settings.email.username) {
      console.log('❌ Admin email notifications not enabled or configured');
      return false;
    }

    const adminEmail = 'orders@ayurvedicmantra.com'; // Admin notifications for ayurvedicmantra.com
    let subject = '';
    let body = '';

    switch (type) {
      case 'new_order':
        subject = `New Order Received #${data.orderId}`;
        body = `
New order received:

Order ID: ${data.orderId}
Customer: ${data.customerName} (${data.customerEmail})
Plan: ${data.planName}
Amount: ₹${data.price}
Time: ${new Date().toLocaleString()}

View order details in admin dashboard.
        `;
        break;
      
      case 'high_value_order':
        subject = `High Value Order Alert #${data.orderId}`;
        body = `
High value order received:

Order ID: ${data.orderId}
Customer: ${data.customerName}
Amount: ₹${data.price}
Plan: ${data.planName}

Immediate attention recommended.
        `;
        break;
      
      default:
        subject = `System Notification`;
        body = `System event: ${type}\nData: ${JSON.stringify(data, null, 2)}`;
    }

    return await sendEmail(adminEmail, subject, body);
  } catch (error) {
    console.error('❌ Admin notification failed:', error);
    return false;
  }
}