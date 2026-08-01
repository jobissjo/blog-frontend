"use client";

import { useEffect, useState } from "react";
import { AlignLeft, ChevronDown, List } from "lucide-react";
import { extractHeadings, slugifyHeading, TocItem } from "@/lib/toc";

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const items = extractHeadings(content);
    setHeadings(items);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -40% 0px", threshold: 0.5 }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Collapsible TOC */}
      <div className="lg:hidden mb-8 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left font-semibold text-sm text-foreground"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-primary" />
            Table of Contents
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <nav className="mt-3 pt-3 border-t border-border/60 space-y-1.5 text-sm">
            {headings.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(item.id);
                }}
                className={`block py-1 transition-colors ${
                  item.level === 3 ? "pl-4 text-xs" : "font-medium"
                } ${
                  activeId === item.id
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <nav aria-label="Table of contents" className="hidden lg:block space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/60 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
          <AlignLeft className="h-4 w-4 text-primary" />
          <span>On this page</span>
        </div>
        <ul className="space-y-1 text-sm max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin">
          {headings.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(item.id);
                  }}
                  className={`block transition-all duration-200 rounded-md px-2.5 py-1.5 leading-snug ${
                    item.level === 3 ? "ml-3 text-xs" : "text-sm font-medium"
                  } ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-3"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
