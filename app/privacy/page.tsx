import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Eye, Lock, Users } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
            <Badge className="bg-sage-100 text-sage-700 mb-4">Data Protection</Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-poppins text-sage-700 mb-4">
              Privacy Policy
            </h1>
            <p className="text-sage-600">Last updated: June 17, 2024</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Privacy Commitment */}
          <Card className="card-ayurveda bg-gradient-to-r from-sage-50 to-cream-50 border-sage-200">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 text-sage-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-sage-700 mb-4">Our Privacy Commitment</h2>
              <p className="text-sage-600 leading-relaxed">
                At Ayurvedic Mantra, we are committed to protecting your privacy and ensuring 
                the security of your personal information. This policy explains how we collect, 
                use, and safeguard your data.
              </p>
            </CardContent>
          </Card>

          <Card className="card-ayurveda">
            <CardContent className="p-8 space-y-8">
              
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-sage-600" />
                  <h2 className="text-xl font-semibold text-sage-700">Information We Collect</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-sage-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-sage-700 mb-2">Personal Information</h3>
                    <ul className="text-sage-600 space-y-1 text-sm">
                      <li>• Name and contact details (email, phone, address)</li>
                      <li>• Payment and billing information</li>
                      <li>• Order history and preferences</li>
                      <li>• Account credentials and profile information</li>
                    </ul>
                  </div>

                  <div className="bg-sage-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-sage-700 mb-2">Automatically Collected Data</h3>
                    <ul className="text-sage-600 space-y-1 text-sm">
                      <li>• IP address and device information</li>
                      <li>• Browser type and version</li>
                      <li>• Website usage patterns and analytics</li>
                      <li>• Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-sage-600" />
                  <h2 className="text-xl font-semibold text-sage-700">How We Use Your Information</h2>
                </div>
                
                <div className="space-y-3 text-sage-600">
                  <p><strong>Order Processing:</strong> To process your orders, arrange delivery, and provide customer support.</p>
                  <p><strong>Communication:</strong> To send order updates, promotional offers, and important product information.</p>
                  <p><strong>Personalization:</strong> To customize your shopping experience and recommend relevant products.</p>
                  <p><strong>Analytics:</strong> To understand how our website is used and improve our services.</p>
                  <p><strong>Legal Compliance:</strong> To comply with applicable laws and regulations.</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-sage-600" />
                  <h2 className="text-xl font-semibold text-sage-700">Data Security</h2>
                </div>
                
                <div className="space-y-3 text-sage-600">
                  <p>
                    We implement industry-standard security measures to protect your personal information:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-sage-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sage-700 mb-2">Technical Safeguards</h4>
                      <ul className="text-sm space-y-1">
                        <li>• SSL encryption for data transmission</li>
                        <li>• Secure payment processing</li>
                        <li>• Regular security audits</li>
                        <li>• Firewall protection</li>
                      </ul>
                    </div>
                    
                    <div className="bg-sage-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sage-700 mb-2">Administrative Controls</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Limited access to personal data</li>
                        <li>• Employee training on privacy</li>
                        <li>• Data retention policies</li>
                        <li>• Incident response procedures</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">Sharing Your Information</h2>
                <div className="space-y-3 text-sage-600">
                  <p>We do not sell or rent your personal information to third parties. We may share your data only in these limited circumstances:</p>
                  
                  <ul className="space-y-2 ml-4">
                    <li>• <strong>Service Providers:</strong> With trusted partners who help us deliver our services (shipping, payment processing)</li>
                    <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    <li>• <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                    <li>• <strong>Consent:</strong> When you explicitly consent to sharing</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">Your Rights and Choices</h2>
                <div className="space-y-3 text-sage-600">
                  <p>You have the following rights regarding your personal information:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p><strong>Access:</strong> Request a copy of your personal data</p>
                      <p><strong>Correction:</strong> Update or correct inaccurate information</p>
                      <p><strong>Deletion:</strong> Request deletion of your personal data</p>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Portability:</strong> Request data in a portable format</p>
                      <p><strong>Opt-out:</strong> Unsubscribe from marketing communications</p>
                      <p><strong>Restriction:</strong> Limit how we process your data</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">Cookies and Tracking</h2>
                <div className="space-y-3 text-sage-600">
                  <p>
                    We use cookies and similar technologies to enhance your browsing experience. 
                    You can control cookie settings through your browser preferences.
                  </p>
                  
                  <div className="bg-turmeric-50 p-4 rounded-lg border border-turmeric-200">
                    <h4 className="font-semibold text-turmeric-800 mb-2">Types of Cookies We Use</h4>
                    <ul className="text-turmeric-700 text-sm space-y-1">
                      <li>• Essential cookies for website functionality</li>
                      <li>• Analytics cookies to understand usage patterns</li>
                      <li>• Preference cookies to remember your settings</li>
                      <li>• Marketing cookies for personalized advertising</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">Data Retention</h2>
                <div className="space-y-3 text-sage-600">
                  <p>
                    We retain your personal information only as long as necessary for the purposes 
                    outlined in this policy or as required by law.
                  </p>
                  <p>
                    Account information is retained while your account is active. Order information 
                    is kept for legal and tax purposes as required by Indian law.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">Children's Privacy</h2>
                <div className="bg-terracotta-50 p-4 rounded-lg border border-terracotta-200">
                  <p className="text-terracotta-800">
                    Our services are not intended for children under 18. We do not knowingly 
                    collect personal information from children. If you believe we have collected 
                    information from a child, please contact us immediately.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">International Transfers</h2>
                <div className="space-y-3 text-sage-600">
                  <p>
                    Your information may be transferred and processed in countries other than India. 
                    We ensure appropriate safeguards are in place to protect your data during 
                    international transfers.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-sage-700 mb-4">Updates to This Policy</h2>
                <div className="space-y-3 text-sage-600">
                  <p>
                    We may update this privacy policy from time to time. We will notify you of 
                    significant changes by email or through our website.
                  </p>
                  <p>
                    Continued use of our services after policy updates constitutes acceptance 
                    of the revised terms.
                  </p>
                </div>
              </section>

              <section className="pt-6 border-t border-sage-200">
                <h2 className="text-xl font-semibold text-sage-700 mb-4">Contact Us</h2>
                <div className="bg-sage-50 p-4 rounded-lg">
                  <p className="text-sage-600 mb-3">
                    If you have questions about this privacy policy or want to exercise your rights, 
                    please contact us:
                  </p>
                  <div className="space-y-2 text-sage-600">
                    <p><strong>Email:</strong> privacy@ayurvedicmantra.com</p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                    <p><strong>Address:</strong> 123 Wellness Street, Ayurveda Complex, Mumbai, India 400001</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}