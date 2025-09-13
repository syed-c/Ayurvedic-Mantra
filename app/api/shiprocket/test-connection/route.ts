import { NextRequest, NextResponse } from 'next/server';
import { shiprocketService } from '@/lib/shiprocket';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log("🚚 Testing Shiprocket connection for:", email);

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Email and password are required"
      }, { status: 400 });
    }

    // Test authentication
    const token = await shiprocketService.authenticate({
      email,
      password,
      enabled: true,
      testMode: true
    });

    if (token) {
      console.log("✅ Shiprocket connection test successful");
      return NextResponse.json({
        success: true,
        message: "Successfully connected to Shiprocket API",
        data: {
          authenticated: true,
          tokenReceived: !!token
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Authentication failed - no token received"
      }, { status: 401 });
    }

  } catch (error: any) {
    console.error("❌ Shiprocket connection test failed:", error);
    
    let errorMessage = "Connection test failed";
    let statusCode = 500;
    
    if (error.response) {
      // Shiprocket API returned an error response
      errorMessage = error.response.data?.message || error.response.data?.error || error.message;
      statusCode = error.response.status === 401 ? 401 : 500;
      
      if (error.response.status === 401) {
        errorMessage = "Invalid Shiprocket credentials. Please check your email and password.";
      }
    } else if (error.message.includes('ENOTFOUND')) {
      errorMessage = "Network error: Unable to connect to Shiprocket API. Please check your internet connection.";
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
      details: error.response?.data || null
    }, { status: statusCode });
  }
}