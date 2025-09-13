"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  CreditCard, 
  Shield, 
  Truck, 
  Clock,
  CheckCircle,
  ArrowLeft,
  Leaf,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import AddressForm from "@/components/address-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function CheckoutPage() {
  console.log("Checkout page rendered");
  const { toast } = useToast();
  const { settings, createOrder } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("3"); // Default to 3-month plan
  const [checkoutType, setCheckoutType] = useState("guest"); // guest or login

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    email: "",
    paymentMethod: "cod" // Default to Cash on Delivery
  });

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  // Use plans from settings or fallback to defaults
  const plans = settings?.product?.plans || [
    { id: 1, name: "1 Month Supply", price: 999, mrp: 1299, savings: 300, duration: "1 Month" },
    { id: 2, name: "2 Month Supply", price: 1499, mrp: 2598, savings: 1099, duration: "2 Months", popular: true },
    { id: 3, name: "3 Month Supply", price: 1799, mrp: 2997, savings: 1198, duration: "3 Months", bestValue: true }
  ];

  const plansMap = plans.reduce((acc: any, plan: any) => {
    acc[plan.id.toString()] = plan;
    return acc;
  }, {});

  useEffect(() => {
    // Get plan from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const planFromUrl = urlParams.get('plan');
    if (planFromUrl && plansMap[planFromUrl]) {
      console.log("Pre-selecting plan from URL:", planFromUrl);
      setSelectedPlan(planFromUrl);
      toast({
        title: "Plan Pre-Selected! 🎯",
        description: `${plansMap[planFromUrl].name} has been pre-selected for you.`,
      });
    }
  }, [toast, settings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    console.log("Processing order for:", { selectedPlan, formData });

    const selectedPlanData = plansMap[selectedPlan];
    
    if (!selectedPlanData) {
      toast({
        title: "Plan Not Found",
        description: "Please select a valid plan",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }

    // Validate required fields (email is optional)
    const requiredFields = ['fullName', 'address', 'phone', 'pincode', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }

    // Validate PIN code format
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast({
        title: "Invalid PIN Code",
        description: "Please enter a valid 6-digit PIN code",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }

    try {
      // Create order via new API
      const orderData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        plan: selectedPlanData.name,
        amount: selectedPlanData.price,
        paymentMethod: formData.paymentMethod, // Use selected payment method
        userId: checkoutType === 'guest' ? null : Math.floor(Math.random() * 1000),
        deliveryDays: settings?.checkout?.deliveryDays || 3,
        orderSource: 'website',
        quantity: 1
      };

      console.log("Placing order:", orderData);

      const response = await fetch('/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log("Order API response:", result);

      if (result.success) {
        // Store order data for thank you page
        const confirmationData = {
          orderId: result.data.orderId,
          plan: selectedPlanData.name,
          amount: selectedPlanData.price,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          orderTime: result.data.orderTime,
          estimatedDelivery: result.data.estimatedDelivery,
          trackingAvailable: result.data.trackingAvailable
        };
        
        localStorage.setItem('lastOrder', JSON.stringify(confirmationData));

        toast({
          title: "Order Placed Successfully! 🎉",
          description: result.message,
        });
        
        // Redirect to thank you page
        setTimeout(() => {
          console.log("Redirecting to thank you page");
          window.location.href = `/thank-you?order=${result.data.orderId}`;
        }, 2000);
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error("Order placement error:", error);
      toast({
        title: "Order Failed",
        description: "Unable to place order. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  const selectedPlanData = plansMap[selectedPlan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50">
      {/* Header */}
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-16"></div>
      
      {/* Checkout Header with security badges */}
      <div className="bg-white border-b border-sage-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="text-sage-600 hover:text-sage-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h2 className="text-xl font-semibold text-sage-700">Secure Checkout</h2>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm text-sage-600">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                <span>Free Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sage-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="ml-2 text-sage-700 font-medium">Select Plan</span>
              </div>
              <div className="w-16 h-0.5 bg-sage-600"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sage-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sage-700 font-medium">Checkout</span>
              </div>
              <div className="w-16 h-0.5 bg-sage-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sage-300 text-sage-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sage-500">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Column - Checkout Form */}
            <div className="space-y-6">
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-2xl font-poppins text-sage-700 flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6" />
                    Complete Your Order
                  </CardTitle>
                  <p className="text-sage-600">
                    {settings?.checkout?.subtitle || "Secure 256-bit SSL encrypted checkout"}
                  </p>
                </CardHeader>
                
                <CardContent>
                  {/* Checkout Options */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={checkoutType === 'guest' ? 'default' : 'outline'}
                        className={`w-full h-16 ${checkoutType === 'guest' ? 'bg-sage-600 text-white' : 'border-sage-300 text-sage-700'}`}
                        onClick={() => setCheckoutType('guest')}
                      >
                        <div className="text-center">
                          <ShoppingCart className="w-5 h-5 mx-auto mb-1" />
                          <p className="text-sm font-medium">Order as Guest</p>
                          <p className="text-xs opacity-75">No account needed</p>
                        </div>
                      </Button>
                      
                      <Button
                        type="button"
                        variant={checkoutType === 'login' ? 'default' : 'outline'}
                        className={`w-full h-16 ${checkoutType === 'login' ? 'bg-sage-600 text-white' : 'border-sage-300 text-sage-700'}`}
                        onClick={() => {
                          setCheckoutType('login');
                          window.location.href = '/login';
                        }}
                      >
                        <div className="text-center">
                          <User className="w-5 h-5 mx-auto mb-1" />
                          <p className="text-sm font-medium">Sign In & Order</p>
                          <p className="text-xs opacity-75">Save details & track orders</p>
                        </div>
                      </Button>
                    </div>
                    
                    {checkoutType === 'guest' && (
                      <div className="mt-4 p-3 bg-turmeric-50 rounded-lg border border-turmeric-200">
                        <p className="text-sm text-turmeric-700">
                          <strong>Guest Checkout:</strong> You can order without creating an account. 
                          Your order details will be sent to your email and phone.
                        </p>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-6">
                    
                    {/* Address Form Component */}
                    <AddressForm
                      formData={formData}
                      onFormChange={handleFormChange}
                      emailOptional={true}
                      showTitle={true}
                    />

                    <Separator className="bg-sage-200" />

                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-sage-700">Payment Method</h3>
                      
                      <div className="space-y-3">
                        {/* Cash on Delivery Option */}
                        <div 
                          onClick={() => handleInputChange('paymentMethod', 'cod')}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.paymentMethod === 'cod' 
                              ? 'border-sage-500 bg-sage-50 ring-2 ring-sage-200' 
                              : 'border-sage-200 hover:border-sage-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-sage-600" />
                            <div className="flex-1">
                              <p className="font-medium text-sage-700">Cash on Delivery (COD)</p>
                              <p className="text-sm text-sage-600">Pay when your order is delivered</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              formData.paymentMethod === 'cod' 
                                ? 'border-sage-500 bg-sage-500' 
                                : 'border-sage-300'
                            }`}>
                              {formData.paymentMethod === 'cod' && (
                                <div className="w-full h-full bg-white rounded-full scale-50"></div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Online Payment Option */}
                        <div 
                          onClick={() => handleInputChange('paymentMethod', 'online')}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.paymentMethod === 'online' 
                              ? 'border-sage-500 bg-sage-50 ring-2 ring-sage-200' 
                              : 'border-sage-200 hover:border-sage-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-sage-600" />
                            <div className="flex-1">
                              <p className="font-medium text-sage-700">Pay Now (Online)</p>
                              <p className="text-sm text-sage-600">Pay securely using UPI, Cards, or Net Banking</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              formData.paymentMethod === 'online' 
                                ? 'border-sage-500 bg-sage-500' 
                                : 'border-sage-300'
                            }`}>
                              {formData.paymentMethod === 'online' && (
                                <div className="w-full h-full bg-white rounded-full scale-50"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full btn-ayurveda py-4 text-lg font-medium"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Place Order Securely
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              
              {/* Plan Selection */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-xl font-poppins text-sage-700">Choose Your Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plans.map((plan: any) => (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id.toString())}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedPlan === plan.id.toString()
                          ? 'border-sage-500 bg-sage-50 ring-2 ring-sage-200' 
                          : 'border-sage-200 hover:border-sage-300'
                      } ${plan.bestValue ? 'bg-turmeric-50 border-turmeric-300' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-sage-700">{plan.name}</h4>
                          <p className="text-sm text-sage-600">{plan.duration}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-sage-700">₹{plan.price}</div>
                          <div className="text-sm text-sage-500 line-through">₹{plan.mrp}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {plan.popular && (
                          <Badge className="bg-terracotta-500 text-white text-xs">Most Popular</Badge>
                        )}
                        {plan.bestValue && (
                          <Badge className="bg-turmeric-500 text-white text-xs">Best Value</Badge>
                        )}
                        <Badge className="bg-sage-100 text-sage-700 text-xs">
                          Save ₹{plan.savings || (plan.mrp - plan.price)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-xl font-poppins text-sage-700">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sage-600">Selected Plan:</span>
                    <span className="font-medium text-sage-700">{selectedPlanData?.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sage-600">Plan Price:</span>
                    <span className="text-sage-700">₹{selectedPlanData?.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sage-600">Shipping:</span>
                    <span className="text-sage-700 font-medium">FREE</span>
                  </div>
                  
                  <Separator className="bg-sage-200" />
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-semibold text-sage-700">Total Amount:</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-sage-700">₹{selectedPlanData?.price}</div>
                      <div className="text-sm text-sage-500 line-through">₹{selectedPlanData?.mrp}</div>
                    </div>
                  </div>
                  
                  <div className="text-center py-2">
                    <Badge className="bg-terracotta-100 text-terracotta-700 text-lg px-4 py-2">
                      You Save ₹{selectedPlanData?.savings || (selectedPlanData?.mrp - selectedPlanData?.price)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card className="card-ayurveda border-turmeric-200 bg-turmeric-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-turmeric-600" />
                      <div>
                        <p className="font-semibold text-turmeric-800">Fast Delivery</p>
                        <p className="text-sm text-turmeric-700">
                          {settings?.checkout?.deliveryMessage || "Ships within 24 hours with free delivery"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-turmeric-600" />
                      <div>
                        <p className="font-semibold text-turmeric-800">
                          Delivery in {settings?.checkout?.deliveryDays || 3} days
                        </p>
                        <p className="text-sm text-turmeric-700">
                          Estimated delivery with tracking information
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-turmeric-600" />
                      <div>
                        <p className="font-semibold text-turmeric-800">Quality Guaranteed</p>
                        <p className="text-sm text-turmeric-700">
                          100% authentic Ayurvedic formula
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="text-center space-y-2">
                <div className="flex justify-center items-center gap-6 text-sm text-sage-600">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Money Back Guarantee</span>
                  </div>
                </div>
                
                <p className="text-xs text-sage-500">
                  Your information is protected with 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}