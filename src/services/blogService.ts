import { Blog } from "@/types/blog";
import {
  createBlog as createBlogApi,
  updateBlog as updateBlogApi,
  getYourBlogs,
  getAllBlogs as getAllBlogsApi,
  getBlog as getBlogApi,
  deleteBlog as deleteBlogApi,
  toggleBlogPublish as toggleBlogPublishApi,
  BlogRequest,
  BlogResponse,
} from "@/lib/blogApi";

// Helper to convert API response to Blog type
const convertBlogResponse = (response: BlogResponse): Blog => {
  return {
    id: response._id || response.id || "",
    title: response.title,
    slug: response.slug,
    content: response.content,
    thumbnail: response.thumbnail,
    published: response.published,
    created_at: response.created_at,
    updated_at: response.updated_at,
    tags: response.tags || [],
    series_id: response.series_id,
    likes: response.likes || 0,
    view_count: response.view_count,
    author_name: response.author_name,
    author_portfolio: response.author_portfolio,
  };
};

export const blogService = {
  // Get all blogs (admin sees all, public sees only published)
  getAllBlogs: async (isAdmin: boolean = false, seriesId?: string): Promise<Blog[]> => {
    try {
      if (isAdmin) {
        const response = await getYourBlogs(seriesId);
        return response.data.data.map(convertBlogResponse);
      } else {
        const response = await getAllBlogsApi(seriesId ? { series_id: seriesId } : undefined);
        return response.data.data.map(convertBlogResponse);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }
  },

  // Get blog by slug
  getBlogBySlug: async (slug: string): Promise<Blog | undefined> => {
    try {
      const response = await getBlogApi(slug, 'slug');
      if (response.data.success && response.data.data) {
        return convertBlogResponse(response.data.data);
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching blog by slug:", error);
      throw error;
    }
  },

  // Get blog by ID
  getBlogById: async (id: string): Promise<Blog | undefined> => {
    try {
      const response = await getBlogApi(id, 'id');
      if (response.data.success && response.data.data) {
        return convertBlogResponse(response.data.data);
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching blog by ID:", error);
      throw error;
    }
  },

  // Create new blog
  createBlog: async (
    blog: Omit<Blog, "id" | "created_at" | "updated_at" | "likes" | "thumbnail"> & {
      thumbnail: File | string;
    }
  ): Promise<Blog> => {
    try {
      const blogRequest: BlogRequest = {
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        thumbnail: blog.thumbnail,
        published: blog.published,
        tags: blog.tags,
        series_id: blog.series_id || undefined,
      };

      const response = await createBlogApi(blogRequest);
      if (response.data.success && response.data.data) {
        return convertBlogResponse(response.data.data);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  },

  // Update blog
  updateBlog: async (
    id: string,
    updates: Partial<Omit<Blog, "id" | "created_at" | "updated_at" | "likes" | "thumbnail">> & {
      thumbnail?: File | string;
    }
  ): Promise<Blog> => {
    try {
      const blogRequest: Partial<BlogRequest> = {
        ...(updates.title && { title: updates.title }),
        ...(updates.slug && { slug: updates.slug }),
        ...(updates.content && { content: updates.content }),
        ...(updates.thumbnail !== undefined && {
          thumbnail: updates.thumbnail,
        }),
        ...(updates.published !== undefined && { published: updates.published }),
        ...(updates.tags && { tags: updates.tags }),
        ...(updates.series_id !== undefined && {
          series_id: updates.series_id || null,
        }),
      };

      const response = await updateBlogApi(id, blogRequest);
      if (response.data.success && response.data.data) {
        return convertBlogResponse(response.data.data);
      }
      throw new Error("Failed to update blog");
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<boolean> => {
    try {
      await deleteBlogApi(id);
      return true;
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }
  },

  // Toggle publish status
  togglePublish: async (id: string): Promise<Blog | undefined> => {
    try {
      const blog = await blogService.getBlogById(id);
      if (!blog) return undefined;

      const response = await toggleBlogPublishApi(id, !blog.published);
      if (response.data.success && response.data.data) {
        return convertBlogResponse(response.data.data);
      }
      throw new Error("Failed to toggle publish status");
    } catch (error) {
      console.error("Error toggling publish status:", error);
      throw error;
    }
  },

  // Increment likes (if needed for public API)
  incrementLikes: async (id: string): Promise<Blog | undefined> => {
    try {
      const blog = await blogService.getBlogById(id);
      if (!blog) return undefined;

      // Note: This might need a separate API endpoint for incrementing likes
      // For now, we'll just return the blog
      return blog;
    } catch (error) {
      console.error("Error incrementing likes:", error);
      throw error;
    }
  },

  // Get blogs by series
  getBlogsBySeries: async (seriesId: string, isAdmin: boolean = false): Promise<Blog[]> => {
    try {
      const response = isAdmin
        ? await getYourBlogs(seriesId)
        : await getAllBlogsApi({ series_id: seriesId });

      const data = response.data.data
        .filter((blog) => isAdmin ? true : blog.published)
        .map(convertBlogResponse)
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );

      return data;
    } catch (error) {
      console.error("Error fetching blogs by series:", error);
      throw error;
    }
  },

  // Search blogs (might need a separate search endpoint)
  searchBlogs: async (
    query: string,
    isAdmin: boolean = false
  ): Promise<Blog[]> => {
    try {
      const blogs = await blogService.getAllBlogs(isAdmin);
      const searchTerm = query.toLowerCase();
      return blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm) ||
          blog.content.toLowerCase().includes(searchTerm) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error("Error searching blogs:", error);
      throw error;
    }
  },
};
