import { Comment } from "@/types/blog";
import {
  listComments,
  createComment,
  CommentResponse,
} from "@/lib/commentApi";

const mapCommentResponse = (comment: CommentResponse): Comment => ({
  id: comment._id || comment.id || "",
  blog_id: comment.blog_id,
  username: comment.name || "Anonymous",
  comment: comment.comment,
  created_at: comment.created_at,
});

export const commentService = {
  // Get comments by blog ID
  getCommentsByBlogId: async (
    blogId: string,
    limit: number = 50
  ): Promise<Comment[]> => {
    const response = await listComments(blogId, limit);
    return response.data.data.map(mapCommentResponse);
  },

  // Add comment
  addComment: async (
    blogId: string,
    username: string,
    commentText: string
  ): Promise<Comment> => {
    const response = await createComment(blogId, {
      name: username,
      comment: commentText,
    });
    return mapCommentResponse(response.data.data);
  },
};
