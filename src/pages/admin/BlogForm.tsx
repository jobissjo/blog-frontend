import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { blogService } from "@/services/blogService";
import { seriesService } from "@/services/seriesService";
import { Series } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [seriesId, setSeriesId] = useState<string>("");
  const [allSeries, setAllSeries] = useState<Series[]>([]);

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
    if (isEdit && id) {
      const blog = blogService.getBlogById(id);
      if (blog) {
        setTitle(blog.title);
        setSlug(blog.slug);
        setContent(blog.content);
        setThumbnail(blog.thumbnail);
        setTags(blog.tags.join(", "));
        setPublished(blog.published);
        setSeriesId(blog.series_id || "");
      }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const tagArray = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag);

    if (isEdit && id) {
      blogService.updateBlog(id, {
        title,
        slug,
        content,
        thumbnail,
        tags: tagArray,
        published,
        series_id: seriesId || undefined,
      });
      toast.success("Blog updated successfully!");
    } else {
      blogService.createBlog({
        title,
        slug,
        content,
        thumbnail,
        tags: tagArray,
        published,
        series_id: seriesId || undefined,
      });
      toast.success("Blog created successfully!");
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/admin">
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
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
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
                <Label htmlFor="content">Content * (Markdown supported)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here..."
                  rows={15}
                  required
                />
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
                <Button type="submit">
                  {isEdit ? "Update Blog" : "Create Blog"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin")}
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
