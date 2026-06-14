"use client";
import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { subscribeNewsletter } from "@/lib/newsletterApi";

type Variant = "default" | "hero" | "minimal";

interface NewsletterSignupProps {
  variant?: Variant;
  className?: string;
}

export function NewsletterSignup({
  variant = "default",
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await subscribeNewsletter(email);

      const data = response.data;

      if (!response.status) {
        setErrorMsg(data.message || "Something went wrong. Try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  // ─── Success state (shared across all variants) ───────────────────
  if (status === "success") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 py-8 text-center",
          className
        )}
      >
        <CheckCircle2 className="text-green-400" size={36} />
        <p className="text-lg font-semibold text-foreground">You're in! 🎉</p>
        <p className="text-sm text-muted-foreground">
          Thanks for subscribing. You'll get the next article straight in your inbox.
        </p>
      </div>
    );
  }

  // ─── VARIANT: minimal (footer) ────────────────────────────────────
  if (variant === "minimal") {
    return (
      <div className={cn("", className)}>
        <p className="text-sm font-medium text-foreground mb-3">
          Get articles in your inbox
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded-md bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ArrowRight size={16} />
            )}
          </button>
        </form>
        {status === "error" && (
          <p className="text-xs text-destructive mt-2">{errorMsg}</p>
        )}
      </div>
    );
  }

  // ─── VARIANT: hero (homepage) ─────────────────────────────────────
  if (variant === "hero") {
    return (
      <section
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background px-8 py-10 text-center my-10",
          className
        )}
      >
        {/* Decorative glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-64 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-4">
            <Mail size={13} /> Newsletter
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Stay ahead in tech
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm md:text-base">
            Get practical tutorials on Django, FastAPI, system design and more —
            delivered straight to your inbox. No spam, unsubscribe anytime.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {status === "loading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Subscribe <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {status === "error" && (
            <p className="text-sm text-destructive mt-3">{errorMsg}</p>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            Join other developers. No spam. Ever.
          </p>
        </div>
      </section>
    );
  }

  // ─── VARIANT: default (end of article) ───────────────────────────
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-muted/40 px-6 py-8 my-12",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Mail size={18} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            📬 Enjoyed this article?
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            Get new posts on Django, FastAPI, and system design straight to your
            inbox. No spam — unsubscribe whenever you want.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {status === "loading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Subscribe <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {status === "error" && (
            <p className="text-sm text-destructive mt-2">{errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}