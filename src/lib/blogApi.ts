import apiClient from "./api";

export interface BlogRequest {
  title: string;
  slug: string;
  content: string;
  thumbnail?: File | string;
  published: boolean;
  tags?: string[];
  series_id?: string | null;
}

export interface BlogResponse {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
  series_id?: string;
  likes: number;
}

export interface BlogResponseList {
  data: BlogResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface BlogResponseDetail {
  data: BlogResponse;
  success: boolean;
  message: string;
}

// POST - Admin only: Create new blog
export const createBlog = (data: BlogRequest) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("slug", data.slug);
  formData.append("content", data.content);
  formData.append("published", String(data.published));
  
  if (data.thumbnail instanceof File) {
    formData.append("thumbnail", data.thumbnail);
  } else if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail);
  }
  
  if (data.tags && data.tags.length > 0) {
    data.tags.forEach((tag) => {
      formData.append("tags", tag);
    });
  }
  
  if (data.series_id) {
    formData.append("series_id", data.series_id);
  }

  return apiClient.post<BlogResponseDetail>("api/blog", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// PUT - Admin only: Update blog
export const updateBlog = (id: string, data: Partial<BlogRequest>) => {
  const formData = new FormData();
  
  if (data.title) formData.append("title", data.title);
  if (data.slug) formData.append("slug", data.slug);
  if (data.content) formData.append("content", data.content);
  if (data.published !== undefined) formData.append("published", String(data.published));
  
  if (data.thumbnail instanceof File) {
    formData.append("thumbnail", data.thumbnail);
  } else if (data.thumbnail !== undefined) {
    formData.append("thumbnail", data.thumbnail);
  }
  
  if (data.tags) {
    data.tags.forEach((tag) => {
      formData.append("tags", tag);
    });
  }
  
  if (data.series_id !== undefined) {
    if (data.series_id) {
      formData.append("series_id", data.series_id);
    } else {
      formData.append("series_id", "");
    }
  }

  return apiClient.put<BlogResponseDetail>(`api/blog/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// GET - Admin only (authenticated): Get all blogs (including unpublished) with optional series_id filter
// Endpoint: api/blogs/your - Requires authentication token
export const getYourBlogs = (seriesId?: string) => {
  const params = seriesId ? { series_id: seriesId } : {};
  return apiClient.get<BlogResponseList>("api/blog/your", { params });
};

// GET - Public: Get all published blogs
// Endpoint: api/blogs - No authentication required
export const getAllBlogs = () => {
  return apiClient.get<BlogResponseList>("api/blog");
};

// GET - Public: Get single blog by ID or slug
// Endpoint: api/blogs/<slug> - No authentication required
export const getBlog = (idOrSlug: string, type: 'slug' | 'id') => {
  const prefix = type === 'slug' ? '' : 'your/';
  return apiClient.get<BlogResponseDetail>(`api/blog/${prefix}${idOrSlug}`);
};

// DELETE - Admin only: Delete blog
export const deleteBlog = (id: string) => {
  return apiClient.delete(`api/blog/${id}`);
};

