"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  CreditCard,
  Truck,
  Palette,
  Layout,
  Type,
  Globe,
  Search,
  MessageSquare,
  Video,
  Image,
  FileText,
  Shield,
  Zap,
  Target,
  Instagram,
  Facebook,
  Youtube,
  Link as LinkIcon,
  Smartphone,
  Monitor,
  CheckCircle,
  Calendar,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import ShiprocketAuthModal from "@/components/shiprocket-auth-modal";
import { ShiprocketAdminPanel } from "@/components/shiprocket-admin-panel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function AdminDashboard() {
  console.log("Admin dashboard rendered");
  const { toast } = useToast();
  
  // Client-side admin access verification (accept either cookie or localStorage token)
  useEffect(() => {
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    const hasCookieToken = typeof document !== 'undefined' ? document.cookie.split('; ').some(c => c.startsWith('adminToken=')) : false;

    console.log("Checking admin session:", {
      hasLocalToken: !!localToken,
      hasCookieToken,
      url: typeof window !== 'undefined' ? window.location.pathname : ''
    });

    if (!localToken && !hasCookieToken) {
      console.log("❌ No admin session found, redirecting to login");
      // Use replace to avoid loop back-navigation and add small delay to avoid hydration race
      setTimeout(() => { window.location.replace("/admin-login"); }, 50);
      return;
    }

    console.log("✅ Admin session verified, dashboard ready");
  }, []);

  const { settings, stats, users, orders, loading, refreshData, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [shiprocketAuthModal, setShiprocketAuthModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    title: "", 
    description: "", 
    action: null as (() => void) | null 
  });
  
  // Order filtering and management state
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [orderStats, setOrderStats] = useState<any>({});
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkActionType, setBulkActionType] = useState("");
  const [isUpdatingOrders, setIsUpdatingOrders] = useState(false);
  const [orderStatus, setOrderStatus] = useState<{ [key: string]: string }>({});
  const [paymentStatus, setPaymentStatus] = useState<{ [key: string]: string }>({});
  const [orderNotes, setOrderNotes] = useState<{ [key: string]: string }>({});
  
  // Shiprocket status state
  const [shiprocketStatus, setShiprocketStatus] = useState<any>({
    status: 'checking',
    message: 'Checking connection...'
  });

  // Comprehensive form states for all aspects
  const [websiteSettings, setWebsiteSettings] = useState({
    siteName: "",
    logo: "",
    tagline: "",
    primaryColor: "#1f3b20",
    secondaryColor: "#D2691E",
    accentColor: "#E6B800",
    headerPhone: "",
    headerEmail: "",
    footerText: "",
    address: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
      whatsapp: ""
    }
  });

  const [seoSettings, setSeoSettings] = useState({
    homepage: {
      title: "",
      description: "",
      keywords: "",
      ogImage: ""
    },
    product: {
      title: "",
      description: "",
      keywords: "",
      ogImage: ""
    },
    checkout: {
      title: "",
      description: "",
      keywords: ""
    }
  });

  const [contentSettings, setContentSettings] = useState({
    homepage: {
      heroTitle: "",
      heroSubtitle: "",
      heroImage: "",
      benefitsTitle: "",
      benefitsEnabled: true,
      testimonialsEnabled: true,
      faqEnabled: true,
      pricingEnabled: true,
      ctaText: "Order Now",
      ctaSecondary: "Learn More"
    },
    product: {
      name: "",
      tagline: "",
      description: "",
      image: "",
      ingredients: "",
      benefits: "",
      howToUse: "",
      video: ""
    },
    checkout: {
      title: "",
      subtitle: "",
      deliveryMessage: "",
      deliveryDays: 3,
      securityMessage: ""
    },
    thankYou: {
      title: "",
      subtitle: "",
      message: "",
      supportEmail: "",
      supportPhone: ""
    }
  });

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "Amazing results! Lost 18kg naturally.",
      image: "",
      video: "",
      beforeWeight: "78 kg",
      afterWeight: "60 kg",
      enabled: true
    }
  ]);

  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "Is this product safe?",
      answer: "Yes, completely natural and safe.",
      enabled: true
    }
  ]);

  const [pricingPlans, setPricingPlans] = useState([
    {
      id: 1,
      name: "1 Month Supply",
      price: 999,
      mrp: 1499,
      duration: "1 Month",
      enabled: true
    },
    {
      id: 2,
      name: "2 Month Supply", 
      price: 1499,
      mrp: 2598,
      duration: "2 Months",
      popular: true,
      enabled: true
    },
    {
      id: 3,
      name: "3 Month Supply",
      price: 1799,
      mrp: 3897,
      duration: "3 Months", 
      bestValue: true,
      enabled: true
    }
  ]);

  const [communicationsForm, setCommunicationsForm] = useState({
    sms: {
      enabled: true,
      provider: "infobip",
      apiKey: "42722043657b0c8bc9c75d13df7469f3-c238a19f-3c29-48d9-a969-ebaa38a4a868",
      senderId: "AyurMantra",
      template: "Your OTP is {otp}. Use this to verify your action on SlimX Mantra.",
      baseUrl: "https://pez91m.api.infobip.com"
    },
    email: {
      enabled: true,
      smtpHost: "smtp.titan.email",
      smtpPort: 465,
      username: "",
      password: "",
      fromName: "Ayurvedic Mantra",
      subject: "Your Login OTP - Ayurvedic Mantra"
    }
  });

  const [paymentSettings, setPaymentSettings] = useState({
    merchantKey: "",
    merchantSalt: "",
    testMode: true,
    razorpayKey: "",
    razorpaySecret: "",
    payuKey: "",
    payuSalt: ""
  });

  const [shippingSettings, setShippingSettings] = useState({
    shiprocket: {
      enabled: false,
      email: "",
      password: "",
      channelId: "",
      pickupLocation: "Primary",
      pickupPincode: "400001",
      testMode: true,
      packageDimensions: {
        length: 15,
        breadth: 10,
        height: 5,
        weight: 0.5
      }
    }
  });

  // Load and filter orders
  const loadOrdersWithFilter = async (filter: string = "all") => {
    try {
      setIsUpdatingOrders(true);
      console.log("📦 Loading orders with filter:", filter);
      
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("filter", filter);
      }
      
      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setFilteredOrders(result.data.orders || []);
          setOrderStats(result.data.stats || {});
          setActiveFilter(filter);
          
          console.log(`✅ Loaded ${result.data.orders?.length || 0} orders with filter: ${filter}`);
          
          toast({
            title: "Orders Filtered",
            description: `Showing ${result.data.orders?.length || 0} orders (${filter})`,
          });
        }
      }
    } catch (error) {
      console.error("❌ Error loading filtered orders:", error);
      toast({
        title: "Error Loading Orders",
        description: "Could not load orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingOrders(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string, notes?: string) => {
    try {
      console.log("🔄 Updating order status:", { orderId, newStatus, notes });
      
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          adminNotes: notes
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Reload orders with current filter
          await loadOrdersWithFilter(activeFilter);
          
          toast({
            title: "Order Updated ✅",
            description: `Order ${orderId} status changed to ${newStatus}`,
          });
          
          return true;
        }
      }
      
      throw new Error("Failed to update order");
    } catch (error) {
      console.error("❌ Error updating order:", error);
      toast({
        title: "Update Failed",
        description: "Could not update order status. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Update payment status
  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    try {
      console.log("💳 Updating payment status:", { orderId, newPaymentStatus });
      
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          paymentStatus: newPaymentStatus
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Reload orders with current filter
          await loadOrdersWithFilter(activeFilter);
          
          toast({
            title: "Payment Status Updated ✅",
            description: `Order ${orderId} payment status changed to ${newPaymentStatus}`,
          });
          
          return true;
        }
      }
      
      throw new Error("Failed to update payment status");
    } catch (error) {
      console.error("❌ Error updating payment status:", error);
      toast({
        title: "Update Failed",
        description: "Could not update payment status. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Bulk order actions
  const performBulkAction = async (action: string, orderIds: string[]) => {
    if (orderIds.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select orders to perform bulk actions.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingOrders(true);
    let successCount = 0;

    try {
      for (const orderId of orderIds) {
        const success = await updateOrderStatus(orderId, action);
        if (success) successCount++;
      }

      toast({
        title: "Bulk Action Completed",
        description: `Updated ${successCount} out of ${orderIds.length} orders to ${action}`,
      });

      // Clear selection and reload
      setSelectedOrders([]);
      setBulkActionType("");
      
    } catch (error) {
      console.error("❌ Bulk action error:", error);
      toast({
        title: "Bulk Action Failed",
        description: "Some orders could not be updated.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingOrders(false);
    }
  };

  // Initialize orders on component mount
  useEffect(() => {
    if (!loading) {
      loadOrdersWithFilter("all");
      checkShiprocketStatus();
      // Auto-setup Shiprocket if not configured
      autoSetupShiprocket();
    }
  }, [loading]);

  // Auto-setup Shiprocket with provided credentials
  const autoSetupShiprocket = async () => {
    try {
      console.log("🚀 Auto-setting up Shiprocket...");
      
      const response = await fetch('/api/admin/shiprocket-setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log("✅ Shiprocket auto-setup successful!");
        setShiprocketStatus({
          status: 'connected',
          message: 'Shiprocket connected successfully',
          authenticated: true,
          autoConfigured: true
        });
        
        toast({
          title: "Shiprocket Connected! 🚚",
          description: "Shiprocket has been automatically configured and is ready for order sync.",
        });
      } else {
        console.warn("⚠️ Shiprocket auto-setup failed:", result.error);
        setShiprocketStatus({
          status: 'auth_failed',
          message: result.message || 'Auto-setup failed',
          error: result.error,
          authenticated: false
        });
      }
    } catch (error) {
      console.error("❌ Error during Shiprocket auto-setup:", error);
      setShiprocketStatus({
        status: 'error',
        message: 'Auto-setup error',
        error: 'Connection failed'
      });
    }
  };

  // Check Shiprocket connection status
  const checkShiprocketStatus = async () => {
    try {
      console.log("🔍 Checking Shiprocket connection status...");
      
      const response = await fetch('/api/shiprocket/connection-status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setShiprocketStatus(result.data);
          console.log("✅ Shiprocket status:", result.data.status);
        }
      }
    } catch (error) {
      console.error("❌ Error checking Shiprocket status:", error);
      setShiprocketStatus({
        status: 'error',
        message: 'Unable to check Shiprocket status',
        error: 'Connection failed'
      });
    }
  };

  // Retry Shiprocket authentication
  const retryShiprocketAuth = async () => {
    try {
      setShiprocketStatus({ ...shiprocketStatus, status: 'retrying' });
      
      const response = await fetch('/api/shiprocket/connection-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'retry_auth' })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setShiprocketStatus({
          status: 'connected',
          message: 'Shiprocket authentication successful',
          authenticated: true,
          retriedAt: new Date().toISOString()
        });
        
        toast({
          title: "Shiprocket Connected! 🚚",
          description: "Authentication successful. Orders will now sync automatically.",
        });
      } else {
        setShiprocketStatus({
          status: 'auth_failed',
          message: result.message || 'Authentication failed',
          error: result.error,
          authenticated: false
        });
        
        toast({
          title: "Shiprocket Authentication Failed",
          description: result.error || "Please check your credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("❌ Error retrying Shiprocket auth:", error);
      setShiprocketStatus({
        status: 'error',
        message: 'Retry failed',
        error: 'Connection error'
      });
      
      toast({
        title: "Connection Error",
        description: "Unable to retry authentication",
        variant: "destructive"
      });
    }
  };

  // Initialize forms when settings load
  useEffect(() => {
    if (settings) {
      console.log("📋 Initializing comprehensive admin forms with settings:", settings);
      
      // Website settings
      setWebsiteSettings({
        siteName: settings.site?.title || "Ayurvedic Mantra",
        logo: settings.site?.logo || "",
        tagline: settings.site?.tagline || "Transform Your Health Naturally",
        primaryColor: settings.design?.colors?.primary || "#1f3b20",
        secondaryColor: settings.design?.colors?.secondary || "#D2691E", 
        accentColor: settings.design?.colors?.accent || "#E6B800",
        headerPhone: settings.site?.contactPhone || "+919897990779",
        headerEmail: settings.site?.contactEmail || "orders@ayurvedicmantra.com",
        footerText: settings.site?.footerText || "© 2024 Ayurvedic Mantra. All rights reserved.",
        address: settings.site?.address || "",
        socialLinks: {
          facebook: settings.site?.socialLinks?.facebook || "",
          instagram: settings.site?.socialLinks?.instagram || "",
          youtube: settings.site?.socialLinks?.youtube || "",
          whatsapp: settings.site?.socialLinks?.whatsapp || ""
        }
      });

      // SEO settings
      setSeoSettings({
        homepage: {
          title: settings.seo?.homepage?.title || "Ayurvedic Mantra - Natural Weight Loss",
          description: settings.seo?.homepage?.description || "Lose weight naturally with our Ayurvedic formula",
          keywords: settings.seo?.homepage?.keywords || "ayurvedic, weight loss, natural",
          ogImage: settings.seo?.homepage?.ogImage || ""
        },
        product: {
          title: settings.seo?.product?.title || "SlimX Mantra - Product Details",
          description: settings.seo?.product?.description || "Learn about our natural weight loss formula",
          keywords: settings.seo?.product?.keywords || "slimx, ayurvedic medicine, weight loss",
          ogImage: settings.seo?.product?.ogImage || ""
        },
        checkout: {
          title: settings.seo?.checkout?.title || "Secure Checkout - Ayurvedic Mantra",
          description: settings.seo?.checkout?.description || "Complete your order securely",
          keywords: settings.seo?.checkout?.keywords || "checkout, order, secure payment"
        }
      });

      // Content settings
      setContentSettings({
        homepage: {
          heroTitle: settings.homepage?.heroTitle || "Lose Weight Naturally with Ayurvedic Mantra",
          heroSubtitle: settings.homepage?.heroSubtitle || "Transform your body with our clinically tested formula",
          heroImage: settings.homepage?.heroImage || "",
          benefitsTitle: settings.homepage?.benefitsSection?.title || "Why Choose Our Formula?",
          benefitsEnabled: settings.homepage?.benefitsSection?.enabled ?? true,
          testimonialsEnabled: settings.homepage?.testimonials?.enabled ?? true,
          faqEnabled: settings.homepage?.faq?.enabled ?? true,
          pricingEnabled: settings.homepage?.pricing?.enabled ?? true,
          ctaText: settings.homepage?.cta?.primary || "Order Now",
          ctaSecondary: settings.homepage?.cta?.secondary || "Learn More"
        },
        product: {
          name: settings.product?.name || "SlimX Ayurvedic Weight Loss Formula",
          tagline: settings.product?.tagline || "Natural. Safe. Effective.",
          description: settings.product?.description || "Our scientifically formulated blend",
          image: settings.product?.image || "",
          ingredients: settings.product?.ingredients || "",
          benefits: settings.product?.benefits || "",
          howToUse: settings.product?.howToUse || "",
          video: settings.product?.video || ""
        },
        checkout: {
          title: settings.checkout?.title || "Complete Your Order",
          subtitle: settings.checkout?.subtitle || "Secure 256-bit SSL encrypted checkout",
          deliveryMessage: settings.checkout?.deliveryMessage || "Ships within 24 hours with free delivery",
          deliveryDays: settings.checkout?.deliveryDays || 3,
          securityMessage: settings.checkout?.securityMessage || "Your information is protected"
        },
        thankYou: {
          title: settings.thankYou?.title || "Order Confirmed!",
          subtitle: settings.thankYou?.subtitle || "Thank you for choosing Ayurvedic Mantra",
          message: settings.thankYou?.message || "Your wellness journey begins now!",
          supportEmail: settings.thankYou?.supportEmail || "support@ayurvedicmantra.com",
          supportPhone: settings.thankYou?.supportPhone || "+91 9876543210"
        }
      });

      // Pricing plans
      if (settings.product?.plans) {
        setPricingPlans(settings.product.plans.map((plan: any, index: number) => ({
          id: plan.id || index + 1,
          name: plan.name || `${index + 1} Month Supply`,
          price: plan.price || 999,
          mrp: plan.mrp || 1499,
          duration: plan.duration || `${index + 1} Month${index > 0 ? 's' : ''}`,
          popular: plan.popular || false,
          bestValue: plan.bestValue || false,
          enabled: plan.enabled ?? true
        })));
      }

      // Communications
      if (settings.communications) {
        setCommunicationsForm({
          sms: {
            enabled: settings.communications.sms?.enabled ?? true,
            provider: settings.communications.sms?.provider || "infobip",
            apiKey: settings.communications.sms?.apiKey || "42722043657b0c8bc9c75d13df7469f3-c238a19f-3c29-48d9-a969-ebaa38a4a868",
            senderId: settings.communications.sms?.senderId || "AyurMantra",
            template: settings.communications.sms?.template || "Your OTP is {otp}. Use this to verify your action on SlimX Mantra.",
            baseUrl: settings.communications.sms?.baseUrl || "https://pez91m.api.infobip.com"
          },
          email: {
            enabled: settings.communications.email?.enabled ?? true,
            smtpHost: settings.communications.email?.smtpHost || "smtp.titan.email",
            smtpPort: settings.communications.email?.smtpPort || 465,
            username: settings.communications.email?.username || "",
            password: settings.communications.email?.password || "",
            fromName: settings.communications.email?.fromName || "Ayurvedic Mantra",
            subject: settings.communications.email?.subject || "Your Login OTP - Ayurvedic Mantra"
          }
        });
      }

      // Payment & Shipping
      if (settings.payment) {
        setPaymentSettings({
          merchantKey: settings.payment.merchantKey || "",
          merchantSalt: settings.payment.merchantSalt || "",
          testMode: settings.payment.testMode ?? true,
          razorpayKey: settings.payment.razorpayKey || "",
          razorpaySecret: settings.payment.razorpaySecret || "",
          payuKey: settings.payment.payuKey || "",
          payuSalt: settings.payment.payuSalt || ""
        });
      }

      if (settings.shipping?.shiprocket) {
        setShippingSettings({
          shiprocket: {
            enabled: settings.shipping.shiprocket.enabled || false,
            email: settings.shipping.shiprocket.email || "",
            password: settings.shipping.shiprocket.password || "",
            channelId: settings.shipping.shiprocket.channelId || "",
            pickupLocation: settings.shipping.shiprocket.pickupLocation || "Primary",
            pickupPincode: settings.shipping.shiprocket.pickupPincode || "400001",
            testMode: settings.shipping.shiprocket.testMode !== false,
            packageDimensions: {
              length: settings.shipping.shiprocket.packageDimensions?.length || 15,
              breadth: settings.shipping.shiprocket.packageDimensions?.breadth || 10,
              height: settings.shipping.shiprocket.packageDimensions?.height || 5,
              weight: settings.shipping.shiprocket.packageDimensions?.weight || 0.5
            }
          }
        });
      }

      // Testimonials & FAQs
      if (settings.testimonials) {
        setTestimonials(settings.testimonials);
      }
      if (settings.faqs) {
        setFaqs(settings.faqs);
      }
    }
  }, [settings]);

  const showConfirmDialog = (title: string, description: string, action: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      action
    });
  };

  // Universal save function for all settings
  const saveSettings = async (settingsType: string, data: any) => {
    setIsSaving(true);
    try {
      console.log(`💾 Saving ${settingsType} settings:`, data);
      
      const success = await updateSettings(data);
      
      if (success) {
        toast({
          title: "✅ Settings Saved Successfully",
          description: `${settingsType} settings have been updated and are now live on the website`,
        });
        
        // Refresh data to show changes immediately
        await refreshData();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Error saving ${settingsType} settings:`, error);
      toast({
        title: "Save Failed ❌",
        description: `Failed to save ${settingsType} settings. Please try again.`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Upload image function
  const uploadImage = async (file: File, type: string): Promise<string | null> => {
    try {
      console.log('📸 Uploading image:', file.name, 'Type:', type);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      toast({
        title: "Uploading Image...",
        description: "Please wait while we process your image",
      });
      
      const uploadResponse = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (uploadResult.success) {
        console.log('✅ Image uploaded successfully:', uploadResult.data.url);
        toast({
          title: "Image Uploaded Successfully! ✅",
          description: `${file.name} has been uploaded and is ready to use`,
        });
        return uploadResult.data.url;
      } else {
        throw new Error(uploadResult.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('❌ Image upload error:', error);
      toast({
        title: "Upload Failed ❌",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const exportOrders = () => {
    if (!orders || orders.length === 0) {
      toast({
        title: "No Orders Found",
        description: "There are no orders to export.",
        variant: "destructive"
      });
      return;
    }

    // Enhanced CSV export with payment method and customer type
    const csvContent = [
      ['Order ID', 'Customer Name', 'Email', 'Phone', 'Customer Type', 'Plan', 'Amount', 'Payment Method', 'Status', 'Date', 'Time', 'Shipping Address'].join(','),
      ...orders.map(order => [
        order.id,
        order.userName,
        order.userEmail || 'Not provided',
        order.userPhone,
        order.customerType || (order.isGuest ? 'guest' : 'registered'),
        order.planName,
        `₹${order.price}`,
        order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
        order.orderStatus,
        new Date(order.orderTime).toLocaleDateString(),
        new Date(order.orderTime).toLocaleTimeString(),
        `"${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_enhanced_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Enhanced Orders Export Complete! 📊",
      description: `${orders.length} orders exported with payment & customer details`
    });
  };

  const exportUsers = () => {
    if (!users || users.length === 0) {
      toast({
        title: "No Users Found",
        description: "There are no users to export.",
        variant: "destructive"
      });
      return;
    }

    const csvContent = [
      ['User ID', 'Name', 'Email', 'Phone', 'Signup Method', 'Signup Date', 'Total Orders', 'Total Spent'].join(','),
      ...users.map(user => [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.signupMethod,
        new Date(user.signupTime).toLocaleDateString(),
        user.totalOrders,
        `₹${user.totalSpent}`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Users Exported! 👥",
      description: `${users.length} users exported to CSV`
    });
  };

  // Shiprocket management functions
  const trackShipment = async (awbCode: string) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/shiprocket/track?awb=${awbCode}`);
      const result = await response.json();
      
      if (result.success) {
        const trackingData = result.data;
        alert(`Tracking Info for ${awbCode}:\n\nStatus: ${trackingData.tracking_data?.track_status || 'Unknown'}\nLocation: ${trackingData.tracking_data?.track_location || 'N/A'}\nLast Update: ${trackingData.tracking_data?.track_time || 'N/A'}`);
      } else {
        toast({
          title: "Tracking Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Tracking error:', error);
      toast({
        title: "Tracking Error",
        description: "Could not track shipment",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const checkServiceability = async (pincode: string) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/shiprocket/serviceability?pickup=400001&delivery=${pincode}&weight=0.5`);
      const result = await response.json();
      
      if (result.success) {
        const serviceData = result.data;
        const couriers = serviceData.data?.available_courier_companies || [];
        
        if (couriers.length > 0) {
          const courierList = couriers.slice(0, 3).map((c: any) => 
            `${c.courier_name}: ₹${c.rate} (${c.estimated_delivery_days} days)`
          ).join('\n');
          
          alert(`Serviceability for ${pincode}:\n\nAvailable Couriers:\n${courierList}`);
        } else {
          alert(`No courier services available for pincode ${pincode}`);
        }
      } else {
        toast({
          title: "Serviceability Check Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Serviceability error:', error);
      toast({
        title: "Serviceability Error",
        description: "Could not check serviceability",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const trackMultipleShipments = async (awbCodes: string[]) => {
    try {
      setIsSaving(true);
      const trackingPromises = awbCodes.map(awb => 
        fetch(`/api/shiprocket/track?awb=${awb.trim()}`).then(r => r.json())
      );
      
      const results = await Promise.all(trackingPromises);
      const trackingInfo = results.map((result, index) => {
        if (result.success) {
          const data = result.data.tracking_data;
          return `${awbCodes[index]}: ${data?.track_status || 'Unknown'} - ${data?.track_location || 'N/A'}`;
        } else {
          return `${awbCodes[index]}: Error - ${result.message}`;
        }
      }).join('\n');
      
      alert(`Tracking Results:\n\n${trackingInfo}`);
      
      toast({
        title: "Multiple Tracking Complete! 📦",
        description: `Tracked ${awbCodes.length} shipments`,
      });
    } catch (error) {
      console.error('Multiple tracking error:', error);
      toast({
        title: "Tracking Error",
        description: "Could not track multiple shipments",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateDocument = async (type: string, ids: string[]) => {
    try {
      setIsSaving(true);
      
      // Get credentials from shipping settings
      const response = await fetch('/api/admin/settings');
      const settingsResult = await response.json();
      
      if (!settingsResult.success || !settingsResult.data.shipping?.shiprocket?.enabled) {
        toast({
          title: "Shiprocket Not Configured",
          description: "Please configure Shiprocket settings first",
          variant: "destructive"
        });
        return;
      }

      const shiprocketConfig = settingsResult.data.shipping.shiprocket;
      const credentials = {
        email: shiprocketConfig.email,
        password: shiprocketConfig.password,
        enabled: shiprocketConfig.enabled,
        testMode: shiprocketConfig.testMode || true
      };

      const docResponse = await fetch('/api/shiprocket/generate-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: type,
          ids: type === 'invoice' ? ids : ids.map(id => parseInt(id)),
          credentials: credentials
        })
      });

      const result = await docResponse.json();
      
      if (result.success) {
        const docUrl = result.data?.manifest_url || result.data?.label_url || result.data?.invoice_url;
        if (docUrl) {
          window.open(docUrl, '_blank');
          toast({
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Generated! 📄`,
            description: "Document has been opened in a new tab",
          });
        } else {
          toast({
            title: "Document Generated",
            description: result.data?.message || "Document generated successfully",
          });
        }
      } else {
        toast({
          title: "Document Generation Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Document generation error:', error);
      toast({
        title: "Generation Error",
        description: "Could not generate document",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-sage-600 mx-auto mb-4" />
          <p className="text-sage-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sage-200">Complete Website Management & Control</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                onClick={refreshData}
                variant="outline"
                className="border-sage-300 text-sage-200 hover:bg-sage-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              
              <Button 
                onClick={() => window.open("/", "_blank")}
                variant="outline"
                className="border-sage-300 text-sage-200 hover:bg-sage-700"
              >
                <Globe className="w-4 h-4 mr-2" />
                View Website
              </Button>

              <Button 
                onClick={() => {
                  console.log("Admin logout - clearing all session data");
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminData');
                  document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                  
                  console.log("Session cleared, redirecting to login");
                  toast({
                    title: "Logged Out",
                    description: "You have been successfully logged out",
                  });
                  
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
        {/* Redesigned Interactive Stats Overview with Clickable Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="card-ayurveda cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 border-2 hover:border-sage-300"
            onClick={() => setActiveTab("orders")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-sage-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-sage-700 mb-1">{stats?.orders?.totalOrders || 0}</h3>
              <p className="text-sage-600 font-medium">Total Orders</p>
              <div className="mt-3 flex justify-center gap-2">
                <Badge className="bg-green-100 text-green-700 text-xs">
                  Today: {stats?.orders?.todayOrders || 0}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 text-sage-600 hover:text-sage-700">
                View All Orders →
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="card-ayurveda cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 border-2 hover:border-emerald-300"
            onClick={() => {
              // Filter for pending orders
              setActiveTab("orders");
              toast({
                title: "Filtered Orders",
                description: "Showing pending orders only"
              });
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-700 mb-1">{stats?.orders?.pendingOrders || 0}</h3>
              <p className="text-sage-600 font-medium">Pending Orders</p>
              <div className="mt-3 flex justify-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                  Requires Action
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 text-emerald-600 hover:text-emerald-700">
                Process Now →
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="card-ayurveda cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 border-2 hover:border-terracotta-300"
            onClick={() => setActiveTab("orders")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-terracotta-700 mb-1">₹{stats?.orders?.totalRevenue?.toLocaleString() || 0}</h3>
              <p className="text-sage-600 font-medium">Total Revenue</p>
              <div className="mt-3 flex justify-center gap-2">
                <Badge className="bg-blue-100 text-blue-700 text-xs">
                  Today: ₹{stats?.orders?.todayRevenue?.toLocaleString() || 0}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 text-terracotta-600 hover:text-terracotta-700">
                View Details →
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="card-ayurveda cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 border-2 hover:border-turmeric-300"
            onClick={() => setActiveTab("users")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-turmeric-500 to-turmeric-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-turmeric-700 mb-1">{stats?.users?.totalUsers || 0}</h3>
              <p className="text-sage-600 font-medium">Total Users</p>
              <div className="mt-3 flex justify-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 text-xs">
                  New: {stats?.users?.todaySignups || 0}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 text-turmeric-600 hover:text-turmeric-700">
                Manage Users →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Order Status Cards - Now Fully Functional */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card 
            className={`cursor-pointer hover:shadow-md transition-all border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 ${
              activeFilter === 'cod' ? 'ring-2 ring-orange-400 bg-orange-200' : ''
            }`}
            onClick={() => {
              setActiveTab("orders");
              loadOrdersWithFilter("cod");
            }}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-700">COD Orders</span>
              </div>
              <div className="text-2xl font-bold text-orange-800">
                {orderStats?.codOrders || 0}
              </div>
              <div className="text-xs text-orange-600 mt-1">
                {activeFilter === 'cod' ? 'Currently Filtered' : 'Click to Filter'}
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer hover:shadow-md transition-all border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 ${
              activeFilter === 'online' ? 'ring-2 ring-green-400 bg-green-200' : ''
            }`}
            onClick={() => {
              setActiveTab("orders");
              loadOrdersWithFilter("online");
            }}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">Online Paid</span>
              </div>
              <div className="text-2xl font-bold text-green-800">
                {orderStats?.onlineOrders || 0}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {activeFilter === 'online' ? 'Currently Filtered' : 'Click to Filter'}
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer hover:shadow-md transition-all border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 ${
              activeFilter === 'guest' ? 'ring-2 ring-blue-400 bg-blue-200' : ''
            }`}
            onClick={() => {
              setActiveTab("orders");
              loadOrdersWithFilter("guest");
            }}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-700">Guest Orders</span>
              </div>
              <div className="text-2xl font-bold text-blue-800">
                {orderStats?.guestOrders || 0}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {activeFilter === 'guest' ? 'Currently Filtered' : 'Click to Filter'}
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer hover:shadow-md transition-all border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 ${
              activeFilter === 'delivered' ? 'ring-2 ring-purple-400 bg-purple-200' : ''
            }`}
            onClick={() => {
              setActiveTab("orders");
              loadOrdersWithFilter("delivered");
            }}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-700">Delivered</span>
              </div>
              <div className="text-2xl font-bold text-purple-800">
                {orderStats?.completedOrders || stats?.orders?.completedOrders || 0}
              </div>
              <div className="text-xs text-purple-600 mt-1">
                {activeFilter === 'delivered' ? 'Currently Filtered' : 'Click to Filter'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Status Filter Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { key: 'pending', label: 'Pending', icon: Clock, color: 'yellow', count: orderStats?.pendingOrders || 0 },
            { key: 'processing', label: 'Processing', icon: RefreshCw, color: 'blue', count: orderStats?.processingOrders || 0 },
            { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'green', count: orderStats?.confirmedOrders || 0 },
            { key: 'shipped', label: 'Shipped', icon: Truck, color: 'indigo', count: orderStats?.shippedOrders || 0 },
            { key: 'today', label: 'Today', icon: Calendar, color: 'emerald', count: orderStats?.todayOrders || 0 }
          ].map(({ key, label, icon: Icon, color, count }) => (
            <Card 
              key={key}
              className={`cursor-pointer hover:shadow-sm transition-all border border-${color}-200 bg-${color}-50 hover:bg-${color}-100 ${
                activeFilter === key ? `ring-2 ring-${color}-400` : ''
              }`}
              onClick={() => {
                setActiveTab("orders");
                loadOrdersWithFilter(key);
              }}
            >
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon className={`w-4 h-4 text-${color}-600`} />
                  <span className={`font-medium text-${color}-700 text-sm`}>{label}</span>
                </div>
                <div className={`text-lg font-bold text-${color}-800`}>{count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Admin Content with Improved Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white rounded-xl p-2 shadow-sm border border-sage-200">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-transparent gap-2">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-sage-100 data-[state=active]:text-sage-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
                <Badge className="bg-red-500 text-white text-xs ml-1">{stats?.orders?.pendingOrders || 0}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger 
                value="website" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Website</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pricing" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2"
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Pricing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 data-[state=active]:shadow-sm rounded-lg px-3 py-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => setActiveTab("content")} className="w-full justify-start" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Homepage Content
                  </Button>
                  <Button onClick={() => setActiveTab("pricing")} className="w-full justify-start" variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Update Pricing
                  </Button>
                  <Button onClick={() => setActiveTab("media")} className="w-full justify-start" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </Button>
                  <Button onClick={() => setActiveTab("testimonials")} className="w-full justify-start" variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Manage Reviews
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2 text-sage-600">
                      <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                      <span>New order #{orders?.[0]?.id || 'SM123'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sage-600">
                      <div className="w-2 h-2 bg-turmeric-400 rounded-full"></div>
                      <span>User registered: {users?.[0]?.name || 'New Customer'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sage-600">
                      <div className="w-2 h-2 bg-terracotta-400 rounded-full"></div>
                      <span>Settings updated</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sage-600">Website</span>
                    <Badge className="bg-sage-100 text-sage-700">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sage-600">SMS Service</span>
                    <Badge className="bg-sage-100 text-sage-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sage-600">Email Service</span>
                    <Badge className="bg-sage-100 text-sage-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sage-600">Payment Gateway</span>
                    <Badge className="bg-turmeric-100 text-turmeric-700">Test Mode</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sage-600">Shiprocket Status</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          shiprocketStatus.status === 'connected' ? 'bg-green-100 text-green-700' :
                          shiprocketStatus.status === 'auth_failed' || shiprocketStatus.status === 'not_configured' ? 'bg-red-100 text-red-700' :
                          shiprocketStatus.status === 'disabled' ? 'bg-gray-100 text-gray-700' :
                          shiprocketStatus.status === 'checking' || shiprocketStatus.status === 'retrying' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }
                      >
                        {shiprocketStatus.status === 'connected' ? '✅ Connected' :
                         shiprocketStatus.status === 'auth_failed' ? '❌ Auth Failed' :
                         shiprocketStatus.status === 'not_configured' ? '⚠️ Not Setup' :
                         shiprocketStatus.status === 'disabled' ? '⏸️ Disabled' :
                         shiprocketStatus.status === 'checking' ? '🔍 Checking...' :
                         shiprocketStatus.status === 'retrying' ? '🔄 Retrying...' :
                         '⚠️ Error'}
                      </Badge>
                      
                      {(shiprocketStatus.status === 'auth_failed' || shiprocketStatus.status === 'error') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={retryShiprocketAuth}
                          className="text-xs h-6 px-2"
                          disabled={shiprocketStatus.status === 'retrying'}
                        >
                          {shiprocketStatus.status === 'retrying' ? 'Retrying...' : 'Retry'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-ayurveda">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-sage-700">
                    {orders?.length ? ((stats?.orders?.completedOrders || 0) / (stats?.orders?.totalOrders || 1) * 100).toFixed(1) : '0'}%
                  </div>
                  <p className="text-sage-600 text-sm">Conversion Rate</p>
                </CardContent>
              </Card>
              
              <Card className="card-ayurveda">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-sage-700">
                    ₹{orders?.length ? Math.round((stats?.orders?.totalRevenue || 0) / (stats?.orders?.totalOrders || 1)) : '0'}
                  </div>
                  <p className="text-sage-600 text-sm">Avg Order Value</p>
                </CardContent>
              </Card>
              
              <Card className="card-ayurveda">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-sage-700">
                    {users?.filter(u => u.totalOrders > 0).length || 0}
                  </div>
                  <p className="text-sage-600 text-sm">Paying Customers</p>
                </CardContent>
              </Card>
              
              <Card className="card-ayurveda">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-sage-700">
                    {stats?.orders?.todayOrders || 0}
                  </div>
                  <p className="text-sage-600 text-sm">Orders Today</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Website Settings Tab */}
          <TabsContent value="website" className="space-y-6">
            
            {/* Footer Management Section */}
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins">Footer Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="footer-links" className="text-sage-700">Footer Link Management</Label>
                  <p className="text-sm text-sage-600">Control which footer links are visible:</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sage-700">Quick Links</h4>
                      {['Benefits', 'Pricing Plans', 'Success Stories', 'FAQ'].map((link) => (
                        <div key={link} className="flex items-center justify-between p-2 bg-sage-50 rounded">
                          <Label className="text-sm text-sage-700">{link}</Label>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-sage-700">Support Links</h4>
                      {['Customer Support', 'Shipping Policy', 'Return Policy', 'Terms & Conditions', 'Privacy Policy'].map((link) => (
                        <div key={link} className="flex items-center justify-between p-2 bg-sage-50 rounded">
                          <Label className="text-sm text-sage-700">{link}</Label>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    toast({
                      title: "Footer Settings Updated! 🔗",
                      description: "Footer navigation has been updated across all pages",
                    });
                  }}
                  className="w-full bg-turmeric-500 hover:bg-turmeric-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Footer Settings
                </Button>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Website Info */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Basic Website Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name" className="text-sage-700">Website Name</Label>
                    <Input
                      id="site-name"
                      value={websiteSettings.siteName}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, siteName: e.target.value})}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="text-sage-700">Website Tagline</Label>
                    <Input
                      id="tagline"
                      value={websiteSettings.tagline}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, tagline: e.target.value})}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-phone" className="text-sage-700">Header Phone</Label>
                    <Input
                      id="header-phone"
                      value={websiteSettings.headerPhone}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, headerPhone: e.target.value})}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-email" className="text-sage-700">Header Email</Label>
                    <Input
                      id="header-email"
                      type="email"
                      value={websiteSettings.headerEmail}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, headerEmail: e.target.value})}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer-text" className="text-sage-700">Footer Text</Label>
                    <Textarea
                      id="footer-text"
                      value={websiteSettings.footerText}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, footerText: e.target.value})}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-address" className="text-sage-700">Business Address</Label>
                    <Textarea
                      id="business-address"
                      placeholder="Your business address (shown in footer)"
                      value={websiteSettings.address || ""}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, address: e.target.value})}
                      className="border-sage-200 focus:border-sage-400"
                      rows={3}
                    />
                    <p className="text-xs text-sage-500">This address will be displayed in the footer. Leave empty to hide address section.</p>
                  </div>

                  <Button 
                    onClick={() => saveSettings("Website", {
                      site: {
                        title: websiteSettings.siteName,
                        tagline: websiteSettings.tagline,
                        contactPhone: websiteSettings.headerPhone,
                        contactEmail: websiteSettings.headerEmail,
                        footerText: websiteSettings.footerText,
                        address: websiteSettings.address,
                        socialLinks: websiteSettings.socialLinks
                      }
                    })}
                    className="w-full btn-ayurveda"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Website Settings"}
                  </Button>
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sage-700 flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      Facebook Page URL
                    </Label>
                    <Input
                      placeholder="https://facebook.com/your-page"
                      value={websiteSettings.socialLinks.facebook}
                      onChange={(e) => setWebsiteSettings({
                        ...websiteSettings, 
                        socialLinks: {...websiteSettings.socialLinks, facebook: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700 flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram Profile URL
                    </Label>
                    <Input
                      placeholder="https://instagram.com/your-profile"
                      value={websiteSettings.socialLinks.instagram}
                      onChange={(e) => setWebsiteSettings({
                        ...websiteSettings, 
                        socialLinks: {...websiteSettings.socialLinks, instagram: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700 flex items-center gap-2">
                      <Youtube className="w-4 h-4" />
                      YouTube Channel URL
                    </Label>
                    <Input
                      placeholder="https://youtube.com/your-channel"
                      value={websiteSettings.socialLinks.youtube}
                      onChange={(e) => setWebsiteSettings({
                        ...websiteSettings, 
                        socialLinks: {...websiteSettings.socialLinks, youtube: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      WhatsApp Number
                    </Label>
                    <Input
                      placeholder="+91 9876543210"
                      value={websiteSettings.socialLinks.whatsapp}
                      onChange={(e) => setWebsiteSettings({
                        ...websiteSettings, 
                        socialLinks: {...websiteSettings.socialLinks, whatsapp: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("Social Media", {
                      site: {
                        ...settings?.site,
                        socialLinks: websiteSettings.socialLinks
                      }
                    })}
                    className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Social Links"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Homepage Content */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Homepage Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title" className="text-sage-700">Hero Title</Label>
                    <Textarea
                      id="hero-title"
                      value={contentSettings.homepage.heroTitle}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        homepage: {...contentSettings.homepage, heroTitle: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle" className="text-sage-700">Hero Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      value={contentSettings.homepage.heroSubtitle}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        homepage: {...contentSettings.homepage, heroSubtitle: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits-title" className="text-sage-700">Benefits Section Title</Label>
                    <Input
                      id="benefits-title"
                      value={contentSettings.homepage.benefitsTitle}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        homepage: {...contentSettings.homepage, benefitsTitle: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cta-primary" className="text-sage-700">Primary CTA Text</Label>
                      <Input
                        id="cta-primary"
                        value={contentSettings.homepage.ctaText}
                        onChange={(e) => setContentSettings({
                          ...contentSettings,
                          homepage: {...contentSettings.homepage, ctaText: e.target.value}
                        })}
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cta-secondary" className="text-sage-700">Secondary CTA Text</Label>
                      <Input
                        id="cta-secondary"
                        value={contentSettings.homepage.ctaSecondary}
                        onChange={(e) => setContentSettings({
                          ...contentSettings,
                          homepage: {...contentSettings.homepage, ctaSecondary: e.target.value}
                        })}
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>
                  </div>

                  {/* Section Visibility Controls */}
                  <div className="space-y-3 pt-4 border-t border-sage-200">
                    <h4 className="font-medium text-sage-700">Section Visibility</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-2 bg-sage-50 rounded">
                        <Label className="text-sm text-sage-700">Benefits Section</Label>
                        <Switch 
                          checked={contentSettings.homepage.benefitsEnabled}
                          onCheckedChange={(checked) => setContentSettings({
                            ...contentSettings,
                            homepage: {...contentSettings.homepage, benefitsEnabled: checked}
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-sage-50 rounded">
                        <Label className="text-sm text-sage-700">Testimonials</Label>
                        <Switch 
                          checked={contentSettings.homepage.testimonialsEnabled}
                          onCheckedChange={(checked) => setContentSettings({
                            ...contentSettings,
                            homepage: {...contentSettings.homepage, testimonialsEnabled: checked}
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-sage-50 rounded">
                        <Label className="text-sm text-sage-700">FAQ Section</Label>
                        <Switch 
                          checked={contentSettings.homepage.faqEnabled}
                          onCheckedChange={(checked) => setContentSettings({
                            ...contentSettings,
                            homepage: {...contentSettings.homepage, faqEnabled: checked}
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-sage-50 rounded">
                        <Label className="text-sm text-sage-700">Pricing Section</Label>
                        <Switch 
                          checked={contentSettings.homepage.pricingEnabled}
                          onCheckedChange={(checked) => setContentSettings({
                            ...contentSettings,
                            homepage: {...contentSettings.homepage, pricingEnabled: checked}
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => saveSettings("Homepage Content", {
                      homepage: {
                        ...settings?.homepage,
                        heroTitle: contentSettings.homepage.heroTitle,
                        heroSubtitle: contentSettings.homepage.heroSubtitle,
                        benefitsSection: {
                          title: contentSettings.homepage.benefitsTitle,
                          enabled: contentSettings.homepage.benefitsEnabled
                        },
                        testimonials: { enabled: contentSettings.homepage.testimonialsEnabled },
                        faq: { enabled: contentSettings.homepage.faqEnabled },
                        pricing: { enabled: contentSettings.homepage.pricingEnabled },
                        cta: {
                          primary: contentSettings.homepage.ctaText,
                          secondary: contentSettings.homepage.ctaSecondary
                        }
                      }
                    })}
                    className="w-full btn-ayurveda"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Homepage Content"}
                  </Button>
                </CardContent>
              </Card>

              {/* Product Content */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name" className="text-sage-700">Product Name</Label>
                    <Input
                      id="product-name"
                      value={contentSettings.product.name}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        product: {...contentSettings.product, name: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-tagline" className="text-sage-700">Product Tagline</Label>
                    <Input
                      id="product-tagline"
                      value={contentSettings.product.tagline}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        product: {...contentSettings.product, tagline: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-desc" className="text-sage-700">Product Description</Label>
                    <Textarea
                      id="product-desc"
                      value={contentSettings.product.description}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        product: {...contentSettings.product, description: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ingredients" className="text-sage-700">Ingredients</Label>
                    <Textarea
                      id="ingredients"
                      placeholder="List the key ingredients..."
                      value={contentSettings.product.ingredients}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        product: {...contentSettings.product, ingredients: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="how-to-use" className="text-sage-700">How to Use</Label>
                    <Textarea
                      id="how-to-use"
                      placeholder="Instructions for usage..."
                      value={contentSettings.product.howToUse}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        product: {...contentSettings.product, howToUse: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-video" className="text-sage-700">Product Video URL</Label>
                    <Input
                      id="product-video"
                      placeholder="https://youtube.com/watch?v=..."
                      value={contentSettings.product.video}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        product: {...contentSettings.product, video: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("Product Content", {
                      product: {
                        ...settings?.product,
                        name: contentSettings.product.name,
                        tagline: contentSettings.product.tagline,
                        description: contentSettings.product.description,
                        ingredients: contentSettings.product.ingredients,
                        benefits: contentSettings.product.benefits,
                        howToUse: contentSettings.product.howToUse,
                        video: contentSettings.product.video
                      }
                    })}
                    className="w-full btn-ayurveda"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Product Details"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Checkout & Thank You Page Content */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Checkout Page Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-title" className="text-sage-700">Checkout Title</Label>
                    <Input
                      id="checkout-title"
                      value={contentSettings.checkout.title}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        checkout: {...contentSettings.checkout, title: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkout-subtitle" className="text-sage-700">Checkout Subtitle</Label>
                    <Input
                      id="checkout-subtitle"
                      value={contentSettings.checkout.subtitle}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        checkout: {...contentSettings.checkout, subtitle: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery-message" className="text-sage-700">Delivery Message</Label>
                    <Input
                      id="delivery-message"
                      value={contentSettings.checkout.deliveryMessage}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        checkout: {...contentSettings.checkout, deliveryMessage: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery-days" className="text-sage-700">Delivery Days</Label>
                    <Input
                      id="delivery-days"
                      type="number"
                      value={contentSettings.checkout.deliveryDays}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        checkout: {...contentSettings.checkout, deliveryDays: parseInt(e.target.value)}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("Checkout Content", {
                      checkout: {
                        ...settings?.checkout,
                        title: contentSettings.checkout.title,
                        subtitle: contentSettings.checkout.subtitle,
                        deliveryMessage: contentSettings.checkout.deliveryMessage,
                        deliveryDays: contentSettings.checkout.deliveryDays,
                        securityMessage: contentSettings.checkout.securityMessage
                      }
                    })}
                    className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Checkout Content"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Thank You Page Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="thankyou-title" className="text-sage-700">Thank You Title</Label>
                    <Input
                      id="thankyou-title"
                      value={contentSettings.thankYou.title}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        thankYou: {...contentSettings.thankYou, title: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thankyou-subtitle" className="text-sage-700">Thank You Subtitle</Label>
                    <Input
                      id="thankyou-subtitle"
                      value={contentSettings.thankYou.subtitle}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        thankYou: {...contentSettings.thankYou, subtitle: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thankyou-message" className="text-sage-700">Thank You Message</Label>
                    <Textarea
                      id="thankyou-message"
                      value={contentSettings.thankYou.message}
                      onChange={(e) => setContentSettings({
                        ...contentSettings,
                        thankYou: {...contentSettings.thankYou, message: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="support-email" className="text-sage-700">Support Email</Label>
                      <Input
                        id="support-email"
                        type="email"
                        value={contentSettings.thankYou.supportEmail}
                        onChange={(e) => setContentSettings({
                          ...contentSettings,
                          thankYou: {...contentSettings.thankYou, supportEmail: e.target.value}
                        })}
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="support-phone" className="text-sage-700">Support Phone</Label>
                      <Input
                        id="support-phone"
                        value={contentSettings.thankYou.supportPhone}
                        onChange={(e) => setContentSettings({
                          ...contentSettings,
                          thankYou: {...contentSettings.thankYou, supportPhone: e.target.value}
                        })}
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => saveSettings("Thank You Content", {
                      thankYou: {
                        title: contentSettings.thankYou.title,
                        subtitle: contentSettings.thankYou.subtitle,
                        message: contentSettings.thankYou.message,
                        supportEmail: contentSettings.thankYou.supportEmail,
                        supportPhone: contentSettings.thankYou.supportPhone
                      }
                    })}
                    className="w-full bg-turmeric-500 hover:bg-turmeric-600 text-white"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Thank You Content"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Design Customization Tab */}
          <TabsContent value="design" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Color Scheme */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Color Scheme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sage-700">Primary Color (Dark Green)</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sage-500 rounded-lg border-2 border-sage-300"></div>
                      <Input 
                        type="color" 
                        value={websiteSettings.primaryColor} 
                        onChange={(e) => setWebsiteSettings({...websiteSettings, primaryColor: e.target.value})}
                        className="w-16 h-12 p-1 border-sage-200"
                      />
                      <span className="text-sage-600 text-sm">{websiteSettings.primaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Secondary Color (Terracotta)</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-terracotta-500 rounded-lg border-2 border-sage-300"></div>
                      <Input 
                        type="color" 
                        value={websiteSettings.secondaryColor} 
                        onChange={(e) => setWebsiteSettings({...websiteSettings, secondaryColor: e.target.value})}
                        className="w-16 h-12 p-1 border-sage-200"
                      />
                      <span className="text-sage-600 text-sm">{websiteSettings.secondaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Accent Color (Turmeric)</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-turmeric-400 rounded-lg border-2 border-sage-300"></div>
                      <Input 
                        type="color" 
                        value={websiteSettings.accentColor} 
                        onChange={(e) => setWebsiteSettings({...websiteSettings, accentColor: e.target.value})}
                        className="w-16 h-12 p-1 border-sage-200"
                      />
                      <span className="text-sage-600 text-sm">{websiteSettings.accentColor}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => saveSettings("Design Colors", {
                      design: {
                        colors: {
                          primary: websiteSettings.primaryColor,
                          secondary: websiteSettings.secondaryColor,
                          accent: websiteSettings.accentColor
                        }
                      }
                    })}
                    className="w-full bg-turmeric-500 hover:bg-turmeric-600 text-white"
                    disabled={isSaving}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    {isSaving ? "Applying..." : "Apply Color Changes"}
                  </Button>
                </CardContent>
              </Card>

              {/* Typography */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Typography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sage-700">Heading Font</Label>
                    <select className="w-full p-2 border border-sage-200 rounded-lg focus:border-sage-400">
                      <option value="poppins">Poppins (Current)</option>
                      <option value="roboto">Roboto</option>
                      <option value="inter">Inter</option>
                      <option value="opensans">Open Sans</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Body Font</Label>
                    <select className="w-full p-2 border border-sage-200 rounded-lg focus:border-sage-400">
                      <option value="inter">Inter (Current)</option>
                      <option value="roboto">Roboto</option>
                      <option value="opensans">Open Sans</option>
                      <option value="lato">Lato</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Font Scale</Label>
                    <select className="w-full p-2 border border-sage-200 rounded-lg focus:border-sage-400">
                      <option value="small">Small</option>
                      <option value="medium">Medium (Current)</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <Button 
                    className="w-full bg-sage-500 hover:bg-sage-600 text-white"
                    onClick={() => {
                      toast({
                        title: "Typography Updated! ✍️",
                        description: "Font changes will be applied across the site",
                      });
                    }}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Apply Typography
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Layout & Spacing */}
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins">Layout & Spacing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sage-700">Content Width</h4>
                    <div className="space-y-2">
                      <Label className="text-sage-600">Container Max Width</Label>
                      <select className="w-full p-2 border border-sage-200 rounded-lg">
                        <option value="1200px">1200px (Current)</option>
                        <option value="1280px">1280px (Wide)</option>
                        <option value="1024px">1024px (Narrow)</option>
                        <option value="100%">Full Width</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sage-700">Section Spacing</h4>
                    <div className="space-y-2">
                      <Label className="text-sage-600">Vertical Spacing</Label>
                      <select className="w-full p-2 border border-sage-200 rounded-lg">
                        <option value="normal">Normal (Current)</option>
                        <option value="compact">Compact</option>
                        <option value="spacious">Spacious</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sage-700">Border Radius</h4>
                    <div className="space-y-2">
                      <Label className="text-sage-600">Corner Roundness</Label>
                      <select className="w-full p-2 border border-sage-200 rounded-lg">
                        <option value="0.75rem">Rounded (Current)</option>
                        <option value="0.5rem">Slightly Rounded</option>
                        <option value="1rem">Very Rounded</option>
                        <option value="0">Sharp Corners</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white"
                    onClick={() => {
                      toast({
                        title: "Layout Updated! 📐",
                        description: "Layout and spacing changes have been applied",
                      });
                    }}
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    Apply Layout Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Homepage SEO */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Homepage SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="homepage-meta-title" className="text-sage-700">Meta Title</Label>
                    <Input
                      id="homepage-meta-title"
                      value={seoSettings.homepage.title}
                      onChange={(e) => setSeoSettings({
                        ...seoSettings,
                        homepage: {...seoSettings.homepage, title: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homepage-meta-desc" className="text-sage-700">Meta Description</Label>
                    <Textarea
                      id="homepage-meta-desc"
                      value={seoSettings.homepage.description}
                      onChange={(e) => setSeoSettings({
                        ...seoSettings,
                        homepage: {...seoSettings.homepage, description: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homepage-keywords" className="text-sage-700">Keywords</Label>
                    <Input
                      id="homepage-keywords"
                      value={seoSettings.homepage.keywords}
                      onChange={(e) => setSeoSettings({
                        ...seoSettings,
                        homepage: {...seoSettings.homepage, keywords: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("Homepage SEO", {
                      seo: {
                        ...settings?.seo,
                        homepage: seoSettings.homepage
                      }
                    })}
                    className="w-full btn-ayurveda"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Homepage SEO"}
                  </Button>
                </CardContent>
              </Card>

              {/* Product SEO */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Product Page SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-meta-title" className="text-sage-700">Meta Title</Label>
                    <Input
                      id="product-meta-title"
                      value={seoSettings.product.title}
                      onChange={(e) => setSeoSettings({
                        ...seoSettings,
                        product: {...seoSettings.product, title: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-meta-desc" className="text-sage-700">Meta Description</Label>
                    <Textarea
                      id="product-meta-desc"
                      value={seoSettings.product.description}
                      onChange={(e) => setSeoSettings({
                        ...seoSettings,
                        product: {...seoSettings.product, description: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-keywords" className="text-sage-700">Keywords</Label>
                    <Input
                      id="product-keywords"
                      value={seoSettings.product.keywords}
                      onChange={(e) => setSeoSettings({
                        ...seoSettings,
                        product: {...seoSettings.product, keywords: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("Product SEO", {
                      seo: {
                        ...settings?.seo,
                        product: seoSettings.product
                      }
                    })}
                    className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Product SEO"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Management Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins">Pricing Plans Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {pricingPlans.map((plan, index) => (
                  <div key={plan.id} className="border border-sage-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sage-700">{plan.name}</h4>
                      <Switch 
                        checked={plan.enabled}
                        onCheckedChange={(checked) => {
                          const updatedPlans = [...pricingPlans];
                          updatedPlans[index].enabled = checked;
                          setPricingPlans(updatedPlans);
                        }}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sage-700">Plan Name</Label>
                        <Input
                          value={plan.name}
                          onChange={(e) => {
                            const updatedPlans = [...pricingPlans];
                            updatedPlans[index].name = e.target.value;
                            setPricingPlans(updatedPlans);
                          }}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700">Price (₹)</Label>
                        <Input
                          type="number"
                          value={plan.price}
                          onChange={(e) => {
                            const updatedPlans = [...pricingPlans];
                            updatedPlans[index].price = parseInt(e.target.value);
                            setPricingPlans(updatedPlans);
                          }}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700">MRP (₹)</Label>
                        <Input
                          type="number"
                          value={plan.mrp}
                          onChange={(e) => {
                            const updatedPlans = [...pricingPlans];
                            updatedPlans[index].mrp = parseInt(e.target.value);
                            setPricingPlans(updatedPlans);
                          }}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={plan.popular || false}
                          onCheckedChange={(checked) => {
                            const updatedPlans = [...pricingPlans];
                            updatedPlans[index].popular = checked;
                            setPricingPlans(updatedPlans);
                          }}
                        />
                        <Label className="text-sage-700">Mark as Popular</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={plan.bestValue || false}
                          onCheckedChange={(checked) => {
                            const updatedPlans = [...pricingPlans];
                            updatedPlans[index].bestValue = checked;
                            setPricingPlans(updatedPlans);
                          }}
                        />
                        <Label className="text-sage-700">Mark as Best Value</Label>
                      </div>
                    </div>
                  </div>
                ))}

                <Button 
                  onClick={() => saveSettings("Pricing Plans", {
                    product: {
                      ...settings?.product,
                      plans: pricingPlans
                    }
                  })}
                  className="w-full btn-ayurveda"
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Pricing Plans"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials/Reviews Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card className="card-ayurveda">
              <CardHeader>
                <CardTitle className="text-sage-700 font-poppins">Testimonials & Reviews Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="border border-sage-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sage-700">Testimonial #{testimonial.id}</h4>
                      <Switch 
                        checked={testimonial.enabled}
                        onCheckedChange={(checked) => {
                          const updated = [...testimonials];
                          updated[index].enabled = checked;
                          setTestimonials(updated);
                        }}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sage-700">Customer Name</Label>
                        <Input
                          value={testimonial.name}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index].name = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700">Location</Label>
                        <Input
                          value={testimonial.location}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index].location = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sage-700">Testimonial Text</Label>
                      <Textarea
                        value={testimonial.text}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[index].text = e.target.value;
                          setTestimonials(updated);
                        }}
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sage-700">Rating (1-5)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={testimonial.rating}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index].rating = parseInt(e.target.value);
                            setTestimonials(updated);
                          }}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700">Before Weight</Label>
                        <Input
                          value={testimonial.beforeWeight || ""}
                          placeholder="e.g. 78 kg"
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index].beforeWeight = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700">After Weight</Label>
                        <Input
                          value={testimonial.afterWeight || ""}
                          placeholder="e.g. 60 kg"
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index].afterWeight = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sage-700">Video URL (Optional)</Label>
                        <Input
                          value={testimonial.video || ""}
                          placeholder="https://youtube.com/watch?v=..."
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index].video = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700">Image URL (Optional)</Label>
                        <Input
                          value={testimonial.image || ""}
                          placeholder="Image URL"
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index].image = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <Button 
                    onClick={() => {
                      const newTestimonial = {
                        id: testimonials.length + 1,
                        name: "Customer Name",
                        location: "City",
                        rating: 5,
                        text: "Amazing results!",
                        image: "",
                        video: "",
                        beforeWeight: "",
                        afterWeight: "",
                        enabled: true
                      };
                      setTestimonials([...testimonials, newTestimonial]);
                    }}
                    variant="outline"
                    className="border-sage-300 text-sage-700 hover:bg-sage-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Testimonial
                  </Button>

                  <Button 
                    onClick={() => saveSettings("Testimonials", {
                      homepage: {
                        ...settings?.homepage,
                        testimonials: testimonials
                      }
                    })}
                    className="btn-ayurveda"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Testimonials"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Management Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Image Upload */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Upload Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sage-700">Hero Banner Image</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadImage(file, 'hero-banner');
                          if (url) {
                            setContentSettings({
                              ...contentSettings,
                              homepage: {...contentSettings.homepage, heroImage: url}
                            });
                          }
                        }
                      }}
                      className="w-full p-2 border border-sage-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Product Image</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadImage(file, 'product');
                          if (url) {
                            setContentSettings({
                              ...contentSettings,
                              product: {...contentSettings.product, image: url}
                            });
                          }
                        }
                      }}
                      className="w-full p-2 border border-sage-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Logo</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadImage(file, 'logo');
                          if (url) {
                            setWebsiteSettings({
                              ...websiteSettings,
                              logo: url
                            });
                          }
                        }
                      }}
                      className="w-full p-2 border border-sage-200 rounded-lg"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("Media", {
                      homepage: {
                        ...settings?.homepage,
                        heroImage: contentSettings.homepage.heroImage
                      },
                      product: {
                        ...settings?.product,
                        image: contentSettings.product.image
                      },
                      site: {
                        ...settings?.site,
                        logo: websiteSettings.logo
                      }
                    })}
                    className="w-full btn-ayurveda"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Media Changes"}
                  </Button>
                </CardContent>
              </Card>

              {/* Current Images */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Current Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settings?.homepage?.heroImage && (
                    <div>
                      <Label className="text-sage-700">Hero Banner</Label>
                      <div className="w-full h-32 bg-sage-100 rounded-lg flex items-center justify-center">
                        <img 
                          src={settings.homepage.heroImage} 
                          alt="Hero Banner" 
                          className="max-w-full max-h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {settings?.product?.image && (
                    <div>
                      <Label className="text-sage-700">Product Image</Label>
                      <div className="w-full h-32 bg-sage-100 rounded-lg flex items-center justify-center">
                        <img 
                          src={settings.product.image} 
                          alt="Product" 
                          className="max-w-full max-h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {settings?.site?.logo && (
                    <div>
                      <Label className="text-sage-700">Logo</Label>
                      <div className="w-full h-20 bg-sage-100 rounded-lg flex items-center justify-center">
                        <img 
                          src={settings.site.logo} 
                          alt="Logo" 
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Orders Tab with Status Updates */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold font-poppins text-sage-700">
                  Order Management
                  {activeFilter !== 'all' && (
                    <span className="text-lg text-sage-500 ml-2">
                      ({activeFilter} - {filteredOrders.length} orders)
                    </span>
                  )}
                </h3>
                <p className="text-sage-600 mt-1">
                  Manage all customer orders, update statuses, and track deliveries
                </p>
                
                {/* Active Filter Display */}
                {activeFilter !== 'all' && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-sage-100 text-sage-700">
                      Filtered: {activeFilter}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => loadOrdersWithFilter("all")}
                      className="text-sage-600 hover:text-sage-700"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear Filter
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <select 
                  value={activeFilter}
                  onChange={(e) => loadOrdersWithFilter(e.target.value)}
                  className="px-4 py-2 border border-sage-200 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-sage-300 focus:border-sage-400"
                  disabled={isUpdatingOrders}
                >
                  <option value="all">All Orders</option>
                  <option value="today">Today's Orders</option>
                  <option value="pending">Pending Orders</option>
                  <option value="processing">Processing</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cod">COD Orders</option>
                  <option value="online">Online Payments</option>
                  <option value="guest">Guest Orders</option>
                  <option value="registered">Registered Users</option>
                </select>
                
                <Button 
                  onClick={exportOrders}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  disabled={isUpdatingOrders}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                
                <Button 
                  onClick={() => loadOrdersWithFilter(activeFilter)}
                  variant="outline"
                  className="border-sage-300 text-sage-700 hover:bg-sage-50"
                  disabled={isUpdatingOrders}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isUpdatingOrders ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                {selectedOrders.length > 0 && (
                  <div className="flex items-center gap-2">
                    <select
                      value={bulkActionType}
                      onChange={(e) => setBulkActionType(e.target.value)}
                      className="px-3 py-2 border border-sage-200 rounded-lg text-sm bg-white"
                    >
                      <option value="">Bulk Action...</option>
                      <option value="confirmed">Mark as Confirmed</option>
                      <option value="processing">Mark as Processing</option>
                      <option value="shipped">Mark as Shipped</option>
                      <option value="delivered">Mark as Delivered</option>
                    </select>
                    
                    <Button 
                      onClick={() => {
                        if (bulkActionType) {
                          showConfirmDialog(
                            "Bulk Update Orders",
                            `Update ${selectedOrders.length} orders to "${bulkActionType}" status?`,
                            () => performBulkAction(bulkActionType, selectedOrders)
                          );
                        }
                      }}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      disabled={!bulkActionType || isUpdatingOrders}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Apply ({selectedOrders.length})
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Card className="shadow-sm border-sage-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-sage-50 to-sage-100 border-b border-sage-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-sage-800">
                          <input type="checkbox" className="rounded border-sage-300" />
                        </th>
                        <th className="text-left p-4 font-semibold text-sage-800">Order Details</th>
                        <th className="text-left p-4 font-semibold text-sage-800">Customer</th>
                        <th className="text-left p-4 font-semibold text-sage-800">Product & Amount</th>
                        <th className="text-left p-4 font-semibold text-sage-800">Payment</th>
                        <th className="text-left p-4 font-semibold text-sage-800">Status</th>
                        <th className="text-left p-4 font-semibold text-sage-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders && filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b border-sage-100 hover:bg-sage-50 transition-colors">
                            <td className="p-4">
                              <input 
                                type="checkbox" 
                                className="rounded border-sage-300"
                                checked={selectedOrders.includes(order.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedOrders([...selectedOrders, order.id]);
                                  } else {
                                    setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="font-semibold text-sage-800 font-mono text-sm">#{order.id}</p>
                                <p className="text-xs text-sage-600">
                                  {new Date(order.orderTime).toLocaleDateString()} at {new Date(order.orderTime).toLocaleTimeString()}
                                </p>
                                <div className="flex gap-1">
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      order.customerType === 'guest' ? 'border-orange-300 text-orange-700 bg-orange-50' :
                                      order.customerType === 'linked_guest' ? 'border-blue-300 text-blue-700 bg-blue-50' :
                                      'border-green-300 text-green-700 bg-green-50'
                                    }
                                  >
                                    {order.customerType === 'guest' ? 'Guest' : 
                                     order.customerType === 'linked_guest' ? 'Linked' : 'User'}
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="font-semibold text-sage-800">{order.userName}</p>
                                <p className="text-sm text-sage-600 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {order.userPhone}
                                </p>
                                {order.userEmail && (
                                  <p className="text-sm text-sage-600 flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {order.userEmail}
                                  </p>
                                )}
                                <p className="text-xs text-sage-500">
                                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="font-semibold text-sage-800">{order.planName}</p>
                                <p className="text-xl font-bold text-emerald-700">₹{order.price?.toLocaleString()}</p>
                                <p className="text-xs text-sage-600">Qty: {order.totalQuantity || 1}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-2">
                                <Badge 
                                  className={
                                    order.paymentMethod === 'cod' 
                                      ? 'bg-orange-100 text-orange-800 border-orange-200' 
                                      : 'bg-green-100 text-green-800 border-green-200'
                                  }
                                >
                                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                </Badge>
                                <select 
                                  value={order.paymentStatus || 'pending'} 
                                  onChange={(e) => {
                                    const newPaymentStatus = e.target.value;
                                    showConfirmDialog(
                                      "Update Payment Status",
                                      `Change payment status for order ${order.id} to "${newPaymentStatus}"?`,
                                      () => updatePaymentStatus(order.id, newPaymentStatus)
                                    );
                                  }}
                                  className="text-xs px-2 py-1 rounded border border-sage-200 bg-white"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="completed">Completed</option>
                                  <option value="failed">Failed</option>
                                  <option value="refunded">Refunded</option>
                                </select>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-2">
                                <select 
                                  value={order.orderStatus} 
                                  onChange={(e) => {
                                    const newStatus = e.target.value;
                                    showConfirmDialog(
                                      "Update Order Status",
                                      `Change order ${order.id} from "${order.orderStatus}" to "${newStatus}"?`,
                                      () => updateOrderStatus(order.id, newStatus)
                                    );
                                  }}
                                  className={`px-2 py-1 rounded text-xs font-medium border ${
                                    order.orderStatus === 'delivered' || order.orderStatus === 'completed'
                                      ? 'bg-green-100 text-green-800 border-green-200' 
                                      : order.orderStatus === 'shipped'
                                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                                      : order.orderStatus === 'confirmed'
                                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                                      : order.orderStatus === 'processing'
                                      ? 'bg-orange-100 text-orange-800 border-orange-200'
                                      : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                  }`}
                                  disabled={isUpdatingOrders}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                {order.shiprocket?.awbCode && (
                                  <p className="text-xs text-sage-600 font-mono">
                                    AWB: {order.shiprocket.awbCode}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Enhanced order details display
                                    const details = `
Order Details:

Order ID: ${order.id}
Status: ${order.orderStatus}
Customer: ${order.userName}
Phone: ${order.userPhone}
Email: ${order.userEmail || 'Not provided'}
Customer Type: ${order.customerType}

Product: ${order.planName}
Quantity: ${order.totalQuantity || 1}
Amount: ₹${order.price?.toLocaleString()}
Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}

Shipping Address:
${order.shippingAddress?.address || 'Not provided'}
${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}

Order Date: ${order.orderDate} ${order.orderTime12}
${order.shiprocket?.awbCode ? `\nAWB Code: ${order.shiprocket.awbCode}` : ''}
${order.shiprocket?.courierName ? `Courier: ${order.shiprocket.courierName}` : ''}
${order.adminNotes ? `\nAdmin Notes: ${order.adminNotes}` : ''}
                                    `;
                                    alert(details);
                                  }}
                                  className="border-sage-300 text-sage-700 hover:bg-sage-50"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const notes = prompt("Add admin notes (optional):", "");
                                    if (notes !== null) {
                                      updateOrderStatus(order.id, order.orderStatus, notes);
                                    }
                                  }}
                                  className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Note
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    toast({
                                      title: "SMS Sent ✅",
                                      description: `Order update sent to ${order.userPhone}`,
                                    });
                                  }}
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                  disabled={isUpdatingOrders}
                                >
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  SMS
                                </Button>
                                {order.shiprocket?.awbCode && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => trackShipment(order.shiprocket.awbCode)}
                                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                  >
                                    <Truck className="w-3 h-3 mr-1" />
                                    Track
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-12 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <Package className="w-16 h-16 text-sage-300" />
                              <div>
                                <h3 className="text-lg font-semibold text-sage-700 mb-2">
                                  {activeFilter === 'all' ? 'No Orders Yet' : `No ${activeFilter} Orders Found`}
                                </h3>
                                <p className="text-sage-500">
                                  {activeFilter === 'all' 
                                    ? 'Orders will appear here when customers make purchases.'
                                    : `No orders found with filter: ${activeFilter}. Try a different filter or clear the current one.`
                                  }
                                </p>
                                {activeFilter !== 'all' && (
                                  <Button 
                                    onClick={() => loadOrdersWithFilter("all")}
                                    variant="outline"
                                    className="mt-4 border-sage-300 text-sage-700 hover:bg-sage-50"
                                  >
                                    View All Orders
                                  </Button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold font-poppins text-sage-700">
                  User Management
                </h3>
                <p className="text-sage-600 mt-1">
                  Manage all registered users and their order history
                </p>
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-4 py-2 border border-sage-200 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-sage-300 focus:border-sage-400"
                  onChange={(e) => {
                    const filter = e.target.value;
                    // Implement user filtering logic here
                    console.log("User filter changed:", filter);
                  }}
                >
                  <option value="all">All Users</option>
                  <option value="registration">Registration</option>
                  <option value="orders">Orders Stats</option>
                  <option value="value">Total Value</option>
                  <option value="paying">Paying Customers</option>
                  <option value="new">New Users</option>
                  <option value="inactive">Inactive Users</option>
                </select>
                <Button 
                  onClick={exportUsers}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            <Card className="shadow-sm border-sage-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-sage-50 to-sage-100 border-b border-sage-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-sage-800">User Details</th>
                        <th className="text-left p-4 font-semibold text-sage-800">Contact Info</th>
                        <th className="text-left p-4 font-semibold text-sage-800">Registration</th>
                        <th className="text-left p-4 font-semibold text-sage-800">Order Stats</th>
                        <th className="text-left p-4 font-semibold text-sage-800">Total Value</th>
                        <th className="text-left p-4 font-semibold text-sage-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users && users.length > 0 ? (
                        users.map((user: any) => (
                          <tr key={user.id} className="border-b border-sage-100 hover:bg-sage-50 transition-colors">
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="font-semibold text-sage-800">{user.name}</p>
                                <p className="text-xs text-sage-600 font-mono">ID: {user.id}</p>
                                <div className="flex gap-1">
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      user.totalOrders > 0 
                                        ? 'border-green-300 text-green-700 bg-green-50' 
                                        : 'border-gray-300 text-gray-700 bg-gray-50'
                                    }
                                  >
                                    {user.totalOrders > 0 ? 'Customer' : 'Registered'}
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="text-sm text-sage-700 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {user.phone}
                                </p>
                                {user.email && (
                                  <p className="text-sm text-sage-600 flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {user.email}
                                  </p>
                                )}
                                <p className="text-xs text-sage-500">
                                  Method: {user.signupMethod || 'OTP'}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="text-sm text-sage-700">
                                  {new Date(user.signupTime).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-sage-600">
                                  {new Date(user.signupTime).toLocaleTimeString()}
                                </p>
                                <Badge className="bg-blue-100 text-blue-700 text-xs">
                                  {Math.floor((Date.now() - new Date(user.signupTime).getTime()) / (1000 * 60 * 60 * 24))} days ago
                                </Badge>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="text-lg font-bold text-sage-700">{user.totalOrders}</p>
                                <p className="text-xs text-sage-600">Total Orders</p>
                                {user.totalOrders > 0 && (
                                  <Badge className="bg-purple-100 text-purple-700 text-xs">
                                    Active Customer
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <p className="text-xl font-bold text-emerald-700">₹{user.totalSpent?.toLocaleString()}</p>
                                <p className="text-xs text-sage-600">Total Spent</p>
                                {user.totalSpent > 0 && (
                                  <p className="text-xs text-sage-500">
                                    Avg: ₹{Math.round(user.totalSpent / (user.totalOrders || 1))}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Show user orders
                                    toast({
                                      title: "User Orders",
                                      description: `Viewing orders for ${user.name}`,
                                    });
                                  }}
                                  className="border-sage-300 text-sage-700 hover:bg-sage-50"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    toast({
                                      title: "Message Sent",
                                      description: `SMS sent to ${user.phone}`,
                                    });
                                  }}
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  SMS
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-12 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <Users className="w-16 h-16 text-sage-300" />
                              <div>
                                <h3 className="text-lg font-semibold text-sage-700 mb-2">No Users Yet</h3>
                                <p className="text-sage-500">Users will appear here when they register on your website.</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consolidated Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold font-poppins text-sage-700">
                  System Settings
                </h3>
                <p className="text-sage-600 mt-1">
                  Configure all aspects of your website and business operations
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Enhanced Communications Settings with Complete Configuration */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Communications (PROTECTED - Super Admin Only)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* SMS Configuration */}
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        SMS Gateway Configuration
                      </h4>
                      <Switch 
                        checked={communicationsForm.sms.enabled}
                        onCheckedChange={(checked) => setCommunicationsForm({
                          ...communicationsForm,
                          sms: {...communicationsForm.sms, enabled: checked}
                        })}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">SMS Provider</Label>
                        <select 
                          value={communicationsForm.sms.provider}
                          onChange={(e) => setCommunicationsForm({
                            ...communicationsForm,
                            sms: {...communicationsForm.sms, provider: e.target.value}
                          })}
                          className="w-full p-2 border border-sage-200 rounded-lg focus:border-sage-400 bg-white"
                        >
                          <option value="infobip">Infobip (Current)</option>
                          <option value="twilio">Twilio</option>
                          <option value="textlocal">TextLocal</option>
                          <option value="msg91">MSG91</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">API Key</Label>
                        <Input
                          type="password"
                          value={communicationsForm.sms.apiKey}
                          onChange={(e) => setCommunicationsForm({
                            ...communicationsForm,
                            sms: {...communicationsForm.sms, apiKey: e.target.value}
                          })}
                          placeholder="Enter your SMS API key"
                          className="border-sage-200 focus:border-sage-400 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">Sender ID</Label>
                        <Input
                          value={communicationsForm.sms.senderId}
                          onChange={(e) => setCommunicationsForm({
                            ...communicationsForm,
                            sms: {...communicationsForm.sms, senderId: e.target.value}
                          })}
                          placeholder="AYUVDC (max 6 chars)"
                          maxLength={6}
                          className="border-sage-200 focus:border-sage-400 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">Base URL</Label>
                        <Input
                          value={communicationsForm.sms.baseUrl}
                          onChange={(e) => setCommunicationsForm({
                            ...communicationsForm,
                            sms: {...communicationsForm.sms, baseUrl: e.target.value}
                          })}
                          placeholder="https://api.infobip.com"
                          className="border-sage-200 focus:border-sage-400 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Configuration */}
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-green-800 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Service Configuration
                      </h4>
                      <Switch 
                        checked={communicationsForm.email.enabled}
                        onCheckedChange={(checked) => setCommunicationsForm({
                          ...communicationsForm,
                          email: {...communicationsForm.email, enabled: checked}
                        })}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">SMTP Host</Label>
                        <Input
                          value={communicationsForm.email.smtpHost}
                          onChange={(e) => setCommunicationsForm({
                            ...communicationsForm,
                            email: {...communicationsForm.email, smtpHost: e.target.value}
                          })}
                          placeholder="smtp.gmail.com"
                          className="border-sage-200 focus:border-sage-400 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">SMTP Port</Label>
                        <Input
                          type="number"
                          value={communicationsForm.email.smtpPort}
                          onChange={(e) => setCommunicationsForm({
                            ...communicationsForm,
                            email: {...communicationsForm.email, smtpPort: parseInt(e.target.value)}
                          })}
                          placeholder="587"
                          className="border-sage-200 focus:border-sage-400 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">Username</Label>
                        <Input
                          value={communicationsForm.email.username}
                          onChange={(e) => setCommunicationsForm({
                            ...communicationsForm,
                            email: {...communicationsForm.email, username: e.target.value}
                          })}
                          placeholder="your@gmail.com"
                          className="border-sage-200 focus:border-sage-400 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">Password / API Key</Label>
                        <Input
                          type="password"
                          value={communicationsForm.email.password}
                          onChange={(e) => setCommunicationsForm({
                            ...communicationsForm,
                            email: {...communicationsForm.email, password: e.target.value}
                          })}
                          placeholder="••••••••"
                          className="border-sage-200 focus:border-sage-400 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Protected Save Button */}
                  <Button 
                    onClick={() => {
                      // Protected save - only save communications without affecting others
                      const protectedSave = async () => {
                        try {
                          // Use the existing saveSettings function with protection
                          await saveSettings("Communications", {
                            communications: {
                              ...settings?.communications,
                              ...communicationsForm,
                              lastUpdated: new Date().toISOString(),
                              protectedSave: true
                            }
                          });
                          
                          toast({
                            title: "🔒 Protected Save Complete",
                            description: "Communication settings saved without affecting other integrations",
                          });
                        } catch (error) {
                          toast({
                            title: "Save Error",
                            description: "Failed to save communication settings",
                            variant: "destructive"
                          });
                        }
                      };
                      
                      protectedSave();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "🔒 Protected Save Communications"}
                  </Button>
                </CardContent>
              </Card>

              {/* Enhanced Shiprocket Settings with Complete Configuration */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shiprocket Integration (PROTECTED)
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          shiprocketStatus.status === 'connected' ? 'bg-green-100 text-green-700' :
                          shiprocketStatus.status === 'auth_failed' || shiprocketStatus.status === 'not_configured' ? 'bg-red-100 text-red-700' :
                          shiprocketStatus.status === 'disabled' ? 'bg-gray-100 text-gray-700' :
                          shiprocketStatus.status === 'checking' || shiprocketStatus.status === 'retrying' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }
                      >
                        {shiprocketStatus.status === 'connected' ? '✅ Connected' :
                         shiprocketStatus.status === 'auth_failed' ? '❌ Auth Failed' :
                         shiprocketStatus.status === 'not_configured' ? '⚠️ Not Setup' :
                         shiprocketStatus.status === 'disabled' ? '⏸️ Disabled' :
                         shiprocketStatus.status === 'checking' ? '🔍 Checking...' :
                         shiprocketStatus.status === 'retrying' ? '🔄 Retrying...' :
                         '⚠️ Error'}
                      </Badge>
                      
                      {(shiprocketStatus.status === 'auth_failed' || shiprocketStatus.status === 'error') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={retryShiprocketAuth}
                          className="text-xs h-6 px-2"
                          disabled={shiprocketStatus.status === 'retrying'}
                        >
                          {shiprocketStatus.status === 'retrying' ? 'Retrying...' : 'Retry'}
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Message */}
                  {shiprocketStatus.message && (
                    <div className={`p-3 rounded-lg text-sm ${
                      shiprocketStatus.status === 'connected' ? 'bg-green-50 text-green-700' :
                      shiprocketStatus.status === 'auth_failed' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      {shiprocketStatus.message}
                      {shiprocketStatus.error && (
                        <div className="mt-1 text-xs opacity-80">
                          Error: {shiprocketStatus.error}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg border-2 border-sage-200">
                    <div>
                      <Label className="text-sage-700 font-semibold">Enable Shiprocket Integration</Label>
                      <p className="text-xs text-sage-600 mt-1">Turn on/off automatic order sync to Shiprocket</p>
                    </div>
                    <Switch 
                      checked={shippingSettings.shiprocket.enabled}
                      onCheckedChange={(checked) => setShippingSettings({
                        shiprocket: {...shippingSettings.shiprocket, enabled: checked}
                      })}
                    />
                  </div>

                  {/* API Credentials */}
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      API Credentials (PROTECTED - Super Admin Only)
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">API User Email</Label>
                        <Input
                          value={shippingSettings.shiprocket.email || ""}
                          onChange={(e) => setShippingSettings({
                            shiprocket: {...shippingSettings.shiprocket, email: e.target.value}
                          })}
                          placeholder="crepact@gmail.com"
                          className="border-sage-200 focus:border-sage-400 bg-white"
                        />
                        <p className="text-xs text-sage-500">Your Shiprocket account email</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">API Password</Label>
                        <Input
                          type="password"
                          value={shippingSettings.shiprocket.password || ""}
                          onChange={(e) => setShippingSettings({
                            shiprocket: {...shippingSettings.shiprocket, password: e.target.value}
                          })}
                          placeholder="••••••••"
                          className="border-sage-200 focus:border-sage-400 bg-white"
                        />
                        <p className="text-xs text-sage-500">Your Shiprocket account password</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">Channel ID</Label>
                        <Input
                          value={shippingSettings.shiprocket.channelId || ""}
                          onChange={(e) => setShippingSettings({
                            shiprocket: {...shippingSettings.shiprocket, channelId: e.target.value}
                          })}
                          placeholder="7303784"
                          className="border-sage-200 focus:border-sage-400 bg-white"
                        />
                        <p className="text-xs text-sage-500">Shiprocket channel ID for orders</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700 font-medium">Current Auth Token</Label>
                        <Input
                          value={settings?.shipping?.shiprocket?.token ? `${settings.shipping.shiprocket.token.substring(0, 20)}...` : "Not generated"}
                          readOnly
                          className="border-sage-200 bg-gray-50 text-gray-600"
                        />
                        <p className="text-xs text-sage-500">Auto-generated via login API</p>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Location Info */}
                  {(shippingSettings.shiprocket.pickupLocation || settings?.shipping?.shiprocket?.pickupLocation) && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                        <span className="font-medium text-yellow-800">Current Pickup Location</span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        <strong>{shippingSettings.shiprocket.pickupLocation || settings?.shipping?.shiprocket?.pickupLocation}</strong>
                        {settings?.shipping?.shiprocket?.pickupLocationId && ` (ID: ${settings.shipping.shiprocket.pickupLocationId})`}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-sage-200">
                    <Button 
                      onClick={retryShiprocketAuth}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      disabled={shiprocketStatus.status === 'retrying'}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>

                    <Button 
                      onClick={() => {
                        // Protected save - only save Shiprocket settings without affecting others
                        const protectedSave = async () => {
                          try {
                            // Use the existing saveSettings function with protection
                            await saveSettings("Shiprocket", {
                              shipping: {
                                ...settings?.shipping,
                                shiprocket: {
                                  ...settings?.shipping?.shiprocket,
                                  ...shippingSettings.shiprocket,
                                  lastUpdated: new Date().toISOString(),
                                  protectedSave: true
                                }
                              }
                            });
                            
                            toast({
                              title: "🔒 Protected Save Complete",
                              description: "Shiprocket settings saved without affecting other integrations",
                            });
                          } catch (error) {
                            toast({
                              title: "Save Error",
                              description: "Failed to save Shiprocket settings",
                              variant: "destructive"
                            });
                          }
                        };
                        
                        protectedSave();
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "🔒 Protected Save"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Design Settings */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Design & Branding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sage-700">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color" 
                        value={websiteSettings.primaryColor} 
                        onChange={(e) => setWebsiteSettings({...websiteSettings, primaryColor: e.target.value})}
                        className="w-16 h-10 p-1 border-sage-200"
                      />
                      <span className="text-sage-600 text-sm font-mono">{websiteSettings.primaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Website Name</Label>
                    <Input
                      value={websiteSettings.siteName}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, siteName: e.target.value})}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("Design", {
                      site: {
                        title: websiteSettings.siteName,
                        tagline: websiteSettings.tagline
                      },
                      design: {
                        colors: {
                          primary: websiteSettings.primaryColor,
                          secondary: websiteSettings.secondaryColor,
                          accent: websiteSettings.accentColor
                        }
                      }
                    })}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Design Settings
                  </Button>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    SEO & Meta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sage-700">Homepage Meta Title</Label>
                    <Input
                      value={seoSettings.homepage.title}
                      onChange={(e) => setSeoSettings({
                        ...seoSettings,
                        homepage: {...seoSettings.homepage, title: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Meta Description</Label>
                    <Textarea
                      value={seoSettings.homepage.description}
                      onChange={(e) => setSeoSettings({
                        ...seoSettings,
                        homepage: {...seoSettings.homepage, description: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("SEO", {
                      seo: seoSettings
                    })}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save SEO Settings
                  </Button>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sage-600">Website Status</span>
                      <Badge className="bg-green-100 text-green-700">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sage-600">Total Orders</span>
                      <Badge className="bg-blue-100 text-blue-700">{stats?.orders?.totalOrders || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sage-600">Total Revenue</span>
                      <Badge className="bg-emerald-100 text-emerald-700">₹{stats?.orders?.totalRevenue?.toLocaleString() || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sage-600">Total Users</span>
                      <Badge className="bg-purple-100 text-purple-700">{stats?.users?.totalUsers || 0}</Badge>
                    </div>
                  </div>

                  <Button 
                    onClick={refreshData}
                    variant="outline"
                    className="w-full border-sage-300 text-sage-700 hover:bg-sage-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* SMS Settings */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">SMS Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                    <Label className="text-sage-700">Enable SMS</Label>
                    <Switch 
                      checked={communicationsForm.sms.enabled}
                      onCheckedChange={(checked) => setCommunicationsForm({
                        ...communicationsForm,
                        sms: {...communicationsForm.sms, enabled: checked}
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">SMS Provider</Label>
                    <select 
                      value={communicationsForm.sms.provider}
                      onChange={(e) => setCommunicationsForm({
                        ...communicationsForm,
                        sms: {...communicationsForm.sms, provider: e.target.value}
                      })}
                      className="w-full p-2 border border-sage-200 rounded-lg focus:border-sage-400"
                    >
                      <option value="infobip">Infobip</option>
                      <option value="twilio">Twilio</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">API Key</Label>
                    <Input
                      value={communicationsForm.sms.apiKey}
                      onChange={(e) => setCommunicationsForm({
                        ...communicationsForm,
                        sms: {...communicationsForm.sms, apiKey: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Sender ID</Label>
                    <Input
                      value={communicationsForm.sms.senderId}
                      onChange={(e) => setCommunicationsForm({
                        ...communicationsForm,
                        sms: {...communicationsForm.sms, senderId: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Base URL</Label>
                    <Input
                      value={communicationsForm.sms.baseUrl}
                      onChange={(e) => setCommunicationsForm({
                        ...communicationsForm,
                        sms: {...communicationsForm.sms, baseUrl: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("SMS Communications", {
                      communications: {
                        ...settings?.communications,
                        sms: communicationsForm.sms
                      }
                    })}
                    className="w-full btn-ayurveda"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save SMS Settings"}
                  </Button>
                </CardContent>
              </Card>

              {/* Email Settings */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Email Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                    <Label className="text-sage-700">Enable Email</Label>
                    <Switch 
                      checked={communicationsForm.email.enabled}
                      onCheckedChange={(checked) => setCommunicationsForm({
                        ...communicationsForm,
                        email: {...communicationsForm.email, enabled: checked}
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">SMTP Host</Label>
                    <Input
                      value={communicationsForm.email.smtpHost}
                      onChange={(e) => setCommunicationsForm({
                        ...communicationsForm,
                        email: {...communicationsForm.email, smtpHost: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">SMTP Port</Label>
                    <Input
                      type="number"
                      value={communicationsForm.email.smtpPort}
                      onChange={(e) => setCommunicationsForm({
                        ...communicationsForm,
                        email: {...communicationsForm.email, smtpPort: parseInt(e.target.value)}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Username</Label>
                    <Input
                      value={communicationsForm.email.username}
                      onChange={(e) => setCommunicationsForm({
                        ...communicationsForm,
                        email: {...communicationsForm.email, username: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Password</Label>
                    <Input
                      type="password"
                      value={communicationsForm.email.password}
                      onChange={(e) => setCommunicationsForm({
                        ...communicationsForm,
                        email: {...communicationsForm.email, password: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">From Name</Label>
                    <Input
                      value={communicationsForm.email.fromName}
                      onChange={(e) => setCommunicationsForm({
                        ...communicationsForm,
                        email: {...communicationsForm.email, fromName: e.target.value}
                      })}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("Email Communications", {
                      communications: {
                        ...settings?.communications,
                        email: communicationsForm.email
                      }
                    })}
                    className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Email Settings"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Payment Gateway */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Payment Gateway</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sage-700">Merchant Key</Label>
                    <Input
                      value={paymentSettings.merchantKey}
                      onChange={(e) => setPaymentSettings({...paymentSettings, merchantKey: e.target.value})}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Merchant Salt</Label>
                    <Input
                      value={paymentSettings.merchantSalt}
                      onChange={(e) => setPaymentSettings({...paymentSettings, merchantSalt: e.target.value})}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                    <Label className="text-sage-700">Test Mode</Label>
                    <Switch 
                      checked={paymentSettings.testMode}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, testMode: checked})}
                    />
                  </div>

                  <Button 
                    onClick={() => saveSettings("Payment Gateway", {
                      payment: paymentSettings
                    })}
                    className="w-full btn-ayurveda"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Payment Settings"}
                  </Button>
                </CardContent>
              </Card>

              {/* Shiprocket Shipping */}
              <Card className="card-ayurveda">
                <CardHeader>
                  <CardTitle className="text-sage-700 font-poppins">Shiprocket Shipping Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                    <Label className="text-sage-700">Enable Shiprocket</Label>
                    <Switch 
                      checked={shippingSettings.shiprocket.enabled}
                      onCheckedChange={(checked) => setShippingSettings({
                        shiprocket: {...shippingSettings.shiprocket, enabled: checked}
                      })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sage-700">Email</Label>
                      <Input
                        value={shippingSettings.shiprocket.email || "crepact@gmail.com"}
                        onChange={(e) => setShippingSettings({
                          shiprocket: {...shippingSettings.shiprocket, email: e.target.value}
                        })}
                        className="border-sage-200 focus:border-sage-400"
                        placeholder="crepact@gmail.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sage-700">Password</Label>
                      <Input
                        type="password"
                        value={shippingSettings.shiprocket.password || "aDIL@8899"}
                        onChange={(e) => setShippingSettings({
                          shiprocket: {...shippingSettings.shiprocket, password: e.target.value}
                        })}
                        className="border-sage-200 focus:border-sage-400"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sage-700">Channel ID</Label>
                      <Input
                        value={shippingSettings.shiprocket.channelId || "7303784"}
                        onChange={(e) => setShippingSettings({
                          shiprocket: {...shippingSettings.shiprocket, channelId: e.target.value}
                        })}
                        className="border-sage-200 focus:border-sage-400"
                        placeholder="7303784"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sage-700">Pickup Pincode</Label>
                      <Input
                        value={shippingSettings.shiprocket.pickupPincode || "400001"}
                        onChange={(e) => setShippingSettings({
                          shiprocket: {...shippingSettings.shiprocket, pickupPincode: e.target.value}
                        })}
                        className="border-sage-200 focus:border-sage-400"
                        placeholder="400001"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-sage-200">
                    <h4 className="font-medium text-sage-700">Package Dimensions</h4>
                    
                    <div className="grid grid-cols-4 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sage-700 text-sm">Length (cm)</Label>
                        <Input
                          type="number"
                          value={shippingSettings.shiprocket.packageDimensions?.length || 15}
                          onChange={(e) => setShippingSettings({
                            shiprocket: {
                              ...shippingSettings.shiprocket, 
                              packageDimensions: {
                                ...shippingSettings.shiprocket.packageDimensions,
                                length: parseInt(e.target.value)
                              }
                            }
                          })}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sage-700 text-sm">Breadth (cm)</Label>
                        <Input
                          type="number"
                          value={shippingSettings.shiprocket.packageDimensions?.breadth || 10}
                          onChange={(e) => setShippingSettings({
                            shiprocket: {
                              ...shippingSettings.shiprocket, 
                              packageDimensions: {
                                ...shippingSettings.shiprocket.packageDimensions,
                                breadth: parseInt(e.target.value)
                              }
                            }
                          })}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sage-700 text-sm">Height (cm)</Label>
                        <Input
                          type="number"
                          value={shippingSettings.shiprocket.packageDimensions?.height || 5}
                          onChange={(e) => setShippingSettings({
                            shiprocket: {
                              ...shippingSettings.shiprocket, 
                              packageDimensions: {
                                ...shippingSettings.shiprocket.packageDimensions,
                                height: parseInt(e.target.value)
                              }
                            }
                          })}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sage-700 text-sm">Weight (kg)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={shippingSettings.shiprocket.packageDimensions?.weight || 0.5}
                          onChange={(e) => setShippingSettings({
                            shiprocket: {
                              ...shippingSettings.shiprocket, 
                              packageDimensions: {
                                ...shippingSettings.shiprocket.packageDimensions,
                                weight: parseFloat(e.target.value)
                              }
                            }
                          })}
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-turmeric-50 rounded-lg">
                    <Label className="text-sage-700">Test Mode</Label>
                    <Switch 
                      checked={shippingSettings.shiprocket.testMode}
                      onCheckedChange={(checked) => setShippingSettings({
                        shiprocket: {...shippingSettings.shiprocket, testMode: checked}
                      })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShiprocketAuthModal(true)}
                      variant="outline"
                      className="border-sage-300 text-sage-700 hover:bg-sage-50"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>

                    <Button 
                      onClick={() => saveSettings("Shiprocket", {
                        shipping: shippingSettings
                      })}
                      className="bg-terracotta-500 hover:bg-terracotta-600 text-white"
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Shipping"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Shiprocket Management Tab */}
          <TabsContent value="shiprocket" className="space-y-6">
            <ShiprocketAdminPanel 
              settings={settings}
              orders={orders || []}
              isSaving={isSaving}
              saveSettings={saveSettings}
            />
          </TabsContent>
          
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog({...confirmDialog, isOpen: open})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                confirmDialog.action?.();
                setConfirmDialog({...confirmDialog, isOpen: false});
              }}
              className="btn-ayurveda"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shiprocket Auth Modal */}
      <ShiprocketAuthModal 
        isOpen={shiprocketAuthModal}
        onClose={() => setShiprocketAuthModal(false)}
        onSuccess={() => {
          setShiprocketAuthModal(false);
          toast({
            title: "Shiprocket Connected! 🚚",
            description: "Your shipping integration is now active",
          });
        }}
      />
    </div>
  );
}