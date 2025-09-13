import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log("📊 Admin: Fetching all orders from persistent storage");
    
    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const customerType = searchParams.get('customerType');
    
    console.log("🔍 Admin Orders Filter:", { filter, status, paymentMethod, customerType });
    
    // Prefer Supabase orders; fallback to file storage if DB not configured
    let orders: any[] = [];
    try {
      const db = supabaseService || supabase;
      if (db) {
        const { data, error } = await db
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        orders = data || [];
        console.log(`✅ Admin: Loaded ${orders.length} orders from Supabase`);
      } else {
        throw new Error('DB client not available');
      }
    } catch (dbError) {
      console.warn('⚠️ Admin: Supabase unavailable, using file storage:', (dbError as any)?.message);
      try {
        const { storage } = await import('@/lib/storage');
        const settings = await storage.load();
        if ((settings as any).orders && Array.isArray((settings as any).orders)) {
          orders = (settings as any).orders;
          console.log(`✅ Admin: Loaded ${orders.length} orders from persistent storage`);
        } else {
          console.log('⚠️ Admin: No orders found in storage');
        }
      } catch (storageError) {
        console.error('❌ Admin: Failed to load orders from storage:', storageError);
      }
    }
    
    // Apply filters
    let filteredOrders = orders;
    
    if (filter && filter !== 'all') {
      switch (filter) {
        case 'today':
          filteredOrders = orders.filter((o: any) => {
            const today = new Date().toDateString();
            const orderDate = new Date(o.orderTime).toDateString();
            return today === orderDate;
          });
          break;
        case 'pending':
          filteredOrders = orders.filter((o: any) => 
            o.orderStatus === 'placed' || o.orderStatus === 'pending'
          );
          break;
        case 'processing':
          filteredOrders = orders.filter((o: any) => o.orderStatus === 'processing');
          break;
        case 'confirmed':
          filteredOrders = orders.filter((o: any) => o.orderStatus === 'confirmed');
          break;
        case 'shipped':
          filteredOrders = orders.filter((o: any) => o.orderStatus === 'shipped');
          break;
        case 'delivered':
          filteredOrders = orders.filter((o: any) => 
            o.orderStatus === 'delivered' || o.orderStatus === 'completed'
          );
          break;
        case 'cod':
          filteredOrders = orders.filter((o: any) => o.paymentMethod === 'cod');
          break;
        case 'online':
          filteredOrders = orders.filter((o: any) => o.paymentMethod === 'online');
          break;
        case 'guest':
          filteredOrders = orders.filter((o: any) => 
            o.customerType === 'guest' || o.isGuest === true
          );
          break;
        case 'registered':
          filteredOrders = orders.filter((o: any) => 
            o.customerType === 'registered' || (o.userId && !o.isGuest)
          );
          break;
      }
    }
    
    // Additional specific filters
    if (status) {
      filteredOrders = filteredOrders.filter((o: any) => o.orderStatus === status);
    }
    if (paymentMethod) {
      filteredOrders = filteredOrders.filter((o: any) => o.paymentMethod === paymentMethod);
    }
    if (customerType) {
      filteredOrders = filteredOrders.filter((o: any) => 
        customerType === 'guest' ? (o.customerType === 'guest' || o.isGuest) :
        customerType === 'registered' ? (o.customerType === 'registered' || (o.userId && !o.isGuest)) :
        o.customerType === customerType
      );
    }
    

    const stats = {
      totalOrders: orders.length,
      filteredCount: filteredOrders.length,
      todayOrders: orders.filter((o: any) => {
        const today = new Date().toDateString();
        const orderDate = new Date(o.orderTime || o.created_at).toDateString();
        return today === orderDate;
      }).length,
      totalRevenue: orders.reduce((sum: number, o: any) => sum + (o.price || 0), 0),
      todayRevenue: orders.filter((o: any) => {
        const today = new Date().toDateString();
        const orderDate = new Date(o.orderTime || o.created_at).toDateString();
        return today === orderDate;
      }).reduce((sum: number, o: any) => sum + (o.price || 0), 0),
      pendingOrders: orders.filter((o: any) => {
        const status = o.orderStatus || o.status;
        return status === 'placed' || status === 'pending';
      }).length,
      processingOrders: orders.filter((o: any) => (o.orderStatus || o.status) === 'processing').length,
      confirmedOrders: orders.filter((o: any) => (o.orderStatus || o.status) === 'confirmed').length,
      shippedOrders: orders.filter((o: any) => (o.orderStatus || o.status) === 'shipped').length,
      completedOrders: orders.filter((o: any) => {
        const status = o.orderStatus || o.status;
        return status === 'confirmed' || status === 'delivered' || status === 'completed';
      }).length,
      codOrders: orders.filter((o: any) => (o.paymentMethod || o.payment_method) === 'cod').length,
      onlineOrders: orders.filter((o: any) => (o.paymentMethod || o.payment_method) === 'online').length,
      guestOrders: orders.filter((o: any) => o.customerType === 'guest' || o.isGuest === true || o.is_guest === true).length,
      registeredOrders: orders.filter((o: any) => o.customerType === 'registered' || (o.userId && !o.isGuest) || (o.user_id && !o.is_guest)).length
    };


    // Enhanced order formatting with comprehensive details
    const formattedOrders = filteredOrders.map((order: any) => ({
      id: order.id,
      userName: order.userName || order.user_name,
      userEmail: order.userEmail || order.user_email || "",
      userPhone: order.userPhone || order.user_phone,
      planName: order.planName || order.product_name,
      price: order.price,
      orderStatus: order.orderStatus || order.status,
      orderTime: order.orderTime || order.created_at,
      orderDate: new Date(order.orderTime || order.created_at).toLocaleDateString(),
      orderTime12: new Date(order.orderTime || order.created_at).toLocaleTimeString(),
      customerType: order.customerType || (order.is_guest || order.isGuest ? 'guest' : 'registered'),
      isGuest: (order.isGuest ?? order.is_guest) || false,
      wasGuestOrder: order.wasGuestOrder || false,
      linkedToUserId: order.linkedToUserId || null,
      paymentMethod: order.paymentMethod || order.payment_method || 'online',
      paymentStatus: order.paymentStatus || order.payment_status || 'pending',
      shippingAddress: order.shippingAddress || order.shipping_address,
      totalQuantity: order.totalQuantity || 1,
      estimatedDelivery: order.estimatedDelivery || 3,
      shiprocket: order.shiprocket || order.meta?.shiprocket || null,
      shiprocketStatus: order.shiprocket?.status || order.meta?.shiprocket?.status || 'not_sent',
      shiprocketOrderId: order.shiprocket?.orderId || null,
      shiprocketAwbCode: order.shiprocket?.awbCode || null,
      shiprocketCourier: order.shiprocket?.courierName || null,
      communicationSent: order.communicationSent || false,
      statusHistory: order.statusHistory || [],
      adminNotes: order.adminNotes || "",
      formattedPrice: `₹${order.price?.toLocaleString() || 0}`,
      daysAgo: Math.floor((new Date().getTime() - new Date(order.orderTime || order.created_at).getTime()) / (1000 * 60 * 60 * 24))
    }));

    console.log(`✅ Admin: Returning ${formattedOrders.length} filtered orders (${filter})`);

    return NextResponse.json({ 
      success: true, 
      data: { 
        orders: formattedOrders.reverse(), // Latest first
        stats,
        filter: {
          applied: filter,
          status,
          paymentMethod,
          customerType,
          count: formattedOrders.length
        }
      } 
    });
  } catch (error) {
    console.error("❌ Admin: Error fetching orders:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch orders" 
    }, { status: 500 });
  }
}

// Update order status and other properties
export async function PUT(request: NextRequest) {
  try {
    const updateData = await request.json();
    const { orderId, status, paymentStatus, adminNotes, shiprocketInfo } = updateData;
    
    console.log("🔄 Admin: Updating order:", { orderId, status, paymentStatus, adminNotes });
    
    // Try Supabase first, fallback to file storage
    const db = supabaseService || supabase;
    
    if (db) {
      try {
        // Update order in Supabase
        const updateFields: any = {};
        if (status) updateFields.status = status;
        if (paymentStatus) updateFields.payment_status = paymentStatus;
        if (adminNotes) updateFields.admin_notes = adminNotes;
        if (shiprocketInfo) updateFields.shiprocket_info = shiprocketInfo;
        
        // Try to find the order by order_id first, then by id
        let { data, error } = await db
          .from('orders')
          .update(updateFields)
          .eq('order_id', orderId)
          .select('*')
          .single();
        
        // If not found by order_id, try by id
        if (error && error.code === 'PGRST116') {
          const { data: data2, error: error2 } = await db
            .from('orders')
            .update(updateFields)
            .eq('id', orderId)
            .select('*')
            .single();
          data = data2;
          error = error2;
        }
        
        if (error) {
          console.error("❌ Supabase update error:", error);
          throw error;
        }
        
        if (!data) {
          return NextResponse.json({
            success: false,
            message: "Order not found in database"
          }, { status: 404 });
        }
        
        console.log("✅ Order updated in Supabase:", orderId);
        
        return NextResponse.json({
          success: true,
          message: "Order updated successfully",
          data: {
            orderId,
            previousStatus: data.status,
            newStatus: status || data.status,
            updatedAt: data.updated_at
          }
        });
        
      } catch (dbError) {
        console.warn("⚠️ Supabase update failed, falling back to file storage:", dbError);
        // Fall through to file storage
      }
    }
    
    // Fallback to file storage - first try to get order from Supabase if available
    let order = null;
    if (db) {
      try {
        // Try to get the order from Supabase first
        const { data: orderData, error: fetchError } = await db
          .from('orders')
          .select('*')
          .eq('order_id', orderId)
          .single();
        
        if (!fetchError && orderData) {
          order = orderData;
        } else {
          // Try by id if order_id didn't work
          const { data: orderData2, error: fetchError2 } = await db
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
          
          if (!fetchError2 && orderData2) {
            order = orderData2;
          }
        }
      } catch (fetchErr) {
        console.warn("⚠️ Could not fetch order from Supabase for file storage fallback:", fetchErr);
      }
    }
    
    // If we have the order from Supabase, update it and save to file storage
    if (order) {
      // Update the order data
      if (status) order.status = status;
      if (paymentStatus) order.payment_status = paymentStatus;
      if (adminNotes) order.admin_notes = adminNotes;
      if (shiprocketInfo) order.shiprocket_info = shiprocketInfo;
      
      // Save to file storage
      const { storage } = await import('@/lib/storage');
      const settings = await storage.load();
      let orders = (settings as any).orders || [];
      
      // Find existing order in file storage or add new one
      const orderIndex = orders.findIndex((o: any) => o.id === orderId);
      if (orderIndex >= 0) {
        orders[orderIndex] = { ...orders[orderIndex], ...order };
      } else {
        orders.push(order);
      }
      
      const updatedSettings = {
        ...settings,
        orders: orders
      };
      
      await storage.save(updatedSettings);
      
      console.log("✅ Order updated in file storage:", orderId);
      
      return NextResponse.json({
        success: true,
        message: "Order updated successfully",
        data: {
          orderId,
          previousStatus: order.status,
          newStatus: status || order.status,
          updatedAt: new Date().toISOString()
        }
      });
    }
    
    // If no order found anywhere, return 404
    return NextResponse.json({
      success: false,
      message: "Order not found in database or file storage"
    }, { status: 404 });
    
  } catch (error) {
    console.error("❌ Admin: Error updating order:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update order"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    console.log("📦 Admin: Creating new order manually:", orderData);

    // Load existing orders to get proper ID
    let existingOrders = [];
    try {
      const { storage } = await import('@/lib/storage');
      const settings = await storage.load();
      existingOrders = (settings as any).orders || [];
    } catch (error) {
      console.warn("⚠️ Admin: Could not load existing orders for ID generation");
    }

    const newOrder = {
      id: `ADM${String(existingOrders.length + 1).padStart(4, '0')}`,
      userName: orderData.userName || orderData.name,
      userEmail: orderData.userEmail || orderData.email || "",
      userPhone: orderData.userPhone || orderData.phone,
      planName: orderData.planName || orderData.plan,
      price: orderData.price || orderData.amount,
      orderTime: new Date().toISOString(),
      orderStatus: "confirmed",
      paymentMethod: "admin_created",
      paymentStatus: "completed",
      isGuest: !orderData.userId,
      userId: orderData.userId || null,
      customerType: orderData.userId ? 'registered' : 'guest',
      shippingAddress: {
        name: orderData.userName || orderData.name,
        address: orderData.address || "Admin Created Order",
        city: orderData.city || "Mumbai",
        state: orderData.state || "Maharashtra",
        pincode: orderData.pincode || "400001",
        phone: orderData.userPhone || orderData.phone
      },
      totalQuantity: orderData.quantity || 1,
      estimatedDelivery: 3,
      shiprocket: null,
      communicationSent: false,
      adminVisible: true,
      adminCreated: true,
      adminNotes: orderData.notes || "Order created manually by admin",
      statusHistory: [{
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        note: 'Order created manually by admin',
        updatedBy: 'admin'
      }],
      updatedAt: new Date().toISOString()
    };

    // Save to persistent storage
    try {
      const { storage } = await import('@/lib/storage');
      const currentSettings = await storage.load();
      const updatedOrders = [...(currentSettings as any).orders || [], newOrder];
      
      const updatedSettings = {
        ...currentSettings,
        orders: updatedOrders
      };
      
      await storage.save(updatedSettings);
      console.log("✅ Admin: Order saved to persistent storage");
    } catch (saveError) {
      console.error("❌ Admin: Failed to save order:", saveError);
      throw new Error("Failed to save order");
    }
    
    console.log("✅ Admin: New order created successfully");
    return NextResponse.json({ 
      success: true, 
      message: "Order created successfully",
      data: newOrder 
    });

  } catch (error) {
    console.error("❌ Admin: Error creating order:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to create order" 
    }, { status: 500 });
  }
}