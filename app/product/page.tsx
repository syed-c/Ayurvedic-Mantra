"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Shield, 
  Truck, 
  Heart, 
  Share2, 
  Play, 
  Check,
  Leaf,
  ArrowLeft,
  ShoppingCart,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useApp } from "@/contexts/AppContext";

export default function ProductPage() {
  console.log("Product page rendered");
  const { toast } = useToast();
  const { settings } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productImages = [
    "🏺", "📦", "🌿", "💊"
  ];

  const plans = [
    {
      id: 1,
      name: "1 Month Supply",
      duration: "1 Month",
      price: 999,
      mrp: 1299,
      savings: 300,
      bottles: 1,
      capsules: 60,
      perDay: "₹33 per day",
      popular: false
    },
    {
      id: 2,
      name: "2 Month Supply",
      duration: "2 Months", 
      price: 1499,
      mrp: 2598,
      savings: 1099,
      bottles: 2,
      capsules: 120,
      perDay: "₹25 per day",
      popular: true
    },
    {
      id: 3,
      name: "3 Month Supply",
      duration: "3 Months",
      price: 1799,
      mrp: 2997,
      savings: 1198,
      bottles: 3,
      capsules: 180,
      perDay: "₹20 per day", 
      popular: false,
      bestSeller: true
    }
  ];

  const ingredients = [
    { name: "Black Coffee Extract", benefit: "Boosts metabolism and energy" },
    { name: "Green Tea Extract", benefit: "Rich in antioxidants, burns fat" },
    { name: "Green Seed Extract", benefit: "Supports healthy weight management" },
    { name: "Garcinia Cambogia", benefit: "Suppresses appetite naturally" },
    { name: "South", benefit: "Traditional Ayurvedic herb for digestion" },
    { name: "Tulsi", benefit: "Reduces stress and balances hormones" },
    { name: "Lemon Dry Extract", benefit: "Detoxifies and cleanses the body" },
    { name: "Dal Chini (Cinnamon)", benefit: "Regulates blood sugar levels" },
    { name: "Kali Mirch (Black Pepper)", benefit: "Enhances nutrient absorption" }
  ];

  const benefits = [
    "Burns stubborn fat naturally",
    "Boosts metabolism by 40%", 
    "Increases energy levels",
    "Suppresses unhealthy cravings",
    "Detoxifies the body",
    "Improves digestion",
    "Balances hormones",
    "No side effects"
  ];

  const reviews = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Lost 22 kg in 3 months! Amazing product, highly recommend.",
      date: "2024-06-10",
      verified: true
    },
    {
      name: "Priya Sharma", 
      rating: 5,
      comment: "Finally found something that works! No side effects and great results.",
      date: "2024-06-08",
      verified: true
    },
    {
      name: "Anita Patel",
      rating: 5,
      comment: "Post-pregnancy weight loss was challenging, but this helped me achieve my goals.",
      date: "2024-06-05", 
      verified: true
    }
  ];

  const handlePlanSelect = (planId: number) => {
    console.log(`Plan selected: ${planId}`);
    setSelectedPlan(planId);
    const plan = plans.find(p => p.id === planId);
    
    toast({
      title: "Plan Selected! 🎉",
      description: `${plan?.name} added to your selection`,
    });
  };

  const handleBuyNow = () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "Choose your preferred plan to continue",
        variant: "destructive"
      });
      return;
    }

    console.log("Proceeding to checkout with plan:", selectedPlan);
    window.location.href = `/checkout?plan=${selectedPlan}`;
  };

  const handleAddToCart = () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan", 
        description: "Choose your preferred plan to add to cart",
        variant: "destructive"
      });
      return;
    }

    console.log("Adding to cart plan:", selectedPlan);
    toast({
      title: "Added to Cart! 🛒",
      description: "Item has been added to your cart",
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50 pt-16">
        {/* Quick Navigation */}
        <div className="bg-white border-b border-sage-200 sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-sage-600 hover:text-sage-700">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Header */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-sage-100 to-cream-100 rounded-3xl p-8 flex items-center justify-center">
              {settings?.product?.image ? (
                <img 
                  src={settings.product.image} 
                  alt="Product Image" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="text-8xl">
                  {productImages[currentImageIndex]}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square bg-sage-100 rounded-lg flex items-center justify-center text-2xl transition-all ${
                    currentImageIndex === index ? 'ring-2 ring-sage-400' : 'hover:bg-sage-200'
                  }`}
                >
                  {image}
                </button>
              ))}
            </div>

            {/* Video Section */}
            <Card className="card-ayurveda">
              <CardContent className="p-6">
                <div className="aspect-video bg-gradient-to-br from-sage-200 to-terracotta-100 rounded-2xl flex items-center justify-center relative">
                  <Button className="bg-white/90 hover:bg-white text-sage-700 rounded-full w-16 h-16 p-0 shadow-lg">
                    <Play className="w-6 h-6 ml-1" />
                  </Button>
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                    Product Demo Video
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-turmeric-100 text-turmeric-700">
                  🏆 Best Seller
                </Badge>
                <Badge className="bg-sage-100 text-sage-700">
                  ✅ FDA Approved
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold font-poppins text-sage-700">
                {settings?.product?.name || "SlimX Mantra"}
              </h1>
              
              <p className="text-xl text-sage-600">
                {settings?.product?.tagline || "Premium Ayurvedic Weight Loss Formula"}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-turmeric-400 text-turmeric-400" />
                  ))}
                </div>
                <span className="text-sage-600">4.8/5 (2,847 reviews)</span>
              </div>
            </div>

            {/* Key Benefits */}
            <Card className="bg-gradient-to-r from-sage-50 to-cream-50 border-sage-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-sage-700 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-turmeric-500" />
                  Key Benefits
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {benefits.slice(0, 6).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-sage-500 flex-shrink-0" />
                      <span className="text-sage-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 text-sm text-sage-600">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-sage-500" />
                <span>100% Natural</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-sage-500" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-turmeric-400 fill-current" />
                <span>15,000+ Happy Customers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-poppins text-sage-700 mb-4">
              Choose Your Transformation Plan
            </h2>
            <p className="text-sage-600">Select the plan that best fits your weight loss goals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative transition-all duration-300 cursor-pointer ${
                  plan.popular 
                    ? 'ring-2 ring-terracotta-400 shadow-xl scale-105' 
                    : plan.bestSeller
                    ? 'ring-2 ring-turmeric-400 shadow-xl'
                    : 'hover:shadow-xl hover:-translate-y-1'
                } ${selectedPlan === plan.id ? 'ring-2 ring-sage-400 bg-sage-50' : 'bg-white'}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-terracotta-500 text-white text-center py-2 text-sm font-medium">
                    🔥 Most Popular
                  </div>
                )}
                
                {plan.bestSeller && (
                  <div className="absolute top-0 left-0 right-0 bg-turmeric-500 text-white text-center py-2 text-sm font-medium">
                    ⭐ Best Seller - Save ₹{plan.savings}
                  </div>
                )}

                <CardContent className={`p-6 ${plan.popular || plan.bestSeller ? 'pt-12' : 'pt-6'}`}>
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold font-poppins text-sage-700">
                      {plan.name}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-bold text-sage-700">₹{plan.price}</span>
                        <div className="text-sm text-sage-500">
                          <div className="line-through">₹{plan.mrp}</div>
                        </div>
                      </div>
                      
                      <p className="text-terracotta-600 font-medium">
                        Save ₹{plan.savings}
                      </p>
                      
                      <p className="text-sage-600 text-sm">{plan.perDay}</p>
                    </div>

                    <div className="space-y-2 text-sm text-sage-600">
                      <p>• {plan.bottles} bottle(s) ({plan.capsules} capsules)</p>
                      <p>• {plan.duration} supply</p>
                      <p>• Free shipping included</p>
                      <p>• 30-day money back guarantee</p>
                    </div>

                    {selectedPlan === plan.id && (
                      <Badge className="bg-sage-100 text-sage-700">
                        ✓ Selected
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={handleBuyNow}
              className="btn-ayurveda text-lg px-8 py-4 h-auto"
              size="lg"
            >
              Buy Now - Secure Checkout
            </Button>
            
            <Button 
              onClick={handleAddToCart}
              variant="outline"
              className="border-sage-300 text-sage-700 hover:bg-sage-50 text-lg px-8 py-4 h-auto"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="ingredients" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-sage-100">
              <TabsTrigger value="ingredients" className="text-sage-700">Ingredients</TabsTrigger>
              <TabsTrigger value="benefits" className="text-sage-700">Benefits</TabsTrigger>
              <TabsTrigger value="usage" className="text-sage-700">How to Use</TabsTrigger>
              <TabsTrigger value="reviews" className="text-sage-700">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="space-y-6">
              <Card className="card-ayurveda">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold font-poppins text-sage-700 mb-6 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-sage-500" />
                    100% Natural Ingredients
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-sage-50 rounded-lg">
                        <div className="w-2 h-2 bg-sage-400 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-sage-700">{ingredient.name}</h4>
                          <p className="text-sm text-sage-600 mt-1">{ingredient.benefit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-6">
              <Card className="card-ayurveda">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold font-poppins text-sage-700 mb-6">
                    Complete Benefits
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                        <span className="text-sage-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <Card className="card-ayurveda">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold font-poppins text-sage-700 mb-6">
                    How to Use SlimX Mantra
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-sage-700">Morning Dose</h4>
                        <p className="text-sage-600">Take 1 capsule 30 minutes before breakfast with lukewarm water</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-sage-700">Evening Dose</h4>
                        <p className="text-sage-600">Take 1 capsule 30 minutes before dinner with lukewarm water</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-sage-700">Stay Hydrated</h4>
                        <p className="text-sage-600">Drink plenty of water throughout the day for best results</p>
                      </div>
                    </div>

                    <div className="bg-turmeric-50 p-4 rounded-lg border border-turmeric-200">
                      <h4 className="font-semibold text-turmeric-800 mb-2">💡 Pro Tips</h4>
                      <ul className="text-turmeric-700 text-sm space-y-1">
                        <li>• Take consistently at the same time each day</li>
                        <li>• Maintain a balanced diet for optimal results</li>
                        <li>• Light exercise enhances the effects</li>
                        <li>• Results typically visible within 2-3 weeks</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <Card key={index} className="card-ayurveda">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-sage-700">{review.name}</h4>
                            {review.verified && (
                              <Badge className="bg-sage-100 text-sage-700 text-xs">
                                ✓ Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-turmeric-400 text-turmeric-400" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-sage-500">{review.date}</span>
                      </div>
                      
                      <p className="text-sage-600 leading-relaxed">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}