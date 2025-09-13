import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/communications';

export async function POST(request: NextRequest) {
  try {
    const { phone, method = 'sms' } = await request.json();
    console.log('📱 OTP request for:', phone, 'via', method);

    if (!phone) {
      return NextResponse.json({ 
        success: false, 
        message: 'Phone number is required' 
      }, { status: 400 });
    }

    // Format phone number
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔐 Generated OTP:', otp, 'for phone:', formattedPhone);

    // Store OTP in a simple in-memory store (in production, use Redis or database)
    const otpKey = `otp_${formattedPhone}`;
    global.otpStore = global.otpStore || new Map();
    global.otpStore.set(otpKey, {
      otp,
      timestamp: Date.now(),
      phone: formattedPhone,
      attempts: 0
    });

    // Set expiry (10 minutes)
    setTimeout(() => {
      if (global.otpStore && global.otpStore.has(otpKey)) {
        global.otpStore.delete(otpKey);
        console.log('🗑️ OTP expired and removed for:', formattedPhone);
      }
    }, 10 * 60 * 1000);

    let sentSuccessfully = false;

    if (method === 'sms') {
      // Send SMS using Infobip
      const message = `Your OTP is ${otp}. Use this to verify your action on SlimX Mantra. Valid for 10 minutes.`;
      sentSuccessfully = await sendSMS(formattedPhone, message);
      
      if (sentSuccessfully) {
        console.log('✅ OTP SMS sent successfully via Infobip');
      } else {
        console.log('❌ Failed to send OTP SMS');
      }
    }

    if (sentSuccessfully) {
      return NextResponse.json({
        success: true,
        message: "OTP sent successfully to your phone number",
        data: {
          phone: formattedPhone,
          method,
          otpLength: 6,
          expiryMinutes: 10
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to send OTP. Please try again."
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ OTP sending failed:', error);
    return NextResponse.json({
      success: false,
      message: "Failed to send OTP. Please try again."
    }, { status: 500 });
  }
}