"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { blogService } from "@/services/blogService";
import { seriesService } from "@/services/seriesService";
import { Series, Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PenSquare, Trash2, Eye, EyeOff, Plus, FileText, Heart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

const AdminBlogsPage = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [allSeries, setAllSeries] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>("all");
    const [deleteTarget, setDeleteTarget] = useState<null | {
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

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await blogService.deleteBlog(deleteTarget.id);
            const seriesId = selectedSeriesFilter === "all" ? undefined : selectedSeriesFilter;
            const blogsData = await blogService.getAllBlogs(true, seriesId);
            setBlogs(blogsData);
            toast.success("Blog deleted successfully");
            setDeleteTarget(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Articles Library</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Blogs</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage, edit, publish or draft your articles.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Label htmlFor="series-filter" className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filter by Series:</Label>
                        <Select value={selectedSeriesFilter} onValueChange={setSelectedSeriesFilter}>
                            <SelectTrigger className="w-[200px] rounded-xl bg-card border-border/80">
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
                        <Button className="w-full sm:w-auto gap-2 rounded-xl font-semibold shadow-xs">
                            <Plus className="h-4 w-4" />
                            New Blog
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden shadow-xs">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-16 text-muted-foreground text-sm font-medium">Loading blogs...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/60 hover:bg-muted/60 border-b border-border/80 text-xs uppercase tracking-wider">
                                        <TableHead className="font-bold text-foreground">Title</TableHead>
                                        <TableHead className="font-bold text-foreground">Status</TableHead>
                                        <TableHead className="font-bold text-foreground">Series</TableHead>
                                        <TableHead className="font-bold text-foreground">Created</TableHead>
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
                                                <TableCell className="font-semibold text-foreground max-w-xs truncate">{blog.title}</TableCell>
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
                                                        <Badge variant="outline" className="font-medium text-xs bg-primary/5 text-primary border-primary/20">{blogSeries.title}</Badge>
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
                                                                setDeleteTarget({
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
                                                No blogs found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <DeleteConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open && !deleteLoading) {
                        setDeleteTarget(null);
                    }
                }}
                title="Delete Blog"
                description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                loading={deleteLoading}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default AdminBlogsPage;
