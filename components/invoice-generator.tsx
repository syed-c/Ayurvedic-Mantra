"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  planName: string;
  amount: number;
  orderDate: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pincode: string;
}

interface InvoiceGeneratorProps {
  order: Order;
}

export function InvoiceGenerator({ order }: InvoiceGeneratorProps) {
  
  const generateInvoice = () => {
    console.log("Generating invoice for order:", order.orderId);
    
    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice - ${order.orderId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1f3b20; padding-bottom: 20px; }
        .company-name { color: #1f3b20; font-size: 24px; font-weight: bold; }
        .invoice-title { font-size: 20px; margin: 10px 0; }
        .invoice-info { display: flex; justify-content: space-between; margin: 20px 0; }
        .customer-info, .order-info { flex: 1; margin: 0 10px; }
        .info-title { font-weight: bold; color: #1f3b20; margin-bottom: 10px; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #1f3b20; color: white; }
        .total-row { background-color: #f9f9f9; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">🌿 AYURVEDIC MANTRA</div>
        <div>Natural Weight Loss Solutions</div>
        <div class="invoice-title">INVOICE</div>
    </div>
    
    <div class="invoice-info">
        <div class="customer-info">
            <div class="info-title">Bill To:</div>
            <div>${order.customerName}</div>
            <div>${order.customerEmail}</div>
            <div>${order.customerPhone}</div>
            <div>${order.deliveryAddress}</div>
            <div>${order.city}, ${order.state} - ${order.pincode}</div>
        </div>
        
        <div class="order-info">
            <div class="info-title">Invoice Details:</div>
            <div><strong>Invoice #:</strong> INV-${order.orderId}</div>
            <div><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</div>
            <div><strong>Order ID:</strong> ${order.orderId}</div>
            <div><strong>Payment Status:</strong> Paid</div>
            <div><strong>Payment Method:</strong> Online</div>
        </div>
    </div>
    
    <table class="table">
        <thead>
            <tr>
                <th>Product Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>SlimX Mantra - ${order.planName}</strong><br>
                    Premium Ayurvedic Weight Loss Formula<br>
                    100% Natural & Safe
                </td>
                <td>1</td>
                <td>₹${order.amount}</td>
                <td>₹${order.amount}</td>
            </tr>
            <tr>
                <td colspan="3"><strong>Shipping & Handling</strong></td>
                <td>FREE</td>
            </tr>
            <tr class="total-row">
                <td colspan="3"><strong>Total Amount</strong></td>
                <td><strong>₹${order.amount}</strong></td>
            </tr>
        </tbody>
    </table>
    
    <div class="footer">
        <div><strong>Thank you for choosing Ayurvedic Mantra!</strong></div>
        <div>For support, contact: orders@ayurvedicmantra.com | +919897990779</div>
        <div>www.ayurvedicmantra.com</div>
        <div style="margin-top: 20px;">
            <em>This is a computer-generated invoice and does not require a physical signature.</em>
        </div>
    </div>
</body>
</html>
    `;

    // Create a new window with the invoice
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      
      // Auto-trigger print dialog
      printWindow.onload = () => {
        printWindow.print();
      };
    }

    // Also create downloadable version
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.orderId}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button 
      onClick={generateInvoice}
      variant="outline"
      className="border-sage-300 text-sage-700 hover:bg-sage-50"
    >
      <Download className="w-4 h-4 mr-2" />
      Download Invoice
    </Button>
  );
}