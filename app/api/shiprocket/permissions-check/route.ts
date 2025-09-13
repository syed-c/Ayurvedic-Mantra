import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 [PERMISSIONS CHECK] Checking Shiprocket API permissions for ayurvedicmantra.com...");
    
    // Load current settings
    const { storage } = await import('@/lib/storage');
    const currentSettings = await storage.load();
    const shiprocketConfig = currentSettings.shipping?.shiprocket;
    
    if (!shiprocketConfig?.email || !shiprocketConfig?.password) {
      return NextResponse.json({
        success: false,
        message: "Shiprocket credentials not configured",
        domain: 'ayurvedicmantra.com'
      }, { status: 400 });
    }
    
    // Get fresh authentication token
    console.log("🔑 [PERMISSIONS] Authenticating...");
    const authResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: shiprocketConfig.email,
        password: shiprocketConfig.password
      })
    });
    
    const authResult = await authResponse.json();
    
    if (!authResponse.ok) {
      console.error("❌ [PERMISSIONS] Authentication failed:", authResult);
      return NextResponse.json({
        success: false,
        message: "Authentication failed",
        error: authResult.message,
        domain: 'ayurvedicmantra.com'
      }, { status: 401 });
    }
    
    const token = authResult.token;
    console.log("✅ [PERMISSIONS] Token obtained");
    
    // Test various endpoints to check permissions
    const permissionTests = [
      {
        name: "User Profile",
        endpoint: 'https://apiv2.shiprocket.in/v1/external/auth/me',
        method: 'GET'
      },
      {
        name: "Settings Access", 
        endpoint: 'https://apiv2.shiprocket.in/v1/external/settings/company/pickup',
        method: 'GET'
      },
      {
        name: "Channel List",
        endpoint: 'https://apiv2.shiprocket.in/v1/external/channels',
        method: 'GET'
      },
      {
        name: "Orders Access",
        endpoint: 'https://apiv2.shiprocket.in/v1/external/orders',
        method: 'GET',
        params: '?limit=1'
      }
    ];
    
    const results: any[] = [];
    
    for (const test of permissionTests) {
      console.log(`🧪 [PERMISSIONS] Testing: ${test.name}`);
      
      try {
        const testResponse = await fetch(test.endpoint + (test.params || ''), {
          method: test.method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const testResult = await testResponse.json();
        
        results.push({
          name: test.name,
          status: testResponse.status,
          success: testResponse.ok,
          message: testResponse.ok ? "✅ Access granted" : `❌ ${testResult.message || 'Access denied'}`,
          details: testResponse.ok ? "Permissions verified" : testResult
        });
        
        console.log(`${testResponse.ok ? '✅' : '❌'} [${test.name}] Status: ${testResponse.status}`);
        
      } catch (error: any) {
        results.push({
          name: test.name,
          status: 'ERROR',
          success: false,
          message: `❌ Request failed: ${error.message}`,
          details: error.message
        });
        
        console.error(`❌ [${test.name}] Error:`, error.message);
      }
    }
    
    // Summary
    const successfulTests = results.filter(r => r.success).length;
    const totalTests = results.length;
    
    const summary = {
      totalTests,
      successfulTests,
      failedTests: totalTests - successfulTests,
      permissionsHealth: successfulTests === totalTests ? "✅ All permissions working" : 
                        successfulTests > 0 ? "⚠️ Partial permissions" : "❌ No permissions",
      recommendation: successfulTests === totalTests ? 
        "API user has sufficient permissions for full integration" :
        successfulTests > 0 ?
        "API user has limited permissions - some features may not work" :
        "API user lacks required permissions - contact Shiprocket support"
    };
    
    console.log("📊 [PERMISSIONS SUMMARY]:", summary);
    
    return NextResponse.json({
      success: true,
      message: "Permissions check completed for ayurvedicmantra.com",
      data: {
        summary,
        detailedResults: results,
        domain: 'ayurvedicmantra.com',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error("❌ [PERMISSIONS CHECK] Critical error:", error);
    
    return NextResponse.json({
      success: false,
      message: "Error checking permissions for ayurvedicmantra.com",
      error: error.message,
      domain: 'ayurvedicmantra.com'
    }, { status: 500 });
  }
}