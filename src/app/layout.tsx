import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css"; // recommended location
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import VisitorInitializer from "@/components/VisitorInitializer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "JoTechBlog - Modern Web Development Insights",
  description: "This is a blog for modern web development insights and modern web development practices",
  openGraph: {
    title: "JoTechBlog - Modern Web Development Insights",
    description: "This is a blog for modern web development insights and modern web development practices",
    type: "website",
    images: [
      {
        url: "https://jotechblog.netlify.app/logo.png",
        width: 1200,
        height: 630,
        alt: "JoTechBlog logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Jobi",
    images: ["https://jotechblog.netlify.app/logo.png"],
  },
  authors: [{ name: "Jobi" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider disableTransitionOnChange   >
          <Toaster />
          <Sonner />
          <VisitorInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
