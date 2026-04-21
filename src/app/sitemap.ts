import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://jotechblog.netlify.app";

    const res = await fetch(
        "https://blog-fastapi-drab.vercel.app/api/blog"
    );

    const data = await res.json();

    const blogs = data.data.data;

    const blogUrls = blogs.map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    const seriesUrl = "https://jotechblog.netlify.app/series"
    let seriesUrls = [
        {
            url: seriesUrl,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        },
    ]

    const seriesRes = await fetch(
        "https://blog-fastapi-drab.vercel.app/api/series/"
    );
    const seriesData = await seriesRes.json();
    const series = seriesData.data;
    const seriesAllUrls = series.map((series: any) => ({
        url: `${baseUrl}/series/${series.slug}`,
        lastModified: new Date(series.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    seriesUrls = [...seriesUrls, ...seriesAllUrls]
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        ...blogUrls,
        ...seriesUrls,
    ];
}
