"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Phone, 
  Mail, 
  Download,
  Star,
  Gift,
  Calendar,
  Share2,
  Leaf
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { InvoiceGenerator } from "@/components/invoice-generator";

export default function ThankYouPage() {
  console.log("Thank you page rendered");
  const [order, setOrder] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Get order data from localStorage or URL params
    const orderData = localStorage.getItem('lastOrder');
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = urlParams.get('order');
    
    if (orderData) {
      const parsedOrder = JSON.parse(orderData);
      setOrder(parsedOrder);
      console.log("Order confirmation loaded:", parsedOrder);
    } else if (orderIdFromUrl) {
      // If no localStorage data but order ID in URL, create basic order object
      const basicOrder = {
        orderId: orderIdFromUrl,
        plan: "SlimX Mantra Plan",
        amount: 1799,
        name: "Customer",
        email: "customer@email.com",
        orderTime: new Date().toISOString(),
        estimatedDelivery: "3 business days",
        trackingAvailable: "Will be available once shipped"
      };
      setOrder(basicOrder);
      console.log("Order confirmation from URL:", basicOrder);
    } else {
      console.log("No order data found, showing default message");
      // Set a default order for fallback
      const defaultOrder = {
        orderId: "SM" + Math.floor(Math.random() * 10000),
        plan: "SlimX Mantra - 3 Month Supply",
        amount: 1799,
        name: "Valued Customer",
        email: "customer@email.com",
        orderTime: new Date().toISOString(),
        estimatedDelivery: "3 business days",
        trackingAvailable: "Will be available once shipped"
      };
      setOrder(defaultOrder);
    }

    // Fetch settings for dynamic content
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/public/settings');
        const result = await response.json();
        if (result.success) {
          setSettings(result.data);
          console.log("Thank you page settings loaded:", result.data);
        }
      } catch (error) {
        console.error("Error loading thank you page settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const shareSuccess = () => {
    console.log("Sharing success story");
    if (navigator.share) {
      navigator.share({
        title: 'Just ordered Ayurvedic Mantra!',
        text: 'Starting my natural weight loss journey with SlimX Mantra 🌿',
        url: window.location.origin
      });
    }
  };

  const downloadInvoice = () => {
    console.log("Downloading invoice for order:", order?.orderId);
    if (!order) return;
    
    const invoiceContent = `
      AYURVEDIC MANTRA - INVOICE
      
      Invoice #: INV-${order.orderId}
      Date: ${new Date(order.orderTime).toLocaleDateString()}
      
      Bill To:
      ${order.name}
      ${order.email}
      
      Order Details:
      Order ID: ${order.orderId}
      Product: ${order.plan}
      Amount: ₹${order.amount}
      Order Date: ${new Date(order.orderTime).toLocaleDateString()}
      Status: Confirmed
      
      Estimated Delivery: ${order.estimatedDelivery}
      
      Payment Method: Online Payment
      
      Thank you for choosing Ayurvedic Mantra!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.orderId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Prepare order data for invoice generator
  const orderForInvoice = order ? {
    orderId: order.orderId,
    customerName: order.name,
    customerEmail: order.email,
    customerPhone: order.phone || "+919897990779",
    customerAddress: order.address || "Customer Address",
    planName: order.plan,
    amount: order.amount,
    orderDate: order.orderTime,
    deliveryAddress: order.address || "Customer Address",
    city: "Mumbai",
    state: "Maharashtra", 
    pincode: "400001"
  } : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-sage-300 border-t-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Loading order confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50">
      {/* Header */}
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-16"></div>
      
      {/* Order Confirmation Header */}
      <div className="bg-white border-b border-sage-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sage-800 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold font-poppins text-sage-700">Order Confirmed</h1>
            </div>

            <Button 
              onClick={() => window.location.href = "/"}
              variant="outline"
              className="border-sage-300 text-sage-700 hover:bg-sage-50"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-sage-600" />
            </div>
            <h1 className="text-3xl font-bold font-poppins text-sage-700 mb-4">
              {settings?.thankYou?.title || "Order Confirmed! 🎉"}
            </h1>
            <p className="text-sage-600 text-lg mb-4">
              {settings?.thankYou?.subtitle || "Thank you for choosing SlimX Mantra. Your wellness journey begins now!"}
            </p>
            <div className="bg-turmeric-50 border border-turmeric-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-turmeric-700">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Order confirmation email sent!</span>
              </div>
              <p className="text-sm text-turmeric-600 mt-1">
                Check your email for order details and tracking information.
              </p>
            </div>
            <Badge className="bg-sage-100 text-sage-700 px-6 py-2 text-lg">
              Order #{order.orderId}
            </Badge>
          </div>

          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Order Summary */}
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-sage-100 rounded-lg flex items-center justify-center text-2xl">
                    🏺
                  </div>
                  <div>
                    <h4 className="font-semibold text-sage-700">SlimX Mantra</h4>
                    <p className="text-sage-600">{order.plan}</p>
                    <p className="font-bold text-sage-700">₹{order.amount}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-sage-200 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-600">Customer:</span>
                    <span className="text-sage-700">{order.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-600">Email:</span>
                    <span className="text-sage-700">{order.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-600">Order Date:</span>
                    <span className="text-sage-700">{new Date(order.orderTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-600">Payment Status:</span>
                    <Badge className="bg-sage-100 text-sage-700">Confirmed</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-600">Estimated Delivery:</span>
                    <span className="text-sage-700">{order.estimatedDelivery}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  What&apos;s Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center text-sm font-bold text-sage-700 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sage-700">Email Confirmation</p>
                      <p className="text-sm text-sage-600">Order confirmation sent to your email</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center text-sm font-bold text-sage-700 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sage-700">Order Processing</p>
                      <p className="text-sm text-sage-600">We&apos;ll prepare your order within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center text-sm font-bold text-sage-700 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sage-700">Shipping Update</p>
                      <p className="text-sm text-sage-600">You&apos;ll receive tracking details via SMS & email</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center text-sm font-bold text-sage-700 mt-0.5">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-sage-700">Delivery</p>
                      <p className="text-sm text-sage-600">Free delivery to your doorstep in {order.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Button className="btn-ayurveda" asChild>
              <Link href="/dashboard">
                <Package className="w-4 h-4 mr-2" />
                View Orders
              </Link>
            </Button>

            {orderForInvoice ? (
              <InvoiceGenerator order={orderForInvoice} />
            ) : (
              <Button 
                variant="outline" 
                className="border-sage-300 text-sage-700 hover:bg-sage-50"
                onClick={downloadInvoice}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            )}

            <Button 
              variant="outline" 
              className="border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50"
              onClick={shareSuccess}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Success
            </Button>
          </div>

          {/* Support & Timeline */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Customer Support */}
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sage-600 text-sm">
                  Our customer support team is here to help you throughout your journey.
                </p>

                <div className="space-y-3">
                  <a 
                    href={`https://wa.me/${(settings?.thankYou?.supportPhone || settings?.site?.contactPhone || "+919897990779").replace(/[^0-9]/g, "")}`}
                    className="flex items-center gap-3 p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-sage-600" />
                    <div>
                      <p className="font-medium text-sage-700 text-sm">WhatsApp Support</p>
                      <p className="text-xs text-sage-600">{settings?.thankYou?.supportPhone || settings?.site?.contactPhone || "+919897990779"}</p>
                    </div>
                  </a>

                  <a 
                    href={`mailto:${settings?.thankYou?.supportEmail || settings?.site?.contactEmail || "orders@ayurvedicmantra.com"}`}
                    className="flex items-center gap-3 p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-sage-600" />
                    <div>
                      <p className="font-medium text-sage-700 text-sm">Email Support</p>
                      <p className="text-xs text-sage-600">{settings?.thankYou?.supportEmail || settings?.site?.contactEmail || "orders@ayurvedicmantra.com"}</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Timeline */}
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-400 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sage-700 text-sm">Order Confirmed</p>
                      <p className="text-xs text-sage-600">Today - {new Date(order.orderTime).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-200 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sage-600 text-sm">Processing</p>
                      <p className="text-xs text-sage-500">Within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-200 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sage-600 text-sm">Shipped</p>
                      <p className="text-xs text-sage-500">1-2 business days</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-sage-200 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sage-600 text-sm">Delivered</p>
                      <p className="text-xs text-sage-500">{order.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Special Offers */}
          <Card className="card-ayurveda bg-gradient-to-r from-turmeric-50 to-terracotta-50 border-turmeric-200">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-6 h-6 text-turmeric-600" />
                <h3 className="text-xl font-semibold font-poppins text-turmeric-800">
                  Share Your Success Story
                </h3>
              </div>
              
              <p className="text-turmeric-700 mb-6">
                After you see amazing results, share your video testimonial with us and get 
                <strong> 20% off</strong> on your next order plus a free consultation!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-turmeric-500 hover:bg-turmeric-600 text-white">
                  <Star className="w-4 h-4 mr-2" />
                  Submit Testimonial
                </Button>
                
                <Button variant="outline" className="border-turmeric-300 text-turmeric-700 hover:bg-turmeric-50">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Back to Store */}
          <div className="text-center mt-8">
            <Link href="/">
              <Button variant="outline" className="border-sage-300 text-sage-700 hover:bg-sage-50">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}