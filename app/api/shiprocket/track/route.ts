import { NextRequest, NextResponse } from 'next/server';
import { shiprocketService } from '@/lib/shiprocket';

export async function POST(request: NextRequest) {
  try {
    const { awbCode, credentials } = await request.json();
    console.log("🔍 Tracking shipment with AWB:", awbCode);

    if (!awbCode || !credentials) {
      return NextResponse.json({
        success: false,
        message: "AWB code and credentials are required"
      }, { status: 400 });
    }

    const result = await shiprocketService.trackByAWB(awbCode, credentials);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.error
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("❌ Tracking error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to track shipment"
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const awbCode = searchParams.get('awb');
    
    if (!awbCode) {
      return NextResponse.json({
        success: false,
        message: "AWB code is required"
      }, { status: 400 });
    }

    // Get shipping settings to get credentials
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    
    if (!settings.shipping?.shiprocket?.enabled) {
      return NextResponse.json({
        success: false,
        message: "Shiprocket integration not enabled"
      }, { status: 400 });
    }

    const shiprocketConfig = settings.shipping.shiprocket;
    const credentials = {
      email: shiprocketConfig.email,
      password: shiprocketConfig.password,
      enabled: shiprocketConfig.enabled,
      testMode: shiprocketConfig.testMode || true
    };

    const result = await shiprocketService.trackByAWB(awbCode, credentials, shiprocketConfig.token);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.error
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("❌ Tracking error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to track shipment"
    }, { status: 500 });
  }
}