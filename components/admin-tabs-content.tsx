"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Download,
  Upload,
  Star,
  Search,
  DollarSign,
  MessageSquare,
  Image,
  Package,
  Users,
  Zap,
  Phone,
  Mail,
  Truck,
  CreditCard,
  Settings,
  Globe,
  Target,
  Video,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminTabsContentProps {
  settings: any;
  stats: any;
  users: any[];
  orders: any[];
  isSaving: boolean;
  saveSettings: (type: string, data: any) => Promise<boolean>;
  uploadImage: (file: File, type: string) => Promise<string | null>;
  exportOrders: () => void;
  exportUsers: () => void;
}

export function AdminTabsContent({
  settings,
  stats,
  users,
  orders,
  isSaving,
  saveSettings,
  uploadImage,
  exportOrders,
  exportUsers
}: AdminTabsContentProps) {
  const { toast } = useToast();
  
  // State for various forms
  const [seoSettings, setSeoSettings] = useState({
    homepage: {
      title: settings?.seo?.homepage?.title || "Ayurvedic Mantra - Natural Weight Loss",
      description: settings?.seo?.homepage?.description || "Lose weight naturally with our Ayurvedic formula",
      keywords: settings?.seo?.homepage?.keywords || "ayurvedic, weight loss, natural",
      ogImage: settings?.seo?.homepage?.ogImage || ""
    },
    product: {
      title: settings?.seo?.product?.title || "SlimX Mantra - Product Details",
      description: settings?.seo?.product?.description || "Learn about our natural weight loss formula",
      keywords: settings?.seo?.product?.keywords || "slimx, ayurvedic medicine, weight loss",
      ogImage: settings?.seo?.product?.ogImage || ""
    }
  });

  const [pricingPlans, setPricingPlans] = useState(
    settings?.product?.plans || [
      { id: 1, name: "1 Month Supply", price: 999, mrp: 1499, duration: "1 Month", enabled: true },
      { id: 2, name: "2 Month Supply", price: 1499, mrp: 2598, duration: "2 Months", popular: true, enabled: true },
      { id: 3, name: "3 Month Supply", price: 1799, mrp: 3897, duration: "3 Months", bestValue: true, enabled: true }
    ]
  );

  const [testimonials, setTestimonials] = useState(
    settings?.testimonials || [
      {
        id: 1,
        name: "Priya Sharma",
        location: "Mumbai",
        rating: 5,
        text: "Amazing results! Lost 18kg naturally.",
        image: "",
        video: "",
        beforeWeight: "78 kg",
        afterWeight: "60 kg",
        enabled: true
      }
    ]
  );

  const [faqs, setFaqs] = useState(
    settings?.faqs || [
      {
        id: 1,
        question: "Is this product safe?",
        answer: "Yes, completely natural and safe.",
        enabled: true
      }
    ]
  );

  // Sync local state with settings prop changes
  useEffect(() => {
    if (settings) {
      // Update SEO settings
      setSeoSettings({
        homepage: {
          title: settings?.seo?.homepage?.title || "Ayurvedic Mantra - Natural Weight Loss",
          description: settings?.seo?.homepage?.description || "Lose weight naturally with our Ayurvedic formula",
          keywords: settings?.seo?.homepage?.keywords || "ayurvedic, weight loss, natural",
          ogImage: settings?.seo?.homepage?.ogImage || ""
        },
        product: {
          title: settings?.seo?.product?.title || "SlimX Mantra - Product Details",
          description: settings?.seo?.product?.description || "Learn about our natural weight loss formula",
          keywords: settings?.seo?.product?.keywords || "slimx, ayurvedic medicine, weight loss",
          ogImage: settings?.seo?.product?.ogImage || ""
        }
      });

      // Update pricing plans
      if (settings?.product?.plans) {
        setPricingPlans(settings.product.plans);
      }

      // Update testimonials
      if (settings?.testimonials) {
        setTestimonials(settings.testimonials);
      } else if (settings?.homepage?.testimonials) {
        setTestimonials(settings.homepage.testimonials);
      }

      // Update FAQs
      if (settings?.faqs) {
        setFaqs(settings.faqs);
      } else if (settings?.homepage?.faqs) {
        setFaqs(settings.homepage.faqs);
      }
    }
  }, [settings]);

  // Add new testimonial
  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now(),
      name: "",
      location: "",
      rating: 5,
      text: "",
      image: "",
      video: "",
      beforeWeight: "",
      afterWeight: "",
      enabled: true
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  // Update testimonial
  const updateTestimonial = (id: number, field: string, value: any) => {
    setTestimonials(testimonials.map((t: any) => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  // Delete testimonial
  const deleteTestimonial = (id: number) => {
    setTestimonials(testimonials.filter((t: any) => t.id !== id));
  };

  // Add new FAQ
  const addFaq = () => {
    const newFaq = {
      id: Date.now(),
      question: "",
      answer: "",
      enabled: true
    };
    setFaqs([...faqs, newFaq]);
  };

  // Update FAQ
  const updateFaq = (id: number, field: string, value: any) => {
    setFaqs(faqs.map((f: any) => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  // Delete FAQ
  const deleteFaq = (id: number) => {
    setFaqs(faqs.filter((f: any) => f.id !== id));
  };

  // Update pricing plan
  const updatePricingPlan = (id: number, field: string, value: any) => {
    setPricingPlans(pricingPlans.map((p: any) => 
      p.id === id ? { ...p, [field]: value, savings: field === 'mrp' || field === 'price' ? 
        (field === 'mrp' ? value - p.price : p.mrp - value) : p.savings } : p
    ));
  };

  return (
    <>
      {/* SEO Settings Tab */}
      <TabsContent value="seo" className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Homepage SEO */}
          <Card className="card-ayurveda">
            <CardHeader>
              <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                <Search className="w-5 h-5" />
                Homepage SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sage-700">Meta Title</Label>
                <Input
                  value={seoSettings.homepage.title}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    homepage: {...seoSettings.homepage, title: e.target.value}
                  })}
                  className="border-sage-200 focus:border-sage-400"
                />
                <p className="text-xs text-sage-500">{seoSettings.homepage.title.length}/60 characters</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">Meta Description</Label>
                <Textarea
                  value={seoSettings.homepage.description}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    homepage: {...seoSettings.homepage, description: e.target.value}
                  })}
                  className="border-sage-200 focus:border-sage-400"
                />
                <p className="text-xs text-sage-500">{seoSettings.homepage.description.length}/160 characters</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">Keywords (comma separated)</Label>
                <Input
                  value={seoSettings.homepage.keywords}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    homepage: {...seoSettings.homepage, keywords: e.target.value}
                  })}
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>

              <Button 
                onClick={() => saveSettings("Homepage SEO", {
                  seo: {
                    ...settings?.seo,
                    homepage: seoSettings.homepage
                  }
                })}
                className="w-full btn-ayurveda"
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Homepage SEO"}
              </Button>
            </CardContent>
          </Card>

          {/* Product Page SEO */}
          <Card className="card-ayurveda">
            <CardHeader>
              <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Product Page SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sage-700">Meta Title</Label>
                <Input
                  value={seoSettings.product.title}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    product: {...seoSettings.product, title: e.target.value}
                  })}
                  className="border-sage-200 focus:border-sage-400"
                />
                <p className="text-xs text-sage-500">{seoSettings.product.title.length}/60 characters</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">Meta Description</Label>
                <Textarea
                  value={seoSettings.product.description}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    product: {...seoSettings.product, description: e.target.value}
                  })}
                  className="border-sage-200 focus:border-sage-400"
                />
                <p className="text-xs text-sage-500">{seoSettings.product.description.length}/160 characters</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">Keywords (comma separated)</Label>
                <Input
                  value={seoSettings.product.keywords}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    product: {...seoSettings.product, keywords: e.target.value}
                  })}
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>

              <Button 
                onClick={() => saveSettings("Product SEO", {
                  seo: {
                    ...settings?.seo,
                    product: seoSettings.product
                  }
                })}
                className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white"
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Product SEO"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Pricing Management Tab */}
      <TabsContent value="pricing" className="space-y-6">
        <Card className="card-ayurveda">
          <CardHeader>
            <CardTitle className="text-sage-700 font-poppins">Real-Time Pricing Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan: any) => (
                <div key={plan.id} className="space-y-4 p-4 border border-sage-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sage-700">{plan.name}</h4>
                    <Switch 
                      checked={plan.enabled}
                      onCheckedChange={(checked) => updatePricingPlan(plan.id, 'enabled', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sage-600">Plan Name</Label>
                    <Input
                      value={plan.name}
                      onChange={(e) => updatePricingPlan(plan.id, 'name', e.target.value)}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-600">Selling Price</Label>
                    <Input
                      type="number"
                      value={plan.price}
                      onChange={(e) => updatePricingPlan(plan.id, 'price', parseInt(e.target.value))}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-600">MRP</Label>
                    <Input
                      type="number"
                      value={plan.mrp}
                      onChange={(e) => updatePricingPlan(plan.id, 'mrp', parseInt(e.target.value))}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-600">Duration</Label>
                    <Input
                      value={plan.duration}
                      onChange={(e) => updatePricingPlan(plan.id, 'duration', e.target.value)}
                      className="border-sage-200 focus:border-sage-400"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sage-600">Popular</Label>
                    <Switch 
                      checked={plan.popular || false}
                      onCheckedChange={(checked) => updatePricingPlan(plan.id, 'popular', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sage-600">Best Value</Label>
                    <Switch 
                      checked={plan.bestValue || false}
                      onCheckedChange={(checked) => updatePricingPlan(plan.id, 'bestValue', checked)}
                    />
                  </div>

                  <div className="pt-2">
                    <Badge className="bg-terracotta-100 text-terracotta-700">
                      Save ₹{(plan.mrp || 0) - (plan.price || 0)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button 
                onClick={() => saveSettings("Pricing", {
                  product: {
                    ...settings?.product,
                    plans: pricingPlans
                  }
                })}
                className="w-full bg-turmeric-500 hover:bg-turmeric-600 text-white"
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Updating Prices..." : "Update Pricing (Live on Website)"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Testimonials Management Tab */}
      <TabsContent value="testimonials" className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold font-poppins text-sage-700">
            Manage Testimonials & Reviews
          </h3>
          <Button onClick={addTestimonial} className="btn-ayurveda">
            <Plus className="w-4 h-4 mr-2" />
            Add New Testimonial
          </Button>
        </div>

        <div className="space-y-4">
          {testimonials.map((testimonial: any) => (
            <Card key={testimonial.id} className="card-ayurveda">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sage-700">Testimonial #{testimonial.id}</h4>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={testimonial.enabled}
                          onCheckedChange={(checked) => updateTestimonial(testimonial.id, 'enabled', checked)}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sage-700">Customer Name</Label>
                      <Input
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sage-700">Location</Label>
                      <Input
                        value={testimonial.location}
                        onChange={(e) => updateTestimonial(testimonial.id, 'location', e.target.value)}
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sage-700">Rating</Label>
                      <select 
                        value={testimonial.rating}
                        onChange={(e) => updateTestimonial(testimonial.id, 'rating', parseInt(e.target.value))}
                        className="w-full p-2 border border-sage-200 rounded-lg focus:border-sage-400"
                      >
                        {[5, 4, 3, 2, 1].map(rating => (
                          <option key={rating} value={rating}>
                            {rating} Star{rating > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sage-700">Testimonial Text</Label>
                      <Textarea
                        value={testimonial.text}
                        onChange={(e) => updateTestimonial(testimonial.id, 'text', e.target.value)}
                        className="border-sage-200 focus:border-sage-400"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sage-700">Before Weight</Label>
                        <Input
                          value={testimonial.beforeWeight}
                          onChange={(e) => updateTestimonial(testimonial.id, 'beforeWeight', e.target.value)}
                          placeholder="78 kg"
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sage-700">After Weight</Label>
                        <Input
                          value={testimonial.afterWeight}
                          onChange={(e) => updateTestimonial(testimonial.id, 'afterWeight', e.target.value)}
                          placeholder="60 kg"
                          className="border-sage-200 focus:border-sage-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sage-700">Video URL (YouTube/Vimeo)</Label>
                      <Input
                        value={testimonial.video}
                        onChange={(e) => updateTestimonial(testimonial.id, 'video', e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="border-sage-200 focus:border-sage-400"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          onClick={() => saveSettings("Testimonials", {
            testimonials: testimonials
          })}
          className="w-full btn-ayurveda"
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save All Testimonials"}
        </Button>
      </TabsContent>

      {/* Media Management Tab */}
      <TabsContent value="media" className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Hero & Banner Images */}
          <Card className="card-ayurveda">
            <CardHeader>
              <CardTitle className="text-sage-700 font-poppins">Hero & Banner Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Hero Banner Image */}
              <div className="space-y-4">
                <Label className="text-sage-700 font-medium">Hero Banner Image</Label>
                <div className="border-2 border-dashed border-sage-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-sage-400 mx-auto mb-3" />
                  <p className="text-sage-600 mb-3 text-sm">Upload hero banner image (Recommended: 1200x600px)</p>
                  <Button 
                    onClick={async () => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = async (e: any) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await uploadImage(file, 'hero-banner');
                          if (url) {
                            await saveSettings("Hero Image", {
                              homepage: {
                                ...settings?.homepage,
                                heroImage: url
                              }
                            });
                          }
                        }
                      };
                      input.click();
                    }}
                    className="btn-ayurveda"
                  >
                    Choose Hero Banner
                  </Button>
                </div>
              </div>

              {/* Product Main Image */}
              <div className="space-y-4">
                <Label className="text-sage-700 font-medium">Main Product Image</Label>
                <div className="border-2 border-dashed border-sage-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-sage-400 mx-auto mb-3" />
                  <p className="text-sage-600 mb-3 text-sm">Upload main product image (Recommended: 800x800px)</p>
                  <Button 
                    onClick={async () => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = async (e: any) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = await uploadImage(file, 'product-main');
                          if (url) {
                            await saveSettings("Product Image", {
                              product: {
                                ...settings?.product,
                                image: url
                              }
                            });
                          }
                        }
                      };
                      input.click();
                    }}
                    className="btn-ayurveda"
                  >
                    Choose Product Image
                  </Button>
                </div>
              </div>

              {/* Current Images Preview */}
              {(settings?.homepage?.heroImage || settings?.product?.image) && (
                <div className="space-y-4 pt-4 border-t border-sage-200">
                  <h4 className="font-medium text-sage-700">Current Images</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {settings?.homepage?.heroImage && (
                      <div className="space-y-2">
                        <p className="text-xs text-sage-600">Hero Banner</p>
                        <img 
                          src={settings.homepage.heroImage} 
                          alt="Hero Banner" 
                          className="w-full h-20 object-cover rounded border"
                        />
                      </div>
                    )}
                    {settings?.product?.image && (
                      <div className="space-y-2">
                        <p className="text-xs text-sage-600">Product Image</p>
                        <img 
                          src={settings.product.image} 
                          alt="Product" 
                          className="w-full h-20 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Management */}
          <Card className="card-ayurveda">
            <CardHeader>
              <CardTitle className="text-sage-700 font-poppins">Video Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sage-700">Product Demo Video URL</Label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={settings?.product?.video || ""}
                  onChange={(e) => {
                    saveSettings("Product Video", {
                      product: {
                        ...settings?.product,
                        video: e.target.value
                      }
                    });
                  }}
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">Testimonial Video Collection</Label>
                <Button 
                  variant="outline"
                  className="w-full border-sage-300 text-sage-700"
                  onClick={() => {
                    toast({
                      title: "Feature Coming Soon! 🎥",
                      description: "Video testimonial management will be available in the next update",
                    });
                  }}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Manage Video Testimonials
                </Button>
              </div>
              
              <Button 
                onClick={() => {
                  toast({
                    title: "Feature Coming Soon! 🎥",
                    description: "Video testimonial management will be available in the next update",
                  });
                }}
                className="w-full btn-ayurveda"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Video Testimonial
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Enhanced Orders Management Tab */}
      <TabsContent value="orders" className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold font-poppins text-sage-700">
            Order Management ({orders?.length || 0} Total)
          </h3>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-sage-200 rounded-lg text-sm">
              <option value="all">All Orders</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cod">COD Orders</option>
              <option value="online">Online Payments</option>
              <option value="guest">Guest Orders</option>
              <option value="registered">Registered Users</option>
            </select>
            <Button 
              onClick={exportOrders}
              variant="outline"
              className="border-sage-300 text-sage-700 hover:bg-sage-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <Card className="card-ayurveda">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sage-50 border-b border-sage-200">
                  <tr>
                    <th className="text-left p-4 font-medium text-sage-700">Order ID</th>
                    <th className="text-left p-4 font-medium text-sage-700">Customer Details</th>
                    <th className="text-left p-4 font-medium text-sage-700">Plan</th>
                    <th className="text-left p-4 font-medium text-sage-700">Amount</th>
                    <th className="text-left p-4 font-medium text-sage-700">Payment</th>
                    <th className="text-left p-4 font-medium text-sage-700">Status</th>
                    <th className="text-left p-4 font-medium text-sage-700">Date</th>
                    <th className="text-left p-4 font-medium text-sage-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr key={order.id} className="border-b border-sage-100 hover:bg-sage-50">
                      <td className="p-4 font-medium text-sage-700">{order.id}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sage-700">{order.userName}</p>
                          <p className="text-sm text-sage-600">{order.userEmail || 'No email'}</p>
                          <p className="text-sm text-sage-600">{order.userPhone}</p>
                          <div className="flex gap-1 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                order.customerType === 'guest' ? 'border-orange-300 text-orange-700' :
                                order.customerType === 'linked_guest' ? 'border-blue-300 text-blue-700' :
                                'border-green-300 text-green-700'
                              }`}
                            >
                              {order.customerType === 'guest' ? 'Guest' : 
                               order.customerType === 'linked_guest' ? 'Linked' : 'User'}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sage-600">{order.planName}</td>
                      <td className="p-4 font-medium text-sage-700">₹{order.price?.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge 
                          className={`${
                            order.paymentMethod === 'cod' 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge 
                          className={`${
                            order.orderStatus === 'delivered' 
                              ? 'bg-sage-100 text-sage-700' 
                              : order.orderStatus === 'shipped'
                              ? 'bg-turmeric-100 text-turmeric-700'
                              : order.orderStatus === 'confirmed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-terracotta-100 text-terracotta-700'
                          }`}
                        >
                          {order.orderStatus}
                        </Badge>
                      </td>
                      <td className="p-4 text-sage-600">
                        <div>
                          <p>{new Date(order.orderTime).toLocaleDateString()}</p>
                          <p className="text-xs text-sage-500">{new Date(order.orderTime).toLocaleTimeString()}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" title="View Details">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit Order">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {order.shiprocket?.awbCode && (
                            <Button variant="ghost" size="sm" title="Track Shipment">
                              <Package className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-sage-500">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Statistics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-ayurveda">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {orders?.filter(o => o.paymentMethod === 'cod').length || 0}
              </div>
              <p className="text-sm text-sage-600">COD Orders</p>
            </CardContent>
          </Card>
          <Card className="card-ayurveda">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders?.filter(o => o.paymentMethod === 'online').length || 0}
              </div>
              <p className="text-sm text-sage-600">Online Payments</p>
            </CardContent>
          </Card>
          <Card className="card-ayurveda">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders?.filter(o => o.customerType === 'guest').length || 0}
              </div>
              <p className="text-sm text-sage-600">Guest Orders</p>
            </CardContent>
          </Card>
          <Card className="card-ayurveda">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orders?.filter(o => o.customerType === 'linked_guest').length || 0}
              </div>
              <p className="text-sm text-sage-600">Linked Orders</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Users Management Tab */}
      <TabsContent value="users" className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold font-poppins text-sage-700">
            Registered Users ({users?.length || 0})
          </h3>
          <Button 
            onClick={exportUsers}
            variant="outline"
            className="border-sage-300 text-sage-700 hover:bg-sage-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </div>

        <Card className="card-ayurveda">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sage-50 border-b border-sage-200">
                  <tr>
                    <th className="text-left p-4 font-medium text-sage-700">User ID</th>
                    <th className="text-left p-4 font-medium text-sage-700">Name</th>
                    <th className="text-left p-4 font-medium text-sage-700">Contact</th>
                    <th className="text-left p-4 font-medium text-sage-700">Signup Method</th>
                    <th className="text-left p-4 font-medium text-sage-700">Orders</th>
                    <th className="text-left p-4 font-medium text-sage-700">Total Spent</th>
                    <th className="text-left p-4 font-medium text-sage-700">Signup Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-b border-sage-100 hover:bg-sage-50">
                      <td className="p-4 font-medium text-sage-700">#{user.id}</td>
                      <td className="p-4 font-medium text-sage-700">{user.name}</td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-sage-600">{user.email}</p>
                          <p className="text-sm text-sage-600">{user.phone}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-turmeric-100 text-turmeric-700">
                          {user.signupMethod}
                        </Badge>
                      </td>
                      <td className="p-4 text-sage-600">{user.totalOrders}</td>
                      <td className="p-4 font-medium text-sage-700">₹{user.totalSpent}</td>
                      <td className="p-4 text-sage-600">
                        {new Date(user.signupTime).toLocaleDateString()}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-sage-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Integrations Tab */}
      <TabsContent value="integrations" className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Gateways */}
          <Card className="card-ayurveda">
            <CardHeader>
              <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Gateways
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sage-700">PayU Merchant Key</Label>
                <Input
                  type="password"
                  placeholder="Enter PayU Merchant Key"
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">PayU Salt Key</Label>
                <Input
                  type="password"
                  placeholder="Enter PayU Salt Key"
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sage-700">Test Mode</Label>
                <Switch defaultChecked />
              </div>

              <Button className="w-full btn-ayurveda">
                <Save className="w-4 h-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>

          {/* Shipping Integration */}
          <Card className="card-ayurveda">
            <CardHeader>
              <CardTitle className="text-sage-700 font-poppins flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sage-700">Shiprocket Email</Label>
                <Input
                  type="email"
                  placeholder="your@shiprocket-account.com"
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">Shiprocket Password</Label>
                <Input
                  type="password"
                  placeholder="Your Shiprocket password"
                  className="border-sage-200 focus:border-sage-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sage-700">Enable Shiprocket</Label>
                <Switch />
              </div>

              <Button className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Shipping Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
}