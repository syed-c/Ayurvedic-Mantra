import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 [SHIPROCKET SUPER ADMIN] Manual API user creation for ayurvedicmantra.com");
    
    const { email, password, masterEmail, masterPassword } = await request.json();
    
    if (!email || !password || !masterEmail || !masterPassword) {
      return NextResponse.json({
        success: false,
        message: "All fields required: email, password, masterEmail, masterPassword"
      }, { status: 400 });
    }
    
    console.log("🔑 [SUPER ADMIN] Authenticating with master account...");
    
    // Authenticate with master account first
    const masterAuthResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: masterEmail,
        password: masterPassword
      })
    });
    
    const masterAuthResult = await masterAuthResponse.json();
    
    if (!masterAuthResponse.ok) {
      console.error("❌ [SUPER ADMIN] Master authentication failed:", masterAuthResult);
      return NextResponse.json({
        success: false,
        message: "Master account authentication failed",
        error: masterAuthResult.message
      }, { status: 401 });
    }
    
    const masterToken = masterAuthResult.token;
    console.log("✅ [SUPER ADMIN] Master token obtained");
    
    // Create API user with full permissions
    console.log("👤 [API USER] Creating API user with full permissions...");
    const createUserResponse = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/addUser', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${masterToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: "API",
        last_name: "User",
        email: email,
        phone: "9999999999",
        role: "admin", // Give admin role for full permissions
        password: password,
        confirm_password: password
      })
    });
    
    const createUserResult = await createUserResponse.json();
    
    if (!createUserResponse.ok) {
      console.error("❌ [API USER] User creation failed:", createUserResult);
      return NextResponse.json({
        success: false,
        message: "API user creation failed",
        error: createUserResult.message
      }, { status: 400 });
    }
    
    console.log("✅ [API USER] API user created successfully");
    
    // Test the new API user credentials
    console.log("🧪 [TEST] Testing new API user credentials...");
    const testAuthResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    
    const testAuthResult = await testAuthResponse.json();
    
    if (!testAuthResponse.ok) {
      console.error("❌ [TEST] New API user test failed:", testAuthResult);
      return NextResponse.json({
        success: false,
        message: "API user created but authentication test failed",
        error: testAuthResult.message
      }, { status: 401 });
    }
    
    console.log("✅ [TEST] New API user working correctly");
    
    // Update the settings with the new API user credentials
    console.log("💾 [SETTINGS] Updating system settings...");
    const { storage } = await import('@/lib/storage');
    const currentSettings = await storage.load();
    
    const updatedSettings = {
      ...currentSettings,
      shipping: {
        ...currentSettings.shipping,
        shiprocket: {
          ...currentSettings.shipping.shiprocket,
          email: email,
          password: password,
          apiUserCreated: new Date().toISOString(),
          domain: 'ayurvedicmantra.com'
        }
      }
    };
    
    await storage.save(updatedSettings);
    console.log("✅ [SETTINGS] System settings updated with new API user");
    
    return NextResponse.json({
      success: true,
      message: "API user created and configured successfully for ayurvedicmantra.com",
      data: {
        apiUserEmail: email,
        created: true,
        tested: true,
        settingsUpdated: true,
        domain: 'ayurvedicmantra.com'
      }
    });
    
  } catch (error: any) {
    console.error("❌ [SHIPROCKET SUPER ADMIN] Critical error:", error);
    
    return NextResponse.json({
      success: false,
      message: "Error creating API user for ayurvedicmantra.com",
      error: error.message
    }, { status: 500 });
  }
}