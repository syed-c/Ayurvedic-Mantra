"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Leaf, Zap } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export function HeroSection() {
  console.log("Hero Section rendered");
  const { settings } = useApp();

  const scrollToPlans = () => {
    console.log("Scrolling to pricing plans");
    const element = document.getElementById('pricing-plans');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-overlay"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-turmeric-400 text-turmeric-900 hover:bg-turmeric-500 px-4 py-2 text-sm font-medium">
                🌿 100% Natural & Ayurvedic
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold font-poppins leading-tight">
                {settings?.homepage?.heroTitle ? (
                  <span className="text-gradient-ayurveda">
                    {settings.homepage.heroTitle}
                  </span>
                ) : (
                  <>
                    <span className="text-gradient-ayurveda">
                      Lose Weight
                    </span>
                    <br />
                    <span className="text-sage-700">
                      Naturally with
                    </span>
                    <br />
                    <span className="text-terracotta-500">
                      Ayurvedic Mantra
                    </span>
                  </>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-sage-600 max-w-xl leading-relaxed">
                {settings?.homepage?.heroSubtitle || 
                  "Transform your body with our clinically tested Ayurvedic weight loss formula. No side effects, just natural results that last."
                }
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <div className="flex text-turmeric-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-sage-600 font-medium">4.8/5 (2,847 reviews)</span>
              </div>
              
              <div className="flex items-center gap-2 text-sage-600">
                <Shield className="w-5 h-5 text-terracotta-500" />
                <span className="font-medium">FDA Approved</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.location.href = '/checkout?plan=3'}
                className="btn-ayurveda text-lg px-8 py-4 h-auto"
                size="lg"
              >
                Order Now - Get Started
              </Button>
              
              <Button 
                variant="outline" 
                className="border-sage-300 text-sage-700 hover:bg-sage-50 text-lg px-8 py-4 h-auto"
                size="lg"
              >
                Watch Success Stories
              </Button>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Leaf className="w-6 h-6 text-sage-600" />
                </div>
                <p className="text-sm font-medium text-sage-700">100% Natural</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-terracotta-600" />
                </div>
                <p className="text-sm font-medium text-sage-700">Fast Results</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-turmeric-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-turmeric-600" />
                </div>
                <p className="text-sm font-medium text-sage-700">No Side Effects</p>
              </div>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="relative">
            <div className="relative z-10 animate-pulse-gentle">
              {/* Dynamic Product/Hero Image */}
              <div className="bg-gradient-to-br from-sage-100 to-cream-100 rounded-3xl p-8 shadow-2xl">
                {settings?.product?.image ? (
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img 
                      src={settings.product.image}
                      alt="Product Image"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                ) : settings?.homepage?.heroImage ? (
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img 
                      src={settings.homepage.heroImage} 
                      alt="Hero Banner" 
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-sage-200 to-terracotta-100 rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 bg-sage-300 rounded-full mx-auto flex items-center justify-center">
                        <Leaf className="w-16 h-16 text-sage-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-sage-700">SlimX Ayurvedic</h3>
                        <p className="text-sage-600">Weight Loss Formula</p>
                        <Badge className="bg-terracotta-500 text-white">Premium Quality</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-turmeric-200 rounded-full opacity-60 animate-pulse-gentle"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-terracotta-200 rounded-full opacity-40 animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 text-cream-50">
          <path d="M0,120L48,110C96,100,192,80,288,70C384,60,480,60,576,65C672,70,768,80,864,75C960,70,1056,50,1152,45L1200,40L1200,120L0,120Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
}