import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  try {
    console.log("🔍 Getting admin settings from storage");
    const settings = await storage.load();
    console.log("✅ Admin settings loaded successfully");
    return NextResponse.json({ 
      success: true, 
      data: settings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Error loading admin settings:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to load settings" 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("🔄 Admin settings update requested");
    
    const updates = await request.json();
    console.log("📝 Updating settings with:", Object.keys(updates));

    // Special handling for different types of updates
    if (updates.communications) {
      console.log("💾 Saving SMTP/SMS settings permanently...");
      
      if (updates.communications.email) {
        const emailSettings = { ...updates.communications.email };
        if (emailSettings.password) {
          emailSettings.password = "***HIDDEN***";
        }
        console.log("📧 SMTP Settings:", emailSettings);
      }
    }

    if (updates.homepage?.heroImage || updates.product?.image) {
      console.log("🖼️ Saving image updates...");
    }

    if (updates.shipping?.shiprocket) {
      console.log("🚚 Saving Shiprocket settings...");
    }

    // Update settings using singleton storage
    const updatedSettings = await storage.update(updates);
    
    // Determine appropriate success message
    let successMessage = "Settings saved successfully and will persist!";
    if (updates.communications?.email) {
      successMessage = "SMTP settings saved permanently and will be used for all emails!";
    } else if (updates.homepage?.heroImage || updates.product?.image) {
      successMessage = "Images uploaded and saved! Changes are now live on the website.";
    } else if (updates.shipping?.shiprocket) {
      successMessage = "Shiprocket settings saved and will remain authenticated!";
    }
    
    console.log("✅ Settings updated successfully in storage");
    
    return NextResponse.json({ 
      success: true, 
      message: successMessage,
      data: updatedSettings,
      timestamp: new Date().toISOString(),
      cached: true // Indicate this is using memory cache
    });

  } catch (error) {
    console.error("❌ Error updating settings:", error);
    return NextResponse.json({ 
      success: false, 
      message: `Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}