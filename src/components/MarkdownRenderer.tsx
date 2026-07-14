"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";
import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

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
        pre({ children }) {
          const code = getTextContent(children).replace(/\n$/, "");
          const className = getCodeClassName(children);
          const languageClassName = className?.match(/language-[^\s]+/)?.[0];
          const language = languageClassName?.replace("language-", "") ?? "";

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
                <code className={languageClassName}>
                  {code}
                </code>
              </pre>
            </div>
          );
        },
        code({ className, children, ...props }: ComponentPropsWithoutRef<"code">) {
          return (
            <code
              className={`${className ? `${className} ` : ""}bg-muted px-1.5 py-0.5 rounded text-sm font-mono`}
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
