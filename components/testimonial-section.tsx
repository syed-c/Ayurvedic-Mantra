"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Play, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export function TestimonialSection() {
  console.log("Testimonial Section rendered");
  const { settings } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = (settings?.homepage?.testimonialsSection?.items && settings.homepage.testimonialsSection.items.length > 0)
    ? settings.homepage.testimonialsSection.items
    : [
    {
      id: 1,
      name: "Priya Sharma",
      age: 32,
      location: "Mumbai",
      rating: 5,
      text: "I lost 18 kg in 3 months! This is the only product that actually worked for me. No side effects, just pure natural goodness.",
      beforeWeight: "78 kg",
      afterWeight: "60 kg",
      videoUrl: "https://example.com/video1",
      image: "👩‍🦱"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      age: 28,
      location: "Delhi",
      rating: 5,
      text: "Amazing results! My energy levels are through the roof and I've lost 22 kg. My wife is amazed by the transformation.",
      beforeWeight: "95 kg",
      afterWeight: "73 kg",
      videoUrl: "https://example.com/video2",
      image: "👨‍💼"
    },
    {
      id: 3,
      name: "Anita Patel",
      age: 45,
      location: "Ahmedabad",
      rating: 5,
      text: "Post-pregnancy weight loss was my biggest challenge. This product helped me get back to my pre-pregnancy weight naturally!",
      beforeWeight: "85 kg",
      afterWeight: "65 kg",
      videoUrl: "https://example.com/video3",
      image: "👩‍💻"
    },
    {
      id: 4,
      name: "Vikram Singh",
      age: 35,
      location: "Jaipur",
      rating: 5,
      text: "Being a foodie, I never thought I could lose weight. But this Ayurvedic formula helped me shed 15 kg without giving up my favorite foods!",
      beforeWeight: "88 kg",
      afterWeight: "73 kg",
      videoUrl: "https://example.com/video4",
      image: "👨‍🍳"
    }
  ];

  const nextSlide = () => {
    console.log("Next testimonial slide");
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    console.log("Previous testimonial slide");
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const playVideo = (videoUrl: string, name: string) => {
    console.log(`Playing video for ${name}: ${videoUrl}`);
    // In a real implementation, this would open a video modal or redirect to the video
    alert(`Playing ${name}'s success story video`);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-turmeric-100 text-turmeric-700 hover:bg-turmeric-200 px-4 py-2 text-sm font-medium">
            🎥 Success Stories
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-sage-700">
            {settings?.homepage?.testimonialsSection?.title || (
              <>Real People,<span className="text-gradient-ayurveda"> Real Results</span></>
            )}
          </h2>
          
          <p className="text-lg text-sage-600 max-w-2xl mx-auto leading-relaxed">
            {settings?.homepage?.testimonialsSection?.description || (
              <>Don't just take our word for it. Watch real transformation stories from thousands of satisfied customers across India.</>
            )}
          </p>
        </div>

        {/* Video Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <Card className="bg-gradient-to-br from-sage-50 to-cream-50 border-sage-200 shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                
                {/* Video Thumbnail */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-sage-200 to-terracotta-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">
                        {testimonials[currentSlide].image}
                      </div>
                      <Button
                        onClick={() => playVideo((testimonials as any)[currentSlide].video || (testimonials as any)[currentSlide].videoUrl, (testimonials as any)[currentSlide].name)}
                        className="bg-white/90 hover:bg-white text-sage-700 rounded-full w-16 h-16 p-0 shadow-lg"
                      >
                        <Play className="w-6 h-6 ml-1" />
                      </Button>
                    </div>
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium">
                        Watch Success Story
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="space-y-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-turmeric-400 text-turmeric-400" />
                    ))}
                  </div>

                  <div className="relative">
                    <Quote className="w-8 h-8 text-sage-300 absolute -top-2 -left-2" />
                    <p className="text-lg text-sage-700 leading-relaxed pl-6">
                      {testimonials[currentSlide].text}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xl font-semibold text-sage-700 font-poppins">
                      {testimonials[currentSlide].name}
                    </h4>
                    <p className="text-sage-600">
                      Age {testimonials[currentSlide].age} • {testimonials[currentSlide].location}
                    </p>
                    
                    <div className="flex gap-4 text-sm">
                      <Badge variant="outline" className="border-terracotta-300 text-terracotta-700">
                        Before: {testimonials[currentSlide].beforeWeight}
                      </Badge>
                      <Badge className="bg-sage-100 text-sage-700">
                        After: {testimonials[currentSlide].afterWeight}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            onClick={prevSlide}
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white border-sage-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={nextSlide}
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white border-sage-200"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-sage-500' : 'bg-sage-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Text Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial: any, index: number) => (
            <Card key={testimonial.id} className="card-ayurveda">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-turmeric-400 text-turmeric-400" />
                  ))}
                </div>
                
                <p className="text-sage-600 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="pt-4 border-t border-sage-100">
                  <h4 className="font-semibold text-sage-700">{testimonial.name}</h4>
                  <p className="text-sm text-sage-500">
                    {testimonial.location} • Lost {parseInt(testimonial.beforeWeight) - parseInt(testimonial.afterWeight)} kg
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-sage-600 mb-6">
            Join thousands of satisfied customers who have transformed their lives
          </p>
          <Button 
            className="btn-ayurveda text-lg px-8 py-4 h-auto"
            onClick={() => {
              console.log("Scrolling to pricing from testimonials");
              document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Your Transformation
          </Button>
        </div>
      </div>
    </section>
  );
}