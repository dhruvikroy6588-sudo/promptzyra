export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }], sitemap: "https://promptzyra.com/sitemap.xml" };
}
