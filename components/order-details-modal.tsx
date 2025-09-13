"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  CreditCard, 
  Calendar,
  Truck,
  Eye,
  Download,
  Copy,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  const { toast } = useToast();

  if (!order) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied! 📋",
      description: `${label} copied to clipboard`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'confirmed':
        return 'bg-purple-100 text-purple-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'guest':
        return 'bg-orange-100 text-orange-700';
      case 'linked_guest':
        return 'bg-blue-100 text-blue-700';
      case 'registered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-sage-700 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Details - #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status & Basic Info */}
          <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(order.orderStatus)}>
                  {order.orderStatus?.toUpperCase()}
                </Badge>
                <Badge className={order.paymentMethod === 'cod' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                  {order.paymentMethod === 'cod' ? 'COD' : 'ONLINE'}
                </Badge>
                <Badge className={getCustomerTypeColor(order.customerType || (order.isGuest ? 'guest' : 'registered'))}>
                  {order.customerType === 'guest' ? 'GUEST' : 
                   order.customerType === 'linked_guest' ? 'LINKED GUEST' : 'REGISTERED'}
                </Badge>
              </div>
              <p className="text-sm text-sage-600">
                <Calendar className="w-4 h-4 inline mr-1" />
                {new Date(order.orderTime).toLocaleDateString()} at {new Date(order.orderTime).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-sage-700">₹{order.price?.toLocaleString()}</p>
              <p className="text-sm text-sage-600">{order.planName}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-sage-700 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-sage-600" />
                  <span className="font-medium">{order.userName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(order.userName, 'Customer name')}
                    className="h-auto p-1"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                
                {order.userEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sage-600" />
                    <span className="text-sm">{order.userEmail}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(order.userEmail, 'Email')}
                      className="h-auto p-1"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sage-600" />
                  <span className="text-sm">{order.userPhone}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(order.userPhone, 'Phone number')}
                    className="h-auto p-1"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {order.wasGuestOrder && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> This was originally a guest order
                      {order.linkedAt && (
                        <span className="block text-xs mt-1">
                          Linked to user account on {new Date(order.linkedAt).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                
                {order.orderSource && (
                  <div className="text-sm text-sage-600">
                    <strong>Order Source:</strong> {order.orderSource}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-sage-700 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress?.name}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress?.address}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>
                <p className="text-sm text-gray-600">
                  <Phone className="w-3 h-3 inline mr-1" />
                  {order.shippingAddress?.phone}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(
                  `${order.shippingAddress?.name}\n${order.shippingAddress?.address}\n${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}\nPhone: ${order.shippingAddress?.phone}`,
                  'Full address'
                )}
                className="mt-2"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </Button>
            </div>
          </div>

          <Separator />

          {/* Payment & Shipping Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-sage-700 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <Badge className={order.paymentMethod === 'cod' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="text-sm">{order.paymentStatus || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Total:</span>
                  <span className="font-semibold">₹{order.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-sage-700 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="text-sm">{order.estimatedDelivery || 3} business days</span>
                </div>
                {order.shiprocket?.awbCode && (
                  <>
                    <div className="flex justify-between">
                      <span>AWB Code:</span>
                      <span className="text-sm font-mono">{order.shiprocket.awbCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Courier:</span>
                      <span className="text-sm">{order.shiprocket.courierName}</span>
                    </div>
                  </>
                )}
                {order.shiprocket?.status && (
                  <div className="flex justify-between">
                    <span>Shipping Status:</span>
                    <Badge variant="outline">{order.shiprocket.status}</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Order History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-sage-700">Order History</h3>
              <div className="space-y-2">
                {order.statusHistory.map((event: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{event.status}</p>
                      <p className="text-xs text-gray-600">{event.note}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Invoice
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Details
            </Button>
            {order.shiprocket?.awbCode && (
              <Button variant="outline" className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Track Shipment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}