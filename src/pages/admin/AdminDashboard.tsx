import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { blogService } from "@/services/blogService";
import { seriesService } from "@/services/seriesService";
import { Series, Blog } from "@/types/blog";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PenSquare, Trash2, Eye, EyeOff, Plus, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const seriesData = await seriesService.getAllSeriesAdmin();
        setAllSeries(seriesData);
      } catch (error) {
        console.error("Error loading series:", error);
        toast.error("Failed to load series");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const seriesId = selectedSeriesFilter === "all" ? undefined : selectedSeriesFilter;
        const blogsData = await blogService.getAllBlogs(true, seriesId);
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error loading blogs:", error);
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, [selectedSeriesFilter]);

  const handleTogglePublish = async (id: string) => {
    try {
      const updated = await blogService.togglePublish(id);
      if (updated) {
        const seriesId = selectedSeriesFilter === "all" ? undefined : selectedSeriesFilter;
        const blogsData = await blogService.getAllBlogs(true, seriesId);
        setBlogs(blogsData);
        toast.success(`Blog ${updated.published ? 'published' : 'unpublished'} successfully`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update blog");
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await blogService.deleteBlog(id);
        const seriesId = selectedSeriesFilter === "all" ? undefined : selectedSeriesFilter;
        const blogsData = await blogService.getAllBlogs(true, seriesId);
        setBlogs(blogsData);
        toast.success("Blog deleted successfully");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete blog");
      }
    }
  };

  const handleDeleteSeries = async (id: string) => {
    if (confirm("Are you sure you want to delete this series?")) {
      try {
        await seriesService.deleteSeries(id);
        const series = await seriesService.getAllSeriesAdmin();
        setAllSeries(series);
        toast.success("Series deleted successfully");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete series");
      }
    }
  };

  const handleToggleSeriesPublish = async (id: string, currentStatus: boolean) => {
    try {
      await seriesService.updateSeries(id, { published: !currentStatus });
      const series = await seriesService.getAllSeriesAdmin();
      setAllSeries(series);
      toast.success(`Series ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update series");
    }
  };

  const refreshSeries = async () => {
    try {
      const series = await seriesService.getAllSeriesAdmin();
      setAllSeries(series);
    } catch (error) {
      console.error("Error loading series:", error);
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

        <Tabs defaultValue="blogs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="series">Series</TabsTrigger>
          </TabsList>

          <TabsContent value="blogs" className="space-y-6">
            <div className="flex gap-4 mb-6 items-center">
              <Link to="/admin/blogs/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Blog
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Label htmlFor="series-filter">Filter by Series:</Label>
                <Select value={selectedSeriesFilter} onValueChange={setSelectedSeriesFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Series</SelectItem>
                    {allSeries.map((series) => (
                      <SelectItem key={series._id} value={series._id}>
                        {series.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading blogs...</div>
                ) : (
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
                        ? allSeries.find(s => s._id === blog.series_id || s.id === blog.series_id)
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
                              <Link to={`/admin/blogs/${blog.id}/preview`}>
                                <Button variant="ghost" size="sm" title="Preview">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/admin/blogs/${blog.id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <PenSquare className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBlog(blog.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {blogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No blogs found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="series" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Link to="/admin/series/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Series
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Series</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading series...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allSeries.map((series) => (
                        <TableRow key={series._id}>
                          <TableCell className="font-medium">{series.title}</TableCell>
                          <TableCell>
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {series.slug}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant={series.published ? "default" : "secondary"}>
                              {series.published ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {series.created_at
                              ? format(new Date(series.created_at), "MMM d, yyyy")
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleSeriesPublish(series._id, series.published)}
                              >
                                {series.published ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Link to={`/series/${series.slug}`} target="_blank">
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/admin/series/${series._id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <PenSquare className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSeries(series._id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {allSeries.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No series found. Create your first series!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
