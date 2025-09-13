"use client";

import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { BenefitsSection } from "@/components/benefits-section";
import { PricingSection } from "@/components/pricing-section";
import { TestimonialSection } from "@/components/testimonial-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { useApp } from "@/contexts/AppContext";
import { Leaf, RefreshCw } from "lucide-react";

export default function Home() {
  console.log("Homepage rendered");
  const { settings, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-sage-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <RefreshCw className="w-6 h-6 animate-spin text-sage-600 mx-auto mb-4" />
          <p className="text-sage-600">Loading Ayurvedic Mantra...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <div id="benefits">
          <BenefitsSection />
        </div>
        <PricingSection />
        <div id="testimonials">
          <TestimonialSection />
        </div>
        <div id="faq">
          <FAQSection />
        </div>
        <Footer />
      </main>
    </>
  );
}
