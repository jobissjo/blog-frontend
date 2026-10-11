"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const article = document.getElementById("article-body");
      if (!article) return;
      const top = article.getBoundingClientRect().top + window.scrollY;
      const distance = article.offsetHeight - window.innerHeight + 96;
      const progress = distance > 0 ? (window.scrollY - top + 96) / distance : (window.scrollY + window.innerHeight >= top + article.offsetHeight ? 1 : 0);
      setCompletion(Math.round(Math.min(1, Math.max(0, progress)) * 100));
    };

    window.addEventListener("scroll", updateScrollCompletion, { passive: true });
    window.addEventListener("resize", updateScrollCompletion);
    const observer = new ResizeObserver(updateScrollCompletion);
    observer.observe(document.body);
    updateScrollCompletion();

    return () => {
      window.removeEventListener("scroll", updateScrollCompletion);
      window.removeEventListener("resize", updateScrollCompletion);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-muted/30">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150 ease-out"
        style={{ width: `${completion}%` }}
        role="progressbar"
        aria-label="Article reading progress"
        aria-valuenow={completion}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
