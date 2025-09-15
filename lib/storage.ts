// Enhanced persistent storage for serverless environments
import { promises as fs } from 'fs';
import { join } from 'path';
import { supabase, supabaseService } from './supabase';

export interface StorageData {
  site?: any;
  homepage?: any;
  product?: any;
  checkout?: any;
  communications?: any;
  payment?: any;
  shipping?: any;
  media?: any;
  lastUpdated?: string;
  version?: string;
}

class PersistentStorage {
  private dataPath: string;
  private cache: StorageData | null = null;
  private cacheTimeout: NodeJS.Timeout | null = null;
  private static instance: PersistentStorage;

  constructor() {
    this.dataPath = join(process.cwd(), 'data', 'admin-settings.json');
  }

  // Singleton pattern for consistency
  static getInstance(): PersistentStorage {
    if (!PersistentStorage.instance) {
      PersistentStorage.instance = new PersistentStorage();
    }
    return PersistentStorage.instance;
  }

  // Ensure data directory exists (if possible in serverless)
  private async ensureDataDir(): Promise<boolean> {
    try {
      const dataDir = join(process.cwd(), 'data');
      await fs.mkdir(dataDir, { recursive: true });
      return true;
    } catch (error) {
      console.warn('📂 Could not create data directory (serverless limitation):', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  // Load settings with fallback strategy
  async load(): Promise<StorageData> {
    try {
      // Return cached data if available and recent
      if (this.cache) {
        console.log('🎯 Using cached settings data');
        return this.cache;
      }

      // Try to read from Supabase (if configured)
      try {
        const db = supabaseService || supabase;
        if (db) {
          const { data, error } = await db
            .from('app_settings')
            .select('data')
            .eq('id', 'singleton')
            .maybeSingle();
          if (error) throw error;
          if (data?.data) {
            const merged = this.mergeWithDefaults(data.data);
            this.cache = merged;
            this.cacheTimeout = setTimeout(() => {
              this.cache = null;
            }, 10 * 60 * 1000);
            console.log('✅ Settings loaded from Supabase');
            return merged;
          }
        }
      } catch (dbErr) {
        console.warn('⚠️ Supabase settings load failed, falling back to file/defaults:', (dbErr as any)?.message);
      }

      // Try to read from file first (if available)
      try {
        const data = await fs.readFile(this.dataPath, 'utf8');
        const parsed = JSON.parse(data);
        
        // Cache the data for 10 minutes
        this.cache = parsed;
        this.cacheTimeout = setTimeout(() => {
          this.cache = null;
        }, 10 * 60 * 1000);
        
        console.log('✅ Settings loaded from file storage');
        return parsed;
      } catch (fileError) {
        console.log('📝 File storage not available, using defaults');
      }

      // Fallback to defaults
      const defaults = this.getDefaultSettings();
      this.cache = defaults;
      
      return defaults;
      
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  // Save settings with dual strategy
  async save(data: StorageData): Promise<boolean> {
    try {
      // Add metadata
      const dataWithMeta = {
        ...data,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };
      
      // Update cache immediately
      this.cache = dataWithMeta;
      console.log('✅ Settings cached in memory');
      
      // Try to persist to Supabase if configured
      let savedToSupabase = false;
      try {
        const db = supabaseService || supabase;
        if (db) {
          const { error } = await db
            .from('app_settings')
            .upsert({ id: 'singleton', data: dataWithMeta })
            .select('id')
            .single();
          if (error) throw error;
          savedToSupabase = true;
          console.log('✅ Settings saved to Supabase');
        }
      } catch (dbErr) {
        console.warn('⚠️ Supabase settings save failed, will rely on file/memory:', (dbErr as any)?.message);
      }

      // Try to save to file (if possible)
      let savedToFile = false;
      try {
        const canCreateDir = await this.ensureDataDir();
        if (canCreateDir) {
          await fs.writeFile(this.dataPath, JSON.stringify(dataWithMeta, null, 2));
          savedToFile = true;
          console.log('✅ Settings saved to file storage');
        }
      } catch (fileError) {
        console.log('⚠️ File save failed (serverless limitation), using memory cache only');
      }
      
      // Only report success if at least one durable target succeeded
      return savedToSupabase || savedToFile;
      
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      return false;
    }
  }

  // Update specific section with merge
  async update(updates: Partial<StorageData>): Promise<StorageData> {
    const current = await this.load();
    
    // Deep merge function
    const deepMerge = (target: any, source: any): any => {
      const result = { ...target };
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
      return result;
    };

    const merged = deepMerge(current, updates);
    const ok = await this.save(merged);
    if (!ok) {
      throw new Error('Failed to persist settings to Supabase or file storage');
    }
    
    return merged;
  }

  // Merge incoming with defaults to ensure all keys present
  private mergeWithDefaults(input: any): StorageData {
    const defaults = this.getDefaultSettings();
    const deepMerge = (target: any, source: any): any => {
      const result = { ...target };
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
      return result;
    };
    return deepMerge(defaults, input);
  }

  // Get default settings structure
  private getDefaultSettings(): StorageData {
    return {
      site: {
        title: "Ayurvedic Mantra",
        logo: "/logo.png",
        headerText: "Transform Your Health Naturally",
        contactPhone: "+919897990779",
        contactEmail: "orders@ayurvedicmantra.com",
        socialLinks: {
          facebook: "https://facebook.com/ayurvedicmantra",
          instagram: "https://www.instagram.com/ayurvedic_mantra_wellness",
          twitter: "https://twitter.com/ayurvedicmantra"
        }
      },
      homepage: {
        // 1 & 2
        heroTitle: "Lose Weight Naturally with Ayurvedic Mantra",
        heroSubtitle: "Transform your body with our clinically tested Ayurvedic weight loss formula. No side effects, just natural results that last.",
        heroImage: "/hero-product.jpg",

        // 3,4,5
        benefitsSection: {
          title: "Why Choose SlimX Ayurvedic Formula?",
          description: "Experience the power of ancient Ayurvedic wisdom combined with modern science for sustainable and healthy weight loss.",
          infoBoxes: [
            { title: "100% Natural", description: "Made with pure Ayurvedic herbs" },
            { title: "Fast Results", description: "See changes in just 2 weeks" },
            { title: "No Side Effects", description: "Safe for long-term use" },
            { title: "Targeted Fat Burn", description: "Burns stubborn belly fat" }
          ]
        },

        // 6,7
        pricingSection: {
          title: "Choose Your Transformation Plan",
          description: "Start your natural weight loss journey today. All plans come with free shipping and a 30-day money-back guarantee."
        },

        // 8,9,10,11
        testimonialsSection: {
          title: "Real People, Real Results",
          description: "Don't just take our word for it. Watch real transformation stories from thousands of satisfied customers across India.",
          items: [
            {
              id: 1,
              name: "Priya Sharma",
              age: 32,
              location: "Mumbai",
              rating: 5,
              text: "I lost 18 kg in 3 months! This is the only product that actually worked for me. No side effects, just pure natural goodness.",
              beforeWeight: "78 kg",
              afterWeight: "60 kg",
              videoUrl: "",
              image: "👩‍🦱"
            }
          ]
        },

        // 12,13,14
        faqSection: {
          title: "Frequently Asked Questions",
          description: "Find answers to common questions about Ayurvedic Mantra. Still have questions? Contact our support team anytime.",
          faqs: [
            {
              question: "How long does it take to see results?",
              answer: "Most customers see noticeable results within 2-3 weeks of regular use."
            },
            {
              question: "Are there any side effects?",
              answer: "SlimX is made from 100% natural Ayurvedic ingredients and has no known side effects when used as directed."
            }
          ]
        }
      },
      product: {
        name: "SlimX Ayurvedic Weight Loss Formula",
        tagline: "Natural Weight Loss Solution",
        description: "Clinically tested Ayurvedic formula for safe and effective weight loss",
        image: "/product-main.jpg",
        gallery: ["/product1.jpg", "/product2.jpg", "/product3.jpg"],
        ingredients: [
          "Black coffee extract",
          "Green tea extract", 
          "Green seed extract",
          "Garcinia Cambogia",
          "Tulsi",
          "Lemon dry extract",
          "Dal Chini",
          "Kali Mirch"
        ],
        plans: [
          {
            id: 1,
            name: "1 Month Supply",
            duration: "1 Month",
            price: 999,
            mrp: 1499,
            savings: 500,
            popular: false,
            description: "Perfect to get started",
            features: [
              "1 bottle (60 capsules)",
              "Basic meal plan",
              "Email support",
              "Free shipping"
            ]
          },
          {
            id: 2,
            name: "2 Month Supply",
            duration: "2 Months", 
            price: 1499,
            mrp: 2598,
            savings: 1099,
            popular: true,
            description: "Most popular choice",
            features: [
              "2 bottles (120 capsules)",
              "Detailed meal plan",
              "Priority support",
              "Progress tracking guide",
              "Free shipping"
            ]
          },
          {
            id: 3,
            name: "3 Month Supply",
            duration: "3 Months",
            price: 1799,
            mrp: 3897,
            savings: 2098,
            popular: false,
            bestValue: true,
            description: "Best value for complete transformation",
            features: [
              "3 bottles (180 capsules)",
              "Complete wellness program",
              "Personal consultation call",
              "Exercise routine guide",
              "24/7 WhatsApp support",
              "Free shipping + bonus gifts"
            ]
          }
        ]
      },
      checkout: {
        title: "Complete Your Order",
        subtitle: "Secure 256-bit SSL encrypted checkout",
        deliveryDays: 3,
        deliveryMessage: "Ships within 24 hours with free delivery",
        thankYouMessage: "Thank you for choosing Ayurvedic Mantra! Your natural transformation journey begins now.",
        supportMessage: "Need help? Contact us at +919897990779"
      },
      communications: {
        sms: {
          enabled: true,
          provider: "infobip",
          apiKey: "42722043657b0c8bc9c75d13df7469f3-c238a19f-3c29-48d9-a969-ebaa38a4a868",
          senderId: "AyurMantra",
          template: "Your OTP is {otp}. Use this to verify your action on SlimX Mantra. Valid for 10 minutes.",
          baseUrl: "https://pez91m.api.infobip.com"
        },
        email: {
          enabled: true,
          smtpHost: "smtp.titan.email",
          smtpPort: 465,
          smtpSecurity: "SSL",
          username: "orders@ayurvedicmantra.com",
          password: "aDIL@8899",
          fromName: "Ayurvedic Mantra",
          subject: "Your Login OTP - Ayurvedic Mantra",
          template: `Hi there!\n\nYour OTP for Ayurvedic Mantra is: {otp}\n\nThis OTP is valid for 10 minutes. Please do not share this code with anyone.\n\nBest regards,\nAyurvedic Mantra Team`
        }
      },
      payment: {
        gateway: "payu",
        merchantId: "",
        merchantKey: "",
        merchantSalt: "",
        testMode: true
      },
      shipping: {
        shiprocket: {
          token: "",
          email: "",
          authenticated: false,
          enabled: false
        }
      },
      media: {
        heroImages: [],
        productImages: [],
        testimonialImages: []
      },
      version: "1.0",
      lastUpdated: new Date().toISOString()
    };
  }

  // Clear cache
  clearCache(): void {
    this.cache = null;
    if (this.cacheTimeout) {
      clearTimeout(this.cacheTimeout);
      this.cacheTimeout = null;
    }
  }

  // Get cached data without file access
  getCached(): StorageData | null {
    return this.cache;
  }
}

// Export singleton instance
export const storage = PersistentStorage.getInstance();