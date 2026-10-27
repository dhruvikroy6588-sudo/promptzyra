import BlogDetail from "@/components/BlogDetail";
import { seedPosts } from "@/lib/seed-posts";

export function generateStaticParams() {
  return seedPosts.map(post => ({ slug: post.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = seedPosts.find(item => item.slug === slug);
  if (!post) return { title: "Prompt not found", robots: { index: false, follow: false } };
  return { title: post.title, description: post.excerpt, keywords: post.keywords, alternates: { canonical: `https://promptzyra.com/blog/${post.slug}` }, openGraph: { title: post.title, description: post.excerpt, images: [post.thumbnail || post.image2] } };
}
export default async function BlogPage({ params }) {
  const { slug } = await params;
  return <BlogDetail slug={slug} />;
}
