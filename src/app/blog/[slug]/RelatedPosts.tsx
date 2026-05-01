"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  created_at: string;
  read_time?: number;
  series_id?: string;
  series_title?: string;
}

interface RelatedPostsProps {
  currentBlogId: string;
  currentBlogTitle: string;
  seriesId?: string;
}

export default function RelatedPosts({ currentBlogId, currentBlogTitle, seriesId }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // Fetch posts from the same series first, then fallback to recent posts
        let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog?limit=6`;
        
        if (seriesId) {
          // Try to get posts from the same series
          const seriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/series/${seriesId}/blogs`);
          if (seriesRes.ok) {
            const seriesData = await seriesRes.json();
            const seriesPosts = seriesData.data
              .filter((blog: Blog) => blog.id !== currentBlogId)
              .slice(0, 3);
            setRelatedPosts(seriesPosts);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to recent posts
        const res = await fetch(url);
        const data = await res.json();
        const recentPosts = data.data.data
          .filter((blog: Blog) => blog.id !== currentBlogId)
          .slice(0, 3);
        
        setRelatedPosts(recentPosts);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentBlogId, seriesId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded mb-6"></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Related Posts</h2>
        <p className="text-muted-foreground">
          Discover more articles similar to "{currentBlogTitle}"
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Calendar className="h-3 w-3" />
                <time dateTime={post.created_at}>
                  {format(new Date(post.created_at), "MMM d, yyyy")}
                </time>
                {post.read_time && (
                  <>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{post.read_time} min read</span>
                  </>
                )}
              </div>
              
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                {post.series_title && (
                  <Badge variant="secondary" className="text-xs">
                    {post.series_title}
                  </Badge>
                )}
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Read more
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
