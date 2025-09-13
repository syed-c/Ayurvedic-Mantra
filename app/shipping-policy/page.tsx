"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Truck, Clock, MapPin, Shield } from "lucide-react";
import Link from "next/link";

export default function ShippingPolicyPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/public/settings');
        const result = await response.json();
        if (result.success) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50 pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-sage-200">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-2 text-sage-600 hover:text-sage-700">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold font-poppins text-sage-700 mb-4">
                {settings?.pages?.shippingPolicy?.title || "Shipping Policy"}
              </h1>
              <p className="text-xl text-sage-600">
                {settings?.pages?.shippingPolicy?.subtitle || "Fast, secure, and reliable delivery across India"}
              </p>
            </div>

            {/* Shipping Overview */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Free Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sage-600">
                    We offer free shipping on all orders across India. No minimum order value required.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Delivery Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sage-600">
                    Standard delivery within 3-5 business days. Metro cities: 2-3 days.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Policy */}
            <div className="space-y-8">
              
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Processing Time</h4>
                    <p className="text-sage-600">
                      Orders are processed within 1-2 business days. Orders placed on weekends or holidays 
                      will be processed on the next business day.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Shipping Methods</h4>
                    <p className="text-sage-600">
                      We use trusted courier partners including Shiprocket, Delhivery, and Blue Dart to 
                      ensure safe and timely delivery of your products.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Tracking Information</h4>
                    <p className="text-sage-600">
                      Once your order is shipped, you'll receive tracking details via SMS and email. 
                      You can track your package using the provided tracking number.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sage-700 mb-2">Pan-India Delivery</h4>
                      <p className="text-sage-600">
                        We deliver to all major cities and towns across India. This includes:
                      </p>
                      <ul className="list-disc list-inside text-sage-600 mt-2 space-y-1">
                        <li>All major metro cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad)</li>
                        <li>Tier 2 and Tier 3 cities</li>
                        <li>Rural areas (may take additional 1-2 days)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sage-700 mb-2">Delivery Time by Location</h4>
                      <div className="space-y-2 text-sage-600">
                        <p><strong>Metro Cities:</strong> 2-3 business days</p>
                        <p><strong>Major Cities:</strong> 3-4 business days</p>
                        <p><strong>Other Locations:</strong> 4-5 business days</p>
                        <p><strong>Remote Areas:</strong> 5-7 business days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Packaging & Safety
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sage-700 mb-2">Secure Packaging</h4>
                      <p className="text-sage-600">
                        All products are packaged securely to prevent damage during transit. We use 
                        bubble wrap and sturdy boxes to ensure your products reach you safely.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sage-700 mb-2">Temperature Control</h4>
                      <p className="text-sage-600">
                        Our Ayurvedic products are carefully packaged to maintain their quality and 
                        effectiveness during shipping.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Important Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sage-600">
                    <p>• Delivery times are estimates and may vary due to unforeseen circumstances</p>
                    <p>• We require a valid phone number for delivery coordination</p>
                    <p>• Please ensure someone is available to receive the package</p>
                    <p>• If you're not available, the courier will attempt delivery 2-3 times</p>
                    <p>• For any shipping issues, contact our customer support immediately</p>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}