import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log("🔧 Fixing Shiprocket pickup location...");
    
    // Load current settings
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    
    // Update pickup location to the correct one found from API
    const updatedSettings = {
      ...settings,
      shipping: {
        ...settings.shipping,
        shiprocket: {
          ...settings.shipping?.shiprocket,
          pickupLocation: "Office", // The correct pickup location name from Shiprocket
          pickupLocationId: 4017529, // The ID from the API response
          pickupLocationFixed: true,
          lastPickupLocationFix: new Date().toISOString()
        }
      }
    };
    
    await storage.save(updatedSettings);
    
    console.log("✅ Pickup location fixed: Office (ID: 4017529)");
    
    return NextResponse.json({
      success: true,
      message: "Pickup location fixed successfully",
      data: {
        pickupLocation: "Office",
        pickupLocationId: 4017529,
        fixedAt: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error("❌ Error fixing pickup location:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fix pickup location",
      error: error.message
    }, { status: 500 });
  }
}