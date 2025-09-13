import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation, sendAdminNotification } from '@/lib/communications';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    console.log('📋 Order confirmation API called for:', orderData.orderId);
    
    if (!orderData.orderId || !orderData.customerName) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order ID and customer name are required' 
      }, { status: 400 });
    }

    // Send order confirmation to customer
    const result = await sendOrderConfirmation(orderData);
    
    // Send admin notification for new order
    if (orderData.price > 0) {
      await sendAdminNotification('new_order', orderData);
      
      // Send high value order alert if amount > 2000
      if (orderData.price > 2000) {
        await sendAdminNotification('high_value_order', orderData);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order confirmations sent',
      details: {
        emailSent: result.emailSent,
        smsSent: result.smsSent
      }
    });
    
  } catch (error) {
    console.error('❌ Order confirmation API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send order confirmations' 
    }, { status: 500 });
  }
}