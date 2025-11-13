import { Comment } from "@/types/blog";

let comments: Comment[] = [
  {
    id: "1",
    blog_id: "1",
    username: "Sarah Johnson",
    comment: "Great article! TypeScript has really improved my development workflow.",
    created_at: "2024-01-16T08:30:00Z",
  },
  {
    id: "2",
    blog_id: "1",
    username: "Mike Chen",
    comment: "Thanks for the detailed explanation. The examples were very helpful!",
    created_at: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    blog_id: "2",
    username: "Emily Rodriguez",
    comment: "FastAPI is amazing! This guide made it so easy to get started.",
    created_at: "2024-01-21T10:15:00Z",
  },
];

export const commentService = {
  // Get comments by blog ID
  getCommentsByBlogId: (blogId: string): Comment[] => {
    return comments
      .filter(comment => comment.blog_id === blogId)
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  },

  // Add comment
  addComment: (blogId: string, username: string, commentText: string): Comment => {
    const newComment: Comment = {
      id: Date.now().toString(),
      blog_id: blogId,
      username,
      comment: commentText,
      created_at: new Date().toISOString(),
    };
    comments.push(newComment);
    return newComment;
  },

  // Delete comment
  deleteComment: (id: string): boolean => {
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) return false;

    comments.splice(index, 1);
    return true;
  },

  // Get total comments count for a blog
  getCommentsCount: (blogId: string): number => {
    return comments.filter(c => c.blog_id === blogId).length;
  },
};
