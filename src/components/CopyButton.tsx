"use client";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Check, Copy } from "lucide-react";

export function CopyButton({ code }: { code: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(code)}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/60 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all duration-200"
      aria-label="Copy code"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}