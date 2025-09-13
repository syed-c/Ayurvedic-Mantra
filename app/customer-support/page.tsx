"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CustomerSupportPage() {
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
                {settings?.pages?.customerSupport?.title || "Customer Support"}
              </h1>
              <p className="text-xl text-sage-600">
                {settings?.pages?.customerSupport?.subtitle || "We're here to help you with any questions or concerns"}
              </p>
            </div>

            {/* Contact Methods */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              
              {/* WhatsApp Support */}
              <Card className="card-ayurveda text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-sage-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-sage-700 mb-2">WhatsApp Support</h3>
                  <p className="text-sage-600 text-sm mb-4">Get instant help via WhatsApp</p>
                  <Button 
                    asChild
                    className="btn-ayurveda w-full"
                  >
                    <a 
                      href={`https://wa.me/${(settings?.site?.contactPhone || "+919897990779").replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat Now
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Email Support */}
              <Card className="card-ayurveda text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-terracotta-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-sage-700 mb-2">Email Support</h3>
                  <p className="text-sage-600 text-sm mb-4">Send us detailed queries</p>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-sage-300 text-sage-700 hover:bg-sage-50 w-full"
                  >
                    <a 
                      href={`mailto:${settings?.site?.contactEmail || "orders@ayurvedicmantra.com"}`}
                    >
                      Send Email
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Phone Support */}
              <Card className="card-ayurveda text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-turmeric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-turmeric-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-sage-700 mb-2">Phone Support</h3>
                  <p className="text-sage-600 text-sm mb-4">Speak directly with our team</p>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50 w-full"
                  >
                    <a href={`tel:${settings?.site?.contactPhone || "+919897990779"}`}>
                      Call Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Support Hours */}
            <Card className="card-ayurveda mb-8">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">Customer Service</h4>
                    <p className="text-sage-600">Monday to Saturday: 9:00 AM - 7:00 PM IST</p>
                    <p className="text-sage-600">Sunday: 10:00 AM - 6:00 PM IST</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">WhatsApp Support</h4>
                    <p className="text-sage-600">Available 24/7</p>
                    <p className="text-sage-600 text-sm">We respond within 30 minutes during business hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">How can I track my order?</h4>
                    <p className="text-sage-600">You'll receive tracking information via SMS and email once your order is shipped. You can also check your order status in your dashboard.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">What if I have issues with my order?</h4>
                    <p className="text-sage-600">Contact our customer support team immediately. We offer a 30-day money-back guarantee for all our products.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sage-700 mb-2">How long does delivery take?</h4>
                    <p className="text-sage-600">We typically deliver within 3-5 business days across India. Metro cities usually receive orders within 2-3 days.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}