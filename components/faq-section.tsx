"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";

export function FAQSection() {
  console.log("FAQ Section rendered");
  const { settings } = useApp();

  const faqs = (settings?.homepage?.faqSection?.faqs && settings.homepage.faqSection.faqs.length > 0)
    ? settings.homepage.faqSection.faqs
    : [
    {
      question: "Is Ayurvedic Mantra safe to use?",
      answer: "Yes, absolutely. Our formula is 100% natural and made from pure Ayurvedic herbs that have been used safely for centuries. All ingredients are FDA approved and the product is manufactured in GMP certified facilities. We have zero reports of serious side effects from thousands of customers."
    },
    {
      question: "How quickly will I see results?",
      answer: "Most customers start noticing initial changes within 7-10 days, including increased energy and better digestion. Significant weight loss typically begins in the 2nd week, with visible transformation by the end of the first month. For best results, we recommend the 3-month plan."
    },
    {
      question: "What ingredients are in Ayurvedic Mantra?",
      answer: "Our proprietary blend includes time-tested Ayurvedic herbs like Garcinia Cambogia, Green Coffee Bean extract, Guggul, Triphala, Methi seeds, and Curry leaves. Each ingredient is carefully selected for its fat-burning and metabolism-boosting properties. Full ingredient list is provided with each bottle."
    },
    {
      question: "Do I need to follow a strict diet?",
      answer: "No strict dieting required! While we provide nutritional guidelines to enhance results, our formula is designed to work with your regular eating habits. Simply avoid excessive junk food and stay hydrated. Many customers achieve great results without major dietary changes."
    },
    {
      question: "Are there any side effects?",
      answer: "Ayurvedic Mantra is formulated to be gentle on your system. Some customers may experience mild digestive adjustment in the first few days as your body adapts to the herbs. This is normal and typically resolves quickly. If you have any medical conditions, consult your doctor before use."
    },
    {
      question: "How do I take Ayurvedic Mantra?",
      answer: "Take 2 capsules daily - one in the morning 30 minutes before breakfast and one in the evening 30 minutes before dinner with lukewarm water. For best results, maintain consistent timing and stay hydrated throughout the day."
    },
    {
      question: "What if it doesn't work for me?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied with your results within 30 days, simply contact our customer support team and we'll process a full refund. We're confident in our product and want you to be completely satisfied."
    },
    {
      question: "How long does shipping take?",
      answer: "We ship within 24 hours of order confirmation. Delivery typically takes 3-5 business days within India through our trusted courier partners. All orders come with tracking information. International shipping is available and takes 7-14 days."
    },
    {
      question: "Can I take it with other medications?",
      answer: "While our product is natural, we recommend consulting with your healthcare provider before combining it with any prescription medications. This ensures there are no interactions and that it's appropriate for your specific health situation."
    },
    {
      question: "What makes this different from other weight loss products?",
      answer: "Unlike synthetic supplements, Ayurvedic Mantra uses ancient wisdom backed by modern science. Our formula targets root causes of weight gain, not just symptoms. It's manufactured in GMP certified facilities, has thousands of success stories, and comes with expert support throughout your journey."
    }
  ];

  return (
    <section className="py-20 bg-cream-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-sage-100 text-sage-700 hover:bg-sage-200 px-4 py-2 text-sm font-medium">
            ❓ Got Questions?
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-sage-700">
            {settings?.homepage?.faqSection?.title || (
              <>Frequently Asked<span className="text-gradient-ayurveda"> Questions</span></>
            )}
          </h2>
          
          <p className="text-lg text-sage-600 max-w-2xl mx-auto leading-relaxed">
            {settings?.homepage?.faqSection?.description || (
              <>Find answers to common questions about Ayurvedic Mantra. Still have questions? Contact our support team anytime.</>
            )}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq: any, index: number) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-2xl border border-sage-200 px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-poppins font-medium text-sage-700 hover:text-sage-800 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sage-600 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-16 space-y-4">
          <h3 className="text-xl font-semibold text-sage-700 font-poppins">
            Still have questions?
          </h3>
          <p className="text-sage-600">
            Our customer support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-sage-600">
              <span className="font-medium">📧 Email:</span>
              <a href="mailto:orders@ayurvedicmantra.com" className="text-sage-700 hover:text-sage-800">
                orders@ayurvedicmantra.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-sage-600">
              <span className="font-medium">📱 WhatsApp:</span>
              <a href="https://wa.me/919897990779" className="text-sage-700 hover:text-sage-800">
                +919897990779
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}