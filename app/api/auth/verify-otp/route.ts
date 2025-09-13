import { NextRequest, NextResponse } from 'next/server';

// Mock user database
let users: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { contact, contactType, otp } = await request.json();
    console.log('🔐 OTP verification request for:', contact, 'type:', contactType, 'with OTP:', otp);

    if (!contact || !otp || !contactType) {
      return NextResponse.json({ 
        success: false, 
        message: 'Contact, contact type, and OTP are required' 
      }, { status: 400 });
    }

    // Format contact
    const formattedContact = contactType === 'email' 
      ? contact.toLowerCase().trim()
      : contact.startsWith('+') ? contact : `+91${contact}`;
    
    // Check OTP from store
    const otpKey = `otp_${formattedContact}`;
    const otpStore = global.otpStore || new Map();
    const storedOtpData = otpStore.get(otpKey);

    if (!storedOtpData) {
      console.log('❌ No OTP found for contact:', formattedContact);
      return NextResponse.json({
        success: false,
        message: "OTP expired or not found. Please request a new OTP."
      }, { status: 400 });
    }

    // Check if OTP is expired (10 minutes)
    const otpAge = Date.now() - storedOtpData.timestamp;
    if (otpAge > 10 * 60 * 1000) {
      console.log('❌ OTP expired for contact:', formattedContact);
      otpStore.delete(otpKey);
      return NextResponse.json({
        success: false,
        message: "OTP has expired. Please request a new OTP."
      }, { status: 400 });
    }

    // Check attempt limit
    if (storedOtpData.attempts >= 3) {
      console.log('❌ Too many OTP attempts for contact:', formattedContact);
      otpStore.delete(otpKey);
      return NextResponse.json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP."
      }, { status: 400 });
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      console.log('❌ Incorrect OTP for contact:', formattedContact);
      storedOtpData.attempts += 1;
      otpStore.set(otpKey, storedOtpData);
      
      return NextResponse.json({
        success: false,
        message: `Incorrect OTP. ${3 - storedOtpData.attempts} attempts remaining.`
      }, { status: 400 });
    }

    // OTP verified successfully
    console.log('✅ OTP verified successfully for contact:', formattedContact);
    
    // Remove OTP from store
    otpStore.delete(otpKey);

    // Find or create user in database
    let user = users.find(u => u.contact === formattedContact);
    
    if (!user) {
      // Create new user
      user = {
        id: `USER_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        contact: formattedContact,
        contactType: contactType,
        name: contactType === 'email' ? formattedContact.split('@')[0] : 'User',
        email: contactType === 'email' ? formattedContact : '',
        phone: contactType === 'phone' ? formattedContact : '',
        signupTime: new Date().toISOString(),
        signupMethod: 'otp',
        verified: true,
        totalOrders: 0,
        totalSpent: 0,
        addresses: [],
        orders: []
      };
      
      users.push(user);
      console.log('👤 New user created:', user.id);
    } else {
      // Update existing user login
      user.lastLoginTime = new Date().toISOString();
      user.verified = true;
      console.log('👤 Existing user logged in:', user.id);
    }

    // Generate user token
    const userToken = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store user session
    const userSessions = global.userSessions || new Map();
    userSessions.set(userToken, {
      userId: user.id,
      contact: formattedContact,
      loginTime: new Date().toISOString()
    });
    global.userSessions = userSessions;

    return NextResponse.json({
      success: true,
      message: "Login successful! Redirecting to your dashboard...",
      data: {
        user: {
          id: user.id,
          name: user.name,
          contact: user.contact,
          contactType: user.contactType,
          email: user.email,
          phone: user.phone,
          verified: user.verified,
          loginTime: new Date().toISOString(),
          totalOrders: user.totalOrders,
          totalSpent: user.totalSpent
        },
        token: userToken,
        authenticated: true,
        redirectTo: '/dashboard'
      }
    });

  } catch (error: any) {
    console.error('❌ OTP verification failed:', error);
    return NextResponse.json({
      success: false,
      message: "OTP verification failed. Please try again."
    }, { status: 500 });
  }
}

// Get user data by token
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "No authentication token provided"
      }, { status: 401 });
    }

    const userSessions = global.userSessions || new Map();
    const session = userSessions.get(token);

    if (!session) {
      return NextResponse.json({
        success: false,
        message: "Invalid or expired session"
      }, { status: 401 });
    }

    // Find user by ID
    const user = users.find(u => u.id === session.userId);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          contact: user.contact,
          contactType: user.contactType,
          email: user.email,
          phone: user.phone,
          verified: user.verified,
          totalOrders: user.totalOrders,
          totalSpent: user.totalSpent
        }
      }
    });

  } catch (error: any) {
    console.error('❌ User data fetch failed:', error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch user data"
    }, { status: 500 });
  }
}