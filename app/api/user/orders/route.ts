import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Authentication required"
      }, { status: 401 });
    }

    // Get user session
    const userSessions = global.userSessions || new Map();
    const session = userSessions.get(token);

    if (!session) {
      return NextResponse.json({
        success: false,
        message: "Invalid session"
      }, { status: 401 });
    }

    console.log("Fetching orders for user:", session.userId);
    
    // Load orders from the main orders storage that tracks all orders
    try {
      const { storage } = await import('@/lib/storage');
      const settings = await storage.load();
      const allOrders = (settings as any).orders || [];
      
      console.log(`📦 User Orders: Searching ${allOrders.length} total orders for user ${session.contact}`);
      
      // Enhanced order linking: match by email/phone and properly link guest orders
      const userOrders = allOrders.filter((order: any) => {
        const emailMatch = session.contact.includes('@') && (
          order.userEmail === session.contact || 
          order.originalGuestEmail === session.contact
        );
        const phoneMatch = !session.contact.includes('@') && (
          order.userPhone === session.contact || 
          order.originalGuestPhone === session.contact
        );
        const userIdMatch = order.userId === session.userId;
        const linkedMatch = order.linkedToUserId === session.userId;
        
        const isUserOrder = userIdMatch || linkedMatch || emailMatch || phoneMatch;
        
        // Smart guest order linking - link but preserve original guest status for history
        if (isUserOrder && (order.isGuest || order.wasGuestOrder) && !order.linkedToUserId) {
          console.log(`🔗 Smart linking: Guest order ${order.id} to user ${session.userId} (${session.contact})`);
          order.linkedToUserId = session.userId;
          order.customerType = 'linked_guest'; // Special status for linked guest orders
          order.linkedAt = new Date().toISOString();
          
          // Add to status history
          if (!order.statusHistory) order.statusHistory = [];
          order.statusHistory.push({
            status: 'linked',
            timestamp: new Date().toISOString(),
            note: `Guest order linked to user account: ${session.contact}`
          });
        }
        
        return isUserOrder;
      });

      // Save updated orders back to storage if any guest orders were linked
      if (userOrders.some((order: any) => order.linkedToUserId === session.userId || order.customerType === 'linked_guest')) {
        try {
          const updatedSettings = {
            ...settings,
            orders: allOrders
          };
          await storage.save(updatedSettings);
          console.log("✅ User Orders: Updated linked guest orders for user", session.userId);
        } catch (saveError) {
          console.warn("⚠️ User Orders: Could not save updated orders:", saveError);
        }
      }

      // Format orders for user display with enhanced information
      const formattedOrders = userOrders.map((order: any) => ({
        id: order.id,
        plan: order.planName,
        price: order.price,
        amount: order.price, // For backward compatibility
        status: order.orderStatus === 'confirmed' ? 'Confirmed' : 
                order.orderStatus === 'completed' ? 'Delivered' : 
                order.orderStatus === 'shipped' ? 'Shipped' : 
                order.orderStatus === 'processing' ? 'Processing' : 'Placed',
        date: new Date(order.orderTime).toLocaleDateString(),
        orderTime: order.orderTime,
        trackingId: order.shiprocket?.awbCode || order.id,
        awbCode: order.shiprocket?.awbCode,
        courierName: order.shiprocket?.courierName,
        shiprocketStatus: order.shiprocket?.status,
        estimatedDelivery: `${order.estimatedDelivery || 3} business days`,
        deliveryDate: order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : null,
        paymentMethod: order.paymentMethod || 'online',
        paymentStatus: order.paymentStatus || 'pending',
        shippingAddress: order.shippingAddress,
        customerType: order.customerType,
        wasGuestOrder: order.wasGuestOrder || false,
        linkedAt: order.linkedAt,
        orderSource: order.orderSource || 'website',
        totalQuantity: order.totalQuantity || 1,
        statusHistory: order.statusHistory || []
      }));

      console.log(`✅ User Orders: Found ${formattedOrders.length} orders for user ${session.contact} (ID: ${session.userId})`);
      
      return NextResponse.json({
        success: true,
        data: formattedOrders
      });

    } catch (storageError) {
      console.warn("Failed to load orders from storage:", storageError);
      
      // Return empty array if storage fails
      return NextResponse.json({
        success: true,
        data: []
      });
    }

  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch orders"
    }, { status: 500 });
  }
}