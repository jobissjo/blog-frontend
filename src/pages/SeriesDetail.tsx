import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import BlogCard from "@/components/BlogCard";
import { seriesService } from "@/services/seriesService";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SeriesDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const series = slug ? seriesService.getSeriesBySlug(slug) : null;

  if (!series) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl text-muted-foreground">Series not found</p>
          <Link to="/series">
            <Button className="mt-4">Back to Series</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <Link to="/series">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to series
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            {series.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {series.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {series.blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {series.blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No articles in this series yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SeriesDetail;
