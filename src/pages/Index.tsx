import { useState } from "react";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import { blogService } from "@/services/blogService";
import { authService } from "@/services/authService";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  const isAdmin = authService.isAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  
  const allBlogs = searchQuery
    ? blogService.searchBlogs(searchQuery, isAdmin)
    : blogService.getAllBlogs(isAdmin);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            Welcome to DevBlog
          </h1>
          <p className="text-xl text-muted-foreground">
            Insights and tutorials on modern web development
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

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
      </main>
    </div>
  );
};

export default Index;
