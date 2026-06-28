"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import { blogService } from "@/services/blogService";
import { authService } from "@/services/authService";
import { Blog } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import GoogleAd from "@/components/GoogleAd";
import { Button } from "@/components/ui/button";
import { BlogCardSkeleton } from "@/components/BlogCardSkeleton";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jotechblog.netlify.app";

const Index = () => {
  const isAdmin = authService.isAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        if (searchQuery) {
          console.log("Searching for blogs with query:", searchQuery);  
          const blogs = await blogService.searchBlogs(searchQuery, false);
          setAllBlogs(blogs);
          setTotal(blogs.length);
          return;
        }

        const { blogs, total } = await blogService.getAllBlogsPaginated({
          skip: (page - 1) * pageSize,
          limit: pageSize,
        });
        setAllBlogs(blogs);
        setTotal(total);
      } catch (error) {
        console.error("Error loading blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, [searchQuery, isAdmin, page]);

  // Add CollectionPage schema
  useEffect(() => {
    if (allBlogs.length > 0) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_URL}#collectionpage`,
        url: SITE_URL,
        name: "JoTechBlog - All Articles",
        description: "Browse all articles on JoTechBlog covering backend engineering, Django, FastAPI, system design, and modern web development.",
        isPartOf: {
          "@type": "Blog",
          "@id": `${SITE_URL}#blog`,
          name: "JoTechBlog"
        },
        hasPart: allBlogs.slice(0, 10).map((blog) => ({
          "@type": "BlogPosting",
          "@id": `${SITE_URL}/blog/${blog.slug}#blogposting`,
          url: `${SITE_URL}/blog/${blog.slug}`,
          headline: blog.title,
          datePublished: blog.created_at,
          dateModified: blog.updated_at,
          author: {
            "@type": "Person",
            "@id": `${SITE_URL}#author`,
            name: blog.user_details?.firstName || "Jobi"
          }
        }))
      };

      // Remove existing schema if any
      const existingSchema = document.getElementById('collectionpage-schema');
      if (existingSchema) {
        existingSchema.remove();
      }

      // Add new schema
      const script = document.createElement('script');
      script.id = 'collectionpage-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        const schemaElement = document.getElementById('collectionpage-schema');
        if (schemaElement) {
          schemaElement.remove();
        }
      };
    }
  }, [allBlogs]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://jotechblog.netlify.app/#website",
        "url": "https://jotechblog.netlify.app",
        "name": "JoTechBlog",
        "alternateName": ["JoTech Blog", "jotechblog"],
        "description": "JoTechBlog by Jobi - Backend engineering, Django, FastAPI, system design, Docker, and modern web development tutorials.",
        "publisher": {
          "@id": "https://jotechblog.netlify.app/#organization"
        },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://jotechblog.netlify.app/?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://jotechblog.netlify.app/#organization",
        "name": "JoTechBlog",
        "url": "https://jotechblog.netlify.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://jotechblog.netlify.app/logo.png",
          "width": 1200,
          "height": 630
        },
        "description": "JoTechBlog - Modern web development insights and tutorials",
        "sameAs": [
          "https://twitter.com/Jobi"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "contact@jotechblog.netlify.app"
        }
      },
      {
        "@type": "Person",
        "@id": "https://jotechblog.netlify.app/#author",
        "name": "Jobi",
        "url": "https://jotechblog.netlify.app",
        "description": "Backend engineer and technical writer specializing in Django, FastAPI, system design, and modern web development",
        "jobTitle": "Backend Engineer",
        "worksFor": {
          "@id": "https://jotechblog.netlify.app/#organization"
        },
        "sameAs": [
          "https://twitter.com/Jobi"
        ]
      },
      {
        "@type": "Blog",
        "@id": "https://jotechblog.netlify.app/#blog",
        "name": "JoTechBlog",
        "url": "https://jotechblog.netlify.app",
        "description": "JoTechBlog by Jobi - Backend engineering, Django, FastAPI, system design, Docker, and modern web development tutorials.",
        "publisher": {
          "@id": "https://jotechblog.netlify.app/#organization"
        },
        "author": {
          "@id": "https://jotechblog.netlify.app/#author"
        },
        "inLanguage": "en-US"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
        {/* Glowing Decorative Backgrounds */}
        <div className="absolute -z-10 top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full blur-[120px] pointer-events-none opacity-80 dark:opacity-60" />
        
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wider uppercase mb-2 backdrop-blur-sm shadow-sm select-none">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Insights & Tutorials
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 pr-4 pb-2 py-1 leading-tight">
            Welcome to JoTechBlog{" "}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Insights and tutorials on modern web development, crafted for developers by developers.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-background/80 backdrop-blur-sm border-border/50 shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
            </div>
          </div>
        </div>



        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {!searchQuery && totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!canPrev}
                >
                  Prev
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page <span className="font-medium text-foreground">{page}</span> of{" "}
                  <span className="font-medium text-foreground">{totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={!canNext}
                >
                  Next
                </Button>
              </div>
            )}

            {allBlogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  {searchQuery ? "No articles found matching your search." : "No articles yet."}
                </p>
              </div>
            )}
          </>
        )}
        <NewsletterSignup variant="hero" />
        {!loading &&
          (<GoogleAd
            adSlot="5428778070"
            className="max-w-4xl mx-auto mb-16"
          />)
        }
      </main>
    </div>
  );
};

export default Index;
