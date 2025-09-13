import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("📍 Fetching Shiprocket pickup locations...");
    
    // Load Shiprocket settings
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    const shiprocketConfig = settings.shipping?.shiprocket;
    
    if (!shiprocketConfig?.enabled || !shiprocketConfig.email || !shiprocketConfig.password) {
      return NextResponse.json({
        success: false,
        message: "Shiprocket not configured properly"
      }, { status: 400 });
    }
    
    // Get pickup locations from Shiprocket
    const { shiprocketService } = await import('@/lib/shiprocket');
    
    try {
      // Authenticate first
      const token = await shiprocketService.authenticate({
        email: shiprocketConfig.email,
        password: shiprocketConfig.password,
        enabled: shiprocketConfig.enabled,
        testMode: shiprocketConfig.testMode || false
      });
      
      if (!token) {
        throw new Error("Authentication failed");
      }
      
      // Fetch pickup locations
      const axios = (await import('axios')).default;
      const response = await axios.get('https://apiv2.shiprocket.in/v1/external/settings/company/pickup', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.data && response.data.data.shipping_address) {
        const pickupLocations = response.data.data.shipping_address;
        
        console.log("✅ Found pickup locations:", pickupLocations.length);
        
        // Auto-select the first pickup location as default
        const defaultLocation = pickupLocations[0];
        if (defaultLocation) {
          // Update settings with the correct pickup location
          const updatedSettings = {
            ...settings,
            shipping: {
              ...settings.shipping,
              shiprocket: {
                ...shiprocketConfig,
                pickupLocation: defaultLocation.pickup_location,
                pickupLocationId: defaultLocation.id,
                availablePickupLocations: pickupLocations,
                lastPickupLocationUpdate: new Date().toISOString()
              }
            }
          };
          
          await storage.save(updatedSettings);
          
          console.log("✅ Updated default pickup location:", defaultLocation.pickup_location);
        }
        
        return NextResponse.json({
          success: true,
          data: {
            pickupLocations: pickupLocations,
            defaultLocation: defaultLocation,
            totalLocations: pickupLocations.length
          }
        });
      } else {
        throw new Error("No pickup locations found in response");
      }
      
    } catch (apiError: any) {
      console.error("❌ Shiprocket API error:", apiError.response?.data || apiError.message);
      return NextResponse.json({
        success: false,
        message: "Failed to fetch pickup locations",
        error: apiError.response?.data?.message || apiError.message
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error("❌ Error fetching pickup locations:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch pickup locations",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pickupLocationId } = await request.json();
    
    console.log("🔄 Updating default pickup location to:", pickupLocationId);
    
    // Load current settings
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    const shiprocketConfig = settings.shipping?.shiprocket;
    
    if (!shiprocketConfig?.availablePickupLocations) {
      return NextResponse.json({
        success: false,
        message: "No pickup locations available. Please fetch them first."
      }, { status: 400 });
    }
    
    // Find the selected pickup location
    const selectedLocation = shiprocketConfig.availablePickupLocations.find(
      (loc: any) => loc.id === pickupLocationId
    );
    
    if (!selectedLocation) {
      return NextResponse.json({
        success: false,
        message: "Invalid pickup location selected"
      }, { status: 400 });
    }
    
    // Update settings with selected pickup location
    const updatedSettings = {
      ...settings,
      shipping: {
        ...settings.shipping,
        shiprocket: {
          ...shiprocketConfig,
          pickupLocation: selectedLocation.pickup_location,
          pickupLocationId: selectedLocation.id,
          selectedPickupLocationAddress: selectedLocation,
          lastPickupLocationUpdate: new Date().toISOString()
        }
      }
    };
    
    await storage.save(updatedSettings);
    
    console.log("✅ Updated pickup location to:", selectedLocation.pickup_location);
    
    return NextResponse.json({
      success: true,
      message: "Pickup location updated successfully",
      data: {
        selectedLocation: selectedLocation,
        pickupLocation: selectedLocation.pickup_location
      }
    });
    
  } catch (error: any) {
    console.error("❌ Error updating pickup location:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update pickup location",
      error: error.message
    }, { status: 500 });
  }
}