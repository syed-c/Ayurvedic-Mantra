import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/communications';

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Testing SMTP configuration...");
    
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json({
        success: false,
        message: "Test email address is required"
      }, { status: 400 });
    }

    // Send test email
    const emailSent = await sendEmail(
      testEmail,
      "SMTP Test - Ayurvedic Mantra",
      `This is a test email from Ayurvedic Mantra system.

SMTP Configuration Test Results:
✅ SMTP connection successful
✅ Email sending functional
✅ Titan Email integration working

Your SMTP settings are properly configured and ready for use!

Sent at: ${new Date().toLocaleString()}

Best regards,
Ayurvedic Mantra Team`
    );

    if (emailSent) {
      console.log("✅ SMTP test email sent successfully");
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully! Check your inbox."
      });
    } else {
      console.error("❌ SMTP test email failed");
      return NextResponse.json({
        success: false,
        message: "Failed to send test email. Please check your SMTP settings."
      }, { status: 500 });
    }

  } catch (error) {
    console.error("❌ SMTP test failed:", error);
    return NextResponse.json({
      success: false,
      message: "SMTP test failed: " + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}