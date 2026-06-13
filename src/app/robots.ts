export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/login", "/api"],
        },
        sitemap: "https://jotechblog.netlify.app/sitemap.xml",
        host: "https://jotechblog.netlify.app",
    };
}
