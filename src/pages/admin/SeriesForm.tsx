import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { seriesService } from "@/services/seriesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const SeriesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isEdit && id) {
      const series = seriesService.getSeriesById(id);
      if (series) {
        setTitle(series.title);
        setSlug(series.slug);
        setDescription(series.description);
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

    if (!title || !slug || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isEdit && id) {
      seriesService.updateSeries(id, {
        title,
        slug,
        description,
      });
      toast.success("Series updated successfully!");
    } else {
      seriesService.createSeries({
        title,
        slug,
        description,
      });
      toast.success("Series created successfully!");
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

              <div className="flex gap-4">
                <Button type="submit">
                  {isEdit ? "Update Series" : "Create Series"}
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

export default SeriesForm;
