import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  try {
    console.log("🌐 Fetching public settings from storage");
    
    // Load settings from singleton storage
    const allSettings = await storage.load();
    
    // Return only public-safe settings (excluding sensitive data)
    const publicSettings = {
      site: allSettings.site,
      homepage: allSettings.homepage,
      product: {
        name: allSettings.product?.name,
        tagline: allSettings.product?.tagline,
        description: allSettings.product?.description,
        image: allSettings.product?.image,
        gallery: allSettings.product?.gallery,
        plans: allSettings.product?.plans,
        ingredients: allSettings.product?.ingredients
      },
      checkout: {
        title: allSettings.checkout?.title,
        subtitle: allSettings.checkout?.subtitle,
        deliveryDays: allSettings.checkout?.deliveryDays,
        deliveryMessage: allSettings.checkout?.deliveryMessage,
        thankYouMessage: allSettings.checkout?.thankYouMessage,
        supportMessage: allSettings.checkout?.supportMessage
      }
    };

    console.log("✅ Public settings fetched successfully from storage");

    return NextResponse.json({
      success: true,
      data: publicSettings,
      lastUpdated: allSettings.lastUpdated,
      cached: storage.getCached() !== null
    });

  } catch (error) {
    console.error("❌ Error fetching public settings:", error);
    
    // Return minimal fallback settings if storage fails
    const fallbackSettings = {
      site: {
        title: "Ayurvedic Mantra",
        logo: "/logo.png",
        headerText: "Transform Your Health Naturally",
        contactPhone: "+919897990779",
        contactEmail: "orders@ayurvedicmantra.com"
      },
      homepage: {
        heroTitle: "Lose Weight Naturally with Ayurvedic Mantra",
        heroSubtitle: "Transform your body with our clinically tested Ayurvedic weight loss formula. Safe, effective, and 100% natural."
      },
      product: {
        name: "SlimX Ayurvedic Weight Loss Formula",
        tagline: "Natural. Safe. Effective.",
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
    
    return NextResponse.json({
      success: true,
      data: fallbackSettings,
      fallback: true
    });
  }
}