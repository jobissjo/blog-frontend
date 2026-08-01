"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";
import { slugifyHeading } from "./TableOfContents";
import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Link as LinkIcon } from "lucide-react";

function getTextContent(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getTextContent).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(children)) {
    return getTextContent(children.props.children);
  }

  return "";
}

function getCodeClassName(children: ReactNode): string | undefined {
  let className: string | undefined;

  Children.forEach(children, (child) => {
    if (className || !isValidElement<{ className?: string; children?: ReactNode }>(child)) {
      return;
    }

    className = child.props.className ?? getCodeClassName(child.props.children);
  });

  return className;
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1({ children }) {
          const text = getTextContent(children);
          const id = slugifyHeading(text);
          return (
            <h1
              id={id}
              className="group relative scroll-mt-24 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mt-12 mb-6 pb-2 border-b border-border/60"
            >
              <a href={`#${id}`} className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary font-normal hidden md:inline-block">
                #
              </a>
              {children}
            </h1>
          );
        },
        h2({ children }) {
          const text = getTextContent(children);
          const id = slugifyHeading(text);
          return (
            <h2
              id={id}
              className="group relative scroll-mt-24 text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-10 mb-4 pb-2 border-b border-border/40"
            >
              <a href={`#${id}`} className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary font-normal hidden md:inline-block">
                #
              </a>
              {children}
            </h2>
          );
        },
        h3({ children }) {
          const text = getTextContent(children);
          const id = slugifyHeading(text);
          return (
            <h3
              id={id}
              className="group relative scroll-mt-24 text-xl md:text-2xl font-semibold tracking-tight text-foreground mt-8 mb-3"
            >
              <a href={`#${id}`} className="absolute -left-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary font-normal hidden md:inline-block">
                #
              </a>
              {children}
            </h3>
          );
        },
        h4({ children }) {
          const text = getTextContent(children);
          const id = slugifyHeading(text);
          return (
            <h4
              id={id}
              className="scroll-mt-24 text-lg font-semibold tracking-tight text-foreground mt-6 mb-2"
            >
              {children}
            </h4>
          );
        },
        p({ children }) {
          return (
            <p className="text-base md:text-lg leading-relaxed md:leading-8 text-muted-foreground mb-6">
              {children}
            </p>
          );
        },
        ul({ children }) {
          return (
            <ul className="my-6 space-y-2.5 pl-2 list-none">
              {children}
            </ul>
          );
        },
        ol({ children }) {
          return (
            <ol className="my-6 space-y-2.5 pl-6 list-decimal marker:text-primary marker:font-semibold text-muted-foreground">
              {children}
            </ol>
          );
        },
        li({ children }) {
          return (
            <li className="text-base md:text-lg leading-relaxed text-muted-foreground flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
              <div className="flex-1">{children}</div>
            </li>
          );
        },
        blockquote({ children }) {
          return (
            <blockquote className="relative my-8 border-l-4 border-primary bg-primary/5 dark:bg-primary/10 rounded-r-xl px-6 py-4 italic text-foreground/90 shadow-xs">
              <div className="text-base md:text-lg leading-relaxed">{children}</div>
            </blockquote>
          );
        },
        hr() {
          return (
            <hr className="my-10 h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-8 rounded-xl border border-border shadow-xs bg-card">
              <table className="w-full text-left text-sm text-muted-foreground border-collapse">
                {children}
              </table>
            </div>
          );
        },
        thead({ children }) {
          return (
            <thead className="bg-muted/70 text-foreground font-semibold border-b border-border uppercase text-xs tracking-wider">
              {children}
            </thead>
          );
        },
        tbody({ children }) {
          return <tbody className="divide-y divide-border/60">{children}</tbody>;
        },
        tr({ children }) {
          return <tr className="hover:bg-muted/30 transition-colors">{children}</tr>;
        },
        th({ children }) {
          return <th className="px-4 py-3 font-semibold">{children}</th>;
        },
        td({ children }) {
          return <td className="px-4 py-3">{children}</td>;
        },
        img({ src, alt }) {
          return (
            <span className="block my-8">
              <img
                src={src}
                alt={alt || "Blog image"}
                className="rounded-xl border border-border shadow-md w-full max-h-[500px] object-cover"
                loading="lazy"
              />
              {alt && (
                <span className="block text-center text-xs text-muted-foreground mt-2 italic">
                  {alt}
                </span>
              )}
            </span>
          );
        },
        pre({ children }) {
          const code = getTextContent(children).replace(/\n$/, "");
          const className = getCodeClassName(children);
          const languageClassName = className?.match(/language-[^\s]+/)?.[0];
          const language = languageClassName?.replace("language-", "") ?? "code";

          return (
            <div className="relative my-8 rounded-xl border border-border bg-slate-950 text-slate-100 shadow-lg overflow-hidden group">
              {/* Window Bar Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  {language}
                </span>
                <div className="flex items-center">
                  <CopyButton code={code} />
                </div>
              </div>

              {/* Code Pre container */}
              <pre className="overflow-x-auto p-4 text-xs md:text-sm font-mono leading-relaxed text-slate-100 scrollbar-thin scrollbar-thumb-slate-700">
                <code className={languageClassName}>{code}</code>
              </pre>
            </div>
          );
        },
        code({ className, children, ...props }: ComponentPropsWithoutRef<"code">) {
          // If code is inside a pre block, return simple code tag
          if (className?.includes("language-")) {
            return <code className={className} {...props}>{children}</code>;
          }

          return (
            <code
              className="bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-md text-xs font-mono font-medium"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
