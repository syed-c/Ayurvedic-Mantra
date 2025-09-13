"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Lock, Users, Database, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
                {settings?.pages?.privacyPolicy?.title || "Privacy Policy"}
              </h1>
              <p className="text-xl text-sage-600">
                {settings?.pages?.privacyPolicy?.subtitle || "Your privacy is important to us. Learn how we protect your data."}
              </p>
              <p className="text-sm text-sage-500 mt-2">
                Last Updated: June 2024
              </p>
            </div>

            {/* Privacy Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="card-ayurveda text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-sage-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-sage-700 mb-2">Data Protection</h3>
                  <p className="text-sage-600 text-sm">We use industry-standard security measures</p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-terracotta-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-sage-700 mb-2">Transparency</h3>
                  <p className="text-sage-600 text-sm">Clear information about data collection</p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-turmeric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-turmeric-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-sage-700 mb-2">Your Control</h3>
                  <p className="text-sage-600 text-sm">You control your personal information</p>
                </CardContent>
              </Card>
            </div>

            {/* Privacy Policy Content */}
            <div className="space-y-8">
              
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    1. Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Personal Information</h4>
                    <p className="text-sage-600 mb-2">We collect information you provide directly to us, including:</p>
                    <ul className="list-disc list-inside text-sage-600 space-y-1">
                      <li>Name and contact information (email, phone number)</li>
                      <li>Billing and shipping addresses</li>
                      <li>Payment information (processed securely by our payment partners)</li>
                      <li>Order history and preferences</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Automatically Collected Information</h4>
                    <p className="text-sage-600 mb-2">When you visit our website, we may automatically collect:</p>
                    <ul className="list-disc list-inside text-sage-600 space-y-1">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Pages visited and time spent on our site</li>
                      <li>Referring website information</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">2. How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600 mb-2">We use the information we collect to:</p>
                  <ul className="list-disc list-inside text-sage-600 space-y-1">
                    <li>Process and fulfill your orders</li>
                    <li>Communicate with you about your orders and our services</li>
                    <li>Provide customer support</li>
                    <li>Send you promotional emails (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Prevent fraud and ensure security</li>
                    <li>Comply with legal obligations</li>
                    <li>Analyze website usage and trends</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    3. Information Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">We Do Not Sell Your Information</h4>
                    <p className="text-sage-600">
                      We do not sell, rent, or trade your personal information to third parties.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Limited Sharing</h4>
                    <p className="text-sage-600 mb-2">We may share your information only in the following circumstances:</p>
                    <ul className="list-disc list-inside text-sage-600 space-y-1">
                      <li><strong>Service Providers:</strong> Payment processors, shipping companies, and IT service providers</li>
                      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                      <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                      <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">4. Cookies and Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Types of Cookies We Use</h4>
                    <ul className="list-disc list-inside text-sage-600 space-y-1">
                      <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                      <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                      <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                      <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Managing Cookies</h4>
                    <p className="text-sage-600">
                      You can control cookies through your browser settings. Note that disabling 
                      certain cookies may affect website functionality.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">5. Data Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    We implement appropriate technical and organizational security measures to protect 
                    your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Security Measures Include</h4>
                    <ul className="list-disc list-inside text-sage-600 space-y-1">
                      <li>SSL encryption for data transmission</li>
                      <li>Secure payment processing through trusted partners</li>
                      <li>Regular security audits and updates</li>
                      <li>Access controls and employee training</li>
                      <li>Data backup and recovery procedures</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">6. Your Rights and Choices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">You Have the Right to</h4>
                    <ul className="list-disc list-inside text-sage-600 space-y-1">
                      <li>Access your personal information</li>
                      <li>Correct inaccurate information</li>
                      <li>Request deletion of your information</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Withdraw consent (where applicable)</li>
                      <li>Data portability (where applicable)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">How to Exercise Your Rights</h4>
                    <p className="text-sage-600">
                      To exercise any of these rights, please contact us using the information 
                      provided in the "Contact Us" section below.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">7. Data Retention</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    We retain your personal information for as long as necessary to fulfill the 
                    purposes outlined in this policy, unless a longer retention period is required 
                    or permitted by law.
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Retention Periods</h4>
                    <ul className="list-disc list-inside text-sage-600 space-y-1">
                      <li><strong>Account Information:</strong> Until account deletion or 3 years of inactivity</li>
                      <li><strong>Order Information:</strong> 7 years for tax and legal purposes</li>
                      <li><strong>Marketing Data:</strong> Until you unsubscribe</li>
                      <li><strong>Website Analytics:</strong> 2 years</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">8. Children's Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    Our services are not intended for individuals under the age of 18. We do not 
                    knowingly collect personal information from children under 18. If we become 
                    aware that we have collected such information, we will take steps to delete it promptly.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    9. Changes to This Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    We may update this Privacy Policy from time to time. We will notify you of any 
                    material changes by posting the new policy on this page and updating the 
                    "Last Updated" date.
                  </p>
                  <p className="text-sage-600">
                    Your continued use of our services after any changes constitutes acceptance 
                    of the updated policy.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">10. Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sage-600">
                    If you have any questions about this Privacy Policy or our data practices, 
                    please contact us:
                  </p>
                  <div className="space-y-2 text-sage-600">
                    <p><strong>Email:</strong> {settings?.site?.contactEmail || "orders@ayurvedicmantra.com"}</p>
                    <p><strong>Phone:</strong> {settings?.site?.contactPhone || "+919897990779"}</p>
                    <p><strong>Address:</strong> 123 Wellness Street, Ayurveda Complex, Mumbai, India 400001</p>
                  </div>
                  
                  <div className="bg-sage-50 p-4 rounded-lg border border-sage-200 mt-6">
                    <h4 className="font-semibold text-sage-700 mb-2">Data Protection Officer</h4>
                    <p className="text-sage-600 text-sm">
                      For data protection inquiries, you can also contact our Data Protection Officer 
                      at: dpo@ayurvedicmantra.com
                    </p>
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