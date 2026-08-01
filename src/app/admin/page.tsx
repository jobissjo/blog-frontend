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
  FileEdit,
  Sparkles,
  Layers,
  Heart
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

  const totalLikes = blogs.reduce((acc, b) => acc + (b.likes || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Content Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your publication articles, tutorial series, and content status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/blogs/create">
            <Button className="gap-2 font-semibold shadow-xs">
              <Plus className="h-4 w-4" />
              <span>Create Article</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/80 bg-card/60 backdrop-blur-sm shadow-xs hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Articles
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{blogs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Articles created in library
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-sm shadow-xs hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Published
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-500">
              {blogs.filter(b => b.published).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Live and visible on site
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-sm shadow-xs hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Drafts
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <FileEdit className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-500">
              {blogs.filter(b => !b.published).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unpublished work in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-sm shadow-xs hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Series
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <Layers className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-purple-500">{allSeries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Curated tutorial learning paths
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="blogs" className="space-y-6">
        <TabsList className="bg-card/60 backdrop-blur-sm border border-border/80 p-1 rounded-2xl w-full sm:w-auto inline-flex">
          <TabsTrigger value="blogs" className="rounded-xl px-5 py-2 font-semibold text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Blog Articles
          </TabsTrigger>
          <TabsTrigger value="series" className="rounded-xl px-5 py-2 font-semibold text-xs uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Tutorial Series
          </TabsTrigger>
        </TabsList>

        {/* Blogs Tab */}
        <TabsContent value="blogs" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/40 p-4 rounded-2xl border border-border/60">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Label htmlFor="series-filter" className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Filter by Series:
              </Label>
              <Select value={selectedSeriesFilter} onValueChange={setSelectedSeriesFilter}>
                <SelectTrigger className="w-[220px] rounded-xl bg-card border-border/80">
                  <SelectValue placeholder="All Series" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
              <Button size="sm" className="w-full sm:w-auto gap-2 rounded-xl font-semibold">
                <Plus className="h-4 w-4" />
                New Blog
              </Button>
            </Link>
          </div>

          <Card className="border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden shadow-xs">
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-16 text-muted-foreground text-sm font-medium">Loading blog articles...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/60 hover:bg-muted/60 border-b border-border/80 text-xs uppercase tracking-wider">
                        <TableHead className="font-bold text-foreground">Title</TableHead>
                        <TableHead className="font-bold text-foreground">Status</TableHead>
                        <TableHead className="font-bold text-foreground">Series</TableHead>
                        <TableHead className="font-bold text-foreground">Date</TableHead>
                        <TableHead className="font-bold text-foreground">Likes</TableHead>
                        <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border/60">
                      {blogs.map((blog) => {
                        const blogSeries = blog.series_id
                          ? allSeries.find(s => s._id === blog.series_id || s.id === blog.series_id)
                          : null;

                        return (
                          <TableRow key={blog.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-semibold text-foreground max-w-xs truncate">
                              {blog.title}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={blog.published ? "default" : "secondary"}
                                className={
                                  blog.published
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-semibold"
                                    : "bg-muted text-muted-foreground font-semibold"
                                }
                              >
                                {blog.published ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {blogSeries ? (
                                <Badge variant="outline" className="font-medium text-xs bg-primary/5 text-primary border-primary/20">
                                  {blogSeries.title}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs font-mono">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                              {blog.created_at ? format(new Date(blog.created_at), "MMM d, yyyy") : "-"}
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                                {blog.likes || 0}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Preview">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/admin/blogs/${blog.id}/edit`}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Edit">
                                    <PenSquare className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                          <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                            No articles found in this filter.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Series Tab */}
        <TabsContent value="series" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Link href="/admin/series/create">
              <Button size="sm" className="gap-2 rounded-xl font-semibold">
                <Plus className="h-4 w-4" />
                New Series
              </Button>
            </Link>
          </div>

          <Card className="border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden shadow-xs">
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-16 text-muted-foreground text-sm font-medium">Loading series...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/60 hover:bg-muted/60 border-b border-border/80 text-xs uppercase tracking-wider">
                        <TableHead className="font-bold text-foreground">Series Title</TableHead>
                        <TableHead className="font-bold text-foreground">Slug</TableHead>
                        <TableHead className="font-bold text-foreground">Status</TableHead>
                        <TableHead className="font-bold text-foreground">Created</TableHead>
                        <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border/60">
                      {allSeries.map((series) => (
                        <TableRow key={series._id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-semibold text-foreground">{series.title}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-mono">
                              {series.slug}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={series.published ? "default" : "secondary"}
                              className={
                                series.published
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-semibold"
                                  : "bg-muted text-muted-foreground font-semibold"
                              }
                            >
                              {series.published ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                            {series.created_at
                              ? format(new Date(series.created_at), "MMM d, yyyy")
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View Live">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/admin/series/${series._id}/edit`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Edit">
                                  <PenSquare className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                          <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                            No series found. Create your first tutorial series!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
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
