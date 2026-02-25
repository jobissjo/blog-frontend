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
  metadataBase: new URL("https://jotechblog.netlify.app"),

  title: {
    default: "JoTechBlog | Backend, System Design & Web Development",
    template: "%s | JoTechBlog",
  },
  description: "JoTechBlog by Jobi - Backend engineering, Django, FastAPI, system design, Docker, and modern web development tutorials.",
  keywords: [
    "Jo Tech Blog",
    "JoTechBlog",
    "Jobi blog",
    "Django tutorials",
    "FastAPI guide",
    "System design blog",
    "Backend engineering blog"
  ],
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
  verification: {
    google: '7Rw7vkxzDWmXtWnOltkIiLz9ACsX5fm4bCCZDVLGC1c'
  },
  twitter: {
    card: "summary_large_image",
    site: "@Jobi",
    images: ["https://jotechblog.netlify.app/logo.png"],
  },
  authors: [{ name: "Jobi" }],
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "JoTechBlog",
    url: "https://jotechblog.netlify.app",
    author: {
      "@type": "Person",
      name: "Jobi",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
