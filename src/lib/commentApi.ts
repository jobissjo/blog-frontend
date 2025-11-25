import apiClient from "./api";

export interface CommentResponse {
  _id?: string;
  id?: string;
  blog_id: string;
  visitor_id?: string | null;
  name: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CommentListResponse {
  data: CommentResponse[];
  total: number;
  success?: boolean;
  message?: string;
}

export interface CommentDetailResponse {
  data: CommentResponse;
  success: boolean;
  message: string;
}

export interface AnonymousCommentCreateRequest {
  name?: string | null;
  comment: string;
}

export const getCommentsByBlogId = (blogId: string) => {
  return apiClient.get<CommentListResponse>(`api/comments/${blogId}`);
};

export const createComment = (
  blogId: string,
  payload: AnonymousCommentCreateRequest
) => {
  return apiClient.post<CommentDetailResponse>(`api/comments/${blogId}`, payload);
};
