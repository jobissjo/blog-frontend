import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css"; // recommended location
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import VisitorInitializer from "@/components/VisitorInitializer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://blog.jotech.in").replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  other: {
    "google-adsense-account": "ca-pub-3741756679011128",
  },
  alternates: {
    canonical: SITE_URL,
  },

  title: {
    default: "JoTech Blog | Tech Blog by Jobi — Backend & System Design",
    template: "%s | JoTech Blog",
  },
  description: "JoTech Blog (blog.jotech.in) by Jobi — Practical guides and deep dives on Django, FastAPI, System Design, Docker, and modern full-stack development.",
  keywords: [
    "blog jotech",
    "jotech blog",
    "jotech",
    "blog.jotech.in",
    "jotech.in",
    "Jo Tech Blog",
    "JoTechBlog",
    "Jobi blog",
    "jo tech",
    "jobi jotech",
    "Django tutorials",
    "FastAPI guide",
    "System design blog",
    "Backend engineering blog",
    "Web development tutorials",
    "Python programming",
    "API development",
    "Microservices architecture"
  ],
  openGraph: {
    title: "JoTech Blog — Backend, System Design & Web Development Insights",
    description: "JoTech Blog (blog.jotech.in) by Jobi — High-performance backend engineering, Django, FastAPI, System Design, and modern web development tutorials.",
    url: SITE_URL,
    type: "website",
    siteName: "JoTech Blog",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "JoTech Blog logo",
      },
    ],
  },
  verification: {
    google: '7Rw7vkxzDWmXtWnOltkIiLz9ACsX5fm4bCCZDVLGC1c'
  },
  twitter: {
    card: "summary_large_image",
    title: "JoTech Blog | Backend, System Design & Web Development",
    description: "JoTech Blog (blog.jotech.in) by Jobi — Deep dives on FastAPI, Django, System Design, and modern web architecture.",
    site: "@Jobi",
    creator: "@Jobi",
    images: [`${SITE_URL}/logo.png`],
  },
  authors: [{ name: "Jobi" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "Technology",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "JoTech Blog",
      "alternateName": [
        "Blog JoTech",
        "JoTechBlog",
        "JoTech",
        "jotech.in blog",
        "jotech blog"
      ],
      "description": "JoTech Blog by Jobi — Backend engineering, Django, FastAPI, System Design, and modern web development tutorials.",
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "en-US"
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "JoTech Blog",
      "alternateName": [
        "Blog JoTech",
        "JoTechBlog",
        "JoTech",
        "jotech.in"
      ],
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        "url": `${SITE_URL}/logo.png`,
        "contentUrl": `${SITE_URL}/logo.png`,
        "caption": "JoTech Blog Logo"
      },
      "image": {
        "@id": `${SITE_URL}/#logo`
      }
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3741756679011128"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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
