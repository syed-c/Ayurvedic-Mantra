import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log("🔄 Force refreshing Shiprocket authentication...");
    
    // Load current settings
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    
    // Get fresh authentication
    const { shiprocketService } = await import('@/lib/shiprocket');
    
    const credentials = {
      email: "crepact@gmail.com",
      password: "aDIL@8899",
      enabled: true,
      testMode: true
    };
    
    console.log("🔑 Getting fresh Shiprocket token...");
    const authResult = await shiprocketService.authenticate(credentials);
    
    if (!authResult) {
      throw new Error("Failed to get fresh token");
    }
    
    console.log("✅ Fresh token obtained, updating settings...");
    
    // Update settings with fresh credentials and token
    const updatedSettings = {
      ...settings,
      shipping: {
        ...settings.shipping,
        shiprocket: {
          enabled: true,
          email: "crepact@gmail.com",
          password: "aDIL@8899",
          token: authResult,
          authenticated: true,
          authenticatedAt: new Date().toISOString(),
          tokenExpiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
          autoRefreshEnabled: true,
          lastRefresh: new Date().toISOString(),
          nextRefresh: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          testMode: true,
          channelId: "7303784",
          pickupLocation: "Office",
          pickupLocationId: "1161", 
          packageDimensions: {
            length: 15,
            breadth: 5,
            height: 30,
            weight: 0.5
          }
        }
      }
    };
    
    await storage.save(updatedSettings);
    
    console.log("🚚 Testing fresh connection...");
    const testResult = await shiprocketService.testConnection(credentials);
    
    if (!testResult.success) {
      throw new Error(`Connection test failed: ${testResult.error}`);
    }
    
    return NextResponse.json({
      success: true,
      message: "Shiprocket authentication refreshed successfully",
      data: {
        tokenUpdated: true,
        connectionTested: true,
        authenticatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
    
  } catch (error: any) {
    console.error("❌ Error refreshing Shiprocket auth:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to refresh Shiprocket authentication",
      error: error.message
    }, { status: 500 });
  }
}