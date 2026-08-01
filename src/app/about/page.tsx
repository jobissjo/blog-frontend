import type { Metadata } from "next";
import Header from "@/components/Header";
import { Github, Globe, ArrowRight, Code2, Terminal, Cpu, Layers, Sparkles } from "lucide-react";
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
  { category: "Backend", icon: Terminal, items: ["Django", "Django REST Framework", "FastAPI", "Python"] },
  { category: "Frontend", icon: Code2, items: ["Angular", "React", "Next.js", "TypeScript"] },
  { category: "Architecture", icon: Cpu, items: ["System Design", "REST APIs", "Microservices", "PostgreSQL"] },
  { category: "DevOps & Tools", icon: Layers, items: ["Docker", "Vercel", "Linux", "Git"] },
];

const topics = [
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
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/jobissjo",
    icon: Github,
    description: "Explore open-source repositories & side projects",
  },
  {
    label: "Portfolio",
    href: "https://jobiss.vercel.app/",
    icon: Globe,
    description: "Full portfolio, experience & work showcase",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header />

      <main className="container mx-auto px-4 max-w-4xl py-12 md:py-20 relative overflow-hidden">
        {/* Glowing Ambient Background */}
        <div className="absolute -z-10 top-[-10%] left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-r from-primary/15 via-purple-500/10 to-accent/15 rounded-full blur-[130px] pointer-events-none" />

        {/* ── Hero Section ── */}
        <section className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-xs select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer & Technical Writer</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.12]">
            Hi, I'm{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-purple-500">
              Jobi 👋
            </span>
          </h1>

          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed font-normal">
            <p>
              I'm a Full Stack Developer with 3–5 years of experience building web applications — from robust backend APIs to clean, responsive frontends. I work primarily with{" "}
              <span className="text-foreground font-semibold">Django</span>,{" "}
              <span className="text-foreground font-semibold">FastAPI</span>,{" "}
              <span className="text-foreground font-semibold">Angular</span>, and{" "}
              <span className="text-foreground font-semibold">React</span>.
            </p>
            <p>
              I started JoTechBlog as a dedicated space to share what I learn while building — the gotchas, the patterns that actually work, and the solutions to real engineering problems. Every article here comes directly from hands-on project experience.
            </p>
            <p>
              My focus is on writing content that is practical and to the point — no filler, just clear concepts and code you can apply right away.
            </p>
          </div>
        </section>

        <hr className="my-12 h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* ── What I Write About ── */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              What I write about
            </h2>
            <p className="text-muted-foreground mt-1">
              JoTechBlog covers full-stack architecture, API engineering, and frontend optimization.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <div
                key={topic.title}
                className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm shadow-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-2xl flex items-center justify-center mb-4 shadow-xs">
                    {topic.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-12 h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* ── Tech Stack ── */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Tech stack
            </h2>
            <p className="text-muted-foreground mt-1">
              Tools and frameworks I work with day-to-day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {skills.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.category}
                  className="rounded-2xl border border-border/70 bg-card/40 p-6 backdrop-blur-xs"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {group.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-full text-xs font-medium border border-border/80 bg-muted/60 text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <hr className="my-12 h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* ── Let's Connect ── */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Let's connect
            </h2>
            <p className="text-muted-foreground mt-1">
              Always happy to connect with fellow engineers, collaborate, or talk shop.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {socialLinks.map(({ label, href, icon: Icon, description }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm shadow-xs hover:border-primary/40 hover:bg-card hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {description}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
                />
              </a>
            ))}
          </div>
        </section>

        {/* ── CTA Card ── */}
        <section className="rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 via-card to-card p-8 md:p-10 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 tracking-tight">
            Ready to explore?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Browse articles on Django, FastAPI, system design, and modern full-stack development.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
            <span>Browse All Articles</span>
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  );
}