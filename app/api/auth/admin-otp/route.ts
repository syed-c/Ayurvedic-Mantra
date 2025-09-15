import { NextRequest, NextResponse } from 'next/server';

// SECURE: Only authorized admin email
const AUTHORIZED_ADMIN_EMAIL = "orders@ayurvedicmantra.com";

// OTP storage with enhanced security
let adminOtpStore: { [key: string]: { 
  otp: string, 
  expires: number, 
  attempts: number,
  createdAt: number 
} } = {};

// Rate limiting for admin OTP requests
let adminOtpRateLimit: { [key: string]: number[] } = {};

export async function POST(request: NextRequest) {
  try {
    const { email, otp, action } = await request.json();
    console.log("🔐 Admin OTP request:", { email, action });

    // SECURITY: Only allow authorized admin email
    if (email !== AUTHORIZED_ADMIN_EMAIL) {
      console.log("❌ Unauthorized admin email attempted:", email);
      return NextResponse.json({
        success: false,
        message: "Access denied. This email is not authorized for admin access."
      }, { status: 403 });
    }

    if (action === 'send-otp') {
      // Rate limiting: Max 3 OTP requests per 15 minutes
      const now = Date.now();
      const rateKey = `admin_${email}`;
      
      if (!adminOtpRateLimit[rateKey]) {
        adminOtpRateLimit[rateKey] = [];
      }
      
      // Clean old attempts
      adminOtpRateLimit[rateKey] = adminOtpRateLimit[rateKey].filter(
        time => now - time < 15 * 60 * 1000
      );
      
      if (adminOtpRateLimit[rateKey].length >= 3) {
        console.log("❌ Admin OTP rate limit exceeded for:", email);
        return NextResponse.json({
          success: false,
          message: "Too many OTP requests. Please wait 15 minutes before trying again."
        }, { status: 429 });
      }

      // Generate secure 6-digit OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      // Store OTP securely
      adminOtpStore[email] = {
        otp: generatedOTP,
        expires,
        attempts: 0,
        createdAt: now
      };

      // Add to rate limit
      adminOtpRateLimit[rateKey].push(now);

      console.log("🔐 Admin OTP generated for:", email);

      // SECURITY: Send OTP via email - NO CONSOLE/SCREEN EXPOSURE
      try {
        const { sendEmail } = await import('@/lib/communications');
        const emailSent = await sendEmail(
          email, 
          "Admin Login OTP - Ayurvedic Mantra",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2d5016;">🔐 Admin Login Verification</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0; color: #2d5016;">Your OTP Code:</h3>
              <div style="font-size: 32px; font-weight: bold; color: #2d5016; letter-spacing: 8px; text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 8px; border: 2px solid #2d5016;">
                ${generatedOTP}
              </div>
              <p><strong>⏰ Valid for 10 minutes only</strong></p>
              <p style="color: #666; font-size: 14px;">
                This OTP was requested for admin access to Ayurvedic Mantra dashboard. 
                If you didn't request this, please ignore this email.
              </p>
            </div>
            <p style="color: #666; font-size: 12px; text-align: center;">
              Ayurvedic Mantra - Secure Admin Portal
            </p>
          </div>
          `
        );
        
        if (emailSent) {
          console.log("✅ Admin OTP sent successfully via email");
        } else {
          console.log("❌ Failed to send admin OTP email");
        }
      } catch (error) {
        console.error("Failed to send admin OTP email:", error);
      }

      // PRODUCTION: Never expose OTP in response
      return NextResponse.json({
        success: true,
        message: "Admin OTP sent to your email. Please check your inbox and enter the code.",
        data: {
          email: email,
          expiresIn: "10 minutes"
        }
      });

    } else if (action === 'verify-otp') {
      const storedOtpData = adminOtpStore[email];

      if (!storedOtpData) {
        console.log("❌ No admin OTP found for:", email);
        return NextResponse.json({
          success: false,
          message: "OTP not found or expired. Please request a new OTP."
        }, { status: 400 });
      }

      // Check expiry
      if (Date.now() > storedOtpData.expires) {
        delete adminOtpStore[email];
        console.log("❌ Admin OTP expired for:", email);
        return NextResponse.json({
          success: false,
          message: "OTP has expired. Please request a new OTP."
        }, { status: 400 });
      }

      // Check attempt limit (max 3 attempts)
      if (storedOtpData.attempts >= 3) {
        delete adminOtpStore[email];
        console.log("❌ Too many admin OTP attempts for:", email);
        return NextResponse.json({
          success: false,
          message: "Too many incorrect attempts. Please request a new OTP."
        }, { status: 400 });
      }

      // Verify OTP
      if (storedOtpData.otp !== otp) {
        storedOtpData.attempts += 1;
        console.log("❌ Incorrect admin OTP for:", email, "Attempts:", storedOtpData.attempts);
        return NextResponse.json({
          success: false,
          message: `Incorrect OTP. ${3 - storedOtpData.attempts} attempts remaining.`
        }, { status: 400 });
      }

      // SUCCESS: OTP verified
      console.log("✅ Admin OTP verified successfully for:", email);
      
      // Clean up OTP
      delete adminOtpStore[email];

      // Generate admin session token
      const adminToken = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
      const adminData = {
        id: 'super_admin',
        email: email,
        role: 'super_admin',
        loginTime: new Date().toISOString(),
        authMethod: 'otp'
      };

      // Set secure cookie
      const response = NextResponse.json({
        success: true,
        message: "Admin authentication successful!",
        data: {
          token: adminToken,
          admin: adminData
        }
      });

      response.cookies.set('adminToken', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 // 8 hours
      });

      return response;
    }

    return NextResponse.json({
      success: false,
      message: "Invalid action"
    }, { status: 400 });

  } catch (error) {
    console.error("❌ Admin OTP error:", error);
    return NextResponse.json({
      success: false,
      message: "Authentication service temporarily unavailable"
    }, { status: 500 });
  }
}