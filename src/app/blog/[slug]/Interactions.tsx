"use client";

import { useState } from "react";
import { blogService } from "@/services/blogService";
import { commentService } from "@/services/commentService";
import CommentSection from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Blog, Comment } from "@/types/blog";

interface Props {
  blog: Blog;
}

export default function Interactions({ blog }: Props) {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleLike = async () => {
    if (liked) return;

    try {
      await blogService.incrementLikes(blog.slug);
      setLiked(true);
      toast.success("Thanks for liking this article!");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleAddComment = async (
    username: string,
    commentText: string
  ): Promise<boolean> => {
    try {
      const newComment = await commentService.addComment(
        blog.id,
        username,
        commentText
      );
      setComments((prev) => [newComment, ...prev]);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="mt-12">
      <Button onClick={handleLike} disabled={liked}>
        👍 {liked ? "Liked" : "Like"}
      </Button>

      <CommentSection
        blogId={blog.id}
        comments={comments}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
