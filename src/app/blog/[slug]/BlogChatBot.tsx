"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

interface BlogChatBotProps {
  slug: string;
  blogTitle: string;
}

export default function BlogChatBot({ slug, blogTitle }: BlogChatBotProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! Ask me anything about \"${blogTitle}\".`,
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const storageKey = useMemo(() => `blog_chat_${slug}`, [slug]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
      }
    } catch {
      return;
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      return;
    }
  }, [messages, storageKey]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages.length]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBase) {
      toast.error("NEXT_PUBLIC_API_BASE_URL is not set");
      return;
    }

    setSending(true);
    setInput("");

    const requestId = Date.now();

    const userMessage: ChatMessage = {
      id: `${requestId}_u`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch(`${apiBase}/api/blog/${slug}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: text }),
      });

      const json = (await res.json()) as {
        data?: { answer?: string };
        success?: boolean;
        message?: string;
      };

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Chat request failed");
      }

      const answerText = json?.data?.answer || "";

      const assistantMessage: ChatMessage = {
        id: `${requestId}_a`,
        role: "assistant",
        content: answerText || "No answer returned.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setMessages((prev) => [
        ...prev,
        {
          id: `${requestId}_a_err`,
          role: "assistant",
          content: "Sorry, I couldn't answer that right now.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
            <MessageCircle className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[92vw] sm:w-[420px] p-0">
          <div className="flex h-full flex-col">
            <SheetHeader className="px-6 pt-6 pb-4">
              <SheetTitle>Chat</SheetTitle>
            </SheetHeader>
            <Separator />

            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      m.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                          : "max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm text-foreground"
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <Separator />

            <div className="p-4">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[44px] max-h-[120px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={send}
                  disabled={!input.trim() || sending}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
