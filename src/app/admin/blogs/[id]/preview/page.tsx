"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
// import { useParams, useNavigate, Link,  } from "react-router-dom";
import Header from "@/components/Header";
import { blogService } from "@/services/blogService";
import { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { toast } from "sonner";

const BlogPreview = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const mode = searchParams.get("mode");
  const isPreviewMode = mode === "create" || mode === "edit";

  useEffect(() => {
    const loadBlog = async () => {
      debugger
      // Check if this is a preview from form (unsaved data)
      // if (isPreviewMode) {
      //   const previewData = localStorage.getItem("blog_preview");
      //   if (previewData) {
      //     try {
      //       const data = JSON.parse(previewData);
      //       const previewBlog: Blog = {
      //         id: id || "preview",
      //         title: data.title,
      //         slug: data.slug,
      //         content: data.content,
      //         thumbnail: data.thumbnail,
      //         published: data.published,
      //         created_at: new Date().toISOString(),
      //         updated_at: new Date().toISOString(),
      //         tags: data.tags || [],
      //         series_id: data.series_id,
      //         likes: 0,
      //       };
      //       setBlog(previewBlog);
      //       setLoading(false);
      //       return;
      //     } catch (error) {
      //       console.error("Error parsing preview data:", error);
      //     }
      //   }
      // }

      // Load from API if we have an ID
      if (id && id !== "preview") {
        try {
          setLoading(true);
          const blogData = await blogService.getBlogById(id);
          if (blogData) {
            setBlog(blogData);
          } else {
            toast.error("Blog not found");
            router.push("/admin");
          }
        } catch (error) {
          console.error("Error loading blog:", error);
          toast.error("Failed to load blog");
          router.push("/admin");
        } finally {
          setLoading(false);
        }
      } else if (!isPreviewMode) {
        // No ID and not preview mode - redirect
        toast.error("Blog not found");
        router.push("/admin");
        setLoading(false);
      }
    };
    loadBlog();
  }, [id, router, isPreviewMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl text-muted-foreground">Blog not found</p>
          <Link href="/admin">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link href={isPreviewMode ? (searchParams.get("mode") === "edit" && id ? `/admin/blogs/${id}/edit` : "/admin/blogs/create") : "/admin"}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isPreviewMode ? "Back to Edit" : "Back to Dashboard"}
            </Button>
          </Link>
          <div className="flex gap-2">
            {isPreviewMode && (
              <Badge variant="outline" className="px-3 py-1">
                Preview Mode
              </Badge>
            )}
            {!isPreviewMode && blog.id !== "preview" && (
              <Link href={`/admin/blogs/${blog.id}/edit`}>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            )}
            {!isPreviewMode && (
              <Badge variant={blog.published ? "default" : "secondary"} className="px-3 py-1">
                <Eye className="mr-1 h-3 w-3" />
                {blog.published ? "Published" : "Draft"}
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {/* Thumbnail */}
            {blog.thumbnail && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {blog.title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>{format(new Date(blog.created_at), "MMMM d, yyyy")}</span>
                {blog.updated_at !== blog.created_at && (
                  <span className="text-sm">
                    Updated: {format(new Date(blog.updated_at), "MMMM d, yyyy")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span>{blog.likes} likes</span>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-code:bg-muted prose-code:text-foreground prose-code:font-medium prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:shadow-sm prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground">
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BlogPreview;

