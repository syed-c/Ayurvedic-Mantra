import { NextRequest, NextResponse } from 'next/server';
import { shiprocketService } from '@/lib/shiprocket';

export async function POST(request: NextRequest) {
  try {
    const { action, shipmentId, courierId, credentials } = await request.json();
    console.log(`🚚 Managing shipment - Action: ${action}, Shipment ID: ${shipmentId}`);

    if (!action || !shipmentId || !credentials) {
      return NextResponse.json({
        success: false,
        message: "Action, shipment ID, and credentials are required"
      }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'assign_awb':
        result = await shiprocketService.assignAWB(shipmentId, courierId, credentials);
        break;
      case 'schedule_pickup':
        result = await shiprocketService.schedulePickup([shipmentId], credentials);
        break;
      default:
        return NextResponse.json({
          success: false,
          message: "Invalid action. Use 'assign_awb' or 'schedule_pickup'"
        }, { status: 400 });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: `${action} completed successfully`
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.error
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error(`❌ Shipment management error:`, error);
    return NextResponse.json({
      success: false,
      message: "Failed to manage shipment"
    }, { status: 500 });
  }
}