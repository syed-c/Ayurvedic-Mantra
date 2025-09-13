import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing communication services...');
    
    // Test OTP sending
    const otpResult = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/communications/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact: '+919876543210',
        otp: '123456',
        method: 'sms'
      })
    });
    
    const otpResponse = await otpResult.json();
    console.log('OTP Test Result:', otpResponse);
    
    // Test order confirmation
    const orderResult = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/communications/send-order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: 'TEST123',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '+919876543210',
        planName: '2 Month Supply',
        price: 1499,
        deliveryDays: 3
      })
    });
    
    const orderResponse = await orderResult.json();
    console.log('Order Confirmation Test Result:', orderResponse);
    
    return NextResponse.json({
      success: true,
      message: 'Communication tests completed',
      results: {
        otp: otpResponse,
        orderConfirmation: orderResponse
      }
    });
    
  } catch (error) {
    console.error('❌ Communication test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Communication test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}