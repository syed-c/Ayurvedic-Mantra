import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("🔍 Checking Shiprocket connection status...");
    
    // Load Shiprocket settings
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    const shiprocketConfig = settings.shipping?.shiprocket;
    
    if (!shiprocketConfig?.enabled) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'disabled',
          message: 'Shiprocket integration is disabled',
          configured: false,
          authenticated: false
        }
      });
    }
    
    if (!shiprocketConfig.email || !shiprocketConfig.password) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'not_configured',
          message: 'Shiprocket credentials not configured',
          configured: false,
          authenticated: false,
          actionRequired: 'Please configure Shiprocket email and password in Settings > Integrations'
        }
      });
    }
    
    // Check if we have a valid token
    const hasValidToken = shiprocketConfig.token && shiprocketConfig.tokenExpiry;
    const tokenExpired = hasValidToken ? new Date(shiprocketConfig.tokenExpiry) < new Date() : true;
    
    // Quick connection test
    try {
      const { shiprocketService } = await import('@/lib/shiprocket');
      const testResult = await shiprocketService.testConnection({
        email: shiprocketConfig.email,
        password: shiprocketConfig.password,
        enabled: shiprocketConfig.enabled,
        testMode: shiprocketConfig.testMode || true
      });
      
      if (testResult.success) {
        return NextResponse.json({
          success: true,
          data: {
            status: 'connected',
            message: 'Shiprocket connection is working properly',
            configured: true,
            authenticated: true,
            lastChecked: new Date().toISOString(),
            tokenExpiry: shiprocketConfig.tokenExpiry,
            testMode: shiprocketConfig.testMode || true
          }
        });
      } else {
        return NextResponse.json({
          success: true,
          data: {
            status: 'auth_failed',
            message: 'Shiprocket authentication failed',
            configured: true,
            authenticated: false,
            error: testResult.error,
            actionRequired: 'Please check Shiprocket credentials and account permissions',
            lastChecked: new Date().toISOString()
          }
        });
      }
    } catch (testError: any) {
      console.error("❌ Shiprocket connection test failed:", testError);
      
      return NextResponse.json({
        success: true,
        data: {
          status: 'connection_error',
          message: 'Unable to connect to Shiprocket',
          configured: true,
          authenticated: false,
          error: testError.message,
          actionRequired: 'Check internet connection and Shiprocket service status',
          lastChecked: new Date().toISOString()
        }
      });
    }
    
  } catch (error: any) {
    console.error("❌ Error checking Shiprocket status:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to check Shiprocket status",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'retry_auth') {
      console.log("🔄 Retrying Shiprocket authentication...");
      
      const { storage } = await import('@/lib/storage');
      const settings = await storage.load();
      const shiprocketConfig = settings.shipping?.shiprocket;
      
      if (!shiprocketConfig?.email || !shiprocketConfig?.password) {
        return NextResponse.json({
          success: false,
          message: "Shiprocket credentials not configured"
        }, { status: 400 });
      }
      
      const { shiprocketService } = await import('@/lib/shiprocket');
      const authResult = await shiprocketService.testConnection({
        email: shiprocketConfig.email,
        password: shiprocketConfig.password,
        enabled: shiprocketConfig.enabled,
        testMode: shiprocketConfig.testMode || true
      });
      
      if (authResult.success) {
        return NextResponse.json({
          success: true,
          message: "Shiprocket authentication successful",
          data: {
            status: 'connected',
            authenticated: true,
            retriedAt: new Date().toISOString()
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Shiprocket authentication failed",
          error: authResult.error,
          data: {
            status: 'auth_failed',
            authenticated: false,
            retriedAt: new Date().toISOString()
          }
        });
      }
    }
    
    return NextResponse.json({
      success: false,
      message: "Unknown action"
    }, { status: 400 });
    
  } catch (error: any) {
    console.error("❌ Error handling Shiprocket action:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to process request",
      error: error.message
    }, { status: 500 });
  }
}