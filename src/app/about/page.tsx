import type { Metadata } from "next";
import Header from "@/components/Header";
import { Github, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — JoTechBlog",
  description:
    "Learn about Jobi, a Full Stack Developer writing practical tutorials on Django, FastAPI, System Design, Angular and React.",
  alternates: {
    canonical: "/about",
  },
};

const skills = [
  { category: "Backend", items: ["Django", "Django REST Framework", "FastAPI", "Python"] },
  { category: "Frontend", items: ["Angular", "React", "Next.js", "TypeScript"] },
  { category: "Architecture", items: ["System Design", "REST APIs", "Microservices", "PostgreSQL"] },
  { category: "DevOps", items: ["Docker", "Vercel", "Linux", "Git"] },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/jobissjo", // 👈 replace
    icon: Github,
    description: "See what I'm building",
  },
  {
    label: "Portfolio",
    href: "https://jobiss.vercel.app/", // 👈 replace
    icon: Globe,
    description: "My work & projects",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 max-w-3xl py-16">

        {/* ── Hero ── */}
        <section className="mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            About
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Hi, I'm Jobi 👋
          </h1>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              I'm a Full Stack Developer with 3–5 years of experience building
              web applications — from robust backend APIs to clean, responsive
              frontends. I work primarily with{" "}
              <span className="text-foreground font-medium">Django</span>,{" "}
              <span className="text-foreground font-medium">FastAPI</span>,{" "}
              <span className="text-foreground font-medium">Angular</span>, and{" "}
              <span className="text-foreground font-medium">React</span>.
            </p>
            <p>
              I started JoTechBlog as a place to share what I learn while
              building — the gotchas, the patterns that actually work, and the
              things I wish someone had written down when I was figuring them
              out. Every article here comes from real problems I've solved on
              real projects.
            </p>
            <p>
              My focus is on writing content that is practical and to the point
              — no filler, just the concepts and code you need to move forward.
            </p>
          </div>
        </section>

        <hr className="border-border mb-16" />

        {/* ── What I write about ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            What I write about
          </h2>
          <p className="text-muted-foreground mb-8">
            JoTechBlog covers the full stack — backend architecture, frontend
            patterns, and everything in between.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                emoji: "🐍",
                title: "Django & DRF",
                desc: "REST APIs, authentication, ORM deep-dives, and production patterns with Django and Django REST Framework.",
              },
              {
                emoji: "⚡",
                title: "FastAPI",
                desc: "Building async APIs, dependency injection, background tasks, and integrating FastAPI into real-world projects.",
              },
              {
                emoji: "🏗️",
                title: "System Design",
                desc: "Scalable architecture, database design, caching strategies, and the decisions behind building systems that last.",
              },
              {
                emoji: "🖥️",
                title: "Angular & React",
                desc: "Component architecture, state management, performance optimisation, and building polished user interfaces.",
              },
            ].map((topic) => (
              <div
                key={topic.title}
                className="rounded-xl border border-border bg-muted/30 p-5 hover:border-primary/40 transition-colors"
              >
                <div className="text-2xl mb-3">{topic.emoji}</div>
                <h3 className="font-semibold text-foreground mb-1">
                  {topic.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {topic.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-border mb-16" />

        {/* ── Skills ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Tech stack
          </h2>
          <p className="text-muted-foreground mb-8">
            Tools and technologies I use day-to-day and write about on this blog.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {skills.map((group) => (
              <div key={group.category}>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-full text-sm border border-border bg-muted/40 text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-border mb-16" />

        {/* ── Connect ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Let's connect
          </h2>
          <p className="text-muted-foreground mb-8">
            I'm always happy to chat about backend architecture, career advice,
            or anything web development related.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {socialLinks.map(({ label, href, icon: Icon, description }) => (
            <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 flex-1 rounded-xl border border-border bg-muted/30 px-5 py-4 hover:border-primary/40 hover:bg-muted/50 transition-all group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                />
              </a>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Start reading
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
            Browse articles on Django, FastAPI, system design, and full stack
            development.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Browse articles <ArrowRight size={15} />
          </Link>
        </section>

      </main>
    </div>
  );
}