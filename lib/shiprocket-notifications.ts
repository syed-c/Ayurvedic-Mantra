// Shiprocket notification system for Super Admin alerts
// Domain: ayurvedicmantra.com

interface NotificationData {
  type: 'success' | 'failure' | 'warning' | 'critical';
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  shiprocketOrderId?: string;
  shipmentId?: string;
  awbCode?: string;
  error?: string;
  message: string;
  timestamp: string;
  domain: string;
}

export class ShiprocketNotificationService {
  private static readonly ADMIN_EMAIL = "orders@ayurvedicmantra.com";
  private static readonly DOMAIN = "ayurvedicmantra.com";

  // Log notification for Super Admin monitoring
  static logNotification(data: NotificationData) {
    const prefix = this.getLogPrefix(data.type);
    
    console.log(`${prefix} [ADMIN NOTIFICATION] ${data.message}`);
    console.log(`   • Domain: ${data.domain}`);
    console.log(`   • Timestamp: ${data.timestamp}`);
    
    if (data.orderId) console.log(`   • Order ID: ${data.orderId}`);
    if (data.customerName) console.log(`   • Customer: ${data.customerName} (${data.customerPhone})`);
    if (data.shiprocketOrderId) console.log(`   • Shiprocket Order: ${data.shiprocketOrderId}`);
    if (data.shipmentId) console.log(`   • Shipment ID: ${data.shipmentId}`);
    if (data.awbCode) console.log(`   • AWB Code: ${data.awbCode}`);
    if (data.error) console.log(`   • Error: ${data.error}`);
    
    // Add dashboard link if available
    if (data.shiprocketOrderId) {
      console.log(`   • Dashboard: https://app.shiprocket.in/orders/${data.shiprocketOrderId}`);
    }
  }

  // Notify successful order integration
  static notifyOrderSuccess(orderData: {
    orderId: string;
    customerName: string;
    customerPhone: string;
    shiprocketOrderId: string;
    shipmentId: string;
    awbCode?: string;
    courierName?: string;
  }) {
    this.logNotification({
      type: 'success',
      orderId: orderData.orderId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      shiprocketOrderId: orderData.shiprocketOrderId,
      shipmentId: orderData.shipmentId,
      awbCode: orderData.awbCode,
      message: `Order successfully integrated with Shiprocket`,
      timestamp: new Date().toISOString(),
      domain: this.DOMAIN
    });
    
    // Additional success details
    if (orderData.courierName) {
      console.log(`   • Courier: ${orderData.courierName}`);
    }
    console.log(`   • Status: Order created and ready for pickup`);
  }

  // Notify order integration failure
  static notifyOrderFailure(orderData: {
    orderId: string;
    customerName: string;
    customerPhone: string;
    error: string;
    reason?: string;
  }) {
    this.logNotification({
      type: 'failure',
      orderId: orderData.orderId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      error: orderData.error,
      message: `Order integration FAILED - requires immediate attention`,
      timestamp: new Date().toISOString(),
      domain: this.DOMAIN
    });
    
    if (orderData.reason) {
      console.log(`   • Failure Reason: ${orderData.reason}`);
    }
    console.log(`   • Action Required: Check Shiprocket credentials and configuration`);
  }

  // Notify system errors
  static notifySystemError(error: {
    message: string;
    stack?: string;
    orderId?: string;
    context?: string;
  }) {
    this.logNotification({
      type: 'critical',
      orderId: error.orderId,
      error: error.message,
      message: `Shiprocket system ERROR - critical issue detected`,
      timestamp: new Date().toISOString(),
      domain: this.DOMAIN
    });
    
    if (error.context) {
      console.log(`   • Context: ${error.context}`);
    }
    if (error.stack) {
      console.log(`   • Stack Trace: ${error.stack.substring(0, 200)}...`);
    }
    console.log(`   • Immediate Action Required: System needs attention`);
  }

  // Notify token refresh events
  static notifyTokenRefresh(data: {
    success: boolean;
    previousExpiry?: string;
    newExpiry?: string;
    error?: string;
  }) {
    const type = data.success ? 'success' : 'critical';
    const message = data.success 
      ? 'Shiprocket token auto-refresh successful'
      : 'Shiprocket token auto-refresh FAILED';
    
    this.logNotification({
      type,
      message,
      error: data.error,
      timestamp: new Date().toISOString(),
      domain: this.DOMAIN
    });
    
    if (data.success) {
      if (data.previousExpiry) console.log(`   • Previous Expiry: ${data.previousExpiry}`);
      if (data.newExpiry) console.log(`   • New Expiry: ${data.newExpiry}`);
      console.log(`   • Next Auto-Refresh: In 10 days`);
    } else {
      console.log(`   • Action Required: Manual token refresh needed immediately`);
    }
  }

  // Notify configuration changes
  static notifyConfigChange(data: {
    type: 'enabled' | 'disabled' | 'updated';
    details?: string;
    adminUser?: string;
  }) {
    this.logNotification({
      type: 'warning',
      message: `Shiprocket configuration ${data.type.toUpperCase()}`,
      timestamp: new Date().toISOString(),
      domain: this.DOMAIN
    });
    
    if (data.details) console.log(`   • Details: ${data.details}`);
    if (data.adminUser) console.log(`   • Changed By: ${data.adminUser}`);
    console.log(`   • Integration Status: ${data.type === 'enabled' ? 'ACTIVE' : data.type === 'disabled' ? 'INACTIVE' : 'MODIFIED'}`);
  }

  // Get log prefix based on notification type
  private static getLogPrefix(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'failure': return '❌';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '📊';
    }
  }

  // Generate admin summary for dashboard
  static generateAdminSummary(orders: any[]): {
    totalIntegrated: number;
    successfulToday: number;
    failedToday: number;
    pendingAwb: number;
    recentFailures: any[];
  } {
    const today = new Date().toDateString();
    
    const totalIntegrated = orders.filter(order => order.shiprocket).length;
    const successfulToday = orders.filter(order => 
      order.shiprocket?.orderId && 
      new Date(order.orderTime).toDateString() === today
    ).length;
    const failedToday = orders.filter(order => 
      (order.shiprocket?.status === 'failed' || order.shiprocket?.status === 'error') &&
      new Date(order.orderTime).toDateString() === today
    ).length;
    const pendingAwb = orders.filter(order => 
      order.shiprocket?.orderId && !order.shiprocket?.awbCode
    ).length;
    
    const recentFailures = orders
      .filter(order => order.shiprocket?.status === 'failed' || order.shiprocket?.status === 'error')
      .slice(0, 5)
      .map(order => ({
        orderId: order.id,
        customerName: order.userName,
        error: order.shiprocket?.error || 'Unknown error',
        timestamp: order.orderTime
      }));
    
    return {
      totalIntegrated,
      successfulToday,
      failedToday,
      pendingAwb,
      recentFailures
    };
  }
}

export default ShiprocketNotificationService;