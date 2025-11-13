import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import { blogService } from "@/services/blogService";
import { seriesService } from "@/services/seriesService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PenSquare, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState(blogService.getAllBlogs(true));
  const allSeries = seriesService.getAllSeries();

  const handleTogglePublish = (id: string) => {
    const updated = blogService.togglePublish(id);
    if (updated) {
      setBlogs(blogService.getAllBlogs(true));
      toast.success(`Blog ${updated.published ? 'published' : 'unpublished'} successfully`);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      if (blogService.deleteBlog(id)) {
        setBlogs(blogService.getAllBlogs(true));
        toast.success("Blog deleted successfully");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your blog posts and series</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{blogs.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Published</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-success">
                {blogs.filter(b => b.published).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-muted-foreground">
                {blogs.filter(b => !b.published).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mb-6">
          <Link to="/admin/blogs/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Blog
            </Button>
          </Link>
          <Link to="/admin/series/create">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Series
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Series</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => {
                  const blogSeries = blog.series_id 
                    ? allSeries.find(s => s.id === blog.series_id)
                    : null;
                  
                  return (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell>
                        <Badge variant={blog.published ? "default" : "secondary"}>
                          {blog.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {blogSeries ? (
                          <Badge variant="outline">{blogSeries.title}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(blog.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{blog.likes}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublish(blog.id)}
                          >
                            {blog.published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Link to={`/admin/blogs/${blog.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <PenSquare className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(blog.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
