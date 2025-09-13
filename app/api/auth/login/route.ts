import { NextRequest, NextResponse } from 'next/server';

// SECURITY NOTICE: This endpoint is now DEPRECATED and DISABLED
// All authentication now goes through /api/auth/secure-login

export async function POST(request: NextRequest) {
  console.log("❌ SECURITY: Attempt to use deprecated login endpoint");
  
  return NextResponse.json({
    success: false,
    message: "This authentication method has been disabled for security reasons. Please use the secure OTP login.",
    redirect: "/admin-login"
  }, { status: 410 }); // Gone
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    message: "Authentication endpoint deprecated. Use secure OTP authentication.",
    redirect: "/admin-login"
  }, { status: 410 });
}