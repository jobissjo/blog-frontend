"use client";

import { useMemo, useState } from "react";
import { Eye, Heart, User } from "lucide-react";
import { toast } from "sonner";
import { blogService } from "@/services/blogService";

interface BlogMetaBarProps {
  slug: string;
  initialViews?: number;
  initialLikes?: number;
  initialLiked?: boolean;
  authorName: string;
  authorPortfolioLink?: string;
}

export default function BlogMetaBar({
  slug,
  initialViews,
  initialLikes,
  initialLiked,
  authorName,
  authorPortfolioLink,
}: BlogMetaBarProps) {
  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [likesCount, setLikesCount] = useState(typeof initialLikes === "number" ? initialLikes : 0);

  const viewsCount = useMemo(() => {
    return typeof initialViews === "number" ? initialViews : 0;
  }, [initialViews]);

  const handleLike = async () => {
    if (liked) return;

    setLiked(true);
    setLikesCount((prev) => prev + 1);

    try {
      await blogService.incrementLikes(slug);
      toast.success("Thanks for liking this article!");
    } catch {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Eye className="h-4 w-4" />
        <span className="text-xs font-medium">{viewsCount}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleLike}
          disabled={liked}
          aria-label="Like"
          className={
            "inline-flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          }
        >
          <Heart className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{likesCount}</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <User className="h-3.5 w-3.5" />
        {authorPortfolioLink ? (
          <a
            href={authorPortfolioLink}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium underline underline-offset-4"
          >
            {authorName}
          </a>
        ) : (
          <span className="text-xs font-medium">{authorName}</span>
        )}
      </div>
    </div>
  );
}
