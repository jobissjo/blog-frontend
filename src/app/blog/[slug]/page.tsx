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
import RelatedBlogs from "./RelatedBlogs";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

// Fetch related blogs
async function getRelatedBlogs(slug: string) {
  const res = await fetch(`${API_BASE}/api/blog/${slug}/related`, { next: { revalidate: 3600 } });
  console.log(res, 'res');
  if (!res.ok) return [];
  const data = await res.json();
  console.log(data.data);
  return data.data.slice(0, 3);
}

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

// 🔥 Dynamic SEO per blog
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const {slug} = await params;
  const blog = await getBlog(slug);

  if (!blog) return {};
  const excerpt = getBlogExcerpt(blog.content, 160);

  return {
    title: blog.title,
    description: excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: excerpt,
      url: `${SITE_URL}/blog/${blog.slug}`,
      images: [
        {
          url: blog.thumbnail,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: excerpt,
      images: [blog.thumbnail],
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
  const relatedBlogs = await getRelatedBlogs(blog.slug);
  const excerpt = getBlogExcerpt(blog.content, 180);

  // 🔥 Structured Data (Article Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: blog.thumbnail,
    datePublished: blog.created_at,
    dateModified: blog.updated_at,
    author: {
      "@type": "Person",
      name: blog.user_details?.firstName || "Jobi",
    },
    mainEntityOfPage: `${SITE_URL}/blog/${blog.slug}`,
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

        {/* Related Blogs */}
        <RelatedBlogs blogs={relatedBlogs} />
      </article>

      <BlogChatBot slug={blog.slug} blogTitle={blog.title} />
    </div>
  );
}
