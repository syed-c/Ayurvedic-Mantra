"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, Shield, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ReturnPolicyPage() {
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
                {settings?.pages?.returnPolicy?.title || "Return & Refund Policy"}
              </h1>
              <p className="text-xl text-sage-600">
                {settings?.pages?.returnPolicy?.subtitle || "30-day money-back guarantee for your satisfaction"}
              </p>
            </div>

            {/* Policy Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="card-ayurveda text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-sage-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-sage-700 mb-2">30-Day Window</h3>
                  <p className="text-sage-600 text-sm">Return products within 30 days of delivery</p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-8 h-8 text-terracotta-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-sage-700 mb-2">Easy Returns</h3>
                  <p className="text-sage-600 text-sm">Simple return process with pickup service</p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-turmeric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-turmeric-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-sage-700 mb-2">Money Back</h3>
                  <p className="text-sage-600 text-sm">Full refund if you're not satisfied</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Policy */}
            <div className="space-y-8">
              
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Return Eligibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Eligible for Return</h4>
                    <ul className="list-disc list-inside text-sage-600 space-y-1">
                      <li>Products returned within 30 days of delivery</li>
                      <li>Items in original, unopened packaging</li>
                      <li>Products with intact seals and labels</li>
                      <li>Items not used or consumed</li>
                      <li>Return initiated due to product defects or damage</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Not Eligible for Return</h4>
                    <ul className="list-disc list-inside text-sage-600 space-y-1">
                      <li>Products opened or used</li>
                      <li>Items returned after 30-day window</li>
                      <li>Products with broken seals or damaged packaging</li>
                      <li>Items without original packaging</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Return Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-sage-700 mb-1">Contact Support</h4>
                        <p className="text-sage-600 text-sm">
                          Contact our customer support team via WhatsApp, email, or phone to initiate a return.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-sage-700 mb-1">Return Authorization</h4>
                        <p className="text-sage-600 text-sm">
                          We'll provide you with a return authorization number and pickup details.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-sage-700 mb-1">Package the Item</h4>
                        <p className="text-sage-600 text-sm">
                          Pack the item in its original packaging with all accessories and labels intact.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700 flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-sage-700 mb-1">Pickup & Inspection</h4>
                        <p className="text-sage-600 text-sm">
                          Our courier partner will pick up the item. We'll inspect it upon receipt.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700 flex-shrink-0">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold text-sage-700 mb-1">Refund Processing</h4>
                        <p className="text-sage-600 text-sm">
                          Once approved, refund will be processed within 5-7 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Refund Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Refund Methods</h4>
                    <p className="text-sage-600">
                      Refunds will be processed back to the original payment method:
                    </p>
                    <ul className="list-disc list-inside text-sage-600 mt-2 space-y-1">
                      <li><strong>Credit/Debit Cards:</strong> 5-7 business days</li>
                      <li><strong>Net Banking:</strong> 5-7 business days</li>
                      <li><strong>UPI/Wallets:</strong> 3-5 business days</li>
                      <li><strong>Cash on Delivery:</strong> Bank transfer within 7-10 days</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Refund Amount</h4>
                    <p className="text-sage-600">
                      You'll receive a full refund of the product price. Shipping costs are non-refundable 
                      unless the return is due to our error or product defect.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Satisfaction Guarantee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sage-600 mb-4">
                    We stand behind the quality of our Ayurvedic products. If you're not completely 
                    satisfied with your purchase, we offer a 30-day money-back guarantee.
                  </p>
                  
                  <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
                    <h4 className="font-semibold text-sage-700 mb-2">💡 Important Notes</h4>
                    <ul className="text-sage-600 text-sm space-y-1">
                      <li>• For hygienic reasons, opened products cannot be returned</li>
                      <li>• Return shipping is free for defective or damaged products</li>
                      <li>• Customer-initiated returns may incur return shipping charges</li>
                      <li>• Refund processing time may vary based on bank/payment provider</li>
                    </ul>
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