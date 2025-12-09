"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { seriesService } from "@/services/seriesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const SeriesEditForm = () => {
  const router = useRouter();
  const params = useParams();   
  const id = params.id as string;
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSeries = async () => {
      if (isEdit && id) {
        setLoading(true);
        try {
          const series = await seriesService.getSeriesById(id);
          if (series) {
            setTitle(series.title);
            setSlug(series.slug);
            setDescription(series.description);
            setPublished(series.published);
          }
        } catch (error) {
          toast.error("Failed to load series");
        } finally {
          setLoading(false);
        }
      }
    };
    loadSeries();
  }, [isEdit, id]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEdit) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      if (isEdit && id) {
        await seriesService.updateSeries(id, {
          title,
          slug,
          description,
          published: published,
        });
        toast.success("Series updated successfully!");
      } else {
        await seriesService.createSeries({
          title,
          slug,
          description,
          published: published,
        });
        toast.success("Series created successfully!");
      }
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save series");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Edit Series" : "Create New Series"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter series title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="series-url-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this series..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publish series
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Update Series" : "Create Series"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SeriesEditForm;
