"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import { blogService } from "@/services/blogService";
import { authService } from "@/services/authService";
import { Blog } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  const isAdmin = authService.isAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const blogs = searchQuery
          ? await blogService.searchBlogs(searchQuery, false)
          : await blogService.getAllBlogs(false);
        setAllBlogs(blogs);
      } catch (error) {
        console.error("Error loading blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, [searchQuery, isAdmin]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Welcome to JoTechBlog
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
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Loading articles...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {allBlogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  {searchQuery ? "No articles found matching your search." : "No articles yet."}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
