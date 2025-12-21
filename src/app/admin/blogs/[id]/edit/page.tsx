"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { blogService } from "@/services/blogService";
import { seriesService } from "@/services/seriesService";
import { Series } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye } from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

const BlogForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [seriesId, setSeriesId] = useState<string>("");
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const series = await seriesService.getAllSeriesAdmin();

        setAllSeries(series);
      } catch (error) {
        console.error("Error loading series:", error);
      }
    };
    loadSeries();
  }, []);

  useEffect(() => {
    if (allSeries.length && seriesId) {
      setSeriesId(seriesId);
    }
  }, [allSeries]);

  useEffect(() => {
    if (isEdit && id) {
      const loadBlog = async () => {
        try {
          setLoading(true);
          const blog = await blogService.getBlogById(id);
          if (blog) {

            setTitle(blog.title);
            setSlug(blog.slug);
            setContent(blog.content);
            setThumbnailPreview(blog.thumbnail);
            setTags(blog.tags.join(", "));
            setPublished(blog.published);
            setSeriesId(blog.series_id || "none");
          }
        } catch (error) {
          console.error("Error loading blog:", error);
          toast.error("Failed to load blog");
        } finally {
          setLoading(false);
        }
      };
      loadBlog();
    }
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = () => {
    if (!title || !content) {
      toast.error("Please fill in title and content to preview");
      return;
    }

    // Save current form state to localStorage for preview
    const previewData = {
      title,
      slug: slug || generateSlug(title),
      content,
      thumbnail: thumbnailPreview || "",
      tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      published,
      series_id: (seriesId === "none" || !seriesId) ? undefined : seriesId,
      isPreview: true,
    };

    localStorage.setItem("blog_preview", JSON.stringify(previewData));

    // Navigate to preview page
    if (isEdit && id) {
      router.push(`/admin/blogs/${id}/preview?mode=edit`);
    } else {
      router.push("/admin/blogs/preview?mode=create");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!thumbnail && !thumbnailPreview) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    const tagArray = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag);

    try {
      setLoading(true);
      if (isEdit && id) {
        // Only include thumbnail if a new file was selected
        const updateData: any = {
          title,
          slug,
          content,
          tags: tagArray,
          published,
          series_id: (seriesId === "none" || !seriesId) ? undefined : seriesId,
        };

        // Only add thumbnail if a new file was selected (not just the existing preview)
        if (thumbnail) {
          updateData.thumbnail = thumbnail;
        }

        await blogService.updateBlog(id, updateData);
        toast.success("Blog updated successfully!");
      } else {
        if (!thumbnail) {
          toast.error("Please upload a thumbnail image");
          return;
        }
        await blogService.createBlog({
          title,
          slug,
          content,
          thumbnail: thumbnail!,
          tags: tagArray,
          published,
          series_id: (seriesId === "none" || !seriesId) ? undefined : seriesId,
        });
        toast.success("Blog created successfully!");
      }
      router.push("/admin");
    } catch (error: any) {
      console.error("Error saving blog:", error);
      toast.error(error.response?.data?.message || "Failed to save blog");
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
            <CardTitle>{isEdit ? "Edit Blog" : "Create New Blog"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="blog-url-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail *</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  required={!isEdit || !thumbnailPreview}
                />
                {thumbnailPreview && (
                  <div className="mt-2">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="max-w-xs h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="series">Series (Optional)</Label>
                <Select value={seriesId} onValueChange={setSeriesId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Series</SelectItem>
                    {allSeries.map((series) => (
                      <SelectItem key={series._id} value={series._id}>
                        {series.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="React, TypeScript, Tutorial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content * (Markdown)</Label>
                <div data-color-mode="light">
                  <MDEditor
                    value={content}
                    onChange={(value) => setContent(value || "")}
                    height={500}
                    preview="edit"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  disabled={loading || !title || !content}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin")}
                  disabled={loading}
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

export default BlogForm;
