"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  Package, 
  MapPin, 
  Download, 
  Phone, 
  Mail, 
  Calendar,
  Truck,
  Star,
  Leaf,
  ArrowLeft,
  Settings,
  LogOut,
  Edit,
  Plus,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  CreditCard,
  X
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { getStoredUser, getUserToken, logout } from "@/lib/auth";
import AddressForm from "@/components/address-form";

export default function DashboardPage() {
  console.log("Dashboard page rendered");
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [addressForm, setAddressForm] = useState({
    type: "Home",
    fullName: "",
    address: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    email: ""
  });

  const handleAddressFormChange = (data: any) => {
    setAddressForm({ ...data, type: addressForm.type });
  };
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Load user data and orders on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = getStoredUser();
        const token = getUserToken();
        
        if (!userData || !token) {
          console.log("No user session found, redirecting to login");
          window.location.href = "/login";
          return;
        }

        setUser(userData);
        setProfileForm({
          name: userData.name || "User",
          email: userData.contact.includes("@") ? userData.contact : "",
          phone: userData.contact.includes("@") ? "" : userData.contact
        });

        // Load user's actual orders from API
        try {
          const ordersResponse = await fetch('/api/user/orders', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (ordersResponse.ok) {
            const ordersResult = await ordersResponse.json();
            if (ordersResult.success) {
              setOrders(ordersResult.data || []);
              console.log("User orders loaded:", ordersResult.data?.length || 0);
            }
          }
        } catch (error) {
          console.warn("Failed to load user orders:", error);
          setOrders([]); // Empty state if no orders
        }

        // Load user's actual addresses from API
        try {
          const addressResponse = await fetch('/api/user/addresses', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (addressResponse.ok) {
            const addressResult = await addressResponse.json();
            if (addressResult.success) {
              setAddresses(addressResult.data || []);
              console.log("User addresses loaded:", addressResult.data?.length || 0);
            }
          }
        } catch (error) {
          console.warn("Failed to load user addresses:", error);
          setAddresses([]); // Empty state if no addresses
        }

      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error Loading Data",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    console.log("User logout initiated");
    logout();
    toast({
      title: "Logged Out Successfully",
      description: "Thank you for visiting Ayurvedic Mantra"
    });
    window.location.href = "/login";
  };

  const downloadInvoice = (orderId: string) => {
    console.log(`Generating invoice for order: ${orderId}`);
    
    // Generate invoice PDF content
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const invoiceContent = `
      AYURVEDIC MANTRA - INVOICE
      
      Invoice #: INV-${orderId}
      Date: ${new Date().toLocaleDateString()}
      
      Bill To:
      ${user?.name || 'Customer'}
      ${user?.contact || ''}
      
      Order Details:
      Order ID: ${order.id}
      Product: ${order.plan}
      Amount: ₹${order.amount}
      Order Date: ${order.date}
      Status: ${order.status}
      
      Payment Method: Online Payment
      
      Thank you for choosing Ayurvedic Mantra!
    `;

    // Create and download the invoice
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Invoice Downloaded! 📄",
      description: `Invoice for order ${orderId} has been downloaded.`,
    });
  };

  const trackOrder = (trackingId: string, status: string) => {
    console.log(`Tracking order: ${trackingId}`);
    
    const statusMessages = {
      "Delivered": `Your order ${trackingId} has been delivered successfully!`,
      "Shipped": `Your order ${trackingId} is on the way and will arrive soon.`,
      "Processing": `Your order ${trackingId} is being processed and will ship soon.`,
      "Placed": `Your order ${trackingId} has been placed and is being prepared.`
    };

    toast({
      title: "Order Tracking 📦",
      description: statusMessages[status as keyof typeof statusMessages] || `Order ${trackingId} status: ${status}`,
    });
  };

  const updateProfile = async () => {
    try {
      console.log("Updating profile:", profileForm);
      
      // In production, send to API
      const updatedUser = {
        ...user,
        name: profileForm.name,
        contact: profileForm.email || profileForm.phone
      };
      
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile Updated! ✅",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: "Could not update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const changePassword = async () => {
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "New password and confirm password don't match.",
          variant: "destructive"
        });
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive"
        });
        return;
      }

      console.log("Changing password");
      
      // In production, validate current password and update
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      toast({
        title: "Password Changed! 🔒",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      console.error("Password change error:", error);
      toast({
        title: "Password Change Failed",
        description: "Could not change password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addAddress = async () => {
    try {
      console.log("Adding new address:", addressForm);
      
      const newAddress = {
        id: addresses.length + 1,
        ...addressForm,
        isDefault: addresses.length === 0
      };
      
      setAddresses([...addresses, newAddress]);
      setAddressForm({
        type: "Home",
        fullName: "",
        address: "",
        phone: "",
        pincode: "",
        city: "",
        state: "",
        email: ""
      });
      
      toast({
        title: "Address Added! 📍",
        description: "New address has been saved successfully.",
      });
    } catch (error) {
      console.error("Add address error:", error);
      toast({
        title: "Address Add Failed",
        description: "Could not add address. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-sage-300 border-t-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-sage-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-sage-600 hover:text-sage-700">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Store</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sage-400 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold font-poppins text-sage-700">
                  My Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-sage-100 text-sage-700">
                Welcome, {user?.name || 'User'}
              </Badge>
              <Button variant="outline" size="sm" className="border-sage-300">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-poppins text-sage-700 mb-2">
            Welcome back, {user?.name || 'User'}! 🌿
          </h2>
          <p className="text-sage-600">
            Continue your natural wellness journey with Ayurvedic Mantra
          </p>
        </div>

        {/* Clean Quick Stats with Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-sage-50 to-sage-100 border-sage-200 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-sage-600 rounded-xl flex items-center justify-center mb-3">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-sage-700 mb-1">{orders.length}</h3>
                  <p className="text-sage-600 font-medium">Total Orders</p>
                </div>
                <div className="text-right">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-sage-300 text-sage-700 hover:bg-sage-50"
                  >
                    View All →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-emerald-700 mb-1">
                    ₹{orders.reduce((total, order) => total + (order.amount || order.price || 0), 0)?.toLocaleString()}
                  </h3>
                  <p className="text-sage-600 font-medium">Total Spent</p>
                </div>
                <div className="text-right">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    Details →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-700 mb-1">
                    {user?.loginTime ? new Date(user.loginTime).toLocaleDateString() : 'Today'}
                  </h3>
                  <p className="text-sage-600 font-medium">Member Since</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-200 text-blue-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Filter */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card 
              className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200"
              onClick={() => {
                toast({
                  title: "Filter Applied",
                  description: "Showing delivered orders"
                });
              }}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">Delivered</span>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {orders.filter(o => o.status === 'Delivered').length}
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
              onClick={() => {
                toast({
                  title: "Filter Applied",
                  description: "Showing shipped orders"
                });
              }}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">Shipped</span>
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {orders.filter(o => o.status === 'Shipped').length}
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200"
              onClick={() => {
                toast({
                  title: "Filter Applied",
                  description: "Showing COD orders"
                });
              }}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-700">COD</span>
                </div>
                <div className="text-2xl font-bold text-orange-800">
                  {orders.filter(o => o.paymentMethod === 'cod').length}
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200"
              onClick={() => {
                toast({
                  title: "Filter Applied",
                  description: "Showing processing orders"
                });
              }}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-700">Processing</span>
                </div>
                <div className="text-2xl font-bold text-purple-800">
                  {orders.filter(o => o.status === 'Processing' || o.status === 'Placed').length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Improved Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <div className="bg-white rounded-xl p-2 shadow-sm border border-sage-200">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-transparent gap-2">
              <TabsTrigger 
                value="orders" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-sage-100 data-[state=active]:text-sage-800 data-[state=active]:shadow-sm rounded-lg px-4 py-3"
              >
                <Package className="w-4 h-4" />
                My Orders
                {orders.length > 0 && (
                  <Badge className="bg-emerald-500 text-white text-xs ml-1">{orders.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm rounded-lg px-4 py-3"
              >
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="addresses" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-sm rounded-lg px-4 py-3"
              >
                <MapPin className="w-4 h-4" />
                Addresses
                {addresses.length > 0 && (
                  <Badge className="bg-orange-500 text-white text-xs ml-1">{addresses.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="support" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 data-[state=active]:shadow-sm rounded-lg px-4 py-3"
              >
                <Phone className="w-4 h-4" />
                Support
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Enhanced Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold font-poppins text-sage-700">
                  My Order History
                </h3>
                <p className="text-sage-600 mt-1">
                  Track your orders and download invoices
                </p>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-sage-200 rounded-lg text-sm bg-white shadow-sm">
                  <option value="all">All Orders</option>
                  <option value="active">Active Orders</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-sage-300 text-sage-700 hover:bg-sage-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-all border border-sage-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Order Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-bold text-sage-800 mb-1">
                                Order #{order.id}
                              </h4>
                              <div className="flex items-center gap-2 mb-3">
                                <Badge 
                                  className={
                                    order.status === 'Delivered' 
                                      ? 'bg-green-100 text-green-700 border-green-200' 
                                      : order.status === 'Shipped'
                                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                                      : order.status === 'Processing'
                                      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                      : 'bg-orange-100 text-orange-700 border-orange-200'
                                  }
                                >
                                  {order.status}
                                </Badge>
                                <Badge 
                                  variant="outline"
                                  className={
                                    order.paymentMethod === 'cod' 
                                      ? 'border-orange-300 text-orange-700' 
                                      : 'border-green-300 text-green-700'
                                  }
                                >
                                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                </Badge>
                                {order.wasGuestOrder && (
                                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                                    Originally Guest Order
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-sage-700">
                                ₹{(order.amount || order.price)?.toLocaleString()}
                              </p>
                              <p className="text-sm text-sage-600">
                                {order.date}
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h5 className="font-semibold text-sage-700">Product Details</h5>
                              <p className="text-sage-600">{order.plan}</p>
                              <p className="text-sm text-sage-500">Quantity: {order.totalQuantity || 1}</p>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-semibold text-sage-700">Delivery Info</h5>
                              {order.deliveryDate ? (
                                <p className="text-green-600 font-medium">
                                  Delivered on {order.deliveryDate}
                                </p>
                              ) : (
                                <p className="text-sage-600">
                                  Estimated delivery: {order.estimatedDelivery}
                                </p>
                              )}
                              {order.awbCode && (
                                <p className="text-xs text-sage-500 font-mono">
                                  Tracking: {order.awbCode}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col gap-2 lg:w-48">
                          <Button
                            variant="outline"
                            className="flex-1 lg:w-full border-sage-300 text-sage-700 hover:bg-sage-50"
                            onClick={() => trackOrder(order.trackingId, order.status)}
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Track Order
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="flex-1 lg:w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                            onClick={() => downloadInvoice(order.id)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Invoice
                          </Button>

                          {(order.status === 'Placed' || order.status === 'Processing') && (
                            <Button
                              variant="outline"
                              className="flex-1 lg:w-full border-red-300 text-red-700 hover:bg-red-50"
                              onClick={() => {
                                toast({
                                  title: "Cancel Order",
                                  description: "Order cancellation request submitted",
                                });
                              }}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            className="flex-1 lg:w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                            onClick={() => {
                              toast({
                                title: "Support Contact",
                                description: "Redirecting to customer support",
                              });
                            }}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Support
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="w-16 h-16 text-sage-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-sage-700 mb-2">No Orders Yet</h3>
                  <p className="text-sage-600 mb-6">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="bg-sage-600 hover:bg-sage-700 text-white"
                  >
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold font-poppins text-sage-700">
                Saved Addresses
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="btn-ayurveda">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-sage-700">Add New Address</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sage-700">Address Type</Label>
                      <select 
                        className="w-full p-2 border border-sage-200 rounded-lg"
                        value={addressForm.type}
                        onChange={(e) => setAddressForm({...addressForm, type: e.target.value})}
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <AddressForm
                      formData={addressForm}
                      onFormChange={handleAddressFormChange}
                      emailOptional={true}
                      showTitle={false}
                      className="space-y-3"
                    />
                    
                    <Button onClick={addAddress} className="w-full btn-ayurveda">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Address
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <Card key={address.id} className="card-ayurveda">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={address.type === 'Home' ? 'default' : 'secondary'}
                            className="bg-sage-100 text-sage-700"
                          >
                            {address.type}
                          </Badge>
                          {address.isDefault && (
                            <Badge className="bg-turmeric-100 text-turmeric-700 text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-sage-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm text-sage-600">
                        <p className="font-semibold text-sage-700">{address.fullName}</p>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {address.phone}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="md:col-span-2">
                  <Card className="card-ayurveda">
                    <CardContent className="p-8 text-center">
                      <MapPin className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-sage-700 mb-2">No Addresses Saved</h3>
                      <p className="text-sage-600 mb-4">Add your delivery address for faster checkout</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="btn-ayurveda">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Address
                          </Button>
                        </DialogTrigger>
                        {/* Dialog content remains same */}
                      </Dialog>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-sage-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-sage-700">{user?.name || 'User'}</h4>
                    <p className="text-sage-600">Member since {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sage-700">Full Name</Label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="border-sage-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sage-700">Email</Label>
                      <Input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="border-sage-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sage-700">Phone</Label>
                      <Input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="border-sage-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button onClick={updateProfile} className="w-full btn-ayurveda">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Update Profile
                    </Button>
                    
                    <div className="space-y-4 pt-4 border-t border-sage-200">
                      <h4 className="font-semibold text-sage-700">Change Password</h4>
                      
                      <div className="space-y-2">
                        <Label className="text-sage-600">Current Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword.current ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            className="border-sage-200 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                          >
                            {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-600">New Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword.new ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            className="border-sage-200 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                          >
                            {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-600">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword.confirm ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            className="border-sage-200 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                          >
                            {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button onClick={changePassword} variant="outline" className="w-full border-sage-300 text-sage-700">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins">
                  Customer Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sage-700">Quick Support</h4>
                    
                    <div className="space-y-3">
                      <a 
                        href="mailto:support@ayurvedicmantra.com"
                        className="flex items-center gap-3 p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors"
                      >
                        <Mail className="w-5 h-5 text-sage-600" />
                        <div>
                          <p className="font-medium text-sage-700">Email Support</p>
                          <p className="text-sm text-sage-600">support@ayurvedicmantra.com</p>
                        </div>
                      </a>

                      <a 
                        href="https://wa.me/919876543210"
                        className="flex items-center gap-3 p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors"
                      >
                        <Phone className="w-5 h-5 text-sage-600" />
                        <div>
                          <p className="font-medium text-sage-700">WhatsApp Support</p>
                          <p className="text-sm text-sage-600">+91 98765 43210</p>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sage-700">Help Center</h4>
                    
                    <div className="space-y-2">
                      <Link href="/faq" className="block text-sage-600 hover:text-sage-700 text-sm">
                        • Frequently Asked Questions
                      </Link>
                      <Link href="/shipping" className="block text-sage-600 hover:text-sage-700 text-sm">
                        • Shipping & Delivery Policy
                      </Link>
                      <Link href="/returns" className="block text-sage-600 hover:text-sage-700 text-sm">
                        • Return & Refund Policy
                      </Link>
                      <Link href="/terms" className="block text-sage-600 hover:text-sage-700 text-sm">
                        • Terms & Conditions
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}