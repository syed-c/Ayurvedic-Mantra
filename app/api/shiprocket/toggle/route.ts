import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json();
    console.log(`🔄 [AYURVEDIC MANTRA SHIPROCKET] Updating integration status: ${enabled ? 'ENABLED' : 'DISABLED'} for ayurvedicmantra.com`);

    // Load current settings
    const { storage } = await import('@/lib/storage');
    const currentSettings = await storage.load();
    
    // Update Shiprocket enabled status
    const updatedSettings = {
      ...currentSettings,
      shipping: {
        ...currentSettings.shipping,
        shiprocket: {
          ...currentSettings.shipping?.shiprocket,
          enabled: enabled,
          toggledAt: new Date().toISOString(),
          toggledBy: 'super-admin',
          domain: 'ayurvedicmantra.com',
          globalIntegration: enabled,
          applyToAllOrderTypes: enabled
        }
      }
    };
    
    await storage.save(updatedSettings);
    
    console.log(`✅ [SHIPROCKET TOGGLE] Integration ${enabled ? 'ENABLED' : 'DISABLED'} successfully for ayurvedicmantra.com`);
    
    return NextResponse.json({
      success: true,
      message: `Shiprocket integration ${enabled ? 'enabled' : 'disabled'} successfully`,
      status: enabled ? 'enabled' : 'disabled',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("❌ [SHIPROCKET TOGGLE] Failed to toggle integration:", error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to toggle Shiprocket integration",
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("📊 [SHIPROCKET STATUS] Checking integration status");

    // Load current settings
    const { storage } = await import('@/lib/storage');
    const currentSettings = await storage.load();
    
    const shiprocketConfig = currentSettings.shipping?.shiprocket;
    
    const status = {
      enabled: shiprocketConfig?.enabled || false,
      authenticated: shiprocketConfig?.authenticated || false,
      email: shiprocketConfig?.email || '',
      channelId: shiprocketConfig?.channelId || '',
      pickupLocation: shiprocketConfig?.pickupLocation || 'Primary',
      testMode: shiprocketConfig?.testMode || true,
      lastAuthenticated: shiprocketConfig?.authenticatedAt || null,
      tokenExpiry: shiprocketConfig?.tokenExpiry || null,
      autoRefreshEnabled: shiprocketConfig?.autoRefreshEnabled || false,
      lastToggled: shiprocketConfig?.toggledAt || null
    };
    
    console.log("✅ [SHIPROCKET STATUS] Status retrieved:", status);
    
    return NextResponse.json({
      success: true,
      data: status
    });

  } catch (error: any) {
    console.error("❌ [SHIPROCKET STATUS] Failed to get status:", error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to get Shiprocket status",
      error: error.message
    }, { status: 500 });
  }
}