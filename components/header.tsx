"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  console.log("Header component rendered");
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in with proper validation
    try {
      const userData = localStorage.getItem('userData');
      const userToken = localStorage.getItem('userToken');
      
      if (userData && userToken) {
        const parsedUser = JSON.parse(userData);
        // Validate user data structure
        if (parsedUser && parsedUser.contact && parsedUser.verified) {
          setUser(parsedUser);
          console.log("User authenticated:", parsedUser.contact);
        } else {
          // Clear invalid user data
          localStorage.removeItem('userData');
          localStorage.removeItem('userToken');
        }
      }
    } catch (error) {
      console.error("Error validating user session:", error);
      localStorage.removeItem('userData');
      localStorage.removeItem('userToken');
    }

    // Fetch website settings for header data
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/public/settings');
        const result = await response.json();
        if (result.success) {
          setSettings(result.data);
          console.log("Header settings loaded:", result.data.site);
        }
      } catch (error) {
        console.error("Error loading header settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const scrollToSection = (sectionId: string) => {
    console.log(`Scrolling to section: ${sectionId}`);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    // Comprehensive logout
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    localStorage.removeItem('cartData'); // Clear any cart data
    setUser(null);
    console.log("User logged out completely");
    
    toast({
      title: "Logged Out Successfully",
      description: "Come back soon for your wellness journey!"
    });
    
    // Redirect to home after logout
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-sage-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold font-poppins text-sage-700">
              {settings?.site?.title || "Ayurvedic Mantra"}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('benefits')}
              className="text-sage-600 hover:text-sage-800 font-medium transition-colors"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection('pricing-plans')}
              className="text-sage-600 hover:text-sage-800 font-medium transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-sage-600 hover:text-sage-800 font-medium transition-colors"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-sage-600 hover:text-sage-800 font-medium transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => window.location.href = '/product'}
              className="text-sage-600 hover:text-sage-800 font-medium transition-colors"
            >
              Product
            </button>
          </nav>

          {/* CTA & Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              onClick={() => window.location.href = '/checkout?plan=3'}
              className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              Order Now
            </Button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  className="border-sage-300 text-sage-700 hover:bg-sage-50 px-4 py-2 rounded-lg font-medium"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  className="text-sage-600 hover:text-sage-800 px-3 py-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline"
                className="border-sage-300 text-sage-700 hover:bg-sage-50 px-6 py-2 rounded-lg font-medium"
                onClick={() => window.location.href = '/login'}
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-sage-600 hover:text-sage-800"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-sage-200 py-4 space-y-4">
            <button
              onClick={() => scrollToSection('benefits')}
              className="block w-full text-left px-4 py-2 text-sage-600 hover:text-sage-800 font-medium"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection('pricing-plans')}
              className="block w-full text-left px-4 py-2 text-sage-600 hover:text-sage-800 font-medium"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left px-4 py-2 text-sage-600 hover:text-sage-800 font-medium"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left px-4 py-2 text-sage-600 hover:text-sage-800 font-medium"
            >
              FAQ
            </button>
            <button
              onClick={() => window.location.href = '/product'}
              className="block w-full text-left px-4 py-2 text-sage-600 hover:text-sage-800 font-medium"
            >
              Product
            </button>
            <div className="px-4 pt-2 space-y-2">
              <Button 
                onClick={() => window.location.href = '/checkout?plan=3'}
                className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white py-2 rounded-lg font-medium"
              >
                Order Now
              </Button>
              
              {user ? (
                <div className="space-y-2">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard'}
                    className="w-full border-sage-300 text-sage-700 hover:bg-sage-50 py-2 rounded-lg font-medium"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full text-sage-600 hover:text-sage-800 py-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/login'}
                  className="w-full border-sage-300 text-sage-700 hover:bg-sage-50 py-2 rounded-lg font-medium"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}