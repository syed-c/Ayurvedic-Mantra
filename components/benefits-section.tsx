"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Heart, Zap, Leaf, Shield, Clock } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export function BenefitsSection() {
  console.log("Benefits Section rendered");
  const { settings } = useApp();

  const dynamicBoxes = settings?.homepage?.benefitsSection?.infoBoxes;
  const benefits = Array.isArray(dynamicBoxes) && dynamicBoxes.length > 0
    ? dynamicBoxes.map((b: any, idx: number) => ({
        icon: [<Flame className="w-8 h-8" />, <Heart className="w-8 h-8" />, <Zap className="w-8 h-8" />, <Leaf className="w-8 h-8" />, <Shield className="w-8 h-8" />, <Clock className="w-8 h-8" />][idx % 6],
        title: b.title,
        description: b.description,
        color: ["terracotta","sage","turmeric","sage","terracotta","turmeric"][idx % 6]
      }))
    : [
      {
        icon: <Flame className="w-8 h-8" />,
        title: "Burns Fat Naturally",
        description: "Accelerates metabolism and targets stubborn fat deposits using ancient Ayurvedic herbs.",
        color: "terracotta"
      },
      {
        icon: <Heart className="w-8 h-8" />,
        title: "No Side Effects",
        description: "100% natural ingredients with zero harmful chemicals or synthetic compounds.",
        color: "sage"
      },
      {
        icon: <Zap className="w-8 h-8" />,
        title: "Boosts Energy",
        description: "Increases vitality and stamina while supporting your weight loss journey.",
        color: "turmeric"
      },
      {
        icon: <Leaf className="w-8 h-8" />,
        title: "Detoxifies Body",
        description: "Cleanses toxins and improves digestive health for better nutrient absorption.",
        color: "sage"
      },
      {
        icon: <Shield className="w-8 h-8" />,
        title: "Clinically Tested",
        description: "Scientifically proven formula backed by modern research and traditional wisdom.",
        color: "terracotta"
      },
      {
        icon: <Clock className="w-8 h-8" />,
        title: "Long-lasting Results",
        description: "Sustainable weight management that helps maintain your ideal body weight.",
        color: "turmeric"
      }
    ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'terracotta':
        return {
          iconBg: 'bg-terracotta-100',
          iconColor: 'text-terracotta-600',
          border: 'border-terracotta-200'
        };
      case 'turmeric':
        return {
          iconBg: 'bg-turmeric-100',
          iconColor: 'text-turmeric-600',
          border: 'border-turmeric-200'
        };
      default:
        return {
          iconBg: 'bg-sage-100',
          iconColor: 'text-sage-600',
          border: 'border-sage-200'
        };
    }
  };

  return (
    <section className="py-20 bg-cream-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-sage-100 text-sage-700 hover:bg-sage-200 px-4 py-2 text-sm font-medium">
            🌿 Natural Benefits
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-sage-700">
            {settings?.homepage?.benefitsSection?.title || (
              <>
                Why Choose 
                <span className="text-gradient-ayurveda"> Ayurvedic Mantra</span>?
              </>
            )}
          </h2>
          
          <p className="text-lg text-sage-600 max-w-2xl mx-auto leading-relaxed">
            {settings?.homepage?.benefitsSection?.description || (
              <>Experience the power of ancient Ayurvedic wisdom combined with modern science for sustainable and healthy weight loss.</>
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const colorClasses = getColorClasses(benefit.color);
            
            return (
              <Card 
                key={index} 
                className={`card-ayurveda group hover:${colorClasses.border} transition-all duration-300`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className={`w-16 h-16 ${colorClasses.iconBg} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <div className={colorClasses.iconColor}>
                      {benefit.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold font-poppins text-sage-700">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-sage-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl md:text-4xl font-bold text-terracotta-500">15,000+</h3>
            <p className="text-sage-600 font-medium">Happy Customers</p>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-3xl md:text-4xl font-bold text-sage-600">94%</h3>
            <p className="text-sage-600 font-medium">Success Rate</p>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-3xl md:text-4xl font-bold text-turmeric-500">30 Days</h3>
            <p className="text-sage-600 font-medium">Visible Results</p>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-3xl md:text-4xl font-bold text-terracotta-500">0</h3>
            <p className="text-sage-600 font-medium">Side Effects</p>
          </div>
        </div>
      </div>
    </section>
  );
}