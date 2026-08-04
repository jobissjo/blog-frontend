"use client";

import { useState, useEffect } from "react";
import { TableOfContents } from "@/components/TableOfContents";
import { PanelRightOpen, List } from "lucide-react";

interface BlogContentLayoutProps {
  content: string;
  hasHeadings: boolean;
  children: React.ReactNode;
}

export default function BlogContentLayout({
  content,
  hasHeadings,
  children,
}: BlogContentLayoutProps) {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("blog_toc_sidebar_hidden");
      if (saved !== null) {
        setIsSidebarHidden(saved === "true");
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarHidden((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("blog_toc_sidebar_hidden", String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  if (!hasHeadings) {
    return <article className="max-w-4xl mx-auto min-w-0">{children}</article>;
  }

  return (
    <div className="relative">
      {/* Top Banner / Toggle Action when Sidebar is Hidden on Desktop */}
      {isMounted && isSidebarHidden && (
        <div className="hidden lg:flex justify-end mb-6 max-w-4xl mx-auto">
          <button
            onClick={toggleSidebar}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-muted border border-border shadow-xs text-foreground transition-all hover:scale-[1.02] cursor-pointer"
            title="Show Table of Contents Sidebar"
          >
            <PanelRightOpen className="h-4 w-4 text-primary" />
            <span>Show Table of Contents</span>
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div
        className={`grid grid-cols-1 gap-12 items-start transition-all duration-300 ${
          isSidebarHidden
            ? "max-w-4xl mx-auto lg:grid-cols-1"
            : "max-w-6xl mx-auto lg:grid-cols-12"
        }`}
      >
        {/* Main Article Content (expands to full width when sidebar is hidden) */}
        <article
          className={`min-w-0 transition-all duration-300 ${
            isSidebarHidden ? "lg:col-span-1" : "lg:col-span-8"
          }`}
        >
          {/* Mobile TOC (always visible inside article on small screens) */}
          <TableOfContents content={content} />

          {children}
        </article>

        {/* Desktop Sticky Sidebar TOC */}
        {!isSidebarHidden && (
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-8 animate-in fade-in duration-300">
            <div className="rounded-2xl border border-border/80 bg-card/50 p-6 backdrop-blur-xs shadow-xs">
              <TableOfContents
                content={content}
                onHideSidebar={toggleSidebar}
                isHideable={true}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Floating Bottom-Right Toggle Pill Button when Sidebar is Hidden */}
      {isMounted && isSidebarHidden && (
        <button
          onClick={toggleSidebar}
          type="button"
          className="hidden lg:flex fixed bottom-8 right-8 z-40 items-center gap-2 bg-primary text-primary-foreground shadow-xl hover:shadow-2xl px-4 py-2.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 cursor-pointer animate-in slide-in-from-bottom-4 duration-200"
          title="Show Table of Contents"
        >
          <List className="h-4 w-4" />
          <span>On this page</span>
        </button>
      )}
    </div>
  );
}
