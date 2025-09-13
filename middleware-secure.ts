import { NextRequest, NextResponse } from 'next/server';

// SECURITY: List of authorized admin emails
const AUTHORIZED_ADMIN_EMAILS = ["contact@syedrayyan.com"];

// SECURITY: Protected admin routes
const PROTECTED_ADMIN_ROUTES = [
  '/admin',
  '/admin-direct'
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`🔒 Security middleware: ${pathname}`);

  // Check if this is a protected admin route
  if (PROTECTED_ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    console.log(`🔐 Checking admin access for: ${pathname}`);
    
    // Check for admin token in cookies
    const adminToken = request.cookies.get('adminToken')?.value;
    
    if (!adminToken) {
      console.log("❌ No admin token found, redirecting to login");
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    // Additional security: Check token format and expiry
    try {
      const tokenParts = adminToken.split('_');
      if (tokenParts.length < 3 || tokenParts[0] !== 'admin') {
        console.log("❌ Invalid admin token format");
        // Clear invalid token
        const response = NextResponse.redirect(new URL('/admin-login', request.url));
        response.cookies.delete('adminToken');
        return response;
      }
      
      const tokenTime = parseInt(tokenParts[1]);
      const tokenAge = Date.now() - tokenTime;
      const maxAge = 8 * 60 * 60 * 1000; // 8 hours
      
      if (tokenAge > maxAge) {
        console.log("❌ Admin token expired");
        // Clear expired token
        const response = NextResponse.redirect(new URL('/admin-login', request.url));
        response.cookies.delete('adminToken');
        return response;
      }
      
      console.log("✅ Valid admin token, access granted");
    } catch (error) {
      console.log("❌ Error validating admin token:", error);
      const response = NextResponse.redirect(new URL('/admin-login', request.url));
      response.cookies.delete('adminToken');
      return response;
    }
  }

  // Block access to legacy/insecure authentication endpoints
  if (pathname.startsWith('/api/auth/login') && !pathname.includes('secure')) {
    console.log("❌ Blocked access to deprecated login endpoint");
    return NextResponse.json({
      success: false,
      message: "This authentication method is deprecated. Use secure OTP authentication.",
      redirect: "/admin-login"
    }, { status: 410 });
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CSP for admin routes
  if (PROTECTED_ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-direct/:path*',
    '/api/auth/:path*'
  ]
};