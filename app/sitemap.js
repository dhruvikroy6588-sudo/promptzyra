import { seedPosts } from "@/lib/seed-posts";
export default function sitemap() {
  const base = "https://promptzyra.com";
  return [{url:base,lastModified:new Date(),changeFrequency:"daily",priority:1},
    {url:`${base}/about`,lastModified:new Date(),changeFrequency:"monthly",priority:0.4},
    ...seedPosts.map(p=>({url:`${base}/blog/${p.slug}`,lastModified:new Date(p.publishedAt||"2026-10-27"),changeFrequency:"monthly",priority:0.7})),
    ...["/contact","/privacy-policy","/terms"].map(path=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:"yearly",priority:0.3}))];
}
