"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import { blogService } from "@/services/blogService";
import { authService } from "@/services/authService";
import { Blog } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronLeft, ChevronRight, Sparkles, Filter } from "lucide-react";
import GoogleAd from "@/components/GoogleAd";
import { Button } from "@/components/ui/button";
import { BlogCardSkeleton } from "@/components/BlogCardSkeleton";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jotechblog.netlify.app";
const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

const POPULAR_TAGS = ["All", "Backend", "FastAPI", "Django", "System Design", "Docker", "Python"];

const HomeContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = authService.isAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  const pageParam = searchParams.get("page");
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) {
      params.set("page", newPage.toString());
    } else {
      params.delete("page");
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (searchParams.get("page")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    if (tag === "All") {
      handleSearchChange("");
    } else {
      handleSearchChange(tag);
    }
  };

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        if (searchQuery) {
          const blogs = await blogService.searchBlogs(searchQuery, false);
          setAllBlogs(blogs);
          setTotal(blogs.length);
          return;
        }

        const isHomePage1 = page === 1;
        const limit = isHomePage1 ? 13 : 12;
        const skip = page === 1 ? 0 : 13 + (page - 2) * 12;

        const { blogs, total } = await blogService.getAllBlogsPaginated({
          skip,
          limit,
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

  useEffect(() => {
    if (allBlogs.length > 0) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_URL}#collectionpage`,
        url: SITE_URL,
        name: "JoTechBlog - Technical Articles & Tutorials",
        description: "Browse articles on JoTechBlog covering backend engineering, FastAPI, Django, system design, and modern web architecture.",
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

      const existingSchema = document.getElementById('collectionpage-schema');
      if (existingSchema) existingSchema.remove();

      const script = document.createElement('script');
      script.id = 'collectionpage-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        const schemaElement = document.getElementById('collectionpage-schema');
        if (schemaElement) schemaElement.remove();
      };
    }
  }, [allBlogs]);

  const totalPages = searchQuery
    ? Math.max(1, Math.ceil(total / 12))
    : total <= 13
    ? 1
    : 1 + Math.ceil((total - 13) / 12);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const featuredBlog = !searchQuery && page === 1 && allBlogs.length > 0 ? allBlogs[0] : null;
  const gridBlogs = featuredBlog ? allBlogs.slice(1) : allBlogs;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-7xl relative overflow-hidden">
        {/* Glowing Ambient Background */}
        <div className="absolute -z-10 top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-primary/15 via-purple-500/10 to-accent/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-xs select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Technical Publishing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            Engineering & Web Architecture{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-purple-500">
              Insights
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            Deep-dive tutorials, system design patterns, and practical guides on backend engineering & modern stack development.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative flex items-center bg-card/80 backdrop-blur-md border border-border/80 rounded-2xl shadow-md">
                <Search className="absolute left-4 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search articles by keyword, topic, or tag..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 pr-10 py-6 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Tag Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium mr-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedTag === tag
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post Card (If available on home page 1) */}
        {!loading && featuredBlog && (
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Featured Article</span>
            </div>
            <BlogCard blog={featuredBlog} featured={true} />
          </section>
        )}

        {/* All Articles Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Articles"}
            </h2>
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {total} {total === 1 ? "article" : "articles"}
            </span>
          </div>

          {/* Loading Skeletons */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : gridBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/40">
              <p className="text-lg font-medium text-muted-foreground">
                No articles match your search query.
              </p>
              <Button
                variant="outline"
                onClick={() => handleSearchChange("")}
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* Google Ads Container */}
          <GoogleAd adSlot="5428778070" className="my-10" />

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={!canPrev}
                className="gap-1 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-xs font-semibold text-muted-foreground px-3 py-1.5 rounded-lg bg-card border border-border">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={!canNext}
                className="gap-1 rounded-xl"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </section>
      </main>

      <NewsletterSignup />
    </div>
  );
};

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-16 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
