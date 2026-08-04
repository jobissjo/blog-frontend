"use client";

import { useEffect, useState } from "react";
import { AlignLeft, ChevronDown, ChevronUp, List, PanelRightClose } from "lucide-react";
import { extractHeadings, slugifyHeading, TocItem } from "@/lib/toc";

interface TableOfContentsProps {
  content: string;
  onHideSidebar?: () => void;
  isHideable?: boolean;
}

export function TableOfContents({
  content,
  onHideSidebar,
  isHideable = false,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  useEffect(() => {
    const items = extractHeadings(content);
    setHeadings(items);
  }, [content]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("toc_desktop_collapsed");
      if (saved !== null) {
        setIsDesktopCollapsed(saved === "true");
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleDesktopCollapse = () => {
    setIsDesktopCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("toc_desktop_collapsed", String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

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

  const isContentCollapsed = !onHideSidebar && isDesktopCollapsed;

  return (
    <>
      {/* Mobile Collapsible TOC */}
      <div className="lg:hidden mb-8 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left font-semibold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-primary" />
            Table of Contents
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {headings.length}
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
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
                  item.level > 1 ? `pl-${Math.min(item.level * 2, 8)} text-xs` : "font-medium"
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
        <div className="flex items-center justify-between pb-2 border-b border-border/60 font-semibold text-xs uppercase tracking-wider text-muted-foreground select-none">
          <div className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-primary" />
            <span>On this page</span>
            {isContentCollapsed && (
              <span className="text-[10px] normal-case bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-normal">
                {headings.length} items
              </span>
            )}
          </div>
          {onHideSidebar ? (
            <button
              type="button"
              onClick={onHideSidebar}
              title="Hide table of contents & view full width"
              aria-label="Hide table of contents & view full width"
              className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 px-2 py-1 rounded-md transition-all cursor-pointer"
            >
              <PanelRightClose className="h-3.5 w-3.5" />
              <span>Hide</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleDesktopCollapse}
              title={isDesktopCollapsed ? "Show table of contents" : "Hide table of contents"}
              aria-label={isDesktopCollapsed ? "Show table of contents" : "Hide table of contents"}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 px-2 py-1 rounded-md transition-all cursor-pointer"
            >
              {isDesktopCollapsed ? (
                <>
                  <span>Show</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  <span>Hide</span>
                  <ChevronUp className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${
            isContentCollapsed
              ? "max-h-0 opacity-0 overflow-hidden"
              : "max-h-[calc(100vh-200px)] opacity-100"
          }`}
        >
          <ul className="space-y-1 text-sm max-h-[calc(100vh-220px)] overflow-y-auto pr-2 scrollbar-thin">
            {headings.map((item) => {
              const isActive = activeId === item.id;
              const indentClass =
                item.level === 1
                  ? "text-sm font-semibold"
                  : item.level === 2
                  ? "ml-2 text-sm font-medium"
                  : item.level === 3
                  ? "ml-4 text-xs"
                  : "ml-6 text-xs";

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHeading(item.id);
                    }}
                    className={`block transition-all duration-200 rounded-md px-2.5 py-1.5 leading-snug ${indentClass} ${
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
        </div>
      </nav>
    </>
  );
}
