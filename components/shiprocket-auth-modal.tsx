"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Truck, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShiprocketAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export default function ShiprocketAuthModal({ isOpen, onClose, onSuccess }: ShiprocketAuthModalProps) {
  const { toast } = useToast();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError("");
    
    console.log("🚚 Starting Shiprocket Super Admin authentication");

    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password");
      setIsAuthenticating(false);
      return;
    }

    try {
      const response = await fetch('/api/shiprocket/super-admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();
      console.log("Shiprocket authentication result:", result);

      if (result.success) {
        console.log("✅ Shiprocket authentication successful!");
        
        toast({
          title: result.message,
          description: "Your Shiprocket account has been connected successfully. All shipping APIs are now available.",
        });

        // Save authentication status to localStorage for UI updates
        localStorage.setItem('shiprocketAuth', JSON.stringify({
          authenticated: true,
          email: credentials.email,
          authenticatedAt: new Date().toISOString(),
          token: result.data.token
        }));

        onSuccess(result.data);
        onClose();
        
        // Reset form
        setCredentials({ email: "", password: "" });
      } else {
        console.log("❌ Shiprocket authentication failed");
        setError(result.message || "Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("❌ Shiprocket authentication error:", error);
      setError("❌ Shiprocket login failed. Please check credentials.");
    }

    setIsAuthenticating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sage-700">
            <Truck className="w-5 h-5" />
            Shiprocket Super Admin Authentication
          </DialogTitle>
          <DialogDescription>
            Connect your Shiprocket Super Admin account to enable automated shipping and order management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAuthenticate} className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="shiprocket-email" className="text-sage-700">
              Shiprocket Super Admin Email
            </Label>
            <Input
              id="shiprocket-email"
              type="email"
              placeholder="your@shiprocket-account.com"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="border-sage-200 focus:border-sage-400"
              required
              disabled={isAuthenticating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shiprocket-password" className="text-sage-700">
              Shiprocket Super Admin Password
            </Label>
            <Input
              id="shiprocket-password"
              type="password"
              placeholder="Your Shiprocket account password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="border-sage-200 focus:border-sage-400"
              required
              disabled={isAuthenticating}
            />
          </div>

          <div className="bg-turmeric-50 border border-turmeric-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-turmeric-600 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-turmeric-800">What happens after authentication?</p>
                <ul className="text-xs text-turmeric-700 space-y-1">
                  <li>• API token will be securely saved in system settings</li>
                  <li>• Auto-fetch all shipping APIs (orders, tracking, serviceability)</li>
                  <li>• Enable automated order creation in Shiprocket</li>
                  <li>• Real-time shipping status updates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-sage-300 text-sage-700"
              onClick={onClose}
              disabled={isAuthenticating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-sage-600 hover:bg-sage-700 text-white"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Connect Shiprocket
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}