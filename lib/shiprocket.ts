import axios from 'axios';

interface ShiprocketCredentials {
  email: string;
  password: string;
  enabled: boolean;
  testMode: boolean;
}

interface ShiprocketOrderData {
  order_id: string;
  order_date: string;
  pickup_location: string;
  channel_id: string;
  comment?: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_country?: string;
  shipping_state?: string;
  shipping_email?: string;
  shipping_phone?: string;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: number;
    tax?: number;
    hsn?: number;
  }>;
  payment_method: string;
  shipping_charges?: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

interface ServiceabilityParams {
  pickup_postcode: string;
  delivery_postcode: string;
  weight: number;
  cod?: number;
}

interface AWBAssignmentData {
  shipment_id: number;
  courier_id?: number;
}

export class ShiprocketService {
  private baseURL = 'https://apiv2.shiprocket.in/v1/external';
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  // Update stored token in settings with 10-day auto-refresh
  private async updateStoredToken(newToken: string, credentials: ShiprocketCredentials): Promise<void> {
    try {
      const { storage } = await import('@/lib/storage');
      const currentSettings = await storage.load();
      
      // Calculate expiry for 10 days as requested
      const tenDaysFromNow = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      
      const updatedSettings = {
        ...currentSettings,
        shipping: {
          ...currentSettings.shipping,
          shiprocket: {
            ...currentSettings.shipping?.shiprocket,
            token: newToken,
            email: credentials.email,
            password: credentials.password, // Store for auto-refresh
            authenticated: true,
            authenticatedAt: new Date().toISOString(),
            tokenExpiry: tenDaysFromNow.toISOString(),
            autoRefreshEnabled: true,
            lastRefresh: new Date().toISOString(),
            nextRefresh: tenDaysFromNow.toISOString()
          }
        }
      };
      
      await storage.save(updatedSettings);
      console.log("✅ [AYURVEDIC MANTRA] Updated Shiprocket token with 10-day auto-refresh:", {
        authenticatedAt: new Date().toISOString(),
        expiresAt: tenDaysFromNow.toISOString(),
        autoRefresh: true
      });
    } catch (error) {
      console.warn("⚠️ Failed to update stored token:", error);
    }
  }

  async authenticate(credentials: ShiprocketCredentials): Promise<string> {
    console.log("🚚 Authenticating with Shiprocket API...");
    
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, {
        email: credentials.email,
        password: credentials.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.token) {
        this.token = response.data.token;
        // Shiprocket tokens typically expire in 24 hours
        this.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        // Update stored token in background
        this.updateStoredToken(this.token!, credentials).catch(console.warn);
        
        console.log("✅ Shiprocket authentication successful");
        return this.token!;
      } else {
        throw new Error('No token received from Shiprocket');
      }
    } catch (error: any) {
      console.error("❌ Shiprocket authentication failed:", error.response?.data || error.message);
      throw new Error(`Shiprocket authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Auto-refresh token check (every 10 days)
  private async checkAndRefreshToken(credentials: ShiprocketCredentials): Promise<boolean> {
    try {
      const { storage } = await import('@/lib/storage');
      const currentSettings = await storage.load();
      const shiprocketConfig = currentSettings.shipping?.shiprocket;
      
      if (!shiprocketConfig?.autoRefreshEnabled) {
        return false;
      }
      
      const nextRefresh = new Date(shiprocketConfig.nextRefresh);
      const now = new Date();
      
      // Check if it's time to refresh (within 1 day of expiry)
      const timeUntilRefresh = nextRefresh.getTime() - now.getTime();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      
      if (timeUntilRefresh <= oneDayInMs) {
        console.log("🔄 [AUTO-REFRESH] Token approaching expiry, refreshing...");
        
        const newToken = await this.authenticate({
          email: shiprocketConfig.email,
          password: shiprocketConfig.password,
          enabled: shiprocketConfig.enabled,
          testMode: shiprocketConfig.testMode
        });
        
        if (newToken) {
          console.log("✅ [AUTO-REFRESH] Token successfully refreshed for ayurvedicmantra.com");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.warn("⚠️ [AUTO-REFRESH] Failed to auto-refresh token:", error);
      return false;
    }
  }

  private async ensureValidToken(credentials: ShiprocketCredentials, existingToken?: string): Promise<string> {
    // Auto-refresh check first
    await this.checkAndRefreshToken(credentials);
    
    // First, try to use existing token if provided and validate expiry
    if (existingToken) {
      try {
        const { storage } = await import('@/lib/storage');
        const currentSettings = await storage.load();
        const tokenExpiry = currentSettings.shipping?.shiprocket?.tokenExpiry;
        
        if (tokenExpiry) {
          const expiryDate = new Date(tokenExpiry);
          const now = new Date();
          
          if (now < expiryDate) {
            console.log("🔄 [TOKEN VALIDATION] Using valid existing token from settings");
            this.token = existingToken;
            this.tokenExpiry = expiryDate;
            return existingToken;
          } else {
            console.log("⚠️ [TOKEN VALIDATION] Existing token expired, getting new one");
          }
        }
      } catch (error) {
        console.warn("⚠️ Failed to validate existing token:", error);
      }
    }

    // Check if we have a valid cached token
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      console.log("✅ [TOKEN VALIDATION] Using cached valid token");
      return this.token;
    }

    // Token expired or doesn't exist, get a new one
    console.log("🔄 [TOKEN VALIDATION] Getting new token via authentication");
    return await this.authenticate(credentials);
  }

  async createOrder(orderData: ShiprocketOrderData, credentials: ShiprocketCredentials, existingToken?: string): Promise<any> {
    console.log("🚚 Creating order in Shiprocket:", orderData.order_id);
    console.log("🔑 Using credentials:", {
      email: credentials.email,
      hasPassword: !!credentials.password,
      hasExistingToken: !!existingToken,
      testMode: credentials.testMode
    });
    
    try {
      let token = await this.ensureValidToken(credentials, existingToken);
      
      const makeRequest = async (authToken: string) => {
        return await axios.post(`${this.baseURL}/orders/create/adhoc`, orderData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (firstError: any) {
        // If we get 401/403, the token might be expired, try to get a new one
        if (firstError.response?.status === 401 || firstError.response?.status === 403) {
          console.log("🔄 Token seems expired, getting fresh token...");
          this.token = null; // Clear cached token
          this.tokenExpiry = null;
          token = await this.authenticate(credentials);
          response = await makeRequest(token);
        } else {
          throw firstError;
        }
      }

      if (response.data && response.data.status_code === 1) {
        console.log("✅ Order created successfully in Shiprocket:", response.data);
        return {
          success: true,
          data: response.data,
          orderId: response.data.order_id,
          shipmentId: response.data.shipment_id,
          awbCode: response.data.awb_code,
          courierName: response.data.courier_name
        };
      } else {
        console.error("❌ Shiprocket order creation failed:", response.data);
        throw new Error(response.data.message || 'Order creation failed');
      }
    } catch (error: any) {
      console.error("❌ Error creating order in Shiprocket:", error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        details: error.response?.data
      };
    }
  }

  async getOrderTracking(orderId: string, credentials: ShiprocketCredentials, existingToken?: string): Promise<any> {
    console.log("🚚 Getting order tracking from Shiprocket:", orderId);
    
    try {
      let token = await this.ensureValidToken(credentials, existingToken);
      
      const makeRequest = async (authToken: string) => {
        return await axios.get(`${this.baseURL}/courier/track/awb/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (firstError: any) {
        if (firstError.response?.status === 401 || firstError.response?.status === 403) {
          console.log("🔄 Token seems expired, getting fresh token...");
          this.token = null;
          this.tokenExpiry = null;
          token = await this.authenticate(credentials);
          response = await makeRequest(token);
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error("❌ Error getting tracking info:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async getServiceability(pickupPincode: string, deliveryPincode: string, weight: number, credentials: ShiprocketCredentials, existingToken?: string): Promise<any> {
    console.log("🚚 Checking serviceability:", { pickupPincode, deliveryPincode, weight });
    
    try {
      let token = await this.ensureValidToken(credentials, existingToken);
      
      const makeRequest = async (authToken: string) => {
        return await axios.get(`${this.baseURL}/courier/serviceability/`, {
          params: {
            pickup_postcode: pickupPincode,
            delivery_postcode: deliveryPincode,
            weight: weight,
            cod: 0
          },
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (firstError: any) {
        if (firstError.response?.status === 401 || firstError.response?.status === 403) {
          console.log("🔄 Token seems expired, getting fresh token...");
          this.token = null;
          this.tokenExpiry = null;
          token = await this.authenticate(credentials);
          response = await makeRequest(token);
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error("❌ Error checking serviceability:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async assignAWB(shipmentId: number, credentials: ShiprocketCredentials, courierId?: number, existingToken?: string): Promise<any> {
    console.log("📦 Assigning AWB for shipment:", shipmentId);
    
    try {
      let token = await this.ensureValidToken(credentials, existingToken);
      
      const payload: any = { shipment_id: shipmentId };
      if (courierId) {
        payload.courier_id = courierId;
      }
      
      const makeRequest = async (authToken: string) => {
        return await axios.post(`${this.baseURL}/courier/assign/awb`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (firstError: any) {
        if (firstError.response?.status === 401 || firstError.response?.status === 403) {
          console.log("🔄 Token seems expired, getting fresh token...");
          this.token = null;
          this.tokenExpiry = null;
          token = await this.authenticate(credentials);
          response = await makeRequest(token);
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error("❌ Error assigning AWB:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async schedulePickup(shipmentIds: number[], credentials: ShiprocketCredentials, existingToken?: string): Promise<any> {
    console.log("🚛 Scheduling pickup for shipments:", shipmentIds);
    
    try {
      let token = await this.ensureValidToken(credentials, existingToken);
      
      const makeRequest = async (authToken: string) => {
        return await axios.post(`${this.baseURL}/courier/generate/pickup`, {
          shipment_id: shipmentIds
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (firstError: any) {
        if (firstError.response?.status === 401 || firstError.response?.status === 403) {
          console.log("🔄 Token seems expired, getting fresh token...");
          this.token = null;
          this.tokenExpiry = null;
          token = await this.authenticate(credentials);
          response = await makeRequest(token);
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error("❌ Error scheduling pickup:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async generateManifest(shipmentIds: number[], credentials: ShiprocketCredentials, existingToken?: string): Promise<any> {
    console.log("📄 Generating manifest for shipments:", shipmentIds);
    
    try {
      let token = await this.ensureValidToken(credentials, existingToken);
      
      const makeRequest = async (authToken: string) => {
        return await axios.post(`${this.baseURL}/manifests/print`, {
          shipment_id: shipmentIds
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (firstError: any) {
        if (firstError.response?.status === 401 || firstError.response?.status === 403) {
          console.log("🔄 Token seems expired, getting fresh token...");
          this.token = null;
          this.tokenExpiry = null;
          token = await this.authenticate(credentials);
          response = await makeRequest(token);
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error("❌ Error generating manifest:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async generateLabel(shipmentIds: number[], credentials: ShiprocketCredentials, existingToken?: string): Promise<any> {
    console.log("🏷️ Generating label for shipments:", shipmentIds);
    
    try {
      let token = await this.ensureValidToken(credentials, existingToken);
      
      const makeRequest = async (authToken: string) => {
        return await axios.post(`${this.baseURL}/courier/generate/label`, {
          shipment_id: shipmentIds
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (firstError: any) {
        if (firstError.response?.status === 401 || firstError.response?.status === 403) {
          console.log("🔄 Token seems expired, getting fresh token...");
          this.token = null;
          this.tokenExpiry = null;
          token = await this.authenticate(credentials);
          response = await makeRequest(token);
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error("❌ Error generating label:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async generateInvoice(orderIds: string[], credentials: ShiprocketCredentials, existingToken?: string): Promise<any> {
    console.log("📄 Generating invoice for orders:", orderIds);
    
    try {
      let token = await this.ensureValidToken(credentials, existingToken);
      
      const makeRequest = async (authToken: string) => {
        return await axios.post(`${this.baseURL}/orders/print/invoice`, {
          ids: orderIds
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (firstError: any) {
        if (firstError.response?.status === 401 || firstError.response?.status === 403) {
          console.log("🔄 Token seems expired, getting fresh token...");
          this.token = null;
          this.tokenExpiry = null;
          token = await this.authenticate(credentials);
          response = await makeRequest(token);
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error("❌ Error generating invoice:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async trackByAWB(awbCode: string, credentials: ShiprocketCredentials, existingToken?: string): Promise<any> {
    console.log("📍 Tracking shipment by AWB:", awbCode);
    
    try {
      let token = await this.ensureValidToken(credentials, existingToken);
      
      const makeRequest = async (authToken: string) => {
        return await axios.get(`${this.baseURL}/courier/track/awb/${awbCode}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (firstError: any) {
        if (firstError.response?.status === 401 || firstError.response?.status === 403) {
          console.log("🔄 Token seems expired, getting fresh token...");
          this.token = null;
          this.tokenExpiry = null;
          token = await this.authenticate(credentials);
          response = await makeRequest(token);
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error("❌ Error tracking shipment:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async trackMultipleAWB(awbCodes: string[], credentials: ShiprocketCredentials, existingToken?: string): Promise<any> {
    console.log("📍 Tracking multiple shipments:", awbCodes);
    
    try {
      let token = await this.ensureValidToken(credentials, existingToken);
      
      const makeRequest = async (authToken: string) => {
        return await axios.post(`${this.baseURL}/courier/track/awbs`, {
          awbs: awbCodes.join(',')
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (firstError: any) {
        if (firstError.response?.status === 401 || firstError.response?.status === 403) {
          console.log("🔄 Token seems expired, getting fresh token...");
          this.token = null;
          this.tokenExpiry = null;
          token = await this.authenticate(credentials);
          response = await makeRequest(token);
        } else {
          throw firstError;
        }
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error("❌ Error tracking multiple shipments:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async testConnection(credentials: ShiprocketCredentials): Promise<any> {
    console.log("🧪 Testing Shiprocket connection");
    
    try {
      const token = await this.authenticate(credentials);
      if (token) {
        return {
          success: true,
          message: "✅ Connection successful!",
          token: token
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Convert our order format to Shiprocket format (Enhanced for ayurvedicmantra.com)
  static formatOrderForShiprocket(orderData: any, shiprocketConfig: any): ShiprocketOrderData {
    console.log("🔄 [AYURVEDIC MANTRA] Converting order to Shiprocket format:", {
      orderId: orderData.id,
      customerName: orderData.userName,
      planName: orderData.planName,
      domain: "ayurvedicmantra.com"
    });
    
    // Enhanced customer name handling
    const nameParts = orderData.userName.split(' ');
    const firstName = nameParts[0] || orderData.userName;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    // Use the correct pickup location from config, fallback to "Primary" if not set
    const pickupLocation = shiprocketConfig.pickupLocation || "Primary";
    console.log("📍 Using pickup location:", pickupLocation);
    
    const formattedOrder: ShiprocketOrderData = {
      order_id: orderData.id,
      order_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      pickup_location: pickupLocation,
      channel_id: shiprocketConfig.channelId && shiprocketConfig.channelId !== "" ? shiprocketConfig.channelId : "", 
      comment: `Ayurvedic Mantra Order - ${orderData.planName} | Domain: ayurvedicmantra.com`,
      
      // Enhanced billing details with proper name handling
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: orderData.shippingAddress.address,
      billing_city: orderData.shippingAddress.city,
      billing_pincode: orderData.shippingAddress.pincode,
      billing_state: orderData.shippingAddress.state,
      billing_country: "India",
      billing_email: orderData.userEmail || "orders@ayurvedicmantra.com", // Use ayurvedicmantra.com domain
      billing_phone: orderData.userPhone,
      
      // Shipping details (same as billing for most cases)
      shipping_is_billing: true,
      
      // Enhanced order items for Ayurvedic products
      order_items: [{
        name: `${orderData.planName} - Ayurvedic Weight Loss Formula`,
        sku: `AYUR-${orderData.planName.replace(/\s+/g, '-').toUpperCase()}`,
        units: 1,
        selling_price: orderData.price,
        discount: 0,
        tax: 0,
        hsn: 30049090 // HSN code for Ayurvedic health supplements
      }],
      
      // Payment and pricing
      payment_method: orderData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      sub_total: orderData.price,
      
      // Package dimensions optimized for Ayurvedic supplement bottles
      length: shiprocketConfig.packageDimensions?.length || 15,
      breadth: shiprocketConfig.packageDimensions?.breadth || 5,
      height: shiprocketConfig.packageDimensions?.height || 30,
      weight: shiprocketConfig.packageDimensions?.weight || 0.5
    };

    console.log("✅ [AYURVEDIC MANTRA] Order formatted for Shiprocket:", {
      order_id: formattedOrder.order_id,
      pickup_location: formattedOrder.pickup_location,
      customer: `${formattedOrder.billing_customer_name} ${formattedOrder.billing_last_name}`,
      email: formattedOrder.billing_email,
      phone: formattedOrder.billing_phone,
      product: formattedOrder.order_items[0].name,
      amount: formattedOrder.sub_total
    });
    
    return formattedOrder;
  }
}

// Export singleton instance
export const shiprocketService = new ShiprocketService();
export type { ShiprocketCredentials, ShiprocketOrderData };