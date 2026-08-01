"use client";

import { useMemo, useState } from "react";
import { Clock, Eye, Heart, Share2, Check, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { blogService } from "@/services/blogService";

interface BlogMetaBarProps {
  slug: string;
  initialViews?: number;
  initialLikes?: number;
  initialLiked?: boolean;
  authorName: string;
  authorPortfolioLink?: string;
  authorAvatar?: string;
  readingTime: number;
  createdAt?: string;
  title?: string;
}

export default function BlogMetaBar({
  slug,
  initialViews,
  initialLikes,
  initialLiked,
  authorName,
  authorPortfolioLink,
  authorAvatar,
  readingTime,
  createdAt,
  title = "",
}: BlogMetaBarProps) {
  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [likesCount, setLikesCount] = useState(typeof initialLikes === "number" ? initialLikes : 0);
  const [copied, setCopied] = useState(false);

  const viewsCount = useMemo(() => {
    return typeof initialViews === "number" ? initialViews : 0;
  }, [initialViews]);

  const formattedDate = useMemo(() => {
    if (!createdAt) return null;
    try {
      return new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [createdAt]);

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

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Article link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out "${title}" by @jotechblog`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  };

  const handleShareLinkedin = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  return (
    <div className="my-8 py-4 px-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-xs flex flex-wrap items-center justify-between gap-4">
      {/* Left side: Author & Meta details */}
      <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground">
        {/* Author */}
        <div className="flex items-center gap-2">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-border"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}

          {authorPortfolioLink ? (
            <a
              href={authorPortfolioLink}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              {authorName}
            </a>
          ) : (
            <span className="font-medium text-foreground">{authorName}</span>
          )}
        </div>

        <span className="text-border">•</span>

        {/* Date */}
        {formattedDate && (
          <>
            <span>{formattedDate}</span>
            <span className="text-border">•</span>
          </>
        )}

        {/* Read time */}
        <div className="flex items-center gap-1.2">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{readingTime} min read</span>
        </div>

        <span className="text-border">•</span>

        {/* Views */}
        <div className="flex items-center gap-1.2">
          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{viewsCount.toLocaleString()} views</span>
        </div>
      </div>

      {/* Right side: Interactive Like & Share */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleLike}
          disabled={liked}
          aria-label="Like post"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            liked
              ? "bg-rose-500/10 text-rose-500 border border-rose-500/30"
              : "bg-muted hover:bg-muted/80 text-foreground border border-border"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
          <span>{likesCount}</span>
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Share buttons */}
        <button
          type="button"
          onClick={handleCopyLink}
          title="Copy link"
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={handleShareTwitter}
          title="Share on Twitter/X"
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Twitter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleShareLinkedin}
          title="Share on LinkedIn"
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Linkedin className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
