import { useState, useCallback } from "react";
import { copyTextToClipboard } from "@/lib/clipboard";

export function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await copyTextToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, [timeout]);

  return { copied, copy };
}
