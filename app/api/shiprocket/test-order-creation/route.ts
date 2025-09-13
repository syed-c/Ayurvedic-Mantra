import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log("🧪 Testing Shiprocket order creation...");
    
    // Load Shiprocket settings
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    const shiprocketConfig = settings.shipping?.shiprocket;
    
    if (!shiprocketConfig?.enabled) {
      return NextResponse.json({
        success: false,
        message: "Shiprocket is not enabled"
      });
    }
    
    // Create test order data
    const testOrder = {
      id: `TEST-${Date.now()}`,
      userName: "Test Customer",
      userEmail: "test@example.com",
      userPhone: "9876543210",
      planName: "1 Month Plan",
      price: 999,
      paymentMethod: "cod",
      shippingAddress: {
        address: "123 Test Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
      }
    };
    
    console.log("📦 Test order data:", testOrder);
    console.log("⚙️ Shiprocket config:", {
      email: shiprocketConfig.email,
      channelId: shiprocketConfig.channelId,
      pickupLocation: shiprocketConfig.pickupLocation,
      enabled: shiprocketConfig.enabled
    });
    
    // Import Shiprocket service
    const { shiprocketService, ShiprocketService } = await import('@/lib/shiprocket');
    
    // Format order for Shiprocket
    const formattedOrder = ShiprocketService.formatOrderForShiprocket(testOrder, shiprocketConfig);
    
    console.log("📋 Formatted order for Shiprocket:", JSON.stringify(formattedOrder, null, 2));
    
    // Create order in Shiprocket
    const result = await shiprocketService.createOrder(
      formattedOrder,
      {
        email: shiprocketConfig.email,
        password: shiprocketConfig.password,
        enabled: shiprocketConfig.enabled,
        testMode: shiprocketConfig.testMode || false
      },
      shiprocketConfig.token
    );
    
    console.log("📊 Shiprocket creation result:", result);
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? "Test order created successfully!" : "Test order creation failed",
      data: {
        testOrderId: testOrder.id,
        shiprocketResult: result,
        formattedOrder: formattedOrder,
        config: {
          pickupLocation: shiprocketConfig.pickupLocation,
          channelId: shiprocketConfig.channelId,
          email: shiprocketConfig.email
        }
      }
    });
    
  } catch (error: any) {
    console.error("❌ Error testing Shiprocket order creation:", error);
    return NextResponse.json({
      success: false,
      message: "Test failed with error",
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}