"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { seriesService } from "@/services/seriesService";
import { Series } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers, ArrowRight, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SeriesList = () => {
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const series = await seriesService.getAllSeries();
        setAllSeries(series);
      } catch (error) {
        console.error("Error loading series:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSeries();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-6xl relative overflow-hidden">
        {/* Ambient Gradient Background */}
        <div className="absolute -z-10 top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-primary/15 via-purple-500/10 to-accent/15 rounded-full blur-[130px] pointer-events-none" />

        {/* Hero Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-xs select-none">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Learning Paths</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Comprehensive Blog Series
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Step-by-step technical guides and multi-part tutorials organized by core topics.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-full border-border/70 bg-card/60 p-6">
                <CardHeader className="p-0 mb-4">
                  <Skeleton className="h-7 w-3/4 mb-2" />
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="pt-2 flex justify-between">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {allSeries.map((series) => {
              const articleCount = series.blogs?.length || 0;
              return (
                <Link key={series._id || series.id} href={`/series/${series.slug}`} className="group block h-full">
                  <Card className="h-full border-border/70 bg-card/60 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 flex flex-col justify-between">
                    <div>
                      <CardHeader className="p-0 pb-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold shadow-xs">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 font-medium text-xs px-2.5 py-1">
                            {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                          </Badge>
                        </div>

                        <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                          {series.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-0">
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {series.description}
                        </p>
                      </CardContent>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                      <span>Explore Series</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && allSeries.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/40 max-w-xl mx-auto">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
            <p className="text-lg font-medium text-muted-foreground">No series available yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Check back soon for new multi-part tutorials.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SeriesList;
