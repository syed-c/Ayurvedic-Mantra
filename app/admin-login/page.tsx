"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Shield, 
  Mail, 
  Lock, 
  Leaf,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AUTHORIZED_ADMIN_EMAIL = "orders@ayurvedicmantra.com";

export default function AdminLoginPage() {
  console.log("🔐 SECURE Admin login page rendered");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [timeLeft, setTimeLeft] = useState(0);

  const [emailForm, setEmailForm] = useState({
    email: ""
  });

  const [otpForm, setOtpForm] = useState({
    otp: ""
  });

  // Check if already logged in as admin
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      console.log("Admin already logged in, redirecting to dashboard");
      toast({
        title: "Already Logged In",
        description: "Redirecting to admin dashboard...",
      });
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);
    }
  }, [toast]);

  // OTP timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log("🔐 SECURE Admin OTP request for:", emailForm.email);

    // SECURITY: Client-side validation for authorized email
    if (emailForm.email !== AUTHORIZED_ADMIN_EMAIL) {
      toast({
        title: "❌ Access Denied",
        description: "This email is not authorized for admin access.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/secure-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          contact: emailForm.email,
          contactType: 'email',
          action: 'send-otp',
          userType: 'admin'
        })
      });

      const result = await response.json();
      console.log("SECURE OTP request response:", result);

      if (result.success) {
        toast({
          title: "🔐 Secure OTP Sent",
          description: "Please check your email inbox for the admin verification code.",
        });
        
        setStep('otp');
        setTimeLeft(600); // 10 minutes
        
        console.log("✅ SECURE Admin OTP sent, switched to verification step");
      } else {
        toast({
          title: "❌ Failed to Send OTP",
          description: result.message || "Unable to send OTP. Please try again.",
          variant: "destructive"
        });
        console.log("❌ SECURE OTP request failed:", result.message);
      }
    } catch (error) {
      console.error("SECURE OTP request error:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to secure authentication service.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log("🔐 SECURE Admin OTP verification for:", emailForm.email);

    try {
      const response = await fetch('/api/auth/secure-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          contact: emailForm.email,
          contactType: 'email',
          otp: otpForm.otp,
          action: 'verify-otp'
        })
      });

      const result = await response.json();
      console.log("SECURE OTP verification response:", result);

      if (result.success && result.data.type === 'admin') {
        // Store admin session securely
        localStorage.setItem('adminToken', result.data.token);
        localStorage.setItem('adminData', JSON.stringify(result.data.admin));
        // Ensure middleware can see the session immediately
        try {
          document.cookie = `adminToken=${result.data.token}; path=/; max-age=${8 * 60 * 60}; SameSite=Lax`;
        } catch {}
        
        console.log("✅ SECURE Admin session stored successfully");
        
        toast({
          title: "✅ Secure Admin Access Granted!",
          description: "Authentication successful. Redirecting to dashboard...",
        });

        // Redirect to admin panel with token as query for middleware bootstrap fallback
        setTimeout(() => {
          console.log("🔄 Redirecting to secure admin dashboard");
          const token = encodeURIComponent(result.data.token);
          window.location.replace(`/admin?adminToken=${token}`);
        }, 500);

      } else {
        toast({
          title: "❌ Verification Failed",
          description: result.message || "Invalid OTP. Please try again.",
          variant: "destructive"
        });
        console.log("❌ SECURE OTP verification failed:", result.message);
      }
    } catch (error) {
      console.error("SECURE OTP verification error:", error);
      toast({
        title: "Verification Error",
        description: "Unable to verify OTP. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleResendOTP = () => {
    setOtpForm({ otp: "" });
    setStep('email');
    setTimeLeft(0);
    toast({
      title: "Ready to Resend",
      description: "You can now request a new OTP.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      {/* Security Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-poppins text-red-700">
              Ayurvedic Mantra
            </h1>
          </div>
          
          <Badge className="bg-red-700 text-white px-4 py-2 mb-2">
            🔒 SECURE ADMIN PORTAL
          </Badge>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Enhanced Security Active</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              OTP-only authentication • Admin access restricted
            </p>
          </div>
        </div>

        <Card className="border-red-200 shadow-lg">
          <CardHeader className="text-center pb-4 bg-red-50 rounded-t-lg">
            <CardTitle className="text-xl font-poppins text-red-700 flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Super Admin Access
            </CardTitle>
            <p className="text-red-600 text-sm">Secure OTP verification required</p>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {step === 'email' && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-red-700 font-medium">
                    Authorized Admin Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="orders@ayurvedicmantra.com"
                      className="pl-10 border-red-200 focus:border-red-400"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({email: e.target.value})}
                      required
                    />
                  </div>
                  <p className="text-xs text-red-500">
                    Only the authorized admin email can access this portal
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-700 hover:bg-red-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending Secure OTP..." : "Send Secure OTP"}
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">OTP Sent Successfully</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Check your email: {emailForm.email}
                  </p>
                  {timeLeft > 0 && (
                    <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Expires in: {formatTime(timeLeft)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-otp" className="text-red-700 font-medium">
                    Enter 6-Digit OTP
                  </Label>
                  <Input
                    id="admin-otp"
                    type="text"
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest border-red-200 focus:border-red-400"
                    value={otpForm.otp}
                    onChange={(e) => setOtpForm({otp: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white"
                    disabled={isLoading || otpForm.otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleResendOTP}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    disabled={timeLeft > 0}
                  >
                    {timeLeft > 0 ? `${Math.floor(timeLeft/60)}m` : "Resend"}
                  </Button>
                </div>
              </form>
            )}

            {/* Security Info */}
            <div className="pt-4 border-t border-red-200 text-center space-y-2">
              <p className="text-xs text-red-600">
                🔒 End-to-end encrypted • Zero-trust authentication
              </p>
              <div className="flex justify-center gap-4 text-xs text-red-500">
                <span>✅ No passwords</span>
                <span>🛡️ OTP-only access</span>
                <span>⏰ Time-limited sessions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-red-600 hover:text-red-700">
            ← Back to Website
          </Link>
          <p className="text-xs text-red-500 mt-2">
            Unauthorized access attempts are logged and monitored
          </p>
        </div>
      </div>
    </div>
  );
}