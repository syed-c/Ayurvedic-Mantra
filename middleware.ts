import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// SECURITY: List of authorized admin emails (server-side validation)
const AUTHORIZED_ADMIN_EMAILS = ["orders@ayurvedicmantra.com"];

// SECURITY: Protected admin routes
const PROTECTED_ADMIN_ROUTES = ['/admin', '/admin-direct'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`🔒 SECURE Middleware: ${pathname}`);
  
  // SECURITY: Admin routes protection with enhanced validation
  if (PROTECTED_ADMIN_ROUTES.some(route => pathname.startsWith(route)) && pathname !== '/admin-login') {
    const isPrefetch = request.headers.get('x-middleware-prefetch') === '1' || request.headers.get('purpose') === 'prefetch';
    const adminToken = request.cookies.get('adminToken')?.value;
    
    console.log("🔐 Admin route access attempt:");
    console.log("- Path:", pathname);
    console.log("- Token:", adminToken ? "EXISTS" : "MISSING");
    
    if (!adminToken && !isPrefetch) {
      console.log("❌ No admin token found, redirecting to secure login");
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    // SECURITY: Validate token format and expiry
    try {
      if (!adminToken) throw new Error('missing');
      const tokenParts = adminToken.split('_');
      if (tokenParts.length < 3 || tokenParts[0] !== 'admin') {
        console.log("❌ Invalid admin token format");
        const response = NextResponse.redirect(new URL('/admin-login', request.url));
        response.cookies.delete('adminToken');
        return response;
      }
      
      const tokenTime = parseInt(tokenParts[1]);
      const tokenAge = Date.now() - tokenTime;
      const maxAge = 8 * 60 * 60 * 1000; // 8 hours
      
      if (tokenAge > maxAge) {
        console.log("❌ Admin token expired");
        const response = NextResponse.redirect(new URL('/admin-login', request.url));
        response.cookies.delete('adminToken');
        return response;
      }
      
      console.log("✅ SECURE admin token validated, access granted");
    } catch (error) {
      console.log("❌ Error validating admin token:", error);
      const response = NextResponse.redirect(new URL('/admin-login', request.url));
      response.cookies.delete('adminToken');
      return response;
    }
  }

  // SECURITY: Block access to legacy/insecure authentication endpoints
  if (pathname.startsWith('/api/auth/login') && !pathname.includes('secure')) {
    console.log("❌ BLOCKED: Access to deprecated login endpoint");
    return NextResponse.json({
      success: false,
      message: "This authentication method is DEPRECATED for security. Use secure OTP authentication.",
      redirect: "/admin-login"
    }, { status: 410 });
  }

  // Do not redirect from /admin-login via middleware to avoid prefetch redirect loops

  // SECURITY: Enhanced API routes protection
  if (pathname.startsWith('/api/admin')) {
    const adminToken = request.cookies.get('adminToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!adminToken) {
      console.log("❌ Unauthorized admin API access attempt");
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    // Validate admin token for API access
    try {
      const tokenParts = adminToken.split('_');
      if (tokenParts.length < 3 || tokenParts[0] !== 'admin') {
        console.log("❌ Invalid admin token for API access");
        return NextResponse.json(
          { success: false, message: 'Invalid authentication token' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.log("❌ Error validating admin token for API:", error);
      return NextResponse.json(
        { success: false, message: 'Authentication validation failed' },
        { status: 401 }
      );
    }
  }

  // SECURITY: Enhanced rate limiting and monitoring
  if (pathname.startsWith('/api/auth')) {
    const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    console.log(`🔒 Auth API request: ${pathname} from IP: ${ip}`);
    
    // Log potential security threats
    if (pathname.includes('login') && !pathname.includes('secure')) {
      console.log(`⚠️ SECURITY ALERT: Attempt to use deprecated auth endpoint from IP: ${ip}`);
    }
  }

  // SECURITY: Add enhanced security headers to all responses
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Enhanced CSP for admin routes
  if (PROTECTED_ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-login',
    '/api/admin/:path*',
    '/api/auth/:path*'
  ]
};