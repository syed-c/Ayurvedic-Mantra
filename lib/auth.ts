// Authentication utilities and security helpers

export interface User {
  id: string;
  contact: string;
  contactType: 'email' | 'phone';
  verified: boolean;
  loginTime: string;
  name?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'super_admin' | 'admin';
  loginTime: string;
}

// Client-side auth helpers
export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const getUserToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userToken');
};

export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
};

export const isUserLoggedIn = (): boolean => {
  return !!(getStoredUser() && getUserToken());
};

export const isAdminLoggedIn = (): boolean => {
  return !!getAdminToken();
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('userData');
  localStorage.removeItem('userToken');
  console.log("User logged out");
};

export const adminLogout = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
  console.log("Admin logged out");
};

// Validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

// Security helpers
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>'"]/g, '');
};

export const generateSecureToken = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Rate limiting helper (client-side)
export const checkRateLimit = (key: string, maxAttempts: number = 5, windowMs: number = 300000): boolean => {
  if (typeof window === 'undefined') return true;
  
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem(`rl_${key}`) || '[]');
  
  // Remove old attempts outside the window
  const validAttempts = attempts.filter((time: number) => now - time < windowMs);
  
  if (validAttempts.length >= maxAttempts) {
    return false;
  }
  
  validAttempts.push(now);
  localStorage.setItem(`rl_${key}`, JSON.stringify(validAttempts));
  return true;
};