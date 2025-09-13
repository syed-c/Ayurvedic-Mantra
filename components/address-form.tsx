"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, CheckCircle } from "lucide-react";

interface AddressFormData {
  fullName: string;
  address: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  email?: string;
  [key: string]: any; // Allow additional properties
}

interface AddressFormProps {
  formData: any;
  onFormChange: (data: any) => void;
  emailOptional?: boolean;
  showTitle?: boolean;
  className?: string;
}

// PIN code lookup data (simplified for this example)
const pincodeLookup: Record<string, { city: string; state: string }> = {
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "110001": { city: "New Delhi", state: "Delhi" },
  "560001": { city: "Bangalore", state: "Karnataka" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "411001": { city: "Pune", state: "Maharashtra" },
  "500001": { city: "Hyderabad", state: "Telangana" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "800001": { city: "Patna", state: "Bihar" },
  "302001": { city: "Jaipur", state: "Rajasthan" },
  "226001": { city: "Lucknow", state: "Uttar Pradesh" },
  "462001": { city: "Bhopal", state: "Madhya Pradesh" },
  "781001": { city: "Guwahati", state: "Assam" },
  "751001": { city: "Bhubaneswar", state: "Odisha" },
  "695001": { city: "Trivandrum", state: "Kerala" },
  "744101": { city: "Port Blair", state: "Andaman and Nicobar Islands" },
  "160001": { city: "Chandigarh", state: "Chandigarh" },
  "403001": { city: "Panaji", state: "Goa" },
  "171001": { city: "Shimla", state: "Himachal Pradesh" },
  "180001": { city: "Jammu", state: "Jammu and Kashmir" },
  "370001": { city: "Kavaratti", state: "Lakshadweep" },
  "605001": { city: "Puducherry", state: "Puducherry" },
  "795001": { city: "Imphal", state: "Manipur" },
  "796001": { city: "Aizawl", state: "Mizoram" },
  "797001": { city: "Kohima", state: "Nagaland" },
  "737001": { city: "Gangtok", state: "Sikkim" },
  "799001": { city: "Agartala", state: "Tripura" },
  "248001": { city: "Dehradun", state: "Uttarakhand" }
};

export default function AddressForm({ 
  formData, 
  onFormChange, 
  emailOptional = true, 
  showTitle = true,
  className = ""
}: AddressFormProps) {
  console.log("AddressForm rendered with data:", formData);
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeSuccess, setPincodeSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    console.log(`Address form field changed: ${field} = ${value}`);
    
    const updatedData = {
      ...formData,
      [field]: value
    };
    
    onFormChange(updatedData);
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handlePincodeChange = async (pincode: string) => {
    console.log("PIN code entered:", pincode);
    handleInputChange('pincode', pincode);
    
    // Reset previous state
    setPincodeSuccess(false);
    
    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      console.log("Valid PIN code format, looking up city/state");
      setPincodeLoading(true);
      
      // Simulate API lookup delay
      setTimeout(() => {
        const location = pincodeLookup[pincode];
        
        if (location) {
          console.log("PIN code found:", location);
          const updatedData = {
            ...formData,
            pincode,
            city: location.city,
            state: location.state
          };
          onFormChange(updatedData);
          setPincodeSuccess(true);
        } else {
          console.log("PIN code not found in lookup table");
          // Clear city/state if PIN code not found
          const updatedData = {
            ...formData,
            pincode,
            city: "",
            state: ""
          };
          onFormChange(updatedData);
        }
        setPincodeLoading(false);
      }, 500);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.fullName.trim()) errors.push("Full Name is required");
    if (!formData.address.trim()) errors.push("Street Address is required");
    if (!formData.phone.trim()) errors.push("Phone Number is required");
    if (!formData.pincode.trim()) errors.push("PIN Code is required");
    if (!formData.city.trim()) errors.push("City is required");
    if (!formData.state.trim()) errors.push("State is required");
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.push("Please enter a valid 10-digit phone number");
    }
    
    // PIN code validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      errors.push("Please enter a valid 6-digit PIN code");
    }
    
    // Email validation (if provided)
    if (!emailOptional && !formData.email?.trim()) {
      errors.push("Email is required");
    }
    
    if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-sage-700">Delivery Address</h3>
          <p className="text-sm text-sage-600">
            Please provide accurate delivery information for smooth delivery
          </p>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Full Name - REQUIRED */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sage-700 font-medium">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            className="border-sage-200 focus:border-sage-400"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            required
          />
        </div>

        {/* Street Address - REQUIRED */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sage-700 font-medium">
            Street Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="House/Flat No., Street, Area, Landmark"
            className="border-sage-200 focus:border-sage-400"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            required
          />
        </div>

        {/* Phone Number - REQUIRED */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sage-700 font-medium">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="9876543210"
            className="border-sage-200 focus:border-sage-400"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
        </div>

        {/* PIN Code - REQUIRED with Auto-fill */}
        <div className="space-y-2">
          <Label htmlFor="pincode" className="text-sage-700 font-medium">
            PIN Code <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="pincode"
              type="text"
              placeholder="400001"
              className="border-sage-200 focus:border-sage-400 pr-10"
              value={formData.pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              maxLength={6}
              required
            />
            {pincodeLoading && (
              <div className="absolute right-3 top-3 w-4 h-4 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin"></div>
            )}
            {pincodeSuccess && (
              <CheckCircle className="absolute right-3 top-3 w-4 h-4 text-sage-600" />
            )}
          </div>
          {pincodeSuccess && (
            <p className="text-xs text-sage-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Location auto-filled based on PIN code
            </p>
          )}
        </div>

        {/* City and State - Auto-filled but editable */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sage-700 font-medium">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="Mumbai"
              className="border-sage-200 focus:border-sage-400"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sage-700 font-medium">
              State <span className="text-red-500">*</span>
            </Label>
            <Input
              id="state"
              type="text"
              placeholder="Maharashtra"
              className="border-sage-200 focus:border-sage-400"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email - OPTIONAL */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sage-700 font-medium">
            Email Address {emailOptional ? "(Optional)" : <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com (for order updates)"
            className="border-sage-200 focus:border-sage-400"
            value={formData.email || ""}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required={!emailOptional}
          />
          {emailOptional && (
            <p className="text-xs text-sage-600">
              If provided, you'll receive order confirmations and updates via email
            </p>
          )}
        </div>
      </div>

      {/* Helper Text */}
      <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-sage-600 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-sage-700">Address Guidelines</p>
            <ul className="text-xs text-sage-600 space-y-1">
              <li>• Enter complete address for smooth delivery</li>
              <li>• PIN code will auto-fill city and state</li>
              <li>• Email is optional but recommended for updates</li>
              <li>• Double-check phone number for delivery coordination</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}