import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://blog.jotech.in").replace(/\/+$/, "");

    let blogUrls: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(
            "https://blog-fastapi-drab.vercel.app/api/blog"
        );
        const data = await res.json();
        const blogs = data?.data?.data || [];
        blogUrls = blogs.map((blog: any) => ({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: new Date(blog.updated_at || blog.created_at || Date.now()),
            changeFrequency: "weekly" as const,
            priority: 0.9,
        }));
    } catch (error) {
        console.error("Error fetching blogs for sitemap:", error);
    }

    const seriesUrl = `${baseUrl}/series`;
    let seriesUrls: MetadataRoute.Sitemap = [
        {
            url: seriesUrl,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        },
    ];

    try {
        const seriesRes = await fetch(
            "https://blog-fastapi-drab.vercel.app/api/series/"
        );
        const seriesData = await seriesRes.json();
        const series = seriesData?.data || [];
        const seriesAllUrls = series.map((s: any) => ({
            url: `${baseUrl}/series/${s.slug}`,
            lastModified: new Date(s.updated_at || Date.now()),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        }));
        seriesUrls = [...seriesUrls, ...seriesAllUrls];
    } catch (error) {
        console.error("Error fetching series for sitemap:", error);
    }

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        },
    ];

    return [
        ...staticPages,
        ...blogUrls,
        ...seriesUrls,
    ];
}
