"use client";

import { useState } from "react";
import { blogService } from "@/services/blogService";
import { commentService } from "@/services/commentService";
import CommentSection from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Blog, Comment } from "@/types/blog";
import { Heart, MessageSquare } from "lucide-react";

interface Props {
  blog: Blog;
}

export default function Interactions({ blog }: Props) {
  const [liked, setLiked] = useState(Boolean(blog.liked));
  const [likesCount, setLikesCount] = useState(blog.likes || 0);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleLike = async () => {
    if (liked) return;

    setLiked(true);
    setLikesCount((prev) => prev + 1);

    try {
      await blogService.incrementLikes(blog.slug);
      toast.success("Thanks for liking this article!");
    } catch {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
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
    <section className="mt-14 pt-8 border-t border-border">
      {/* Interaction Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <span>Community Discussion</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Enjoyed this read? Show your support or share your thoughts.
          </p>
        </div>

        <Button
          onClick={handleLike}
          disabled={liked}
          className={`gap-2 font-semibold transition-all shadow-sm ${
            liked
              ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
          <span>{liked ? `Liked (${likesCount})` : `Like Article (${likesCount})`}</span>
        </Button>
      </div>

      {/* Comment Section */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xs">
        <CommentSection
          blogId={blog.id}
          comments={comments}
          onAddComment={handleAddComment}
        />
      </div>
    </section>
  );
}
