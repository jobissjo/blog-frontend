export const revalidate = 3600;
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Interactions from "./Interactions";
import GoogleAd from "@/components/GoogleAd";
import { getBlogExcerpt } from "@/lib/blogExcerpt";
import BlogMetaBar from "./BlogMetaBar";
import BlogChatBot from "./BlogChatBot";
import RelatedPosts from "./RelatedPosts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

interface BlogSlugParam {
  slug: string;
}

// Fetch single blog
async function getBlog(slug: string) {
  const res = await fetch(`${API_BASE}/api/blog/${slug}`);

  if (!res.ok) return null;

  const data = await res.json();

  return data.data;
}

// 🔥 Static generation of all blog pages
export async function generateStaticParams() {
  const res = await fetch(`${API_BASE}/api/blog`);
  const data = await res.json();

  return data.data.data.map((blog: BlogSlugParam) => ({
    slug: blog.slug,
  }));
}

// 🔥 Enhanced Dynamic SEO per blog
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const {slug} = await params;
  const blog = await getBlog(slug);

  if (!blog) return {};
  const excerpt = getBlogExcerpt(blog.content, 160);
  const keywords = blog.content.split(' ').filter((word: string) => word.length > 4).slice(0, 10).join(', ');

  return {
    title: blog.title,
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
      siteName: "Jotech Blog",
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
  const {slug} = await params;
  const blog = await getBlog(slug);

  if (!blog) return notFound();
  const excerpt = getBlogExcerpt(blog.content, 180);

  // 🔥 Enhanced Structured Data (Article Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": excerpt,
    "image": blog.thumbnail,
    "datePublished": blog.created_at,
    "dateModified": blog.updated_at,
    "author": {
      "@type": "Person",
      "name": blog.user_details?.firstName || "Jobi",
      "url": blog.user_details?.profile?.portfolio_link || `${SITE_URL}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Jotech Blog",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
      },
    },
    "mainEntityOfPage": `${SITE_URL}/blog/${blog.slug}`,
    "keywords": blog.content.split(' ').filter((word: string) => word.length > 4).slice(0, 10).join(', '),
    "articleSection": "Technology",
    "wordCount": blog.content.split(' ').length,
  };

  // 🔥 Breadcrumb Structured Data
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
    <div className="min-h-screen bg-background">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* 🔥 Breadcrumb Navigation */}
      <nav className="container mx-auto px-4 py-4 max-w-4xl" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
          </li>
          <li>/</li>
          <li>
            <a href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </a>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium truncate max-w-xs">
            {blog.title}
          </li>
        </ol>
      </nav>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {blog.title}
        </h1>

        {excerpt && (
          <p className="mb-6 text-lg leading-8 text-muted-foreground">
            {excerpt}
          </p>
        )}

        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="rounded-lg mb-8 w-full"
        />

        <BlogMetaBar
          slug={blog.slug}
          initialViews={blog.view_count}
          initialLikes={blog.likes}
          initialLiked={blog.liked}
          authorName={
            blog.user_details?.firstName
              ? `${blog.user_details.firstName}${blog.user_details.lastName ? ` ${blog.user_details.lastName}` : ""}`
              : "Jobi"
          }
          authorPortfolioLink={blog.user_details?.profile?.portfolio_link}
        />

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>

        <GoogleAd
          adSlot="5428778070"
          className="mb-12"
        />

        {/* Client-side interactions */}
        <Interactions blog={blog} />
        
        <RelatedPosts 
          currentBlogId={blog.id}
          currentBlogTitle={blog.title}
          seriesId={blog.series_id}
        />
      </article>

      <BlogChatBot slug={blog.slug} blogTitle={blog.title} />
    </div>
  );
}
