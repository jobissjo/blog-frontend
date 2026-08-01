import Link from "next/link";
import { Blog } from "@/types/blog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Eye, Clock, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { getBlogExcerpt } from "@/lib/blogExcerpt";
import { getReadingTime } from "@/lib/readingTime";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

const BlogCard = ({ blog, featured = false }: BlogCardProps) => {
  const excerpt = getBlogExcerpt(blog.content, featured ? 200 : 120);
  const readingTime = getReadingTime(blog.content);

  const formattedDate = blog.created_at
    ? format(new Date(blog.created_at), "MMM d, yyyy")
    : null;

  return (
    <Link href={`/blog/${blog.slug}`} className="group block h-full">
      <Card
        className={`overflow-hidden h-full border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 flex flex-col justify-between ${
          featured ? "md:grid md:grid-cols-12 md:gap-6 md:items-center" : ""
        }`}
      >
        {/* Image Container */}
        <div
          className={`aspect-video overflow-hidden relative bg-muted/40 ${
            featured ? "md:col-span-6 md:h-full md:aspect-auto" : ""
          }`}
        >
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-card to-accent/10 flex items-center justify-center text-muted-foreground text-sm font-medium">
              JoTechBlog
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

          {/* Reading time overlay pill */}
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-200 text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Clock className="w-3 h-3 text-primary" />
            <span>{readingTime} min read</span>
          </div>

          {!blog.published && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="font-semibold text-xs shadow-md">
                Draft
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content wrapper */}
        <div className={`flex flex-col justify-between flex-1 ${featured ? "md:col-span-6 md:p-6" : ""}`}>
          <div>
            <CardHeader className="pb-3 pt-5 px-5">
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="inline-block px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground">
                      +{blog.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Title */}
              <h3
                className={`font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors flex items-start justify-between gap-2 ${
                  featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl line-clamp-2"
                }`}
              >
                <span>{blog.title}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-primary" />
              </h3>

              {/* Excerpt */}
              {excerpt && (
                <p
                  className={`mt-2.5 text-muted-foreground leading-relaxed ${
                    featured ? "text-base line-clamp-3" : "text-sm line-clamp-2 md:line-clamp-3"
                  }`}
                >
                  {excerpt}
                </p>
              )}
            </CardHeader>
          </div>

          {/* Footer Metadata */}
          <CardFooter className="flex items-center justify-between text-xs text-muted-foreground pt-0 px-5 pb-5 mt-4 border-t border-border/40 pt-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>{formattedDate || "Recent"}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>{blog.view_count || 0}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                <Heart className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-rose-500 transition-colors" />
                <span>{blog.likes || 0}</span>
              </div>
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
