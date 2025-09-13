import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const setupGuide = {
    title: "SlimX Mantra - Real SMS & Email Setup Guide",
    
    emailSetup: {
      title: "📧 SMTP Email Configuration",
      description: "Configure real email sending through your email provider",
      providers: [
        {
          name: "Gmail",
          smtpHost: "smtp.gmail.com",
          smtpPort: 587,
          instructions: [
            "1. Go to your Google Account settings",
            "2. Enable 2-Factor Authentication",
            "3. Generate an App Password for 'Mail'",
            "4. Use your Gmail address as username",
            "5. Use the App Password (not your regular password)"
          ],
          example: {
            smtpHost: "smtp.gmail.com",
            smtpPort: 587,
            username: "your-email@gmail.com",
            password: "your-16-character-app-password",
            fromName: "SlimX Mantra"
          }
        },
        {
          name: "Outlook/Hotmail",
          smtpHost: "smtp-mail.outlook.com",
          smtpPort: 587,
          instructions: [
            "1. Go to Outlook.com security settings",
            "2. Enable 2-Factor Authentication",
            "3. Generate an App Password",
            "4. Use your Outlook email as username",
            "5. Use the App Password"
          ]
        },
        {
          name: "SendGrid",
          smtpHost: "smtp.sendgrid.net",
          smtpPort: 587,
          instructions: [
            "1. Create a SendGrid account",
            "2. Generate an API Key",
            "3. Use 'apikey' as username",
            "4. Use your API Key as password"
          ]
        }
      ]
    },
    
    smsSetup: {
      title: "📱 SMS Configuration",
      description: "Configure real SMS sending through SMS providers",
      providers: [
        {
          name: "Twilio",
          instructions: [
            "1. Create a Twilio account at twilio.com",
            "2. Get your Account SID and Auth Token",
            "3. Buy a phone number or use a verified number",
            "4. In admin settings:",
            "   - Provider: twilio",
            "   - API Key: Your Auth Token",
            "   - Sender ID: Your Twilio phone number (with +)",
            "5. Format: +1234567890"
          ],
          example: {
            provider: "twilio",
            apiKey: "your-auth-token-here",
            senderId: "+1234567890"
          }
        },
        {
          name: "Fast2SMS (India)",
          instructions: [
            "1. Create account at fast2sms.com",
            "2. Get your API Key from dashboard",
            "3. In admin settings:",
            "   - Provider: fast2sms",
            "   - API Key: Your Fast2SMS API key",
            "   - Sender ID: Your approved sender ID (6 chars)"
          ],
          example: {
            provider: "fast2sms",
            apiKey: "your-fast2sms-api-key",
            senderId: "SLIMXM"
          }
        }
      ]
    },
    
    testingSteps: {
      title: "🧪 Testing Your Configuration",
      steps: [
        "1. Go to Super Admin Dashboard → SMS/Email tab",
        "2. Enter your SMTP and SMS credentials",
        "3. Click 'Save Settings'",
        "4. Test OTP login from login page",
        "5. Place a test order to verify order confirmations",
        "6. Check your phone and email for messages"
      ]
    },
    
    troubleshooting: {
      title: "🔧 Troubleshooting",
      common_issues: [
        {
          issue: "Email not sending",
          solutions: [
            "Check SMTP credentials are correct",
            "Ensure App Password is used (not regular password)",
            "Verify SMTP host and port",
            "Check spam folder",
            "Enable 'Less secure app access' if needed"
          ]
        },
        {
          issue: "SMS not sending",
          solutions: [
            "Verify API key is correct",
            "Check phone number format (+91xxxxxxxxxx)",
            "Ensure sender ID is approved",
            "Check SMS provider balance",
            "Verify sender ID format (Twilio: +number, Fast2SMS: 6-char ID)"
          ]
        }
      ]
    },
    
    securityNotes: {
      title: "🔒 Security Best Practices",
      notes: [
        "Never share your API keys or passwords",
        "Use App Passwords, not regular email passwords",
        "Regularly rotate your API keys",
        "Monitor usage from provider dashboards",
        "Keep credentials secure in admin settings only"
      ]
    }
  };

  return NextResponse.json({
    success: true,
    setupGuide
  });
}