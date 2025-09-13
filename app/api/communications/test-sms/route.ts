import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/communications';

export async function POST(request: NextRequest) {
  try {
    const { testPhone, message } = await request.json();
    
    console.log('📱 Testing SMS sending to:', testPhone);
    
    if (!testPhone) {
      return NextResponse.json({ 
        success: false, 
        message: 'Test phone number is required' 
      }, { status: 400 });
    }

    const testMessage = message || "Test SMS from Ayurvedic Mantra admin panel. SMS integration is working perfectly! 🚀";
    
    // Send test SMS
    const success = await sendSMS(testPhone, testMessage);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: `Test SMS sent successfully to ${testPhone}`
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to send test SMS. Please check your SMS provider settings."
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ SMS test failed:', error);
    return NextResponse.json({
      success: false,
      message: error.message || "SMS test failed"
    }, { status: 500 });
  }
}