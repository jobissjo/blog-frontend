import { Comment } from "@/types/blog";
import {
  CommentResponse,
  createComment as createCommentApi,
  getCommentsByBlogId as getCommentsByBlogIdApi,
} from "@/lib/commentApi";

const mapCommentResponse = (comment: CommentResponse): Comment => ({
  id: comment._id ?? comment.id ?? "",
  blog_id: comment.blog_id,
  name: comment.name ?? "Anonymous",
  comment: comment.comment,
  created_at: comment.created_at,
  updated_at: comment.updated_at,
  visitor_id: comment.visitor_id ?? null,
});

export const commentService = {
  getCommentsByBlogId: async (blogId: string): Promise<Comment[]> => {
    const response = await getCommentsByBlogIdApi(blogId);
    const commentList = response.data.data ?? [];

    return commentList
      .map(mapCommentResponse)
      .sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  },

  addComment: async (blogId: string, name: string, commentText: string): Promise<Comment> => {
    const response = await createCommentApi(blogId, {
      name,
      comment: commentText,
    });

    return mapCommentResponse(response.data.data);
  },
};
