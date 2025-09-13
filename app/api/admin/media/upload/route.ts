import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    console.log("🖼️ Processing image upload request");
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'hero', 'product', 'testimonial', etc.
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: "No file provided"
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        message: "Invalid file type. Only JPEG, PNG, and WebP are allowed."
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: "File too large. Maximum size is 5MB."
      }, { status: 400 });
    }

    // Convert file to base64 for storage (in production, upload to cloud storage)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${type}-${timestamp}-${file.name}`;
    
    console.log(`📁 Processing ${file.type} file: ${filename} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    // Determine where to save the image based on type
    let updateData: any = {};
    
    switch (type) {
      case 'hero':
        updateData = {
          homepage: {
            heroImage: base64
          },
          media: {
            heroImages: [{ 
              filename, 
              url: base64, 
              uploadedAt: new Date().toISOString(),
              size: file.size,
              type: file.type
            }]
          }
        };
        break;
        
      case 'product':
        updateData = {
          product: {
            image: base64
          },
          media: {
            productImages: [{ 
              filename, 
              url: base64, 
              uploadedAt: new Date().toISOString(),
              size: file.size,
              type: file.type
            }]
          }
        };
        break;
        
      case 'testimonial':
        updateData = {
          media: {
            testimonialImages: [{ 
              filename, 
              url: base64, 
              uploadedAt: new Date().toISOString(),
              size: file.size,
              type: file.type
            }]
          }
        };
        break;
        
      default:
        // Generic media upload
        updateData = {
          media: {
            [`${type}Images`]: [{ 
              filename, 
              url: base64, 
              uploadedAt: new Date().toISOString(),
              size: file.size,
              type: file.type
            }]
          }
        };
    }

    // Save to persistent storage
    const updatedSettings = await storage.update(updateData);
    
    console.log(`✅ Image uploaded and saved successfully: ${filename}`);
    
    return NextResponse.json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully!`,
      data: {
        filename,
        url: base64,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Image upload failed:", error);
    return NextResponse.json({
      success: false,
      message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

// Handle GET request to retrieve uploaded images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    const settings = await storage.load();
    const media = settings.media || {};
    
    if (type) {
      const typeImages = media[`${type}Images`] || [];
      return NextResponse.json({
        success: true,
        data: typeImages
      });
    }
    
    // Return all media
    return NextResponse.json({
      success: true,
      data: media
    });
    
  } catch (error) {
    console.error("❌ Error retrieving media:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to retrieve media"
    }, { status: 500 });
  }
}