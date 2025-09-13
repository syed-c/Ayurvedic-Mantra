import { sendEmail, sendSMS } from './communications';

interface AdminNotification {
  subject: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

interface AdminAlert extends AdminNotification {
  priority: 'high' | 'critical';
}

interface ShiprocketNotification {
  orderId: string;
  customerName: string;
  customerPhone: string;
  shiprocketOrderId?: string;
  shipmentId?: string;
  awbCode?: string;
  courierName?: string;
  error?: string;
  reason?: string;
}

interface SystemError {
  message: string;
  stack?: string;
  orderId?: string;
  context?: string;
}

export class AdminNotificationService {
  private static readonly ADMIN_EMAIL = "orders@ayurvedicmantra.com";
  private static readonly ADMIN_PHONE = "+919897990779";
  private static readonly DOMAIN = "ayurvedicmantra.com";

  // Send general admin notification
  static async sendNotification(notification: AdminNotification): Promise<boolean> {
    try {
      console.log(`📧 [ADMIN NOTIFICATION] Sending ${notification.type || 'info'} notification to admin`);
      
      const emailSubject = `[${this.DOMAIN.toUpperCase()}] ${notification.subject}`;
      const emailBody = `
${notification.message}

---
Domain: ${this.DOMAIN}
Timestamp: ${new Date().toLocaleString()}
Priority: ${notification.priority || 'normal'}
Type: ${notification.type || 'info'}

This is an automated notification from ${this.DOMAIN}.
`;

      // Send email notification
      const emailResult = await sendEmail(this.ADMIN_EMAIL, emailSubject, emailBody);

      // For high priority notifications, also send SMS
      if (notification.priority === 'high' || notification.priority === 'critical') {
        const smsText = `[${this.DOMAIN}] ${notification.subject}: ${notification.message.substring(0, 100)}...`;
        
        try {
          await sendSMS(this.ADMIN_PHONE, smsText);
          console.log("✅ [ADMIN NOTIFICATION] High priority SMS sent to admin");
        } catch (smsError) {
          console.warn("⚠️ [ADMIN NOTIFICATION] SMS failed, email sent:", smsError);
        }
      }

      return emailResult;
    } catch (error) {
      console.error("❌ [ADMIN NOTIFICATION] Failed to send notification:", error);
      return false;
    }
  }

  // Send admin alert (high priority)
  static async sendAlert(alert: AdminAlert): Promise<boolean> {
    return this.sendNotification({
      ...alert,
      priority: alert.priority
    });
  }

  // Shiprocket order success notification
  static async notifyShiprocketSuccess(data: ShiprocketNotification): Promise<boolean> {
    return this.sendNotification({
      subject: "✅ Shiprocket Order Sync Successful",
      message: `Order successfully synced to Shiprocket:

Order Details:
- Order ID: ${data.orderId}
- Customer: ${data.customerName}
- Phone: ${data.customerPhone}

Shiprocket Details:
- Shiprocket Order ID: ${data.shiprocketOrderId}
- Shipment ID: ${data.shipmentId}
- AWB Code: ${data.awbCode || 'Pending'}
- Courier: ${data.courierName || 'Auto-assigned'}

The order is now in Shiprocket dashboard and will be processed for shipping.`,
      type: 'success',
      priority: 'normal'
    });
  }

  // Shiprocket order failure notification  
  static async notifyShiprocketFailure(data: ShiprocketNotification): Promise<boolean> {
    return this.sendNotification({
      subject: "🚨 Shiprocket Order Sync Failed",
      message: `ATTENTION: Order failed to sync with Shiprocket:

Order Details:
- Order ID: ${data.orderId}
- Customer: ${data.customerName}
- Phone: ${data.customerPhone}

Error Details:
- Error: ${data.error}
- Reason: ${data.reason}

ACTION REQUIRED: Please manually process this order in Shiprocket dashboard or check integration settings.`,
      type: 'error',
      priority: 'high'
    });
  }

  // System error notification
  static async notifySystemError(error: SystemError): Promise<boolean> {
    return this.sendNotification({
      subject: "🚨 System Error - ayurvedicmantra.com",
      message: `CRITICAL SYSTEM ERROR:

Error: ${error.message}
Context: ${error.context || 'General system error'}
Order ID: ${error.orderId || 'N/A'}

Technical Details:
${error.stack || 'No stack trace available'}

ACTION REQUIRED: Please investigate this error immediately to ensure system stability.`,
      type: 'error',
      priority: 'critical'
    });
  }

  // Daily summary notification
  static async sendDailySummary(stats: {
    totalOrders: number;
    totalRevenue: number;
    shiprocketSuccessful: number;
    shiprocketFailed: number;
    newUsers: number;
  }): Promise<boolean> {
    return this.sendNotification({
      subject: "📊 Daily Summary - ayurvedicmantra.com",
      message: `Daily summary for ${new Date().toLocaleDateString()}:

Sales Performance:
- Total Orders: ${stats.totalOrders}
- Total Revenue: ₹${stats.totalRevenue.toLocaleString()}
- New Users: ${stats.newUsers}

Shiprocket Integration:
- Successful Syncs: ${stats.shiprocketSuccessful}
- Failed Syncs: ${stats.shiprocketFailed}
- Success Rate: ${stats.totalOrders > 0 ? ((stats.shiprocketSuccessful / stats.totalOrders) * 100).toFixed(1) : 0}%

Domain: ${this.DOMAIN}
Business continues to operate smoothly.`,
      type: 'info',
      priority: 'normal'
    });
  }
}

// Export convenience functions
export const sendAdminNotification = AdminNotificationService.sendNotification.bind(AdminNotificationService);
export const sendAdminAlert = AdminNotificationService.sendAlert.bind(AdminNotificationService);
export const notifyShiprocketSuccess = AdminNotificationService.notifyShiprocketSuccess.bind(AdminNotificationService);
export const notifyShiprocketFailure = AdminNotificationService.notifyShiprocketFailure.bind(AdminNotificationService);
export const notifySystemError = AdminNotificationService.notifySystemError.bind(AdminNotificationService);
export const sendDailySummary = AdminNotificationService.sendDailySummary.bind(AdminNotificationService);