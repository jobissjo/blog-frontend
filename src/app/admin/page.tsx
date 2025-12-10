"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import {
  PenSquare,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  ExternalLink,
  FileText,
  BarChart3,
  CheckCircle2,
  FileEdit
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

const AdminDashboard = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<null | {
    type: "blog" | "series";
    id: string;
    name: string;
  }>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const openDeleteDialog = (target: { type: "blog" | "series"; id: string; name: string }) => {
    setDeleteTarget(target);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.type === "blog") {
        await blogService.deleteBlog(deleteTarget.id);
        const seriesId = selectedSeriesFilter === "all" ? undefined : selectedSeriesFilter;
        const blogsData = await blogService.getAllBlogs(true, seriesId);
        setBlogs(blogsData);
        toast.success("Blog deleted successfully");
      } else {
        await seriesService.deleteSeries(deleteTarget.id);
        const series = await seriesService.getAllSeriesAdmin();
        setAllSeries(series);
        toast.success("Series deleted successfully");
      }
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleSeriesPublish = async (id: string, currentStatus: boolean) => {
    try {
      await seriesService.togglePublish(id, !currentStatus);
      const series = await seriesService.getAllSeriesAdmin();
      setAllSeries(series);
      toast.success(`Series ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update series");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your content and analytics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Total posts across all series
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {blogs.filter(b => b.published).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Live on the site
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {blogs.filter(b => !b.published).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Work in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="blogs" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="blogs" className="data-[state=active]:bg-background">Blogs</TabsTrigger>
          <TabsTrigger value="series" className="data-[state=active]:bg-background">Series</TabsTrigger>
        </TabsList>

        <TabsContent value="blogs" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Label htmlFor="series-filter" className="whitespace-nowrap">Filter by Series:</Label>
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
            <Link href="/admin/blogs/create">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                New Blog
              </Button>
            </Link>
          </div>

          <Card className="border-muted/50 shadow-sm">
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading blogs...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
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
                        <TableRow key={blog.id} className="group">
                          <TableCell className="font-medium">{blog.title}</TableCell>
                          <TableCell>
                            <Badge variant={blog.published ? "default" : "secondary"} className={blog.published ? "bg-success hover:bg-success/80" : ""}>
                              {blog.published ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {blogSeries ? (
                              <Badge variant="outline" className="font-normal">{blogSeries.title}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(blog.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>{blog.likes}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleTogglePublish(blog.id)}
                                title={blog.published ? "Unpublish" : "Publish"}
                              >
                                {blog.published ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Link href={`/admin/blogs/${blog.id}/preview`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Preview">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/admin/blogs/${blog.id}/edit`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                                  <PenSquare className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() =>
                                  openDeleteDialog({
                                    type: "blog",
                                    id: blog.id,
                                    name: blog.title,
                                  })
                                }
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {blogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
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

        <TabsContent value="series" className="space-y-4">
          <div className="flex justify-end mb-6">
            <Link href="/admin/series/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Series
              </Button>
            </Link>
          </div>

          <Card className="border-muted/50 shadow-sm">
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading series...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allSeries.map((series) => (
                      <TableRow key={series._id} className="group">
                        <TableCell className="font-medium">{series.title}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded border">
                            {series.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={series.published ? "default" : "secondary"} className={series.published ? "bg-success hover:bg-success/80" : ""}>
                            {series.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {series.created_at
                            ? format(new Date(series.created_at), "MMM d, yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleSeriesPublish(series._id, series.published)}
                              title={series.published ? "Unpublish" : "Publish"}
                            >
                              {series.published ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Link href={`/series/${series.slug}`} target="_blank">
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="View Live">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/series/${series._id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                                <PenSquare className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() =>
                                openDeleteDialog({
                                  type: "series",
                                  id: series._id,
                                  name: series.title,
                                })
                              }
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {allSeries.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
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
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) {
            setDeleteTarget(null);
          }
        }}
        title={`Delete ${deleteTarget?.type === "series" ? "series" : "blog"}`}
        description={`Are you sure you want to delete "${deleteTarget?.name ?? "this item"}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminDashboard;
