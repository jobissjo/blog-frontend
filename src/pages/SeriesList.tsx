import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { seriesService } from "@/services/seriesService";
import { Series } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SeriesList = () => {
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const series = await seriesService.getAllSeries();
        setAllSeries(series);
      } catch (error) {
        console.error("Error loading series:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSeries();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            Blog Series
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive guides and tutorials organized by topic
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[1, 2].map((i) => (
              <Card key={i} className="h-full">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {allSeries.map((series) => (
              <Link key={series._id} to={`/series/${series.slug}`}>
                <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <BookOpen className="h-6 w-6 text-primary" />
                      {series.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {series.description}
                    </p>
                    <Badge variant="secondary">
                      {series.blogs?.length || 0} {(series.blogs?.length || 0) === 1 ? 'article' : 'articles'}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && allSeries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No series available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SeriesList;
