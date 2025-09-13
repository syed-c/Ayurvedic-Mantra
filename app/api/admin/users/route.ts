import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// In-memory storage - starts empty, real users only
let users: any[] = [];

export async function GET() {
  console.log("Getting users list");

  if (!supabase) {
    return NextResponse.json({ success: true, data: { users: [], stats: { totalUsers: 0, todaySignups: 0, verifiedUsers: 0, totalRevenue: 0 } } });
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase users fetch failed:', error.message);
    return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
  }

  const list = data || [];
  const stats = {
    totalUsers: list.length,
    todaySignups: list.filter((u: any) => new Date(u.created_at).toDateString() === new Date().toDateString()).length,
    verifiedUsers: list.filter((u: any) => !!u.verified).length,
    totalRevenue: list.reduce((sum: number, u: any) => sum + (u.total_spent || 0), 0)
  };

  return NextResponse.json({ success: true, data: { users: list, stats } });
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    console.log("Adding new user:", userData);

    if (!supabase) {
      return NextResponse.json({ success: false, message: 'Database not configured' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        email: userData.email || null,
        phone: userData.phone || null,
        name: userData.name || null,
        is_guest: !!userData.isGuest,
        verified: false,
        total_orders: 0,
        total_spent: 0,
        meta: userData.meta || null
      })
      .select('*')
      .single();

    if (error) {
      console.error('Supabase insert user failed:', error.message);
      return NextResponse.json({ success: false, message: 'Failed to register user' }, { status: 500 });
    }

    console.log("New user added successfully");
    return NextResponse.json({ success: true, message: 'User registered successfully', data });

  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to register user" 
    }, { status: 500 });
  }
}