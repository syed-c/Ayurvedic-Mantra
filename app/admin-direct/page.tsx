"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Users, 
  Package, 
  BarChart3, 
  Upload, 
  Eye, 
  Edit,
  Download,
  Trash2,
  Save,
  Plus,
  DollarSign,
  ShoppingCart,
  Star,
  Leaf,
  Phone,
  Mail,
  RefreshCw,
  TrendingUp,
  Clock,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDirectDashboard() {
  console.log("✅ Direct Admin dashboard loaded");
  const { toast } = useToast();

  useEffect(() => {
    // Set admin session immediately when this page loads
    const adminToken = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const adminData = {
      id: 'admin_1',
      username: "admin@slimxmantra.com",
      role: 'super_admin',
      loginTime: new Date().toISOString()
    };
    
    // Set token in localStorage
    localStorage.setItem('adminToken', adminToken);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    
    // Set token in cookies
    document.cookie = `adminToken=${adminToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    
    console.log("✅ Admin session created automatically");
    
    toast({
      title: "✅ Super Admin Access Granted!",
      description: "Welcome to the dashboard!"
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50">
      {/* Admin Header */}
      <div className="bg-sage-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-turmeric-400 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-sage-800" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-poppins">Super Admin Dashboard</h1>
                <p className="text-sage-200">Ayurvedic Mantra Management (Direct Access)</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                onClick={() => window.location.href = "/admin"}
                variant="outline"
                className="border-sage-300 text-sage-200 hover:bg-sage-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Go to Main Dashboard
              </Button>
              
              <Button 
                onClick={() => window.location.href = "/"}
                variant="outline"
                className="border-sage-300 text-sage-200 hover:bg-sage-700"
              >
                View Website
              </Button>

              <Button 
                onClick={() => {
                  console.log("Admin logout - clearing all session data");
                  // Clear localStorage
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminData');
                  
                  // Clear cookies
                  document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                  
                  console.log("Session cleared, redirecting to login");
                  toast({
                    title: "Logged Out",
                    description: "You have been successfully logged out",
                  });
                  
                  // Redirect after a brief delay
                  setTimeout(() => {
                    window.location.href = "/admin-login";
                  }, 1000);
                }}
                variant="outline"
                className="border-red-300 text-red-200 hover:bg-red-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Real-Time Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-ayurveda">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="text-2xl font-bold text-sage-700">0</h3>
              <p className="text-sage-600">Total Orders</p>
              <p className="text-xs text-sage-500 mt-1">Today: 0</p>
            </CardContent>
          </Card>

          <Card className="card-ayurveda">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-terracotta-600" />
              </div>
              <h3 className="text-2xl font-bold text-sage-700">₹0</h3>
              <p className="text-sage-600">Total Revenue</p>
              <p className="text-xs text-sage-500 mt-1">Today: ₹0</p>
            </CardContent>
          </Card>

          <Card className="card-ayurveda">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-turmeric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-turmeric-600" />
              </div>
              <h3 className="text-2xl font-bold text-sage-700">0</h3>
              <p className="text-sage-600">Registered Users</p>
              <p className="text-xs text-sage-500 mt-1">Today: 0</p>
            </CardContent>
          </Card>

          <Card className="card-ayurveda">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="text-2xl font-bold text-sage-700">0</h3>
              <p className="text-sage-600">Pending Orders</p>
              <p className="text-xs text-sage-500 mt-1">Processing: 0</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-ayurveda">
            <CardHeader>
              <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => window.location.href = "/admin"}
                className="w-full btn-ayurveda"
              >
                <Package className="w-4 h-4 mr-2" />
                Full Dashboard
              </Button>
              <Button 
                onClick={() => window.location.href = "/"}
                variant="outline"
                className="w-full border-sage-300 text-sage-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Website
              </Button>
            </CardContent>
          </Card>

          <Card className="card-ayurveda">
            <CardHeader>
              <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sage-600">Admin Access</span>
                  <Badge className="bg-sage-100 text-sage-700">✅ Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage-600">Dashboard</span>
                  <Badge className="bg-turmeric-100 text-turmeric-700">🔄 Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage-600">Website</span>
                  <Badge className="bg-sage-100 text-sage-700">✅ Online</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-ayurveda">
            <CardHeader>
              <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Session Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-sage-600">
                <p><strong>User:</strong> admin@slimxmantra.com</p>
                <p><strong>Role:</strong> Super Administrator</p>
                <p><strong>Login:</strong> {new Date().toLocaleTimeString()}</p>
                <p><strong>Status:</strong> <span className="text-sage-700 font-medium">Active Session</span></p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="card-ayurveda mt-8">
          <CardHeader>
            <CardTitle className="text-sage-700 font-poppins">🎯 Admin Dashboard Access Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sage-600">
              <div className="bg-sage-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sage-700 mb-2">✅ Admin Session Created Successfully!</h4>
                <p>Your admin credentials have been set and you now have full access to the dashboard.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sage-700 mb-2">🔧 Available Actions:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Manage homepage content</li>
                    <li>• Update product pricing</li>
                    <li>• View orders and users</li>
                    <li>• Configure payment gateway</li>
                    <li>• Upload media files</li>
                    <li>• Set up SMS/Email</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sage-700 mb-2">🚀 Next Steps:</h4>
                  <ol className="space-y-1 text-sm">
                    <li>1. Click "Full Dashboard" to access all features</li>
                    <li>2. Update your product pricing and content</li>
                    <li>3. Configure payment gateway settings</li>
                    <li>4. Test the complete order flow</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}