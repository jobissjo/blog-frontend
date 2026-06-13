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

export const metadata: Metadata = {
  metadataBase: new URL("https://jotechblog.netlify.app"),
  other: {
    "google-adsense-account": "ca-pub-3741756679011128",
  },
   alternates: {
    canonical: "https://jotechblog.netlify.app",
  },

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
    "Backend engineering blog",
    "Web development tutorials",
    "Python programming",
    "API development",
    "Microservices architecture"
  ],
  openGraph: {
    title: "JoTechBlog - Modern Web Development Insights",
    description: "This is a blog for modern web development insights and modern web development practices",
    type: "website",
    siteName: "JoTechBlog",
    locale: "en_US",
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
    creator: "@Jobi",
    images: ["https://jotechblog.netlify.app/logo.png"],
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
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://jotechblog.netlify.app/#website",
        url: "https://jotechblog.netlify.app",
        name: "JoTechBlog",
        description: "JoTechBlog by Jobi - Backend engineering, Django, FastAPI, system design, Docker, and modern web development tutorials.",
        publisher: {
          "@id": "https://jotechblog.netlify.app/#organization"
        },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://jotechblog.netlify.app/?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://jotechblog.netlify.app/#organization",
        name: "JoTechBlog",
        url: "https://jotechblog.netlify.app",
        logo: {
          "@type": "ImageObject",
          url: "https://jotechblog.netlify.app/logo.png",
          width: 1200,
          height: 630
        },
        description: "JoTechBlog - Modern web development insights and tutorials",
        sameAs: [
          "https://twitter.com/Jobi"
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "contact@jotechblog.netlify.app"
        }
      },
      {
        "@type": "Person",
        "@id": "https://jotechblog.netlify.app/#author",
        name: "Jobi",
        url: "https://jotechblog.netlify.app",
        description: "Backend engineer and technical writer specializing in Django, FastAPI, system design, and modern web development",
        jobTitle: "Backend Engineer",
        worksFor: {
          "@id": "https://jotechblog.netlify.app/#organization"
        },
        sameAs: [
          "https://twitter.com/Jobi"
        ]
      },
      {
        "@type": "Blog",
        "@id": "https://jotechblog.netlify.app/#blog",
        name: "JoTechBlog",
        url: "https://jotechblog.netlify.app",
        description: "JoTechBlog by Jobi - Backend engineering, Django, FastAPI, system design, Docker, and modern web development tutorials.",
        publisher: {
          "@id": "https://jotechblog.netlify.app/#organization"
        },
        author: {
          "@id": "https://jotechblog.netlify.app/#author"
        },
        inLanguage: "en-US"
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3741756679011128"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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
