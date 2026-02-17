export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://jo-tech-blog.vercel.app/sitemap.xml",
  };
}
