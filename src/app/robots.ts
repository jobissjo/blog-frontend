export default function robots() {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://blog.jotech.in").replace(/\/+$/, "");

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/login", "/api"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    };
}
