"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Save, 
  RefreshCw, 
  Truck, 
  Package, 
  Eye,
  ExternalLink,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Target,
  Search,
  Download,
  Upload,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShiprocketAdminPanelProps {
  settings: any;
  orders: any[];
  isSaving: boolean;
  saveSettings: (type: string, data: any) => Promise<boolean>;
}

export function ShiprocketAdminPanel({ 
  settings, 
  orders, 
  isSaving, 
  saveSettings 
}: ShiprocketAdminPanelProps) {
  const { toast } = useToast();
  
  // Shiprocket configuration state
  const [shiprocketConfig, setShiprocketConfig] = useState({
    enabled: false,
    email: "",
    password: "",
    channelId: "",
    pickupLocation: "Primary",
    pickupPincode: "400001",
    testMode: true,
    packageDimensions: {
      length: 15,
      breadth: 5,
      height: 30,
      weight: 0.5
    },
    authenticated: false,
    token: "",
    tokenExpiry: null as string | null,
    lastUpdated: null as string | null
  });

  const [connectionStatus, setConnectionStatus] = useState<{
    status: string;
    message: string;
    lastChecked: string | null;
  }>({
    status: "unknown",
    message: "",
    lastChecked: null
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Initialize settings
  useEffect(() => {
    if (settings?.shipping?.shiprocket) {
      setShiprocketConfig({
        enabled: settings.shipping.shiprocket.enabled || false,
        email: settings.shipping.shiprocket.email || "",
        password: settings.shipping.shiprocket.password || "",
        channelId: settings.shipping.shiprocket.channelId || "",
        pickupLocation: settings.shipping.shiprocket.pickupLocation || "Primary",
        pickupPincode: settings.shipping.shiprocket.pickupPincode || "400001",
        testMode: settings.shipping.shiprocket.testMode ?? true,
        packageDimensions: {
          length: settings.shipping.shiprocket.packageDimensions?.length || 15,
          breadth: settings.shipping.shiprocket.packageDimensions?.breadth || 5,
          height: settings.shipping.shiprocket.packageDimensions?.height || 30,
          weight: settings.shipping.shiprocket.packageDimensions?.weight || 0.5
        },
        authenticated: settings.shipping.shiprocket.authenticated || false,
        token: settings.shipping.shiprocket.token || "",
        tokenExpiry: settings.shipping.shiprocket.tokenExpiry || null,
        lastUpdated: settings.shipping.shiprocket.authenticatedAt || null
      });
    }
  }, [settings]);

  // Test Shiprocket connection
  const testConnection = async () => {
    if (!shiprocketConfig.email || !shiprocketConfig.password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter Shiprocket email and password first",
        variant: "destructive"
      });
      return;
    }

    setIsTestingConnection(true);
    try {
      console.log("🧪 Testing Shiprocket connection...");
      
      const response = await fetch('/api/shiprocket/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: shiprocketConfig.email,
          password: shiprocketConfig.password
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setConnectionStatus({
          status: "connected",
          message: "Successfully connected to Shiprocket API",
          lastChecked: new Date().toISOString()
        });
        
        toast({
          title: "✅ Connection Successful!",
          description: "Shiprocket API connection verified successfully",
        });
      } else {
        setConnectionStatus({
          status: "failed",
          message: result.message || "Connection failed",
          lastChecked: new Date().toISOString()
        });
        
        toast({
          title: "❌ Connection Failed",
          description: result.message || "Could not connect to Shiprocket",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Connection test error:", error);
      setConnectionStatus({
        status: "error",
        message: "Network error occurred",
        lastChecked: new Date().toISOString()
      });
      
      toast({
        title: "Network Error",
        description: "Could not test connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Toggle Shiprocket integration
  const toggleIntegration = async (enabled: boolean) => {
    setIsToggling(true);
    try {
      console.log(`🔄 ${enabled ? 'Enabling' : 'Disabling'} Shiprocket integration...`);
      
      const response = await fetch('/api/shiprocket/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled })
      });

      const result = await response.json();
      
      if (result.success) {
        setShiprocketConfig(prev => ({ ...prev, enabled }));
        
        toast({
          title: `Shiprocket ${enabled ? 'Enabled' : 'Disabled'}! ✅`,
          description: `Integration has been ${enabled ? 'enabled' : 'disabled'} successfully`,
        });
        
        // Refresh the page data
        window.location.reload();
      } else {
        toast({
          title: "Toggle Failed",
          description: result.message || "Could not toggle integration",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Toggle error:", error);
      toast({
        title: "Toggle Error",
        description: "Could not toggle integration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsToggling(false);
    }
  };

  // Save Shiprocket settings
  const saveShiprocketSettings = async () => {
    try {
      const success = await saveSettings("Shiprocket Configuration", {
        shipping: {
          ...settings?.shipping,
          shiprocket: {
            ...shiprocketConfig,
            lastUpdated: new Date().toISOString()
          }
        }
      });

      if (success) {
        toast({
          title: "✅ Shiprocket Settings Saved!",
          description: "Configuration has been updated for ayurvedicmantra.com",
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save Shiprocket settings",
        variant: "destructive"
      });
    }
  };

  // Calculate Shiprocket statistics
  const shiprocketStats = {
    totalOrders: orders?.filter(order => order.shiprocket).length || 0,
    successfulOrders: orders?.filter(order => order.shiprocket?.orderId).length || 0,
    failedOrders: orders?.filter(order => order.shiprocket?.status === 'failed' || order.shiprocket?.status === 'error').length || 0,
    awbAssigned: orders?.filter(order => order.shiprocket?.awbCode).length || 0
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-sage-700">Shiprocket Management</h2>
          <p className="text-sage-600">Global shipping integration for ayurvedicmantra.com</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            className={`${
              shiprocketConfig.enabled 
                ? 'bg-sage-100 text-sage-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {shiprocketConfig.enabled ? 'ENABLED' : 'DISABLED'}
          </Badge>
          
          {shiprocketConfig.authenticated && (
            <Badge className="bg-turmeric-100 text-turmeric-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              AUTHENTICATED
            </Badge>
          )}
        </div>
      </div>

      {/* Global Toggle */}
      <Alert className={`border-2 ${shiprocketConfig.enabled ? 'border-sage-200 bg-sage-50' : 'border-orange-200 bg-orange-50'}`}>
        <Zap className="h-4 w-4" />
        <AlertTitle className="flex items-center justify-between">
          <span>Global Shiprocket Integration</span>
          <Switch
            checked={shiprocketConfig.enabled}
            onCheckedChange={toggleIntegration}
            disabled={isToggling}
          />
        </AlertTitle>
        <AlertDescription>
          {shiprocketConfig.enabled 
            ? "✅ All orders are automatically synced to Shiprocket in real-time"
            : "⚠️ Orders will not be sent to Shiprocket until enabled"}
        </AlertDescription>
      </Alert>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-ayurveda">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sage-700">{shiprocketStats.totalOrders}</div>
            <p className="text-sage-600 text-sm">Total Integrated</p>
          </CardContent>
        </Card>
        
        <Card className="card-ayurveda">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-turmeric-700">{shiprocketStats.successfulOrders}</div>
            <p className="text-sage-600 text-sm">Successful Orders</p>
          </CardContent>
        </Card>
        
        <Card className="card-ayurveda">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-terracotta-700">{shiprocketStats.awbAssigned}</div>
            <p className="text-sage-600 text-sm">AWB Assigned</p>
          </CardContent>
        </Card>
        
        <Card className="card-ayurveda">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-700">{shiprocketStats.failedOrders}</div>
            <p className="text-sage-600 text-sm">Failed Orders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card className="card-ayurveda">
          <CardHeader>
            <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sage-700">Shiprocket Email</Label>
              <Input
                type="email"
                value={shiprocketConfig.email}
                onChange={(e) => setShiprocketConfig({...shiprocketConfig, email: e.target.value})}
                placeholder="your@shiprocket-account.com"
                className="border-sage-200 focus:border-sage-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sage-700">Shiprocket Password</Label>
              <Input
                type="password"
                value={shiprocketConfig.password}
                onChange={(e) => setShiprocketConfig({...shiprocketConfig, password: e.target.value})}
                placeholder="Your Shiprocket password"
                className="border-sage-200 focus:border-sage-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sage-700">Channel ID (Optional)</Label>
              <Input
                value={shiprocketConfig.channelId}
                onChange={(e) => setShiprocketConfig({...shiprocketConfig, channelId: e.target.value})}
                placeholder="Leave empty for default channel"
                className="border-sage-200 focus:border-sage-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sage-700">Pickup Location</Label>
              <Input
                value={shiprocketConfig.pickupLocation}
                onChange={(e) => setShiprocketConfig({...shiprocketConfig, pickupLocation: e.target.value})}
                className="border-sage-200 focus:border-sage-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sage-700">Pickup Pincode</Label>
              <Input
                value={shiprocketConfig.pickupPincode}
                onChange={(e) => setShiprocketConfig({...shiprocketConfig, pickupPincode: e.target.value})}
                className="border-sage-200 focus:border-sage-400"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
              <Label className="text-sage-700">Test Mode</Label>
              <Switch
                checked={shiprocketConfig.testMode}
                onCheckedChange={(checked) => setShiprocketConfig({...shiprocketConfig, testMode: checked})}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={testConnection}
                disabled={isTestingConnection}
                className="flex-1 bg-terracotta-500 hover:bg-terracotta-600 text-white"
              >
                {isTestingConnection ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                {isTestingConnection ? "Testing..." : "Test Connection"}
              </Button>
              
              <Button
                onClick={saveShiprocketSettings}
                disabled={isSaving}
                className="flex-1 btn-ayurveda"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Config"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Package Dimensions */}
        <Card className="card-ayurveda">
          <CardHeader>
            <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
              <Package className="w-5 h-5" />
              Package Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-sage-600">Configure default package dimensions for Ayurvedic supplements</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sage-700">Length (cm)</Label>
                <Input
                  type="number"
                  value={shiprocketConfig.packageDimensions.length}
                  onChange={(e) => setShiprocketConfig({
                    ...shiprocketConfig,
                    packageDimensions: {
                      ...shiprocketConfig.packageDimensions,
                      length: parseFloat(e.target.value)
                    }
                  })}
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">Breadth (cm)</Label>
                <Input
                  type="number"
                  value={shiprocketConfig.packageDimensions.breadth}
                  onChange={(e) => setShiprocketConfig({
                    ...shiprocketConfig,
                    packageDimensions: {
                      ...shiprocketConfig.packageDimensions,
                      breadth: parseFloat(e.target.value)
                    }
                  })}
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">Height (cm)</Label>
                <Input
                  type="number"
                  value={shiprocketConfig.packageDimensions.height}
                  onChange={(e) => setShiprocketConfig({
                    ...shiprocketConfig,
                    packageDimensions: {
                      ...shiprocketConfig.packageDimensions,
                      height: parseFloat(e.target.value)
                    }
                  })}
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={shiprocketConfig.packageDimensions.weight}
                  onChange={(e) => setShiprocketConfig({
                    ...shiprocketConfig,
                    packageDimensions: {
                      ...shiprocketConfig.packageDimensions,
                      weight: parseFloat(e.target.value)
                    }
                  })}
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>
            </div>

            <div className="p-3 bg-turmeric-50 rounded-lg">
              <p className="text-sm text-turmeric-700">
                <strong>Recommended for Ayurvedic supplements:</strong><br />
                15cm × 5cm × 30cm, 0.5kg (bottle packaging)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pickup Location Status */}
      <Alert className="border-2 border-sage-200 bg-sage-50">
        <MapPin className="h-4 w-4" />
        <AlertTitle className="text-sage-700">✅ Pickup Location Configured</AlertTitle>
        <AlertDescription className="text-sage-600">
          Current pickup location: <strong>{shiprocketConfig.pickupLocation}</strong>
          <br />
          <span className="text-xs opacity-75">
            Auto-configured from Shiprocket account for ayurvedicmantra.com
          </span>
        </AlertDescription>
      </Alert>
      {connectionStatus.status !== "unknown" && (
        <Alert className={`border-2 ${
          connectionStatus.status === "connected" 
            ? 'border-sage-200 bg-sage-50' 
            : 'border-red-200 bg-red-50'
        }`}>
          {connectionStatus.status === "connected" ? (
            <CheckCircle className="h-4 w-4 text-sage-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertTitle>
            Connection Status: {connectionStatus.status === "connected" ? "Connected" : "Failed"}
          </AlertTitle>
          <AlertDescription>
            {connectionStatus.message}
            {connectionStatus.lastChecked && (
              <div className="text-xs mt-1 opacity-75">
                Last checked: {new Date(connectionStatus.lastChecked).toLocaleString()}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Order Integration Status */}
      <Card className="card-ayurveda">
        <CardHeader>
          <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Recent Order Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sage-200">
                  <th className="text-left p-2 text-sage-700">Order ID</th>
                  <th className="text-left p-2 text-sage-700">Customer</th>
                  <th className="text-left p-2 text-sage-700">Shiprocket Status</th>
                  <th className="text-left p-2 text-sage-700">AWB Code</th>
                  <th className="text-left p-2 text-sage-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.slice(0, 10).map(order => (
                  <tr key={order.id} className="border-b border-sage-100">
                    <td className="p-2 font-mono text-sage-700">{order.id}</td>
                    <td className="p-2 text-sage-600">{order.userName}</td>
                    <td className="p-2">
                      {order.shiprocket ? (
                        <Badge 
                          className={`text-xs ${
                            order.shiprocket.status === 'pickup_scheduled' ? 'bg-turmeric-100 text-turmeric-700' :
                            order.shiprocket.status === 'awb_assigned' ? 'bg-terracotta-100 text-terracotta-700' :
                            order.shiprocket.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-sage-100 text-sage-700'
                          }`}
                        >
                          {order.shiprocket.status || 'created'}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 text-xs">Not synced</Badge>
                      )}
                    </td>
                    <td className="p-2 font-mono text-xs text-sage-600">
                      {order.shiprocket?.awbCode || '-'}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        {order.shiprocket?.orderId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://app.shiprocket.in/orders/${order.shiprocket.orderId}`, '_blank')}
                            className="text-xs border-sage-300 text-sage-700 hover:bg-sage-50"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        )}
                        {order.shiprocket?.awbCode && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Track shipment functionality
                              fetch(`/api/shiprocket/track?awb=${order.shiprocket.awbCode}`)
                                .then(r => r.json())
                                .then(result => {
                                  if (result.success) {
                                    alert(`Tracking Info:\n\nAWB: ${order.shiprocket.awbCode}\nStatus: ${result.data.tracking_data?.track_status || 'Unknown'}\nLocation: ${result.data.tracking_data?.track_location || 'N/A'}`);
                                  }
                                });
                            }}
                            className="text-xs border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50"
                          >
                            <Search className="w-3 h-3 mr-1" />
                            Track
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}