export const revalidate = 3600;
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Interactions from "./Interactions";
import GoogleAd from "@/components/GoogleAd";
import { getBlogExcerpt } from "@/lib/blogExcerpt";
import BlogMetaBar from "./BlogMetaBar";
import BlogChatBot from "./BlogChatBot";
import RelatedBlogs from "./RelatedBlogs";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { getReadingTime } from "@/lib/readingTime";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { TableOfContents } from "@/components/TableOfContents";
import { extractHeadings } from "@/lib/toc";
import { AuthorCard } from "@/components/AuthorCard";
import { ChevronRight, Home, Tag } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

// Fetch related blogs
async function getRelatedBlogs(slug: string) {
  try {
    if (!API_BASE) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not defined");
      return [];
    }
    
    const url = `${API_BASE}/api/blog/${slug}/related`;
    const res = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      console.error(`Failed to fetch related blogs for ${slug}: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    if (!data || !data.data) return [];
    return data.data.slice(0, 3);
  } catch (error) {
    console.error(`Error in getRelatedBlogs for ${slug}:`, error);
    return [];
  }
}

interface BlogSlugParam {
  slug: string;
}

// Fetch single blog
async function getBlog(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/blog/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching blog ${slug}:`, error);
    return null;
  }
}

// 🔥 Static generation of all blog pages
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/api/blog`);
    const data = await res.json();
    return data.data.data.map((blog: BlogSlugParam) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

// 🔥 Enhanced Dynamic SEO per blog
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return {};
  const excerpt = getBlogExcerpt(blog.content, 160);
  const keywords = blog.content.split(' ').filter((word: string) => word.length > 4).slice(0, 10).join(', ');

  return {
    title: `${blog.title} | JoTechBlog`,
    description: excerpt,
    keywords: keywords,
    authors: [{ name: blog.user_details?.firstName || "Jobi" }],
    alternates: {
      canonical: `${SITE_URL}/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: excerpt,
      url: `${SITE_URL}/blog/${blog.slug}`,
      siteName: "JoTechBlog",
      images: [
        {
          url: blog.thumbnail,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: [blog.user_details?.firstName || "Jobi"],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: excerpt,
      images: [blog.thumbnail],
      creator: "@jotechblog",
      site: "@jotechblog",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return notFound();
  const relatedBlogs = await getRelatedBlogs(blog.slug);
  const excerpt = getBlogExcerpt(blog.content, 180);
  const readingTime = getReadingTime(blog.content);
  const hasHeadings = extractHeadings(blog.content).length > 0;

  // Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${blog.slug}#blogposting`,
    "headline": blog.title,
    "description": excerpt,
    "image": [
      blog.thumbnail,
      `${blog.thumbnail}?width=1200&height=630`,
      `${blog.thumbnail}?width=800&height=600`
    ],
    "datePublished": blog.created_at,
    "dateModified": blog.updated_at,
    "author": {
      "@type": "Person",
      "@id": `${SITE_URL}#author`,
      "name": blog.user_details?.firstName || "Jobi",
      "url": blog.user_details?.profile?.portfolio_link || `${SITE_URL}`,
      "jobTitle": "Backend Engineer"
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      "name": "JoTechBlog",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
        "width": 1200,
        "height": 630
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${blog.slug}`
    },
    "keywords": blog.content.split(' ').filter((word: string) => word.length > 4).slice(0, 10).join(', '),
    "articleSection": "Technology",
    "wordCount": blog.content.split(' ').length,
    "inLanguage": "en-US",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `${SITE_URL}/blog/${blog.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <ReadingProgressBar />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="container mx-auto px-4 pt-6 pb-16 max-w-6xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground flex-wrap">
            <li>
              <a href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </a>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            </li>
            <li>
              <a href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </a>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            </li>
            <li className="text-foreground font-medium truncate max-w-xs md:max-w-md">
              {blog.title}
            </li>
          </ol>
        </nav>

        {/* Hero Header Section */}
        <header className="max-w-4xl mx-auto mb-10">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-4">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-normal mb-6">
              {excerpt}
            </p>
          )}

          {/* Meta bar */}
          <BlogMetaBar
            slug={blog.slug}
            initialViews={blog.view_count}
            initialLikes={blog.likes}
            initialLiked={blog.liked}
            readingTime={readingTime}
            authorName={
              blog.user_details?.firstName
                ? `${blog.user_details.firstName}${blog.user_details.lastName ? ` ${blog.user_details.lastName}` : ""}`
                : "Jobi"
            }
            authorPortfolioLink={blog.user_details?.profile?.portfolio_link}
            authorAvatar={blog.user_details?.profile?.image}
            createdAt={blog.created_at}
            title={blog.title}
          />

          {/* Main Thumbnail Image */}
          {blog.thumbnail && (
            <div className="relative overflow-hidden rounded-2xl border border-border shadow-xl mb-12 bg-card">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full max-h-[520px] object-cover transition-transform duration-500 hover:scale-[1.01]"
              />
            </div>
          )}
        </header>

        {/* Article Body + Sidebar Layout */}
        {hasHeadings ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
            {/* Main Article Content */}
            <article className="lg:col-span-8 min-w-0">
              {/* Mobile TOC */}
              <TableOfContents content={blog.content} />

              {/* Rendered Markdown */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <MarkdownRenderer content={blog.content} />
              </div>

              {/* Author Bio Card */}
              <AuthorCard
                userDetails={blog.user_details}
                authorName={
                  blog.user_details?.firstName
                    ? `${blog.user_details.firstName}${blog.user_details.lastName ? ` ${blog.user_details.lastName}` : ""}`
                    : "Jobi"
                }
              />

              {/* Google Ads */}
              <GoogleAd adSlot="5428778070" className="my-10" />

              {/* Client-side interactions & Comments */}
              <Interactions blog={blog} />
            </article>

            {/* Desktop Sticky Sidebar TOC */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-8">
              <div className="rounded-2xl border border-border/80 bg-card/50 p-6 backdrop-blur-xs shadow-xs">
                <TableOfContents content={blog.content} />
              </div>
            </aside>
          </div>
        ) : (
          <article className="max-w-4xl mx-auto min-w-0">
            {/* Rendered Markdown */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownRenderer content={blog.content} />
            </div>

            {/* Author Bio Card */}
            <AuthorCard
              userDetails={blog.user_details}
              authorName={
                blog.user_details?.firstName
                  ? `${blog.user_details.firstName}${blog.user_details.lastName ? ` ${blog.user_details.lastName}` : ""}`
                  : "Jobi"
              }
            />

            {/* Google Ads */}
            <GoogleAd adSlot="5428778070" className="my-10" />

            {/* Client-side interactions & Comments */}
            <Interactions blog={blog} />
          </article>
        )}

        {/* Related Articles */}
        <div className="max-w-6xl mx-auto">
          <RelatedBlogs blogs={relatedBlogs} />
        </div>
      </main>

      <NewsletterSignup />
      <BlogChatBot slug={blog.slug} blogTitle={blog.title} />
    </div>
  );
}
