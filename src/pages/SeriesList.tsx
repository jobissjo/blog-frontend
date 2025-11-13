import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { seriesService } from "@/services/seriesService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

const SeriesList = () => {
  const allSeries = seriesService.getAllSeries();

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

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {allSeries.map((series) => (
            <Link key={series.id} to={`/series/${series.slug}`}>
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
                    {series.blogs.length} {series.blogs.length === 1 ? 'article' : 'articles'}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {allSeries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No series available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SeriesList;
