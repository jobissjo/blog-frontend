"use client";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({ code }: { code: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={async () => {
        if (!await copy(code)) toast.error("Unable to copy. Please select and copy the code manually.");
      }}
      className="inline-flex min-h-10 items-center gap-1.5 px-2.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
      aria-label={copied ? "Code copied" : "Copy code"}
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
