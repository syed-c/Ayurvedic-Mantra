import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log("🚚 Setting up Shiprocket credentials...");
    
    const credentials = {
      email: "crepact@gmail.com",
      password: "aDIL@8899",
      channelId: "7303784",
      enabled: true,
      testMode: false
    };
    
    console.log("📋 Using credentials:", {
      email: credentials.email,
      channelId: credentials.channelId,
      hasPassword: !!credentials.password
    });
    
    // Load existing settings
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    
    // Update Shiprocket settings
    const updatedSettings = {
      ...settings,
      shipping: {
        ...settings.shipping,
        shiprocket: {
          email: credentials.email,
          password: credentials.password,
          channelId: credentials.channelId,
          enabled: credentials.enabled,
          testMode: credentials.testMode,
          updatedAt: new Date().toISOString(),
          configuredBy: "admin",
          // Clear any old authentication data
          token: null,
          tokenExpiry: null,
          authenticated: false,
          autoRefreshEnabled: true,
          pickupLocation: "Primary",
          packageDimensions: {
            length: 15,
            breadth: 5,
            height: 30,
            weight: 0.5
          }
        }
      }
    };
    
    // Save updated settings
    await storage.save(updatedSettings);
    
    // Test connection with new credentials and fetch pickup locations
    try {
      const { shiprocketService } = await import('@/lib/shiprocket');
      const testResult = await shiprocketService.testConnection({
        email: credentials.email,
        password: credentials.password,
        enabled: credentials.enabled,
        testMode: credentials.testMode
      });
      
      if (testResult.success) {
        console.log("✅ Shiprocket connection test successful!");
        
        // Fetch available pickup locations
        try {
          console.log("📍 Fetching pickup locations...");
          const axios = (await import('axios')).default;
          const pickupResponse = await axios.get('https://apiv2.shiprocket.in/v1/external/settings/company/pickup', {
            headers: {
              'Authorization': `Bearer ${testResult.token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (pickupResponse.data?.data?.shipping_address?.length > 0) {
            const pickupLocations = pickupResponse.data.data.shipping_address;
            const defaultLocation = pickupLocations[0];
            
            console.log("✅ Found pickup locations:", pickupLocations.length);
            console.log("📍 Setting default pickup location:", defaultLocation.pickup_location);
            
            // Update settings with successful authentication and pickup locations
            updatedSettings.shipping.shiprocket.authenticated = true;
            updatedSettings.shipping.shiprocket.authenticatedAt = new Date().toISOString();
            updatedSettings.shipping.shiprocket.token = testResult.token;
            updatedSettings.shipping.shiprocket.pickupLocation = defaultLocation.pickup_location;
            updatedSettings.shipping.shiprocket.pickupLocationId = defaultLocation.id;
            updatedSettings.shipping.shiprocket.availablePickupLocations = pickupLocations;
            
            await storage.save(updatedSettings);
            
            return NextResponse.json({
              success: true,
              message: "Shiprocket configured and connected successfully!",
              data: {
                status: 'connected',
                authenticated: true,
                email: credentials.email,
                channelId: credentials.channelId,
                pickupLocation: defaultLocation.pickup_location,
                totalPickupLocations: pickupLocations.length,
                configuredAt: new Date().toISOString()
              }
            });
          } else {
            console.warn("⚠️ No pickup locations found");
            
            // Still mark as authenticated but without pickup locations
            updatedSettings.shipping.shiprocket.authenticated = true;
            updatedSettings.shipping.shiprocket.authenticatedAt = new Date().toISOString();
            updatedSettings.shipping.shiprocket.token = testResult.token;
            
            await storage.save(updatedSettings);
            
            return NextResponse.json({
              success: true,
              message: "Shiprocket connected but no pickup locations found. Please add pickup locations in Shiprocket dashboard.",
              data: {
                status: 'connected_no_pickup',
                authenticated: true,
                email: credentials.email,
                channelId: credentials.channelId,
                warning: "No pickup locations configured"
              }
            });
          }
        } catch (pickupError: any) {
          console.error("❌ Error fetching pickup locations:", pickupError);
          
          // Still mark as authenticated even if pickup fetch fails
          updatedSettings.shipping.shiprocket.authenticated = true;
          updatedSettings.shipping.shiprocket.authenticatedAt = new Date().toISOString();
          updatedSettings.shipping.shiprocket.token = testResult.token;
          
          await storage.save(updatedSettings);
          
          return NextResponse.json({
            success: true,
            message: "Shiprocket connected but couldn't fetch pickup locations. Please check manually.",
            data: {
              status: 'connected_pickup_error',
              authenticated: true,
              pickupError: pickupError.message
            }
          });
        }
      } else {
        console.error("❌ Shiprocket connection test failed:", testResult.error);
        
        return NextResponse.json({
          success: false,
          message: "Shiprocket configured but connection failed",
          error: testResult.error,
          data: {
            status: 'auth_failed',
            authenticated: false,
            configuredAt: new Date().toISOString()
          }
        });
      }
    } catch (testError: any) {
      console.error("❌ Error testing Shiprocket connection:", testError);
      
      return NextResponse.json({
        success: false,
        message: "Shiprocket configured but unable to test connection",
        error: testError.message,
        data: {
          status: 'connection_error',
          authenticated: false,
          configuredAt: new Date().toISOString()
        }
      });
    }
    
  } catch (error: any) {
    console.error("❌ Error setting up Shiprocket:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to setup Shiprocket",
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log("🔍 Checking current Shiprocket configuration...");
    
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    const shiprocketConfig = settings.shipping?.shiprocket;
    
    if (!shiprocketConfig) {
      return NextResponse.json({
        success: true,
        data: {
          configured: false,
          message: "Shiprocket not configured"
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        configured: true,
        enabled: shiprocketConfig.enabled,
        email: shiprocketConfig.email,
        channelId: shiprocketConfig.channelId,
        authenticated: shiprocketConfig.authenticated,
        updatedAt: shiprocketConfig.updatedAt,
        hasToken: !!shiprocketConfig.token
      }
    });
    
  } catch (error: any) {
    console.error("❌ Error checking Shiprocket config:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to check configuration",
      error: error.message
    }, { status: 500 });
  }
}