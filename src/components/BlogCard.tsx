import Link from "next/link";
import { Blog } from "@/types/blog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Eye } from "lucide-react";
import { format } from "date-fns";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Link href={`/blog/${blog.slug}`} className="group block h-full">
      <Card className="overflow-hidden h-full border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
        <div className="aspect-video overflow-hidden relative">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
              {blog.title}
            </h3>
            {!blog.published && (
              <Badge variant="secondary" className="shrink-0 font-medium">
                Draft
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-secondary/50 hover:bg-secondary transition-colors font-normal text-xs"
              >
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="secondary" className="bg-secondary/50 font-normal text-xs">
                +{blog.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground pt-0">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{format(new Date(blog.created_at), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            
              <Eye className="h-4 w-4 transition-colors group-hover:text-primary" />
              <span className="text-xs font-medium">{blog.view_count}</span>
            
            <Heart className="h-3.5 w-3.5 transition-colors group-hover:text-red-500" />
            <span className="text-xs font-medium">{blog.likes}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
