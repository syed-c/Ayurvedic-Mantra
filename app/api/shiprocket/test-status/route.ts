import { NextRequest, NextResponse } from 'next/server';
import { shiprocketService } from '@/lib/shiprocket';

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 [SHIPROCKET TEST] Starting comprehensive status check for ayurvedicmantra.com...");
    
    // Load current settings
    const { storage } = await import('@/lib/storage');
    const currentSettings = await storage.load();
    const shiprocketConfig = currentSettings.shipping?.shiprocket;
    
    if (!shiprocketConfig?.email || !shiprocketConfig?.password) {
      return NextResponse.json({
        success: false,
        message: "Shiprocket credentials not configured for ayurvedicmantra.com",
        domain: 'ayurvedicmantra.com'
      }, { status: 400 });
    }
    
    if (!shiprocketConfig.enabled) {
      return NextResponse.json({
        success: false,
        message: "Shiprocket integration is disabled for ayurvedicmantra.com",
        domain: 'ayurvedicmantra.com'
      }, { status: 400 });
    }
    
    const credentials = {
      email: shiprocketConfig.email,
      password: shiprocketConfig.password,
      enabled: shiprocketConfig.enabled,
      testMode: shiprocketConfig.testMode
    };
    
    console.log("🔑 [TEST AUTH] Authenticating with Shiprocket...");
    
    // Test 1: Authentication
    const authResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });
    
    const authResult = await authResponse.json();
    console.log("🔑 [TEST AUTH] Auth response status:", authResponse.status);
    
    if (!authResponse.ok) {
      console.error("❌ [TEST AUTH] Authentication failed:", authResult);
      return NextResponse.json({
        success: false,
        message: "Authentication failed with Shiprocket API",
        error: authResult.message,
        statusCode: authResponse.status,
        domain: 'ayurvedicmantra.com'
      }, { status: 401 });
    }
    
    const token = authResult.token;
    console.log("✅ [TEST AUTH] Token obtained:", token?.substring(0, 10) + "...");
    
    // Test 2: Company Profile (basic permissions check)
    console.log("👤 [TEST PROFILE] Checking company profile permissions...");
    const profileResponse = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const profileResult = await profileResponse.json();
    console.log("👤 [TEST PROFILE] Profile response status:", profileResponse.status);
    
    if (!profileResponse.ok) {
      console.error("❌ [TEST PROFILE] Profile access failed:", profileResult);
      return NextResponse.json({
        success: false,
        message: "Profile access denied - insufficient permissions",
        error: profileResult.message,
        statusCode: profileResponse.status,
        domain: 'ayurvedicmantra.com'
      }, { status: 403 });
    }
    
    // Test 3: Order Creation Permissions (test with minimal data)
    console.log("📦 [TEST ORDER] Testing order creation permissions...");
    const testOrderData = {
      order_id: "TEST_" + Date.now(),
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: shiprocketConfig.pickupLocation || "Office",
      billing_customer_name: "Test User",
      billing_last_name: "",
      billing_address: "Test Address",
      billing_city: "Mumbai",
      billing_pincode: "400001",
      billing_state: "Maharashtra",
      billing_country: "India",
      billing_email: "test@ayurvedicmantra.com",
      billing_phone: "9876543210",
      shipping_is_billing: true,
      order_items: [{
        name: "Test Product",
        sku: "TEST-SKU",
        units: 1,
        selling_price: "100"
      }],
      payment_method: "Prepaid",
      sub_total: 100,
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5
    };
    
    const orderTestResponse = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrderData)
    });
    
    const orderTestResult = await orderTestResponse.json();
    console.log("📦 [TEST ORDER] Order test response status:", orderTestResponse.status);
    
    if (!orderTestResponse.ok) {
      console.error("❌ [TEST ORDER] Order creation test failed:", orderTestResult);
      return NextResponse.json({
        success: false,
        message: "Order creation permissions denied",
        error: orderTestResult.message,
        statusCode: orderTestResponse.status,
        details: orderTestResult,
        domain: 'ayurvedicmantra.com'
      }, { status: 403 });
    }
    
    console.log("✅ [TEST ORDER] Order creation test successful");
    
    // Test successful - cancel the test order if it was created
    if (orderTestResult.order_id) {
      console.log("🗑️ [CLEANUP] Canceling test order...");
      try {
        await fetch(`https://apiv2.shiprocket.in/v1/external/orders/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ids: [orderTestResult.order_id]
          })
        });
        console.log("✅ [CLEANUP] Test order canceled");
      } catch (cleanupError) {
        console.log("⚠️ [CLEANUP] Could not cancel test order, but that's okay");
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "All Shiprocket permissions verified successfully for ayurvedicmantra.com",
      data: {
        authStatus: "✅ Authentication successful",
        profileAccess: "✅ Profile access granted", 
        orderPermissions: "✅ Order creation permissions verified",
        pickupLocation: shiprocketConfig.pickupLocation,
        companyName: profileResult.data?.company_name,
        accountType: profileResult.data?.account_type,
        domain: 'ayurvedicmantra.com'
      }
    });
    
  } catch (error: any) {
    console.error("❌ [SHIPROCKET TEST] Critical error:", error);
    
    return NextResponse.json({
      success: false,
      message: "Error testing Shiprocket integration for ayurvedicmantra.com",
      error: error.message,
      domain: 'ayurvedicmantra.com'
    }, { status: 500 });
  }
}