"use client";
import Link from "next/link";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PenSquare, Trash2, Eye, EyeOff, Plus, FileText } from "lucide-react";
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
                    <p className="text-muted-foreground mt-2">Manage your blog posts.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
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
