import { Series } from "@/types/blog";
import { blogService } from "./blogService";

let series: Series[] = [
  {
    id: "1",
    title: "Full-Stack Development Masterclass",
    slug: "fullstack-development-masterclass",
    description: "Learn how to build complete web applications from frontend to backend, covering React, TypeScript, FastAPI, and MongoDB.",
    blogs: [],
  },
];

export const seriesService = {
  // Get all series
  getAllSeries: (): Series[] => {
    return series.map(s => ({
      ...s,
      blogs: blogService.getBlogsBySeries(s.id),
    }));
  },

  // Get series by slug
  getSeriesBySlug: (slug: string): Series | undefined => {
    const found = series.find(s => s.slug === slug);
    if (!found) return undefined;

    return {
      ...found,
      blogs: blogService.getBlogsBySeries(found.id),
    };
  },

  // Get series by ID
  getSeriesById: (id: string): Series | undefined => {
    const found = series.find(s => s.id === id);
    if (!found) return undefined;

    return {
      ...found,
      blogs: blogService.getBlogsBySeries(found.id),
    };
  },

  // Create new series
  createSeries: (seriesData: Omit<Series, "id" | "blogs">): Series => {
    const newSeries: Series = {
      ...seriesData,
      id: Date.now().toString(),
      blogs: [],
    };
    series.push(newSeries);
    return newSeries;
  },

  // Update series
  updateSeries: (id: string, updates: Partial<Omit<Series, "id" | "blogs">>): Series | undefined => {
    const index = series.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    series[index] = {
      ...series[index],
      ...updates,
      id: series[index].id,
      blogs: blogService.getBlogsBySeries(series[index].id),
    };
    return series[index];
  },

  // Delete series
  deleteSeries: (id: string): boolean => {
    const index = series.findIndex(s => s.id === id);
    if (index === -1) return false;

    series.splice(index, 1);
    return true;
  },
};
