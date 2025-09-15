"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Truck, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

export function PricingSection() {
  console.log("Pricing Section rendered");
  const { toast } = useToast();
  const { settings } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  // Get pricing plans from database settings, with fallback to defaults
  const plans = (settings?.product?.plans && Array.isArray(settings.product.plans) && settings.product.plans.length > 0) ? settings.product.plans : [
    {
      id: 1,
      name: "1 Month Supply",
      duration: "1 Month",
      price: 999,
      mrp: 1299,
      savings: 300,
      popular: false,
      description: "Perfect for trying our formula",
      features: [
        "1 bottle (60 capsules)",
        "Basic nutrition guide",
        "Email support",
        "Money-back guarantee"
      ]
    },
    {
      id: 2,
      name: "2 Month Supply",
      duration: "2 Months",
      price: 1499,
      mrp: 2598,
      savings: 1099,
      popular: true,
      description: "Most popular choice",
      features: [
        "2 bottles (120 capsules)",
        "Detailed meal plan",
        "Priority support",
        "Progress tracking guide",
        "Free shipping"
      ]
    },
    {
      id: 3,
      name: "3 Month Supply",
      duration: "3 Months",
      price: 1799,
      mrp: 3897,
      savings: 2098,
      popular: false,
      description: "Best value for complete transformation",
      features: [
        "3 bottles (180 capsules)",
        "Complete wellness program",
        "Personal consultation call",
        "Exercise routine guide",
        "24/7 WhatsApp support",
        "Free shipping + bonus gifts"
      ],
      bestValue: true
    }
  ];

  // Debug logging
  console.log("Pricing Section - Settings:", settings);
  console.log("Pricing Section - Plans:", plans);
  console.log("Pricing Section - Plans length:", plans?.length);

  const handlePlanSelect = (planId: number) => {
    console.log(`Plan selected: ${planId}, redirecting to checkout`);
    // Redirect to checkout with selected plan
    window.location.href = `/checkout?plan=${planId}`;
  };

  return (
    <section id="pricing-plans" className="py-20 bg-gradient-to-br from-sage-50 to-cream-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-terracotta-100 text-terracotta-700 hover:bg-terracotta-200 px-4 py-2 text-sm font-medium">
            💰 Special Offer
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-sage-700">
            {settings?.homepage?.pricingSection?.title || (
              <>Choose Your <span className="text-gradient-ayurveda"> Transformation</span> Plan</>
            )}
          </h2>
          
          <p className="text-lg text-sage-600 max-w-2xl mx-auto leading-relaxed">
            {settings?.homepage?.pricingSection?.description || (
              <>Start your natural weight loss journey today. All plans come with free shipping and a 30-day money-back guarantee.</>
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans && Array.isArray(plans) && plans.length > 0 ? plans.map((plan: any, index: number) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl group ${
                plan.popular 
                  ? 'ring-2 ring-terracotta-400 shadow-xl scale-105' 
                  : (plan.bestValue || plan.bestSeller)
                  ? 'ring-2 ring-turmeric-400 shadow-xl'
                  : 'hover:shadow-xl hover:-translate-y-1'
              } ${selectedPlan === plan.id ? 'ring-2 ring-sage-400 bg-sage-50' : 'bg-white'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-terracotta-500 text-white text-center py-2 text-sm font-medium">
                  🔥 Most Popular
                </div>
              )}
              
              {(plan.bestValue || plan.bestSeller) && (
                <div className="absolute top-0 left-0 right-0 bg-turmeric-500 text-white text-center py-2 text-sm font-medium">
                  ⭐ Best Value
                </div>
              )}

              <CardHeader className={`text-center pb-4 ${plan.popular || plan.bestValue || plan.bestSeller ? 'pt-12' : 'pt-8'}`}>
                <CardTitle className="text-2xl font-poppins text-sage-700 mb-2">
                  {plan.name}
                </CardTitle>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-sage-700">₹{plan.price}</span>
                    <div className="text-sm text-sage-500">
                      <div className="line-through">₹{plan.mrp}</div>
                      <div className="text-terracotta-600 font-medium">Save ₹{plan.savings}</div>
                    </div>
                  </div>
                  
                  <p className="text-sage-600">{plan.description}</p>
                  
                  <div className="flex items-center justify-center gap-1 text-sm text-sage-500">
                    <Star className="w-4 h-4 fill-turmeric-400 text-turmeric-400" />
                    <span>per {plan.duration.toLowerCase()}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features && Array.isArray(plan.features) ? plan.features.map((feature: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sage-600">{feature}</span>
                    </li>
                  )) : (
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sage-600">Features loading...</span>
                    </li>
                  )}
                </ul>

                <div className="flex items-center justify-center gap-4 text-sm text-sage-500 pt-4 border-t border-sage-100">
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Secure Payment</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-6 text-lg font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-terracotta-500 hover:bg-terracotta-600 text-white'
                      : plan.bestValue
                      ? 'bg-turmeric-500 hover:bg-turmeric-600 text-white'
                      : 'btn-ayurveda'
                  } ${selectedPlan === plan.id ? 'ring-2 ring-offset-2 ring-sage-300' : ''}`}
                  disabled={selectedPlan === plan.id}
                >
                  {selectedPlan === plan.id ? 'Selected ✓' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-sage-600">Loading pricing plans...</p>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center space-y-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sage-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-sage-500" />
              <span className="font-medium">30-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-sage-500" />
              <span className="font-medium">Free Shipping Worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-turmeric-400 fill-current" />
              <span className="font-medium">4.8/5 Customer Rating</span>
            </div>
          </div>
          
          <p className="text-sm text-sage-500 max-w-2xl mx-auto">
            All orders are processed securely. Your personal information is protected with 
            bank-level encryption. Ships within 24 hours with tracking information.
          </p>
        </div>
      </div>
    </section>
  );
}