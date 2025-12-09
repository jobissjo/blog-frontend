"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { seriesService } from "@/services/seriesService";
import { Series } from "@/types/blog";
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
import { PenSquare, Trash2, Eye, EyeOff, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

const AdminSeriesPage = () => {
    const [allSeries, setAllSeries] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
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

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await seriesService.deleteSeries(deleteTarget.id);
            const series = await seriesService.getAllSeriesAdmin();
            setAllSeries(series);
            toast.success("Series deleted successfully");
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
                    <h1 className="text-3xl font-bold tracking-tight">Series</h1>
                    <p className="text-muted-foreground mt-2">Manage your blog series.</p>
                </div>
                <Link href="/admin/series/create">
                    <Button className="w-full sm:w-auto">
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
                                                        setDeleteTarget({
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

            <DeleteConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open && !deleteLoading) {
                        setDeleteTarget(null);
                    }
                }}
                title="Delete Series"
                description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                loading={deleteLoading}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default AdminSeriesPage;
