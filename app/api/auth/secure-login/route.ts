import { NextRequest, NextResponse } from 'next/server';

// SECURE: Only OTP-based authentication allowed
const AUTHORIZED_ADMIN_EMAIL = "contact@syedrayyan.com";

// Enhanced OTP storage
let otpStore: { [key: string]: { 
  otp: string, 
  expires: number, 
  attempts: number, 
  type: 'user' | 'admin',
  createdAt: number 
} } = {};

// Rate limiting
let rateLimitStore: { [key: string]: number[] } = {};

export async function POST(request: NextRequest) {
  try {
    const { contact, contactType, otp, action, userType } = await request.json();
    console.log("🔐 Secure auth request:", { contact, contactType, action, userType });

    // SECURITY: Block any password-based login attempts
    if (request.headers.get('x-legacy-auth') || action === 'password-login') {
      console.log("❌ Blocked legacy password login attempt");
      return NextResponse.json({
        success: false,
        message: "Password authentication is disabled. Please use OTP authentication."
      }, { status: 403 });
    }

    if (action === 'send-otp') {
      // Determine if this is admin or user
      const isAdminRequest = (userType === 'admin' || contact === AUTHORIZED_ADMIN_EMAIL);
      
      // Admin email restriction
      if (userType === 'admin' && contact !== AUTHORIZED_ADMIN_EMAIL) {
        console.log("❌ Unauthorized admin email:", contact);
        return NextResponse.json({
          success: false,
          message: "Admin access is restricted to authorized personnel only."
        }, { status: 403 });
      }

      // Rate limiting
      const now = Date.now();
      const rateKey = `${isAdminRequest ? 'admin' : 'user'}_${contact}`;
      
      if (!rateLimitStore[rateKey]) {
        rateLimitStore[rateKey] = [];
      }
      
      rateLimitStore[rateKey] = rateLimitStore[rateKey].filter(
        time => now - time < 15 * 60 * 1000 // 15 minutes
      );
      
      const maxAttempts = isAdminRequest ? 3 : 5;
      if (rateLimitStore[rateKey].length >= maxAttempts) {
        console.log("❌ Rate limit exceeded for:", contact);
        return NextResponse.json({
          success: false,
          message: `Too many OTP requests. Please wait 15 minutes.`
        }, { status: 429 });
      }

      // Generate secure OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store OTP securely
      otpStore[contact] = {
        otp: generatedOTP,
        expires,
        attempts: 0,
        type: isAdminRequest ? 'admin' : 'user',
        createdAt: now
      };

      // Add to rate limit
      rateLimitStore[rateKey].push(now);

      console.log(`🔐 OTP generated for ${isAdminRequest ? 'ADMIN' : 'USER'}:`, contact);

      // Send OTP securely
      try {
        if (contactType === 'email') {
          const { sendEmail } = await import('@/lib/communications');
          const subject = isAdminRequest ? 
            "🔐 Admin Login OTP - Ayurvedic Mantra" : 
            "🌿 Your Login OTP - Ayurvedic Mantra";
          
          const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2d5016;">${isAdminRequest ? '🔐 Admin' : '🌿 User'} Login Verification</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0; color: #2d5016;">Your OTP Code:</h3>
                <div style="font-size: 32px; font-weight: bold; color: #2d5016; letter-spacing: 8px; text-align: center; margin: 20px 0; padding: 20px; background: white; border-radius: 8px; border: 2px solid #2d5016;">
                  ${generatedOTP}
                </div>
                <p><strong>⏰ Valid for 10 minutes only</strong></p>
                <p style="color: #666; font-size: 14px;">
                  This OTP was requested for ${isAdminRequest ? 'admin access to' : 'login to'} Ayurvedic Mantra. 
                  If you didn't request this, please ignore this email.
                </p>
              </div>
              <p style="color: #666; font-size: 12px; text-align: center;">
                Ayurvedic Mantra - Secure ${isAdminRequest ? 'Admin Portal' : 'Login Portal'}
              </p>
            </div>
          `;
          
          await sendEmail(contact, subject, htmlContent);
          console.log("✅ OTP sent via email successfully");
        } else {
          const { sendSMS } = await import('@/lib/communications');
          const message = `Your OTP for Ayurvedic Mantra ${isAdminRequest ? 'admin login' : 'login'} is: ${generatedOTP}. Valid for 10 minutes. Do not share this code.`;
          await sendSMS(contact, message);
          console.log("✅ OTP sent via SMS successfully");
        }
      } catch (error) {
        console.error("Failed to send OTP:", error);
      }

      // PRODUCTION: Never expose OTP in response
      return NextResponse.json({
        success: true,
        message: `Secure OTP sent to your ${contactType}. Please check and enter the code.`,
        data: {
          contact,
          contactType,
          expiresIn: "10 minutes",
          type: isAdminRequest ? 'admin' : 'user'
        }
      });

    } else if (action === 'verify-otp') {
      const storedOtpData = otpStore[contact];

      if (!storedOtpData) {
        console.log("❌ No OTP found for:", contact);
        return NextResponse.json({
          success: false,
          message: "OTP not found or expired. Please request a new OTP."
        }, { status: 400 });
      }

      // Check expiry
      if (Date.now() > storedOtpData.expires) {
        delete otpStore[contact];
        console.log("❌ OTP expired for:", contact);
        return NextResponse.json({
          success: false,
          message: "OTP has expired. Please request a new OTP."
        }, { status: 400 });
      }

      // Check attempt limit
      if (storedOtpData.attempts >= 3) {
        delete otpStore[contact];
        console.log("❌ Too many OTP attempts for:", contact);
        return NextResponse.json({
          success: false,
          message: "Too many incorrect attempts. Please request a new OTP."
        }, { status: 400 });
      }

      // Verify OTP
      if (storedOtpData.otp !== otp) {
        storedOtpData.attempts += 1;
        console.log("❌ Incorrect OTP for:", contact, "Attempts:", storedOtpData.attempts);
        return NextResponse.json({
          success: false,
          message: `Incorrect OTP. ${3 - storedOtpData.attempts} attempts remaining.`
        }, { status: 400 });
      }

      // SUCCESS: OTP verified
      console.log("✅ OTP verified successfully for:", contact);
      
      // Clean up OTP
      delete otpStore[contact];

      if (storedOtpData.type === 'admin') {
        // Admin authentication
        const adminToken = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
        const adminData = {
          id: 'super_admin',
          email: contact,
          role: 'super_admin',
          loginTime: new Date().toISOString(),
          authMethod: 'otp'
        };

        const response = NextResponse.json({
          success: true,
          message: "Admin authentication successful!",
          data: {
            token: adminToken,
            admin: adminData,
            type: 'admin'
          }
        });

        response.cookies.set('adminToken', adminToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 8 * 60 * 60 // 8 hours
        });

        return response;
      } else {
        // User authentication
        const userToken = `user_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
        const userData = {
          id: `user_${Date.now()}`,
          contact,
          contactType,
          verified: true,
          loginTime: new Date().toISOString(),
          authMethod: 'otp'
        };

        return NextResponse.json({
          success: true,
          message: "User login successful!",
          data: {
            token: userToken,
            user: userData,
            type: 'user'
          }
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: "Invalid action"
    }, { status: 400 });

  } catch (error) {
    console.error("❌ Secure auth error:", error);
    return NextResponse.json({
      success: false,
      message: "Authentication service temporarily unavailable"
    }, { status: 500 });
  }
}