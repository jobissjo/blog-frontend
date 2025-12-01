"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      if (slug) {
        try {
          const foundBlog = await blogService.getBlogBySlug(slug);
          if (foundBlog) {
            setBlog(foundBlog);
            const fetchedComments = await commentService.getCommentsByBlogId(
              foundBlog.id
            );
            setComments(fetchedComments);
          }
        } catch (error) {
          console.error("Error loading blog:", error);
        }
      }
    };
    loadBlog();
  }, [slug]);

  const handleLike = async () => {
    if (!blog || liked) return;
    
    try {
      const updated = await blogService.incrementLikes(blog.id);
      if (updated) {
        setBlog(updated);
        setLiked(true);
        toast.success("Thanks for liking this article!");
      }
    } catch (error) {
      console.error("Error liking blog:", error);
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

  const handleAddComment = async (
    username: string,
    commentText: string
  ): Promise<boolean> => {
    if (!blog) return false;

    try {
      const newComment = await commentService.addComment(
        blog.id,
        username,
        commentText
      );
      setComments((prev) => [newComment, ...prev]);
      toast.success("Comment posted successfully!");
      return true;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to post comment. Please try again.");
      return false;
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl text-muted-foreground">Blog post not found</p>
          <Link href="/">
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
        <Link href="/">
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

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12 prose-headings:font-bold prose-a:text-primary prose-code:bg-muted prose-code:text-foreground prose-code:font-medium prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:shadow-sm prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for code blocks
              code: ({ node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const codeClassName = className
                  ? `${className} text-foreground font-mono`
                  : 'text-foreground font-mono';
                return !inline && match ? (
                  <pre className="bg-muted border border-border p-4 rounded-lg overflow-x-auto my-4 shadow-sm">
                    <code className={codeClassName} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code
                    className={`${className ? `${className} ` : ''}bg-muted px-1.5 py-0.5 rounded text-sm text-foreground font-mono border border-border/60 shadow-sm`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // Custom styling for headings
              h1: ({ children }: any) => (
                <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
              ),
              h2: ({ children }: any) => (
                <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
              ),
              h3: ({ children }: any) => (
                <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>
              ),
              // Custom styling for paragraphs
              p: ({ children }: any) => (
                <p className="mb-4 leading-relaxed">{children}</p>
              ),
              // Custom styling for lists
              ul: ({ children }: any) => (
                <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
              ),
              ol: ({ children }: any) => (
                <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
              ),
              // Custom styling for links
              a: ({ href, children }: any) => (
                <a
                  href={href}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              // Custom styling for blockquotes
              blockquote: ({ children }: any) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                  {children}
                </blockquote>
              ),
              // Custom styling for tables
              table: ({ children }: any) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse border border-border">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }: any) => (
                <th className="border border-border px-4 py-2 bg-muted font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }: any) => (
                <td className="border border-border px-4 py-2">
                  {children}
                </td>
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
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
