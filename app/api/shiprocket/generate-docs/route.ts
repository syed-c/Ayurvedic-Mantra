import { NextRequest, NextResponse } from 'next/server';
import { shiprocketService } from '@/lib/shiprocket';

export async function POST(request: NextRequest) {
  try {
    const { type, ids, credentials } = await request.json();
    console.log(`📄 Generating ${type} for IDs:`, ids);

    if (!type || !ids || !Array.isArray(ids) || !credentials) {
      return NextResponse.json({
        success: false,
        message: "Type, IDs array, and credentials are required"
      }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'manifest':
        result = await shiprocketService.generateManifest(ids, credentials);
        break;
      case 'label':
        result = await shiprocketService.generateLabel(ids, credentials);
        break;
      case 'invoice':
        result = await shiprocketService.generateInvoice(ids, credentials);
        break;
      default:
        return NextResponse.json({
          success: false,
          message: "Invalid document type. Use 'manifest', 'label', or 'invoice'"
        }, { status: 400 });
    }

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
    console.error(`❌ Document generation error:`, error);
    return NextResponse.json({
      success: false,
      message: "Failed to generate document"
    }, { status: 500 });
  }
}