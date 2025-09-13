"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AppSettings {
  site?: any;
  homepage?: any;
  product?: any;
  checkout?: any;
  payment?: any;
  communications?: any;
  shipping?: any;
  design?: any;
  seo?: any;
  thankYou?: any;
  testimonials?: any;
  faqs?: any;
}

interface AppStats {
  users: {
    totalUsers: number;
    todaySignups: number;
    verifiedUsers: number;
    totalRevenue: number;
  };
  orders: {
    totalOrders: number;
    todayOrders: number;
    totalRevenue: number;
    todayRevenue: number;
    pendingOrders: number;
    completedOrders: number;
  };
}

interface AppContextType {
  settings: AppSettings | null;
  stats: AppStats | null;
  users: any[];
  orders: any[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateSettings: (updates: any) => Promise<boolean>;
  createOrder: (orderData: any) => Promise<any>;
  addUser: (userData: any) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicSettings = async () => {
    try {
      console.log("Fetching public settings...");
      const response = await fetch('/api/public/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout and retry logic
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
        console.log("✅ Public settings loaded successfully");
      } else {
        console.warn("Public settings API returned error:", result.message);
        // Set default settings if API fails
        setDefaultSettings();
      }
    } catch (error) {
      console.warn("⚠️ Error fetching public settings (using defaults):", error);
      // Set default settings instead of failing completely
      setDefaultSettings();
    }
  };

  const setDefaultSettings = () => {
    const defaultSettings = {
      site: {
        title: "Ayurvedic Mantra",
        logo: "/logo.png",
        headerText: "Transform Your Health Naturally",
        contactPhone: "+919897990779",
        contactEmail: "orders@ayurvedicmantra.com"
      },
      homepage: {
        heroTitle: "Lose Weight Naturally with Ayurvedic Mantra",
        heroSubtitle: "Transform your body with our clinically tested Ayurvedic weight loss formula. Safe, effective, and 100% natural.",
        benefitsSection: {
          title: "Why Choose Our Ayurvedic Formula?",
          enabled: true
        },
        testimonials: { enabled: true },
        faq: { enabled: true },
        pricing: { enabled: true }
      },
      product: {
        name: "SlimX Ayurvedic Weight Loss Formula",
        tagline: "Natural. Safe. Effective.",
        description: "Our scientifically formulated Ayurvedic blend helps you lose weight naturally without harmful side effects.",
        plans: [
          { id: 1, name: "1 Month Supply", price: 999, mrp: 1499, savings: 500, duration: "1 Month" },
          { id: 2, name: "2 Month Supply", price: 1499, mrp: 2598, savings: 1099, duration: "2 Months", popular: true },
          { id: 3, name: "3 Month Supply", price: 1799, mrp: 3897, savings: 2098, duration: "3 Months", bestValue: true }
        ]
      },
      checkout: {
        deliveryDays: 3,
        deliveryMessage: "Ships within 24 hours with free delivery",
        subtitle: "Secure 256-bit SSL encrypted checkout"
      }
    };
    setSettings(defaultSettings);
    console.log("✅ Default settings applied");
  };

  const fetchAdminData = async () => {
    // Check if admin is authenticated before fetching data
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      console.log("No admin token found, skipping admin data fetch");
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      };

      // Fetch admin settings
      const settingsResponse = await fetch('/api/admin/settings', { headers });
      const settingsResult = await settingsResponse.json();
      if (settingsResult.success) {
        setSettings(settingsResult.data);
      }

      // Fetch users
      const usersResponse = await fetch('/api/admin/users', { headers });
      const usersResult = await usersResponse.json();
      if (usersResult.success) {
        setUsers(usersResult.data.users);
        setStats(prev => ({ 
          ...prev, 
          users: usersResult.data.stats,
          orders: prev?.orders || {
            totalOrders: 0,
            todayOrders: 0,
            totalRevenue: 0,
            todayRevenue: 0,
            pendingOrders: 0,
            completedOrders: 0
          }
        }));
      }

      // Fetch orders
      const ordersResponse = await fetch('/api/admin/orders', { headers });
      const ordersResult = await ordersResponse.json();
      if (ordersResult.success) {
        setOrders(ordersResult.data.orders);
        setStats(prev => ({ 
          ...prev, 
          orders: ordersResult.data.stats,
          users: prev?.users || {
            totalUsers: 0,
            todaySignups: 0,
            verifiedUsers: 0,
            totalRevenue: 0
          }
        }));
      }

      console.log("Admin data loaded");
    } catch (error) {
      console.error("Error fetching admin data:", error);
      // If unauthorized, clear admin session
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.log("Admin session might be invalid, clearing tokens");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
  };

  const refreshData = async () => {
    setLoading(true);
    
    try {
      // Check if we're in admin dashboard (not login page)
      const isAdminDashboard = window.location.pathname === '/admin' || 
                              (window.location.pathname.includes('/admin') && 
                               !window.location.pathname.includes('/admin-login'));
      
      if (isAdminDashboard) {
        console.log("🔧 Loading admin dashboard data...");
        await fetchAdminData();
      } else {
        console.log("🌐 Loading public settings...");
        await fetchPublicSettings();
      }
    } catch (error) {
      console.error("❌ Error in refreshData:", error);
      // Ensure we have default settings even if everything fails
      if (!settings) {
        setDefaultSettings();
      }
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: any): Promise<boolean> => {
    try {
      console.log("🔄 Updating settings via AppContext:", Object.keys(updates));
      
      // Try internal API first (bypasses middleware)
      let response = await fetch('/api/internal/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      // Fallback to admin API if internal fails
      if (!response.ok) {
        console.log("🔄 Internal API failed, trying admin API...");
        const adminToken = localStorage.getItem('adminToken');
        response = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify(updates),
        });
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state immediately
        setSettings(result.data);
        
        // Also update public settings to ensure consistency
        await fetchPublicSettings();
        
        toast({
          title: "Changes Saved! ✅",
          description: result.message || "Settings updated successfully and will persist!",
        });
        
        console.log("✅ Settings updated successfully via", result.source || 'unknown API');
        return true;
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error: any) {
      console.error("❌ Error updating settings:", error);
      toast({
        title: "Save Failed ❌",
        description: `Failed to save: ${error.message}. Please try again.`,
        variant: "destructive"
      });
      return false;
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      console.log("Creating order:", orderData);
      
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      
      if (result.success) {
        setOrders(prev => [result.data, ...prev]);
        toast({
          title: "Order Created! 🎉",
          description: `Order ${result.data.id} has been confirmed`,
        });
        console.log("Order created successfully");
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Order Failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const addUser = async (userData: any) => {
    try {
      console.log("Adding user:", userData);
      
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (result.success) {
        setUsers(prev => [result.data, ...prev]);
        console.log("User added successfully");
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      return null;
    }
  };

  useEffect(() => {
    // Delay initial load slightly to ensure page is ready
    const timeoutId = setTimeout(() => {
      refreshData();
    }, 100);
    
    // Set up periodic refresh for real-time updates
    const interval = setInterval(() => {
      try {
        // Only fetch admin data if we're on the admin dashboard and authenticated
        const isAdminDashboard = window.location.pathname === '/admin' || 
                                (window.location.pathname.includes('/admin') && 
                                 !window.location.pathname.includes('/admin-login'));
        const adminToken = localStorage.getItem('adminToken');
        
        if (isAdminDashboard && adminToken) {
          console.log("🔄 Periodic admin data refresh");
          fetchAdminData();
        } else if (!isAdminDashboard) {
          // Occasionally refresh public settings on public pages
          console.log("🔄 Periodic public settings refresh");
          fetchPublicSettings();
        }
      } catch (error) {
        console.warn("⚠️ Error in periodic refresh:", error);
      }
    }, 60000); // Refresh every 60 seconds (less frequent to reduce errors)
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []);

  const value = {
    settings,
    stats,
    users,
    orders,
    loading,
    refreshData,
    updateSettings,
    createOrder,
    addUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}