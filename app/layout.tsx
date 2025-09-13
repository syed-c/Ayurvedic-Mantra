import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "Ayurvedic Mantra - Natural Weight Loss Solution",
  description: "Transform your body naturally with our premium Ayurvedic weight loss medicine. 100% natural, clinically tested, and trusted by thousands.",
  keywords: "ayurvedic medicine, weight loss, natural supplements, herbal medicine, fat burn",
  openGraph: {
    title: "Ayurvedic Mantra - Natural Weight Loss Solution",
    description: "Transform your body naturally with our premium Ayurvedic weight loss medicine.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className="antialiased">
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </body>
    </html>
  );
}