"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, AlertTriangle, Shield } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditionsPage() {
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
                {settings?.pages?.termsConditions?.title || "Terms & Conditions"}
              </h1>
              <p className="text-xl text-sage-600">
                {settings?.pages?.termsConditions?.subtitle || "Please read these terms carefully before using our services"}
              </p>
              <p className="text-sm text-sage-500 mt-2">
                Last Updated: June 2024
              </p>
            </div>

            {/* Terms Content */}
            <div className="space-y-8">
              
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    1. Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    By accessing and using the Ayurvedic Mantra website and purchasing our products, 
                    you agree to be bound by these Terms and Conditions. If you do not agree to these 
                    terms, please do not use our website or purchase our products.
                  </p>
                  <p className="text-sage-600">
                    These terms apply to all visitors, users, and customers who access or use our service.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">2. Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Ayurvedic Products</h4>
                    <p className="text-sage-600">
                      Our products are formulated using traditional Ayurvedic principles and natural ingredients. 
                      All product information, including ingredients, benefits, and usage instructions, 
                      is provided for informational purposes.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Not Medical Advice</h4>
                    <p className="text-sage-600">
                      The information provided on our website is not intended as medical advice. 
                      Please consult with a healthcare professional before starting any new supplement regimen.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">3. Orders and Payments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Order Acceptance</h4>
                    <p className="text-sage-600">
                      All orders are subject to acceptance and availability. We reserve the right to 
                      refuse or cancel any order for any reason, including but not limited to product 
                      availability, errors in product or pricing information, or suspected fraudulent activity.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Pricing</h4>
                    <p className="text-sage-600">
                      All prices are listed in Indian Rupees (INR) and include applicable taxes. 
                      We reserve the right to change prices at any time without prior notice.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Payment Methods</h4>
                    <p className="text-sage-600">
                      We accept various payment methods including credit cards, debit cards, 
                      net banking, UPI, and cash on delivery (where available).
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">4. Shipping and Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    We strive to deliver products within the estimated timeframes, but delivery 
                    dates are approximate and not guaranteed. Delays may occur due to unforeseen 
                    circumstances beyond our control.
                  </p>
                  <p className="text-sage-600">
                    Risk of loss and title for products pass to you upon delivery to the 
                    courier service.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">5. Returns and Refunds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    Our return and refund policy is detailed in our Return Policy page. 
                    By making a purchase, you agree to the terms outlined in that policy.
                  </p>
                  <p className="text-sage-600">
                    Returns must be initiated within 30 days of delivery and meet our 
                    eligibility criteria.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    6. Disclaimers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Health Claims</h4>
                    <p className="text-sage-600">
                      Results may vary from person to person. Our products are not intended to 
                      diagnose, treat, cure, or prevent any disease. Individual results may differ 
                      based on various factors including lifestyle, diet, and metabolism.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Website Content</h4>
                    <p className="text-sage-600">
                      While we strive to keep information accurate and up-to-date, we make no 
                      representations or warranties of any kind about the completeness, accuracy, 
                      or reliability of any information on this website.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">7. User Conduct</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">By using our website, you agree to:</p>
                  <ul className="list-disc list-inside text-sage-600 space-y-1">
                    <li>Provide accurate and complete information</li>
                    <li>Not use the website for any unlawful purpose</li>
                    <li>Not interfere with the website's operation</li>
                    <li>Respect intellectual property rights</li>
                    <li>Not attempt to gain unauthorized access to any part of the website</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    8. Privacy and Data Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    Your privacy is important to us. Our Privacy Policy explains how we collect, 
                    use, and protect your personal information. By using our services, you consent 
                    to the collection and use of information as outlined in our Privacy Policy.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">9. Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    To the maximum extent permitted by law, Ayurvedic Mantra shall not be liable 
                    for any indirect, incidental, special, consequential, or punitive damages, 
                    including but not limited to loss of profits, data, or use.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">10. Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    We reserve the right to modify these Terms and Conditions at any time. 
                    Changes will be effective immediately upon posting on this website. 
                    Your continued use of our services after any changes constitutes acceptance 
                    of the new terms.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">11. Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="space-y-2 text-sage-600">
                    <p><strong>Email:</strong> {settings?.site?.contactEmail || "orders@ayurvedicmantra.com"}</p>
                    <p><strong>Phone:</strong> {settings?.site?.contactPhone || "+919897990779"}</p>
                    <p><strong>Address:</strong> 123 Wellness Street, Ayurveda Complex, Mumbai, India 400001</p>
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