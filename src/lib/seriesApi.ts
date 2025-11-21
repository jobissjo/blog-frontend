import apiClient from "./api";

export interface SeriesRequest {
  title: string;
  slug: string;
  description: string;
  published: boolean; // API expects publish but response has published
}

export interface SeriesResponse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SeriesResponseList {
  data: SeriesResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface SeriesResponseDetail {
  data: SeriesResponse;
  success: boolean;
  message: string;
}

// GET - Public: Get all published series
export const getAllSeries = () => {
  return apiClient.get<SeriesResponseList>("api/series");
};

// GET - Public: Get single series by ID or slug
export const getSeries = (idOrSlug: string) => {
  return apiClient.get<SeriesResponseDetail>(`api/series/${idOrSlug}`);
};

// POST - Admin only: Create new series
export const createSeries = (data: SeriesRequest) => {
  return apiClient.post<SeriesResponse>("api/series", data);
};

// PUT - Admin only: Update series
export const updateSeries = (id: string, data: Partial<SeriesRequest>) => {
  return apiClient.put<SeriesResponse>(`api/series/${id}`, data);
};

// DELETE - Admin only: Delete series
export const deleteSeries = (id: string) => {
  return apiClient.delete(`api/series/${id}`);
};

// GET - Admin only: Get all series (including unpublished)
export const getYourSeries = () => {
  return apiClient.get<SeriesResponseList>("api/series/your");
};

