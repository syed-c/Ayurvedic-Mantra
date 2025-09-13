import { NextRequest, NextResponse } from 'next/server';
import { shiprocketService } from '@/lib/shiprocket';

export async function POST(request: NextRequest) {
  try {
    const { pickupPincode, deliveryPincode, weight, credentials } = await request.json();
    console.log("🔍 Checking serviceability:", { pickupPincode, deliveryPincode, weight });

    if (!pickupPincode || !deliveryPincode || !weight || !credentials) {
      return NextResponse.json({
        success: false,
        message: "Pickup pincode, delivery pincode, weight, and credentials are required"
      }, { status: 400 });
    }

    const result = await shiprocketService.getServiceability(
      pickupPincode,
      deliveryPincode,
      weight,
      credentials
    );

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
    console.error("❌ Serviceability check error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to check serviceability"
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pickupPincode = searchParams.get('pickup');
    const deliveryPincode = searchParams.get('delivery');
    const weight = searchParams.get('weight');
    
    if (!pickupPincode || !deliveryPincode || !weight) {
      return NextResponse.json({
        success: false,
        message: "Pickup pincode, delivery pincode, and weight are required"
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

    const result = await shiprocketService.getServiceability(
      pickupPincode,
      deliveryPincode,
      parseFloat(weight),
      credentials,
      shiprocketConfig.token
    );

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
    console.error("❌ Serviceability check error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to check serviceability"
    }, { status: 500 });
  }
}