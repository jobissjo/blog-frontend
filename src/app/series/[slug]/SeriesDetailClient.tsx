"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import { seriesService } from "@/services/seriesService";
import { Series } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Layers, ChevronRight, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getReadingTime } from "@/lib/readingTime";

interface SeriesDetailProps {
  slug: string;
}

const SeriesDetail = ({ slug }: SeriesDetailProps) => {
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeries = async () => {
      if (slug) {
        try {
          const data = await seriesService.getSeriesBySlug(slug);
          setSeries(data);
        } catch (error) {
          console.error("Error loading series:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadSeries();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <Skeleton className="h-10 w-32 mb-8 rounded-xl" />
          <Skeleton className="h-12 w-3/4 mb-4 rounded-xl" />
          <Skeleton className="h-6 w-1/2 mb-12 rounded-xl" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center max-w-lg">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Series Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested tutorial series could not be found.</p>
          <Link href="/series">
            <Button className="rounded-xl font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Series
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const totalArticles = series.blogs?.length || 0;
  const totalReadTime = series.blogs?.reduce(
    (acc, blog) => acc + getReadingTime(blog.content),
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl relative overflow-hidden">
        {/* Glowing Background Accent */}
        <div className="absolute -z-10 top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-primary/15 via-purple-500/10 to-accent/15 rounded-full blur-[130px] pointer-events-none" />

        {/* Back Link Navigation */}
        <div className="mb-8">
          <Link href="/series">
            <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all series</span>
            </Button>
          </Link>
        </div>

        {/* Hero Series Banner Card */}
        <div className="mb-12 p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 font-semibold px-3 py-1 text-xs">
              <Layers className="w-3.5 h-3.5 mr-1 inline" />
              Series Guide
            </Badge>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              {totalArticles} {totalArticles === 1 ? "article" : "articles"}
            </span>
            {totalReadTime > 0 && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  ~{totalReadTime} min total read
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {series.title}
          </h1>

          {series.description && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {series.description}
            </p>
          )}
        </div>

        {/* Learning Path Article Timeline */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 font-bold text-lg text-foreground border-b border-border/60">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>Course Articles</span>
          </div>

          {series.blogs && series.blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {series.blogs.map((blog, index) => (
                <div key={blog.id} className="relative group">
                  {/* Step Number Badge */}
                  <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
                    Part {index + 1}
                  </div>
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/40">
              <p className="text-base text-muted-foreground">
                No articles in this series yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SeriesDetail;
