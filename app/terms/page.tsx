import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center">
            <Badge className="bg-sage-100 text-sage-700 mb-4">Legal Information</Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-poppins text-sage-700 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-sage-600">Last updated: June 17, 2024</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="card-ayurveda">
            <CardContent className="p-8 space-y-8">
              
              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">1. Acceptance of Terms</h2>
                <p className="text-sage-600 leading-relaxed">
                  By accessing and using the Ayurvedic Mantra website and purchasing our products, 
                  you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">2. Product Information</h2>
                <div className="space-y-3 text-sage-600 leading-relaxed">
                  <p>
                    SlimX Mantra is an Ayurvedic dietary supplement designed to support weight management. 
                    Our products are made from natural ingredients and are manufactured in GMP-certified facilities.
                  </p>
                  <p>
                    Results may vary from person to person. Individual results depend on various factors 
                    including age, lifestyle, diet, and medical history.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">3. Health Disclaimers</h2>
                <div className="bg-turmeric-50 p-4 rounded-lg border border-turmeric-200 mb-4">
                  <p className="text-turmeric-800 font-medium">Important Health Notice</p>
                </div>
                <div className="space-y-3 text-sage-600 leading-relaxed">
                  <p>
                    • This product is not intended to diagnose, treat, cure, or prevent any disease.
                  </p>
                  <p>
                    • Consult your healthcare provider before using if you are pregnant, nursing, 
                    or have any medical conditions.
                  </p>
                  <p>
                    • Discontinue use and consult a doctor if any adverse reactions occur.
                  </p>
                  <p>
                    • Keep out of reach of children.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">4. Ordering and Payment</h2>
                <div className="space-y-3 text-sage-600 leading-relaxed">
                  <p>
                    All orders are subject to acceptance and product availability. We reserve the right 
                    to refuse or cancel any order for any reason.
                  </p>
                  <p>
                    Payment must be received before order processing. We accept secure payments through 
                    PAYU payment gateway.
                  </p>
                  <p>
                    Prices are subject to change without notice. Current prices apply at the time of order.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">5. Shipping and Delivery</h2>
                <div className="space-y-3 text-sage-600 leading-relaxed">
                  <p>
                    We offer free shipping across India. Orders are typically processed within 24 hours 
                    and delivered within 3-5 business days.
                  </p>
                  <p>
                    Risk of loss and title for products pass to you upon delivery to the carrier. 
                    We are not responsible for lost or stolen packages.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">6. Return and Refund Policy</h2>
                <div className="space-y-3 text-sage-600 leading-relaxed">
                  <p>
                    We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, 
                    contact us within 30 days of delivery for a full refund.
                  </p>
                  <p>
                    Products must be returned in original condition with at least 75% of the product remaining.
                  </p>
                  <p>
                    Shipping costs are non-refundable. Customers are responsible for return shipping costs.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">7. Privacy and Data Protection</h2>
                <div className="space-y-3 text-sage-600 leading-relaxed">
                  <p>
                    We respect your privacy and are committed to protecting your personal information. 
                    Please review our Privacy Policy for detailed information.
                  </p>
                  <p>
                    We use your information solely for order processing, customer service, and 
                    improving our products and services.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">8. Intellectual Property</h2>
                <div className="space-y-3 text-sage-600 leading-relaxed">
                  <p>
                    All content on this website, including text, graphics, logos, and images, 
                    is the property of Ayurvedic Mantra and protected by copyright laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, or create derivative works without 
                    written permission.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">9. Limitation of Liability</h2>
                <div className="space-y-3 text-sage-600 leading-relaxed">
                  <p>
                    Ayurvedic Mantra shall not be liable for any indirect, incidental, special, 
                    or consequential damages arising from use of our products.
                  </p>
                  <p>
                    Our total liability shall not exceed the amount paid for the product.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">10. Contact Information</h2>
                <div className="bg-sage-50 p-4 rounded-lg">
                  <div className="space-y-2 text-sage-600">
                    <p><strong>Email:</strong> legal@ayurvedicmantra.com</p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                    <p><strong>Address:</strong> 123 Wellness Street, Ayurveda Complex, Mumbai, India 400001</p>
                  </div>
                </div>
              </section>

              <section className="pt-6 border-t border-sage-200">
                <p className="text-sm text-sage-500 text-center">
                  By using our website and purchasing our products, you acknowledge that you have read, 
                  understood, and agree to be bound by these Terms and Conditions.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}