import { Series } from "@/types/blog";
import * as seriesApi from "@/lib/seriesApi";
import { blogService } from "./blogService";
import { toggleSeriesPublish as toggleSeriesPublishApi } from "@/lib/seriesApi";

export const seriesService = {
  // Get all published series (public)
  getAllSeries: async (): Promise<Series[]> => {
    try {
      const response = await seriesApi.getAllSeries();
      const series = response.data.data;
      return await Promise.all(series.map(async s => ({
        ...s,
        id: s._id,
        published: s.published,
        blogs: await blogService.getBlogsBySeries(s._id),
      })));
    } catch (error) {
      console.error("Error fetching series:", error);
      return [];
    }
  },

  // Get all series including unpublished (admin only)
  getAllSeriesAdmin: async (): Promise<Series[]> => {
    try {
      const response = await seriesApi.getYourSeries();
      const series = response.data.data;
      return await Promise.all(series.map(async s => ({
        ...s,
        id: s._id,
        published: s.published,
        blogs: await blogService.getBlogsBySeries(s._id, true),
      })));
    } catch (error) {
      console.error("Error fetching admin series:", error);
      return [];
    }
  },

  // Get series by slug (public - only published)
  getSeriesBySlug: async (slug: string): Promise<Series | null> => {
    try {
      const response = await seriesApi.getSeriesBySlug(slug);
      const series = response.data.data;
      return {
        ...series,
        id: series._id,
        published: series.published,
        blogs: await blogService.getBlogsBySeries(series._id),
      };
    } catch (error) {
      console.error("Error fetching series by slug:", error);
      return null;
    }
  },

  // Get series by ID (admin - can get unpublished)
  getSeriesById: async (id: string): Promise<Series | null> => {
    try {
      const response = await seriesApi.getSeries(id);
      const series = response.data.data;
      return {
        ...series,
        id: series._id,
        published: series.published,
        blogs: await blogService.getBlogsBySeries(series._id, true),
      };
    } catch (error) {
      console.error("Error fetching series by id:", error);
      return null;
    }
  },

  // Create new series (admin only)
  createSeries: async (seriesData: {
    title: string;
    slug: string;
    description: string;
    published: boolean;
  }): Promise<Series | null> => {
    try {
      const response = await seriesApi.createSeries(seriesData);
      const series = response.data;
      return {
        ...series,
        id: series._id,
        published: series.published,
        blogs: [],
      };
    } catch (error) {
      console.error("Error creating series:", error);
      throw error;
    }
  },

  // Update series (admin only)
  updateSeries: async (
    id: string,
    updates: {
      title?: string;
      slug?: string;
      description?: string;
      published?: boolean;
    }
  ): Promise<Series | null> => {
    try {
      const response = await seriesApi.updateSeries(id, updates);
      const series = response.data;
      return {
        ...series,
        id: series._id,
        published: series.published,
        blogs: await blogService.getBlogsBySeries(series._id, true),
      };
    } catch (error) {
      console.error("Error updating series:", error);
      throw error;
    }
  },

  // Toggle publish status (admin only)
  togglePublish: async (id: string, published: boolean): Promise<Series | null> => {
    try {
      const response = await toggleSeriesPublishApi(id, published);
      const series = response.data;
      return {
        ...series,
        id: series._id,
        published: series.published,
        blogs: await blogService.getBlogsBySeries(series._id),
      };
    } catch (error) {
      console.error("Error toggling series publish status:", error);
      throw error;
    }
  },

  // Delete series (admin only)
  deleteSeries: async (id: string): Promise<boolean> => {
    try {
      await seriesApi.deleteSeries(id);
      return true;
    } catch (error) {
      console.error("Error deleting series:", error);
      throw error;
    }
  },
};
