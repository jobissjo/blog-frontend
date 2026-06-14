"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";
import type { ComponentPropsWithoutRef } from "react";

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }: CodeProps) {
          const code = String(children).replace(/\n$/, "");
          const language = className?.replace("language-", "") ?? "";

          if (inline) {
            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <div className="relative group my-6">
              {/* Language badge */}
              {language && (
                <span className="absolute top-3 left-4 text-xs text-muted-foreground font-mono select-none">
                  {language}
                </span>
              )}

              {/* Copy button — visible on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton code={code} />
              </div>

              <pre className="overflow-x-auto rounded-lg bg-muted/50 border border-border px-4 pt-10 pb-5 text-sm font-mono leading-relaxed">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}