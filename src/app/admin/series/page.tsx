"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { seriesService } from "@/services/seriesService";
import { Series } from "@/types/blog";
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
import { PenSquare, Trash2, Eye, EyeOff, Plus, ExternalLink, Layers, Sparkles } from "lucide-react";
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
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Tutorial Series</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Series</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage and curate multi-part learning paths.</p>
                </div>
                <Link href="/admin/series/create">
                    <Button className="w-full sm:w-auto gap-2 rounded-xl font-semibold shadow-xs">
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
                                            <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                                                No series found. Create your first series!
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
