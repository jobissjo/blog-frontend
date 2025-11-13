import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CommentSection from "@/components/CommentSection";
import { blogService } from "@/services/blogService";
import { commentService } from "@/services/commentService";
import { Blog, Comment } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Share2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      const foundBlog = blogService.getBlogBySlug(slug);
      if (foundBlog) {
        setBlog(foundBlog);
        setComments(commentService.getCommentsByBlogId(foundBlog.id));
      }
    }
  }, [slug]);

  const handleLike = () => {
    if (!blog || liked) return;
    
    const updated = blogService.incrementLikes(blog.id);
    if (updated) {
      setBlog(updated);
      setLiked(true);
      toast.success("Thanks for liking this article!");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: blog?.title,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleAddComment = (username: string, commentText: string) => {
    if (!blog) return;
    
    const newComment = commentService.addComment(blog.id, username, commentText);
    setComments([newComment, ...comments]);
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl text-muted-foreground">Blog post not found</p>
          <Link to="/">
            <Button className="mt-4">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to articles
          </Button>
        </Link>

        <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {blog.title}
        </h1>

        <div className="flex items-center justify-between mb-8 pb-8 border-b">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(blog.created_at), "MMMM d, yyyy")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              disabled={liked}
              className={liked ? "bg-destructive/10" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
              {blog.likes}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          {blog.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>;
            } else if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>;
            } else if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{paragraph.slice(4)}</h3>;
            } else if (paragraph.startsWith('```')) {
              return null; // Skip code block markers for simplicity
            } else if (paragraph.trim()) {
              return <p key={index} className="mb-4 text-foreground leading-relaxed">{paragraph}</p>;
            }
            return null;
          })}
        </div>

        <CommentSection
          blogId={blog.id}
          comments={comments}
          onAddComment={handleAddComment}
        />
      </article>
    </div>
  );
};

export default BlogDetail;
