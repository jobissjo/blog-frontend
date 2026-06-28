import SeriesDetailClient from "./SeriesDetailClient";
import type { Metadata } from "next";

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const displayName = formatSlug(slug);
  return {
    title: `${displayName} Series — JoTechBlog`,
    description: `Browse articles in the ${displayName} tutorial series on JoTechBlog.`,
    alternates: {
      canonical: `/series/${slug}`,
    },
  };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <SeriesDetailClient slug={slug} />;
}
