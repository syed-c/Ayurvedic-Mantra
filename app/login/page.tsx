"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Leaf, Mail, Phone, Lock, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import AddressForm from "@/components/address-form";

export default function LoginPage() {
  console.log("Login page rendered");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("otp");

  const [emailForm, setEmailForm] = useState({
    email: "",
    password: ""
  });

  const [otpForm, setOtpForm] = useState({
    contact: "",
    otp: "",
    contactType: "email" // email or phone
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    address: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleRegisterFormChange = (data: any) => {
    setRegisterForm({ ...data, password: registerForm.password, confirmPassword: registerForm.confirmPassword });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Email login attempt:", emailForm.email);

    // Simulate login API call
    setTimeout(() => {
      toast({
        title: "Login Successful! 🎉",
        description: "Welcome back to Ayurvedic Mantra",
      });
      console.log("Redirecting to dashboard");
      // In real implementation, redirect to dashboard
      window.location.href = "/dashboard";
      setIsLoading(false);
    }, 1500);
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("OTP verification attempt:", otpForm.contact, "OTP:", otpForm.otp);

    if (!otpForm.otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the OTP sent to your device",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/secure-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: otpForm.contact,
          contactType: otpForm.contactType,
          otp: otpForm.otp,
          action: 'verify-otp'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Handle registration completion if pending
        const pendingRegistration = localStorage.getItem('pendingRegistration');
        if (pendingRegistration) {
          const regData = JSON.parse(pendingRegistration);
          
          // Complete user profile with registration data
          const updatedUser = {
            ...result.data.user,
            name: regData.fullName,
            address: regData.address,
            city: regData.city,
            state: regData.state,
            pincode: regData.pincode,
            phone: regData.phone,
            isNewRegistration: true
          };
          
          localStorage.setItem('userData', JSON.stringify(updatedUser));
          localStorage.removeItem('pendingRegistration');
          
          toast({
            title: "Registration Complete! 🎉",
            description: "Welcome to Ayurvedic Mantra family",
          });
        } else {
          toast({
            title: "Login Successful! ✅",
            description: "Welcome back to Ayurvedic Mantra",
          });
        }
        
        // Store user session
        localStorage.setItem('userToken', result.data.token);
        if (!pendingRegistration) {
          localStorage.setItem('userData', JSON.stringify(result.data.user));
        }
        
        console.log("Redirecting to dashboard");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        toast({
          title: "Verification Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log("Registration attempt:", registerForm.email, "Name:", registerForm.fullName);

    try {
      // First send OTP to email for verification
      const otpResponse = await fetch('/api/auth/secure-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: registerForm.email,
          contactType: 'email',
          action: 'send-otp'
        })
      });

      const otpResult = await otpResponse.json();

      if (otpResult.success) {
        // Store registration data temporarily
        localStorage.setItem('pendingRegistration', JSON.stringify(registerForm));
        
        toast({
          title: "Verification Required 📧",
          description: "Please check your email and enter the OTP to complete registration",
        });
        
        // Switch to OTP tab and set email
        setOtpForm({
          contact: registerForm.email,
          contactType: 'email',
          otp: ''
        });
        setActiveTab('otp');
        
        // Show debug OTP in development
        if (otpResult.debug?.otp) {
          setTimeout(() => {
            toast({
              title: "Development Mode",
              description: `Debug OTP: ${otpResult.debug.otp}`,
            });
          }, 1000);
        }
      } else {
        toast({
          title: "Registration Failed",
          description: otpResult.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Error",
        description: "Failed to start registration. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const sendOTP = async () => {
    if (!otpForm.contact) {
      toast({
        title: "Contact Required",
        description: `Please enter your ${otpForm.contactType}`,
        variant: "destructive"
      });
      return;
    }

    console.log("Sending OTP to:", otpForm.contact, "via", otpForm.contactType);
    
    try {
      const response = await fetch('/api/auth/secure-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: otpForm.contact,
          contactType: otpForm.contactType,
          action: 'send-otp'
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: `OTP Sent! ${otpForm.contactType === 'email' ? '📧' : '📱'}`,
          description: result.message,
        });
        
        // SECURITY: No OTP exposure in production
        console.log("✅ OTP sent securely via email - check inbox");
      } else {
        toast({
          title: "Failed to Send OTP",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-overlay opacity-30"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-sage-400 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-poppins text-sage-700">
              Ayurvedic Mantra
            </h1>
          </div>
          
          <Badge className="bg-turmeric-100 text-turmeric-700 px-4 py-2">
            🌿 Natural Wellness Portal
          </Badge>
        </div>

        <Card className="card-ayurveda">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-poppins text-sage-700">
              Welcome Back
            </CardTitle>
            <p className="text-sage-600">Sign in to continue your wellness journey</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-sage-100">
                <TabsTrigger value="otp" className="text-sage-700">OTP Login</TabsTrigger>
                <TabsTrigger value="register" className="text-sage-700">Register</TabsTrigger>
              </TabsList>



              {/* OTP Login */}
              <TabsContent value="otp" className="space-y-4 mt-6">
                <div className="bg-turmeric-50 p-4 rounded-lg border border-turmeric-200 mb-4">
                  <div className="flex items-center gap-2 text-turmeric-700">
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">Secure OTP Login - Required</span>
                  </div>
                  <p className="text-sm text-turmeric-600 mt-1">
                    For security, we only allow OTP-based authentication. No password login available.
                  </p>
                </div>

                <form onSubmit={handleOTPLogin} className="space-y-4">
                  {/* Contact Type Selection */}
                  <div className="space-y-2">
                    <Label className="text-sage-700 font-medium">Login Method</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={otpForm.contactType === 'email' ? 'default' : 'outline'}
                        className={`w-full ${otpForm.contactType === 'email' ? 'bg-sage-600 text-white' : 'border-sage-300 text-sage-700'}`}
                        onClick={() => setOtpForm({...otpForm, contactType: 'email'})}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                      <Button
                        type="button"
                        variant={otpForm.contactType === 'phone' ? 'default' : 'outline'}
                        className={`w-full ${otpForm.contactType === 'phone' ? 'bg-sage-600 text-white' : 'border-sage-300 text-sage-700'}`}
                        onClick={() => setOtpForm({...otpForm, contactType: 'phone'})}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Phone
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-sage-700 font-medium">
                      {otpForm.contactType === 'email' ? 'Email Address' : 'Phone Number'}
                    </Label>
                    <div className="relative">
                      {otpForm.contactType === 'email' ? (
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-sage-500" />
                      ) : (
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-sage-500" />
                      )}
                      <Input
                        id="contact"
                        type={otpForm.contactType === 'email' ? 'email' : 'tel'}
                        placeholder={otpForm.contactType === 'email' ? 'your@email.com' : '9876543210'}
                        className="pl-10 border-sage-200 focus:border-sage-400"
                        value={otpForm.contact}
                        onChange={(e) => setOtpForm({...otpForm, contact: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter OTP"
                      className="border-sage-200 focus:border-sage-400"
                      value={otpForm.otp}
                      onChange={(e) => setOtpForm({...otpForm, otp: e.target.value})}
                      required
                    />
                    <Button 
                      type="button" 
                      onClick={sendOTP}
                      variant="outline"
                      className="border-sage-300 text-sage-700 hover:bg-sage-50"
                    >
                      Send OTP
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-ayurveda"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Login with OTP"}
                  </Button>
                </form>
              </TabsContent>

              {/* Register */}
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Address Information */}
                  <AddressForm
                    formData={registerForm}
                    onFormChange={handleRegisterFormChange}
                    emailOptional={false}
                    showTitle={false}
                    className="space-y-3"
                  />

                  {/* Password Section */}
                  <div className="space-y-4 pt-4 border-t border-sage-200">
                    <h4 className="font-medium text-sage-700">Account Security</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-password" className="text-sage-700 font-medium">
                          Password
                        </Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="••••••••"
                          className="border-sage-200 focus:border-sage-400"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-sage-700 font-medium">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          className="border-sage-200 focus:border-sage-400"
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-ayurveda"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Trust Indicators */}
            <div className="pt-4 border-t border-sage-200 text-center space-y-2">
              <p className="text-xs text-sage-500">
                By signing in, you agree to our Terms & Conditions
              </p>
              <div className="flex justify-center gap-4 text-xs text-sage-500">
                <span>🔒 Secure & Private</span>
                <span>✅ Trusted by 15,000+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}