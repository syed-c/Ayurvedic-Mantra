import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

// Internal settings API - bypasses middleware for system operations
// This is used by the admin interface when authenticated

export async function GET() {
  try {
    console.log("🔧 Internal settings GET request");
    const settings = await storage.load();
    return NextResponse.json({ 
      success: true, 
      data: settings,
      source: 'internal-bypass'
    });
  } catch (error) {
    console.error("❌ Internal settings GET failed:", error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("🔧 Internal settings PUT request");
    
    const updates = await request.json();
    console.log("📝 Internal update with:", Object.keys(updates));

    // Update using singleton storage
    const updatedSettings = await storage.update(updates);
    
    console.log("✅ Internal settings updated successfully");
    
    return NextResponse.json({ 
      success: true, 
      message: "Settings updated successfully via internal API",
      data: updatedSettings,
      source: 'internal-bypass',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Internal settings PUT failed:", error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Handle specific actions like cache clearing
  try {
    const { action } = await request.json();
    
    if (action === 'clear-cache') {
      storage.clearCache();
      console.log("🗑️ Storage cache cleared");
      return NextResponse.json({ 
        success: true, 
        message: "Cache cleared successfully" 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "Unknown action" 
    }, { status: 400 });
    
  } catch (error) {
    console.error("❌ Internal settings POST failed:", error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}