import apiClient from "./api";

export interface AnonymousCommentCreatePayload {
  name?: string | null;
  comment: string;
}

export interface CommentResponse {
  _id: string;
  id?: string;
  blog_id: string;
  visitor_id?: string | null;
  name?: string | null;
  comment: string;
  created_at: string;
  updated_at?: string;
}

export interface CommentListResponse {
  success: boolean;
  message: string;
  data: CommentResponse[];
  total: number;
}

export interface CommentMutationResponse {
  success: boolean;
  message: string;
  data: CommentResponse;
}

export const listComments = (blogId: string, limit: number = 50) => {
  return apiClient.get<CommentListResponse>(`api/comments/${blogId}`, {
    params: { limit },
  });
};

export const createComment = (
  blogId: string,
  payload: AnonymousCommentCreatePayload
) => {
  return apiClient.post<CommentMutationResponse>(
    `api/comments/${blogId}`,
    payload
  );
};
