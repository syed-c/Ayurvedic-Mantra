import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/communications';
import { shiprocketService, ShiprocketService } from '@/lib/shiprocket';
import { ShiprocketNotificationService } from '@/lib/shiprocket-notifications';
import { supabase, supabaseService } from '@/lib/supabase';

// Mock database for orders - this will store all orders for Super Admin dashboard
let orders: any[] = [];

// Enhanced order storage with persistence
async function saveOrderToDatabase(orderData: any) {
  try {
    const db = supabaseService || supabase;
    if (db) {
      // Upsert user first to get user_id
      let userId: string | null = null;
      try {
        const { data: userRow, error: userErr } = await db
          .from('users')
          .upsert(
            {
              email: orderData.userEmail || null,
              phone: orderData.userPhone || null,
              name: orderData.userName || null,
              is_guest: orderData.isGuest,
              verified: false,
              meta: { source: orderData.orderSource || 'website' }
            },
            { onConflict: 'email' }
          )
          .select('id')
          .single();
        if (!userErr && userRow?.id) {
          userId = userRow.id;
        }
      } catch {}

      const { data, error } = await db
        .from('orders')
        .insert({
          order_id: orderData.id,
          user_id: userId,
          user_email: orderData.userEmail || null,
          user_phone: orderData.userPhone || null,
          user_name: orderData.userName || null,
          price: orderData.price,
          product_name: orderData.planName,
          status: orderData.orderStatus,
          payment_method: orderData.paymentMethod,
          payment_status: orderData.paymentStatus,
          shipping_address: orderData.shippingAddress,
          is_guest: orderData.isGuest,
          meta: orderData
        })
        .select('*')
        .single();

      if (error) {
        console.warn('⚠️ Supabase order insert failed, falling back to file storage:', error.message);
      } else {
        console.log('✅ Order saved to Supabase:', data?.id);
        return true;
      }
    }

    // Fallback to file for resilience (or when DB not configured)
    orders.push(orderData);
    const { storage } = await import('@/lib/storage');
    const currentSettings = await storage.load();
    const updatedSettings: any = { ...currentSettings, orders };
    await storage.save(updatedSettings);
    return true;
  } catch (error) {
    console.error("❌ Error saving order:", error);
    return false;
  }
}

// Generate unique order ID
function generateOrderId(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `SM${timestamp.slice(-6)}${random}`;
}

// Enhanced Shiprocket integration with comprehensive error handling
async function createShiprocketOrder(orderData: any) {
  console.log("🚚 Starting Shiprocket integration for order:", orderData.id);
  
  try {
    // Get shipping settings from admin settings
    const shippingSettings = await getShippingSettings();
    
    if (!shippingSettings?.shiprocket?.enabled) {
      console.log("📦 Shiprocket integration disabled, order will be saved without shipping");
      orderData.shiprocket = {
        status: "disabled",
        message: "Shiprocket integration is disabled"
      };
      return { success: false, reason: "disabled", message: "Shiprocket integration disabled" };
    }

    const shiprocketConfig = shippingSettings.shiprocket;
    
    // Validate required credentials
    if (!shiprocketConfig.email || !shiprocketConfig.password) {
      console.log("⚠️ Shiprocket credentials missing");
      orderData.shiprocket = {
        status: "credentials_missing",
        message: "Shiprocket credentials not configured"
      };
      return { success: false, reason: "credentials_missing", message: "Shiprocket credentials not configured" };
    }

    const credentials = {
      email: shiprocketConfig.email,
      password: shiprocketConfig.password,
      enabled: shiprocketConfig.enabled,
      testMode: shiprocketConfig.testMode || true
    };

    console.log("🔑 Using Shiprocket credentials:", {
      email: credentials.email,
      hasPassword: !!credentials.password,
      testMode: credentials.testMode
    });

    // Step 1: Create order in Shiprocket ONLY (no AWB, no courier assignment)
    console.log("📦 Creating order in Shiprocket (order creation only - no automation)...");
    const shiprocketOrder = ShiprocketService.formatOrderForShiprocket(orderData, shiprocketConfig);
    
    console.log("📋 Shiprocket order payload:", {
      order_id: shiprocketOrder.order_id,
      billing_customer_name: shiprocketOrder.billing_customer_name,
      billing_phone: shiprocketOrder.billing_phone,
      billing_pincode: shiprocketOrder.billing_pincode,
      order_items: shiprocketOrder.order_items
    });
    
    const createResult = await shiprocketService.createOrder(shiprocketOrder, credentials, shiprocketConfig.token);

    if (!createResult.success) {
      console.error("❌ Shiprocket order creation failed:", createResult.error);
      orderData.shiprocket = {
        status: "failed",
        error: createResult.error,
        details: createResult.details,
        attemptedAt: new Date().toISOString()
      };
      return createResult;
    }

    console.log("✅ Shiprocket order created successfully (in 'New Orders' tab):", {
      orderId: createResult.orderId,
      shipmentId: createResult.shipmentId,
      note: "Order created without AWB/courier assignment as requested"
    });
    
    // Update order with Shiprocket details (order creation only)
    orderData.shiprocket = {
      orderId: createResult.orderId,
      shipmentId: createResult.shipmentId,
      awbCode: null, // No AWB generated
      courierName: null, // No courier assigned
      createdAt: new Date().toISOString(),
      status: "synchronized", // Synchronized but no further automation
      response: createResult.data,
      note: "Order created in Shiprocket without AWB/courier assignment"
    };

    console.log("⏹️ Order sync completed - stopping here as requested (no AWB, no courier, no pickup)");

    console.log("🎉 Shiprocket integration completed for order:", orderData.id);
    
    return {
      success: true,
      message: "Order successfully created in Shiprocket (order creation only)",
      data: createResult.data,
      orderId: createResult.orderId,
      shipmentId: createResult.shipmentId,
      awbCode: null, // No AWB as requested
      courierName: null, // No courier as requested
      status: "synchronized",
      note: "Order appears in Shiprocket 'New Orders' tab without automation"
    };

  } catch (error: any) {
    console.error("❌ Shiprocket integration error:", error);
    orderData.shiprocket = {
      status: "error",
      error: error.message,
      stack: error.stack,
      attemptedAt: new Date().toISOString()
    };
    return { 
      success: false, 
      error: error.message, 
      reason: "api_error",
      message: `Shiprocket integration failed: ${error.message}`
    };
  }
}

// Get shipping settings from storage
async function getShippingSettings() {
  try {
    const { storage } = await import('@/lib/storage');
    const settings = await storage.load();
    
    console.log('🚚 Loading shipping settings from storage');
    
    if (settings.shipping?.shiprocket) {
      console.log('✅ Found Shiprocket settings in storage');
      return settings.shipping;
    } else {
      console.warn('⚠️ No Shiprocket settings found, using defaults');
      return {
        shiprocket: {
          enabled: false, // Disabled by default if not configured
          email: "",
          password: "",
          channelId: "",
          pickupLocation: "Primary",
          pickupPincode: "400001", // Default pickup pincode
          testMode: true,
          packageDimensions: {
            length: 15,
            breadth: 10,
            height: 5,
            weight: 0.5
          }
        }
      };
    }
  } catch (error) {
    console.error('❌ Error loading shipping settings:', error);
    return {
      shiprocket: {
        enabled: false,
        email: "",
        password: "",
        channelId: "",
        pickupLocation: "Primary",
        pickupPincode: "400001", // Default pickup pincode
        testMode: true,
        packageDimensions: {
          length: 15,
          breadth: 10,
          height: 5,
          weight: 0.5
        }
      }
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    console.log("📦 New order received:", {
      name: orderData.name,
      phone: orderData.phone,
      plan: orderData.plan,
      amount: orderData.amount
    });

    // Generate unique order ID
    const orderId = generateOrderId();
    
    // Create comprehensive order object with enhanced tracking
    const newOrder: any = {
      id: orderId,
      userName: orderData.name,
      userEmail: orderData.email || "",
      userPhone: orderData.phone,
      planName: orderData.plan,
      price: orderData.amount,
      orderStatus: 'pending',
      orderTime: new Date().toISOString(),
      isGuest: !orderData.userId,
      userId: orderData.userId || null,
      shippingAddress: {
        name: orderData.name,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state, 
        pincode: orderData.pincode,
        phone: orderData.phone
      },
      paymentMethod: orderData.paymentMethod || 'online',
      paymentStatus: (orderData.paymentMethod === 'cod') ? 'pending' : 'completed', // COD starts as pending, Online Payment as completed
      estimatedDelivery: orderData.deliveryDays || 3,
      shiprocket: null, // Will be populated by Shiprocket integration
      communicationSent: false,
      adminVisible: true,
      shiprocketSyncedAt: null,
      // Enhanced fields for better tracking
      orderSource: orderData.orderSource || 'website',
      customerType: !orderData.userId ? 'guest' : 'registered',
      totalQuantity: orderData.quantity || 1,
      originalGuestEmail: orderData.email, // For linking guest orders later
      originalGuestPhone: orderData.phone, // For linking guest orders later
      linkedToUserId: null, // Will be set when guest order is linked to user
      wasGuestOrder: !orderData.userId, // Flag to track if this was originally a guest order
      updatedAt: new Date().toISOString(),
      statusHistory: [{
        status: 'pending',
        timestamp: new Date().toISOString(),
        note: 'Order placed successfully'
      }]
    };

    console.log("💾 Saving order to database:", newOrder.id);

    // STEP 1: Save order to database first (ensuring it's always saved)
    const orderSaved = await saveOrderToDatabase(newOrder);
    if (!orderSaved) {
      console.warn("⚠️ Failed to save order to database, but continuing...");
    }

    // STEP 2: Send to Shiprocket (Global Integration - Real-time for ayurvedicmantra.com)
    let shiprocketResult: any = null;
    try {
      console.log("🚚 [AYURVEDIC MANTRA SHIPROCKET] Starting real-time order sync for ayurvedicmantra.com...");
      
      // Check if this is a repeat order, guest checkout, registered user, or saved cart
      const orderType = orderData.orderType || (orderData.userId ? 'registered_user' : 'guest_checkout');
      console.log(`📦 [ORDER TYPE] Processing ${orderType} order for Shiprocket integration`);
      
      // Apply global Shiprocket integration across all order types
      shiprocketResult = await createShiprocketOrder(newOrder);
      
      if (shiprocketResult?.success) {
        console.log("✅ [AYURVEDIC MANTRA SHIPROCKET SUCCESS] Order created in Shiprocket (no automation):", {
          domain: "ayurvedicmantra.com",
          orderId: shiprocketResult.orderId,
          shipmentId: shiprocketResult.shipmentId,
          status: "synchronized",
          note: "Order created without AWB/courier assignment as requested",
          orderType: orderType,
          customerEmail: newOrder.userEmail || "orders@ayurvedicmantra.com",
          timestamp: new Date().toISOString()
        });
        
        // Update order status for successful Shiprocket orders
        newOrder.orderStatus = 'confirmed';
        newOrder.shiprocketSyncedAt = new Date().toISOString();
        newOrder.shiprocketIntegrationType = orderType;
        
        // Store Shiprocket IDs for tracking and future reference (order creation only)
        newOrder.shiprocketOrderId = shiprocketResult.orderId;
        newOrder.shiprocketShipmentId = shiprocketResult.shipmentId;
        newOrder.shiprocketAwbCode = null; // No AWB generated as requested
        newOrder.shiprocketCourierName = null; // No courier assigned as requested
        
        // Add direct Shiprocket dashboard links for Super Admin
        if (shiprocketResult.orderId) {
          newOrder.shiprocketDashboardLink = `https://app.shiprocket.in/orders/${shiprocketResult.orderId}`;
        }
        // No tracking link since no AWB is generated
        newOrder.shiprocketTrackingLink = null;
        
        // Update the saved order with comprehensive Shiprocket details
        await saveOrderToDatabase(newOrder);
        
        // Send admin notification about successful integration
        try {
          const { notifyShiprocketSuccess } = await import('@/lib/admin-notifications');
          await notifyShiprocketSuccess({
            orderId: newOrder.id,
            customerName: newOrder.userName,
            customerPhone: newOrder.userPhone,
            shiprocketOrderId: shiprocketResult.orderId,
            shipmentId: shiprocketResult.shipmentId,
            awbCode: undefined, // No AWB as requested
            courierName: undefined // No courier as requested
          });
        } catch (notifyError) {
          console.warn("⚠️ Could not send success notification:", notifyError);
        }
        
      } else {
        console.warn("⚠️ [AYURVEDIC MANTRA SHIPROCKET FAILED] Order integration failed:", shiprocketResult?.message || shiprocketResult?.error);
        
        // Critical: Ensure order is still processed successfully even if Shiprocket fails
        console.log("✅ [FALLBACK] Order will be processed without Shiprocket integration");
        
        // Still save order but mark Shiprocket as failed for manual processing
        newOrder.shiprocket = {
          ...newOrder.shiprocket,
          status: "failed",
          error: shiprocketResult?.error || "Authentication failed",
          failureReason: shiprocketResult?.reason || "auth_error",
          lastAttempt: new Date().toISOString(),
          requiresManualProcessing: true,
          orderType: orderType,
          adminActionRequired: true,
          retryable: shiprocketResult?.error?.includes("Unauthorized") ? false : true // Auth errors are not retryable
        } as any;
        
        // Set order to confirmed anyway (order processing should not fail due to Shiprocket)
        newOrder.orderStatus = 'confirmed';
        newOrder.needsShiprocketSync = true; // Flag for admin attention
        
        // Alert Super Admin about failed integration (as required)
        try {
          const { notifyShiprocketFailure } = await import('@/lib/admin-notifications');
          await notifyShiprocketFailure({
            orderId: newOrder.id,
            customerName: newOrder.userName,
            customerPhone: newOrder.userPhone,
            error: shiprocketResult?.error || "Authentication failed",
            reason: shiprocketResult?.reason || "auth_error"
          });
          
          console.log("🚨 [ADMIN ALERT] Super Admin notified about Shiprocket integration failure");
        } catch (alertError) {
          console.error("❌ Could not send failure alert to admin:", alertError);
        }
      }
    } catch (shiprocketError: any) {
      console.warn("⚠️ [AYURVEDIC MANTRA SHIPROCKET CRITICAL] Integration system error:", shiprocketError.message);
      
      // Critical: Do NOT fail the entire order due to Shiprocket issues
      console.log("✅ [EMERGENCY FALLBACK] Order will be processed without Shiprocket (system error)");
      
      // Set detailed error info for admin investigation
      newOrder.shiprocket = {
        status: "system_error",
        error: shiprocketError.message,
        stack: shiprocketError.stack,
        attemptedAt: new Date().toISOString(),
        requiresAdminAttention: true,
        domain: "ayurvedicmantra.com",
        criticalError: true,
        orderProcessedAnyway: true // Flag indicating order was saved despite Shiprocket failure
      } as any;
      
      // Order is still confirmed (Shiprocket failure doesn't affect order processing)
      newOrder.orderStatus = 'confirmed';
      newOrder.needsShiprocketSync = true;
      
      await saveOrderToDatabase(newOrder);
      
      // Send critical system error alert to admin (as required)
      try {
        const { notifySystemError } = await import('@/lib/admin-notifications');
        await notifySystemError({
          message: shiprocketError.message,
          stack: shiprocketError.stack,
          orderId: newOrder.id,
          context: "Shiprocket integration during order placement - ayurvedicmantra.com"
        });
        
        console.log("🚨 [CRITICAL ADMIN ALERT] System error notification sent to Super Admin");
      } catch (criticalAlertError) {
        console.error("❌ CRITICAL: Could not send system error alert:", criticalAlertError);
      }
    }

    // STEP 3: Send order confirmation via email/SMS (non-blocking)
    try {
      console.log("📧 Sending order confirmation...");
      const result = await sendOrderConfirmation({
        orderId: newOrder.id,
        customerName: newOrder.userName,
        customerEmail: newOrder.userEmail,
        customerPhone: newOrder.userPhone,
        planName: newOrder.planName,
        price: newOrder.price,
        deliveryDays: newOrder.estimatedDelivery
      });
      
      if (result) {
        console.log("✅ Order confirmation sent successfully");
        newOrder.communicationSent = true;
        await saveOrderToDatabase(newOrder);
      }
    } catch (commError: any) {
      console.error("❌ Communication sending failed:", commError.message);
      // Don't fail the order if communication fails
    }

    // STEP 4: Prepare response
    const responseData: any = {
      orderId: newOrder.id,
      orderTime: newOrder.orderTime,
      estimatedDelivery: `${newOrder.estimatedDelivery} business days`,
      orderStatus: newOrder.orderStatus,
      shiprocketStatus: (newOrder.shiprocket as any)?.status || "pending"
    };

    // No tracking info since no AWB is generated (order creation only)
    responseData.trackingAvailable = "Order created in Shiprocket - AWB will be assigned manually";

    console.log("🎉 Order processing completed:", responseData);

    return NextResponse.json({
      success: true,
      message: shiprocketResult?.success ? 
        "Order placed successfully and created in Shiprocket!" : 
        "Order placed successfully! Shipping will be processed shortly.",
      data: responseData
    });

  } catch (error: any) {
    console.error("❌ Order placement error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to place order. Please try again.",
      error: error.message
    }, { status: 500 });
  }
}

// Get all orders (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    console.log("📊 Fetching all orders for admin dashboard");
    // Fetch from Supabase first
    const db = supabaseService || supabase;
    const { data, error } = db
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    const list = error ? [] : (data || []);
    
    // Calculate order statistics
    const totalOrders = list.length;
    const totalRevenue = list.reduce((sum: number, order: any) => sum + (order.price || 0), 0);
    const todayOrders = list.filter((order: any) => {
      const orderDate = new Date(order.created_at || order.orderTime);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    }).length;
    
    const completedOrders = list.filter((order: any) => 
      (order.status || order.orderStatus) === 'confirmed' || (order.status || order.orderStatus) === 'completed'
    ).length;
    
    const pendingOrders = list.filter((order: any) => 
      (order.status || order.orderStatus) === 'placed' || (order.status || order.orderStatus) === 'processing'
    ).length;

    // Enhanced order data for admin with Shiprocket links
    const enhancedOrders = list.map((order: any) => ({
      ...order,
      orderDate: new Date((order.orderTime || order.created_at)).toLocaleDateString(),
      orderTime12: new Date((order.orderTime || order.created_at)).toLocaleTimeString(),
      customerType: order.is_guest || order.isGuest ? 'Guest' : 'Registered',
      shiprocketStatus: order.shiprocket?.status || order.meta?.shiprocket?.status || 'not_sent',
      shiprocketOrderId: order.shiprocket?.orderId || null,
      shiprocketShipmentId: order.shiprocket?.shipmentId || null,
      shiprocketAwbCode: order.shiprocket?.awbCode || null,
      shiprocketCourier: order.shiprocket?.courierName || null,
      shiprocketDashboardLink: order.shiprocket?.orderId ? `https://app.shiprocket.in/orders/${order.shiprocket.orderId}` : null,
      shiprocketTrackingLink: order.shiprocket?.awbCode ? `https://shiprocket.in/tracking/${order.shiprocket.awbCode}` : null,
      communicationSent: order.communicationSent || false,
      formattedPrice: `₹${order.price?.toLocaleString() || 0}`,
      daysAgo: Math.floor((new Date().getTime() - new Date((order.orderTime || order.created_at)).getTime()) / (1000 * 60 * 60 * 24))
    }));

    console.log(`📈 Order statistics: ${totalOrders} total, ₹${totalRevenue} revenue, ${todayOrders} today`);
    
    return NextResponse.json({
      success: true,
      data: enhancedOrders,
      stats: {
        totalOrders,
        totalRevenue,
        todayOrders,
        completedOrders,
        pendingOrders,
        shiprocketIntegrated: enhancedOrders.filter((o: any) => o.shiprocketStatus !== 'not_sent').length
      }
    });

  } catch (error: any) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    }, { status: 500 });
  }
}