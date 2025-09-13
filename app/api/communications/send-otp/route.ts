import { NextRequest, NextResponse } from 'next/server';
import { sendOTP } from '@/lib/communications';

export async function POST(request: NextRequest) {
  try {
    const { contact, otp, method } = await request.json();
    
    console.log(`🔐 OTP API called for ${contact} via ${method}`);
    
    if (!contact || !otp) {
      return NextResponse.json({ 
        success: false, 
        message: 'Contact and OTP are required' 
      }, { status: 400 });
    }

    const sent = await sendOTP(contact, otp, method);
    
    if (sent) {
      return NextResponse.json({ 
        success: true, 
        message: `OTP sent successfully via ${method}` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `Failed to send OTP via ${method}` 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ OTP API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}