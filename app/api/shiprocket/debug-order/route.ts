import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 [DEBUG] Starting Shiprocket order debug test...");
    
    // Load settings first
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    const shiprocketConfig = settings.shipping?.shiprocket;
    
    console.log("🔧 [DEBUG] Current Shiprocket config:", {
      enabled: shiprocketConfig?.enabled,
      email: shiprocketConfig?.email,
      hasPassword: !!shiprocketConfig?.password,
      hasToken: !!shiprocketConfig?.token,
      channelId: shiprocketConfig?.channelId,
      pickupLocation: shiprocketConfig?.pickupLocation,
      pickupLocationId: shiprocketConfig?.pickupLocationId
    });
    
    if (!shiprocketConfig?.enabled) {
      return NextResponse.json({
        success: false,
        error: "Shiprocket is not enabled in settings"
      });
    }
    
    // Create test order data
    const testOrder = {
      id: `DEBUG-${Date.now()}`,
      userName: "Debug Customer",
      userEmail: "debug@test.com",
      userPhone: "9876543210",
      planName: "1 Month Plan",
      price: 999,
      paymentMethod: "cod",
      shippingAddress: {
        address: "123 Debug Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
      }
    };
    
    console.log("📦 [DEBUG] Created test order:", testOrder.id);
    
    // Import and call the createShiprocketOrder function directly
    try {
      console.log("🔄 [DEBUG] Loading Shiprocket service...");
      const { shiprocketService, ShiprocketService } = await import('@/lib/shiprocket');
      
      console.log("🔄 [DEBUG] Formatting order for Shiprocket...");
      const formattedOrder = ShiprocketService.formatOrderForShiprocket(testOrder, shiprocketConfig);
      
      console.log("📋 [DEBUG] Formatted order data:", JSON.stringify(formattedOrder, null, 2));
      
      console.log("🔄 [DEBUG] Creating order in Shiprocket...");
      const result = await shiprocketService.createOrder(
        formattedOrder,
        {
          email: shiprocketConfig.email,
          password: shiprocketConfig.password,
          enabled: shiprocketConfig.enabled,
          testMode: shiprocketConfig.testMode || true
        },
        shiprocketConfig.token
      );
      
      console.log("✅ [DEBUG] Shiprocket API response:", JSON.stringify(result, null, 2));
      
      return NextResponse.json({
        success: true,
        message: "Debug order creation completed",
        data: {
          testOrderId: testOrder.id,
          formattedOrder,
          shiprocketResponse: result,
          config: {
            pickupLocation: shiprocketConfig.pickupLocation,
            channelId: shiprocketConfig.channelId,
            email: shiprocketConfig.email
          }
        }
      });
      
    } catch (shiprocketError: any) {
      console.error("❌ [DEBUG] Shiprocket error:", {
        message: shiprocketError.message,
        response: shiprocketError.response?.data,
        status: shiprocketError.response?.status,
        statusText: shiprocketError.response?.statusText
      });
      
      return NextResponse.json({
        success: false,
        error: "Shiprocket API error",
        details: {
          message: shiprocketError.message,
          response: shiprocketError.response?.data,
          status: shiprocketError.response?.status,
          statusText: shiprocketError.response?.statusText
        }
      });
    }
    
  } catch (error: any) {
    console.error("❌ [DEBUG] General error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}