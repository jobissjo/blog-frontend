export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: "https://jotechblog.netlify.app/sitemap.xml",
    };
}
