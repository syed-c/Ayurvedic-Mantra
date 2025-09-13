"use client";

import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Fetch website settings for footer data
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/public/settings');
        const result = await response.json();
        if (result.success) {
          setSettings(result.data);
          console.log("Footer settings loaded:", result.data.site);
        }
      } catch (error) {
        console.error("Error loading footer settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="bg-sage-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-turmeric-400 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-sage-800" />
              </div>
              <h3 className="text-2xl font-bold font-poppins">{settings?.site?.title || "Ayurvedic Mantra"}</h3>
            </div>
            
            <p className="text-sage-200 leading-relaxed">
              Transforming lives naturally with the ancient wisdom of Ayurveda. 
              Your trusted partner in achieving sustainable weight loss and wellness.
            </p>
            
            <div className="flex gap-4">
              {settings?.site?.socialLinks?.facebook && (
                <a href={settings.site.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-sage-700 hover:bg-sage-600 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.site?.socialLinks?.instagram && (
                <a href={settings.site.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-sage-700 hover:bg-sage-600 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.site?.socialLinks?.youtube && (
                <a href={settings.site.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-sage-700 hover:bg-sage-600 rounded-full flex items-center justify-center transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              <a href={settings?.site?.socialLinks?.twitter || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-sage-700 hover:bg-sage-600 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold font-poppins">Quick Links</h4>
            <nav className="space-y-3">
              <Link 
                href="/#benefits" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block text-sage-200 hover:text-white transition-colors"
              >
                Benefits
              </Link>
              <Link 
                href="/#pricing-plans" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block text-sage-200 hover:text-white transition-colors"
              >
                Pricing Plans
              </Link>
              <Link 
                href="/#testimonials" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block text-sage-200 hover:text-white transition-colors"
              >
                Success Stories
              </Link>
              <Link 
                href="/#faq" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="block text-sage-200 hover:text-white transition-colors"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold font-poppins">Support</h4>
            <nav className="space-y-3">
              <a href="/customer-support" className="block text-sage-200 hover:text-white transition-colors">
                Customer Support
              </a>
              <a href="/shipping-policy" className="block text-sage-200 hover:text-white transition-colors">
                Shipping Policy
              </a>
              <a href="/return-policy" className="block text-sage-200 hover:text-white transition-colors">
                Return Policy
              </a>
              <a href="/terms-and-conditions" className="block text-sage-200 hover:text-white transition-colors">
                Terms & Conditions
              </a>
              <a href="/privacy-policy" className="block text-sage-200 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold font-poppins">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-turmeric-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sage-200">Email us at:</p>
                  <a href={`mailto:${settings?.site?.contactEmail || "support@ayurvedicmantra.com"}`} className="text-white hover:text-turmeric-200 transition-colors">
                    {settings?.site?.contactEmail || "support@ayurvedicmantra.com"}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-turmeric-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sage-200">Call or WhatsApp:</p>
                  <a href={`tel:${settings?.site?.contactPhone || "+919876543210"}`} className="text-white hover:text-turmeric-200 transition-colors">
                    {settings?.site?.contactPhone || "+91 98765 43210"}
                  </a>
                </div>
              </div>
              
              {settings?.site?.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-turmeric-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sage-200">Address:</p>
                    <div className="text-white whitespace-pre-line">
                      {settings.site.address}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-sage-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sage-200 text-sm">
              {settings?.site?.footerText || "© 2024 Ayurvedic Mantra. All rights reserved."}
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-sage-200">
              <span>✓ FDA Approved</span>
              <span>✓ GMP Certified</span>
              <span>✓ 100% Natural</span>
              <span>✓ No Side Effects</span>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-sage-300">
            <p>
              Disclaimer: Results may vary from person to person. This product is not intended to diagnose, 
              treat, cure, or prevent any disease. Always consult with a healthcare professional before 
              starting any weight loss program.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}